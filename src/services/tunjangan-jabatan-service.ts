import tunjanganJabatanMaster from '../data/master/tunjangan-jabatan';

export interface TunjanganJabatanResult {
  nominal: number;
  matchedLevelName: string;
  percentage: number;
  tierId?: string;
  jenjang?: {
    id?: string;
    level?: string;
    namaJenjang?: string;
    nominal?: number;
    persentaseGaji?: number;
    tipeNilai?: string;
    keterangan?: string;
  };
}

export function isTunjanganJabatanName(name?: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return lower.includes('tunjangan jabatan') || lower === 'jabatan';
}

export function calculateTunjanganJabatan(
  level?: string,
  basicSalary = 0
): TunjanganJabatanResult {
  const jenjangList = (tunjanganJabatanMaster as any)?.daftarJenjang || [];
  if (!jenjangList.length) {
    return {
      nominal: 0,
      matchedLevelName: level || 'Staff / Officer',
      percentage: 0,
    };
  }

  const normalized = (level || '').trim().toLowerCase();

  let matched = jenjangList.find((item: any) => {
    if (!normalized) return false;
    if (String(item.level || '').toLowerCase() === normalized) return true;
    if (String(item.namaJenjang || '').toLowerCase() === normalized) return true;
    if (
      Array.isArray(item.alias) &&
      item.alias.some((a: string) => a.toLowerCase() === normalized)
    ) {
      return true;
    }
    return false;
  });

  if (!matched && normalized) {
    matched = jenjangList.find((item: any) => {
      const itemLevel = String(item.level || '').toLowerCase();
      if (itemLevel.includes(normalized) || normalized.includes(itemLevel)) return true;
      return (
        Array.isArray(item.alias) &&
        item.alias.some(
          (a: string) =>
            a.toLowerCase().includes(normalized) || normalized.includes(a.toLowerCase())
        )
      );
    });
  }

  if (!matched) {
    // Default to Staff / Officer tier if found, else lowest tier
    matched =
      jenjangList.find((item: any) =>
        String(item.level || '').toLowerCase().includes('staff')
      ) || jenjangList[jenjangList.length - 1];
  }

  const baseNominal = Number(matched?.nominal || 0);
  const percentage = Number(matched?.persentaseGaji || 0);
  const computedNominal =
    baseNominal > 0
      ? baseNominal
      : basicSalary > 0 && percentage > 0
        ? Math.round((basicSalary * percentage) / 100)
        : 0;

  return {
    nominal: computedNominal,
    matchedLevelName: matched?.namaJenjang || matched?.level || level || 'Staff',
    percentage,
    tierId: matched?.id,
    jenjang: matched,
  };
}
