import React, { useState } from 'react';
import { 
  X, 
  FileText,
  Copy,
  Check,
  Camera,
  ChevronDown
} from 'lucide-react';
import { 
  PagePromptItem, 
  AspectRatioType, 
  ASPECT_RATIO_OPTIONS, 
  generateFormattedPrompt 
} from './prompt-data';
import { Modal } from '../../components/ui/Modal';

interface PromptModalProps {
  item: PagePromptItem | null;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ item, onClose }) => {
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('4:5');
  const [copied, setCopied] = useState(false);

  const promptText = item 
    ? generateFormattedPrompt(item, language, aspectRatio)
    : '';

  const handleCopy = async () => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = promptText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={Boolean(item)}
      onClose={onClose}
      contentClassName="sm:max-w-2xl flex flex-col"
    >
      {item && (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
          {/* 1. Modal Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  {item.namaHalaman}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  {item.kategori}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0 text-xs">
            {/* Input Options (Bahasa & Ukuran) */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              {/* Bahasa Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Bahasa Prompt</label>
                <div className="relative group">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3.5 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English (Midjourney / Flux)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-slate-600 transition-colors" />
                </div>
              </div>

              {/* Ukuran Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Aspek Rasio (Ukuran)</label>
                <div className="relative group">
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatioType)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3.5 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                  >
                    {ASPECT_RATIO_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.badge} — {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            </div>

            {/* Rekomendasi Screenshot */}
            {item.rekomendasiScreenshot && item.rekomendasiScreenshot.length > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 mt-4">
                <div className="text-xs font-bold text-slate-800 mb-1.5">Panduan Screenshot Referensi</div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.rekomendasiScreenshot.join(', ')}
                </p>
              </div>
            )}

            {/* Prompt Box */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 mt-4 flex flex-col">
              <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  Teks Prompt Siap Pakai
                </span>
              </div>
              <textarea
                readOnly
                value={promptText}
                rows={11}
                className="w-full bg-slate-50 p-3 text-xs text-slate-800 font-mono leading-relaxed resize-none focus:outline-none select-all border-none"
              />
            </div>
          </div>

          {/* 3. Modal Footer */}
          <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Prompt Berhasil Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Prompt Poster</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
