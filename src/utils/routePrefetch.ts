import type { ComponentType } from 'react';

type ModuleFactory = () => Promise<{ default: ComponentType<any> }>;

export const routeLoaders = {
  dashboard: () => import('../pages/dashboard').then(m => ({ default: m.Dashboard })),
  daftar: () => import('../pages/daftar/form-daftar').then(m => ({ default: m.FormDaftar })),
  myPresensi: () => import('../pages/employees/my-presensi').then(m => ({ default: m.MyPresensiPage })),
  employees: () => import('../pages/employees').then(m => ({ default: m.Employees })),
  database: () => import('../pages/database/DatabaseManager').then(m => ({ default: m.DatabaseManager })),
  payroll: () => import('../pages/payroll').then(m => ({ default: m.PayrollList })),
  payrollDetail: () => import('../pages/payroll/payroll-detail').then(m => ({ default: m.PayrollDetail })),
  payrollEmployees: () => import('../pages/payroll/payroll-employee-list').then(m => ({ default: m.PayrollEmployeeList })),
  kompensasiTunjangan: () => import('../pages/kompensasi').then(m => ({ default: m.PayrollTunjanganPage })),
  kompensasiBpjs: () => import('../pages/kompensasi').then(m => ({ default: m.PayrollBPJSPage })),
  kompensasiPajak: () => import('../pages/kompensasi').then(m => ({ default: m.PayrollPajakPage })),
  kompensasiForm: () => import('../pages/kompensasi/page-form-kompensasi').then(m => ({ default: m.PageFormKompensasi })),
  presensi: () => import('../pages/presensi').then(m => ({ default: m.PresensiPage || m.default })),
  jadwal: () => import('../pages/jadwal').then(m => ({ default: m.JadwalPage || m.default })),
  cuti: () => import('../pages/cuti').then(m => ({ default: m.CutiPage || m.default })),
  kpi: () => import('../pages/kpi/kpi-list').then(m => ({ default: m.KPIList })),
  kpiCatalog: () => import('../pages/kpi/kpi-general-catalog-page').then(m => ({ default: m.KPIGeneralCatalogPage })),
  jobDesk: () => import('../pages/job-desk/JobDesk'),
  lowongan: () => import('../pages/lowongan').then(m => ({ default: m.BuatLowonganATSPage })),
  lowonganDetail: () => import('../pages/lowongan/detail').then(m => ({ default: m.VacancyDetailPage })),
  assessment: () => import('../pages/assessment').then(m => ({ default: m.AssessmentPage })),
  evaluation: () => import('../pages/evaluation').then(m => ({ default: m.EvaluationPage })),
  candidateDetail: () => import('../pages/evaluation/candidate-detail-page').then(m => ({ default: m.CandidateDetailPage })),
  kontrak: () => import('../pages/kontrak').then(m => ({ default: m.DokumenKontrakPage })),
  surat: () => import('../pages/surat').then(m => ({ default: m.SuratResmiPage })),
  regulasi: () => import('../pages/regulasi').then(m => ({ default: m.RegulasiHukumPage })),
  regulasiPerusahaan: () => import('../pages/regulasi').then(m => ({ default: m.PeraturanPerusahaanPage || m.RegulasiHukumPage })),
  regulasiUndangUndang: () => import('../pages/regulasi').then(m => ({ default: m.UndangUndangPage || m.RegulasiHukumPage })),
  regulasiIso: () => import('../pages/regulasi').then(m => ({ default: m.StandarIsoPage || m.RegulasiHukumPage })),
  gaDashboard: () => import('../pages/ga').then(m => ({ default: m.GeneralAffairsDashboard })),
  gaAset: () => import('../pages/ga/AssetManagementPage').then(m => ({ default: m.AssetManagementPage })),
  gaSupplies: () => import('../pages/ga/OfficeSuppliesPage').then(m => ({ default: m.OfficeSuppliesPage })),
  gaFacility: () => import('../pages/ga/FacilityMaintenancePage').then(m => ({ default: m.FacilityMaintenancePage })),
  gaVendor: () => import('../pages/ga/VendorPermitsPage').then(m => ({ default: m.VendorPermitsPage })),
  gaGuestbook: () => import('../pages/ga/GuestbookMailPage').then(m => ({ default: m.GuestbookMailPage })),
  reports: () => import('../pages/reports/Reports').then(m => ({ default: m.Reports })),
  settings: () => import('../pages/settings/Settings').then(m => ({ default: m.SettingsPage })),
  ebook: () => import('../pages/ebook').then(m => ({ default: m.EbookPage })),
  tentang: () => import('../pages/tentang').then(m => ({ default: m.TentangPage })),
  faq: () => import('../pages/faq').then(m => ({ default: m.FaqPage })),
  navigasiCepat: () => import('../pages/navigasi-cepat').then(m => ({ default: m.NavigasiCepatPage })),
  prompt: () => import('../pages/prompt').then(m => ({ default: m.PromptPage || m.default })),
  promo: () => import('../pages/promo/PromoPricingPage').then(m => ({ default: m.PromoPricingPage })),
  notFound: () => import('../pages/error/NotFoundPage').then(m => ({ default: m.NotFoundPage })),
} as const satisfies Record<string, ModuleFactory>;

export type RouteLoaderKey = keyof typeof routeLoaders;

const prefetchedKeys = new Set<RouteLoaderKey>();

