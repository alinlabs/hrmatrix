import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  CalendarRange, 
  BarChart3, 
  Calculator, 
  Coins, 
  Target, 
  Library, 
  FileText, 
  Printer, 
  Database, 
  Settings, 
  BookOpen, 
  HelpCircle, 
  Info, 
  Search, 
  ChevronRight,
  Compass,
  Sparkles,
  Megaphone,
  ClipboardCheck,
  FileSignature,
  Scale,
  Globe,
  X,
  Building2,
  Laptop,
  ShoppingBag,
  Wrench,
  ShieldCheck,
  UserCheck,
  BookOpenCheck,
  Package,
  AlertTriangle
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';
import { useAppModulesConfig, isEPortalActive, HR_EPORTAL_IDS, GA_EPORTAL_IDS } from '../../services/moduleConfigService';

interface RouteCardItem {
  name: string;
  href: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const ROUTE_LIST: RouteCardItem[] = [
  // Kelompok: Operasional Utama
  {
    name: 'Dashboard',
    href: '/',
    group: 'Operasional Utama',
    icon: LayoutDashboard,
    description: 'Ringkasan data karyawan, tren kehadiran harian, dan metrik sistem terkini.'
  },
  {
    name: 'Data Karyawan',
    href: '/employees',
    group: 'Operasional Utama',
    icon: Users,
    description: 'Direktori profil personalia, nomor induk karyawan, jabatan, departemen, dan data pajak.'
  },
  {
    name: 'Presensi Harian',
    href: '/presensi?tab=daily',
    group: 'Operasional Utama',
    icon: Clock,
    description: 'Monitoring absensi masuk/pulang harian, pencatatan manual, dan log kehadiran real-time.'
  },
  {
    name: 'Jadwal & Matriks Shift',
    href: '/jadwal',
    group: 'Operasional Utama',
    icon: CalendarDays,
    description: 'Penyusunan matriks roster kerja bulanan, pengaturan shift tim, dan tukar jadwal.'
  },
  {
    name: 'Pengajuan & Saldo Cuti',
    href: '/cuti',
    group: 'Operasional Utama',
    icon: CalendarRange,
    description: 'Pencatatan permohonan cuti, perizinan sakit, kuota tahunan, dan kebijakan cuti.'
  },
  {
    name: 'Rekapitulasi Absensi',
    href: '/presensi?tab=rekap',
    group: 'Operasional Utama',
    icon: BarChart3,
    description: 'Rekapitulasi total kehadiran, kalkulasi jam kerja reguler, keterlambatan, dan jam lembur.'
  },
  {
    name: 'Job Desk & Standar Kerja',
    href: '/job-desk',
    group: 'Operasional Utama',
    icon: FileText,
    description: 'Uraian tugas pokok jabatan, tanggung jawab kerja, dan kualifikasi kompetensi tim.'
  },
  {
    name: 'Screening',
    href: '/lowongan',
    group: 'Operasional Utama',
    icon: Sparkles,
    description: 'Pembuatan lowongan kerja otomatis berbasis jobdesk dengan pemecahan kualifikasi ramah ATS.'
  },
  {
    name: 'Assessment & Tes Online',
    href: '/assessment',
    group: 'Operasional Utama',
    icon: ClipboardCheck,
    description: 'Katalog paket tes psikotes (DISC), penalaran kognitif TPA, etika kerja SJT, dan bahasa Inggris bisnis untuk kandidat.'
  },
  {
    name: 'Evaluasi Rekrutmen',
    href: '/evaluation',
    group: 'Operasional Utama',
    icon: BarChart3,
    description: 'Matriks kombinasi skor Screening (ATS), Assessment, dan Interview untuk keputusan final rekrutmen.'
  },
  {
    name: 'Checking Tools (Verifikasi Rekrutmen)',
    href: '/checking-tools',
    group: 'Operasional Utama',
    icon: ShieldCheck,
    description: 'Verifikasi ijazah perguruan tinggi (SIVIL PDDikti), sertifikasi BNSP, riwayat kredit SLIK OJK (iDebKu), NIK KTP Dukcapil, NPWP, SKCK Polri, dan perkara hukum SIPP MA.'
  },

  // Kelompok: Legal Affairs
  {
    name: 'Kontrak Kerja',
    href: '/kontrak',
    group: 'Legal Affairs',
    icon: FileSignature,
    description: 'Generator surat perjanjian kerja resmi (PKWT, PKWTT, Addendum Perpanjangan, Magang, Freelance) presisi regulasi UU Cipta Kerja & PP 35/2021.'
  },
  {
    name: 'Surat & SK Resmi',
    href: '/surat',
    group: 'Legal Affairs',
    icon: FileText,
    description: 'Generator naskah dinas & Surat Keputusan Direksi (SK Promosi, Demosi, Mutasi, Pengangkatan Tetap, SP 1-3, Paklaring, PHK & Surat Tugas).'
  },
  {
    name: 'Peraturan Perusahaan (PP)',
    href: '/legal/peraturan-perusahaan',
    group: 'Legal Affairs',
    icon: Scale,
    description: 'Draf naskah Peraturan Perusahaan standar 11 Bab & 29 Pasal siap pakai dan panduan pendaftaran Disnaker.'
  },
  {
    name: 'Undang-Undang & PP',
    href: '/legal/undang-undang',
    group: 'Legal Affairs',
    icon: Scale,
    description: 'Pusat pasal hukum ketenagakerjaan resmi, kompensasi PKWT PP 35/2021, sanksi SP 6 bulan, dan kalkulator pesangon.'
  },
  {
    name: 'Referensi Standar ISO',
    href: '/legal/standar-iso',
    group: 'Legal Affairs',
    icon: Scale,
    description: 'Kompilasi standar ISO internasional (ISO 30414 HRM, ISO 45001 K3, ISO 27001 Security, ISO 9001 Mutu) & checklist audit.'
  },

  // Kelompok: General Affair (GA)
  {
    name: 'Overview General Affairs',
    href: '/ga',
    group: 'General Affair',
    icon: Building2,
    description: 'Dashboard pusat operasional GA, ringkasan nilai aset, stok kritis, jadwal servis, dan tamu aktif frontdesk.'
  },
  {
    name: 'Inventaris & Aset Kantor',
    href: '/ga/aset',
    group: 'General Affair',
    icon: Laptop,
    description: 'Pencatatan kepemilikan laptop/PC, kendaraan operasional, furnitur kantor, barcode tag & form BAST serah terima.'
  },
  {
    name: 'Katalog Stok & Pantry',
    href: '/ga/atk?tab=stok',
    group: 'General Affair',
    icon: ShoppingBag,
    description: 'Inventaris alat tulis kantor (ATK), kertas, toner printer, galon air, konsumsi pantry & kotak P3K.'
  },
  {
    name: 'Pengajuan Pengadaan (PR)',
    href: '/ga/atk?tab=pengadaan',
    group: 'General Affair',
    icon: FileText,
    description: 'Formulir Purchase Request (PR), alur persetujuan HR/GA Manager & log pembelian pengadaan barang kantor.'
  },
  {
    name: 'Jadwal Ruangan Rapat',
    href: '/ga/fasilitas?tab=ruangan',
    group: 'General Affair',
    icon: CalendarDays,
    description: 'Reservasi ruang meeting, jadwal sesi penggunaan, proyektor display, dan kapasitas ruang rapat kantor.'
  },
  {
    name: 'Jadwal Service Fasilitas',
    href: '/ga/fasilitas?tab=servis',
    group: 'General Affair',
    icon: Wrench,
    description: 'Jadwal servis rutin AC, maintenance genset berkala, pengujian APAR pemadam api, dan kelistrikan.'
  },
  {
    name: 'Keluhan Kerusakan',
    href: '/ga/fasilitas?tab=kerusakan',
    group: 'General Affair',
    icon: AlertTriangle,
    description: 'Tiket work order laporan kerusakan sarana kantor, penugasan teknisi dan pelacakan status perbaikan.'
  },
  {
    name: 'Daftar Rekanan Vendor',
    href: '/ga/vendor?tab=vendor',
    group: 'General Affair',
    icon: Building2,
    description: 'Database supplier ATK, rekanan servis teknisi, vendor internet ISP & log riwayat kontrak kerjasama.'
  },
  {
    name: 'Legalitas, SLF & Izin',
    href: '/ga/vendor?tab=izin',
    group: 'General Affair',
    icon: ShieldCheck,
    description: 'Tracking masa berlaku Sertifikat Laik Fungsi (SLF), izin genset K3 Disnaker, izin reklame & asuransi properti.'
  },
  {
    name: 'Daftar Buku Tamu',
    href: '/ga/buku-tamu?tab=tamu',
    group: 'General Affair',
    icon: UserCheck,
    description: 'Buku tamu resepsionis, check-in tamu frontdesk, tujuan berkunjung, dan cetak badge nomor visitor pass.'
  },
  {
    name: 'Log Surat & Ekspedisi',
    href: '/ga/buku-tamu?tab=surat',
    group: 'General Affair',
    icon: BookOpenCheck,
    description: 'Agenda penomoran surat dinas masuk/keluar resmi kantor, resi paket ekspedisi kurir & tanda terima arsip.'
  },

  // Kelompok: Finansial & Kinerja
  {
    name: 'Periode Payroll & Gaji',
    href: '/payroll',
    group: 'Finansial & Kinerja',
    icon: Calculator,
    description: 'Pengelolaan periode penggajian bulanan, penerbitan slip gaji, dan riwayat transfer.'
  },
  {
    name: 'Kompensasi & Benefit',
    href: '/kompensasi',
    group: 'Finansial & Kinerja',
    icon: Coins,
    description: 'Konfigurasi komponen upah, tunjangan tetap/variabel, jaminan BPJS, dan tarif PPh 21 TER.'
  },
  {
    name: 'KPI & Manajemen Performa',
    href: '/kpi',
    group: 'Finansial & Kinerja',
    icon: Target,
    description: 'Penyusunan target indikator kinerja kunci (KPI), pembobotan, dan evaluasi berkala.'
  },
  {
    name: 'Katalog KPI Umum',
    href: '/kpi/katalog-umum',
    group: 'Finansial & Kinerja',
    icon: Library,
    description: 'Pustaka indikator KPI standar industri untuk berbagai departemen dan peran kerja.'
  },

  // Kelompok: Administrasi & Bantuan
  {
    name: 'Laporan Rekapitulasi',
    href: '/reports',
    group: 'Administrasi & Bantuan',
    icon: Printer,
    description: 'Pusat pembuatan dan ekspor dokumen laporan karyawan, presensi, dan payroll ke PDF & Excel.'
  },
  {
    name: 'e-Portal - Laporan HR',
    href: '/e-portal/kemenaker',
    group: 'Administrasi & Bantuan',
    icon: Globe,
    description: 'Pusat integrasi portal resmi HR: Kemenaker WLKP, BPJSTK SIPP, EDABU BPJS Kes, DJP Online, e-PP & PKB, Teman K3 (P2K3), TKA Online, Karirhub, dan PPHI.'
  },
  {
    name: 'e-Portal - Laporan GA',
    href: '/e-portal/oss',
    group: 'Administrasi & Bantuan',
    icon: Globe,
    description: 'Pusat integrasi portal resmi GA: OSS RBA / LKPM (BKPM), SIMPEL KLHK (Lingkungan/Genset), Festronik (Limbah B3), SIMBG PUPR (PBG & SLF Gedung), dan Pajak Daerah Bapenda.'
  },
  {
    name: 'Database Manager',
    href: '/database',
    group: 'Administrasi & Bantuan',
    icon: Database,
    description: 'Pencadangan (backup JSON), pemulihan data lokal, dan pemeliharaan basis data IndexedDB.'
  },
  {
    name: 'Pengaturan Sistem',
    href: '/settings',
    group: 'Administrasi & Bantuan',
    icon: Settings,
    description: 'Profil perusahaan, konfigurasi aturan jam kerja, toleransi absensi, dan preferensi umum.'
  },
  {
    name: 'EBook HRMatrix',
    href: '/ebook',
    group: 'Administrasi & Bantuan',
    icon: BookOpen,
    description: 'Dokumentasi langkah penggunaan aplikasi, bedah rumus perhitungan, dan regulasi.'
  },
  {
    name: 'Pertanyaan Umum (FAQ)',
    href: '/faq',
    group: 'Administrasi & Bantuan',
    icon: HelpCircle,
    description: 'Pusat jawaban pertanyaan seputar penggunaan sistem, privasi lokal, dan fitur aplikasi.'
  },
  {
    name: 'Tentang HRMatrix',
    href: '/tentang',
    group: 'Administrasi & Bantuan',
    icon: Info,
    description: 'Profil aplikasi, arsitektur offline-first, integritas data, dan informasi versi sistem.'
  },
  {
    name: 'Prompt & Poster Promosi',
    href: '/prompt',
    group: 'Administrasi & Bantuan',
    icon: Megaphone,
    description: 'Katalog prompt AI & poster promosi 4:5 visual mockup 3D pop-out untuk seluruh halaman aplikasi.'
  }
];

export function NavigasiCepatPage() {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { config: modulesConfig } = useAppModulesConfig();

  const filteredRoutes = useMemo(() => {
    // 1. Base filter based on enabled modules
    const baseList = ROUTE_LIST.filter(r => {
      // Rekrutmen
      if (!modulesConfig.enableRecruitment) {
        if (
          r.href.startsWith('/lowongan') ||
          r.href.startsWith('/screening') ||
          r.href.startsWith('/assessment') ||
          r.href.startsWith('/interview') ||
          r.href.startsWith('/evaluation') ||
          r.href.startsWith('/candidate')
        ) {
          return false;
        }
      }

      // General Affairs
      if (!modulesConfig.enableGeneralAffairs) {
        if (r.group === 'General Affair' || r.href.startsWith('/ga')) {
          return false;
        }
        if (r.href.startsWith('/e-portal/oss') || r.name.includes('Laporan GA')) {
          return false;
        }
      }

      // Check specific E-Portals
      if (r.name.includes('Laporan HR') || r.href.startsWith('/e-portal/kemenaker')) {
        const hasActiveHr = HR_EPORTAL_IDS.some(id => isEPortalActive(id, modulesConfig));
        if (!hasActiveHr) return false;
      }
      if (r.name.includes('Laporan GA') || r.href.startsWith('/e-portal/oss')) {
        const hasActiveGa = GA_EPORTAL_IDS.some(id => isEPortalActive(id, modulesConfig));
        if (!hasActiveGa) return false;
      }

      return true;
    });

    if (!search.trim()) return baseList;
    const q = search.toLowerCase();
    return baseList.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.href.toLowerCase().includes(q) ||
      r.group.toLowerCase().includes(q)
    );
  }, [search, modulesConfig]);

