import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

interface PromoBottomCtaProps {
  whatsappUrl: string;
}

export function PromoBottomCta({ whatsappUrl }: PromoBottomCtaProps) {
  return (
    <div className="rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
      <div className="space-y-1 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-extrabold">Siap Modernisasi Sistem HR Perusahaan Anda?</h3>
        <p className="text-xs sm:text-sm text-blue-100">
          Dapatkan demo interaktif, modul panduan, invoice resmi harga promo, dan konsultasi kebutuhan server gratis.
        </p>
        <div className="text-[11px] text-blue-200/80 pt-1 flex items-center gap-2 justify-center sm:justify-start">
          <Mail className="w-3.5 h-3.5 text-blue-300" />
          <span>Email Resmi: <strong className="text-white">hrmatrix.id@gmail.com</strong></span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
        <a
          href="mailto:hrmatrix.id@gmail.com?subject=Permintaan%20Proposal%20Harga%20Promo%20HRMatrix"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>Kirim Email</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-slate-950" />
          <span>Klaim Promo via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
