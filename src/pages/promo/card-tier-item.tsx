import React from 'react';
import { 
  ArrowRight 
} from 'lucide-react';
import { BillingMode, CompanySizeTier, TierData } from './types';
import { formatRupiah, TIER_CARD_TEXTS } from './utils-helper';

interface CardTierItemProps {
  key?: React.Key;
  tierKey: CompanySizeTier;
  tierData: TierData;
  isSelected: boolean;
  billingMode: BillingMode;
  onSelectTier: () => void;
  onClaimPromo: () => void;
  onOpenDetails?: () => void;
}

export function CardTierItem({
  tierKey,
  tierData,
  isSelected,
  billingMode,
  onSelectTier,
  onClaimPromo,
  onOpenDetails
}: CardTierItemProps) {
  const isStartup = tierKey === 'startup';
  const isGrowth = tierKey === 'growth';
  const isEnterprise = tierKey === 'enterprise';

  const texts = TIER_CARD_TEXTS[tierKey];

  // Border & selection styles
  let containerStyle = 'relative rounded-3xl bg-white p-6 sm:p-7 border flex flex-col justify-between transition-all cursor-pointer h-full ';
  if (billingMode === 'agent') {
    if (isGrowth) {
      containerStyle += isSelected
        ? 'border-violet-600 ring-2 ring-violet-600/30 shadow-xl'
        : 'border-violet-300 shadow-sm hover:shadow-md';
    } else {
      containerStyle += isSelected
        ? 'border-violet-500 ring-2 ring-violet-500/20 shadow-lg'
        : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs';
    }
  } else if (isStartup) {
    containerStyle += isSelected
      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
      : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs';
  } else if (isGrowth) {
    containerStyle += isSelected
      ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-xl'
      : 'border-blue-300 shadow-sm hover:shadow-md';
  } else {
    containerStyle += isSelected
      ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-lg'
      : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs';
  }

  // Primary action button styles
  let buttonStyle = 'w-full py-2.5 px-4 rounded-xl font-medium text-xs transition-colors flex items-center justify-center text-center gap-2 cursor-pointer ';
  if (billingMode === 'agent') {
    if (isGrowth) {
      buttonStyle = 'w-full py-2.5 sm:py-3 px-4 bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-violet-500/20 transition-all flex items-center justify-center text-center gap-2 cursor-pointer';
    } else {
      buttonStyle += 'bg-linear-to-r from-violet-900 to-indigo-900 hover:from-violet-800 hover:to-indigo-800 text-white font-semibold';
    }
  } else if (isStartup) {
    buttonStyle += 'bg-slate-900 hover:bg-slate-800 text-white font-semibold';
  } else if (isGrowth) {
    buttonStyle = 'w-full py-2.5 sm:py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center text-center gap-2 cursor-pointer';
  } else {
    buttonStyle += 'bg-indigo-950 hover:bg-indigo-900 text-white font-semibold';
  }

  const title = billingMode === 'agent' ? texts.agentName : texts.regularName;
  const badgeText = billingMode === 'agent' ? texts.agentBadge : texts.regularBadge;
  const descriptionText = billingMode === 'agent' ? texts.agentDescription : texts.regularDescription;
  const claimButtonLabel = texts.claimButtons[billingMode];

  const getPriceDisplay = () => {
    if (billingMode === 'agent') {
      return {
        normal: `${formatRupiah(tierData.agent.normalPricePerMonth)}/bln`,
        discount: `HEMAT ${tierData.agent.discountPercent}`,
        discountClass: 'text-white bg-linear-to-r from-violet-600 to-blue-600 border border-violet-500 font-black',
        price: formatRupiah(tierData.agent.promoPricePerMonth),
        priceColor: isGrowth ? 'text-violet-700' : 'text-slate-900',
        suffix: '/bulan'
      };
    }
    if (billingMode === 'trial') {
      return {
        normal: `${formatRupiah(tierData.trial.normalPricePerMonth)}/bln`,
        discount: `HEMAT ${tierData.trial.discountPercent}`,
        discountClass: 'text-black bg-yellow-400 border border-yellow-400 font-black',
        price: formatRupiah(tierData.trial.promoPricePerMonth),
        priceColor: isGrowth ? 'text-blue-600' : 'text-slate-900',
        suffix: '/bulan'
      };
    }
    if (billingMode === 'annual') {
      return {
        normal: `${formatRupiah(tierData.annual.normalPricePerMonth)}/bln`,
        discount: `HEMAT ${tierData.annual.discountPercent}`,
        discountClass: 'text-white bg-red-600 border border-red-600 font-black',
        price: formatRupiah(tierData.annual.promoPricePerMonth),
        priceColor: isGrowth ? 'text-blue-600' : 'text-slate-900',
        suffix: '/bulan'
      };
    }
    return {
      normal: formatRupiah(tierData.whitelabel.normalPrice),
      discount: `HEMAT ${tierData.whitelabel.discountPercent}`,
      discountClass: 'text-white bg-blue-600 border border-blue-600 font-black',
      price: formatRupiah(tierData.whitelabel.promoPrice),
      priceColor: 'text-indigo-950',
      suffix: ''
    };
  };

  const priceInfo = getPriceDisplay();

  return (
    <div onClick={onSelectTier} className={containerStyle}>
      {/* Popular Badge */}
      {isGrowth && (
        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-white font-black text-[11px] tracking-wider rounded-full shadow-sm ${
          billingMode === 'agent' 
            ? 'bg-linear-to-r from-violet-600 to-blue-600' 
            : 'bg-linear-to-r from-blue-600 to-indigo-600'
        }`}>
          Paling populer
        </div>
      )}

      <div className={`space-y-4 ${isGrowth ? 'pt-1' : ''}`}>
        {/* Top Text (Tanpa Badge) */}
        <div className="flex items-center justify-between text-xs">
          <span className={`font-bold uppercase tracking-wider ${
            billingMode === 'agent'
              ? 'text-violet-700'
              : isGrowth 
              ? 'text-blue-600'
              : isEnterprise
              ? 'text-indigo-600'
              : 'text-slate-500'
          }`}>
            {badgeText}
          </span>
          <span className="font-extrabold text-slate-700">
            {texts.karyawan}
          </span>
        </div>

        {/* Title and Short Description */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {descriptionText}
          </p>
        </div>

        {/* 4 Unsur Matriks: Langsung teks tanpa card, tanpa badge, tanpa deskripsi, dan tanpa garis */}
        <div className="pt-3 pb-3 border-y border-slate-100/90">
          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2.5 text-left">
            {/* Kolom 1 Baris 1: X Modul Inti */}
            <div className="text-xs font-extrabold text-slate-800 tracking-tight">
              {tierData.classifiedDetails.modulDanEPortal.modulesCount} Modul Inti
            </div>

            {/* Kolom 2 Baris 1: X Fitur Exclusive */}
            <div className="text-xs font-extrabold text-slate-800 tracking-tight">
              {tierData.classifiedDetails.fiturExclusive.length} Fitur Exclusive
            </div>

            {/* Kolom 1 Baris 2: X ePortal ID */}
            <div className="text-xs font-extrabold text-slate-800 tracking-tight">
              {tierData.classifiedDetails.modulDanEPortal.eportalsCount} ePortal ID
            </div>

            {/* Kolom 2 Baris 2: X Layanan & Bantuan */}
            <div className="text-xs font-extrabold text-slate-800 tracking-tight">
              {tierData.classifiedDetails.layananDanBantuan.length} Layanan & Bantuan
            </div>
          </div>
        </div>

        {/* Price Display: Berada di bawah 4 info modul/layanan dan di atas tombol klaim promo */}
        <div className="pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
              {priceInfo.normal}
            </span>
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${priceInfo.discountClass}`}>
              {priceInfo.discount}
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-3xl font-black tracking-tight ${priceInfo.priceColor}`}>
              {priceInfo.price}
            </span>
            {priceInfo.suffix && (
              <span className="text-xs font-medium text-slate-500">{priceInfo.suffix}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button: Klaim Promo */}
      <div className="pt-4 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClaimPromo();
          }}
          className={buttonStyle}
        >
          <span>{claimButtonLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CardTierItem;
