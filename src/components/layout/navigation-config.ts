import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays,
  CalendarRange,
  Calculator, 
  Target, 
  Database, 
  Settings, 
  FileText, 
  Building2,
  BookOpen,
  HelpCircle,
  Info,
  Briefcase,
  ClipboardCheck,
  FileSignature,
  Scale,
  Laptop,
  ShoppingBag,
  Wrench,
  ShieldCheck,
  BookOpenCheck
} from 'lucide-react';
import { GARUDA_INDONESIA_URL } from '../../pages/e-portal/logo-portal';
import { AppModulesConfig, isEPortalActive } from '../../services/module-config-service';

export interface NavSubItem {
  name: string;
  href: string;
  logo?: string;
  groupHeader?: string;
  portalId?: string;
  external?: boolean;
}

export interface NavMainItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconImg?: string;
  hasDropdown?: boolean;
  external?: boolean;
  subItems?: NavSubItem[];
}

export const getMainNavigation = (isShiftMode: boolean): NavMainItem[] => [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Karyawan', 
    icon: Users,
    hasDropdown: true,
    subItems: [
      { name: 'Daftar Karyawan', href: '/employees' },
      { name: 'Jobdesk', href: '/job-desk' },
    ]
  },
  { 
    name: 'Presensi', 
    icon: Clock,
    hasDropdown: true,
    subItems: [
      { name: 'Daily', href: '/presensi?tab=daily' },
      { name: 'Rekap', href: '/presensi?tab=rekap' },
    ]
  },
  { 
    name: 'Jadwal', 
    icon: CalendarDays,
    hasDropdown: true,
    subItems: isShiftMode ? [
      { name: 'Kalender', href: '/jadwal?tab=kalender' },
      { name: 'Tukar Shift', href: '/jadwal?tab=tukar-shift' },
      { name: 'Lembur', href: '/jadwal?tab=lembur' },
    ] : [
      { name: 'Kalender', href: '/jadwal?tab=kalender' },
      { name: 'Lembur', href: '/jadwal?tab=lembur' },
    ]
  },
  { 
    name: 'Cuti', 
    icon: CalendarRange,
    hasDropdown: true,
    subItems: [
      { name: 'Saldo Cuti', href: '/cuti?tab=saldo' },
      { name: 'Pengajuan Cuti', href: '/cuti?tab=pengajuan' },
      { name: 'Kebijakan Cuti', href: '/cuti?tab=kebijakan' },
    ]
  },
  { 
    name: 'KPI', 
    icon: Target,
    hasDropdown: true,
    subItems: [
      { name: 'Laporan Periode', href: '/kpi' },
      { name: 'KPI Umum', href: '/kpi/katalog-umum' },
      { name: 'Konfigurasi KPI', href: '/kpi?view=config' },
    ]
  },
  { 
    name: 'Payroll', 
    icon: Calculator,
    hasDropdown: true,
    subItems: [
      { name: 'Daftar Periode', href: '/payroll' },
      { name: 'Tunjangan', href: '/payroll/tunjangan' },
      { name: 'BPJS', href: '/payroll/bpjs' },
      { name: 'Pajak', href: '/payroll/pajak' },
    ]
  },
];

export const recruitmentNavigation: NavMainItem[] = [
  { name: 'Screening', href: '/screening', icon: Briefcase },
  { name: 'Assessment', href: '/assessment', icon: ClipboardCheck },
  { name: 'Candidate', href: '/candidate', icon: Users },
  { 
    name: 'Checking Tools', 
    icon: ShieldCheck,
    hasDropdown: true,
    subItems: [
      { groupHeader: 'Akademik & Profesi', name: 'Ijazah Perguruan Tinggi', href: 'https://pddikti.kemdiktisaintek.go.id/', logo: '/gambar/logo/logo-diktisaintek.webp', external: true },
      { name: 'Ijazah SD - SMA / SMK', href: 'https://nisn.data.kemdikbud.go.id/', logo: '/gambar/logo/logo-kemendikbud.webp', external: true },
      { name: 'Sertifikasi BNSP', href: 'https://bnsp.go.id/', logo: '/gambar/logo/logo-bnsp.webp', external: true },
      
      { groupHeader: 'Finansial & Kredit', name: 'SLIK OJK (iDebKu)', href: 'https://idebku.ojk.go.id/', logo: '/gambar/logo/logo-ojk.webp', external: true },

      { groupHeader: 'Identitas & Kependudukan', name: 'Cek KTP Dukcapil', href: 'https://layananonline.dukcapil.kemendagri.go.id/', logo: '/gambar/logo/logo-kemendagri.webp', external: true },
      { name: 'Cek NPWP DJP', href: 'https://ereg.pajak.go.id/ceknpwp', logo: '/gambar/logo/logo-djp.webp', external: true },

      { groupHeader: 'Integritas Hukum', name: 'SKCK Online Polri', href: 'https://skck.polri.go.id/', logo: '/gambar/logo/logo-polri.webp', external: true },
      { name: 'SIPP Mahkamah Agung', href: 'https://putusan3.mahkamahagung.go.id/', logo: '/gambar/logo/logo-mahkamah-agung.webp', external: true },
      { name: 'STR / SIP Kemenkes', href: 'https://satusehat.kemkes.go.id/sdmk', logo: '/gambar/logo/logo-kemenakes.webp', external: true },
    ]
  },
];

