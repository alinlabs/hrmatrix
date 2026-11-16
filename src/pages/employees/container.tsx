import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Employee, PayrollRule } from '../../types';
import { EmployeeList } from './list';
import { ComboboxOption } from '../../components/ui';
import { RouteLoadingIndicator } from '../../components/ui/route-loading-indicator';
import { lazyWithRetry } from '../../utils/lazy-with-retry';
import { getInitialDefaultDocs } from './utils';
import { DEFAULT_DEPARTMENT_OPTIONS } from './constants';
import { getAllFinancialComboboxOptions, STANDARD_DOCUMENTS, DEFAULT_PAYROLL_RULES } from '../../data/master';
import { useCompany } from '../../context/company-context';
import {
  getPositionComboboxOptions,
  exportAndSavePosition,
  getPositionDetailsAsync,
  preloadJobTemplates,
} from '../../services/position-service';

const EmployeeForm = lazyWithRetry(() => import('./form').then(m => ({ default: m.EmployeeForm })));
const MyPresensiPage = lazyWithRetry(() => import('./my-presensi').then(m => ({ default: m.MyPresensiPage })));

const ADD_MODE_COLLAPSED_SECTIONS: Record<string, boolean> = {
  pribadi: false,
  alamat: true,
  kontak_darurat: true,
  pekerjaan: true,
  bank: true,
  gaji: true,
  dokumen: true,
  tax_profile: true,
  bpjs_kesehatan: true,
  bpjs_ketenagakerjaan: true,
};

const EDIT_MODE_COLLAPSED_SECTIONS: Record<string, boolean> = {
  pribadi: true,
  alamat: true,
  kontak_darurat: true,
  pekerjaan: true,
  bank: true,
  gaji: true,
  dokumen: true,
  tax_profile: true,
  bpjs_kesehatan: true,
  bpjs_ketenagakerjaan: true,
};

export function EmployeesContainer() {
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get('code') || searchParams.get('qr');

  // Jika URL adalah /employees?code=... maka langsung render tampilan murni My Presensi
  if (codeParam) {
    return (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <MyPresensiPage />
      </Suspense>
    );
  }

  return <EmployeesWorkspace />;
}

