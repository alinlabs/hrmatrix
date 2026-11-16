export const routeLoaders = {
  dashboard: () => import('../pages/dashboard').then((m) => ({ default: m.Dashboard })),
  daftar: () => import('../pages/daftar/form-daftar'),
  employees: () => import('../pages/employees/container').then((m) => ({ default: m.EmployeesContainer })),
  payroll: () => import('../pages/payroll'),
  payrollDetail: () => import('../pages/payroll/payroll-detail').then((m) => ({ default: m.PayrollDetail })),
  payrollEmployees: () => import('../pages/payroll/payroll-employee-list').then((m) => ({ default: m.PayrollEmployeeList })),
  kompensasiTunjangan: () => import('../pages/kompensasi').then((m) => ({ default: m.PayrollTunjanganPage })),
  kompensasiBpjs: () => import('../pages/kompensasi').then((m) => ({ default: m.PayrollBPJSPage })),
  kompensasiPajak: () => import('../pages/kompensasi').then((m) => ({ default: m.PayrollPajakPage })),
  kompensasiForm: () => import('../pages/kompensasi/page-form-kompensasi').then((m) => ({ default: m.PageFormKompensasi })),
  presensi: () => import('../pages/presensi'),
  jadwal: () => import('../pages/jadwal').then((m) => ({ default: m.JadwalContainer })),
  cuti: () => import('../pages/cuti').then((m) => ({ default: m.PengajuanCuti })),
  kpi: () => import('../pages/kpi/kpi-list').then((m) => ({ default: m.KPIList })),
  kpiCatalog: () => import('../pages/kpi/kpi-general-catalog-page').then((m) => ({ default: m.KPIGeneralCatalogPage })),
  jobDesk: () => import('../pages/job-desk'),
  lowongan: () => import('../pages/lowongan'),
  lowonganDetail: () => import('../pages/lowongan/detail').then((m) => ({ default: m.VacancyDetailPage })),
  assessment: () => import('../pages/assessment').then((m) => ({ default: m.AssessmentPage })),
  evaluation: () => import('../pages/evaluation'),
  candidateDetail: () => import('../pages/evaluation/candidate-detail-page'),
  kontrak: () => import('../pages/kontrak').then((m) => ({ default: m.DokumenKontrakPage })),
  surat: () => import('../pages/surat').then((m) => ({ default: m.SuratResmiPage })),
  regulasi: () => import('../pages/regulasi').then((m) => ({ default: m.RegulasiHukumPage })),
  regulasiPerusahaan: () => import('../pages/regulasi').then((m) => ({ default: m.PeraturanPerusahaanPage })),
  regulasiUndangUndang: () => import('../pages/regulasi').then((m) => ({ default: m.UndangUndangPage })),
  regulasiIso: () => import('../pages/regulasi').then((m) => ({ default: m.StandarIsoPage })),
  gaDashboard: () => import('../pages/ga').then((m) => ({ default: m.GeneralAffairsDashboard })),
  gaAset: () => import('../pages/ga/asset-management-page').then((m) => ({ default: m.AssetManagementPage })),
  gaSupplies: () => import('../pages/ga/office-supplies-page').then((m) => ({ default: m.OfficeSuppliesPage })),
  gaFacility: () => import('../pages/ga/facility-maintenance-page').then((m) => ({ default: m.FacilityMaintenancePage })),
  gaVendor: () => import('../pages/ga/vendor-permits-page').then((m) => ({ default: m.VendorPermitsPage })),
  gaGuestbook: () => import('../pages/ga/guestbook-mail-page').then((m) => ({ default: m.GuestbookMailPage })),
  reports: () => import('../pages/reports/reports'),
  settings: () => import('../pages/settings/settings').then((m) => ({ default: m.SettingsPage })),
  ebook: () => import('../pages/ebook/ebook-page').then((m) => ({ default: m.EbookPage })),
  tentang: () => import('../pages/tentang').then((m) => ({ default: m.TentangPage })),
  faq: () => import('../pages/faq').then((m) => ({ default: m.FaqPage })),
  navigasiCepat: () => import('../pages/navigasi-cepat').then((m) => ({ default: m.NavigasiCepatPage })),
  myPresensi: () => import('../pages/employees/my-presensi'),
  prompt: () => import('../pages/prompt'),
  promo: () => import('../pages/promo'),
  notFound: () => import('../pages/error/not-found-page').then((m) => ({ default: m.NotFoundPage })),
};