export const legalNavigation: NavMainItem[] = [
  { 
    name: 'Dokumen', 
    icon: FileSignature,
    hasDropdown: true,
    subItems: [
      { name: 'Kontrak Kerja', href: '/kontrak' },
      { name: 'Surat & SK Resmi', href: '/surat' },
    ]
  },
  { 
    name: 'Regulasi', 
    icon: Scale,
    hasDropdown: true,
    subItems: [
      { name: 'Peraturan Perusahaan', href: '/legal/peraturan-perusahaan' },
      { name: 'Undang Undang', href: '/legal/undang-undang' },
      { name: 'Referensi Standar ISO', href: '/legal/standar-iso' },
    ]
  }
];

export const gaNavigation: NavMainItem[] = [
  { name: 'Overview GA', href: '/ga', icon: Building2 },
  { name: 'Inventaris & Aset', href: '/ga/aset', icon: Laptop },
  { 
    name: 'Pengadaan & ATK', 
    icon: ShoppingBag,
    hasDropdown: true,
    subItems: [
      { name: 'Katalog Stok & Pantry', href: '/ga/atk?tab=stok' },
      { name: 'Pengajuan Pengadaan', href: '/ga/atk?tab=pengadaan' },
    ]
  },
  { 
    name: 'Fasilitas & Servis', 
    icon: Wrench,
    hasDropdown: true,
    subItems: [
      { name: 'Jadwal Ruangan', href: '/ga/fasilitas?tab=ruangan' },
      { name: 'Jadwal Service', href: '/ga/fasilitas?tab=servis' },
      { name: 'Keluhan Kerusakan', href: '/ga/fasilitas?tab=kerusakan' },
    ]
  },
  { 
    name: 'Vendor & Perizinan', 
    icon: ShieldCheck,
    hasDropdown: true,
    subItems: [
      { name: 'Daftar Vendor', href: '/ga/vendor?tab=vendor' },
      { name: 'Legalitas, SLF & Izin', href: '/ga/vendor?tab=izin' },
    ]
  },
  { 
    name: 'Buku Tamu & Surat', 
    icon: BookOpenCheck,
    hasDropdown: true,
    subItems: [
      { name: 'Daftar Tamu', href: '/ga/buku-tamu?tab=tamu' },
      { name: 'Log Surat', href: '/ga/buku-tamu?tab=surat' },
    ]
  },
];

