import React from 'react';
import { Lightbulb, X } from 'lucide-react';
import { Chapter } from './ebook-types';
import { toRoman } from './utils-helper';
import { renderFormattedText } from './text-formatter';
import { Modal } from '../../components/ui/Modal';

interface ModalChapterSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
}

export function ModalChapterSummary({ isOpen, onClose, chapter }: ModalChapterSummaryProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      contentClassName="sm:max-w-lg"
    >
      {/* Header Modal */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
            <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-300/30" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-normal text-slate-500 block leading-tight">
              Ringkasan
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate mt-0.5">
              BAB {toRoman(chapter.number)} {chapter.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          title="Tutup"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Modal */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs max-h-[75vh]">
        {/* SECTION 1: TUJUAN MODUL */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-900">
            Tujuan &amp; Fokus Utama Modul
          </div>

          <p className="text-slate-600 leading-relaxed font-medium">
            {renderFormattedText(chapter.subtitle || '')}
          </p>
        </div>

        {/* SECTION 2: RINGKASAN BAB */}
        <div className="space-y-3 pt-1">
          <div className="text-xs font-bold text-slate-900">
            Ringkasan Eksekutif Bab
          </div>

          <div className="text-slate-700 leading-relaxed text-justify">
            {renderFormattedText(chapter.summary)}
          </div>

          {/* Sub-pokok Pembahasan */}
          {chapter.subsections && chapter.subsections.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Poin-Poin Pembahasan ({chapter.subsections.length} Sub-bab):
              </div>
              <div className="space-y-3">
                {chapter.subsections.map((sub, idx) => (
                  <div key={sub.id || idx} className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 text-xs shrink-0 select-none">
                      {chapter.number}.{idx + 1}
                    </span>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-xs">
                        {sub.title}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed text-justify">
                        {renderFormattedText(sub.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
