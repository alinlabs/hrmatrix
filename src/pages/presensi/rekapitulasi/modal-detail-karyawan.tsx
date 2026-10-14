import React, { useState, useMemo } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CalendarDays, 
  FileText, 
  TrendingUp, 
  Search,
  Check,
  ChevronRight,
  Sparkles,
  Info,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { Attendance, Employee, Leave, LeaveTypePolicy, AttendanceConfig } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { EmployeeAvatar } from '../../../components/ui/EmployeeAvatar';

export interface EmployeeSummaryData {
  employee: Employee;
  deptName: string;
  posName: string;
  presentCount: number;
  lateCount: number;
  leaveCount: number;
  absentCount: number;
  totalDaysRecorded: number;
  presentIn: number;
  presentOut: number;
  lateIn: number;
  earlyOut: number;
  generalAbsent: number;
  absentDetails: Record<string, number>;
  cutiDetails: Record<string, number>;
}

export interface ModalDetailKaryawanProps {
  isOpen: boolean;
  onClose: () => void;
  summary: EmployeeSummaryData | null;
  attendances: Attendance[];
  leaves: Leave[];
  selectedMonthLabel: string;
  selectedYear: string;
  leavePolicies: LeaveTypePolicy[];
  config: AttendanceConfig | null;
}