export function resolveRouteKey(href: string): RouteLoaderKey | null {
  const path = href.split('?')[0].toLowerCase().replace(/\/$/, '') || '/';

  if (path === '/') return 'dashboard';
  if (path === '/daftar' || path === '/setup') return 'daftar';
  if (path === '/my-presensi') return 'myPresensi';
  if (path.startsWith('/employees')) return 'employees';
  if (path.startsWith('/presensi') || path.startsWith('/attendance')) return 'presensi';
  if (path.startsWith('/jadwal')) return 'jadwal';
  if (path.startsWith('/cuti')) return 'cuti';

  if (path === '/payroll/tunjangan') return 'kompensasiTunjangan';
  if (path === '/payroll/bpjs') return 'kompensasiBpjs';
  if (path === '/payroll/pajak') return 'kompensasiPajak';
  if (path === '/payroll') return 'payroll';
  if (path.startsWith('/payroll/') && path.endsWith('/employees')) return 'payrollEmployees';
  if (path.startsWith('/payroll/')) return 'payrollDetail';
  if (path.startsWith('/kompensasi') || path.startsWith('/regulation')) return 'kompensasiForm';

  if (path.startsWith('/kpi/katalog-umum') || path.startsWith('/settings/kpi-umum')) return 'kpiCatalog';
  if (path.startsWith('/kpi')) return 'kpi';
  if (path.startsWith('/job-desk')) return 'jobDesk';

  if (path.startsWith('/lowongan/') || path.startsWith('/screening/')) return 'lowonganDetail';
  if (path.startsWith('/lowongan') || path.startsWith('/screening') || path.startsWith('/ats')) return 'lowongan';
  if (path.startsWith('/assessment')) return 'assessment';
  if (path.startsWith('/candidate/') || path.startsWith('/kandidat/') || path.startsWith('/evaluation/') || path.startsWith('/evaluasi/')) {
    return 'candidateDetail';
  }
  if (path.startsWith('/candidate') || path.startsWith('/kandidat') || path.startsWith('/evaluation') || path.startsWith('/evaluasi')) {
    return 'evaluation';
  }

  if (path.startsWith('/kontrak') || path.startsWith('/legal/kontrak')) return 'kontrak';
  if (path.startsWith('/surat') || path.startsWith('/legal/surat') || path.startsWith('/sk')) return 'surat';
  if (path.includes('peraturan-perusahaan')) return 'regulasiPerusahaan';
  if (path.includes('undang-undang')) return 'regulasiUndangUndang';
  if (path.includes('standar-iso') || path.includes('/iso')) return 'regulasiIso';
  if (path.startsWith('/legal') || path.startsWith('/regulasi') || path.startsWith('/hukum')) return 'regulasi';

  if (path === '/ga' || path === '/ga/dashboard') return 'gaDashboard';
  if (path.startsWith('/ga/aset') || path.startsWith('/ga/asset') || path.startsWith('/ga/inventaris')) return 'gaAset';
  if (path.startsWith('/ga/atk') || path.startsWith('/ga/supplies') || path.startsWith('/ga/pengadaan') || path.startsWith('/ga/pr')) return 'gaSupplies';
  if (path.startsWith('/ga/fasilitas') || path.startsWith('/ga/maintenance') || path.startsWith('/ga/booking')) return 'gaFacility';
  if (path.startsWith('/ga/vendor') || path.startsWith('/ga/izin') || path.startsWith('/ga/perizinan')) return 'gaVendor';
  if (path.startsWith('/ga/buku-tamu') || path.startsWith('/ga/guestbook') || path.startsWith('/ga/surat') || path.startsWith('/ga/tamu')) return 'gaGuestbook';

  if (path.startsWith('/reports')) return 'reports';
  if (path.startsWith('/database')) return 'database';
  if (path.startsWith('/settings')) return 'settings';
  if (path.startsWith('/ebook')) return 'ebook';
  if (path.startsWith('/navigasi')) return 'navigasiCepat';
  if (path.startsWith('/faq') || path.startsWith('/bantuan')) return 'faq';
  if (path.startsWith('/tentang') || path.startsWith('/about')) return 'tentang';
  if (path.startsWith('/prompt') || path.startsWith('/poster')) return 'prompt';
  if (path.startsWith('/promo') || path.startsWith('/pricing')) return 'promo';

  return null;
}

function shouldSkipPrefetch(): boolean {
  if (typeof navigator === 'undefined') return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

export function prefetchRoute(href: string): void {
  if (!href || href.startsWith('http://') || href.startsWith('https://') || shouldSkipPrefetch()) return;
  const key = resolveRouteKey(href);
  if (!key || prefetchedKeys.has(key)) return;
  prefetchedKeys.add(key);
  routeLoaders[key]().catch(() => {
    prefetchedKeys.delete(key);
  });
}

export function scheduleIdlePrefetch(hrefs: string[]): () => void {
  if (typeof window === 'undefined' || shouldSkipPrefetch()) return () => {};

  const win = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  let cancelled = false;
  let timerId: number | undefined;

  const run = () => {
    if (cancelled) return;
    hrefs.forEach((href, index) => {
      window.setTimeout(() => {
        if (!cancelled) {
          prefetchRoute(href);
        }
      }, index * 80);
    });
  };

  if (typeof win.requestIdleCallback === 'function') {
    const idleId = win.requestIdleCallback(run, { timeout: 2500 });
    return () => {
      cancelled = true;
      win.cancelIdleCallback?.(idleId);
    };
  }

  timerId = window.setTimeout(run, 1000);
  return () => {
    cancelled = true;
    if (timerId !== undefined) window.clearTimeout(timerId);
  };
}
