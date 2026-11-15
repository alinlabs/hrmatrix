/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * HRMatrix Email Validation & Deliverability Verification Engine
 * Menghemat kuota EmailJS dengan menyaring email palsu, typo, disposable,
 * dan memverifikasi eksistensi MX Record domain via DNS-over-HTTPS.
 */

// Daftar domain email sementara / sekali pakai (disposable mail) populer
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'temp-mail.org',
  'tempmail.com',
  'temp-mail.io',
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'dispostable.com',
  'getairmail.com',
  'throwawaymail.com',
  'burnermail.io',
  'fakemailgenerator.com',
  'inboxkitten.com',
  'mohmal.com',
  'mytemp.email',
  'generator.email',
  'emailondeck.com',
  'crazymailing.com',
  'nada.ltd',
  'getnada.com',
  'tempail.com',
  'dropmail.me',
  'mailcatch.com',
  '10mail.org',
  'fakeinbox.com',
  'maildrop.cc',
  'tempinbox.com',
  'tmail.ws',
  'mytempemail.com',
  'throwawayemailaddress.com',
  'sharklasers.com',
  'spam4.me',
  'binkmail.com',
  'safetymail.info',
  'trashmail.org',
  'wegwerfmail.de',
  'meltmail.com',
  'tempmailaddress.com',
]);

// Daftar domain dummy / testing / RFC reserve yang jelas tidak menerima email asli
const BOGUS_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'testing.com',
  'tester.com',
  'sample.com',
  'dummy.com',
  'fake.com',
  'domain.com',
  'somedomain.com',
  'asdf.com',
  'qwerty.com',
  'abc.com',
  'xyz.com',
  '123.com',
  'aaa.com',
  'invalid.com',
  'none.com',
  'temp.com',
  'demo.com',
  'localhost',
  'local.host',
  'test.co.id',
  'testing.co.id',
  'contoh.com',
  'contoh.id',
  'percobaan.com',
  'ngasal.com',
]);

// Typo umum pada provider email besar
const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmaill.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaild.com': 'gmail.com',
  'gmailll.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmaile.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahou.com': 'yahoo.com',
  'ymail.co': 'ymail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'iclud.com': 'icloud.com',
  'icloude.com': 'icloud.com',
};

// Username yang terindikasi data asal / dummy
const BOGUS_USERNAMES = new Set([
  'test',
  'testing',
  'tester',
  'asdf',
  'asdfgh',
  'asdfasdf',
  'qwerty',
  'qwertyuiop',
  'zxcv',
  'zxcvbnm',
  '12345',
  '123456',
  '1234567',
  '11111',
  '00000',
  'aaaaa',
  'bbbbb',
  'contoh',
  'percobaan',
  'coba',
  'sample',
  'dummy',
  'noemail',
  'tidakada',
  'ngasal',
  'asal',
  'fake',
  'user',
  'admin',
]);

export interface EmailValidationResult {
  valid: boolean;
  reason?: string;
  suggestion?: string;
}

/**
 * Validasi sintaks, pola dummy, disposable provider, dan deteksi typo secara cepat (sinkron).
 */
export function validateEmailFormat(rawEmail: string): EmailValidationResult {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { valid: false, reason: 'Email wajib diisi' };
  }

  const email = rawEmail.trim().toLowerCase();

  if (email.length === 0) {
    return { valid: false, reason: 'Email tidak boleh kosong' };
  }

  if (email.length > 254) {
    return { valid: false, reason: 'Email terlalu panjang (maks. 254 karakter)' };
  }

  // Cek struktur umum email
  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Format email tidak valid (harus mengandung satu simbol @)' };
  }

  const [username, domain] = parts;

  if (!username || username.length < 2) {
    return { valid: false, reason: 'Nama akun email terlalu pendek (minimal 2 karakter)' };
  }

  if (username.length > 64) {
    return { valid: false, reason: 'Nama akun email terlalu panjang (maksimal 64 karakter)' };
  }

  if (!domain || domain.length < 3) {
    return { valid: false, reason: 'Domain email tidak valid' };
  }

  // Cek karakter illegal
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Email mengandung karakter yang tidak diizinkan' };
  }

  // Cek dot berulang
  if (username.includes('..') || domain.includes('..')) {
    return { valid: false, reason: 'Email tidak boleh memiliki titik berurutan (..)' };
  }

  // Cek TLD (top level domain)
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, reason: 'Domain email harus memiliki ekstensi (seperti .com, .co.id)' };
  }

  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { valid: false, reason: 'Ekstensi domain email tidak valid' };
  }

  // Cek saran typo domain
  if (COMMON_DOMAIN_TYPOS[domain]) {
    const suggestedDomain = COMMON_DOMAIN_TYPOS[domain];
    return {
      valid: false,
      reason: `Domain @${domain} terindikasi salah ketik. Maksud Anda @${suggestedDomain}?`,
      suggestion: `${username}@${suggestedDomain}`,
    };
  }

  // Cek domain palsu / testing
  if (BOGUS_DOMAINS.has(domain)) {
    return { valid: false, reason: 'Domain email uji coba / dummy tidak diizinkan' };
  }

  // Cek disposable email provider
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { valid: false, reason: 'Email sementara (disposable/temp-mail) tidak diizinkan. Mohon gunakan email aktif Anda' };
  }

  // Cek username dummy / asal
  if (BOGUS_USERNAMES.has(username)) {
    return { valid: false, reason: 'Nama akun email terindikasi data uji coba. Gunakan email aktif resmi Anda' };
  }

  // Cek username dengan karakter berulang terus-menerus (contoh: aaaaaa, 111111)
  if (/^(.)\1{4,}$/.test(username)) {
    return { valid: false, reason: 'Alamat email tidak valid (terdiri dari karakter berulang)' };
  }

  // Cek username berpola keyboard walk
  if (username === 'asdf' || username === 'qwerty' || username === '123456') {
    return { valid: false, reason: 'Alamat email terdeteksi data sembarangan' };
  }

  // Cek nama domain sebelum TLD minimal 2 karakter
  const mainDomain = domainParts[0];
  if (mainDomain.length < 2) {
    return { valid: false, reason: 'Nama domain email terlalu pendek' };
  }

  return { valid: true };
}

