import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../../components/ui';
import { DashboardChartTooltip, EmptyChartState } from './tooltip-grafik';
import { formatCompactRupiah, formatFullRupiah } from './utils-data-dashboard';
import type { AttendanceTrendPoint, PayrollTrendPoint } from './types';

interface AttendanceLineTrendCardProps {
  trend14: AttendanceTrendPoint[];
  trend30: AttendanceTrendPoint[];
  attendance30dRate: number;
  todayAttendanceCount: number;
  activeEmployees: number;
}

export function AttendanceLineTrendCard({
  trend14,
  trend30,
  attendance30dRate,
  todayAttendanceCount,
  activeEmployees,
}: AttendanceLineTrendCardProps) {
  const [range, setRange] = useState<'14d' | '30d'>('14d');
  const data = range === '14d' ? trend14 : trend30;

  return (
    <Card className="p-4 sm:p-5 h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Tren Kehadiran Harian
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Rata-rata 30 hari: <span className="font-semibold text-slate-800">{attendance30dRate}%</span>
              <span className="mx-1.5 text-slate-300">·</span>
              Hari ini: <span className="font-semibold text-slate-800">{todayAttendanceCount}/{activeEmployees}</span>
            </p>
          </div>

          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg self-start shrink-0">
            <button
              type="button"
              onClick={() => setRange('14d')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                range === '14d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14 Hari
            </button>
            <button
              type="button"
              onClick={() => setRange('30d')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                range === '30d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Hari
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" aria-hidden="true" />
            Hadir & WFH
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
            Terlambat
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" aria-hidden="true" />
            Izin / Cuti / Sakit
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" aria-hidden="true" />
            Alpa
          </span>
        </div>
      </div>

      <div className="mt-4 w-full h-[240px]">
        {data.length === 0 ? (
          <EmptyChartState
            title="Belum Ada Log Presensi"
            description="Catat atau impor data kehadiran karyawan untuk melihat grafik tren harian."
            actionLabel="Buka Presensi"
            actionTo="/presensi"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dashHadirFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="dashLateFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                minTickGap={16}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={
                  <DashboardChartTooltip
                    valueFormatter={(val) => `${val} orang`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="hadir"
                name="Hadir & WFH"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#dashHadirFill)"
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="terlambat"
                name="Terlambat"
                stroke="#D97706"
                strokeWidth={2}
                fill="url(#dashLateFill)"
              />
              <Area
                type="monotone"
                dataKey="izinCuti"
                name="Izin / Cuti"
                stroke="#4F46E5"
                strokeWidth={1.75}
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="alpa"
                name="Alpa"
                stroke="#E11D48"
                strokeWidth={1.75}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

interface PayrollLineTrendCardProps {
  payrollTrend: PayrollTrendPoint[];
  latestPayrollTotalNet: number;
  latestPayrollTotalGross: number;
  latestPayrollLabel: string;
}

export function PayrollLineTrendCard({
  payrollTrend,
  latestPayrollTotalNet,
  latestPayrollTotalGross,
  latestPayrollLabel,
}: PayrollLineTrendCardProps) {
  const prevPeriod = payrollTrend.length >= 2 ? payrollTrend[payrollTrend.length - 2] : null;
  const netDeltaPct =
    prevPeriod && prevPeriod.netRaw > 0
      ? (((latestPayrollTotalNet - prevPeriod.netRaw) / prevPeriod.netRaw) * 100).toFixed(1)
      : null;

  return (
    <Card className="p-4 sm:p-5 h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Tren Penggajian Bulanan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Periode terakhir ({latestPayrollLabel}):{' '}
              <span className="font-semibold text-slate-800">
                {formatCompactRupiah(latestPayrollTotalNet)}
              </span>{' '}
              THP
              {netDeltaPct !== null && (
                <>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span
                    className={
                      Number(netDeltaPct) >= 0 ? 'font-medium text-emerald-600' : 'font-medium text-rose-600'
                    }
                  >
                    {Number(netDeltaPct) >= 0 ? `+${netDeltaPct}%` : `${netDeltaPct}%`} vs periode lalu
                  </span>
                </>
              )}
            </p>
          </div>

          {latestPayrollTotalGross > 0 && (
            <div className="text-left sm:text-right shrink-0">
              <div className="text-[11px] text-slate-400">Bruto Terakhir</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                {formatCompactRupiah(latestPayrollTotalGross)}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" aria-hidden="true" />
            Gaji Bruto (Jt)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" aria-hidden="true" />
            Take Home Pay (Jt)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" aria-hidden="true" />
            Potongan BPJS & Pajak (Jt)
          </span>
        </div>
      </div>

      <div className="mt-4 w-full h-[240px]">
        {payrollTrend.length === 0 ? (
          <EmptyChartState
            title="Belum Ada Riwayat Penggajian"
            description="Jalankan proses hitung payroll bulanan untuk memantau tren bruto, neto, dan potongan."
            actionLabel="Hitung Payroll"
            actionTo="/payroll"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={payrollTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v} Jt`}
              />
              <Tooltip
                content={
                  <DashboardChartTooltip
                    valueFormatter={(val, item) => {
                      const rawPayload = item.payload as PayrollTrendPoint | undefined;
                      if (item.dataKey === 'grossMillions' && rawPayload) {
                        return formatFullRupiah(rawPayload.grossRaw);
                      }
                      if (item.dataKey === 'netMillions' && rawPayload) {
                        return formatFullRupiah(rawPayload.netRaw);
                      }
                      if (item.dataKey === 'deductionMillions' && rawPayload) {
                        return formatFullRupiah(rawPayload.deductionRaw);
                      }
                      return `Rp ${val} Jt`;
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="grossMillions"
                name="Gaji Bruto"
                stroke="#2563EB"
                strokeWidth={2.25}
                dot={{ r: 3.5, fill: '#2563EB', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="netMillions"
                name="Take Home Pay"
                stroke="#0D9488"
                strokeWidth={2.25}
                dot={{ r: 3.5, fill: '#0D9488', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="deductionMillions"
                name="Potongan"
                stroke="#E11D48"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#E11D48', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
