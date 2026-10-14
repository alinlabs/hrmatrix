import React, { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { 
  Check, 
  Plus, 
  Trash2, 
  X, 
  AlertCircle, 
  ChevronDown, 
  Building2, 
  CheckSquare, 
  Square, 
  Clock, 
  Calendar, 
  Coffee, 
  CheckCircle2, 
  FileText, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Zap, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Sparkles, 
  AlertTriangle,
  Layers,
  RefreshCw,
  Pencil
} from 'lucide-react';
import sampleScheduleConfig from '../../data/sampleDb/pengaturan-jadwal';
import { 
  JobTemplate, 
  IndexJobTemplate, 
  KPIItem, 
  WorkScheduleType, 
  WorkScheduleConfig,
  WorkPatternType,
  WorkDaysOption,
  EducationDegreeLevel,
  CertificationTypeCategory,
  SkillProficiencyLevel,
  StructuredEducationConfig,
  StructuredExperienceItem,
  StructuredCertificationItem,
  StructuredSkillItem
} from './types';
import { 
  resolveJobWorkSchedule,
  getAvailableShiftPatterns,
  getShiftBadgeInfo,
  ShiftPatternOption,
  STANDARD_SHIFT_PATTERN_OPTIONS
} from './utils-helper';
import { AttendanceConfig, ShiftPattern, WorkShift } from '../../types';
import { ModalPatternForm } from '../jadwal/modal-pattern-form';
import { ModalShiftForm } from '../jadwal/modal-shift-form';
import { RotationTemplate } from '../jadwal/types';
import { 
  saveAttendanceConfig, 
  getAttendanceConfig,
  FIVE_DEFAULT_SHIFTS, 
  DEFAULT_ATTENDANCE_CONFIG,
  getShiftBadgeClasses,
  getShiftBadgeStyle
} from '../../services/attendanceConfigService';
import { v4 as uuidv4 } from 'uuid';
import { 
  DEGREE_LEVEL_OPTIONS,
  STANDARD_MAJORS_COMBOBOX,
  EXPERIENCE_DURATION_OPTIONS,
  INDUSTRY_SECTOR_OPTIONS,
  CERTIFICATION_CATEGORY_OPTIONS,
  SKILL_PROFICIENCY_LEVELS,
  formatEducationSummary,
  formatExperienceSummary,
  formatCertificationSummaryList,
  formatSkillSummaryList
} from './qualification-options';
import { 
  JOB_LEVELS, 
  STANDARD_DOCUMENTS, 
  STANDARD_FACILITIES,
  STANDARD_CERTIFICATIONS,
  STANDARD_HARD_SKILLS,
  STANDARD_SOFT_SKILLS,
  STANDARD_DASAR_UKUR,
  JOB_CATEGORIES, 
  DEPARTMENTS, 
  ALL_DIVISIONS, 
  JOB_CATEGORY_OPTIONS, 
  DEPARTMENT_OPTIONS, 
  getDivisionOptionsByDepartment 
} from '../../data/master';
import { 
  MASTER_TUNJANGAN_LIST, 
  MASTER_BPJS_LIST, 
  getTunjanganName, 
  getBpjsName,
  TunjanganItem,
  BpjsItem,
  mapPayrollRuleToTunjanganItem,
  mapPayrollRuleToBpjsItem,
  isTunjanganSelected,
  isBpjsSelected,
  normalizeTunjanganId,
  normalizeBpjsId,
  normalizePajakId,
  normalizeCompensationStructure
} from './compensation-catalog';
import { SectionJobDetails } from './section-job-details';
import { SectionCompetencies } from './section-competencies';
import { SectionCompensation } from './section-compensation';
import { SectionWorkSchedule } from './section-work-schedule';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSubbar 
} from '../../context/MobileNavContext';
import { Input, Select, CurrencyInput, ComboboxInput, ComboboxOption } from '../../components/ui';
import { cn } from '../../utils/cn';

/**
 * Auto-formats 4-digit numeric time input into HH:mm format.
 * Automatically appends ":" after 2 digits, restricts max hours to 23 and max minutes to 59.
 */
export const format4DigitTime = (currentVal: string, newVal: string): string => {
  // If user is backspacing over colon (e.g. "07:" -> "07")
  if (currentVal.endsWith(':') && !newVal.endsWith(':') && newVal.length < currentVal.length) {
    const raw = newVal.replace(/\D/g, '');
    if (raw.length >= 2) {
      return raw.slice(0, 1);
    }
  }

  let digits = newVal.replace(/\D/g, '');
  if (digits.length > 4) {
    digits = digits.slice(0, 4);
  }

  if (digits.length === 0) return '';

  if (digits.length >= 2) {
    let hh = parseInt(digits.slice(0, 2), 10);
    if (isNaN(hh)) hh = 0;
    if (hh > 23) hh = 23;
    const hhStr = hh.toString().padStart(2, '0');

    if (digits.length === 2) {
      return `${hhStr}:`;
    }

    let mmStr = digits.slice(2);
    if (mmStr.length === 2) {
      let mm = parseInt(mmStr, 10);
      if (isNaN(mm)) mm = 0;
      if (mm > 59) mm = 59;
      mmStr = mm.toString().padStart(2, '0');
    } else if (mmStr.length === 1) {
      let m1 = parseInt(mmStr, 10);
      if (m1 > 5) m1 = 5;
      mmStr = m1.toString();
    }

    return `${hhStr}:${mmStr}`;
  }

  let h1 = parseInt(digits, 10);
  if (h1 > 2) h1 = 2;
  return h1.toString();
};

interface CreateJobDeskViewProps {
  onBack: () => void;
  onSave: (template: JobTemplate) => void;
  indexTemplates: IndexJobTemplate[];
  initialData?: JobTemplate | null;
}

type StepType = 'posisi' | 'tugas' | 'kpi' | 'kualifikasi' | 'kompensasi' | 'waktu_kerja';

const EMPTY_FORM_DATA: JobTemplate = {
  id: '',
  nama: '',
  kategori: '',
  departemen: '',
  divisi: '',
  level: '',
  atasanLangsung: '',
  tujuanJabatan: '',
  fungsiUtama: [],
  tanggungJawab: [],
  tugasHarian: [],
  wewenang: [],
  outputDiharapkan: [],
  hubunganKerja: {
    internal: [],
    eksternal: []
  },
  kualifikasi: {
    pendidikan: '',
    pengalaman: '',
    sertifikasi: [],
    syaratKhusus: []
  },
  kompetensi: {
    teknis: [],
    nonTeknis: []
  },
  kpi: [],
  kompensasi: {
    gajiPokok: {
      minimal: 0,
      standar: 0,
      maksimal: 0,
    },
    tunjangan: [],
    bpjs: [],
    pajakRuleId: 'pajak-pph21-ter',
    fasilitas: []
  },
  dokumenAdministrasi: {
    wajib: [],
    pendukung: [],
    khusus: []
  },
  waktuKerja: {
    polaKerja: 'Non Shift',
    hariKerja: '5 Hari',
    waktuIstirahatMenit: 60,
    totalJamKerja: 40,
    scheduleType: '5_HARI',
    workDays: 'Senin s/d Jumat (5 Hari Kerja per Minggu)',
    workingHours: '08:30 - 17:30 WIB (8 Jam Kerja Efektif)',
    restHours: '12:00 - 13:00 WIB (60 Menit - Tidak Dihitung Jam Kerja)',
    totalHoursPerWeek: 40,
    overtimeEligible: true,
    overtimeClause: 'Dapat diperintahkan lembur resmi bila mendesak dengan kompensasi sesuai PP No. 35/2021',
    shiftDescription: 'Non-Shift (Reguler Office Hours)'
  }
};

