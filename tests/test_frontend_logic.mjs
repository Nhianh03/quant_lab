import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { computeNextReview, isProblemDue } from '../web/js/spaced_repetition.js';
import { renderMarkdownWithMath } from '../web/js/markdown_math.js';
import { mountSimulator } from '../web/js/simulators.js';
import {
  computeStreakStats,
  createDefaultProgress,
  createDefaultProjectState,
  filterProblemsList,
  formatDifficultyLabel,
  normalizeProgressPayload,
  parseRouteHash,
  stripLeadingMarkdownH1,
} from '../web/js/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.resolve(__dirname, '..');

test('SM-2 schedules again=1d, hard=3d, good escalating intervals', () => {
  assert.equal(isProblemDue(null, '2026-11-16'), false);
  assert.equal(isProblemDue(undefined, '2026-11-16'), false);

  const r1 = computeNextReview(null, 'good', '2026-11-16');
  assert.equal(r1.interval_days, 4);
  assert.equal(r1.repetitions, 1);
  assert.equal(r1.last_grade, 'good');
  assert.equal(r1.next_due, '2026-11-20');
  assert.equal(isProblemDue(r1, '2026-11-19'), false);
  assert.equal(isProblemDue(r1, '2026-11-20'), true);
  assert.equal(isProblemDue(r1, '2026-11-25'), true);

  const r2 = computeNextReview(r1, 'good', '2026-11-20');
  assert.ok(r2.interval_days >= 9);
  assert.equal(r2.repetitions, 2);

  const hardFirst = computeNextReview(null, 'hard', '2026-11-16');
  assert.equal(hardFirst.interval_days, 3);
  assert.equal(hardFirst.next_due, '2026-11-19');
  assert.equal(hardFirst.last_grade, 'hard');

  const reset = computeNextReview(r2, 'again', '2026-11-30');
  assert.equal(reset.interval_days, 1);
  assert.equal(reset.repetitions, 0);
  assert.equal(reset.next_due, '2026-12-01');
  assert.equal(reset.last_grade, 'again');

  // Ease factor never drops below 1.3 even after repeated 'again' grades
  let state = reset;
  for (let i = 0; i < 15; i += 1) {
    state = computeNextReview(state, 'again', '2026-12-02');
  }
  assert.ok(state.ease >= 1.3);
});

test('Markdown renderer preserves underscores and asterisks inside LaTeX blocks', () => {
  const md = [
    '# Định lý Kyle',
    'Phương trình giá: $\\Delta P_t = \\lambda Q_t + \\varepsilon_t$ và $w^*_i = \\Sigma^{-1}_{ij}\\alpha_j$.',
    '',
    '$$',
    '\\text{Var}(X_t) = \\mathbb{E}[\\text{Var}(X_t \\mid \\mathcal{F}_{s})] + \\text{Var}(\\mathbb{E}[X_t \\mid \\mathcal{F}_{s}])',
    '$$',
    '',
    '| Cột | Giá trị |',
    '| :--- | ---: |',
    '| IC | `0.04` |'
  ].join('\n');

  const html = renderMarkdownWithMath(md, null);
  assert.ok(html.includes('<h1>Định lý Kyle</h1>'));
  assert.ok(html.includes('\\Sigma^{-1}_{ij}\\alpha_j'));
  assert.ok(!html.includes('<em>ij'));
  assert.ok(html.includes('<table>'));
  assert.ok(html.includes('<code>0.04</code>'));
});