// In-memory cache hasil pengecekan MX record domain agar tidak memanggil DNS berulang kali
const domainMxCache = new Map<string, { hasMx: boolean; reason?: string; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 menit

/**
 * Memeriksa apakah domain memiliki MX Record atau Mail Server aktif via DNS-over-HTTPS (DoH).
 * Menggunakan Cloudflare Public DNS sebagai primary dan Google DNS sebagai fallback.
 */
export async function checkDomainMailExchange(domain: string): Promise<{ hasMx: boolean; reason?: string }> {
  const cleanDomain = domain.trim().toLowerCase();

  // Cek cache terlebih dahulu
  const cached = domainMxCache.get(cleanDomain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { hasMx: cached.hasMx, reason: cached.reason };
  }

  // Provider email besar terpercaya yang dijamin valid (bypasses network DNS check untuk kecepatan)
  const TRUSTED_PROVIDER_DOMAINS = new Set([
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'yahoo.co.id',
    'yahoo.co.uk',
    'ymail.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
    'icloud.com',
    'me.com',
    'mac.com',
    'aol.com',
    'proton.me',
    'protonmail.com',
    'zoho.com',
  ]);

  if (TRUSTED_PROVIDER_DOMAINS.has(cleanDomain)) {
    domainMxCache.set(cleanDomain, { hasMx: true, timestamp: Date.now() });
    return { hasMx: true };
  }

  // Query DNS-over-HTTPS
  const queryDoH = async (url: string): Promise<{ status: number; answers?: Array<{ type: number; data: string }> } | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/dns-json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  };

  try {
    // 1. Cloudflare DNS (Primary)
    let dnsRes = await queryDoH(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=MX`);

    // 2. Google DNS (Fallback) jika Cloudflare tidak merespons
    if (!dnsRes) {
      dnsRes = await queryDoH(`https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=MX`);
    }

    if (!dnsRes) {
      // Jika jaringan gagal melakukan lookup DNS (misal offline/timeout), jangan blokir jika domain tampak wajar
      return { hasMx: true };
    }

    // Status 3 = NXDOMAIN (Domain sama sekali tidak terdaftar di DNS dunia)
    if (dnsRes.status === 3) {
      const result = { hasMx: false, reason: `Domain "${cleanDomain}" tidak terdaftar di internet (NXDOMAIN).` };
      domainMxCache.set(cleanDomain, { ...result, timestamp: Date.now() });
      return result;
    }

    // Periksa isi Answer untuk Record MX (Type 15)
    const answers = dnsRes.answers || (dnsRes as any).Answer || [];
    const mxRecords = answers.filter((ans: any) => ans.type === 15);

    if (mxRecords.length > 0) {
      // Cek apakah memiliki Null MX ("0 ." sesuai RFC 7505) yang menandakan domain secara spesifik menolak email
      const isNullMx = mxRecords.some((rec: any) => rec.data && (rec.data.trim() === '0 .' || rec.data.trim() === '.'));
      if (isNullMx) {
        const result = { hasMx: false, reason: `Domain "${cleanDomain}" menolak penerimaan email (Null MX).` };
        domainMxCache.set(cleanDomain, { ...result, timestamp: Date.now() });
        return result;
      }

      domainMxCache.set(cleanDomain, { hasMx: true, timestamp: Date.now() });
      return { hasMx: true };
    }

    // Jika tidak ada record MX, periksa apakah domain setidaknya memiliki A Record (fallback RFC)
    let aRes = await queryDoH(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=A`);
    if (!aRes) {
      aRes = await queryDoH(`https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=A`);
    }

    const aAnswers = aRes?.answers || (aRes as any)?.Answer || [];
    const hasARecord = aAnswers.some((ans: any) => ans.type === 1);

    if (!hasARecord) {
      const result = { hasMx: false, reason: `Domain "${cleanDomain}" tidak memiliki Mail Server (MX) maupun server web.` };
      domainMxCache.set(cleanDomain, { ...result, timestamp: Date.now() });
      return result;
    }

    domainMxCache.set(cleanDomain, { hasMx: true, timestamp: Date.now() });
    return { hasMx: true };
  } catch (err) {
    console.warn('[EmailValidator] Gagal memeriksa DNS MX:', err);
    // Fail-open jika jaringan lokal memiliki batasan agar tidak menghambat user valid
    return { hasMx: true };
  }
}

/**
 * Pengecekan menyeluruh (Format + Eksistensi Domain MX) sebelum mengirim via EmailJS.
 */
export async function verifyEmailDeliverability(email: string): Promise<EmailValidationResult> {
  // 1. Validasi Sintaks & Aturan Dummy
  const formatResult = validateEmailFormat(email);
  if (!formatResult.valid) {
    return formatResult;
  }

  // 2. Validasi Domain DNS MX
  const [, domain] = email.trim().toLowerCase().split('@');
  const mxResult = await checkDomainMailExchange(domain);
  if (!mxResult.hasMx) {
    return {
      valid: false,
      reason: mxResult.reason || `Domain ${domain} tidak dapat menerima email`,
    };
  }

  return { valid: true };
}
