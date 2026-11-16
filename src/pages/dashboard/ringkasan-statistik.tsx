import React from 'react';
import {
  Users,
  Clock,
  Wallet,
  Award,
  Building2,
  Package,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { formatCompactRupiah } from './utils-data-dashboard';
import type { DashboardMetricsSummary, DashboardScope } from './types';

interface StatsSummaryProps {
  metrics: DashboardMetricsSummary;
  scope: DashboardScope;
  enableGeneralAffairs: boolean;
}

export function StatsSummary({
  metrics,
  scope,
  enableGeneralAffairs,
}: StatsSummaryProps) {
  const showHr = scope === 'all' || scope === 'hr';
  const showGa = enableGeneralAffairs && (scope === 'all' || scope === 'ga');

  return (
    <div className="space-y-3">
      {showHr && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Total Karyawan</span>
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
              {metrics.employeesCount}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {metrics.activeEmployees} aktif · {metrics.permanentEmployees} tetap · {metrics.contractEmployees} PKWT
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Presensi &amp; Kehadiran</span>
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
              {metrics.attendance30dRate > 0 ? `${metrics.attendance30dRate}%` : '-'}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              Hari ini: {metrics.todayAttendanceCount}/{metrics.activeEmployees} ({metrics.todayPresentRate}%)
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Payroll ({metrics.latestPayrollLabel})</span>
              <Wallet className="w-4 h-4 text-teal-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums truncate">
              {metrics.latestPayrollTotalNet > 0
                ? formatCompactRupiah(metrics.latestPayrollTotalNet)
                : '-'}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {metrics.payrollCount} slip tersimpan · Bruto {formatCompactRupiah(metrics.latestPayrollTotalGross)}
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Rata-rata KPI Tim</span>
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
              {metrics.kpiEvaluatedCount > 0 ? `${metrics.avgKpiScore}/100` : '-'}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {metrics.kpiEvaluatedCount} evaluasi · {metrics.pendingLeavesCount} cuti pending
            </div>
          </div>
        </div>
      )}

      {showGa && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Total Nilai Aset GA</span>
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums truncate">
              {metrics.totalAssetsCount > 0
                ? formatCompactRupiah(metrics.totalAssetValue)
                : '-'}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {metrics.totalAssetsCount} unit · {metrics.assetsInUseCount} dipakai karyawan
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Stok ATK &amp; Pengadaan</span>
              <Package className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
              {metrics.suppliesCount}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {metrics.lowStockSupplies.length} stok menipis · {metrics.pendingPRCount} PR pending
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Tiket &amp; Fasilitas</span>
              <Wrench className="w-4 h-4 text-rose-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
              {metrics.openTicketsCount}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {metrics.urgentTicketsCount} mendesak · {metrics.scheduledMaintenanceCount} jadwal servis
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">Vendor &amp; Legalitas GA</span>
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            </div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
              {metrics.activeVendorsCount}
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {metrics.permitsCount} izin ({metrics.expiringPermitsCount} exp) · {metrics.activeVisitorsCount} tamu
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