test('Markdown renderer handles escaped literal dollars, double-backtick code, callouts, tables with pipes in math, and XSS safety', () => {
  const md = [
    'Mỗi thanh giá trị gom \\$50 triệu khớp lệnh trên vốn \\$100 triệu, trong khi giá thô **$\\$140.00$**.',
    '',
    'Bản ghi ``(ticker=\'XYZ\', quarter=\'2024Q4\', eps=1.85)`` và `EPS = $2.40` tới `adj_close > $5`.',
    '',
    '```python',
    'def pnl(w_i, r_i): # $not_math_at_all$ and <tag>',
    '    return w_i * r_i',
    '```',
    '',
    '> [!IMPORTANT]',
    '> **Lưu ý Kiểm thử:** Ràng buộc $|w_i| \\le 2\\%$ với công thức:',
    '> $$w_i^\\star = \\frac{1}{\\gamma \\sigma_i^2}(\\alpha_i - \\bar{\\alpha})$$',
    '> 1. Bước một kiểm tra $t_{\\text{known}} \\le t$.',
    '> 2. Bước hai kiểm tra `PIT`.',
    '',
    '| Ràng buộc | Biểu thức |',
    '| :---: | :--- |',
    '| Trần vị thế | $|w_i| \\le 0.02$ và $\\mathbb{E}[r \\mid \\mathcal{F}_t]$ |',
    '',
    'Liên kết an toàn [Bài M1](#lesson/m1-01) và chặn [XSS](javascript:alert(1)) cùng <script>alert(1)</script>.'
  ].join('\n');

  const calls = [];
  const mockKatex = {
    renderToString(tex, opts) {
      calls.push({ tex, displayMode: opts.displayMode });
      return `<span data-katex="${opts.displayMode ? 'display' : 'inline'}">${tex}</span>`;
    }
  };

  const html = renderMarkdownWithMath(md, mockKatex);

  // Escaped \$ in prose rendered as literal $, without opening math mode
  assert.ok(html.includes('$50 triệu'));
  assert.ok(html.includes('$100 triệu'));
  assert.ok(!html.includes('\\$50'));
  // \$ inside inline math preserved for KaTeX
  assert.ok(calls.some((c) => c.tex === '\\$140.00' && c.displayMode === false));

  // Double-backtick inline code and $ inside inline code preserved without math mangling
  assert.ok(html.includes("<code>(ticker=&#39;XYZ&#39;, quarter=&#39;2024Q4&#39;, eps=1.85)</code>") || html.includes("<code>(ticker='XYZ', quarter='2024Q4', eps=1.85)</code>"));
  assert.ok(html.includes('<code>EPS = $2.40</code>'));
  assert.ok(html.includes('<code>adj_close &gt; $5</code>'));
  assert.ok(!calls.some((c) => c.tex.includes('not_math_at_all')));
  assert.ok(!calls.some((c) => c.tex.includes('2.40')));

  // Callout rendered with display math and ordered list inside
  assert.ok(html.includes('callout-important'));
  assert.ok(calls.some((c) => c.displayMode === true && c.tex.includes('w_i^\\star')));
  assert.ok(html.includes('<ol>'));

  // Table cell containing |w_i| and \mid did not split into extra columns
  const tbodyRowMatch = html.match(/<tbody><tr>([\s\S]*?)<\/tr><\/tbody>/);
  assert.ok(tbodyRowMatch);
  const tdCount = (tbodyRowMatch[1].match(/<td\b/g) || []).length;
  assert.equal(tdCount, 2);

  // Safe link allowed, javascript: link and <script> neutralized
  assert.ok(html.includes('href="#lesson/m1-01"'));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('All 20 lessons, READING_GUIDE, and 40 problems render cleanly with zero leftover tokens', () => {
  const lessonsDir = path.join(APP_ROOT, 'content', 'lessons');
  const lessonFiles = fs.readdirSync(lessonsDir).filter((f) => f.endsWith('.md')).sort();
  assert.equal(lessonFiles.length, 20);

  const mockKatex = {
    renderToString(tex, opts) {
      const rendered = tex.replace(/\\\$/g, '$').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<katex-${opts.displayMode ? 'block' : 'inline'}>${rendered}</katex-${opts.displayMode ? 'block' : 'inline'}>`;
    }
  };

  for (const file of lessonFiles) {
    const raw = fs.readFileSync(path.join(lessonsDir, file), 'utf8');
    const htmlFallback = renderMarkdownWithMath(raw, null);
    const htmlKatex = renderMarkdownWithMath(raw, mockKatex);

    for (const rendered of [htmlFallback, htmlKatex]) {
      assert.ok(!rendered.includes('\u0002'), `${file}: leaked STX placeholder`);
      assert.ok(!rendered.includes('\u0003'), `${file}: leaked ETX placeholder`);
      assert.ok(!rendered.includes('QRATOK'), `${file}: leaked token text`);
      assert.ok(rendered.includes('<h1>'), `${file}: missing <h1>`);
      assert.ok(rendered.includes('<h2>'), `${file}: missing <h2>`);
    }
  }

  const guideRaw = fs.readFileSync(path.join(APP_ROOT, 'content', 'library', 'READING_GUIDE.md'), 'utf8');
  const guideHtml = renderMarkdownWithMath(guideRaw, null);
  assert.ok(guideHtml.includes('<pre>'));
  assert.ok(!guideHtml.includes('\u0002'));

  const problemsData = JSON.parse(fs.readFileSync(path.join(APP_ROOT, 'content', 'problems.json'), 'utf8'));
  assert.equal(problemsData.problems.length, 40);
  for (const prob of problemsData.problems) {
    assert.ok(!prob.title.includes('$'), `${prob.id}: raw '$' found in plain-text prob.title`);
    for (const text of [prob.prompt, ...prob.hints, prob.solution]) {
      const out = renderMarkdownWithMath(text, mockKatex);
      assert.ok(!out.includes('\u0002'), `${prob.id}: leaked placeholder`);
      assert.ok(!out.includes('\\$'), `${prob.id}: unescaped prose \\$ leaked outside math`);
    }
  }
});

function createMockDOM() {
  const createCtx = () => ({
    save() {},
    restore() {},
    scale() {},
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    closePath() {},
    stroke() {},
    fill() {},
    setLineDash() {},
    fillText() {},
    measureText(t) { return { width: String(t).length * 6 }; },
    createLinearGradient() { return { addColorStop() {} }; },
    lineWidth: 1,
    strokeStyle: '',
    fillStyle: '',
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    globalAlpha: 1
  });

  function makeElement(tagName, ownerDoc) {
    const listeners = new Map();
    const el = {
      tagName: tagName.toUpperCase(),
      className: '',
      id: '',
      type: '',
      min: '',
      max: '',
      step: '',
      value: '',
      textContent: '',
      style: {},
      dataset: {},
      attributes: {},
      children: [],
      clientWidth: 760,
      width: 760,
      height: 300,
      ownerDocument: ownerDoc,
      setAttribute(k, v) { this.attributes[k] = String(v); },
      getAttribute(k) { return this.attributes[k] ?? null; },
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      append(...nodes) {
        for (const n of nodes) {
          this.children.push(typeof n === 'string' ? { tagName: '#TEXT', textContent: n, children: [] } : n);
        }
      },
      replaceChildren(...nodes) {
        this.children = [];
        this.append(...nodes);
      },
      addEventListener(evt, fn) {
        if (!listeners.has(evt)) listeners.set(evt, []);
        listeners.get(evt).push(fn);
      },
      dispatchEvent(evtObj) {
        const list = listeners.get(evtObj.type) || [];
        for (const fn of list) fn(evtObj);
      },
      getContext() {
        return createCtx();
      },
      querySelectorAll(predicateTag) {
        const found = [];
        const target = predicateTag.toUpperCase();
        const walk = (node) => {
          for (const ch of node.children || []) {
            if (ch.tagName === target) found.push(ch);
            walk(ch);
          }
        };
        walk(this);
        return found;
      }
    };
    Object.defineProperty(el, 'innerHTML', {
      get() { return ''; },
      set() { this.children = []; }
    });
    return el;
  }

  const doc = {
    createElement(tag) {
      return makeElement(tag, doc);
    }
  };
  return makeElement('div', doc);
}

test('All 4 Canvas simulators mount cleanly, respond to slider inputs, and obey editorial deduplication', () => {
  for (const simId of ['sim-lob', 'sim-martingale', 'sim-rmt', 'sim-grinold']) {
    const container = createMockDOM();
    const api = mountSimulator(container, simId);
    assert.ok(container.children.length > 0, `${simId} failed to populate container`);

    const canvases = container.querySelectorAll('canvas');
    assert.ok(canvases.length >= 1, `${simId} must render a <canvas>`);

    const inputs = container.querySelectorAll('input');
    assert.ok(inputs.length >= 3, `${simId} must expose interactive range sliders`);

    // Trigger slider input changes and button clicks to verify zero runtime exceptions
    for (const inp of inputs) {
      inp.value = inp.max || inp.value;
      inp.dispatchEvent({ type: 'input', target: inp });
    }
    const buttons = container.querySelectorAll('button');
    for (const btn of buttons) {
      btn.dispatchEvent({ type: 'click', target: btn });
    }
    if (api && typeof api.destroy === 'function') {
      api.destroy();
    }
  }

  // Verify zero repeated English parenthetical definitions (>1x) in simulators.js UI text
  const simSourceNoComments = fs
    .readFileSync(path.join(APP_ROOT, 'web', 'js', 'simulators.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
  const uiTextChunks = [
    ...simSourceNoComments.matchAll(/(['"])((?:\\.|(?!\1)[^\n])*?)\1/g),
  ].map((m) => m[2]).join('\n');
  const parenRe = /\(([A-Za-z][A-Za-z\s\-/]{4,45})\)/g;
  const counts = new Map();
  for (const m of uiTextChunks.matchAll(parenRe)) {
    const words = m[1].trim().split(/[\s\-/]+/).filter(Boolean);
    if (words.length === 0 || Math.max(...words.map((w) => w.length)) <= 2) continue;
    const norm = m[1].trim().replace(/\s+/g, ' ').toLowerCase();
    counts.set(norm, (counts.get(norm) || 0) + 1);
  }
  const duplicates = [...counts.entries()].filter(([, c]) => c > 1);
  assert.deepEqual(duplicates, [], `Repeated English parentheticals in simulators.js: ${JSON.stringify(duplicates)}`);
});

test('app.js progress payload normalization matches server.py validate_progress_payload 100%', () => {
  const richPayload = normalizeProgressPayload({
    version: 1,
    last_active_lesson: 'm1-04-mo-hinh-roll-glosten-milgrom-kyle-ofi',
    study_days: ['2026-11-16', '2026-11-15', '2026-11-16'],
    completed_lessons: { 'm1-01-he-sinh-thai-buy-side-va-alpha': true, 'm1-02': false },
    completed_readings: { 'read-m1-01-1': true },
    completed_milestones: { 'ms-s1-01': true },
    lesson_notes: { 'm1-04-mo-hinh-roll-glosten-milgrom-kyle-ofi': 'Chứng minh $\\lambda = \\frac{1}{2}\\sqrt{\\Sigma_0/\\sigma_u^2}$' },
    problem_reviews: {
      'prob-m1-01': computeNextReview(null, 'good', '2026-11-16'),
    },
    projects: {
      'proj-1': {
        checked_tasks: { 'task-p1-01': true },
        checked_audits: { 'audit-p1-01': true, 'audit-p1-02': true },
        repo_url: 'https://github.com/example/cap01',
        whitepaper_path: 'reports/cap01.pdf',
        metrics: { sharpe: '1.92', ic: '0.034', turnover: '19%', max_dd: '-5.8%' },
        reflection: 'Kiểm chứng Delay-1 hoàn tất.',
      },
    },
  });

  assert.deepEqual(richPayload.study_days, ['2026-11-15', '2026-11-16']);
  assert.equal(richPayload.completed_lessons['m1-02'], undefined);
  assert.equal(richPayload.projects['proj-1'].metrics.sharpe, '1.92');

  // Reject malformed payloads
  assert.throws(() => normalizeProgressPayload(null));
  assert.throws(() => normalizeProgressPayload([]));
  assert.throws(() => normalizeProgressPayload({ version: '1' }));
  assert.throws(() => normalizeProgressPayload({ version: 1, study_days: '2026-11-16' }));
  assert.throws(() => normalizeProgressPayload({ version: 1, projects: [] }));

  // Cross-verify against Python server.validate_progress_payload()
  const pyCheck = [
    'import json, sys',
    'from server import validate_progress_payload, default_progress',
    'p1 = validate_progress_payload(json.loads(sys.argv[1]))',
    'p2 = validate_progress_payload(json.loads(sys.argv[2]))',
    'assert p1["version"] == 1 and p2["projects"]["proj-1"]["metrics"]["sharpe"] == "1.92"',
    'print("OK")',
  ].join('; ');

  const out = execFileSync(
    'python3',
    ['-c', pyCheck, JSON.stringify(createDefaultProgress()), JSON.stringify(richPayload)],
    { cwd: APP_ROOT, encoding: 'utf8' }
  );
  assert.equal(out.trim(), 'OK');
});

test('app.js route hash parser, streak calculator, problem queue filter, and H1 stripper work accurately', () => {
  const validLessons = new Set(['m1-01-he-sinh-thai-buy-side-va-alpha', 'm2-04-random-walk-martingale-optional-stopping']);
  const validProjects = new Set(['proj-1', 'proj-2', 'proj-3', 'proj-4']);

  assert.deepEqual(parseRouteHash('', 'm1-01-he-sinh-thai-buy-side-va-alpha', validLessons, validProjects), { view: 'roadmap' });
  assert.deepEqual(parseRouteHash('#roadmap', 'm1-01-he-sinh-thai-buy-side-va-alpha', validLessons, validProjects), { view: 'roadmap' });
  assert.deepEqual(
    parseRouteHash('#lesson/m2-04-random-walk-martingale-optional-stopping', 'm1-01-he-sinh-thai-buy-side-va-alpha', validLessons, validProjects),
    { view: 'lesson', lessonId: 'm2-04-random-walk-martingale-optional-stopping' }
  );
  assert.deepEqual(
    parseRouteHash('#lesson/unknown-slug', 'm1-01-he-sinh-thai-buy-side-va-alpha', validLessons, validProjects),
    { view: 'lesson', lessonId: 'm1-01-he-sinh-thai-buy-side-va-alpha' }
  );
  assert.deepEqual(parseRouteHash('#problems', 'm1-01-he-sinh-thai-buy-side-va-alpha', validLessons, validProjects), { view: 'problems' });
  assert.deepEqual(
    parseRouteHash('#projects/proj-3', 'm1-01-he-sinh-thai-buy-side-va-alpha', validLessons, validProjects),
    { view: 'projects', projectId: 'proj-3' }
  );
  assert.deepEqual(
    parseRouteHash('#projects/invalid', 'm1-01-he-sinh-thai-buy-side-va-alpha', validLessons, validProjects),
    { view: 'projects', projectId: 'proj-1' }
  );

  // Streak calculation
  assert.deepEqual(computeStreakStats(['2026-11-14', '2026-11-15', '2026-11-16'], '2026-11-16'), {
    streakDays: 3,
    totalDays: 3,
  });
  assert.deepEqual(computeStreakStats(['2026-11-10', '2026-11-14', '2026-11-15'], '2026-11-16'), {
    streakDays: 2,
    totalDays: 3,
  });
  assert.deepEqual(computeStreakStats(['2026-11-10'], '2026-11-16'), {
    streakDays: 0,
    totalDays: 1,
  });

  // Problem queue filtering
  const sampleProbs = [
    { id: 'p1', module_id: 'm1', difficulty: 'Medium', firms: ['Jane Street'] },
    { id: 'p2', module_id: 'm2', difficulty: 'Hard', firms: ['Citadel', 'Two Sigma'] },
    { id: 'p3', module_id: 'm2', difficulty: 'Medium', firms: ['WorldQuant'] },
  ];
  const reviews = {
    p1: { ease: 2.5, interval_days: 1, repetitions: 0, next_due: '2026-11-16', last_grade: 'again' },
    p2: { ease: 2.55, interval_days: 4, repetitions: 1, next_due: '2026-11-20', last_grade: 'good' },
  };
  assert.equal(filterProblemsList(sampleProbs, { queue: 'due' }, reviews, '2026-11-16').length, 1);
  assert.equal(filterProblemsList(sampleProbs, { queue: 'unseen' }, reviews, '2026-11-16').length, 1);
  assert.equal(filterProblemsList(sampleProbs, { queue: 'mastered' }, reviews, '2026-11-16').length, 1);
  assert.equal(filterProblemsList(sampleProbs, { module: 'm2', firm: 'Two Sigma' }, reviews, '2026-11-16').length, 1);

  assert.equal(stripLeadingMarkdownH1('# M1.01 — Title\n\n## 1. Body'), '## 1. Body');
  assert.equal(createDefaultProjectState().metrics.max_dd, '');
  assert.equal(formatDifficultyLabel('Easy'), 'Cơ bản');
  assert.equal(formatDifficultyLabel('Medium'), 'Chuẩn Phỏng vấn');
  assert.equal(formatDifficultyLabel('Hard'), 'Superday');
});

test('index.html, styles.css, and app.js satisfy DOM ID contracts and editorial deduplication', () => {
  const indexHtml = fs.readFileSync(path.join(APP_ROOT, 'web', 'index.html'), 'utf8');
  const stylesCss = fs.readFileSync(path.join(APP_ROOT, 'web', 'styles.css'), 'utf8');
  const appJs = fs.readFileSync(path.join(APP_ROOT, 'web', 'js', 'app.js'), 'utf8');

  assert.ok(stylesCss.includes('15.5px'), 'styles.css must set 15.5px reading font size');
  assert.ok(stylesCss.includes('.split-open'), 'styles.css must define .split-open layout');

  // Verify every static element ID bound at startup in app.js exists in index.html
  const requiredStaticIds = [
    'app-sidebar',
    'sidebar-backdrop',
    'mobile-menu-btn',
    'nav-due-badge',
    'sidebar-search-input',
    'sidebar-search-kbd',
    'sidebar-search-clear',
    'sidebar-module-tree',
    'sidebar-progress-text',
    'sidebar-progress-bar-wrap',
    'sidebar-progress-fill',
    'sidebar-streak-text',
    'save-status-dot',
    'save-status-text',
    'btn-export-backup',
    'btn-import-backup',
    'input-import-backup',
    'sidebar-toast',
    'view-roadmap',
    'view-lesson',
    'view-problems',
    'view-projects',
    'roadmap-container',
    'problems-container',
    'projects-container',
    'reader-breadcrumb',
    'reader-completed-pill',
    'btn-reader-quick-complete',
    'btn-toggle-split',
    'reader-grid',
    'lesson-header',
    'lesson-simulator-slot',
    'lesson-markdown-body',
    'lesson-readings-section',
    'lesson-footer-nav',
    'reader-split-pane',
    'btn-close-split',
    'split-panel-notes',
    'split-panel-library',
    'notes-lesson-label',
    'notes-workbench',
    'lesson-notes-input',
    'lesson-notes-preview',
    'library-file-select',
    'btn-refresh-library',
    'link-open-library-raw',
    'library-viewer-body',
    'katex-script',
  ];
  for (const id of requiredStaticIds) {
    assert.ok(indexHtml.includes(`id="${id}"`), `index.html missing required element id="${id}"`);
  }

  // Verify #lesson-simulator-slot sits below #lesson-markdown-body and above #lesson-readings-section
  const bodyIdx = indexHtml.indexOf('id="lesson-markdown-body"');
  const simIdx = indexHtml.indexOf('id="lesson-simulator-slot"');
  const readingsIdx = indexHtml.indexOf('id="lesson-readings-section"');
  assert.ok(bodyIdx >= 0 && simIdx > bodyIdx && readingsIdx > simIdx, 'lesson-simulator-slot must sit between lesson-markdown-body and lesson-readings-section');

  // Check editorial deduplication rule across index.html text and app.js UI strings
  const parenRe = /\(([A-Za-z][A-Za-z\s\-/]{4,45})\)/g;
  const htmlVisibleText = indexHtml.replace(/<[^>]+>/g, ' ');
  const appNoComments = appJs
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
  const singleDoubleQuotes = [
    ...appNoComments.matchAll(/(['"])((?:\\.|(?!\1)[^\n])*?)\1/g),
  ].map((m) => m[2]);
  const templateLiterals = [
    ...appNoComments.matchAll(/`([\s\S]*?)`/g),
  ].map((m) => m[1].replace(/\$\{[^}]*\}/g, ' ').replace(/<[^>]+>/g, ' '));
  const appUiCopy = [...singleDoubleQuotes, ...templateLiterals].join('\n');

  for (const [label, source] of [['index.html', htmlVisibleText], ['app.js', appUiCopy]]) {
    const counts = new Map();
    for (const m of source.matchAll(parenRe)) {
      const words = m[1].trim().split(/[\s\-/]+/).filter(Boolean);
      if (words.length === 0 || Math.max(...words.map((w) => w.length)) <= 2) continue;
      const norm = m[1].trim().replace(/\s+/g, ' ').toLowerCase();
      counts.set(norm, (counts.get(norm) || 0) + 1);
    }
    const dups = [...counts.entries()].filter(([, c]) => c > 1);
    assert.deepEqual(dups, [], `Repeated English parentheticals in ${label}: ${JSON.stringify(dups)}`);
  }
});
