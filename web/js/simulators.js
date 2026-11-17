/**
 * Interactive Quantitative Research Canvas Simulators (HiDPI / Retina-sharp).
 *
 * Supported simulator IDs:
 *  - "sim-lob":        Limit Order Book Depth, Market Buy Sweep, Kyle's Lambda & OFI (M1.04)
 *  - "sim-martingale": Random Walk Paths, Optional Stopping Barriers & Gambler's Ruin (M2.04)
 *  - "sim-rmt":        Marchenko-Pastur Eigenvalue Spectrum & Ledoit-Wolf Shrinkage (M4.02)
 *  - "sim-grinold":    Grinold-Kahn Fundamental Law & Turnover Cost Drag (M5.01)
 */

const PALETTE = {
  bg: '#ffffff',
  panelBg: '#f9fafb',
  grid: '#edf0f4',
  axis: '#94a3b8',
  text: '#0f172a',
  muted: '#475569',
  blue: '#2563eb',
  blueSoft: 'rgba(37, 99, 235, 0.13)',
  teal: '#0d9488',
  tealSoft: 'rgba(13, 148, 136, 0.15)',
  crimson: '#e11d48',
  crimsonSoft: 'rgba(225, 29, 72, 0.14)',
  amber: '#d97706',
  amberSoft: 'rgba(217, 119, 6, 0.2)',
  slate: '#334155',
};

const BASE_SIMULATOR_CSS = `
.sim-card {
  margin: 2.25rem 0;
  padding: 1.45rem 1.55rem;
  border: 1px solid rgba(15, 23, 42, 0.085);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.035);
}
.sim-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 1.15rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.065);
}
.sim-title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 650;
  letter-spacing: -0.015em;
  color: #0f172a;
}
.sim-subtitle {
  margin: 0.28rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
}
.sim-btn {
  padding: 0.42rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.sim-btn:hover {
  background: #f8fafc;
  border-color: rgba(15, 23, 42, 0.22);
}
.sim-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
  gap: 0.9rem 1.25rem;
  margin-bottom: 1.15rem;
  padding: 0.95rem 1.1rem;
  background: #f9fafb;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 10px;
}
.sim-control {
  display: flex;
  flex-direction: column;
  gap: 0.36rem;
}
.sim-control-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.8rem;
}
.sim-control-label {
  color: #475569;
  font-weight: 500;
}
.sim-control-val {
  color: #0f172a;
  font-weight: 600;
  font-size: 0.79rem;
  font-variant-numeric: tabular-nums;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
.sim-slider {
  width: 100%;
  height: 5px;
  accent-color: #2563eb;
  cursor: pointer;
}
.sim-canvas-wrap {
  width: 100%;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}
.sim-canvas {
  display: block;
  width: 100%;
}
.sim-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.65rem;
  margin-top: 1rem;
}
.sim-metric {
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(15, 23, 42, 0.065);
  border-radius: 9px;
  background: #fafbfc;
}
.sim-metric-label {
  font-size: 0.73rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.22rem;
}
.sim-metric-value {
  font-size: 0.92rem;
  font-weight: 650;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
.sim-footnote {
  margin: 0.8rem 0 0;
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.5;
}
`;

function ensureSimulatorStyles(doc) {
  if (!doc || !doc.head || typeof doc.getElementById !== 'function') return;
  if (doc.getElementById('qra-simulator-base-styles')) return;
  const styleEl = doc.createElement('style');
  styleEl.id = 'qra-simulator-base-styles';
  styleEl.textContent = BASE_SIMULATOR_CSS;
  doc.head.appendChild(styleEl);
}

