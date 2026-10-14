import React from 'react';
import { 
  Briefcase, 
  Building2, 
  Globe, 
  Check, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  RotateCcw,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { PortalNavLogo } from '../../components/e-portal/PortalLogos';
import { 
  useAppModulesConfig, 
  HR_EPORTAL_IDS, 
  GA_EPORTAL_IDS 
} from '../../services/moduleConfigService';

interface PortalItemDef {
  id: string;
  name: string;
  fullName: string;
  instansi: string;
  category: 'hr' | 'ga';
  dasarHukum: string;
  description: string;
}

const HR_PORTALS_DATA: PortalItemDef[] = [
  {
    id: 'kemenaker',
    name: 'Kemenaker (WLKP Online)',
    fullName: 'Kementerian Ketenagakerjaan RI (WLKP Online)',
    instansi: 'Kemenaker RI',
    category: 'hr',
    dasarHukum: 'UU No. 7/1981',
    description: 'Wajib Lapor Ketenagakerjaan Perusahaan & komposisi pekerja berkala tahunan.'
  },
  {
    id: 'bpjstk',
    name: 'BPJSTK (SIPP Online)',
    fullName: 'BPJS Ketenagakerjaan (SIPP Online)',
    instansi: 'BPJS Ketenagakerjaan',
    category: 'hr',
    dasarHukum: 'UU No. 24/2011',
    description: 'Pelaporan mutasi upah bulanan, pendaftaran peserta, JHT, JKK, JKM, JP & kode EPS.'
  },
  {
    id: 'edabu',
    name: 'EDABU (BPJS Kesehatan)',
    fullName: 'BPJS Kesehatan (e-Dabu Badan Usaha)',
    instansi: 'BPJS Kesehatan',
    category: 'hr',
    dasarHukum: 'Perpres No. 82/2018',
    description: 'Pengelolaan data kepesertaan JKN-KIS pekerja, mutasi anggota keluarga & tagihan premi.'
  },
  {
    id: 'djp',
    name: 'DJP Online Pajak (CoreTax)',
    fullName: 'Direktorat Jenderal Pajak (DJP Online / CoreTax)',
    instansi: 'Ditjen Pajak Kemenkeu',
    category: 'hr',
    dasarHukum: 'PP No. 58/2023',
    description: 'Layanan SPT Masa PPh 21 TER, e-Bupot unifikasi 1721-VIII, e-Billing & bukti potong.'
  },
  {
    id: 'e-pp-pkb',
    name: 'Portal e-PP & e-PKB Kemnaker',
    fullName: 'Portal e-PP & e-PKB Kemnaker RI',
    instansi: 'Ditjen PHI Kemnaker',
    category: 'hr',
    dasarHukum: 'Permenaker 28/2014',
    description: 'Pendaftaran dan pengesahan SK Peraturan Perusahaan (PP) & Perjanjian Kerja Bersama.'
  },
  {
    id: 'temank3',
    name: 'Teman K3 (P2K3 & Insiden)',
    fullName: 'Teman K3 Kemnaker (P2K3 & Keselamatan Kerja)',
    instansi: 'Binwasnaker & K3',
    category: 'hr',
    dasarHukum: 'UU No. 1/1970',
    description: 'Pelaporan triwulanan Panitia Pembina K3 (P2K3), lisensi Ahli K3 & insiden kecelakaan kerja.'
  },
  {
    id: 'tka-online',
    name: 'TKA Online (RPTKA Kemnaker)',
    fullName: 'TKA Online Kemnaker (Tenaga Kerja Asing)',
    instansi: 'Binapenta Kemnaker',
    category: 'hr',
    dasarHukum: 'PP No. 34/2021',
    description: 'Pengesahan RPTKA, notifikasi izin kerja ekspatriat & pembayaran DKP-TKA.'
  },
  {
    id: 'karirhub',
    name: 'SIAPkerja / Karirhub Kemnaker',
    fullName: 'SIAPkerja / Karirhub Kemnaker RI',
    instansi: 'Pusat Pasar Kerja Kemnaker',
    category: 'hr',
    dasarHukum: 'Kepmenaker 40/2023',
    description: 'Publikasi lowongan kerja resmi, kuota tenaga kerja disabilitas & pelaporan penempatan.'
  },
  {
    id: 'pphi',
    name: 'PPHI / SIMASNAKER Hubungan Industrial',
    fullName: 'PPHI / SIMASNAKER Kemnaker RI',
    instansi: 'Ditjen PHI Kemnaker',
    category: 'hr',
    dasarHukum: 'UU No. 2/2004',
    description: 'Pencatatan Serikat Pekerja (SP/SB), penatausahaan LKS Bipartit & mediasi perselisihan.'
  }
];

const GA_PORTALS_DATA: PortalItemDef[] = [
  {
    id: 'oss',
    name: 'OSS RBA / LKPM (BKPM)',
    fullName: 'OSS RBA (Kementerian Investasi / BKPM)',
    instansi: 'Kementerian Investasi / BKPM',
    category: 'ga',
    dasarHukum: 'PP No. 5/2021',
    description: 'Penerbitan NIB legalitas usaha & kewajiban pelaporan LKPM triwulanan/semesteran.'
  },
  {
    id: 'simpel',
    name: 'SIMPEL KLHK (Lingkungan Hidup)',
    fullName: 'SIMPEL KLHK (Pelaporan Kinerja Lingkungan Hidup)',
    instansi: 'Ditjen PPKL KLHK',
    category: 'ga',
    dasarHukum: 'PP No. 22/2021',
    description: 'Pelaporan semesteran emisi genset kantor, pengolahan air limbah STP & UKL-UPL.'
  },
  {
    id: 'festronik',
    name: 'Festronik KLHK (Limbah B3)',
    fullName: 'FESTRONIK KLHK (Manifest Elektronik Limbah B3)',
    instansi: 'Ditjen PSLB3 KLHK',
    category: 'ga',
    dasarHukum: 'Permen LHK 6/2021',
    description: 'Manifest elektronik serah terima limbah B3 fasilitas (oli genset, toner printer, aki UPS).'
  },
  {
    id: 'simbg',
    name: 'SIMBG PUPR (PBG & SLF Gedung)',
    fullName: 'SIMBG (Sistem Informasi Manajemen Bangunan Gedung)',
    instansi: 'Ditjen Cipta Karya PUPR',
    category: 'ga',
    dasarHukum: 'PP No. 16/2021',
    description: 'Persetujuan Bangunan Gedung (PBG pengganti IMB) & Sertifikat Laik Fungsi (SLF) kantor.'
  },
  {
    id: 'bapenda',
    name: 'Pajak Daerah Bapenda (Reklame & ABT)',
    fullName: 'Bapenda / Pajak Daerah (Pajak Reklame & Operasional)',
    instansi: 'Bapenda Pemda',
    category: 'ga',
    dasarHukum: 'UU HKPD No. 1/2022',
    description: 'Pajak Reklame neon box kantor, Pajak Air Tanah (ABT) & PKB armada dinas perusahaan.'
  }
];

interface SeekbarSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

function SeekbarSwitch({
  checked,
  onChange,
  disabled = false,
  ariaLabel = 'Toggle'
}: SeekbarSwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        disabled 
          ? 'cursor-not-allowed bg-slate-200 opacity-60' 
          : checked 
            ? 'cursor-pointer bg-blue-600' 
            : 'cursor-pointer bg-slate-300 hover:bg-slate-400'
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export const ModuleNavigationSettings: React.FC = () => {
  const { 
    config, 
    toggleRecruitment, 
    toggleGeneralAffairs, 
    toggleEPortal, 
    setAllEPortals, 
    resetToDefaults 
  } = useAppModulesConfig();

  const isGaModuleActive = config.enableGeneralAffairs;

  return (
    <div className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Modul & Navigasi Sistem
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Atur visibilitas grup navigasi Rekrutmen, General Affairs, dan integrasi E-Portal resmi pemerintah
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetToDefaults}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          title="Reset ke pengaturan bawaan (Semua Aktif)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Default</span>
        </button>
      </div>

      {/* Grid: Card Rekrutmen & Card General Affairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: MODUL REKRUTMEN */}
        <div 
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
            config.enableRecruitment
              ? 'bg-white border-slate-200 shadow-2xs ring-1 ring-blue-600/10'
              : 'bg-slate-50/90 border-slate-200/80 opacity-75'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  config.enableRecruitment ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      Modul Rekrutmen
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      config.enableRecruitment 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/80' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {config.enableRecruitment ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal block truncate mt-0.5">
                    Grup Navigasi ATS & Asesmen Kandidat
                  </span>
                </div>
              </div>

              {/* Seekbar Switch */}
              <div className="shrink-0 pt-0.5">
                <SeekbarSwitch
                  checked={config.enableRecruitment}
                  onChange={(val) => toggleRecruitment(val)}
                  ariaLabel="Toggle Modul Rekrutmen"
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Mengontrol penampilan grup navigasi Rekrutmen di sidebar dan laci aplikasi beserta seluruh modul di dalamnya.
            </p>

            {/* Badges of Included Modules */}
            <div className="pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Modul yang dikontrol:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableRecruitment ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Screening ATS
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableRecruitment ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Assessment & Tes Online
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableRecruitment ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Interview & Checklist
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableRecruitment ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Evaluasi Rekrutmen
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100/90 mt-4 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Visibilitas Menu Rekrutmen</span>
            <span className={`font-semibold ${config.enableRecruitment ? 'text-blue-600' : 'text-slate-400'}`}>
              {config.enableRecruitment ? 'Ditampilkan di Navigasi' : 'Disembunyikan'}
            </span>
          </div>
        </div>

        {/* CARD 2: MODUL GENERAL AFFAIRS (GA) */}
        <div 
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
            config.enableGeneralAffairs
              ? 'bg-white border-slate-200 shadow-2xs ring-1 ring-emerald-600/10'
              : 'bg-slate-50/90 border-slate-200/80 opacity-75'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  config.enableGeneralAffairs ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      Modul General Affairs (GA)
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      config.enableGeneralAffairs 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {config.enableGeneralAffairs ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal block truncate mt-0.5">
                    Grup Navigasi Fasilitas, ATK & E-Portal GA
                  </span>
                </div>
              </div>

              {/* Seekbar Switch */}
              <div className="shrink-0 pt-0.5">
                <SeekbarSwitch
                  checked={config.enableGeneralAffairs}
                  onChange={(val) => toggleGeneralAffairs(val)}
                  ariaLabel="Toggle Modul General Affairs"
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Mengontrol penampilan grup navigasi General Affair beserta seluruh isinya dan juga laporan E-Portal GA di sistem.
            </p>

            {/* Badges of Included Modules */}
            <div className="pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Modul yang dikontrol:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableGeneralAffairs ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Overview GA
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableGeneralAffairs ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Inventaris & Aset
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableGeneralAffairs ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Pengadaan & ATK
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableGeneralAffairs ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Fasilitas Gedung
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableGeneralAffairs ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Vendor & Izin
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  config.enableGeneralAffairs ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  Buku Tamu & Surat
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  config.enableGeneralAffairs ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200/70 text-slate-400 line-through'
                }`}>
                  E-Portal GA (5 Portal)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100/90 mt-4 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Visibilitas Menu GA & E-Portal</span>
            <span className={`font-semibold ${config.enableGeneralAffairs ? 'text-emerald-600' : 'text-slate-400'}`}>
              {config.enableGeneralAffairs ? 'Ditampilkan di Navigasi' : 'Disembunyikan'}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: INTEGRASI E-PORTAL RESMI PEMERINTAH DENGAN SEEKBAR INDIVIDUAL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Integrasi E-Portal Resmi Pemerintah
              </h4>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Konfigurasi seekbar untuk mengatur portal instansi mana saja yang aktif dan ditampilkan di sistem
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAllEPortals(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Aktifkan Semua
            </button>
            <button
              type="button"
              onClick={() => setAllEPortals(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Matikan Semua
            </button>
          </div>
        </div>

        {/* SUB-SECTION A: LAPORAN HR (9 PORTAL) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                Laporan HR (Ketenagakerjaan & Pajak)
              </h5>
              <span className="text-[11px] font-semibold text-slate-400">
                (9 Portal Resmi)
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {HR_PORTALS_DATA.filter(p => config.activeEPortals[p.id] !== false).length} dari 9 Aktif
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {HR_PORTALS_DATA.map((portal) => {
              const isActive = config.activeEPortals[portal.id] !== false;
              return (
                <div
                  key={portal.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                    isActive 
                      ? 'bg-white border-slate-200 shadow-2xs hover:border-blue-300' 
                      : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <PortalNavLogo logoKey={portal.id} className="w-5 h-5 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {portal.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {portal.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {portal.dasarHukum}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <SeekbarSwitch
                      checked={isActive}
                      onChange={(val) => toggleEPortal(portal.id, val)}
                      ariaLabel={`Toggle ${portal.name}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUB-SECTION B: LAPORAN GA (5 PORTAL) */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isGaModuleActive ? 'bg-blue-600' : 'bg-slate-400'}`} />
              <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                Laporan GA (Perizinan, Investasi & Fasilitas)
              </h5>
              <span className="text-[11px] font-semibold text-slate-400">
                (5 Portal Resmi)
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              {isGaModuleActive 
                ? `${GA_PORTALS_DATA.filter(p => config.activeEPortals[p.id] !== false).length} dari 5 Aktif`
                : 'Dinonaktifkan (GA Nonaktif)'}
            </div>
          </div>

          {/* GA Module Inactive Warning Notice */}
          {!isGaModuleActive && (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-800 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-900 block">
                  Modul General Affairs sedang Nonaktif
                </span>
                <p className="text-amber-800 leading-relaxed font-normal">
                  Seekbar modul General Affairs di atas harus diaktifkan terlebih dahulu agar Anda dapat memilih aktif atau tidaknya portal-portal di bawah ini. Jika modul General Affairs nonaktif, sistem tidak akan menampilkan laporan GA.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {GA_PORTALS_DATA.map((portal) => {
              const isIndividuallyActive = config.activeEPortals[portal.id] !== false;
              // Effective active state requires GA module to be active
              const isEffectiveActive = isGaModuleActive && isIndividuallyActive;

              return (
                <div
                  key={portal.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                    !isGaModuleActive
                      ? 'bg-slate-100/70 border-slate-200/70 opacity-50 select-none'
                      : isEffectiveActive 
                        ? 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300' 
                        : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <PortalNavLogo logoKey={portal.id} className="w-5 h-5 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {portal.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {portal.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {portal.dasarHukum}
                        </span>
                        {!isGaModuleActive && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Kunci GA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5" title={!isGaModuleActive ? 'Aktifkan modul General Affairs terlebih dahulu' : undefined}>
                    <SeekbarSwitch
                      checked={isEffectiveActive}
                      disabled={!isGaModuleActive}
                      onChange={(val) => toggleEPortal(portal.id, val)}
                      ariaLabel={`Toggle ${portal.name}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
