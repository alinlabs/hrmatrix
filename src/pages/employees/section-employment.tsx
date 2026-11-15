import React from 'react';
import { Input, Select, ComboboxInput, ComboboxOption } from '../../components/ui';
import { Employee } from '../../types';
import { getPositionName, getDepartmentName } from '../../services/positionService';
import { EMPLOYEE_TYPE_OPTIONS, mapContractTypeToEmployeeType } from './constants';
import { formatDateDisplay } from './utils';

export interface EmploymentSectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  positionOptions: ComboboxOption[];
  categoryOptions: ComboboxOption[];
  levelOptions: ComboboxOption[];
  effectiveDepartmentOptions: ComboboxOption[];
  divisionOptions: ComboboxOption[];
  handlePositionChange: (val: string) => Promise<void>;
  handlePositionSelect: (option: ComboboxOption) => Promise<void>;
  handleLevelChange: (newLevel: string) => void;
}

export function EmploymentSection({
  formData,
  setFormData,
  positionOptions,
  categoryOptions,
  levelOptions,
  effectiveDepartmentOptions,
  divisionOptions,
  handlePositionChange,
  handlePositionSelect,
  handleLevelChange
}: EmploymentSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* Row 1: ID Karyawan (Full Width) */}
      <div className="col-span-2">
        <Input 
          label="Nomor Induk Kepegawaian" 
          required 
          value={formData.employeeId || ''} 
          onChange={e => setFormData({...formData, employeeId: e.target.value})} 
          placeholder="" 
        />
      </div>

      {/* Row 2: Posisi (Full Width) */}
      <div className="col-span-2">
        <ComboboxInput
          label="Posisi"
          value={formData.positionId || ''}
          displayValue={getPositionName(formData.positionId, '')}
          onChange={handlePositionChange}
          onSelectOption={handlePositionSelect}
          options={positionOptions}
          placeholder=""
          customPromptText="sebagai Posisi Baru & Ekspor ke Job Desk"
        />
      </div>

      {/* Row 3: Kategori | Level */}
      <div className="col-span-1">
        <ComboboxInput
          label="Kategori"
          value={formData.category || ''}
          onChange={val => setFormData({ ...formData, category: val })}
          onSelectOption={opt => setFormData({ ...formData, category: opt.value || opt.label })}
          options={categoryOptions}
          placeholder=""
          customPromptText="sebagai Kategori Baru"
        />
      </div>
      <div className="col-span-1">
        <ComboboxInput
          label="Level"
          value={formData.level || ''}
          onChange={val => handleLevelChange(val)}
          onSelectOption={opt => handleLevelChange(opt.value || opt.label)}
          options={levelOptions}
          placeholder=""
          customPromptText="sebagai Level Baru"
        />
      </div>

      {/* Row 4: Departemen | Divisi */}
      <div className="col-span-1">
        <ComboboxInput
          label="Departemen"
          value={formData.departmentId || ''}
          displayValue={getDepartmentName(formData.departmentId, formData.positionId, '')}
          onChange={val => setFormData({ ...formData, departmentId: val })}
          onSelectOption={opt => setFormData({ ...formData, departmentId: opt.value || opt.label })}
          options={effectiveDepartmentOptions}
          placeholder=""
          customPromptText="sebagai Departemen Baru"
        />
      </div>
      <div className="col-span-1">
        <ComboboxInput
          label="Divisi"
          value={formData.division || ''}
          onChange={val => setFormData({ ...formData, division: val })}
          onSelectOption={opt => setFormData({ ...formData, division: opt.value || opt.label })}
          options={divisionOptions}
          placeholder=""
          customPromptText="sebagai Divisi Baru"
        />
      </div>

      {/* Row 5: Tanggal Bergabung | Kontrak Kerja */}
      <div className="col-span-1">
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          Tanggal Bergabung
        </label>
        <div className="relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px]">
          <span className={`flex-1 text-xs truncate ${formData.joinDate ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
            {formData.joinDate ? formatDateDisplay(formData.joinDate) : ''}
          </span>
          <input 
            type="date" 
            required 
            value={formData.joinDate || ''} 
            onChange={e => setFormData({...formData, joinDate: e.target.value})} 
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base"
          />
        </div>
      </div>
      <div className="col-span-1">
        <Select
          label="Tipe Karyawan"
          value={formData.employeeType || (formData.contractType ? mapContractTypeToEmployeeType(formData.contractType) : '')}
          onChange={e => {
            const selectedVal = e.target.value;
            const optionObj = EMPLOYEE_TYPE_OPTIONS.find(o => o.value === selectedVal);
            const cType = optionObj ? optionObj.contractType : 'Permanent';
            const taxType = optionObj ? optionObj.taxEmployeeType : 'Pegawai Tetap';

            setFormData(prev => ({
              ...prev,
              employeeType: selectedVal,
              contractType: cType,
              taxProfile: {
                ...(prev.taxProfile || {
                  nik: prev.nik || '',
                  npwp: prev.npwp || '',
                  ptkpStatus: prev.taxStatus || 'TK/0',
                  dependents: prev.dependents || 0,
                  employeeType: taxType,
                  taxMethod: 'Gross',
                  hasNpwp: true,
                  taxHistory: []
                }),
                employeeType: selectedVal ? taxType : (prev.taxProfile?.employeeType || 'Pegawai Tetap')
              }
            }));
          }}
          options={EMPLOYEE_TYPE_OPTIONS.map(opt => ({
            value: opt.value,
            label: opt.label
          }))}
        />
      </div>

      {/* Row 6: Status Karyawan | Lokasi Kerja */}
      <div className="col-span-1">
        <Select
          label="Status Karyawan"
          value={formData.status || ''}
          onChange={e => setFormData({...formData, status: e.target.value as any})}
          options={[
            { value: 'Active', label: 'Aktif' },
            { value: 'Probation', label: 'Masa Percobaan' },
            { value: 'Inactive', label: 'Non-Aktif' },
            { value: 'Terminated', label: 'Berhenti' }
          ]}
        />
      </div>
      <div className="col-span-1">
        <Input 
          label="Lokasi Kerja" 
          value={formData.workLocation || ''} 
          onChange={e => setFormData({...formData, workLocation: e.target.value})} 
          placeholder="" 
        />
      </div>
    </div>
  );
}
