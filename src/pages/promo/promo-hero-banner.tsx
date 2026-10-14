import React from 'react';
import { Flame, Percent, CheckCircle2 } from 'lucide-react';

export function PromoHeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold tracking-wide">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>FLASH PROMO SPESIAL PERIODE TERBATAS</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Percent className="w-3 h-3" />
            <span>DISKON HINGGA 57%</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
          Solusi Terpadu Payroll, HRIS & Rekrutmen Lengkap dengan Modul Panduan & Pelatihan Intensif
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Bukan sekadar aplikasi web, kami menyediakan <strong className="text-white">Modul Panduan Lengkap SOP HR</strong> dan <strong className="text-white">Pelatihan Intensif Online</strong> agar tim Anda langsung siap pakai tanpa kendala teknis.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>14 Modul Komplit All-in-One</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Termasuk Modul Panduan & Pelatihan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Server Skalabilitas Cloud & On-Premise</span>
          </div>
        </div>
      </div>
    </div>
  );
}