function EmployeesWorkspace() {
  const { requireCompanyRegistration } = useCompany();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    status: undefined,
    paymentMethod: '',
    documents: getInitialDefaultDocs()
  });
  const [search, setSearch] = useState('');
  
  // Collapse state for form sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(ADD_MODE_COLLAPSED_SECTIONS);

  const handleAddNew = () => {
    preloadJobTemplates();
    setFormData({ status: undefined, paymentMethod: '', documents: getInitialDefaultDocs() });
    setEditingEmployeeId(null);
    setCollapsedSections(ADD_MODE_COLLAPSED_SECTIONS);
    setShowAddForm(true);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const employees = useLiveQuery(
    async () => {
      const list = !search
        ? await db.employees.toArray()
        : await db.employees
            .filter(emp =>
              emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
              emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
              (emp.bankName || '').toLowerCase().includes(search.toLowerCase()) ||
              (emp.city || '').toLowerCase().includes(search.toLowerCase())
            )
            .toArray();

      return [...list].sort((a, b) => {
        const aIsPrimary = a.id === 'emp-001' || a.employeeId === 'EMP-001';
        const bIsPrimary = b.id === 'emp-001' || b.employeeId === 'EMP-001';
        if (aIsPrimary && !bIsPrimary) return -1;
        if (!aIsPrimary && bIsPrimary) return 1;
        return (a.employeeId || a.id || '').localeCompare(b.employeeId || b.id || '', 'id', { numeric: true });
      });
    },
    [search]
  );

  // Only subscribe to payrollRules & build heavy form combobox options when the form is open
  const allRulesDb = useLiveQuery(
    () => (showAddForm ? db.payrollRules.toArray() : Promise.resolve([] as PayrollRule[])),
    [showAddForm]
  );

  const formSelectOptions = useMemo(() => {
    if (!showAddForm) {
      return {
        bpjsOptions: [] as ComboboxOption[],
        taxOptions: [] as ComboboxOption[],
        allowanceOptions: [] as ComboboxOption[],
        documentOptions: [] as ComboboxOption[],
        departmentOptions: [] as ComboboxOption[],
        positionOptions: [] as ComboboxOption[],
        bankOptions: [] as ComboboxOption[],
      };
    }

    const allRules = (allRulesDb && allRulesDb.length > 0) ? allRulesDb : DEFAULT_PAYROLL_RULES;
    const allowanceTemplates = allRules?.filter(r => r.category === 'Allowance') || [];
    const bpjsTemplates = allRules?.filter(r => (r.category as string) === 'BPJS' || r.category === 'BPJS Health' || r.category === 'BPJS Employment' || (r.category as string) === 'Jamsostek') || [];
    const taxTemplates = allRules?.filter(r => r.category === 'Tax' || (r.category as string) === 'Pajak' || (r.category as string) === 'PPh21') || [];

    const bpjsOptions: ComboboxOption[] = bpjsTemplates.map(t => ({
      value: t.id,
      label: t.name || t.nama || ''
    }));

    const taxOptions: ComboboxOption[] = taxTemplates.map(t => ({
      value: t.id,
      label: t.name || t.nama || ''
    }));

    const allowanceOptions: ComboboxOption[] = allowanceTemplates.map(t => {
      let sublabel = '';
      const isPercent = t.metode_perhitungan === 'persentase' || t.ruleType === 'Percentage' || t.dasar_perhitungan === 'Gaji Pokok';
      const isDaily = t.metode_perhitungan === 'harian' || t.ruleType === 'DailyWage';
      const isQuarterly = t.frekuensi_pembayaran === 'triwulanan';

      if (isPercent) {
        const pct = t.nilai || t.employeeShare || 0;
        sublabel = `${pct}% dari ${t.dasar_perhitungan || 'Gaji Pokok'}`;
      } else if (isDaily) {
        const dailyVal = t.nilai || t.unitRate || t.fixedAmount || 0;
        sublabel = `Rp ${new Intl.NumberFormat('id-ID').format(dailyVal)} / hari kehadiran`;
      } else if (isQuarterly) {
        const qVal = t.nilai || t.fixedAmount || 0;
        sublabel = `Triwulanan - Rp ${new Intl.NumberFormat('id-ID').format(qVal)}`;
      } else if (t.fixedAmount || t.nilai) {
        sublabel = `Nominal Tetap - Rp ${new Intl.NumberFormat('id-ID').format(t.nilai || t.fixedAmount || 0)}`;
      }

      return {
        value: t.id,
        label: t.name || t.nama || '',
        sublabel: sublabel || undefined,
        amount: isPercent ? undefined : (t.fixedAmount || t.nilai || 0),
        data: t
      };
    });

    const documentOptions: ComboboxOption[] = Array.from(
      new Set([
        ...STANDARD_DOCUMENTS,
        ...(employees?.flatMap(e => e.documents?.map(d => d.name) || []) || [])
      ])
    ).filter(Boolean).map(name => ({ value: name, label: name }));

    const departmentOptions: ComboboxOption[] = Array.from(
      new Set([
        ...DEFAULT_DEPARTMENT_OPTIONS,
        ...(employees?.map(e => e.departmentId).filter(Boolean) as string[]) || []
      ])
    ).map(dept => ({ value: dept, label: dept }));

    const positionOptions: ComboboxOption[] = getPositionComboboxOptions();
    const bankOptions: ComboboxOption[] = getAllFinancialComboboxOptions(
      (employees?.map(e => e.bankName).filter(Boolean) as string[]) || []
    );

    return {
      bpjsOptions,
      taxOptions,
      allowanceOptions,
      documentOptions,
      departmentOptions,
      positionOptions,
      bankOptions,
    };
  }, [showAddForm, allRulesDb, employees]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu sebelum dapat menyimpan data karyawan ke database.'
    })) {
      return;
    }

    try {
      // Auto export / sync position if provided
      let finalPositionId = formData.positionId || '';
      let finalDepartmentId = formData.departmentId || 'General';
      if (finalPositionId) {
        const positionDetails = await getPositionDetailsAsync(finalPositionId);
        const synced = await exportAndSavePosition(finalPositionId, {
          category: formData.category || positionDetails?.category,
          department: formData.departmentId || positionDetails?.department,
          division: formData.division || positionDetails?.division,
          level: formData.level || positionDetails?.level,
        });
        finalPositionId = synced.id;
        if (!formData.departmentId || formData.departmentId === 'General') {
          finalDepartmentId = synced.department;
        }
      }

      const now = new Date().toISOString();
      const employeeData = {
        ...formData,
        positionId: finalPositionId,
        departmentId: finalDepartmentId,
        updatedAt: now,
      } as Employee;

      if (editingEmployeeId) {
        await db.employees.put(employeeData);
      } else {
        employeeData.id = crypto.randomUUID();
        employeeData.createdAt = now;
        await db.employees.add(employeeData);
      }

      setShowAddForm(false);
      setEditingEmployeeId(null);
      setFormData({ status: undefined, paymentMethod: '', documents: getInitialDefaultDocs() });
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Gagal menyimpan data karyawan');
    }
  };

  const handleEdit = (employee: Employee) => {
    preloadJobTemplates();
    const hasTax = !!(employee.taxStatus || employee.npwp || employee.taxProfile?.ptkpStatus);
    setFormData({
      ...employee,
      isTaxActive: employee.isTaxActive ?? hasTax
    });
    setEditingEmployeeId(employee.id);
    setCollapsedSections(EDIT_MODE_COLLAPSED_SECTIONS);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk mengelola data.'
    })) {
      return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus karyawan ini? Data yang dihapus tidak dapat dikembalikan.')) {
      await db.employees.delete(id);
    }
  };

  const handleExportCSV = () => {
    if (!employees || employees.length === 0) return;
    
    const headers = ['ID', 'Nama Lengkap', 'Email', 'Telepon', 'Posisi', 'Departemen', 'Status', 'Gaji Pokok', 'Bank', 'No Rekening'];
    const csvData = employees.map(emp => [
      emp.employeeId,
      emp.fullName,
      emp.email,
      emp.phone || '',
      emp.positionId || '',
      emp.departmentId || '',
      emp.status,
      emp.basicSalary || 0,
      emp.bankName || '',
      emp.bankAccount || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Data_Karyawan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (showAddForm) {
    return (
      <Suspense fallback={<RouteLoadingIndicator />}>
        <EmployeeForm
          formData={formData}
          setFormData={setFormData}
          editingEmployeeId={editingEmployeeId}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            setEditingEmployeeId(null);
            setFormData({ status: undefined, paymentMethod: '', documents: getInitialDefaultDocs() });
            setCollapsedSections(ADD_MODE_COLLAPSED_SECTIONS);
          }}
          collapsedSections={collapsedSections}
          toggleSection={toggleSection}
          allowanceOptions={formSelectOptions.allowanceOptions}
          documentOptions={formSelectOptions.documentOptions}
          departmentOptions={formSelectOptions.departmentOptions}
          positionOptions={formSelectOptions.positionOptions}
          bankOptions={formSelectOptions.bankOptions}
          bpjsOptions={formSelectOptions.bpjsOptions}
          taxOptions={formSelectOptions.taxOptions}
        />
      </Suspense>
    );
  }

  return (
    <EmployeeList
      employees={employees || []}
      search={search}
      setSearch={setSearch}
      onAdd={handleAddNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onExportCSV={handleExportCSV}
    />
  );
}