export const reportsNavigation: NavMainItem[] = [
  { name: 'Laporan', href: '/reports', icon: FileText },
  { 
    name: 'e-Portal', 
    iconImg: GARUDA_INDONESIA_URL,
    hasDropdown: true,
    subItems: [
      // Sub-kategori: Laporan HR
      { groupHeader: 'Laporan HR', portalId: 'kemenaker', name: 'Kemenaker (WLKP)', href: 'https://wajiblapor.kemnaker.go.id/', logo: '/gambar/logo/logo-kemnaker.webp', external: true },
      { portalId: 'bpjstk', name: 'BPJSTK (SIPP)', href: 'https://sipp.bpjsketenagakerjaan.go.id/', logo: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp', external: true },
      { portalId: 'edabu', name: 'EDABU (BPJS Kes)', href: 'https://edabu.bpjs-kesehatan.go.id/Edabu/Home/Login', logo: '/gambar/logo/logo-bpjs-kesehatan.webp', external: true },
      { portalId: 'djp', name: 'DJP Online Pajak', href: 'https://djponline.pajak.go.id/account/login', logo: '/gambar/logo/logo-djp.webp', external: true },
      { portalId: 'e-pp-pkb', name: 'E-PP & PKB', href: 'https://pppkb.kemnaker.go.id/', logo: '/gambar/logo/logo-industrial.webp', external: true },
      { portalId: 'temank3', name: 'Teman K3 (P2K3)', href: 'https://temank3.kemnaker.go.id/', logo: '/gambar/logo/logo-k3.webp', external: true },
      { portalId: 'tka-online', name: 'TKA Online (RPTKA)', href: 'https://tka-online.kemnaker.go.id/', logo: '/gambar/logo/logo-kitas.webp', external: true },
      { portalId: 'karirhub', name: 'Karirhub (SIAPkerja)', href: 'https://karirhub.kemnaker.go.id/', logo: '/gambar/logo/logo-siap-kerja.webp', external: true },
      { portalId: 'pphi', name: 'PPHI (Hub Industrial)', href: 'https://hi.kemnaker.go.id/', logo: '/gambar/logo/logo-industrial.webp', external: true },

      // Sub-kategori: Laporan GA
      { groupHeader: 'Laporan GA', portalId: 'oss', name: 'OSS RBA (LKPM)', href: 'https://oss.go.id/', logo: '/gambar/logo/logo-bkpm.webp', external: true },
      { portalId: 'simpel', name: 'SIMPEL KLHK', href: 'https://simpel.menlhk.go.id/', logo: '/gambar/logo/logo-klh.webp', external: true },
      { portalId: 'festronik', name: 'Festronik (Limbah B3)', href: 'https://festronik.menlhk.go.id/', logo: '/gambar/logo/logo-dlh.webp', external: true },
      { portalId: 'simbg', name: 'SIMBG PUPR (PBG/SLF)', href: 'https://simbg.pu.go.id/', logo: '/gambar/logo/logo-pupr.webp', external: true },
      { portalId: 'bapenda', name: 'Pajak Daerah (Bapenda)', href: 'https://pajakonline.jakarta.go.id/', logo: '/gambar/logo/logo-dirjen-pajak.webp', external: true },
    ]
  },
];

export const getFilteredReportsNavigation = (config?: AppModulesConfig): NavMainItem[] => {
  if (!config) return reportsNavigation;

  const hrItems: NavSubItem[] = [
    { portalId: 'kemenaker', name: 'Kemenaker (WLKP)', href: 'https://wajiblapor.kemnaker.go.id/', logo: '/gambar/logo/logo-kemnaker.webp', external: true },
    { portalId: 'bpjstk', name: 'BPJSTK (SIPP)', href: 'https://sipp.bpjsketenagakerjaan.go.id/', logo: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp', external: true },
    { portalId: 'edabu', name: 'EDABU (BPJS Kes)', href: 'https://edabu.bpjs-kesehatan.go.id/Edabu/Home/Login', logo: '/gambar/logo/logo-bpjs-kesehatan.webp', external: true },
    { portalId: 'djp', name: 'DJP Online Pajak', href: 'https://djponline.pajak.go.id/account/login', logo: '/gambar/logo/logo-djp.webp', external: true },
    { portalId: 'e-pp-pkb', name: 'E-PP & PKB', href: 'https://pppkb.kemnaker.go.id/', logo: '/gambar/logo/logo-industrial.webp', external: true },
    { portalId: 'temank3', name: 'Teman K3 (P2K3)', href: 'https://temank3.kemnaker.go.id/', logo: '/gambar/logo/logo-k3.webp', external: true },
    { portalId: 'tka-online', name: 'TKA Online (RPTKA)', href: 'https://tka-online.kemnaker.go.id/', logo: '/gambar/logo/logo-kitas.webp', external: true },
    { portalId: 'karirhub', name: 'Karirhub (SIAPkerja)', href: 'https://karirhub.kemnaker.go.id/', logo: '/gambar/logo/logo-siap-kerja.webp', external: true },
    { portalId: 'pphi', name: 'PPHI (Hub Industrial)', href: 'https://hi.kemnaker.go.id/', logo: '/gambar/logo/logo-industrial.webp', external: true },
  ].filter(item => item.portalId ? isEPortalActive(item.portalId, config) : true);

  const gaItems: NavSubItem[] = [
    { portalId: 'oss', name: 'OSS RBA (LKPM)', href: 'https://oss.go.id/', logo: '/gambar/logo/logo-bkpm.webp', external: true },
    { portalId: 'simpel', name: 'SIMPEL KLHK', href: 'https://simpel.menlhk.go.id/', logo: '/gambar/logo/logo-klh.webp', external: true },
    { portalId: 'festronik', name: 'Festronik (Limbah B3)', href: 'https://festronik.menlhk.go.id/', logo: '/gambar/logo/logo-dlh.webp', external: true },
    { portalId: 'simbg', name: 'SIMBG PUPR (PBG/SLF)', href: 'https://simbg.pu.go.id/', logo: '/gambar/logo/logo-pupr.webp', external: true },
    { portalId: 'bapenda', name: 'Pajak Daerah (Bapenda)', href: 'https://pajakonline.jakarta.go.id/', logo: '/gambar/logo/logo-dirjen-pajak.webp', external: true },
  ].filter(item => item.portalId ? isEPortalActive(item.portalId, config) : true);

  const combinedSubItems: NavSubItem[] = [];

  if (hrItems.length > 0) {
    hrItems.forEach((item, idx) => {
      combinedSubItems.push({
        ...item,
        groupHeader: idx === 0 ? 'Laporan HR' : undefined,
      });
    });
  }

  if (gaItems.length > 0) {
    gaItems.forEach((item, idx) => {
      combinedSubItems.push({
        ...item,
        groupHeader: idx === 0 ? 'Laporan GA' : undefined,
      });
    });
  }

  const navItems: NavMainItem[] = [
    { name: 'Laporan', href: '/reports', icon: FileText },
  ];

  if (combinedSubItems.length > 0) {
    navItems.push({
      name: 'e-Portal',
      iconImg: GARUDA_INDONESIA_URL,
      hasDropdown: true,
      subItems: combinedSubItems,
    });
  }

  return navItems;
};

export const systemNavigation: NavMainItem[] = [
  { name: 'Database', href: '/database', icon: Database },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
];

export const mobileBottomNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Karyawan', href: '/employees', icon: Users },
  { name: 'Presensi', href: '/presensi', icon: Clock },
  { name: 'KPI', href: '/kpi', icon: Target },
  { name: 'Payroll', href: '/payroll', icon: Calculator },
];

export const infoNavigation = [
  { name: 'EBook HRMatrix', href: '/ebook', icon: BookOpen },
  { name: 'FAQ & Bantuan', href: '/faq', icon: HelpCircle },
  { name: 'Tentang HRMatrix', href: '/tentang', icon: Info },
];

export const isSubItemActive = (href: string, currentPathname: string, currentSearch: string): boolean => {
  if (!href || href.startsWith('http://') || href.startsWith('https://')) {
    return false;
  }

  const [targetPath, targetQuery] = href.split('?');

  if (href.startsWith('/presensi')) {
    if (!currentPathname.startsWith('/presensi') && !currentPathname.startsWith('/attendance')) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    const targetTab = targetParams.get('tab');
    const curTab = currentParams.get('tab') || 'daily';
    if (targetTab === 'daily') return curTab === 'daily' || curTab === 'present';
    if (targetTab === 'rekap') return curTab === 'rekap' || curTab === 'summary';
    return true;
  }

  if (href.startsWith('/jadwal')) {
    if (!currentPathname.startsWith('/jadwal')) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    const targetTab = targetParams.get('tab');
    const curTab = currentParams.get('tab');
    if (targetTab === 'kalender') return curTab === 'kalender' || curTab === 'matriks' || !curTab;
    if (targetTab === 'tukar-shift') return curTab === 'tukar-shift' || curTab === 'pertukaran';
    if (targetTab === 'lembur') return curTab === 'lembur' || curTab === 'tambahan';
    return true;
  }

  if (href.startsWith('/cuti')) {
    if (!currentPathname.startsWith('/cuti')) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    const targetTab = targetParams.get('tab');
    const curTab = currentParams.get('tab');
    if (targetTab === 'saldo') return curTab === 'saldo' || curTab === 'kuota';
    if (targetTab === 'pengajuan') return curTab === 'pengajuan' || !curTab;
    if (targetTab === 'kebijakan') return curTab === 'kebijakan';
    return true;
  }
  
  if (targetQuery) {
    if (currentPathname !== targetPath) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    
    for (const [k, v] of targetParams.entries()) {
      if (k === 'tab' && v === 'present') {
        const curTab = currentParams.get('tab');
        if (curTab && curTab !== 'present') return false;
      } else if (k === 'view' && v === 'periods') {
        const curView = currentParams.get('view');
        if (curView && curView !== 'periods') return false;
      } else {
        if (currentParams.get(k) !== v) return false;
      }
    }
    return true;
  }
  
  if (href === '/') {
    return currentPathname === '/';
  }
  
  if (href === '/kpi') {
    const currentParams = new URLSearchParams(currentSearch);
    return currentPathname === '/kpi' && currentParams.get('view') !== 'config';
  }
  
  if (href === '/attendance') {
    const currentParams = new URLSearchParams(currentSearch);
    const curTab = currentParams.get('tab');
    return (currentPathname === '/attendance' || currentPathname === '/presensi') && (!curTab || curTab === 'present' || curTab === 'daily');
  }

  if (href === '/kompensasi') {
    return currentPathname.startsWith('/kompensasi') || currentPathname.startsWith('/regulation');
  }

  if (href === '/employees') {
    return currentPathname.startsWith('/employees');
  }

  if (href === '/job-desk') {
    return currentPathname.startsWith('/job-desk');
  }

  if (href === '/screening' || href === '/lowongan') {
    return (
      currentPathname.startsWith('/screening') ||
      currentPathname.startsWith('/lowongan') ||
      currentPathname.startsWith('/ats')
    );
  }

  if (href === '/assessment') {
    return currentPathname.startsWith('/assessment');
  }

  if (href === '/interview') {
    return currentPathname.startsWith('/interview');
  }

  if (href === '/candidate' || href === '/evaluation') {
    return (
      currentPathname.startsWith('/candidate') ||
      currentPathname.startsWith('/kandidat') ||
      currentPathname.startsWith('/evaluation') ||
      currentPathname.startsWith('/evaluasi')
    );
  }

  if (href === '/kontrak') {
    return currentPathname.startsWith('/kontrak') || currentPathname.startsWith('/legal/kontrak');
  }

  if (href === '/surat') {
    return currentPathname.startsWith('/surat') || currentPathname.startsWith('/legal/surat') || currentPathname.startsWith('/sk');
  }

  if (href === '/kpi/katalog-umum') {
    return currentPathname.startsWith('/kpi/katalog-umum') || currentPathname.startsWith('/settings/kpi-umum');
  }

  if (href === '/payroll') {
    return (
      (currentPathname === '/payroll' || currentPathname.startsWith('/payroll/')) &&
      !currentPathname.startsWith('/payroll/tunjangan') &&
      !currentPathname.startsWith('/payroll/bpjs') &&
      !currentPathname.startsWith('/payroll/pajak')
    );
  }

  if (href === '/payroll/tunjangan') {
    const currentParams = new URLSearchParams(currentSearch);
    const curTab = currentParams.get('tab');
    return (
      currentPathname.startsWith('/payroll/tunjangan') ||
      currentPathname.startsWith('/kompensasi/tunjangan') ||
      (currentPathname.startsWith('/kompensasi') && (!curTab || curTab === 'tunjangan'))
    );
  }

  if (href === '/payroll/bpjs') {
    const currentParams = new URLSearchParams(currentSearch);
    const curTab = currentParams.get('tab');
    return (
      currentPathname.startsWith('/payroll/bpjs') ||
      currentPathname.startsWith('/kompensasi/bpjs') ||
      (currentPathname.startsWith('/kompensasi') && (curTab === 'jaminan' || curTab === 'bpjs'))
    );
  }

  if (href === '/payroll/pajak') {
    const currentParams = new URLSearchParams(currentSearch);
    const curTab = currentParams.get('tab');
    return (
      currentPathname.startsWith('/payroll/pajak') ||
      currentPathname.startsWith('/kompensasi/pajak') ||
      (currentPathname.startsWith('/kompensasi') && curTab === 'pajak')
    );
  }

  if (href.includes('peraturan-perusahaan')) {
    return currentPathname.includes('peraturan-perusahaan');
  }

  if (href.includes('undang-undang')) {
    return currentPathname.includes('undang-undang');
  }

  if (href.includes('standar-iso')) {
    return currentPathname.includes('standar-iso') || currentPathname.includes('/iso');
  }

  if (href === '/ga') {
    return currentPathname === '/ga' || currentPathname === '/ga/dashboard';
  }

  if (href === '/ga/aset') {
    return currentPathname.startsWith('/ga/aset') || currentPathname.startsWith('/ga/asset') || currentPathname.startsWith('/ga/inventaris');
  }

  if (href.startsWith('/ga/atk')) {
    if (!currentPathname.startsWith('/ga/atk') && !currentPathname.startsWith('/ga/supplies') && !currentPathname.startsWith('/ga/pengadaan') && !currentPathname.startsWith('/ga/pr')) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    const targetTab = targetParams.get('tab');
    const curTab = currentParams.get('tab') || 'stok';
    if (targetTab === 'stok') return curTab === 'stok' || curTab === 'inventory' || !currentParams.get('tab');
    if (targetTab === 'pengadaan') return curTab === 'pengadaan' || curTab === 'pr';
    return true;
  }

  if (href.startsWith('/ga/fasilitas')) {
    if (!currentPathname.startsWith('/ga/fasilitas') && !currentPathname.startsWith('/ga/maintenance') && !currentPathname.startsWith('/ga/booking')) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    const targetTab = targetParams.get('tab');
    const curTab = currentParams.get('tab') || 'ruangan';
    if (targetTab === 'ruangan') return curTab === 'ruangan' || curTab === 'booking' || !currentParams.get('tab');
    if (targetTab === 'servis') return curTab === 'servis' || curTab === 'maintenance' || curTab === 'service';
    if (targetTab === 'kerusakan') return curTab === 'kerusakan' || curTab === 'ticket' || curTab === 'keluhan';
    return true;
  }

  if (href.startsWith('/ga/vendor')) {
    if (!currentPathname.startsWith('/ga/vendor') && !currentPathname.startsWith('/ga/izin') && !currentPathname.startsWith('/ga/perizinan')) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    const targetTab = targetParams.get('tab');
    const curTab = currentParams.get('tab') || 'vendor';
    if (targetTab === 'vendor') return curTab === 'vendor' || curTab === 'vendors' || !currentParams.get('tab');
    if (targetTab === 'izin') return curTab === 'izin' || curTab === 'permits' || curTab === 'legalitas';
    return true;
  }

  if (href.startsWith('/ga/buku-tamu')) {
    if (!currentPathname.startsWith('/ga/buku-tamu') && !currentPathname.startsWith('/ga/guestbook') && !currentPathname.startsWith('/ga/surat') && !currentPathname.startsWith('/ga/tamu')) return false;
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearch);
    const targetTab = targetParams.get('tab');
    const curTab = currentParams.get('tab') || 'tamu';
    if (targetTab === 'tamu') return curTab === 'tamu' || curTab === 'guests' || curTab === 'visitor' || !currentParams.get('tab');
    if (targetTab === 'surat') return curTab === 'surat' || curTab === 'mails' || curTab === 'mail';
    return true;
  }

  return currentPathname.startsWith(href);
};

