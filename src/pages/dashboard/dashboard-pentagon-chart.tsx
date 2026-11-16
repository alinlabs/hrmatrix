import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { Card } from '../../components/ui';
import { DashboardChartTooltip, EmptyChartState } from './chart-tooltip';
import type { PentagonAxisPoint } from './types';

interface PentagonRadarCardProps {
  orgPentagon: PentagonAxisPoint[];
  gaPentagon: PentagonAxisPoint[];
  enableGeneralAffairs: boolean;
  defaultMode?: 'org' | 'ga';
}

export function PentagonRadarCard({
  orgPentagon,
  gaPentagon,
  enableGeneralAffairs,
  defaultMode = 'org',
}: PentagonRadarCardProps) {
  const [mode, setMode] = useState<'org' | 'ga'>(defaultMode);
  const effectiveMode = !enableGeneralAffairs ? 'org' : mode;
  const activeData = effectiveMode === 'org' ? orgPentagon : gaPentagon;

  const hasAnyScore = activeData.some((d) => d.score > 0);
  const overallScore = activeData.length > 0
    ? Math.round(activeData.reduce((s, d) => s + d.score, 0) / activeData.length)
    : 0;

  return (
    <Card className="p-4 sm:p-5 h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Pentagon Kesehatan {effectiveMode === 'org' ? 'Organisasi' : 'Operasional GA'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Indeks komposit 5 pilar:{' '}
              <span className="font-semibold text-slate-900">{overallScore}/100</span>
            </p>
          </div>

          {enableGeneralAffairs && (
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg self-start shrink-0">
              <button
                type="button"
                onClick={() => setMode('org')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  effectiveMode === 'org'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5 Pilar HR & GA
              </button>
              <button
                type="button"
                onClick={() => setMode('ga')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  effectiveMode === 'ga'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5 Pilar GA
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: effectiveMode === 'org' ? '#2563EB' : '#0D9488' }}
              aria-hidden="true"
            />
            Skor Aktual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" aria-hidden="true" />
            Target Ideal
          </span>
        </div>
      </div>

      <div className="mt-4 w-full h-[240px]">
        {!hasAnyScore ? (
          <EmptyChartState
            title="Skor Pilar Belum Terukur"
            description={
              effectiveMode === 'org'
                ? 'Tambahkan karyawan, presensi, atau penilaian KPI untuk membentuk grafik pentagon.'
                : 'Tambahkan aset kantor, stok ATK, vendor, atau izin GA untuk membentuk grafik pentagon GA.'
            }
            actionLabel={effectiveMode === 'org' ? 'Kelola Karyawan' : 'Buka General Affairs'}
            actionTo={effectiveMode === 'org' ? '/employees' : '/ga'}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <RadarChart cx="50%" cy="52%" outerRadius="70%" data={activeData}>
              <PolarGrid gridType="polygon" stroke="#E2E8F0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10.5, fill: '#475569', fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickCount={5}
                axisLine={false}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="#94A3B8"
                fillOpacity={0.08}
              />
              <Radar
                name="Aktual"
                dataKey="score"
                stroke={effectiveMode === 'org' ? '#2563EB' : '#0D9488'}
                strokeWidth={2.25}
                fill={effectiveMode === 'org' ? '#2563EB' : '#0D9488'}
                fillOpacity={0.26}
              />
              <Tooltip
                content={
                  <DashboardChartTooltip
                    valueFormatter={(val) => `${val}/100`}
                  />
                }
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
