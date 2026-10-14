import React, { useState } from 'react';
import { 
  Clock, 
  Layers, 
  PlusCircle, 
  Plus,
  Trash2, 
  Edit3, 
  X,
  CalendarDays,
  Users,
  Sparkles,
  ChevronDown,
  Check,
  MoreVertical,
  Info,
  ShieldCheck,
  Building2,
  Headphones,
  Stethoscope,
  BookmarkCheck,
  Bookmark,
  CalendarCheck2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Eye,
  Pencil,
  Download,
  Upload,
  FileSpreadsheet,
  UserCheck,
  UserPlus,
  UserX,
  Search,
  Filter,
  CheckSquare,
  Square,
  Copy,
  Users2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import { AttendanceConfig, WorkShift, ShiftPattern, SavedSchedulePattern, DepartmentScheduleAssignment, ShiftGroupAssignment, ShiftGroup } from '../../../types';
import { Button, Input, Select } from '../../../components/ui';
import { Modal } from '../../../components/ui/Modal';
import { EmployeeAvatar } from '../../../components/ui/EmployeeAvatar';
import { getPositionName } from '../../../services/positionService';
import { saveAttendanceConfig, getShiftBadgeClasses, getShiftBadgeStyle, FIVE_DEFAULT_SHIFTS } from '../../../services/attendanceConfigService';
import { 
  saveOrUpdateSchedulePattern, 
  activateSavedSchedulePattern, 
  deleteSavedSchedulePattern 
} from '../../../services/rosterService';
import { setSingleShiftSchedule } from '../../../services/shiftService';
import { PageHeaderTitle, DesktopHeaderActions, MobileHeaderActions, HideBottomNav } from '../../../context/MobileNavContext';
import { useScrollToTop } from '../../../components/layout/ScrollToTop';
import { ShiftGroupModal } from './modal-shift-group';
import { ModalShiftDetail } from './modal-shift-detail';
import { ModalShiftForm } from './modal-shift-form';
import { ModalPatternDetail } from './modal-pattern-detail';
import { ModalPatternForm } from './modal-pattern-form';
import { ModalImportSchedule } from './modal-import-schedule';
import { ModalSchedulePatternForm } from './modal-schedule-pattern-form';
import { ModalMemberSelector } from './modal-member-selector';
import { ModalSchedulePatternDetail } from './modal-schedule-pattern-detail';

const DAYS_OF_WEEK = [
  { key: 'senin', label: 'Senin' },
  { key: 'selasa', label: 'Selasa' },
  { key: 'rabu', label: 'Rabu' },
  { key: 'kamis', label: 'Kamis' },
  { key: 'jumat', label: 'Jumat' },
  { key: 'sabtu', label: 'Sabtu' },
  { key: 'minggu', label: 'Minggu' },
] as const;

interface Props {
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
  onBack?: () => void;
}

export function JadwalPengaturan({ activeConfig, availableShifts, onBack }: Props) {
  useScrollToTop();
  // Modal State - Shift Master
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [viewingShift, setViewingShift] = useState<WorkShift | null>(null);
  const [shiftFormData, setShiftFormData] = useState<Partial<WorkShift>>({});
  const [activeShiftMenuId, setActiveShiftMenuId] = useState<string | null>(null);

  // Modal State - Shift Pattern (Cycle)
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<ShiftPattern | null>(null);
  const [viewingPattern, setViewingPattern] = useState<ShiftPattern | null>(null);
  const [patternFormData, setPatternFormData] = useState<Partial<ShiftPattern>>({});
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [isPatternGuideOpen, setIsPatternGuideOpen] = useState(false);

  // Modal & Actions State - Pola Jadwal Tersimpan (Buat / Edit / Detail)
  const [isSchedulePatternModalOpen, setIsSchedulePatternModalOpen] = useState(false);
  const [editingSavedPatternId, setEditingSavedPatternId] = useState<string | null>(null);
  const [viewingSavedPattern, setViewingSavedPattern] = useState<SavedSchedulePattern | null>(null);
  const [patternScheduleName, setPatternScheduleName] = useState('');
  const [patternScheduleDesc, setPatternScheduleDesc] = useState('');
  const [patternScheduleIsActive, setPatternScheduleIsActive] = useState(true);
  const [patternActiveTab, setPatternActiveTab] = useState<'dept' | 'group'>('dept');
  const [modalDeptAssignments, setModalDeptAssignments] = useState<DepartmentScheduleAssignment[]>([]);
  const [modalGroupAssignments, setModalGroupAssignments] = useState<ShiftGroupAssignment[]>([]);

  // Modal & Actions State - Master Group
  const [isMasterGroupModalOpen, setIsMasterGroupModalOpen] = useState(false);
  const [editingMasterGroup, setEditingMasterGroup] = useState<ShiftGroup | null>(null);

  // State untuk Modal View Mode Group
  const [viewingGroup, setViewingGroup] = useState<ShiftGroup | null>(null);

  const [expandedPatterns, setExpandedPatterns] = useState<Record<string, boolean>>({});
  const [expandedGroupPatterns, setExpandedGroupPatterns] = useState<Record<string, boolean>>({});
  const [isBulkDateEnabled, setIsBulkDateEnabled] = useState(false);
  const [bulkDateValue, setBulkDateValue] = useState('');
  const [isSavingPattern, setIsSavingPattern] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // State untuk Modal Pemilih Anggota Karyawan dalam Group
  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);
  const [activeGroupIdForMembers, setActiveGroupIdForMembers] = useState<string | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberDeptFilter, setMemberDeptFilter] = useState('ALL');

  // State untuk Tab Modal Detail / View Pola Jadwal
  const [viewingDetailTab, setViewingDetailTab] = useState<'dept' | 'group'>('dept');

  // State & Data - Ekspor & Impor
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const employees = useLiveQuery(async () => {
    try {
      return await db.employees.toArray();
    } catch {
      return [];
    }
  }) || [];

  const shiftSchedules = useLiveQuery(async () => {
    try {
      return await db.shiftSchedules.toArray();
    } catch {
      return [];
    }
  }) || [];

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const headers = ['employeeId', 'employeeName', 'date', 'shiftCode', 'notes'];
    const sampleRows = [
      ['EMP-001', 'Ahmad Rizky', '2026-08-25', 'PAGI', 'NON SHIFT'],
      ['EMP-002', 'Budi Santoso', '2026-08-25', 'SIANG', 'Shift Siang'],
      ['EMP-003', 'Citra Dewi', '2026-08-25', 'OFF', 'Hari Libur']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...sampleRows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'template_import_jadwal_shift.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Roster Data to CSV
  const handleExportCSV = () => {
    if (shiftSchedules.length === 0) {
      alert('Belum ada data jadwal shift untuk diekspor.');
      return;
    }

    const empMap = new Map(employees.map(e => [e.id, e]));
    const headers = ['NIK', 'Nama Karyawan', 'Tanggal', 'ID Shift', 'Nama Shift', 'Jam Masuk', 'Jam Pulang', 'Catatan'];
    
    const rows = shiftSchedules.map(s => {
      const emp = empMap.get(s.employeeId);
      return [
        `"${emp?.employeeId || s.employeeId}"`,
        `"${emp?.fullName || ''}"`,
        `"${s.date}"`,
        `"${s.shiftId}"`,
        `"${s.shiftName || ''}"`,
        `"${s.startTime || ''}"`,
        `"${s.endTime || ''}"`,
        `"${s.notes || ''}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_jadwal_shift_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle File Upload for Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    setImportError(null);
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('Berkas kosong');

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) throw new Error('Format CSV tidak valid atau tidak memiliki baris data.');

        let successCount = 0;
        const empCodeMap = new Map(employees.map(emp => [emp.employeeId.toLowerCase(), emp.id]));

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 3) {
            const empCode = cols[0];
            const dateStr = cols[2];
            const shiftCode = cols[3] || 'PAGI';
            const notes = cols[4] || 'Import CSV';

            const empId = empCodeMap.get(empCode.toLowerCase());
            if (empId) {
              const shiftObj = availableShifts.find(s => s.code.toLowerCase() === shiftCode.toLowerCase() || s.id.toLowerCase() === shiftCode.toLowerCase());
              const shiftName = shiftCode === 'OFF' ? 'OFF' : (shiftObj?.name || shiftCode);
              
              await setSingleShiftSchedule(
                empId,
                dateStr,
                shiftObj?.id || shiftCode,
                shiftName,
                shiftObj?.startTime,
                shiftObj?.endTime,
                notes
              );
              successCount++;
            }
          }
        }

        setImportStatus(`Berhasil mengimpor ${successCount} baris jadwal shift!`);
      } catch (err: any) {
        setImportError(err.message || 'Gagal memproses berkas CSV.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const departments = useLiveQuery(async () => {
    try {
      return await db.departments.toArray();
    } catch {
      return [];
    }
  }) || [];

  const handleSaveNormalHoursConfig = async (key: keyof AttendanceConfig, val: any) => {
    if (!activeConfig) return;
    const updated = { ...activeConfig, [key]: val };
    await saveAttendanceConfig(updated);
  };

  const handleSaveConfig = async (newCfg: AttendanceConfig) => {
    await saveAttendanceConfig(newCfg);
  };

  const getDayScheduleConfig = (config: AttendanceConfig | null, dayKey: string) => {
    const custom = config?.normalDailySchedules?.[dayKey];
    if (custom) return custom;

    const workDays = config?.normalWorkDays ?? 5;
    const isDefaultActive = dayKey === 'sabtu' ? workDays === 6 : dayKey !== 'minggu';

    return {
      active: isDefaultActive,
      startTime: config?.normalStartTime || '08:00',
      endTime: config?.normalEndTime || '17:00',
      breakStartTime: config?.normalBreakStartTime || '12:00',
      breakEndTime: config?.normalBreakEndTime || '13:00',
    };
  };

  const handleToggleDayActive = async (dayKey: string) => {
    if (!activeConfig) return;
    const currentSchedules = { ...activeConfig.normalDailySchedules };

    DAYS_OF_WEEK.forEach(d => {
      if (!currentSchedules[d.key]) {
        currentSchedules[d.key] = getDayScheduleConfig(activeConfig, d.key);
      }
    });

    const targetDay = currentSchedules[dayKey];
    currentSchedules[dayKey] = {
      ...targetDay,
      active: !targetDay.active,
    };

    const activeDaysCount = DAYS_OF_WEEK.filter(d => currentSchedules[d.key]?.active).length;

    const updatedConfig: AttendanceConfig = {
      ...activeConfig,
      normalWorkDays: activeDaysCount,
      normalDailySchedules: currentSchedules,
    };

    await handleSaveConfig(updatedConfig);
  };

  const handleUpdateDayTime = async (
    dayKey: string, 
    field: 'startTime' | 'endTime' | 'breakStartTime' | 'breakEndTime', 
    value: string
  ) => {
    if (!activeConfig) return;
    const currentSchedules = { ...activeConfig.normalDailySchedules };

    DAYS_OF_WEEK.forEach(d => {
      if (!currentSchedules[d.key]) {
        currentSchedules[d.key] = getDayScheduleConfig(activeConfig, d.key);
      }
    });

    currentSchedules[dayKey] = {
      ...currentSchedules[dayKey],
      [field]: value,
    };

    const updatedConfig: AttendanceConfig = {
      ...activeConfig,
      normalDailySchedules: currentSchedules,
    };

    await handleSaveConfig(updatedConfig);
  };

  // Master Shift CRUD
  const openShiftModal = (shift?: WorkShift) => {
    setEditingShift(shift || null);
    setShiftFormData(shift || {
      code: `SH-${(activeConfig?.shifts?.length || 0) + 1}`,
      name: '', 
      startTime: '08:00', 
      endTime: '16:00',
      breakStartTime: '12:00', 
      breakEndTime: '13:00',
      color: '#2563EB',
    });
    setIsShiftModalOpen(true);
  };

  const saveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfig) return;

    // Automatic calculation of crossDay (Shift Lintas Hari): if endTime < startTime
    const startTime = shiftFormData.startTime || '00:00';
    const endTime = shiftFormData.endTime || '00:00';
    const autoCrossDay = Boolean(startTime && endTime && endTime < startTime);

    const shiftDataToSave: WorkShift = {
      id: editingShift ? editingShift.id : uuidv4(),
      code: shiftFormData.code || `SH-${(activeConfig?.shifts?.length || 0) + 1}`,
      name: shiftFormData.name || '',
      startTime: startTime,
      endTime: endTime,
      breakStartTime: shiftFormData.breakStartTime || '',
      breakEndTime: shiftFormData.breakEndTime || '',
      crossDay: autoCrossDay,
      color: shiftFormData.color || '#2563EB',
      isOff: false,
    };

    const baseShifts = activeConfig.shifts && activeConfig.shifts.length > 0 ? activeConfig.shifts : availableShifts;
    let updatedShifts = [...baseShifts];
    if (editingShift) {
      updatedShifts = updatedShifts.map(s => s.id === editingShift.id ? shiftDataToSave : s);
    } else {
      updatedShifts.push(shiftDataToSave);
    }
    const newConfig = { ...activeConfig, shifts: updatedShifts };
    await handleSaveConfig(newConfig);
    setIsShiftModalOpen(false);
  };

  const deleteShift = async (id: string) => {
    if (!activeConfig) return;
    if (!confirm('Hapus shift master ini?')) return;
    const baseShifts = activeConfig.shifts && activeConfig.shifts.length > 0 ? activeConfig.shifts : availableShifts;
    const newConfig = { ...activeConfig, shifts: baseShifts.filter(s => s.id !== id) };
    await handleSaveConfig(newConfig);
  };

  // Shift Pattern (Cycle) CRUD
  const openPatternModal = (pattern?: ShiftPattern) => {
    setEditingPattern(pattern || null);
    setPatternFormData(pattern ? { ...pattern, cycle: [...(pattern.cycle || [])] } : { name: '', cycle: [] });
    setSelectedTemplateId('');
    setIsTemplateDropdownOpen(false);
    setIsPatternGuideOpen(false);
    setIsPatternModalOpen(true);
  };

  // All non-OFF shifts available for creating rotation / schedule patterns
  const nonOffShifts = (activeConfig?.shifts || availableShifts).filter(s => 
    !s.isOff && s.code?.toUpperCase() !== 'OFF' && s.id !== 'shift-off' && !s.name?.toLowerCase().includes('libur')
  );

  const pagiShift = nonOffShifts.find(s => 
    s.code?.toUpperCase() === 'PAGI' || 
    s.code?.toUpperCase() === 'P' || 
    s.name?.toUpperCase().includes('PAGI')
  );

  const siangShift = nonOffShifts.find(s => 
    s.code?.toUpperCase() === 'SIANG' || 
    s.code?.toUpperCase() === 'S' || 
    s.code?.toUpperCase() === 'SORE' || 
    s.name?.toUpperCase().includes('SIANG') ||
    s.name?.toUpperCase().includes('SORE')
  );

  const malamShift = nonOffShifts.find(s => 
    s.code?.toUpperCase() === 'MALAM' || 
    s.code?.toUpperCase() === 'M' || 
    s.name?.toUpperCase().includes('MALAM')
  );

  const regularShift = nonOffShifts.find(s => 
    s.code?.toUpperCase().includes('REG') || 
    s.name?.toUpperCase().includes('REGULER') ||
    s.name?.toUpperCase().includes('REGULAR') ||
    s.name?.toUpperCase().includes('KANTOR')
  ) || nonOffShifts[0];

  const hasPagiSiangMalam = Boolean(pagiShift && siangShift && malamShift);

  // Template options for rotation & office patterns
  const rotationTemplates = React.useMemo(() => {
    const regId = regularShift?.id || nonOffShifts[0]?.id;
    const off = 'OFF';
    const templates: Array<{
      id: string;
      group: string;
      name: string;
      label: string;
      days: number;
      description: string;
      cycle: string[];
    }> = [];

    // Template 1 & 2: Pola Jam Kerja Kantor (Non-Shift Standar)
    if (regId) {
      templates.push(
        {
          id: 'office-5-2',
          group: 'Pola Jam Kantor (Non-Shift)',
          name: 'Pola Jam Kantor 5 Hari (Senin - Jumat)',
          label: 'Kantor 5 Hari Kerja (5 Kerja + 2 Libur)',
          days: 7,
          description: '5 hari kerja kantor normal (Senin-Jumat) diikuti 2 hari libur akhir pekan (Sabtu-Minggu)',
          cycle: [regId, regId, regId, regId, regId, off, off]
        },
        {
          id: 'office-6-1',
          group: 'Pola Jam Kantor (Non-Shift)',
          name: 'Pola Jam Kantor 6 Hari (Senin - Sabtu)',
          label: 'Kantor 6 Hari Kerja (6 Kerja + 1 Libur)',
          days: 7,
          description: '6 hari kerja kantor normal (Senin-Sabtu) diikuti 1 hari libur akhir pekan (Minggu)',
          cycle: [regId, regId, regId, regId, regId, regId, off]
        }
      );
    }

    // Template 3+: Pola Operasional Rotasi Shift
    if (hasPagiSiangMalam && pagiShift && siangShift && malamShift) {
      const p = pagiShift.id;
      const s = siangShift.id;
      const m = malamShift.id;

      templates.push(
        {
          id: '4-regu-3-shift',
          group: 'Mekanisme Operasional 24 Jam',
          name: 'Pola 4 Regu 3 Shift (2P-2S-2M-2OFF)',
          label: '4 Regu 3 Shift Standar (8 Hari)',
          days: 8,
          description: '2 Pagi, 2 Siang, 2 Malam, 2 Libur (Siklus rotasi 8 hari standar industri 24 jam)',
          cycle: [p, p, s, s, m, m, off, off]
        },
        {
          id: '2-shift-1-off',
          group: 'Mekanisme Operasional 2 Shift',
          name: 'Pola Rotasi 2 Shift 1 Off (2P-2S-1OFF)',
          label: 'Rotasi 2 Shift (5 Hari)',
          days: 5,
          description: '2 Pagi, 2 Siang, 1 Libur (Siklus 5 hari untuk Helpdesk / Support)',
          cycle: [p, p, s, s, off]
        },
        {
          id: '3-1-cepat',
          group: 'Mekanisme 3 Hari Kerja',
          name: 'Pola Rotasi Cepat 3-1',
          label: 'Rotasi Cepat (Pagi, Siang, Malam, Libur)',
          days: 4,
          description: '3 hari kerja bergantian (P-S-M) diikuti 1 hari libur (Siklus 4 hari)',
          cycle: [p, s, m, off]
        },
        {
          id: '3-1-blok',
          group: 'Mekanisme 3 Hari Kerja',
          name: 'Pola Rotasi Blok 3-1',
          label: 'Rotasi Blok 3 Hari (3P-Off, 3S-Off, 3M-Off)',
          days: 12,
          description: '3 Pagi + 1 Libur, 3 Siang + 1 Libur, 3 Malam + 1 Libur (Siklus 12 hari)',
          cycle: [p, p, p, off, s, s, s, off, m, m, m, off]
        },
        {
          id: '6-1-ganti',
          group: 'Mekanisme 6 Hari Kerja',
          name: 'Pola Rotasi Bergantian 6-1',
          label: 'Rotasi Bergantian (P-S-M-P-S-M, Libur)',
          days: 7,
          description: '6 hari kerja rolling (P-S-M-P-S-M) diikuti 1 hari libur (Siklus 7 hari)',
          cycle: [p, s, m, p, s, m, off]
        },
        {
          id: '6-1-blok',
          group: 'Mekanisme 6 Hari Kerja',
          name: 'Pola Rotasi Blok Mingguan 6-1',
          label: 'Rotasi Blok Mingguan (6P-Off, 6S-Off, 6M-Off)',
          days: 21,
          description: '6 Pagi + 1 Libur, 6 Siang + 1 Libur, 6 Malam + 1 Libur (Siklus 21 hari)',
          cycle: [
            p, p, p, p, p, p, off,
            s, s, s, s, s, s, off,
            m, m, m, m, m, m, off
          ]
        },
        {
          id: '5-2-ganti',
          group: 'Mekanisme 5 Hari Kerja',
          name: 'Pola Rotasi Bergantian Berkelanjutan 5-2',
          label: 'Rotasi Bergantian Berkelanjutan (5 Kerja, 2 Libur)',
          days: 21,
          description: '5 hari rolling kerja, 2 libur, lalu berlanjut dari shift terakhir (Siklus 21 hari)',
          cycle: [
            p, s, m, p, s, off, off,
            m, p, s, m, p, off, off,
            s, m, p, s, m, off, off
          ]
        },
        {
          id: '5-2-blok',
          group: 'Mekanisme 5 Hari Kerja',
          name: 'Pola Rotasi Blok Mingguan 5-2',
          label: 'Rotasi Blok Mingguan (5P-2Off, 5S-2Off, 5M-2Off)',
          days: 21,
          description: '5 Pagi + 2 Libur, 5 Siang + 2 Libur, 5 Malam + 2 Libur (Siklus 21 hari)',
          cycle: [
            p, p, p, p, p, off, off,
            s, s, s, s, s, off, off,
            m, m, m, m, m, off, off
          ]
        }
      );
    }

    return templates;
  }, [hasPagiSiangMalam, pagiShift, siangShift, malamShift, regularShift, nonOffShifts]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleApplyTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    if (!tmplId) return;
    const tmpl = rotationTemplates.find(t => t.id === tmplId);
    if (tmpl) {
      setPatternFormData(prev => ({
        ...prev,
        name: prev.name && prev.name !== '' && !rotationTemplates.some(t => t.name === prev.name) ? prev.name : tmpl.name,
        cycle: [...tmpl.cycle]
      }));
    }
  };

  const savePattern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfig) return;
    let updated = [...(activeConfig.shiftPatterns || [])];
    if (editingPattern) {
      updated = updated.map(p => p.id === editingPattern.id ? { ...patternFormData, id: editingPattern.id } as ShiftPattern : p);
    } else {
      updated.push({ ...patternFormData, id: uuidv4() } as ShiftPattern);
    }
    const newConfig = { ...activeConfig, shiftPatterns: updated };
    await handleSaveConfig(newConfig);
    setIsPatternModalOpen(false);
  };

  const deletePattern = async (id: string) => {
    if (!activeConfig) return;
    if (!confirm('Hapus pola roster ini?')) return;
    const newConfig = { ...activeConfig, shiftPatterns: (activeConfig.shiftPatterns || []).filter(p => p.id !== id) };
    await handleSaveConfig(newConfig);
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastNotification({ text, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

  
  const handleOpenCreateSchedulePattern = () => {
    setIsBulkDateEnabled(false);
    setBulkDateValue('');
    setEditingSavedPatternId(null);
    setPatternScheduleName('');
    setPatternScheduleDesc('');
    setPatternScheduleIsActive(true);
    setModalDeptAssignments([]);
    setModalGroupAssignments([]);
    setPatternActiveTab('dept');
    setIsSchedulePatternModalOpen(true);
  };

  const handleOpenEditSchedulePattern = (saved: SavedSchedulePattern) => {
    const todayIso = new Date().toISOString().split('T')[0];
    const availablePatterns = activeConfig?.shiftPatterns || [];
    const defaultPatternId = availablePatterns[0]?.id || '';
    
    const loadedDeptAssignments: DepartmentScheduleAssignment[] = (saved.departmentAssignments || []).map(existing => {
      const isExistingValid = existing.shiftPatternId && availablePatterns.some(p => p.id === existing.shiftPatternId);
      return {
        departmentId: existing.departmentId,
        mode: 'shift',
        shiftPatternId: isExistingValid ? existing.shiftPatternId : defaultPatternId,
        anchorDate: existing.anchorDate || todayIso
      };
    });

    const loadedGroupAssignments: ShiftGroupAssignment[] = (saved.groupAssignments || []).map(existing => {
      const g = (activeConfig?.shiftGroups || []).find(x => x.id === existing.id);
      const isExistingValid = existing.shiftPatternId && availablePatterns.some(p => p.id === existing.shiftPatternId);
      return {
        id: existing.id,
        name: existing.name || g?.name || 'Group',
        employeeIds: existing.employeeIds || g?.employeeIds || [],
        shiftPatternId: isExistingValid ? existing.shiftPatternId : defaultPatternId,
        anchorDate: existing.anchorDate || todayIso,
        description: existing.description || g?.description || '',
        color: existing.color || g?.color || '#2563EB'
      };
    });

    // Cek apakah semua departemen memiliki tanggal mulai yang sama
    const existingDates = loadedDeptAssignments.map(a => a.anchorDate).filter(Boolean);
    const allSameDate = existingDates.length > 0 && 
      loadedDeptAssignments.length > 0 && 
      existingDates.every(d => d === existingDates[0]);
      
    if (allSameDate) {
      setIsBulkDateEnabled(true);
      setBulkDateValue(existingDates[0]);
    } else {
      setIsBulkDateEnabled(false);
      setBulkDateValue('');
    }

    setEditingSavedPatternId(saved.id);
    setPatternScheduleName(saved.name);
    setPatternScheduleDesc(saved.description || '');
    setPatternScheduleIsActive(true);
    setModalDeptAssignments(loadedDeptAssignments);
    setModalGroupAssignments(loadedGroupAssignments);
    setPatternActiveTab(loadedGroupAssignments.length > 0 && loadedDeptAssignments.length === 0 ? 'group' : 'dept');
    setIsSchedulePatternModalOpen(true);
  };

  const handleModalAddDeptAssignment = (deptId: string) => {
    if (!deptId) return;
    if (modalDeptAssignments.some(d => d.departmentId === deptId)) return;
    const todayIso = bulkDateValue || new Date().toISOString().split('T')[0];
    const defaultPatternId = activeConfig?.shiftPatterns?.[0]?.id || '';
    setModalDeptAssignments(prev => [
      ...prev,
      {
        departmentId: deptId,
        mode: 'shift',
        shiftPatternId: defaultPatternId,
        anchorDate: todayIso
      }
    ]);
  };

  const handleModalRemoveDeptAssignment = (deptId: string) => {
    setModalDeptAssignments(prev => prev.filter(d => d.departmentId !== deptId));
  };

  const handleModalAddAllDepts = () => {
    const todayIso = bulkDateValue || new Date().toISOString().split('T')[0];
    const defaultPatternId = activeConfig?.shiftPatterns?.[0]?.id || '';
    const existingDeptIds = new Set(modalDeptAssignments.map(d => d.departmentId));
    const newAssignments = departments
      .filter(d => !existingDeptIds.has(d.id))
      .map(d => ({
        departmentId: d.id,
        mode: 'shift' as const,
        shiftPatternId: defaultPatternId,
        anchorDate: todayIso
      }));
    setModalDeptAssignments(prev => [...prev, ...newAssignments]);
  };

  const handleModalAddGroupAssignment = (groupId: string) => {
    if (!groupId) return;
    if (modalGroupAssignments.some(g => g.id === groupId)) return;
    const targetGroup = (activeConfig?.shiftGroups || []).find(g => g.id === groupId);
    if (!targetGroup) return;
    const todayIso = bulkDateValue || new Date().toISOString().split('T')[0];
    const defaultPatternId = activeConfig?.shiftPatterns?.[0]?.id || '';
    setModalGroupAssignments(prev => [
      ...prev,
      {
        id: targetGroup.id,
        name: targetGroup.name,
        employeeIds: [...targetGroup.employeeIds],
        shiftPatternId: defaultPatternId,
        anchorDate: todayIso,
        description: targetGroup.description,
        color: targetGroup.color || '#2563EB',
      }
    ]);
  };

  const handleModalRemoveGroupAssignment = (groupId: string) => {
    setModalGroupAssignments(prev => prev.filter(g => g.id !== groupId));
  };

  const handleModalAddAllGroups = () => {
    const todayIso = bulkDateValue || new Date().toISOString().split('T')[0];
    const defaultPatternId = activeConfig?.shiftPatterns?.[0]?.id || '';
    const existingGroupIds = new Set(modalGroupAssignments.map(g => g.id));
    const newGroups = (activeConfig?.shiftGroups || [])
      .filter(g => !existingGroupIds.has(g.id))
      .map(g => ({
        id: g.id,
        name: g.name,
        employeeIds: [...g.employeeIds],
        shiftPatternId: defaultPatternId,
        anchorDate: todayIso,
        description: g.description,
        color: g.color || '#2563EB',
      }));
    setModalGroupAssignments(prev => [...prev, ...newGroups]);
  };

  const handleModalUpdateDeptAssignment = (deptId: string, field: 'shiftPatternId' | 'anchorDate', val: string) => {
    setModalDeptAssignments(prev => {
      return prev.map(item => {
        if (item.departmentId === deptId) {
          return {
            ...item,
            [field]: val,
            mode: 'shift'
          };
        }
        return item;
      });
    });
  };

  
  // --- Handlers untuk Master Group (ShiftGroupModal) ---
  const handleOpenCreateMasterGroup = () => {
    setEditingMasterGroup(null);
    setIsMasterGroupModalOpen(true);
  };

  const handleOpenEditMasterGroup = (group: ShiftGroup) => {
    setEditingMasterGroup(group);
    setIsMasterGroupModalOpen(true);
  };

  const handleSaveGroupModal = async (groupData: { id?: string; name: string; description: string; employeeIds: string[]; color?: string }) => {
    if (!activeConfig) return;
    const newGroups = [...(activeConfig.shiftGroups || [])];
    
    if (groupData.id) {
      const idx = newGroups.findIndex(g => g.id === groupData.id);
      if (idx !== -1) {
        newGroups[idx] = {
          id: groupData.id,
          name: groupData.name,
          description: groupData.description,
          employeeIds: groupData.employeeIds,
          color: groupData.color || '#2563EB',
        };
      }
    } else {
      newGroups.push({
        id: `grp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: groupData.name,
        description: groupData.description,
        employeeIds: groupData.employeeIds,
        color: groupData.color || '#2563EB',
      });
    }

    await saveAttendanceConfig({ ...activeConfig, shiftGroups: newGroups });
    showToast(groupData.id ? `Group "${groupData.name}" berhasil diperbarui.` : `Group "${groupData.name}" berhasil dibuat.`, 'success');
  };

  const handleDeleteMasterGroup = async (groupId: string) => {
    if (!activeConfig) return;
    const group = activeConfig.shiftGroups?.find(g => g.id === groupId);
    if (!group) return;
    
    if (confirm(`Apakah Anda yakin ingin menghapus Master Group "${group.name}"?`)) {
      try {
        const newGroups = (activeConfig.shiftGroups || []).filter(g => g.id !== groupId);
        await saveAttendanceConfig({ ...activeConfig, shiftGroups: newGroups });
        showToast(`Group "${group.name}" berhasil dihapus.`, 'info');
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus group.');
      }
    }
  };

  const handleModalBulkAnchorDate = (dateVal: string) => {
    if (!dateVal) return;
    setModalDeptAssignments(prev => prev.map(item => ({ ...item, anchorDate: dateVal })));
  };

  // Handlers untuk Group Bagian / Regu Shift

  // Handlers untuk Group Bagian / Regu Shift
  const handleAddNewGroup = () => {
    const defaultPatternId = activeConfig?.shiftPatterns?.[0]?.id || '';
    const todayIso = new Date().toISOString().split('T')[0];
    const groupCount = modalGroupAssignments.length;
    const letter = String.fromCharCode(65 + (groupCount % 26));

    const newGroup: ShiftGroupAssignment = {
      id: `grp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `Regu ${letter} - Produksi / Bagian ${groupCount + 1}`,
      employeeIds: [],
      shiftPatternId: defaultPatternId,
      anchorDate: todayIso,
      description: ''
    };

    setModalGroupAssignments(prev => [...prev, newGroup]);
    showToast(`Group "${newGroup.name}" ditambahkan. Silakan pilih karyawan anggotanya.`, 'info');
  };

  const handleUpdateGroup = (groupId: string, field: keyof ShiftGroupAssignment, value: any) => {
    setModalGroupAssignments(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, [field]: value };
      }
      return g;
    }));
  };

  const handleDeleteGroup = (groupId: string) => {
    const grp = modalGroupAssignments.find(g => g.id === groupId);
    if (!grp) return;
    setModalGroupAssignments(prev => prev.filter(g => g.id !== groupId));
    showToast(`Group "${grp.name}" telah dihapus.`, 'info');
  };

  const handleDuplicateGroup = (group: ShiftGroupAssignment) => {
    const newGroup: ShiftGroupAssignment = {
      ...group,
      id: `grp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${group.name} (Salinan)`,
      employeeIds: [...group.employeeIds]
    };
    setModalGroupAssignments(prev => [...prev, newGroup]);
    showToast(`Group "${newGroup.name}" berhasil diduplikasi.`, 'success');
  };

  const handleOpenMemberSelector = (groupId: string) => {
    setActiveGroupIdForMembers(groupId);
    setMemberSearchQuery('');
    setMemberDeptFilter('ALL');
    setIsMemberSelectorOpen(true);
  };

  
  const handleToggleEmployeeInGroup = (empId: string) => {
    if (!activeGroupIdForMembers) return;

    setModalGroupAssignments(prev => prev.map(g => {
      if (g.id === activeGroupIdForMembers) {
        const isSelected = g.employeeIds.includes(empId);
        const newEmployeeIds = isSelected 
          ? g.employeeIds.filter(id => id !== empId)
          : [...g.employeeIds, empId];
        return { ...g, employeeIds: newEmployeeIds };
      }
      return g;
    }));
  };

  const handleBulkToggleFilteredEmployees = (filteredEmpIds: string[], selectAll: boolean) => {
    if (!activeGroupIdForMembers) return;

    setModalGroupAssignments(prev => prev.map(g => {
      if (g.id === activeGroupIdForMembers) {
        let newIds = [...g.employeeIds];
        if (selectAll) {
          filteredEmpIds.forEach(id => {
            if (!newIds.includes(id)) newIds.push(id);
          });
        } else {
          newIds = newIds.filter(id => !filteredEmpIds.includes(id));
        }
        return { ...g, employeeIds: newIds };
      }
      return g;
    }));
  };

  const handleRemoveMemberDirect = (groupId: string, empId: string) => {
    setModalGroupAssignments(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, employeeIds: g.employeeIds.filter(id => id !== empId) };
      }
      return g;
    }));
  };

  const handleSaveSchedulePattern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfig || !patternScheduleName.trim()) return;

    try {
      setIsSavingPattern(true);
      await saveOrUpdateSchedulePattern(activeConfig, {
        id: editingSavedPatternId || undefined,
        name: patternScheduleName,
        description: patternScheduleDesc,
        departmentAssignments: modalDeptAssignments,
        groupAssignments: modalGroupAssignments,
        makeActive: true
      });
      setIsSchedulePatternModalOpen(false);
      showToast(
        editingSavedPatternId 
          ? `Pola Jadwal "${patternScheduleName}" berhasil diperbarui!` 
          : `Pola Jadwal "${patternScheduleName}" berhasil disimpan dan aktif diterapkan!`,
        'success'
      );
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan Pola Jadwal.');
    } finally {
      setIsSavingPattern(false);
    }
  };

  const handleActivateSavedPattern = async (saved: SavedSchedulePattern) => {
    if (!activeConfig) return;
    try {
      await activateSavedSchedulePattern(activeConfig, saved.id);
      showToast(`Pola "${saved.name}" kini aktif diterapkan pada jadwal sistem.`, 'success');
    } catch (err) {
      console.error(err);
      alert('Gagal mengaktifkan pola.');
    }
  };

  const handleDeleteSavedPattern = async (saved: SavedSchedulePattern) => {
    if (!activeConfig) return;
    if (confirm(`Apakah Anda yakin ingin menghapus Pola Jadwal Tersimpan "${saved.name}"?`)) {
      try {
        await deleteSavedSchedulePattern(activeConfig, saved.id);
        showToast(`Pola Jadwal "${saved.name}" berhasil dihapus.`, 'info');
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus pola.');
      }
    }
  };

  const formatIndoDate = (isoStr?: string) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  const systemType = activeConfig?.systemType || 'normal';
  const showNormalHours = systemType === 'normal';
  const showShiftSettings = systemType === 'shift' || systemType === 'mixed';

  // Count configured departments with shift pattern and anchor date
  const configuredShiftDeptsCount = (activeConfig?.departmentAssignments || []).filter(
    d => d.mode === 'shift' || (d.shiftPatternId && d.anchorDate)
  ).length;

  const savedPatternsList = activeConfig?.savedSchedulePatterns || [];

  return (
    <div className="space-y-6">
      <HideBottomNav />
      {/* Top Header Title with Back Action */}
      <PageHeaderTitle 
        title="Pengaturan Jadwal" 
        subtitle="Konfigurasi Jam Kerja & Shift" 
        onBack={onBack} 
        hideHamburger={true} 
      />

      {/* 0. SELEKSI MODEL KERJA UTAMA */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          Model Kerja Utama
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'normal', title: 'Non Shift' },
            { id: 'shift', title: 'Shift' }
          ].map(m => {
            const isSelected = systemType === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={async () => {
                  if (!activeConfig) return;
                  let currentShifts = [...(activeConfig.shifts || [])];
                  if (m.id === 'shift') {
                    // Ensure all 5 default shifts exist (NON SHIFT, Pagi, Siang, Malam, Off)
                    const hasReguler = currentShifts.some(s => s.code === 'REGULER' || s.id === 'shift-reguler');
                    const hasPagi = currentShifts.some(s => s.code === 'PAGI' || s.id === 'shift-1-pagi');
                    const hasSiang = currentShifts.some(s => s.code === 'SIANG' || s.id === 'shift-2-siang');
                    const hasMalam = currentShifts.some(s => s.code === 'MALAM' || s.id === 'shift-3-malam');
                    const hasOff = currentShifts.some(s => s.code === 'OFF' || s.id === 'shift-off' || s.isOff);

                    if (!hasReguler) currentShifts.unshift(FIVE_DEFAULT_SHIFTS[0]);
                    if (!hasPagi) currentShifts.push(FIVE_DEFAULT_SHIFTS[1]);
                    if (!hasSiang) currentShifts.push(FIVE_DEFAULT_SHIFTS[2]);
                    if (!hasMalam) currentShifts.push(FIVE_DEFAULT_SHIFTS[3]);
                    if (!hasOff) currentShifts.push(FIVE_DEFAULT_SHIFTS[4]);
                  }
                  await handleSaveConfig({ ...activeConfig, systemType: m.id as any, shifts: currentShifts });
                }}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Pengaturan Jam Kerja NON SHIFT / Normal (Office) */}
      {showNormalHours && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              Pengaturan Jam Kerja
            </h3>
          </div>

          <div className="space-y-2.5">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = getDayScheduleConfig(activeConfig, day.key);
              const isDayActive = daySchedule.active;

              return (
                <div
                  key={day.key}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs transition-all"
                >
                  {/* Baris Atas: Nama Hari (Kiri) & Seekbar (Kanan) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${isDayActive ? 'bg-blue-600' : 'bg-rose-500'}`} />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {day.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {!isDayActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-500 text-white border border-rose-600/20 tracking-wide">
                          OFF DAY
                        </span>
                      )}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isDayActive}
                        onClick={() => handleToggleDayActive(day.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isDayActive ? 'bg-blue-600' : 'bg-rose-500'
                        }`}
                        title={isDayActive ? `Nonaktifkan ${day.label}` : `Aktifkan ${day.label}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isDayActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Baris Bawah (Jika Aktif): Teks Label & 4 Kolom Jam */}
                  {isDayActive && (
                    <div className="mt-3.5 space-y-1.5">
                      {/* Label Teks di Atas Kelompok Card Jam */}
                      <div className="grid grid-cols-2 gap-3 px-0.5 text-[11px] font-semibold text-slate-500">
                        <span>Jam Masuk & Pulang Kerja</span>
                        <span>Jam Istirahat & Selesai</span>
                      </div>

                      {/* 4 Kolom Input Jam */}
                      <div className="flex items-center gap-1.5 sm:gap-2.5 w-full">
                        {/* Jam Masuk Kerja */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.startTime || '08:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.startTime || '08:00'}
                            onChange={(e) => handleUpdateDayTime(day.key, 'startTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>

                        <span className="text-slate-400 font-bold shrink-0 text-xs sm:text-sm">-</span>

                        {/* Jam Pulang Kerja */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.endTime || '17:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.endTime || '17:00'}
                            onChange={(e) => handleUpdateDayTime(day.key, 'endTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>

                        <div className="w-1 sm:w-2 shrink-0" />

                        {/* Jam Mulai Istirahat */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.breakStartTime || activeConfig?.normalBreakStartTime || '12:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.breakStartTime || activeConfig?.normalBreakStartTime || '12:00'}
                            onChange={(e) => handleUpdateDayTime(day.key, 'breakStartTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>

                        <span className="text-slate-400 font-bold shrink-0 text-xs sm:text-sm">-</span>

                        {/* Jam Selesai Istirahat */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.breakEndTime || activeConfig?.normalBreakEndTime || '13:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.breakEndTime || activeConfig?.normalBreakEndTime || '13:00'}
                            onChange={(e) => handleUpdateDayTime(day.key, 'breakEndTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Master Shift Operasional Card List */}
      {showShiftSettings && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 shrink-0" />
              Master Shift Operasional
            </h3>
            <button 
              onClick={() => openShiftModal()} 
              title="Tambah Shift" 
              className="p-0 border-none bg-transparent hover:opacity-80 transition-all cursor-pointer outline-none focus:outline-none"
            >
              <PlusCircle className="w-6 h-6 fill-blue-600 text-white shrink-0" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nonOffShifts.length === 0 ? (
              <div className="col-span-full text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500">Belum ada master shift operasional yang dibuat.</p>
              </div>
            ) : (
              nonOffShifts.map((shift) => (
                <div 
                  key={shift.id} 
                  onClick={() => setViewingShift(shift)}
                  className="relative group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-slate-400 font-normal leading-tight">Nama Shift</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors mt-0.5">
                        {shift.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span 
                        style={getShiftBadgeStyle(shift.color)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 ${getShiftBadgeClasses(shift.color)}`}
                      >
                        {shift.code}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>

                  {/* 2 Card Terpisah: Jam Kerja & Jam Istirahat (Hanya untuk shift kerja, disembunyikan untuk OFF/Libur) */}
                  {!shift.isOff && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col items-center justify-center text-center min-w-0">
                        <span className="block text-[10px] text-slate-400 font-normal leading-tight">Jam Kerja</span>
                        <span className="block text-xs font-bold text-slate-800 truncate mt-0.5 w-full">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>

                      <div className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col items-center justify-center text-center min-w-0">
                        <span className="block text-[10px] text-slate-400 font-normal leading-tight">Jam Istirahat</span>
                        <span className="block text-xs font-bold text-slate-800 truncate mt-0.5 w-full">
                          {shift.breakStartTime ? `${shift.breakStartTime} - ${shift.breakEndTime}` : '-'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Pola Rotasi Shift (Cycle Roster) Master */}
      {showShiftSettings && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600 shrink-0" />
              Pola Rotasi Shift
            </h3>
            <button 
              onClick={() => openPatternModal()} 
              title="Buat Master Pola" 
              className="p-0 border-none bg-transparent hover:opacity-80 transition-all cursor-pointer outline-none focus:outline-none"
            >
              <PlusCircle className="w-6 h-6 fill-blue-600 text-white shrink-0" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(activeConfig?.shiftPatterns || []).length === 0 ? (
              <div className="col-span-2 text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500">Belum ada master pola rotasi shift yang dibuat.</p>
              </div>
            ) : (
              activeConfig?.shiftPatterns?.map(pattern => (
                <div 
                  key={pattern.id} 
                  onClick={() => setViewingPattern(pattern)}
                  className="relative group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-slate-400 font-normal leading-tight">
                        Siklus {pattern.cycle.length} Hari
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors mt-0.5">
                        {pattern.name}
                      </h4>
                    </div>
                    <div className="flex items-center shrink-0 pt-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pattern.cycle.map((sId, idx) => {
                      if (sId === 'OFF') {
                        return (
                          <span key={idx} className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 text-rose-700 border-rose-200">
                            OFF
                          </span>
                        );
                      }
                      const s = (activeConfig?.shifts || availableShifts).find(x => x.id === sId);
                      if (!s) return null;
                      const isOffShift = s.isOff || s.code?.toUpperCase() === 'OFF';
                      const color = isOffShift ? 'rose' : s.color;
                      return (
                        <span 
                          key={idx} 
                          style={getShiftBadgeStyle(color)}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getShiftBadgeClasses(color)}`}
                        >
                          {s.code}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      
      {/* 4. Master Group / Regu Shift */}
      {showShiftSettings && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              Group / Regu Shift
            </h3>
            <button 
              onClick={handleOpenCreateMasterGroup} 
              title="Tambah Group Shift" 
              className="p-0 border-none bg-transparent hover:opacity-80 transition-all cursor-pointer outline-none focus:outline-none"
            >
              <PlusCircle className="w-6 h-6 fill-blue-600 text-white shrink-0" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(!activeConfig?.shiftGroups || activeConfig.shiftGroups.length === 0) ? (
              <div className="col-span-full text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500">Belum ada group karyawan yang dibuat.</p>
              </div>
            ) : (
              activeConfig.shiftGroups.map((group, groupIdx) => {
                const palette = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#0EA5E9', '#EC4899'];
                const groupColor = (group.color && group.color.startsWith('#')) 
                  ? group.color 
                  : (group.id?.includes('regu-a') ? '#2563EB' : group.id?.includes('regu-b') ? '#10B981' : group.id?.includes('it-') ? '#8B5CF6' : palette[groupIdx % palette.length]);

                return (
                  <div 
                    key={group.id} 
                    onClick={() => {
                      setViewingGroup(group);
                    }}
                    className="relative group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div 
                        style={{ backgroundColor: `${groupColor}18`, color: groupColor, borderColor: `${groupColor}40` }}
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase border shrink-0"
                      >
                        {group.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {group.name}
                        </h4>
                        {group.description ? (
                          <p className="text-[10.5px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                            {group.description}
                          </p>
                        ) : (
                          <p className="text-[10.5px] sm:text-[11px] text-slate-400 italic truncate mt-0.5">
                            Tanpa keterangan tambahan
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {group.employeeIds.slice(0, 4).map((empId, i) => {
                          const emp = employees.find(e => e.id === empId);
                          return (
                            <div 
                              key={i} 
                              title={emp?.fullName || empId}
                              className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-blue-600 text-[9px] font-extrabold shadow-2xs shrink-0"
                            >
                              {emp ? emp.fullName.trim().charAt(0).toUpperCase() : '?'}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {group.employeeIds.length} Karyawan
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 5. Pola Jadwal Tersimpan (Penugasan) */}

      {showShiftSettings && (
        <div className="space-y-4 pt-2">
          {/* Toast Notification */}
          {toastNotification && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-2 text-xs font-semibold text-blue-900 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{toastNotification.text}</span>
              </div>
              <button 
                onClick={() => setToastNotification(null)}
                className="text-blue-500 hover:text-blue-800 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600 shrink-0" />
              Pola Jadwal Tersimpan
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                {savedPatternsList.length} Pola
              </span>
              <button 
                onClick={handleOpenCreateSchedulePattern} 
                title="Tambah Pola Jadwal" 
                className="p-0 border-none bg-transparent hover:opacity-80 transition-all cursor-pointer outline-none focus:outline-none ml-1"
              >
                <PlusCircle className="w-6 h-6 fill-blue-600 text-white shrink-0" />
              </button>
            </div>
          </div>

          {savedPatternsList.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Belum Ada Pola Jadwal Tersimpan</div>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
                  Klik tombol tambah (+) di kanan atas atau tombol di bawah untuk membuat pola jadwal dan menetapkan pola shift serta tanggal mulai per departemen.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleOpenCreateSchedulePattern}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Pola Jadwal</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {savedPatternsList.map((saved) => {
                const isActive = !!saved.isActive;
                return (
                  <div 
                    key={saved.id}
                    onClick={() => setViewingSavedPattern(saved)}
                    className={`relative group p-4 rounded-xl border border-slate-200 transition-all duration-200 space-y-3 bg-white cursor-pointer select-none hover:border-blue-400 hover:shadow-md ${
                      isActive 
                        ? 'opacity-100' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] text-slate-400 font-normal leading-tight">
                          Terakhir Diperbarui: {formatIndoDate(saved.updatedAt || saved.createdAt)}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mt-0.5">
                          {saved.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        {isActive && (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white shadow-2xs">
                            Aktif
                          </span>
                        )}
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                    </div>

                    {saved.description && (
                      <p className="text-xs text-slate-600 font-normal leading-relaxed w-full line-clamp-2">
                        {saved.description}
                      </p>
                    )}

                    {/* Summary Strip: Departments & Groups */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 group-hover:bg-blue-50/30 group-hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{(saved.departmentAssignments || []).length || departments.length} Departemen</span>
                      </div>

                      {(saved.groupAssignments && saved.groupAssignments.length > 0) ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                          <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{saved.groupAssignments.length} Group ({saved.groupAssignments.reduce((acc, g) => acc + (g.employeeIds?.length || 0), 0)} Org)</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pola Seluruh Departemen</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL IMPOR JADWAL MASSAL */}
      <ModalImportSchedule
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onDownloadTemplate={handleDownloadTemplate}
        onFileUpload={handleFileUpload}
        isImporting={isImporting}
        importStatus={importStatus}
        importError={importError}
      />

      {/* VIEW MODAL SHIFT MASTER */}
      <ModalShiftDetail
        viewingShift={viewingShift}
        onClose={() => setViewingShift(null)}
        onEdit={(shift) => {
          setViewingShift(null);
          openShiftModal(shift);
        }}
        onDelete={(shiftId) => {
          setViewingShift(null);
          deleteShift(shiftId);
        }}
      />

      {/* MODAL SHIFT MASTER */}
      <ModalShiftForm
        isOpen={isShiftModalOpen}
        editingShift={editingShift}
        shiftFormData={shiftFormData}
        setShiftFormData={setShiftFormData}
        onClose={() => setIsShiftModalOpen(false)}
        onSubmit={saveShift}
      />

      {/* VIEW MODAL PATTERN */}
      <ModalPatternDetail
        viewingPattern={viewingPattern}
        onClose={() => setViewingPattern(null)}
        onEdit={(pattern) => {
          setViewingPattern(null);
          openPatternModal(pattern);
        }}
        onDelete={(patternId) => {
          setViewingPattern(null);
          deletePattern(patternId);
        }}
        activeConfig={activeConfig}
        availableShifts={availableShifts}
      />

      {/* MODAL PATTERN */}
      <ModalPatternForm
        isOpen={isPatternModalOpen}
        editingPattern={editingPattern}
        patternFormData={patternFormData}
        setPatternFormData={setPatternFormData}
        onClose={() => setIsPatternModalOpen(false)}
        onSubmit={savePattern}
        rotationTemplates={rotationTemplates}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        onApplyTemplate={handleApplyTemplate}
        activeConfig={activeConfig}
        availableShifts={availableShifts}
        hasPagiSiangMalam={hasPagiSiangMalam}
      />

      {/* MODAL BUAT / EDIT POLA JADWAL */}
      <ModalSchedulePatternForm
        isOpen={isSchedulePatternModalOpen}
        editingSavedPatternId={editingSavedPatternId}
        onClose={() => setIsSchedulePatternModalOpen(false)}
        onSubmit={handleSaveSchedulePattern}
        isSavingPattern={isSavingPattern}
        patternScheduleName={patternScheduleName}
        setPatternScheduleName={setPatternScheduleName}
        patternScheduleDesc={patternScheduleDesc}
        setPatternScheduleDesc={setPatternScheduleDesc}
        patternActiveTab={patternActiveTab}
        setPatternActiveTab={setPatternActiveTab}
        departments={departments}
        activeConfig={activeConfig}
        availableShifts={availableShifts}
        modalDeptAssignments={modalDeptAssignments}
        modalGroupAssignments={modalGroupAssignments}
        isBulkDateEnabled={isBulkDateEnabled}
        setIsBulkDateEnabled={setIsBulkDateEnabled}
        bulkDateValue={bulkDateValue}
        setBulkDateValue={setBulkDateValue}
        onBulkAnchorDate={handleModalBulkAnchorDate}
        onUpdateDeptAssignment={handleModalUpdateDeptAssignment}
        onUpdateGroup={handleUpdateGroup}
        onAddDeptAssignment={handleModalAddDeptAssignment}
        onRemoveDeptAssignment={handleModalRemoveDeptAssignment}
        onAddAllDepts={handleModalAddAllDepts}
        onAddGroupAssignment={handleModalAddGroupAssignment}
        onRemoveGroupAssignment={handleModalRemoveGroupAssignment}
        onAddAllGroups={handleModalAddAllGroups}
      />

      {/* MODAL BUAT, EDIT & LIHAT MASTER GROUP (CONSOLIDATED STANDALONE COMPONENT) */}
      <ShiftGroupModal
        isOpen={isMasterGroupModalOpen}
        editingGroup={editingMasterGroup}
        onClose={() => {
          setIsMasterGroupModalOpen(false);
          setEditingMasterGroup(null);
        }}
        onSave={handleSaveGroupModal}
        viewingGroup={viewingGroup}
        onCloseView={() => setViewingGroup(null)}
        onOpenEditFromView={(group) => {
          setEditingMasterGroup(group);
          setIsMasterGroupModalOpen(true);
        }}
        onDeleteFromView={(groupId) => {
          setViewingGroup(null);
          handleDeleteMasterGroup(groupId);
        }}
        employees={employees}
        departments={departments}
        existingGroups={activeConfig?.shiftGroups || []}
      />

      {/* MODAL PEMILIH ANGGOTA KARYAWAN UNTUK GROUP BAGIAN */}
      <ModalMemberSelector
        isOpen={Boolean(isMemberSelectorOpen && activeGroupIdForMembers)}
        activeGroupIdForMembers={activeGroupIdForMembers}
        onClose={() => setIsMemberSelectorOpen(false)}
        modalGroupAssignments={modalGroupAssignments}
        employees={employees}
        departments={departments}
        memberDeptFilter={memberDeptFilter}
        setMemberDeptFilter={setMemberDeptFilter}
        memberSearchQuery={memberSearchQuery}
        setMemberSearchQuery={setMemberSearchQuery}
        onToggleEmployeeInGroup={handleToggleEmployeeInGroup}
        onBulkToggleFilteredEmployees={handleBulkToggleFilteredEmployees}
      />

      {/* MODAL DETAIL / LIHAT POLA JADWAL (VIEW ONLY / NON-EDIT MODE) */}
      <ModalSchedulePatternDetail
        viewingSavedPattern={viewingSavedPattern}
        onClose={() => setViewingSavedPattern(null)}
        onEdit={(p) => {
          setViewingSavedPattern(null);
          handleOpenEditSchedulePattern(p);
        }}
        onDelete={(p) => {
          setViewingSavedPattern(null);
          handleDeleteSavedPattern(p);
        }}
        onActivate={(p) => {
          setViewingSavedPattern(null);
          handleActivateSavedPattern(p);
        }}
        departments={departments}
        employees={employees}
        activeConfig={activeConfig}
        availableShifts={availableShifts}
      />
    </div>
  );
}
