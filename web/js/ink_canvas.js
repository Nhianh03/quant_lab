/**
 * Freehand Ink & Highlighter Overlay for Quant Research Academy.
 * Supports smooth vector pen/highlighter strokes, stroke-level eraser, undo history,
 * iPad Safari-safe tiled canvases, and 10-second automatic persistence.
 */

export const INK_AUTOSAVE_MS = 10000;

export const INK_TILE_HEIGHT = 1800;

export const INK_COLORS = {
  sage: {
    key: 'sage',
    color: '#2f6349',
    width: 2.2,
    opacity: 1,
    label: 'Bút xanh rêu',
  },
  coral: {
    key: 'coral',
    color: '#d9534f',
    width: 2.2,
    opacity: 1,
    label: 'Bút đỏ cam',
  },
  ocean: {
    key: 'ocean',
    color: '#2b6cb0',
    width: 2.2,
    opacity: 1,
    label: 'Bút xanh biển',
  },
  highlighter: {
    key: 'highlighter',
    color: '#f2c94c',
    width: 14,
    opacity: 0.36,
    label: 'Bút dạ quang vàng',
  },
};

function isPlainObject(val) {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

/**
 * Normalize raw ink_drawings map from storage/API.
 *
 * @param {unknown} raw
 * @returns {Record<string, Array<{ id: string, color: string, width: number, opacity: number, pts: Array<[number, number]> }>>}
 */
export function normalizeInkDrawingsMap(raw) {
  const out = {};
  if (!isPlainObject(raw)) return out;

  for (const [scopeKey, list] of Object.entries(raw)) {
    if (!scopeKey || !Array.isArray(list)) continue;
    const cleaned = [];
    const seenIds = new Set();

    for (const item of list) {
      if (!isPlainObject(item) || !Array.isArray(item.pts) || item.pts.length === 0) continue;
      const id =
        typeof item.id === 'string' && item.id.trim()
          ? item.id.trim()
          : `st-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      if (seenIds.has(id)) continue;

      const pts = [];
      for (const pt of item.pts.slice(0, 2500)) {
        if (!Array.isArray(pt) || pt.length < 2) continue;
        const xNorm = Number(pt[0]);
        const yPx = Number(pt[1]);
        if (!Number.isFinite(xNorm) || !Number.isFinite(yPx)) continue;
        pts.push([
          round4(Math.min(1, Math.max(0, xNorm))),
          round1(Math.max(0, yPx)),
        ]);
      }
      if (pts.length === 0) continue;

      const color =
        typeof item.color === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(item.color.trim())
          ? item.color.trim()
          : INK_COLORS.sage.color;
      const width =
        typeof item.width === 'number' && Number.isFinite(item.width)
          ? Math.min(28, Math.max(1, round1(item.width)))
          : 2.2;
      const opacity =
        typeof item.opacity === 'number' && Number.isFinite(item.opacity)
          ? Math.min(1, Math.max(0.1, round4(item.opacity)))
          : 1;

      seenIds.add(id);
      cleaned.push({ id, color, width, opacity, pts });
    }

    if (cleaned.length > 0) {
      out[scopeKey] = cleaned;
    }
  }

  return out;
}

function distToSegmentSquared(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq <= 1e-6) {
    const ex = px - x1;
    const ey = py - y1;
    return ex * ex + ey * ey;
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const ex = px - projX;
  const ey = py - projY;
  return ex * ex + ey * ey;
}

/**
 * Hit-test whether an eraser point (xPx, yPx) touches a vector stroke.
 */
export function hitTestStroke(stroke, xPx, yPx, containerWidth, radiusPx = 14) {
  if (!stroke || !Array.isArray(stroke.pts) || stroke.pts.length === 0) return false;
  const w = Math.max(1, Number(containerWidth) || 1);
  const hitRadius = radiusPx + (Number(stroke.width) || 2) * 0.5;
  const threshSq = hitRadius * hitRadius;

  const pts = stroke.pts;
  if (pts.length === 1) {
    const sx = pts[0][0] * w;
    const sy = pts[0][1];
    const dx = xPx - sx;
    const dy = yPx - sy;
    return dx * dx + dy * dy <= threshSq;
  }

  for (let i = 0; i < pts.length - 1; i += 1) {
    const x1 = pts[i][0] * w;
    const y1 = pts[i][1];
    const x2 = pts[i + 1][0] * w;
    const y2 = pts[i + 1][1];
    if (distToSegmentSquared(xPx, yPx, x1, y1, x2, y2) <= threshSq) {
      return true;
    }
  }
  return false;
}

/**
 * Scoped Undo History manager for added and erased strokes.
 */
export function createInkHistory(maxPerScope = 60) {
  const stacks = new Map();

  function getStack(scopeKey) {
    if (!stacks.has(scopeKey)) stacks.set(scopeKey, []);
    return stacks.get(scopeKey);
  }

  return {
    recordAdd(scopeKey, stroke) {
      if (!scopeKey || !stroke) return;
      const st = getStack(scopeKey);
      st.push({ type: 'add', stroke });
      if (st.length > maxPerScope) st.shift();
    },
    recordErase(scopeKey, stroke, index) {
      if (!scopeKey || !stroke) return;
      const st = getStack(scopeKey);
      st.push({ type: 'erase', stroke, index: Math.max(0, Number(index) || 0) });
      if (st.length > maxPerScope) st.shift();
    },
    canUndo(scopeKey) {
      return Boolean(scopeKey && stacks.has(scopeKey) && stacks.get(scopeKey).length > 0);
    },
    undo(scopeKey, targetStrokesArray) {
      if (!this.canUndo(scopeKey) || !Array.isArray(targetStrokesArray)) return false;
      const action = stacks.get(scopeKey).pop();
      if (!action) return false;

      if (action.type === 'add') {
        const idx = targetStrokesArray.findIndex((s) => s.id === action.stroke.id);
        if (idx >= 0) {
          targetStrokesArray.splice(idx, 1);
          return true;
        }
        return false;
      }

      if (action.type === 'erase') {
        const insertAt = Math.min(targetStrokesArray.length, Math.max(0, action.index));
        targetStrokesArray.splice(insertAt, 0, action.stroke);
        return true;
      }
      return false;
    },
  };
}

function drawStrokeOnTile(ctx, stroke, containerWidth, tileTopY, tileHeight) {
  const pts = stroke.pts;
  if (!pts || pts.length === 0) return;

  // Quick vertical bounding-box cull so tiles outside stroke range skip work
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pts.length; i += 1) {
    const y = pts[i][1];
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const pad = (stroke.width || 4) + 6;
  if (maxY + pad < tileTopY || minY - pad > tileTopY + tileHeight) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = stroke.opacity ?? 1;
  ctx.strokeStyle = stroke.color || '#2f6349';
  ctx.fillStyle = stroke.color || '#2f6349';
  ctx.lineWidth = stroke.width || 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (pts.length === 1) {
    const x = pts[0][0] * containerWidth;
    const y = pts[0][1] - tileTopY;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.2, (stroke.width || 2.2) * 0.55), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.beginPath();
  const x0 = pts[0][0] * containerWidth;
  const y0 = pts[0][1] - tileTopY;
  ctx.moveTo(x0, y0);

  if (pts.length === 2) {
    ctx.lineTo(pts[1][0] * containerWidth, pts[1][1] - tileTopY);
  } else {
    for (let i = 1; i < pts.length - 1; i += 1) {
      const cx = pts[i][0] * containerWidth;
      const cy = pts[i][1] - tileTopY;
      const nx = pts[i + 1][0] * containerWidth;
      const ny = pts[i + 1][1] - tileTopY;
      ctx.quadraticCurveTo(cx, cy, (cx + nx) * 0.5, (cy + ny) * 0.5);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last[0] * containerWidth, last[1] - tileTopY);
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Mount a tiled freehand ink overlay inside containerEl.
 */
export function mountInkOverlay(containerEl, {
  scopeKey,
  inkMap,
  history,
  getToolState,
  onChange,
}) {
  if (!containerEl || !scopeKey || !containerEl.ownerDocument) {
    return { refresh() {}, setInteractive() {}, destroy() {} };
  }

  const doc = containerEl.ownerDocument;
  containerEl.classList?.add?.('has-ink-overlay');

  // Remove any stale overlay layer inside this container
  const existing = containerEl.querySelector?.(':scope > .ink-overlay-layer');
  if (existing && typeof existing.remove === 'function') {
    existing.remove();
  }

  const layerEl = doc.createElement('div');
  layerEl.className = 'ink-overlay-layer';
  layerEl.setAttribute('data-ink-scope', scopeKey);
  containerEl.appendChild(layerEl);

  let tiles = [];
  let activeStroke = null;
  let activePointerId = null;
  let destroyed = false;

  function getStrokesList() {
    if (!Array.isArray(inkMap[scopeKey])) {
      inkMap[scopeKey] = [];
    }
    return inkMap[scopeKey];
  }

  function cleanupEmptyScope() {
    if (Array.isArray(inkMap[scopeKey]) && inkMap[scopeKey].length === 0) {
      delete inkMap[scopeKey];
    }
  }

  function measureContainer() {
    const w = Math.max(280, Number(containerEl.clientWidth || containerEl.offsetWidth || 760));
    const h = Math.max(320, Number(containerEl.scrollHeight || containerEl.offsetHeight || 900));
    return { width: w, height: h };
  }

  function syncTilesAndRender() {
    if (destroyed) return;
    const { width, height } = measureContainer();
    layerEl.style.height = `${height}px`;

    const neededCount = Math.max(1, Math.min(24, Math.ceil(height / INK_TILE_HEIGHT)));
    const dpr =
      typeof window !== 'undefined' && Number.isFinite(window.devicePixelRatio)
        ? Math.min(2, Math.max(1, window.devicePixelRatio))
        : 1;

    while (tiles.length > neededCount) {
      const old = tiles.pop();
      old.canvas.remove?.();
    }

    while (tiles.length < neededCount) {
      const idx = tiles.length;
      const canvas = doc.createElement('canvas');
      canvas.className = 'ink-tile-canvas';
      layerEl.appendChild(canvas);
      tiles.push({ idx, canvas, topY: idx * INK_TILE_HEIGHT, height: INK_TILE_HEIGHT, width: 0, dpr: 1 });
    }

    const strokes = Array.isArray(inkMap[scopeKey]) ? inkMap[scopeKey] : [];

    for (let i = 0; i < tiles.length; i += 1) {
      const tile = tiles[i];
      const topY = i * INK_TILE_HEIGHT;
      const tileH = Math.min(INK_TILE_HEIGHT, Math.max(120, height - topY));
      tile.topY = topY;
      tile.height = tileH;
      tile.canvas.style.top = `${topY}px`;
      tile.canvas.style.width = `${width}px`;
      tile.canvas.style.height = `${tileH}px`;

      const targetPxW = Math.round(width * dpr);
      const targetPxH = Math.round(tileH * dpr);
      if (tile.canvas.width !== targetPxW || tile.canvas.height !== targetPxH) {
        tile.canvas.width = targetPxW;
        tile.canvas.height = targetPxH;
      }
      tile.width = width;
      tile.dpr = dpr;

      const ctx = tile.canvas.getContext?.('2d');
      if (!ctx) continue;
      ctx.setTransform?.(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, tileH);

      for (let s = 0; s < strokes.length; s += 1) {
        drawStrokeOnTile(ctx, strokes[s], width, topY, tileH);
      }
      if (activeStroke) {
        drawStrokeOnTile(ctx, activeStroke, width, topY, tileH);
      }
    }
  }

  function applyInteractiveState() {
    const st = getToolState();
    const active = st.tool === 'pen' || st.tool === 'eraser';
    layerEl.classList.toggle('is-interactive', active);
    layerEl.classList.toggle('is-eraser', st.tool === 'eraser');
  }

  function getLocalCoords(evt) {
    const rect = containerEl.getBoundingClientRect?.() || { left: 0, top: 0, width: 760 };
    const width = Math.max(1, rect.width || measureContainer().width);
    const xPx = Math.min(width, Math.max(0, (evt.clientX || 0) - rect.left));
    const yPx = Math.max(0, (evt.clientY || 0) - rect.top);
    return { xPx, yPx, width, xNorm: round4(xPx / width) };
  }

  function eraseAtPoint(xPx, yPx, width) {
    const list = Array.isArray(inkMap[scopeKey]) ? inkMap[scopeKey] : null;
    if (!list || list.length === 0) return false;
    let erasedAny = false;
    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (hitTestStroke(list[i], xPx, yPx, width, 15)) {
        const [removed] = list.splice(i, 1);
        history?.recordErase(scopeKey, removed, i);
        erasedAny = true;
      }
    }
    if (erasedAny) {
      cleanupEmptyScope();
      syncTilesAndRender();
      onChange?.(scopeKey);
    }
    return erasedAny;
  }

  function handlePointerDown(evt) {
    const st = getToolState();
    if (st.tool !== 'pen' && st.tool !== 'eraser') return;
    if (evt.button !== undefined && evt.button !== 0) return;

    evt.preventDefault?.();
    activePointerId = evt.pointerId ?? 'mouse';
    layerEl.setPointerCapture?.(evt.pointerId);

    const { xPx, yPx, width, xNorm } = getLocalCoords(evt);
    if (st.tool === 'eraser') {
      eraseAtPoint(xPx, yPx, width);
      return;
    }

    const preset = INK_COLORS[st.colorKey] || INK_COLORS.sage;
    activeStroke = {
      id: `st-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      color: preset.color,
      width: preset.width,
      opacity: preset.opacity,
      pts: [[xNorm, round1(yPx)]],
    };
    syncTilesAndRender();
  }

  function handlePointerMove(evt) {
    if (activePointerId === null) return;
    if (evt.pointerId !== undefined && evt.pointerId !== activePointerId) return;

    const st = getToolState();
    if (st.tool !== 'pen' && st.tool !== 'eraser') return;
    evt.preventDefault?.();

    const { xPx, yPx, width, xNorm } = getLocalCoords(evt);
    if (st.tool === 'eraser') {
      eraseAtPoint(xPx, yPx, width);
      return;
    }

    if (!activeStroke) return;
    const pts = activeStroke.pts;
    const prev = pts[pts.length - 1];
    const dx = (xNorm - prev[0]) * width;
    const dy = yPx - prev[1];
    if (dx * dx + dy * dy < 2.2) return;

    pts.push([xNorm, round1(yPx)]);
    syncTilesAndRender();
  }

  function finishActivePointer(evt) {
    if (activePointerId === null) return;
    if (evt?.pointerId !== undefined && evt.pointerId !== activePointerId) return;

    if (evt?.pointerId !== undefined) {
      try {
        layerEl.releasePointerCapture?.(evt.pointerId);
      } catch {
        // Ignore if not captured
      }
    }
    activePointerId = null;

    if (activeStroke && activeStroke.pts.length > 0) {
      const list = getStrokesList();
      list.push(activeStroke);
      history?.recordAdd(scopeKey, activeStroke);
      activeStroke = null;
      syncTilesAndRender();
      onChange?.(scopeKey);
    } else {
      activeStroke = null;
    }
  }

  layerEl.addEventListener('pointerdown', handlePointerDown);
  layerEl.addEventListener('pointermove', handlePointerMove);
  layerEl.addEventListener('pointerup', finishActivePointer);
  layerEl.addEventListener('pointercancel', finishActivePointer);

  let resizeObserver = null;
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(() => {
      syncTilesAndRender();
    });
    try {
      resizeObserver.observe(containerEl);
    } catch {
      resizeObserver = null;
    }
  }

  applyInteractiveState();
  syncTilesAndRender();

  return {
    scopeKey,
    refresh() {
      applyInteractiveState();
      syncTilesAndRender();
    },
    setInteractive() {
      applyInteractiveState();
    },
    destroy() {
      destroyed = true;
      resizeObserver?.disconnect?.();
      layerEl.remove?.();
    },
  };
}
