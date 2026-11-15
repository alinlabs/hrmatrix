import React from 'react';
import { X, CalendarRange, User, Briefcase, Hash } from 'lucide-react';
import { LeaveTypePolicy } from '../../types';
import { EmployeeLeaveSummary } from '../../services/leaveService';
import { Modal } from '../../components/ui/Modal';

interface ModalEmployeeBalanceProps {
  isOpen: boolean;
  onClose: () => void;
  employeeSummary: EmployeeLeaveSummary | null;
  leavePolicies: LeaveTypePolicy[];
}

export function ModalEmployeeBalance({
  isOpen,
  onClose,
  employeeSummary,
  leavePolicies
}: ModalEmployeeBalanceProps) {
  return (
    <Modal
      isOpen={isOpen && !!employeeSummary}
      onClose={onClose}
      contentClassName="sm:max-w-2xl"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Detail Saldo Karyawan
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Informasi lengkap kuota cuti & izin karyawan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Tutup"
            aria-label="Tutup"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {employeeSummary && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            {/* Employee Info Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-900">{employeeSummary.employeeName}</div>
                <div className="text-xs text-slate-500 font-normal flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> {employeeSummary.employeeId}
                </div>
              </div>
              <div className="sm:text-right space-y-0.5">
                <div className="text-xs font-semibold text-slate-800 flex items-center sm:justify-end gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {employeeSummary.departmentId || '-'}
                </div>
                <div className="text-[11px] text-slate-500 font-normal">{employeeSummary.positionId || '-'}</div>
              </div>
            </div>

            {/* Balances List */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 mb-2.5 flex items-center gap-1.5">
                <CalendarRange className="w-3.5 h-3.5 text-blue-600" />
                Matriks Kuota & Saldo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {leavePolicies.map(policy => {
                  const isConditional = policy.periodType === 'conditional';
                  const hasCarryOver = policy.unusedBalanceAction === 'carry_forward';
                  const usedCount = employeeSummary.policyUsageMap ? (employeeSummary.policyUsageMap[policy.id] || employeeSummary.policyUsageMap[policy.name] || 0) : 0;
                  
                  return (
                    <div key={policy.id} className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col bg-white">
                      <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900">{policy.name}</span>
                        <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold">
                          {policy.code}
                        </span>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-center space-y-1.5 text-xs">
                        {hasCarryOver ? (
                          <>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-normal">Carry Over:</span>
                              <span className="font-semibold text-blue-700">{employeeSummary.carryForward || 0} Hari</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-normal">Periode Ini:</span>
                              <span className="font-semibold text-emerald-700">{employeeSummary.annualQuota} Hari</span>
                            </div>
                            <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-100">
                              <span className="text-slate-500 font-normal">Terpakai:</span>
                              <span className="font-bold text-rose-600">{usedCount} Hari</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold pt-0.5">
                              <span className="text-slate-700">Sisa / Total:</span>
                              <span className="text-slate-900">{Math.max(0, employeeSummary.totalEntitlement - usedCount)} Hari</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-normal">Plafon Kuota:</span>
                              <span className="font-semibold text-slate-800">
                                {isConditional ? 'Kondisional (-)' : (policy.defaultQuota > 0 ? `${policy.defaultQuota} Hari` : 'Fleksibel')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-100">
                              <span className="text-slate-500 font-normal">Terpakai:</span>
                              <span className="font-bold text-rose-600">{usedCount} Hari</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer: Single Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