/** Deterministic fast Mulberry32 PRNG */
function createRng(seed) {
  let state = seed >>> 0;
  return function nextUniform() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleStandardNormal(rng) {
  const u1 = Math.max(1e-12, rng());
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function setupHiDpiCanvas(canvas, containerEl, logicalHeight = 310) {
  const dpr = Math.min(3, Math.max(1, Number(globalThis.window?.devicePixelRatio) || 1));
  const rawWidth = Number(containerEl?.clientWidth) || 740;
  const width = Math.max(320, Math.floor(rawWidth - 4));
  const height = logicalHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = PALETTE.bg;
  ctx.fillRect(0, 0, width, height);
  return { ctx, width, height, finish: () => ctx.restore() };
}

function buildShell(doc, config) {
  const card = doc.createElement('section');
  card.className = 'sim-card';
  card.setAttribute('data-simulator-id', config.id);

  const header = doc.createElement('div');
  header.className = 'sim-header';

  const titleBox = doc.createElement('div');
  const titleEl = doc.createElement('h3');
  titleEl.className = 'sim-title';
  titleEl.textContent = config.title;
  const subEl = doc.createElement('p');
  subEl.className = 'sim-subtitle';
  subEl.textContent = config.subtitle;
  titleBox.append(titleEl, subEl);
  header.appendChild(titleBox);

  let actionBtn = null;
  if (config.actionLabel) {
    actionBtn = doc.createElement('button');
    actionBtn.type = 'button';
    actionBtn.className = 'sim-btn';
    actionBtn.textContent = config.actionLabel;
    header.appendChild(actionBtn);
  }

  const controlsWrap = doc.createElement('div');
  controlsWrap.className = 'sim-controls';
  const state = {};

  for (const ctrl of config.controls) {
    state[ctrl.key] = ctrl.initial;
    const item = doc.createElement('div');
    item.className = 'sim-control';

    const top = doc.createElement('div');
    top.className = 'sim-control-top';
    const lbl = doc.createElement('label');
    lbl.className = 'sim-control-label';
    lbl.textContent = ctrl.label;
    const valSpan = doc.createElement('span');
    valSpan.className = 'sim-control-val';
    valSpan.textContent = ctrl.format(ctrl.initial);
    top.append(lbl, valSpan);

    const input = doc.createElement('input');
    input.type = 'range';
    input.className = 'sim-slider';
    input.min = String(ctrl.min);
    input.max = String(ctrl.max);
    input.step = String(ctrl.step);
    input.value = String(ctrl.initial);

    input.addEventListener('input', () => {
      const parsed = Number(input.value);
      state[ctrl.key] = Number.isFinite(parsed) ? parsed : ctrl.initial;
      valSpan.textContent = ctrl.format(state[ctrl.key]);
      config.onUpdate();
    });

    item.append(top, input);
    controlsWrap.appendChild(item);
  }

  const canvasWrap = doc.createElement('div');
  canvasWrap.className = 'sim-canvas-wrap';
  const canvas = doc.createElement('canvas');
  canvas.className = 'sim-canvas';
  canvasWrap.appendChild(canvas);

  const metricsWrap = doc.createElement('div');
  metricsWrap.className = 'sim-metrics';
  const metricRefs = {};
  for (const m of config.metrics) {
    const mBox = doc.createElement('div');
    mBox.className = 'sim-metric';
    const mLbl = doc.createElement('div');
    mLbl.className = 'sim-metric-label';
    mLbl.textContent = m.label;
    const mVal = doc.createElement('div');
    mVal.className = 'sim-metric-value';
    mVal.textContent = '—';
    mBox.append(mLbl, mVal);
    metricsWrap.appendChild(mBox);
    metricRefs[m.key] = mVal;
  }

  const footnote = doc.createElement('p');
  footnote.className = 'sim-footnote';
  footnote.textContent = config.footnote;

  card.append(header, controlsWrap, canvasWrap, metricsWrap, footnote);
  return { card, canvas, canvasWrap, state, metricRefs, actionBtn };
}

/* ============================================================================
 * 1. SIM-LOB: Limit Order Book Depth, Market Buy Sweep, Kyle's Lambda & OFI
 * ========================================================================== */
function mountLobSimulator(containerEl, doc) {
  let seed = 20261116;

  const ui = buildShell(doc, {
    id: 'sim-lob',
    title: 'Phòng thí nghiệm Sổ lệnh Giới hạn (Limit Order Book) & Hệ số Kyle λ',
    subtitle:
      'Quét thanh khoản chào bán theo quy mô lệnh thị trường, kiểm chứng độ mở rộng chênh lệch Glosten-Milgrom và đường trượt giá Kyle.',
    actionLabel: 'Tạo chuỗi luồng lệnh OFI mới',
    controls: [
      {
        key: 'alpha',
        label: 'Tỷ lệ giao dịch nội gián α',
        min: 0.05,
        max: 0.80,
        step: 0.05,
        initial: 0.25,
        format: (v) => `${(v * 100).toFixed(0)}%`,
      },
      {
        key: 'sigmaU',
        label: 'Thanh khoản nhiễu σ_u mỗi bậc',
        min: 60,
        max: 600,
        step: 20,
        initial: 220,
        format: (v) => `${v} lô`,
      },
      {
        key: 'buyQty',
        label: 'Lệnh mua thị trường Q_buy',
        min: 20,
        max: 1600,
        step: 20,
        initial: 420,
        format: (v) => `${v} lô`,
      },
      {
        key: 'sigmaV',
        label: 'Bất định giá trị thực σ_v',
        min: 0.10,
        max: 1.50,
        step: 0.05,
        initial: 0.50,
        format: (v) => `$${v.toFixed(2)}`,
      },
    ],
    metrics: [
      { key: 'spreadMicro', label: 'Chênh lệch s₁ / Giá vi mô' },
      { key: 'vwapSlip', label: 'Giá khớp VWAP / Trượt giá' },
      { key: 'kyleLambda', label: 'Hệ số Kyle λ / Cường độ β_K' },
      { key: 'rollOfi', label: 'Chênh lệch Roll / R²(Δm, OFI)' },
    ],
    footnote:
      'Trái: Độ sâu lũy kế 8 bậc giá chào mua - chào bán quanh $100.00 (vùng tô vàng cam là các bậc chào bán bị lệnh Q_buy quét khớp). Phải: So sánh trượt giá bậc thang thực tế với xấp xỉ tuyến tính ΔP = λ·Q của Kyle.',
    onUpdate: () => render(),
  });

  ui.actionBtn.addEventListener('click', () => {
    seed = (seed + 7919) >>> 0;
    render();
  });

  function computeBook(state) {
    const rng = createRng(seed);
    const mid = 100.0;
    const tick = 0.02;
    const gmSpread = Math.max(tick, state.alpha * 2 * state.sigmaV);
    const halfSpread = gmSpread / 2;

    const levels = 8;
    const bids = [];
    const asks = [];
    let cumBid = 0;
    let cumAsk = 0;

    for (let lvl = 0; lvl < levels; lvl += 1) {
      const shape = 1 + 0.18 * lvl;
      const bidNoise = 0.72 + 0.56 * rng();
      const askNoise = 0.72 + 0.56 * rng();
      // Slight liquidity thinning when adverse selection alpha is high
      const liquidityFactor = Math.max(0.35, 1.12 - 0.55 * state.alpha);
      const qBid = Math.max(15, Math.round(state.sigmaU * shape * bidNoise * liquidityFactor));
      const qAsk = Math.max(15, Math.round(state.sigmaU * shape * askNoise * liquidityFactor));
      cumBid += qBid;
      cumAsk += qAsk;
      bids.push({
        price: Number((mid - halfSpread - lvl * tick).toFixed(4)),
        qty: qBid,
        cumQty: cumBid,
      });
      asks.push({
        price: Number((mid + halfSpread + lvl * tick).toFixed(4)),
        qty: qAsk,
        cumQty: cumAsk,
      });
    }

    const sweepCost = (orderQty) => {
      let rem = orderQty;
      let notional = 0;
      let filled = 0;
      let levelsSwept = 0;
      for (const level of asks) {
        if (rem <= 0) break;
        const take = Math.min(rem, level.qty);
        notional += take * level.price;
        filled += take;
        rem -= take;
        if (take > 0) levelsSwept += 1;
      }
      if (rem > 0) {
        const tailPrice = asks[asks.length - 1].price + tick * (1 + rem / Math.max(50, state.sigmaU));
        notional += rem * tailPrice;
        filled += rem;
      }
      const vwap = notional / Math.max(1, filled);
      return { vwap, impactUsd: vwap - mid, slippageBps: ((vwap - mid) / mid) * 1e4, levelsSwept };
    };

    const exec = sweepCost(state.buyQty);
    const microprice =
      (bids[0].qty * asks[0].price + asks[0].qty * bids[0].price)
      / (bids[0].qty + asks[0].qty);

    // Kyle (1985): lambda = sqrt(Sigma_0) / (2 * sigma_u), beta_K = sigma_u / sqrt(Sigma_0)
    const kyleLambda = state.sigmaV / (2 * state.sigmaU);
    const kyleBeta = state.sigmaU / Math.max(0.05, state.sigmaV);

    // Simulate 80 order-flow ticks to compute Roll implied spread & OFI R^2
    const cEff = halfSpread;
    const dPrices = [];
    const ofiArr = [];
    const dmArr = [];
    let prevSign = rng() < 0.5 ? 1 : -1;
    for (let t = 0; t < 80; t += 1) {
      const sign = rng() < 0.5 ? 1 : -1;
      const ofi = (sign * (0.5 + rng()) * state.sigmaU) * 0.4;
      const infoShock = (tick / (2 * Math.max(30, state.sigmaU))) * ofi
        + sampleStandardNormal(rng) * tick * 0.18;
      const dp = infoShock + cEff * (sign - prevSign);
      dPrices.push(dp);
      ofiArr.push(ofi);
      dmArr.push(infoShock);
      prevSign = sign;
    }

    let covLag1 = 0;
    for (let t = 1; t < dPrices.length; t += 1) {
      covLag1 += dPrices[t] * dPrices[t - 1];
    }
    covLag1 /= dPrices.length - 1;
    const rollSpread = covLag1 < 0 ? 2 * Math.sqrt(-covLag1) : 0;

    // R^2 between dmArr and ofiArr
    const meanX = ofiArr.reduce((a, b) => a + b, 0) / ofiArr.length;
    const meanY = dmArr.reduce((a, b) => a + b, 0) / dmArr.length;
    let sxy = 0;
    let sxx = 0;
    let syy = 0;
    for (let t = 0; t < ofiArr.length; t += 1) {
      const dx = ofiArr[t] - meanX;
      const dy = dmArr[t] - meanY;
      sxy += dx * dy;
      sxx += dx * dx;
      syy += dy * dy;
    }
    const r2Ofi = sxx > 0 && syy > 0 ? (sxy * sxy) / (sxx * syy) : 0;

    return {
      mid,
      gmSpread,
      bids,
      asks,
      exec,
      sweepCost,
      microprice,
      kyleLambda,
      kyleBeta,
      rollSpread,
      r2Ofi,
    };
  }

  function render() {
    const data = computeBook(ui.state);

    ui.metricRefs.spreadMicro.textContent =
      `$${data.gmSpread.toFixed(2)} | $${data.microprice.toFixed(3)}`;
    ui.metricRefs.vwapSlip.textContent =
      `$${data.exec.vwap.toFixed(3)} (+${data.exec.slippageBps.toFixed(1)} bps)`;
    ui.metricRefs.kyleLambda.textContent =
      `${(data.kyleLambda * 1000).toFixed(2)} $/kLô | ${data.kyleBeta.toFixed(0)}`;
    ui.metricRefs.rollOfi.textContent =
      `$${data.rollSpread.toFixed(2)} | R²=${(data.r2Ofi * 100).toFixed(0)}%`;

    const { ctx, width, height, finish } = setupHiDpiCanvas(ui.canvas, ui.canvasWrap, 300);
    const padTop = 30;
    const padBottom = 36;
    const gap = 36;
    const panelW = Math.max(110, (width - 56 - gap) / 2);
    const leftX = 34;
    const rightX = leftX + panelW + gap;
    const plotH = height - padTop - padBottom;

    // --- Left Panel: Cumulative LOB Depth + Market Sweep ---
    const minPrice = data.bids[data.bids.length - 1].price - 0.02;
    const maxPrice = data.asks[data.asks.length - 1].price + 0.02;
    const maxDepth = Math.max(
      data.bids[data.bids.length - 1].cumQty,
      data.asks[data.asks.length - 1].cumQty,
      ui.state.buyQty
    ) * 1.12;

    const pxLeft = (p) => leftX + ((p - minPrice) / (maxPrice - minPrice)) * panelW;
    const pyLeft = (q) => padTop + plotH - (q / maxDepth) * plotH;

    // Gridlines
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g += 1) {
      const gy = padTop + (plotH * g) / 4;
      ctx.beginPath();
      ctx.moveTo(leftX, gy);
      ctx.lineTo(leftX + panelW, gy);
      ctx.stroke();
    }

    // Bid staircase polygon
    ctx.beginPath();
    ctx.moveTo(pxLeft(data.bids[0].price), pyLeft(0));
    for (let i = 0; i < data.bids.length; i += 1) {
      const b = data.bids[i];
      const nextP = i + 1 < data.bids.length ? data.bids[i + 1].price : minPrice;
      ctx.lineTo(pxLeft(b.price), pyLeft(b.cumQty));
      ctx.lineTo(pxLeft(nextP), pyLeft(b.cumQty));
    }
    ctx.lineTo(pxLeft(minPrice), pyLeft(0));
    ctx.closePath();
    ctx.fillStyle = PALETTE.tealSoft;
    ctx.fill();
    ctx.strokeStyle = PALETTE.teal;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ask staircase polygon
    ctx.beginPath();
    ctx.moveTo(pxLeft(data.asks[0].price), pyLeft(0));
    for (let i = 0; i < data.asks.length; i += 1) {
      const a = data.asks[i];
      const nextP = i + 1 < data.asks.length ? data.asks[i + 1].price : maxPrice;
      ctx.lineTo(pxLeft(a.price), pyLeft(a.cumQty));
      ctx.lineTo(pxLeft(nextP), pyLeft(a.cumQty));
    }
    ctx.lineTo(pxLeft(maxPrice), pyLeft(0));
    ctx.closePath();
    ctx.fillStyle = PALETTE.crimsonSoft;
    ctx.fill();
    ctx.strokeStyle = PALETTE.crimson;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight swept ask levels in amber
    let remSweep = ui.state.buyQty;
    let prevCum = 0;
    for (let i = 0; i < data.asks.length && remSweep > 0; i += 1) {
      const a = data.asks[i];
      const nextP = i + 1 < data.asks.length ? data.asks[i + 1].price : maxPrice;
      const take = Math.min(remSweep, a.qty);
      const topQty = prevCum + take;
      const x0 = pxLeft(a.price);
      const x1 = pxLeft(nextP);
      const y0 = pyLeft(topQty);
      const y1 = pyLeft(0);
      ctx.fillStyle = PALETTE.amberSoft;
      ctx.fillRect(x0, y0, Math.max(2, x1 - x0), y1 - y0);
      prevCum += a.qty;
      remSweep -= take;
    }

    // Midprice & VWAP vertical dashed lines
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = PALETTE.axis;
    ctx.beginPath();
    ctx.moveTo(pxLeft(data.mid), padTop);
    ctx.lineTo(pxLeft(data.mid), padTop + plotH);
    ctx.stroke();

    const clampedVwap = Math.min(maxPrice, data.exec.vwap);
    ctx.strokeStyle = PALETTE.amber;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(pxLeft(clampedVwap), padTop);
    ctx.lineTo(pxLeft(clampedVwap), padTop + plotH);
    ctx.stroke();
    ctx.restore();

    // Titles & Axis Labels (Left)
    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Độ sâu Sổ lệnh Lũy kế & Vùng Khớp Q_buy', leftX, 18);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`$${minPrice.toFixed(2)}`, leftX + 18, height - 10);
    ctx.fillText(`m₀=$${data.mid.toFixed(2)}`, pxLeft(data.mid), height - 10);
    ctx.fillText(`$${maxPrice.toFixed(2)}`, leftX + panelW - 18, height - 10);

    // --- Right Panel: Nonlinear LOB Slippage vs Kyle Linear Impact ---
    const maxQ = 1600;
    const sampleQs = [];
    let maxImpact = 0.05;
    for (let q = 20; q <= maxQ; q += 40) {
      const imp = data.sweepCost(q).impactUsd;
      const kyleImp = data.gmSpread / 2 + data.kyleLambda * q;
      maxImpact = Math.max(maxImpact, imp, kyleImp);
      sampleQs.push({ q, imp, kyleImp });
    }
    maxImpact *= 1.12;

    const pxRight = (q) => rightX + (q / maxQ) * panelW;
    const pyRight = (imp) => padTop + plotH - (imp / maxImpact) * plotH;

    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g += 1) {
      const gy = padTop + (plotH * g) / 4;
      ctx.beginPath();
      ctx.moveTo(rightX, gy);
      ctx.lineTo(rightX + panelW, gy);
      ctx.stroke();
    }

    // Kyle linear benchmark (s/2 + lambda * Q)
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = PALETTE.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    sampleQs.forEach((pt, idx) => {
      const x = pxRight(pt.q);
      const y = pyRight(pt.kyleImp);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Actual LOB walk-the-book curve
    ctx.strokeStyle = PALETTE.crimson;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    sampleQs.forEach((pt, idx) => {
      const x = pxRight(pt.q);
      const y = pyRight(pt.imp);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Active Q_buy marker dot
    const curX = pxRight(ui.state.buyQty);
    const curY = pyRight(data.exec.impactUsd);
    ctx.fillStyle = PALETTE.amber;
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Đường Trượt giá LOB (đỏ) vs Tuyến tính Kyle (xanh)', rightX, 18);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0 lô', rightX + 12, height - 10);
    ctx.fillText('800 lô', rightX + panelW / 2, height - 10);
    ctx.fillText('1600 lô', rightX + panelW - 22, height - 10);

    finish();
  }

  containerEl.replaceChildren(ui.card);
  render();
  return { id: 'sim-lob', update: render };
}

/* ============================================================================
 * 2. SIM-MARTINGALE: Random Walk Barriers, Optional Stopping & Gambler's Ruin
 * ========================================================================== */
function mountMartingaleSimulator(containerEl, doc) {
  let seed = 20260204;

  const ui = buildShell(doc, {
    id: 'sim-martingale',
    title: 'Bước đi Ngẫu nhiên, Định lý Dừng Tùy ý (Optional Stopping) & Phá sản Con bạc',
    subtitle:
      'Đối chiếu 40 quỹ đạo mẫu hiển thị và thống kê Monte Carlo với nghiệm đóng chính xác của Martingale De Moivre.',
    actionLabel: 'Lấy mẫu quỹ đạo ngẫu nhiên mới',
    controls: [
      {
        key: 'p',
        label: 'Xác suất thắng mỗi bước p',
        min: 0.40,
        max: 0.60,
        step: 0.005,
        initial: 0.50,
        format: (v) => v.toFixed(3),
      },
      {
        key: 'barrierA',
        label: 'Biên chốt lời trên +A',
        min: 5,
        max: 40,
        step: 1,
        initial: 10,
        format: (v) => `+${v}`,
      },
      {
        key: 'barrierB',
        label: 'Biên cắt lỗ dưới −B',
        min: 5,
        max: 50,
        step: 1,
        initial: 30,
        format: (v) => `−${v}`,
      },
      {
        key: 'mcRuns',
        label: 'Số quỹ đạo kiểm định M',
        min: 100,
        max: 1500,
        step: 100,
        initial: 500,
        format: (v) => `${v}`,
      },
    ],
    metrics: [
      { key: 'winProb', label: 'Xác suất chạm +A (Lý thuyết / Mẫu)' },
      { key: 'stopSteps', label: 'Số bước dừng E[τ] (Lý thuyết / Mẫu)' },
      { key: 'deMoivreRho', label: 'Tỷ số ρ = q/p / Trôi μ = 2p−1' },
      { key: 'doobBound', label: 'Cận trên Doob P(inf S_n ≤ −B)' },
    ],
    footnote:
      'Đường ngang đứt nét xanh ngọc (+A) là biên chốt lời, đỏ thẫm (−B) là biên cắt lỗ; 40 quỹ đạo đầu tiên được vẽ trực tiếp cùng đường trung bình dừng S̄_{n∧τ} màu xanh đậm.',
    onUpdate: () => render(),
  });

  ui.actionBtn.addEventListener('click', () => {
    seed = (seed + 104729) >>> 0;
    render();
  });

  function computeAnalytical(p, A, B) {
    const q = 1 - p;
    const drift = p - q;
    if (Math.abs(drift) < 1e-8) {
      return {
        pWin: B / (A + B),
        expectedTau: A * B,
        rho: 1,
        drift: 0,
        doobBound: 1,
      };
    }
    const rho = q / p;
    const logRho = Math.log(rho);
    // Stable evaluation of (1 - rho^B) / (1 - rho^(A+B))
    let pWin;
    if (logRho > 0) {
      // p < 0.5 -> rho > 1: factor out rho^(A+B)
      const term1 = Math.exp(-A * logRho);
      const term2 = Math.exp(-(A + B) * logRho);
      pWin = (term1 - term2) / (1 - term2);
    } else {
      const rB = Math.exp(B * logRho);
      const rAB = Math.exp((A + B) * logRho);
      pWin = (1 - rB) / (1 - rAB);
    }
    pWin = Math.min(1, Math.max(0, pWin));
    const expectedTerminal = pWin * A - (1 - pWin) * B;
    const expectedTau = expectedTerminal / drift;
    const doobBound = p > 0.5 ? Math.min(1, Math.exp(B * logRho)) : 1;
    return { pWin, expectedTau, rho, drift, doobBound };
  }

  function render() {
    const { p, barrierA: A, barrierB: B, mcRuns } = ui.state;
    const theory = computeAnalytical(p, A, B);
    const rng = createRng(seed);

    const maxSteps = Math.min(20000, Math.max(600, Math.ceil(theory.expectedTau * 7)));
    const plotStepCap = Math.min(maxSteps, Math.max(60, Math.ceil(theory.expectedTau * 2.4)));
    const meanCurve = new Float64Array(plotStepCap + 1);

    const drawnPaths = [];
    let wins = 0;
    let totalTau = 0;

    for (let m = 0; m < mcRuns; m += 1) {
      let s = 0;
      let hitStep = maxSteps;
      const keepPath = m < 40;
      const pts = keepPath ? [0] : null;

      for (let step = 1; step <= maxSteps; step += 1) {
        if (s < A && s > -B) {
          s += rng() < p ? 1 : -1;
          if (s >= A || s <= -B) {
            hitStep = step;
          }
        }
        if (step <= plotStepCap) {
          meanCurve[step] += s;
        }
        if (keepPath && step <= plotStepCap) {
          pts.push(s);
          if (s >= A || s <= -B) {
            // Freeze plotted path once absorbed at barrier
            for (let rest = step + 1; rest <= plotStepCap; rest += 1) {
              meanCurve[rest] += s;
            }
            step = plotStepCap;
            // Continue only if not yet absorbed (already absorbed here)
            break;
          }
        } else if (!keepPath && (s >= A || s <= -B)) {
          for (let rest = step + 1; rest <= plotStepCap; rest += 1) {
            meanCurve[rest] += s;
          }
          break;
        }
      }

      if (s >= A) wins += 1;
      totalTau += hitStep;
      if (keepPath) {
        const endVal = pts[pts.length - 1];
        drawnPaths.push({ pts, won: endVal >= A, ruined: endVal <= -B });
      }
    }

    for (let k = 0; k <= plotStepCap; k += 1) {
      meanCurve[k] /= mcRuns;
    }

    const empWin = wins / mcRuns;
    const empTau = totalTau / mcRuns;

    ui.metricRefs.winProb.textContent =
      `${(theory.pWin * 100).toFixed(1)}% vs ${(empWin * 100).toFixed(1)}%`;
    ui.metricRefs.stopSteps.textContent =
      `${theory.expectedTau.toFixed(1)} vs ${empTau.toFixed(1)}`;
    ui.metricRefs.deMoivreRho.textContent =
      `${theory.rho.toFixed(3)} | ${theory.drift >= 0 ? '+' : ''}${theory.drift.toFixed(3)}`;
    ui.metricRefs.doobBound.textContent =
      p > 0.5 ? `≤ ${(theory.doobBound * 100).toFixed(2)}%` : '100% (p ≤ 0.5)';

    const { ctx, width, height, finish } = setupHiDpiCanvas(ui.canvas, ui.canvasWrap, 300);
    const padLeft = 48;
    const padRight = 24;
    const padTop = 28;
    const padBottom = 34;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const yMin = -B - Math.max(2, (A + B) * 0.08);
    const yMax = A + Math.max(2, (A + B) * 0.08);
    const px = (step) => padLeft + (step / plotStepCap) * plotW;
    const py = (val) => padTop + ((yMax - val) / (yMax - yMin)) * plotH;

    // Zero baseline
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, py(0));
    ctx.lineTo(padLeft + plotW, py(0));
    ctx.stroke();

    // +A and -B barriers
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = PALETTE.teal;
    ctx.beginPath();
    ctx.moveTo(padLeft, py(A));
    ctx.lineTo(padLeft + plotW, py(A));
    ctx.stroke();

    ctx.strokeStyle = PALETTE.crimson;
    ctx.beginPath();
    ctx.moveTo(padLeft, py(-B));
    ctx.lineTo(padLeft + plotW, py(-B));
    ctx.stroke();
    ctx.restore();

    // 40 Sample trajectories
    for (const pathObj of drawnPaths) {
      ctx.strokeStyle = pathObj.won
        ? 'rgba(15, 118, 110, 0.28)'
        : pathObj.ruined
          ? 'rgba(190, 18, 60, 0.26)'
          : 'rgba(100, 116, 139, 0.25)';
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      const stride = Math.max(1, Math.floor(pathObj.pts.length / 240));
      for (let idx = 0; idx < pathObj.pts.length; idx += stride) {
        const x = px(idx);
        const y = py(pathObj.pts[idx]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const lastIdx = pathObj.pts.length - 1;
      ctx.lineTo(px(lastIdx), py(pathObj.pts[lastIdx]));
      ctx.stroke();

      // Terminal absorption dot
      if (pathObj.won || pathObj.ruined) {
        ctx.fillStyle = pathObj.won ? PALETTE.teal : PALETTE.crimson;
        ctx.beginPath();
        ctx.arc(px(lastIdx), py(pathObj.pts[lastIdx]), 2.6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Stopped empirical mean curve S_bar_{n ^ tau}
    ctx.strokeStyle = PALETTE.blue;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const meanStride = Math.max(1, Math.floor(plotStepCap / 260));
    for (let k = 0; k <= plotStepCap; k += meanStride) {
      const x = px(k);
      const y = py(meanCurve[k]);
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(px(plotStepCap), py(meanCurve[plotStepCap]));
    ctx.stroke();

    // Labels
    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('40 Quỹ đạo Dừng S_{n∧τ} & Trung bình Mẫu (xanh đậm)', padLeft, 18);

    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = PALETTE.teal;
    ctx.fillText(`+A=${A}`, padLeft - 6, py(A) + 4);
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText('0', padLeft - 6, py(0) + 4);
    ctx.fillStyle = PALETTE.crimson;
    ctx.fillText(`−B=${B}`, padLeft - 6, py(-B) + 4);

    ctx.fillStyle = PALETTE.muted;
    ctx.textAlign = 'center';
    ctx.fillText('n = 0', padLeft + 16, height - 10);
    ctx.fillText(`n = ${Math.round(plotStepCap / 2)}`, padLeft + plotW / 2, height - 10);
    ctx.fillText(`n = ${plotStepCap} bước`, padLeft + plotW - 36, height - 10);

    finish();
  }

  containerEl.replaceChildren(ui.card);
  render();
  return { id: 'sim-martingale', update: render };
}

/* ============================================================================
 * 3. SIM-RMT: Marchenko-Pastur Eigenvalue Spectrum & Ledoit-Wolf Shrinkage
 * ========================================================================== */
function computeSymmetricEigenvalues(matrix, n) {
  const a = Float64Array.from(matrix);
  const maxSweeps = 10;
  for (let sweep = 0; sweep < maxSweeps; sweep += 1) {
    let maxOff = 0;
    for (let p = 0; p < n - 1; p += 1) {
      for (let q = p + 1; q < n; q += 1) {
        const apq = a[p * n + q];
        const absApq = Math.abs(apq);
        if (absApq > maxOff) maxOff = absApq;
        if (absApq < 1e-10) continue;

        const app = a[p * n + p];
        const aqq = a[q * n + q];
        const tau = (aqq - app) / (2 * apq);
        const t =
          tau >= 0
            ? 1 / (tau + Math.sqrt(1 + tau * tau))
            : -1 / (-tau + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;

        a[p * n + p] = app - t * apq;
        a[q * n + q] = aqq + t * apq;
        a[p * n + q] = 0;
        a[q * n + p] = 0;

        for (let k = 0; k < n; k += 1) {
          if (k === p || k === q) continue;
          const akp = a[k * n + p];
          const akq = a[k * n + q];
          a[k * n + p] = c * akp - s * akq;
          a[p * n + k] = a[k * n + p];
          a[k * n + q] = s * akp + c * akq;
          a[q * n + k] = a[k * n + q];
        }
      }
    }
    if (maxOff < 1e-8) break;
  }

  const eigs = new Array(n);
  for (let i = 0; i < n; i += 1) {
    eigs[i] = Math.max(0, a[i * n + i]);
  }
  eigs.sort((x, y) => y - x);
  return eigs;
}

function mountRmtSimulator(containerEl, doc) {
  let seed = 20260402;
  let cachedSpecKey = '';
  let cachedRawEigenvalues = [];

  const ui = buildShell(doc, {
    id: 'sim-rmt',
    title: 'Phổ Trị riêng Marchenko-Pastur & Làm co Hiệp phương sai (Covariance Shrinkage)',
    subtitle:
      'Chéo hóa trực giao ma trận tương quan mẫu 48 tài sản, tách gai nhân tố khỏi vòm nhiễu và ghim số điều kiện bằng Ledoit-Wolf.',
    actionLabel: 'Sinh ma trận lợi nhuận mẫu mới',
    controls: [
      {
        key: 'qRatio',
        label: 'Tỷ số chiều q = N / T',
        min: 0.10,
        max: 0.95,
        step: 0.05,
        initial: 0.45,
        format: (v) => v.toFixed(2),
      },
      {
        key: 'factorStrength',
        label: 'Cường độ nhân tố thị trường',
        min: 0.00,
        max: 0.50,
        step: 0.05,
        initial: 0.20,
        format: (v) => `${(v * 100).toFixed(0)}%`,
      },
      {
        key: 'shrinkDelta',
        label: 'Cường độ làm co Ledoit-Wolf δ',
        min: 0.00,
        max: 1.00,
        step: 0.02,
        initial: 0.22,
        format: (v) => v.toFixed(2),
      },
    ],
    metrics: [
      { key: 'mpBounds', label: 'Biên nhiễu MP [λ₋, λ₊]' },
      { key: 'minEig', label: 'Trị riêng đáy λ_min (Gốc → Co)' },
      { key: 'condNum', label: 'Số điều kiện κ (Gốc → Co)' },
      { key: 'wishartInf', label: 'Phóng đại rủi ro GMV 1/(1−q)' },
    ],
    footnote:
      'Trái: Tần suất trị riêng phần thân so với đường cong mật độ Marchenko-Pastur lý thuyết (đỏ) và phổ sau làm co δ (xanh ngọc). Phải: Đường rơi log₁₀(κ) của số điều kiện khi tăng δ ∈ [0, 1].',
    onUpdate: () => render(),
  });

  ui.actionBtn.addEventListener('click', () => {
    seed = (seed + 65537) >>> 0;
    cachedSpecKey = '';
    render();
  });

  function getEigenvalues(qRatio, factorStrength) {
    const key = `${seed}:${qRatio.toFixed(3)}:${factorStrength.toFixed(3)}`;
    if (key === cachedSpecKey && cachedRawEigenvalues.length > 0) {
      return cachedRawEigenvalues;
    }

    const N = 48;
    const T = Math.max(N + 2, Math.round(N / qRatio));
    const rng = createRng(seed);
    const data = new Float64Array(T * N);

    const wMkt = Math.sqrt(factorStrength);
    const wSec = Math.sqrt(0.45 * factorStrength);
    const wIdio = Math.sqrt(Math.max(0.12, 1 - 1.45 * factorStrength));

    for (let t = 0; t < T; t += 1) {
      const fMkt = sampleStandardNormal(rng);
      const fSec0 = sampleStandardNormal(rng);
      const fSec1 = sampleStandardNormal(rng);
      for (let i = 0; i < N; i += 1) {
        const sec = i < N / 2 ? fSec0 : fSec1;
        data[t * N + i] = wMkt * fMkt + wSec * sec + wIdio * sampleStandardNormal(rng);
      }
    }

    // Standardize columns to mean 0, variance 1
    for (let i = 0; i < N; i += 1) {
      let mean = 0;
      for (let t = 0; t < T; t += 1) mean += data[t * N + i];
      mean /= T;
      let s2 = 0;
      for (let t = 0; t < T; t += 1) {
        const d = data[t * N + i] - mean;
        data[t * N + i] = d;
        s2 += d * d;
      }
      const std = Math.sqrt(s2 / T) || 1;
      for (let t = 0; t < T; t += 1) {
        data[t * N + i] /= std;
      }
    }

    const corr = new Float64Array(N * N);
    for (let i = 0; i < N; i += 1) {
      corr[i * N + i] = 1;
      for (let j = i + 1; j < N; j += 1) {
        let dot = 0;
        for (let t = 0; t < T; t += 1) {
          dot += data[t * N + i] * data[t * N + j];
        }
        const c = dot / T;
        corr[i * N + j] = c;
        corr[j * N + i] = c;
      }
    }

    cachedRawEigenvalues = computeSymmetricEigenvalues(corr, N);
    cachedSpecKey = key;
    return cachedRawEigenvalues;
  }

  function render() {
    const { qRatio, factorStrength, shrinkDelta } = ui.state;
    const rawEigs = getEigenvalues(qRatio, factorStrength);
    const N = rawEigs.length;
    const shrunkEigs = rawEigs.map((lam) => (1 - shrinkDelta) * lam + shrinkDelta * 1.0);

    // Effective noise variance after stripping top 2 factor spikes when factorStrength > 0
    const numSpikes = factorStrength > 0.02 ? 2 : 0;
    let spikeSum = 0;
    for (let k = 0; k < numSpikes; k += 1) spikeSum += rawEigs[k];
    const sigmaEff2 = Math.max(0.25, 1 - spikeSum / N);

    const sqrtQ = Math.sqrt(qRatio);
    const lamMinus = sigmaEff2 * (1 - sqrtQ) * (1 - sqrtQ);
    const lamPlus = sigmaEff2 * (1 + sqrtQ) * (1 + sqrtQ);

    const rawMin = Math.max(1e-5, rawEigs[N - 1]);
    const rawMax = rawEigs[0];
    const shrunkMin = Math.max(1e-5, shrunkEigs[N - 1]);
    const shrunkMax = shrunkEigs[0];

    const kappaRaw = rawMax / rawMin;
    const kappaShrunk = shrunkMax / shrunkMin;
    const oosInflation = 1 / Math.max(0.05, 1 - qRatio);

    ui.metricRefs.mpBounds.textContent = `[${lamMinus.toFixed(2)}, ${lamPlus.toFixed(2)}]`;
    ui.metricRefs.minEig.textContent = `${rawMin.toFixed(3)} → ${shrunkMin.toFixed(3)}`;
    ui.metricRefs.condNum.textContent =
      `${kappaRaw.toFixed(1)} → ${kappaShrunk.toFixed(1)}`;
    ui.metricRefs.wishartInf.textContent = `${oosInflation.toFixed(2)}× phương sai chuẩn`;

    const { ctx, width, height, finish } = setupHiDpiCanvas(ui.canvas, ui.canvasWrap, 300);
    const padTop = 30;
    const padBottom = 36;
    const gap = 38;
    const panelW = Math.max(110, (width - 60 - gap) / 2);
    const leftX = 36;
    const rightX = leftX + panelW + gap;
    const plotH = height - padTop - padBottom;

    // --- Left Panel: Bulk Eigenvalue Histogram + Marchenko-Pastur Curve ---
    const xMax = Math.max(3.6, lamPlus * 1.25);
    const numBins = 16;
    const binW = xMax / numBins;
    const rawHist = new Array(numBins).fill(0);
    const shrunkHist = new Array(numBins).fill(0);
    let outlierCount = 0;

    for (const lam of rawEigs) {
      if (lam >= xMax) {
        outlierCount += 1;
      } else {
        const b = Math.min(numBins - 1, Math.max(0, Math.floor(lam / binW)));
        rawHist[b] += 1 / (N * binW);
      }
    }
    for (const lam of shrunkEigs) {
      if (lam < xMax) {
        const b = Math.min(numBins - 1, Math.max(0, Math.floor(lam / binW)));
        shrunkHist[b] += 1 / (N * binW);
      }
    }

    // Evaluate MP analytical curve peak for scaling
    const mpPoints = [];
    let maxDensity = 0.9;
    for (const d of rawHist) maxDensity = Math.max(maxDensity, d);
    for (const d of shrunkHist) maxDensity = Math.max(maxDensity, d);

    for (let s = 1; s <= 120; s += 1) {
      const lam = lamMinus + ((lamPlus - lamMinus) * s) / 121;
      const density =
        Math.sqrt(Math.max(0, (lamPlus - lam) * (lam - lamMinus)))
        / (2 * Math.PI * sigmaEff2 * qRatio * Math.max(0.03, lam));
      mpPoints.push({ lam, density });
      if (lam > 0.08) maxDensity = Math.max(maxDensity, Math.min(3.2, density));
    }
    maxDensity *= 1.12;

    const pxL = (lam) => leftX + (lam / xMax) * panelW;
    const pyL = (dens) => padTop + plotH - (Math.min(maxDensity, dens) / maxDensity) * plotH;

    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g += 1) {
      const gy = padTop + (plotH * g) / 4;
      ctx.beginPath();
      ctx.moveTo(leftX, gy);
      ctx.lineTo(leftX + panelW, gy);
      ctx.stroke();
    }

    // Raw histogram bars
    for (let b = 0; b < numBins; b += 1) {
      const x0 = pxL(b * binW) + 1;
      const wBar = Math.max(2, pxL((b + 1) * binW) - pxL(b * binW) - 2);
      const yRaw = pyL(rawHist[b]);
      ctx.fillStyle = PALETTE.blueSoft;
      ctx.strokeStyle = PALETTE.blue;
      ctx.lineWidth = 1;
      ctx.fillRect(x0, yRaw, wBar, padTop + plotH - yRaw);
      ctx.strokeRect(x0, yRaw, wBar, padTop + plotH - yRaw);

      if (shrinkDelta > 0.01) {
        const ySh = pyL(shrunkHist[b]);
        ctx.fillStyle = PALETTE.tealSoft;
        ctx.fillRect(x0 + 2, ySh, Math.max(1, wBar - 4), padTop + plotH - ySh);
      }
    }

    // MP theoretical dome curve
    ctx.strokeStyle = PALETTE.crimson;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    mpPoints.forEach((pt, idx) => {
      const x = pxL(pt.lam);
      const y = pyL(pt.density);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Vertical dashed bounds at lamMinus & lamPlus
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = PALETTE.amber;
    ctx.lineWidth = 1.5;
    for (const bound of [lamMinus, lamPlus]) {
      ctx.beginPath();
      ctx.moveTo(pxL(bound), padTop);
      ctx.lineTo(pxL(bound), padTop + plotH);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    const spikeNote = outlierCount > 0 ? ` (+${outlierCount} gai > ${xMax.toFixed(1)}, λ₁=${rawMax.toFixed(1)})` : '';
    ctx.fillText(`Phổ Trị riêng & Vòm MP${spikeNote}`, leftX, 18);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('λ = 0', leftX + 14, height - 10);
    ctx.fillText(`λ₊=${lamPlus.toFixed(2)}`, pxL(lamPlus), height - 10);
    ctx.fillText(`${xMax.toFixed(1)}`, leftX + panelW - 12, height - 10);

    // --- Right Panel: Log10 Condition Number kappa(delta) ---
    const curvePts = [];
    let maxLogK = 1;
    for (let s = 0; s <= 50; s += 1) {
      const d = s / 50;
      const topL = (1 - d) * rawMax + d * 1.0;
      const botL = Math.max(1e-5, (1 - d) * rawMin + d * 1.0);
      const logK = Math.log10(Math.max(1, topL / botL));
      maxLogK = Math.max(maxLogK, logK);
      curvePts.push({ d, logK });
    }
    maxLogK *= 1.1;

    const pxR = (d) => rightX + d * panelW;
    const pyR = (lk) => padTop + plotH - (lk / maxLogK) * plotH;

    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g += 1) {
      const gy = padTop + (plotH * g) / 4;
      ctx.beginPath();
      ctx.moveTo(rightX, gy);
      ctx.lineTo(rightX + panelW, gy);
      ctx.stroke();
    }

    ctx.strokeStyle = PALETTE.teal;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    curvePts.forEach((pt, idx) => {
      const x = pxR(pt.d);
      const y = pyR(pt.logK);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const curLogK = Math.log10(Math.max(1, kappaShrunk));
    ctx.fillStyle = PALETTE.crimson;
    ctx.beginPath();
    ctx.arc(pxR(shrinkDelta), pyR(curLogK), 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Sự Sụt giảm log₁₀(κ) Khi Tăng Làm co δ', rightX, 18);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('δ = 0.0', rightX + 18, height - 10);
    ctx.fillText('δ = 0.5', rightX + panelW / 2, height - 10);
    ctx.fillText('δ = 1.0', rightX + panelW - 18, height - 10);

    finish();
  }

  containerEl.replaceChildren(ui.card);
  render();
  return { id: 'sim-rmt', update: render };
}

/* ============================================================================
 * 4. SIM-GRINOLD: Grinold-Kahn Fundamental Law & Turnover Cost Drag
 * ========================================================================== */
function mountGrinoldSimulator(containerEl, doc) {
  let seed = 20260501;

  const ui = buildShell(doc, {
    id: 'sim-grinold',
    title: 'Định luật Cơ bản Quản trị Chủ động (Fundamental Law) & Lực cản Vòng quay',
    subtitle:
      'So sánh tốc độ tăng trưởng căn bậc hai IC·√BR·TC với sự ăn mòn tuyến tính của chi phí giao dịch khi tăng tần suất đảo danh mục.',
    actionLabel: 'Tạo dải phân vị tài sản mới',
    controls: [
      {
        key: 'ic',
        label: 'Hệ số thông tin dự báo IC',
        min: 0.005,
        max: 0.080,
        step: 0.005,
        initial: 0.025,
        format: (v) => v.toFixed(3),
      },
      {
        key: 'breadth',
        label: 'Bề rộng độc lập BR / năm',
        min: 50,
        max: 5000,
        step: 50,
        initial: 1500,
        format: (v) => `${v}`,
      },
      {
        key: 'tc',
        label: 'Hệ số chuyển đổi danh mục TC',
        min: 0.25,
        max: 1.00,
        step: 0.05,
        initial: 0.75,
        format: (v) => v.toFixed(2),
      },
      {
        key: 'costBps',
        label: 'Chi phí mỗi chiều c_bps',
        min: 0,
        max: 25,
        step: 1,
        initial: 6,
        format: (v) => `${v} bps`,
      },
    ],
    metrics: [
      { key: 'grossIr', label: 'IR gộp trước phí (TC·IC·√BR)' },
      { key: 'costDrag', label: 'Hao hụt vòng quay 2·TO·c_bps' },
      { key: 'netSharpe', label: 'Sharpe ròng kỳ vọng sau phí' },
      { key: 'optBreadth', label: 'Điểm bão hòa bề rộng tối ưu BR*' },
    ],
    footnote:
      'Trái: Đường IR gộp (xanh dương, ∝ √BR) so với Sharpe ròng sau phí (xanh ngọc, đạt đỉnh tại BR* khi đạo hàm biên của √BR bằng chi phí biên). Phải: Dải phân vị 10%–90% lợi nhuận chủ động tích lũy 3 năm tại biến động mục tiêu ω_P = 10%/năm.',
    onUpdate: () => render(),
  });

  ui.actionBtn.addEventListener('click', () => {
    seed = (seed + 49999) >>> 0;
    render();
  });

  function evalPerformance(ic, br, tc, costBps) {
    const activeVol = 0.10; // 10% target annualized tracking volatility
    // Cross-section of 200 names -> annual one-way turnover scales linearly with rebalance frequency BR / 200
    const oneWayTurnover = 0.65 * (br / 200);
    // Annual cost drag = 2 * oneWayTurnover * (costBps * 1e-4)
    const annualCostPct = 2 * oneWayTurnover * (costBps * 1e-4);
    const irDrag = annualCostPct / activeVol;
    const grossIr = tc * ic * Math.sqrt(br);
    const netSharpe = grossIr - irDrag;

    // Slope k_cost of irDrag w.r.t. br: irDrag = kSlope * br
    const kSlope = (2 * (0.65 / 200) * (costBps * 1e-4)) / activeVol;
    const optBr = kSlope > 0 ? Math.pow((tc * ic) / (2 * kSlope), 2) : Infinity;

    return { activeVol, oneWayTurnover, annualCostPct, irDrag, grossIr, netSharpe, optBr };
  }

  function render() {
    const { ic, breadth, tc, costBps } = ui.state;
    const cur = evalPerformance(ic, breadth, tc, costBps);

    ui.metricRefs.grossIr.textContent = cur.grossIr.toFixed(2);
    ui.metricRefs.costDrag.textContent =
      `−${(cur.annualCostPct * 100).toFixed(2)}%/năm (−${cur.irDrag.toFixed(2)} IR)`;
    ui.metricRefs.netSharpe.textContent = cur.netSharpe.toFixed(2);
    ui.metricRefs.optBreadth.textContent = Number.isFinite(cur.optBr)
      ? (cur.optBr > 25000 ? '> 25,000 lượt' : `${Math.round(cur.optBr)} lượt/năm`)
      : '∞ (0 bps)';

    const { ctx, width, height, finish } = setupHiDpiCanvas(ui.canvas, ui.canvasWrap, 300);
    const padTop = 30;
    const padBottom = 36;
    const gap = 38;
    const panelW = Math.max(110, (width - 62 - gap) / 2);
    const leftX = 38;
    const rightX = leftX + panelW + gap;
    const plotH = height - padTop - padBottom;

    // --- Left Panel: Gross IR vs Net Sharpe across BR in [50, 5000] ---
    const maxBr = 5000;
    const samples = [];
    let yMaxL = 1.5;
    let yMinL = 0;
    for (let b = 50; b <= maxBr; b += 50) {
      const p = evalPerformance(ic, b, tc, costBps);
      yMaxL = Math.max(yMaxL, p.grossIr);
      yMinL = Math.min(yMinL, p.netSharpe);
      samples.push({ b, gross: p.grossIr, net: p.netSharpe });
    }
    yMaxL *= 1.12;
    yMinL = Math.min(0, yMinL * 1.12);

    const pxL = (b) => leftX + (b / maxBr) * panelW;
    const pyL = (val) => padTop + ((yMaxL - val) / (yMaxL - yMinL)) * plotH;

    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g += 1) {
      const gy = padTop + (plotH * g) / 4;
      ctx.beginPath();
      ctx.moveTo(leftX, gy);
      ctx.lineTo(leftX + panelW, gy);
      ctx.stroke();
    }
    if (yMinL < 0) {
      ctx.strokeStyle = PALETTE.axis;
      ctx.beginPath();
      ctx.moveTo(leftX, pyL(0));
      ctx.lineTo(leftX + panelW, pyL(0));
      ctx.stroke();
    }

    // Gross IR dashed blue curve
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = PALETTE.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    samples.forEach((pt, idx) => {
      const x = pxL(pt.b);
      const y = pyL(pt.gross);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Net Sharpe solid teal curve
    ctx.strokeStyle = PALETTE.teal;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    samples.forEach((pt, idx) => {
      const x = pxL(pt.b);
      const y = pyL(pt.net);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Optimal BR* marker if inside [50, 5000]
    if (cur.optBr >= 50 && cur.optBr <= maxBr) {
      const pOpt = evalPerformance(ic, cur.optBr, tc, costBps);
      ctx.fillStyle = PALETTE.amber;
      ctx.beginPath();
      ctx.arc(pxL(cur.optBr), pyL(pOpt.netSharpe), 4.8, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Current BR marker
    ctx.fillStyle = PALETTE.crimson;
    ctx.beginPath();
    ctx.arc(pxL(breadth), pyL(cur.netSharpe), 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('IR Gộp (nét đứt) vs Sharpe Ròng Sau Phí (liền)', leftX, 18);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BR=50', leftX + 20, height - 10);
    ctx.fillText('2500', leftX + panelW / 2, height - 10);
    ctx.fillText('5000', leftX + panelW - 16, height - 10);

    // --- Right Panel: 3-Year Monte Carlo Cumulative Active Return Cone ---
    const rng = createRng(seed);
    const months = 36;
    const dt = 1 / 12;
    const muNet = cur.netSharpe * cur.activeVol;
    const muGross = cur.grossIr * cur.activeVol;
    const pathsCount = 120;
    const gridVals = Array.from({ length: months + 1 }, () => []);

    for (let m = 0; m < pathsCount; m += 1) {
      let cum = 0;
      gridVals[0].push(0);
      for (let step = 1; step <= months; step += 1) {
        cum += muNet * dt + cur.activeVol * Math.sqrt(dt) * sampleStandardNormal(rng);
        gridVals[step].push(cum * 100);
      }
    }

    const p10 = [];
    const p50 = [];
    const p90 = [];
    const grossLine = [];
    let minPct = -10;
    let maxPct = 20;

    for (let step = 0; step <= months; step += 1) {
      const sorted = gridVals[step].sort((a, b) => a - b);
      const v10 = sorted[Math.floor(pathsCount * 0.1)];
      const v50 = sorted[Math.floor(pathsCount * 0.5)];
      const v90 = sorted[Math.floor(pathsCount * 0.9)];
      const vGross = muGross * (step * dt) * 100;
      p10.push(v10);
      p50.push(v50);
      p90.push(v90);
      grossLine.push(vGross);
      minPct = Math.min(minPct, v10);
      maxPct = Math.max(maxPct, v90, vGross);
    }
    const padRange = Math.max(4, (maxPct - minPct) * 0.08);
    minPct -= padRange;
    maxPct += padRange;

    const pxR = (step) => rightX + (step / months) * panelW;
    const pyR = (pct) => padTop + ((maxPct - pct) / (maxPct - minPct)) * plotH;

    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightX, pyR(0));
    ctx.lineTo(rightX + panelW, pyR(0));
    ctx.stroke();

    // Shaded 10% - 90% fan
    ctx.beginPath();
    for (let step = 0; step <= months; step += 1) {
      const x = pxR(step);
      const y = pyR(p90[step]);
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let step = months; step >= 0; step -= 1) {
      ctx.lineTo(pxR(step), pyR(p10[step]));
    }
    ctx.closePath();
    ctx.fillStyle = PALETTE.tealSoft;
    ctx.fill();

    // Expected Gross line
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = PALETTE.blue;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    grossLine.forEach((val, step) => {
      if (step === 0) ctx.moveTo(pxR(step), pyR(val));
      else ctx.lineTo(pxR(step), pyR(val));
    });
    ctx.stroke();
    ctx.restore();

    // Median Net line
    ctx.strokeStyle = PALETTE.teal;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    p50.forEach((val, step) => {
      if (step === 0) ctx.moveTo(pxR(step), pyR(val));
      else ctx.lineTo(pxR(step), pyR(val));
    });
    ctx.stroke();

    ctx.fillStyle = PALETTE.text;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Quỹ đạo Lãi Ròng 3 Năm & Dải Phân vị 10%–90%', rightX, 18);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0T', rightX + 12, height - 10);
    ctx.fillText('18T', rightX + panelW / 2, height - 10);
    ctx.fillText('36T', rightX + panelW - 14, height - 10);

    finish();
  }

  containerEl.replaceChildren(ui.card);
  render();
  return { id: 'sim-grinold', update: render };
}

const SIMULATOR_REGISTRY = {
  'sim-lob': mountLobSimulator,
  'sim-martingale': mountMartingaleSimulator,
  'sim-rmt': mountRmtSimulator,
  'sim-grinold': mountGrinoldSimulator,
};

/**
 * Mount an interactive Canvas simulator into containerEl.
 *
 * @param {HTMLElement} containerEl
 * @param {"sim-lob"|"sim-martingale"|"sim-rmt"|"sim-grinold"} simulatorId
 * @returns {{ id: string, update: () => void, destroy: () => void } | null}
 */
export function mountSimulator(containerEl, simulatorId) {
  if (!containerEl) return null;

  if (typeof containerEl._qraSimCleanup === 'function') {
    containerEl._qraSimCleanup();
    containerEl._qraSimCleanup = null;
  }

  const doc = containerEl.ownerDocument || globalThis.document;
  ensureSimulatorStyles(doc);

  const factory = SIMULATOR_REGISTRY[simulatorId];
  if (!factory) {
    const empty = doc.createElement('div');
    empty.className = 'sim-card';
    empty.textContent = `Không tìm thấy trình mô phỏng "${simulatorId}".`;
    containerEl.replaceChildren(empty);
    return null;
  }

  const mounted = factory(containerEl, doc);

  let resizeObserver = null;
  if (typeof globalThis.ResizeObserver === 'function') {
    resizeObserver = new globalThis.ResizeObserver(() => {
      mounted.update();
    });
    try {
      resizeObserver.observe(containerEl);
    } catch {
      resizeObserver = null;
    }
  }

  const destroy = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };
  containerEl._qraSimCleanup = destroy;

  return {
    id: mounted.id,
    update: mounted.update,
    destroy,
  };
}
