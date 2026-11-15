/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import emailjs from '@emailjs/browser';
import { verifyEmailDeliverability } from './emailValidator';

const EMAILJS_PUBLIC_KEY = '7Mx_vVROZnHY63IJJ';
const EMAILJS_SERVICE_ID = 'work-mail';
const EMAILJS_TEMPLATE_ID = 'auto-regist';

// Cache untuk mendeduplikasi pengiriman ke email yang sama dalam waktu singkat (15 menit)
const sentEmailsCache = new Map<string, number>();
const RECENT_SEND_COOLDOWN_MS = 15 * 60 * 1000;

export interface RegistrationEmailParams {
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: string;
  companyName: string;
  companyEmail: string;
  legalEntity: string;
  industry: string;
  employeeCount: string;
  registrationDate?: string;
}

/**
 * Mengirimkan otomatis email konfirmasi pendaftaran menggunakan EmailJS
 * dengan mekanisme Quota Guard intensif (validasi sintaks, filter dummy/disposable,
 * dan pengecekan live DNS MX Record domain).
 */
export async function sendRegistrationAutoEmails(data: RegistrationEmailParams): Promise<boolean> {
  const formattedDate = data.registrationDate || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const baseParams = {
    user_name: data.userName,
    user_email: data.userEmail,
    user_phone: data.userPhone || '-',
    user_role: data.userRole || '-',
    company_name: data.companyName,
    company_email: data.companyEmail,
    legal_entity: data.legalEntity || '-',
    industry: data.industry || '-',
    employee_count: data.employeeCount || '-',
    registration_date: formattedDate,
  };

  // Kumpulkan alamat email unik
  const candidateEmails = new Set<string>();
  if (data.userEmail && data.userEmail.trim()) {
    candidateEmails.add(data.userEmail.trim().toLowerCase());
  }
  if (data.companyEmail && data.companyEmail.trim()) {
    candidateEmails.add(data.companyEmail.trim().toLowerCase());
  }

  if (candidateEmails.size === 0) {
    console.info('[EmailJS Quota Guard] Tidak ada alamat email yang diberikan.');
    return false;
  }

  const now = Date.now();
  const validTargets: string[] = [];

  // Verifikasi setiap email dengan mekanisme intensif (sintaks, dummy blacklist, DNS MX)
  for (const email of Array.from(candidateEmails)) {
    // 1. Cek apakah email baru saja dikirimi dalam 15 menit terakhir (cegah pemborosan kuota berulang)
    const lastSent = sentEmailsCache.get(email);
    if (lastSent && now - lastSent < RECENT_SEND_COOLDOWN_MS) {
      console.info(`[EmailJS Quota Guard] Melewati ${email}: Email konfirmasi sudah pernah dikirimkan baru-baru ini.`);
      continue;
    }

    // 2. Verifikasi keterkiriman email secara ketat (sintaks + pola dummy/disposable + DNS MX)
    const check = await verifyEmailDeliverability(email);
    if (!check.valid) {
      console.warn(`[EmailJS Quota Guard] MEMBATALKAN pengiriman ke "${email}" demi menghemat kuota EmailJS: ${check.reason}`);
      continue;
    }

    validTargets.push(email);
  }

  // Jika semua email ternyata dummy/ngasal/tidak valid, tidak ada kuota EmailJS yang terpotong sama sekali!
  if (validTargets.length === 0) {
    console.info('[EmailJS Quota Guard] Seluruh email input tidak memenuhi kriteria penerima aktif. Pengiriman EmailJS dibatalkan.');
    return false;
  }

  let sendSuccess = false;

  for (const targetEmail of validTargets) {
    try {
      const templateParams = {
        ...baseParams,
        to_email: targetEmail,
        email: targetEmail,
        reply_to: 'hrmatrix.id@gmail.com',
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Catat waktu sukses pengiriman untuk perlindungan cooldown
      sentEmailsCache.set(targetEmail, Date.now());
      sendSuccess = true;
      console.info(`[EmailJS] Berhasil mengirimkan email konfirmasi ke ${targetEmail}`);
    } catch (err) {
      console.warn(`[EmailJS] Gagal mengirim email konfirmasi ke ${targetEmail}:`, err);
    }
  }

  return sendSuccess;
}
