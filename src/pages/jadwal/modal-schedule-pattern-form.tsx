import React, { useState, useEffect, useRef } from 'react';
import { 
  BookmarkCheck, 
  X, 
  Building2, 
  Users, 
  CalendarDays,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  Department, 
  AttendanceConfig, 
  WorkShift, 
  DepartmentScheduleAssignment, 
  ShiftGroupAssignment 
} from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button, Select } from '../../components/ui';
import { getShiftBadgeClasses, getShiftBadgeStyle } from './utils-helper';

export interface ModalSchedulePatternFormProps {
  isOpen: boolean;
  editingSavedPatternId: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSavingPattern: boolean;
  patternScheduleName: string;
  setPatternScheduleName: (val: string) => void;
  patternScheduleDesc: string;
  setPatternScheduleDesc: (val: string) => void;
  patternActiveTab: 'dept' | 'group';
  setPatternActiveTab: (val: 'dept' | 'group') => void;
  departments: Department[];
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
  modalDeptAssignments: DepartmentScheduleAssignment[];
  modalGroupAssignments: ShiftGroupAssignment[];
  isBulkDateEnabled: boolean;
  setIsBulkDateEnabled: (val: boolean) => void;
  bulkDateValue: string;
  setBulkDateValue: (val: string) => void;
  onBulkAnchorDate: (date: string) => void;
  onUpdateDeptAssignment: (deptId: string, field: 'shiftPatternId' | 'anchorDate', val: string) => void;
  onUpdateGroup: (groupId: string, field: 'shiftPatternId' | 'anchorDate', val: string) => void;
  onAddDeptAssignment: (deptId: string) => void;
  onRemoveDeptAssignment: (deptId: string) => void;
  onAddAllDepts: () => void;
  onAddGroupAssignment: (groupId: string) => void;
  onRemoveGroupAssignment: (groupId: string) => void;
  onAddAllGroups: () => void;
}

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

