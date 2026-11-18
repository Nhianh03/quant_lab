/**
 * Quant Research Academy — Main Single-Page Learning Application
 *
 * Workspaces:
 *  1. #roadmap          — 24-Month Curriculum, Semesters, Modules & Hiring Milestones
 *  2. #lesson/<id>      — Scholarly Reader, Interactive Canvas Simulators & 50/50 Split View
 *  3. #problems         — Wall Street Quant Interview Drill with Progressive Hints & Auto-Check
 *  4. #projects/<id>    — Capstone Research Lab & 10-Point Anti-Bias Backtest Audit
 */

import { checkProblemAnswer } from './answer_checker.js';
import {
  deleteInlineNote,
  mountInlineNotesInContainer,
  normalizeInlineNotesMap,
  upsertInlineNote,
} from './inline_notes.js';
import { getTodayIso } from './spaced_repetition.js';
import { escapeHtml, renderMarkdownWithMath } from './markdown_math.js';
import { mountSimulator } from './simulators.js';

const DEFAULT_LESSON_ID = 'm0-01-to-hop-phep-dem-bu-tru-va-doi-xung';
const DEFAULT_PROJECT_ID = 'proj-1';
const LOCAL_DRAFT_KEY = 'qra_progress_draft_v1';
const LOCAL_DIRTY_KEY = 'qra_progress_dirty_v1';
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const MODULE_SHORT_LABELS = {
  m0: 'Toán Đại học Nền tảng',
  m1: 'Vi cấu trúc & Phái sinh',
  m2: 'Xác suất & Martingale',
  m3: 'Thống kê & Kinh tế lượng',
  m4: 'Ma trận & Chuỗi thời gian',
  m5: 'Danh mục, Barra & Thực thi',
  m6: 'Giải tích Ngẫu nhiên & PDE',
  m7: 'Thiết kế Alpha & Superday',
};

function isPlainObject(val) {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Create a clean default project record strictly compatible with server.py.
 */
export function createDefaultProjectState() {
  return {
    checked_tasks: {},
    checked_audits: {},
    repo_url: '',
    whitepaper_path: '',
    metrics: {
      sharpe: '',
      ic: '',
      turnover: '',
      max_dd: '',
    },
    reflection: '',
  };
}

/**
 * Create a fresh version-1 user progress object matching server.py's default_progress().
 */
export function createDefaultProgress() {
  return {
    version: 1,
    last_active_lesson: DEFAULT_LESSON_ID,
    study_days: [],
    completed_lessons: {},
    completed_readings: {},
    completed_milestones: {},
    lesson_notes: {},
    inline_notes: {},
    problem_reviews: {},
    problem_attempts: {},
    projects: {},
  };
}

function normalizeBooleanMap(obj) {
  const out = {};
  if (!isPlainObject(obj)) return out;
  for (const [k, v] of Object.entries(obj)) {
    if (k && Boolean(v)) {
      out[String(k)] = true;
    }
  }
  return out;
}

function normalizeProjectEntry(rawProj) {
  const base = createDefaultProjectState();
  if (!isPlainObject(rawProj)) return base;

  base.checked_tasks = normalizeBooleanMap(rawProj.checked_tasks);
  base.checked_audits = normalizeBooleanMap(rawProj.checked_audits);
  base.repo_url = typeof rawProj.repo_url === 'string' ? rawProj.repo_url : '';
  base.whitepaper_path = typeof rawProj.whitepaper_path === 'string' ? rawProj.whitepaper_path : '';
  base.reflection = typeof rawProj.reflection === 'string' ? rawProj.reflection : '';

  if (isPlainObject(rawProj.metrics)) {
    for (const mKey of ['sharpe', 'ic', 'turnover', 'max_dd']) {
      const mVal = rawProj.metrics[mKey];
      base.metrics[mKey] = mVal === undefined || mVal === null ? '' : String(mVal);
    }
  }
  return base;
}

/**
 * Validate and normalize an incoming progress JSON object (from API, localStorage, or user backup)
 * so every POST /api/progress call conforms 100% to server.py's validate_progress_payload().
 *
 * @param {unknown} raw
 * @returns {object}
 */
export function normalizeProgressPayload(raw) {
  if (!isPlainObject(raw)) {
    throw new Error('Dữ liệu tiến độ phải là một đối tượng JSON hợp lệ.');
  }
  if (typeof raw.version !== 'number' || !Number.isInteger(raw.version) || raw.version < 1) {
    throw new Error('Thiếu khóa nguyên dương "version" trong tệp tiến độ.');
  }

  if ('last_active_lesson' in raw && raw.last_active_lesson !== null && typeof raw.last_active_lesson !== 'string') {
    throw new Error('Khóa "last_active_lesson" phải là chuỗi ký tự hoặc null.');
  }

  if ('study_days' in raw) {
    if (!Array.isArray(raw.study_days) || !raw.study_days.every((d) => typeof d === 'string')) {
      throw new Error('Khóa "study_days" phải là danh sách chuỗi ngày YYYY-MM-DD.');
    }
  }

  const dictKeys = [
    'completed_lessons',
    'completed_readings',
    'completed_milestones',
    'lesson_notes',
    'inline_notes',
    'problem_reviews',
    'problem_attempts',
    'projects',
  ];
  for (const key of dictKeys) {
    if (key in raw && !isPlainObject(raw[key])) {
      throw new Error(`Khóa "${key}" phải là một đối tượng JSON.`);
    }
  }

  const clean = createDefaultProgress();
  clean.version = raw.version;
  clean.last_active_lesson =
    typeof raw.last_active_lesson === 'string' && raw.last_active_lesson.trim()
      ? raw.last_active_lesson.trim()
      : DEFAULT_LESSON_ID;

  if (Array.isArray(raw.study_days)) {
    const uniqueDays = new Set(
      raw.study_days
        .map((d) => d.trim())
        .filter((d) => ISO_DATE_RE.test(d))
    );
    clean.study_days = [...uniqueDays].sort();
  }

  clean.completed_lessons = normalizeBooleanMap(raw.completed_lessons);
  clean.completed_readings = normalizeBooleanMap(raw.completed_readings);
  clean.completed_milestones = normalizeBooleanMap(raw.completed_milestones);

  if (isPlainObject(raw.lesson_notes)) {
    for (const [lid, note] of Object.entries(raw.lesson_notes)) {
      if (lid && typeof note === 'string') {
        clean.lesson_notes[lid] = note;
      }
    }
  }

  clean.inline_notes = normalizeInlineNotesMap(raw.inline_notes);

  if (isPlainObject(raw.problem_reviews)) {
    for (const [pid, rev] of Object.entries(raw.problem_reviews)) {
      if (pid && isPlainObject(rev) && typeof rev.next_due === 'string') {
        clean.problem_reviews[pid] = {
          ease: typeof rev.ease === 'number' && Number.isFinite(rev.ease) ? rev.ease : 2.5,
          interval_days:
            typeof rev.interval_days === 'number' && Number.isFinite(rev.interval_days)
              ? Math.max(1, Math.floor(rev.interval_days))
              : 1,
          repetitions:
            typeof rev.repetitions === 'number' && Number.isFinite(rev.repetitions)
              ? Math.max(0, Math.floor(rev.repetitions))
              : 0,
          next_due: rev.next_due,
          last_grade: typeof rev.last_grade === 'string' ? rev.last_grade : 'good',
        };
      }
    }
  }

  if (isPlainObject(raw.problem_attempts)) {
    for (const [pid, att] of Object.entries(raw.problem_attempts)) {
      if (pid && isPlainObject(att)) {
        const answer = typeof att.answer === 'string' ? att.answer : '';
        const scratch = typeof att.scratch === 'string' ? att.scratch : '';
        const status =
          att.status === 'correct' || att.status === 'incorrect' ? att.status : 'draft';
        if (answer || scratch || status !== 'draft') {
          clean.problem_attempts[pid] = { answer, scratch, status };
        }
      }
    }
  }

  if (isPlainObject(raw.projects)) {
    for (const [projId, projVal] of Object.entries(raw.projects)) {
      if (projId) {
        clean.projects[projId] = normalizeProjectEntry(projVal);
      }
    }
  }

  return clean;
}

function shiftIsoDate(isoDate, deltaDays) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return isoDate;
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + deltaDays));
  const y = dt.getUTCFullYear();
  const mo = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const da = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

/**
 * Compute consecutive active study streak and total unique study days.
 *
 * @param {string[]} studyDays
 * @param {string} [todayIso]
 * @returns {{ streakDays: number, totalDays: number }}
 */
export function computeStreakStats(studyDays, todayIso = getTodayIso()) {
  if (!Array.isArray(studyDays) || studyDays.length === 0) {
    return { streakDays: 0, totalDays: 0 };
  }
  const daySet = new Set(studyDays.filter((d) => ISO_DATE_RE.test(d)));
  const totalDays = daySet.size;
  if (totalDays === 0) return { streakDays: 0, totalDays: 0 };

  let cursor = daySet.has(todayIso) ? todayIso : shiftIsoDate(todayIso, -1);
  if (!daySet.has(cursor)) {
    return { streakDays: 0, totalDays };
  }

  let streakDays = 0;
  while (daySet.has(cursor)) {
    streakDays += 1;
    cursor = shiftIsoDate(cursor, -1);
  }
  return { streakDays, totalDays };
}

/**
 * Parse window.location.hash into a structured workspace route.
 */
