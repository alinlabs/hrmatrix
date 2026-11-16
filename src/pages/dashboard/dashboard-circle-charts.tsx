import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Card } from '../../components/ui';
import { DashboardChartTooltip, EmptyChartState } from './chart-tooltip';
import { formatCompactRupiah } from './dashboard-data-helper';
import type { CircleSlicePoint, DashboardScope } from './types';

interface DonutCardShellProps {
  title: string;
  subtitle: string;
  slices: CircleSlicePoint[];
  centerPrimary: string;
  centerSecondary: string;
  valueFormatter: (val: number, slice?: CircleSlicePoint) => string;
  emptyTitle: string;
  emptyDesc: string;
  emptyLabel: string;
  emptyTo: string;
  headerTabs?: React.ReactNode;
}

function DonutCardShell({
  title,
  subtitle,
  slices,
  centerPrimary,
  centerSecondary,
  valueFormatter,
  emptyTitle,
  emptyDesc,
  emptyLabel,
  emptyTo,
  headerTabs,
}: DonutCardShellProps) {
  const totalValue = slices.reduce((s, item) => s + item.value, 0);

  return (
    <Card className="p-4 sm:p-5 h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
          </div>
        </div>
        {headerTabs && <div className="mt-2.5">{headerTabs}</div>}
      </div>

      {slices.length === 0 || totalValue === 0 ? (
        <div className="mt-4">
          <EmptyChartState
            title={emptyTitle}
            description={emptyDesc}
            actionLabel={emptyLabel}
            actionTo={emptyTo}
          />
        </div>
      ) : (
        <>
          <div className="relative mt-3 w-full h-[190px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                >
                  {slices.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <DashboardChartTooltip
                      valueFormatter={(val, item) => {
                        const slice = item.payload as CircleSlicePoint | undefined;
                        return valueFormatter(val, slice);
                      }}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums leading-tight">
                {centerPrimary}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                {centerSecondary}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 space-y-1.5">
            {slices.slice(0, 5).map((slice) => {
              const pct = totalValue > 0 ? Math.round((slice.value / totalValue) * 100) : 0;
              return (
                <div key={slice.name} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                      aria-hidden="true"
                    />
                    <span className="text-slate-700 truncate">{slice.name}</span>
                  </div>
                  <div className="shrink-0 font-mono tabular-nums text-slate-900 font-medium">
                    {slice.formattedValue ? slice.formattedValue : slice.value}{' '}
                    <span className="text-slate-400 font-normal">({pct}%)</span>
                  </div>
                </div>
              );
            })}
            {slices.length > 5 && (
              <div className="text-[11px] text-slate-400 pt-0.5 tabular-nums">
                +{slices.length - 5} kategori lainnya
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

interface CircleDistributionSectionProps {
  scope: DashboardScope;
  enableGeneralAffairs: boolean;
  employeesCount: number;
  deptCircles: CircleSlicePoint[];
  contractCircles: CircleSlicePoint[];
  statusCircles: CircleSlicePoint[];
  payrollCompositionCircles: CircleSlicePoint[];
  latestPayrollTotalGross: number;
  latestPayrollLabel: string;
  assetCategoryCircles: CircleSlicePoint[];
  assetConditionCircles: CircleSlicePoint[];
  supplyHealthCircles: CircleSlicePoint[];
  totalAssetsCount: number;
  totalAssetValue: number;
  suppliesCount: number;
}

export function CircleDistributionSection({
  scope,
  enableGeneralAffairs,
  employeesCount,
  deptCircles,
  contractCircles,
  statusCircles,
  payrollCompositionCircles,
  latestPayrollTotalGross,
  latestPayrollLabel,
  assetCategoryCircles,
  assetConditionCircles,
  supplyHealthCircles,
  totalAssetsCount,
  totalAssetValue,
  suppliesCount,
}: CircleDistributionSectionProps) {
  const [hrView, setHrView] = useState<'dept' | 'contract' | 'status'>('dept');
  const [gaView, setGaView] = useState<'category' | 'condition' | 'supply'>('category');

  const activeHrSlices =
    hrView === 'dept' ? deptCircles : hrView === 'contract' ? contractCircles : statusCircles;

  const activeGaSlices =
    gaView === 'category'
      ? assetCategoryCircles
      : gaView === 'condition'
      ? assetConditionCircles
      : supplyHealthCircles;

  const showHrCircles = scope === 'all' || scope === 'hr';
  const showGaCircle = enableGeneralAffairs && (scope === 'all' || scope === 'ga');

  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        showHrCircles && showGaCircle
          ? 'lg:grid-cols-3'
          : showHrCircles
          ? 'lg:grid-cols-2'
          : 'lg:grid-cols-1'
      }`}
    >
      {showHrCircles && (
        <DonutCardShell
          title="Komposisi SDM"
          subtitle="Sebaran tim berdasarkan divisi, kontrak & status"
          slices={activeHrSlices}
          centerPrimary={String(employeesCount)}
          centerSecondary="Karyawan"
          valueFormatter={(val) => `${val} orang`}
          emptyTitle="Data Karyawan Kosong"
          emptyDesc="Tambahkan data karyawan untuk melihat distribusi departemen dan kontrak."
          emptyLabel="Tambah Karyawan"
          emptyTo="/employees"
          headerTabs={
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setHrView('dept')}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  hrView === 'dept' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Departemen
              </button>
              <button
                type="button"
                onClick={() => setHrView('contract')}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  hrView === 'contract' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Kontrak
              </button>
              <button
                type="button"
                onClick={() => setHrView('status')}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  hrView === 'status' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Status
              </button>
            </div>
          }
        />
      )}

      {showHrCircles && (
        <DonutCardShell
          title="Struktur Komponen Payroll"
          subtitle={`Komposisi gaji periode ${latestPayrollLabel}`}
          slices={payrollCompositionCircles}
          centerPrimary={formatCompactRupiah(latestPayrollTotalGross)}
          centerSecondary="Total Bruto"
          valueFormatter={(val, slice) => slice?.formattedValue || formatCompactRupiah(val)}
          emptyTitle="Belum Ada Rincian Payroll"
          emptyDesc="Komponen gaji pokok, tunjangan, lembur, dan potongan akan tampil setelah proses payroll."
          emptyLabel="Buka Payroll"
          emptyTo="/payroll"
        />
      )}

      {showGaCircle && (
        <DonutCardShell
          title="Aset & Inventaris GA"
          subtitle="Nilai buku aset, kondisi fisik & stok ATK"
          slices={activeGaSlices}
          centerPrimary={
            gaView === 'category'
              ? formatCompactRupiah(totalAssetValue)
              : gaView === 'condition'
              ? String(totalAssetsCount)
              : String(suppliesCount)
          }
          centerSecondary={
            gaView === 'category'
              ? 'Nilai Aset'
              : gaView === 'condition'
              ? 'Total Unit'
              : 'Item ATK'
          }
          valueFormatter={(val, slice) => {
            if (gaView === 'category') return slice?.formattedValue || formatCompactRupiah(val);
            return `${val} item`;
          }}
          emptyTitle="Belum Ada Inventaris GA"
          emptyDesc="Daftarkan aset kantor atau stok ATK di modul General Affairs untuk memantau kesehatan inventaris."
          emptyLabel="Kelola General Affairs"
          emptyTo="/ga"
          headerTabs={
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setGaView('category')}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  gaView === 'category' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Nilai Aset
              </button>
              <button
                type="button"
                onClick={() => setGaView('condition')}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  gaView === 'condition' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Kondisi
              </button>
              <button
                type="button"
                onClick={() => setGaView('supply')}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  gaView === 'supply' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Stok ATK
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}
