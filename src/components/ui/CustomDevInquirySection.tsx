/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, MessageCircle, ArrowUpRight, Sliders, Database, Cpu } from 'lucide-react';

interface CustomDevInquirySectionProps {
  className?: string;
}

export function CustomDevInquirySection({ className = '' }: CustomDevInquirySectionProps) {
  const emailTarget = 'hrmatrix.id@gmail.com';
  const emailSubject = encodeURIComponent('Konsultasi Kustomisasi Aplikasi HRMatrix Khusus Perusahaan');
  const emailBody = encodeURIComponent(
    'Halo Tim Pengembang HRMatrix,\n\nSaya ingin berkonsultasi mengenai penyesuaian/kustomisasi fitur HRMatrix untuk kebutuhan spesifik perusahaan kami:\n\n- Nama Perusahaan:\n- Kebutuhan Kustomisasi:\n- Estimasi Karyawan:\n\nTerima kasih.'
  );

  const waNumber = '625797184059';
  const waMessage = encodeURIComponent(
    'Halo Developer HRMatrix, saya ingin berdiskusi mengenai kustomisasi fitur & integrasi aplikasi untuk kebutuhan khusus perusahaan kami.'
  );

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm ${className}`}
      id="custom-dev-inquiry-card"
    >
      <div className="space-y-4">
        {/* Title & Description (Tanpa Badge) */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Butuh Kustomisasi Aplikasi HR Khusus Perusahaan Anda?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kami dapat membantu menyesuaikan fitur, alur kerja penggajian, koneksi absensi, maupun integrasi database sesuai standar operasional perusahaan Anda.
          </p>
        </div>

        {/* Feature Highlights Grid - Simple & Clean */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <Sliders className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-900">Aturan Payroll Khusus</div>
              <div className="text-[11px] text-slate-500">Skema tunjangan, lembur, &amp; potongan fleksibel</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-900">Integrasi Server &amp; DB</div>
              <div className="text-[11px] text-slate-500">Sinkronisasi Cloud SQL, REST API, &amp; intranet</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-900">Integrasi Mesin Absensi</div>
              <div className="text-[11px] text-slate-500">Data fingerprint, RFID, atau portal internal</div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Clean & Simple */}
        <div className="pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Tombol Email */}
            <a
              href={`mailto:${emailTarget}?subject=${emailSubject}&body=${emailBody}`}
              className="group bg-slate-50 hover:bg-blue-50/60 active:bg-blue-100/50 border border-slate-200 hover:border-blue-300 rounded-xl p-3 sm:p-3.5 transition-all flex items-center justify-between cursor-pointer select-none"
              id="settings-custom-email-btn"
              title="Kirim email konsultasi kustomisasi"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Konsultasi Email
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {emailTarget}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            </a>

            {/* Tombol WhatsApp */}
            <a
              href={`https://wa.me/${waNumber}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 hover:bg-emerald-50/60 active:bg-emerald-100/50 border border-slate-200 hover:border-emerald-300 rounded-xl p-3 sm:p-3.5 transition-all flex items-center justify-between cursor-pointer select-none"
              id="settings-custom-whatsapp-btn"
              title="Chat WhatsApp langsung dengan developer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Diskusi WhatsApp
                  </div>
                  <div className="text-[11px] text-slate-500">
                    +62 857-9718-4059
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