export function parseRouteHash(
  rawHash,
  fallbackLessonId = DEFAULT_LESSON_ID,
  validLessonIds = null,
  validProjectIds = null
) {
  const cleaned = String(rawHash || '').replace(/^#+/, '').trim();
  if (!cleaned || cleaned === 'roadmap') {
    return { view: 'roadmap' };
  }

  if (cleaned === 'problems') {
    return { view: 'problems' };
  }

  if (cleaned === 'lesson' || cleaned.startsWith('lesson/')) {
    const requested = decodeURIComponent(cleaned.slice('lesson/'.length) || '').trim();
    const lessonId =
      requested && (!validLessonIds || validLessonIds.has(requested))
        ? requested
        : fallbackLessonId;
    return { view: 'lesson', lessonId };
  }

  if (cleaned === 'projects' || cleaned.startsWith('projects/')) {
    const requested = decodeURIComponent(cleaned.slice('projects/'.length) || '').trim();
    const projectId =
      requested && (!validProjectIds || validProjectIds.has(requested))
        ? requested
        : DEFAULT_PROJECT_ID;
    return { view: 'projects', projectId };
  }

  return { view: 'roadmap' };
}

/**
 * Filter interview problems by Module, Difficulty, Firm tag, and Attempt Status.
 */
export function filterProblemsList(problems, filters, problemAttempts) {
  if (!Array.isArray(problems)) return [];
  const modFilter = filters?.module || 'all';
  const diffFilter = filters?.difficulty || 'all';
  const firmFilter = filters?.firm || 'all';
  const queueFilter = filters?.queue || 'all';
  const attempts = problemAttempts || {};

  return problems.filter((prob) => {
    if (modFilter !== 'all' && prob.module_id !== modFilter) return false;
    if (diffFilter !== 'all' && prob.difficulty !== diffFilter) return false;
    if (firmFilter !== 'all') {
      const firms = Array.isArray(prob.firms) ? prob.firms : [prob.firms];
      if (!firms.includes(firmFilter)) return false;
    }

    const att = attempts[prob.id];
    const st = att?.status || 'draft';
    if (queueFilter === 'unanswered') {
      return st !== 'correct' && st !== 'incorrect';
    }
    if (queueFilter === 'retry') {
      return st === 'incorrect';
    }
    if (queueFilter === 'solved') {
      return st === 'correct';
    }
    return true;
  });
}

/**
 * Strip the leading `# ...` H1 line from lesson Markdown because the Reader renders
 * a structured scholarly header above the prose body.
 */
export function stripLeadingMarkdownH1(markdownText) {
  if (typeof markdownText !== 'string') return '';
  return markdownText.replace(/^\s*#\s+[^\n]+\n+/, '');
}

/**
 * Normalize Vietnamese diacritics for fast accent-insensitive sidebar search.
 */
function foldSearchText(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

function formatByteSize(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatProblemBadgeCode(probId, moduleId) {
  const rawMod = String(moduleId || '').trim();
  const idModMatch = /^prob-(m\d+)-/i.exec(String(probId || '').trim());
  const resolvedMod = /^m\d+$/i.test(rawMod)
    ? rawMod.toUpperCase()
    : idModMatch
      ? idModMatch[1].toUpperCase()
      : (rawMod || 'M').toUpperCase();
  const m = /(\d+)$/.exec(String(probId || ''));
  const num = m ? m[1].padStart(2, '0') : '01';
  return `${resolvedMod} • #${num}`;
}

const DIFFICULTY_LABELS = {
  Easy: 'Cơ bản',
  Medium: 'Chuẩn Phỏng vấn',
  Hard: 'Superday',
};

export function formatDifficultyLabel(difficulty) {
  return DIFFICULTY_LABELS[difficulty] || String(difficulty || '');
}

/* ==========================================================================
 * Browser Application Controller (Executed only when DOM is present)
 * ========================================================================== */

function bootBrowserApp() {
  const getKatex = () => globalThis.window?.katex || null;

  const state = {
    syllabus: null,
    problems: [],
    libraryFiles: [],
    progress: createDefaultProgress(),

    // Fast lookup maps populated once syllabus loads
    lessonMap: new Map(),
    orderedLessons: [],
    moduleMap: new Map(),
    projectMap: new Map(),

    // UI state
    route: { view: 'roadmap' },
    activeLessonId: DEFAULT_LESSON_ID,
    activeProjectId: DEFAULT_PROJECT_ID,
    searchQuery: '',
    collapsedModules: new Set(),

    // Reader & Split View state
    lessonCache: new Map(),
    libraryMdCache: new Map(),
    activeSimulator: null,
    splitOpen: false,
    splitTab: 'notes',
    notesMode: 'both',
    selectedLibraryFile: '',

    // Problem Drill state
    problemFilters: {
      module: 'all',
      difficulty: 'all',
      firm: 'all',
      queue: 'all',
    },
    problemReveals: {},
    problemNotices: {},
    editingNoteIds: new Set(),
    expandedNoteIds: new Set(),
    pendingSelection: null,

    // Persistence state
    isStaticHost: false,
    saveTimer: null,
    saveInFlight: false,
    saveQueuedAgain: false,
    katexLoadedOnce: Boolean(getKatex()),
    toastTimer: null,
  };

  const els = {
    sidebar: document.getElementById('app-sidebar'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    workspaceTabs: [...document.querySelectorAll('[data-nav-view]')],
    searchInput: document.getElementById('sidebar-search-input'),
    searchKbd: document.getElementById('sidebar-search-kbd'),
    searchClearBtn: document.getElementById('sidebar-search-clear'),
    moduleTree: document.getElementById('sidebar-module-tree'),
    progressText: document.getElementById('sidebar-progress-text'),
    progressBarWrap: document.getElementById('sidebar-progress-bar-wrap'),
    progressFill: document.getElementById('sidebar-progress-fill'),
    streakText: document.getElementById('sidebar-streak-text'),
    saveDot: document.getElementById('save-status-dot'),
    saveText: document.getElementById('save-status-text'),
    btnExportBackup: document.getElementById('btn-export-backup'),
    btnImportBackup: document.getElementById('btn-import-backup'),
    inputImportBackup: document.getElementById('input-import-backup'),
    sidebarToast: document.getElementById('sidebar-toast'),

    views: {
      roadmap: document.getElementById('view-roadmap'),
      lesson: document.getElementById('view-lesson'),
      problems: document.getElementById('view-problems'),
      projects: document.getElementById('view-projects'),
    },

    roadmapContainer: document.getElementById('roadmap-container'),
    problemsContainer: document.getElementById('problems-container'),
    projectsContainer: document.getElementById('projects-container'),

    // Reader & Split View elements
    readerScrollProgress: document.getElementById('reader-scroll-progress'),
    readerBreadcrumb: document.getElementById('reader-breadcrumb'),
    readerCompletedPill: document.getElementById('reader-completed-pill'),
    btnReaderQuickComplete: document.getElementById('btn-reader-quick-complete'),
    btnToggleSplit: document.getElementById('btn-toggle-split'),
    readerGrid: document.getElementById('reader-grid'),
    lessonHeader: document.getElementById('lesson-header'),
    simulatorSlot: document.getElementById('lesson-simulator-slot'),
    lessonBody: document.getElementById('lesson-markdown-body'),
    readingsSection: document.getElementById('lesson-readings-section'),
    lessonFooterNav: document.getElementById('lesson-footer-nav'),

    splitPane: document.getElementById('reader-split-pane'),
    splitTabs: [...document.querySelectorAll('[data-split-tab]')],
    btnCloseSplit: document.getElementById('btn-close-split'),
    splitPanelNotes: document.getElementById('split-panel-notes'),
    splitPanelLibrary: document.getElementById('split-panel-library'),
    notesLessonLabel: document.getElementById('notes-lesson-label'),
    notesModeBtns: [...document.querySelectorAll('[data-notes-mode]')],
    notesWorkbench: document.getElementById('notes-workbench'),
    notesInput: document.getElementById('lesson-notes-input'),
    notesPreview: document.getElementById('lesson-notes-preview'),

    librarySelect: document.getElementById('library-file-select'),
    btnRefreshLibrary: document.getElementById('btn-refresh-library'),
    linkOpenLibraryRaw: document.getElementById('link-open-library-raw'),
    libraryViewerBody: document.getElementById('library-viewer-body'),

    selectionPopover: document.getElementById('selection-note-popover'),
    btnSelectionAddNote: document.getElementById('btn-selection-add-note'),
  };

  function hideSelectionPopover() {
    state.pendingSelection = null;
    if (els.selectionPopover) {
      els.selectionPopover.hidden = true;
    }
  }

  function findScopeContainerDom(scopeKey) {
    if (!scopeKey) return null;
    if (els.lessonBody?.getAttribute('data-note-scope') === scopeKey) {
      return els.lessonBody;
    }
    const allScopes = document.querySelectorAll('[data-note-scope]');
    for (const el of allScopes) {
      if (el.getAttribute('data-note-scope') === scopeKey) return el;
    }
    return null;
  }

  function remountScopeInlineNotes(scopeKey, focusNoteId = null) {
    const containerEl = findScopeContainerDom(scopeKey);
    if (!containerEl) return;
    const showHeadingBtns = containerEl === els.lessonBody || scopeKey.startsWith('roadmap-');
    mountInlineNotesInContainer(
      containerEl,
      scopeKey,
      state.progress.inline_notes,
      state.editingNoteIds,
      getKatex(),
      { showHeadingButtons: showHeadingBtns, expandedIds: state.expandedNoteIds }
    );
    if (focusNoteId) {
      const ta = [...containerEl.querySelectorAll('[data-inline-note-input]')].find(
        (el) => el.getAttribute('data-inline-note-input') === focusNoteId
      );
      if (ta) {
        if (ta.style && ta.scrollHeight) {
          ta.style.height = 'auto';
          ta.style.height = `${Math.max(44, ta.scrollHeight)}px`;
        }
        ta.focus();
        ta.selectionStart = ta.value.length;
        ta.selectionEnd = ta.value.length;
      }
    }
  }

  /* ------------------------------------------------------------------------
   * Utility & Persistence Helpers
   * ---------------------------------------------------------------------- */

  function showSidebarToast(message, isError = false) {
    if (!els.sidebarToast) return;
    if (state.toastTimer) clearTimeout(state.toastTimer);
    els.sidebarToast.textContent = message;
    els.sidebarToast.classList.toggle('is-error', isError);
    els.sidebarToast.hidden = false;
    state.toastTimer = setTimeout(() => {
      els.sidebarToast.hidden = true;
    }, 4200);
  }

  function setSaveStatus(mode) {
    if (!els.saveDot || !els.saveText) return;
    els.saveDot.className = 'save-dot';
    if (mode === 'saving') {
      els.saveDot.classList.add('is-saving');
      els.saveText.textContent = 'Đang lưu...';
    } else if (mode === 'offline') {
      els.saveDot.classList.add('is-offline');
      els.saveText.textContent = 'Chế độ tạm ngoại tuyến';
    } else {
      els.saveDot.classList.add('is-saved');
      els.saveText.textContent = state.isStaticHost ? 'Đã lưu trên trình duyệt' : 'Đã lưu vào ổ cứng';
    }
  }

  function saveLocalDraft(dirty) {
    try {
      window.localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(state.progress));
      window.localStorage.setItem(LOCAL_DIRTY_KEY, dirty ? '1' : '0');
    } catch {
      // Ignore private-browsing storage quota exceptions
    }
  }

  function recordStudyToday() {
    const today = getTodayIso();
    if (!state.progress.study_days.includes(today)) {
      state.progress.study_days.push(today);
      state.progress.study_days.sort();
    }
  }

  function ensureProjectRecord(projId) {
    if (!isPlainObject(state.progress.projects[projId])) {
      state.progress.projects[projId] = createDefaultProjectState();
    } else {
      state.progress.projects[projId] = normalizeProjectEntry(state.progress.projects[projId]);
    }
    return state.progress.projects[projId];
  }

  async function persistProgressNow() {
    if (state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
    }
    if (state.saveInFlight) {
      state.saveQueuedAgain = true;
      return;
    }

    let payload;
    try {
      payload = normalizeProgressPayload(state.progress);
      state.progress = payload;
    } catch {
      return;
    }

    if (state.isStaticHost) {
      saveLocalDraft(false);
      setSaveStatus('saved');
      return;
    }

    state.saveInFlight = true;
    setSaveStatus('saving');
    saveLocalDraft(true);

    try {
      const resp = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      saveLocalDraft(false);
      setSaveStatus('saved');
    } catch {
      saveLocalDraft(true);
      setSaveStatus('offline');
    } finally {
      state.saveInFlight = false;
      if (state.saveQueuedAgain) {
        state.saveQueuedAgain = false;
        persistProgressNow();
      }
    }
  }

  function scheduleProgressSave(delayMs = 0) {
    saveLocalDraft(true);
    setSaveStatus('saving');
    if (state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
    }
    if (delayMs <= 0) {
      persistProgressNow();
    } else {
      state.saveTimer = setTimeout(() => {
        state.saveTimer = null;
        persistProgressNow();
      }, delayMs);
    }
  }

  function closeMobileSidebar() {
    if (!els.sidebar) return;
    els.sidebar.classList.remove('is-mobile-open');
    if (els.sidebarBackdrop) els.sidebarBackdrop.hidden = true;
    if (els.mobileMenuBtn) els.mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileSidebar() {
    if (!els.sidebar) return;
    const nextOpen = !els.sidebar.classList.contains('is-mobile-open');
    els.sidebar.classList.toggle('is-mobile-open', nextOpen);
    if (els.sidebarBackdrop) els.sidebarBackdrop.hidden = !nextOpen;
    if (els.mobileMenuBtn) els.mobileMenuBtn.setAttribute('aria-expanded', String(nextOpen));
  }

  function navigateToHash(targetHash) {
    if (window.location.hash === targetHash) {
      handleRouteChange();
    } else {
      window.location.hash = targetHash;
    }
  }

  /* ------------------------------------------------------------------------
   * Indexing Syllabus Metadata
   * ---------------------------------------------------------------------- */

  function indexSyllabus(syllabus) {
    state.syllabus = syllabus;
    state.lessonMap.clear();
    state.orderedLessons = [];
    state.moduleMap.clear();
    state.projectMap.clear();

    for (const mod of syllabus.modules || []) {
      state.moduleMap.set(mod.id, mod);
      const lessons = mod.lessons || [];
      for (const les of lessons) {
        const enriched = {
          ...les,
          moduleId: mod.id,
          moduleCode: mod.code,
          moduleTitle: mod.title,
        };
        state.lessonMap.set(les.id, enriched);
        state.orderedLessons.push(enriched);
      }
    }

    for (let idx = 0; idx < state.orderedLessons.length; idx += 1) {
      state.orderedLessons[idx].prevLesson = idx > 0 ? state.orderedLessons[idx - 1] : null;
      state.orderedLessons[idx].nextLesson =
        idx + 1 < state.orderedLessons.length ? state.orderedLessons[idx + 1] : null;
    }

    for (const proj of syllabus.projects || []) {
      state.projectMap.set(proj.id, proj);
    }

    if (
      state.progress.last_active_lesson
      && state.lessonMap.has(state.progress.last_active_lesson)
    ) {
      state.activeLessonId = state.progress.last_active_lesson;
    } else if (state.orderedLessons.length > 0) {
      state.activeLessonId = state.orderedLessons[0].id;
    }
  }

  /* ------------------------------------------------------------------------
   * Sidebar Rendering (Tabs, Quick Search, Collapsible Tree, Progress Footer)
   * ---------------------------------------------------------------------- */

  function renderSidebarMetricsAndBadges() {
    const totalLessons = state.orderedLessons.length || 36;
    let doneCount = 0;
    for (const les of state.orderedLessons) {
      if (state.progress.completed_lessons[les.id]) {
        doneCount += 1;
      }
    }
    const pct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;

    if (els.progressText) {
      els.progressText.textContent = `${doneCount} / ${totalLessons} bài (${pct}%)`;
    }
    if (els.progressFill) {
      els.progressFill.style.width = `${pct}%`;
    }
    if (els.progressBarWrap) {
      els.progressBarWrap.setAttribute('aria-valuenow', String(pct));
    }

    const { streakDays, totalDays } = computeStreakStats(state.progress.study_days, getTodayIso());
    if (els.streakText) {
      els.streakText.textContent = `Chuỗi học: ${streakDays} ngày • Tích lũy: ${totalDays} ngày`;
    }

    for (const tabBtn of els.workspaceTabs) {
      const v = tabBtn.getAttribute('data-nav-view');
      tabBtn.classList.toggle('is-active', v === state.route.view);
    }
  }

  function getMatchingLessonsForQuery(rawQuery) {
    const q = foldSearchText(rawQuery);
    if (!q) return null;
    const matches = new Set();
    for (const les of state.orderedLessons) {
      const hay = foldSearchText(
        `${les.code} ${les.title} ${les.summary} ${les.moduleCode} ${les.moduleTitle}`
      );
      if (hay.includes(q)) {
        matches.add(les.id);
      }
    }
    return matches;
  }

  function renderSidebarTree() {
    if (!els.moduleTree || !state.syllabus) return;
    const matchedSet = getMatchingLessonsForQuery(state.searchQuery);
    const isFiltering = matchedSet !== null;

    if (isFiltering && matchedSet.size === 0) {
      els.moduleTree.innerHTML =
        `<div class="sidebar-empty-search">Không tìm thấy bài giảng khớp với từ khóa <strong>${escapeHtml(state.searchQuery)}</strong>.</div>`;
      return;
    }

    const checkIconSvg = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5.2 8.2L7.1 10.1L11 6.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    const dotIconSvg = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.3"/>
      </svg>`;
    const chevronSvg = `
      <svg class="module-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4.5 6L8 9.5L11.5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    const groupsHtml = [];
    for (const mod of state.syllabus.modules || []) {
      const modLessons = mod.lessons || [];
      const visibleLessons = isFiltering
        ? modLessons.filter((l) => matchedSet.has(l.id))
        : modLessons;
      if (isFiltering && visibleLessons.length === 0) continue;

      const completedInMod = modLessons.filter((l) => state.progress.completed_lessons[l.id]).length;
      const isCollapsed = !isFiltering && state.collapsedModules.has(mod.id);
      const shortLabel = MODULE_SHORT_LABELS[mod.id] || mod.title;

      const itemsHtml = visibleLessons
        .map((les) => {
          const isCompleted = Boolean(state.progress.completed_lessons[les.id]);
          const isActive = state.route.view === 'lesson' && state.activeLessonId === les.id;
          const cls = [
            'tree-lesson-link',
            isActive ? 'is-active' : '',
            isCompleted ? 'is-completed' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return `
            <li class="tree-lesson-item">
              <a href="#lesson/${encodeURIComponent(les.id)}" class="${cls}" data-lesson-link="${escapeHtml(les.id)}">
                <span class="tree-lesson-status">${isCompleted ? checkIconSvg : dotIconSvg}</span>
                <span class="tree-lesson-text">
                  <span class="tree-lesson-code">${escapeHtml(les.code)}</span>${escapeHtml(les.title)}
                </span>
              </a>
            </li>`;
        })
        .join('');

      groupsHtml.push(`
        <div class="module-group${isCollapsed ? ' is-collapsed' : ''}" data-module-group="${escapeHtml(mod.id)}">
          <button type="button" class="module-toggle" data-toggle-module="${escapeHtml(mod.id)}" aria-expanded="${String(!isCollapsed)}" title="${escapeHtml(mod.title)}">
            ${chevronSvg}
            <span class="module-code-tag">${escapeHtml(mod.code)}</span>
            <span class="module-title-short">${escapeHtml(shortLabel)}</span>
            <span class="module-count-fraction">${completedInMod}/${modLessons.length}</span>
          </button>
          <ul class="module-lesson-list">
            ${itemsHtml}
          </ul>
        </div>`);
    }

    els.moduleTree.innerHTML = groupsHtml.join('');
  }

  /* ------------------------------------------------------------------------
   * Workspace 1: Lộ trình 24 Tháng (#roadmap)
   * ---------------------------------------------------------------------- */

  function renderRoadmapView() {
    if (!els.roadmapContainer || !state.syllabus) return;

    const resumeId =
      state.progress.last_active_lesson && state.lessonMap.has(state.progress.last_active_lesson)
        ? state.progress.last_active_lesson
        : DEFAULT_LESSON_ID;
    const resumeLesson = state.lessonMap.get(resumeId) || state.orderedLessons[0];
    let retryCount = 0;
    let solvedCount = 0;
    for (const prob of state.problems) {
      const st = state.progress.problem_attempts[prob.id]?.status;
      if (st === 'incorrect') retryCount += 1;
      else if (st === 'correct') solvedCount += 1;
    }

    const checkSvg = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5.2 8.2L7.1 10.1L11 6.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    const drillBtnHtml =
      retryCount > 0
        ? `<button type="button" class="btn btn-teal" data-open-retry-problems="1">Làm lại câu chưa khớp (${retryCount})</button>`
        : `<a href="#problems" class="btn">Luyện đề phỏng vấn (${solvedCount}/${state.problems.length} câu)</a>`;

    const semestersHtml = (state.syllabus.semesters || [])
      .map((sem, semIdx) => {
        const semNum = String(semIdx + 1).padStart(2, '0');
        const modCardsHtml = (sem.module_ids || [])
          .map((modId) => {
            const mod = state.moduleMap.get(modId);
            if (!mod) return '';
            const lessons = mod.lessons || [];
            const doneMod = lessons.filter((l) => state.progress.completed_lessons[l.id]).length;
            const lessonCards = lessons
              .map((les) => {
                const done = Boolean(state.progress.completed_lessons[les.id]);
                const simBadge = les.simulator_id
                  ? `<span class="sem-sim-tag">Mô phỏng</span>`
                  : '';
                return `
                  <a href="#lesson/${encodeURIComponent(les.id)}" class="sem-lesson-card${done ? ' is-completed' : ''}">
                    <span class="sem-lesson-code">${escapeHtml(les.code)}</span>
                    <span class="sem-lesson-title">${escapeHtml(les.title)}</span>
                    <div class="sem-lesson-right">
                      ${simBadge}
                      <span class="sem-lesson-hours">${escapeHtml(String(les.estimated_hours))}h</span>
                      <span class="sem-lesson-check" title="${done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}">${checkSvg}</span>
                      <span class="sem-lesson-arrow" aria-hidden="true">&rarr;</span>
                    </div>
                  </a>`;
              })
              .join('');

            return `
              <div class="sem-module-card" data-mod-id="${escapeHtml(mod.id)}">
                <div class="sem-module-head">
                  <span class="sem-module-name">${escapeHtml(mod.code)} · ${escapeHtml(mod.title)}</span>
                  <span class="sem-module-done">${doneMod}/${lessons.length} bài</span>
                </div>
                <div class="sem-lesson-list">
                  ${lessonCards}
                </div>
              </div>`;
          })
          .join('');

        const projCardsHtml = (sem.project_ids || [])
          .map((pid) => {
            const proj = state.projectMap.get(pid);
            if (!proj) return '';
            const pState = state.progress.projects[pid] || createDefaultProjectState();
            const checkedTasks = Object.keys(pState.checked_tasks || {}).length;
            const totalTasks = (proj.tasks || []).length;
            const checkedAudits = Object.keys(pState.checked_audits || {}).length;
            const totalAudits = (proj.anti_bias_audits || []).length;
            const firms = Array.isArray(proj.target_firms) ? proj.target_firms.join(', ') : proj.target_firms;

            return `
              <a href="#projects/${encodeURIComponent(proj.id)}" class="sem-project-card">
                <div class="sem-project-body">
                  <div class="sem-project-code">Đồ án trọng tâm · ${escapeHtml(proj.code)}</div>
                  <div class="sem-project-title">${escapeHtml(proj.title)}</div>
                  <div class="sem-project-firms">${escapeHtml(firms)} · Triển khai ${checkedTasks}/${totalTasks} · Kiểm duyệt ${checkedAudits}/${totalAudits}</div>
                </div>
                <span class="sem-project-cta">Mở xưởng đồ án &rarr;</span>
              </a>`;
          })
          .join('');

        const milestones = sem.hiring_milestones || [];
        const doneMsCount = milestones.filter((m) => state.progress.completed_milestones[m.id]).length;
        const milestonesHtml = milestones
          .map((ms) => {
            const checked = Boolean(state.progress.completed_milestones[ms.id]);
            return `
              <label class="milestone-item${checked ? ' is-checked' : ''}">
                <input
                  type="checkbox"
                  class="milestone-checkbox"
                  data-milestone-id="${escapeHtml(ms.id)}"
                  ${checked ? 'checked' : ''}
                >
                <div class="milestone-body">
                  <div class="milestone-title">${escapeHtml(ms.title)}</div>
                  <div class="milestone-detail">${escapeHtml(ms.detail)}</div>
                </div>
              </label>`;
          })
          .join('');

        return `
          <section class="semester-block" id="${escapeHtml(sem.id)}">
            <div class="semester-timeline-node" aria-hidden="true">${semNum}</div>
            <div class="semester-content">
              <header class="semester-header">
                <div class="semester-top-meta">
                  <span class="semester-months">${escapeHtml(sem.months)}</span>
                  <span class="semester-progress-meta">Cột mốc tuyển dụng: ${doneMsCount} / ${milestones.length}</span>
                </div>
                <h2 class="semester-title">${escapeHtml(sem.title)}</h2>
                <p class="semester-goal">${escapeHtml(sem.goal)}</p>
              </header>

              <div class="semester-modules-grid">
                ${modCardsHtml}
              </div>

              ${projCardsHtml ? `<div class="semester-project-wrap">${projCardsHtml}</div>` : ''}

              <div class="semester-milestones-wrap">
                <div class="semester-subhead">Cột mốc Tuyển dụng Thực tế</div>
                <div class="milestone-list">
                  ${milestonesHtml}
                </div>
              </div>
            </div>
          </section>`;
      })
      .join('');

    els.roadmapContainer.innerHTML = `
      <header class="page-masthead">
        <div class="eyebrow-label">Quantitative Researcher • US Hedge Fund</div>
        <h1 class="page-title">${escapeHtml(state.syllabus.program_title)}</h1>
        <p class="page-subtitle">${escapeHtml(state.syllabus.subtitle)}</p>
      </header>

      <div class="roadmap-action-bar">
        <div class="roadmap-resume-info">
          <div class="roadmap-resume-caption">Đang nghiên cứu dở dang</div>
          <div class="roadmap-resume-title">
            ${resumeLesson ? `${escapeHtml(resumeLesson.code)} — ${escapeHtml(resumeLesson.title)}` : ''}
          </div>
        </div>
        <div class="roadmap-action-buttons">
          ${
            resumeLesson
              ? `<a href="#lesson/${encodeURIComponent(resumeLesson.id)}" class="btn btn-primary">Tiếp tục bài học &rarr;</a>`
              : ''
          }
          ${drillBtnHtml}
        </div>
      </div>

      <div class="roadmap-timeline">
        ${semestersHtml}
      </div>
    `;

    for (const semEl of els.roadmapContainer.querySelectorAll('.semester-block')) {
      const semId = semEl.id;
      const headerEl = semEl.querySelector('.semester-header');
      if (semId && headerEl) {
        mountInlineNotesInContainer(
          headerEl,
          `roadmap-${semId}`,
          state.progress.inline_notes,
          state.editingNoteIds,
          getKatex(),
          { showHeadingButtons: true, expandedIds: state.expandedNoteIds }
        );
      }
    }
  }

  /* ------------------------------------------------------------------------
   * Workspace 2: Phòng Đọc Giáo Trình & Thư Viện Đôi (#lesson/<id>)
   * ---------------------------------------------------------------------- */

  function unmountActiveSimulator() {
    if (state.activeSimulator && typeof state.activeSimulator.destroy === 'function') {
      state.activeSimulator.destroy();
    }
    state.activeSimulator = null;
    if (els.simulatorSlot) {
      els.simulatorSlot.innerHTML = '';
      els.simulatorSlot.hidden = true;
    }
  }

  function updateReaderCompletionControls(lesson) {
    if (!lesson) return;
    const isCompleted = Boolean(state.progress.completed_lessons[lesson.id]);

    if (els.readerCompletedPill) {
      els.readerCompletedPill.hidden = !isCompleted;
    }
    if (els.btnReaderQuickComplete) {
      els.btnReaderQuickComplete.textContent = isCompleted
        ? 'Đã hoàn thành ✓'
        : 'Đánh dấu hoàn thành';
      els.btnReaderQuickComplete.classList.toggle('is-completed-btn', isCompleted);
    }

    const bottomBtn = document.getElementById('btn-lesson-bottom-complete');
    if (bottomBtn) {
      bottomBtn.textContent = isCompleted
        ? 'Đã hoàn thành bài học ✓ (Nhấn để bỏ đánh dấu)'
        : 'Đánh dấu Hoàn thành Bài học';
      bottomBtn.className = isCompleted ? 'btn btn-teal' : 'btn btn-primary';
    }
  }

  function renderLessonReadings(lesson) {
    if (!els.readingsSection || !lesson) return;
    const readings = lesson.readings || [];
    const doneCount = readings.filter((r) => state.progress.completed_readings[r.id]).length;
    const katexInst = getKatex();

    const cardsHtml = readings
      .map((r) => {
        const checked = Boolean(state.progress.completed_readings[r.id]);
        const rawUrl = String(r.url || '').trim();
        const safeUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : '';
        let libraryFile = '';
        if (rawUrl.startsWith('/library/')) {
          const rawName = rawUrl.slice('/library/'.length).split(/[?#]/)[0];
          try {
            libraryFile = decodeURIComponent(rawName);
          } catch {
            libraryFile = rawName;
          }
        }
        const libDataAttr = libraryFile ? ` data-library-file="${escapeHtml(libraryFile)}"` : '';
        return `
          <div class="reading-card${checked ? ' is-checked' : ''}">
            <input
              type="checkbox"
              class="reading-checkbox"
              data-reading-id="${escapeHtml(r.id)}"
              aria-label="${escapeHtml(r.source)}"
              ${checked ? 'checked' : ''}
            >
            <div class="reading-content">
              <div class="reading-source">${escapeHtml(r.source)}</div>
              <div class="reading-chapter">${renderMarkdownWithMath(r.chapter || '', katexInst)}</div>
              <div class="reading-note">${renderMarkdownWithMath(r.note || '', katexInst)}</div>
              <div class="reading-links">
                ${
                  safeUrl
                    ? `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">Nguồn xuất bản / ArXiv &#8599;</a>`
                    : ''
                }
                <button type="button" class="reading-action-link" data-open-library-split="1"${libDataAttr}>
                  Mở Thư viện Tài liệu bên phải &rarr;
                </button>
              </div>
            </div>
          </div>`;
      })
      .join('');

    els.readingsSection.innerHTML = `
      <div class="section-heading-row">
        <h2 class="section-heading-title">Checklist Đọc Sách Kinh Điển &amp; Paper Gốc</h2>
        <span class="section-heading-count" id="readings-progress-count">${doneCount} / ${readings.length} tài liệu</span>
      </div>
      <div class="reading-list">
        ${cardsHtml}
      </div>
    `;
  }

  function renderLessonFooter(lesson) {
    if (!els.lessonFooterNav || !lesson) return;
    const isCompleted = Boolean(state.progress.completed_lessons[lesson.id]);
    const prev = lesson.prevLesson;
    const next = lesson.nextLesson;

    const prevHtml = prev
      ? `<a href="#lesson/${encodeURIComponent(prev.id)}" class="nav-adj-card">
           <span class="nav-adj-dir">&larr; Bài trước (${escapeHtml(prev.code)})</span>
           <span class="nav-adj-title">${escapeHtml(prev.title)}</span>
         </a>`
      : `<div></div>`;

    const nextHtml = next
      ? `<a href="#lesson/${encodeURIComponent(next.id)}" class="nav-adj-card is-next">
           <span class="nav-adj-dir">Bài tiếp theo (${escapeHtml(next.code)}) &rarr;</span>
           <span class="nav-adj-title">${escapeHtml(next.title)}</span>
         </a>`
      : `<div></div>`;

    els.lessonFooterNav.innerHTML = `
      <div class="lesson-complete-bar">
        <span class="lesson-complete-prompt">
          Xác nhận sau khi bạn đã tự tay chứng minh lại các định lý trọng tâm của chuyên đề <strong>${escapeHtml(lesson.code)}</strong>.
        </span>
        <div class="lesson-complete-actions">
          <button type="button" id="btn-lesson-bottom-complete" class="${isCompleted ? 'btn btn-teal' : 'btn btn-primary'}">
            ${isCompleted ? 'Đã hoàn thành bài học ✓ (Nhấn để bỏ đánh dấu)' : 'Đánh dấu Hoàn thành Bài học'}
          </button>
          <button type="button" class="btn" data-drill-module="${escapeHtml(lesson.moduleId)}">
            Luyện đề ${escapeHtml(lesson.moduleCode)} &rarr;
          </button>
        </div>
      </div>
      <div class="lesson-prev-next">
        ${prevHtml}
        ${nextHtml}
      </div>
    `;
  }

  function renderNotesPreview() {
    if (!els.notesPreview || !els.notesInput) return;
    const raw = els.notesInput.value;
    if (!raw.trim()) {
      els.notesPreview.innerHTML =
        '<p style="color: var(--text-muted); font-size: 0.85rem;">Chưa có ghi chú cho bài học này. Gõ công thức LaTeX như <code>$\\mathbb{E}[X \\mid \\mathcal{F}_t]$</code> ở khung trên để xem kết xuất tức thì.</p>';
      return;
    }
    els.notesPreview.innerHTML = renderMarkdownWithMath(raw, getKatex());
  }

  function syncNotesEditorForLesson(lesson) {
    if (!lesson || !els.notesInput) return;
    if (els.notesLessonLabel) {
      els.notesLessonLabel.textContent = `Sổ ghi chú • ${lesson.code}`;
    }
    const savedNote = state.progress.lesson_notes[lesson.id] || '';
    if (els.notesInput.value !== savedNote) {
      els.notesInput.value = savedNote;
    }
    renderNotesPreview();
  }

  async function renderLessonView(lessonId, { preserveScroll = false } = {}) {
    if (!state.syllabus) return;
    const lesson = state.lessonMap.get(lessonId) || state.orderedLessons[0];
    if (!lesson) return;

    const lessonChanged = state.activeLessonId !== lesson.id;
    state.activeLessonId = lesson.id;

    if (state.progress.last_active_lesson !== lesson.id) {
      state.progress.last_active_lesson = lesson.id;
      scheduleProgressSave(600);
    }

    if (els.readerBreadcrumb) {
      els.readerBreadcrumb.textContent = `${lesson.moduleCode} • ${lesson.code} • ${lesson.estimated_hours} giờ nghiên cứu`;
    }

    const katexInst = getKatex();
    if (els.lessonHeader) {
      els.lessonHeader.innerHTML = `
        <div class="lesson-eyebrow">
          <span>${escapeHtml(lesson.moduleCode)} — ${escapeHtml(lesson.moduleTitle)}</span>
          <span class="lesson-eyebrow-muted">• Thời lượng khuyến nghị: ${escapeHtml(String(lesson.estimated_hours))} giờ</span>
        </div>
        <h1 class="lesson-main-title">${escapeHtml(lesson.code)} — ${escapeHtml(lesson.title)}</h1>
        <div class="lesson-abstract prose prose-compact">
          ${renderMarkdownWithMath(lesson.summary || '', katexInst)}
        </div>
      `;
    }

    // Cleanly unmount any previous simulator before mounting the new lesson's simulator
    unmountActiveSimulator();
    if (lesson.simulator_id && els.simulatorSlot) {
      els.simulatorSlot.hidden = false;
      state.activeSimulator = mountSimulator(els.simulatorSlot, lesson.simulator_id);
    }

    renderLessonReadings(lesson);
    renderLessonFooter(lesson);
    updateReaderCompletionControls(lesson);

    if (lessonChanged || !els.notesInput.dataset.boundLesson) {
      els.notesInput.dataset.boundLesson = lesson.id;
      syncNotesEditorForLesson(lesson);
    } else {
      renderNotesPreview();
    }

    if (!preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Fetch and render lesson Markdown
    const requestedId = lesson.id;
    let mdText = state.lessonCache.get(requestedId);
    if (mdText === undefined) {
      if (els.lessonBody) {
        els.lessonBody.innerHTML = '<div class="loading-state">Đang tải nội dung bài giảng...</div>';
      }
      try {
        if (state.isStaticHost) {
          const resp = await fetch(`/static-content/lessons/${encodeURIComponent(requestedId)}.md`);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          mdText = await resp.text();
        } else {
          const resp = await fetch(`/api/lesson?id=${encodeURIComponent(requestedId)}`);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          mdText = typeof data.markdown === 'string' ? data.markdown : '';
        }
        state.lessonCache.set(requestedId, mdText);
      } catch {
        if (state.activeLessonId === requestedId && els.lessonBody) {
          els.lessonBody.innerHTML =
            '<div class="empty-state">Không thể tải tệp bài giảng. Hãy kiểm tra kết nối mạng hoặc máy chủ cục bộ.</div>';
        }
        return;
      }
    }

    if (state.activeLessonId !== requestedId || !els.lessonBody) return;
    const bodyWithoutTopH1 = stripLeadingMarkdownH1(mdText);
    els.lessonBody.innerHTML = renderMarkdownWithMath(bodyWithoutTopH1, getKatex());
    mountInlineNotesInContainer(
      els.lessonBody,
      requestedId,
      state.progress.inline_notes,
      state.editingNoteIds,
      getKatex(),
      { showHeadingButtons: true, expandedIds: state.expandedNoteIds }
    );
  }

  /* ------------------------------------------------------------------------
   * Split View & Local PDF / Markdown Library
   * ---------------------------------------------------------------------- */

  function applySplitViewLayout() {
    if (!els.readerGrid || !els.splitPane || !els.btnToggleSplit) return;
    els.readerGrid.classList.toggle('split-open', state.splitOpen);
    els.splitPane.hidden = !state.splitOpen;
    els.btnToggleSplit.setAttribute('aria-pressed', String(state.splitOpen));

    for (const tabBtn of els.splitTabs) {
      const t = tabBtn.getAttribute('data-split-tab');
      const active = t === state.splitTab;
      tabBtn.classList.toggle('is-active', active);
      tabBtn.setAttribute('aria-selected', String(active));
    }

    if (els.splitPanelNotes) els.splitPanelNotes.hidden = state.splitTab !== 'notes';
    if (els.splitPanelLibrary) els.splitPanelLibrary.hidden = state.splitTab !== 'library';

    if (state.splitOpen && state.splitTab === 'library') {
      renderSelectedLibraryDocument();
    }

    if (state.activeSimulator && typeof state.activeSimulator.update === 'function') {
      window.requestAnimationFrame(() => {
        state.activeSimulator?.update?.();
      });
    }
  }

  function populateLibrarySelectDom() {
    if (!els.librarySelect) return;
    if (state.libraryFiles.length === 0) {
      els.librarySelect.innerHTML = '<option value="">Chưa có tài liệu trong content/library/</option>';
      state.selectedLibraryFile = '';
    } else {
      const stillExists = state.libraryFiles.some((f) => f.name === state.selectedLibraryFile);
      if (!stillExists) {
        const firstPdf = state.libraryFiles.find((f) => f.ext === '.pdf');
        state.selectedLibraryFile = firstPdf ? firstPdf.name : state.libraryFiles[0].name;
      }

      els.librarySelect.innerHTML = state.libraryFiles
        .map((f) => {
          const selected = f.name === state.selectedLibraryFile ? ' selected' : '';
          const kindTag = f.ext === '.pdf' ? 'PDF' : 'MD';
          return `<option value="${escapeHtml(f.name)}"${selected}>[${kindTag}] ${escapeHtml(f.name)} (${formatByteSize(f.size_bytes)})</option>`;
        })
        .join('');
    }

    if (state.splitOpen && state.splitTab === 'library') {
      renderSelectedLibraryDocument();
    }
  }

  async function refreshLibraryList(forceReloadMd = false) {
    try {
      const libEndpoint = state.isStaticHost ? '/static-content/library-index.json' : '/api/library';
      const resp = await fetch(libEndpoint);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      state.libraryFiles = Array.isArray(data.files) ? data.files : [];
      if (forceReloadMd) {
        state.libraryMdCache.clear();
      }
    } catch {
      // Keep existing list if offline
    }

    populateLibrarySelectDom();
  }

  async function renderSelectedLibraryDocument() {
    if (!els.libraryViewerBody) return;
    const file = state.libraryFiles.find((f) => f.name === state.selectedLibraryFile);
    if (!file) {
      els.libraryViewerBody.innerHTML = `
        <div class="library-md-scroll">
          <div class="empty-state">
            Thư mục <code>content/library/</code> hiện đang trống. Hãy chép tệp <code>.pdf</code> hoặc <code>.md</code> vào thư mục này rồi nhấn <strong>Làm mới</strong>.
          </div>
        </div>`;
      return;
    }

    if (els.linkOpenLibraryRaw) {
      els.linkOpenLibraryRaw.href = file.url;
    }

    if (file.ext === '.pdf') {
      const currentIframe = els.libraryViewerBody.querySelector('iframe.library-pdf-frame');
      if (currentIframe && currentIframe.getAttribute('data-src') === file.url) {
        return;
      }
      els.libraryViewerBody.innerHTML = `
        <iframe
          class="library-pdf-frame"
          data-src="${escapeHtml(file.url)}"
          src="${escapeHtml(file.url)}"
          title="${escapeHtml(file.name)}"
        ></iframe>`;
      return;
    }

    // Render Markdown library document (e.g. READING_GUIDE.md)
    const targetName = file.name;
    let mdContent = state.libraryMdCache.get(targetName);
    if (mdContent === undefined) {
      els.libraryViewerBody.innerHTML =
        '<div class="library-md-scroll"><div class="loading-state">Đang tải tài liệu hướng dẫn...</div></div>';
      try {
        const resp = await fetch(file.url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        mdContent = await resp.text();
        state.libraryMdCache.set(targetName, mdContent);
      } catch {
        els.libraryViewerBody.innerHTML =
          '<div class="library-md-scroll"><div class="empty-state">Không thể đọc tệp tài liệu từ thư mục thư viện.</div></div>';
        return;
      }
    }

    if (state.selectedLibraryFile !== targetName) return;
    els.libraryViewerBody.innerHTML = `
      <div class="library-md-scroll prose prose-compact">
        ${renderMarkdownWithMath(mdContent, getKatex())}
      </div>`;
  }

  /* ------------------------------------------------------------------------
   * Workspace 3: Phòng Luyện Đề Phỏng Vấn Quant (#problems)
   * ---------------------------------------------------------------------- */

  function collectUniqueProblemFirms() {
    const set = new Set();
    for (const p of state.problems) {
      const list = Array.isArray(p.firms) ? p.firms : [p.firms];
      for (const f of list) {
        if (f && typeof f === 'string') set.add(f.trim());
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  function ensureProblemAttempt(probId) {
    const cur = state.progress.problem_attempts[probId];
    if (isPlainObject(cur)) {
      return cur;
    }
    const fresh = { answer: '', scratch: '', status: 'draft' };
    state.progress.problem_attempts[probId] = fresh;
    return fresh;
  }

  function renderProblemCardHtml(prob, katexInst) {
    const att = state.progress.problem_attempts[prob.id] || null;
    const status = att?.status || 'draft';
    const savedAnswer = att?.answer || '';
    const savedScratch = att?.scratch || '';
    const notice = state.problemNotices[prob.id] || '';
    const reveal = state.problemReveals[prob.id] || { hint1: false, hint2: false, solution: false };
    const firms = Array.isArray(prob.firms) ? prob.firms : [prob.firms];
    const spec = prob.answer_check || null;

    let revLabel = 'Chưa làm';
    let revCls = 'prob-review-state';
    if (status === 'correct') {
      revLabel = 'Đã giải đúng ✓';
      revCls += ' is-mastered';
    } else if (status === 'incorrect') {
      revLabel = 'Cần làm lại';
      revCls += ' is-due';
    }

    const diffCls =
      prob.difficulty === 'Hard'
        ? 'prob-diff-tag is-hard'
        : prob.difficulty === 'Medium'
          ? 'prob-diff-tag is-medium'
          : 'prob-diff-tag';

    const hints = Array.isArray(prob.hints) ? prob.hints : [];
    const hint1Text = hints[0] || '';
    const hint2Text = hints.slice(1).join('\n\n');

    const inputStateCls =
      status === 'correct' ? ' is-correct' : status === 'incorrect' ? ' is-incorrect' : '';

    let feedbackHtml = '';
    if (notice) {
      feedbackHtml = `<span class="problem-answer-feedback is-hint">${escapeHtml(notice)}</span>`;
    } else if (status === 'correct') {
      const disp = spec?.display ? ` · Đáp số chuẩn: ${spec.display}` : '';
      feedbackHtml = `<span class="problem-answer-feedback is-correct">✓ Chính xác${escapeHtml(disp)}</span>`;
    } else if (status === 'incorrect') {
      feedbackHtml = `<span class="problem-answer-feedback is-incorrect">✕ Chưa khớp — hãy kiểm tra lại phép tính</span>`;
    }

    return `
      <article class="problem-card" data-problem-card="${escapeHtml(prob.id)}">
        <div class="problem-meta-top">
          <div class="problem-tags-left">
            <span class="prob-code-tag">${escapeHtml(formatProblemBadgeCode(prob.id, prob.module_id))}</span>
            <span class="${diffCls}">${escapeHtml(formatDifficultyLabel(prob.difficulty))}</span>
            ${firms.map((f) => `<span class="prob-firm-tag">${escapeHtml(f)}</span>`).join('')}
          </div>
          <span class="${revCls}">${escapeHtml(revLabel)}</span>
        </div>

        <h2 class="problem-title">${escapeHtml(prob.title)}</h2>

        <div class="problem-prompt prose">
          ${renderMarkdownWithMath(prob.prompt || '', katexInst)}
        </div>

        <div class="problem-answer-panel">
          <textarea
            class="problem-scratch-input"
            rows="2"
            data-prob-scratch="${escapeHtml(prob.id)}"
            placeholder="Nháp nhanh các bước biến đổi hoặc công thức của bạn..."
          >${escapeHtml(savedScratch)}</textarea>
          ${
            spec
              ? `<label class="problem-answer-label" for="ans-input-${escapeHtml(prob.id)}">
                   Đáp số kiểm tra — ${escapeHtml(spec.label)}:
                 </label>
                 <div class="problem-answer-row">
                   <input
                     id="ans-input-${escapeHtml(prob.id)}"
                     type="text"
                     class="problem-answer-input${inputStateCls}"
                     data-prob-answer-input="${escapeHtml(prob.id)}"
                     value="${escapeHtml(savedAnswer)}"
                     placeholder="Nhập số, phân số 1/6 hoặc %..."
                     autocomplete="off"
                   />
                   <button
                     type="button"
                     class="btn btn-primary"
                     data-prob-check="${escapeHtml(prob.id)}"
                   >
                     Kiểm tra
                   </button>
                   ${feedbackHtml}
                 </div>`
              : ''
          }
        </div>

        <div class="problem-reveal-controls">
          <button
            type="button"
            class="btn"
            data-prob-action="hint1"
            data-prob-id="${escapeHtml(prob.id)}"
          >
            ${reveal.hint1 ? 'Ẩn Gợi ý 1' : 'Mở Gợi ý 1'}
          </button>
          <button
            type="button"
            class="btn"
            data-prob-action="hint2"
            data-prob-id="${escapeHtml(prob.id)}"
            ${!reveal.hint1 && !reveal.hint2 ? 'disabled title="Hãy mở Gợi ý 1 trước khi xem Gợi ý 2"' : ''}
          >
            ${reveal.hint2 ? 'Ẩn Gợi ý 2' : 'Mở Gợi ý 2'}
          </button>
          <button
            type="button"
            class="btn ${reveal.solution ? 'btn-teal' : ''}"
            data-prob-action="solution"
            data-prob-id="${escapeHtml(prob.id)}"
          >
            ${reveal.solution ? 'Ẩn Lời giải Chứng minh' : 'Xem Lời giải Chứng minh'}
          </button>
        </div>

        ${
          reveal.hint1 && hint1Text
            ? `<div class="problem-reveal-box">
                 <div class="reveal-box-label">Gợi ý 1 — Hướng tiếp cận</div>
                 <div class="prose prose-compact">${renderMarkdownWithMath(hint1Text, katexInst)}</div>
               </div>`
            : ''
        }

        ${
          reveal.hint2 && hint2Text
            ? `<div class="problem-reveal-box">
                 <div class="reveal-box-label">Gợi ý 2 — Bước chuyển tiếp then chốt</div>
                 <div class="prose prose-compact">${renderMarkdownWithMath(hint2Text, katexInst)}</div>
               </div>`
            : ''
        }

        ${
          reveal.solution
            ? `<div class="problem-reveal-box is-solution">
                 <div class="reveal-box-label">Lời giải &amp; Chứng minh Chi tiết</div>
                 <div class="prose">${renderMarkdownWithMath(prob.solution || '', katexInst)}</div>
               </div>`
            : ''
        }
      </article>`;
  }

  function updateProblemStatsStripDom() {
    const statsEl = document.getElementById('problems-stats-strip');
    if (!statsEl) return;
    const attempts = state.progress.problem_attempts;

    let unansweredCount = 0;
    let retryCount = 0;
    let solvedCount = 0;
    for (const p of state.problems) {
      const st = attempts[p.id]?.status || 'draft';
      if (st === 'correct') solvedCount += 1;
      else if (st === 'incorrect') retryCount += 1;
      else unansweredCount += 1;
    }

    const filtered = filterProblemsList(state.problems, state.problemFilters, attempts);
    statsEl.innerHTML = `
      <span>Hiển thị: <strong>${filtered.length} / ${state.problems.length}</strong> đề</span>
      <span>Đã giải đúng: <strong>${solvedCount}</strong></span>
      <span>Cần làm lại: <strong>${retryCount}</strong></span>
      <span>Chưa làm: <strong>${unansweredCount}</strong></span>
    `;
  }

  function mountProblemPromptNotes(rootEl) {
    if (!rootEl) return;
    for (const cardEl of rootEl.querySelectorAll('[data-problem-card]')) {
      const pid = cardEl.getAttribute('data-problem-card');
      const promptEl = cardEl.querySelector('.problem-prompt');
      if (pid && promptEl) {
        mountInlineNotesInContainer(
          promptEl,
          pid,
          state.progress.inline_notes,
          state.editingNoteIds,
          getKatex(),
          { showHeadingButtons: false, expandedIds: state.expandedNoteIds }
        );
      }
      const solEl = cardEl.querySelector('.problem-reveal-box.is-solution .prose');
      if (pid && solEl) {
        mountInlineNotesInContainer(
          solEl,
          `${pid}-sol`,
          state.progress.inline_notes,
          state.editingNoteIds,
          getKatex(),
          { showHeadingButtons: false, expandedIds: state.expandedNoteIds }
        );
      }
    }
  }

  function rerenderSingleProblemCard(probId) {
    const prob = state.problems.find((p) => p.id === probId);
    if (!prob) return;
    const cardEl = els.problemsContainer
      ? [...els.problemsContainer.querySelectorAll('[data-problem-card]')].find(
          (el) => el.getAttribute('data-problem-card') === probId
        )
      : null;
    if (!cardEl) {
      renderProblemsListOnly();
      return;
    }
    cardEl.outerHTML = renderProblemCardHtml(prob, getKatex());
    mountProblemPromptNotes(els.problemsContainer);
    updateProblemStatsStripDom();
  }

  function renderProblemsListOnly() {
    const listWrap = document.getElementById('problems-cards-list');
    if (!listWrap) return;

    const katexInst = getKatex();
    const attempts = state.progress.problem_attempts;
    const filtered = filterProblemsList(state.problems, state.problemFilters, attempts);

    updateProblemStatsStripDom();

    if (filtered.length === 0) {
      listWrap.innerHTML = `
        <div class="empty-state">
          Không có câu hỏi nào khớp với bộ lọc hiện tại. Hãy chuyển Trạng thái sang <strong>Tất cả</strong> để duyệt toàn bộ ngân hàng đề.
        </div>`;
      return;
    }

    listWrap.innerHTML = filtered
      .map((prob) => renderProblemCardHtml(prob, katexInst))
      .join('');
    mountProblemPromptNotes(listWrap);
  }

  function renderProblemsView() {
    if (!els.problemsContainer) return;
    const firms = collectUniqueProblemFirms();
    const f = state.problemFilters;

    const dynamicMods =
      Array.isArray(state.syllabus?.modules) && state.syllabus.modules.length > 0
        ? state.syllabus.modules.map((mod) => ({
            value: mod.id,
            label: `${mod.code || String(mod.id || '').toUpperCase()} — ${MODULE_SHORT_LABELS[mod.id] || mod.title}`,
          }))
        : ['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'].map((id) => ({
            value: id,
            label: `${id.toUpperCase()} — ${MODULE_SHORT_LABELS[id] || id.toUpperCase()}`,
          }));

    const modOptions = [
      { value: 'all', label: 'Tất cả học phần' },
      ...dynamicMods,
    ];

    const diffOptions = [
      { value: 'all', label: 'Tất cả độ khó' },
      { value: 'Easy', label: formatDifficultyLabel('Easy') },
      { value: 'Medium', label: formatDifficultyLabel('Medium') },
      { value: 'Hard', label: formatDifficultyLabel('Hard') },
    ];

    const queueOptions = [
      { value: 'all', label: 'Tất cả' },
      { value: 'unanswered', label: 'Chưa làm' },
      { value: 'retry', label: 'Cần làm lại' },
      { value: 'solved', label: 'Đã giải đúng' },
    ];

    els.problemsContainer.innerHTML = `
      <header class="page-masthead">
        <div class="eyebrow-label">Phòng Luyện Đề Phỏng Vấn Định Lượng</div>
        <h1 class="page-title">Ngân Hàng Bài Toán Xác Suất, Thống Kê &amp; Vi Cấu Trúc</h1>
        <p class="page-subtitle">
          Tự biến đổi trên khung nháp và điền đáp số chốt để chấm kiểm tra ngay lập tức trước khi mở gợi ý hoặc xem lời giải chứng minh.
        </p>
        <div id="problems-stats-strip" class="drill-stats-strip"></div>
      </header>

      <div class="drill-filter-bar">
        <div class="filter-field">
          <label class="filter-label" for="filter-prob-module">Học phần</label>
          <select id="filter-prob-module" class="filter-select" data-prob-filter="module">
            ${modOptions
              .map(
                (o) =>
                  `<option value="${escapeHtml(o.value)}"${f.module === o.value ? ' selected' : ''}>${escapeHtml(o.label)}</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="filter-field">
          <label class="filter-label" for="filter-prob-difficulty">Độ khó</label>
          <select id="filter-prob-difficulty" class="filter-select" data-prob-filter="difficulty">
            ${diffOptions
              .map(
                (o) =>
                  `<option value="${escapeHtml(o.value)}"${f.difficulty === o.value ? ' selected' : ''}>${escapeHtml(o.label)}</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="filter-field">
          <label class="filter-label" for="filter-prob-firm">Quỹ đầu cơ</label>
          <select id="filter-prob-firm" class="filter-select" data-prob-filter="firm">
            <option value="all"${f.firm === 'all' ? ' selected' : ''}>Tất cả quỹ</option>
            ${firms
              .map(
                (firm) =>
                  `<option value="${escapeHtml(firm)}"${f.firm === firm ? ' selected' : ''}>${escapeHtml(firm)}</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="filter-field">
          <label class="filter-label" for="filter-prob-queue">Trạng thái</label>
          <select id="filter-prob-queue" class="filter-select" data-prob-filter="queue">
            ${queueOptions
              .map(
                (o) =>
                  `<option value="${escapeHtml(o.value)}"${f.queue === o.value ? ' selected' : ''}>${escapeHtml(o.label)}</option>`
              )
              .join('')}
          </select>
        </div>
      </div>

      <div id="problems-cards-list" class="problem-list"></div>
    `;

    renderProblemsListOnly();
  }

  /* ------------------------------------------------------------------------
   * Workspace 4: Xưởng Đồ Án Thực Chiến (#projects/<id>)
   * ---------------------------------------------------------------------- */

  function updateProjectCountersDom(proj) {
    const pState = ensureProjectRecord(proj.id);
    const doneTasks = (proj.tasks || []).filter((t) => pState.checked_tasks[t.id]).length;
    const totalTasks = (proj.tasks || []).length;
    const doneAudits = (proj.anti_bias_audits || []).filter((a) => pState.checked_audits[a.id]).length;
    const totalAudits = (proj.anti_bias_audits || []).length;

    const tasksCountEl = document.getElementById('proj-tasks-counter');
    if (tasksCountEl) {
      tasksCountEl.textContent = `${doneTasks} / ${totalTasks} hạng mục`;
    }

    const auditBadgeEl = document.getElementById('proj-audits-badge');
    if (auditBadgeEl) {
      auditBadgeEl.textContent = `${doneAudits} / ${totalAudits} tiêu chuẩn đạt`;
      auditBadgeEl.classList.toggle('is-complete', doneAudits === totalAudits && totalAudits > 0);
    }

    const activeTabMeta = document.querySelector(`[data-proj-tab-meta="${proj.id}"]`);
    if (activeTabMeta) {
      activeTabMeta.textContent = `${doneTasks + doneAudits}/${totalTasks + totalAudits} mục hoàn tất`;
    }
  }

  function renderProjectReflectionPreview(text) {
    const previewEl = document.getElementById('proj-reflection-preview');
    if (!previewEl) return;
    if (!String(text || '').trim()) {
      previewEl.hidden = true;
      previewEl.innerHTML = '';
      return;
    }
    previewEl.hidden = false;
    previewEl.innerHTML = renderMarkdownWithMath(text, getKatex());
  }

  function renderProjectsView(projectId) {
    if (!els.projectsContainer || !state.syllabus) return;
    const projects = state.syllabus.projects || [];
    const proj = state.projectMap.get(projectId) || projects[0];
    if (!proj) return;

    state.activeProjectId = proj.id;
    const pState = ensureProjectRecord(proj.id);
    const katexInst = getKatex();

    const tabsHtml = projects
      .map((p, idx) => {
        const rec = state.progress.projects[p.id] || createDefaultProjectState();
        const cTasks = (p.tasks || []).filter((t) => rec.checked_tasks?.[t.id]).length;
        const cAudits = (p.anti_bias_audits || []).filter((a) => rec.checked_audits?.[a.id]).length;
        const total = (p.tasks || []).length + (p.anti_bias_audits || []).length;
        const active = p.id === proj.id;
        return `
          <button
            type="button"
            class="project-tab-btn${active ? ' is-active' : ''}"
            data-select-project="${escapeHtml(p.id)}"
          >
            <span class="project-tab-code">${escapeHtml(p.code)} • Học kỳ ${idx + 1}</span>
            <span class="project-tab-meta" data-proj-tab-meta="${escapeHtml(p.id)}">${cTasks + cAudits}/${total} mục hoàn tất</span>
          </button>`;
      })
      .join('');

    const firms = Array.isArray(proj.target_firms) ? proj.target_firms : [proj.target_firms];
    const tasks = proj.tasks || [];
    const audits = proj.anti_bias_audits || [];
    const doneTasks = tasks.filter((t) => pState.checked_tasks[t.id]).length;
    const doneAudits = audits.filter((a) => pState.checked_audits[a.id]).length;

    const tasksHtml = tasks
      .map((t, idx) => {
        const checked = Boolean(pState.checked_tasks[t.id]);
        return `
          <label class="project-check-item${checked ? ' is-checked' : ''}">
            <input
              type="checkbox"
              data-proj-task="${escapeHtml(t.id)}"
              data-proj-owner="${escapeHtml(proj.id)}"
              ${checked ? 'checked' : ''}
            >
            <span class="project-check-index">${String(idx + 1).padStart(2, '0')}</span>
            <div class="project-check-text prose prose-compact">
              ${renderMarkdownWithMath(t.text || '', katexInst)}
            </div>
          </label>`;
      })
      .join('');

    const auditsHtml = audits
      .map((a, idx) => {
        const checked = Boolean(pState.checked_audits[a.id]);
        return `
          <label class="project-check-item${checked ? ' is-checked' : ''}">
            <input
              type="checkbox"
              data-proj-audit="${escapeHtml(a.id)}"
              data-proj-owner="${escapeHtml(proj.id)}"
              ${checked ? 'checked' : ''}
            >
            <span class="project-check-index">#${String(idx + 1).padStart(2, '0')}</span>
            <div class="project-check-text prose prose-compact">
              ${renderMarkdownWithMath(a.text || '', katexInst)}
            </div>
          </label>`;
      })
      .join('');

    els.projectsContainer.innerHTML = `
      <div class="project-selector-tabs" role="tablist" aria-label="Chọn đồ án học kỳ">
        ${tabsHtml}
      </div>

      <header class="page-masthead">
        <div class="eyebrow-label">Xưởng Đồ Án Nghiên Cứu Thực Chiến • ${escapeHtml(proj.code)}</div>
        <h1 class="page-title">${escapeHtml(proj.title)}</h1>
        <div class="project-firms-row">
          <span class="project-firms-label">Quỹ mục tiêu:</span>
          ${firms.map((f) => `<span class="prob-firm-tag">${escapeHtml(f)}</span>`).join('')}
        </div>
      </header>

      <section class="project-section-card">
        <div class="section-heading-row">
          <h2 class="section-heading-title">1. Thiết kế Dữ liệu &amp; Phân tách Ngoài mẫu</h2>
        </div>
        <div class="prose">
          ${renderMarkdownWithMath(proj.dataset_guide || '', katexInst)}
        </div>
      </section>

      <section class="project-section-card">
        <div class="section-heading-row">
          <h2 class="section-heading-title">2. Đặc tả Toán học &amp; Hàm Mục tiêu</h2>
        </div>
        <div class="prose">
          ${renderMarkdownWithMath(proj.math_formulation || '', katexInst)}
        </div>
      </section>

      <section class="project-section-card">
        <div class="section-heading-row">
          <h2 class="section-heading-title">3. Lộ trình Triển khai Kỹ thuật</h2>
          <span id="proj-tasks-counter" class="section-heading-count">${doneTasks} / ${tasks.length} hạng mục</span>
        </div>
        <div class="project-checklist">
          ${tasksHtml}
        </div>
      </section>

      <section class="project-section-card is-audit-card">
        <div class="section-heading-row">
          <h2 class="section-heading-title">4. Bảng Kiểm Duyệt Chống Bẫy Backtest Ảo</h2>
          <span id="proj-audits-badge" class="audit-status-badge${doneAudits === audits.length && audits.length > 0 ? ' is-complete' : ''}">
            ${doneAudits} / ${audits.length} tiêu chuẩn đạt
          </span>
        </div>
        <div class="project-checklist">
          ${auditsHtml}
        </div>
      </section>

      <section class="project-section-card">
        <div class="section-heading-row">
          <h2 class="section-heading-title">5. Hồ sơ Thực nghiệm Ngoài mẫu &amp; Nhật ký Bảo vệ</h2>
          <span class="section-heading-count">${state.isStaticHost ? 'Tự động lưu trên trình duyệt' : 'Tự động lưu vào ổ cứng'}</span>
        </div>

        <div class="project-form-grid">
          <div class="form-group">
            <label class="form-label" for="proj-input-repo">Liên kết kho mã nguồn tái lập</label>
            <input
              type="url"
              id="proj-input-repo"
              class="form-input is-mono"
              placeholder="https://github.com/username/quant-capstone"
              data-proj-field="repo_url"
              data-proj-owner="${escapeHtml(proj.id)}"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-input-paper">Đường dẫn Báo cáo Nghiên cứu LaTeX / PDF</label>
            <input
              type="text"
              id="proj-input-paper"
              class="form-input is-mono"
              placeholder="reports/capstone-01-whitepaper.pdf"
              data-proj-field="whitepaper_path"
              data-proj-owner="${escapeHtml(proj.id)}"
            >
          </div>
        </div>

        <div class="project-metrics-grid">
          <div class="form-group">
            <label class="form-label" for="proj-metric-sharpe">Tỷ số Sharpe ròng ngoài mẫu</label>
            <input
              type="text"
              id="proj-metric-sharpe"
              class="form-input is-mono"
              placeholder="Ví dụ: 1.85"
              data-proj-metric="sharpe"
              data-proj-owner="${escapeHtml(proj.id)}"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-metric-ic">RankIC / ICIR trung bình</label>
            <input
              type="text"
              id="proj-metric-ic"
              class="form-input is-mono"
              placeholder="Ví dụ: 0.032 / 1.40"
              data-proj-metric="ic"
              data-proj-owner="${escapeHtml(proj.id)}"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-metric-turnover">Vòng quay vốn 1 chiều / ngày</label>
            <input
              type="text"
              id="proj-metric-turnover"
              class="form-input is-mono"
              placeholder="Ví dụ: 18.5%"
              data-proj-metric="turnover"
              data-proj-owner="${escapeHtml(proj.id)}"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-metric-maxdd">Sụt giảm vốn tối đa</label>
            <input
              type="text"
              id="proj-metric-maxdd"
              class="form-input is-mono"
              placeholder="Ví dụ: -6.4%"
              data-proj-metric="max_dd"
              data-proj-owner="${escapeHtml(proj.id)}"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="proj-input-reflection">Nhật ký phản biện kết quả &amp; điểm yếu chiến lược (hỗ trợ Markdown + LaTeX)</label>
          <textarea
            id="proj-input-reflection"
            class="form-textarea"
            placeholder="Ghi lại giả thuyết kinh tế, lý do chiến lược suy giảm trong giai đoạn biến động cao, độ nhạy phí giao dịch và câu trả lời chuẩn bị cho hội đồng Superday..."
            data-proj-field="reflection"
            data-proj-owner="${escapeHtml(proj.id)}"
          ></textarea>
          <div id="proj-reflection-preview" class="project-reflection-preview prose prose-compact" hidden></div>
        </div>
      </section>
    `;

    // Populate input values via DOM properties (XSS-safe & preserves exact characters)
    const repoInput = document.getElementById('proj-input-repo');
    const paperInput = document.getElementById('proj-input-paper');
    const sharpeInput = document.getElementById('proj-metric-sharpe');
    const icInput = document.getElementById('proj-metric-ic');
    const turnoverInput = document.getElementById('proj-metric-turnover');
    const maxddInput = document.getElementById('proj-metric-maxdd');
    const reflInput = document.getElementById('proj-input-reflection');

    if (repoInput) repoInput.value = pState.repo_url;
    if (paperInput) paperInput.value = pState.whitepaper_path;
    if (sharpeInput) sharpeInput.value = pState.metrics.sharpe;
    if (icInput) icInput.value = pState.metrics.ic;
    if (turnoverInput) turnoverInput.value = pState.metrics.turnover;
    if (maxddInput) maxddInput.value = pState.metrics.max_dd;
    if (reflInput) reflInput.value = pState.reflection;
    renderProjectReflectionPreview(pState.reflection);
  }

  /* ------------------------------------------------------------------------
   * Router & Active Workspace Switching
   * ---------------------------------------------------------------------- */

  function renderCurrentWorkspace({ preserveScroll = false } = {}) {
    const view = state.route.view;
    for (const [k, sectionEl] of Object.entries(els.views)) {
      if (sectionEl) sectionEl.hidden = k !== view;
    }

    if (view !== 'lesson') {
      unmountActiveSimulator();
    }

    renderSidebarMetricsAndBadges();
    renderSidebarTree();

    if (view === 'roadmap') {
      renderRoadmapView();
      if (!preserveScroll) window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (view === 'lesson') {
      applySplitViewLayout();
      renderLessonView(state.route.lessonId || state.activeLessonId, { preserveScroll });
    } else if (view === 'problems') {
      renderProblemsView();
      if (!preserveScroll) window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (view === 'projects') {
      renderProjectsView(state.route.projectId || state.activeProjectId);
      if (!preserveScroll) window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function handleRouteChange() {
    if (!state.syllabus) return;
    const fallbackLesson =
      state.progress.last_active_lesson && state.lessonMap.has(state.progress.last_active_lesson)
        ? state.progress.last_active_lesson
        : state.orderedLessons[0]?.id || DEFAULT_LESSON_ID;

    const validLessons = new Set(state.lessonMap.keys());
    const validProjects = new Set(state.projectMap.keys());
    state.route = parseRouteHash(window.location.hash, fallbackLesson, validLessons, validProjects);

    closeMobileSidebar();
    renderCurrentWorkspace({ preserveScroll: false });
  }

  function toggleLessonCompleted(lessonId) {
    if (!lessonId) return;
    if (state.progress.completed_lessons[lessonId]) {
      delete state.progress.completed_lessons[lessonId];
    } else {
      state.progress.completed_lessons[lessonId] = true;
      recordStudyToday();
    }
    renderSidebarMetricsAndBadges();
    renderSidebarTree();
    const lesson = state.lessonMap.get(lessonId);
    if (lesson && state.route.view === 'lesson' && state.activeLessonId === lessonId) {
      updateReaderCompletionControls(lesson);
    }
    scheduleProgressSave(0);
  }

  /* ------------------------------------------------------------------------
   * Event Listeners Wiring
   * ---------------------------------------------------------------------- */

  function bindEvents() {
    window.addEventListener('hashchange', handleRouteChange);

    window.addEventListener('online', () => {
      if (window.localStorage.getItem(LOCAL_DIRTY_KEY) === '1') {
        persistProgressNow();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && state.saveTimer) {
        persistProgressNow();
      }
    });

    // Mobile drawer
    els.mobileMenuBtn?.addEventListener('click', toggleMobileSidebar);
    els.sidebarBackdrop?.addEventListener('click', closeMobileSidebar);

    // 4 Workspace nav buttons in sidebar
    for (const tabBtn of els.workspaceTabs) {
      tabBtn.addEventListener('click', () => {
        const targetView = tabBtn.getAttribute('data-nav-view');
        if (targetView === 'roadmap') {
          navigateToHash('#roadmap');
        } else if (targetView === 'lesson') {
          const targetLesson =
            state.activeLessonId
            || state.progress.last_active_lesson
            || DEFAULT_LESSON_ID;
          navigateToHash(`#lesson/${encodeURIComponent(targetLesson)}`);
        } else if (targetView === 'problems') {
          navigateToHash('#problems');
        } else if (targetView === 'projects') {
          navigateToHash(`#projects/${encodeURIComponent(state.activeProjectId || DEFAULT_PROJECT_ID)}`);
        }
      });
    }

    // Sidebar quick search & '/' keyboard shortcut
    els.searchInput?.addEventListener('input', () => {
      state.searchQuery = els.searchInput.value;
      const hasText = state.searchQuery.trim().length > 0;
      if (els.searchKbd) els.searchKbd.hidden = hasText;
      if (els.searchClearBtn) els.searchClearBtn.hidden = !hasText;
      renderSidebarTree();
    });

    els.searchInput?.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        els.searchInput.value = '';
        state.searchQuery = '';
        if (els.searchKbd) els.searchKbd.hidden = false;
        if (els.searchClearBtn) els.searchClearBtn.hidden = true;
        renderSidebarTree();
        els.searchInput.blur();
      } else if (evt.key === 'Enter') {
        const matched = getMatchingLessonsForQuery(state.searchQuery);
        if (matched && matched.size > 0) {
          const firstMatch = state.orderedLessons.find((l) => matched.has(l.id));
          if (firstMatch) {
            navigateToHash(`#lesson/${encodeURIComponent(firstMatch.id)}`);
          }
        }
      }
    });

    els.searchClearBtn?.addEventListener('click', () => {
      if (!els.searchInput) return;
      els.searchInput.value = '';
      state.searchQuery = '';
      if (els.searchKbd) els.searchKbd.hidden = false;
      els.searchClearBtn.hidden = true;
      renderSidebarTree();
      els.searchInput.focus();
    });

    document.addEventListener('keydown', (evt) => {
      if (evt.key !== '/' || evt.metaKey || evt.ctrlKey || evt.altKey) return;
      const active = document.activeElement;
      const tag = active?.tagName;
      if (
        tag === 'INPUT'
        || tag === 'TEXTAREA'
        || tag === 'SELECT'
        || active?.isContentEditable
      ) {
        return;
      }
      evt.preventDefault();
      if (window.innerWidth <= 880 && els.sidebar && !els.sidebar.classList.contains('is-mobile-open')) {
        toggleMobileSidebar();
      }
      els.searchInput?.focus();
      els.searchInput?.select();
    });

    // Collapsible module toggles in sidebar
    els.moduleTree?.addEventListener('click', (evt) => {
      const toggleBtn = evt.target.closest('[data-toggle-module]');
      if (!toggleBtn) return;
      const modId = toggleBtn.getAttribute('data-toggle-module');
      if (!modId) return;
      if (state.collapsedModules.has(modId)) {
        state.collapsedModules.delete(modId);
      } else {
        state.collapsedModules.add(modId);
      }
      renderSidebarTree();
    });

    // JSON Backup Export & Restore
    els.btnExportBackup?.addEventListener('click', () => {
      try {
        const normalized = normalizeProgressPayload(state.progress);
        const blob = new Blob([`${JSON.stringify(normalized, null, 2)}\n`], {
          type: 'application/json;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quant-research-backup-${getTodayIso()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showSidebarToast('Đã xuất tệp sao lưu JSON thành công.');
      } catch (err) {
        showSidebarToast(err.message || 'Không thể tạo tệp sao lưu.', true);
      }
    });

    els.btnImportBackup?.addEventListener('click', () => {
      els.inputImportBackup?.click();
    });

    els.inputImportBackup?.addEventListener('change', async () => {
      const file = els.inputImportBackup.files?.[0];
      els.inputImportBackup.value = '';
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const validated = normalizeProgressPayload(parsed);
        state.progress = validated;
        await persistProgressNow();
        if (state.route.view === 'lesson') {
          const curLesson = state.lessonMap.get(state.activeLessonId);
          if (curLesson) syncNotesEditorForLesson(curLesson);
        }
        renderCurrentWorkspace({ preserveScroll: true });
        showSidebarToast('Đã khôi phục toàn bộ dữ liệu tiến độ.');
      } catch (err) {
        showSidebarToast(err.message || 'Tệp JSON không đúng định dạng tiến độ.', true);
      }
    });

    // Roadmap interactions (Milestones + Quick Due Reviews button)
    els.roadmapContainer?.addEventListener('change', (evt) => {
      const msBox = evt.target.closest('[data-milestone-id]');
      if (!msBox) return;
      const msId = msBox.getAttribute('data-milestone-id');
      if (!msId) return;
      if (msBox.checked) {
        state.progress.completed_milestones[msId] = true;
        recordStudyToday();
      } else {
        delete state.progress.completed_milestones[msId];
      }
      msBox.closest('.milestone-item')?.classList.toggle('is-checked', msBox.checked);
      const semBlock = msBox.closest('.semester-block');
      if (semBlock) {
        const allBoxes = semBlock.querySelectorAll('.milestone-checkbox');
        let checkedCount = 0;
        for (const box of allBoxes) {
          if (box.checked) checkedCount += 1;
        }
        const metaEl = semBlock.querySelector('.semester-progress-meta');
        if (metaEl) {
          metaEl.textContent = `Cột mốc tuyển dụng: ${checkedCount} / ${allBoxes.length}`;
        }
      }
      renderSidebarMetricsAndBadges();
      scheduleProgressSave(0);
    });

    els.roadmapContainer?.addEventListener('click', (evt) => {
      const retryBtn = evt.target.closest('[data-open-retry-problems]');
      if (!retryBtn) return;
      state.problemFilters.queue = 'retry';
      state.problemFilters.module = 'all';
      state.problemFilters.difficulty = 'all';
      state.problemFilters.firm = 'all';
      navigateToHash('#problems');
    });

    // Reader toolbar & Split View interactions
    els.btnReaderQuickComplete?.addEventListener('click', () => {
      toggleLessonCompleted(state.activeLessonId);
    });

    els.lessonFooterNav?.addEventListener('click', (evt) => {
      if (evt.target.closest('#btn-lesson-bottom-complete')) {
        toggleLessonCompleted(state.activeLessonId);
        return;
      }
      const drillBtn = evt.target.closest('[data-drill-module]');
      if (drillBtn) {
        const modId = drillBtn.getAttribute('data-drill-module') || 'all';
        state.problemFilters.module = modId;
        state.problemFilters.queue = 'all';
        navigateToHash('#problems');
      }
    });

    els.readingsSection?.addEventListener('change', (evt) => {
      const rBox = evt.target.closest('[data-reading-id]');
      if (!rBox) return;
      const rId = rBox.getAttribute('data-reading-id');
      if (!rId) return;
      if (rBox.checked) {
        state.progress.completed_readings[rId] = true;
        recordStudyToday();
      } else {
        delete state.progress.completed_readings[rId];
      }
      rBox.closest('.reading-card')?.classList.toggle('is-checked', rBox.checked);
      const lesson = state.lessonMap.get(state.activeLessonId);
      if (lesson) {
        const countEl = document.getElementById('readings-progress-count');
        const done = (lesson.readings || []).filter((r) => state.progress.completed_readings[r.id]).length;
        if (countEl) countEl.textContent = `${done} / ${(lesson.readings || []).length} tài liệu`;
      }
      renderSidebarMetricsAndBadges();
      scheduleProgressSave(0);
    });

    els.readingsSection?.addEventListener('click', (evt) => {
      const openBtn = evt.target.closest('[data-open-library-split]');
      if (openBtn) {
        const targetFile = openBtn.getAttribute('data-library-file') || '';
        if (
          targetFile &&
          (state.libraryFiles.length === 0 || state.libraryFiles.some((f) => f.name === targetFile))
        ) {
          state.selectedLibraryFile = targetFile;
          if (els.librarySelect && state.libraryFiles.some((f) => f.name === targetFile)) {
            els.librarySelect.value = targetFile;
          }
        }
        state.splitOpen = true;
        state.splitTab = 'library';
        applySplitViewLayout();
      }
    });

    els.btnToggleSplit?.addEventListener('click', () => {
      state.splitOpen = !state.splitOpen;
      applySplitViewLayout();
    });

    els.btnCloseSplit?.addEventListener('click', () => {
      state.splitOpen = false;
      applySplitViewLayout();
    });

    for (const tabBtn of els.splitTabs) {
      tabBtn.addEventListener('click', () => {
        const nextTab = tabBtn.getAttribute('data-split-tab');
        if (nextTab) {
          state.splitTab = nextTab;
          applySplitViewLayout();
        }
      });
    }

    for (const modeBtn of els.notesModeBtns) {
      modeBtn.addEventListener('click', () => {
        const mode = modeBtn.getAttribute('data-notes-mode') || 'both';
        state.notesMode = mode;
        for (const b of els.notesModeBtns) {
          b.classList.toggle('is-active', b === modeBtn);
        }
        if (els.notesWorkbench) {
          els.notesWorkbench.className = `notes-workbench mode-${mode}`;
        }
      });
    }

    // 600ms debounced LaTeX notes scratchpad (never re-mounts textarea while typing!)
    els.notesInput?.addEventListener('input', () => {
      const lid = state.activeLessonId;
      if (!lid) return;
      state.progress.lesson_notes[lid] = els.notesInput.value;
      recordStudyToday();
      renderNotesPreview();
      renderSidebarMetricsAndBadges();
      scheduleProgressSave(600);
    });

    // Library controls
    els.librarySelect?.addEventListener('change', () => {
      state.selectedLibraryFile = els.librarySelect.value;
      renderSelectedLibraryDocument();
    });

    els.btnRefreshLibrary?.addEventListener('click', () => {
      refreshLibraryList(true);
    });

    // Problem Drill filters, scratchpad, answer auto-check & progressive hints
    function handleCheckProblem(probId) {
      const prob = state.problems.find((p) => p.id === probId);
      if (!prob || !prob.answer_check) return;
      const cardEl = els.problemsContainer
        ? [...els.problemsContainer.querySelectorAll('[data-problem-card]')].find(
            (el) => el.getAttribute('data-problem-card') === probId
          )
        : null;
      const inputEl = cardEl?.querySelector('[data-prob-answer-input]');
      const scratchEl = cardEl?.querySelector('[data-prob-scratch]');
      const rawAnswer = inputEl ? inputEl.value : ensureProblemAttempt(probId).answer;

      const att = ensureProblemAttempt(probId);
      att.answer = rawAnswer;
      if (scratchEl) att.scratch = scratchEl.value;

      const verdict = checkProblemAnswer(rawAnswer, prob.answer_check);
      if (verdict.empty) {
        state.problemNotices[probId] = 'Hãy điền một con số hoặc phân số trước khi kiểm tra';
        rerenderSingleProblemCard(probId);
        return;
      }
      if (verdict.invalid) {
        state.problemNotices[probId] = 'Định dạng chưa hợp lệ — hãy nhập số, phân số 1/6 hoặc %';
        rerenderSingleProblemCard(probId);
        return;
      }

      delete state.problemNotices[probId];
      att.status = verdict.ok ? 'correct' : 'incorrect';
      recordStudyToday();
      renderSidebarMetricsAndBadges();
      if (state.problemFilters.queue === 'all') {
        rerenderSingleProblemCard(probId);
      } else {
        renderProblemsListOnly();
      }
      scheduleProgressSave(0);
    }

    els.problemsContainer?.addEventListener('change', (evt) => {
      const sel = evt.target.closest('[data-prob-filter]');
      if (!sel) return;
      const key = sel.getAttribute('data-prob-filter');
      if (key && key in state.problemFilters) {
        state.problemFilters[key] = sel.value;
        renderProblemsListOnly();
      }
    });

    els.problemsContainer?.addEventListener('input', (evt) => {
      const scratchEl = evt.target.closest('[data-prob-scratch]');
      if (scratchEl) {
        const probId = scratchEl.getAttribute('data-prob-scratch');
        if (probId) {
          const att = ensureProblemAttempt(probId);
          att.scratch = scratchEl.value;
          scheduleProgressSave(400);
        }
        return;
      }
      const ansEl = evt.target.closest('[data-prob-answer-input]');
      if (ansEl) {
        const probId = ansEl.getAttribute('data-prob-answer-input');
        if (probId) {
          const att = ensureProblemAttempt(probId);
          att.answer = ansEl.value;
          scheduleProgressSave(400);
        }
      }
    });

    els.problemsContainer?.addEventListener('keydown', (evt) => {
      if (evt.key !== 'Enter') return;
      const ansEl = evt.target.closest('[data-prob-answer-input]');
      if (!ansEl) return;
      evt.preventDefault();
      const probId = ansEl.getAttribute('data-prob-answer-input');
      if (probId) handleCheckProblem(probId);
    });

    els.problemsContainer?.addEventListener('click', (evt) => {
      const checkBtn = evt.target.closest('[data-prob-check]');
      if (checkBtn) {
        const probId = checkBtn.getAttribute('data-prob-check');
        if (probId) handleCheckProblem(probId);
        return;
      }

      const actionBtn = evt.target.closest('[data-prob-action]');
      if (actionBtn) {
        const probId = actionBtn.getAttribute('data-prob-id');
        const action = actionBtn.getAttribute('data-prob-action');
        if (!probId || !action) return;
        const cur = state.problemReveals[probId] || { hint1: false, hint2: false, solution: false };
        if (action === 'hint1') cur.hint1 = !cur.hint1;
        else if (action === 'hint2') cur.hint2 = !cur.hint2;
        else if (action === 'solution') cur.solution = !cur.solution;
        state.problemReveals[probId] = cur;
        rerenderSingleProblemCard(probId);
      }
    });

    // Capstone Lab interactions
    els.projectsContainer?.addEventListener('click', (evt) => {
      const tabBtn = evt.target.closest('[data-select-project]');
      if (!tabBtn) return;
      const pid = tabBtn.getAttribute('data-select-project');
      if (pid) {
        navigateToHash(`#projects/${encodeURIComponent(pid)}`);
      }
    });

    els.projectsContainer?.addEventListener('change', (evt) => {
      const taskBox = evt.target.closest('[data-proj-task]');
      if (taskBox) {
        const pid = taskBox.getAttribute('data-proj-owner');
        const tid = taskBox.getAttribute('data-proj-task');
        const proj = state.projectMap.get(pid);
        if (!pid || !tid || !proj) return;
        const rec = ensureProjectRecord(pid);
        if (taskBox.checked) {
          rec.checked_tasks[tid] = true;
          recordStudyToday();
        } else {
          delete rec.checked_tasks[tid];
        }
        taskBox.closest('.project-check-item')?.classList.toggle('is-checked', taskBox.checked);
        updateProjectCountersDom(proj);
        renderSidebarMetricsAndBadges();
        scheduleProgressSave(0);
        return;
      }

      const auditBox = evt.target.closest('[data-proj-audit]');
      if (auditBox) {
        const pid = auditBox.getAttribute('data-proj-owner');
        const aid = auditBox.getAttribute('data-proj-audit');
        const proj = state.projectMap.get(pid);
        if (!pid || !aid || !proj) return;
        const rec = ensureProjectRecord(pid);
        if (auditBox.checked) {
          rec.checked_audits[aid] = true;
          recordStudyToday();
        } else {
          delete rec.checked_audits[aid];
        }
        auditBox.closest('.project-check-item')?.classList.toggle('is-checked', auditBox.checked);
        updateProjectCountersDom(proj);
        renderSidebarMetricsAndBadges();
        scheduleProgressSave(0);
      }
    });

    els.projectsContainer?.addEventListener('input', (evt) => {
      const fieldEl = evt.target.closest('[data-proj-field]');
      if (fieldEl) {
        const pid = fieldEl.getAttribute('data-proj-owner');
        const field = fieldEl.getAttribute('data-proj-field');
        if (!pid || !field) return;
        const rec = ensureProjectRecord(pid);
        rec[field] = fieldEl.value;
        if (field === 'reflection') {
          renderProjectReflectionPreview(fieldEl.value);
        }
        recordStudyToday();
        renderSidebarMetricsAndBadges();
        scheduleProgressSave(600);
        return;
      }

      const metricEl = evt.target.closest('[data-proj-metric]');
      if (metricEl) {
        const pid = metricEl.getAttribute('data-proj-owner');
        const mKey = metricEl.getAttribute('data-proj-metric');
        if (!pid || !mKey) return;
        const rec = ensureProjectRecord(pid);
        rec.metrics[mKey] = metricEl.value;
        recordStudyToday();
        renderSidebarMetricsAndBadges();
        scheduleProgressSave(600);
      }
    });

    // Notion-style Inline Notes: section "+ Ghi chú", text-selection popover & card actions
    function finishEditingInlineNote(scopeKey, noteId) {
      if (!scopeKey || !noteId) return;
      state.editingNoteIds.delete(noteId);
      state.expandedNoteIds.delete(noteId);
      const list = state.progress.inline_notes[scopeKey] || [];
      const target = list.find((n) => n.id === noteId);
      if (target && !target.text.trim()) {
        deleteInlineNote(state.progress.inline_notes, scopeKey, noteId);
      }
      remountScopeInlineNotes(scopeKey);
      scheduleProgressSave(0);
    }

    let selectionCheckTimer = null;
    let selectionHideTimer = null;

    function cancelSelectionHideTimer() {
      if (selectionHideTimer) {
        clearTimeout(selectionHideTimer);
        selectionHideTimer = null;
      }
    }

    function scheduleDelayedHideSelectionPopover(delayMs = 220) {
      cancelSelectionHideTimer();
      selectionHideTimer = setTimeout(() => {
        selectionHideTimer = null;
        hideSelectionPopover();
      }, delayMs);
    }

    function checkTextSelectionForNote({ immediateHide = false } = {}) {
      if (typeof window === 'undefined' || !els.selectionPopover) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        if (immediateHide) hideSelectionPopover();
        else scheduleDelayedHideSelectionPopover(240);
        return;
      }
      const selectedText = sel.toString().replace(/\s+/g, ' ').trim();
      if (selectedText.length < 2) {
        if (immediateHide) hideSelectionPopover();
        else scheduleDelayedHideSelectionPopover(240);
        return;
      }

      const range = sel.getRangeAt(0);
      const anchorNode =
        range.commonAncestorContainer.nodeType === 1
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;
      if (!anchorNode || anchorNode.closest('.inline-note-stack')) {
        hideSelectionPopover();
        return;
      }

      const scopeEl = anchorNode.closest('[data-note-scope]');
      const blockEl = anchorNode.closest('[data-note-block-idx]');
      if (!scopeEl || !blockEl || !scopeEl.contains(blockEl)) {
        hideSelectionPopover();
        return;
      }

      const scopeKey = scopeEl.getAttribute('data-note-scope');
      const blockIdx = Number(blockEl.getAttribute('data-note-block-idx')) || 0;
      const rect = range.getBoundingClientRect();
      if (!scopeKey || (rect.width === 0 && rect.height === 0)) {
        return;
      }

      cancelSelectionHideTimer();
      state.pendingSelection = {
        scopeKey,
        blockIdx,
        quote: selectedText.slice(0, 240),
      };

      const isTouchOrTablet =
        window.innerWidth <= 1024 ||
        Boolean(window.matchMedia?.('(pointer: coarse)')?.matches) ||
        rect.top < 72;

      const leftPx = Math.min(
        window.innerWidth - 95,
        Math.max(95, rect.left + rect.width / 2)
      );
      const rawBottom = typeof rect.bottom === 'number' ? rect.bottom : rect.top + rect.height;
      const topPx = isTouchOrTablet
        ? Math.min(window.innerHeight - 52, Math.max(44, rawBottom + 10))
        : Math.max(44, rect.top - 8);

      els.selectionPopover.classList.toggle('is-below', isTouchOrTablet);
      els.selectionPopover.style.left = `${Math.round(leftPx)}px`;
      els.selectionPopover.style.top = `${Math.round(topPx)}px`;
      els.selectionPopover.hidden = false;
    }

    function scheduleSelectionCheck(delayMs = 55) {
      if (selectionCheckTimer) clearTimeout(selectionCheckTimer);
      selectionCheckTimer = setTimeout(() => {
        selectionCheckTimer = null;
        checkTextSelectionForNote({ immediateHide: false });
      }, delayMs);
    }

    document.addEventListener('selectionchange', () => {
      scheduleSelectionCheck(55);
    });
    document.addEventListener('mouseup', () => {
      window.requestAnimationFrame(() => checkTextSelectionForNote({ immediateHide: true }));
    });
    document.addEventListener('touchend', () => {
      scheduleSelectionCheck(70);
    }, { passive: true });
    document.addEventListener('keyup', (evt) => {
      if (evt.key.startsWith('Arrow') || evt.key === 'Shift') {
        checkTextSelectionForNote({ immediateHide: true });
      }
    });

    function consumePendingSelectionToNote(evt) {
      const pending = state.pendingSelection;
      if (!pending) return;
      evt.preventDefault?.();
      evt.stopPropagation?.();
      if (selectionCheckTimer) {
        clearTimeout(selectionCheckTimer);
        selectionCheckTimer = null;
      }
      cancelSelectionHideTimer();
      hideSelectionPopover();
      window.getSelection()?.removeAllRanges?.();

      const rec = upsertInlineNote(state.progress.inline_notes, pending.scopeKey, {
        block_index: pending.blockIdx,
        quote: pending.quote,
        text: '',
      });
      if (rec) {
        state.editingNoteIds.add(rec.id);
        recordStudyToday();
        renderSidebarMetricsAndBadges();
        remountScopeInlineNotes(pending.scopeKey, rec.id);
        scheduleProgressSave(300);
      }
    }

    els.btnSelectionAddNote?.addEventListener('touchstart', consumePendingSelectionToNote, { passive: false });
    els.btnSelectionAddNote?.addEventListener('pointerdown', consumePendingSelectionToNote);
    els.btnSelectionAddNote?.addEventListener('mousedown', consumePendingSelectionToNote);
    els.btnSelectionAddNote?.addEventListener('click', consumePendingSelectionToNote);

    document.addEventListener('click', (evt) => {
      const addBlockBtn = evt.target.closest('[data-add-block-note]');
      if (addBlockBtn) {
        evt.preventDefault();
        const scopeKey = addBlockBtn.getAttribute('data-note-scope-owner');
        const blockIdx = Number(addBlockBtn.getAttribute('data-add-block-note')) || 0;
        if (!scopeKey) return;
        const rec = upsertInlineNote(state.progress.inline_notes, scopeKey, {
          block_index: blockIdx,
          quote: '',
          text: '',
        });
        if (rec) {
          state.editingNoteIds.add(rec.id);
          recordStudyToday();
          renderSidebarMetricsAndBadges();
          remountScopeInlineNotes(scopeKey, rec.id);
        }
        return;
      }

      const toggleBtn = evt.target.closest('[data-inline-note-toggle]');
      if (toggleBtn) {
        const noteId = toggleBtn.getAttribute('data-inline-note-toggle');
        const scopeKey = toggleBtn.getAttribute('data-note-scope-owner');
        if (scopeKey && noteId) {
          if (state.expandedNoteIds.has(noteId)) {
            state.expandedNoteIds.delete(noteId);
          } else {
            state.expandedNoteIds.add(noteId);
          }
          remountScopeInlineNotes(scopeKey);
        }
        return;
      }

      const doneBtn = evt.target.closest('[data-inline-note-done]');
      if (doneBtn) {
        const noteId = doneBtn.getAttribute('data-inline-note-done');
        const scopeKey = doneBtn.getAttribute('data-note-scope-owner');
        finishEditingInlineNote(scopeKey, noteId);
        return;
      }

      const deleteBtn = evt.target.closest('[data-inline-note-delete]');
      if (deleteBtn) {
        const noteId = deleteBtn.getAttribute('data-inline-note-delete');
        const scopeKey = deleteBtn.getAttribute('data-note-scope-owner');
        if (scopeKey && noteId) {
          state.editingNoteIds.delete(noteId);
          state.expandedNoteIds.delete(noteId);
          deleteInlineNote(state.progress.inline_notes, scopeKey, noteId);
          remountScopeInlineNotes(scopeKey);
          scheduleProgressSave(0);
        }
        return;
      }

      const editTrigger = evt.target.closest('[data-inline-note-edit]');
      if (editTrigger && !evt.target.closest('a')) {
        const noteId = editTrigger.getAttribute('data-inline-note-edit');
        const scopeKey = editTrigger.getAttribute('data-note-scope-owner');
        if (scopeKey && noteId) {
          state.expandedNoteIds.delete(noteId);
          state.editingNoteIds.add(noteId);
          remountScopeInlineNotes(scopeKey, noteId);
        }
      }
    });

    document.addEventListener('input', (evt) => {
      const noteInput = evt.target.closest('[data-inline-note-input]');
      if (!noteInput) return;
      if (noteInput.style && noteInput.scrollHeight) {
        noteInput.style.height = 'auto';
        noteInput.style.height = `${Math.max(44, noteInput.scrollHeight)}px`;
      }
      const noteId = noteInput.getAttribute('data-inline-note-input');
      const scopeKey = noteInput.getAttribute('data-note-scope-owner');
      if (!scopeKey || !noteId) return;
      const list = state.progress.inline_notes[scopeKey] || [];
      const existing = list.find((n) => n.id === noteId);
      if (existing) {
        existing.text = noteInput.value;
      } else {
        upsertInlineNote(state.progress.inline_notes, scopeKey, {
          id: noteId,
          block_index: Number(noteInput.getAttribute('data-note-block')) || 0,
          quote: noteInput.getAttribute('data-note-quote') || '',
          text: noteInput.value,
        });
      }
      recordStudyToday();
      scheduleProgressSave(350);
    });

    document.addEventListener('keydown', (evt) => {
      const noteInput = evt.target.closest('[data-inline-note-input]');
      if (!noteInput) return;
      if ((evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) || evt.key === 'Escape') {
        evt.preventDefault();
        const noteId = noteInput.getAttribute('data-inline-note-input');
        const scopeKey = noteInput.getAttribute('data-note-scope-owner');
        finishEditingInlineNote(scopeKey, noteId);
      }
    });

    // Update reading hairline progress bar on scroll inside #view-lesson
    const updateReaderScrollProgress = () => {
      hideSelectionPopover();
      if (!els.readerScrollProgress || state.route.view !== 'lesson') return;
      const docEl = document.documentElement;
      const maxScroll = Math.max(0, docEl.scrollHeight - window.innerHeight);
      const pct = maxScroll > 10 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
      els.readerScrollProgress.style.width = `${pct.toFixed(1)}%`;
    };
    window.addEventListener('scroll', updateReaderScrollProgress, { passive: true });

    // Re-render math cleanly once deferred KaTeX script finishes loading
    const handleKatexLoaded = () => {
      if (state.katexLoadedOnce || !getKatex()) return;
      state.katexLoadedOnce = true;
      if (state.syllabus) {
        renderCurrentWorkspace({ preserveScroll: true });
      }
    };
    const katexScriptEl = document.getElementById('katex-script');
    katexScriptEl?.addEventListener('load', handleKatexLoaded);
    window.addEventListener('load', handleKatexLoaded);
  }

  /* ------------------------------------------------------------------------
   * Initial Data Bootstrap
   * ---------------------------------------------------------------------- */

  async function fetchJsonStrict(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('json')) {
      const txt = await resp.text();
      return JSON.parse(txt);
    }
    return resp.json();
  }

  async function init() {
    bindEvents();

    let sylData = null;
    let probData = null;
    let progRes = { status: 'rejected' };
    let libData = null;

    // Probe local Python backend (/api/syllabus); if unavailable (e.g. Vercel), switch to Static Mode
    try {
      sylData = await fetchJsonStrict('/api/syllabus');
      state.isStaticHost = false;
    } catch {
      state.isStaticHost = true;
    }

    if (!state.isStaticHost) {
      const [probSettled, progSettled, libSettled] = await Promise.allSettled([
        fetchJsonStrict('/api/problems'),
        fetchJsonStrict('/api/progress'),
        fetchJsonStrict('/api/library'),
      ]);
      if (probSettled.status === 'fulfilled') probData = probSettled.value;
      progRes = progSettled;
      if (libSettled.status === 'fulfilled') libData = libSettled.value;
    } else {
      const [sylSettled, probSettled, libSettled] = await Promise.allSettled([
        fetchJsonStrict('/static-content/syllabus.json'),
        fetchJsonStrict('/static-content/problems.json'),
        fetchJsonStrict('/static-content/library-index.json'),
      ]);
      if (sylSettled.status === 'fulfilled') sylData = sylSettled.value;
      if (probSettled.status === 'fulfilled') probData = probSettled.value;
      if (libSettled.status === 'fulfilled') libData = libSettled.value;
    }

    // 1. Progress state (browser localStorage in Static Mode; disk + offline draft in Local Mode)
    let loadedProgress = createDefaultProgress();
    let needsOfflineSync = false;

    try {
      const dirtyFlag = window.localStorage.getItem(LOCAL_DIRTY_KEY);
      const rawDraft = window.localStorage.getItem(LOCAL_DRAFT_KEY);
      if (state.isStaticHost) {
        if (rawDraft) {
          loadedProgress = normalizeProgressPayload(JSON.parse(rawDraft));
        }
      } else if (dirtyFlag === '1' && rawDraft) {
        loadedProgress = normalizeProgressPayload(JSON.parse(rawDraft));
        needsOfflineSync = true;
      } else if (progRes.status === 'fulfilled') {
        loadedProgress = normalizeProgressPayload(progRes.value);
      } else if (rawDraft) {
        loadedProgress = normalizeProgressPayload(JSON.parse(rawDraft));
      }
    } catch {
      if (!state.isStaticHost && progRes.status === 'fulfilled') {
        try {
          loadedProgress = normalizeProgressPayload(progRes.value);
        } catch {
          loadedProgress = createDefaultProgress();
        }
      }
    }
    state.progress = loadedProgress;

    if (state.isStaticHost) {
      saveLocalDraft(false);
      setSaveStatus('saved');
    } else if (progRes.status === 'rejected') {
      setSaveStatus('offline');
    } else if (needsOfflineSync) {
      persistProgressNow();
    } else {
      setSaveStatus('saved');
    }

    // 2. Problems bank
    if (Array.isArray(probData?.problems)) {
      state.problems = probData.problems;
    }

    // 3. Library files
    if (Array.isArray(libData?.files)) {
      state.libraryFiles = libData.files;
      const firstPdf = state.libraryFiles.find((f) => f.ext === '.pdf');
      if (state.libraryFiles.length > 0) {
        state.selectedLibraryFile = firstPdf ? firstPdf.name : state.libraryFiles[0].name;
      }
    }
    populateLibrarySelectDom();

    // 4. Syllabus & Route activation
    if (sylData) {
      indexSyllabus(sylData);
      state.katexLoadedOnce = Boolean(getKatex());
      handleRouteChange();
    } else if (els.roadmapContainer) {
      els.roadmapContainer.innerHTML =
        '<div class="empty-state">Không thể tải dữ liệu khung chương trình. Hãy kiểm tra kết nối mạng hoặc chạy <code>python3 server.py</code>.</div>';
    }
  }

  init();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBrowserApp, { once: true });
  } else {
    bootBrowserApp();
  }
}