export const STANDARD_ATASAN_ROLES = [
  { value: 'Board of Directors', label: 'Board of Directors', subLabel: 'Dewan Direksi / Komisaris' },
  { value: 'Director', label: 'Director', subLabel: 'Direktur' },
  { value: 'General Manager', label: 'General Manager', subLabel: 'Pimpinan Eksekutif / GM' },
  { value: 'Manager', label: 'Manager', subLabel: 'Manajer Departemen' },
  { value: 'Head of Department', label: 'Head of Department', subLabel: 'Kepala Bagian / Departemen' },
  { value: 'Supervisor', label: 'Supervisor', subLabel: 'Pengawas / Koordinator' },
  { value: 'Team Lead', label: 'Team Lead', subLabel: 'Ketua Tim' },
];

const initializeFormData = (initialData?: JobTemplate | null): JobTemplate => {
  if (!initialData) {
    return JSON.parse(JSON.stringify(EMPTY_FORM_DATA));
  }
  const cloned = JSON.parse(JSON.stringify(initialData));

  // Robust sync for category, department, division, and atasan
  const rawDepartemen = (cloned.departemen || '').trim();
  let rawKategori = (cloned.kategori || '').trim();
  if (!rawKategori && rawDepartemen) {
    rawKategori = rawDepartemen.replace(/\s+department$/i, '').trim();
  }
  let departemenVal = rawDepartemen;
  if (!departemenVal && rawKategori) {
    departemenVal = `${rawKategori} Department`;
  }

  return {
    ...EMPTY_FORM_DATA,
    ...cloned,
    nama: cloned.nama || '',
    kategori: rawKategori,
    departemen: departemenVal,
    divisi: cloned.divisi || 'Operational Division',
    level: cloned.level || '',
    atasanLangsung: cloned.atasanLangsung || '',
    tujuanJabatan: cloned.tujuanJabatan || '',
    fungsiUtama: Array.isArray(cloned.fungsiUtama) ? cloned.fungsiUtama : [],
    tanggungJawab: Array.isArray(cloned.tanggungJawab) ? cloned.tanggungJawab : [],
    tugasHarian: Array.isArray(cloned.tugasHarian) ? cloned.tugasHarian : [],
    wewenang: Array.isArray(cloned.wewenang) ? cloned.wewenang : [],
    outputDiharapkan: Array.isArray(cloned.outputDiharapkan) ? cloned.outputDiharapkan : [],
    hubunganKerja: {
      internal: Array.isArray(cloned.hubunganKerja?.internal) ? cloned.hubunganKerja.internal : [],
      eksternal: Array.isArray(cloned.hubunganKerja?.eksternal) ? cloned.hubunganKerja.eksternal : [],
    },
    kualifikasi: {
      pendidikan: cloned.kualifikasi?.pendidikan || '',
      pengalaman: cloned.kualifikasi?.pengalaman || '',
      sertifikasi: Array.isArray(cloned.kualifikasi?.sertifikasi) ? cloned.kualifikasi.sertifikasi : [],
      syaratKhusus: Array.isArray(cloned.kualifikasi?.syaratKhusus) ? cloned.kualifikasi.syaratKhusus : [],
    },
    kompetensi: {
      teknis: Array.isArray(cloned.kompetensi?.teknis) ? cloned.kompetensi.teknis : [],
      nonTeknis: Array.isArray(cloned.kompetensi?.nonTeknis) ? cloned.kompetensi.nonTeknis : [],
    },
    kpi: Array.isArray(cloned.kpi) ? cloned.kpi : [],
    kompensasi: normalizeCompensationStructure(cloned.kompensasi),
    dokumenAdministrasi: {
      wajib: Array.isArray(cloned.dokumenAdministrasi?.wajib) ? cloned.dokumenAdministrasi.wajib : [],
      pendukung: Array.isArray(cloned.dokumenAdministrasi?.pendukung) ? cloned.dokumenAdministrasi.pendukung : [],
      khusus: Array.isArray(cloned.dokumenAdministrasi?.khusus) ? cloned.dokumenAdministrasi.khusus : [],
    },
    waktuKerja: cloned.waktuKerja ? cloned.waktuKerja : resolveJobWorkSchedule(cloned)
  };
};

