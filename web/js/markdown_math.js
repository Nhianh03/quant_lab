/**
 * LaTeX-Safe Scholarly Markdown Renderer for Quant Research Academy.
 *
 * Pipeline order (prevents Markdown emphasis/table rules from mangling LaTeX):
 *  1. Extract fenced code blocks (```lang ... ``` / ~~~ ... ~~~) to opaque tokens.
 *  2. Extract single- and multi-backtick inline code spans (`` `...` ``, `` ``...`` ``) to tokens
 *     so literal '$' inside code spans never triggers math mode.
 *  3. Scan left-to-right for unescaped display math $$...$$, unescaped inline math $...$,
 *     and prose escaped '\$' -> literal '$', while preserving '\$' inside math expressions for KaTeX.
 *  4. Parse block-level Markdown (headings, GitHub callouts & blockquotes, pipe tables,
 *     arbitrarily nested ordered/unordered lists, horizontal rules, paragraphs) and inline
 *     formatting (links with safe URL scheme whitelist, bold, italic, HTML escaping).
 *  5. Substitute rendered KaTeX / fallback HTML and code blocks in a single safe pass.
 */

const CALLOUT_LABELS = {
  note: 'Ghi chú học thuật',
  tip: 'Mẹo nghiên cứu',
  important: 'Điểm trọng tâm',
  warning: 'Cảnh báo thực nghiệm',
  caution: 'Lưu ý rủi ro',
};

const SAFE_HREF_RE = /^(?:https?:\/\/|\/|#(?!javascript:))/i;

/**
 * Escape HTML special characters against XSS.
 * Control-char placeholders (\u0002...\u0003) pass through untouched.
 * @param {string} raw
 * @returns {string}
 */
export function escapeHtml(raw) {
  return String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function expandLeadingSpaces(line) {
  let count = 0;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === ' ') count += 1;
    else if (ch === '\t') count += 4 - (count % 4);
    else break;
  }
  return count;
}

function stripLeadingColumns(line, colsToStrip) {
  let cols = 0;
  let idx = 0;
  while (idx < line.length && cols < colsToStrip) {
    const ch = line[idx];
    if (ch === ' ') {
      cols += 1;
      idx += 1;
    } else if (ch === '\t') {
      cols += 4 - (cols % 4);
      idx += 1;
    } else {
      break;
    }
  }
  return line.slice(idx);
}

function matchListMarker(line) {
  const m = /^([ \t]*)([-*+]|\d+\.)[ \t]+(.*)$/.exec(line);
  if (!m) return null;
  // Avoid mistaking horizontal rules like "- - -" or "* * *" for list items
  if (/^[ \t]{0,3}(?:[-*_][ \t]*){3,}$/.test(line)) return null;
  const indent = expandLeadingSpaces(m[1]);
  const marker = m[2];
  const isOrdered = /^\d+\.$/.test(marker);
  return {
    indent,
    type: isOrdered ? 'ol' : 'ul',
    startNum: isOrdered ? parseInt(marker, 10) : null,
    content: m[3],
    contentIndent: indent + marker.length + 1,
  };
}

function isTableAlignmentRow(line) {
  if (!line || !line.includes('-')) return false;
  return /^[ \t]*\|?(?:[ \t]*:?-+:?[ \t]*\|)+[ \t]*:?-+:?[ \t]*\|?[ \t]*$/.test(line)
    || (/^[ \t]*\|[ \t]*:?-+:?[ \t]*\|[ \t]*$/.test(line));
}

function splitPipeRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|') && !trimmed.endsWith('\\|')) trimmed = trimmed.slice(0, -1);

  const cells = [];
  let cur = '';
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed[i] === '\\' && trimmed[i + 1] === '|') {
      cur += '|';
      i += 1;
    } else if (trimmed[i] === '|') {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += trimmed[i];
    }
  }
  cells.push(cur.trim());
  return cells;
}

function parseTableAlignments(delimLine) {
  return splitPipeRow(delimLine).map((cell) => {
    const c = cell.trim();
    const left = c.startsWith(':');
    const right = c.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    if (left) return 'left';
    return null;
  });
}

