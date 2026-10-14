import React, { useState, useEffect } from 'react';

export const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(m, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(d, 10)} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const formatRupiah = (val?: number | null): string => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  if (val === Infinity) return 'Tak Terhingga';
  return new Intl.NumberFormat('id-ID').format(val);
};

export interface EditableBracketRow {
  id: string;
  minGross: number;
  maxGross: number;
  ratePercent: number;
}

export interface EditablePasal17Tier {
  id: string;
  name: string;
  minPkp: number;
  maxPkp: number;
  ratePercent: number;
}

export interface EditableDailyTier {
  id: string;
  minWage: number;
  maxWage: number;
  ratePercent: number;
}

export const DEFAULT_PASAL17_TIERS: EditablePasal17Tier[] = [
  { id: 'p17_1', name: 'Lapisan I', minPkp: 0, maxPkp: 60000000, ratePercent: 5 },
  { id: 'p17_2', name: 'Lapisan II', minPkp: 60000000, maxPkp: 250000000, ratePercent: 15 },
  { id: 'p17_3', name: 'Lapisan III', minPkp: 250000000, maxPkp: 500000000, ratePercent: 25 },
  { id: 'p17_4', name: 'Lapisan IV', minPkp: 500000000, maxPkp: 5000000000, ratePercent: 30 },
  { id: 'p17_5', name: 'Lapisan V', minPkp: 5000000000, maxPkp: Infinity, ratePercent: 35 }
];

export const DEFAULT_DAILY_TIERS: EditableDailyTier[] = [
  { id: 'daily_1', minWage: 0, maxWage: 450000, ratePercent: 0 },
  { id: 'daily_2', minWage: 450000, maxWage: 2500000, ratePercent: 0.5 },
  { id: 'daily_3', minWage: 2500000, maxWage: Infinity, ratePercent: 5 }
];

export const convertStandardBracketsToRows = (brackets: [number, number][]): EditableBracketRow[] => {
  let prevUpper = 0;
  return brackets.map(([upperLimit, rateDecimal], idx) => {
    const minVal = prevUpper;
    prevUpper = upperLimit === Infinity ? Infinity : upperLimit;
    return {
      id: `bracket_${idx + 1}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      minGross: minVal,
      maxGross: upperLimit,
      ratePercent: Number((rateDecimal * 100).toFixed(4))
    };
  });
};

export function getNominalColumnWidth(
  values: (number | undefined | null)[],
  minWidth = 108,
  characterWidth = 12
): number {
  let maxChars = 0;
  for (const val of values) {
    if (val === null || val === undefined || val === Infinity || isNaN(val) || val === 0) {
      continue;
    }
    const formattedStr = new Intl.NumberFormat('id-ID').format(val);
    if (formattedStr.length > maxChars) {
      maxChars = formattedStr.length;
    }
  }
  return Math.max(minWidth, maxChars * characterWidth);
}

export function getPercentColumnWidth(
  values: (number | undefined | null)[],
  minWidth = 88,
  characterWidth = 11
): number {
  let maxChars = 0;
  for (const val of values) {
    if (val === null || val === undefined || isNaN(val)) {
      continue;
    }
    const formattedStr = `${val}%`;
    if (formattedStr.length > maxChars) {
      maxChars = formattedStr.length;
    }
  }
  return Math.max(minWidth, maxChars * characterWidth);
}

export interface StandardNominalInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

export function StandardNominalInput({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  compact = false,
  className = ''
}: StandardNominalInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value !== undefined && value !== null && !isNaN(value) && value !== 0) {
      setDisplayValue(new Intl.NumberFormat('id-ID').format(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw === '') {
      setDisplayValue('');
      onChange(0);
    } else {
      const num = parseInt(raw, 10);
      setDisplayValue(new Intl.NumberFormat('id-ID').format(num));
      onChange(num);
    }
  };

  return (
    <div
      className={`relative flex items-center bg-white border border-slate-200/90 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden w-full ${
        compact ? 'h-8 rounded-lg min-h-[32px]' : 'h-9 rounded-xl min-h-[36px]'
      } ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      <span
        className={`text-slate-400 font-medium select-none shrink-0 flex items-center justify-center ${
          compact ? 'pl-2.5 pr-0.5 text-[11px]' : 'pl-3 pr-1 text-xs'
        }`}
      >
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full text-xs font-normal text-slate-900 text-right bg-transparent placeholder:text-slate-400 focus:outline-none ${
          compact ? 'pr-2.5 pl-1 py-1' : 'pr-3 pl-1 py-1.5'
        }`}
      />
    </div>
  );
}

export interface StandardPercentInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

export function StandardPercentInput({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  compact = false,
  className = ''
}: StandardPercentInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value !== undefined && value !== null && !isNaN(value) && value !== 0) {
      setDisplayValue(value.toString());
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = e.target.value.replace(',', '.');
    const raw = normalized.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    const clean = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : raw;
    setDisplayValue(clean);
    if (clean === '' || clean === '.') {
      onChange(0);
    } else {
      const num = parseFloat(clean);
      if (!isNaN(num)) onChange(num);
    }
  };

  return (
    <div
      className={`relative flex items-center bg-white border border-slate-200/90 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden w-full ${
        compact ? 'h-8 rounded-lg min-h-[32px]' : 'h-9 rounded-xl min-h-[36px]'
      } ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full text-xs font-normal text-slate-900 text-right bg-transparent placeholder:text-slate-400 focus:outline-none ${
          compact ? 'pl-2.5 pr-1 py-1' : 'pl-3 pr-1 py-1.5'
        }`}
      />
      <span
        className={`text-slate-400 font-medium select-none shrink-0 flex items-center justify-center ${
          compact ? 'pr-2.5 pl-0.5 text-[11px]' : 'pr-3 pl-1 text-xs'
        }`}
      >
        %
      </span>
    </div>
  );
}
