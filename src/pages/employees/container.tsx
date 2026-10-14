import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Employee } from '../../types';
import { EmployeeForm } from './form';
import { EmployeeList } from './list';
import { MyPresensiPage } from './my-presensi';
import { ComboboxOption } from '../../components/ui';
import { getInitialDefaultDocs } from './utils';
import { DEFAULT_DEPARTMENT_OPTIONS, DEFAULT_POSITION_OPTIONS } from './constants';
import { getAllFinancialComboboxOptions, STANDARD_DOCUMENTS, DEFAULT_PAYROLL_RULES } from '../../data/master';
import { useCompany } from '../../context/CompanyContext';
import { getPositionComboboxOptions, exportAndSavePosition, getPositionDetails } from '../../services/positionService';

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
    return <MyPresensiPage />;
  }

  const { isRegistered, requireCompanyRegistration } = useCompany();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    status: '',
    paymentMethod: '',
    documents: getInitialDefaultDocs()
  });
  const [search, setSearch] = useState('');
  
  // Collapse state for form sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(ADD_MODE_COLLAPSED_SECTIONS);

  const handleAddNew = () => {
    setFormData({ status: '', paymentMethod: '', documents: getInitialDefaultDocs() });
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
    () => {
      if (!search) return db.employees.toArray();
      const lowerSearch = search.toLowerCase();
      return db.employees.filter(emp => 
        emp.fullName.toLowerCase().includes(lowerSearch) ||
        emp.employeeId.toLowerCase().includes(lowerSearch) ||
        (emp.bankName || '').toLowerCase().includes(lowerSearch) ||
        (emp.city || '').toLowerCase().includes(lowerSearch)
      ).toArray();
    },
    [search]
  );

  const allRulesDb = useLiveQuery(() => db.payrollRules.toArray());
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
        const positionDetails = getPositionDetails(finalPositionId);
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
      setFormData({ status: '', paymentMethod: '', documents: getInitialDefaultDocs() });
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Gagal menyimpan data karyawan');
    }
  };

  const handleEdit = (employee: Employee) => {
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
      <EmployeeForm
        formData={formData}
        setFormData={setFormData}
        editingEmployeeId={editingEmployeeId}
        onSave={handleSave}
        onCancel={() => {
          setShowAddForm(false);
          setEditingEmployeeId(null);
          setFormData({ status: '', paymentMethod: '', documents: getInitialDefaultDocs() });
          setCollapsedSections(ADD_MODE_COLLAPSED_SECTIONS);
        }}
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
        allowanceOptions={allowanceOptions}
        documentOptions={documentOptions}
        departmentOptions={departmentOptions}
        positionOptions={positionOptions}
        bankOptions={bankOptions}
        bpjsOptions={bpjsOptions}
        taxOptions={taxOptions}
      />
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
