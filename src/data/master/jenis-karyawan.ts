export interface EmployeeTypeOption {
  value: string;
  label: string;
  contractType: 'Permanent' | 'Contract' | 'Internship' | 'Freelance';
  taxEmployeeType: 'Pegawai Tetap' | 'Pegawai Tidak Tetap' | 'Tenaga Ahli' | 'Bukan Pegawai' | 'Ekspatriat';
  description?: string;
}

export const EMPLOYEE_TYPE_OPTIONS: EmployeeTypeOption[] = [
  {
    value: 'Pegawai Tetap',
    label: 'Pegawai Tetap (PKWTT)',
    contractType: 'Permanent',
    taxEmployeeType: 'Pegawai Tetap',
    description: 'Karyawan permanen (PKWTT), dikenakan PPh 21 TER Bulanan & Tarif Pasal 17'
  },
  {
    value: 'Pegawai Tidak Tetap',
    label: 'Pegawai Tidak Tetap / Kontrak (PKWT)',
    contractType: 'Contract',
    taxEmployeeType: 'Pegawai Tidak Tetap',
    description: 'Karyawan berbasis kontrak kerja waktu tertentu (PKWT)'
  },
  {
    value: 'Magang',
    label: 'Magang (Internship)',
    contractType: 'Internship',
    taxEmployeeType: 'Pegawai Tidak Tetap',
    description: 'Peserta pemagangan / intern yang menerima uang saku / imbalan'
  },
  {
    value: 'Tenaga Ahli',
    label: 'Tenaga Ahli / Konsultan',
    contractType: 'Freelance',
    taxEmployeeType: 'Tenaga Ahli',
    description: 'Tenaga ahli independen / konsultan profesional'
  },
  {
    value: 'Bukan Pegawai',
    label: 'Pekerja Lepas / Harian (Freelancer)',
    contractType: 'Freelance',
    taxEmployeeType: 'Bukan Pegawai',
    description: 'Pekerja harian lepas atau borongan'
  },
  {
    value: 'Ekspatriat',
    label: 'Ekspatriat / WNA (SPLN / SPDN)',
    contractType: 'Contract',
    taxEmployeeType: 'Ekspatriat',
    description: 'Karyawan Warga Negara Asing yang tunduk pada PPh 21 / PPh 26 atau Tax Treaty'
  }
];

export function mapEmployeeTypeToTaxType(empType?: string): 'Pegawai Tetap' | 'Pegawai Tidak Tetap' | 'Tenaga Ahli' | 'Bukan Pegawai' | 'Ekspatriat' {
  if (!empType) return 'Pegawai Tetap';
  const found = EMPLOYEE_TYPE_OPTIONS.find(
    opt => opt.value.toLowerCase() === empType.toLowerCase() || opt.label.toLowerCase().includes(empType.toLowerCase())
  );
  if (found) return found.taxEmployeeType;

  const lower = empType.toLowerCase();
  if (lower.includes('tetap') || lower === 'permanent') return 'Pegawai Tetap';
  if (lower.includes('kontrak') || lower.includes('contract') || lower.includes('magang') || lower.includes('intern')) return 'Pegawai Tidak Tetap';
  if (lower.includes('ahli') || lower.includes('konsultan')) return 'Tenaga Ahli';
  if (lower.includes('lepas') || lower.includes('harian') || lower.includes('freelance')) return 'Bukan Pegawai';
  if (lower.includes('ekspatriat') || lower.includes('wna')) return 'Ekspatriat';

  return 'Pegawai Tetap';
}

export function mapContractTypeToEmployeeType(contractType?: string): string {
  if (!contractType) return '';
  switch (contractType) {
    case 'Permanent': return 'Pegawai Tetap';
    case 'Contract': return 'Pegawai Tidak Tetap';
    case 'Internship': return 'Magang';
    case 'Freelance': return 'Bukan Pegawai';
    default: return contractType;
  }
}
