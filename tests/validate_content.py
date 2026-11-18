#!/usr/bin/env python3
"""Schema, LaTeX math delimiter, and editorial deduplication validator for Quant Research Academy."""

from __future__ import annotations

import argparse
from collections import Counter
import json
from pathlib import Path
import re
import sys
from typing import Iterable

EXPECTED_MODULE_IDS = ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7"]

EXPECTED_LESSONS_BY_MODULE: dict[str, list[str]] = {
    "m0": [
        "m0-01-to-hop-phep-dem-bu-tru-va-doi-xung",
        "m0-02-bien-ngau-nhien-mgf-luat-so-lon-va-clt",
        "m0-03-khong-gian-vector-chieu-truc-giao-va-cholesky",
        "m0-04-giai-tich-da-bien-jacobian-hessian-va-lagrange",
        "m0-05-chuoi-so-phuong-trinh-sai-phan-va-tiem-can",
    ],
    "m1": [
        "m1-01-he-sinh-thai-buy-side-va-alpha",
        "m1-02-so-lenh-lob-reg-nms-va-crypto-perps",
        "m1-03-du-lieu-point-in-time-va-bay-backtest",
        "m1-04-mo-hinh-roll-glosten-milgrom-kyle-ofi",
        "m1-05-hop-dong-tuong-lai-quyen-chon-va-dong-tien-gamma",
    ],
    "m2": [
        "m2-01-khong-gian-xac-suat-bayes-va-phan-phoi",
        "m2-02-ky-vong-co-dieu-kien-va-tower-property",
        "m2-03-chuoi-markov-va-first-step-analysis",
        "m2-04-random-walk-martingale-optional-stopping",
        "m2-05-chien-thuat-brainteasers-tro-choi-va-winners-curse",
    ],
    "m3": [
        "m3-01-mle-cramer-rao-va-phan-phoi-duoi-day",
        "m3-02-hinh-hoc-ols-ridge-lasso-va-newey-west",
        "m3-03-multiple-testing-fdr-va-deflated-sharpe",
        "m3-04-kiem-dinh-cheo-chuoi-thoi-gian-purged-cv",
        "m3-05-thong-ke-ben-vung-huber-quantile-va-du-lieu-khuyet",
    ],
    "m4": [
        "m4-01-svd-pca-va-eigenportfolios",
        "m4-02-marchenko-pastur-va-ledoit-wolf-shrinkage",
        "m4-03-tinh-dung-arma-garch-va-du-bao-bien-dong",
        "m4-04-dong-lien-ket-ornstein-uhlenbeck-va-kalman",
        "m4-05-mo-hinh-var-khong-gian-trang-thai-va-hidden-markov",
    ],
    "m5": [
        "m5-01-dinh-luat-grinold-kahn-ic-ir-breadth",
        "m5-02-toi-uu-hoa-loi-danh-muc-va-phat-turnover",
        "m5-03-thuc-thi-lenh-almgren-chriss-va-kelly",
        "m5-04-hoc-may-tai-chinh-truc-giao-hoa-va-pnl-attribution",
        "m5-05-mo-hinh-rui-ro-barra-cvar-va-tham-hoa-crowding",
    ],
    "m6": [
        "m6-01-chuyen-dong-brown-martingale-va-bien-thien-bac-hai",
        "m6-02-tich-phan-ito-bo-de-ito-gbm-va-volatility-drag",
        "m6-03-feynman-kac-black-scholes-girsanov-va-greeks",
    ],
    "m7": [
        "m7-01-giai-phau-sau-ho-tin-hieu-alpha-thuc-chien",
        "m7-02-toan-tu-worldquant-trung-hoa-da-tang-va-alpha-decay",
        "m7-03-quy-trinh-whitepaper-va-chien-thuat-superday-quy-my",
    ],
}

ALLOWED_PROBLEM_DIFFICULTIES = {"Easy", "Medium", "Hard"}

EXPECTED_ALL_LESSONS: list[str] = [
    lesson_id
    for mod_id in EXPECTED_MODULE_IDS
    for lesson_id in EXPECTED_LESSONS_BY_MODULE[mod_id]
]

EXPECTED_SIMULATOR_BINDINGS: dict[str, str] = {
    "m1-04-mo-hinh-roll-glosten-milgrom-kyle-ofi": "sim-lob",
    "m2-04-random-walk-martingale-optional-stopping": "sim-martingale",
    "m4-02-marchenko-pastur-va-ledoit-wolf-shrinkage": "sim-rmt",
    "m5-01-dinh-luat-grinold-kahn-ic-ir-breadth": "sim-grinold",
}

