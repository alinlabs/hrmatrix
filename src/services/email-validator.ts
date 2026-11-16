export interface EmailValidationResult {
  valid: boolean;
  reason?: string;
  error?: string;
  suggestion?: string;
}

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
};

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
]);

export function validateEmailFormat(email: string): EmailValidationResult {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { valid: false, reason: 'Alamat email wajib diisi.', error: 'Alamat email wajib diisi.' };
  }

  if (/\s/.test(trimmed)) {
    return { valid: false, reason: 'Alamat email tidak boleh mengandung spasi.', error: 'Alamat email tidak boleh mengandung spasi.' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      reason: 'Format email tidak valid (contoh: nama@perusahaan.co.id).',
      error: 'Format email tidak valid.',
    };
  }

  const [, domain = ''] = trimmed.split('@');
  const lowerDomain = domain.toLowerCase();

  if (COMMON_DOMAIN_TYPOS[lowerDomain]) {
    const fixed = trimmed.replace(new RegExp(`${lowerDomain}$`, 'i'), COMMON_DOMAIN_TYPOS[lowerDomain]);
    return {
      valid: true,
      suggestion: fixed,
    };
  }

  if (DISPOSABLE_DOMAINS.has(lowerDomain)) {
    return {
      valid: false,
      reason: 'Gunakan email aktif permanen atau email resmi perusahaan.',
      error: 'Domain email sementara tidak diperbolehkan.',
    };
  }

  return { valid: true };
}
