/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, ShieldCheck, Wifi, Check } from 'lucide-react';

interface BtnDonationCardProps {
  className?: string;
}

export function BtnDonationCard({ className = '' }: BtnDonationCardProps) {
  const [copied, setCopied] = useState(false);

  const accountNumber = '3601610019430';
  const formattedAccountNumber = '3601  6100  1943  0';

  const handleCopy = () => {
    navigator.clipboard?.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2200);
  };

  return (
    <div className={`space-y-3.5 ${className}`} id="btn-donation-section">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-amber-50 text-amber-700">
            <Heart className="w-4 h-4 fill-amber-500 text-amber-600" />
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Apresiasi &amp; Dukungan Pengembangan
          </h3>
        </div>
        <p className="text-xs text-slate-500 font-normal leading-relaxed text-justify">
          HRMatrix didedikasikan secara mandiri tanpa biaya langganan server bulanan. Jika aplikasi ini membantu kelancaran operasional dan perhitungan HR Anda, dukungan sukarela Anda sangat berharga untuk kelanjutan riset, kepatuhan regulasi pajak terbaru, dan pembaruan fitur.
        </p>
      </div>

      {/* Kartu Fisik BTN */}
      <div className="relative mx-auto w-full max-w-md">
        <div
          onClick={handleCopy}
          className="relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden shadow-xl border border-amber-400/40 text-white select-none transition-transform hover:scale-[1.01] cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #041B44 0%, #0A3273 38%, #144996 60%, #9E7419 88%, #D4AF37 100%)'
          }}
          id="btn-atm-card"
          title="Klik untuk salin nomor rekening"
        >
          {/* Aksen Tekstur Halus Kartu Bank (Security Pattern Wave Overlay) */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,223,128,0.4) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(13,71,161,0.5) 0%, transparent 60%)'
            }}
          />
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

          {/* Baris Atas: Logo BTN & Fitur Contactless */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="font-extrabold tracking-wider text-lg sm:text-xl text-white drop-shadow-sm flex items-center gap-1.5">
                <span className="bg-amber-400/90 text-[#041B44] px-1.5 py-0.5 rounded text-[11px] font-black tracking-normal">
                  BANK
                </span>
                <span className="text-amber-300 font-black tracking-widest">BTN</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Indikator Contactless / Wi-Fi wave */}
              <Wifi className="w-5 h-5 text-amber-200/80 rotate-90" />
              <span className="text-[10px] font-bold tracking-widest text-amber-300/90 border border-amber-400/50 px-2 py-0.5 rounded-md bg-black/20">
                DEBIT
              </span>
            </div>
          </div>

          {/* Baris Tengah: Chip Kartu EMV & Aksara Hologram */}
          <div className="relative z-10 my-4 sm:my-5 flex items-center justify-between">
            {/* Chip EMV Warna Gold Emas Asli */}
            <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 p-[1.5px] shadow-md border border-amber-200/70 relative overflow-hidden">
              <div className="w-full h-full rounded-[6px] border border-amber-600/40 grid grid-cols-2 gap-1 p-0.5 bg-amber-300/30">
                <div className="border-r border-b border-amber-600/40 rounded-tl-sm" />
                <div className="border-b border-amber-600/40 rounded-tr-sm" />
                <div className="border-r border-amber-600/40 rounded-bl-sm" />
                <div className="rounded-br-sm" />
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-amber-200/80 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Rekening Donasi Resmi</span>
            </div>
          </div>

          {/* Baris Nomor Rekening */}
          <div className="relative z-10 space-y-1">
            <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-amber-200/80 uppercase">
              Nomor Rekening Bank
            </div>
            <div className="text-base sm:text-xl font-mono font-bold tracking-[0.16em] text-white drop-shadow-md">
              {formattedAccountNumber}
            </div>
          </div>

          {/* Baris Bawah: Bank Penerima Saja */}
          <div className="relative z-10 mt-4 sm:mt-5 pt-3 border-t border-white/15 text-left">
            <div>
              <div className="text-[9px] font-medium tracking-wider text-amber-200/70 uppercase">
                Bank Penerima
              </div>
              <div className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                Bank Tabungan Negara
              </div>
            </div>
          </div>
        </div>

        {/* Teks Petunjuk Kecil & Tipis di Bawah Kartu */}
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-light text-slate-500 hover:text-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-normal">Nomor rekening berhasil tersalin!</span>
              </>
            ) : (
              <span>Klik untuk salin nomor rekening</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
