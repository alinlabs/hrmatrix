import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check, RotateCcw, Plus, X } from 'lucide-react';
import { useDropdownPlacement } from '../../utils/useDropdownPlacement';

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  amount?: number;
  data?: any;
}

export interface ComboboxInputProps {
  label?: string;
  value: string;
  displayValue?: string;
  onChange: (value: string) => void;
  onSelectOption?: (option: ComboboxOption) => void;
  options?: ComboboxOption[];
  placeholder?: string;
  headerTitle?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  customPromptText?: string;
}

export function ComboboxInput({
  label,
  value,
  displayValue,
  onChange,
  onSelectOption,
  options = [],
  placeholder = '',
  error,
  className,
  disabled = false,
  customPromptText = 'sebagai opsi kustom',
}: ComboboxInputProps) {
  const safeOptions = Array.isArray(options) ? options : [];
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [historyOption, setHistoryOption] = useState<ComboboxOption | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { maxHeight, dropdownClasses } = useDropdownPlacement({
    isOpen,
    containerRef,
    defaultMaxHeight: 260,
  });

  // Close & reset search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsSearching(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Find currently selected option
  const selectedOption = safeOptions.find(
    (opt) =>
      opt && (opt.value === value ||
      (value && opt.label && opt.label.trim().toLowerCase() === value.trim().toLowerCase()))
  );

  // Determine current display label when NOT searching
  const currentDisplayLabel =
    displayValue !== undefined
      ? displayValue
      : (selectedOption ? selectedOption.label : (value || ''));

  // What the input element actually displays
  const inputDisplay = isSearching ? searchQuery : currentDisplayLabel;

  // Realtime keyword search query
  const cleanQuery = isSearching ? searchQuery.trim().toLowerCase() : '';

  // Calculate sorted & filtered options
  let topSelectedOption: ComboboxOption | null = null;
  let listOptions: ComboboxOption[] = [];

  if (!isSearching || cleanQuery === '') {
    // 1. NON-SEARCH MODE:
    if (selectedOption) {
      // SELECTED STATE: prioritize selectedOption at top
      topSelectedOption = selectedOption;
      listOptions = safeOptions.filter(
        (opt) => opt && opt !== selectedOption && opt.value !== selectedOption.value
      );
    } else {
      // EMPTY / CLEARED STATE: Show all options normally (no sticky history item in list)
      topSelectedOption = null;
      listOptions = safeOptions;
    }
  } else {
    // 2. SEARCH MODE:
    const matched = safeOptions.filter(
      (opt) =>
        opt &&
        ((opt.label && opt.label.toLowerCase().includes(cleanQuery)) ||
        (opt.value && opt.value.toLowerCase().includes(cleanQuery)) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(cleanQuery)))
    );

    if (
      selectedOption &&
      ((selectedOption.label && selectedOption.label.toLowerCase().includes(cleanQuery)) ||
        (selectedOption.value && selectedOption.value.toLowerCase().includes(cleanQuery)) ||
        (selectedOption.sublabel && selectedOption.sublabel.toLowerCase().includes(cleanQuery)))
    ) {
      // Selected matches search keyword
      topSelectedOption = selectedOption;
      listOptions = matched.filter((o) => o.value !== selectedOption.value);
    } else {
      topSelectedOption = null;
      listOptions = matched;
    }
  }

  const isExactMatch =
    !isSearching ||
    cleanQuery === '' ||
    safeOptions.some(
      (opt) =>
        opt &&
        ((opt.label && opt.label.trim().toLowerCase() === cleanQuery) ||
        (opt.value && opt.value.trim().toLowerCase() === cleanQuery))
    );

  const handleSelect = (option: ComboboxOption) => {
    setIsSearching(false);
    setSearchQuery('');
    setHistoryOption(null);
    onChange(option.value);
    if (onSelectOption) {
      onSelectOption(option);
    }
    setIsOpen(false);
  };

  const handleClearToHistory = () => {
    if (value || currentDisplayLabel) {
      const currentToSave: ComboboxOption = selectedOption || {
        value: value || currentDisplayLabel,
        label: currentDisplayLabel || value,
      };
      setHistoryOption(currentToSave);
      onChange('');
    }
    setIsSearching(false);
    setSearchQuery('');
    if (!isOpen) setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleRestoreHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (historyOption) {
      handleSelect(historyOption);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsSearching(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      if (!isOpen) {
        setIsOpen(true);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      // If user hasn't typed a custom query and there is an existing value:
      // Instantly clear selected value and preserve as historyOption
      if (!isSearching && (value || currentDisplayLabel)) {
        e.preventDefault();
        handleClearToHistory();
      }
    }
  };

  // Action icons logic when input is ACTIVE (isOpen):
  // 1. When inactive (!isOpen): ONLY show ChevronDown. No 'X' or 'RotateCcw' icons.
  // 2. When active (isOpen): HIDE ChevronDown.
  //    - If historyOption exists: Show 'RotateCcw'
  //    - If selected value or search text exists: Show 'X'
  const showRestoreHistory = isOpen && historyOption !== null;
  const showClearSelected = isOpen && !showRestoreHistory && !isSearching && Boolean(value || currentDisplayLabel);
  const showClearSearch = isOpen && !showRestoreHistory && !showClearSelected && isSearching && searchQuery.length > 0;

  return (
    <div ref={containerRef} className={cn("w-full relative", isOpen ? "z-30" : "z-auto")}>
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputDisplay}
          onChange={(e) => {
            const nextVal = e.target.value;
            setIsSearching(true);
            setSearchQuery(nextVal);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (!isOpen) setIsOpen(true);
          }}
          onClick={() => {
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 pr-9 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
        />

        <div className="absolute right-0 top-0 bottom-0 pr-1.5 flex items-center justify-center">
          {showClearSearch && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showClearSelected && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                handleClearToHistory();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Hapus pilihan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showRestoreHistory && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleRestoreHistory}
              className="p-1 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
              title={`Kembalikan pilihan sebelumnya: ${historyOption?.label}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {!isOpen && (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setIsOpen(true);
                  inputRef.current?.focus();
                }
              }}
              className="p-1.5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* POPUP DROPDOWN MENU */}
      {isOpen && (
        <div 
          style={{ maxHeight: `${maxHeight}px` }}
          className={cn(
            "absolute z-50 left-0 right-0 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl text-sm animate-fade-in divide-y divide-slate-100",
            dropdownClasses
          )}
        >
          {/* Top Sticky Option for Currently Selected Item Only */}
          {topSelectedOption && (
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => handleSelect(topSelectedOption!)}
                className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs sm:text-sm bg-blue-50 text-blue-900 font-medium transition-colors cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">{topSelectedOption.label}</span>
                  </div>
                  {topSelectedOption.sublabel && (
                    <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                      {topSelectedOption.sublabel}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {topSelectedOption.amount !== undefined && topSelectedOption.amount > 0 && (
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      Rp {new Intl.NumberFormat('id-ID').format(topSelectedOption.amount)}
                    </span>
                  )}
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
              </button>
            </div>
          )}

          {/* Normal Options List */}
          <div className="p-1 space-y-0.5">
            {listOptions.length > 0 ? (
              listOptions.map((opt, optIdx) => {
                return (
                  <button
                    key={`${opt.value}-${optIdx}`}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {opt.sublabel && (
                        <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          {opt.sublabel}
                        </p>
                      )}
                    </div>

                    {opt.amount !== undefined && opt.amount > 0 && (
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                        Rp {new Intl.NumberFormat('id-ID').format(opt.amount)}
                      </span>
                    )}
                  </button>
                );
              })
            ) : !topSelectedOption ? (
              <div className="px-3 py-3 text-center text-xs text-slate-400">
                Tidak ada opsi yang cocok.
              </div>
            ) : null}
          </div>

          {/* Custom option prompt if typed text does not match any existing option */}
          {isSearching && cleanQuery !== '' && !isExactMatch && (
            <button
              type="button"
              onClick={() => handleSelect({ value: searchQuery.trim(), label: searchQuery.trim() })}
              className="w-full text-left p-2.5 bg-blue-50/70 hover:bg-blue-100 transition-colors text-xs text-blue-900 border-t border-blue-100/80 flex items-center gap-2 cursor-pointer"
            >
              <span className="bg-blue-600 text-white p-0.5 rounded shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">
                Gunakan <span className="font-bold underline">"{searchQuery.trim()}"</span> {customPromptText}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
