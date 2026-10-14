import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const PORTAL_URL_MAP: Record<string, string> = {
  // Ranah HR (Ketenagakerjaan, K3, Hubungan Industrial & Pajak)
  kemenaker: 'https://wajiblapor.kemnaker.go.id/',
  kemnaker: 'https://wajiblapor.kemnaker.go.id/',
  wlkp: 'https://wajiblapor.kemnaker.go.id/',
  bpjstk: 'https://sipp.bpjsketenagakerjaan.go.id/',
  'bpjs-tk': 'https://sipp.bpjsketenagakerjaan.go.id/',
  sipp: 'https://sipp.bpjsketenagakerjaan.go.id/',
  edabu: 'https://edabu.bpjs-kesehatan.go.id/Edabu/Home/Login',
  'e-dabu': 'https://edabu.bpjs-kesehatan.go.id/Edabu/Home/Login',
  bpjskes: 'https://edabu.bpjs-kesehatan.go.id/Edabu/Home/Login',
  djp: 'https://djponline.pajak.go.id/account/login',
  pajak: 'https://djponline.pajak.go.id/account/login',
  'e-pp-pkb': 'https://pppkb.kemnaker.go.id/',
  pppkb: 'https://pppkb.kemnaker.go.id/',
  temank3: 'https://temank3.kemnaker.go.id/',
  'teman-k3': 'https://temank3.kemnaker.go.id/',
  k3: 'https://temank3.kemnaker.go.id/',
  'tka-online': 'https://tka-online.kemnaker.go.id/',
  tka: 'https://tka-online.kemnaker.go.id/',
  karirhub: 'https://karirhub.kemnaker.go.id/',
  siapkerja: 'https://siapkerja.kemnaker.go.id/',
  pphi: 'https://hi.kemnaker.go.id/',
  simasnaker: 'https://hi.kemnaker.go.id/',

  // Ranah GA (Perizinan Usaha, Investasi, Lingkungan & Fasilitas Gedung)
  oss: 'https://oss.go.id/',
  'oss-rba': 'https://oss.go.id/',
  bkpm: 'https://oss.go.id/',
  lkpm: 'https://oss.go.id/',
  simpel: 'https://simpel.menlhk.go.id/',
  'simpel-klhk': 'https://simpel.menlhk.go.id/',
  festronik: 'https://festronik.menlhk.go.id/',
  'festronik-klhk': 'https://festronik.menlhk.go.id/',
  simbg: 'https://simbg.pu.go.id/',
  'simbg-pupr': 'https://simbg.pu.go.id/',
  pupr: 'https://simbg.pu.go.id/',
  bapenda: 'https://pajakonline.jakarta.go.id/',
  'pajak-daerah': 'https://pajakonline.jakarta.go.id/',

  // Ranah Background Checking & Verifikasi Rekrutmen
  sivil: 'https://pddikti.kemdiktisaintek.go.id/',
  ijazah: 'https://pddikti.kemdiktisaintek.go.id/',
  'ijazah-pt': 'https://pddikti.kemdiktisaintek.go.id/',
  pddikti: 'https://pddikti.kemdiktisaintek.go.id/',
  nisn: 'https://nisn.data.kemdikbud.go.id/',
  'ijazah-sd-sma': 'https://nisn.data.kemdikbud.go.id/',
  'ijazah-sekolah': 'https://nisn.data.kemdikbud.go.id/',
  sekolah: 'https://nisn.data.kemdikbud.go.id/',
  dapo: 'https://nisn.data.kemdikbud.go.id/',
  bnsp: 'https://bnsp.go.id/',
  'sertifikasi-bnsp': 'https://bnsp.go.id/',
  slik: 'https://idebku.ojk.go.id/',
  idebku: 'https://idebku.ojk.go.id/',
  ojk: 'https://idebku.ojk.go.id/',
  dukcapil: 'https://layananonline.dukcapil.kemendagri.go.id/',
  nik: 'https://layananonline.dukcapil.kemendagri.go.id/',
  ktp: 'https://layananonline.dukcapil.kemendagri.go.id/',
  skck: 'https://skck.polri.go.id/',
  polri: 'https://skck.polri.go.id/',
  ceknpwp: 'https://ereg.pajak.go.id/ceknpwp',
  'cek-npwp': 'https://ereg.pajak.go.id/ceknpwp',
  sippma: 'https://putusan3.mahkamahagung.go.id/',
  'sipp-ma': 'https://putusan3.mahkamahagung.go.id/',
  mahkamahagung: 'https://putusan3.mahkamahagung.go.id/',
  kki: 'https://satusehat.kemkes.go.id/sdmk',
  str: 'https://satusehat.kemkes.go.id/sdmk',
};

