import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Users, X, Search, UserX, Check } from 'lucide-react';
import { Employee, Department, ShiftGroupAssignment } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui';
import { EmployeeAvatar } from '../../../components/ui/EmployeeAvatar';
import { getPositionName } from '../../../services/positionService';

export interface ModalMemberSelectorProps {
  isOpen: boolean;
  activeGroupIdForMembers: string | null;
  onClose: () => void;
  modalGroupAssignments: ShiftGroupAssignment[];
  employees: Employee[];
  departments: Department[];
  memberDeptFilter: string;
  setMemberDeptFilter: (deptId: string) => void;
  memberSearchQuery: string;
  setMemberSearchQuery: (query: string) => void;
  onToggleEmployeeInGroup: (empId: string) => void;
  onBulkToggleFilteredEmployees: (filteredIds: string[], selectAll: boolean) => void;
}

export function ModalMemberSelector({
  isOpen,
  activeGroupIdForMembers,
  onClose,
  modalGroupAssignments,
  employees,
  departments,
  memberDeptFilter,
  setMemberDeptFilter,
  memberSearchQuery,
  setMemberSearchQuery,
  onToggleEmployeeInGroup,
  onBulkToggleFilteredEmployees,
}: ModalMemberSelectorProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle modal close
  const handleClose = () => {
    setIsSearchOpen(false);
    setMemberSearchQuery('');
    onClose();
  };

  if (!isOpen || !activeGroupIdForMembers) return null;

  const activeGroup = modalGroupAssignments.find(g => g.id === activeGroupIdForMembers);
  if (!activeGroup) return null;

  const currentSelectedIds = activeGroup.employeeIds || [];
  const groupNameDisplay = activeGroup.name || 'Group';

  // Karyawan yang sudah terdaftar di group shift lain dalam pola ini
  const assignedEmpIdsInOtherGroups = useMemo(() => {
    const ids = new Set<string>();
    modalGroupAssignments.forEach(g => {
      if (g.id !== activeGroupIdForMembers) {
        (g.employeeIds || []).forEach(empId => ids.add(empId));
      }
    });
    return ids;
  }, [modalGroupAssignments, activeGroupIdForMembers]);

  // Filter Karyawan: hanya yang aktif dan BELUM didaftarkan di group lain
  const availableEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (emp.status === 'Terminated' || emp.status === 'Inactive') return false;
      if (assignedEmpIdsInOtherGroups.has(emp.id)) return false;
      return true;
    });
  }, [employees, assignedEmpIdsInOtherGroups]);

  // Filter Karyawan Berdasarkan Pencarian & Dept
  const filteredEmployees = useMemo(() => {
    return availableEmployees.filter(emp => {
      if (memberDeptFilter !== 'ALL' && emp.departmentId !== memberDeptFilter) return false;
      if (memberSearchQuery.trim()) {
        const q = memberSearchQuery.toLowerCase();
        const nameMatch = emp.fullName.toLowerCase().includes(q);
        const nipMatch = (emp.employeeId || emp.nik || '').toLowerCase().includes(q);
        const posMatch = (emp.positionId || '').toLowerCase().includes(q);
        return nameMatch || nipMatch || posMatch;
      }
      return true;
    });
  }, [availableEmployees, memberDeptFilter, memberSearchQuery]);

  const filteredIds = filteredEmployees.map(e => e.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => currentSelectedIds.includes(id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      fixedHeight
      contentClassName="sm:max-w-xl flex flex-col"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header - Morphing Header Searchbar (Standard SPEC_HEADER_PAGE) */}
        <div className="h-16 px-4 sm:px-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          {isSearchOpen ? (
            <div className="flex items-center w-full gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder="Cari nama karyawan, NIK, jabatan, dept..."
                className="w-full bg-transparent border-0 ring-0 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 p-0 focus:ring-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setMemberSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors shrink-0"
                title="Tutup pencarian"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                    Pilih Anggota: {groupNameDisplay}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5 leading-normal truncate">
                    {currentSelectedIds.length} Karyawan Dipilih
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Cari Karyawan"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Filters & Bulk Select Bar */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[68%] no-scrollbar">
            <button
              type="button"
              onClick={() => setMemberDeptFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                memberDeptFilter === 'ALL'
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
                onClick={() => setMemberDeptFilter(d.id)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  memberDeptFilter === d.id
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
            onClick={() => onBulkToggleFilteredEmployees(filteredIds, !allFilteredSelected)}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer py-1 px-1.5 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {allFilteredSelected ? 'Batalkan Semua' : 'Pilih Semua'}
          </button>
        </div>

        {/* Employee List */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2.5 text-xs">
          {availableEmployees.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <UserX className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Semua karyawan sudah terdaftar di group lain</p>
              <p className="text-[10.5px] text-slate-400">Tidak ada karyawan yang tersedia untuk ditambahkan ke group ini.</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <UserX className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Tidak ada karyawan yang sesuai filter</p>
              <p className="text-[10.5px] text-slate-400">Coba ubah kata kunci pencarian atau filter departemen</p>
            </div>
          ) : (
            filteredEmployees.map((emp) => {
              const isSelected = currentSelectedIds.includes(emp.id);
              const dept = departments.find(d => d.id === emp.departmentId);
              const deptDisplay = dept?.name || emp.departmentId || 'Umum';
              const positionDisplay = getPositionName(emp.positionId) || 'Staff';

              return (
                <div
                  key={emp.id}
                  onClick={() => onToggleEmployeeInGroup(emp.id)}
                  className={`bg-white rounded-2xl border px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3 shadow-2xs transition-all cursor-pointer select-none group ${
                    isSelected 
                      ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-500/30 shadow-xs' 
                      : 'border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  {/* Left: Avatar + 3-Row Info Stack */}
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    <EmployeeAvatar employee={emp} size="md" />

                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={deptDisplay}>
                        {deptDisplay}
                      </div>
                      <div className={`font-bold text-xs sm:text-sm leading-snug truncate transition-colors ${
                        isSelected ? 'text-blue-950' : 'text-slate-900 group-hover:text-blue-600'
                      }`} title={emp.fullName}>
                        {emp.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={positionDisplay}>
                        {positionDisplay}
                      </div>
                    </div>
                  </div>

                  {/* Right: Check Circle */}
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
            variant="primary"
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            Selesai Memilih ({currentSelectedIds.length} Karyawan Dipilih)
          </Button>
        </div>
      </div>
    </Modal>
  );
}

