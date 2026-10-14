import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  Volume2, 
  VolumeX, 
  User, 
  Building2, 
  Briefcase
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Employee, AttendanceConfig, Attendance } from '../../types';
import { db } from '../../db/database';
import { calculateAttendance } from '../../services/attendanceCalculator';
import { getPositionName, getDepartmentName } from '../../services/positionService';
import { todayStr } from './utils-helper';
import { v4 as uuidv4 } from 'uuid';
import { CameraScanner } from './camera-scanner';

interface ModalScanProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  attendanceConfig: AttendanceConfig | null;
  filterDate?: string;
  deptMap?: Map<string, string>;
  posMap?: Map<string, string>;
}

// Mini Seekbar / Toggle Switch Component
const MiniToggleSwitch = ({
  checked,
  onChange,
  title,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  title: string;
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
      title={title}
      aria-label={title}
    >
      <span
        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-2xs ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-3.5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

// Date Display Helper (Short numeric DD/MM/YY format e.g. 03/09/26)
const formatDateShortNumeric = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const dd = d.padStart(2, '0');
      const mm = m.padStart(2, '0');
      const yy = y.slice(-2);
      return `${dd}/${mm}/${yy}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

// Helper to extract clean raw code format (without domain/link prefix)
const extractCleanCode = (input: string): string => {
  let text = input.trim();
  if (!text) return '';

  // Jika input berupa link URL e.g. https://domain/employees?code=emp-002/324567 atau ?qr=...
  if (text.includes('?code=') || text.includes('&code=')) {
    try {
      const match = text.match(/[?&]code=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim();
      }
    } catch {}
  }

  if (text.includes('?qr=') || text.includes('&qr=')) {
    try {
      const match = text.match(/[?&]qr=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim();
      }
    } catch {}
  }

  // Jika format JSON { employeeId: "...", nik: "..." }
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.employeeId && parsed.nik) {
        return `${parsed.employeeId}/${parsed.nik}`;
      }
      return (parsed.employeeId || parsed.id || parsed.nik || text).toString().trim();
    } catch {}
  }

  return text;
};

// Audio Beep generator using Web Audio API
const playBeep = (type: 'success' | 'warning' | 'error' = 'success') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'warning') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (err) {
    console.warn('Audio feedback fallback:', err);
  }
};

export function ModalScan({
  isOpen,
  onClose,
  employees,
  attendanceConfig,
  filterDate = todayStr,
  deptMap = new Map(),
  posMap = new Map(),
}: ModalScanProps) {
  const [manualCode, setManualCode] = useState('');
  
  // Audio Mute toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live Digital Clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Config State for Auto / Manual (In/Out, Jam, Tanggal, Auto Submit)
  const [isAutoType, setIsAutoType] = useState<boolean>(true);
  const [manualType, setManualType] = useState<'IN' | 'OUT'>('IN');

  const [isAutoTime, setIsAutoTime] = useState<boolean>(true);
  const [manualTime, setManualTime] = useState<string>('08:00');

  const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
  const [manualDate, setManualDate] = useState<string>(filterDate || todayStr);

  const [isAutoSubmit, setIsAutoSubmit] = useState<boolean>(true);

  // Scan Card State (White Card for Success/Pending/Warning, Red Card for Error)
  type ScanCardState =
    | {
        type: 'SUCCESS';
        employee: Employee;
        posName: string;
        deptName: string;
        actionType: 'IN' | 'OUT' | 'UPDATE';
        timeStr: string;
        dateStr: string;
        statusText: string;
        verificationStatus: 'VERIFIED';
      }
    | {
        type: 'PENDING_CONFIRMATION';
        employee: Employee;
        posName: string;
        deptName: string;
        actionType: 'IN' | 'OUT' | 'UPDATE';
        timeStr: string;
        dateStr: string;
        statusText: string;
        verificationStatus: 'VERIFIED' | 'NEEDS_VERIFICATION';
        warningReason?: string;
        pendingPayload: Attendance;
      }
    | {
        type: 'ERROR';
        message?: string;
      }
    | null;

  const [scanCardState, setScanCardState] = useState<ScanCardState>(null);
  const cardTimerRef = useRef<any>(null);

  // Refs
  const manualInputRef = useRef<HTMLInputElement | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const lastCodeScannedRef = useRef<string>('');
  const lastScanTimeRef = useRef<number>(0);

  // Clear timer & scan state on modal close
  useEffect(() => {
    if (!isOpen) {
      setScanCardState(null);
      setManualCode('');
      if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    }
  }, [isOpen]);

  // Live Digital Clock Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync manual time/date defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      const nowStr = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(/\./g, ':');
      setManualTime(nowStr);
      setManualDate(filterDate || todayStr);
    }
  }, [isOpen, filterDate]);

  // Format Current Time HH:mm:ss and HH:mm
  const formattedTimeFull = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(/\./g, ':');

  const formattedTimeShort = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/\./g, ':');

  // Main Attendance Processing Function
  const processAttendanceScan = useCallback(async (rawCode: string) => {
    const cleanCode = extractCleanCode(rawCode);
    if (!cleanCode) return;

    // Prevent duplicate rapid scans of the exact same code within 2.5 seconds
    const now = Date.now();
    if (lastCodeScannedRef.current === cleanCode && now - lastScanTimeRef.current < 2500) {
      return;
    }

    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    lastCodeScannedRef.current = cleanCode;
    lastScanTimeRef.current = now;

    // Write scanned text directly into input field
    setManualCode(cleanCode);

    let matchedEmployee: Employee | null = null;
    let verificationStatus: 'VERIFIED' | 'NEEDS_VERIFICATION' = 'VERIFIED';
    let warningReason: string | undefined;

    // Dual verification logic (if code contains '/') vs single identifier
    if (cleanCode.includes('/')) {
      const parts = cleanCode.split('/');
      const idPart = parts[0]?.trim().toLowerCase() || '';
      const nikPart = parts[1]?.trim().toLowerCase() || '';

      // Check existence by ID and NIK
      const empById = employees.find(
        e => (e.employeeId && e.employeeId.toLowerCase() === idPart) || (e.id && e.id.toLowerCase() === idPart)
      );
      const empByNik = employees.find(
        e => e.nik && e.nik.toLowerCase() === nikPart
      );

      if (empById && empByNik) {
        if (empById.id === empByNik.id) {
          // Both ID and NIK match the exact same employee -> Verifikasi Berhasil
          matchedEmployee = empById;
          verificationStatus = 'VERIFIED';
        } else {
          // ID matches Employee A, but NIK belongs to Employee B -> Discrepancy
          matchedEmployee = empById;
          verificationStatus = 'NEEDS_VERIFICATION';
          warningReason = 'ID dan NIK tidak sesuai pada satu karyawan';
        }
      } else if (empById && !empByNik) {
        // ID is correct, but NIK is wrong / does not match
        matchedEmployee = empById;
        verificationStatus = 'NEEDS_VERIFICATION';
        warningReason = 'ID terdeteksi, namun NIK tidak cocok';
      } else if (!empById && empByNik) {
        // NIK is correct, but ID is wrong / does not match
        matchedEmployee = empByNik;
        verificationStatus = 'NEEDS_VERIFICATION';
        warningReason = 'NIK terdeteksi, namun ID tidak cocok';
      } else {
        // Neither ID nor NIK found
        matchedEmployee = null;
      }
    } else {
      // Single identifier (ID or NIK)
      const lowerTarget = cleanCode.toLowerCase();
      matchedEmployee = employees.find(
        e =>
          (e.employeeId && e.employeeId.toLowerCase() === lowerTarget) ||
          (e.id && e.id.toLowerCase() === lowerTarget) ||
          (e.nik && e.nik.toLowerCase() === lowerTarget) ||
          (e.fullName && e.fullName.toLowerCase() === lowerTarget)
      ) || null;
      verificationStatus = 'VERIFIED';
    }

    const sysTimeShort = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(/\./g, ':');

    const sysTimeFull = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\./g, ':');

    // Use configured time and date
    const targetDate = isAutoDate ? (filterDate || todayStr) : (manualDate || filterDate || todayStr);
    const nowTimeStr = isAutoTime ? sysTimeShort : (manualTime || sysTimeShort);
    const nowTimeFull = isAutoTime ? sysTimeFull : `${nowTimeStr}:00`;

    if (!matchedEmployee) {
      if (soundEnabled) playBeep('error');
      
      // Full Red Card in Camera Area: "Data Tidak Terdeteksi"
      if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
      setScanCardState({ type: 'ERROR' });
      cardTimerRef.current = setTimeout(() => {
        setScanCardState(null);
        setManualCode('');
      }, 2000);

      isProcessingRef.current = false;
      return;
    }

    // Check existing attendance record for matched employee and targetDate
    const existingRecord = await db.attendance
      .where('date')
      .equals(targetDate)
      .filter(a => a.employeeId === matchedEmployee.id)
      .first();

    const dName = getDepartmentName(deptMap.get(matchedEmployee.departmentId) || matchedEmployee.departmentId, matchedEmployee.positionId) || 'Umum';
    const pName = getPositionName(matchedEmployee.positionId) || posMap.get(matchedEmployee.positionId) || 'Staff';

    let actionType: 'IN' | 'OUT' | 'UPDATE' = 'IN';
    let newCheckIn = existingRecord?.checkIn || '';
    let newCheckOut = existingRecord?.checkOut || '';
    let statusText = 'CHECK IN BERHASIL';

    if (isAutoType) {
      if (!existingRecord || !existingRecord.checkIn) {
        actionType = 'IN';
        newCheckIn = nowTimeStr;
        statusText = 'CHECK IN BERHASIL';
      } else if (existingRecord.checkIn && !existingRecord.checkOut) {
        actionType = 'OUT';
        newCheckOut = nowTimeStr;
        statusText = 'CHECK OUT BERHASIL';
      } else {
        actionType = 'UPDATE';
        newCheckOut = nowTimeStr;
        statusText = 'UPDATE PULANG BERHASIL';
      }
    } else {
      if (manualType === 'IN') {
        actionType = 'IN';
        newCheckIn = nowTimeStr;
        newCheckOut = existingRecord?.checkOut || '';
        statusText = 'CHECK IN (MANUAL) BERHASIL';
      } else {
        actionType = 'OUT';
        newCheckIn = existingRecord?.checkIn || '';
        newCheckOut = nowTimeStr;
        statusText = 'CHECK OUT (MANUAL) BERHASIL';
      }
    }

    // Calculate attendance status
    const calcResult = calculateAttendance(newCheckIn, newCheckOut, attendanceConfig);

    const payload: Attendance = {
      id: existingRecord ? existingRecord.id : uuidv4(),
      employeeId: matchedEmployee.id,
      date: targetDate,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      status: calcResult.status as any,
      shiftId: existingRecord?.shiftId,
      shiftName: existingRecord?.shiftName,
      notes: existingRecord?.notes ? existingRecord.notes : `Scan (${actionType})`,
      lateMinutes: calcResult.lateMinutes,
      earlyLeaveMinutes: calcResult.earlyLeaveMinutes,
      overtimeMinutes: calcResult.overtimeMinutes,
      workDurationMinutes: calcResult.workDurationMinutes,
    };

    if (cardTimerRef.current) clearTimeout(cardTimerRef.current);

    // KONDISI 1: PERLU DI VERIFIKASI (ID benar tapi NIK salah atau sebaliknya)
    // Wajib tampilkan tombol konfirmasi ulang dan TIDAK boleh langsung tersubmit otomatis
    if (verificationStatus === 'NEEDS_VERIFICATION') {
      if (soundEnabled) playBeep('warning');

      setScanCardState({
        type: 'PENDING_CONFIRMATION',
        employee: matchedEmployee,
        posName: pName,
        deptName: dName,
        actionType,
        timeStr: nowTimeFull,
        dateStr: targetDate,
        statusText,
        verificationStatus: 'NEEDS_VERIFICATION',
        warningReason,
        pendingPayload: payload,
      });
    } 
    // KONDISI 2: TERVALIDASI PENUH (Auto Submit ON)
    else if (isAutoSubmit) {
      if (soundEnabled) playBeep('success');
      await db.attendance.put(payload);

      setScanCardState({
        type: 'SUCCESS',
        employee: matchedEmployee,
        posName: pName,
        deptName: dName,
        actionType,
        timeStr: nowTimeFull,
        dateStr: targetDate,
        statusText,
        verificationStatus: 'VERIFIED',
      });

      cardTimerRef.current = setTimeout(() => {
        setScanCardState(null);
        setManualCode('');
      }, 2000);
    } 
    // KONDISI 3: TERVALIDASI PENUH (Auto Submit OFF -> Tunggu Tombol Konfirmasi)
    else {
      if (soundEnabled) playBeep('success');
      setScanCardState({
        type: 'PENDING_CONFIRMATION',
        employee: matchedEmployee,
        posName: pName,
        deptName: dName,
        actionType,
        timeStr: nowTimeFull,
        dateStr: targetDate,
        statusText,
        verificationStatus: 'VERIFIED',
        pendingPayload: payload,
      });
    }

    isProcessingRef.current = false;
  }, [employees, filterDate, attendanceConfig, deptMap, posMap, soundEnabled, isAutoType, manualType, isAutoTime, manualTime, isAutoDate, manualDate, isAutoSubmit]);

  // Handle Manual Confirmation when pending validation exists
  const handleConfirmManualSubmit = async () => {
    if (!scanCardState || scanCardState.type !== 'PENDING_CONFIRMATION' || !scanCardState.pendingPayload) return;

    try {
      await db.attendance.put(scanCardState.pendingPayload);
      if (soundEnabled) playBeep('success');
    } catch (err) {
      console.error('Failed to confirm attendance:', err);
    } finally {
      setScanCardState(null);
      setManualCode('');
    }
  };

  // Auto detect input change or handle Enter key
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualCode(val);

    const clean = extractCleanCode(val);
    if (!clean) return;

    // Cek apakah input manual sudah cocok dengan ID atau NIK karyawan untuk instant detection
    if (clean.includes('/')) {
      const parts = clean.split('/');
      const p1 = parts[0]?.trim().toLowerCase();
      const p2 = parts[1]?.trim().toLowerCase();

      // Jika format dual memiliki isi pada kedua sisi
      if (p1 && p2 && p2.length >= 2) {
        const found = employees.some(
          emp =>
            (emp.employeeId && emp.employeeId.toLowerCase() === p1) ||
            (emp.nik && emp.nik.toLowerCase() === p1) ||
            (emp.nik && emp.nik.toLowerCase() === p2)
        );
        if (found) {
          processAttendanceScan(clean);
        }
      }
    } else {
      const lower = clean.toLowerCase();
      const matched = employees.some(
        emp =>
          (emp.employeeId && emp.employeeId.toLowerCase() === lower) ||
          (emp.nik && emp.nik.toLowerCase() === lower)
      );

      if (matched) {
        processAttendanceScan(clean);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (manualCode.trim()) {
        processAttendanceScan(manualCode.trim());
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-xl p-0 overflow-hidden"
    >
      <div className="flex flex-col h-full max-h-[90vh] bg-slate-50">
        {/* Header Modal - SPEC_MODAL */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Scan Presensi Karyawan
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Scan via kamera atau ketik/gunakan barcode scanner USB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
              }`}
              title={soundEnabled ? 'Suara Beep Aktif' : 'Suara Beep Senyap'}
              aria-label="Toggle Suara Beep"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button - SPEC_MODAL */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body - SPEC_MODAL */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* 3 WHITE CONFIG CARDS IN ONE ROW */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* CARD 1: IN / OUT */}
            <div className="p-2.5 sm:p-3 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-slate-700 truncate">In / Out</span>
                <MiniToggleSwitch
                  checked={isAutoType}
                  onChange={setIsAutoType}
                  title={isAutoType ? 'Auto: Deteksi Otomatis Status Presensi' : 'Manual: Pilih IN/OUT'}
                />
              </div>

              {isAutoType ? (
                <div className="flex items-center justify-center h-8 px-2 bg-slate-100/90 border border-slate-200/80 rounded-xl text-slate-700 text-xs font-normal">
                  <span>Auto</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl h-8 items-center">
                  <button
                    type="button"
                    onClick={() => setManualType('IN')}
                    className={`h-6 text-[10px] font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                      manualType === 'IN' 
                        ? 'bg-emerald-600 text-white shadow-2xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    IN
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualType('OUT')}
                    className={`h-6 text-[10px] font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                      manualType === 'OUT' 
                        ? 'bg-blue-600 text-white shadow-2xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    OUT
                  </button>
                </div>
              )}
            </div>

            {/* CARD 2: JAM */}
            <div className="p-2.5 sm:p-3 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-slate-700 truncate">Jam</span>
                <MiniToggleSwitch
                  checked={isAutoTime}
                  onChange={setIsAutoTime}
                  title={isAutoTime ? 'Auto: Gunakan Jam Realtime' : 'Manual: Set Jam'}
                />
              </div>

              {isAutoTime ? (
                <div className="flex items-center justify-center h-8 px-2 bg-slate-100/90 border border-slate-200/80 rounded-xl text-slate-700 text-xs font-normal">
                  <span>Auto</span>
                </div>
              ) : (
                <div className="relative flex items-center justify-center h-8 px-2 bg-white border border-slate-200/90 rounded-xl text-xs font-normal text-slate-900 cursor-pointer hover:border-blue-500 transition-all">
                  <span>{manualTime || formattedTimeShort}</span>
                  <input
                    type="time"
                    value={manualTime}
                    onChange={(e) => e.target.value && setManualTime(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* CARD 3: TANGGAL */}
            <div className="p-2.5 sm:p-3 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-slate-700 truncate">Tanggal</span>
                <MiniToggleSwitch
                  checked={isAutoDate}
                  onChange={setIsAutoDate}
                  title={isAutoDate ? 'Auto: Tanggal Hari Ini' : 'Manual: Set Tanggal'}
                />
              </div>

              {isAutoDate ? (
                <div className="flex items-center justify-center h-8 px-2 bg-slate-100/90 border border-slate-200/80 rounded-xl text-slate-700 text-xs font-normal">
                  <span>Auto</span>
                </div>
              ) : (
                <div className="relative flex items-center justify-center h-8 px-2 bg-white border border-slate-200/90 rounded-xl text-xs font-normal text-slate-900 cursor-pointer hover:border-blue-500 transition-all">
                  <span>{formatDateShortNumeric(manualDate || filterDate || todayStr)}</span>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => e.target.value && setManualDate(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* CAMERA SCANNER CARD & OVERLAY RESULT CARD */}
          <div className="relative w-full rounded-2xl overflow-hidden min-h-[220px]">
            <CameraScanner
              isOpen={isOpen}
              onScanSuccess={processAttendanceScan}
            />

            {/* SCAN CARD RESULT OVERLAY */}
            {scanCardState && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                {scanCardState.type === 'ERROR' ? (
                  /* RED CARD: Data Tidak Terdeteksi */
                  <div className="w-full h-full bg-red-600 flex items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200 shadow-md">
                    <span className="text-white text-base sm:text-lg font-bold tracking-wide">
                      Data Tidak Terdeteksi
                    </span>
                  </div>
                ) : (
                  /* WHITE CARD: Presensi Tervalidasi / Perlu Di Verifikasi */
                  <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6 text-center space-y-2.5 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                    {/* Badge */}
                    {scanCardState.verificationStatus === 'NEEDS_VERIFICATION' ? (
                      <div className="px-4 py-1 bg-amber-500 text-white font-bold text-xs rounded-full uppercase tracking-wider shadow-2xs">
                        Perlu Di Verifikasi
                      </div>
                    ) : (
                      <div className="px-4 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full uppercase tracking-wider shadow-2xs">
                        Presensi Tervalidasi
                      </div>
                    )}

                    <div className="space-y-1">
                      {/* Nama Terduga / Terdeteksi */}
                      <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                        {scanCardState.employee.fullName}
                      </h4>
                      {/* Posisi (kecil tipis) */}
                      <p className="text-xs font-light text-slate-500">
                        {scanCardState.posName}
                      </p>
                    </div>

                    {/* Keterangan Warning jika perlu verifikasi */}
                    {scanCardState.type === 'PENDING_CONFIRMATION' && scanCardState.warningReason && (
                      <div className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl max-w-xs">
                        {scanCardState.warningReason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MANUAL / HARDWARE USB SCANNER INPUT FORM */}
          <div className="w-full space-y-1.5 box-border">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-normal text-slate-600">
                ID Karyawan / NIK
              </label>
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] transition-colors ${isAutoSubmit ? 'text-blue-600 font-semibold' : 'text-slate-400 font-normal'}`}>
                  Auto Submit
                </span>
                <MiniToggleSwitch
                  checked={isAutoSubmit}
                  onChange={setIsAutoSubmit}
                  title={isAutoSubmit ? 'Auto Submit: Aktif (Otomatis Kirim Presensi)' : 'Auto Submit: Matikan (Memerlukan Konfirmasi)'}
                />
              </div>
            </div>
            <div className="relative w-full">
              <input
                ref={manualInputRef}
                type="text"
                value={manualCode}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder=""
                className="flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent box-border min-h-[36px] leading-5 font-mono"
              />
            </div>
          </div>
        </div>

        {/* STICKY FOOTER: KONFIRMASI BUTTON WHEN PENDING CONFIRMATION EXISTS (E.G. NEEDS_VERIFICATION OR AUTO-SUBMIT OFF) */}
        {scanCardState && scanCardState.type === 'PENDING_CONFIRMATION' && (
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 animate-in slide-in-from-bottom-2 duration-200">
            <button
              type="button"
              onClick={handleConfirmManualSubmit}
              className={`w-full h-10 sm:h-11 ${
                scanCardState.verificationStatus === 'NEEDS_VERIFICATION'
                  ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              } text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer`}
            >
              Konfirmasi
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
