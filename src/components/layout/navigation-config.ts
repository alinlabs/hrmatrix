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
  Compass,
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
  UserCheck,
  BookOpenCheck
} from 'lucide-react';
import { GARUDA_INDONESIA_URL } from '../e-portal/PortalLogos';
import { AppModulesConfig, isEPortalActive, HR_EPORTAL_IDS, GA_EPORTAL_IDS } from '../../services/moduleConfigService';

export interface NavSubItem {
  name: string;
  href: string;
  logo?: string;
  groupHeader?: string;
}

export interface NavMainItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconImg?: string;
  hasDropdown?: boolean;
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
      { groupHeader: 'Akademik & Profesi', name: 'Ijazah Perguruan Tinggi', href: '/checking-tools/sivil', logo: '/gambar/logo/logo-diktisaintek.webp' },
      { name: 'Ijazah SD - SMA / SMK', href: '/checking-tools/nisn', logo: '/gambar/logo/logo-kemendikbud.webp' },
      { name: 'Sertifikasi BNSP', href: '/checking-tools/bnsp', logo: '/gambar/logo/logo-bnsp.webp' },
      
      { groupHeader: 'Finansial & Kredit', name: 'SLIK OJK (iDebKu)', href: '/checking-tools/slik', logo: '/gambar/logo/logo-ojk.webp' },

      { groupHeader: 'Identitas & Kependudukan', name: 'Cek KTP Dukcapil', href: '/checking-tools/dukcapil', logo: '/gambar/logo/logo-kemendagri.webp' },
      { name: 'Cek NPWP DJP', href: '/checking-tools/ceknpwp', logo: '/gambar/logo/logo-djp.webp' },

      { groupHeader: 'Integritas Hukum', name: 'SKCK Online Polri', href: '/checking-tools/skck', logo: '/gambar/logo/logo-polri.webp' },
      { name: 'SIPP Mahkamah Agung', href: '/checking-tools/sippma', logo: '/gambar/logo/logo-mahkamah-agung.webp' },
      { name: 'STR / SIP Kemenkes', href: '/checking-tools/kki', logo: '/gambar/logo/logo-kemenakes.webp' },
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
      { groupHeader: 'Laporan HR', name: 'Kemenaker (WLKP)', href: '/e-portal/kemenaker', logo: '/gambar/logo/logo-kemnaker.webp' },
      { name: 'BPJSTK (SIPP)', href: '/e-portal/bpjstk', logo: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp' },
      { name: 'EDABU (BPJS Kes)', href: '/e-portal/edabu', logo: '/gambar/logo/logo-bpjs-kesehatan.webp' },
      { name: 'DJP Online Pajak', href: '/e-portal/djp', logo: '/gambar/logo/logo-djp.webp' },
      { name: 'E-PP & PKB', href: '/e-portal/e-pp-pkb', logo: '/gambar/logo/logo-industrial.webp' },
      { name: 'Teman K3 (P2K3)', href: '/e-portal/temank3', logo: '/gambar/logo/logo-k3.webp' },
      { name: 'TKA Online (RPTKA)', href: '/e-portal/tka-online', logo: '/gambar/logo/logo-kitas.webp' },
      { name: 'Karirhub (SIAPkerja)', href: '/e-portal/karirhub', logo: '/gambar/logo/logo-siap-kerja.webp' },
      { name: 'PPHI (Hub Industrial)', href: '/e-portal/pphi', logo: '/gambar/logo/logo-industrial.webp' },

      // Sub-kategori: Laporan GA
      { groupHeader: 'Laporan GA', name: 'OSS RBA (LKPM)', href: '/e-portal/oss', logo: '/gambar/logo/logo-bkpm.webp' },
      { name: 'SIMPEL KLHK', href: '/e-portal/simpel', logo: '/gambar/logo/logo-klh.webp' },
      { name: 'Festronik (Limbah B3)', href: '/e-portal/festronik', logo: '/gambar/logo/logo-dlh.webp' },
      { name: 'SIMBG PUPR (PBG/SLF)', href: '/e-portal/simbg', logo: '/gambar/logo/logo-pupr.webp' },
      { name: 'Pajak Daerah (Bapenda)', href: '/e-portal/bapenda', logo: '/gambar/logo/logo-dirjen-pajak.webp' },
    ]
  },
];

