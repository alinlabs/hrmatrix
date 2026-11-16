import React from 'react';

/**
 * Replaces ASCII arrow symbols with clean Unicode arrow characters:
 * - "<->" -> "↔" (panah kanan kiri bersambung)
 * - "<-"  -> "←" (panah kiri)
 * - "->"  -> "→" (panah kanan)
 * - "^|" or "|^" or "^" as standalone direction -> "↑" (panah atas)
 * - "v|" or "|v" as standalone direction -> "↓" (panah bawah)
 */
export function replaceArrowSymbols(str: string): string {
  if (!str) return '';
  return str
    .replace(/<->/g, '↔')
    .replace(/<-/g, '←')
    .replace(/->/g, '→')
    .replace(/(\^\||\|\^)/g, '↑')
    .replace(/(v\||\|v)/g, '↓');
}

/**
 * Parses a string containing markdown-style formatting:
 * - ***bold italic*** or ___bold italic___
 * - **bold** or __bold__
 * - *italic* or _italic_
 * - `code` or <code>code</code>
 * - Automatic arrow symbol replacement (<- to ←, -> to →, <-> to ↔)
 * 
 * Returns React elements with appropriate styling for clear emphasis in editorial paragraphs.
 */
export function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  const normalizedText = replaceArrowSymbols(text);

  // Regex pattern matching:
  // 1: ***bold italic*** or ___bold italic___
  // 2: **bold** or __bold__
  // 3: `code` or <code>code</code>
  // 4: *italic* or _italic_
  const tokenRegex = /(\*\*\*(?:.+?)\*\*\*|___(?:.+?)___|\*\*(?:.+?)\*\*|__(?:.+?)__|`(?:.+?)`|<code>(?:.+?)<\/code>|\*(?:[^\*]+?)\*|_(?:[^_]+?)_)/g;

  const parts = normalizedText.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold + Italic: ***text*** or ___text___
    if ((part.startsWith('***') && part.endsWith('***')) || (part.startsWith('___') && part.endsWith('___'))) {
      const content = part.slice(3, -3);
      return (
        <strong key={index} className="font-bold italic text-slate-700 tracking-normal">
          {renderFormattedText(content)}
        </strong>
      );
    }

    // Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      const content = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-700 tracking-normal">
          {renderFormattedText(content)}
        </strong>
      );
    }

    // Code: `text` or <code>text</code>
    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      return (
        <code key={index} className="font-mono text-[11px] font-semibold px-1 py-0.5 rounded bg-slate-100/80 text-slate-700 border border-slate-200/50 mx-0.5">
          {content}
        </code>
      );
    }
    if (part.startsWith('<code>') && part.endsWith('</code>')) {
      const content = part.slice(6, -7);
      return (
        <code key={index} className="font-mono text-[11px] font-semibold px-1 py-0.5 rounded bg-slate-100/80 text-slate-700 border border-slate-200/50 mx-0.5">
          {content}
        </code>
      );
    }

    // Italic: *text* or _text_ (only if not surrounded by alphanumeric to prevent url/variable confusion)
    if ((part.startsWith('*') && part.endsWith('*') && part.length > 2) || 
        (part.startsWith('_') && part.endsWith('_') && part.length > 2)) {
      const content = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {content}
        </em>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export type DetailItemType = 'paragraph' | 'bullet' | 'numbered';

export interface ParsedDetailItem {
  type: DetailItemType;
  number: string | null;
  text: string;
  isNested?: boolean;
}

export function parseDetailItem(rawText: string): ParsedDetailItem {
  if (!rawText) {
    return { type: 'paragraph', number: null, text: '', isNested: false };
  }

  const isNested = /^\s{4,}/.test(rawText);
  const trimmed = rawText.trim();

  // 1. Check for bullet that wraps a number, e.g. "   - **1** Simpan...", "   - **1.** ...", "- 1. ...", "- (1) ..."
  const bulletWithNumMatch = trimmed.match(/^(?:•|&bull;|-|\*|\+)\s*(?:\*\*)?(\d{1,2}[\.\)]|\(\d{1,2}\))(?:\*\*)?\s*(.*)$/s);
  if (bulletWithNumMatch) {
    const num = bulletWithNumMatch[1].replace(/[\(\)]/g, '');
    const cleanNum = num.endsWith('.') ? num : `${num}.`;
    return {
      type: 'numbered',
      number: cleanNum,
      text: bulletWithNumMatch[2].trim(),
      isNested
    };
  }

  // 2. Check for explicit bullets: starts with bullet symbol e.g. "- ", "• ", "* ", "+ " (including indented e.g. "   - ")
  if (/^\s*(?:•|&bull;|-|\*|\+)\s+/.test(rawText)) {
    const textWithoutBullet = trimmed.replace(/^(?:•|&bull;|-|\*|\+)\s+/, '');
    
    // Check if inner text starts with bold number like "**1.** ..." or "**1** ..."
    const innerNumMatch = textWithoutBullet.match(/^\*\*(\d{1,2}[\.]?)\*\*\s*(.*)$/s);
    if (innerNumMatch) {
      const n = innerNumMatch[1].endsWith('.') ? innerNumMatch[1] : `${innerNumMatch[1]}.`;
      return {
        type: 'numbered',
        number: n,
        text: innerNumMatch[2].trim(),
        isNested
      };
    }

    return {
      type: 'bullet',
      number: null,
      text: textWithoutBullet,
      isNested
    };
  }

  // 3. Check for standalone numbered list items, e.g. "1. Text...", "1) Text...", "(1) Text...", "**1.** Text..."
  // Only match 1-2 digit numbers followed by dot/paren and space
  const numMatch = trimmed.match(/^(?:\*\*)?(\d{1,2}[\.\)]|\(\d{1,2}\))(?:\*\*)?\s+(.*)$/s);
  if (numMatch) {
    const num = numMatch[1].replace(/[\(\)]/g, '');
    const cleanNum = num.endsWith('.') ? num : `${num}.`;
    return {
      type: 'numbered',
      number: cleanNum,
      text: numMatch[2].trim(),
      isNested
    };
  }

  // 4. Otherwise: It's a standard DESCRIPTIVE PARAGRAPH!
  return {
    type: 'paragraph',
    number: null,
    text: trimmed,
    isNested: false
  };
}

