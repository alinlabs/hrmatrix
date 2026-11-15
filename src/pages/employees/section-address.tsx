import React from 'react';
import { Input, Select } from '../../components/ui';
import { WilayahForm } from '../../components/ui/WilayahForm';
import { Employee } from '../../types';
import { RESIDENCE_STATUS_OPTIONS } from './constants';

export interface AddressSectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
}

export function AddressSection({ formData, setFormData }: AddressSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <WilayahForm
        province={formData.province}
        city={formData.city}
        district={formData.district}
        village={formData.village}
        onChange={(field, value) => setFormData(prev => ({...prev, [field]: value}))}
      />

      <div className="col-span-2 grid grid-cols-3 gap-3 sm:gap-4">
        <Input 
          label="RT" 
          value={formData.rt || ''} 
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
            setFormData({...formData, rt: val});
          }} 
          placeholder="" 
        />
        <Input 
          label="RW" 
          value={formData.rw || ''} 
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
            setFormData({...formData, rw: val});
          }} 
          placeholder="" 
        />
        <Input 
          label="Kode Pos" 
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.postalCode || ''} 
          onChange={e => setFormData({...formData, postalCode: e.target.value})} 
          placeholder="" 
        />
      </div>

      <div className="col-span-2">
        <Input 
          label="Alamat Detail" 
          value={formData.address || ''} 
          onChange={e => setFormData({...formData, address: e.target.value})} 
          placeholder="" 
        />
      </div>

      <div className="col-span-2">
        <Select
          label="Status Kepemilikan Tempat Tinggal"
          value={formData.residenceStatus || ''}
          onChange={e => setFormData({...formData, residenceStatus: e.target.value as any})}
          options={RESIDENCE_STATUS_OPTIONS}
        />
      </div>
    </div>
  );
}
