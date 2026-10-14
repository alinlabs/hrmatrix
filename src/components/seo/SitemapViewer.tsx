import React, { useEffect, useState } from 'react';

const RAW_SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://hrmatrix.my.id/</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://hrmatrix.my.id/gambar/logo.webp</image:loc>
      <image:title>Logo Resmi HRMatrix Indonesia</image:title>
      <image:caption>Software HRIS, General Affair &amp; Payroll Indonesia</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://hrmatrix.my.id/gambar/metatag.webp</image:loc>
      <image:title>HRMatrix Indonesia Dashboard</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/daftar</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>https://hrmatrix.my.id/gambar/logo.webp</image:loc>
      <image:title>Logo HRMatrix Pendaftaran Perusahaan</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/tentang</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
    <image:image>
      <image:loc>https://hrmatrix.my.id/gambar/logo.webp</image:loc>
      <image:title>Logo HRMatrix Profil dan Visi Misi</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ebook</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>https://hrmatrix.my.id/gambar/logo.webp</image:loc>
      <image:title>Logo HRMatrix E-Book HRD</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/employees</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/attendance</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/presensi</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/jadwal</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/cuti</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/payroll</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/kompensasi</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/regulation</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/kpi</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/kpi/katalog-umum</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/job-desk</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/lowongan</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ats</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/assessment</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/candidate</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/checking-tools</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/kontrak</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/surat</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ga</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ga/aset</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ga/atk</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ga/fasilitas</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ga/vendor</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/ga/buku-tamu</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/reports</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/e-portal</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/database</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/settings</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/navigasi-cepat</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/faq</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/bantuan</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/promo</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://hrmatrix.my.id/prompt</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
</urlset>`;

const RAW_ROBOTS_TXT = `User-agent: *
Allow: /
Allow: /gambar/
Allow: /daftar/
Allow: /tentang/
Allow: /ebook/

User-agent: Googlebot
Allow: /
Allow: /gambar/
Allow: /daftar/
Allow: /tentang/
Allow: /ebook/

User-agent: Googlebot-Image
Allow: /gambar/
Allow: /gambar/logo.webp
Allow: /gambar/metatag.webp

Host: https://hrmatrix.my.id
Sitemap: https://hrmatrix.my.id/sitemap.xml`;

export const SitemapViewer: React.FC = () => {
  const [content, setContent] = useState<string>(RAW_SITEMAP_XML);

  useEffect(() => {
    document.title = 'sitemap.xml';

    // Prevent any splash screen or dialogs
    try {
      sessionStorage.setItem('hrmatrix_splash_shown', 'true');
    } catch {}

    // Attempt to fetch latest sitemap.xml from public static file
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    fetch('/sitemap.xml', {
      headers: {
        Accept: 'application/xml, text/xml, text/plain, */*'
      },
      signal: controller.signal
    })
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        // Only accept if not an HTML fallback
        if (res.ok && !ct.includes('text/html')) {
          return res.text();
        }
        return null;
      })
      .then((text) => {
        if (text && text.includes('<urlset')) {
          setContent(text);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
  }, []);

  return (
    <pre
      style={{
        margin: 0,
        padding: '16px 20px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#0f172a',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        whiteSpace: 'pre',
        overflowX: 'auto',
        userSelect: 'text',
      }}
    >
      {content}
    </pre>
  );
};

export const RobotsViewer: React.FC = () => {
  const [content, setContent] = useState<string>(RAW_ROBOTS_TXT);

  useEffect(() => {
    document.title = 'robots.txt';

    try {
      sessionStorage.setItem('hrmatrix_splash_shown', 'true');
    } catch {}

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    fetch('/robots.txt', {
      headers: {
        Accept: 'text/plain, */*'
      },
      signal: controller.signal
    })
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && !ct.includes('text/html')) {
          return res.text();
        }
        return null;
      })
      .then((text) => {
        if (text && text.includes('User-agent')) {
          setContent(text);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
  }, []);

  return (
    <pre
      style={{
        margin: 0,
        padding: '16px 20px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#0f172a',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        whiteSpace: 'pre',
        overflowX: 'auto',
        userSelect: 'text',
      }}
    >
      {content}
    </pre>
  );
};
