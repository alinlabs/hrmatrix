import React from 'react';
import { CheckCircle2, AlertCircle, Printer, Pencil, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import { calculateGrade } from '../../services/kpiService';
import { ModalDetailKPIProps } from './types';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';

export function ModalDetailKPI({
  isOpen,
  onClose,
  result,
  employee,
  period,
  position,
  rules,
  onEdit
}: ModalDetailKPIProps) {
  const gradeRule = result ? calculateGrade(result.score, rules.grades) : null;
  const isPassing = result ? result.score >= rules.passingScore : false;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen && !!result && !!employee}
      onClose={onClose}
      contentClassName="sm:max-w-2xl"
    >
      {result && employee && gradeRule ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* 1. Modal Header (Avatar, Name, Position & Action Icons) */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <EmployeeAvatar
                employee={employee as any}
                name={employee.fullName}
                size="md"
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  {employee.fullName}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                  {position?.name || 'Staf'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit();
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Nilai"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePrint}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Cetak / Unduh"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* 2. Modal Body (Scrollable) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            {/* Big Score Summary Banner */}
            <div className="p-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Total Skor Akhir KPI
                </div>
                <div className="text-3xl font-black text-blue-900 mt-0.5">
                  {result.score} <span className="text-base font-bold text-slate-500">Skor</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-1.5 flex items-center gap-1.5 mb-1.5">
                  <span>ID: <span className="font-bold text-slate-700">{employee.employeeId}</span></span>
                  <span>•</span>
                  <span>Periode: <span className="font-bold text-blue-700">{period?.name || result.periodId}</span></span>
                </div>
                <div className="text-xs font-semibold mt-1">
                  {isPassing ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Memenuhi Standar Kelulusan (Min. {rules.passingScore} Skor)
                    </span>
                  ) : (
                    <span className="text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Di Bawah Standar Kelulusan (Min. {rules.passingScore} Skor)
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className={`inline-block px-3 py-1.5 rounded-xl text-base font-extrabold border shadow-2xs ${gradeRule.color}`}>
                  Grade {result.grade || gradeRule.grade}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  {result.gradeLabel || gradeRule.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Evaluator: {result.evaluatorId || 'HR'}
                </div>
              </div>
            </div>

            {/* Indicators Breakdown Table */}
            <div className="space-y-2">
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Rincian Indikator Kinerja yang Dinilai</span>
                <span className="text-slate-500 font-normal">
                  {result.items?.length || 0} Indikator
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                <div className="bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500 grid grid-cols-12 gap-2 uppercase">
                  <div className="col-span-6">Indikator KPI</div>
                  <div className="col-span-3 text-center">Nilai Skor</div>
                  <div className="col-span-3 text-right">Skor Terbobot</div>
                </div>

                {result.items?.map((it, idx) => (
                  <div key={idx} className="p-3 bg-white hover:bg-slate-50/50 transition-colors grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <div className="font-bold text-slate-900">{it.kpiName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                          {it.category}
                        </span>
                        <span>Bobot: <strong>{it.weight}%</strong></span>
                      </div>
                    </div>

                    <div className="col-span-3 text-center font-bold text-slate-900 text-xs">
                      {it.actual} <span className="text-[10px] font-medium text-slate-400">Skor</span>
                    </div>

                    <div className="col-span-3 text-right">
                      <div className="font-black text-blue-700 text-xs sm:text-sm">
                        {it.weightedScore} <span className="text-[10px] font-semibold text-slate-400">Skor</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluator Notes */}
            {result.notes && (
              <div className="bg-amber-50/80 border border-amber-200/90 p-3.5 rounded-xl">
                <div className="font-bold text-amber-900 mb-0.5 text-xs">
                  Catatan Evaluator / Saran Pengembangan:
                </div>
                <p className="text-amber-800 text-xs leading-relaxed">{result.notes}</p>
              </div>
            )}

            {/* Footer Info */}
            <div className="text-[11px] text-slate-400 pt-1 flex justify-between">
              <span>Tanggal Penilaian: {result.evaluatedAt || '-'}</span>
              <span>ID Catatan: {result.id.slice(0, 8)}</span>
            </div>
          </div>

          {/* 3. Modal Footer */}
          <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Tutup
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