function renderPortalFallbackHtml(targetUrl: string, reason?: string): string {
  let displayHost = targetUrl;
  try {
    displayHost = new URL(targetUrl).hostname;
  } catch {}

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portal Eksternal</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 36px 28px;
      max-width: 520px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 10px;
    }
    p {
      font-size: 13px;
      line-height: 1.6;
      color: #64748b;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #2563eb;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      padding: 11px 22px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
      transition: all 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
      box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    }
    .url {
      margin-top: 18px;
      font-size: 11px;
      color: #94a3b8;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Akses Langsung Resmi</div>
    <h2>Portal Memerlukan Akses Langsung</h2>
    <p>${reason || 'Situs web resmi ini membatasi penayangan dalam frame demi keamanan otentikasi. Silakan buka langsung untuk mengakses formulir dan layanan penuh.'}</p>
    <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="btn">
      Buka Portal Resmi (${displayHost}) ↗
    </a>
    <div class="url">${targetUrl}</div>
  </div>
</body>
</html>`;
}

function portalProxyPlugin(): Plugin {
  const handler = async (req: any, res: any) => {
    let targetUrl = '';
    try {
      const reqUrl = new URL(req.url || '', 'http://localhost:3000');
      const portalParam = reqUrl.searchParams.get('portal');
      const customUrl = reqUrl.searchParams.get('url');

      if (portalParam && PORTAL_URL_MAP[portalParam.toLowerCase()]) {
        targetUrl = PORTAL_URL_MAP[portalParam.toLowerCase()];
      } else if (customUrl) {
        targetUrl = customUrl;
      } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Parameter portal atau url tidak ditemukan');
        return;
      }

      const headers: Record<string, string> = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'X-Forwarded-For': req.headers?.['x-forwarded-for'] || '103.10.67.1',
      };

      if (portalParam?.toLowerCase() === 'edabu' || targetUrl.includes('edabu.bpjs-kesehatan')) {
        headers['Cookie'] = 'AspxAutoDetectCookieSupport=1';
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      let response: Response;
      try {
        response = await fetch(targetUrl, {
          headers,
          redirect: 'follow',
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      // If the target server returned 403, 401, 502, 503 or any error (e.g. Cloudflare WAF, anti-bot)
      if (!response.ok) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(renderPortalFallbackHtml(targetUrl, 'Situs instansi resmi membatasi penyematan demi keamanan jaringan. Silakan buka langsung di peramban.'));
        return;
      }

      const finalUrl = response.url || targetUrl;
      const urlObj = new URL(finalUrl);
      const rawHtml = await response.text();

      // Inject accurate <base href="...">, responsive meta, touch scrolling styles, and frame-busting neutralizer
      const baseHref = finalUrl.endsWith('/') 
        ? finalUrl 
        : (finalUrl.substring(0, finalUrl.lastIndexOf('/') + 1) || (urlObj.origin + '/'));
      const baseTag = `<base href="${baseHref}" />`;
      const responsiveMeta = `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />`;
      const mobileStyle = `
<style>
  html, body {
    width: 100% !important;
    max-width: 100vw !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    touch-action: pan-x pan-y pinch-zoom !important;
  }
</style>`;
      const antiFrameBustScript = `
<script>
  try {
    window.self = window.top;
  } catch(e) {}
  try {
    Object.defineProperty(window, 'top', { get: function() { return window.self; } });
    Object.defineProperty(window, 'parent', { get: function() { return window.self; } });
  } catch(e) {}
</script>`;

      let modifiedHtml = rawHtml;
      const injectedTags = `\n    ${baseTag}\n    ${responsiveMeta}\n    ${mobileStyle}\n    ${antiFrameBustScript}`;
      if (/<head[^>]*>/i.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(
          /<head([^>]*)>/i,
          `<head$1>${injectedTags}`
        );
      } else {
        modifiedHtml = `<head>${injectedTags}</head>${modifiedHtml}`;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.end(modifiedHtml);
    } catch {
      // Return clean fallback HTML without logging error to stderr
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(renderPortalFallbackHtml(targetUrl || 'https://pddikti.kemdiktisaintek.go.id/', 'Situs eksternal memerlukan akses langsung di peramban atau koneksi jaringan resmi.'));
    }
  };

  return {
    name: 'portal-cors-proxy-handler',
    configureServer(server) {
      server.middlewares.use('/api/proxy-portal', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/proxy-portal', handler);
    },
  };
}

function sitemapMiddlewarePlugin(): Plugin {
  return {
    name: 'sitemap-dev-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0];
        if (cleanUrl === '/sitemap' || cleanUrl === '/sitemap/') {
          res.writeHead(301, { Location: '/sitemap.xml' });
          res.end();
          return;
        }
        if (cleanUrl === '/checkingtools' || cleanUrl.startsWith('/checkingtools/') || cleanUrl === '/checking-tool' || cleanUrl.startsWith('/checking-tool/') || cleanUrl === '/checking' || cleanUrl.startsWith('/checking/')) {
          const target = req.url!.replace(/^\/(checkingtools|checking-tool|checking)/, '/checking-tools');
          res.writeHead(301, { Location: target || '/checking-tools' });
          res.end();
          return;
        }
        if (cleanUrl === '/eportal' || cleanUrl.startsWith('/eportal/') || cleanUrl === '/portal' || cleanUrl.startsWith('/portal/') || cleanUrl === '/e-portals' || cleanUrl.startsWith('/e-portals/')) {
          const target = req.url!.replace(/^\/(eportal|portal|e-portals)/, '/e-portal');
          res.writeHead(301, { Location: target || '/e-portal' });
          res.end();
          return;
        }
        if (cleanUrl === '/sitemap.xml') {
          const sitemapPath = path.resolve(__dirname, 'public/sitemap.xml');
          if (fs.existsSync(sitemapPath)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(fs.readFileSync(sitemapPath, 'utf8'));
            return;
          }
        }
        if (cleanUrl === '/robots.txt') {
          const robotsPath = path.resolve(__dirname, 'public/robots.txt');
          if (fs.existsSync(robotsPath)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(fs.readFileSync(robotsPath, 'utf8'));
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0];
        if (cleanUrl === '/sitemap' || cleanUrl === '/sitemap/') {
          res.writeHead(301, { Location: '/sitemap.xml' });
          res.end();
          return;
        }
        if (cleanUrl === '/sitemap.xml') {
          const distPath = path.resolve(__dirname, 'dist/sitemap.xml');
          const pubPath = path.resolve(__dirname, 'public/sitemap.xml');
          const finalPath = fs.existsSync(distPath) ? distPath : (fs.existsSync(pubPath) ? pubPath : null);
          if (finalPath) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(fs.readFileSync(finalPath, 'utf8'));
            return;
          }
        }
        if (cleanUrl === '/robots.txt') {
          const distRobots = path.resolve(__dirname, 'dist/robots.txt');
          const pubRobots = path.resolve(__dirname, 'public/robots.txt');
          const finalRobots = fs.existsSync(distRobots) ? distRobots : (fs.existsSync(pubRobots) ? pubRobots : null);
          if (finalRobots) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(fs.readFileSync(finalRobots, 'utf8'));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      sitemapMiddlewarePlugin(),
      portalProxyPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'gambar/favicon.png',
          'gambar/pwa-maskable-512x512.png',
          'gambar/pwa-presensi-512x512.png',
          'icon.svg',
          'icon-3people.svg',
          'manifest-presensi.json',
        ],
        manifest: {
          id: '/',
          name: 'HRMatrix - Sistem Payroll & HR',
          short_name: 'HRMatrix',
          description: 'Aplikasi HRMatrix - Payroll, Kehadiran, Administrasi HR, dan Evaluasi KPI Karyawan.',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/gambar/pwa-maskable-512x512.png',
              sizes: '192x192 512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
      dedupe: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client',
        'react-router',
        'react-router-dom',
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      allowedHosts: true,
      // HMR is disabled in AI Studio environment to prevent WebSocket connection failures in iframe/cloud run
      hmr: false,
      watch: null,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        'react-router',
        'react-router-dom',
        'dexie',
        'dexie-react-hooks',
        'lucide-react',
        'motion/react',
        'lottie-react',
        'date-fns',
        'html5-qrcode',
      ],
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'vendor-pdf';
              }
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'vendor-charts';
              }
              if (id.includes('lottie-react') || id.includes('lottie-web')) {
                return 'vendor-lottie';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 1500,
    },
  };
});