  // Grouping
  const groups = useMemo(() => {
    const map = new Map<string, RouteCardItem[]>();
    filteredRoutes.forEach(r => {
      const arr = map.get(r.group) || [];
      arr.push(r);
      map.set(r.group, arr);
    });
    return Array.from(map.entries());
  }, [filteredRoutes]);

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Card Icon Search */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          search
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Navigasi Cepat"
        aria-label="Cari Navigasi Cepat"
      >
        <Search className="w-4 h-4" />
        {search && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-12">
      {/* 1. Page Header Title */}
      <PageHeaderTitle
        title="Navigasi Cepat"
        subtitle="Akses Langsung Seluruh Modul"
      />

      {/* 2. Normal Header Action Cards (visible when search is not open) */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {/* 3. Expanded Inline Header Searchbar (SPEC_HEADER_SEARCHBAR_EXPAND.md) */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari rute modul (misal: cuti, gaji, kpi, karyawan)..."
        />
      )}

      {/* Active Search Badge */}
      {search && (
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs text-slate-500 font-medium">Filter Pencarian:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            "{search}"
            <button
              type="button"
              onClick={() => setSearch('')}
              className="hover:text-blue-900 cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Card List Per Kelompok */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
          <Compass className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">Tidak ada rute yang cocok</h3>
          <p className="text-xs text-slate-500">
            Tidak ditemukan modul dengan kata kunci "{search}".
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Bersihkan Pencarian
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([groupName, items]) => (
            <div key={groupName} className="space-y-3">
              <div className="px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {groupName}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-blue-600 shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {item.name}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
