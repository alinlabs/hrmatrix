import { tunjanganJabatanData } from '../data/master';

export interface JenjangTunjanganJabatan {
  id: string;
  level: string;
  namaJenjang: string;
  alias: string[];
  nominal: number;
  persentaseGaji: number;
  tipeNilai: 'nominal' | 'persentase';
  keterangan: string;
}

export interface TunjanganJabatanConfig {
  judul: string;
  deskripsi: string;
  kategori: string;
  dasarPerhitungan: string;
  frekuensi: string;
  daftarJenjang: JenjangTunjanganJabatan[];
}

export interface TunjanganJabatanCalculationResult {
  nominal: number;
  jenjang: JenjangTunjanganJabatan | null;
  matchedLevelName: string;
  formulaDescription: string;
  isMatched: boolean;
}

const config: TunjanganJabatanConfig = tunjanganJabatanData as TunjanganJabatanConfig;

/**
 * Get full Tunjangan Jabatan JSON configuration
 */
export function getTunjanganJabatanConfig(): TunjanganJabatanConfig {
  return config;
}

/**
 * Get list of all tiers/jenjang
 */
export function getDaftarJenjangTunjanganJabatan(): JenjangTunjanganJabatan[] {
  return config.daftarJenjang;
}

/**
 * Find matching jenjang item by level string (case-insensitive fuzzy & alias match)
 */
export function matchJenjangByLevel(levelText?: string): JenjangTunjanganJabatan | null {
  if (!levelText || levelText.trim() === '') {
    // Default to Staff tier
    return config.daftarJenjang.find(j => j.level.toLowerCase() === 'staff') || config.daftarJenjang[config.daftarJenjang.length - 2] || null;
  }

  const query = levelText.trim().toLowerCase();

  // 1. Direct exact level match
  const exactMatch = config.daftarJenjang.find(j => j.level.toLowerCase() === query);
  if (exactMatch) return exactMatch;

  // 2. Direct exact alias match
  const exactAliasMatch = config.daftarJenjang.find(j => 
    j.alias.some(a => a.toLowerCase() === query)
  );
  if (exactAliasMatch) return exactAliasMatch;

  // 3. Keyword / substring inclusion match (prioritizing hierarchy from highest to lowest)
  // Check Director / C-Level
  if (query.includes('director') || query.includes('direktur') || query.includes('chief') || query.includes('ceo') || query.includes('cto') || query.includes('cfo') || query.includes('coo') || query.includes('c-level')) {
    return config.daftarJenjang.find(j => j.level === 'Director') || null;
  }

  // Check General Manager / VP
  if (query.includes('general manager') || query.includes('gm') || query.includes('vice president') || query.includes('vp') || query.includes('plant manager') || query.includes('division head')) {
    return config.daftarJenjang.find(j => j.level === 'General Manager') || null;
  }

  // Check Assistant Manager
  if (query.includes('assistant manager') || query.includes('asisten manajer') || query.includes('superintendent') || query.includes('deputy manager')) {
    return config.daftarJenjang.find(j => j.level === 'Assistant Manager') || null;
  }

  // Check Manager
  if (query.includes('manager') || query.includes('manajer') || query.includes('head') || query.includes('kepala cabang') || query.includes('kepala departemen')) {
    return config.daftarJenjang.find(j => j.level === 'Manager') || null;
  }

  // Check Supervisor
  if (query.includes('supervisor') || query.includes('spv') || query.includes('penyelia') || query.includes('foreman') || query.includes('seksi')) {
    return config.daftarJenjang.find(j => j.level === 'Supervisor') || null;
  }

  // Check Team Lead
  if (query.includes('team lead') || query.includes('leader') || query.includes('koordinator') || query.includes('coordinator') || query.includes('regu') || query.includes('mandor')) {
    return config.daftarJenjang.find(j => j.level === 'Team Lead') || null;
  }

  // Check Senior Staff / Specialist
  if (query.includes('senior') || query.includes('specialist') || query.includes('spesialis') || query.includes('principal') || query.includes('ahli') || query.includes('expert')) {
    return config.daftarJenjang.find(j => j.level === 'Senior Staff') || null;
  }

  // Check Supporting / Operasional
  if (query.includes('supporting') || query.includes('pelaksana') || query.includes('operator') || query.includes('helper') || query.includes('driver') || query.includes('supir') || query.includes('kurir') || query.includes('security') || query.includes('satpam') || query.includes('cleaning') || query.includes('buruh') || query.includes('intern') || query.includes('magang')) {
    return config.daftarJenjang.find(j => j.level === 'Supporting / Pelaksana' || j.level === 'Supporting') || null;
  }

  // Check any alias word inside query
  for (const item of config.daftarJenjang) {
    for (const alias of item.alias) {
      if (query.includes(alias.toLowerCase())) {
        return item;
      }
    }
  }

  // Default fallback: Staff
  return config.daftarJenjang.find(j => j.level === 'Staff') || config.daftarJenjang[config.daftarJenjang.length - 2] || null;
}

/**
 * Automatically calculate Tunjangan Jabatan amount based on employee level and basic salary
 */
export function calculateTunjanganJabatan(
  levelText?: string,
  basicSalary: number = 0
): TunjanganJabatanCalculationResult {
  const jenjang = matchJenjangByLevel(levelText);

  if (!jenjang) {
    return {
      nominal: 0,
      jenjang: null,
      matchedLevelName: levelText || 'Staff',
      formulaDescription: 'Tidak ada jenjang tunjangan yang cocok',
      isMatched: false,
    };
  }

  let finalAmount = jenjang.nominal;
  let formulaDesc = `Nominal Tetap Level ${jenjang.level || jenjang.namaJenjang}: Rp ${new Intl.NumberFormat('id-ID').format(finalAmount)}`;

  if (jenjang.tipeNilai === 'persentase' && basicSalary > 0) {
    finalAmount = Math.round((jenjang.persentaseGaji / 100) * basicSalary);
    formulaDesc = `${jenjang.persentaseGaji}% × Gaji Pokok (Rp ${new Intl.NumberFormat('id-ID').format(basicSalary)})`;
  }

  return {
    nominal: finalAmount,
    jenjang,
    matchedLevelName: jenjang.level || jenjang.namaJenjang,
    formulaDescription: formulaDesc,
    isMatched: true,
  };
}

/**
 * Check if a given allowance name refers to "Tunjangan Jabatan"
 */
export function isTunjanganJabatanName(name?: string): boolean {
  if (!name) return false;
  const lower = name.trim().toLowerCase();
  return lower.includes('tunjangan jabatan') || lower === 'jabatan' || lower.includes('position allowance');
}
