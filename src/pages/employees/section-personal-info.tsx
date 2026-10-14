import React from 'react';
import { Input, Select, ComboboxInput, PhoneInput } from '../../components/ui';
import { Employee } from '../../types';
import { INDONESIA_CITY_OPTIONS } from '../../data/master';
import { formatBirthDateDisplay } from './utils';

export interface PersonalInfoSectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
}

export function PersonalInfoSection({ formData, setFormData }: PersonalInfoSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* Row 1: Nomor Induk Kependudukan (Full Width) */}
      <div className="col-span-2">
        <label className="block text-[11px] font-normal text-slate-600 mb-1">Nomor Induk Kependudukan</label>
        <Input 
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.nik || ''} 
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
            setFormData(prev => ({
              ...prev,
              nik: val,
              taxProfile: prev.taxProfile ? { ...prev.taxProfile, nik: val } : prev.taxProfile
            }));
          }} 
          maxLength={16}
        />
      </div>

      {/* Row 2: Nama Lengkap (Full Width) */}
      <div className="col-span-2">
        <Input 
          label="Nama Lengkap" 
          required 
          value={formData.fullName || ''} 
          onChange={e => {
            const name = e.target.value;
            setFormData({
              ...formData, 
              fullName: name,
              bankAccountHolder: formData.bankAccountHolder ? formData.bankAccountHolder : name
            });
          }} 
        />
      </div>

      {/* Row 3: Tempat Lahir | Tanggal Lahir (2 kolom dalam 1 baris) */}
      <div className="col-span-1">
        <ComboboxInput 
          label="Tempat Lahir" 
          value={formData.birthPlace || ''} 
          onChange={val => setFormData({...formData, birthPlace: val})} 
          onSelectOption={opt => setFormData({...formData, birthPlace: opt.label})}
          options={INDONESIA_CITY_OPTIONS}
          placeholder="" 
          customPromptText="sebagai tempat lahir"
        />
      </div>
      <div className="col-span-1">
        <label className="block text-[11px] font-normal text-slate-600 mb-1">Tanggal Lahir</label>
        <div className="relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px]">
          <span className={`flex-1 text-xs truncate ${formData.birthDate ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
            {formData.birthDate ? formatBirthDateDisplay(formData.birthDate) : ''}
          </span>
          <input 
            type="date" 
            value={formData.birthDate || ''} 
            onChange={e => setFormData({...formData, birthDate: e.target.value})} 
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base"
          />
        </div>
      </div>

      {/* Row 4: Jenis Kelamin | Status Pernikahan (2 kolom dalam 1 baris) */}
      <div className="col-span-1">
        <Select
          label="Jenis Kelamin"
          value={formData.gender || ''}
          onChange={e => setFormData({...formData, gender: e.target.value as any})}
          options={[
            { value: 'Male', label: 'Laki-laki' },
            { value: 'Female', label: 'Perempuan' }
          ]}
        />
      </div>
      <div className="col-span-1">
        <Select
          label="Status Pernikahan"
          value={formData.maritalStatus || ''}
          onChange={e => setFormData({...formData, maritalStatus: e.target.value as any})}
          options={[
            { value: 'Single', label: 'Belum Kawin (Lajang)' },
            { value: 'Married', label: 'Kawin (Menikah)' },
            { value: 'Divorced', label: 'Cerai Hidup' },
            { value: 'Widowed', label: 'Cerai Mati' }
          ]}
        />
      </div>

      {/* Row 5: Nomor Telpon | Alamat Email (2 kolom dalam 1 baris) */}
      <div className="col-span-1">
        <PhoneInput 
          label="Nomor Telepon" 
          value={formData.phone || ''} 
          onChange={e => setFormData({...formData, phone: e.target.value})} 
        />
      </div>
      <div className="col-span-1">
        <Input 
          label="Alamat Email" 
          type="email" 
          required 
          value={formData.email || ''} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
        />
      </div>

      {/* Row 6: Instagram | LinkedIn (2 kolom dalam 1 baris) */}
      <div className="col-span-1">
        <Input 
          label="Instagram" 
          value={formData.instagram || ''} 
          onChange={e => setFormData({...formData, instagram: e.target.value})} 
        />
      </div>
      <div className="col-span-1">
        <Input 
          label="LinkedIn" 
          value={formData.linkedin || ''} 
          onChange={e => setFormData({...formData, linkedin: e.target.value})} 
        />
      </div>

      {/* Row 7: Nama Kontak Darurat | Hubungan Dengan Karyawan (2 kolom dalam 1 baris) */}
      <div className="col-span-1">
        <Input 
          label="Nama Kontak Darurat" 
          value={formData.emergencyContactName || ''} 
          onChange={e => {
            const name = e.target.value;
            setFormData(prev => ({
              ...prev, 
              emergencyContactName: name,
              emergencyContact: `${name}${prev.emergencyContactRelation ? ` (${prev.emergencyContactRelation})` : ''}${prev.emergencyContactPhone ? ` - ${prev.emergencyContactPhone}` : ''}`
            }));
          }} 
        />
      </div>
      <div className="col-span-1">
        <Select 
          label="Hubungan Dengan Karyawan" 
          value={formData.emergencyContactRelation || ''} 
          onChange={e => {
            const rel = e.target.value;
            setFormData(prev => ({
              ...prev, 
              emergencyContactRelation: rel,
              emergencyContact: `${prev.emergencyContactName || ''}${rel ? ` (${rel})` : ''}${prev.emergencyContactPhone ? ` - ${prev.emergencyContactPhone}` : ''}`
            }));
          }} 
          options={[
            { value: 'Suami', label: 'Suami' },
            { value: 'Istri', label: 'Istri' },
            { value: 'Orang Tua', label: 'Orang Tua' },
            { value: 'Anak', label: 'Anak' },
            { value: 'Saudara Kandung', label: 'Saudara Kandung' },
            { value: 'Kerabat', label: 'Kerabat / Keluarga Besar' },
            { value: 'Teman', label: 'Teman / Kolega' },
            { value: 'Lainnya', label: 'Lainnya' }
          ]}
        />
      </div>

      {/* Row 8: Nomor Telepon Kontak Darurat (Full Width) */}
      <div className="col-span-2">
        <PhoneInput 
          label="Nomor Telepon Kontak Darurat" 
          value={formData.emergencyContactPhone || ''} 
          onChange={e => {
            const phone = e.target.value;
            setFormData(prev => ({
              ...prev, 
              emergencyContactPhone: phone,
              emergencyContact: `${prev.emergencyContactName || ''}${prev.emergencyContactRelation ? ` (${prev.emergencyContactRelation})` : ''}${phone ? ` - ${phone}` : ''}`
            }));
          }} 
        />
      </div>
    </div>
  );
}
