import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle, 
  Users, 
  CheckCircle2, 
  Calendar,
  Wallet,
  Calculator,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Input, Select, CurrencyInput, ComboboxInput, ComboboxOption, Button } from '../../components/ui';
import { Employee, BpjsKesehatanProfile } from '../../types';
import { 
  BPJS_CONFIG, 
  BPJS_HEALTH_PARTICIPANT_OPTIONS,
  calculateEmployeeBpjsSimulation
} from '../../services/taxBpjsService';
import { isFixedAllowance } from '../../utils/allowanceClassification';
import { cn } from '../../utils/cn';

const formatDateDisplay = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(m, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(d, 10)} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

interface BpjsKesehatanSectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  showRegulationInfo?: boolean;
  bpjsOptions?: ComboboxOption[];
}

function ToggleSwitch({ 
  checked, 
  onChange, 
  disabled 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-blue-600" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

const getParticipantTypeInfo = (type: string) => {
  switch (type) {
    case 'PPU Badan Usaha':
      return {
        title: 'PPU Badan Usaha (Karyawan Swasta)',
        badge: 'Perpres No. 64/2020',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        items: [
          'Skema Iuran Total: 5% dari Gaji Pokok + Tunjangan Tetap (Maksimal Upah Rp 12.000.000)',
          'Pembagian Beban: 1% dipotong dari Gaji Pekerja (maks Rp 120.000) & 4% ditanggung Perusahaan (maks Rp 480.000)',
          'Manfaat: Menjamin 5 Anggota Keluarga (Pekerja + Suami/Istri + 3 Anak sah) tanpa biaya iuran tambahan'
        ]
      };
    case 'PPU Penyelenggara Negara':
      return {
        title: 'PPU Penyelenggara Negara / BUMN / BUMD',
        badge: 'ASN / BUMN',
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        items: [
          'Skema Iuran Total: 5% dari Gaji / Penghasilan Tetap (Batas atas upah Rp 12.000.000)',
          'Pembagian Beban: 1% dipotong dari Gaji Pekerja & 4% ditanggung oleh Instansi Pemberi Kerja',
          'Hak Perawatan: Kelas rawat inap RS disesuaikan berdasarkan Golongan/Jabatan Pegawai'
        ]
      };
    case 'Keluarga Tambahan':
      return {
        title: 'Keluarga Tambahan (Anak ke-4 dst / Orang Tua / Mertua)',
        badge: 'Iuran Tambahan Pekerja',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        items: [
          'Ketentuan Iuran: 1% per jiwa dari Gaji Pokok + Tunjangan Tetap',
          'Pembagian Beban: 100% dipotong dari Gaji Pekerja (tidak ditanggung pemberi kerja)',
          'Peserta: Berlaku untuk anggota keluarga tambahan di luar 5 tanggungan inti standar'
        ]
      };
    case 'Mandiri PBPU - Kelas I':
      return {
        title: 'PBPU / Mandiri - Kelas I',
        badge: 'Iuran Mandiri Rp 150.000/bln',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        items: [
          'Iuran Flat: Rp 150.000 per orang per bulan untuk fasilitas ruang perawatan Kelas I',
          'Status Iuran: Dibayar secara mandiri oleh peserta'
        ]
      };
    case 'Mandiri PBPU - Kelas II':
      return {
        title: 'PBPU / Mandiri - Kelas II',
        badge: 'Iuran Mandiri Rp 100.000/bln',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        items: [
          'Iuran Flat: Rp 100.000 per orang per bulan untuk fasilitas ruang perawatan Kelas II',
          'Status Iuran: Dibayar secara mandiri oleh peserta'
        ]
      };
    case 'Mandiri PBPU - Kelas III':
      return {
        title: 'PBPU / Mandiri - Kelas III',
        badge: 'Iuran Mandiri Rp 35.000/bln',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        items: [
          'Iuran Flat: Rp 35.000 per orang per bulan (setelah subsidi pemerintah Rp 7.000)',
          'Status Iuran: Dibayar secara mandiri oleh peserta untuk perawatan Kelas III'
        ]
      };
    case 'Bukan Pekerja':
      return {
        title: 'Kategori Bukan Pekerja (Pensiunan / Investor)',
        badge: 'Non-Pekerja',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        items: [
          'Ketentuan Iuran: 5% dari dana pensiun pokok atau iuran mandiri perorangan',
          'Payroll Perusahaan: Tidak ada pemotongan/penanggungan iuran oleh perusahaan'
        ]
      };
    case 'None':
    default:
      return {
        title: 'Tidak Terdaftar / Dinonaktifkan',
        badge: 'Non-Aktif',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        items: [
          'Status Kepesertaan: Karyawan tidak didaftarkan atau dinonaktifkan dari BPJS Kesehatan',
          'Payroll Perusahaan: Pemotongan Iuran Pekerja (1%) & Perusahaan (4%) dinonaktifkan (Rp 0)'
        ]
      };
  }
};

const getFamilyCoverageInfo = (count: number) => {
  switch (count) {
    case 1:
      return {
        title: 'Penanggungan 1 Orang',
        subtitle: 'Kategori Penanggungan Mandiri',
        items: [
          'Anggota Keluarga Ditanggung: Pekerja Utama (Diri Sendiri)',
          'Ketentuan Iuran: Menanggung jaminan kesehatan untuk 1 pekerja. Belum mencakup pasangan atau anak.'
        ]
      };
    case 2:
      return {
        title: 'Penanggungan 2 Orang',
        subtitle: 'Kategori Pasangan Sah',
        items: [
          'Anggota Keluarga Ditanggung: Pekerja Utama + 1 Pasangan Sah (Suami/Istri)',
          'Ketentuan Iuran: Menanggung 2 anggota keluarga dalam 1 paket iuran standar 5% tanpa biaya tambahan.'
        ]
      };
    case 3:
      return {
        title: 'Penanggungan 3 Orang',
        subtitle: 'Kategori Keluarga Kecil',
        items: [
          'Anggota Keluarga Ditanggung: Pekerja Utama + 1 Pasangan Sah + 1 Anak Sah',
          'Ketentuan Iuran: Menanggung 3 anggota keluarga dalam 1 paket iuran standar 5% tanpa biaya tambahan.'
        ]
      };
    case 4:
      return {
        title: 'Penanggungan 4 Orang',
        subtitle: 'Kategori Keluarga Standar',
        items: [
          'Anggota Keluarga Ditanggung: Pekerja Utama + 1 Pasangan Sah + 2 Anak Sah',
          'Ketentuan Iuran: Menanggung 4 anggota keluarga dalam 1 paket iuran standar 5% tanpa biaya tambahan.'
        ]
      };
    case 5:
    default:
      return {
        title: 'Penanggungan 5 Orang',
        subtitle: 'Batas Standar Perpres No. 64/2020',
        items: [
          'Anggota Keluarga Ditanggung: Pekerja Utama + 1 Pasangan Sah + 3 Anak Sah',
          'Ketentuan Iuran: Batas maksimal penanggungan keluarga standar Perpres (100% ditanggung oleh iuran 5%).'
        ]
      };
  }
};

export function BpjsKesehatanSection({ 
  formData, 
  setFormData, 
  showRegulationInfo = false,
  bpjsOptions = []
}: BpjsKesehatanSectionProps) {
  const [openInfo, setOpenInfo] = React.useState<Record<string, boolean>>({});
  const [showDetails, setShowDetails] = React.useState(false);
  const [showWageDetails, setShowWageDetails] = React.useState(false);

  const toggleInfo = (key: string) => {
    setOpenInfo(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const marital = String(formData.maritalStatus || '').toLowerCase().trim();
  const isUnmarried = !formData.maritalStatus || ['single', 'lajang', 'belum menikah', 'belum kawin'].includes(marital);

  const profile: BpjsKesehatanProfile = {
    ...(formData.bpjsKesehatanProfile || {
      ruleId: undefined,
      participantNumber: formData.bpjsKesehatan || '',
      participantType: ((formData.positionId || formData.bpjsKesehatan) ? 'PPU Badan Usaha' : '') as any,
      activeStatus: ((formData.positionId || formData.bpjsKesehatan) ? 'Active' : 'Inactive') as any,
      effectiveDate: formData.joinDate || '',
      employeeRate: 1,
      employerRate: 4,
      familyMembersCovered: undefined as any,
      useCustomWageBase: false
    }),
    participantType: formData.bpjsKesehatanProfile?.participantType ?? ((formData.positionId || formData.bpjsKesehatan) ? 'PPU Badan Usaha' : '' as any),
    activeStatus: formData.bpjsKesehatanProfile?.activeStatus ?? ((formData.positionId || formData.bpjsKesehatan) ? 'Active' : 'Inactive' as any),
    familyMembersCovered: formData.bpjsKesehatanProfile?.familyMembersCovered !== undefined && formData.bpjsKesehatanProfile?.familyMembersCovered !== null
      ? formData.bpjsKesehatanProfile.familyMembersCovered
      : ('' as any)
  };

  // Hanya tunjangan dengan kategori "Tunjangan Tetap" yang menjadi komponen upah yang dilaporkan
  const fixedAllowanceList = (formData.allowances || []).filter(
    a => typeof a.amount === 'number' && a.amount > 0 && isFixedAllowance(a)
  );
  const totalFixedAllowances = (formData.allowances !== undefined && formData.allowances !== null)
    ? fixedAllowanceList.reduce((acc, a) => acc + (a.amount || 0), 0)
    : (formData.fixedAllowance || 0);

  const standardWage = (formData.basicSalary || 0) + totalFixedAllowances;

  const simulation = calculateEmployeeBpjsSimulation(
    formData.basicSalary || 0,
    totalFixedAllowances,
    profile,
    formData.bpjsKetenagakerjaanProfile
  );

  const handleUpdate = (field: keyof BpjsKesehatanProfile, value: any) => {
    setFormData(prev => {
      const currentProf = prev.bpjsKesehatanProfile || profile;
      const updatedProfile = {
        ...currentProf,
        [field]: value
      };

      if (field === 'participantNumber') {
        if (value && String(value).trim().length > 0) {
          updatedProfile.activeStatus = 'Active';
          if (!updatedProfile.participantType || updatedProfile.participantType === 'None') {
            updatedProfile.participantType = 'PPU Badan Usaha';
            updatedProfile.employeeRate = 1;
            updatedProfile.employerRate = 4;
          }
        }
      }

      if (field === 'participantType') {
        if (value === 'PPU Badan Usaha' || value === 'PPU Penyelenggara Negara') {
          updatedProfile.employeeRate = 1;
          updatedProfile.employerRate = 4;
          if (!updatedProfile.activeStatus || updatedProfile.activeStatus === 'Inactive') {
            updatedProfile.activeStatus = 'Active';
          }
        } else if (value === 'Keluarga Tambahan') {
          updatedProfile.employeeRate = 1;
          updatedProfile.employerRate = 0;
          if (!updatedProfile.activeStatus || updatedProfile.activeStatus === 'Inactive') {
            updatedProfile.activeStatus = 'Active';
          }
        } else if (value === 'None') {
          updatedProfile.employeeRate = 0;
          updatedProfile.employerRate = 0;
          updatedProfile.activeStatus = 'Inactive';
        } else if (value && value.startsWith('Mandiri')) {
          updatedProfile.employeeRate = 0;
          updatedProfile.employerRate = 0;
          if (!updatedProfile.activeStatus || updatedProfile.activeStatus === 'Inactive') {
            updatedProfile.activeStatus = 'Active';
          }
        } else {
          updatedProfile.employeeRate = 0;
          updatedProfile.employerRate = 0;
        }
      }

      // Keep legacy fields synced
      const legacyParticipant = updatedProfile.participantType === 'None' || updatedProfile.activeStatus === 'Inactive'
        ? 'None'
        : (updatedProfile.participantType ? 'PPU' : '');

      return {
        ...prev,
        bpjsKesehatan: field === 'participantNumber' ? value : prev.bpjsKesehatan,
        bpjsHealthParticipant: legacyParticipant as any,
        bpjsKesehatanProfile: updatedProfile
      };
    });
  };

  const isCapped = (profile.useCustomWageBase ? (profile.customWageBase || 0) : standardWage) > BPJS_CONFIG.KESEHATAN.MAX_WAGE_CAP;

  return (
    <div className="space-y-4">
      {/* Regulation Header Banner */}
      {showRegulationInfo && (
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">Program Jaminan Kesehatan Nasional</h4>
            <p className="text-[11px] text-slate-500 font-normal">Perpres No. 64/2020</p>
          </div>
          <ul className="space-y-3 pt-3 border-t border-slate-200/50 text-[11px] text-slate-600 list-disc list-outside pl-5 text-left leading-relaxed">
            <li className="marker:text-blue-600 pl-0.5">Iuran total sebesar 5% (1% dipotong dari Gaji Pekerja & 4% ditanggung Perusahaan) dengan batas upah maksimal (Wage Cap) Rp 12.000.000/bulan.</li>
            <li className="marker:text-blue-600 pl-0.5">Maksimal pemotongan iuran Pekerja adalah Rp 120.000 per bulan.</li>
          </ul>
        </div>
      )}

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-start">
        {/* 1. Participant Number */}
        <div>
          <Input
            label="Nomor Kartu Peserta BPJS Kesehatan"
            value={profile.participantNumber || formData.bpjsKesehatan || ''}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 13);
              handleUpdate('participantNumber', val);
            }}
            placeholder=""
            maxLength={13}
          />
        </div>

        {/* 2. Participant Type */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-normal text-slate-600">Jenis Kepesertaan</label>
            <button
              type="button"
              onClick={() => toggleInfo('participantType')}
              className={cn(
                "p-1 rounded-full transition-colors",
                openInfo.participantType ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
              )}
              title="Informasi Jenis Kepesertaan"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <Select
            value={profile.participantType || ''}
            onChange={e => handleUpdate('participantType', e.target.value)}
            options={BPJS_HEALTH_PARTICIPANT_OPTIONS.map(opt => ({
              value: opt.value,
              label: opt.label,
              subLabel: opt.subLabel
            }))}
          />
          {/* Specific Regulation Info Card */}
          {openInfo.participantType && (() => {
            const info = getParticipantTypeInfo(profile.participantType || 'PPU Badan Usaha');
            return (
              <div className="mt-2.5 p-4 sm:p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl space-y-4 text-xs text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-900 leading-snug">{info.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-normal">{info.badge}</div>
                </div>
                <ul className="space-y-3 pt-3 border-t border-slate-200/50 text-[11px] text-slate-600 list-disc list-outside pl-5 leading-relaxed">
                  {info.items.map((item, idx) => (
                    <li key={idx} className="marker:text-blue-600 pl-0.5">{item}</li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>

        {/* Group Status Kepesertaan and Tanggal Efektif horizontally */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 col-span-1 sm:col-span-2 lg:col-span-3">
          {/* 3. Active Status */}
          <div>
            <Select
              label="Status Kepesertaan"
              value={profile.activeStatus || ''}
              onChange={e => handleUpdate('activeStatus', e.target.value)}
              options={[
                { value: 'Active', label: 'Aktif' },
                { value: 'Inactive', label: 'Non-Aktif' },
                { value: 'Suspended', label: 'Ditangguhkan' }
              ]}
            />
          </div>

          {/* 4. Effective Date */}
          <div>
            <label className="block text-[11px] font-normal text-slate-600 mb-1.5">Tanggal Efektif</label>
            <div className="relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px]">
              <span className={`flex-1 text-xs truncate ${(profile.effectiveDate || formData.joinDate) ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                {(profile.effectiveDate || formData.joinDate) ? formatDateDisplay(profile.effectiveDate || formData.joinDate) : ''}
              </span>
              <input 
                type="date" 
                value={profile.effectiveDate || formData.joinDate || ''} 
                onChange={e => handleUpdate('effectiveDate', e.target.value)} 
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base"
              />
            </div>
          </div>
        </div>

        {/* 5. Wage Base (Upah yang Dilaporkan) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-normal text-slate-600">Upah Yang Dilaporkan</label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-normal text-slate-600">Atur Manual</span>
              <ToggleSwitch
                checked={profile.useCustomWageBase || false}
                onChange={val => handleUpdate('useCustomWageBase', val)}
              />
              <button
                type="button"
                onClick={() => toggleInfo('customWage')}
                className={cn(
                  "p-1 rounded-full transition-colors",
                  openInfo.customWage ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                )}
                title="Informasi Regulasi BPJS Kesehatan"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {openInfo.customWage && (
            <div className="mb-2.5 p-4 sm:p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl space-y-4 text-xs text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
              <div className="text-center">
                <div className="text-sm font-bold text-slate-900 leading-snug">Regulasi Resmi BPJS Kesehatan</div>
                <div className="text-[11px] text-slate-500 mt-1 font-normal">Perpres No. 64 Tahun 2020</div>
              </div>
              <ul className="space-y-3 pt-3 border-t border-slate-200/50 text-[11px] text-slate-600 list-disc list-outside pl-5 leading-relaxed">
                <li className="marker:text-blue-600 pl-0.5">Iuran total sebesar 5% (1% Pekerja, 4% Perusahaan) dengan dasar upah maksimal (Wage Cap) Rp 12.000.000 per bulan.</li>
                <li className="marker:text-blue-600 pl-0.5">Menjamin hingga 5 anggota keluarga (Pekerja + Suami/Istri + 3 Anak sah).</li>
              </ul>
            </div>
          )}

          {profile.useCustomWageBase ? (
            <CurrencyInput
              placeholder=""
              value={profile.customWageBase || ''}
              onChange={e => handleUpdate('customWageBase', Number(e.target.value))}
            />
          ) : (
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
              <div 
                onClick={() => setShowWageDetails(!showWageDetails)}
                className="min-h-[44px] px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none gap-3"
              >
                <span className="font-bold text-slate-900 text-sm sm:text-base shrink-0">
                  Rp {new Intl.NumberFormat('id-ID').format(standardWage)}
                </span>
                
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs font-normal text-slate-500 text-right">
                    (Gaji Pokok + Tunjangan Tetap)
                  </span>
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors shrink-0"
                    aria-label={showWageDetails ? "Sembunyikan rincian upah" : "Tampilkan rincian upah"}
                  >
                    {showWageDetails ? (
                      <ChevronUp className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {showWageDetails && (
                <div className="px-4 py-3.5 bg-white border-t border-slate-200/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <span className="text-xs font-bold text-slate-900 block tracking-wide">
                    Rincian Penghasilan Bruto / Bulan
                  </span>

                  <div className="grid grid-cols-[1fr_auto_auto] items-start gap-y-2.5 gap-x-2 pt-1">
                    {/* Gaji Pokok */}
                    <span className="font-normal text-slate-600 text-xs">Gaji Pokok</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs min-w-[70px]">
                      {new Intl.NumberFormat('id-ID').format(formData.basicSalary || 0)}
                    </span>

                    {/* Tunjangan Tetap (Hanya kategori Tunjangan Tetap) */}
                    {fixedAllowanceList.length > 0 ? (
                      fixedAllowanceList.map((allowance, idx) => (
                        <React.Fragment key={allowance.id || idx}>
                          <span className="font-normal text-slate-600 text-xs truncate max-w-[200px] sm:max-w-none" title={allowance.name}>
                            {allowance.name || `Tunjangan Tetap ${idx + 1}`}
                          </span>
                          <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                          <span className="font-normal text-slate-600 text-right text-xs min-w-[70px]">
                            {new Intl.NumberFormat('id-ID').format(allowance.amount || 0)}
                          </span>
                        </React.Fragment>
                      ))
                    ) : (formData.fixedAllowance || 0) > 0 ? (
                      <React.Fragment>
                        <span className="font-normal text-slate-600 text-xs">Tunjangan Tetap</span>
                        <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                        <span className="font-normal text-slate-600 text-right text-xs min-w-[70px]">
                          {new Intl.NumberFormat('id-ID').format(formData.fixedAllowance || 0)}
                        </span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <span className="font-normal text-slate-400 text-xs">Tunjangan Tetap</span>
                        <span className="font-normal text-slate-400 text-right text-xs">Rp</span>
                        <span className="font-normal text-slate-400 text-right text-xs min-w-[70px]">0</span>
                      </React.Fragment>
                    )}

                    {/* Divider */}
                    <div className="col-span-3 border-t border-slate-100 my-1" />

                    {/* Total Upah Yang Dilaporkan */}
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Total Upah Yang Dilaporkan</span>
                    <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                    <span className="font-bold text-slate-900 text-right text-xs sm:text-sm min-w-[70px]">
                      {new Intl.NumberFormat('id-ID').format(standardWage)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            {isCapped && (
              <span className="text-amber-700 font-medium">
                * Dikenakan batas atas (Cap) Rp 12.000.000
              </span>
            )}
          </p>
        </div>

        {/* 6. Family Members Covered */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-normal text-slate-600">Tanggungan Keluarga</label>
            <button
              type="button"
              onClick={() => toggleInfo('familyCoverage')}
              className={cn(
                "p-1 rounded-full transition-colors",
                openInfo.familyCoverage ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
              )}
              title="Informasi Tanggungan Keluarga"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <Select
            value={profile.familyMembersCovered !== undefined && profile.familyMembersCovered !== null && profile.familyMembersCovered !== ('' as any) ? String(profile.familyMembersCovered) : ''}
            onChange={e => handleUpdate('familyMembersCovered', e.target.value ? Number(e.target.value) : undefined)}
            options={[
              { value: '1', label: '1 Orang (Karyawan Saja)' },
              { value: '2', label: '2 Orang (Karyawan + Pasangan)' },
              { value: '3', label: '3 Orang (Karyawan + Pasangan + 1 Anak)' },
              { value: '4', label: '4 Orang (Karyawan + Pasangan + 2 Anak)' },
              { value: '5', label: '5 Orang (Karyawan + Pasangan + 3 Anak)' }
            ]}
          />
          {/* Card Info Siapa yang Ditanggung */}
          {openInfo.familyCoverage && (() => {
            const familyInfo = getFamilyCoverageInfo(Number(profile.familyMembersCovered || 5));
            return (
              <div className="mt-2.5 p-4 sm:p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl space-y-4 text-xs text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-900 leading-snug">{familyInfo.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-normal">{familyInfo.subtitle}</div>
                </div>
                <ul className="space-y-3 pt-3 border-t border-slate-200/50 text-[11px] text-slate-600 list-disc list-outside pl-5 leading-relaxed">
                  {familyInfo.items.map((item, idx) => (
                    <li key={idx} className="marker:text-blue-600 pl-0.5">{item}</li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Real-time Contribution Breakdown List Wrapped in clean white card */}
      <div className="mt-6 p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold text-slate-900 text-sm">Estimasi BPJS Kesehatan Bulanan</h5>
          <button 
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={cn(
              "p-1.5 rounded-full transition-all duration-200",
              showDetails 
                ? "text-blue-600 bg-blue-50/80 hover:bg-blue-100" 
                : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
            )}
            title={showDetails ? "Sembunyikan Detail" : "Tampilkan Detail"}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {!showDetails ? (
          <div className="animate-in fade-in duration-200">
            <span className="text-xs text-slate-400 font-medium block mb-1">Total Iuran Bulanan</span>
            <div className="text-lg font-bold text-slate-900">
              Rp {new Intl.NumberFormat('id-ID').format(simulation.kesehatan.totalAmount)}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-slate-500 mb-4">
              Dasar upah kena iuran: <strong className="font-semibold text-slate-700">Rp {new Intl.NumberFormat('id-ID').format(Math.min((profile.useCustomWageBase ? profile.customWageBase || 0 : standardWage), BPJS_CONFIG.KESEHATAN.MAX_WAGE_CAP))}</strong>
            </p>

            <div className="max-w-md grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              <span className="text-slate-600 font-medium py-1.5 border-b border-slate-100/60">Pekerja (1%)</span>
              <span className="font-semibold text-slate-900 py-1.5 border-b border-slate-100/60">: &nbsp;Rp {new Intl.NumberFormat('id-ID').format(simulation.kesehatan.employeeAmount)}</span>

              <span className="text-slate-600 font-medium py-1.5 border-b border-slate-100/60">Perusahaan (4%)</span>
              <span className="font-semibold text-slate-900 py-1.5 border-b border-slate-100/60">: &nbsp;Rp {new Intl.NumberFormat('id-ID').format(simulation.kesehatan.employerAmount)}</span>

              <span className="text-slate-800 font-bold py-1.5">Total (5%)</span>
              <span className="font-bold text-slate-950 py-1.5">: &nbsp;Rp {new Intl.NumberFormat('id-ID').format(simulation.kesehatan.totalAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

