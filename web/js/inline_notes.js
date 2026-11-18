/**
 * Notion-style Inline Contextual Notes for Quant Research Academy.
 * Saved notes collapse into a slim 1-line pill so lesson layout stays clean;
 * tapping the pill expands/hides the rendered Markdown + LaTeX note on demand.
 */

import { escapeHtml, renderMarkdownWithMath } from './markdown_math.js';

function isPlainObject(val) {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Normalize raw inline_notes object from storage/API.
 *
 * @param {unknown} raw
 * @returns {Record<string, Array<{ id: string, block_index: number, quote: string, text: string }>>}
 */
export function normalizeInlineNotesMap(raw) {
  const out = {};
  if (!isPlainObject(raw)) return out;

  for (const [scopeKey, list] of Object.entries(raw)) {
    if (!scopeKey || !Array.isArray(list)) continue;
    const cleanedList = [];
    const seenIds = new Set();
    for (const item of list) {
      if (!isPlainObject(item)) continue;
      const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : '';
      if (!id || seenIds.has(id)) continue;
      const blockIdx =
        typeof item.block_index === 'number' && Number.isFinite(item.block_index)
          ? Math.max(0, Math.floor(item.block_index))
          : 0;
      const quote = typeof item.quote === 'string' ? item.quote.trim().slice(0, 280) : '';
      const text = typeof item.text === 'string' ? item.text : '';
      if (!text.trim() && !quote) continue;
      seenIds.add(id);
      cleanedList.push({ id, block_index: blockIdx, quote, text });
    }
    if (cleanedList.length > 0) {
      cleanedList.sort((a, b) => a.block_index - b.block_index);
      out[scopeKey] = cleanedList;
    }
  }
  return out;
}

/**
 * Return notes for a scope sorted by block_index ascending.
 */
export function getInlineNotesForScope(notesMap, scopeKey) {
  if (!isPlainObject(notesMap) || !Array.isArray(notesMap[scopeKey])) {
    return [];
  }
  return [...notesMap[scopeKey]].sort((a, b) => a.block_index - b.block_index);
}

/**
 * Create or update a note inside notesMap[scopeKey].
 */
export function upsertInlineNote(notesMap, scopeKey, entry) {
  if (!scopeKey || !isPlainObject(entry)) return null;
  if (!Array.isArray(notesMap[scopeKey])) {
    notesMap[scopeKey] = [];
  }
  const id =
    typeof entry.id === 'string' && entry.id.trim()
      ? entry.id.trim()
      : `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const blockIndex =
    typeof entry.block_index === 'number' && Number.isFinite(entry.block_index)
      ? Math.max(0, Math.floor(entry.block_index))
      : 0;
  const quote = typeof entry.quote === 'string' ? entry.quote.trim().slice(0, 280) : '';
  const cleanText = typeof entry.text === 'string' ? entry.text : '';

  const list = notesMap[scopeKey];
  const existingIdx = list.findIndex((n) => n.id === id);
  const record = { id, block_index: blockIndex, quote, text: cleanText };
  if (existingIdx >= 0) {
    list[existingIdx] = record;
  } else {
    list.push(record);
  }
  list.sort((a, b) => a.block_index - b.block_index);
  return record;
}

/**
 * Remove a note by id from notesMap[scopeKey].
 */
export function deleteInlineNote(notesMap, scopeKey, noteId) {
  if (!isPlainObject(notesMap) || !Array.isArray(notesMap[scopeKey])) return;
  const next = notesMap[scopeKey].filter((n) => n.id !== noteId);
  if (next.length > 0) {
    notesMap[scopeKey] = next;
  } else {
    delete notesMap[scopeKey];
  }
}

function buildCompactPreview(note) {
  const raw = (note.text || '')
    .replace(/\$\$[\s\S]*?\$\$/g, ' [công thức] ')
    .replace(/\$[^$\n]+\$/g, ' [công thức] ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  return raw.length > 42 ? `${raw.slice(0, 42).trim()}…` : raw;
}

/**
 * Render HTML for an inline note in 'collapsed' (default pill), 'expanded', or 'editing' mode.
 */
export function renderInlineNoteCardHtml(note, mode = 'collapsed', katexInst = null, scopeKey = '') {
  const resolvedMode =
    mode === true ? 'editing' : mode === false ? 'collapsed' : mode || 'collapsed';
  const safeId = escapeHtml(note.id);
  const safeScope = escapeHtml(scopeKey);

  if (resolvedMode === 'editing') {
    return `
      <div class="inline-note-card is-editing" data-inline-note-card="${safeId}" data-note-scope-owner="${safeScope}">
        <textarea
          class="inline-note-textarea"
          rows="2"
          data-inline-note-input="${safeId}"
          data-note-scope-owner="${safeScope}"
          data-note-block="${note.block_index}"
          data-note-quote="${escapeHtml(note.quote || '')}"
          placeholder="Viết ghi chú..."
        >${escapeHtml(note.text || '')}</textarea>
        <div class="inline-note-actions">
          <div class="inline-note-btns">
            <button type="button" class="inline-note-btn is-danger" data-inline-note-delete="${safeId}" data-note-scope-owner="${safeScope}">Xóa</button>
            <button type="button" class="inline-note-btn is-primary" data-inline-note-done="${safeId}" data-note-scope-owner="${safeScope}">Lưu</button>
          </div>
        </div>
      </div>`;
  }

  if (resolvedMode === 'expanded') {
    const bodyMd = (note.text || '').trim() || '*Chưa có nội dung ghi chú — nhấn Sửa để bổ sung.*';
    return `
      <div class="inline-note-card is-expanded" data-inline-note-card="${safeId}" data-note-scope-owner="${safeScope}">
        <div class="inline-note-body prose prose-compact">
          ${renderMarkdownWithMath(bodyMd, katexInst)}
        </div>
        <div class="inline-note-meta-links">
          <button type="button" class="inline-note-link" data-inline-note-toggle="${safeId}" data-note-scope-owner="${safeScope}">Ẩn</button>
          <span aria-hidden="true">·</span>
          <button type="button" class="inline-note-link" data-inline-note-edit="${safeId}" data-note-scope-owner="${safeScope}">Sửa</button>
          <span aria-hidden="true">·</span>
          <button type="button" class="inline-note-link is-danger" data-inline-note-delete="${safeId}" data-note-scope-owner="${safeScope}">Xóa</button>
        </div>
      </div>`;
  }

  const preview = buildCompactPreview(note);
  return `
    <button
      type="button"
      class="inline-note-pill"
      data-inline-note-toggle="${safeId}"
      data-note-scope-owner="${safeScope}"
      title="Chạm để mở ghi chú"
    >
      <span class="inline-note-pill-dot" aria-hidden="true"></span>
      <span class="inline-note-pill-label">Ghi chú</span>
      ${preview ? `<span class="inline-note-pill-snippet">· ${escapeHtml(preview)}</span>` : ''}
    </button>`;
}

/**
 * Decorate a rendered Markdown container with block indices, section "+ Ghi chú" buttons,
 * and anchored inline note stacks right below their target blocks.
 */
export function mountInlineNotesInContainer(
  containerEl,
  scopeKey,
  notesMap,
  editingIds,
  katexInst = null,
  { showHeadingButtons = true, expandedIds = null } = {}
) {
  if (!containerEl || !scopeKey) return;

  containerEl.setAttribute('data-note-scope', scopeKey);

  // Remove existing note stacks & heading buttons before re-anchoring cleanly
  for (const oldStack of [...containerEl.querySelectorAll(':scope > .inline-note-stack')]) {
    oldStack.remove();
  }
  for (const oldBtn of [...containerEl.querySelectorAll('.heading-add-note-btn')]) {
    oldBtn.remove();
  }

  const blocks = [...containerEl.children];
  blocks.forEach((el, idx) => {
    el.setAttribute('data-note-block-idx', String(idx));
    if (showHeadingButtons && (el.tagName === 'H2' || el.tagName === 'H3')) {
      el.classList.add('has-note-trigger');
      const btn = containerEl.ownerDocument.createElement('button');
      btn.type = 'button';
      btn.className = 'heading-add-note-btn';
      btn.setAttribute('data-add-block-note', String(idx));
      btn.setAttribute('data-note-scope-owner', scopeKey);
      btn.setAttribute('title', 'Thêm ghi chú');
      btn.setAttribute('aria-label', 'Thêm ghi chú');
      btn.textContent = '+';
      el.appendChild(btn);
    }
  });

  const notes = getInlineNotesForScope(notesMap, scopeKey);
  if (notes.length === 0) return;

  const grouped = new Map();
  const maxIdx = Math.max(0, blocks.length - 1);
  for (const note of notes) {
    const targetIdx = blocks.length > 0 ? Math.min(note.block_index, maxIdx) : 0;
    if (!grouped.has(targetIdx)) grouped.set(targetIdx, []);
    grouped.get(targetIdx).push(note);
  }

  for (const [blockIdx, bucket] of grouped.entries()) {
    const allCollapsed = bucket.every(
      (n) => !editingIds?.has(n.id) && !expandedIds?.has(n.id)
    );
    const stackEl = containerEl.ownerDocument.createElement('div');
    stackEl.className = allCollapsed ? 'inline-note-stack is-all-collapsed' : 'inline-note-stack';
    stackEl.setAttribute('data-note-stack-idx', String(blockIdx));
    stackEl.innerHTML = bucket
      .map((n) => {
        const mode = editingIds?.has(n.id)
          ? 'editing'
          : expandedIds?.has(n.id)
            ? 'expanded'
            : 'collapsed';
        return renderInlineNoteCardHtml(n, mode, katexInst, scopeKey);
      })
      .join('');

    const anchorBlock = blocks[blockIdx];
    if (anchorBlock && anchorBlock.parentNode === containerEl) {
      anchorBlock.insertAdjacentElement('afterend', stackEl);
    } else {
      containerEl.appendChild(stackEl);
    }
  }
}
