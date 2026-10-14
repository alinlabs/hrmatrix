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

export default async function handler(req: any, res: any) {
  let targetUrl = '';
  try {
    const protocol = req.headers?.['x-forwarded-proto'] || 'https';
    const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'localhost';
    const reqUrl = new URL(req.url || '', `${protocol}://${host}`);
    
    // Support req.query (Express/Vercel) and searchParams (Vite/Node)
    const rawPortal = (req.query && (req.query.portal || req.query.tool)) || reqUrl.searchParams.get('portal') || reqUrl.searchParams.get('tool');
    const portalParam = typeof rawPortal === 'string' ? rawPortal.trim().toLowerCase() : '';
    const rawCustomUrl = (req.query && (req.query.url || req.query.target)) || reqUrl.searchParams.get('url') || reqUrl.searchParams.get('target');
    const customUrl = typeof rawCustomUrl === 'string' ? rawCustomUrl.trim() : '';

    if (portalParam && PORTAL_URL_MAP[portalParam]) {
      targetUrl = PORTAL_URL_MAP[portalParam];
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
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(renderPortalFallbackHtml(targetUrl || 'https://pddikti.kemdiktisaintek.go.id/', 'Situs eksternal memerlukan akses langsung di peramban atau koneksi jaringan resmi.'));
  }
}