export const isParentItemActive = (item: NavMainItem, currentPathname: string, currentSearch: string): boolean => {
  if (item.name === 'Presensi') {
    return currentPathname.startsWith('/presensi') || currentPathname.startsWith('/attendance');
  }
  if (item.name === 'Jadwal') {
    return currentPathname.startsWith('/jadwal');
  }
  if (item.name === 'Cuti') {
    return currentPathname.startsWith('/cuti');
  }
  if (item.name === 'Payroll') {
    return currentPathname.startsWith('/payroll') || currentPathname.startsWith('/kompensasi');
  }
  if (item.name === 'Pengadaan & ATK') {
    return currentPathname.startsWith('/ga/atk') || currentPathname.startsWith('/ga/supplies') || currentPathname.startsWith('/ga/pengadaan') || currentPathname.startsWith('/ga/pr');
  }
  if (item.name === 'Fasilitas & Servis') {
    return currentPathname.startsWith('/ga/fasilitas') || currentPathname.startsWith('/ga/maintenance') || currentPathname.startsWith('/ga/booking');
  }
  if (item.name === 'Vendor & Perizinan') {
    return currentPathname.startsWith('/ga/vendor') || currentPathname.startsWith('/ga/izin') || currentPathname.startsWith('/ga/perizinan');
  }
  if (item.name === 'Buku Tamu & Surat' || item.name === 'Buku Tamu') {
    return currentPathname.startsWith('/ga/buku-tamu') || currentPathname.startsWith('/ga/guestbook') || currentPathname.startsWith('/ga/surat') || currentPathname.startsWith('/ga/tamu');
  }
  if (item.subItems && item.subItems.length > 0) {
    return item.subItems.some(sub => isSubItemActive(sub.href, currentPathname, currentSearch));
  }
  if (item.href) {
    return isSubItemActive(item.href, currentPathname, currentSearch);
  }
  return false;
};