EXPECTED_PROJECT_IDS = ["proj-1", "proj-2", "proj-3", "proj-4"]

FENCED_CODE_RE = re.compile(
    r"(?m)^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\2[ \t]*$"
)
INLINE_CODE_RE = re.compile(r"(`+)(?:(?!\1|\n\n)[\s\S])+\1")
MATH_TOKEN_RE = re.compile(r"\\.|(\$\$|\$)")
MD_LINK_TARGET_RE = re.compile(r"\]\([^)\n]*\)")
BILINGUAL_PAREN_RE = re.compile(r"\(([A-Za-z][A-Za-z\s\-/]{4,45})\)")


def _blank_preserving_newlines(match: re.Match[str]) -> str:
    return re.sub(r"[^\n]", " ", match.group(0))


def strip_code_regions(text: str) -> str:
    """Replace fenced code blocks and inline code spans with spaces while preserving line numbers."""
    without_fenced = FENCED_CODE_RE.sub(_blank_preserving_newlines, text)
    return INLINE_CODE_RE.sub(_blank_preserving_newlines, without_fenced)


def _line_number_at(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def analyze_latex_and_strip_math(text: str, context_label: str) -> tuple[int, list[str], str]:
    """
    Validate balanced $$ and inline $ outside code blocks/spans.

    Returns (display_block_count, errors, text_without_code_or_math).
    """
    code_stripped = strip_code_regions(text)
    errors: list[str] = []
    math_spans: list[tuple[int, int]] = []

    in_display = False
    display_start = 0
    in_inline = False
    inline_start = 0
    display_blocks = 0

    for match in MATH_TOKEN_RE.finditer(code_stripped):
        delim = match.group(1)
        if delim is None:
            continue

        pos = match.start()
        if delim == "$$":
            if in_inline:
                line_no = _line_number_at(code_stripped, inline_start)
                errors.append(
                    f"{context_label}: unclosed inline '$' opened at line {line_no} before '$$' at line {_line_number_at(code_stripped, pos)}."
                )
                in_inline = False
            if not in_display:
                in_display = True
                display_start = pos
            else:
                in_display = False
                display_blocks += 1
                math_spans.append((display_start, match.end()))
        elif delim == "$":
            if in_display:
                errors.append(
                    f"{context_label}: stray single '$' inside '$$' display block at line {_line_number_at(code_stripped, pos)}."
                )
            elif not in_inline:
                in_inline = True
                inline_start = pos
            else:
                segment = code_stripped[inline_start + 1 : pos]
                if "\n\n" in segment:
                    errors.append(
                        f"{context_label}: inline '$' opened at line {_line_number_at(code_stripped, inline_start)} spans across paragraph break before closing '$' at line {_line_number_at(code_stripped, pos)}."
                    )
                in_inline = False
                math_spans.append((inline_start, match.end()))

    if in_display:
        errors.append(
            f"{context_label}: unclosed display math '$$' opened at line {_line_number_at(code_stripped, display_start)}."
        )
    if in_inline:
        errors.append(
            f"{context_label}: unclosed inline math '$' opened at line {_line_number_at(code_stripped, inline_start)}."
        )

    chars = list(code_stripped)
    for start, end in math_spans:
        for idx in range(start, end):
            if chars[idx] != "\n":
                chars[idx] = " "
    math_stripped = "".join(chars)
    return display_blocks, errors, math_stripped


def _is_short_math_symbol_phrase(raw_inner: str) -> bool:
    """Exclude trivial algebraic expressions like 'a - b' or 'x / y' if written outside $...$."""
    words = [w for w in re.split(r"[\s\-/]+", raw_inner.strip()) if w]
    if not words:
        return True
    return max(len(w) for w in words) <= 2


def find_repeated_parentheticals(
    text: str,
    context_label: str,
    *,
    already_math_stripped: str | None = None,
) -> list[str]:
    """Detect repeated English parenthetical definitions (>1 occurrence in the same document)."""
    if already_math_stripped is None:
        _, _, cleaned = analyze_latex_and_strip_math(text, context_label)
    else:
        cleaned = already_math_stripped

    cleaned = MD_LINK_TARGET_RE.sub("]()", cleaned)

    occurrences: dict[str, list[tuple[str, int]]] = {}
    for match in BILINGUAL_PAREN_RE.finditer(cleaned):
        raw_term = match.group(1)
        if _is_short_math_symbol_phrase(raw_term):
            continue
        normalized = " ".join(raw_term.split()).lower()
        line_no = _line_number_at(cleaned, match.start())
        occurrences.setdefault(normalized, []).append((raw_term.strip(), line_no))

    errors: list[str] = []
    for norm_term, hits in sorted(occurrences.items()):
        if len(hits) > 1:
            sample = hits[0][0]
            lines = ", ".join(str(line) for _, line in hits)
            errors.append(
                f"{context_label}: repeated parenthetical definition '({sample})' ({len(hits)}x at lines {lines})."
            )
    return errors


def _is_non_empty_str(val: object) -> bool:
    return isinstance(val, str) and bool(val.strip())


def _register_unique_id(
    global_ids: dict[str, str],
    item_id: object,
    owner_label: str,
    errors: list[str],
) -> None:
    if not _is_non_empty_str(item_id):
        errors.append(f"{owner_label}: missing or empty 'id'.")
        return
    assert isinstance(item_id, str)
    if item_id in global_ids:
        errors.append(
            f"{owner_label}: duplicate id '{item_id}' (already used by {global_ids[item_id]})."
        )
    else:
        global_ids[item_id] = owner_label


def _collect_json_prose_strings(node: object, skip_keys: set[str] | None = None) -> list[str]:
    skip = skip_keys or set()
    collected: list[str] = []
    if isinstance(node, dict):
        for k, v in node.items():
            if k in skip:
                continue
            collected.extend(_collect_json_prose_strings(v, skip))
    elif isinstance(node, list):
        for item in node:
            collected.extend(_collect_json_prose_strings(item, skip))
    elif isinstance(node, str):
        collected.append(node)
    return collected


def validate_syllabus_and_library(base_dir: Path) -> list[str]:
    """Validate content/syllabus.json and content/library/READING_GUIDE.md."""
    errors: list[str] = []
    syllabus_path = base_dir / "content" / "syllabus.json"
    if not syllabus_path.is_file():
        errors.append(f"Missing required file: {syllabus_path}")
        return errors

    try:
        syllabus = json.loads(syllabus_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"Invalid JSON in {syllabus_path}: {exc}")
        return errors

    if not isinstance(syllabus, dict):
        errors.append("syllabus.json root must be a JSON object.")
        return errors

    for str_key in ("program_title", "subtitle"):
        if not _is_non_empty_str(syllabus.get(str_key)):
            errors.append(f"syllabus.json: '{str_key}' must be a non-empty string.")

    if syllabus.get("target_horizon_months") != 24:
        errors.append(
            f"syllabus.json: 'target_horizon_months' must be 24 (got {syllabus.get('target_horizon_months')!r})."
        )

    global_ids: dict[str, str] = {}

    # 1. Validate semesters (4)
    semesters = syllabus.get("semesters")
    semester_ids: list[str] = []
    if not isinstance(semesters, list) or len(semesters) != 4:
        errors.append(
            f"syllabus.json: 'semesters' must be a list of 4 objects (got {len(semesters) if isinstance(semesters, list) else type(semesters).__name__})."
        )
    else:
        for idx, sem in enumerate(semesters, start=1):
            ctx = f"semesters[{idx - 1}]"
            if not isinstance(sem, dict):
                errors.append(f"{ctx}: must be an object.")
                continue
            _register_unique_id(global_ids, sem.get("id"), ctx, errors)
            if _is_non_empty_str(sem.get("id")):
                semester_ids.append(sem["id"])
            for req_str in ("title", "months", "goal"):
                if not _is_non_empty_str(sem.get(req_str)):
                    errors.append(f"{ctx}: '{req_str}' must be a non-empty string.")
            for list_key in ("module_ids", "project_ids"):
                val = sem.get(list_key)
                if not isinstance(val, list) or not val or not all(_is_non_empty_str(x) for x in val):
                    errors.append(f"{ctx}: '{list_key}' must be a non-empty list of strings.")
            milestones = sem.get("hiring_milestones")
            if not isinstance(milestones, list) or len(milestones) < 3:
                errors.append(f"{ctx}: 'hiring_milestones' must contain at least 3 items.")
            else:
                for m_idx, ms in enumerate(milestones):
                    m_ctx = f"{ctx}.hiring_milestones[{m_idx}]"
                    if not isinstance(ms, dict):
                        errors.append(f"{m_ctx}: must be an object.")
                        continue
                    _register_unique_id(global_ids, ms.get("id"), m_ctx, errors)
                    for m_key in ("title", "detail"):
                        if not _is_non_empty_str(ms.get(m_key)):
                            errors.append(f"{m_ctx}: '{m_key}' must be a non-empty string.")

    # 2. Validate modules (8) and lessons (36)
    modules = syllabus.get("modules")
    seen_lesson_ids: list[str] = []
    modern_2022_plus_count = 0
    if not isinstance(modules, list) or len(modules) != 8:
        errors.append(
            f"syllabus.json: 'modules' must be a list of 8 objects (got {len(modules) if isinstance(modules, list) else type(modules).__name__})."
        )
    else:
        actual_mod_ids = [m.get("id") for m in modules if isinstance(m, dict)]
        if actual_mod_ids != EXPECTED_MODULE_IDS:
            errors.append(
                f"syllabus.json: module IDs must be {EXPECTED_MODULE_IDS}, got {actual_mod_ids}."
            )
        for m_idx, mod in enumerate(modules):
            m_ctx = f"modules[{m_idx}]"
            if not isinstance(mod, dict):
                errors.append(f"{m_ctx}: must be an object.")
                continue
            mod_id = mod.get("id")
            _register_unique_id(global_ids, mod_id, m_ctx, errors)
            for m_str in ("code", "title", "summary"):
                if not _is_non_empty_str(mod.get(m_str)):
                    errors.append(f"{m_ctx}: '{m_str}' must be a non-empty string.")

            expected_for_mod = EXPECTED_LESSONS_BY_MODULE.get(str(mod_id), [])
            expected_len = len(expected_for_mod) if expected_for_mod else 5
            lessons = mod.get("lessons")
            if not isinstance(lessons, list) or len(lessons) != expected_len:
                errors.append(f"{m_ctx}: 'lessons' must be a list of {expected_len} lesson objects.")
                continue

            actual_for_mod = [les.get("id") for les in lessons if isinstance(les, dict)]
            if expected_for_mod and actual_for_mod != expected_for_mod:
                errors.append(
                    f"{m_ctx} ({mod_id}): lesson IDs must match {expected_for_mod}, got {actual_for_mod}."
                )

            for l_idx, lesson in enumerate(lessons):
                l_ctx = f"{m_ctx}.lessons[{l_idx}]"
                if not isinstance(lesson, dict):
                    errors.append(f"{l_ctx}: must be an object.")
                    continue
                lid = lesson.get("id")
                _register_unique_id(global_ids, lid, l_ctx, errors)
                if _is_non_empty_str(lid):
                    seen_lesson_ids.append(lid)

                for l_str in ("code", "title", "summary"):
                    if not _is_non_empty_str(lesson.get(l_str)):
                        errors.append(f"{l_ctx}: '{l_str}' must be a non-empty string.")

                est_hours = lesson.get("estimated_hours")
                if not isinstance(est_hours, (int, float)) or isinstance(est_hours, bool) or est_hours <= 0:
                    errors.append(f"{l_ctx}: 'estimated_hours' must be a positive number.")

                expected_sim = EXPECTED_SIMULATOR_BINDINGS.get(str(lid))
                actual_sim = lesson.get("simulator_id")
                if actual_sim != expected_sim:
                    errors.append(
                        f"{l_ctx} ({lid}): 'simulator_id' must be {expected_sim!r}, got {actual_sim!r}."
                    )

                readings = lesson.get("readings")
                if not isinstance(readings, list) or len(readings) != 3:
                    errors.append(f"{l_ctx} ({lid}): must have exactly 3 'readings'.")
                else:
                    lesson_modern_count = 0
                    for r_idx, reading in enumerate(readings):
                        r_ctx = f"{l_ctx}.readings[{r_idx}]"
                        if not isinstance(reading, dict):
                            errors.append(f"{r_ctx}: must be an object.")
                            continue
                        _register_unique_id(global_ids, reading.get("id"), r_ctx, errors)
                        for r_str in ("source", "chapter", "url", "note"):
                            if not _is_non_empty_str(reading.get(r_str)):
                                errors.append(f"{r_ctx}: '{r_str}' must be a non-empty string.")
                        raw_url = str(reading.get("url") or "").strip()
                        if not raw_url.startswith("https://"):
                            errors.append(
                                f"{r_ctx} ({lid}): reading 'url' must be a direct 'https://' external link, got {raw_url!r}."
                            )
                        raw_source = str(reading.get("source") or "")
                        years = [int(y) for y in re.findall(r"\b(19\d{2}|20\d{2})\b", raw_source)]
                        if not years:
                            errors.append(
                                f"{r_ctx} ({lid}): reading 'source' must include a 4-digit publication year."
                            )
                        else:
                            latest_year = max(years)
                            if latest_year >= 2021:
                                lesson_modern_count += 1
                            if latest_year >= 2022:
                                modern_2022_plus_count += 1
                    if lesson_modern_count < 2:
                        errors.append(
                            f"{l_ctx} ({lid}): must include at least 2 modern readings (2021+), got {lesson_modern_count}."
                        )

    if modern_2022_plus_count < 68:
        errors.append(
            f"syllabus.json: must include at least 68 readings published in 2022-2026 across all 108 readings, got {modern_2022_plus_count}."
        )

    if seen_lesson_ids != EXPECTED_ALL_LESSONS:
        errors.append(
            f"syllabus.json: exact 36 lesson IDs mismatch.\n  Expected: {EXPECTED_ALL_LESSONS}\n  Actual:   {seen_lesson_ids}"
        )

    # 3. Validate projects (4)
    projects = syllabus.get("projects")
    if not isinstance(projects, list) or len(projects) != 4:
        errors.append(
            f"syllabus.json: 'projects' must be a list of 4 objects (got {len(projects) if isinstance(projects, list) else type(projects).__name__})."
        )
    else:
        actual_proj_ids = [p.get("id") for p in projects if isinstance(p, dict)]
        if actual_proj_ids != EXPECTED_PROJECT_IDS:
            errors.append(
                f"syllabus.json: project IDs must be {EXPECTED_PROJECT_IDS}, got {actual_proj_ids}."
            )
        for p_idx, proj in enumerate(projects):
            p_ctx = f"projects[{p_idx}]"
            if not isinstance(proj, dict):
                errors.append(f"{p_ctx}: must be an object.")
                continue
            _register_unique_id(global_ids, proj.get("id"), p_ctx, errors)
            sem_ref = proj.get("semester_id")
            if not _is_non_empty_str(sem_ref) or (semester_ids and sem_ref not in semester_ids):
                errors.append(
                    f"{p_ctx}: 'semester_id' ({sem_ref!r}) must reference a valid semester id in {semester_ids}."
                )
            for p_str in ("code", "title", "dataset_guide", "math_formulation"):
                if not _is_non_empty_str(proj.get(p_str)):
                    errors.append(f"{p_ctx}: '{p_str}' must be a non-empty string.")

            tf = proj.get("target_firms")
            valid_tf = _is_non_empty_str(tf) or (
                isinstance(tf, list) and len(tf) > 0 and all(_is_non_empty_str(x) for x in tf)
            )
            if not valid_tf:
                errors.append(f"{p_ctx}: 'target_firms' must be a non-empty list of firm names (or string).")

            tasks = proj.get("tasks")
            if not isinstance(tasks, list) or len(tasks) < 6:
                errors.append(f"{p_ctx}: 'tasks' must contain at least 6 items.")
            else:
                for t_idx, task in enumerate(tasks):
                    t_ctx = f"{p_ctx}.tasks[{t_idx}]"
                    if not isinstance(task, dict):
                        errors.append(f"{t_ctx}: must be an object.")
                        continue
                    _register_unique_id(global_ids, task.get("id"), t_ctx, errors)
                    if not _is_non_empty_str(task.get("text")):
                        errors.append(f"{t_ctx}: 'text' must be a non-empty string.")

            audits = proj.get("anti_bias_audits")
            if not isinstance(audits, list) or len(audits) != 10:
                errors.append(
                    f"{p_ctx}: 'anti_bias_audits' must contain exactly 10 items (got {len(audits) if isinstance(audits, list) else type(audits).__name__})."
                )
            else:
                for a_idx, audit in enumerate(audits):
                    a_ctx = f"{p_ctx}.anti_bias_audits[{a_idx}]"
                    if not isinstance(audit, dict):
                        errors.append(f"{a_ctx}: must be an object.")
                        continue
                    _register_unique_id(global_ids, audit.get("id"), a_ctx, errors)
                    if not _is_non_empty_str(audit.get("text")):
                        errors.append(f"{a_ctx}: 'text' must be a non-empty string.")

    # Cross-check semester module_ids and project_ids references
    if isinstance(semesters, list):
        covered_mods: set[str] = set()
        covered_projs: set[str] = set()
        for idx, sem in enumerate(semesters):
            if not isinstance(sem, dict):
                continue
            for mid in sem.get("module_ids", []) if isinstance(sem.get("module_ids"), list) else []:
                if mid not in EXPECTED_MODULE_IDS:
                    errors.append(f"semesters[{idx}]: unknown module_id '{mid}'.")
                covered_mods.add(mid)
            for pid in sem.get("project_ids", []) if isinstance(sem.get("project_ids"), list) else []:
                if pid not in EXPECTED_PROJECT_IDS:
                    errors.append(f"semesters[{idx}]: unknown project_id '{pid}'.")
                covered_projs.add(pid)
        if covered_mods != set(EXPECTED_MODULE_IDS):
            errors.append(
                f"syllabus.json: semesters must cover all modules {EXPECTED_MODULE_IDS}, covered {sorted(covered_mods)}."
            )
        if covered_projs != set(EXPECTED_PROJECT_IDS):
            errors.append(
                f"syllabus.json: semesters must cover all projects {EXPECTED_PROJECT_IDS}, covered {sorted(covered_projs)}."
            )

    # Validate LaTeX balance and editorial deduplication across syllabus.json prose strings
    prose_strings = _collect_json_prose_strings(
        syllabus,
        skip_keys={"id", "semester_id", "module_ids", "project_ids", "simulator_id", "url", "code"},
    )
    combined_syllabus_prose = "\n\n".join(prose_strings)
    _, latex_errs, stripped_syllabus = analyze_latex_and_strip_math(
        combined_syllabus_prose, "syllabus.json"
    )
    errors.extend(latex_errs)
    errors.extend(
        find_repeated_parentheticals(
            combined_syllabus_prose,
            "syllabus.json",
            already_math_stripped=stripped_syllabus,
        )
    )

    # 4. Validate content/library/READING_GUIDE.md
    guide_path = base_dir / "content" / "library" / "READING_GUIDE.md"
    if not guide_path.is_file():
        errors.append(f"Missing required file: {guide_path}")
    else:
        guide_text = guide_path.read_text(encoding="utf-8")
        if not guide_text.strip():
            errors.append("READING_GUIDE.md must not be empty.")
        else:
            _, guide_latex_errs, guide_stripped = analyze_latex_and_strip_math(
                guide_text, "READING_GUIDE.md"
            )
            errors.extend(guide_latex_errs)
            errors.extend(
                find_repeated_parentheticals(
                    guide_text,
                    "READING_GUIDE.md",
                    already_math_stripped=guide_stripped,
                )
            )
            guide_modern_hits = re.findall(r"\b(202[2-6])\b", guide_text)
            if len(guide_modern_hits) < 12:
                errors.append(
                    f"READING_GUIDE.md: must highlight at least 12 modern (2022-2026) publication references, got {len(guide_modern_hits)}."
                )

    return errors


def _resolve_lesson_ids_for_prefixes(base_dir: Path, prefixes: Iterable[str]) -> tuple[list[str], list[str]]:
    """Resolve module prefixes (e.g. 'm1', 'm2') or lesson slugs into target lesson IDs."""
    errors: list[str] = []
    lessons_dir = base_dir / "content" / "lessons"
    ordered_ids: list[str] = []
    seen: set[str] = set()

    for raw_prefix in prefixes:
        prefix = raw_prefix.strip().lower()
        if not prefix:
            continue
        matched: list[str] = []
        if prefix in EXPECTED_LESSONS_BY_MODULE:
            matched.extend(EXPECTED_LESSONS_BY_MODULE[prefix])
            if lessons_dir.is_dir():
                for md_file in sorted(lessons_dir.glob(f"{prefix}-*.md")):
                    matched.append(md_file.stem)
        else:
            candidate_slugs = [lid for lid in EXPECTED_ALL_LESSONS if lid == prefix or lid.startswith(f"{prefix}-")]
            matched.extend(candidate_slugs)
            if lessons_dir.is_dir():
                for md_file in sorted(lessons_dir.glob(f"{prefix}*.md")):
                    matched.append(md_file.stem)

        if not matched:
            errors.append(f"Unknown module prefix or lesson selector: '{raw_prefix}'.")
        for lid in matched:
            if lid not in seen:
                seen.add(lid)
                ordered_ids.append(lid)

    return ordered_ids, errors


def validate_lesson_file(lesson_path: Path) -> list[str]:
    """Validate a single Markdown lesson file for length, display equations, balanced LaTeX, and deduplication."""
    label = f"lessons/{lesson_path.name}"
    if not lesson_path.is_file():
        return [f"Missing lesson file: {lesson_path}"]

    text = lesson_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    errors: list[str] = []

    if len(lines) < 150:
        errors.append(f"{label}: expected >= 150 lines, found {len(lines)} lines.")

    display_blocks, latex_errors, math_stripped = analyze_latex_and_strip_math(text, label)
    errors.extend(latex_errors)
    if display_blocks < 3:
        errors.append(
            f"{label}: expected >= 3 display math '$$' blocks, found {display_blocks}."
        )

    errors.extend(
        find_repeated_parentheticals(
            text,
            label,
            already_math_stripped=math_stripped,
        )
    )
    return errors


def validate_lessons(base_dir: Path, prefixes: Iterable[str]) -> tuple[int, list[str]]:
    """Validate all lesson files matching the requested module prefixes."""
    lesson_ids, errors = _resolve_lesson_ids_for_prefixes(base_dir, prefixes)
    lessons_dir = base_dir / "content" / "lessons"
    for lid in lesson_ids:
        errors.extend(validate_lesson_file(lessons_dir / f"{lid}.md"))
    return len(lesson_ids), errors


def validate_problems(base_dir: Path) -> list[str]:
    """Validate content/problems.json (>=120 problems, >=15 per module m0..m7, schema & balanced LaTeX)."""
    errors: list[str] = []
    problems_path = base_dir / "content" / "problems.json"
    if not problems_path.is_file():
        return [f"Missing required file: {problems_path}"]

    try:
        raw = json.loads(problems_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"Invalid JSON in {problems_path}: {exc}"]

    if isinstance(raw, dict) and isinstance(raw.get("problems"), list):
        problems = raw["problems"]
    elif isinstance(raw, list):
        problems = raw
    else:
        return ["problems.json must be a JSON object with a 'problems' array (or a top-level array)."]

    if len(problems) < 120:
        errors.append(f"problems.json: expected >= 120 problems, found {len(problems)}.")

    seen_ids: set[str] = set()
    per_module_counts: Counter[str] = Counter()

    for idx, prob in enumerate(problems):
        p_ctx = f"problems[{idx}]"
        if not isinstance(prob, dict):
            errors.append(f"{p_ctx}: must be a JSON object.")
            continue

        pid = prob.get("id")
        if not _is_non_empty_str(pid):
            errors.append(f"{p_ctx}: missing or empty 'id'.")
        else:
            assert isinstance(pid, str)
            if pid in seen_ids:
                errors.append(f"{p_ctx}: duplicate problem id '{pid}'.")
            seen_ids.add(pid)
            p_ctx = f"problems[{idx}] ({pid})"

        mod_id = prob.get("module_id")
        if mod_id not in EXPECTED_MODULE_IDS:
            errors.append(
                f"{p_ctx}: 'module_id' must be one of {EXPECTED_MODULE_IDS}, got {mod_id!r}."
            )
        else:
            per_module_counts[mod_id] += 1

        for str_field in ("difficulty", "title", "prompt", "solution"):
            if not _is_non_empty_str(prob.get(str_field)):
                errors.append(f"{p_ctx}: '{str_field}' must be a non-empty string.")

        diff_val = prob.get("difficulty")
        if _is_non_empty_str(diff_val) and diff_val not in ALLOWED_PROBLEM_DIFFICULTIES:
            errors.append(
                f"{p_ctx}: 'difficulty' must be one of {sorted(ALLOWED_PROBLEM_DIFFICULTIES)}, got {diff_val!r}."
            )

        title_val = prob.get("title")
        if isinstance(title_val, str) and "$" in title_val:
            errors.append(f"{p_ctx}: 'title' must not contain '$'.")

        firms = prob.get("firms")
        valid_firms = _is_non_empty_str(firms) or (
            isinstance(firms, list) and len(firms) > 0 and all(_is_non_empty_str(f) for f in firms)
        )
        if not valid_firms:
            errors.append(f"{p_ctx}: 'firms' must be a non-empty list of strings (or non-empty string).")

        hints = prob.get("hints")
        if not isinstance(hints, list) or len(hints) < 2 or not all(_is_non_empty_str(h) for h in hints):
            errors.append(f"{p_ctx}: 'hints' must be a list of at least 2 non-empty strings.")

        ans_chk = prob.get("answer_check")
        if not isinstance(ans_chk, dict):
            errors.append(f"{p_ctx}: missing required 'answer_check' object.")
        else:
            for ak in ("label", "display"):
                aval = ans_chk.get(ak)
                if not _is_non_empty_str(aval):
                    errors.append(f"{p_ctx}.answer_check.{ak}: must be a non-empty string.")
                elif isinstance(aval, str) and "$" in aval:
                    errors.append(f"{p_ctx}.answer_check.{ak}: must be plain text without LaTeX '$'.")
            unit_val = ans_chk.get("unit")
            if unit_val not in {"number", "percent", "prob"}:
                errors.append(
                    f"{p_ctx}.answer_check.unit: must be one of ('number', 'percent', 'prob'), got {unit_val!r}."
                )
            target_val = ans_chk.get("target")
            if isinstance(target_val, bool) or not isinstance(target_val, (int, float)):
                errors.append(f"{p_ctx}.answer_check.target: must be a finite number.")
            tol_val = ans_chk.get("tolerance")
            if isinstance(tol_val, bool) or not isinstance(tol_val, (int, float)) or tol_val <= 0:
                errors.append(f"{p_ctx}.answer_check.tolerance: must be a positive number.")

        # Validate balanced LaTeX across problem text fields
        latex_chunks: list[tuple[str, str]] = []
        for field_name in ("title", "prompt", "solution"):
            val = prob.get(field_name)
            if isinstance(val, str):
                latex_chunks.append((f"{p_ctx}.{field_name}", val))
        if isinstance(hints, list):
            for h_idx, h_val in enumerate(hints):
                if isinstance(h_val, str):
                    latex_chunks.append((f"{p_ctx}.hints[{h_idx}]", h_val))

        for chunk_label, chunk_text in latex_chunks:
            _, l_errs, _ = analyze_latex_and_strip_math(chunk_text, chunk_label)
            errors.extend(l_errs)

    for mod_id in EXPECTED_MODULE_IDS:
        count = per_module_counts[mod_id]
        if count < 15:
            errors.append(
                f"problems.json: module '{mod_id}' must have >= 15 problems, found {count}."
            )

    return errors


def main(argv: list[str] | None = None) -> int:
    default_base = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(
        description="Validate Quant Research Academy syllabus, lessons, library guide, and problem bank."
    )
    parser.add_argument(
        "--phase",
        choices=("syllabus", "full"),
        help="Validation phase to run ('syllabus' or 'full').",
    )
    parser.add_argument(
        "--lessons",
        nargs="+",
        metavar="MODULE_PREFIX",
        help="Validate lesson Markdown files for given module prefixes (e.g. m1 m2).",
    )
    parser.add_argument(
        "--base-dir",
        default=str(default_base),
        help="Root directory of quant-research-app.",
    )
    args = parser.parse_args(argv)

    base_dir = Path(args.base_dir).resolve()
    phase = args.phase
    lesson_prefixes = args.lessons

    if phase is None and not lesson_prefixes:
        phase = "full"

    all_errors: list[str] = []

    if phase == "syllabus":
        all_errors.extend(validate_syllabus_and_library(base_dir))
        if lesson_prefixes:
            _, lesson_errs = validate_lessons(base_dir, lesson_prefixes)
            all_errors.extend(lesson_errs)
        if all_errors:
            print("SYLLABUS VALIDATION FAILED:", file=sys.stderr)
            for err in all_errors:
                print(f"  - {err}", file=sys.stderr)
            return 1
        print("SYLLABUS VALIDATION PASSED")
        return 0

    if phase == "full":
        all_errors.extend(validate_syllabus_and_library(base_dir))
        extra_prefixes = list(EXPECTED_MODULE_IDS)
        syllabus_path = base_dir / "content" / "syllabus.json"
        if syllabus_path.is_file():
            try:
                syl_data = json.loads(syllabus_path.read_text(encoding="utf-8"))
                for mod in syl_data.get("modules", []):
                    if isinstance(mod, dict):
                        for les in mod.get("lessons", []):
                            if isinstance(les, dict) and _is_non_empty_str(les.get("id")):
                                if les["id"] not in extra_prefixes:
                                    extra_prefixes.append(les["id"])
            except (OSError, json.JSONDecodeError):
                pass
        _, lesson_errs = validate_lessons(base_dir, extra_prefixes)
        all_errors.extend(lesson_errs)
        all_errors.extend(validate_problems(base_dir))
        if all_errors:
            print("FULL CONTENT VALIDATION FAILED:", file=sys.stderr)
            for err in all_errors:
                print(f"  - {err}", file=sys.stderr)
            return 1
        print("FULL CONTENT VALIDATION PASSED")
        return 0

    # --lessons only mode
    assert lesson_prefixes is not None
    checked_count, lesson_errs = validate_lessons(base_dir, lesson_prefixes)
    all_errors.extend(lesson_errs)
    if all_errors:
        print("LESSONS VALIDATION FAILED:", file=sys.stderr)
        for err in all_errors:
            print(f"  - {err}", file=sys.stderr)
        return 1
    print(f"LESSONS VALIDATION PASSED ({checked_count} lessons)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
