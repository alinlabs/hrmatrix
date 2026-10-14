import React, { useMemo } from 'react';
import { ArrowUpRight, Edit2, Percent, Gift, ShieldCheck, Calculator, Tag } from 'lucide-react';
import { CardKompensasiItemProps } from './types';
import { 
  formatRuleValue, 
  getRuleCategoryGroup 
} from './utils-helper';

export const CardKompensasiItem: React.FC<CardKompensasiItemProps> = ({
  rule,
  onOpenDetail,
  onEdit
}) => {
  const { label: groupLabel, type: groupType } = getRuleCategoryGroup(rule);

  const rawVersion = rule.version || '1.0';
  const versionText = rawVersion.toLowerCase().startsWith('v') ? rawVersion.toLowerCase() : `v${rawVersion}`;
  const formattedValue = formatRuleValue(rule);

  const ruleName = (rule.nama || rule.name || '').trim();
  const nameLower = ruleName.toLowerCase();

  // Identifikasi berdasarkan nama (bukan kategori):
  // 1. Jika pada namanya "Komisi ...." atau "Insentif ...." -> Insentif (Icon: Percent, Color: Red)
  const isInsentif = nameLower.includes('komisi') || nameLower.includes('insentif');

  // 2. Jika kata "Bonus ...." atau "Reward ...." -> Bonus (Icon: Gift Box, Color: Purple)
  const isBonus = !isInsentif && (nameLower.includes('bonus') || nameLower.includes('reward'));

  // 3. Jaminan Sosial / BPJS
  const isBPJS = !isInsentif && !isBonus && (
    rule.category === 'BPJS Health' || 
    rule.category === 'BPJS Employment' || 
    rule.category === 'BPJS' || 
    nameLower.includes('bpjs')
  );

  // 4. Pajak
  const isTax = !isInsentif && !isBonus && !isBPJS && (
    rule.category === 'Tax' || 
    nameLower.includes('pph') || 
    nameLower.includes('pajak')
  );

  const isAllowance = rule.category === 'Allowance';
  const originText = rule.origin || (isBPJS ? 'Regulasi Pemerintah' : isAllowance ? 'Peraturan Perusahaan' : 'Kementerian Keuangan');

  // Subtitle yang selaras dengan identifikasi nama
  const subtitleText = isInsentif ? 'Insentif & Komisi' : isBonus ? 'Bonus & Reward' : groupLabel;

  // Icon configuration per type
  const themeConfig = useMemo(() => {
    if (isInsentif) {
      return {
        iconColor: 'text-red-600',
        Icon: Percent
      };
    }
    if (isBonus) {
      return {
        iconColor: 'text-purple-600',
        Icon: Gift
      };
    }
    if (isBPJS) {
      return {
        iconColor: 'text-emerald-600',
        Icon: ShieldCheck
      };
    }
    if (isTax) {
      return {
        iconColor: 'text-blue-700',
        Icon: Calculator
      };
    }
    // Default: Tunjangan
    return {
      iconColor: 'text-blue-600',
      Icon: Tag
    };
  }, [isInsentif, isBonus, isBPJS, isTax]);

  const IconComp = themeConfig.Icon;

  return (
    <div
      onClick={() => onOpenDetail(rule)}
      className="group relative overflow-hidden rounded-2xl p-4 bg-white text-slate-900 cursor-pointer select-none shadow-2xs hover:shadow-md transition-all duration-200 border border-slate-200/90 hover:border-blue-400/90 flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Icon, Title, Subtitle, Arrow & Actions */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Pembungkus icon / logo: background slate lembut dengan outline minimalis */}
            <div className="p-2 rounded-xl shrink-0 bg-slate-50 border border-slate-100 shadow-2xs flex items-center justify-center transition-transform duration-200 group-hover:scale-105 w-[38px] h-[38px]">
              {groupType === 'bpjs_kesehatan' ? (
                <img src="/gambar/logo/logo-bpjs-kesehatan.webp" alt="BPJS Kesehatan" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
              ) : groupType === 'bpjs_ketenagakerjaan' ? (
                <img src="/gambar/logo/logo-bpjs-ketenagakerjaan.webp" alt="BPJS Ketenagakerjaan" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
              ) : groupType === 'pajak' ? (
                <img src="/gambar/logo/logo-djp.webp" alt="Pajak" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <IconComp className={`w-4 h-4 stroke-[2.4] ${themeConfig.iconColor}`} />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 tracking-tight truncate transition-colors">
                {rule.nama || rule.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                {subtitleText}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(rule);
              }}
              title="Edit Kompensasi"
              className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all stroke-[2]" />
          </div>
        </div>

        {/* Parameter Details Container */}
        {rule.kategori && !isBPJS && !isTax ? (
          <div className="space-y-1.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-100 text-[11px]">
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-medium">Frekuensi:</span>
              <span className="capitalize font-semibold text-slate-800">{rule.frekuensi_pembayaran || 'Bulanan'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-medium">Metode:</span>
              <span className="capitalize font-semibold text-slate-800">{rule.metode_perhitungan?.replace(/_/g, ' ') || 'Nominal Tetap'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-medium">Nilai / Formula:</span>
              <span className="font-bold text-blue-700">{formattedValue}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-100 text-[11px]">
            <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed font-normal">
              {rule.description || (isBPJS ? 'Program jaminan sosial ketenagakerjaan/kesehatan nasional.' : 'Regulasi kompensasi & kepatuhan pajak.')}
            </p>
          </div>
        )}

        {/* Legal Origin Reference & Version Aligned Bottom Right */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-2.5 pt-1 border-t border-slate-100">
          <span className="truncate max-w-[70%] text-slate-500" title={originText}>
            {originText}
          </span>
          <span className="shrink-0 font-mono text-slate-500 font-semibold px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">
            {versionText}
          </span>
        </div>
      </div>
    </div>
  );
};