function renderMathHtml(tex, displayMode, katexInstance) {
  const cleaned = displayMode ? tex.trim() : tex.trim();
  if (katexInstance && typeof katexInstance.renderToString === 'function') {
    try {
      const rendered = katexInstance.renderToString(cleaned, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
      return displayMode
        ? `<div class="math-display">${rendered}</div>`
        : `<span class="math-inline">${rendered}</span>`;
    } catch {
      // Fall back cleanly if KaTeX throws unexpectedly
    }
  }
  return displayMode
    ? `<div class="math-display math-fallback math-block-fallback">${escapeHtml(cleaned)}</div>`
    : `<code class="math-inline math-fallback math-inline-fallback">${escapeHtml(cleaned)}</code>`;
}

/**
 * Render Markdown text containing inline ($...$) and display ($$...$$) LaTeX into clean HTML.
 *
 * @param {string} markdownText
 * @param {object|null|undefined} katexInstance
 * @returns {string}
 */
export function renderMarkdownWithMath(markdownText, katexInstance = null) {
  if (typeof markdownText !== 'string' || markdownText.length === 0) {
    return '';
  }

  const tokens = new Map();
  let nextId = 0;
  const makeToken = (kind, html) => {
    const id = nextId;
    nextId += 1;
    const key = `${kind}${id}`;
    tokens.set(key, html);
    return `\u0002QRA${key}\u0003`;
  };

  let working = markdownText.replace(/\r\n?/g, '\n');

  // 1. Extract fenced code blocks first (```lang ... ``` or ~~~lang ... ~~~)
  working = working.replace(
    /^([ \t]*)(`{3,}|~{3,})([^\n]*)\n([\s\S]*?)^[ \t]*\2[ \t]*(?=\n|$)/gm,
    (_full, indent, _fence, infoStr, body) => {
      const rawLang = String(infoStr || '').trim().split(/\s+/)[0] || '';
      const safeLang = /^[a-zA-Z0-9_+-]+$/.test(rawLang) ? rawLang : '';
      const langAttr = safeLang ? ` class="language-${safeLang}" data-lang="${safeLang}"` : '';
      const trimmedBody = body.endsWith('\n') ? body.slice(0, -1) : body;
      const html = `<pre><code${langAttr}>${escapeHtml(trimmedBody)}</code></pre>`;
      return `${indent}${makeToken('CODEBLOCK', html)}`;
    }
  );

  // 2. Extract single- and multi-backtick inline code spans before math scanning
  working = working.replace(/(`+)((?:(?!\1|\n\n)[\s\S])+?)\1/g, (_full, _ticks, inner) => {
    let code = inner.replace(/\n/g, ' ');
    if (code.length >= 2 && code.startsWith(' ') && code.endsWith(' ') && code.trim().length > 0) {
      code = code.slice(1, -1);
    }
    return makeToken('CODEINL', `<code>${escapeHtml(code)}</code>`);
  });

  // 3. Scan left-to-right for $$...$$, $...$, and prose \$
  let scanned = '';
  let lineStartOffset = 0;
  let i = 0;
  while (i < working.length) {
    const ch = working[i];
    if (ch === '\n') {
      scanned += '\n';
      i += 1;
      lineStartOffset = i;
      continue;
    }

    if (ch === '\\') {
      const next = working[i + 1];
      if (next === '$') {
        // Escaped literal dollar in prose -> literal '$' without opening math
        scanned += '$';
        i += 2;
      } else if (next !== undefined) {
        scanned += ch + next;
        i += 2;
      } else {
        scanned += ch;
        i += 1;
      }
      continue;
    }

    if (ch === '$' && working[i + 1] === '$') {
      let j = i + 2;
      let foundClose = false;
      while (j < working.length) {
        if (working[j] === '\\' && j + 1 < working.length) {
          j += 2;
        } else if (working[j] === '$' && working[j + 1] === '$') {
          foundClose = true;
          break;
        } else {
          j += 1;
        }
      }
      if (foundClose) {
        let tex = working.slice(i + 2, j);
        const linePrefix = working.slice(lineStartOffset, i);
        if (/^[ \t]*>/.test(linePrefix) && tex.includes('\n')) {
          tex = tex
            .split('\n')
            .map((ln, idx) => (idx === 0 ? ln : ln.replace(/^[ \t]*>[ \t]?/, '')))
            .join('\n');
        }
        scanned += makeToken('DISP', renderMathHtml(tex, true, katexInstance));
        i = j + 2;
        continue;
      }
      scanned += '$$';
      i += 2;
      continue;
    }

    if (ch === '$') {
      let j = i + 1;
      let foundClose = false;
      while (j < working.length) {
        if (working[j] === '\n' && working[j + 1] === '\n') {
          break;
        }
        if (working[j] === '\\' && j + 1 < working.length) {
          j += 2;
        } else if (working[j] === '$') {
          if (working[j + 1] === '$') {
            break;
          }
          foundClose = true;
          break;
        } else {
          j += 1;
        }
      }
      if (foundClose && j > i + 1) {
        const tex = working.slice(i + 1, j);
        scanned += makeToken('INL', renderMathHtml(tex, false, katexInstance));
        i = j + 1;
        continue;
      }
      scanned += '$';
      i += 1;
      continue;
    }

    scanned += ch;
    i += 1;
  }

  // Inline Markdown formatter (runs on text where code & math are already tokens)
  function renderInline(raw) {
    const localTokens = [];
    const stash = (html) => {
      const idx = localTokens.length;
      localTokens.push(html);
      return `\u0002QRALOCAL${idx}\u0003`;
    };

    // Protect backslash-escaped Markdown punctuation in prose
    let text = raw.replace(/\\([*_[\]()|\\`~#!+-])/g, (_m, p1) => stash(escapeHtml(p1)));

    // Escape raw HTML in prose
    text = escapeHtml(text);

    // Parse links [label](url "optional title")
    text = text.replace(
      /\[([^\]]+)\]\(([^)\s]+)(?:[ \t]+&quot;([^&]*)&quot;)?\)/g,
      (_m, label, rawHref, titleText) => {
        const decodedHref = rawHref.replace(/&amp;/g, '&').trim();
        const renderedLabel = renderInlineFormattingOnly(label);
        if (!SAFE_HREF_RE.test(decodedHref)) {
          return stash(renderedLabel);
        }
        const safeHref = escapeHtml(decodedHref);
        const externalAttrs = /^https?:\/\//i.test(decodedHref)
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';
        const titleAttr = titleText ? ` title="${escapeHtml(titleText)}"` : '';
        return stash(`<a href="${safeHref}"${titleAttr}${externalAttrs}>${renderedLabel}</a>`);
      }
    );

    text = renderInlineFormattingOnly(text);

    // Restore stashed links and escaped punctuation
    text = text.replace(/\u0002QRALOCAL(\d+)\u0003/g, (_m, idx) => localTokens[Number(idx)]);
    return text;
  }

  function renderInlineFormattingOnly(str) {
    let out = str;
    // Bold + italic ***...***
    out = out.replace(/\*\*\*(?=\S)([\s\S]*?\S)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold **...**
    out = out.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>');
    // Italic *...*
    out = out.replace(/(?<!\*)\*(?=\S)([^*\n]*?\S)\*(?!\*)/g, '<em>$1</em>');
    // Word-boundary _..._ italic (never intraword snake_case)
    out = out.replace(
      /(^|[\s([{"'])_(?=\S)([^_\n]*?\S)_(?=$|[\s)\]}"'.,;:!?])/g,
      '$1<em>$2</em>'
    );
    return out;
  }

  const STANDALONE_BLOCK_TOKEN_RE = /^\u0002QRA(?:CODEBLOCK|DISP)\d+\u0003$/;

  function isBlockStarter(lines, idx) {
    const line = lines[idx];
    if (!line || line.trim() === '') return true;
    const trimmed = line.trim();
    if (STANDALONE_BLOCK_TOKEN_RE.test(trimmed)) return true;
    if (/^[ \t]{0,3}#{1,6}[ \t]+/.test(line)) return true;
    if (/^[ \t]{0,3}(?:[-*_][ \t]*){3,}$/.test(line)) return true;
    if (/^[ \t]{0,3}>/.test(line)) return true;
    if (matchListMarker(line)) return true;
    if (line.includes('|') && idx + 1 < lines.length && isTableAlignmentRow(lines[idx + 1])) {
      return true;
    }
    return false;
  }

  function parseList(lines, startIdx) {
    const first = matchListMarker(lines[startIdx]);
    const listType = first.type;
    const listIndent = first.indent;
    const startAttr =
      listType === 'ol' && first.startNum !== null && first.startNum !== 1
        ? ` start="${first.startNum}"`
        : '';

    const itemsHtml = [];
    let idx = startIdx;

    while (idx < lines.length) {
      const marker = matchListMarker(lines[idx]);
      if (!marker) break;
      if (marker.indent < listIndent - 1) break;
      if (Math.abs(marker.indent - listIndent) <= 1 && marker.type !== listType) break;
      if (marker.indent > listIndent + 1) break;

      const itemLines = [marker.content];
      idx += 1;

      while (idx < lines.length) {
        const cur = lines[idx];
        if (cur.trim() === '') {
          // Look ahead past blank lines
          let nextNonBlank = idx + 1;
          while (nextNonBlank < lines.length && lines[nextNonBlank].trim() === '') {
            nextNonBlank += 1;
          }
          if (nextNonBlank >= lines.length) {
            idx = nextNonBlank;
            break;
          }
          const nextLine = lines[nextNonBlank];
          const nextIndent = expandLeadingSpaces(nextLine);
          const nextMarker = matchListMarker(nextLine);

          if (nextIndent >= listIndent + 2) {
            itemLines.push('');
            idx = nextNonBlank;
            continue;
          }

          // Handle unindented standalone display-math block inside an ongoing list
          if (/^\u0002QRADISP\d+\u0003$/.test(nextLine.trim())) {
            let afterMath = nextNonBlank + 1;
            while (afterMath < lines.length && lines[afterMath].trim() === '') {
              afterMath += 1;
            }
            if (afterMath < lines.length) {
              const afterLine = lines[afterMath];
              const afterIndent = expandLeadingSpaces(afterLine);
              const afterMarker = matchListMarker(afterLine);
              const prevNonEmpty = [...itemLines].reverse().find((l) => l.trim() !== '') || '';
              const endsWithColon = /:[*_` \t]*$/.test(prevNonEmpty.trim());
              if (
                afterIndent >= listIndent + 2
                || (afterMarker && afterMarker.indent >= listIndent - 1)
                || (afterMarker && endsWithColon)
              ) {
                itemLines.push('', nextLine.trim());
                idx = nextNonBlank + 1;
                continue;
              }
            }
          }

          if (
            nextMarker
            && Math.abs(nextMarker.indent - listIndent) <= 1
            && nextMarker.type === listType
          ) {
            idx = nextNonBlank;
            break;
          }

          break;
        }

        const curMarker = matchListMarker(cur);
        const curIndent = expandLeadingSpaces(cur);

        if (curMarker) {
          if (curMarker.indent > listIndent + 1) {
            itemLines.push(stripLeadingColumns(cur, Math.min(curIndent, listIndent + 2)));
            idx += 1;
            continue;
          }
          break;
        }

        if (
          /^[ \t]{0,3}#{1,6}[ \t]+/.test(cur)
          || /^[ \t]{0,3}(?:[-*_][ \t]*){3,}$/.test(cur)
          || /^\u0002QRACODEBLOCK\d+\u0003$/.test(cur.trim())
        ) {
          break;
        }

        if (curIndent >= listIndent + 2) {
          itemLines.push(stripLeadingColumns(cur, Math.min(curIndent, marker.contentIndent)));
          idx += 1;
          continue;
        }

        if (/^\u0002QRADISP\d+\u0003$/.test(cur.trim())) {
          itemLines.push(cur.trim());
          idx += 1;
          continue;
        }

        break;
      }

      const hasComplexChildren = itemLines.some(
        (ln, lineIdx) =>
          ln.trim() === ''
          || STANDALONE_BLOCK_TOKEN_RE.test(ln.trim())
          || (lineIdx > 0 && matchListMarker(ln) !== null)
          || /^[ \t]{0,3}>/.test(ln)
      );

      if (!hasComplexChildren) {
        itemsHtml.push(`<li>${renderInline(itemLines.join('\n').trim())}</li>`);
      } else {
        // Tight text line followed immediately by nested list: avoid superfluous <p> on first line
        if (
          itemLines.length >= 2
          && itemLines[0].trim() !== ''
          && !itemLines.includes('')
          && !STANDALONE_BLOCK_TOKEN_RE.test(itemLines[0].trim())
          && matchListMarker(itemLines[1]) !== null
        ) {
          const headHtml = renderInline(itemLines[0].trim());
          const restHtml = parseBlocks(itemLines.slice(1));
          itemsHtml.push(`<li>${headHtml}\n${restHtml}</li>`);
        } else {
          itemsHtml.push(`<li>${parseBlocks(itemLines)}</li>`);
        }
      }
    }

    return {
      html: `<${listType}${startAttr}>\n${itemsHtml.join('\n')}\n</${listType}>`,
      nextIdx: idx,
    };
  }

  function parseParagraphLines(paraLines) {
    // Split out any inline display-math tokens so <div> never sits inside <p>
    const joined = paraLines.join('\n');
    const segments = joined.split(/(\u0002QRADISP\d+\u0003)/g);
    const out = [];
    for (const seg of segments) {
      const trimmed = seg.trim();
      if (!trimmed) continue;
      if (/^\u0002QRADISP\d+\u0003$/.test(trimmed)) {
        out.push(trimmed);
      } else {
        out.push(`<p>${renderInline(trimmed)}</p>`);
      }
    }
    return out.join('\n');
  }

  function parseBlocks(lines) {
    const blocks = [];
    let idx = 0;

    while (idx < lines.length) {
      const line = lines[idx];
      const trimmed = line.trim();

      if (trimmed === '') {
        idx += 1;
        continue;
      }

      // 1. Standalone code block or display math block
      if (STANDALONE_BLOCK_TOKEN_RE.test(trimmed)) {
        blocks.push(trimmed);
        idx += 1;
        continue;
      }

      // 2. ATX Heading (# .. ######)
      const headingMatch = /^[ \t]{0,3}(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/.exec(line);
      if (headingMatch) {
        const level = headingMatch[1].length;
        blocks.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`);
        idx += 1;
        continue;
      }

      // 3. Horizontal rule (---, ***, ___)
      if (/^[ \t]{0,3}(?:[-*_][ \t]*){3,}$/.test(line)) {
        blocks.push('<hr>');
        idx += 1;
        continue;
      }

      // 4. Blockquote & GitHub Callout (> [!NOTE], > [!IMPORTANT], > [!WARNING], > [!TIP])
      if (/^[ \t]{0,3}>/.test(line)) {
        const bqLines = [];
        while (idx < lines.length && /^[ \t]{0,3}>/.test(lines[idx])) {
          bqLines.push(lines[idx].replace(/^[ \t]{0,3}>[ \t]?/, ''));
          idx += 1;
        }
        const firstLine = (bqLines[0] || '').trim();
        const calloutMatch = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(.*)$/i.exec(firstLine);
        if (calloutMatch) {
          const kind = calloutMatch[1].toLowerCase();
          const customTitle = calloutMatch[2].trim();
          const label = customTitle ? renderInline(customTitle) : CALLOUT_LABELS[kind];
          const bodyHtml = parseBlocks(bqLines.slice(1));
          blocks.push(
            `<blockquote class="callout callout-${kind}" data-callout="${kind.toUpperCase()}">`
            + `<div class="callout-title">${label}</div>`
            + `<div class="callout-body">${bodyHtml}</div>`
            + `</blockquote>`
          );
        } else {
          blocks.push(`<blockquote>${parseBlocks(bqLines)}</blockquote>`);
        }
        continue;
      }

      // 5. Pipe Table
      if (line.includes('|') && idx + 1 < lines.length && isTableAlignmentRow(lines[idx + 1])) {
        const headers = splitPipeRow(line);
        const aligns = parseTableAlignments(lines[idx + 1]);
        idx += 2;
        const rows = [];
        while (idx < lines.length) {
          const rLine = lines[idx];
          if (
            !rLine
            || rLine.trim() === ''
            || !rLine.includes('|')
            || /^[ \t]{0,3}(?:#{1,6}[ \t]+|>)/.test(rLine)
            || STANDALONE_BLOCK_TOKEN_RE.test(rLine.trim())
          ) {
            break;
          }
          rows.push(splitPipeRow(rLine));
          idx += 1;
        }

        const thHtml = headers
          .map((cell, colIdx) => {
            const align = aligns[colIdx];
            const styleAttr = align ? ` style="text-align:${align}"` : '';
            return `<th${styleAttr}>${renderInline(cell)}</th>`;
          })
          .join('');

        const tbodyRowsHtml = rows
          .map((cells) => {
            const tds = headers
              .map((_h, colIdx) => {
                const cell = cells[colIdx] ?? '';
                const align = aligns[colIdx];
                const styleAttr = align ? ` style="text-align:${align}"` : '';
                return `<td${styleAttr}>${renderInline(cell)}</td>`;
              })
              .join('');
            return `<tr>${tds}</tr>`;
          })
          .join('\n');

        blocks.push(
          `<div class="table-wrap"><table><thead><tr>${thHtml}</tr></thead>`
          + `<tbody>${tbodyRowsHtml}</tbody></table></div>`
        );
        continue;
      }

      // 6. Ordered / Unordered List
      if (matchListMarker(line)) {
        const { html: listHtml, nextIdx } = parseList(lines, idx);
        blocks.push(listHtml);
        idx = nextIdx;
        continue;
      }

      // 7. Paragraph
      const paraLines = [line];
      idx += 1;
      while (idx < lines.length && !isBlockStarter(lines, idx)) {
        paraLines.push(lines[idx]);
        idx += 1;
      }
      blocks.push(parseParagraphLines(paraLines));
    }

    return blocks.join('\n');
  }

  let finalHtml = parseBlocks(scanned.split('\n'));

  // 5. Substitute rendered code & math tokens (using callback so '$' in HTML is never expanded)
  finalHtml = finalHtml.replace(
    /\u0002QRA([A-Z]+\d+)\u0003/g,
    (_m, key) => tokens.get(key) ?? ''
  );

  return finalHtml;
}
