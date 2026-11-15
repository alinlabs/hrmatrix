import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { PTKP_DATA, PtkpItem } from '../../services/taxBpjsService';
import { useDropdownPlacement } from '../../utils/useDropdownPlacement';

interface PtkpCustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  isProgressive?: boolean;
  label?: string;
  helperText?: string;
}

export function PtkpCustomSelect({
  value,
  onChange,
  isProgressive = false,
  label = 'Status PTKP (Penghasilan Tidak Kena Pajak)',
  helperText
}: PtkpCustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { maxHeight, dropdownClasses } = useDropdownPlacement({
    isOpen,
    containerRef,
    defaultMaxHeight: 320,
  });

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const selectedPtkp = value ? PTKP_DATA.find(p => p.code === value) : undefined;

  const renderPtkpDetails = (item: PtkpItem, isSelected: boolean) => {
    const isIstriDigabung = item.code.startsWith('K/I');
    const maritalText = item.maritalStatus === 'Single' ? 'Tidak Kawin' : 'Kawin';

    return (
      <div className="flex-1 min-w-0 flex flex-col gap-1 text-xs leading-none">
        {isIstriDigabung ? (
          <>
            {/* Row 1: Kawin (Istri Bekerja/Digabung) */}
            <div className="flex items-center">
              <span className="w-3.5 text-center text-slate-300 shrink-0">•</span>
              <span className={`whitespace-normal ${isSelected ? 'font-medium text-blue-950' : 'font-normal text-slate-700'}`}>
                Kawin (Istri Bekerja/Digabung)
              </span>
            </div>
            {/* Row 2: Tanggungan */}
            <div className="flex items-center">
              <span className="w-3.5 text-center text-slate-300 shrink-0">•</span>
              <span className={isSelected ? 'font-medium text-blue-900' : 'font-normal text-slate-600'}>
                {item.dependents} Tanggungan
              </span>
            </div>
          </>
        ) : (
          /* Row 1: Status & Tanggungan */
          <div className="flex items-center">
            <span className="w-3.5 text-center text-slate-300 shrink-0">•</span>
            <span className={`whitespace-normal ${isSelected ? 'font-medium text-blue-950' : 'font-normal text-slate-700'}`}>
              {maritalText} • {item.dependents} Tanggungan
            </span>
          </div>
        )}

        {/* Row PTKP Nominal */}
        <div className="flex items-center">
          <span className="w-3.5 text-center text-slate-300 shrink-0">•</span>
          <span className={isSelected ? 'text-blue-900 font-normal' : 'text-slate-600 font-normal'}>
            PTKP <span className={`font-bold ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>Rp {item.ptkpAnnual.toLocaleString('id-ID')}/Tahun</span>
          </span>
        </div>
      </div>
    );
  };

  const getTerBadgeStyle = (category: string) => {
    switch (category) {
      case 'A':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'B':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'C':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-left box-border ${
          selectedPtkp ? 'min-h-[36px] py-1.5' : 'h-9 min-h-[36px]'
        } ${
          isOpen
            ? 'border-blue-500 ring-1 ring-blue-500/20'
            : 'hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        {selectedPtkp ? (
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {!isProgressive ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg border tracking-wide ${getTerBadgeStyle(
                    selectedPtkp.terCategory
                  )}`}
                >
                  TER {selectedPtkp.terCategory}
                </div>
                <div className="px-2 py-1 text-[11px] font-bold rounded-lg border bg-slate-100 text-slate-800 border-slate-200">
                  {selectedPtkp.code}
                </div>
              </div>
            ) : (
              <div className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-slate-100 text-slate-800 border-slate-200 shrink-0">
                {selectedPtkp.code}
              </div>
            )}

            {renderPtkpDetails(selectedPtkp, true)}
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <span className="text-xs text-slate-400 font-normal"></span>
          </div>
        )}

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Custom Popup Menu */}
      {isOpen && (
        <div 
          style={{ maxHeight: `${maxHeight}px` }}
          className={`absolute left-0 right-0 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${dropdownClasses}`}
        >
          {/* List Options */}
          <div className="divide-y divide-slate-100 p-1.5 space-y-0.5">
            {PTKP_DATA.map((item) => {
              const isSelected = item.code === value;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    onChange(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-blue-50/90 border border-blue-200/80 shadow-xs'
                      : 'hover:bg-slate-50/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Badge Kolom Kiri */}
                    {!isProgressive ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div
                          className={`w-13 text-center py-1 text-[10px] font-bold rounded-lg border tracking-wider uppercase ${getTerBadgeStyle(
                            item.terCategory
                          )}`}
                        >
                          TER {item.terCategory}
                        </div>
                        <div className="min-w-[42px] px-1.5 text-center py-1 text-[10px] font-bold rounded-lg border bg-slate-100 text-slate-800 border-slate-200">
                          {item.code}
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-[48px] px-2 text-center py-1 text-[10px] font-bold rounded-lg border bg-slate-100 text-slate-800 border-slate-200 shrink-0">
                        {item.code}
                      </div>
                    )}

                    {/* Middle Content */}
                    {renderPtkpDetails(item, isSelected)}
                  </div>

                  {/* Check Indicator */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
