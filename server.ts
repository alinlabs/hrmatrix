import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { handleCommonRedirectsAndXml } from './server-routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distDir = path.resolve(__dirname, 'dist');
const publicDir = path.resolve(__dirname, 'public');

// Shared canonical redirects, sitemap.xml, and robots.txt handlers
app.use((req, res, next) => {
  const candidateDirs = [
    distDir,
    publicDir,
    path.resolve(process.cwd(), 'public'),
    path.resolve(__dirname, '../public'),
  ];
  if (handleCommonRedirectsAndXml(req, res, candidateDirs, true)) {
    return;
  }
  next();
});

function setDynamicCacheHeaders(res: express.Response, filePath: string) {
  const normalized = filePath.replace(/\\/g, '/');
  if (
    normalized.endsWith('/index.html') ||
    normalized.endsWith('/sw.js') ||
    normalized.endsWith('/registerSW.js') ||
    normalized.endsWith('/version.json') ||
    normalized.endsWith('/manifest.json') ||
    normalized.endsWith('/manifest-presensi.json')
  ) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } else if (normalized.includes('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  }
}

// Serve static assets from dist
app.use(express.static(distDir, {
  extensions: ['html', 'htm'],
  setHeaders: setDynamicCacheHeaders,
}));

// Fallback to public folder if dist assets not found
app.use(express.static(publicDir, {
  extensions: ['html', 'htm'],
  setHeaders: setDynamicCacheHeaders,
}));

// SPA Fallback for all other routes
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
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
