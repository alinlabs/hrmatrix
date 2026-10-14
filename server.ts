import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import handler from './api/proxy-portal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distDir = path.resolve(__dirname, 'dist');
const publicDir = path.resolve(__dirname, 'public');

// Middleware for proxy-portal
app.all('/api/proxy-portal', async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Explicit routes for sitemap and robots with fallback to public/ and embedded fallback
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const candidates = [
    path.join(distDir, 'sitemap.xml'),
    path.join(publicDir, 'sitemap.xml'),
    path.resolve(process.cwd(), 'public/sitemap.xml'),
    path.resolve(__dirname, '../public/sitemap.xml')
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        return res.status(200).send(content);
      } catch {}
    }
  }

  // Guaranteed fallback: return clean XML directly so it NEVER 404s
  const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://hrmatrix.my.id/</loc><priority>1.0</priority></url>
  <url><loc>https://hrmatrix.my.id/daftar</loc><priority>0.95</priority></url>
  <url><loc>https://hrmatrix.my.id/tentang</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/ebook</loc><priority>0.95</priority></url>
  <url><loc>https://hrmatrix.my.id/employees</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/presensi</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/payroll</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/kpi</loc><priority>0.85</priority></url>
  <url><loc>https://hrmatrix.my.id/ats</loc><priority>0.85</priority></url>
  <url><loc>https://hrmatrix.my.id/checking-tools</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/ga</loc><priority>0.90</priority></url>
  <url><loc>https://hrmatrix.my.id/e-portal</loc><priority>0.90</priority></url>
</urlset>`;
  res.status(200).send(fallbackXml);
});

app.get(['/sitemap', '/sitemap/'], (req, res) => {
  res.redirect(301, '/sitemap.xml');
});

app.get(['/checkingtools', '/checkingtools/*', '/checking-tool', '/checking-tool/*', '/checking', '/checking/*'], (req, res) => {
  const target = req.url.replace(/^\/(checkingtools|checking-tool|checking)/, '/checking-tools');
  res.redirect(301, target || '/checking-tools');
});

app.get(['/eportal', '/eportal/*', '/portal', '/portal/*', '/e-portals', '/e-portals/*'], (req, res) => {
  const target = req.url.replace(/^\/(eportal|portal|e-portals)/, '/e-portal');
  res.redirect(301, target || '/e-portal');
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const candidates = [
    path.join(distDir, 'robots.txt'),
    path.join(publicDir, 'robots.txt'),
    path.resolve(process.cwd(), 'public/robots.txt'),
    path.resolve(__dirname, '../public/robots.txt')
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        return res.status(200).send(content);
      } catch {}
    }
  }

  const fallbackRobots = `User-agent: *\nAllow: /\n\nHost: https://hrmatrix.my.id\nSitemap: https://hrmatrix.my.id/sitemap.xml\n`;
  res.status(200).send(fallbackRobots);
});

// Serve static assets from dist
app.use(express.static(distDir, {
  extensions: ['html', 'htm'],
  maxAge: '1d',
}));

// Fallback to public folder if dist assets not found
app.use(express.static(publicDir, {
  extensions: ['html', 'htm'],
  maxAge: '1d',
}));

// SPA Fallback for all other routes
app.get('*', (req, res) => {
  const distIndex = path.join(distDir, 'index.html');
  const rootIndex = path.join(__dirname, 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  return res.sendFile(rootIndex);
});

app.listen(PORT, () => {
  console.log(`HRMatrix server running on port ${PORT}`);
});
