import React from 'react';
import { 
  GraduationCap, 
  Video, 
  BadgeCheck, 
  CheckCircle2, 
  Building2, 
  Check, 
  MessageCircle 
} from 'lucide-react';
import { WHATSAPP_ONSITE_URL, PROMO_TRAINING_CARDS } from './utils-helper';
import { cn } from '../../utils/cn';

interface PromoTrainingSectionProps {
  isModal?: boolean;
}

export function PromoTrainingSection({ isModal = false }: PromoTrainingSectionProps) {
  const onlineCard = PROMO_TRAINING_CARDS[0];
  const onsiteCard = PROMO_TRAINING_CARDS[1];

  return (
    <div className={cn("bg-white space-y-6", isModal ? "p-0" : "rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs")}>
      {!isModal && (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Layanan Onboarding & Edukasi Praktis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Modul Panduan Lengkap & Pendampingan Pelatihan Hingga Mahir
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            Kami memastikan tim HR, Finance, dan manajemen perusahaan Anda tidak merasa bingung. Setiap paket telah dilengkapi kurikulum terstruktur serta opsi pendampingan tatap muka langsung di kantor Anda.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        
        {/* Card A: Pelatihan Online Intensif (GRATIS & TERMASUK) */}
        {onlineCard && (
          <div className="p-6 rounded-2xl bg-linear-to-b from-blue-50/50 to-white border border-blue-200/90 flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-200">
                  {onlineCard.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {onlineCard.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {onlineCard.description}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-1">
                {onlineCard.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>{pt.bold}</strong> {pt.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-blue-100">
              <div className="text-[11px] text-blue-800 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{onlineCard.footerNote}</span>
              </div>
            </div>
          </div>
        )}

        {/* Card B: Pelatihan Tatap Muka Langsung / On-Site (ADD-ON OPSIONAL) */}
        {onsiteCard && (
          <div className="p-6 rounded-2xl bg-linear-to-b from-slate-900 to-indigo-950 text-white border border-slate-800 flex flex-col justify-between space-y-4 shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                  {onsiteCard.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">
                  {onsiteCard.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {onsiteCard.description}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 pt-1">
                {onsiteCard.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>{pt.bold}</strong> {pt.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                {onsiteCard.footerNote}
              </div>
              <a
                href={WHATSAPP_ONSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{onsiteCard.actionLabel || 'Konsultasi On-Site'}</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PromoTrainingSection;
