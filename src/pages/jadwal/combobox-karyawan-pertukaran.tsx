import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Check, Lock } from 'lucide-react';
import { EmployeeComboboxProps } from './types';
import { useDropdownPlacement } from '../../utils/useDropdownPlacement';

export function EmployeeCombobox({
  label,
  value,
  onChange,
  employees,
  excludeId,
  placeholder = 'Ketik nama / NIK karyawan...',
  rightAction,
  disabled = false,
}: EmployeeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { maxHeight, dropdownClasses } = useDropdownPlacement({
    isOpen: isOpen && !disabled,
    containerRef,
    defaultMaxHeight: 240,
  });

  const selectedEmp = employees.find(e => e.id === value);

  useEffect(() => {
    if (selectedEmp) {
      setQuery(selectedEmp.fullName);
    } else if (!value) {
      setQuery('');
    }
  }, [value, selectedEmp]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (selectedEmp) {
          setQuery(selectedEmp.fullName);
        } else {
          setQuery('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [selectedEmp]);

  const filtered = useMemo(() => {
    const list = employees.filter(e => e.status !== 'Terminated' && e.id !== excludeId);
    if (!query.trim() || (selectedEmp && query.trim() === selectedEmp.fullName)) {
      return list;
    }
    const q = query.toLowerCase();
    return list.filter(e => 
      e.fullName.toLowerCase().includes(q) ||
      (e.employeeId && e.employeeId.toLowerCase().includes(q))
    );
  }, [employees, excludeId, query, selectedEmp]);

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-normal text-slate-500">
          {label} <span className="text-rose-500">*</span>
        </label>
        {rightAction}
      </div>
      <div className="relative">
        <input
          type="text"
          value={query}
          disabled={disabled}
          readOnly={disabled}
          onChange={(e) => {
            if (disabled) return;
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (value && e.target.value !== selectedEmp?.fullName) {
              onChange(''); // Clear ID if user modifies text
            }
          }}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full h-9 px-3 pr-8 rounded-lg border text-xs font-medium outline-none transition-all box-border ${
            disabled
              ? 'bg-slate-100 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none'
              : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (!disabled) setIsOpen(prev => !prev);
          }}
          className={`absolute right-0 top-0 bottom-0 px-2.5 flex items-center justify-center transition-colors ${
            disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600 cursor-pointer'
          }`}
        >
          {disabled ? (
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
          )}
        </button>
      </div>

      {isOpen && !disabled && (
        <div 
          style={{ maxHeight: `${maxHeight}px` }}
          className={`absolute z-50 left-0 right-0 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-150 ${dropdownClasses}`}
        >
          {filtered.length === 0 ? (
            <div className="p-3 text-center text-slate-400">
              Tidak ada karyawan ditemukan.
            </div>
          ) : (
            filtered.map(emp => {
              const isSelected = emp.id === value;
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => {
                    onChange(emp.id);
                    setQuery(emp.fullName);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    isSelected ? 'bg-blue-50/80 text-blue-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-900">{emp.fullName}</div>
                    <div className="text-[10px] text-slate-400">
                      {emp.employeeId ? `NIK: ${emp.employeeId}` : ''} • {emp.departmentId || 'Staff'}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
