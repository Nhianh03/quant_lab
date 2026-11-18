#!/usr/bin/env python3
"""Local HTTP & REST API server for Quant Research Academy (Python 3 stdlib only)."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import shutil
import sys
import threading
from urllib.parse import parse_qs, quote, unquote, urlsplit

LESSON_ID_RE = re.compile(r"[a-z0-9\-]+")
LIBRARY_ALLOWED_EXTS = {".pdf", ".md"}
MAX_POST_BYTES = 10 * 1024 * 1024  # 10 MB safety limit

PROGRESS_DICT_KEYS = (
    "completed_lessons",
    "completed_readings",
    "completed_milestones",
    "lesson_notes",
    "inline_notes",
    "ink_drawings",
    "problem_reviews",
    "problem_attempts",
    "projects",
)

STATIC_MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".pdf": "application/pdf",
}


def default_progress() -> dict:
    """Return a fresh version-1 user progress structure."""
    return {
        "version": 1,
        "last_active_lesson": "m0-01-to-hop-phep-dem-bu-tru-va-doi-xung",
        "study_days": [],
        "completed_lessons": {},
        "completed_readings": {},
        "completed_milestones": {},
        "lesson_notes": {},
        "inline_notes": {},
        "ink_drawings": {},
        "problem_reviews": {},
        "problem_attempts": {},
        "projects": {},
    }


def validate_progress_payload(payload: object) -> dict:
    """Validate incoming progress payload types and merge missing default keys."""
    if not isinstance(payload, dict):
        raise ValueError("Progress payload must be a JSON object.")

    if "version" not in payload:
        raise ValueError("Missing required integer key 'version'.")

    version = payload["version"]
    if type(version) is not int or version < 1:
        raise ValueError("Key 'version' must be a positive integer.")

    if "last_active_lesson" in payload and payload["last_active_lesson"] is not None:
        if not isinstance(payload["last_active_lesson"], str):
            raise ValueError("Key 'last_active_lesson' must be a string or null.")

    if "study_days" in payload:
        study_days = payload["study_days"]
        if not isinstance(study_days, list) or not all(isinstance(d, str) for d in study_days):
            raise ValueError("Key 'study_days' must be a list of date strings.")

    for key in PROGRESS_DICT_KEYS:
        if key in payload and not isinstance(payload[key], dict):
            raise ValueError(f"Key '{key}' must be a JSON object.")

    merged = default_progress()
    for key, value in payload.items():
        if not isinstance(key, str):
            raise ValueError("All top-level keys must be strings.")
        merged[key] = value
    return merged


def _atomic_write_json(target_path: Path, data: dict) -> None:
    """Write JSON to a sibling .tmp file, fsync, and atomically replace target_path."""
    target_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = target_path.parent / f"{target_path.name}.tmp"
    serialized = json.dumps(data, ensure_ascii=False, indent=2) + "\n"

    with open(tmp_path, "w", encoding="utf-8") as fh:
        fh.write(serialized)
        fh.flush()
        os.fsync(fh.fileno())

    os.replace(tmp_path, target_path)

    try:
        dir_fd = os.open(str(target_path.parent), os.O_RDONLY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except OSError:
        pass


def _read_validated_progress(file_path: Path) -> dict:
    raw = json.loads(file_path.read_text(encoding="utf-8"))
    return validate_progress_payload(raw)


def save_progress(base_dir: Path, payload: object) -> tuple[dict, str]:
    """Validate payload, rotate valid primary to backup, and atomically save progress.json."""
    validated = validate_progress_payload(payload)
    user_data_dir = Path(base_dir) / "user_data"
    user_data_dir.mkdir(parents=True, exist_ok=True)

    primary_path = user_data_dir / "progress.json"
    backup_path = user_data_dir / "progress.backup.json"

    if primary_path.is_file():
        try:
            _read_validated_progress(primary_path)
        except (OSError, json.JSONDecodeError, ValueError):
            # Do not clobber a healthy backup with a corrupt primary file.
            pass
        else:
            shutil.copy2(primary_path, backup_path)

    _atomic_write_json(primary_path, validated)
    saved_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    return validated, saved_at


def load_progress(base_dir: Path) -> dict:
    """Load progress.json, auto-recovering from progress.backup.json or initializing defaults."""
    user_data_dir = Path(base_dir) / "user_data"
    user_data_dir.mkdir(parents=True, exist_ok=True)

    primary_path = user_data_dir / "progress.json"
    backup_path = user_data_dir / "progress.backup.json"

    if primary_path.is_file():
        try:
            return _read_validated_progress(primary_path)
        except (OSError, json.JSONDecodeError, ValueError):
            pass

    if backup_path.is_file():
        try:
            recovered = _read_validated_progress(backup_path)
            _atomic_write_json(primary_path, recovered)
            return recovered
        except (OSError, json.JSONDecodeError, ValueError):
            pass

    fresh = default_progress()
    _atomic_write_json(primary_path, fresh)
    return fresh


class QuantHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    def __init__(self, server_address: tuple[str, int], handler_cls, base_dir: Path, quiet: bool = False):
        self.base_dir = Path(base_dir).resolve()
        self.progress_lock = threading.Lock()
        self.quiet = quiet
        super().__init__(server_address, handler_cls)


class QuantRequestHandler(BaseHTTPRequestHandler):
    server: QuantHTTPServer

    def log_message(self, fmt: str, *args) -> None:
        if not getattr(self.server, "quiet", False):
            super().log_message(fmt, *args)

    def _send_bytes(
        self,
        status: int,
        body: bytes,
        content_type: str,
        *,
        no_store: bool = False,
        head_only: bool = False,
    ) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        if no_store:
            self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if not head_only:
            try:
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError):
                return

    def _send_json(self, status: int, payload: object, *, no_store: bool = True, head_only: bool = False) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self._send_bytes(
            status,
            body,
            "application/json; charset=utf-8",
            no_store=no_store,
            head_only=head_only,
        )

    def do_HEAD(self) -> None:
        self._dispatch_get(head_only=True)

    def do_GET(self) -> None:
        self._dispatch_get(head_only=False)

    def _dispatch_get(self, *, head_only: bool) -> None:
        parsed = urlsplit(self.path)
        raw_path = parsed.path

        if raw_path == "/api/syllabus":
            self._handle_json_content_file("syllabus.json", head_only=head_only)
            return
        if raw_path == "/api/problems":
            self._handle_json_content_file("problems.json", head_only=head_only)
            return
        if raw_path == "/api/lesson":
            self._handle_lesson(parsed.query, head_only=head_only)
            return
        if raw_path == "/api/library":
            self._handle_library_list(head_only=head_only)
            return
        if raw_path == "/api/progress":
            with self.server.progress_lock:
                data = load_progress(self.server.base_dir)
            self._send_json(200, data, no_store=True, head_only=head_only)
            return
        if raw_path.startswith("/api/"):
            self._send_json(404, {"error": "Unknown API endpoint."}, no_store=True, head_only=head_only)
            return
        if raw_path == "/library" or raw_path.startswith("/library/"):
            self._handle_library_file(raw_path, head_only=head_only)
            return

        self._handle_static_web(raw_path, head_only=head_only)

    def do_POST(self) -> None:
        parsed = urlsplit(self.path)
        if parsed.path != "/api/progress":
            self._send_json(404, {"error": "Unknown API endpoint."}, no_store=True)
            return

        length_header = self.headers.get("Content-Length")
        if length_header is None:
            self._send_json(400, {"error": "Missing Content-Length header."}, no_store=True)
            return

        try:
            content_length = int(length_header)
        except ValueError:
            self._send_json(400, {"error": "Invalid Content-Length header."}, no_store=True)
            return

        if content_length < 0 or content_length > MAX_POST_BYTES:
            self._send_json(400, {"error": "Payload size out of bounds."}, no_store=True)
            return

        raw_body = self.rfile.read(content_length)
        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(400, {"error": "Invalid JSON body."}, no_store=True)
            return

        try:
            with self.server.progress_lock:
                _, saved_at = save_progress(self.server.base_dir, payload)
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)}, no_store=True)
            return

        self._send_json(200, {"ok": True, "saved_at": saved_at}, no_store=True)

    def _handle_json_content_file(self, filename: str, *, head_only: bool) -> None:
        file_path = self.server.base_dir / "content" / filename
        if not file_path.is_file():
            self._send_json(404, {"error": f"{filename} not found."}, no_store=True, head_only=head_only)
            return
        try:
            parsed_json = json.loads(file_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            self._send_json(500, {"error": f"Failed to read {filename}."}, no_store=True, head_only=head_only)
            return
        self._send_json(200, parsed_json, no_store=True, head_only=head_only)

    def _handle_lesson(self, query_string: str, *, head_only: bool) -> None:
        params = parse_qs(query_string, keep_blank_values=True)
        lesson_id = params.get("id", [""])[0]
        if not lesson_id or LESSON_ID_RE.fullmatch(lesson_id) is None:
            self._send_json(400, {"error": "Invalid lesson id."}, no_store=True, head_only=head_only)
            return

        lessons_dir = (self.server.base_dir / "content" / "lessons").resolve()
        lesson_path = (lessons_dir / f"{lesson_id}.md").resolve()
        if lesson_path.parent != lessons_dir:
            self._send_json(400, {"error": "Invalid lesson path."}, no_store=True, head_only=head_only)
            return
        if not lesson_path.is_file():
            self._send_json(404, {"error": "Lesson not found."}, no_store=True, head_only=head_only)
            return

        markdown_text = lesson_path.read_text(encoding="utf-8")
        self._send_json(
            200,
            {"id": lesson_id, "markdown": markdown_text},
            no_store=True,
            head_only=head_only,
        )

    def _handle_library_list(self, *, head_only: bool) -> None:
        library_dir = self.server.base_dir / "content" / "library"
        files = []
        if library_dir.is_dir():
            for entry in sorted(library_dir.iterdir(), key=lambda p: p.name.lower()):
                if entry.name.startswith(".") or not entry.is_file():
                    continue
                ext = entry.suffix.lower()
                if ext not in LIBRARY_ALLOWED_EXTS:
                    continue
                files.append(
                    {
                        "name": entry.name,
                        "ext": ext,
                        "size_bytes": entry.stat().st_size,
                        "url": f"/library/{quote(entry.name)}",
                    }
                )
        self._send_json(200, {"files": files}, no_store=True, head_only=head_only)

    def _handle_library_file(self, raw_path: str, *, head_only: bool) -> None:
        if not raw_path.startswith("/library/"):
            self._send_json(400, {"error": "Missing library filename."}, no_store=True, head_only=head_only)
            return

        filename = unquote(raw_path[len("/library/") :])
        if (
            not filename
            or "\x00" in filename
            or "/" in filename
            or "\\" in filename
            or filename in {".", ".."}
        ):
            self._send_json(400, {"error": "Invalid library filename."}, no_store=True, head_only=head_only)
            return

        library_dir = (self.server.base_dir / "content" / "library").resolve()
        target = (library_dir / filename).resolve()
        if target.parent != library_dir:
            self._send_json(403, {"error": "Forbidden library path."}, no_store=True, head_only=head_only)
            return

        ext = target.suffix.lower()
        if ext not in LIBRARY_ALLOWED_EXTS:
            self._send_json(403, {"error": "Unsupported library file type."}, no_store=True, head_only=head_only)
            return

        if not target.is_file():
            self._send_json(404, {"error": "Library file not found."}, no_store=True, head_only=head_only)
            return

        mime = STATIC_MIME_TYPES.get(ext, "application/octet-stream")
        self._send_bytes(200, target.read_bytes(), mime, no_store=False, head_only=head_only)

    def _handle_static_web(self, raw_path: str, *, head_only: bool) -> None:
        decoded = unquote(raw_path)
        if "\x00" in decoded or "\\" in decoded:
            self._send_bytes(400, b"Bad Request", "text/plain; charset=utf-8", head_only=head_only)
            return

        rel = "index.html" if decoded == "/" else decoded.lstrip("/")
        if ".." in Path(rel).parts:
            self._send_bytes(403, b"Forbidden", "text/plain; charset=utf-8", head_only=head_only)
            return

        web_dir = (self.server.base_dir / "web").resolve()
        target = (web_dir / rel).resolve()
        if target != web_dir and web_dir not in target.parents:
            self._send_bytes(403, b"Forbidden", "text/plain; charset=utf-8", head_only=head_only)
            return

        if target.is_dir():
            target = target / "index.html"

        if not target.is_file():
            self._send_bytes(404, b"Not Found", "text/plain; charset=utf-8", head_only=head_only)
            return

        mime = STATIC_MIME_TYPES.get(target.suffix.lower(), "application/octet-stream")
        self._send_bytes(200, target.read_bytes(), mime, no_store=False, head_only=head_only)


def create_server(
    base_dir: Path | str,
    host: str = "127.0.0.1",
    port: int = 8686,
    quiet: bool | None = None,
) -> QuantHTTPServer:
    """Instantiate a QuantHTTPServer rooted at base_dir."""
    root = Path(base_dir).resolve()
    if quiet is None:
        quiet = port == 0
    return QuantHTTPServer((host, port), QuantRequestHandler, root, quiet=quiet)


def main(argv: list[str] | None = None) -> int:
    default_base = Path(__file__).resolve().parent
    default_host = os.environ.get("HOST", "127.0.0.1")
    default_port = int(os.environ.get("PORT", "8686"))

    parser = argparse.ArgumentParser(description="Quant Research Academy Local HTTP Server")
    parser.add_argument("--host", default=default_host, help="Bind address (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=default_port, help="Bind port (default: 8686 or $PORT)")
    parser.add_argument("--base-dir", default=str(default_base), help="Application root directory")
    args = parser.parse_args(argv)

    base_dir = Path(args.base_dir).resolve()
    for subdir in ("content/lessons", "content/library", "user_data", "web"):
        (base_dir / subdir).mkdir(parents=True, exist_ok=True)

    httpd = create_server(base_dir, args.host, args.port, quiet=False)
    actual_host, actual_port = httpd.server_address[:2]
    print(
        f"Quant Research Academy server listening on http://{actual_host}:{actual_port}",
        flush=True,
    )
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Quant Research Academy server...", flush=True)
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