const PATH_TO_LOADER: Array<[string, () => Promise<unknown>]> = [
  ['/employees', routeLoaders.employees],
  ['/presensi', routeLoaders.presensi],
  ['/jadwal', routeLoaders.jadwal],
  ['/cuti', routeLoaders.cuti],
  ['/payroll/tunjangan', routeLoaders.kompensasiTunjangan],
  ['/payroll/bpjs', routeLoaders.kompensasiBpjs],
  ['/payroll/pajak', routeLoaders.kompensasiPajak],
  ['/payroll', routeLoaders.payroll],
  ['/kompensasi', routeLoaders.kompensasiTunjangan],
  ['/kpi/katalog-umum', routeLoaders.kpiCatalog],
  ['/kpi', routeLoaders.kpi],
  ['/job-desk', routeLoaders.jobDesk],
  ['/lowongan', routeLoaders.lowongan],
  ['/screening', routeLoaders.lowongan],
  ['/assessment', routeLoaders.assessment],
  ['/evaluation', routeLoaders.evaluation],
  ['/candidate', routeLoaders.evaluation],
  ['/kontrak', routeLoaders.kontrak],
  ['/surat', routeLoaders.surat],
  ['/legal/peraturan-perusahaan', routeLoaders.regulasiPerusahaan],
  ['/legal/undang-undang', routeLoaders.regulasiUndangUndang],
  ['/legal/standar-iso', routeLoaders.regulasiIso],
  ['/legal', routeLoaders.regulasi],
  ['/regulasi', routeLoaders.regulasi],
  ['/ga/aset', routeLoaders.gaAset],
  ['/ga/atk', routeLoaders.gaSupplies],
  ['/ga/fasilitas', routeLoaders.gaFacility],
  ['/ga/vendor', routeLoaders.gaVendor],
  ['/ga/buku-tamu', routeLoaders.gaGuestbook],
  ['/ga', routeLoaders.gaDashboard],
  ['/reports', routeLoaders.reports],
  ['/database', routeLoaders.settings],
  ['/settings', routeLoaders.settings],
  ['/pengaturan', routeLoaders.settings],
  ['/ebook', routeLoaders.ebook],
  ['/navigasi-cepat', routeLoaders.navigasiCepat],
  ['/faq', routeLoaders.faq],
  ['/tentang', routeLoaders.tentang],
  ['/daftar', routeLoaders.daftar],
  ['/my-presensi', routeLoaders.myPresensi],
  ['/prompt', routeLoaders.prompt],
  ['/promo', routeLoaders.promo],
  ['/', routeLoaders.dashboard],
];

const prefetchedPaths = new Set<string>();

export function prefetchRoute(href: string): void {
  if (!href || typeof window === 'undefined') return;
  const cleanPath = href.split('?')[0].split('#')[0] || '/';
  if (prefetchedPaths.has(cleanPath)) return;

  for (const [prefix, loader] of PATH_TO_LOADER) {
    if (prefix === '/' ? cleanPath === '/' : cleanPath.startsWith(prefix)) {
      prefetchedPaths.add(cleanPath);
      loader().catch(() => {
        prefetchedPaths.delete(cleanPath);
      });
      return;
    }
  }
}

export function scheduleIdlePrefetch(paths: string[]): () => void {
  if (typeof window === 'undefined' || paths.length === 0) {
    return () => {};
  }

  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) {
    return () => {};
  }

  let cancelled = false;
  let timerId: number | undefined;
  let idleId: number | undefined;

  const runPrefetch = () => {
    if (cancelled) return;
    paths.forEach((p, idx) => {
      window.setTimeout(() => {
        if (!cancelled) {
          prefetchRoute(p);
        }
      }, idx * 120);
    });
  };

  const win = window as Window & typeof globalThis;

  if (typeof win.requestIdleCallback === 'function') {
    idleId = win.requestIdleCallback(runPrefetch, { timeout: 2500 });
  } else {
    timerId = win.setTimeout(runPrefetch, 1200);
  }

  return () => {
    cancelled = true;
    if (idleId !== undefined && typeof win.cancelIdleCallback === 'function') {
      win.cancelIdleCallback(idleId);
    }
    if (timerId !== undefined) {
      win.clearTimeout(timerId);
    }
  };
}
