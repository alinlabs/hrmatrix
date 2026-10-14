import './polyfills';
import * as pdfjsLib from 'pdfjs-dist';

// Configure GlobalWorkerOptions safely with explicit https URL
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Helper to reconstruct clean multi-line text from PDF text items
 */
function reconstructTextLinesFromItems(items: any[]): string {
  if (!items || !Array.isArray(items) || items.length === 0) return '';

  let result = '';
  let lastY: number | null = null;

  for (const it of items) {
    if (!it || typeof it.str !== 'string') continue;
    const str = it.str;
    if (str === '') continue;

    const currentY = it.transform && Array.isArray(it.transform) ? it.transform[5] : null;
    const hasEol = it.hasEOL === true;

    if (lastY !== null && currentY !== null) {
      const yDiff = Math.abs(currentY - lastY);
      if (yDiff > 6 || hasEol) {
        // Vertical displacement indicates a new line or section break
        if (yDiff > 18) {
          result += '\n\n' + str;
        } else {
          result += '\n' + str;
        }
      } else {
        // Same horizontal line: add space if needed
        if (result.endsWith(' ') || result.endsWith('\n') || str.startsWith(' ')) {
          result += str;
        } else {
          result += ' ' + str;
        }
      }
    } else {
      if (hasEol) {
        result += str + '\n';
      } else {
        result += str;
      }
    }

    lastY = currentY;
  }

  return result.trim();
}

/**
 * Safely extracts text from a PDF page across all browser environments.
 * Uses direct stream reading as primary/fallback to avoid WebKit
 * "undefined is not a function (near '...value of readableStream...')" errors.
 */
export async function extractTextFromPage(page: any): Promise<string> {
  // Method 1: Direct stream reader
  if (typeof page.streamTextContent === 'function') {
    try {
      const stream = page.streamTextContent();
      if (stream && typeof stream.getReader === 'function') {
        const reader = stream.getReader();
        const collectedItems: any[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value?.items && Array.isArray(value.items)) {
            collectedItems.push(...value.items);
          }
        }
        if (collectedItems.length > 0) {
          return reconstructTextLinesFromItems(collectedItems);
        }
      }
    } catch (streamErr) {
      console.warn('streamTextContent manual reader failed, falling back to getTextContent:', streamErr);
    }
  }

  // Method 2: Standard getTextContent (supported when asyncIterator polyfill is active)
  try {
    const textContent = await page.getTextContent();
    if (textContent?.items && Array.isArray(textContent.items)) {
      return reconstructTextLinesFromItems(textContent.items);
    }
  } catch (textErr) {
    console.warn('getTextContent failed:', textErr);
  }

  return '';
}

/**
 * Parses and extracts text from an ArrayBuffer containing PDF data.
 */
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useWorkerFetch: false,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const pageText = await extractTextFromPage(page);
      if (pageText.trim()) {
        fullText += pageText + '\n';
      }
    } catch (pageErr) {
      console.warn(`Error extracting text from page ${pageNum}:`, pageErr);
    }
  }

  return fullText;
}
