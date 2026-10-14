import './polyfills';
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure PDF.js worker is configured consistently across browser environments
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Representasi tunggal (Single Source of Truth) dari dokumen PDF final.
 * Objek ini digunakan secara bersama-sama oleh jalur:
 * 1. Modal Preview (dirender menggunakan pdfjs-dist dari `bytes`)
 * 2. Download PDF (diunduh langsung dari `blob` / `bytes`)
 * 3. Print PDF (dicetak langsung dari `bytes` / `blobUrl`)
 */
export interface GeneratedPdfArtifact {
  bytes: Uint8Array;
  blob: Blob;
  blobUrl: string;
  sha256: string;
  fileName: string;
  pageCount: number;
  byteLength: number;
  generatedAt: number;
}

/**
 * Menghitung hash deterministik (256-bit hex) secara sinkron sebagai fallback
 * atau verifikasi cepat terhadap byte array PDF.
 */
export function computeDeterministicHexDigest(bytes: Uint8Array): string {
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ]);

  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    const lane = i & 7;
    h[lane] = Math.imul(h[lane] ^ b, 0x01000193) >>> 0;
    const nextLane = (lane + 1) & 7;
    h[nextLane] = (h[nextLane] + ((h[lane] >>> 13) | (h[lane] << 19)) + i) >>> 0;
  }

  return Array.from(h)
    .map(v => v.toString(16).padStart(8, '0'))
    .join('');
}

/**
 * Menghitung SHA-256 hash dari binary PDF (menggunakan Web Crypto API jika tersedia,
 * atau fallback deterministik jika berjalan di lingkungan non-WebCrypto).
 */
export async function computePdfBytesHash(bytes: Uint8Array): Promise<string> {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', copy.buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fallback to deterministic digest
  }
  return computeDeterministicHexDigest(bytes);
}

/**
 * Membersihkan nama file PDF agar aman di seluruh sistem operasi.
 */
