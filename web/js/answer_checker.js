/**
 * Safe numeric & elementary math expression parser and answer checker
 * for Quant Research Academy interview problems (zero eval).
 */

function tokenizeMath(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if ('+-*/^()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let dotCount = 0;
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        if (expr[i] === '.') dotCount += 1;
        if (dotCount > 1) return null;
        numStr += expr[i];
        i += 1;
      }
      if (i < expr.length && (expr[i] === 'e' || expr[i] === 'E')) {
        let j = i + 1;
        if (j < expr.length && (expr[j] === '+' || expr[j] === '-')) j += 1;
        if (j < expr.length && /[0-9]/.test(expr[j])) {
          numStr += expr.slice(i, j);
          i = j;
          while (i < expr.length && /[0-9]/.test(expr[i])) {
            numStr += expr[i];
            i += 1;
          }
        }
      }
      const val = Number(numStr);
      if (!Number.isFinite(val)) return null;
      tokens.push({ type: 'num', value: val });
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let id = '';
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) {
        id += expr[i];
        i += 1;
      }
      tokens.push({ type: 'id', value: id.toLowerCase() });
      continue;
    }
    return null;
  }
  return tokens;
}

function evaluateTokens(tokens) {
  let pos = 0;

  function peek() {
    return pos < tokens.length ? tokens[pos] : null;
  }

  function consume() {
    const t = tokens[pos];
    pos += 1;
    return t;
  }

  function parseExpr() {
    let left = parseTerm();
    if (left === null) return null;
    while (peek()?.type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      if (right === null) return null;
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parsePower();
    if (left === null) return null;
    while (peek()?.type === 'op' && (peek().value === '*' || peek().value === '/')) {
      const op = consume().value;
      const right = parsePower();
      if (right === null) return null;
      if (op === '/' && right === 0) return null;
      left = op === '*' ? left * right : left / right;
    }
    return left;
  }

  function parsePower() {
    const base = parseUnary();
    if (base === null) return null;
    if (peek()?.type === 'op' && peek().value === '^') {
      consume();
      const exp = parsePower();
      if (exp === null) return null;
      const val = Math.pow(base, exp);
      return Number.isFinite(val) ? val : null;
    }
    return base;
  }

  function parseUnary() {
    if (peek()?.type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const inner = parseUnary();
      if (inner === null) return null;
      return op === '-' ? -inner : inner;
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const tok = peek();
    if (!tok) return null;

    if (tok.type === 'num') {
      consume();
      return tok.value;
    }

    if (tok.type === 'op' && tok.value === '(') {
      consume();
      const inner = parseExpr();
      if (inner === null) return null;
      if (peek()?.type !== 'op' || peek().value !== ')') return null;
      consume();
      return inner;
    }

    if (tok.type === 'id') {
      consume();
      if (tok.value === 'pi') return Math.PI;
      if (tok.value === 'e') return Math.E;

      if (peek()?.type !== 'op' || peek().value !== '(') return null;
      consume();
      const arg = parseExpr();
      if (arg === null) return null;
      if (peek()?.type !== 'op' || peek().value !== ')') return null;
      consume();

      let out = null;
      if (tok.value === 'sqrt') out = arg >= 0 ? Math.sqrt(arg) : null;
      else if (tok.value === 'ln' || tok.value === 'log') out = arg > 0 ? Math.log(arg) : null;
      else if (tok.value === 'exp') out = Math.exp(arg);
      else if (tok.value === 'abs') out = Math.abs(arg);

      return out !== null && Number.isFinite(out) ? out : null;
    }

    return null;
  }

  const result = parseExpr();
  if (result === null || pos !== tokens.length || !Number.isFinite(result)) {
    return null;
  }
  return result;
}

/**
 * Parse a user answer string into a finite number, or null if invalid.
 * Supports decimals, thousand-commas, $/bps/%, fractions (a/b), and sqrt/ln/exp/pi.
 *
 * @param {string} raw
 * @returns {number | null}
 */
export function parseNumericExpression(raw) {
  if (typeof raw !== 'string') return null;
  let cleaned = raw
    .trim()
    .replace(/[−–—]/g, '-')
    .replace(/\$/g, '')
    .replace(/\b(usd|bps|bp|nam|ngay|phien|buoc|lenh|giay|trieu|ty)\b/gi, '')
    .replace(/[×%]/g, '')
    .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')
    .trim();

  // Strip trailing multiplier 'x' such as '4.0x' or '2.5x'
  cleaned = cleaned.replace(/(\d)\s*x$/i, '$1').trim();
  if (!cleaned) return null;

  const tokens = tokenizeMath(cleaned);
  if (!tokens || tokens.length === 0) return null;
  return evaluateTokens(tokens);
}

/**
 * Grade a user's answer string against a problem's answer_check specification.
 *
 * @param {string} rawInput
 * @param {{ target: number, tolerance?: number, unit?: string, display?: string }} spec
 * @returns {{ ok: boolean, empty: boolean, invalid: boolean, value: number | null }}
 */
export function checkProblemAnswer(rawInput, spec) {
  const str = typeof rawInput === 'string' ? rawInput.trim() : '';
  if (!str) {
    return { ok: false, empty: true, invalid: false, value: null };
  }
  if (!spec || typeof spec.target !== 'number' || !Number.isFinite(spec.target)) {
    return { ok: false, empty: false, invalid: true, value: null };
  }

  const hasPercent = str.includes('%');
  const parsed = parseNumericExpression(str);
  if (parsed === null) {
    return { ok: false, empty: false, invalid: true, value: null };
  }

  const target = spec.target;
  const tol = typeof spec.tolerance === 'number' && spec.tolerance > 0
    ? spec.tolerance
    : Math.max(1e-4, Math.abs(target) * 0.01);
  const unit = spec.unit || 'number';

  let ok = false;
  if (unit === 'prob') {
    const candidate = hasPercent ? parsed / 100 : parsed;
    ok = Math.abs(candidate - target) <= tol;
  } else if (unit === 'percent') {
    ok = Math.abs(parsed - target) <= tol;
    if (!ok && !hasPercent) {
      ok = Math.abs(parsed * 100 - target) <= tol;
    }
  } else {
    const candidate = hasPercent ? parsed / 100 : parsed;
    ok = Math.abs(candidate - target) <= tol || Math.abs(parsed - target) <= tol;
  }

  return { ok, empty: false, invalid: false, value: parsed };
}
