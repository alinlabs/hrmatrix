import React from 'react';
import { Card, CardContent } from '../../components/ui';
import {
  FoldHorizontal,
  UnfoldHorizontal,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from 'lucide-react';
import { LeaveTypePolicy } from '../../types';
import { EmployeeSummaryData } from './modal-rekap-detail-karyawan';
import { formatEmployeeName, formatDepartmentName, formatPositionName } from './utils-helper';

export interface ExpandedColsState {
  hadir: boolean;
  terlambat: boolean;
  cuti: boolean;
  ketidakhadiran: boolean;
}

interface RekapitulasiTableProps {
  employeeSummaries: EmployeeSummaryData[];
  expandedCols: ExpandedColsState;
  toggleCol: (col: keyof ExpandedColsState) => void;
  handleCollapseAll: () => void;
  handleExpandAll: () => void;
  zoomOffset: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  leavePolicies: LeaveTypePolicy[];
  absenceReasonsList: string[];
  onSelectEmployee: (summary: EmployeeSummaryData) => void;
}

export function RekapitulasiTable({
  employeeSummaries,
  expandedCols,
  toggleCol,
  handleCollapseAll,
  handleExpandAll,
  zoomOffset,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  leavePolicies,
  absenceReasonsList,
  onSelectEmployee,
}: RekapitulasiTableProps) {
  const hasAnyExpanded =
    expandedCols.hadir || expandedCols.terlambat || expandedCols.cuti || expandedCols.ketidakhadiran;

  const tableFontSize = 11.5 + zoomOffset * 1;
  const tablePx = Math.max(3, Math.round(11 + zoomOffset * 1.8));
  const tablePy = Math.max(2, Math.round(9 + zoomOffset * 1.3));
  const tableSubPx = Math.max(2, Math.round(7 + zoomOffset * 1.1));
  const tableSubPy = Math.max(2, Math.round(5 + zoomOffset * 0.8));
  const colEmpWidth = Math.max(85, Math.round(135 + zoomOffset * 14));
  const colDeptWidth = Math.max(85, Math.round(135 + zoomOffset * 14));

  return (
    <Card className="border-slate-200 shadow-2xs overflow-hidden">
      <CardContent className="p-0">
        {/* Card Info & Toolbar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/90 px-3 py-2 border-b border-slate-200 font-medium">
          <div className="flex items-center gap-1.5">
            <span>Klik Header Kolom untuk memperluas rincian</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 border-r border-slate-300 pr-2 mr-0.5">
              <button
                type="button"
                onClick={handleCollapseAll}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                title="Ringkas Semua Kolom"
              >
                <FoldHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleExpandAll}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                title="Perluas Semua Kolom"
              >
                <UnfoldHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomOffset <= -4}
                className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer"
                title="Perkecil Skala Kolom & Teks"
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
                title="Perbesar Skala Kolom & Teks"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Scaling Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full text-left border-collapse"
            style={{
              fontSize: `${tableFontSize}px`,
              '--tbl-px': `${tablePx}px`,
              '--tbl-py': `${tablePy}px`,
              '--tbl-sub-px': `${tableSubPx}px`,
              '--tbl-sub-py': `${tableSubPy}px`,
              '--col-emp-w': `${colEmpWidth}px`,
              '--col-dept-w': `${colDeptWidth}px`,
            } as React.CSSProperties}
          >
            <thead>
              {!hasAnyExpanded ? (
                <tr className="bg-slate-50 border-b border-slate-200 text-[1em] font-semibold text-slate-600">
                  <th
                    className="sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-2xs whitespace-nowrap overflow-hidden"
                    style={{
                      padding: 'var(--tbl-py) var(--tbl-px)',
                      width: 'var(--col-emp-w)',
                      minWidth: 'var(--col-emp-w)',
                      maxWidth: 'var(--col-emp-w)',
                    }}
                  >
                    Karyawan
                  </th>
                  <th
                    className="border-r border-slate-200 whitespace-nowrap overflow-hidden"
                    style={{
                      padding: 'var(--tbl-py) var(--tbl-px)',
                      width: 'var(--col-dept-w)',
                      minWidth: 'var(--col-dept-w)',
                      maxWidth: 'var(--col-dept-w)',
                    }}
                  >
                    <div>Departemen</div>
                    <div className="text-[0.9em] text-slate-400 font-normal">Posisi</div>
                  </th>
                  <th
                    className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                    style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                    onClick={() => toggleCol('hadir')}
                    title="Klik untuk melihat rincian Hadir (Masuk / Pulang)"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Hadir</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                          expandedCols.hadir ? 'rotate-180 text-emerald-700' : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                    style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                    onClick={() => toggleCol('terlambat')}
                    title="Klik untuk melihat rincian Terlambat (Masuk / Pulang Cepat)"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Terlambat</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                          expandedCols.terlambat ? 'rotate-180 text-amber-700' : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                    style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                    onClick={() => toggleCol('cuti')}
                    title="Klik untuk melihat rincian Cuti per Kebijakan"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Cuti</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                          expandedCols.cuti ? 'rotate-180 text-blue-700' : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                    style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                    onClick={() => toggleCol('ketidakhadiran')}
                    title="Klik untuk melihat rincian Alasan Ketidakhadiran"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Ketidakhadiran</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                          expandedCols.ketidakhadiran
                            ? 'rotate-180 text-rose-700'
                            : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>
                    Total Hari
                  </th>
                </tr>
              ) : (
                <>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[1em] font-semibold text-slate-600">
                    <th
                      className="sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-2xs whitespace-nowrap overflow-hidden"
                      style={{
                        padding: 'var(--tbl-py) var(--tbl-px)',
                        width: 'var(--col-emp-w)',
                        minWidth: 'var(--col-emp-w)',
                        maxWidth: 'var(--col-emp-w)',
                      }}
                      rowSpan={2}
                    >
                      Karyawan
                    </th>
                    <th
                      className="border-r border-slate-200 whitespace-nowrap overflow-hidden"
                      style={{
                        padding: 'var(--tbl-py) var(--tbl-px)',
                        width: 'var(--col-dept-w)',
                        minWidth: 'var(--col-dept-w)',
                        maxWidth: 'var(--col-dept-w)',
                      }}
                      rowSpan={2}
                    >
                      <div>Departemen</div>
                      <div className="text-[0.9em] text-slate-400 font-normal">Posisi</div>
                    </th>
                    <th
                      className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                        expandedCols.hadir ? 'bg-emerald-50/80 text-emerald-950 font-bold border-b border-emerald-200' : 'hover:bg-slate-100'
                      }`}
                      style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      colSpan={expandedCols.hadir ? 3 : 1}
                      rowSpan={expandedCols.hadir ? 1 : 2}
                      onClick={() => toggleCol('hadir')}
                      title={expandedCols.hadir ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Hadir</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                            expandedCols.hadir ? 'rotate-180 text-emerald-700' : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                      </div>
                    </th>
                    <th
                      className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                        expandedCols.terlambat ? 'bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200' : 'hover:bg-slate-100'
                      }`}
                      style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      colSpan={expandedCols.terlambat ? 3 : 1}
                      rowSpan={expandedCols.terlambat ? 1 : 2}
                      onClick={() => toggleCol('terlambat')}
                      title={expandedCols.terlambat ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Terlambat</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                            expandedCols.terlambat ? 'rotate-180 text-amber-700' : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                      </div>
                    </th>
                    <th
                      className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                        expandedCols.cuti ? 'bg-blue-50/80 text-blue-950 font-bold border-b border-blue-200' : 'hover:bg-slate-100'
                      }`}
                      style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      colSpan={expandedCols.cuti ? leavePolicies.length + 1 : 1}
                      rowSpan={expandedCols.cuti ? 1 : 2}
                      onClick={() => toggleCol('cuti')}
                      title={expandedCols.cuti ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Cuti</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                            expandedCols.cuti ? 'rotate-180 text-blue-700' : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                      </div>
                    </th>
                    <th
                      className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                        expandedCols.ketidakhadiran ? 'bg-rose-50/80 text-rose-950 font-bold border-b border-rose-200' : 'hover:bg-slate-100'
                      }`}
                      style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      colSpan={expandedCols.ketidakhadiran ? absenceReasonsList.length + 2 : 1}
                      rowSpan={expandedCols.ketidakhadiran ? 1 : 2}
                      onClick={() => toggleCol('ketidakhadiran')}
                      title={expandedCols.ketidakhadiran ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Ketidakhadiran</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                            expandedCols.ketidakhadiran ? 'rotate-180 text-rose-700' : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                      </div>
                    </th>
                    <th className="text-center whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} rowSpan={2}>
                      Total Hari
                    </th>
                  </tr>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[1em] font-semibold text-slate-600">
                    {expandedCols.hadir && (
                      <>
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-emerald-50/60 font-semibold text-emerald-900" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Masuk</th>
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-emerald-50/60 font-semibold text-emerald-900" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Pulang</th>
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-emerald-100/70 font-bold text-emerald-950" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Total</th>
                      </>
                    )}

                    {expandedCols.terlambat && (
                      <>
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-amber-50/60 font-semibold text-amber-900" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Masuk</th>
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-amber-50/60 font-semibold text-amber-900" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Pulang Cepat</th>
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-amber-100/70 font-bold text-amber-950" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Total</th>
                      </>
                    )}

                    {expandedCols.cuti && (
                      <>
                        {leavePolicies.map(p => (
                          <th key={p.id} className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-blue-50/60 font-semibold text-blue-900" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            {p.name}
                          </th>
                        ))}
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-blue-100/70 font-bold text-blue-950" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Total</th>
                      </>
                    )}

                    {expandedCols.ketidakhadiran && (
                      <>
                        {absenceReasonsList.map(r => (
                          <th key={r} className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-rose-50/60 font-semibold text-rose-900" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            {r}
                          </th>
                        ))}
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-rose-50/60 font-semibold text-rose-900" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Alpa Umum</th>
                        <th className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-rose-100/70 font-bold text-rose-950" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>Total</th>
                      </>
                    )}
                  </tr>
                </>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employeeSummaries.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      7 +
                      (expandedCols.hadir ? 2 : 0) +
                      (expandedCols.terlambat ? 2 : 0) +
                      (expandedCols.cuti ? leavePolicies.length : 0) +
                      (expandedCols.ketidakhadiran ? absenceReasonsList.length + 1 : 0)
                    }
                    className="p-8 text-center text-slate-400 text-xs"
                  >
                    Tidak ada data karyawan yang sesuai dengan kriteria pencarian / filter.
                  </td>
                </tr>
              ) : (
                employeeSummaries.map((summary) => {
                  const displayName = formatEmployeeName(summary.employee.fullName);
                  const displayDept = formatDepartmentName(summary.deptName || '-');
                  const displayOnlyPos = formatPositionName(summary.posName || 'Staff');
                  const empIdDisplay = summary.employee.employeeId || summary.employee.id || '-';

                  return (
                    <tr
                      key={summary.employee.id}
                      onClick={() => onSelectEmployee(summary)}
                      className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                      title={`Klik untuk melihat detail rekap presensi ${displayName}`}
                    >
                      <td
                        className="sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-200 shadow-2xs overflow-hidden"
                        style={{
                          padding: 'var(--tbl-py) var(--tbl-px)',
                          width: 'var(--col-emp-w)',
                          minWidth: 'var(--col-emp-w)',
                          maxWidth: 'var(--col-emp-w)',
                        }}
                      >
                        <div className="text-[0.9em] text-slate-500 font-normal overflow-hidden text-clip whitespace-nowrap" title={empIdDisplay}>
                          {empIdDisplay}
                        </div>
                        <div className="font-bold text-slate-900 text-[1.05em] overflow-hidden text-clip whitespace-nowrap mt-0.5" title={summary.employee.fullName}>
                          {displayName}
                        </div>
                      </td>
                      <td
                        className="overflow-hidden border-r border-slate-200"
                        style={{
                          padding: 'var(--tbl-py) var(--tbl-px)',
                          width: 'var(--col-dept-w)',
                          minWidth: 'var(--col-dept-w)',
                          maxWidth: 'var(--col-dept-w)',
                        }}
                      >
                        <div className="text-[0.9em] text-slate-500 font-normal overflow-hidden text-clip whitespace-nowrap" title={summary.deptName}>
                          {displayDept}
                        </div>
                        <div className="font-bold text-slate-900 text-[1.05em] overflow-hidden text-clip whitespace-nowrap mt-0.5" title={summary.posName}>
                          {displayOnlyPos}
                        </div>
                      </td>

                      {expandedCols.hadir && (
                        <>
                          <td className="text-center border-r border-slate-200" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            <span className="font-medium text-slate-600">{summary.presentIn || '-'}</span>
                          </td>
                          <td className="text-center border-r border-slate-200" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            <span className="font-medium text-slate-600">{summary.presentOut || '-'}</span>
                          </td>
                        </>
                      )}
                      <td
                        className={`text-center border-r border-slate-200 ${expandedCols.hadir ? 'bg-slate-50' : ''}`}
                        style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      >
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[1em]">
                          {summary.presentCount}
                        </span>
                      </td>

                      {expandedCols.terlambat && (
                        <>
                          <td className="text-center border-r border-slate-200" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            <span className="font-medium text-slate-600">{summary.lateIn || '-'}</span>
                          </td>
                          <td className="text-center border-r border-slate-200" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            <span className="font-medium text-slate-600">{summary.earlyOut || '-'}</span>
                          </td>
                        </>
                      )}
                      <td
                        className={`text-center border-r border-slate-200 ${expandedCols.terlambat ? 'bg-slate-50' : ''}`}
                        style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      >
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[1em]">
                          {summary.lateCount}
                        </span>
                      </td>

                      {expandedCols.cuti &&
                        leavePolicies.map(p => (
                          <td key={p.id} className="text-center border-r border-slate-200" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            <span className="font-medium text-slate-600">{summary.cutiDetails[p.id] || '-'}</span>
                          </td>
                        ))}
                      <td
                        className={`text-center border-r border-slate-200 ${expandedCols.cuti ? 'bg-slate-50' : ''}`}
                        style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      >
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[1em]">
                          {summary.leaveCount}
                        </span>
                      </td>

                      {expandedCols.ketidakhadiran &&
                        absenceReasonsList.map(r => (
                          <td key={r} className="text-center border-r border-slate-200" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                            <span className="font-medium text-slate-600">{summary.absentDetails[r] || '-'}</span>
                          </td>
                        ))}
                      {expandedCols.ketidakhadiran && (
                        <td className="text-center border-r border-slate-200" style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}>
                          <span className="font-medium text-slate-600">{summary.generalAbsent || '-'}</span>
                        </td>
                      )}
                      <td
                        className={`text-center border-r border-slate-200 ${expandedCols.ketidakhadiran ? 'bg-slate-50' : ''}`}
                        style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      >
                        <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-[1em]">
                          {summary.absentCount}
                        </span>
                      </td>

                      <td
                        className="text-center font-bold text-slate-700 text-[1em] whitespace-nowrap"
                        style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                      >
                        {summary.totalDaysRecorded} Hari
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
