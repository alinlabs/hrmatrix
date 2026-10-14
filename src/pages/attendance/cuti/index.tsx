import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import { useScrollLock } from '../../../hooks/useScrollLock';

import { Leave, Employee, Department, Position, LeaveCategory, EmployeeLeaveQuota, LeaveTypePolicy } from '../../../types';
import { 
  addLeave, 
  updateLeave, 
  deleteLeave, 
  DEFAULT_LEAVE_POLICIES, 
  getLeavePolicies,
  addLeavePolicy,
  updateLeavePolicy,
  deleteLeavePolicy,
  calculateAllEmployeesLeaveSummary, 
  getSavedLeaveQuotas, 
  saveEmployeeLeaveQuotaRecord,
  cleanupLegacySickLeaves,
  EmployeeLeaveSummary
} from '../../../services/leaveService';

// Sub-views
import { ViewPengajuan } from './view-pengajuan';
import { ViewKuota } from './view-kuota';
import { ViewKebijakan } from './view-kebijakan';

// Modals
import { ModalFilterLeave } from './modal-filter-leave';
import { ModalFilterQuota } from './modal-filter-quota';
import { ModalPengaturanCuti } from './modal-pengaturan-cuti';
import { ModalKebijakanCuti } from './modal-kebijakan-cuti';
import { ModalEmployeeBalance } from './modal-employee-balance';
import { ModalLeaveDetail } from './modal-leave-detail';
import { ModalPolicyDetail } from './modal-policy-detail';
import { ModalFormPengajuan } from './modal-form-pengajuan';
import { ModalFormKuota } from './modal-form-kuota';

