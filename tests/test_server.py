import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from server import QuantRequestHandler, create_server, default_progress


class QuantServerTestCase(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name)
        (self.base / "content" / "lessons").mkdir(parents=True)
        (self.base / "content" / "library").mkdir(parents=True)
        (self.base / "user_data").mkdir(parents=True)
        (self.base / "web" / "js").mkdir(parents=True)

        (self.base / "web" / "index.html").write_text("<h1>Quant</h1>", encoding="utf-8")
        (self.base / "web" / "styles.css").write_text("body { font-size: 15.5px; }", encoding="utf-8")
        (self.base / "web" / "js" / "app.js").write_text("export const ready = true;", encoding="utf-8")
        (self.base / "web" / "js" / "helper.mjs").write_text("export const x = 1;", encoding="utf-8")
        (self.base / "content" / "syllabus.json").write_text(
            json.dumps({"semesters": [], "modules": [], "projects": []}), encoding="utf-8"
        )
        (self.base / "content" / "problems.json").write_text(
            json.dumps({"problems": []}), encoding="utf-8"
        )
        (self.base / "content" / "lessons" / "m1-01-test.md").write_text(
            "# Bài 1\n$$E[X] = \\mu$$", encoding="utf-8"
        )
        (self.base / "content" / "library" / "stat110.pdf").write_bytes(b"%PDF-1.4 mock")

        self.httpd = create_server(self.base, "127.0.0.1", 0)
        self.port = self.httpd.server_address[1]
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.tmp.cleanup()

    def _get(self, path):
        with urllib.request.urlopen(f"http://127.0.0.1:{self.port}{path}") as r:
            return r.status, json.loads(r.read().decode("utf-8"))

    def _post(self, path, payload):
        req = urllib.request.Request(
            f"http://127.0.0.1:{self.port}{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode("utf-8"))

    def test_default_progress_created_and_persisted_with_backup(self):
        status, data = self._get("/api/progress")
        self.assertEqual(status, 200)
        self.assertEqual(data["version"], 1)

        data["lesson_notes"]["m1-01-test"] = "Ghi chú Martingale"
        status, resp = self._post("/api/progress", data)
        self.assertEqual(status, 200)
        self.assertTrue(resp["ok"])
        self.assertIn("saved_at", resp)

        data["completed_lessons"]["m1-01-test"] = True
        self._post("/api/progress", data)
        self.assertTrue((self.base / "user_data" / "progress.backup.json").exists())

        # Corrupt primary progress.json and verify automatic backup recovery
        (self.base / "user_data" / "progress.json").write_text("{broken json", encoding="utf-8")
        status, recovered = self._get("/api/progress")
        self.assertEqual(status, 200)
        self.assertEqual(recovered["lesson_notes"]["m1-01-test"], "Ghi chú Martingale")

    def test_lesson_endpoint_and_traversal_block(self):
        status, lesson = self._get("/api/lesson?id=m1-01-test")
        self.assertEqual(status, 200)
        self.assertEqual(lesson["id"], "m1-01-test")
        self.assertIn("E[X]", lesson["markdown"])

        with self.assertRaises(urllib.error.HTTPError) as ctx:
            self._get("/api/lesson?id=../../etc/passwd")
        self.assertEqual(ctx.exception.code, 400)
        ctx.exception.close()

        with self.assertRaises(urllib.error.HTTPError) as ctx_missing:
            self._get("/api/lesson?id=m1-99-missing")
        self.assertEqual(ctx_missing.exception.code, 404)
        ctx_missing.exception.close()

    def test_library_listing_and_pdf_serving(self):
        status, lib = self._get("/api/library")
        self.assertEqual(status, 200)
        self.assertEqual(len(lib["files"]), 1)
        self.assertEqual(lib["files"][0]["name"], "stat110.pdf")
        self.assertEqual(lib["files"][0]["ext"], ".pdf")
        self.assertEqual(lib["files"][0]["url"], "/library/stat110.pdf")

        with urllib.request.urlopen(f"http://127.0.0.1:{self.port}/library/stat110.pdf") as r:
            self.assertEqual(r.status, 200)
            self.assertEqual(r.headers.get_content_type(), "application/pdf")
            self.assertTrue(r.read().startswith(b"%PDF-1.4"))

        for bad_path in ("/library/..%2Fsyllabus.json", "/library/..", "/library/sub%2Fdoc.pdf"):
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                urllib.request.urlopen(f"http://127.0.0.1:{self.port}{bad_path}")
            self.assertIn(ctx.exception.code, (400, 403))
            ctx.exception.close()

    def test_api_cache_headers_and_syllabus_problems(self):
        for endpoint in ("/api/syllabus", "/api/problems", "/api/progress", "/api/library"):
            with urllib.request.urlopen(f"http://127.0.0.1:{self.port}{endpoint}") as r:
                self.assertEqual(r.status, 200)
                self.assertEqual(r.headers.get("Cache-Control"), "no-store")
                self.assertEqual(r.headers.get_content_type(), "application/json")

    def test_static_files_mime_types_and_traversal_guard(self):
        checks = [
            ("/", "text/html", "<h1>Quant</h1>"),
            ("/styles.css", "text/css", "15.5px"),
            ("/js/app.js", "application/javascript", "export const ready"),
            ("/js/helper.mjs", "application/javascript", "export const x"),
        ]
        for path, expected_mime, expected_snippet in checks:
            with urllib.request.urlopen(f"http://127.0.0.1:{self.port}{path}") as r:
                self.assertEqual(r.status, 200)
                self.assertEqual(r.headers.get_content_type(), expected_mime)
                self.assertEqual(r.headers.get_content_charset(), "utf-8")
                self.assertIn(expected_snippet, r.read().decode("utf-8"))

        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(f"http://127.0.0.1:{self.port}/..%2Fcontent%2Fsyllabus.json")
        self.assertIn(ctx.exception.code, (400, 403, 404))
        ctx.exception.close()

    def test_progress_validation_rejects_invalid_schema(self):
        invalid_payloads = [
            ["not", "a", "dict"],
            {"no_version": True},
            {"version": "1", "completed_lessons": {}, "lesson_notes": {}},
            {"version": 1, "completed_lessons": ["wrong-type"], "lesson_notes": {}},
            {"version": 1, "completed_lessons": {}, "study_days": "2026-11-16"},
        ]
        for bad in invalid_payloads:
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                self._post("/api/progress", bad)
            self.assertEqual(ctx.exception.code, 400)
            ctx.exception.close()

        schema = default_progress()
        self.assertEqual(schema["version"], 1)
        self.assertIsInstance(schema["completed_lessons"], dict)
        self.assertIsInstance(schema["lesson_notes"], dict)
        self.assertIsInstance(schema["problem_reviews"], dict)
        self.assertIsInstance(schema["projects"], dict)

    def test_send_bytes_silences_client_disconnect(self):
        for exc_cls in (BrokenPipeError, ConnectionResetError):
            class DummyWFile:
                def write(self, _data):
                    raise exc_cls("Client disconnected mid-stream")

            dummy = QuantRequestHandler.__new__(QuantRequestHandler)
            dummy.send_response = lambda _code: None
            dummy.send_header = lambda _k, _v: None
            dummy.end_headers = lambda: None
            dummy.wfile = DummyWFile()
            QuantRequestHandler._send_bytes(dummy, 200, b"payload", "text/plain; charset=utf-8")


if __name__ == "__main__":
    unittest.main()
