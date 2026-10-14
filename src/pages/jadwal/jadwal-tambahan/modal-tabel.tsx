import React, { useState } from 'react';
import { Zap, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { ModalDetail } from './modal-detail';
import { resolveWageCategory } from '../../../services/shiftService';

export function ModalTabel(props: any) {
  const {
    filteredExtraShifts,
    empMap,
    posMap,
    getShiftBadge,
    activeConfig,
    dayMode,
    offdayCalcType,
    offdayCalcBasis,
    offdayMultFirst,
    offdayMultNext,
    offdayStaticRate,
    offdayFlatMult,
    normalCalcType,
    normalCalcBasis,
    normalMultFirst,
    normalMultNext,
    normalStaticRate,
    normalFlatMult,
    deleteExtraShift,
    normalBaseDivider,
    offdayBaseDivider,
    onEdit,
  } = props;

  const [selectedDetailExtra, setSelectedDetailExtra] = useState<any | null>(null);
  const [zoomOffset, setZoomOffset] = useState<number>(0);
  const handleZoomIn = () => setZoomOffset(prev => Math.min(prev + 1, 4));
  const handleZoomOut = () => setZoomOffset(prev => Math.max(prev - 1, -4));
  const handleResetZoom = () => setZoomOffset(0);

  // Helper to format short name (max 2 words, no ellipses)
  const formatShortName = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    return fullName;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Card Info & Zoom Toolbar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/90 px-3 py-2 border-b border-slate-200 font-medium">
          <div className="flex items-center overflow-hidden">
            <span className="truncate">Klik baris data untuk melihat detail jadwal tambahan / lembur</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-0.5">
              <button 
                type="button"
                onClick={handleZoomOut} 
                disabled={zoomOffset <= -4}
                className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer" 
                title="Perkecil Skala Teks"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors cursor-pointer min-w-[34px] text-center"
                title="Klik untuk reset skala 100%"
              >
                {Math.round(((11.5 + zoomOffset * 1) / 11.5) * 100)}%
              </button>
              <button 
                type="button"
                onClick={handleZoomIn} 
                disabled={zoomOffset >= 4}
                className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer" 
                title="Perbesar Skala Teks"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {(() => {
          const tableFontSize = 11.5 + zoomOffset * 1;
          const tablePx = Math.max(4, Math.round(14 + zoomOffset * 2.0));
          const tablePy = Math.max(3, Math.round(10 + zoomOffset * 1.5));

          return (
            <div className="overflow-x-auto">
              <table 
                className="w-full text-left border-collapse"
                style={{ 
                  fontSize: `${tableFontSize}px`,
                  '--tbl-px': `${tablePx}px`,
                  '--tbl-py': `${tablePy}px`
                } as React.CSSProperties}
              >
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="whitespace-nowrap">Tanggal</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="w-[24%]">Karyawan</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Jadwal</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Lembur</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Durasi</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Upah</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Keterangan</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExtraShifts.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="py-10 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Zap className="w-6 h-6 text-slate-300" />
                          <p className="font-medium text-slate-600">Belum ada catatan shift tambahan / lembur.</p>
                          <p className="text-[0.9em] text-slate-400">Klik tombol "+" untuk menjadwalkan lemburan atau ikon pengaturan untuk tarif lembur.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredExtraShifts.map(extra => {
                      const emp = empMap.get(extra.employeeId);

                      // Calculate Date Block parts
                      const dateObj = new Date(extra.workDate);
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                      let dBlock = { day: '-', month: '-', year: '-' };
                      if (!isNaN(dateObj.getTime())) {
                        dBlock = {
                          day: dateObj.getDate().toString(),
                          month: months[dateObj.getMonth()],
                          year: dateObj.getFullYear().toString(),
                        };
                      } else {
                        const parts = (extra.workDate || '').split(/[- /]/);
                        if (parts.length === 3) {
                          if (parts[0].length === 4) {
                            const mIndex = parseInt(parts[1], 10) - 1;
                            dBlock = { day: parts[2], month: months[mIndex] || parts[1], year: parts[0] };
                          } else if (parts[2].length === 4) {
                            const mIndex = parseInt(parts[1], 10) - 1;
                            dBlock = { day: parts[0], month: months[mIndex] || parts[1], year: parts[2] };
                          }
                        } else {
                          dBlock = { day: extra.workDate || '-', month: '', year: '' };
                        }
                      }

                      // Duration Label
                      let rawHours = 0;
                      if (extra.extraType === 'full_shift') {
                        rawHours = extra.durationHours || 8;
                      } else if (extra.extraType === 'half_shift') {
                        rawHours = extra.durationHours || 4;
                      } else {
                        rawHours = extra.durationHours || 0;
                      }
                      const typeLabel = `${Math.round(Number(rawHours) || 0)} Jam`;

                      const shortName = formatShortName(emp?.fullName || extra.employeeId);
                      const posName = emp?.positionId && posMap.get(emp.positionId)?.name ? posMap.get(emp.positionId)?.name : 'Staff';

                      // Automatic wage category based on strict business logic
                      const wageCategoryTitle = extra.wageCategory 
                        ? String(extra.wageCategory).toUpperCase() 
                        : resolveWageCategory(extra, activeConfig, dayMode);

                      return (
                        <tr
                          key={extra.id}
                          onClick={() => setSelectedDetailExtra(extra)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="whitespace-nowrap">
                            <div className="text-left leading-tight">
                              <div className="text-[1.15em] font-extrabold text-slate-900">{dBlock.day}</div>
                              <div className="text-[0.8em] font-bold text-blue-600 uppercase tracking-wider">{dBlock.month}</div>
                              <div className="text-[0.8em] text-slate-400 font-medium">{dBlock.year}</div>
                            </div>
                          </td>
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="w-[24%] font-semibold text-slate-900 max-w-xs">
                            <div className="truncate text-slate-950 font-bold" title={emp?.fullName}>
                              {shortName}
                            </div>
                            <div className="text-[0.85em] text-slate-400 font-normal mt-0.5 line-clamp-2 leading-tight" title={posName}>
                              {posName}
                            </div>
                          </td>
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>
                            {extra.mandatoryShiftId ? (
                              <div className="w-24 text-[0.9em]">
                                {getShiftBadge(extra.mandatoryShiftId, extra.mandatoryShiftName)}
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>
                            <div className="w-24 text-[0.9em]">
                              {getShiftBadge(
                                extra.shiftId === 'HOURLY' ? 'shift-reguler' : extra.shiftId,
                                extra.shiftId === 'HOURLY' ? 'Non-Shift' : extra.shiftName
                              )}
                            </div>
                          </td>
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="font-bold text-slate-700 whitespace-nowrap">
                            {typeLabel}
                          </td>
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="font-bold text-slate-900 uppercase whitespace-nowrap">
                            {wageCategoryTitle}
                          </td>
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="text-slate-600">
                            <div className="line-clamp-2 max-w-[200px] leading-snug text-[0.95em]" title={extra.reason}>
                              {extra.reason || '-'}
                            </div>
                          </td>
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="text-center">
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Hapus penjadwalan shift tambahan ini?')) {
                                  await deleteExtraShift(extra.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Modal Detail View */}
      <ModalDetail
        isOpen={Boolean(selectedDetailExtra)}
        onClose={() => setSelectedDetailExtra(null)}
        onEdit={onEdit}
        selectedExtra={selectedDetailExtra}
        empMap={empMap}
        posMap={posMap}
        getShiftBadge={getShiftBadge}
        deleteExtraShift={deleteExtraShift}
        activeConfig={activeConfig}
        dayMode={dayMode}
        offdayCalcType={offdayCalcType}
        offdayCalcBasis={offdayCalcBasis}
        offdayMultFirst={offdayMultFirst}
        offdayMultNext={offdayMultNext}
        offdayStaticRate={offdayStaticRate}
        offdayFlatMult={offdayFlatMult}
        normalCalcType={normalCalcType}
        normalCalcBasis={normalCalcBasis}
        normalMultFirst={normalMultFirst}
        normalMultNext={normalMultNext}
        normalStaticRate={normalStaticRate}
        normalFlatMult={normalFlatMult}
        normalBaseDivider={normalBaseDivider}
        offdayBaseDivider={offdayBaseDivider}
      />
    </>
  );
}