export function PengajuanCuti() {
  const [activeSubTab, setActiveSubTab] = useState<'pengajuan' | 'kuota' | 'kebijakan'>('pengajuan');

  const leaves = useLiveQuery(async () => {
    const allLeaves = await db.leaves.toArray();
    return allLeaves.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }) || [];
  const employees = useLiveQuery(() => db.employees.toArray()) || [];
  const departments = useLiveQuery(() => db.departments.toArray()) || [];
  const positions = useLiveQuery(() => db.positions.toArray()) || [];

  const [savedQuotas, setSavedQuotas] = useState<Record<string, EmployeeLeaveQuota>>({});
  const [leavePolicies, setLeavePolicies] = useState<LeaveTypePolicy[]>(DEFAULT_LEAVE_POLICIES);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeaveTypePolicy | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [expandedPolicyIds, setExpandedPolicyIds] = useState<string[]>([]);
  const [zoomOffset, setZoomOffset] = useState<number>(0);

  const toggleExpandPolicy = (policyId: string) => {
    setExpandedPolicyIds(prev =>
      prev.includes(policyId) ? prev.filter(id => id !== policyId) : [...prev, policyId]
    );
  };
  const handleCollapseAll = () => setExpandedPolicyIds([]);
  const handleExpandAll = () => setExpandedPolicyIds(leavePolicies.map(p => p.id));
  const handleZoomIn = () => setZoomOffset(prev => Math.min(prev + 1, 4));
  const handleZoomOut = () => setZoomOffset(prev => Math.max(prev - 1, -4));
  const handleResetZoom = () => setZoomOffset(0);

  useEffect(() => {
    cleanupLegacySickLeaves();
    loadSavedQuotas();
    loadLeavePolicies();
  }, []);

  const loadSavedQuotas = async () => {
    const q = await getSavedLeaveQuotas();
    setSavedQuotas(q);
  };

  const loadLeavePolicies = async () => {
    const p = await getLeavePolicies();
    setLeavePolicies(p);
  };

  const handleSavePolicy = async (policy: Omit<LeaveTypePolicy, 'id'> & { id?: string }) => {
    if (policy.id) {
      await updateLeavePolicy(policy.id, policy);
    } else {
      await addLeavePolicy(policy);
    }
    await loadLeavePolicies();
  };

  const handleDeletePolicy = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jenis kebijakan cuti ini?')) {
      await deleteLeavePolicy(id);
      await loadLeavePolicies();
    }
  };

  const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
  const departmentMap = useMemo(() => new Map(departments.map(d => [d.id, d.name])), [departments]);
  const positionMap = useMemo(() => new Map(positions.map(p => [p.id, p.name])), [positions]);

  const employeeLeaveSummaries = useMemo(() => {
    return calculateAllEmployeesLeaveSummary(employees, leaves, savedQuotas, selectedYear, leavePolicies);
  }, [employees, leaves, savedQuotas, selectedYear, leavePolicies]);

  // Tab 1: Pengajuan
  const [searchLeave, setSearchLeave] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const hasActiveFilters = filterType !== 'all' || filterStatus !== 'all' || filterDept !== 'all';
  const handleResetFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setFilterDept('all');
  };

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Tab 2: Kuota
  const [searchQuota, setSearchQuota] = useState('');
  const [filterDeptQuota, setFilterDeptQuota] = useState<string>('all');
  const [filterStatusQuota, setFilterStatusQuota] = useState<'all' | 'remaining' | 'exhausted'>('all');
  const [isSearchQuotaOpen, setIsSearchQuotaOpen] = useState(false);
  const [isFilterQuotaModalOpen, setIsFilterQuotaModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const searchQuotaInputRef = useRef<HTMLInputElement>(null);
  const currentYear = new Date().getFullYear();
  const hasActiveFiltersQuota = filterDeptQuota !== 'all' || filterStatusQuota !== 'all' || selectedYear !== currentYear;
  
  const handleResetFiltersQuota = () => {
    setFilterDeptQuota('all');
    setFilterStatusQuota('all');
    setSelectedYear(currentYear);
  };

  useEffect(() => {
    if (isSearchQuotaOpen) {
      setTimeout(() => searchQuotaInputRef.current?.focus(), 50);
    }
  }, [isSearchQuotaOpen]);

  // Forms and details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [selectedLeaveDetail, setSelectedLeaveDetail] = useState<Leave | null>(null);
  const [selectedEmployeeBalance, setSelectedEmployeeBalance] = useState<EmployeeLeaveSummary | null>(null);
  const [selectedPolicyDetail, setSelectedPolicyDetail] = useState<LeaveTypePolicy | null>(null);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'Tahunan' as LeaveCategory,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    duration: 1,
    reason: '',
    status: 'Approved' as Leave['status'],
  });

  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [editingQuotaEmp, setEditingQuotaEmp] = useState<EmployeeLeaveSummary | null>(null);
  const [quotaFormData, setQuotaFormData] = useState({
    annualQuota: 12,
    carryForward: 0,
    adjustedQuota: 0,
    notes: ''
  });

  useScrollLock(
    isModalOpen || 
    isQuotaModalOpen || 
    isFilterModalOpen || 
    isFilterQuotaModalOpen || 
    isSettingsModalOpen || 
    isPolicyModalOpen || 
    Boolean(selectedLeaveDetail) || 
    Boolean(selectedEmployeeBalance) || 
    Boolean(selectedPolicyDetail)
  );

  const handleSaveLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      alert('Silakan pilih karyawan');
      return;
    }
    
    if (editingLeave) {
      await updateLeave(editingLeave.id, formData);
    } else {
      await addLeave(formData);
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteLeave = async (id: string) => {
    if (confirm('Hapus pengajuan cuti/izin ini?')) {
      await deleteLeave(id);
    }
  };

  const handleOpenEditQuota = (summary: EmployeeLeaveSummary) => {
    setEditingQuotaEmp(summary);
    setQuotaFormData({
      annualQuota: summary.annualQuota,
      carryForward: summary.carryForward,
      adjustedQuota: summary.adjustedQuota,
      notes: summary.notes || ''
    });
    setIsQuotaModalOpen(true);
  };

  const handleSaveQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuotaEmp) return;

    await saveEmployeeLeaveQuotaRecord({
      id: `${editingQuotaEmp.employeeId}_${selectedYear}`,
      employeeId: editingQuotaEmp.employeeId,
      year: selectedYear,
      annualQuota: Number(quotaFormData.annualQuota) || 0,
      carryForward: Number(quotaFormData.carryForward) || 0,
      adjustedQuota: Number(quotaFormData.adjustedQuota) || 0,
      notes: quotaFormData.notes.trim()
    });
    await loadSavedQuotas();
    setIsQuotaModalOpen(false);
    alert(`Kuota cuti tahun ${selectedYear} untuk ${editingQuotaEmp.employeeName} berhasil diperbarui!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': 
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Disetujui</span>;
      case 'Rejected': 
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">Ditolak</span>;
      default: 
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">Menunggu</span>;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {activeSubTab === 'pengajuan' && (
        <ViewPengajuan
          leaves={leaves}
          employees={employees}
          employeeMap={employeeMap}
          positionMap={positionMap}
          departmentMap={departmentMap}
          onSelectSubTab={setActiveSubTab}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          searchLeave={searchLeave}
          setSearchLeave={setSearchLeave}
          searchInputRef={searchInputRef}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterDept={filterDept}
          setFilterDept={setFilterDept}
          setIsFilterModalOpen={setIsFilterModalOpen}
          hasActiveFilters={hasActiveFilters}
          handleResetFilters={handleResetFilters}
          setIsModalOpen={() => {
            setEditingLeave(null);
            setFormData({
              employeeId: '',
              leaveType: 'Tahunan' as LeaveCategory,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              duration: 1,
              reason: '',
              status: 'Approved',
            });
            setIsModalOpen(true);
          }}
          setSelectedLeaveDetail={setSelectedLeaveDetail}
          handleDeleteLeave={handleDeleteLeave}
          getStatusBadge={getStatusBadge}
        />
      )}

      {activeSubTab === 'kuota' && (
        <ViewKuota
          employees={employees}
          employeeLeaveSummaries={employeeLeaveSummaries}
          leavePolicies={leavePolicies}
          departmentMap={departmentMap}
          positionMap={positionMap}
          onSelectSubTab={setActiveSubTab}
          isSearchQuotaOpen={isSearchQuotaOpen}
          setIsSearchQuotaOpen={setIsSearchQuotaOpen}
          searchQuota={searchQuota}
          setSearchQuota={setSearchQuota}
          searchQuotaInputRef={searchQuotaInputRef}
          filterDeptQuota={filterDeptQuota}
          setFilterDeptQuota={setFilterDeptQuota}
          filterStatusQuota={filterStatusQuota}
          setFilterStatusQuota={setFilterStatusQuota}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          currentYear={currentYear}
          setIsFilterQuotaModalOpen={setIsFilterQuotaModalOpen}
          hasActiveFiltersQuota={hasActiveFiltersQuota}
          handleResetFiltersQuota={handleResetFiltersQuota}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          handleOpenEditQuota={handleOpenEditQuota}
          setSelectedEmployeeBalance={setSelectedEmployeeBalance}
          expandedPolicyIds={expandedPolicyIds}
          setExpandedPolicyIds={setExpandedPolicyIds}
          zoomOffset={zoomOffset}
          setZoomOffset={setZoomOffset}
          handleCollapseAll={handleCollapseAll}
          handleExpandAll={handleExpandAll}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          toggleExpandPolicy={toggleExpandPolicy}
        />
      )}

      {activeSubTab === 'kebijakan' && (
        <ViewKebijakan
          leavePolicies={leavePolicies}
          onSelectSubTab={setActiveSubTab}
          setIsPolicyModalOpen={setIsPolicyModalOpen}
          setEditingPolicy={setEditingPolicy}
          setSelectedPolicyDetail={setSelectedPolicyDetail}
          handleDeletePolicy={handleDeletePolicy}
        />
      )}

      <ModalFormPengajuan 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        editingLeave={editingLeave}
        employees={employees}
        departments={departments}
        leavePolicies={leavePolicies}
        employeeLeaveSummaries={employeeLeaveSummaries}
        selectedYear={selectedYear}
        handleSaveLeave={handleSaveLeave}
      />

      <ModalFormKuota 
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        editingQuotaEmp={editingQuotaEmp}
        quotaFormData={quotaFormData}
        setQuotaFormData={setQuotaFormData}
        handleSaveQuota={handleSaveQuota}
      />

      <ModalFilterLeave
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterDept={filterDept}
        setFilterDept={setFilterDept}
        departments={departments}
        hasActiveFilters={hasActiveFilters}
        onReset={handleResetFilters}
      />

      <ModalFilterQuota
        isOpen={isFilterQuotaModalOpen}
        onClose={() => setIsFilterQuotaModalOpen(false)}
        filterDept={filterDeptQuota}
        setFilterDept={setFilterDeptQuota}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        filterStatus={filterStatusQuota}
        setFilterStatus={setFilterStatusQuota}
        departments={departments}
        hasActiveFilters={hasActiveFiltersQuota}
        onReset={handleResetFiltersQuota}
      />

      <ModalPengaturanCuti
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <ModalKebijakanCuti
        isOpen={isPolicyModalOpen}
        onClose={() => {
          setIsPolicyModalOpen(false);
          setEditingPolicy(null);
        }}
        policyToEdit={editingPolicy}
        onSave={handleSavePolicy as any}
      />
      
      <ModalLeaveDetail
        isOpen={!!selectedLeaveDetail}
        onClose={() => setSelectedLeaveDetail(null)}
        leave={selectedLeaveDetail}
        employees={employees}
      />
      
      <ModalEmployeeBalance
        isOpen={!!selectedEmployeeBalance}
        onClose={() => setSelectedEmployeeBalance(null)}
        employeeSummary={selectedEmployeeBalance!}
        leavePolicies={leavePolicies}
      />

      <ModalPolicyDetail
        isOpen={!!selectedPolicyDetail}
        onClose={() => setSelectedPolicyDetail(null)}
        policy={selectedPolicyDetail!}
        onEdit={(policy) => {
          setEditingPolicy(policy);
          setIsPolicyModalOpen(true);
        }}
        onDelete={async (id) => {
          await handleDeletePolicy(id);
          setSelectedPolicyDetail(null);
        }}
      />
    </div>
  );
}
