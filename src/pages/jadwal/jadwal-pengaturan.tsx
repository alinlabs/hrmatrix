import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import {
  AttendanceConfig,
  WorkShift,
  ShiftPattern,
  SavedSchedulePattern,
  DepartmentScheduleAssignment,
  ShiftGroupAssignment,
  ShiftGroup,
} from '../../types';
import {
  saveAttendanceConfig,
  getAttendanceConfig,
} from '../../services/attendanceConfigService';
import {
  saveOrUpdateSchedulePattern,
  activateSavedSchedulePattern,
  deleteSavedSchedulePattern,
} from '../../services/rosterService';
import { setSingleShiftSchedule } from '../../services/shiftService';
import { PageHeaderTitle, HideBottomNav } from '../../context/MobileNavContext';
import { useScrollToTop } from '../../components/layout/ScrollToTop';
import { ShiftGroupModal } from './modal-shift-group';
import { ModalShiftDetail } from './modal-shift-detail';
import { ModalShiftForm } from './modal-shift-form';
import { ModalPatternDetail } from './modal-pattern-detail';
import { ModalPatternForm } from './modal-pattern-form';
import { ModalImportSchedule } from './modal-import-schedule';
import { ModalSchedulePatternForm } from './modal-schedule-pattern-form';
import { ModalMemberSelector } from './modal-member-selector';
import { ModalSchedulePatternDetail } from './modal-schedule-pattern-detail';
import { buildRotationTemplates } from './utils-rotation-templates';
import {
  DAYS_OF_WEEK,
  getDayScheduleConfig,
  SectionPengaturanNonShift,
} from './section-pengaturan-nonshift';
import { SectionPengaturanShift } from './section-pengaturan-shift';

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

  // Modal State - Shift Pattern (Cycle)
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<ShiftPattern | null>(null);
  const [viewingPattern, setViewingPattern] = useState<ShiftPattern | null>(null);
  const [patternFormData, setPatternFormData] = useState<Partial<ShiftPattern>>({});

  // Modal & Actions State - Pola Jadwal Tersimpan (Buat / Edit / Detail)
  const [isSchedulePatternModalOpen, setIsSchedulePatternModalOpen] = useState(false);
  const [editingSavedPatternId, setEditingSavedPatternId] = useState<string | null>(null);
  const [viewingSavedPattern, setViewingSavedPattern] = useState<SavedSchedulePattern | null>(null);
  const [patternScheduleName, setPatternScheduleName] = useState('');
  const [patternScheduleDesc, setPatternScheduleDesc] = useState('');
  const [patternActiveTab, setPatternActiveTab] = useState<'dept' | 'group'>('dept');
  const [modalDeptAssignments, setModalDeptAssignments] = useState<DepartmentScheduleAssignment[]>([]);
  const [modalGroupAssignments, setModalGroupAssignments] = useState<ShiftGroupAssignment[]>([]);

  // Modal & Actions State - Master Group
  const [isMasterGroupModalOpen, setIsMasterGroupModalOpen] = useState(false);
  const [editingMasterGroup, setEditingMasterGroup] = useState<ShiftGroup | null>(null);
  const [viewingGroup, setViewingGroup] = useState<ShiftGroup | null>(null);

  const [isBulkDateEnabled, setIsBulkDateEnabled] = useState(false);
  const [bulkDateValue, setBulkDateValue] = useState('');
  const [isSavingPattern, setIsSavingPattern] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // State untuk Modal Pemilih Anggota Karyawan dalam Group
  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);
  const [activeGroupIdForMembers] = useState<string | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberDeptFilter, setMemberDeptFilter] = useState('ALL');

  // State & Data - Impor
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

  const departments = useLiveQuery(async () => {
    try {
      return await db.departments.toArray();
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
      ['EMP-003', 'Citra Dewi', '2026-08-25', 'OFF', 'Hari Libur'],
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

  const handleSaveConfig = async (newCfg: AttendanceConfig) => {
    await saveAttendanceConfig(newCfg);
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
      code: `SH-${((activeConfig?.shifts || availableShifts).length || 0) + 1}`,
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
    const currentConfig = activeConfig || (await getAttendanceConfig());

    // Automatic calculation of crossDay (Shift Lintas Hari): if endTime < startTime
    const startTime = shiftFormData.startTime || '00:00';
    const endTime = shiftFormData.endTime || '00:00';
    const autoCrossDay = Boolean(startTime && endTime && endTime < startTime);

    const shiftDataToSave: WorkShift = {
      id: editingShift ? editingShift.id : uuidv4(),
      code: shiftFormData.code || `SH-${((currentConfig?.shifts || availableShifts).length || 0) + 1}`,
      name: shiftFormData.name || '',
      startTime,
      endTime,
      breakStartTime: shiftFormData.breakStartTime || '',
      breakEndTime: shiftFormData.breakEndTime || '',
      crossDay: autoCrossDay,
      color: shiftFormData.color || '#2563EB',
      isOff: false,
    };

    const baseShifts = currentConfig.shifts && currentConfig.shifts.length > 0 ? currentConfig.shifts : availableShifts;
    let updatedShifts = [...baseShifts];
    if (editingShift) {
      updatedShifts = updatedShifts.map(s => s.id === editingShift.id ? shiftDataToSave : s);
    } else {
      updatedShifts.push(shiftDataToSave);
    }
    const newConfig = { ...currentConfig, shifts: updatedShifts };
    await handleSaveConfig(newConfig);
    setIsShiftModalOpen(false);
  };

  const deleteShift = async (id: string) => {
    const currentConfig = activeConfig || (await getAttendanceConfig());
    if (!confirm('Hapus shift master ini?')) return;
    const baseShifts = currentConfig.shifts && currentConfig.shifts.length > 0 ? currentConfig.shifts : availableShifts;
    const newConfig = { ...currentConfig, shifts: baseShifts.filter(s => s.id !== id) };
    await handleSaveConfig(newConfig);
  };

  // Shift Pattern (Cycle) CRUD
  const openPatternModal = (pattern?: ShiftPattern) => {
    setEditingPattern(pattern || null);
    setPatternFormData(pattern ? { ...pattern, cycle: [...(pattern.cycle || [])] } : { name: '', cycle: [] });
    setSelectedTemplateId('');
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

  const rotationTemplates = React.useMemo(
    () =>
      buildRotationTemplates({
        regularShift,
        nonOffShifts,
        pagiShift,
        siangShift,
        malamShift,
        includeExtendedWeeklyBlocks: true,
      }),
    [pagiShift, siangShift, malamShift, regularShift, nonOffShifts]
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleApplyTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    if (!tmplId) return;
    const tmpl = rotationTemplates.find(t => t.id === tmplId);
    if (tmpl) {
      setPatternFormData(prev => ({
        ...prev,
        name: prev.name && prev.name !== '' && !rotationTemplates.some(t => t.name === prev.name) ? prev.name : tmpl.name,
        cycle: [...tmpl.cycle],
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
        anchorDate: existing.anchorDate || todayIso,
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
        color: existing.color || g?.color || '#2563EB',
      };
    });

    const existingDates = loadedDeptAssignments.map(a => a.anchorDate).filter(Boolean);
    const allSameDate = existingDates.length > 0 &&
      loadedDeptAssignments.length > 0 &&
      existingDates.every(d => d === existingDates[0]);

    if (allSameDate) {
      setIsBulkDateEnabled(true);
      setBulkDateValue(existingDates[0] || '');
    } else {
      setIsBulkDateEnabled(false);
      setBulkDateValue('');
    }

    setEditingSavedPatternId(saved.id);
    setPatternScheduleName(saved.name);
    setPatternScheduleDesc(saved.description || '');
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
        anchorDate: todayIso,
      },
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
        anchorDate: todayIso,
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
      },
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
            mode: 'shift',
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

  const handleUpdateGroup = (groupId: string, field: keyof ShiftGroupAssignment, value: any) => {
    setModalGroupAssignments(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, [field]: value };
      }
      return g;
    }));
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
        makeActive: true,
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

  const systemType = activeConfig?.systemType || 'normal';
  const showNormalHours = systemType === 'normal';
  const showShiftSettings = systemType === 'shift' || systemType === 'mixed';
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

      {/* 0 & 1. Model Kerja Utama + Pengaturan Jam Kerja Non Shift */}
      <SectionPengaturanNonShift
        activeConfig={activeConfig}
        systemType={systemType}
        showNormalHours={showNormalHours}
        onSaveConfig={handleSaveConfig}
        onToggleDayActive={handleToggleDayActive}
        onUpdateDayTime={handleUpdateDayTime}
      />

      {/* 2 - 5. Shift Master, Pola Rotasi Shift, Group/Regu Shift, & Pola Jadwal Tersimpan */}
      {showShiftSettings && (
        <SectionPengaturanShift
          activeConfig={activeConfig}
          availableShifts={availableShifts}
          nonOffShifts={nonOffShifts}
          employees={employees}
          departments={departments}
          savedPatternsList={savedPatternsList}
          toastNotification={toastNotification}
          onDismissToast={() => setToastNotification(null)}
          onOpenShiftModal={openShiftModal}
          onViewShift={setViewingShift}
          onOpenPatternModal={openPatternModal}
          onViewPattern={setViewingPattern}
          onOpenCreateMasterGroup={handleOpenCreateMasterGroup}
          onViewGroup={setViewingGroup}
          onOpenCreateSchedulePattern={handleOpenCreateSchedulePattern}
          onViewSavedPattern={setViewingSavedPattern}
        />
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
