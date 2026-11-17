/**
 * Notion-style Inline Contextual Notes for Quant Research Academy.
 * Allows learners to highlight any text/formula or click "+ Ghi chú" next to any
 * section heading to attach a persistent Markdown + LaTeX note right below that block.
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
  const text = typeof entry.text === 'string' ? entry.text : '';

  const list = notesMap[scopeKey];
  const existingIdx = list.findIndex((n) => n.id === id);
  const record = { id, block_index: blockIndex, quote, text };
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

/**
 * Render HTML for a single Notion-style inline note card.
 */
export function renderInlineNoteCardHtml(note, isEditing, katexInst = null, scopeKey = '') {
  const safeId = escapeHtml(note.id);
  const safeScope = escapeHtml(scopeKey);
  const quoteHtml = note.quote
    ? `<div class="inline-note-quote">“${escapeHtml(note.quote)}”</div>`
    : '';

  if (isEditing) {
    return `
      <div class="inline-note-card is-editing" data-inline-note-card="${safeId}" data-note-scope-owner="${safeScope}">
        ${quoteHtml}
        <textarea
          class="inline-note-textarea"
          rows="2"
          data-inline-note-input="${safeId}"
          data-note-scope-owner="${safeScope}"
          data-note-block="${note.block_index}"
          data-note-quote="${escapeHtml(note.quote || '')}"
          placeholder="Ghi chú nhanh tại đây (hỗ trợ cả chữ thường và công thức $...$)..."
        >${escapeHtml(note.text || '')}</textarea>
        <div class="inline-note-actions">
          <span class="inline-note-hint">Tự động lưu · Nhấn Ctrl/Cmd + Enter để thu gọn</span>
          <div class="inline-note-btns">
            <button type="button" class="inline-note-btn is-danger" data-inline-note-delete="${safeId}" data-note-scope-owner="${safeScope}">Xóa</button>
            <button type="button" class="inline-note-btn is-primary" data-inline-note-done="${safeId}" data-note-scope-owner="${safeScope}">Xong</button>
          </div>
        </div>
      </div>`;
  }

  const bodyMd = (note.text || '').trim() || '*Nhấn để viết ghi chú...*';
  return `
    <div class="inline-note-card" data-inline-note-card="${safeId}" data-note-scope-owner="${safeScope}">
      <div class="inline-note-top">
        <span class="inline-note-badge">Ghi chú cá nhân</span>
        <div class="inline-note-btns">
          <button type="button" class="inline-note-btn" data-inline-note-edit="${safeId}" data-note-scope-owner="${safeScope}">Sửa</button>
          <button type="button" class="inline-note-btn is-danger" data-inline-note-delete="${safeId}" data-note-scope-owner="${safeScope}" title="Xóa ghi chú">&times;</button>
        </div>
      </div>
      ${quoteHtml}
      <div class="inline-note-body prose prose-compact" data-inline-note-edit="${safeId}" data-note-scope-owner="${safeScope}">
        ${renderMarkdownWithMath(bodyMd, katexInst)}
      </div>
    </div>`;
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
  { showHeadingButtons = true } = {}
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
      btn.textContent = '+ Ghi chú';
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
    const stackEl = containerEl.ownerDocument.createElement('div');
    stackEl.className = 'inline-note-stack';
    stackEl.setAttribute('data-note-stack-idx', String(blockIdx));
    stackEl.innerHTML = bucket
      .map((n) => renderInlineNoteCardHtml(n, Boolean(editingIds?.has(n.id)), katexInst, scopeKey))
      .join('');

    const anchorBlock = blocks[blockIdx];
    if (anchorBlock && anchorBlock.parentNode === containerEl) {
      anchorBlock.insertAdjacentElement('afterend', stackEl);
    } else {
      containerEl.appendChild(stackEl);
    }
  }
}
