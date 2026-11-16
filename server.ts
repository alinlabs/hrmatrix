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
