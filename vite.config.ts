import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function handleCommonRedirectsAndXml(req: { url?: string }, res: any, baseDirs: string[]): boolean {
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
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(fs.readFileSync(candidate, 'utf8'));
        return true;
      }
    }
  }

  if (cleanUrl === '/robots.txt' || cleanUrl === '/llms.txt') {
    const fileName = cleanUrl === '/llms.txt' ? 'llms.txt' : 'robots.txt';
    for (const dir of baseDirs) {
      const candidate = path.resolve(dir, fileName);
      if (fs.existsSync(candidate)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(fs.readFileSync(candidate, 'utf8'));
        return true;
      }
    }
  }

  return false;
}

function sitemapMiddlewarePlugin(): Plugin {
  const publicDir = path.resolve(__dirname, 'public');
  const distDir = path.resolve(__dirname, 'dist');

  return {
    name: 'sitemap-dev-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (handleCommonRedirectsAndXml(req, res, [publicDir])) return;
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (handleCommonRedirectsAndXml(req, res, [distDir, publicDir])) return;
        next();
      });
    },
  };
}

function appVersionPlugin(buildId: string): Plugin {
  const payload = JSON.stringify({ version: buildId });

  return {
    name: 'app-version-manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if ((req.url || '').split('?')[0] === '/version.json') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          res.end(payload);
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if ((req.url || '').split('?')[0] === '/version.json') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          res.end(payload);
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: payload,
      });
    },
  };
}

export default defineConfig(() => {
  const appBuildId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    define: {
      __APP_BUILD_ID__: JSON.stringify(appBuildId),
    },
    plugins: [
      sitemapMiddlewarePlugin(),
      appVersionPlugin(appBuildId),
      react(),
      tailwindcss(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        injectRegister: false,
        registerType: 'autoUpdate',
        includeAssets: [
          'gambar/favicon.png',
          'gambar/apple-touch-icon.png',
          'gambar/apple-touch-icon-presensi.png',
          'gambar/pwa-192x192.png',
          'gambar/pwa-maskable-512x512.png',
          'gambar/pwa-presensi-192x192.png',
          'gambar/pwa-presensi-512x512.png',
          'icon.svg',
          'icon-3people.svg',
          'manifest.json',
          'manifest-presensi.json',
        ],
        manifest: false,
        injectManifest: {
          globPatterns: [
            'index.html',
            'assets/*.css',
            'assets/vendor-react-*.js',
            'assets/vendor-dexie-*.js',
            'assets/app-db-*.js',
            'assets/vendor-icons-*.js',
          ],
          globIgnores: ['**/version.json'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client',
        'react-is',
        'react-router',
        'react-router-dom',
        'use-sync-external-store',
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
        'react/jsx-dev-runtime',
        'react-dom/client',
        'react-router',
        'react-router-dom',
        'dexie',
        'dexie-react-hooks',
        'lucide-react',
        'motion/react',
        'lottie-react',
        'date-fns',
        'date-fns/locale',
        'clsx',
        'tailwind-merge',
        'recharts',
        'uuid',
        'qrcode.react',
        'qr-code-styling',
        'html5-qrcode',
        'papaparse',
        'jspdf',
        'jspdf-autotable',
        '@emailjs/browser',
        'pdfjs-dist',
      ],
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2022',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('/node_modules/react/') ||
                id.includes('/node_modules/react-dom/') ||
                id.includes('/node_modules/react-router') ||
                id.includes('/node_modules/scheduler/') ||
                id.includes('/node_modules/use-sync-external-store/')
              ) {
                return 'vendor-react';
              }
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'vendor-pdf';
              }
              if (id.includes('pdfjs-dist')) {
                return 'vendor-pdfjs';
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
              if (id.includes('html5-qrcode') || id.includes('qr-code-styling') || id.includes('qrcode.react')) {
                return 'vendor-qr';
              }
              if (id.includes('dexie')) {
                return 'vendor-dexie';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('papaparse')) {
                return 'vendor-csv';
              }
            }

            if (id.endsWith('/position-index-lite.ts')) {
              return 'data-position-lite';
            }

            if (
              id.includes('/src/data/jobs/') &&
              !id.endsWith('/index.ts') &&
              !id.endsWith('/position-index-lite.ts')
            ) {
              const fileName = id.split('/').pop() || '';
              const firstChar = fileName.charAt(0).toLowerCase();
              if (firstChar >= 'a' && firstChar <= 'j') return 'data-jobs-1';
              if (firstChar >= 'k' && firstChar <= 'o') return 'data-jobs-2';
              if (firstChar === 'p') return 'data-jobs-3';
              return 'data-jobs-4';
            }

            if (id.includes('/src/db/')) {
              return 'app-db';
            }

            if (
              id.includes('/src/utils/sample-data-generator') ||
              id.includes('/src/data/sample-db/')
            ) {
              return 'data-sampledb';
            }

            if (id.includes('/src/data/master/')) {
              return 'data-master';
            }
          },
        },
      },
      chunkSizeWarningLimit: 900,
    },
  };
});
