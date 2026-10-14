import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDropdownPlacement } from '../../utils/useDropdownPlacement';
export { HRMatrixLogo } from './Logo';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white",
          {
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs': variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200': variant === 'secondary',
            'border border-slate-200 hover:bg-slate-100': variant === 'outline',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
            'hover:bg-slate-100 text-slate-700': variant === 'ghost',
            'h-9 px-3 text-sm rounded-md': size === 'sm',
            'h-10 py-2 px-4 rounded-lg': size === 'md',
            'h-11 px-8 rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, innerLabel?: string, error?: string }>(
  ({ className, label, innerLabel, error, ...props }, ref) => {
    if (innerLabel) {
      return (
        <div className="w-full">
          {label && <label className="block text-[11px] font-normal text-slate-600 mb-1">{label}</label>}
          <div className={cn(
            "flex flex-col justify-center w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1 text-xs text-slate-900 box-border transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 min-h-[44px]",
            error && "border-red-500 focus-within:ring-red-500"
          )}>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight truncate">
              {innerLabel}
            </span>
            <input
              ref={ref}
              className={cn(
                "w-full text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-transparent leading-tight mt-0.5",
                className
              )}
              {...props}
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && <label className="block text-[11px] font-normal text-slate-600 mb-1">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 box-border min-h-[36px] leading-5",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    innerLabel?: string;
    error?: string;
    options?: { value: string | number; label: string; subLabel?: string; category?: string; displayLabel?: string }[];
    selectedTextColor?: string;
  }
>(({ className, label, innerLabel, error, options = [], value, onChange, disabled, name, placeholder, selectedTextColor, ...props }, ref) => {
  const safeOptions = Array.isArray(options) ? options : [];

  // Parse children if options prop is empty to support native <option> elements
  const finalOptions = React.useMemo(() => {
    if (safeOptions.length > 0) return safeOptions;
    const parsed: { value: string | number; label: string; subLabel?: string; category?: string; displayLabel?: string }[] = [];
    if (props.children) {
      React.Children.forEach(props.children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const val = child.props.value !== undefined ? child.props.value : '';
          const lbl = child.props.children ? String(child.props.children) : String(val);
          parsed.push({ value: val, label: lbl });
        }
      });
    }
    return parsed;
  }, [safeOptions, props.children]);

  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const nativeSelectRef = React.useRef<HTMLSelectElement | null>(null);

  const { maxHeight, dropdownClasses } = useDropdownPlacement({
    isOpen,
    containerRef,
    defaultMaxHeight: 240,
  });

  React.useImperativeHandle(ref, () => nativeSelectRef.current!);

  // Close popup when clicking outside
  React.useEffect(() => {
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

  const currentValue = value !== undefined && value !== null ? String(value) : '';
  const selectedOption = finalOptions.find(o => String(o.value) === currentValue);

  // If a non-empty value is provided but not in finalOptions, automatically augment options
  // so the dropdown never blanks out or loses the existing data from templates or state
  const effectiveOptions = React.useMemo(() => {
    if (currentValue !== '' && !finalOptions.some(o => String(o.value) === currentValue)) {
      return [...finalOptions, { value: currentValue, label: currentValue }];
    }
    return finalOptions;
  }, [finalOptions, currentValue]);

  const activeOption = effectiveOptions.find(o => String(o.value) === currentValue);
  const isPlaceholderSelected = !activeOption || activeOption.value === '';
  const displayLabel = !isPlaceholderSelected && activeOption
    ? (activeOption.displayLabel || (activeOption.category ? `${activeOption.category}: ${activeOption.label}` : activeOption.label))
    : (currentValue || '');

  // Filter out dummy placeholder options for clean popup menu
  const nonPlaceholderOptions = effectiveOptions.filter(
    o => o && o.value !== '' && !(String(o.label).includes('--') || String(o.label).toLowerCase().startsWith('pilih'))
  );
  const filteredPopupOptions = nonPlaceholderOptions.length > 0 ? nonPlaceholderOptions : effectiveOptions;

  const handleSelectOption = (optValue: string | number) => {
    if (disabled) return;
    setIsOpen(false);

    const valStr = String(optValue);

    if (nativeSelectRef.current) {
      nativeSelectRef.current.value = valStr;
    }

    if (onChange) {
      const target = nativeSelectRef.current || document.createElement('select');
      target.value = valStr;
      if (name) target.name = name;

      const syntheticEvent = {
        target: target,
        currentTarget: target,
        preventDefault: () => {},
        stopPropagation: () => {},
        nativeEvent: new Event('change', { bubbles: true }),
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
      } as unknown as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
  };

  return (
    <div ref={containerRef} className="w-full relative">
      {label && <label className="block text-[11px] font-normal text-slate-600 mb-1">{label}</label>}

      {/* Hidden native select for accessibility & refs */}
      <select
        ref={nativeSelectRef}
        value={currentValue}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      >
        <option value="" disabled></option>
        {safeOptions.map((o, idx) => (
          <option key={idx} value={o.value}>
            {o.label}{o.subLabel ? ` (${o.subLabel})` : ''}
          </option>
        ))}
      </select>

      {/* Custom Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-left box-border min-h-[36px]",
          innerLabel && "min-h-[44px] py-1",
          isOpen && "border-blue-500 ring-1 ring-blue-500/20",
          error && "border-red-500 focus:ring-red-500 ring-red-500/20",
          className
        )}
      >
        <div className="flex flex-col text-left min-w-0 flex-1 pr-2 leading-tight py-0.5">
          {innerLabel && (
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">
              {innerLabel}
            </span>
          )}
          <span className={cn(
            "truncate block mt-0.5", 
            !isPlaceholderSelected && selectedTextColor
              ? selectedTextColor
              : (innerLabel ? "font-normal text-slate-900 text-xs sm:text-sm" : (isPlaceholderSelected ? "text-slate-400" : "text-slate-900 font-normal"))
          )}>
            {displayLabel}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200",
            isOpen && "rotate-180 text-blue-500"
          )}
        />
      </button>

      {/* Custom Popup Dropdown Menu */}
      {isOpen && (
        <div 
          style={{ maxHeight: `${maxHeight}px` }}
          className={cn(
            "absolute z-50 left-0 right-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-100",
            dropdownClasses
          )}
        >
          {filteredPopupOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 text-center">Tidak ada opsi</div>
          ) : (
            filteredPopupOptions.map((option, idx) => {
              const isSelected = String(option.value) === currentValue;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors my-0.5",
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                  )}
                >
                  <div className="flex flex-col text-left min-w-0 flex-1 pr-2 leading-tight py-0.5">
                    {option.category ? (
                      <>
                        <span className="text-[10px] text-slate-400 font-normal truncate">
                          {option.category}
                        </span>
                        <span className={cn("whitespace-normal text-xs font-semibold mt-0.5", isSelected ? "text-blue-700 font-bold" : "text-slate-900")}>
                          {option.label}
                        </span>
                        {option.subLabel && (
                          <span className="text-[11px] text-slate-500 font-normal mt-0.5 whitespace-normal">
                            {option.subLabel}
                          </span>
                        )}
                      </>
                    ) : option.subLabel ? (
                      <>
                        <span className={cn("whitespace-normal text-xs font-semibold", isSelected ? "text-blue-700 font-bold" : "text-slate-900")}>
                          {option.label}
                        </span>
                        <span className="text-[11px] text-slate-500 font-normal mt-0.5 whitespace-normal">
                          {option.subLabel}
                        </span>
                      </>
                    ) : (
                      <span className="whitespace-normal text-xs">{option.label}</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-500 shrink-0 ml-2" />}
                </button>
              );
            })
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Select.displayName = "Select";

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm", className)} {...props}>{children}</div>
}

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>{children}</div>
}

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>{children}</h3>
}

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>
}

export const PhoneInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }>(
  ({ className, label, error, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      
      if (raw === '+6' || raw === '+' || raw === '') {
        const syntheticEvent = { ...e, target: { ...e.target, value: '' } } as React.ChangeEvent<HTMLInputElement>;
        if (onChange) onChange(syntheticEvent);
        return;
      }

      let cleaned = raw.replace(/\D/g, '');
      
      if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
      } else if (cleaned.length > 0 && !cleaned.startsWith('62') && !cleaned.startsWith('6')) {
        cleaned = '62' + cleaned;
      }

      let formatted = '';
      if (cleaned.length > 0) {
        formatted = '+' + cleaned.substring(0, 2);
        let local = cleaned.substring(2);
        if (local.length > 0) formatted += ' ' + local.substring(0, 3);
        if (local.length > 3) formatted += '-' + local.substring(3, 7);
        if (local.length > 7) formatted += '-' + local.substring(7, 11);
        if (local.length > 11) formatted += '-' + local.substring(11, 15);
      }
      
      const syntheticEvent = { ...e, target: { ...e.target, value: formatted } } as React.ChangeEvent<HTMLInputElement>;
      if (onChange) onChange(syntheticEvent);
    };

    return (
      <Input 
        ref={ref}
        type="tel"
        inputMode="tel"
        label={label}
        error={error}
        value={value}
        onChange={handleChange}
        className={className}
        {...props}
      />
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export const CurrencyInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, innerLabel?: string, headerRight?: React.ReactNode, compactPrefix?: boolean, error?: string }>(
  ({ className, label, innerLabel, headerRight, compactPrefix, error, onChange, value, placeholder, disabled, ...props }, ref) => {
    
    const [displayValue, setDisplayValue] = React.useState('');

    React.useEffect(() => {
      if (value !== undefined && value !== null && value !== '' && value !== 0 && value !== '0') {
        const num = typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > 0) {
          setDisplayValue(new Intl.NumberFormat('id-ID').format(num));
        } else {
          setDisplayValue('');
        }
      } else {
        setDisplayValue('');
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, '');
      
      let syntheticValue = '';
      if (digits === '') {
        setDisplayValue('');
        syntheticValue = '';
      } else {
        const num = parseInt(digits, 10);
        if (num > 0) {
          setDisplayValue(new Intl.NumberFormat('id-ID').format(num));
          syntheticValue = num.toString();
        } else {
          setDisplayValue('');
          syntheticValue = '';
        }
      }
      
      const syntheticEvent = { ...e, target: { ...e.target, value: syntheticValue } } as React.ChangeEvent<HTMLInputElement>;
      if (onChange) onChange(syntheticEvent);
    };

    const cleanPlaceholder = placeholder ? placeholder.replace(/^Rp\s*/i, '') : '';

    return (
      <div className="w-full">
        {label && <label className="block text-[11px] font-normal text-slate-600 mb-1">{label}</label>}
        <div className={cn(
          "relative flex items-center rounded-xl border border-slate-200/90 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden min-h-[36px] transition-all",
          innerLabel && "min-h-[44px]",
          error && "border-red-500 focus-within:ring-red-500",
          disabled && "bg-slate-50 opacity-60 cursor-not-allowed"
        )}>
          {/* Prefix Rp */}
          <span className={cn(
            compactPrefix
              ? "px-1.5 sm:px-2 text-[10px] sm:text-[11px] font-medium text-slate-400 select-none bg-slate-50/50 shrink-0 flex items-center justify-center min-w-[24px]"
              : "pl-3 pr-1 text-xs font-medium text-slate-400 select-none bg-slate-50/50 shrink-0 flex items-center justify-center",
            innerLabel ? "self-stretch" : "py-1.5"
          )}>
            Rp
          </span>
          {/* Input Formatted */}
          <div className={cn(
            "flex flex-col flex-1 justify-center min-w-0",
            compactPrefix ? "px-1.5 sm:px-2 py-1" : "px-2 py-1"
          )}>
            {innerLabel && (
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight truncate">
                {innerLabel}
              </span>
            )}
            <input
              ref={ref}
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleChange}
              placeholder={cleanPlaceholder}
              disabled={disabled}
              className={cn(
                "w-full text-xs font-normal text-slate-900 focus:outline-none text-right bg-transparent placeholder:text-slate-400 disabled:cursor-not-allowed leading-tight",
                innerLabel ? "mt-0.5 text-xs sm:text-sm" : "py-1.5 pr-2",
                className
              )}
              {...props}
            />
          </div>
          {headerRight && (
            <div className={cn(
              "flex items-center justify-center shrink-0 self-center",
              compactPrefix ? "pr-1.5 pl-0.5" : "pr-3 pl-1"
            )}>
              {headerRight}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export const BankAccountInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }>(
  ({ className, label, error, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, '').slice(0, 16);
      
      let formatted = '';
      for (let i = 0; i < digits.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += '-';
        }
        formatted += digits[i];
      }
      
      const syntheticEvent = { ...e, target: { ...e.target, value: formatted } } as React.ChangeEvent<HTMLInputElement>;
      if (onChange) onChange(syntheticEvent);
    };

    return (
      <Input 
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9\-]*"
        label={label}
        error={error}
        value={value}
        onChange={handleChange}
        className={className}
        {...props}
      />
    )
  }
)
BankAccountInput.displayName = "BankAccountInput"

export const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
  }
>(({ className, label, value, onChange, placeholder = '', required = false, disabled = false, error, ...props }, ref) => {
  const nativeRef = React.useRef<HTMLInputElement | null>(null);
  React.useImperativeHandle(ref, () => nativeRef.current!);

  const formatDateDisplay = (dateStr?: string): string => {
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

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px] transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500",
          error && "border-red-500 focus-within:ring-red-500",
          disabled && "bg-slate-50 opacity-60 cursor-not-allowed",
          className
        )}
      >
        <span
          className={cn(
            "flex-1 text-xs truncate select-none",
            value ? "text-slate-900 font-normal" : "text-transparent font-normal"
          )}
        >
          {value ? formatDateDisplay(value) : ''}
        </span>

        <input
          ref={nativeRef}
          type="date"
          value={value || ''}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          disabled={disabled}
          required={required}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base disabled:cursor-not-allowed"
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
DatePickerInput.displayName = "DatePickerInput";

export const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    suffixText?: string;
  }
>(({ className, label, value, onChange, placeholder = '', required = false, disabled = false, error, suffixText = 'WIB', ...props }, ref) => {
  const nativeRef = React.useRef<HTMLInputElement | null>(null);
  React.useImperativeHandle(ref, () => nativeRef.current!);

  const formatTimeDisplay = (timeStr?: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hh = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      return `${hh}:${mm}${suffixText ? ` ${suffixText}` : ''}`;
    }
    return timeStr;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px] transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500",
          error && "border-red-500 focus-within:ring-red-500",
          disabled && "bg-slate-50 opacity-60 cursor-not-allowed",
          className
        )}
      >
        <span
          className={cn(
            "flex-1 text-xs truncate select-none",
            value ? "text-slate-900 font-normal" : "text-transparent font-normal"
          )}
        >
          {value ? formatTimeDisplay(value) : ''}
        </span>

        <input
          ref={nativeRef}
          type="time"
          value={value || ''}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          disabled={disabled}
          required={required}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base disabled:cursor-not-allowed"
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
TimePickerInput.displayName = "TimePickerInput";

export const NpwpInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }>(
  ({ className, label, error, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, '').slice(0, 15);
      
      let formatted = '';
      if (digits.length > 0) formatted += digits.substring(0, 2);
      if (digits.length > 2) formatted += '.' + digits.substring(2, 5);
      if (digits.length > 5) formatted += '.' + digits.substring(5, 8);
      if (digits.length > 8) formatted += '.' + digits.substring(8, 9);
      if (digits.length > 9) formatted += '-' + digits.substring(9, 12);
      if (digits.length > 12) formatted += '.' + digits.substring(12, 15);
      
      const syntheticEvent = { ...e, target: { ...e.target, value: formatted } } as React.ChangeEvent<HTMLInputElement>;
      if (onChange) onChange(syntheticEvent);
    };

    return (
      <Input 
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9\.\-]*"
        label={label}
        error={error}
        value={value}
        onChange={handleChange}
        className={className}
        {...props}
      />
    )
  }
)
NpwpInput.displayName = "NpwpInput"

export { ComboboxInput } from './ComboboxInput';
export type { ComboboxOption, ComboboxInputProps } from './ComboboxInput';
export { WilayahForm } from './WilayahForm';
export { EmployeeAvatar, EmployeeAvatar as Avatar, getEmployeePhotoUrl, getEmployeeInitials, resolveGoogleDriveImageUrl } from './EmployeeAvatar';
export type { EmployeeAvatarProps } from './EmployeeAvatar';
export { ContactDeveloperSection } from './ContactDeveloperSection';
export { BtnDonationCard } from './BtnDonationCard';
export { CustomDevInquirySection } from './CustomDevInquirySection';
export { GoogleIcon } from './GoogleIcon';
export { AppleIcon } from './AppleIcon';
export { ThreePeopleIcon } from './ThreePeopleIcon';
export { HRMatrixHIcon } from './HRMatrixHIcon';
