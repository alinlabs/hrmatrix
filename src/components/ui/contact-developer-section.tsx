/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

interface ContactDeveloperSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export function ContactDeveloperSection({
  className = '',
  title = 'Hubungi',
  subtitle = 'Memerlukan bantuan teknis, konsultasi implementasi, atau pertanyaan seputar aplikasi? Hubungi langsung pengembang kami:'
}: ContactDeveloperSectionProps) {
  const emailTarget = 'hrmatrix.id@gmail.com';
  const waCleanNumber = '625797184059';
  const waMessage = encodeURIComponent('Halo Developer HRMatrix, saya ingin berkonsultasi seputar aplikasi.');

  return (
    <div className={`space-y-3 ${className}`} id="contact-developer-section">
      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <span>{title}</span>
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* 2 Card Tombol Langsung dalam Satu Baris (Email | WhatsApp) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Card Tombol 1: Email (Klik langsung buka aplikasi Gmail / Mail client) */}
        <a
          href={`mailto:${emailTarget}?subject=Konsultasi%20Aplikasi%20HRMatrix`}
          className="group relative bg-white hover:bg-blue-50/40 active:bg-blue-100/50 rounded-2xl p-4 border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between cursor-pointer select-none"
          id="contact-dev-email-btn"
          title="Klik langsung untuk membuka aplikasi Email / Gmail"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-100/80 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Email
            </div>
            <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
              Buka aplikasi Gmail / Mail
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-semibold text-blue-600 group-hover:text-blue-700">
            <span>Kirim Pesan</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Resmi
            </span>
          </div>
        </a>

        {/* Card Tombol 2: WhatsApp (Klik langsung meluncur ke aplikasi WhatsApp) */}
        <a
          href={`https://wa.me/${waCleanNumber}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-white hover:bg-emerald-50/40 active:bg-emerald-100/50 rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between cursor-pointer select-none"
          id="contact-dev-whatsapp-btn"
          title="Klik langsung untuk membuka aplikasi WhatsApp"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-emerald-100/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              WhatsApp
            </div>
            <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
              Chat instan langsung
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
            <span>Mulai Chat</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Cepat
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
