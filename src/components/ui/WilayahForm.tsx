import React, { useState, useEffect, useMemo } from 'react';
import { useWilayah, Wilayah } from '../../hooks/useWilayah';
import { ComboboxInput, ComboboxOption } from './ComboboxInput';

interface WilayahFormProps {
  province?: string;
  city?: string;
  district?: string;
  village?: string;
  onChange: (field: string, value: string) => void;
}

export function WilayahForm({ province, city, district, village, onChange }: WilayahFormProps) {
  const { provinces, getRegencies, getDistricts, getVillages } = useWilayah();
  
  const [regencies, setRegencies] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [villages, setVillages] = useState<Wilayah[]>([]);

  // Find IDs based on current names (case-insensitive)
  const provinceId = useMemo(() => provinces.find(p => p.name.toLowerCase() === (province || '').toLowerCase())?.id, [provinces, province]);
  const regencyId = useMemo(() => regencies.find(r => r.name.toLowerCase() === (city || '').toLowerCase())?.id, [regencies, city]);
  const districtId = useMemo(() => districts.find(d => d.name.toLowerCase() === (district || '').toLowerCase())?.id, [districts, district]);

  // Fetch Regencies when province changes
  useEffect(() => {
    if (provinceId) {
      getRegencies(provinceId).then(setRegencies);
    } else {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
    }
  }, [provinceId, getRegencies]);

  // Fetch Districts when regency changes
  useEffect(() => {
    if (regencyId) {
      getDistricts(regencyId).then(setDistricts);
    } else {
      setDistricts([]);
      setVillages([]);
    }
  }, [regencyId, getDistricts]);

  // Fetch Villages when district changes
  useEffect(() => {
    if (districtId) {
      getVillages(districtId).then(setVillages);
    } else {
      setVillages([]);
    }
  }, [districtId, getVillages]);

  const provinceOptions: ComboboxOption[] = useMemo(() => {
    return provinces.map(p => ({ value: p.name, label: p.name }));
  }, [provinces]);

  const regencyOptions: ComboboxOption[] = useMemo(() => {
    return regencies.map(r => ({ value: r.name, label: r.name }));
  }, [regencies]);

  const districtOptions: ComboboxOption[] = useMemo(() => {
    return districts.map(d => ({ value: d.name, label: d.name }));
  }, [districts]);

  const villageOptions: ComboboxOption[] = useMemo(() => {
    return villages.map(v => ({ value: v.name, label: v.name }));
  }, [villages]);

  return (
    <>
      <ComboboxInput
        label="Provinsi"
        value={province || ''}
        onChange={val => {
          onChange('province', val);
          if (val !== province) {
            onChange('city', '');
            onChange('district', '');
            onChange('village', '');
          }
        }}
        onSelectOption={opt => {
          onChange('province', opt.label);
          onChange('city', '');
          onChange('district', '');
          onChange('village', '');
        }}
        options={provinceOptions}
        placeholder=""
        customPromptText="sebagai nama Provinsi"
      />
      <ComboboxInput
        label="Kota / Kabupaten"
        value={city || ''}
        onChange={val => {
          onChange('city', val);
          if (val !== city) {
            onChange('district', '');
            onChange('village', '');
          }
        }}
        onSelectOption={opt => {
          onChange('city', opt.label);
          onChange('district', '');
          onChange('village', '');
        }}
        options={regencyOptions}
        placeholder=""
        disabled={!province}
        customPromptText="sebagai Kota/Kabupaten"
      />
      <ComboboxInput
        label="Kecamatan"
        value={district || ''}
        onChange={val => {
          onChange('district', val);
          if (val !== district) {
            onChange('village', '');
          }
        }}
        onSelectOption={opt => {
          onChange('district', opt.label);
          onChange('village', '');
        }}
        options={districtOptions}
        placeholder=""
        disabled={!city}
        customPromptText="sebagai Kecamatan"
      />
      <ComboboxInput
        label="Desa / Kelurahan"
        value={village || ''}
        onChange={val => onChange('village', val)}
        onSelectOption={opt => onChange('village', opt.label)}
        options={villageOptions}
        placeholder=""
        disabled={!district}
        customPromptText="sebagai Desa/Kelurahan"
      />
    </>
  );
}
