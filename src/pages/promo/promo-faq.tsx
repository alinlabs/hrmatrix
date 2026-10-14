import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS_DATA } from './utils-helper';
import { cn } from '../../utils/cn';

interface PromoFaqProps {
  expandedFaq: number | null;
  onToggleFaq: (index: number) => void;
  isModal?: boolean;
}

export function PromoFaq({ expandedFaq, onToggleFaq, isModal = false }: PromoFaqProps) {
  return (
    <div className={cn("bg-white space-y-5", isModal ? "p-0" : "rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs")}>
      {!isModal && (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Tanya Jawab</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Pertanyaan yang Sering Diajukan</h2>
        </div>
      )}

      <div className="space-y-2.5 pt-2">
        {FAQS_DATA.map((faq, index) => {
          const isOpen = expandedFaq === index;
          return (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => onToggleFaq(index)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