export function sanitizePdfFileName(rawName: string): string {
  const cleaned = (rawName || 'Dokumen_Resmi')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  const base = cleaned || 'Dokumen_Resmi';
  return base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`;
}

/**
 * Membangun objek GeneratedPdfArtifact (Single Source of Truth) dari instance jsPDF.
 */
export async function createPdfArtifactFromJsPdf(
  pdf: jsPDF,
  rawFileName: string
): Promise<GeneratedPdfArtifact> {
  const arrayBuffer = pdf.output('arraybuffer');
  const bytes = new Uint8Array(arrayBuffer);
  const sha256 = await computePdfBytesHash(bytes);
  const fileName = sanitizePdfFileName(rawFileName);
  const pageCount = pdf.getNumberOfPages();

  // Buat salinan buffer bersih untuk Blob
  const blobBytes = new Uint8Array(bytes.byteLength);
  blobBytes.set(bytes);
  const blob = new Blob([blobBytes.buffer], { type: 'application/pdf' });

  let blobUrl = '';
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    blobUrl = URL.createObjectURL(blob);
  }

  return {
    bytes,
    blob,
    blobUrl,
    sha256,
    fileName,
    pageCount,
    byteLength: bytes.byteLength,
    generatedAt: Date.now()
  };
}

/**
 * Membersihkan Blob URL dari memori ketika modal ditutup atau dokumen diperbarui.
 */
export function revokePdfArtifact(artifact: GeneratedPdfArtifact | null | undefined): void {
  if (!artifact || !artifact.blobUrl) return;
  try {
    if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(artifact.blobUrl);
    }
  } catch {
    // Ignore revoke errors
  }
}

/**
 * Mengunduh file PDF langsung dari GeneratedPdfArtifact yang sama dengan preview.
 * Tidak melakukan render ulang sehingga dijamin 100% byte-identik dengan preview.
 */
export function downloadPdfArtifact(artifact: GeneratedPdfArtifact): {
  sha256: string;
  byteLength: number;
  fileName: string;
} {
  if (typeof document !== 'undefined') {
    const tempUrl =
      artifact.blobUrl ||
      (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
        ? URL.createObjectURL(artifact.blob)
        : '');

    if (tempUrl) {
      const link = document.createElement('a');
      link.href = tempUrl;
      link.download = artifact.fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (!artifact.blobUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        setTimeout(() => URL.revokeObjectURL(tempUrl), 5000);
      }
    }
  }

  return {
    sha256: artifact.sha256,
    byteLength: artifact.byteLength,
    fileName: artifact.fileName
  };
}

const PRINT_CONTAINER_ID = 'ssot-pdf-print-container';
const PRINT_STYLE_ID = 'ssot-pdf-print-style';

function ensurePrintStylesheet(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PRINT_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = PRINT_STYLE_ID;
  style.textContent = `
    #${PRINT_CONTAINER_ID} {
      display: none;
    }
    @media print {
      @page {
        size: A4 portrait;
        margin: 0mm !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        width: 210mm !important;
        height: auto !important;
        overflow: visible !important;
      }
      body > *:not(#${PRINT_CONTAINER_ID}) {
        display: none !important;
      }
      #${PRINT_CONTAINER_ID} {
        display: block !important;
        position: static !important;
        width: 210mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .ssot-pdf-print-page {
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: flex-start !important;
        justify-content: center !important;
        background: #ffffff !important;
      }
      .ssot-pdf-print-page:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
      .ssot-pdf-print-page canvas,
      .ssot-pdf-print-page img {
        width: 210mm !important;
        height: 297mm !important;
        max-width: 210mm !important;
        max-height: 297mm !important;
        display: block !important;
        object-fit: contain !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Mencetak dokumen langsung dari sumber biner PDF yang sama (`artifact.bytes`).
 * Merender setiap halaman PDF ke lembaran cetak A4 presisi tinggi (300 DPI equivalent)
 * di dalam kontainer khusus `@media print`, sehingga hasil cetak 100% identik dengan
 * tampilan preview dan file PDF yang diunduh (tanpa reflow HTML atau elemen UI aplikasi).
 */
export async function printPdfArtifact(artifact: GeneratedPdfArtifact): Promise<{
  sha256: string;
  byteLength: number;
  pageCount: number;
}> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      sha256: artifact.sha256,
      byteLength: artifact.byteLength,
      pageCount: artifact.pageCount
    };
  }

  ensurePrintStylesheet();

  let printContainer = document.getElementById(PRINT_CONTAINER_ID);
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = PRINT_CONTAINER_ID;
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = '';

  // Load the exact PDF bytes via pdfjs-dist
  const dataCopy = new Uint8Array(artifact.bytes.byteLength);
  dataCopy.set(artifact.bytes);

  const loadingTask = pdfjsLib.getDocument({
    data: dataCopy,
    useWorkerFetch: false,
    useSystemFonts: true
  });

  const pdfDoc = await loadingTask.promise;

  try {
    // Render each PDF page at high print resolution (scale 2.5 ≈ 240-300 DPI for A4)
    const printScale = 2.5;

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: printScale });

      const pageWrapper = document.createElement('div');
      pageWrapper.className = 'ssot-pdf-print-page';

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({
          canvasContext: ctx,
          viewport,
          canvas
        } as any).promise;
      }

      pageWrapper.appendChild(canvas);
      printContainer.appendChild(pageWrapper);
    }

    // Trigger browser print dialog after paint
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.print();
          resolve();
        });
      });
    });
  } finally {
    try {
      if (typeof (pdfDoc as any).destroy === 'function') {
        await (pdfDoc as any).destroy();
      }
    } catch {
      // Ignore cleanup error
    }
  }

  return {
    sha256: artifact.sha256,
    byteLength: artifact.byteLength,
    pageCount: artifact.pageCount
  };
}
