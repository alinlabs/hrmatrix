import fs from 'fs';
import path from 'path';

export interface MinimalRequest {
  url?: string;
}

export interface MinimalResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  writeHead(statusCode: number, headers?: Record<string, string>): void;
  end(data?: string): void;
}

export const FALLBACK_SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://hrmatrix.my.id/</loc><priority>1.0</priority></url>
  <url><loc>https://hrmatrix.my.id/demo</loc><priority>0.95</priority></url>
  <url><loc>https://hrmatrix.my.id/daftar</loc><priority>0.95</priority></url>
  <url><loc>https://hrmatrix.my.id/tentang</loc><priority>0.95</priority></url>
  <url><loc>https://hrmatrix.my.id/ebook</loc><priority>0.95</priority></url>
  <url><loc>https://hrmatrix.my.id/employees</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/presensi</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/payroll</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/kpi</loc><priority>0.85</priority></url>
  <url><loc>https://hrmatrix.my.id/screening</loc><priority>0.85</priority></url>
  <url><loc>https://hrmatrix.my.id/ga</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/llms.txt</loc><priority>0.85</priority></url>
</urlset>`;

export const FALLBACK_ROBOTS_TXT = `User-agent: *\nAllow: /\n\nSitemap: https://hrmatrix.my.id/sitemap.xml\n`;

/**
 * Shared route normalization, SEO XML/TXT serving, and 301 canonical redirects
 * used identically by Vite dev/preview middleware and Express production server.
 */
export function handleCommonRedirectsAndXml(
  req: MinimalRequest,
  res: MinimalResponse,
  baseDirs: string[],
  enableFallbacks = false
): boolean {
  const rawUrl = req.url || '';
  const cleanUrl = rawUrl.split('?')[0];

  if (cleanUrl === '/sitemap' || cleanUrl === '/sitemap/') {
    res.writeHead(301, { Location: '/sitemap.xml' });
    res.end();
    return true;
  }

  if (cleanUrl === '/sitemap.xml') {
    for (const dir of baseDirs) {
      const candidate = path.resolve(dir, 'sitemap.xml');
      if (fs.existsSync(candidate)) {
        try {
          const content = fs.readFileSync(candidate, 'utf8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.end(content);
          return true;
        } catch {
          // Try next candidate
        }
      }
    }
    if (enableFallbacks) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(FALLBACK_SITEMAP_XML);
      return true;
    }
  }

  if (cleanUrl === '/robots.txt' || cleanUrl === '/llms.txt') {
    const fileName = cleanUrl === '/llms.txt' ? 'llms.txt' : 'robots.txt';
    for (const dir of baseDirs) {
      const candidate = path.resolve(dir, fileName);
      if (fs.existsSync(candidate)) {
        try {
          const content = fs.readFileSync(candidate, 'utf8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(content);
          return true;
        } catch {
          // Try next candidate
        }
      }
    }
    if (enableFallbacks && cleanUrl === '/robots.txt') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(FALLBACK_ROBOTS_TXT);
      return true;
    }
  }

  return false;
}