export function ModalDetailKaryawan({
  isOpen,
  onClose,
  summary,
  attendances,
  leaves,
  selectedMonthLabel,
  selectedYear,
  leavePolicies,
  config
}: ModalDetailKaryawanProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'leave' | 'late_absent'>('daily');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchLog, setSearchLog] = useState<string>('');

  // Format attendance records sorted by date
  const sortedRecords = useMemo(() => {
    if (!isOpen || !summary) return [];
    return [...attendances].sort((a, b) => a.date.localeCompare(b.date));
  }, [isOpen, summary, attendances]);

  // Filtered daily records for Tab 1
  const filteredDailyRecords = useMemo(() => {
    if (!isOpen || !summary) return [];
    return sortedRecords.filter(r => {
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'Present' && r.status !== 'Present') return false;
        if (statusFilter === 'Late' && r.status !== 'Late') return false;
        if (statusFilter === 'Leave' && r.status !== 'Leave' && r.status !== 'Sick') return false;
        if (statusFilter === 'Absent' && r.status !== 'Absent') return false;
      }
      if (searchLog.trim()) {
        const q = searchLog.toLowerCase();
        const matchDate = r.date.toLowerCase().includes(q);
        const matchShift = r.shiftName ? r.shiftName.toLowerCase().includes(q) : false;
        const matchNotes = r.notes ? r.notes.toLowerCase().includes(q) : false;
        const matchStatus = r.status.toLowerCase().includes(q);
        if (!matchDate && !matchShift && !matchNotes && !matchStatus) return false;
      }
      return true;
    });
  }, [isOpen, summary, sortedRecords, statusFilter, searchLog]);

  // Specific late & absent records for Tab 3
  const lateAndAbsentRecords = useMemo(() => {
    if (!isOpen || !summary) return [];
    return sortedRecords.filter(r => r.status === 'Late' || r.status === 'Absent' || (r.notes && r.notes.toLowerCase().includes('pulang cepat')));
  }, [isOpen, summary, sortedRecords]);

  if (!isOpen || !summary) return null;

  const emp = summary.employee;
  const empIdDisplay = emp.employeeId || emp.id || '-';

  // Attendance rate calculation
  const attendanceRate = summary.totalDaysRecorded > 0 
    ? Math.round(((summary.presentCount + summary.lateCount) / summary.totalDaysRecorded) * 100) 
    : 0;

  // Format date helper
  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Hadir
          </span>
        );
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Terlambat
          </span>
        );
      case 'Leave':
      case 'Sick':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {status === 'Sick' ? 'Sakit' : 'Cuti'}
          </span>
        );
      case 'Absent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Alpa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fixedHeight
      contentClassName="sm:max-w-4xl"
      hideBottomNav={false}
    >
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        {/* Modal Header (Fixed Compact) */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <EmployeeAvatar employee={emp} size="md" />
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight">
                {emp.fullName}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                {summary.posName || 'Staff'}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0 ml-2"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Scroll Body (Semua konten menyatu dalam satu scroll utama) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5 bg-slate-50/40">
          
          {/* Quick Stats Grid (4 Kartu Metrik Ringkas) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Hadir */}
            <div className="bg-white p-3 rounded-xl border border-emerald-100/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-emerald-800">Total Hadir</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-emerald-700 mt-2 mb-0.5">
                {summary.presentCount} <span className="text-[11px] font-normal text-slate-400">Hari</span>
              </div>
            </div>

            {/* 2. Terlambat */}
            <div className="bg-white p-3 rounded-xl border border-amber-100/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-amber-800">Terlambat</span>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-amber-700 mt-2 mb-0.5">
                {summary.lateCount} <span className="text-[11px] font-normal text-slate-400">Hari</span>
              </div>
            </div>

            {/* 3. Cuti & Izin */}
            <div className="bg-white p-3 rounded-xl border border-blue-100/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-blue-800">Cuti & Izin</span>
                <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-blue-700 mt-2 mb-0.5">
                {summary.leaveCount} <span className="text-[11px] font-normal text-slate-400">Hari</span>
              </div>
            </div>

            {/* 4. Ketidakhadiran */}
            <div className="bg-white p-3 rounded-xl border border-rose-100/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-rose-800">Ketidakhadiran</span>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="text-xl font-bold text-rose-700 mt-2 mb-0.5">
                {summary.absentCount} <span className="text-[11px] font-normal text-slate-400">Hari</span>
              </div>
            </div>
          </div>

          {/* Navigation Segmented Tab */}
          <div className="grid grid-cols-3 gap-1 w-full bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`w-full py-2.5 px-2 text-center font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center leading-snug ${
                activeTab === 'daily'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>Presensi</span>
              <span>Log Harian</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('leave')}
              className={`w-full py-2.5 px-2 text-center font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center leading-snug ${
                activeTab === 'leave'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>Rincian</span>
              <span>Hak Cuti</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('late_absent')}
              className={`w-full py-2.5 px-2 text-center font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center leading-snug ${
                activeTab === 'late_absent'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>Tidak Hadir</span>
              <span>& Terlambat</span>
            </button>
          </div>

          {/* Tab 1: Log Presensi Harian */}
          {activeTab === 'daily' && (
            <div className="space-y-3">
              {/* Table of Daily Attendance */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                        <th className="px-3.5 py-2.5 whitespace-nowrap">Tanggal</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">Shift / Jadwal</th>
                        <th className="px-3 py-2.5 text-center whitespace-nowrap">Jam Masuk</th>
                        <th className="px-3 py-2.5 text-center whitespace-nowrap">Jam Pulang</th>
                        <th className="px-3 py-2.5 text-center whitespace-nowrap">Status</th>
                        <th className="px-3.5 py-2.5 whitespace-nowrap">Catatan / Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedRecords.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                            Tidak ada catatan presensi pada periode ini.
                          </td>
                        </tr>
                      ) : (
                        sortedRecords.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3.5 py-2.5 whitespace-nowrap font-medium text-slate-800">
                              {formatDateIndo(rec.date)}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">
                              {rec.shiftName || 'Normal'}
                            </td>
                            <td className="px-3 py-2.5 text-center whitespace-nowrap font-mono font-medium text-slate-700">
                              {rec.checkIn || '-'}
                            </td>
                            <td className="px-3 py-2.5 text-center whitespace-nowrap font-mono font-medium text-slate-700">
                              {rec.checkOut || '-'}
                            </td>
                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                              {getStatusBadge(rec.status)}
                            </td>
                            <td className="px-3.5 py-2.5 text-slate-500 max-w-xs truncate">
                              {rec.notes || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Rincian Cuti */}
          {activeTab === 'leave' && (
            <div className="space-y-4">
              {/* Leave Policy Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  Rincian Pengambilan Cuti Periode {selectedMonthLabel} {selectedYear}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {leavePolicies.map((p) => {
                    const daysTaken = summary.cutiDetails[p.id] || 0;
                    return (
                      <div key={p.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 truncate" title={p.name}>
                          {p.name}
                        </div>
                        <div className="text-base font-bold text-slate-800 mt-0.5">
                          {daysTaken} <span className="text-[10px] font-normal text-slate-400">Hari</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* List of Approved Leave Requests */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">
                    Daftar Permohonan Cuti Resmi Disetujui
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {leaves.length} permohonan
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {leaves.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Tidak ada permohonan cuti pada periode bulan ini.
                    </div>
                  ) : (
                    leaves.map((l) => (
                      <div key={l.id} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {l.leaveType}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {l.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{formatDateIndo(l.startDate)} s/d {formatDateIndo(l.endDate)}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{l.duration} Hari Kerja</span>
                          </div>
                          {l.reason && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                              "{l.reason}"
                            </p>
                          )}
                        </div>
                        {l.approvedBy && (
                          <div className="text-[11px] text-slate-400 sm:text-right shrink-0">
                            Disetujui oleh: <span className="font-medium text-slate-600">{l.approvedBy}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Terlambat & Alpa */}
          {activeTab === 'late_absent' && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-amber-50/50 border border-amber-200/80 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Total Keterlambatan Masuk</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl font-bold text-amber-800 mt-1">
                    {summary.lateIn} <span className="text-xs font-normal text-amber-700">Kali</span>
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-1">
                    Pulang lebih awal tercatat: <b>{summary.earlyOut} kali</b>
                  </p>
                </div>

                <div className="bg-rose-50/50 border border-rose-200/80 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">Total Alpa / Tanpa Keterangan</span>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-xl font-bold text-rose-800 mt-1">
                    {summary.absentCount} <span className="text-xs font-normal text-rose-700">Hari</span>
                  </div>
                  <p className="text-[11px] text-rose-700/80 mt-1">
                    Alpa umum: <b>{summary.generalAbsent} hari</b>
                  </p>
                </div>
              </div>

              {/* Breakdown of absence reasons */}
              {Object.keys(summary.absentDetails).length > 0 && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    Rincian Kategori Alasan Ketidakhadiran
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(summary.absentDetails).map(([reason, count]) => (
                      <div key={reason} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-600 truncate pr-2" title={reason}>{reason}</span>
                        <span className="font-bold text-xs text-slate-900">{count} hari</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Table of Late & Absent Events */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-800">
                    Log Kejadian Terlambat & Ketidakhadiran
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                        <th className="px-3.5 py-2.5 whitespace-nowrap">Tanggal</th>
                        <th className="px-3 py-2.5 text-center whitespace-nowrap">Jam Masuk</th>
                        <th className="px-3 py-2.5 text-center whitespace-nowrap">Jam Pulang</th>
                        <th className="px-3 py-2.5 text-center whitespace-nowrap">Status</th>
                        <th className="px-3.5 py-2.5 whitespace-nowrap">Catatan / Alasan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lateAndAbsentRecords.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                            Tidak ada catatan keterlambatan atau ketidakhadiran pada periode ini. Kinerja presensi sangat baik!
                          </td>
                        </tr>
                      ) : (
                        lateAndAbsentRecords.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3.5 py-2.5 whitespace-nowrap font-medium text-slate-800">
                              {formatDateIndo(rec.date)}
                            </td>
                            <td className="px-3 py-2.5 text-center whitespace-nowrap font-mono text-slate-700">
                              {rec.checkIn || '-'}
                            </td>
                            <td className="px-3 py-2.5 text-center whitespace-nowrap font-mono text-slate-700">
                              {rec.checkOut || '-'}
                            </td>
                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                              {getStatusBadge(rec.status)}
                            </td>
                            <td className="px-3.5 py-2.5 text-slate-600">
                              {rec.notes || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Info Summary Note */}
          <div className="flex items-center justify-center p-3 bg-blue-50/60 rounded-xl border border-blue-100/80">
            <div className="text-xs text-blue-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Total <b>{summary.totalDaysRecorded} hari</b> tercatat dalam rekapitulasi periode ini</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
