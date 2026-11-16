export interface GeneratedPdfArtifact {
  bytes: Uint8Array;
  byteLength: number;
  sha256: string;
  blobUrl: string;
  fileName: string;
  documentTitle?: string;
}

async function computeSha256Hex(bytes: Uint8Array): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const digestBuffer = await crypto.subtle.digest('SHA-256', bytes.slice().buffer);
      const hashArray = Array.from(new Uint8Array(digestBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback hash when crypto.subtle is restricted
    }
  }
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < bytes.length; i++) {
    const ch = bytes[i];
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const combined =
    ((h1 >>> 0).toString(16).padStart(8, '0') +
      (h2 >>> 0).toString(16).padStart(8, '0')).repeat(4);
  return combined.slice(0, 64);
}

export async function createPdfArtifact(
  bytes: Uint8Array,
  fileName: string,
  documentTitle?: string
): Promise<GeneratedPdfArtifact> {
  const safeBytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const blob = new Blob([safeBytes.slice().buffer], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const sha256 = await computeSha256Hex(safeBytes);

  return {
    bytes: safeBytes,
    byteLength: safeBytes.byteLength,
    sha256,
    blobUrl,
    fileName: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
    documentTitle,
  };
}

export function downloadPdfArtifact(artifact: GeneratedPdfArtifact): void {
  if (typeof document === 'undefined' || !artifact?.blobUrl) return;
  const link = document.createElement('a');
  link.href = artifact.blobUrl;
  link.download = artifact.fileName || 'document.pdf';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function printPdfArtifact(artifact: GeneratedPdfArtifact): Promise<void> {
  if (typeof document === 'undefined' || !artifact?.blobUrl) return;

  return new Promise<void>((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = artifact.blobUrl;

    const cleanup = () => {
      window.setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        resolve();
      }, 1500);
    };

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.print();
      } finally {
        cleanup();
      }
    };

    iframe.onerror = () => {
      cleanup();
    };

    document.body.appendChild(iframe);
  });
}

export function revokePdfArtifact(artifact?: GeneratedPdfArtifact | null): void {
  if (artifact?.blobUrl && typeof URL !== 'undefined') {
    try {
      URL.revokeObjectURL(artifact.blobUrl);
    } catch {
      // Ignore already-revoked URLs
    }
  }
}
