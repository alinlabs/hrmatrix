import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { 
  X, User, Building2, CreditCard, Clock, Calendar, 
  ArrowUpRight, ArrowDownRight, Edit3, FileText, CheckCircle2,
  TrendingUp, TrendingDown, Wallet, ShieldCheck, ChevronRight, ChevronDown,
  Printer, Pencil, AlertCircle
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { ModalEmployeeDetailProps } from './types';
import { formatRupiah, formatSimpleDateIndo } from './utils-helper';
import { getAllowanceCategory } from '../../utils/allowanceClassification';
import { getTerCategory } from '../../services/taxBpjsService';

export const ModalEmployeeDetail: React.FC<ModalEmployeeDetailProps> = ({
  isOpen,
  onClose,
  record,
  period,
  onOpenAdjustment,
  onOpenPayslip
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const emp = record?.employee;

  const empId = emp?.id;
  const periodStart = period?.startDate;
  const periodEnd = period?.endDate;

  // Live Query Attendance Records for this employee during Cut Off
  const attendanceRecords = useLiveQuery(async () => {
    if (!empId) return [];
    const list = await db.attendance.where('employeeId').equals(empId).toArray();
    if (periodStart && periodEnd) {
      return list.filter(a => a.date >= periodStart && a.date <= periodEnd);
    }
    return list;
  }, [empId, periodStart, periodEnd]) || [];

  // Live Query Leave Records
  const leaveRecords = useLiveQuery(async () => {
    if (!empId) return [];
    const list = await db.leaves.where('employeeId').equals(empId).toArray();
    if (periodStart && periodEnd) {
      return list.filter(l => l.startDate <= periodEnd && l.endDate >= periodStart && l.status === 'Approved');
    }
    return list;
  }, [empId, periodStart, periodEnd]) || [];

  // Calculate Cutoff Info
  const cutoffInfo = React.useMemo(() => {
    if (!periodStart || !periodEnd) {
      return { text: period?.name || '-', days: 0 };
    }
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { text: `${periodStart} – ${periodEnd}`, days: 0 };
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return {
      text: `${formatSimpleDateIndo(periodStart)} – ${formatSimpleDateIndo(periodEnd)}`,
      days: diffDays
    };
  }, [periodStart, periodEnd, period?.name]);

  // Calculate Employee Tenure
  const tenureInfo = React.useMemo(() => {
    if (!emp?.joinDate) return { formattedDate: '-', tenureText: '-' };
    const join = new Date(emp.joinDate);
    const now = new Date();
    if (isNaN(join.getTime())) return { formattedDate: emp.joinDate, tenureText: '-' };
    
    let years = now.getFullYear() - join.getFullYear();
    let months = now.getMonth() - join.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const parts = [];
    if (years > 0) parts.push(`${years} Thn`);
    if (months > 0 || years === 0) parts.push(`${months} Bln`);
    
    return {
      formattedDate: formatSimpleDateIndo(emp.joinDate),
      tenureText: parts.join(' ')
    };
  }, [emp?.joinDate]);

  // Collect Non-attendance / Absent Dates
  const absentItems = React.useMemo(() => {
    const items: { date: string; label: string; badgeColor: string; notes?: string }[] = [];
    
    attendanceRecords.forEach(att => {
      const statusLower = (att.status || '').toLowerCase();
      if (statusLower === 'absent' || statusLower === 'alpa') {
        items.push({
          date: att.date,
          label: 'Alpa / Tanpa Keterangan',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          notes: att.notes
        });
      } else if (statusLower === 'sick' || statusLower === 'sakit') {
        items.push({
          date: att.date,
          label: 'Sakit',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          notes: att.notes
        });
      } else if (statusLower === 'leave' || statusLower === 'cuti' || statusLower === 'permit' || statusLower === 'izin') {
        items.push({
          date: att.date,
          label: att.notes ? `Izin/Cuti (${att.notes})` : 'Izin / Cuti',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          notes: att.notes
        });
      }
    });

    leaveRecords.forEach(l => {
      const isPresent = items.some(i => i.date >= l.startDate && i.date <= l.endDate);
      if (!isPresent) {
        items.push({
          date: l.startDate === l.endDate ? l.startDate : `${l.startDate} s/d ${l.endDate}`,
          label: `Cuti (${l.leaveType})`,
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          notes: l.reason
        });
      }
    });

    return items.sort((a, b) => a.date.localeCompare(b.date));
  }, [attendanceRecords, leaveRecords]);

  if (!record || !record.employee) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-2xl">
        <div className="p-6 text-center text-slate-500 text-xs">Memuat data rincian gaji...</div>
      </Modal>
    );
  }

  // Categorize allowances and calculate totals
  const allowances = record.allowancesBreakdown || [];
  
  // 1. Gaji Pokok & Upah Lembur
  const gajiPokokAmount = record.basicSalary || 0;
  const overtimeAmount = record.overtime || 0;
  const totalGajiDanUpah = gajiPokokAmount + overtimeAmount;

  // 2. Tunjangan Tetap
  const fixedAllowancesOnly = allowances.filter(a => getAllowanceCategory(a) === 'Tunjangan Tetap');
  const totalFixedAllowancesOnly = fixedAllowancesOnly.reduce((sum, a) => sum + (a.amount || 0), 0);

  // 3. Tunjangan Tidak Tetap
  const variableAllowancesOnly = allowances.filter(a => getAllowanceCategory(a) === 'Tunjangan Tidak Tetap');
  const totalVariableAllowancesOnly = variableAllowancesOnly.reduce((sum, a) => sum + (a.amount || 0), 0);

  // 4. Bonus & Insentif
  const bonusAllowances = allowances.filter(a => getAllowanceCategory(a) === 'Bonus & Insentif');
  const totalBonusAllowances = bonusAllowances.reduce((sum, a) => sum + (a.amount || 0), 0);

  // Deductions setup
  const deductions = record.deductionsBreakdown || [];

  // 5. Potongan Umum
  const customGeneralDeductions = deductions.filter(d => {
    const nameLower = (d.name || '').toLowerCase();
    const isBpjsKes = nameLower.includes('kesehatan') || nameLower.includes('bpjs kesehatan') || nameLower.includes('bpjs_kes') || nameLower.includes('bpjs-kesehatan');
    const isBpjsTk = nameLower.includes('ketenagakerjaan') || nameLower.includes('bpjs ketenagakerjaan') || nameLower.includes('bpjs_tk') || nameLower.includes('bpjs-ketenagakerjaan') || nameLower.includes('jht') || nameLower.includes('jp') || nameLower.includes('jkk') || nameLower.includes('jkm');
    const isTax = nameLower.includes('pph') || nameLower.includes('pajak') || nameLower.includes('tax');
    return !isBpjsKes && !isBpjsTk && !isTax;
  });
  const totalCustomGeneralDeductions = customGeneralDeductions.reduce((sum, d) => sum + (d.amount || 0), 0);

  // 6. Potongan BPJS Kesehatan
  const bpjsKesehatanDeduction = deductions.find(d => 
    d.id === 'ded_bpjs_kesehatan' || 
    d.name.toLowerCase().includes('bpjs kesehatan') ||
    d.name.toLowerCase().includes('kesehatan')
  );
  const bpjsKesehatanAmount = bpjsKesehatanDeduction ? bpjsKesehatanDeduction.amount : 0;

  // 7. Potongan BPJS Ketenagakerjaan
  const bpjsTkDeductions = deductions.filter(d => 
    d.id === 'ded_bpjs_jht' || 
    d.id === 'ded_bpjs_jp' || 
    d.name.toLowerCase().includes('bpjs ketenagakerjaan') ||
    d.name.toLowerCase().includes('jht') ||
    d.name.toLowerCase().includes('jp')
  );
  const totalBpjsTkAmount = bpjsTkDeductions.reduce((sum, d) => sum + (d.amount || 0), 0);

  // 8. Potongan Pajak PPh 21
  const taxAmount = record.tax || 0;

  // Totals
  const totalEarningsCalculated = totalGajiDanUpah + totalFixedAllowancesOnly + totalVariableAllowancesOnly + totalBonusAllowances;
  const grossSalary = record.grossSalary || totalEarningsCalculated;
  const totalDeductions = record.totalDeduction || (totalCustomGeneralDeductions + bpjsKesehatanAmount + totalBpjsTkAmount + taxAmount);
  const netSalary = record.netSalary || (grossSalary - totalDeductions);

  const formatRupiahVal = (amt?: number) => {
    if (amt === undefined || amt === null || amt === 0) return '-';
    return `Rp${new Intl.NumberFormat('id-ID').format(amt)}`;
  };

  const formatNumberOnly = (amt: number) => new Intl.NumberFormat('id-ID').format(amt || 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-2xl rounded-t-[1.5rem] sm:rounded-2xl p-0 overflow-hidden">
      {/* Drag Handle Bar */}
      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1" />

      {/* 1. Header Profile & Actions */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <EmployeeAvatar
            employee={emp as any}
            name={emp?.fullName}
            size="lg"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate leading-tight">
              {emp.fullName}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate mt-0.5">
              {record.positionName || emp.position || 'Staff'}
            </p>
          </div>
        </div>

        {/* Action Icon Buttons */}
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {onOpenAdjustment && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdjustment(record);
              }}
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Penyesuaian Gaji"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          {onOpenPayslip && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPayslip(record);
              }}
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Cetak Slip Gaji"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Body: Clean Collapsible Categories List */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-1 flex-1 max-h-[75vh]">

        {/* 1. Row 1: Payroll Periode & Ketidakhadiran (Selalu 2 Kolom Kiri-Kanan) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-2.5">
          {/* Card 1: Payroll Periode */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
              PAYROLL PERIODE
            </span>
            <div className="mt-1.5">
              <div className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                {cutoffInfo.days > 0 ? `${cutoffInfo.days} Hari Kalender` : '28 Hari Kalender'}
              </div>
            </div>
          </div>

          {/* Card 2: Ketidakhadiran */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
              KETIDAKHADIRAN
            </span>
            <div className="mt-1.5">
              <div className={`font-bold text-xs sm:text-sm leading-tight ${absentItems.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {absentItems.length > 0 ? `${absentItems.length} Hari` : '0 Hari'}
              </div>
              {absentItems.length > 0 && (
                <div className="mt-1.5 space-y-1 bg-slate-50/70 p-1.5 rounded-lg border border-slate-100 max-h-20 overflow-y-auto">
                  {absentItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] sm:text-[11px] py-0.5 border-b border-slate-100 last:border-0">
                      <span className="font-medium text-slate-700">{formatSimpleDateIndo(item.date)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold border ${item.badgeColor}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Row 2: Take Home Pay Summary Bar */}
        <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl p-3 flex items-center justify-between mb-2.5 shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Take Home Pay</span>
            <span className="text-base sm:text-lg font-black text-slate-900">{formatRupiah(netSalary)}</span>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <div>Bruto: <span className="font-bold text-slate-800">{formatRupiah(grossSalary)}</span></div>
            <div>Potongan: <span className="font-bold text-rose-600">-{formatRupiah(totalDeductions)}</span></div>
          </div>
        </div>

        {/* 3. Row 3: Card Rekening Pembayaran */}
        {(() => {
          const accountHolder = (emp.bankAccountHolder || '').trim();
          const fullName = (emp.fullName || '').trim();
          const isHolderDifferent = accountHolder.length > 0 && accountHolder.toLowerCase() !== fullName.toLowerCase();

          return (
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs mb-3">
              {/* Row 1: Judul Rekening & Atas Nama (Sejajar) */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  REKENING PEMBAYARAN
                </span>
                {isHolderDifferent && (
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold leading-tight text-right">
                    a.n. {emp.bankAccountHolder}
                  </span>
                )}
              </div>

              {/* Row 2: Nama Bank & Nomor Rekening (Sejajar, No Badge, Paling Kanan) */}
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  {emp.bankName || 'BCA'}
                </div>
                <div className="font-mono text-xs sm:text-[13px] font-bold text-slate-900 text-right">
                  {emp.bankAccount || '-'}
                </div>
              </div>
            </div>
          );
        })()}

        {/* --- Category 1: Gaji & Upah --- */}
        <div className="border-b border-slate-100 py-2">
          <div 
            onClick={() => toggleGroup('gaji')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">Gaji & Upah</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['gaji'] && (
                totalGajiDanUpah > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(totalGajiDanUpah)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['gaji'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['gaji'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              <div className="flex items-start justify-between text-xs text-slate-600">
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                  <span className="line-clamp-2 break-words leading-snug">Gaji Pokok</span>
                </div>
                <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                      {formatNumberOnly(gajiPokokAmount)}
                    </span>
                  </div>
                  <div className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>

              <div className="flex items-start justify-between text-xs text-slate-600">
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                  <span className="line-clamp-2 break-words leading-snug">Upah Lembur</span>
                </div>
                <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                      {formatNumberOnly(overtimeAmount)}
                    </span>
                  </div>
                  <div className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Category 2: Tunjangan Tetap --- */}
        <div className="border-b border-slate-100 py-2">
          <div 
            onClick={() => toggleGroup('fixed')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">Tunjangan Tetap</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['fixed'] && (
                totalFixedAllowancesOnly > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-emerald-700 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(totalFixedAllowancesOnly)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['fixed'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['fixed'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              {fixedAllowancesOnly.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic pl-3.5">Tidak ada tunjangan tetap</div>
              ) : (
                fixedAllowancesOnly.map((a, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs text-slate-600">
                    <div className="flex items-start gap-2 min-w-0 pr-2">
                      <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                      <span className="line-clamp-2 break-words leading-snug">{a.name}</span>
                    </div>
                    <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-medium text-xs">Rp</span>
                        <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                          {formatNumberOnly(a.amount)}
                        </span>
                      </div>
                      <div className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* --- Category 3: Tunjangan Tidak Tetap --- */}
        <div className="border-b border-slate-100 py-2">
          <div 
            onClick={() => toggleGroup('variable')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">Tunjangan Tidak Tetap</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['variable'] && (
                totalVariableAllowancesOnly > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-emerald-700 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(totalVariableAllowancesOnly)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['variable'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['variable'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              {variableAllowancesOnly.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic pl-3.5">Tidak ada tunjangan tidak tetap</div>
              ) : (
                variableAllowancesOnly.map((a, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs text-slate-600">
                    <div className="flex items-start gap-2 min-w-0 pr-2">
                      <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                      <span className="line-clamp-2 break-words leading-snug">{a.name}</span>
                    </div>
                    <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-medium text-xs">Rp</span>
                        <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                          {formatNumberOnly(a.amount)}
                        </span>
                      </div>
                      <div className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* --- Category 4: Bonus & Insentif --- */}
        <div className="border-b border-slate-100 py-2">
          <div 
            onClick={() => toggleGroup('bonus')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">Bonus & Insentif</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['bonus'] && (
                totalBonusAllowances > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-emerald-700 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(totalBonusAllowances)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['bonus'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['bonus'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              {bonusAllowances.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic pl-3.5">Tidak ada bonus/insentif</div>
              ) : (
                bonusAllowances.map((a, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs text-slate-600">
                    <div className="flex items-start gap-2 min-w-0 pr-2">
                      <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                      <span className="line-clamp-2 break-words leading-snug">{a.name}</span>
                    </div>
                    <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-medium text-xs">Rp</span>
                        <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                          {formatNumberOnly(a.amount)}
                        </span>
                      </div>
                      <div className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* --- Category 5: Potongan Umum --- */}
        <div className="border-b border-slate-100 py-2">
          <div 
            onClick={() => toggleGroup('generalDeduction')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">Potongan Umum</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['generalDeduction'] && (
                totalCustomGeneralDeductions > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-rose-600 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(totalCustomGeneralDeductions)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['generalDeduction'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['generalDeduction'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              {customGeneralDeductions.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic pl-3.5">Tidak ada potongan umum</div>
              ) : (
                customGeneralDeductions.map((d, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs text-slate-600">
                    <div className="flex items-start gap-2 min-w-0 pr-2">
                      <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                      <span className="line-clamp-2 break-words leading-snug">{d.name}</span>
                    </div>
                    <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-medium text-xs">Rp</span>
                        <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                          {formatNumberOnly(d.amount)}
                        </span>
                      </div>
                      <div className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* --- Category 6: BPJS Kesehatan --- */}
        <div className="border-b border-slate-100 py-2">
          <div 
            onClick={() => toggleGroup('bpjsKes')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">BPJS Kesehatan</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['bpjsKes'] && (
                bpjsKesehatanAmount > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-rose-600 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(bpjsKesehatanAmount)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['bpjsKes'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['bpjsKes'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              <div className="flex items-start justify-between text-xs text-slate-600">
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                  <span className="line-clamp-2 break-words leading-snug">BPJS Kesehatan (1% Karyawan)</span>
                </div>
                <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                      {formatNumberOnly(bpjsKesehatanAmount)}
                    </span>
                  </div>
                  <div className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Category 7: BPJS Ketenagakerjaan --- */}
        <div className="border-b border-slate-100 py-2">
          <div 
            onClick={() => toggleGroup('bpjsTk')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">BPJS Ketenagakerjaan</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['bpjsTk'] && (
                totalBpjsTkAmount > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-rose-600 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(totalBpjsTkAmount)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['bpjsTk'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['bpjsTk'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              {bpjsTkDeductions.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic pl-3.5">Tidak ada potongan BPJS TK</div>
              ) : (
                bpjsTkDeductions.map((d, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs text-slate-600">
                    <div className="flex items-start gap-2 min-w-0 pr-2">
                      <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                      <span className="line-clamp-2 break-words leading-snug">{d.name}</span>
                    </div>
                    <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-medium text-xs">Rp</span>
                        <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                          {formatNumberOnly(d.amount)}
                        </span>
                      </div>
                      <div className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* --- Category 8: Pajak Penghasilan (PPh 21) --- */}
        <div className="py-2">
          <div 
            onClick={() => toggleGroup('pajak')}
            className="flex items-start justify-between cursor-pointer py-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-slate-800 text-xs sm:text-[13px] leading-snug">Pajak Penghasilan (PPh 21)</span>
            <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
              {!expandedGroups['pajak'] && (
                taxAmount > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-bold text-rose-600 text-xs sm:text-[13px] min-w-[85px] text-right">
                      {formatNumberOnly(taxAmount)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-slate-400 text-xs min-w-[105px] text-right pr-0.5">-</span>
                )
              )}
              {expandedGroups['pajak'] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
            </div>
          </div>

          {expandedGroups['pajak'] && (
            <div className="pt-1.5 pb-1 space-y-2 pl-2">
              <div className="flex items-start justify-between text-xs text-slate-600">
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                  <span className="line-clamp-2 break-words leading-snug">PPh 21 TER ({emp.taxStatus || 'TK/0'})</span>
                </div>
                <div className="flex items-start gap-2.5 shrink-0 pt-0.5">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium text-xs">Rp</span>
                    <span className="font-semibold text-slate-800 text-xs min-w-[85px] text-right">
                      {formatNumberOnly(taxAmount)}
                    </span>
                  </div>
                  <div className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
};
