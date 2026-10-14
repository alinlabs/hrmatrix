import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  X, 
  Search, 
  Check, 
  UserX, 
  ChevronLeft, 
  Edit3,
  Trash2
} from 'lucide-react';
import { Employee, Department, ShiftGroup } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button, Input } from '../../../components/ui';
import { EmployeeAvatar } from '../../../components/ui/EmployeeAvatar';
import { getPositionName } from '../../../services/positionService';
import { getShiftBadgeClasses, getShiftBadgeStyle } from './utils-helper';

export interface ShiftGroupModalProps {
  // Modal Buat/Edit State
  isOpen: boolean;
  editingGroup: ShiftGroup | null;
  onClose: () => void;
  onSave: (groupData: { id?: string; name: string; description: string; employeeIds: string[]; color?: string }) => Promise<void>;
  
  // Modal View Mode State
  viewingGroup: ShiftGroup | null;
  onCloseView: () => void;
  onOpenEditFromView: (group: ShiftGroup) => void;
  onDeleteFromView?: (groupId: string) => void;

  // Master Data
  employees: Employee[];
  departments: Department[];
  existingGroups: ShiftGroup[];
}

export const ShiftGroupModal: React.FC<ShiftGroupModalProps> = ({
  isOpen,
  editingGroup,
  onClose,
  onSave,
  viewingGroup,
  onCloseView,
  onOpenEditFromView,
  onDeleteFromView,
  employees,
  departments,
  existingGroups,
}) => {
  // State for Create/Edit Modal
  const [step, setStep] = useState<'select-employees' | 'name-and-confirm'>('select-employees');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // State for View Modal
  const [viewSearchQuery, setViewSearchQuery] = useState('');

  // Auto-focus search input when search mode is activated in modal header
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Auto-focus group name input when proceeding to step 2 (name-and-confirm)
  useEffect(() => {
    if (step === 'name-and-confirm') {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Sync internal state when Create/Edit modal opens or editingGroup changes
  useEffect(() => {
    if (isOpen) {
      if (editingGroup) {
        setName(editingGroup.name);
        setDescription(editingGroup.description || '');
        setColor(editingGroup.color || '#2563EB');
        setSelectedEmployeeIds([...(editingGroup.employeeIds || [])]);
      } else {
        setName('');
        setDescription('');
        setColor('#2563EB');
        setSelectedEmployeeIds([]);
      }
      setStep('select-employees');
      setSearchQuery('');
      setIsSearchOpen(false);
      setDeptFilter('ALL');
    }
  }, [isOpen, editingGroup]);

  // Reset view search when view modal opens
  useEffect(() => {
    if (viewingGroup) {
      setViewSearchQuery('');
    }
  }, [viewingGroup]);

  // Handler helpers
  const handleToggleEmployee = (empId: string) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const handleBulkToggleEmployees = (empIds: string[], selectAll: boolean) => {
    setSelectedEmployeeIds(prev => {
      let newIds = [...prev];
      if (selectAll) {
        empIds.forEach(id => {
          if (!newIds.includes(id)) newIds.push(id);
        });
      } else {
        newIds = newIds.filter(id => !empIds.includes(id));
      }
      return newIds;
    });
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleProceedToNameAndConfirm = () => {
    if (selectedEmployeeIds.length === 0) {
      alert('Silakan pilih minimal 1 karyawan untuk dimasukkan ke dalam group.');
      return;
    }
    setStep('name-and-confirm');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama group wajib diisi.');
      return;
    }
    if (selectedEmployeeIds.length === 0) {
      alert('Pilih minimal 1 karyawan untuk dimasukkan ke dalam group.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        id: editingGroup ? editingGroup.id : undefined,
        name: name.trim(),
        description: description.trim(),
        employeeIds: selectedEmployeeIds,
        color: color || '#2563EB',
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan group.');
    } finally {
      setIsSaving(false);
    }
  };

  // Karyawan yang sudah terdaftar di group lain tidak boleh muncul di list
  const assignedEmpIdsInOtherGroups = useMemo(() => {
    const ids = new Set<string>();
    (existingGroups || []).forEach(g => {
      if (!editingGroup || g.id !== editingGroup.id) {
        (g.employeeIds || []).forEach(id => ids.add(id));
      }
    });
    return ids;
  }, [existingGroups, editingGroup]);

  // Daftar karyawan yang tersedia (hanya yang belum terdaftar di group lain)
  const availableEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (emp.status === 'Terminated' || emp.status === 'Inactive') return false;
      // Jangan tampilkan jika sudah terdaftar di group lain
      if (assignedEmpIdsInOtherGroups.has(emp.id)) return false;
      return true;
    });
  }, [employees, assignedEmpIdsInOtherGroups]);

  // Filtered employees for Step 1 (Search + Dept)
  const filteredEmployees = useMemo(() => {
    return availableEmployees.filter(emp => {
      if (deptFilter !== 'ALL' && emp.departmentId !== deptFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = emp.fullName.toLowerCase().includes(q);
        const nipMatch = (emp.employeeId || emp.nik || '').toLowerCase().includes(q);
        const posMatch = (emp.positionId || '').toLowerCase().includes(q);
        const dept = departments.find(d => d.id === emp.departmentId);
        const deptMatch = dept?.name.toLowerCase().includes(q) || false;
        return nameMatch || nipMatch || posMatch || deptMatch;
      }
      return true;
    });
  }, [availableEmployees, deptFilter, searchQuery, departments]);

  const filteredIds = filteredEmployees.map(e => e.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedEmployeeIds.includes(id));
  const selectedEmployeesList = employees.filter(e => selectedEmployeeIds.includes(e.id));

  return (
    <>
      {/* 1. MODAL BUAT / EDIT GROUP (2-STEP FLOW) */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        contentClassName="sm:max-w-xl h-[85vh] sm:h-[620px] max-h-[90vh] flex flex-col"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* STEP 1: PEMILIHAN DAFTAR KARYAWAN */}
          {step === 'select-employees' && (
            <>
              {/* HEADER SECTION (STANDAR SPEC_HEADER_PAGE) */}
              {!isSearchOpen ? (
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                        {editingGroup ? 'Edit Anggota Group Shift' : 'Buat Group: Pilih Anggota'}
                      </h3>
                      <p className="text-xs text-blue-600 font-semibold mt-0.5 leading-normal truncate">
                        {selectedEmployeeIds.length} Karyawan Dipilih
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Search Icon Button samping kiri icon X */}
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(true)}
                      className={`p-1.5 sm:p-2 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer shrink-0 hover:bg-slate-100 ${
                        searchQuery ? 'text-blue-600 bg-blue-50' : ''
                      }`}
                      title="Cari Karyawan"
                      aria-label="Cari Karyawan"
                    >
                      <Search className="w-4.5 h-4.5 stroke-[2]" />
                    </button>

                    {/* Close Button X */}
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Tutup Modal"
                      aria-label="Tutup Modal"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Expanded Header Search Mode (Frameless, Direct on White Background, No Search Icon inside input) */
                <div className="px-3.5 sm:px-5 py-3 border-b border-slate-100 flex items-center gap-2 sm:gap-3 shrink-0 bg-white animate-in fade-in duration-150">
                  {/* Tombol ChevronLeft di posisi kiri untuk kembali ke mode normal */}
                  <button
                    type="button"
                    onClick={handleCloseSearch}
                    className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title="Kembali"
                    aria-label="Kembali"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Kolom Input Search Frameless (TANPA ICON SEARCH INTERNAL) */}
                  <div className="flex-1 min-w-0">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama karyawan, NIK, jabatan, divisi..."
                      className="w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 p-0"
                    />
                  </div>

                  {/* Tombol X di paling kanan: HANYA MUNCUL KETIKA ADA TEKS UNTUK MENGHAPUS TEKS */}
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Hapus Teks Pencarian"
                      aria-label="Hapus Teks Pencarian"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  ) : null}
                </div>
              )}

              {/* Department Filters & Select All Bar */}
              <div className="px-3.5 sm:px-4 py-2 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 bg-slate-50/70">
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[68%] sm:max-w-[72%] no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setDeptFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      deptFilter === 'ALL'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Semua Dept
                  </button>
                  {departments.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDeptFilter(d.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        deptFilter === d.id
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleBulkToggleEmployees(filteredIds, !allFilteredSelected)}
                  disabled={filteredIds.length === 0}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer py-1 px-1.5 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40"
                >
                  {allFilteredSelected ? 'Batalkan Semua' : 'Pilih Semua'}
                </button>
              </div>

              {/* List Card Karyawan (Hanya karyawan yang belum di group lain) */}
              <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2.5 text-xs">
                {availableEmployees.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 px-4">
                    <UserX className="w-9 h-9 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold text-slate-700">Semua Karyawan Sudah Terdaftar di Group Lain</p>
                    <p className="text-[10.5px] text-slate-400 max-w-sm mx-auto">
                      Seluruh karyawan aktif sudah dimasukkan ke dalam group shift yang ada. Setiap karyawan hanya dapat didaftarkan pada 1 group shift.
                    </p>
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <UserX className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">Tidak ada karyawan yang sesuai filter</p>
                    <p className="text-[10.5px] text-slate-400">Coba ubah kata kunci pencarian atau filter departemen</p>
                  </div>
                ) : (
                  filteredEmployees.map((emp) => {
                    const isSelected = selectedEmployeeIds.includes(emp.id);
                    const dept = departments.find(d => d.id === emp.departmentId);
                    const deptDisplay = dept?.name || emp.departmentId || 'Umum';
                    const positionDisplay = getPositionName(emp.positionId) || 'Staff';

                    return (
                      <div
                        key={emp.id}
                        onClick={() => handleToggleEmployee(emp.id)}
                        className={`bg-white rounded-2xl border px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3 shadow-2xs transition-all cursor-pointer select-none group ${
                          isSelected 
                            ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-500/30 shadow-xs' 
                            : 'border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
                        }`}
                      >
                        {/* Left: Avatar + 3-Row Info Stack */}
                        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                          {/* Standardized Employee Avatar */}
                          <EmployeeAvatar employee={emp} size="md" />

                          {/* 3 Baris Identitas Karyawan Baku */}
                          <div className="min-w-0 flex-1">
                            {/* Baris 1: Departemen */}
                            <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={deptDisplay}>
                              {deptDisplay}
                            </div>
                            {/* Baris 2: Nama Karyawan */}
                            <div className={`font-bold text-xs sm:text-sm leading-snug truncate transition-colors ${
                              isSelected ? 'text-blue-950' : 'text-slate-900 group-hover:text-blue-600'
                            }`} title={emp.fullName}>
                              {emp.fullName}
                            </div>
                            {/* Baris 3: Posisi / Jabatan */}
                            <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={positionDisplay}>
                              {positionDisplay}
                            </div>
                          </div>
                        </div>

                        {/* Far Right: Check Circle */}
                        <div className="shrink-0 pl-1">
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs transition-transform transform scale-105">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white group-hover:border-blue-400 transition-colors" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Single Action Full Width Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
                <Button
                  type="button"
                  onClick={handleProceedToNameAndConfirm}
                  disabled={selectedEmployeeIds.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  Lanjut ke Penamaan Group ({selectedEmployeeIds.length} Dipilih)
                </Button>
              </div>
            </>
          )}

          {/* STEP 2: NAMA GROUP & CROSSCHECK DAFTAR KARYAWAN TERPILIH */}
          {step === 'name-and-confirm' && (
            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Header */}
              <div className="flex justify-between items-center px-4 sm:px-5 py-3.5 border-b border-slate-100 shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('select-employees')}
                    className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Ubah Pilihan</span>
                  </button>
                  <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {editingGroup ? 'Konfigurasi & Simpan Group' : 'Nama Group & Crosscheck'}
                    </h4>
                    <p className="text-[10.5px] text-slate-500">
                      Langkah 2 dari 2: Beri nama dan tinjau anggota
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body: Form Input + Crosscheck List */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                {/* Input Nama, Deskripsi & Warna Label (Langsung menempel pada layout utama) */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Nama Group / Regu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      placeholder="Contoh: Regu A - Shift Pagi / Tim Security"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-2xs transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Keterangan / Deskripsi Group (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Tim operasional lapangan shift pagi & malam"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Hex Color Picker Mekanisme (Seperti pada Master Shift) */}
                  <div className="pt-2 max-w-full">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Warna Label (Kode Hex)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Kustomisasi Warna Hex</span>
                    </label>
                    <div className="flex items-center gap-2 max-w-full">
                      <div className="relative shrink-0">
                        <input 
                          type="color" 
                          value={color?.startsWith('#') ? color : '#2563EB'} 
                          onChange={e => setColor(e.target.value)}
                          className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white overflow-hidden shadow-2xs shrink-0"
                        />
                      </div>
                      <Input 
                        type="text" 
                        value={color || '#2563EB'} 
                        onChange={e => setColor(e.target.value)} 
                        placeholder="#2563EB"
                        className="flex-1 text-xs font-mono uppercase min-w-0"
                      />
                    </div>
                    
                    {/* Palette Hex Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2 max-w-full">
                      {[
                        { name: 'Biru', hex: '#2563EB' },
                        { name: 'Hijau', hex: '#10B981' },
                        { name: 'Kuning', hex: '#F59E0B' },
                        { name: 'Ungu', hex: '#8B5CF6' },
                        { name: 'Merah', hex: '#EF4444' },
                        { name: 'Nila', hex: '#6366F1' },
                        { name: 'Cyan', hex: '#0EA5E9' },
                        { name: 'Pink', hex: '#EC4899' },
                        { name: 'Teal', hex: '#14B8A6' },
                        { name: 'Orange', hex: '#F97316' },
                        { name: 'Slate', hex: '#64748B' },
                      ].map(preset => (
                        <button
                          type="button"
                          key={preset.hex}
                          onClick={() => setColor(preset.hex)}
                          title={`${preset.name} (${preset.hex})`}
                          className={`w-6 h-6 rounded-full border border-black/10 transition-all cursor-pointer hover:scale-110 shrink-0 ${
                            color?.toLowerCase() === preset.hex.toLowerCase() ? 'ring-2 ring-offset-1 ring-blue-600 scale-110 shadow-xs' : ''
                          }`}
                          style={{ backgroundColor: preset.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section Crosscheck Anggota */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-medium text-xs sm:text-sm text-slate-800">
                      Daftar Karyawan Terpilih ({selectedEmployeesList.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep('select-employees')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      Tambah
                    </button>
                  </div>

                  {/* List Card Karyawan Terpilih (Crosscheck) */}
                  {selectedEmployeesList.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs font-semibold text-rose-600">Belum ada karyawan yang dipilih</p>
                      <button
                        type="button"
                        onClick={() => setStep('select-employees')}
                        className="mt-2 text-xs font-bold text-blue-600 underline cursor-pointer"
                      >
                        Klik di sini untuk memilih karyawan
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedEmployeesList.map((emp) => {
                        const dept = departments.find(d => d.id === emp.departmentId);
                        const deptDisplay = dept?.name || emp.departmentId || 'Umum';
                        const positionDisplay = getPositionName(emp.positionId) || 'Staff';

                        return (
                          <div
                            key={emp.id}
                            className="bg-white rounded-2xl border border-slate-200/90 px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3 shadow-2xs hover:border-blue-300 transition-all"
                          >
                            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                              {/* Standardized Employee Avatar */}
                              <EmployeeAvatar employee={emp} size="md" />

                              {/* 3 Baris Identitas Karyawan Baku */}
                              <div className="min-w-0 flex-1">
                                {/* Baris 1: Departemen */}
                                <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={deptDisplay}>
                                  {deptDisplay}
                                </div>
                                {/* Baris 2: Nama Karyawan */}
                                <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate" title={emp.fullName}>
                                  {emp.fullName}
                                </div>
                                {/* Baris 3: Posisi / Jabatan */}
                                <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={positionDisplay}>
                                  {positionDisplay}
                                </div>
                              </div>
                            </div>

                            {/* Right: Remove from group button */}
                            <button
                              type="button"
                              title="Hapus karyawan ini dari group"
                              onClick={() => {
                                setSelectedEmployeeIds(prev => prev.filter(id => id !== emp.id));
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Single Action Full Width Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
                <Button
                  type="submit"
                  disabled={isSaving || !name.trim() || selectedEmployeeIds.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan Group...' : 'Simpan Group'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* 2. MODAL VIEW MODE GROUP (LIHAT DETAIL STATIC TEKS GROUP SHIFT) */}
      <Modal
        isOpen={!!viewingGroup}
        onClose={onCloseView}
        contentClassName="sm:max-w-xl h-[85vh] sm:h-[620px] max-h-[90vh] flex flex-col"
      >
        {viewingGroup && (() => {
          // Members list
          const groupMembers = employees.filter(e => (viewingGroup.employeeIds || []).includes(e.id));
          
          // Filter within viewing modal if user types search
          const displayedMembers = groupMembers.filter(emp => {
            if (!viewSearchQuery.trim()) return true;
            const q = viewSearchQuery.toLowerCase();
            const nameMatch = emp.fullName.toLowerCase().includes(q);
            const nipMatch = (emp.employeeId || emp.nik || '').toLowerCase().includes(q);
            const posMatch = (emp.positionId || '').toLowerCase().includes(q);
            return nameMatch || nipMatch || posMatch;
          });

          // Departments represented in this group
          const memberDeptIds = Array.from(new Set(groupMembers.map(e => e.departmentId).filter(Boolean)));
          const memberDeptNames = memberDeptIds
            .map(id => departments.find(d => d.id === id)?.name)
            .filter(Boolean);

          return (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                      {viewingGroup.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal truncate">
                      Detail & Anggota Terdaftar Group Shift
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <button 
                    type="button"
                    onClick={() => onOpenEditFromView(viewingGroup)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Group"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {onDeleteFromView && (
                    <button 
                      type="button"
                      onClick={() => {
                        const groupId = viewingGroup.id;
                        onCloseView();
                        onDeleteFromView(groupId);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="w-px h-4 bg-slate-200 mx-0.5" />
                  <button 
                    type="button"
                    onClick={onCloseView}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Tutup"
                    aria-label="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                {/* Info Card Static */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100/90 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        style={{ backgroundColor: viewingGroup.color || '#2563EB' }}
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base uppercase shrink-0 shadow-xs"
                      >
                        {viewingGroup.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                            Group Shift
                          </span>
                          {viewingGroup.color && (
                            <span 
                              style={getShiftBadgeStyle(viewingGroup.color)}
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold border truncate ${getShiftBadgeClasses(viewingGroup.color as any)}`}
                            >
                              {viewingGroup.color}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
                          {viewingGroup.name}
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                      {groupMembers.length} Karyawan
                    </span>
                  </div>

                  {/* Deskripsi Static */}
                  <div className="pt-2 border-t border-blue-100/60 grid grid-cols-1 gap-2 text-xs">
                    <div>
                      <span className="text-[10.5px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Keterangan / Deskripsi
                      </span>
                      <p className="text-slate-700 font-medium mt-0.5 text-xs sm:text-sm">
                        {viewingGroup.description || 'Tidak ada keterangan tambahan.'}
                      </p>
                    </div>

                    {memberDeptNames.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10.5px] font-semibold text-slate-400 block uppercase tracking-wider">
                          Departemen Terkait
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {memberDeptNames.map((dName, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-blue-50 border border-blue-200/80 text-blue-700 shadow-3xs">
                              {dName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Daftar Anggota Terdaftar */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        Daftar Anggota Karyawan ({groupMembers.length})
                      </span>
                    </div>

                    {groupMembers.length > 3 && (
                      <div className="relative w-full sm:w-56">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input 
                          type="text"
                          value={viewSearchQuery}
                          onChange={(e) => setViewSearchQuery(e.target.value)}
                          placeholder="Cari anggota..."
                          className="w-full h-7.5 pl-8 pr-7 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        {viewSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setViewSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* List Cards */}
                  {groupMembers.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <p className="text-xs text-slate-500 font-medium">Belum ada karyawan di dalam group ini.</p>
                    </div>
                  ) : displayedMembers.length === 0 ? (
                    <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <p className="text-xs text-slate-500">Tidak ada anggota yang cocok dengan "{viewSearchQuery}"</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-0.5">
                      {displayedMembers.map(emp => {
                        const dept = departments.find(d => d.id === emp.departmentId);
                        const deptDisplay = dept?.name || emp.departmentId || 'Umum';
                        const positionDisplay = getPositionName(emp.positionId) || 'Staff';

                        return (
                          <div 
                            key={emp.id}
                            className="bg-white rounded-2xl border border-slate-200/90 px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3 shadow-2xs hover:border-blue-300 transition-colors select-none"
                          >
                            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                              {/* Standardized Employee Avatar */}
                              <EmployeeAvatar employee={emp} size="md" />

                              {/* 3 Baris Identitas Karyawan Baku */}
                              <div className="min-w-0 flex-1">
                                {/* Baris 1: Departemen */}
                                <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={deptDisplay}>
                                  {deptDisplay}
                                </div>
                                {/* Baris 2: Nama Karyawan */}
                                <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate" title={emp.fullName}>
                                  {emp.fullName}
                                </div>
                                {/* Baris 3: Posisi / Jabatan */}
                                <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={positionDisplay}>
                                  {positionDisplay}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Single Action Full Width Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
                <Button
                  type="button"
                  onClick={onCloseView}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </>
  );
};

