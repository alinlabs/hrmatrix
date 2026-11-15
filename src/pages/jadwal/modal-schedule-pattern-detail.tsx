import React from 'react';
import { Bookmark, Pencil, Trash2, X, Check } from 'lucide-react';
import { 
  SavedSchedulePattern, 
  Department, 
  Employee, 
  AttendanceConfig, 
  WorkShift 
} from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import { formatIndoDate, getShiftBadgeClasses, getShiftBadgeStyle } from './utils-helper';

export interface ModalSchedulePatternDetailProps {
  viewingSavedPattern: SavedSchedulePattern | null;
  onClose: () => void;
  onEdit: (pattern: SavedSchedulePattern) => void;
  onDelete?: (pattern: SavedSchedulePattern) => void;
  onActivate: (pattern: SavedSchedulePattern) => void;
  departments: Department[];
  employees: Employee[];
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
}

export function ModalSchedulePatternDetail({
  viewingSavedPattern,
  onClose,
  onEdit,
  onDelete,
  onActivate,
  departments,
  employees,
  activeConfig,
  availableShifts,
}: ModalSchedulePatternDetailProps) {
  const deptAssignments = viewingSavedPattern?.departmentAssignments || [];
  const groupAssignments = viewingSavedPattern?.groupAssignments || [];
  const hasNoAssignments = deptAssignments.length === 0 && groupAssignments.length === 0;

  return (
    <Modal
      isOpen={Boolean(viewingSavedPattern)}
      onClose={onClose}
      contentClassName="sm:max-w-2xl"
    >
      {viewingSavedPattern && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  {viewingSavedPattern.name}
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal truncate">
                  Diperbarui: {formatIndoDate(viewingSavedPattern.updatedAt || viewingSavedPattern.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              <button
                type="button"
                onClick={() => {
                  const p = viewingSavedPattern;
                  onClose();
                  onEdit(p);
                }}
                title="Edit Pola"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    const p = viewingSavedPattern;
                    onClose();
                    onDelete(p);
                  }}
                  title="Hapus Pola Jadwal Ini"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="w-px h-4 bg-slate-200 mx-0.5" />
              <button 
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
            {viewingSavedPattern.description && (
              <div className="p-3 bg-slate-50/30 border border-slate-100/80 rounded-xl">
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {viewingSavedPattern.description}
                </p>
              </div>
            )}

            {/* Title Penugasan Pola Shift */}
            <div className="flex items-center justify-between pt-1">
              <h4 className="text-xs font-bold text-slate-800">
                Penugasan Pola Shift
              </h4>
            </div>

            {hasNoAssignments ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 space-y-1">
                <p className="text-xs font-semibold">Belum ada penugasan bagian pada pola ini</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Department Assignments */}
                {deptAssignments.map((assign) => {
                  const deptObj = departments.find(d => d.id === assign.departmentId);
                  const patternObj = (activeConfig?.shiftPatterns || []).find(p => p.id === assign.shiftPatternId);

                  return (
                    <div 
                      key={`dept-${assign.departmentId}`} 
                      className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-3xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-normal block">Departemen</span>
                          <h5 className="font-bold text-xs text-slate-900 leading-tight truncate">
                            {deptObj?.name || assign.departmentId}
                          </h5>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 text-[10px]">Siklus Shift</span>
                          <span className="font-medium text-slate-700 text-right">
                            {patternObj ? `${patternObj.cycle?.length || 0} Hari` : 'Pola Default'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 text-[10px]">Pola Shift</span>
                          <span className="font-semibold text-slate-800 text-right truncate">
                            {patternObj ? patternObj.name : '-'}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2 py-0.5">
                          <span className="text-slate-400 text-[10px] shrink-0 pt-0.5">Detail Pola</span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                            {patternObj?.cycle && patternObj.cycle.length > 0 ? (
                              patternObj.cycle.map((c, i) => {
                                const s = (activeConfig?.shifts || availableShifts).find(x => x.id === c);
                                const isOff = c === 'OFF' || s?.isOff || s?.code?.toUpperCase() === 'OFF';
                                const color = isOff ? 'rose' : (s?.color || 'blue');
                                const codeLabel = isOff ? 'OFF' : (s?.code || c);
                                return (
                                  <span
                                    key={i}
                                    style={getShiftBadgeStyle(color)}
                                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${getShiftBadgeClasses(color)}`}
                                  >
                                    {codeLabel}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 text-[10px]">Tanggal Aktif</span>
                          <span className="font-normal text-slate-700 text-right">
                            {assign.anchorDate ? formatIndoDate(assign.anchorDate) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Group Assignments */}
                {groupAssignments.map((grp, grpIdx) => {
                  const patternObj = (activeConfig?.shiftPatterns || []).find(p => p.id === grp.shiftPatternId);

                  return (
                    <div 
                      key={`grp-${grp.id || grpIdx}`}
                      className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-3xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-normal block">Group / Regu Bagian</span>
                          <h5 className="font-bold text-xs text-slate-900 leading-tight truncate">
                            {grp.name}
                          </h5>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 text-[10px]">Siklus Shift</span>
                          <span className="font-medium text-slate-700 text-right">
                            {patternObj ? `${patternObj.cycle?.length || 0} Hari` : 'Pola Default'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 text-[10px]">Pola Shift</span>
                          <span className="font-semibold text-slate-800 text-right truncate">
                            {patternObj ? patternObj.name : '-'}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2 py-0.5">
                          <span className="text-slate-400 text-[10px] shrink-0 pt-0.5">Detail Pola</span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                            {patternObj?.cycle && patternObj.cycle.length > 0 ? (
                              patternObj.cycle.map((c, i) => {
                                const s = (activeConfig?.shifts || availableShifts).find(x => x.id === c);
                                const isOff = c === 'OFF' || s?.isOff || s?.code?.toUpperCase() === 'OFF';
                                const color = isOff ? 'rose' : (s?.color || 'blue');
                                const codeLabel = isOff ? 'OFF' : (s?.code || c);
                                return (
                                  <span
                                    key={i}
                                    style={getShiftBadgeStyle(color)}
                                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${getShiftBadgeClasses(color)}`}
                                  >
                                    {codeLabel}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 text-[10px]">Tanggal Aktif</span>
                          <span className="font-normal text-slate-700 text-right">
                            {grp.anchorDate ? formatIndoDate(grp.anchorDate) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {!viewingSavedPattern.isActive && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex items-center shrink-0 w-full">
              <Button 
                type="button" 
                variant="primary"
                onClick={() => {
                  const p = viewingSavedPattern;
                  onClose();
                  onActivate(p);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Aktifkan Pola Ini</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
