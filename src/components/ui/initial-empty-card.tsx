import React from 'react';
import { Lottie } from 'lottie-react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface InitialEmptyCardProps {
  id?: string;
  title: string;
  description: string;
  buttonText: string;
  ButtonIcon: LucideIcon;
  onAction: () => void;
  animationData: object;
  trustNote?: string;
}

export const InitialEmptyCard: React.FC<InitialEmptyCardProps> = ({
  id = 'initial-empty-card',
  title,
  description,
  buttonText,
  ButtonIcon,
  onAction,
  animationData,
  trustNote = 'Proses cepat & praktis • Data tersimpan aman',
}) => {
  return (
    <div
      id={id}
      className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10 text-center transition-all duration-300 hover:border-slate-300"
    >
      {/* Soft Decorative Ambient Background */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Main Heading (Singkat & Hangat) */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h3>

        {/* Supporting Narrative (Singkat & To-The-Point) */}
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
          {description}
        </p>

        {/* Primary Call-To-Action Button */}
        <div className="mt-5 mb-2 flex justify-center">
          <button
            type="button"
            onClick={onAction}
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 cursor-pointer"
          >
            <ButtonIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>{buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 opacity-80" />
          </button>
        </div>

        {/* Lottie Animation Display (Tepat di Bawah Ajakan) */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto -mt-2 -mb-2 flex items-center justify-center">
          <Lottie
            src={animationData as any}
            loop={true}
            autoplay={true}
            className="w-full h-full drop-shadow-xs pointer-events-none select-none"
          />
        </div>

        {/* Trust Note Caption */}
        {trustNote && (
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            {trustNote}
          </p>
        )}
      </div>
    </div>
  );
};
