import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, Download, Folder, Edit, Trash2, CreditCard, MapPin, X, 
  ExternalLink, FileText, CheckCircle2, AlertCircle, LayoutList, Table, 
  Network, Users, Building2, ChevronRight, Briefcase, Banknote,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Input } from '../../components/ui';
import { Employee } from '../../types';
import { formatFullAddress } from './utils';
import { getPositionName, getDepartmentName } from '../../services/positionService';
import { DesktopHeaderActions, MobileHeaderActions, PageHeaderTitle, PageHeaderSearch } from '../../context/MobileNavContext';
import { CardEmployeeItem } from './card-employee-item';
import { EmployeeStructureModal } from './modal-employee-structure';
import { EmployeeDetailModal } from './modal-employee-detail';
import { EmptyEmployeeCard } from './empty-employee-card';

interface EmployeeListProps {
  employees: Employee[];
  search: string;
  setSearch: (val: string) => void;
  onAdd: () => void;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
  onExportCSV: () => void;
}

export function EmployeeList({
  employees, search, setSearch, onAdd, onEdit, onDelete, onExportCSV
}: EmployeeListProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDetailEmployee, setSelectedDetailEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Inactive'>('ALL');

  // Handle URL query parameter ?qr=... (e.g. emp-003 or emp-003/3224263748xxxxx)
  useEffect(() => {
    const qrParam = searchParams.get('qr');
    if (!qrParam || !employees || employees.length === 0) return;

    const lowerQr = qrParam.toLowerCase().trim();
    const matched = employees.find(e => {
      if (lowerQr.includes('/')) {
        const parts = lowerQr.split('/');
        const idPart = parts[0]?.trim();
        const nikPart = parts[1]?.trim();

        const matchId = (e.employeeId && e.employeeId.toLowerCase() === idPart) || (e.id && e.id.toLowerCase() === idPart);
        const matchNik = e.nik && e.nik.toLowerCase() === nikPart;

        if (idPart && nikPart) {
          return matchId && matchNik;
        }
        return matchId || matchNik;
      }

      return (
        (e.employeeId && e.employeeId.toLowerCase() === lowerQr) ||
        (e.id && e.id.toLowerCase() === lowerQr) ||
        (e.nik && e.nik.toLowerCase() === lowerQr)
      );
    });

    if (matched) {
      setSelectedDetailEmployee(matched);
    }
  }, [searchParams, employees]);

  // Filtered employees by status if filter active
  const filteredEmployees = useMemo(() => {
    if (statusFilter === 'ALL') return employees;
    return employees.filter(e => e.status === statusFilter);
  }, [employees, statusFilter]);

  // Group employees by department for structure modal
  const departmentGroups = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    employees.forEach(emp => {
      const dept = getDepartmentName(emp.departmentId, emp.positionId) || 'Umum';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(emp);
    });
    return groups;
  }, [employees]);

  const headerActionsContent = (
    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
      {/* 1. Icon Search (No background card, transparent with hover) */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer flex items-center justify-center relative ${
          search ? 'text-blue-600 bg-blue-50/50' : ''
        }`}
        title="Cari Karyawan"
      >
        <Search className="w-5 h-5" />
        {search && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* 2. Blue Outline People Plus Icon */}
      <button
        type="button"
        onClick={onAdd}
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-blue-200 text-blue-600 bg-blue-50/10 hover:bg-blue-50 active:scale-95 flex items-center justify-center shrink-0 transition-all cursor-pointer"
        title="Tambah Karyawan Baru"
      >
        <UserPlus className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full">
      <PageHeaderTitle title="Daftar Karyawan" subtitle={`${filteredEmployees.length} Karyawan`} />

      {/* Standard Header Action Cards (visible when search is not open) */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {/* Header Search Mode (when active, replaces top header completely) */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari nama, NIK, jabatan, atau bank..."
        />
      )}

      {/* Active Search & Filter Indicators */}
      {(search || statusFilter !== 'ALL') && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 pb-1">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Filter Aktif:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
              Pencarian: "{search}"
              <button
                type="button"
                onClick={() => setSearch('')}
                className="hover:text-blue-900 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
              Status: {statusFilter === 'Active' ? 'Aktif' : 'Non-Aktif'}
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className="hover:text-emerald-900 cursor-pointer"
                title="Hapus filter status"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
            }}
            className="text-[11px] text-slate-500 hover:text-rose-600 underline ml-1 cursor-pointer font-medium"
          >
            Reset Semua
          </button>
        </div>
      )}

      {/* Stylish Action Card: Tunjangan | Struktural */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-2xs">
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          {/* Tunjangan Button */}
          <button
            type="button"
            onClick={() => navigate('/regulation')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-emerald-700"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-emerald-700 transition-colors">
                Tunjangan
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
                Regulasi & BPJS
              </div>
            </div>
          </button>

          {/* Job Desk Button */}
          <button
            type="button"
            onClick={() => navigate('/job-desk')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-blue-700"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-blue-700 transition-colors">
                Job Desk
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
                Peran & Struktural
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Dashed Add Employee Card Button (Only shown when there are employees in the system) */}
      {employees && employees.length > 0 && (
        <button
          type="button"
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2.5 py-4 sm:py-5 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 rounded-2xl text-slate-500 hover:text-blue-600 transition-all cursor-pointer group active:scale-[0.99] shadow-2xs"
        >
          <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="text-sm font-semibold">Tambah Karyawan</span>
        </button>
      )}

      <div>
        {/* LIST CARD VIEW (Matching Exact Mockup) */}
        {viewMode === 'cards' ? (
          <div className="space-y-2.5 sm:space-y-3">
            {!filteredEmployees || filteredEmployees.length === 0 ? (
              <EmptyEmployeeCard
                onAdd={onAdd}
                search={search}
                onClearSearch={() => setSearch('')}
              />
            ) : (
              filteredEmployees.map((emp) => (
                <CardEmployeeItem
                  key={emp.id}
                  employee={emp}
                  onViewDetail={setSelectedDetailEmployee}
                />
              ))
            )}
          </div>
        ) : (
          /* TABLE VIEW (Dense Data View) */
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Employee ID</th>
                  <th className="px-5 py-3 font-medium">Nama & Kontak</th>
                  <th className="px-5 py-3 font-medium">Alamat Domisili</th>
                  <th className="px-5 py-3 font-medium">Departemen / Posisi</th>
                  <th className="px-5 py-3 font-medium">Metode & Rekening Bank</th>
                  <th className="px-5 py-3 font-medium text-right">Gaji Pokok</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!filteredEmployees || filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 sm:p-6 bg-slate-50/50">
                      <EmptyEmployeeCard
                        onAdd={onAdd}
                        search={search}
                        onClearSearch={() => setSearch('')}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    return (
                      <tr 
                        key={emp.id} 
                        onClick={() => setSelectedDetailEmployee(emp)}
                        className="bg-white border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer"
                      >
                        <td className="px-5 py-3.5 font-medium text-slate-900">{emp.employeeId}</td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{emp.fullName}</div>
                          <div className="text-xs text-slate-500">{emp.email} • {emp.phone || '-'}</div>
                        </td>
                        <td className="px-5 py-3.5 max-w-xs">
                          <div className="text-xs text-slate-800 line-clamp-2" title={formatFullAddress(emp)}>
                            {formatFullAddress(emp)}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-slate-800 font-medium">{getPositionName(emp.positionId) || '-'}</div>
                          <div className="text-xs text-slate-500">{getDepartmentName(emp.departmentId, emp.positionId) || '-'}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs">
                            <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{emp.bankName || 'BCA'} • {emp.bankAccount || '-'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {emp.paymentMethod || 'Transfer Bank'} {emp.bankAccountHolder && emp.bankAccountHolder.trim().toLowerCase() !== (emp.fullName || '').trim().toLowerCase() ? `(a/n ${emp.bankAccountHolder})` : ''}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-slate-800">
                          <div>Rp {new Intl.NumberFormat('id-ID').format(emp.basicSalary || 0)}</div>
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5 flex items-center justify-end gap-1">
                            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px]">
                              {emp.taxProfile?.ptkpStatus || emp.taxStatus || 'TK/0'}
                            </span>
                            <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded text-[10px]">
                              {emp.taxProfile?.taxMethod || 'Gross'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-xs text-blue-600 hover:bg-blue-50" 
                              onClick={() => setSelectedDetailEmployee(emp)}
                            >
                              Detail
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Structure Modal */}
      {isStructureModalOpen && (
        <EmployeeStructureModal
          isOpen={isStructureModalOpen}
          onClose={() => setIsStructureModalOpen(false)}
          departmentGroups={departmentGroups}
          onSelectEmployee={onEdit}
        />
      )}

      {/* Detail Karyawan Modal */}
      {selectedDetailEmployee && (
        <EmployeeDetailModal
          isOpen={!!selectedDetailEmployee}
          onClose={() => setSelectedDetailEmployee(null)}
          employee={selectedDetailEmployee}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
