import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Link } from 'react-router-dom';
import {
  Building2,
  CalendarClock,
  Briefcase,
  FileSignature,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { Card } from '../../components/ui';
import { DashboardChartTooltip, EmptyChartState } from './chart-tooltip';
import { formatCompactRupiah } from './dashboard-data-helper';
import type { DashboardMetricsSummary, DepartmentBarPoint, DashboardScope } from './types';

interface DepartmentAnalysisBarCardProps {
  departmentBars: DepartmentBarPoint[];
}

export function DepartmentAnalysisBarCard({ departmentBars }: DepartmentAnalysisBarCardProps) {
  const [metric, setMetric] = useState<'headcount_kpi' | 'salary'>('headcount_kpi');

  return (
    <Card className="p-4 sm:p-5 h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Perbandingan Antar Departemen
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {metric === 'headcount_kpi'
                ? 'Kapasitas tim, tingkat kehadiran (%), dan skor KPI per divisi'
                : 'Rata-rata gaji pokok per karyawan di setiap divisi (Juta Rp)'}
            </p>
          </div>

          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg self-start shrink-0">
            <button
              type="button"
              onClick={() => setMetric('headcount_kpi')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                metric === 'headcount_kpi'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              KPI & Hadir
            </button>
            <button
              type="button"
              onClick={() => setMetric('salary')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                metric === 'salary'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rata-rata Gaji
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-600">
          {metric === 'headcount_kpi' ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" aria-hidden="true" />
                Skor KPI (%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-teal-600" aria-hidden="true" />
                Tingkat Hadir (%)
              </span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" aria-hidden="true" />
              Rata-rata Gaji Pokok (Juta Rp)
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 w-full h-[240px]">
        {departmentBars.length === 0 ? (
          <EmptyChartState
            title="Belum Ada Data Departemen"
            description="Tambahkan karyawan beserta departemennya untuk melihat perbandingan kinerja divisi."
            actionLabel="Kelola Karyawan"
            actionTo="/employees"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={departmentBars} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                tickFormatter={(v: string) => (v.length > 10 ? `${v.slice(0, 10)}…` : v)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                domain={metric === 'headcount_kpi' ? [0, 100] : [0, 'auto']}
              />
              <Tooltip
                content={
                  <DashboardChartTooltip
                    valueFormatter={(val, item) => {
                      if (item.dataKey === 'avgSalaryMillions') return `Rp ${val} Jt`;
                      return `${val}%`;
                    }}
                  />
                }
              />
              {metric === 'headcount_kpi' ? (
                <>
                  <Bar
                    dataKey="avgKpi"
                    name="Rata-rata KPI"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={26}
                  />
                  <Bar
                    dataKey="hadirRate"
                    name="Tingkat Hadir"
                    fill="#0D9488"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={26}
                  />
                </>
              ) : (
                <Bar
                  dataKey="avgSalaryMillions"
                  name="Rata-rata Gaji (Jt)"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

interface OperationsCommandSectionProps {
  metrics: DashboardMetricsSummary;
  scope: DashboardScope;
  enableGeneralAffairs: boolean;
  enableRecruitment: boolean;
}

export function OperationsCommandSection({
  metrics,
  scope,
  enableGeneralAffairs,
  enableRecruitment,
}: OperationsCommandSectionProps) {
  const showHr = scope === 'all' || scope === 'hr';
  const showGa = enableGeneralAffairs && (scope === 'all' || scope === 'ga');

  return (
    <div className={`grid grid-cols-1 gap-4 ${showHr && showGa ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
      {showHr && (
        <Card className="p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-blue-600 shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                Operasional HR, Rekrutmen & Legal
              </h3>
            </div>
            <Link
              to="/cuti"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5 shrink-0"
            >
              Kelola <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-1">
            <Link
              to="/cuti"
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CalendarClock className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Persetujuan Cuti & Izin
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Permohonan cuti menunggu keputusan HR/Atasan
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono tabular-nums">
                <span
                  className={`text-sm font-bold ${
                    metrics.pendingLeavesCount > 0 ? 'text-amber-600' : 'text-slate-800'
                  }`}
                >
                  {metrics.pendingLeavesCount}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">pending</span>
              </div>
            </Link>

            <Link
              to="/jadwal"
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CalendarClock className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Shift Tambahan & Tukar Shift
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Jadwal lembur/penggantian shift yang perlu ditinjau
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono tabular-nums">
                <span
                  className={`text-sm font-bold ${
                    metrics.pendingShiftRequestsCount > 0 ? 'text-indigo-600' : 'text-slate-800'
                  }`}
                >
                  {metrics.pendingShiftRequestsCount}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">pengajuan</span>
              </div>
            </Link>

            {enableRecruitment && (
              <Link
                to="/lowongan"
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-slate-800">
                      Rekrutmen & Pipeline Kandidat
                    </div>
                    <div className="text-[11px] text-slate-400 tabular-nums">
                      {metrics.openVacanciesCount} lowongan aktif · {metrics.totalCandidates} pelamar ATS
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono tabular-nums">
                  <span className="text-sm font-bold text-blue-600">{metrics.openVacanciesCount}</span>
                  <span className="text-[11px] text-slate-400 ml-1">posisi</span>
                </div>
              </Link>
            )}

            <Link
              to="/kontrak"
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileSignature className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Arsip Kontrak Kerja & Surat Resmi
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums">
                    {metrics.contractsCount} dokumen PKWT/PKWTT · {metrics.lettersCount} surat dinas HR
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono tabular-nums">
                <span className="text-sm font-bold text-slate-900">
                  {metrics.contractsCount + metrics.lettersCount}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">dokumen</span>
              </div>
            </Link>
          </div>
        </Card>
      )}

      {showGa && (
        <Card className="p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                Monitor Operasional General Affairs
              </h3>
            </div>
            <Link
              to="/ga"
              className="text-xs font-medium text-teal-600 hover:text-teal-800 inline-flex items-center gap-0.5 shrink-0"
            >
              Portal GA <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-1">
            <Link
              to="/ga/aset"
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Aset & Nilai Inventaris Kantor
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums">
                    {metrics.assetsInUseCount} dipakai karyawan · {metrics.assetsDamagedOrServiceCount} servis/rusak
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono tabular-nums">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {formatCompactRupiah(metrics.totalAssetValue)}
                </span>
                <div className="text-[11px] text-slate-400">{metrics.totalAssetsCount} unit</div>
              </div>
            </Link>

            <Link
              to="/ga/atk"
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <AlertTriangle
                  className={`w-4 h-4 shrink-0 ${
                    metrics.lowStockSupplies.length > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Stok ATK & Pengadaan (PR)
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums truncate">
                    {metrics.lowStockSupplies.length > 0
                      ? `Kritis: ${metrics.lowStockSupplies.slice(0, 2).map((s) => s.name).join(', ')}`
                      : `Seluruh ${metrics.suppliesCount} item ATK di atas batas minimum`}
                    {' · '}
                    {metrics.pendingPRCount} PR pending
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono tabular-nums">
                <span
                  className={`text-sm font-bold ${
                    metrics.lowStockSupplies.length > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {metrics.lowStockSupplies.length}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">menipis</span>
              </div>
            </Link>

            <Link
              to="/ga/fasilitas"
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Tiket Perbaikan & Fasilitas Gedung
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums">
                    {metrics.urgentTicketsCount} tiket prioritas tinggi · {metrics.scheduledMaintenanceCount} jadwal servis
                    {' · '}
                    {metrics.todayBookingsCount} booking ruang hari ini
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono tabular-nums">
                <span
                  className={`text-sm font-bold ${
                    metrics.openTicketsCount > 0 ? 'text-amber-600' : 'text-slate-800'
                  }`}
                >
                  {metrics.openTicketsCount}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">terbuka</span>
              </div>
            </Link>

            <Link
              to="/ga/vendor"
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldAlert
                  className={`w-4 h-4 shrink-0 ${
                    metrics.expiringPermitsCount > 0 ? 'text-rose-600' : 'text-teal-600'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Vendor, Perizinan & Buku Tamu
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums">
                    {metrics.activeVendorsCount} vendor aktif · {metrics.activeVisitorsCount} tamu sedang berkunjung ·{' '}
                    {metrics.totalMailsCount} log ekspedisi
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono tabular-nums">
                <span
                  className={`text-sm font-bold ${
                    metrics.expiringPermitsCount > 0 ? 'text-rose-600' : 'text-teal-600'
                  }`}
                >
                  {metrics.expiringPermitsCount}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">izin exp</span>
              </div>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