export const getFilteredReportsNavigation = (config?: AppModulesConfig): NavMainItem[] => {
  if (!config) return reportsNavigation;

  const getPortalId = (href: string) => href.replace(/^\/e-portal\//, '').toLowerCase();

  const hrItems: NavSubItem[] = [
    { name: 'Kemenaker (WLKP)', href: '/e-portal/kemenaker', logo: '/gambar/logo/logo-kemnaker.webp' },
    { name: 'BPJSTK (SIPP)', href: '/e-portal/bpjstk', logo: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp' },
    { name: 'EDABU (BPJS Kes)', href: '/e-portal/edabu', logo: '/gambar/logo/logo-bpjs-kesehatan.webp' },
    { name: 'DJP Online Pajak', href: '/e-portal/djp', logo: '/gambar/logo/logo-djp.webp' },
    { name: 'E-PP & PKB', href: '/e-portal/e-pp-pkb', logo: '/gambar/logo/logo-industrial.webp' },
    { name: 'Teman K3 (P2K3)', href: '/e-portal/temank3', logo: '/gambar/logo/logo-k3.webp' },
    { name: 'TKA Online (RPTKA)', href: '/e-portal/tka-online', logo: '/gambar/logo/logo-kitas.webp' },
    { name: 'Karirhub (SIAPkerja)', href: '/e-portal/karirhub', logo: '/gambar/logo/logo-siap-kerja.webp' },
    { name: 'PPHI (Hub Industrial)', href: '/e-portal/pphi', logo: '/gambar/logo/logo-industrial.webp' },
  ].filter(item => isEPortalActive(getPortalId(item.href), config));

  const gaItems: NavSubItem[] = [
    { name: 'OSS RBA (LKPM)', href: '/e-portal/oss', logo: '/gambar/logo/logo-bkpm.webp' },
    { name: 'SIMPEL KLHK', href: '/e-portal/simpel', logo: '/gambar/logo/logo-klh.webp' },
    { name: 'Festronik (Limbah B3)', href: '/e-portal/festronik', logo: '/gambar/logo/logo-dlh.webp' },
    { name: 'SIMBG PUPR (PBG/SLF)', href: '/e-portal/simbg', logo: '/gambar/logo/logo-pupr.webp' },
    { name: 'Pajak Daerah (Bapenda)', href: '/e-portal/bapenda', logo: '/gambar/logo/logo-dirjen-pajak.webp' },
  ].filter(item => isEPortalActive(getPortalId(item.href), config));

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

  return [
    { name: 'Laporan', href: '/reports', icon: FileText },
    { 
      name: 'e-Portal', 
      iconImg: GARUDA_INDONESIA_URL,
      hasDropdown: combinedSubItems.length > 0,
      href: combinedSubItems.length === 0 ? '/e-portal' : undefined,
      subItems: combinedSubItems
    },
  ];
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

  if (href.startsWith('/checking-tools')) {
    const [targetPath] = href.split('?');
    return currentPathname.startsWith(targetPath);
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
  if (item.name === 'Checking Tools') {
    return currentPathname.startsWith('/checking-tools') || currentPathname.startsWith('/screening/checking-tools');
  }
  if (item.name === 'E-Portal' || item.name === 'E-Portal HR' || item.name === 'E-Portal GA') {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems.some(sub => isSubItemActive(sub.href, currentPathname, currentSearch));
    }
    return currentPathname.startsWith('/e-portal');
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
  if (path.startsWith('/checking-tools')) return 'Checking Tools (Verifikasi Resmi)';
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
  if (path === '/e-portal/kemenaker') return 'Portal Kemnaker RI (WLKP)';
  if (path === '/e-portal/bpjstk') return 'Portal BPJS Ketenagakerjaan (SIPP)';
  if (path === '/e-portal/edabu') return 'Portal e-Dabu BPJS Kesehatan';
  if (path === '/e-portal/djp') return 'Portal DJP Online Pajak';
  if (path === '/e-portal/e-pp-pkb') return 'Portal e-PP & PKB Kemnaker';
  if (path === '/e-portal/temank3' || path === '/e-portal/teman-k3') return 'Portal Teman K3 (P2K3 & Insiden)';
  if (path === '/e-portal/tka-online' || path === '/e-portal/tka') return 'Portal TKA Online Kemnaker (RPTKA)';
  if (path === '/e-portal/karirhub' || path === '/e-portal/siapkerja') return 'Portal SIAPkerja / Karirhub';
  if (path === '/e-portal/pphi' || path === '/e-portal/simasnaker') return 'Portal PPHI / SIMASNAKER';
  if (path === '/e-portal/oss' || path === '/e-portal/oss-rba') return 'Portal OSS RBA / LKPM (BKPM)';
  if (path === '/e-portal/simpel' || path === '/e-portal/simpel-klhk') return 'Portal SIMPEL KLHK (Lingkungan)';
  if (path === '/e-portal/festronik' || path === '/e-portal/festronik-klhk') return 'Portal Festronik KLHK (Limbah B3)';
  if (path === '/e-portal/simbg' || path === '/e-portal/simbg-pupr') return 'Portal SIMBG PUPR (PBG & SLF)';
  if (path === '/e-portal/bapenda' || path === '/e-portal/pajak-daerah') return 'Portal Pajak Daerah (Bapenda)';
  if (path.startsWith('/e-portal')) return 'E-Portal Resmi HR & GA';
  if (path.startsWith('/ebook') || path.startsWith('/guide')) return 'EBook HRMatrix Digital';
  if (path.startsWith('/database')) return 'Database Manager';
  if (path.startsWith('/settings')) return 'Pengaturan Sistem';
  if (path.startsWith('/navigasi')) return 'Navigasi Cepat';
  if (path.startsWith('/faq') || path.startsWith('/bantuan')) return 'Pertanyaan Umum (FAQ)';
  if (path.startsWith('/tentang') || path.startsWith('/about')) return 'Tentang HRMatrix';
  if (path.startsWith('/prompt')) return 'Direktori Prompt Visual & Halaman';
  return 'HRMatrix';
};
