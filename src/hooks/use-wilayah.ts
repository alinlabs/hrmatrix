import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export interface Wilayah {
  id: string;
  name: string;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
}

export function useWilayah() {
  const [provinces, setProvinces] = useState<Wilayah[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/provinces.json`)
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Error fetching provinces", err));
  }, []);

  const getRegencies = useCallback(async (provinceId: string): Promise<Wilayah[]> => {
    if (!provinceId) return [];
    try {
      const res = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching regencies", err);
      return [];
    }
  }, []);

  const getDistricts = useCallback(async (regencyId: string): Promise<Wilayah[]> => {
    if (!regencyId) return [];
    try {
      const res = await fetch(`${BASE_URL}/districts/${regencyId}.json`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching districts", err);
      return [];
    }
  }, []);

  const getVillages = useCallback(async (districtId: string): Promise<Wilayah[]> => {
    if (!districtId) return [];
    try {
      const res = await fetch(`${BASE_URL}/villages/${districtId}.json`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching villages", err);
      return [];
    }
  }, []);

  return { provinces, getRegencies, getDistricts, getVillages };
}