export const getRouteTitle = (path: string): string => {
  if (path === '/') return 'Dashboard';
  if (path.startsWith('/employees')) return 'Data Karyawan';
  if (path.startsWith('/presensi')) return 'Presensi & Kehadiran';
  if (path.startsWith('/jadwal')) return 'Jadwal & Matriks Shift';
  if (path.startsWith('/cuti')) return 'Manajemen Cuti & Izin';
  if (path.startsWith('/attendance')) return 'Presensi & Kehadiran';
  if (path === '/payroll') return 'Periode Payroll';
  if (path === '/payroll/tunjangan') return 'Tunjangan';
  if (path === '/payroll/bpjs') return 'BPJS';
  if (path === '/payroll/pajak') return 'Pajak PPh 21';
  if (path.startsWith('/payroll/')) return 'Detail Payroll';
  if (path.startsWith('/kpi/katalog-umum') || path.startsWith('/settings/kpi-umum')) return 'Katalog KPI Umum';
  if (path.startsWith('/kpi')) return 'KPI & Manajemen Performa';
  if (path.startsWith('/job-desk')) return 'Job Desk & Standar Kerja';
  if (path.startsWith('/lowongan') || path.startsWith('/ats')) return 'Screening & ATS';
  if (path.startsWith('/assessment')) return 'Assessment & Tes Online';
  if (path.startsWith('/interview')) return 'Interview & Checklist Kandidat';
  if (path.startsWith('/evaluation')) return 'Evaluasi Rekrutmen';
  if (path.startsWith('/kontrak')) return 'Dokumen Legal & Kontrak';
  if (path.startsWith('/kompensasi') || path.startsWith('/regulation')) return 'Kompensasi & Benefit';
  if (path.includes('peraturan-perusahaan')) return 'Peraturan Perusahaan';
  if (path.includes('undang-undang')) return 'Undang-Undang Ketenagakerjaan';
  if (path.includes('standar-iso') || path.includes('/iso')) return 'Referensi Standar ISO';
  if (path.startsWith('/legal') || path.startsWith('/regulasi')) return 'Regulasi';
  if (path.startsWith('/ga/aset') || path.startsWith('/ga/inventaris')) return 'Inventaris & Aset Kantor';
  if (path.startsWith('/ga/atk') || path.startsWith('/ga/supplies') || path.startsWith('/ga/pr')) return 'Pengadaan & Stok ATK / Pantry';
  if (path.startsWith('/ga/fasilitas') || path.startsWith('/ga/maintenance')) return 'Fasilitas & Pemeliharaan Gedung';
  if (path.startsWith('/ga/vendor') || path.startsWith('/ga/perizinan')) return 'Vendor & Perizinan Operasional';
  if (path.startsWith('/ga/buku-tamu') || path.startsWith('/ga/guestbook') || path.startsWith('/ga/surat')) return 'Buku Tamu & Agenda Surat';
  if (path.startsWith('/ga')) return 'General Affairs (GA)';
  if (path.startsWith('/reports')) return 'Laporan HR';
  if (path.startsWith('/ebook') || path.startsWith('/guide')) return 'EBook HRMatrix Digital';
  if (path.startsWith('/database')) return 'Database Manager';
  if (path.startsWith('/settings')) return 'Pengaturan Sistem';
  if (path.startsWith('/navigasi')) return 'Navigasi Cepat';
  if (path.startsWith('/faq') || path.startsWith('/bantuan')) return 'Pertanyaan Umum (FAQ)';
  if (path.startsWith('/tentang') || path.startsWith('/about')) return 'Tentang HRMatrix';
  if (path.startsWith('/prompt')) return 'Direktori Prompt Visual & Halaman';
  return 'HRMatrix';
};