const CardDatePicker: React.FC<{
  label?: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}> = ({ label, value, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (disabled) return;
    if (inputRef.current && typeof inputRef.current.showPicker === 'function') {
      try {
        inputRef.current.showPicker();
      } catch {
        // Fallback automatically
      }
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label}
        </label>
      )}
      <div
        onClick={handleContainerClick}
        className={`relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs transition-all hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 cursor-pointer ${
          disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <CalendarDays className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
        <span className={`flex-1 text-xs truncate select-none ${value ? 'text-slate-900 font-normal' : 'text-slate-400 font-normal'}`}>
          {value ? formatDateDisplay(value) : 'Pilih Tanggal Mulai...'}
        </span>

        <input
          ref={inputRef}
          type="date"
          value={value || ''}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
          disabled={disabled}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>
    </div>
  );
};

interface PendingCard {
  id: string;
  bagianKey: string;
  shiftPatternId: string;
  anchorDate: string;
}

export function ModalSchedulePatternForm({
  isOpen,
  editingSavedPatternId,
  onClose,
  onSubmit,
  isSavingPattern,
  patternScheduleName,
  setPatternScheduleName,
  patternScheduleDesc,
  setPatternScheduleDesc,
  departments,
  activeConfig,
  availableShifts,
  modalDeptAssignments,
  modalGroupAssignments,
  onUpdateDeptAssignment,
  onUpdateGroup,
  onAddDeptAssignment,
  onRemoveDeptAssignment,
  onAddGroupAssignment,
  onRemoveGroupAssignment,
}: ModalSchedulePatternFormProps) {
  const masterGroups = activeConfig?.shiftGroups || [];
  const masterPatterns = activeConfig?.shiftPatterns || [];
  const todayIso = new Date().toISOString().split('T')[0];
  const defaultPatternId = masterPatterns[0]?.id || '';

  // Pending card state for adding new unassigned entries
  const [pendingCards, setPendingCards] = useState<PendingCard[]>([]);
  const [expandedPatterns, setExpandedPatterns] = useState<Record<string, boolean>>({});

  // Auto-initialize 1 pending card if modal opens with 0 assignments
  useEffect(() => {
    if (isOpen) {
      if (modalDeptAssignments.length === 0 && modalGroupAssignments.length === 0) {
        setPendingCards([{
          id: `pending-${Date.now()}`,
          bagianKey: '',
          shiftPatternId: defaultPatternId,
          anchorDate: todayIso,
        }]);
      } else {
        setPendingCards([]);
      }
    }
  }, [isOpen, editingSavedPatternId]);

  // Handler for adding a new empty card group
  const handleAddCardGroup = () => {
    setPendingCards(prev => [
      ...prev,
      {
        id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        bagianKey: '',
        shiftPatternId: defaultPatternId,
        anchorDate: todayIso,
      }
    ]);
  };

  // Remove pending card
  const handleRemovePendingCard = (id: string) => {
    setPendingCards(prev => prev.filter(c => c.id !== id));
  };

  // Update pending card field
  const handleUpdatePendingCard = (id: string, field: keyof PendingCard, val: string) => {
    setPendingCards(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: val };
        // If user selects Bagian, commit it directly to parent state
        if (field === 'bagianKey' && val) {
          if (val.startsWith('dept:')) {
            const deptId = val.replace('dept:', '');
            onAddDeptAssignment(deptId);
            if (updated.shiftPatternId) {
              onUpdateDeptAssignment(deptId, 'shiftPatternId', updated.shiftPatternId);
            }
            if (updated.anchorDate) {
              onUpdateDeptAssignment(deptId, 'anchorDate', updated.anchorDate);
            }
          } else if (val.startsWith('group:')) {
            const groupId = val.replace('group:', '');
            onAddGroupAssignment(groupId);
            if (updated.shiftPatternId) {
              onUpdateGroup(groupId, 'shiftPatternId', updated.shiftPatternId);
            }
            if (updated.anchorDate) {
              onUpdateGroup(groupId, 'anchorDate', updated.anchorDate);
            }
          }
        }
        return updated;
      }
      return c;
    }));
  };

  // Filter out pending cards that have been committed
  const activePendingCards = pendingCards.filter(c => {
    if (!c.bagianKey) return true;
    if (c.bagianKey.startsWith('dept:')) {
      const deptId = c.bagianKey.replace('dept:', '');
      return !modalDeptAssignments.some(d => d.departmentId === deptId);
    }
    if (c.bagianKey.startsWith('group:')) {
      const groupId = c.bagianKey.replace('group:', '');
      return !modalGroupAssignments.some(g => g.id === groupId);
    }
    return true;
  });

  // Bagian options generator
  const getBagianOptions = (currentValue?: string) => {
    const opts: { value: string; label: string; category?: string; displayLabel?: string }[] = [
      { value: '', label: '-- Pilih Bagian (Departemen / Group) --' }
    ];

    // Departments
    departments.forEach(d => {
      const key = `dept:${d.id}`;
      const isSelectedInOther = modalDeptAssignments.some(m => m.departmentId === d.id && key !== currentValue);
      if (!isSelectedInOther) {
        opts.push({
          value: key,
          category: 'Departemen',
          label: d.name,
          displayLabel: `Departemen: ${d.name}`
        });
      }
    });

    // Groups
    masterGroups.forEach(g => {
      const key = `group:${g.id}`;
      const isSelectedInOther = modalGroupAssignments.some(m => m.id === g.id && key !== currentValue);
      if (!isSelectedInOther) {
        opts.push({
          value: key,
          category: `Group (${g.employeeIds?.length || 0} Karyawan)`,
          label: g.name,
          displayLabel: `Group: ${g.name} (${g.employeeIds?.length || 0} Karyawan)`
        });
      }
    });

    return opts;
  };

  // Pola Shift options generator
  const getPolaShiftOptions = () => [
    { value: '', label: '-- Pilih Pola Shift --' },
    ...masterPatterns.map(p => ({
      value: p.id,
      category: `Siklus ${p.cycle?.length || 0} Hari`,
      label: p.name,
      displayLabel: `${p.name} (${p.cycle?.length || 0} Hari)`
    }))
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalDeptAssignments.length === 0 && modalGroupAssignments.length === 0) {
      alert('Silakan pilih dan tetapkan setidaknya satu Penugasan Bagian terlebih dahulu.');
      return;
    }
    onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-2xl"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header - Standardized per SPEC_MODAL.md */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {editingSavedPatternId ? 'Edit Pola Jadwal' : 'Buat Pola Jadwal'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Tetapkan pola shift & tanggal mulai per Bagian
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSavingPattern}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              title="Tutup"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body - Standardized per SPEC_INPUT_TYPE.md */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
            
            {/* Informasi Pokok */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-normal text-slate-600 mb-1">
                  Nama Pola Jadwal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pola Operasional Q3 2026 / Pola Reguler Shift"
                  value={patternScheduleName}
                  onChange={(e) => setPatternScheduleName(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent min-h-[36px] leading-5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-normal text-slate-600 mb-1">
                  Keterangan / Catatan (Opsional)
                </label>
                <textarea
                  placeholder="Contoh: Diterapkan untuk shift operasional, security, dan produksi"
                  value={patternScheduleDesc}
                  onChange={(e) => setPatternScheduleDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none leading-5"
                />
              </div>
            </div>

            {/* HEADER JUDUL PENUGASAN POLA SHIFT & TOMBOL TAMBAH */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Penugasan Pola Shift
              </h4>

              <button
                type="button"
                onClick={handleAddCardGroup}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1 py-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* LIST PENUGASAN POLA SHIFT (UNWRAPPED / NO CARDS) */}
            <div className="divide-y divide-slate-100">
              {/* 1. Committed Department Assignments */}
              {modalDeptAssignments.map((assign) => {
                const dept = departments.find(d => d.id === assign.departmentId);
                if (!dept) return null;
                const currentKey = `dept:${dept.id}`;
                const selectedPattern = masterPatterns.find(p => p.id === assign.shiftPatternId);

                return (
                  <div 
                    key={`dept-${dept.id}`}
                    className="py-3.5 first:pt-1 space-y-2.5"
                  >
                    {/* 3 Kolom Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-start">
                      {/* Kolom 1: Bagian Combobox */}
                      <div className="sm:col-span-1">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-normal text-slate-600">Bagian</label>
                          <button
                            type="button"
                            onClick={() => onRemoveDeptAssignment(dept.id)}
                            className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Hapus bagian ini"
                          >
                            <span>Hapus Bagian</span>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Select
                          value={currentKey}
                          onChange={(e) => {
                            const newKey = e.target.value;
                            if (newKey && newKey !== currentKey) {
                              onRemoveDeptAssignment(dept.id);
                              if (newKey.startsWith('dept:')) {
                                const newDeptId = newKey.replace('dept:', '');
                                onAddDeptAssignment(newDeptId);
                                onUpdateDeptAssignment(newDeptId, 'shiftPatternId', assign.shiftPatternId);
                                onUpdateDeptAssignment(newDeptId, 'anchorDate', assign.anchorDate);
                              } else if (newKey.startsWith('group:')) {
                                const newGroupId = newKey.replace('group:', '');
                                onAddGroupAssignment(newGroupId);
                                onUpdateGroup(newGroupId, 'shiftPatternId', assign.shiftPatternId);
                                onUpdateGroup(newGroupId, 'anchorDate', assign.anchorDate);
                              }
                            }
                          }}
                          options={getBagianOptions(currentKey)}
                        />
                      </div>

                      {/* Kolom 2: Pola Shift */}
                      <div className="sm:col-span-1">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-normal text-slate-600">Pola Shift</label>
                          {selectedPattern && (
                            <button
                              type="button"
                              onClick={() => setExpandedPatterns(prev => ({ ...prev, [`dept-${dept.id}`]: !prev[`dept-${dept.id}`] }))}
                              className="text-[10px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {expandedPatterns[`dept-${dept.id}`] ? 'Sembunyikan' : 'Lihat Siklus'}
                            </button>
                          )}
                        </div>
                        <Select
                          value={assign.shiftPatternId || ''}
                          onChange={(e) => onUpdateDeptAssignment(dept.id, 'shiftPatternId', e.target.value)}
                          options={getPolaShiftOptions()}
                        />

                        {selectedPattern && expandedPatterns[`dept-${dept.id}`] && (
                          <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1.5 animate-in fade-in duration-150">
                            {selectedPattern.cycle.map((sId, idx) => {
                              if (sId === 'OFF') {
                                return (
                                  <span key={idx} className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-rose-50 text-rose-700 border-rose-200">
                                    OFF
                                  </span>
                                );
                              }
                              const s = (activeConfig?.shifts || availableShifts).find(x => x.id === sId);
                              if (!s) return null;
                              const isOffShift = s.isOff || s.code?.toUpperCase() === 'OFF';
                              const color = isOffShift ? 'rose' : s.color;
                              return (
                                <span 
                                  key={idx} 
                                  style={getShiftBadgeStyle(color)}
                                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getShiftBadgeClasses(color)}`}
                                >
                                  {s.code}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Kolom 3: Tanggal Mulai */}
                      <div className="sm:col-span-1">
                        <CardDatePicker
                          label="Tanggal Mulai"
                          value={assign.anchorDate || ''}
                          onChange={(val) => onUpdateDeptAssignment(dept.id, 'anchorDate', val)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 2. Committed Group Assignments */}
              {modalGroupAssignments.map((group) => {
                const currentKey = `group:${group.id}`;
                const selectedPattern = masterPatterns.find(p => p.id === group.shiftPatternId);

                return (
                  <div 
                    key={`group-${group.id}`}
                    className="py-3.5 first:pt-1 space-y-2.5"
                  >
                    {/* 3 Kolom Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-start">
                      {/* Kolom 1: Bagian Combobox */}
                      <div className="sm:col-span-1">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-normal text-slate-600">Bagian</label>
                          <button
                            type="button"
                            onClick={() => onRemoveGroupAssignment(group.id)}
                            className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Hapus bagian ini"
                          >
                            <span>Hapus Bagian</span>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Select
                          value={currentKey}
                          onChange={(e) => {
                            const newKey = e.target.value;
                            if (newKey && newKey !== currentKey) {
                              onRemoveGroupAssignment(group.id);
                              if (newKey.startsWith('dept:')) {
                                const newDeptId = newKey.replace('dept:', '');
                                onAddDeptAssignment(newDeptId);
                                onUpdateDeptAssignment(newDeptId, 'shiftPatternId', group.shiftPatternId);
                                onUpdateDeptAssignment(newDeptId, 'anchorDate', group.anchorDate);
                              } else if (newKey.startsWith('group:')) {
                                const newGroupId = newKey.replace('group:', '');
                                onAddGroupAssignment(newGroupId);
                                onUpdateGroup(newGroupId, 'shiftPatternId', group.shiftPatternId);
                                onUpdateGroup(newGroupId, 'anchorDate', group.anchorDate);
                              }
                            }
                          }}
                          options={getBagianOptions(currentKey)}
                        />
                      </div>

                      {/* Kolom 2: Pola Shift */}
                      <div className="sm:col-span-1">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-normal text-slate-600">Pola Shift</label>
                          {selectedPattern && (
                            <button
                              type="button"
                              onClick={() => setExpandedPatterns(prev => ({ ...prev, [`group-${group.id}`]: !prev[`group-${group.id}`] }))}
                              className="text-[10px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              {expandedPatterns[`group-${group.id}`] ? 'Sembunyikan' : 'Lihat Siklus'}
                            </button>
                          )}
                        </div>
                        <Select
                          value={group.shiftPatternId || ''}
                          onChange={(e) => onUpdateGroup(group.id, 'shiftPatternId', e.target.value)}
                          options={getPolaShiftOptions()}
                        />

                        {selectedPattern && expandedPatterns[`group-${group.id}`] && (
                          <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1.5 animate-in fade-in duration-150">
                            {selectedPattern.cycle.map((sId, idx) => {
                              if (sId === 'OFF') {
                                return (
                                  <span key={idx} className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-rose-50 text-rose-700 border-rose-200">
                                    OFF
                                  </span>
                                );
                              }
                              const s = (activeConfig?.shifts || availableShifts).find(x => x.id === sId);
                              if (!s) return null;
                              const isOffShift = s.isOff || s.code?.toUpperCase() === 'OFF';
                              const color = isOffShift ? 'rose' : s.color;
                              return (
                                <span 
                                  key={idx} 
                                  style={getShiftBadgeStyle(color)}
                                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getShiftBadgeClasses(color)}`}
                                >
                                  {s.code}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Kolom 3: Tanggal Mulai */}
                      <div className="sm:col-span-1">
                        <CardDatePicker
                          label="Tanggal Mulai"
                          value={group.anchorDate || ''}
                          onChange={(val) => onUpdateGroup(group.id, 'anchorDate', val)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 3. Pending Unassigned Items */}
              {activePendingCards.map((pending) => (
                <div 
                  key={pending.id}
                  className="py-3.5 first:pt-1 space-y-2.5"
                >
                  {/* 3 Kolom Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-start">
                    {/* Kolom 1: Bagian Combobox */}
                    <div className="sm:col-span-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-normal text-slate-600">Bagian</label>
                        <button
                          type="button"
                          onClick={() => handleRemovePendingCard(pending.id)}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Hapus bagian ini"
                        >
                          <span>Hapus Bagian</span>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Select
                        value={pending.bagianKey}
                        onChange={(e) => handleUpdatePendingCard(pending.id, 'bagianKey', e.target.value)}
                        options={getBagianOptions(pending.bagianKey)}
                      />
                    </div>

                    {/* Kolom 2: Pola Shift */}
                    <div className="sm:col-span-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-normal text-slate-600">Pola Shift</label>
                      </div>
                      <Select
                        value={pending.shiftPatternId}
                        onChange={(e) => handleUpdatePendingCard(pending.id, 'shiftPatternId', e.target.value)}
                        options={getPolaShiftOptions()}
                      />
                    </div>

                    {/* Kolom 3: Tanggal Mulai */}
                    <div className="sm:col-span-1">
                      <CardDatePicker
                        label="Tanggal Mulai"
                        value={pending.anchorDate}
                        onChange={(val) => handleUpdatePendingCard(pending.id, 'anchorDate', val)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state when 0 cards exist */}
              {modalDeptAssignments.length === 0 && modalGroupAssignments.length === 0 && activePendingCards.length === 0 && (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-800">Belum Ada Penugasan Pola Shift</div>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                      Klik tombol <strong>"+ Tambah"</strong> untuk menambahkan penugasan Bagian baru.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCardGroup}
                    className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Penugasan</span>
                  </button>
                </div>
              )}
            </div>

          </div>
          
          {/* Footer Action - Standardized per SPEC_MODAL.md (Single Action, Full Width) */}
          <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSavingPattern} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSavingPattern ? 'Menyimpan...' : (editingSavedPatternId ? 'Simpan Perubahan' : 'Simpan & Aktifkan Pola')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