export const CreateJobDeskView: React.FC<CreateJobDeskViewProps> = ({
  onBack,
  onSave,
  indexTemplates,
  initialData,
}) => {
  const isEditMode = Boolean(initialData && initialData.id);
  const isTemplateMode = Boolean(initialData && !initialData.id);

  const [activeStep, setActiveStep] = useState<StepType>('posisi');
  const [showTabs, setShowTabs] = useState<boolean>(true);
  const [formData, setFormData] = useState<JobTemplate>(() => initializeFormData(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Intensive Structured Qualification States
  const [eduLevel, setEduLevel] = useState<EducationDegreeLevel>(() => {
    return formData.kualifikasi?.detailPendidikan?.tingkatPendidikan || 'S1 / D4';
  });
  const [selectedMajors, setSelectedMajors] = useState<string[]>(() => {
    return formData.kualifikasi?.detailPendidikan?.jurusan || ['Semua Jurusan (Terbuka Semua Jurusan Relevan)'];
  });
  const [eduDesc, setEduDesc] = useState<string>(() => {
    return formData.kualifikasi?.detailPendidikan?.deskripsiPendidikan || '';
  });

  const [expItems, setExpItems] = useState<StructuredExperienceItem[]>(() => {
    if (formData.kualifikasi?.detailPengalaman && formData.kualifikasi.detailPengalaman.length > 0) {
      return formData.kualifikasi.detailPengalaman;
    }
    return [{
      id: `exp-1`,
      lamaPengalaman: '1 - 2 Tahun',
      posisi: formData.nama || 'Posisi Relevan',
      bidangIndustri: formData.kategori || 'Industri Relevan'
    }];
  });

  const [certItems, setCertItems] = useState<StructuredCertificationItem[]>(() => {
    if (formData.kualifikasi?.detailSertifikasi && formData.kualifikasi.detailSertifikasi.length > 0) {
      return formData.kualifikasi.detailSertifikasi;
    }
    if (formData.kualifikasi?.sertifikasi && formData.kualifikasi.sertifikasi.length > 0) {
      return formData.kualifikasi.sertifikasi.map((s, idx) => ({
        id: `cert-${idx}`,
        jenisSertifikasi: s.toLowerCase().includes('bnsp') ? 'BNSP' : s.toLowerCase().includes('iso') ? 'ISO' : 'Profesional Umum',
        namaSertifikasi: s.replace(/^\[.*?\]\s*/, ''),
        bidangSertifikasi: 'Umum / Relevan'
      }));
    }
    return [];
  });

  const [hardSkillsDetailed, setHardSkillsDetailed] = useState<StructuredSkillItem[]>(() => {
    if (formData.kompetensi?.detailTeknis && formData.kompetensi.detailTeknis.length > 0) {
      return formData.kompetensi.detailTeknis;
    }
    if (formData.kompetensi?.teknis && formData.kompetensi.teknis.length > 0) {
      return formData.kompetensi.teknis.map((skill, idx) => {
        const match = skill.match(/^(.*?)(?:\s*\[Level:\s*(.*?)\])?$/);
        const name = match ? match[1].trim() : skill;
        const level = (match && match[2] ? match[2].trim() : 'Mahir') as SkillProficiencyLevel;
        return {
          id: `tech-${idx}`,
          namaSkill: name || skill,
          tingkatKemahiran: level,
          kategori: 'Teknis'
        };
      });
    }
    return [];
  });

  const [softSkillsDetailed, setSoftSkillsDetailed] = useState<StructuredSkillItem[]>(() => {
    if (formData.kompetensi?.detailNonTeknis && formData.kompetensi.detailNonTeknis.length > 0) {
      return formData.kompetensi.detailNonTeknis;
    }
    if (formData.kompetensi?.nonTeknis && formData.kompetensi.nonTeknis.length > 0) {
      return formData.kompetensi.nonTeknis.map((skill, idx) => {
        const match = skill.match(/^(.*?)(?:\s*\[Level:\s*(.*?)\])?$/);
        const name = match ? match[1].trim() : skill;
        const level = (match && match[2] ? match[2].trim() : 'Mahir') as SkillProficiencyLevel;
        return {
          id: `soft-${idx}`,
          namaSkill: name || skill,
          tingkatKemahiran: level,
          kategori: 'Non-Teknis'
        };
      });
    }
    return [];
  });

  // Query attendance config from IndexedDB for Shift Patterns sync
  const attendanceConfig = useLiveQuery(async () => {
    return await getAttendanceConfig();
  }, []);

  const availableShiftPatterns = useMemo(() => {
    return getAvailableShiftPatterns(attendanceConfig);
  }, [attendanceConfig]);

  // State & helpers for Modal Pattern Form (Buat Customisasi Shift)
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<ShiftPattern | null>(null);
  const [patternFormData, setPatternFormData] = useState<Partial<ShiftPattern>>({
    name: '',
    description: '',
    cycle: []
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // State & helpers for Modal Shift Form (Master Shift Operasional Kerja)
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [shiftFormData, setShiftFormData] = useState<Partial<WorkShift>>({});

  const availableShifts = useMemo(() => {
    return attendanceConfig?.shifts || FIVE_DEFAULT_SHIFTS;
  }, [attendanceConfig]);

  const nonOffShifts = useMemo(() => {
    return availableShifts.filter(s => !s.isOff && s.code?.toUpperCase() !== 'OFF' && s.id !== 'shift-off' && !s.name?.toLowerCase().includes('libur'));
  }, [availableShifts]);

  const regularShift = useMemo(() => {
    return availableShifts.find(s => s.code === 'REGULER' || s.name.toLowerCase().includes('kantor') || s.name.toLowerCase().includes('reguler'));
  }, [availableShifts]);

  const pagiShift = useMemo(() => {
    return availableShifts.find(s => s.code === 'PAGI' || s.name.toLowerCase().includes('pagi') || s.id.includes('pagi'));
  }, [availableShifts]);

  const siangShift = useMemo(() => {
    return availableShifts.find(s => s.code === 'SIANG' || s.name.toLowerCase().includes('siang') || s.id.includes('siang'));
  }, [availableShifts]);

  const malamShift = useMemo(() => {
    return availableShifts.find(s => s.code === 'MALAM' || s.name.toLowerCase().includes('malam') || s.id.includes('malam'));
  }, [availableShifts]);

  const hasPagiSiangMalam = Boolean(pagiShift && siangShift && malamShift);

  const rotationTemplates = useMemo<RotationTemplate[]>(() => {
    const regId = regularShift?.id || nonOffShifts[0]?.id || 'shift-reguler';
    const off = 'OFF';
    const templates: RotationTemplate[] = [];

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

    if (pagiShift && siangShift && malamShift) {
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
        }
      );
    }

    return templates;
  }, [regularShift, nonOffShifts, pagiShift, siangShift, malamShift]);

  const handleApplyTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = rotationTemplates.find(t => t.id === tmplId);
    if (tmpl) {
      setPatternFormData(prev => ({
        ...prev,
        name: prev.name && prev.name !== '' && !rotationTemplates.some(t => t.name === prev.name) ? prev.name : tmpl.name,
        description: tmpl.description,
        cycle: [...tmpl.cycle]
      }));
    }
  };

  const handleSavePatternSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentConfig = attendanceConfig || DEFAULT_ATTENDANCE_CONFIG;
    const existingPatterns = currentConfig.shiftPatterns || [];
    
    const newPatternId = editingPattern?.id || uuidv4();
    const newPattern: ShiftPattern = {
      id: newPatternId,
      name: patternFormData.name || 'Pola Shift Kustom',
      description: patternFormData.description || 'Pola Shift Kustom dari Jobdesk',
      cycle: patternFormData.cycle && patternFormData.cycle.length > 0
        ? patternFormData.cycle
        : ['shift-1-pagi', 'shift-2-siang', 'shift-off'],
    };

    let updatedPatterns: ShiftPattern[];
    if (editingPattern) {
      updatedPatterns = existingPatterns.map(p => p.id === editingPattern.id ? newPattern : p);
    } else {
      updatedPatterns = [...existingPatterns.filter(p => p.id !== newPatternId), newPattern];
    }

    const updatedConfig: AttendanceConfig = {
      ...currentConfig,
      shiftPatterns: updatedPatterns
    };

    await saveAttendanceConfig(updatedConfig);

    const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const cycleShort = newPattern.cycle.map(c => getShiftBadgeInfo(c).label).join(' • ');

    setFormData(prev => ({
      ...prev,
      waktuKerja: {
        ...(prev.waktuKerja || resolveJobWorkSchedule(prev)),
        polaKerja: 'Shift',
        polaShiftId: newPattern.id,
        polaShiftName: newPattern.name,
        polaShiftCycle: newPattern.cycle,
        hariKerja: '6 Hari',
        hariKerjaList: daysList,
        jamMasuk: '07:00',
        jamPulang: '16:00',
        jamIstirahatMulai: '12:00',
        jamIstirahatSelesai: '13:00',
        jamIstirahat: '12:00 - 13:00',
        waktuIstirahatMenit: 60,
        totalJamKerja: 48,
        totalHoursPerWeek: 48,
        workDays: 'Roster Jadwal Shift Bergilir',
        workingHours: `Rotasi Shift (${newPattern.name})`,
        shiftDescription: `Pola ${newPattern.name}: ${cycleShort}`
      }
    }));

    setIsPatternModalOpen(false);
    setEditingPattern(null);
  };

  const openShiftModal = (shift?: WorkShift) => {
    setEditingShift(shift || null);
    setShiftFormData(shift || {
      code: `SH-${(availableShifts.length || 0) + 1}`,
      name: '',
      startTime: '08:00',
      endTime: '16:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      color: '#2563EB',
    });
    setIsShiftModalOpen(true);
  };

  const handleSaveShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentConfig = attendanceConfig || (await getAttendanceConfig());

    const startTime = shiftFormData.startTime || '00:00';
    const endTime = shiftFormData.endTime || '00:00';
    const autoCrossDay = Boolean(startTime && endTime && endTime < startTime);

    const shiftDataToSave: WorkShift = {
      id: editingShift ? editingShift.id : uuidv4(),
      code: shiftFormData.code || `SH-${(availableShifts.length || 0) + 1}`,
      name: shiftFormData.name || '',
      startTime: startTime,
      endTime: endTime,
      breakStartTime: shiftFormData.breakStartTime || '',
      breakEndTime: shiftFormData.breakEndTime || '',
      crossDay: autoCrossDay,
      color: shiftFormData.color || '#2563EB',
      isOff: false,
    };

    const baseShifts = (currentConfig.shifts && currentConfig.shifts.length > 0) ? currentConfig.shifts : availableShifts;
    let updatedShifts = [...baseShifts];
    if (editingShift) {
      updatedShifts = updatedShifts.map(s => s.id === editingShift.id ? shiftDataToSave : s);
    } else {
      updatedShifts.push(shiftDataToSave);
    }

    const updatedConfig: AttendanceConfig = {
      ...currentConfig,
      shifts: updatedShifts,
    };

    await saveAttendanceConfig(updatedConfig);
    setIsShiftModalOpen(false);
    setEditingShift(null);
  };

  useEffect(() => {
    const init = initializeFormData(initialData);
    setFormData(init);

    if (init.kualifikasi?.detailPendidikan) {
      setEduLevel(init.kualifikasi.detailPendidikan.tingkatPendidikan || 'S1 / D4');
      setSelectedMajors(init.kualifikasi.detailPendidikan.jurusan || ['Semua Jurusan (Terbuka Semua Jurusan Relevan)']);
      setEduDesc(init.kualifikasi.detailPendidikan.deskripsiPendidikan || '');
    }
    if (init.kualifikasi?.detailPengalaman && init.kualifikasi.detailPengalaman.length > 0) {
      setExpItems(init.kualifikasi.detailPengalaman);
    }
    if (init.kualifikasi?.detailSertifikasi && init.kualifikasi.detailSertifikasi.length > 0) {
      setCertItems(init.kualifikasi.detailSertifikasi);
    }
    if (init.kompetensi?.detailTeknis && init.kompetensi.detailTeknis.length > 0) {
      setHardSkillsDetailed(init.kompetensi.detailTeknis);
    }
    if (init.kompetensi?.detailNonTeknis && init.kompetensi.detailNonTeknis.length > 0) {
      setSoftSkillsDetailed(init.kompetensi.detailNonTeknis);
    }
  }, [initialData]);

  // Dynamic KPI Addition state
  const [isAddingKpi, setIsAddingKpi] = useState(false);
  const [newKpi, setNewKpi] = useState<Partial<KPIItem>>({
    nama: '',
    deskripsi: '',
    target: '100%',
    satuan: 'Persentase',
    bobot: 20,
    periode: 'Bulanan',
    caraPengukuran: ''
  });

  // Fetch dynamic payroll rules from IndexedDB (synced with Halaman Kompensasi)
  const dbRules = useLiveQuery(() => db.payrollRules.toArray(), []) || [];

  // Available Tunjangan list (Dynamic from db.payrollRules if available, fallback to MASTER_TUNJANGAN_LIST)
  const availableTunjanganList: TunjanganItem[] = useMemo(() => {
    const allowanceRules = dbRules.filter(
      r => r.category === 'Allowance' ||
           (r as any).kategori === 'Tunjangan Tetap' ||
           (r as any).kategori === 'Tunjangan Tidak Tetap' ||
           r.allowanceGroup === 'tunjangan' ||
           r.allowanceGroup === 'insentif'
    );
    if (allowanceRules.length > 0) {
      return allowanceRules.map(r => mapPayrollRuleToTunjanganItem(r));
    }
    return MASTER_TUNJANGAN_LIST;
  }, [dbRules]);

  // Available BPJS list (Dynamic from db.payrollRules if available, fallback to MASTER_BPJS_LIST)
  const availableBpjsList: BpjsItem[] = useMemo(() => {
    const bpjsRules = dbRules.filter(r => r.category === 'BPJS Health' || r.category === 'BPJS Employment');
    if (bpjsRules.length > 0) {
      return bpjsRules.map(r => mapPayrollRuleToBpjsItem(r));
    }
    return MASTER_BPJS_LIST;
  }, [dbRules]);

  // Filtered Tunjangan Groups
  const tunjanganTidakTetapList = useMemo(() => {
    return availableTunjanganList.filter(item => item.kategori === 'Tunjangan Tidak Tetap');
  }, [availableTunjanganList]);

  const bonusInsentifList = useMemo(() => {
    return availableTunjanganList.filter(item => item.kategori === 'Bonus & Insentif');
  }, [availableTunjanganList]);

  const tunjanganTetapList = useMemo(() => {
    return availableTunjanganList.filter(item => {
      return item.kategori !== 'Tunjangan Tidak Tetap' && item.kategori !== 'Bonus & Insentif';
    });
  }, [availableTunjanganList]);

  // Filtered BPJS Groups
  const bpjsKesehatanList = useMemo(() => {
    return availableBpjsList.filter(item => item.program === 'BPJS Kesehatan');
  }, [availableBpjsList]);

  const bpjsKetenagakerjaanList = useMemo(() => {
    return availableBpjsList.filter(item => item.program !== 'BPJS Kesehatan');
  }, [availableBpjsList]);

  // Synchronized Dynamic Master Options for Position Info ("Seputar" tab)
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    JOB_CATEGORIES.forEach(c => set.add(c));
    indexTemplates.forEach(t => {
      if (t.kategori?.trim()) set.add(t.kategori.trim());
    });
    if (formData.kategori?.trim()) set.add(formData.kategori.trim());
    return Array.from(set).sort().map(cat => ({ value: cat, label: cat }));
  }, [indexTemplates, formData.kategori]);

  const levelOptions = useMemo(() => {
    const set = new Set<string>();
    JOB_LEVELS.forEach(l => set.add(l));
    indexTemplates.forEach(t => {
      if (t.level?.trim()) set.add(t.level.trim());
    });
    if (formData.level?.trim()) set.add(formData.level.trim());
    return Array.from(set).map(lvl => ({ value: lvl, label: lvl }));
  }, [indexTemplates, formData.level]);

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    DEPARTMENTS.forEach(d => set.add(d));
    indexTemplates.forEach(t => {
      if (t.departemen?.trim()) set.add(t.departemen.trim());
    });
    if (formData.departemen?.trim()) set.add(formData.departemen.trim());
    return Array.from(set).sort().map(dept => ({ value: dept, label: dept }));
  }, [indexTemplates, formData.departemen]);

  const atasanOptions = useMemo(() => {
    const options: { value: string; label: string; subLabel?: string }[] = [
      { value: '', label: '-- Pilih Atasan Langsung --' },
      ...STANDARD_ATASAN_ROLES
    ];

    const existingValues = new Set(options.map(o => o.value.toLowerCase()));

    // Add positions from indexTemplates
    indexTemplates.forEach(tpl => {
      if (tpl.nama && !existingValues.has(tpl.nama.toLowerCase())) {
        existingValues.add(tpl.nama.toLowerCase());
        options.push({
          value: tpl.nama,
          label: tpl.nama,
          subLabel: `${tpl.level} • ${tpl.departemen}`
        });
      }
      if (formData.atasanLangsung === tpl.id && !existingValues.has(tpl.id.toLowerCase())) {
        existingValues.add(tpl.id.toLowerCase());
        options.push({
          value: tpl.id,
          label: tpl.nama,
          subLabel: `${tpl.level} • ${tpl.departemen} (${tpl.id})`
        });
      }
    });

    // Ensure currently assigned atasan is present
    if (formData.atasanLangsung && !existingValues.has(formData.atasanLangsung.toLowerCase())) {
      options.push({
        value: formData.atasanLangsung,
        label: formData.atasanLangsung,
        subLabel: 'Jabatan Atasan Saat Ini'
      });
    }

    return options;
  }, [indexTemplates, formData.atasanLangsung]);

  // Combobox Options for Facilities (synced with STANDARD_FACILITIES from daftar-fasilitas.ts)
  const facilityComboboxOptions = useMemo<ComboboxOption[]>(() => {
    const list: string[] = [...STANDARD_FACILITIES];
    // Include existing facilities from formData if they are custom
    formData.kompensasi.fasilitas.forEach(f => {
      if (f && f.trim() !== '' && !list.includes(f)) {
        list.push(f);
      }
    });
    return list.map(fac => ({
      value: fac,
      label: fac,
      sublabel: 'Fasilitas & Inventaris Standar'
    }));
  }, [formData.kompensasi.fasilitas]);

  // Combobox Options for Documents (synced with STANDARD_DOCUMENTS from daftar-dokumen.ts)
  const documentComboboxOptions = useMemo<ComboboxOption[]>(() => {
    const list: string[] = [...STANDARD_DOCUMENTS];
    // Include existing documents from formData if they are custom
    formData.dokumenAdministrasi.wajib.forEach(doc => {
      if (doc && doc.trim() !== '' && !list.includes(doc)) {
        list.push(doc);
      }
    });
    return list.map(doc => ({
      value: doc,
      label: doc,
      sublabel: 'Dokumen Persyaratan Standar'
    }));
  }, [formData.dokumenAdministrasi.wajib]);

  // Combobox Options for Hard Skills (synced with STANDARD_HARD_SKILLS from daftar-kompetensi.ts)
  const hardSkillComboboxOptions = useMemo<ComboboxOption[]>(() => {
    const list: string[] = [...STANDARD_HARD_SKILLS];
    // Include existing hard skills from formData if they are custom
    formData.kompetensi.teknis.forEach(skill => {
      if (skill && skill.trim() !== '' && !list.includes(skill)) {
        list.push(skill);
      }
    });
    return list.map(skill => ({
      value: skill,
      label: skill,
      sublabel: 'Kompetensi Teknis (Hard Skill)'
    }));
  }, [formData.kompetensi.teknis]);

  // Combobox Options for Soft Skills (synced with STANDARD_SOFT_SKILLS from daftar-kompetensi.ts)
  const softSkillComboboxOptions = useMemo<ComboboxOption[]>(() => {
    const list: string[] = [...STANDARD_SOFT_SKILLS];
    // Include existing soft skills from formData if they are custom
    formData.kompetensi.nonTeknis.forEach(skill => {
      if (skill && skill.trim() !== '' && !list.includes(skill)) {
        list.push(skill);
      }
    });
    return list.map(skill => ({
      value: skill,
      label: skill,
      sublabel: 'Kompetensi Non-Teknis (Soft Skill)'
    }));
  }, [formData.kompetensi.nonTeknis]);

  // Combobox Options for Dasar Ukur KPI (synced with STANDARD_DASAR_UKUR from daftar-dasar-ukur.ts)
  const dasarUkurComboboxOptions = useMemo<ComboboxOption[]>(() => {
    const list: string[] = [...STANDARD_DASAR_UKUR];
    // Include existing dasarUkur values from formData.kpi if custom
    formData.kpi.forEach(k => {
      if (k.dasarUkur && k.dasarUkur.trim() !== '' && !list.includes(k.dasarUkur)) {
        list.push(k.dasarUkur);
      }
    });
    return list.map(item => ({
      value: item,
      label: item,
      sublabel: 'Dasar Ukur Standar'
    }));
  }, [formData.kpi]);

  // Section Accordion Collapsed States (Default: ALL false = hidden)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tunjanganTetap: false,
    tunjanganTidakTetap: false,
    bonusInsentif: false,
    bpjsKesehatan: false,
    bpjsKetenagakerjaan: false,
    pajak: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Selected Counts for Collapsed Header Indicators (using robust normalizer & matching)
  const tunjanganTetapSelectedCount = useMemo(() => {
    return tunjanganTetapList.filter(item => isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList)).length;
  }, [tunjanganTetapList, formData.kompensasi.tunjangan, availableTunjanganList]);

  const tunjanganTidakTetapSelectedCount = useMemo(() => {
    return tunjanganTidakTetapList.filter(item => isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList)).length;
  }, [tunjanganTidakTetapList, formData.kompensasi.tunjangan, availableTunjanganList]);

  const bonusInsentifSelectedCount = useMemo(() => {
    return bonusInsentifList.filter(item => isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList)).length;
  }, [bonusInsentifList, formData.kompensasi.tunjangan, availableTunjanganList]);

  const bpjsKesehatanSelectedCount = useMemo(() => {
    return bpjsKesehatanList.filter(item => isBpjsSelected(formData.kompensasi.bpjs, item.id, availableBpjsList)).length;
  }, [bpjsKesehatanList, formData.kompensasi.bpjs, availableBpjsList]);

  const bpjsKetenagakerjaanSelectedCount = useMemo(() => {
    return bpjsKetenagakerjaanList.filter(item => isBpjsSelected(formData.kompensasi.bpjs, item.id, availableBpjsList)).length;
  }, [bpjsKetenagakerjaanList, formData.kompensasi.bpjs, availableBpjsList]);

  const pajakSelectedCount = useMemo(() => {
    const currentRuleId = normalizePajakId(formData.kompensasi.pajakRuleId || formData.kompensasi.pajak?.[0]);
    return currentRuleId ? 1 : 0;
  }, [formData.kompensasi.pajakRuleId, formData.kompensasi.pajak]);

  const [selectedTunjanganId, setSelectedTunjanganId] = useState<string>('');

  // ToggleSwitch (Seekbar) Component for smooth ON/OFF interaction
  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    activeColor?: string;
  }> = ({ checked, onChange, activeColor = 'bg-blue-600' }) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? activeColor : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    );
  };

  const handleToggleTunjangan = (id: string) => {
    const canonicalId = normalizeTunjanganId(id, availableTunjanganList);
    setFormData(prev => {
      const currentList = prev.kompensasi.tunjangan || [];
      const isAlreadySelected = isTunjanganSelected(currentList, id, availableTunjanganList);
      const nextTunjangan = isAlreadySelected
        ? currentList.filter(item => {
            const itemNorm = normalizeTunjanganId(item, availableTunjanganList);
            return itemNorm !== canonicalId && item !== id;
          })
        : [...currentList.map(item => normalizeTunjanganId(item, availableTunjanganList)), canonicalId];
      return {
        ...prev,
        kompensasi: {
          ...prev.kompensasi,
          tunjangan: Array.from(new Set(nextTunjangan.filter(Boolean)))
        }
      };
    });
  };

  const handleAddTunjangan = (id: string) => {
    if (!id) return;
    const canonicalId = normalizeTunjanganId(id, availableTunjanganList);
    setFormData(prev => {
      const currentList = prev.kompensasi.tunjangan || [];
      if (isTunjanganSelected(currentList, id, availableTunjanganList)) return prev;
      return {
        ...prev,
        kompensasi: {
          ...prev.kompensasi,
          tunjangan: Array.from(new Set([...currentList, canonicalId].filter(Boolean)))
        }
      };
    });
    setSelectedTunjanganId('');
  };

  const handleRemoveTunjangan = (id: string) => {
    const canonicalId = normalizeTunjanganId(id, availableTunjanganList);
    setFormData(prev => ({
      ...prev,
      kompensasi: {
        ...prev.kompensasi,
        tunjangan: (prev.kompensasi.tunjangan || []).filter(t => normalizeTunjanganId(t, availableTunjanganList) !== canonicalId && t !== id)
      }
    }));
  };

  const handleToggleBpjs = (bpjsId: string) => {
    const canonicalId = normalizeBpjsId(bpjsId, availableBpjsList);
    setFormData(prev => {
      const current = prev.kompensasi.bpjs || [];
      const exists = isBpjsSelected(current, bpjsId, availableBpjsList);
      const nextBpjs = exists
        ? current.filter(id => normalizeBpjsId(id, availableBpjsList) !== canonicalId && id !== bpjsId)
        : [...current.map(id => normalizeBpjsId(id, availableBpjsList)), canonicalId];
      return {
        ...prev,
        kompensasi: {
          ...prev.kompensasi,
          bpjs: Array.from(new Set(nextBpjs.filter(Boolean)))
        }
      };
    });
  };

  // Helper for adding empty dynamic list item
  const handleAddEmptyItem = (path: string) => {
    const keys = path.split('.');
    
    setFormData(prev => {
      const next = { ...prev };
      let curr: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        curr[keys[i]] = { ...curr[keys[i]] };
        curr = curr[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      curr[lastKey] = [...(curr[lastKey] || []), ''];
      return next;
    });
  };

  // Helper for adding dynamic list item with value
  const handleAddItem = (path: string, value: string) => {
    if (!value.trim()) return;
    const keys = path.split('.');
    
    setFormData(prev => {
      const next = { ...prev };
      let curr: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        curr[keys[i]] = { ...curr[keys[i]] };
        curr = curr[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      curr[lastKey] = [...(curr[lastKey] || []), value.trim()];
      return next;
    });
  };

  // Helper for updating dynamic list item
  const handleUpdateItem = (path: string, index: number, value: string) => {
    const keys = path.split('.');
    setFormData(prev => {
      const next = { ...prev };
      let curr: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        curr[keys[i]] = { ...curr[keys[i]] };
        curr = curr[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      const newArray = [...(curr[lastKey] || [])];
      newArray[index] = value;
      curr[lastKey] = newArray;
      return next;
    });
  };

  // Helper for removing dynamic list item
  const handleRemoveItem = (path: string, index: number) => {
    const keys = path.split('.');
    setFormData(prev => {
      const next = { ...prev };
      let curr: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        curr[keys[i]] = { ...curr[keys[i]] };
        curr = curr[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      curr[lastKey] = curr[lastKey].filter((_: any, i: number) => i !== index);
      return next;
    });
  };

  // Add KPI Card directly
  const handleAddKpiCard = () => {
    const newItem: KPIItem = {
      id: `KPI-CUST-${Date.now()}`,
      nama: '',
      deskripsi: '',
      minimumSkor: 75,
      bobot: 25,
      dasarUkur: ''
    };
    setFormData(prev => ({
      ...prev,
      kpi: [...prev.kpi, newItem]
    }));
  };

  // Update specific field in KPI item
  const handleUpdateKpiField = (index: number, field: keyof KPIItem, value: any) => {
    setFormData(prev => {
      const updated = [...prev.kpi];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return { ...prev, kpi: updated };
    });
  };

  // Remove KPI item at index
  const handleRemoveKpiIndex = (index: number) => {
    setFormData(prev => ({
      ...prev,
      kpi: prev.kpi.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nama.trim()) {
      errs.nama = 'Nama posisi wajib diisi';
    }
    if (!formData.departemen.trim()) {
      errs.departemen = 'Departemen wajib diisi';
    }
    if (!formData.tujuanJabatan.trim()) {
      errs.tujuanJabatan = 'Tujuan jabatan wajib diisi';
    }
    if (formData.tanggungJawab.filter(s => s.trim()).length === 0) {
      errs.tanggungJawab = 'Minimal isi 1 tanggung jawab';
    }
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      if (errs.nama || errs.departemen || errs.tujuanJabatan) {
        setActiveStep('posisi');
      } else if (errs.tanggungJawab) {
        setActiveStep('tugas');
      }
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanArray = (arr: string[]) => (arr || []).map(s => s.trim()).filter(Boolean);
    const existingId = initialData?.id || formData.id;
    const generatedId = `TPL-CUSTOM-${Date.now().toString(36).toUpperCase()}`;
    const structuredEduConfig: StructuredEducationConfig = {
      tingkatPendidikan: eduLevel,
      jurusan: selectedMajors,
      deskripsiPendidikan: eduDesc.trim() || undefined
    };

    const formattedEduString = formatEducationSummary(structuredEduConfig);
    const formattedExpString = formatExperienceSummary(expItems);
    const formattedCertList = formatCertificationSummaryList(certItems);
    const formattedTechSkillList = formatSkillSummaryList(hardSkillsDetailed);
    const formattedSoftSkillList = formatSkillSummaryList(softSkillsDetailed);

    const payload: JobTemplate = {
      ...formData,
      id: existingId || generatedId,
      kategori: formData.kategori || formData.departemen,
      fungsiUtama: cleanArray(formData.fungsiUtama),
      tanggungJawab: cleanArray(formData.tanggungJawab),
      wewenang: cleanArray(formData.wewenang),
      outputDiharapkan: cleanArray(formData.outputDiharapkan),
      hubunganKerja: {
        internal: cleanArray(formData.hubunganKerja.internal),
        eksternal: cleanArray(formData.hubunganKerja.eksternal),
      },
      kualifikasi: {
        ...formData.kualifikasi,
        pendidikan: formattedEduString || formData.kualifikasi.pendidikan,
        pengalaman: formattedExpString || formData.kualifikasi.pengalaman,
        sertifikasi: formattedCertList.length > 0 ? formattedCertList : cleanArray(formData.kualifikasi.sertifikasi),
        syaratKhusus: cleanArray(formData.kualifikasi.syaratKhusus),
        detailPendidikan: structuredEduConfig,
        detailPengalaman: expItems,
        detailSertifikasi: certItems
      },
      kompetensi: {
        teknis: formattedTechSkillList.length > 0 ? formattedTechSkillList : cleanArray(formData.kompetensi.teknis),
        nonTeknis: formattedSoftSkillList.length > 0 ? formattedSoftSkillList : cleanArray(formData.kompetensi.nonTeknis),
        detailTeknis: hardSkillsDetailed,
        detailNonTeknis: softSkillsDetailed
      },
      kompensasi: {
        ...formData.kompensasi,
        tunjangan: Array.from(new Set(formData.kompensasi.tunjangan || [])),
        bpjs: Array.from(new Set(formData.kompensasi.bpjs || [])),
        fasilitas: cleanArray(formData.kompensasi.fasilitas),
      },
      dokumenAdministrasi: {
        ...formData.dokumenAdministrasi,
        wajib: cleanArray(formData.dokumenAdministrasi.wajib),
      }
    };

    onSave(payload);
  };

  // Reusable List Editor with blue "Tambah" text button at header & inline editable input rows with trash icon
  const ListEditor = ({
    label,
    items,
    path,
    placeholder = '',
    comboboxOptions
  }: {
    label: string;
    items: string[];
    path: string;
    placeholder?: string;
    comboboxOptions?: ComboboxOption[];
  }) => {
    const onAddRow = () => {
      handleAddEmptyItem(path);
    };

    return (
      <div className="space-y-2">
        {/* Title Header with Blue Text "Tambah" Button on the Right */}
        <div className="flex items-center justify-between gap-2">
          <label className="block text-[11px] font-normal text-slate-600 mb-1">{label}</label>
          <button
            type="button"
            onClick={onAddRow}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors cursor-pointer shrink-0 mb-1"
            title="Tambah Baris Input"
            aria-label={`Tambah ${label}`}
          >
            Tambah
          </button>
        </div>

        {/* List Input Rows */}
        {items.length === 0 ? (
          <div 
            onClick={onAddRow}
            className="p-3 border border-dashed border-slate-200/90 rounded-xl bg-slate-50/50 hover:bg-blue-50/20 hover:border-blue-300 text-center text-xs text-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
            <span>Klik Tambah untuk menambah list</span>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {comboboxOptions ? (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-[11px] font-normal text-slate-400 select-none shrink-0 w-4 text-right">
                      {idx + 1}.
                    </span>
                    <div className="flex-1">
                      <ComboboxInput
                        value={item}
                        onChange={(val) => handleUpdateItem(path, idx, val)}
                        options={comboboxOptions}
                        placeholder={placeholder || 'Pilih dari daftar atau ketik kustom...'}
                        customPromptText="sebagai opsi kustom"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center bg-white border border-slate-200/90 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-xl px-3 py-1.5 min-h-[36px] transition-all shadow-2xs">
                    <span className="text-[11px] font-normal text-slate-400 mr-2 select-none">{idx + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdateItem(path, idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          onAddRow();
                        }
                      }}
                      placeholder={placeholder}
                      className="w-full text-xs font-normal text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(path, idx)}
                  className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Hapus Baris"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const pageTitle = isEditMode
    ? "Edit Jobdesk"
    : isTemplateMode
    ? "Buat Jobdesk dari Template"
    : "Buat Jobdesk Baru";

  const pageSubtitle = isEditMode
    ? `Formulir perbaikan & edit jobdesk ${formData.nama ? `posisi ${formData.nama}` : ''}`
    : isTemplateMode
    ? `Formulir pembuatan jobdesk berbasis template ${formData.nama}`
    : "Formulir pembuatan jobdesk baru dari awal";

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Dynamic Header & Mobile Bottom Portal */}
      <PageHeaderTitle 
        title={pageTitle} 
        subtitle={pageSubtitle} 
        onBack={onBack} 
        hideHamburger={true} 
      />
      
      {/* Mobile Header Action Portal (Chevron Toggle & Simpan Button) */}
      <MobileHeaderActions>
        <button
          type="button"
          onClick={() => setShowTabs(!showTabs)}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          title={showTabs ? "Sembunyikan Tab Navigasi" : "Tampilkan Tab Navigasi"}
          aria-label="Toggle Tab Navigasi"
        >
          <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${!showTabs ? 'rotate-180' : ''}`} />
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
        >
          <Check className="w-3.5 h-3.5" /> {isEditMode ? "Simpan Perubahan" : "Simpan Posisi"}
        </button>
      </MobileHeaderActions>

      {/* Desktop Header Action Buttons Portal */}
      <DesktopHeaderActions>
        <button
          type="button"
          onClick={() => setShowTabs(!showTabs)}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center mr-1"
          title={showTabs ? "Sembunyikan Tab Navigasi" : "Tampilkan Tab Navigasi"}
          aria-label="Toggle Tab Navigasi"
        >
          <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${!showTabs ? 'rotate-180' : ''}`} />
        </button>
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-2xs"
        >
          <Check className="w-4 h-4" /> {isEditMode ? "Simpan Perubahan" : "Simpan Posisi"}
        </button>
      </DesktopHeaderActions>

      {/* Full-width Compact Tabs Bar - Content Proportional & Rendered in Header when showTabs is true */}
      {showTabs && (
        <PageHeaderSubbar>
          <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
            {([
              { id: 'posisi' as StepType, label: 'seputar' },
              { id: 'tugas' as StepType, label: 'tugas & daily' },
              { id: 'kpi' as StepType, label: 'KPI' },
              { id: 'kualifikasi' as StepType, label: 'kualifikasi' },
              { id: 'kompensasi' as StepType, label: 'kompensasi' },
              { id: 'waktu_kerja' as StepType, label: 'waktu kerja & shift' },
            ]).map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStep(tab.id)}
                className={`py-2 text-xs capitalize transition-all relative cursor-pointer px-1.5 sm:px-3 text-center shrink-0 ${
                  activeStep === tab.id
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 font-medium hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {activeStep === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                )}
              </button>
            ))}
          </div>
        </PageHeaderSubbar>
      )}

      {/* Main Direct Page Layout with balanced tight top padding to clear fixed tab header */}
      <div className={`w-full max-w-7xl mx-auto pb-10 transition-all duration-200 ${showTabs ? 'pt-1 sm:pt-2' : 'pt-0'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: SEPUTAR POSISI */}
          {activeStep === 'posisi' && (
            <SectionJobDetails
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              activeStep="posisi"
              categoryOptions={categoryOptions}
              departmentOptions={departmentOptions}
              levelOptions={levelOptions}
              atasanOptions={atasanOptions}
              dasarUkurComboboxOptions={dasarUkurComboboxOptions}
              handleUpdateItem={handleUpdateItem}
              handleRemoveItem={handleRemoveItem}
              handleAddRow={handleAddEmptyItem}
              handleAddKpiCard={handleAddKpiCard}
              handleUpdateKpiField={handleUpdateKpiField}
              handleRemoveKpiIndex={handleRemoveKpiIndex}
            />
          )}

          {activeStep === 'tugas' && (
            <SectionJobDetails
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              activeStep="tugas"
              categoryOptions={categoryOptions}
              departmentOptions={departmentOptions}
              levelOptions={levelOptions}
              atasanOptions={atasanOptions}
              dasarUkurComboboxOptions={dasarUkurComboboxOptions}
              handleUpdateItem={handleUpdateItem}
              handleRemoveItem={handleRemoveItem}
              handleAddRow={handleAddEmptyItem}
              handleAddKpiCard={handleAddKpiCard}
              handleUpdateKpiField={handleUpdateKpiField}
              handleRemoveKpiIndex={handleRemoveKpiIndex}
            />
          )}

          {activeStep === 'kpi' && (
            <SectionJobDetails
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              activeStep="kpi"
              categoryOptions={categoryOptions}
              departmentOptions={departmentOptions}
              levelOptions={levelOptions}
              atasanOptions={atasanOptions}
              dasarUkurComboboxOptions={dasarUkurComboboxOptions}
              handleUpdateItem={handleUpdateItem}
              handleRemoveItem={handleRemoveItem}
              handleAddRow={handleAddEmptyItem}
              handleAddKpiCard={handleAddKpiCard}
              handleUpdateKpiField={handleUpdateKpiField}
              handleRemoveKpiIndex={handleRemoveKpiIndex}
            />
          )}

          {activeStep === 'kualifikasi' && (
            <SectionCompetencies
              formData={formData}
              eduLevel={eduLevel}
              setEduLevel={setEduLevel}
              selectedMajors={selectedMajors}
              setSelectedMajors={setSelectedMajors}
              eduDesc={eduDesc}
              setEduDesc={setEduDesc}
              expItems={expItems}
              setExpItems={setExpItems}
              certItems={certItems}
              setCertItems={setCertItems}
              hardSkillsDetailed={hardSkillsDetailed}
              setHardSkillsDetailed={setHardSkillsDetailed}
              softSkillsDetailed={softSkillsDetailed}
              setSoftSkillsDetailed={setSoftSkillsDetailed}
              hardSkillComboboxOptions={hardSkillComboboxOptions}
              softSkillComboboxOptions={softSkillComboboxOptions}
              documentComboboxOptions={documentComboboxOptions}
              handleUpdateItem={handleUpdateItem}
              handleRemoveItem={handleRemoveItem}
              handleAddRow={handleAddEmptyItem}
            />
          )}

          {activeStep === 'kompensasi' && (
            <SectionCompensation
              formData={formData}
              setFormData={setFormData}
              availableTunjanganList={availableTunjanganList}
              availableBpjsList={availableBpjsList}
              tunjanganTetapList={tunjanganTetapList}
              tunjanganTidakTetapList={tunjanganTidakTetapList}
              bonusInsentifList={bonusInsentifList}
              bpjsKesehatanList={bpjsKesehatanList}
              bpjsKetenagakerjaanList={bpjsKetenagakerjaanList}
              facilityComboboxOptions={facilityComboboxOptions}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleToggleTunjangan={handleToggleTunjangan}
              handleToggleBpjs={handleToggleBpjs}
              handleUpdateItem={handleUpdateItem}
              handleRemoveItem={handleRemoveItem}
              handleAddRow={handleAddEmptyItem}
            />
          )}

          {activeStep === 'waktu_kerja' && (
            <SectionWorkSchedule
              formData={formData}
              setFormData={setFormData}
              availableShiftPatterns={availableShiftPatterns}
              nonOffShifts={nonOffShifts}
              openShiftModal={openShiftModal}
              openPatternModal={() => {
                setEditingPattern(null);
                setPatternFormData({
                  name: '',
                  description: '',
                  cycle: []
                });
                setSelectedTemplateId('');
                setIsPatternModalOpen(true);
              }}
              isPatternModalOpen={isPatternModalOpen}
            />
          )}
        </form>
      </div>

      {/* Modal Pattern Form (Buat Customisasi Shift - Tersinkron dengan Pengaturan Jadwal) */}
      <ModalPatternForm
        isOpen={isPatternModalOpen}
        editingPattern={editingPattern}
        patternFormData={patternFormData}
        setPatternFormData={setPatternFormData}
        onClose={() => setIsPatternModalOpen(false)}
        onSubmit={handleSavePatternSubmit}
        rotationTemplates={rotationTemplates}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        onApplyTemplate={handleApplyTemplate}
        activeConfig={attendanceConfig}
        availableShifts={availableShifts}
        hasPagiSiangMalam={hasPagiSiangMalam}
      />

      {/* Modal Shift Form (Master Shift Operasional Kerja - Tersinkron dengan Pengaturan Jadwal) */}
      <ModalShiftForm
        isOpen={isShiftModalOpen}
        editingShift={editingShift}
        shiftFormData={shiftFormData}
        setShiftFormData={setShiftFormData}
        onClose={() => {
          setIsShiftModalOpen(false);
          setEditingShift(null);
        }}
        onSubmit={handleSaveShiftSubmit}
      />
    </div>
  );
};