export interface ParsedListItem {
  isNumbered: boolean;
  number: string | null;
  text: string;
}

export function parseListItem(rawText: string): ParsedListItem {
  const parsed = parseDetailItem(rawText);
  return {
    isNumbered: parsed.type === 'numbered',
    number: parsed.number,
    text: parsed.text
  };
}

interface MathFractionToken {
  type: 'fraction';
  numerator: string;
  denominator: string;
}

interface MathTextToken {
  type: 'text';
  content: string;
}

type MathToken = MathFractionToken | MathTextToken;

function parseMathLineTokens(line: string): MathToken[] {
  const tokens: MathToken[] = [];
  let remaining = line;

  // Regex for parenthesized fraction: (Numerator / Denominator) or (Numerator ÷ Denominator)
  const parenFractionRegex = /\(([^/÷\)\n]+?)\s*[/÷]\s*([^/÷\)\n]+?)\)/;

  while (remaining.length > 0) {
    const parenMatch = remaining.match(parenFractionRegex);

    if (!parenMatch || parenMatch.index === undefined) {
      tokens.push({ type: 'text', content: remaining });
      break;
    }

    if (parenMatch.index > 0) {
      tokens.push({ type: 'text', content: remaining.slice(0, parenMatch.index) });
    }

    tokens.push({
      type: 'fraction',
      numerator: parenMatch[1].trim(),
      denominator: parenMatch[2].trim(),
    });

    remaining = remaining.slice(parenMatch.index + parenMatch[0].length);
  }

  return tokens;
}

export interface FormulaExpressionCardProps {
  expression: string;
  legend?: { symbol: string; label: string }[];
  className?: string;
}

/**
 * Renders formula expression with publication-grade mathematical fraction layout:
 * - Fractions with (Numerator / Denominator) or (Numerator ÷ Denominator) are formatted
 *   with a solid horizontal division bar (Garis Pecahan).
 * - Clean serif math typography matching formal publication standards.
 * - Displays an optional abbreviation legend list below the mathematical formula expression.
 */
export const FormulaExpressionCard: React.FC<FormulaExpressionCardProps> = ({
  expression,
  legend,
  className = ""
}) => {
  if (!expression) return null;

  const normalized = replaceArrowSymbols(expression);
  const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);

  return (
    <div className={`w-full py-2.5 px-3.5 sm:px-4 bg-slate-50/90 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5 overflow-x-auto ${className}`}>
      <div className="space-y-1.5">
        {lines.map((line, lineIdx) => {
          const isHeader = line.endsWith(':') || line.startsWith('Metode ') || line.startsWith('Indikator ');

          if (isHeader) {
            return (
              <div key={lineIdx} className="text-left font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1 border-t border-slate-200/60 first:border-t-0 first:pt-0">
                {line}
              </div>
            );
          }

          const tokens = parseMathLineTokens(line);

          return (
            <div
              key={lineIdx}
              className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-serif text-xs sm:text-sm text-slate-800 tracking-normal leading-relaxed text-center py-0.5 select-text font-medium"
            >
              {tokens.map((token, tokIdx) => {
                if (token.type === 'text') {
                  return (
                    <span key={tokIdx} className="font-serif font-medium text-slate-800 whitespace-pre-wrap">
                      {token.content}
                    </span>
                  );
                }

                return (
                  <div key={tokIdx} className="inline-flex flex-col items-center justify-center px-1 my-0.5 align-middle shrink-0">
                    {/* Pembilang (Numerator) */}
                    <span className="font-serif text-[10px] sm:text-xs font-semibold text-slate-800 px-1 pb-0.5 text-center block">
                      {token.numerator}
                    </span>
                    {/* Garis Horizontal Pecahan */}
                    <div className="w-full border-b-[1.25px] border-slate-800 my-0.5" />
                    {/* Penyebut (Denominator) */}
                    <span className="font-serif text-[10px] sm:text-xs font-semibold text-slate-800 px-1 pt-0.5 text-center block">
                      {token.denominator}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend Singkatan & Simbol */}
      {legend && legend.length > 0 && (
        <div className="pt-1.5 border-t border-slate-200/60 w-full">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">
            Keterangan Singkatan / Simbol:
          </div>
          <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-0.5 text-[11px] text-slate-600 text-left w-full">
            {legend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="font-bold text-slate-700 font-mono text-[10px]">{item.symbol}</span>
                <span className="text-slate-400 text-[9px]">=</span>
                <span className="text-slate-600 text-[11px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export interface FormattedListItemProps {
  item: string;
  className?: string;
  textClassName?: string;
}

export const FormattedListItem: React.FC<FormattedListItemProps> = ({ 
  item, 
  className = "",
  textClassName = "text-slate-600 leading-relaxed text-justify"
}) => {
  const parsed = parseDetailItem(item);

  if (parsed.type === 'paragraph') {
    return (
      <li className={`list-none ${className}`}>
        <p className={`${textClassName}`}>
          {renderFormattedText(parsed.text)}
        </p>
      </li>
    );
  }

  return (
    <li className={`flex items-start gap-2.5 ${className}`}>
      {parsed.type === 'numbered' ? (
        <span className="font-bold text-slate-700 shrink-0 select-none leading-relaxed min-w-[16px] text-left">
          {parsed.number}
        </span>
      ) : (
        <span className="flex items-center justify-center w-3 h-5 shrink-0 select-none" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 block" />
        </span>
      )}
      <span className={`flex-1 ${textClassName}`}>
        {renderFormattedText(parsed.text)}
      </span>
    </li>
  );
};

export interface FormattedDetailBlockProps {
  item: string;
  className?: string;
  paragraphClassName?: string;
  listItemClassName?: string;
}

export const FormattedDetailBlock: React.FC<FormattedDetailBlockProps> = ({
  item,
  className = "",
  paragraphClassName = "text-slate-600 leading-relaxed text-justify",
  listItemClassName = "text-slate-600 leading-relaxed text-justify"
}) => {
  const parsed = parseDetailItem(item);
  const indentClass = parsed.isNested ? "pl-5 sm:pl-7" : "pl-2 sm:pl-3.5";

  if (parsed.type === 'numbered') {
    return (
      <div className={`flex items-start gap-2.5 ${indentClass} ${className}`}>
        <span className="font-bold text-slate-700 shrink-0 select-none leading-relaxed min-w-[18px] text-left">
          {parsed.number}
        </span>
        <div className={`flex-1 ${listItemClassName}`}>
          {renderFormattedText(parsed.text)}
        </div>
      </div>
    );
  }

  if (parsed.type === 'bullet') {
    return (
      <div className={`flex items-start gap-2.5 ${indentClass} ${className}`}>
        <span className="flex items-center justify-center w-3 h-5 shrink-0 select-none" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 block" />
        </span>
        <div className={`flex-1 ${listItemClassName}`}>
          {renderFormattedText(parsed.text)}
        </div>
      </div>
    );
  }

  // Regular descriptive paragraph (no bullet, no number)
  return (
    <p className={`${paragraphClassName} ${className}`}>
      {renderFormattedText(parsed.text)}
    </p>
  );
};

export interface CalculationStepItemProps {
  item: string;
  className?: string;
  numberIndex?: number;
}

/**
 * Splits an expression by operators (+, -, x, *, ÷, /) only outside parentheses.
 * Trailing operator is appended to the operand line.
 */
interface MathLine {
  hasEqual: boolean;
  leftTitle: string;
  expression: string;
  isGroupEnd?: boolean;
}

function parseMathExpression(item: string): MathLine[] {
  const normalizedItem = replaceArrowSymbols(item);

  // Check if item contains '=' or ': '
  // If an item contains ': ' before '=', the colon acts as the title delimiter
  // e.g. "Perhitungan Jam ke-1: 1 jam × 1.5 × Rp 30.000 = Rp 45.000"
  // Title should be "Perhitungan Jam ke-1" and right content should be "1 jam × 1.5 × Rp 30.000 = Rp 45.000"
  let leftTitle = '';
  let rightContent = normalizedItem;

  const colonIndex = normalizedItem.indexOf(': ');
  const equalIndex = normalizedItem.indexOf('=');

  if (colonIndex !== -1 && (equalIndex === -1 || colonIndex < equalIndex)) {
    leftTitle = normalizedItem.slice(0, colonIndex).trim();
    rightContent = normalizedItem.slice(colonIndex + 2).trim();
  } else if (equalIndex !== -1) {
    const eqParts = normalizedItem.split('=');
    leftTitle = eqParts[0].trim();
    rightContent = eqParts.slice(1).join(' = ').trim();
  } else {
    return [{ hasEqual: false, leftTitle: '', expression: normalizedItem }];
  }

  // Now split rightContent by '=' first to get chained equal segments
  const chainedEqualSegments = rightContent.split('=').map(s => s.trim()).filter(Boolean);
  const resultLines: MathLine[] = [];

  chainedEqualSegments.forEach((segment, segIdx) => {
    // Parse operators within this segment (outside of parentheses)
    // E.g. "Rp 4.500.000 + Rp 1.500.000" -> ["Rp 4.500.000", "+ Rp 1.500.000"]
    // E.g. "(8 ÷ 12) × Rp 6.000.000" -> ["(8 ÷ 12)", "× Rp 6.000.000"]
    const tokens: string[] = [];
    let currentToken = '';
    let parenDepth = 0;

    for (let i = 0; i < segment.length; i++) {
      const char = segment[i];
      if (char === '(' || char === '[' || char === '{') {
        parenDepth++;
        currentToken += char;
      } else if (char === ')' || char === ']' || char === '}') {
        parenDepth = Math.max(0, parenDepth - 1);
        currentToken += char;
      } else if (parenDepth === 0 && (char === '+' || char === '-' || char === '×' || char === '*' || char === '÷')) {
        // If currentToken has content, push it
        if (currentToken.trim()) {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        // Start next token with operator or hold operator
        tokens.push(char);
      } else {
        currentToken += char;
      }
    }
    if (currentToken.trim()) {
      tokens.push(currentToken.trim());
    }

    // Now group tokens into arithmetic lines with trailing operator for subsequent lines
    // Example tokens: ["Rp 4.500.000", "+", "Rp 1.500.000"]
    // Line 1: "= Rp 4.500.000"
    // Line 2: "  Rp 1.500.000 +"
    if (tokens.length <= 1) {
      resultLines.push({
        hasEqual: true,
        leftTitle: segIdx === 0 ? leftTitle : '',
        expression: segment
      });
    } else {
      let firstVal = '';
      let pendingOperator = '';

      for (let t = 0; t < tokens.length; t++) {
        const tok = tokens[t];
        if (tok === '+' || tok === '-' || tok === '×' || tok === '*' || tok === '÷') {
          pendingOperator = tok;
        } else {
          if (!firstVal) {
            firstVal = tok;
            resultLines.push({
              hasEqual: true,
              leftTitle: segIdx === 0 ? leftTitle : '',
              expression: firstVal
            });
          } else {
            // Subsequent operand with operator on the right
            const opSymbol = pendingOperator ? ` ${pendingOperator}` : '';
            resultLines.push({
              hasEqual: false,
              leftTitle: '',
              expression: `${tok}${opSymbol}`
            });
            pendingOperator = '';
          }
        }
      }

      // If this group has multiple operands, mark the last operand line as group end (needs underline before the next '=' result)
      if (resultLines.length > 0) {
        resultLines[resultLines.length - 1].isGroupEnd = true;
      }
    }
  });

  return resultLines;
}

/**
 * Renders a calculation step with tabular alignment on the equal sign '='.
 * If there are arithmetic operations (+, -, ×, ÷), subsequent operands are placed
 * on a new indented line with the operator at the right (e.g. "Rp 1.500.000 +").
 * Final equal outcomes "= Rp 6.000.000" align directly under the initial equal sign.
 */
export const CalculationStepItem: React.FC<CalculationStepItemProps> = ({
  item,
  className = "",
  numberIndex
}) => {
  const lines = parseMathExpression(item);

  if (lines.length === 1 && !lines[0].hasEqual && !lines[0].leftTitle) {
    return (
      <li className={`flex items-start gap-2.5 ${className}`}>
        {numberIndex !== undefined ? (
          <span className="font-bold text-slate-700 shrink-0 select-none leading-relaxed min-w-[16px] text-left">
            [{numberIndex + 1}]
          </span>
        ) : (
          <span className="flex items-center justify-center w-3 h-5 shrink-0 select-none" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 block" />
          </span>
        )}
        <span className="flex-1 text-slate-700 font-mono leading-relaxed">
          {renderFormattedText(item)}
        </span>
      </li>
    );
  }

  return (
    <li className={`flex items-start gap-2.5 ${className}`}>
      {/* Bullet Indicator */}
      {numberIndex !== undefined ? (
        <span className="font-bold text-slate-700 shrink-0 select-none leading-relaxed min-w-[16px] text-left">
          [{numberIndex + 1}]
        </span>
      ) : (
        <span className="flex items-center justify-center w-3 h-5 shrink-0 select-none" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 block" />
        </span>
      )}

      {/* Tabular Math Flow */}
      <div 
        className="flex-1 font-mono text-xs text-slate-700 grid grid-cols-[140px_10px_1fr] sm:grid-cols-[165px_12px_1fr] items-start gap-x-1.5 leading-relaxed"
      >
        {/* Column 1: Left Title (occupies height of its text without pushing right lines into empty space) */}
        <div 
          style={{ gridRow: `1 / span ${lines.length}` }}
          className="font-medium text-slate-700 break-words pr-1 self-start"
        >
          {lines[0]?.leftTitle ? renderFormattedText(lines[0].leftTitle) : ''}
        </div>

        {/* Column 2 & 3: Math lines (equal signs & expressions on consecutive rows without empty line gaps) */}
        {lines.map((line, idx) => (
          <React.Fragment key={idx}>
            {/* Column 2: Equal Sign */}
            <div 
              style={{ gridRow: `${idx + 1}` }}
              className="col-start-2 text-slate-400 font-bold select-none text-center"
            >
              {line.hasEqual ? '=' : ''}
            </div>

            {/* Column 3: Expression */}
            <div 
              style={{ gridRow: `${idx + 1}` }}
              className={`col-start-3 text-slate-700 break-words font-medium ${
                line.isGroupEnd && idx < lines.length - 1 
                  ? 'border-b border-slate-400 pb-1 mb-1 inline-block max-w-max' 
                  : ''
              }`}
            >
              {renderFormattedText(line.expression)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </li>
  );
};


