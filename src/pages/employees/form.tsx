import React from 'react';
import { 
  User, Home, Briefcase, Landmark, Wallet, ShieldAlert, Folder, 
  Trash2, PlusCircle, Plus, ExternalLink, ChevronDown, ChevronUp, Phone,
  FileText, HeartHandshake, ShieldCheck, Sparkles, Info, X, Save,
  Calendar, RotateCcw
} from 'lucide-react';
import { MobileBottomBar, DesktopHeaderActions, PageHeaderTitle } from '../../context/MobileNavContext';
import { Button, Input, Select, ComboboxInput, ComboboxOption } from '../../components/ui';
import { Employee, EmployeeDocument, BpjsKetenagakerjaanProfile, BpjsKesehatanProfile, TaxProfile } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  BANK_OPTIONS, PAYMENT_METHOD_OPTIONS, RESIDENCE_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS, mapEmployeeTypeToTaxType, mapContractTypeToEmployeeType
} from './constants';
import { 
  INDONESIA_CITY_OPTIONS, 
  getFilteredFinancialOptions, 
  JOB_LEVELS, 
  STANDARD_DOCUMENTS,
  masterTunjangan 
} from '../../data/master';
import { TaxProfileSection } from './section-tax-profile';
import { BpjsKesehatanSection } from './section-bpjs-kesehatan';
import { BpjsKetenagakerjaanSection } from './section-bpjs-ketenagakerjaan';
import { PersonalInfoSection } from './section-personal-info';
import { AddressSection } from './section-address';
import { EmploymentSection } from './section-employment';
import { SalarySection } from './section-salary';
import { BankSection } from './section-bank';
import { DocumentSection } from './section-document';
import { getPositionName, getPositionDetails, exportAndSavePosition, getDefaultSalaryForLevel, PositionDetails } from '../../services/positionService';
import { calculateAllowancePreview } from '../../utils/allowanceCalculator';
import { calculateTunjanganJabatan, isTunjanganJabatanName, matchJenjangByLevel } from '../../services/tunjanganJabatanService';
import { getAllowanceCategory, isFixedAllowance } from '../../utils/allowanceClassification';
import { cn } from '../../utils/cn';

interface EmployeeFormProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  editingEmployeeId: string | null;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  collapsedSections: Record<string, boolean>;
  toggleSection: (sectionKey: string) => void;
  allowanceOptions: ComboboxOption[];
  documentOptions: ComboboxOption[];
  departmentOptions?: ComboboxOption[];
  positionOptions?: ComboboxOption[];
  bankOptions?: ComboboxOption[];
  bpjsOptions?: ComboboxOption[];
  taxOptions?: ComboboxOption[];
}

const formatDateDisplay = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(m, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(d, 10)} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};
const formatBirthDateDisplay = formatDateDisplay;

export function EmployeeForm({
  formData, setFormData, editingEmployeeId, onSave, onCancel,
  collapsedSections, toggleSection, allowanceOptions, documentOptions,
  departmentOptions = [], positionOptions = [], bankOptions = [],
  bpjsOptions = [], taxOptions = []
}: EmployeeFormProps) {
  const [showHealthReg, setShowHealthReg] = React.useState(false);
  const [showEmploymentReg, setShowEmploymentReg] = React.useState(false);

  const paymentMethod = formData.paymentMethod || 'Transfer Bank';
  const isEwalletMethod = paymentMethod.toLowerCase().includes('ewallet') || paymentMethod.toLowerCase().includes('wallet') || paymentMethod.toLowerCase().includes('dompet');
  const isBankMethod = paymentMethod.toLowerCase().includes('bank') || paymentMethod.toLowerCase().includes('transfer');

  const customBankNames = React.useMemo(() => {
    return bankOptions.map(b => b.value);
  }, [bankOptions]);

  const currentFinancialOptions = React.useMemo(() => {
    return getFilteredFinancialOptions(paymentMethod, customBankNames);
  }, [paymentMethod, customBankNames]);

  const categoryOptions = React.useMemo<ComboboxOption[]>(() => {
    const standardCategories = [
      'Eksekutif / C-Level',
      'Manajemen / Manajerial',
      'Teknologi & IT',
      'Operasional & Lapangan',
      'Pemasaran & Penjualan',
      'Keuangan & Akuntansi',
      'SDM & General Affairs',
      'Supply Chain & Logistik',
      'Kreatif & Desain',
      'Layanan Pelanggan / CS',
      'Produksi & Manufaktur',
      'F&B & Hospitality',
      'Legal & Kepatuhan',
      'Administrasi / Back Office',
    ];

    const dynamicCategories = new Set<string>(standardCategories);

    positionOptions.forEach(opt => {
      if (opt.data?.category) dynamicCategories.add(opt.data.category);
    });

    if (formData.category) {
      dynamicCategories.add(formData.category);
    }

    return Array.from(dynamicCategories)
      .filter(Boolean)
      .map(cat => ({
        value: cat,
        label: cat,
      }));
  }, [positionOptions, formData.category]);

  const levelOptions = React.useMemo<ComboboxOption[]>(() => {
    const levels = [...JOB_LEVELS];
    if (formData.level && !levels.includes(formData.level as any)) {
      levels.push(formData.level as any);
    }
    return levels.map(lvl => ({ value: lvl, label: lvl }));
  }, [formData.level]);

  const effectiveDepartmentOptions = React.useMemo<ComboboxOption[]>(() => {
    const standardDepts = [
      'Direksi & Manajemen Eksekutif',
      'Sumber Daya Manusia (HRD)',
      'Keuangan & Akuntansi (Finance & Accounting)',
      'Teknologi Informasi (IT & Tech)',
      'Pemasaran & Komunikasi (Marketing & Comm)',
      'Penjualan & Pengembangan Bisnis (Sales & BD)',
      'Operasional (Operations)',
      'Rantai Pasok & Logistik (Supply Chain & Logistics)',
      'Layanan Pelanggan (Customer Support)',
      'Legal & Kepatuhan (Legal & Compliance)',
      'Produksi & Manufaktur (Production & Manufacturing)',
      'Riset & Pengembangan (R&D)',
      'Kreatif & Konten (Creative & Content)',
      'F&B & Hospitality'
    ];

    const deptMap = new Map<string, ComboboxOption>();

    (departmentOptions || []).forEach(d => {
      deptMap.set(d.value, d);
    });

    standardDepts.forEach(d => {
      if (!deptMap.has(d)) {
        deptMap.set(d, { value: d, label: d });
      }
    });

    positionOptions.forEach(p => {
      if (p.data?.department && !deptMap.has(p.data.department)) {
        deptMap.set(p.data.department, { value: p.data.department, label: p.data.department });
      }
    });

    if (formData.departmentId && !deptMap.has(formData.departmentId)) {
      deptMap.set(formData.departmentId, { value: formData.departmentId, label: formData.departmentId });
    }

    return Array.from(deptMap.values());
  }, [departmentOptions, positionOptions, formData.departmentId]);

  const divisionOptions = React.useMemo<ComboboxOption[]>(() => {
    const standardDivisions = [
      'Direksi',
      'Head Office',
      'Product & Technology',
      'Engineering & IT Infrastructure',
      'Finance, Accounting & Tax',
      'People & Organization (HR)',
      'Marketing & Brand Strategy',
      'Sales & Account Management',
      'Business Development',
      'Supply Chain, Logistics & Procurement',
      'Operations & Facility Management',
      'Customer Experience & Support',
      'Quality Assurance & Control',
      'Creative Studio & Content',
      'Restaurant & Kitchen Operations',
      'Legal, Corporate Secretarial & Compliance',
      'Plant & Factory Operations'
    ];

    const divSet = new Set<string>(standardDivisions);

    positionOptions.forEach(p => {
      if (p.data?.division) divSet.add(p.data.division);
    });

    if (formData.division) {
      divSet.add(formData.division);
    }

    return Array.from(divSet)
      .filter(Boolean)
      .map(d => ({ value: d, label: d }));
  }, [positionOptions, formData.division]);

  const availableDocSelectOptions = React.useMemo(() => {
    const list = [
      ...STANDARD_DOCUMENTS,
      ...(documentOptions?.map(o => o.value || o.label) || []),
      'KTP (Kartu Tanda Penduduk)',
      'Kartu Keluarga (KK)',
      'NPWP (Nomor Pokok Wajib Pajak)',
      'Pas Foto Terbaru (Formal)',
      'Buku Rekening Payroll / Tabungan',
      'Kartu BPJS Kesehatan',
      'Kartu BPJS Ketenagakerjaan',
      'Curriculum Vitae (CV)',
      'Ijazah Terakhir',
      'Transkrip Nilai',
      'Surat Pengalaman Kerja (Paklaring)',
      'Portofolio Karya / Rekam Jejak Proyek',
      'Sertifikat Kompetensi / BNSP',
      'Sertifikat Pelatihan / Kursus Terkait',
      'SKCK (Surat Keterangan Catatan Kepolisian)',
      'Surat Keterangan Sehat dari Dokter',
      'Surat Bebas Narkoba (SKBN)',
      'Surat Keterangan Bebas Buta Warna',
      'Hasil Medical Check-Up (MCU)',
      'Pakta Integritas / Surat Pernyataan Kepatuhan',
      'Surat Perjanjian Kerja / Kontrak (PKWT/PKWTT)',
      'Surat Izin Operator (SIO)',
      'Lainnya / Berkas Tambahan'
    ];

    const uniqueDocs = Array.from(new Set(list.filter(Boolean)));
    return uniqueDocs.map(name => ({ value: name, label: name }));
  }, [documentOptions]);

  const getAllowanceCategoryAndFrequency = React.useCallback((allowanceName: string, ruleData?: any) => {
    if (!allowanceName || allowanceName.trim() === '') {
      return { category: '-', frequency: '-', method: '-' };
    }

    const nameLower = allowanceName.toLowerCase();

    // 1. Kategori: Tunjangan Tetap | Tunjangan Tidak Tetap | Bonus & Insentif (terpusat)
    const category = getAllowanceCategory(allowanceName, ruleData);

    // 2. Frekuensi
    let frequency = ruleData?.frekuensi_pembayaran || ruleData?.paymentPeriod;
    if (!frequency) {
      if (nameLower.includes('makan') || nameLower.includes('transport') || nameLower.includes('kehadiran') || nameLower.includes('harian')) {
        frequency = 'Harian';
      } else if (nameLower.includes('thr') || nameLower.includes('hari raya') || nameLower.includes('tahunan') || nameLower.includes('bonus')) {
        frequency = 'Tahunan';
      } else if (nameLower.includes('triwulan')) {
        frequency = 'Triwulanan';
      } else {
        frequency = 'Bulanan';
      }
    } else {
      const freqLower = String(frequency).toLowerCase();
      if (freqLower === 'bulanan' || freqLower === 'monthly') frequency = 'Bulanan';
      else if (freqLower === 'harian' || freqLower === 'daily') frequency = 'Harian';
      else if (freqLower === 'tahunan' || freqLower === 'annual' || freqLower === 'yearly') frequency = 'Tahunan';
      else if (freqLower === 'triwulanan' || freqLower === 'quarterly') frequency = 'Triwulanan';
      else if (freqLower === 'insidental' || freqLower === 'incidental') frequency = 'Insidental';
      else frequency = frequency.charAt(0).toUpperCase() + frequency.slice(1);
    }

    // 3. Metode Perhitungan
    let method = 'Nominal Tetap';
    const isProrata = Boolean(
      ruleData?.metode_perhitungan === 'prorata' ||
      ruleData?.calculationModel === 'prorata' ||
      nameLower.includes('thr') ||
      nameLower.includes('hari raya')
    );

    const isTiered = Boolean(
      ruleData?.metode_perhitungan === 'berjenjang' ||
      ruleData?.calculationModel === 'tiered' ||
      ruleData?.ruleType === 'Tiered' ||
      nameLower.includes('berjenjang') ||
      nameLower.includes('jabatan')
    );

    const isAttendance = Boolean(
      ruleData?.metode_perhitungan === 'unit_kehadiran' ||
      ruleData?.calculationModel === 'attendance' ||
      ruleData?.ruleType === 'Attendance' ||
      ruleData?.dasar_perhitungan?.toLowerCase().includes('kehadiran') ||
      ruleData?.dasar_perhitungan?.toLowerCase().includes('hari kerja') ||
      nameLower.includes('makan') ||
      nameLower.includes('transport') ||
      nameLower.includes('kehadiran') ||
      nameLower.includes('shift') ||
      nameLower.includes('lembur')
    );

    const isPercentage = Boolean(
      ruleData?.metode_perhitungan === 'persentase' ||
      ruleData?.calculationModel === 'percentage' ||
      ruleData?.ruleType === 'Percentage' ||
      ruleData?.satuan_nilai === 'persen' ||
      ruleData?.dasar_perhitungan?.toLowerCase().includes('gaji')
    );

    if (isTiered) {
      method = 'Berjenjang';
    } else if (isProrata) {
      method = 'Prorata';
    } else if (isAttendance) {
      method = 'Kehadiran';
    } else if (isPercentage) {
      method = 'Persentase';
    } else if (ruleData?.metode_perhitungan) {
      const mLower = String(ruleData.metode_perhitungan).toLowerCase();
      if (mLower === 'nominal_tetap' || mLower === 'flat' || mLower === 'fixed') method = 'Nominal Tetap';
      else if (mLower === 'berjenjang' || mLower === 'tiered') method = 'Berjenjang';
      else if (mLower === 'persentase' || mLower === 'percentage') method = 'Persentase';
      else if (mLower === 'prorata') method = 'Prorata';
      else if (mLower === 'unit_kehadiran' || mLower === 'attendance') method = 'Kehadiran';
      else method = ruleData.metode_perhitungan.charAt(0).toUpperCase() + ruleData.metode_perhitungan.slice(1);
    }

    return { category, frequency, method };
  }, []);

  const availableAllowanceSelectOptions = React.useMemo(() => {
    const optionsMap = new Map<string, { value: string; label: string; subLabel?: string }>();

    optionsMap.set('tunjangan-jabatan', {
      value: 'tunjangan-jabatan',
      label: 'Tunjangan Jabatan',
      subLabel: 'Tunjangan Level Jabatan'
    });

    allowanceOptions.forEach(opt => {
      const valKey = String(opt.value || opt.label);
      if (!optionsMap.has(valKey)) {
        optionsMap.set(valKey, {
          value: valKey,
          label: opt.label,
          subLabel: opt.sublabel
        });
      }
    });

    masterTunjangan.forEach(m => {
      const name = m.name || m.nama;
      if (name && !optionsMap.has(m.id) && !Array.from(optionsMap.values()).some(o => o.label.toLowerCase() === name.toLowerCase())) {
        optionsMap.set(m.id, {
          value: m.id,
          label: name,
          subLabel: (m as any).keterangan || (m as any).deskripsi || (m as any).description || undefined
        });
      }
    });

    return Array.from(optionsMap.values());
  }, [allowanceOptions]);

  const groupedAllowances = React.useMemo(() => {
    const allowances = formData.allowances || [];
    const DEFAULT_CATEGORIES = ['Tunjangan Tetap', 'Tunjangan Tidak Tetap', 'Bonus & Insentif'];
    const groups: { category: string; items: any[] }[] = [];
    const categoryMap = new Map<string, any[]>();
    const unselected: any[] = [];

    DEFAULT_CATEGORIES.forEach(cat => {
      categoryMap.set(cat, []);
    });

    allowances.forEach(allowance => {
      if (!allowance.name || allowance.name.trim() === '') {
        unselected.push(allowance);
        return;
      }

      const matchedOpt = allowanceOptions.find(
        o => (allowance.ruleId && o.value === allowance.ruleId) || o.label.toLowerCase() === allowance.name.toLowerCase()
      );
      const ruleData = matchedOpt?.data || masterTunjangan.find(
        m => (allowance.ruleId && m.id === allowance.ruleId) || (m.name || m.nama || '').toLowerCase() === allowance.name.toLowerCase()
      );
      const catFreq = getAllowanceCategoryAndFrequency(allowance.name, ruleData);
      const cat = catFreq.category && catFreq.category !== '-' ? catFreq.category : 'Tunjangan Tetap';

      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(allowance);
    });

    categoryMap.forEach((items, cat) => {
      if (items.length > 0) {
        groups.push({ category: cat, items });
      }
    });

    return { groups, unselected };
  }, [formData.allowances, allowanceOptions, getAllowanceCategoryAndFrequency]);

  const handleAllowanceSelectChange = (allowanceId: string, selectedValue: string) => {
    if (!selectedValue) return;

    const matchedComboOpt = allowanceOptions.find(
      o => String(o.value) === selectedValue || o.label.toLowerCase() === selectedValue.toLowerCase()
    );

    if (matchedComboOpt) {
      handleSelectAllowanceOption(allowanceId, matchedComboOpt);
    } else {
      const ruleDef = masterTunjangan.find(
        m => m.id === selectedValue || (m.name && m.name.toLowerCase() === selectedValue.toLowerCase()) || (m.nama && m.nama.toLowerCase() === selectedValue.toLowerCase())
      );
      if (ruleDef) {
        handleSelectAllowanceOption(allowanceId, {
          value: ruleDef.id,
          label: ruleDef.name || ruleDef.nama || selectedValue,
          data: ruleDef
        });
      } else {
        handleSelectAllowanceOption(allowanceId, {
          value: selectedValue,
          label: selectedValue
        });
      }
    }
  };

  const handleAddDocRow = () => {
    setFormData(prev => ({
      ...prev,
      documents: [
        { id: uuidv4(), name: "", url: "", category: "Lainnya" },
        ...(prev.documents || [])
      ]
    }));
  };

  const handleUpdateDocName = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.map(d => d.id === id ? { ...d, name } : d) || []
    }));
  };

  const handleUpdateDocUrl = (id: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.map(d => d.id === id ? { ...d, url } : d) || []
    }));
  };

  const handleRemoveDoc = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.filter(d => d.id !== id) || []
    }));
  };

  const prevPositionIdRef = React.useRef<string | undefined>(formData.positionId);
  const isInitialMount = React.useRef(true);

  /**
   * Intensive Documents Reset & Rewrite:
   * - Completely rebuilds document requirements from the new position's template (Wajib, Pendukung, Khusus).
   * - Retains any already uploaded documents (with non-empty url).
   * - Discards old empty placeholder documents that are not required by the new position.
   */
  const buildDocumentsForPosition = (
    currentDocs: EmployeeDocument[] = [],
    details: PositionDetails | null
  ): EmployeeDocument[] => {
    const nextDocs: EmployeeDocument[] = [];
    const processed = new Set<string>();

    const existingMap = new Map<string, EmployeeDocument>();
    currentDocs.forEach(d => {
      if (d.name && d.name.trim()) {
        existingMap.set(d.name.trim().toLowerCase(), d);
      }
    });

    const addRequiredDoc = (docName: string, category: string) => {
      const clean = docName.trim();
      if (!clean) return;
      const lower = clean.toLowerCase();
      if (processed.has(lower)) return;
      processed.add(lower);

      const existing = existingMap.get(lower);
      if (existing && existing.url && existing.url.trim() !== '') {
        nextDocs.push({
          ...existing,
          category: existing.category || category
        });
      } else {
        nextDocs.push({
          id: existing?.id || uuidv4(),
          name: clean,
          url: '',
          category: category
        });
      }
    };

    // 1. Selalu sertakan Pas Foto / Foto Profil Karyawan secara baku
    addRequiredDoc('Pas Foto Terbaru (Foto Profil)', 'Wajib');

    const adminDocs = details?.dokumenAdministrasi;
    if (adminDocs && (adminDocs.wajib?.length || adminDocs.pendukung?.length || adminDocs.khusus?.length)) {
      adminDocs.wajib?.forEach(name => addRequiredDoc(name, 'Wajib'));
      adminDocs.pendukung?.forEach(name => addRequiredDoc(name, 'Pendukung'));
      adminDocs.khusus?.forEach(name => addRequiredDoc(name, 'Khusus'));
    } else if (details?.requiredDocuments && details.requiredDocuments.length > 0) {
      details.requiredDocuments.forEach(name => addRequiredDoc(name, 'Persyaratan Jabatan'));
    } else {
      ['KTP', 'NPWP', 'Kartu Keluarga', 'Ijazah Terakhir', 'Surat Perjanjian Kerja'].forEach(name =>
        addRequiredDoc(name, 'Wajib')
      );
    }

    // Preserve any existing documents only if they have an uploaded file URL
    currentDocs.forEach(d => {
      if (d.url && d.url.trim() !== '' && d.name) {
        const lower = d.name.trim().toLowerCase();
        if (!processed.has(lower)) {
          nextDocs.push({
            ...d,
            category: d.category || 'Dokumen Tambahan'
          });
          processed.add(lower);
        }
      }
    });

    return nextDocs;
  };

  /**
   * Intensive Allowances Reset & Rewrite:
   * - Completely rebuilds allowances according to the new position.
   * - Recalculates Tunjangan Jabatan based on the new level and basic salary.
   * - Extracts and computes nominal for all allowances defined in the new position's template.
   */
  const buildAllowancesForPosition = (
    positionAllowanceIds: string[],
    level: string,
    salary: number
  ) => {
    const updatedAllowances: any[] = [];
    const addedRuleIds = new Set<string>();
    const addedNames = new Set<string>();

    // 1. Tunjangan Jabatan is primary and recalculated fresh for the new level & salary
    const tjCalc = calculateTunjanganJabatan(level, salary);
    updatedAllowances.push({
      id: uuidv4(),
      name: 'Tunjangan Jabatan',
      amount: tjCalc.nominal,
      ruleId: 'tunjangan-jabatan',
      category: 'Tunjangan Tetap'
    });
    addedRuleIds.add('tunjangan-jabatan');
    addedNames.add('tunjangan jabatan');

    // 2. Position specific allowances from template
    positionAllowanceIds.forEach(id => {
      if (!id || id === 'tunjangan-jabatan') return;
      const lowerId = id.toLowerCase().trim();
      if (addedRuleIds.has(lowerId)) return;

      const opt = allowanceOptions.find(o => o.value === id || o.label.toLowerCase() === lowerId);
      const ruleDef = opt?.data || masterTunjangan.find(m => m.id === id || m.name.toLowerCase() === lowerId);
      const ruleName = opt?.label || ruleDef?.name || ruleDef?.nama || id;
      if (addedNames.has(ruleName.toLowerCase())) return;

      let initAmt = 0;
      if (ruleDef) {
        const isProrata = (ruleDef.metode_perhitungan === 'prorata' || ruleDef.calculationModel === 'prorata') ||
          ruleName.toUpperCase().includes('THR') || ruleName.toLowerCase().includes('hari raya');

        if (isProrata) {
          const pct = ruleDef.nilai || 100;
          initAmt = Math.round((pct / 100) * salary);
        } else {
          const calc = calculateAllowancePreview(ruleDef, {
            basicSalary: salary,
            level: level,
            serviceMonths: 12,
            daysAttended: 22,
            workingDaysInMonth: 25
          });
          if (calc && calc.amount > 0) {
            initAmt = calc.amount;
          } else if (ruleDef.fixedAmount) {
            initAmt = ruleDef.fixedAmount;
          } else if (ruleDef.nilai) {
            initAmt = ruleDef.nilai;
          }
        }
      } else if (opt && opt.amount) {
        initAmt = opt.amount;
      }

      const assignedCategory = getAllowanceCategory(ruleName, ruleDef);

      updatedAllowances.push({
        id: uuidv4(),
        name: ruleName,
        amount: initAmt,
        ruleId: id,
        category: assignedCategory
      });
      addedRuleIds.add(lowerId);
      addedNames.add(ruleName.toLowerCase());
    });

    return updatedAllowances;
  };

  /**
   * Intensive BPJS Reset & Rewrite:
   * - Resets BPJS Ketenagakerjaan programs (JHT, JKK, JKM, JP, JKP) and risk category to match the new position.
   * - Resets BPJS Kesehatan rates, participation, and family coverage to match the new position and standard rules.
   */
  const buildBpjsProfiles = (
    details: PositionDetails | null,
    salary: number,
    totalFixedAllowance: number,
    prev: Partial<Employee>
  ) => {
    const bpjsList = (details?.bpjs || []).map(b => String(b).toLowerCase().trim());
    const hasExplicitList = bpjsList.length > 0;

    const hasJht = hasExplicitList
      ? bpjsList.some(id => id.includes('jht') || id.includes('hari_tua') || id.includes('hari tua'))
      : true;
    const hasJp = hasExplicitList
      ? bpjsList.some(id => id.includes('jp') || id.includes('pensiun') || id.includes('_jp_'))
      : true;
    const hasJkk = hasExplicitList
      ? bpjsList.some(id => id.includes('jkk') || id.includes('kecelakaan') || id.includes('_jkk_'))
      : true;
    const hasJkm = hasExplicitList
      ? bpjsList.some(id => id.includes('jkm') || id.includes('kematian') || id.includes('_jkm_'))
      : true;
    const hasJkp = bpjsList.some(id => id.includes('jkp') || id.includes('kehilangan') || id.includes('_jkp_'));

    const posContext = `${details?.name || ''} ${details?.department || ''} ${details?.division || ''} ${details?.category || ''}`.toLowerCase();
    let jkkRiskCategory: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' = 'Very Low';
    if (posContext.match(/(pabrik|plant|manufaktur|manufacturing|konstruksi|alat berat|forklift|tambang|boiler|chemical|k3)/)) {
      jkkRiskCategory = 'High';
    } else if (posContext.match(/(operasional|gudang|logistik|warehouse|bengkel|kitchen|restaurant|teknisi|maintenance|mekanik)/)) {
      jkkRiskCategory = 'Medium';
    } else if (posContext.match(/(sales|lapangan|kurir|driver|ekspedisi|delivery)/)) {
      jkkRiskCategory = 'Low';
    } else {
      jkkRiskCategory = 'Very Low';
    }

    const kpjNum = prev.bpjsKetenagakerjaanProfile?.kpjNumber || prev.bpjsKetenagakerjaan || '';
    const effDate = prev.bpjsKetenagakerjaanProfile?.effectiveDate || prev.joinDate || '';

    // Automatically set BPJS TK status to Active if position has BPJS data, position is selected, or KPJ number exists
    const hasBpjsTkData = (hasExplicitList && bpjsList.some(id => id.includes('jht') || id.includes('jkk') || id.includes('jkm') || id.includes('jp') || id.includes('tk') || id.includes('ketenagakerjaan'))) || !!details || (kpjNum && kpjNum.trim().length > 0);
    const bpjsTkActiveStatus = hasBpjsTkData ? 'Active' : (prev.bpjsKetenagakerjaanProfile?.activeStatus || 'Inactive');

    const newBpjsTK: BpjsKetenagakerjaanProfile = {
      ruleId: prev.bpjsKetenagakerjaanProfile?.ruleId,
      kpjNumber: kpjNum,
      activeStatus: bpjsTkActiveStatus as any,
      effectiveDate: effDate,
      hasJht,
      hasJkk,
      jkkRiskCategory,
      hasJkm,
      hasJp,
      hasJkp,
      useCustomReportedWage: prev.bpjsKetenagakerjaanProfile?.useCustomReportedWage || false
    };

    const bpjsKesNum = prev.bpjsKesehatanProfile?.participantNumber || prev.bpjsKesehatan || '';

    // Automatically set BPJS Kes status to Active if position has BPJS data, position is selected, or participant number exists
    const hasBpjsKesData = (hasExplicitList && bpjsList.some(id => id.includes('kes') || id.includes('kesehatan') || id.includes('ppu'))) || !!details || (bpjsKesNum && bpjsKesNum.trim().length > 0);
    const bpjsKesActiveStatus = hasBpjsKesData ? 'Active' : (prev.bpjsKesehatanProfile?.activeStatus || 'Inactive');

    const defaultParticipantType = (prev.bpjsKesehatanProfile?.participantType && prev.bpjsKesehatanProfile.participantType !== 'None') 
      ? prev.bpjsKesehatanProfile.participantType 
      : 'PPU Badan Usaha';

    const newBpjsKes: BpjsKesehatanProfile = {
      ruleId: prev.bpjsKesehatanProfile?.ruleId,
      participantNumber: bpjsKesNum,
      participantType: defaultParticipantType as any,
      activeStatus: bpjsKesActiveStatus as any,
      effectiveDate: effDate,
      employeeRate: prev.bpjsKesehatanProfile?.employeeRate || 1,
      employerRate: prev.bpjsKesehatanProfile?.employerRate || 4,
      familyMembersCovered: prev.bpjsKesehatanProfile?.familyMembersCovered,
      useCustomWageBase: prev.bpjsKesehatanProfile?.useCustomWageBase || false
    };

    return {
      bpjsTK: newBpjsTK,
      bpjsKes: newBpjsKes,
      jkkRiskCategory,
      kpjNum,
      bpjsKesNum
    };
  };

  /**
   * Intensive Tax Profile Reset & Rewrite:
   * - Resets tax rule to the new position's rule (PMK 168/2023 & PP 58/2023 TER).
   * - Resets employeeType, taxMethod, PTKP status, and TER category.
   */
  const buildTaxProfile = (
    details: PositionDetails | null,
    prev: Partial<Employee>
  ): { taxProfile: TaxProfile; taxStatus: string } => {
    let taxRuleId = 'rule_pph21_1';
    if (details?.taxRuleId) {
      if (details.taxRuleId.includes('pasal17') || details.taxRuleId.includes('progresif')) {
        taxRuleId = 'rule_pph21_pasal17';
      } else {
        taxRuleId = 'rule_pph21_1';
      }
    }

    const newTaxProfile: TaxProfile = {
      ruleId: taxRuleId,
      nik: prev.taxProfile?.nik || prev.nik || '',
      npwp: prev.taxProfile?.npwp || prev.npwp || '',
      ptkpStatus: prev.taxProfile?.ptkpStatus || prev.taxStatus || '',
      dependents: prev.taxProfile?.dependents ?? prev.dependents,
      employeeType: (prev.taxProfile?.employeeType || '') as any,
      taxMethod: prev.taxProfile?.taxMethod || ('' as any),
      hasNpwp: Boolean(prev.npwp && prev.npwp.trim().length > 0) || true,
      taxHistory: prev.taxProfile?.taxHistory || []
    };

    return {
      taxProfile: newTaxProfile,
      taxStatus: newTaxProfile.ptkpStatus || ''
    };
  };

  /**
   * Master Intensive Position Reset:
   * When position changes, this function acts as an authoritative hard reset:
   * Overwrites salary, allowances, documents, BPJS profiles, and tax profile according to the new position.
   */
  const applyIntensivePositionReset = async (
    positionIdentifier: string,
    optionData?: any
  ) => {
    if (!positionIdentifier || positionIdentifier.trim() === '') {
      setFormData(prev => ({
        ...prev,
        positionId: '',
        category: '',
        level: '',
        departmentId: '',
        division: '',
      }));
      return;
    }

    const details = getPositionDetails(positionIdentifier);
    const categoryVal = optionData?.category || details?.category || 'General';
    const deptVal = optionData?.department || details?.department || 'General';
    const divVal = optionData?.division || details?.division || '';
    const levelVal = optionData?.level || details?.level || 'Staff';
    const salaryVal = details?.salary || details?.salaryRange?.standar || getDefaultSalaryForLevel(levelVal);
    const positionAllowanceIds = [
      ...(details?.fixedAllowances || []),
      ...(details?.variableAllowances || [])
    ];

    const positionDetails = getPositionDetails(positionIdentifier);
    const synced = await exportAndSavePosition(positionIdentifier, {
      category: categoryVal || positionDetails?.category,
      department: deptVal || positionDetails?.department,
      division: divVal || positionDetails?.division,
      level: levelVal || positionDetails?.level,
    });

    setFormData(prev => {
      // 1. Build and reset allowances completely for new position
      const newAllowances = buildAllowancesForPosition(positionAllowanceIds, levelVal, salaryVal);
      const totalFixed = newAllowances
        .filter(a => isFixedAllowance(a))
        .reduce((s, a) => s + (a.amount || 0), 0);

      // 2. Build and reset documents completely for new position
      const newDocs = buildDocumentsForPosition(prev.documents || [], details);

      // 3. Build and reset BPJS Ketenagakerjaan & BPJS Kesehatan completely for new position
      const { bpjsTK, bpjsKes, jkkRiskCategory, kpjNum, bpjsKesNum } = buildBpjsProfiles(
        details,
        salaryVal,
        totalFixed,
        prev
      );

      // 4. Build and reset Pajak (Tax Profile) completely for new position
      const { taxProfile, taxStatus } = buildTaxProfile(details, prev);

      return {
        ...prev,
        positionId: synced.id || positionIdentifier,
        category: synced.category || categoryVal,
        level: synced.level || levelVal,
        departmentId: synced.department || deptVal,
        division: synced.division || divVal,
        basicSalary: salaryVal,
        fixedAllowance: totalFixed,
        allowances: newAllowances,
        documents: newDocs,
        bpjsKetenagakerjaanProfile: bpjsTK,
        bpjsKetenagakerjaan: kpjNum,
        jkkRisk: jkkRiskCategory,
        bpjsKesehatanProfile: bpjsKes,
        bpjsKesehatan: bpjsKesNum,
        bpjsHealthParticipant: prev.bpjsHealthParticipant,
        taxProfile: taxProfile,
        taxStatus: taxStatus,
        dependents: taxProfile.dependents,
      };
    });
  };

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPositionIdRef.current = formData.positionId;
      return;
    }

    if (formData.positionId && formData.positionId !== prevPositionIdRef.current) {
      prevPositionIdRef.current = formData.positionId;
      applyIntensivePositionReset(formData.positionId);
    }
  }, [formData.positionId]);

  // Auto-sync & lock Tax dependents to 0 when maritalStatus is single/unmarried
  React.useEffect(() => {
    const marital = String(formData.maritalStatus || '').toLowerCase().trim();
    const isUnmarried = formData.maritalStatus && ['single', 'lajang', 'belum menikah', 'belum kawin'].includes(marital);

    if (isUnmarried) {
      setFormData(prev => {
        let changed = false;

        let updatedBpjs = prev.bpjsKesehatanProfile;
        if (prev.bpjsKesehatanProfile && prev.bpjsKesehatanProfile.familyMembersCovered !== undefined && prev.bpjsKesehatanProfile.familyMembersCovered !== ('' as any)) {
          if (prev.bpjsKesehatanProfile.familyMembersCovered !== 1) {
            updatedBpjs = { ...prev.bpjsKesehatanProfile, familyMembersCovered: 1 };
            changed = true;
          }
        }

        let updatedTax = prev.taxProfile;
        let newTaxStatus = prev.taxStatus;
        let newDeps = prev.dependents;

        if (prev.taxProfile) {
          if (prev.taxProfile.ptkpStatus && prev.taxProfile.ptkpStatus.startsWith('K/')) {
            const num = prev.taxProfile.ptkpStatus.split('/').pop() || '0';
            const convertedCode = `TK/${num}`;
            const matchedDep = Number(num) || 0;
            updatedTax = { 
              ...(updatedTax || prev.taxProfile), 
              ptkpStatus: convertedCode,
              dependents: matchedDep
            };
            newTaxStatus = convertedCode;
            newDeps = matchedDep;
            changed = true;
          }
        }

        if (changed) {
          return {
            ...prev,
            dependents: newDeps,
            taxStatus: newTaxStatus,
            bpjsKesehatanProfile: updatedBpjs,
            taxProfile: updatedTax
          };
        }
        return prev;
      });
    }
  }, [formData.maritalStatus]);

  const handlePositionSelect = async (option: ComboboxOption) => {
    const val = option.value || option.label;
    prevPositionIdRef.current = val;
    await applyIntensivePositionReset(val, option.data);
  };

  const handlePositionChange = async (val: string) => {
    prevPositionIdRef.current = val;
    if (!val) {
      setFormData(prev => ({
        ...prev,
        positionId: '',
        category: '',
        level: '',
        departmentId: '',
        division: '',
      }));
      return;
    }
    const matched = positionOptions?.find(
      o => o.value === val || o.label.toLowerCase() === val.toLowerCase()
    );
    if (matched) {
      await applyIntensivePositionReset(matched.value || matched.label, matched.data);
    } else {
      await applyIntensivePositionReset(val);
    }
  };

  const handleLevelChange = (newLevel: string) => {
    setFormData(prev => {
      const currentSalary = prev.basicSalary || 0;
      const tjCalc = calculateTunjanganJabatan(newLevel, currentSalary);
      const updatedAllowances = (prev.allowances || []).map(a => {
        if (isTunjanganJabatanName(a.name)) {
          return {
            ...a,
            amount: tjCalc.nominal,
          };
        }
        return a;
      });
      const totalFixed = updatedAllowances.reduce((s, a) => s + (a.amount || 0), 0);

      return {
        ...prev,
        level: newLevel,
        allowances: updatedAllowances,
        fixedAllowance: totalFixed,
      };
    });
  };

  const handleAddAllowanceRow = () => {
    setFormData(prev => ({
      ...prev,
      allowances: [
        { id: uuidv4(), name: '', amount: 0 },
        ...(prev.allowances || [])
      ]
    }));
  };

  const handleUpdateAllowanceName = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.map(a => {
        if (a.id === id) {
          const isTJ = isTunjanganJabatanName(name);
          const autoAmount = isTJ ? calculateTunjanganJabatan(prev.level, prev.basicSalary || 0).nominal : (a.amount || 0);
          return { ...a, name, amount: autoAmount, ruleId: undefined };
        }
        return a;
      }) || []
    }));
  };

  const handleSelectAllowanceOption = (id: string, opt: ComboboxOption) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.map(a => {
        if (a.id === id) {
          const isTJ = isTunjanganJabatanName(opt.label);
          let autoAmount = isTJ ? calculateTunjanganJabatan(prev.level, prev.basicSalary || 0).nominal : (opt.amount || 0);
          if (!isTJ && opt.data) {
            const isProrata = opt.data.metode_perhitungan === 'prorata' || opt.data.calculationModel === 'prorata' || opt.label.toUpperCase().includes('THR') || opt.label.toLowerCase().includes('hari raya');
            if (isProrata) {
              const pct = opt.data.nilai || 100;
              autoAmount = Math.round((pct / 100) * (prev.basicSalary || 0));
            } else {
              const preview = calculateAllowancePreview(opt.data, {
                basicSalary: prev.basicSalary || 0,
                level: prev.level,
                serviceMonths: 12,
                daysAttended: 22,
                workingDaysInMonth: 25
              });
              if (preview && preview.amount > 0) {
                autoAmount = preview.amount;
              } else if (opt.data.nilai || opt.data.fixedAmount || opt.data.unitRate) {
                autoAmount = opt.data.nilai || opt.data.fixedAmount || opt.data.unitRate;
              }
            }
          }
          return {
            ...a,
            name: opt.label,
            amount: autoAmount,
            ruleId: isTJ ? undefined : opt.value,
            aturan: opt.data?.aturan || opt.data?.daftarJenjang || a.aturan
          };
        }
        return a;
      }) || []
    }));
  };

  const handleUpdateTierField = (allowanceId: string, currentTierList: any[], index: number, field: string, value: any) => {
    const updatedTiers = currentTierList.map((t, i) => {
      if (i === index) {
        const next = { ...t, [field]: value };
        if (field === 'nominal' && formData.basicSalary && formData.basicSalary > 0) {
          next.nilai = Math.round((value / formData.basicSalary) * 100);
        }
        return next;
      }
      return t;
    });

    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.map(a => {
        if (a.id === allowanceId) {
          return { ...a, aturan: updatedTiers };
        }
        return a;
      }) || []
    }));
  };

  const handleAddAllowanceAturanRow = (allowanceId: string, currentTierList: any[]) => {
    const lastTier = currentTierList[currentTierList.length - 1];
    const newMin = lastTier && typeof lastTier.max === 'number' ? lastTier.max : (lastTier ? (lastTier.min || 0) + 2 : 0);
    const newTier = { min: newMin, max: newMin + 2, nilai: 50 };

    const updatedTiers = [...currentTierList, newTier];
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.map(a => {
        if (a.id === allowanceId) {
          return { ...a, aturan: updatedTiers };
        }
        return a;
      }) || []
    }));
  };

  const handleRemoveAllowanceAturanRow = (allowanceId: string, currentTierList: any[], index: number) => {
    const updatedTiers = currentTierList.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.map(a => {
        if (a.id === allowanceId) {
          return { ...a, aturan: updatedTiers };
        }
        return a;
      }) || []
    }));
  };

  const handleUpdateAllowanceAmount = (id: string, amount: number) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.map(a => a.id === id ? { ...a, amount } : a) || []
    }));
  };

  const handleResetAllowanceToStandard = (id: string, targetAmount: number) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.map(a => {
        if (a.id === id) {
          const opt = allowanceOptions.find(o => o.value === a.ruleId || o.label.toLowerCase() === a.name.toLowerCase());
          const stdAturan = opt?.data?.aturan || opt?.data?.daftarJenjang;
          return { ...a, amount: targetAmount, aturan: stdAturan };
        }
        return a;
      }) || []
    }));
  };

  const handleRemoveAllowance = (id: string) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances?.filter(a => a.id !== id) || []
    }));
  };

  const filledDocsCount = (formData.documents || []).filter(d => d.url && d.url.trim() !== '').length;
  const totalDocsCount = (formData.documents || []).length;

  return (
    <div className="space-y-6 max-w-5xl w-full">
      {/* Adaptive Mobile Bottom Action Bar */}
      <MobileBottomBar>
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={onSave}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {editingEmployeeId ? 'Simpan' : 'Simpan Karyawan'}
          </button>
        </div>
      </MobileBottomBar>

      <PageHeaderTitle 
        title={editingEmployeeId ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'} 
        subtitle="Human Resource Matrix" 
        onBack={onCancel}
        hideHamburger={true}
      />

      <DesktopHeaderActions>
        <Button variant="outline" size="sm" type="button" onClick={onCancel} className="h-8 text-xs">
          Batal
        </Button>
        <Button size="sm" type="button" onClick={onSave} className="h-8 text-xs">
          {editingEmployeeId ? 'Simpan Perubahan' : 'Simpan Karyawan'}
        </Button>
      </DesktopHeaderActions>
      
      <form onSubmit={onSave} className="space-y-8">
        
        {/* 1. INFORMASI PRIBADI */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('pribadi')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                Informasi Pribadi
              </h3>
            </button>
            <button
              type="button"
              onClick={() => toggleSection('pribadi')}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {collapsedSections['pribadi'] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
          {!collapsedSections['pribadi'] && (
            <PersonalInfoSection formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* 2. ALAMAT & DOMISILI */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('alamat')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-600 shrink-0" />
                Alamat & Domisili
              </h3>
            </button>
            <button
              type="button"
              onClick={() => toggleSection('alamat')}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {collapsedSections['alamat'] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
          {!collapsedSections['alamat'] && (
            <AddressSection formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* 3. STATUS PEKERJAAN */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('pekerjaan')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                Status Pekerjaan
              </h3>
            </button>
            <button
              type="button"
              onClick={() => toggleSection('pekerjaan')}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {collapsedSections['pekerjaan'] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
          {!collapsedSections['pekerjaan'] && (
            <EmploymentSection
              formData={formData}
              setFormData={setFormData}
              positionOptions={positionOptions}
              categoryOptions={categoryOptions}
              levelOptions={levelOptions}
              effectiveDepartmentOptions={effectiveDepartmentOptions}
              divisionOptions={divisionOptions}
              handlePositionChange={handlePositionChange}
              handlePositionSelect={handlePositionSelect}
              handleLevelChange={handleLevelChange}
            />
          )}
        </div>

        {/* 4. GAJI, UPAH, & TUNJANGAN */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('gaji')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600 shrink-0" />
                Gaji & Upah
              </h3>
            </button>
            <button
              type="button"
              onClick={() => toggleSection('gaji')}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {collapsedSections['gaji'] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
          {!collapsedSections['gaji'] && (
            <SalarySection
              formData={formData}
              setFormData={setFormData}
              allowanceOptions={allowanceOptions}
              availableAllowanceSelectOptions={availableAllowanceSelectOptions}
              groupedAllowances={groupedAllowances}
              getAllowanceCategoryAndFrequency={getAllowanceCategoryAndFrequency}
              isTunjanganJabatanName={isTunjanganJabatanName}
              handleAllowanceSelectChange={handleAllowanceSelectChange}
              handleRemoveAllowance={handleRemoveAllowance}
              handleResetAllowanceToStandard={handleResetAllowanceToStandard}
              handleUpdateAllowanceAmount={handleUpdateAllowanceAmount}
              handleAddAllowanceAturanRow={handleAddAllowanceAturanRow}
              handleRemoveAllowanceAturanRow={handleRemoveAllowanceAturanRow}
              handleUpdateTierField={handleUpdateTierField}
              handleAddAllowanceRow={handleAddAllowanceRow}
            />
          )}
        </div>

        {/* 5. REKENING BANK */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('bank')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-600 shrink-0" />
                Rekening Bank
              </h3>
            </button>
            <button
              type="button"
              onClick={() => toggleSection('bank')}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {collapsedSections['bank'] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
          {!collapsedSections['bank'] && (
            <BankSection
              formData={formData}
              setFormData={setFormData}
              currentFinancialOptions={currentFinancialOptions}
              isEwalletMethod={isEwalletMethod}
              isBankMethod={isBankMethod}
            />
          )}
        </div>

        {/* 7. BERKAS & DOKUMEN */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('dokumen')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-600 shrink-0" />
                Berkas & Dokumen
              </h3>
            </button>
            <button
              type="button"
              onClick={() => toggleSection('dokumen')}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {collapsedSections['dokumen'] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>

          {!collapsedSections['dokumen'] && (
            <DocumentSection
              formData={formData}
              availableDocSelectOptions={availableDocSelectOptions}
              handleUpdateDocName={handleUpdateDocName}
              handleUpdateDocUrl={handleUpdateDocUrl}
              handleRemoveDoc={handleRemoveDoc}
              handleAddDocRow={handleAddDocRow}
            />
          )}
        </div>

        {/* 8. BPJS KESEHATAN */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('bpjs_kesehatan')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-blue-600 shrink-0" />
                BPJS Kesehatan
              </h3>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (collapsedSections['bpjs_kesehatan']) {
                    toggleSection('bpjs_kesehatan');
                  }
                  setShowHealthReg(!showHealthReg);
                }}
                title="Tampilkan Info Regulasi BPJS Kesehatan"
                className={cn(
                  "p-1.5 rounded-full transition-colors focus:outline-none shrink-0",
                  showHealthReg ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                <Info className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleSection('bpjs_kesehatan')}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {collapsedSections['bpjs_kesehatan'] ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {!collapsedSections['bpjs_kesehatan'] && (
            <BpjsKesehatanSection 
              formData={formData} 
              setFormData={setFormData} 
              showRegulationInfo={showHealthReg}
              bpjsOptions={bpjsOptions}
            />
          )}
        </div>

        {/* 9. BPJS KETENAGAKERJAAN */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('bpjs_ketenagakerjaan')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                BPJS Ketenagakerjaan
              </h3>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (collapsedSections['bpjs_ketenagakerjaan']) {
                    toggleSection('bpjs_ketenagakerjaan');
                  }
                  setShowEmploymentReg(!showEmploymentReg);
                }}
                title="Tampilkan Info Regulasi BPJS Ketenagakerjaan"
                className={cn(
                  "p-1.5 rounded-full transition-colors focus:outline-none shrink-0",
                  showEmploymentReg ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                <Info className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleSection('bpjs_ketenagakerjaan')}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {collapsedSections['bpjs_ketenagakerjaan'] ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {!collapsedSections['bpjs_ketenagakerjaan'] && (
            <BpjsKetenagakerjaanSection 
              formData={formData} 
              setFormData={setFormData} 
              showRegulationInfo={showEmploymentReg}
              bpjsOptions={bpjsOptions}
            />
          )}
        </div>

        {/* 10. PROFIL PAJAK (PPh 21 TER) */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('tax_profile')}
              className="flex-1 flex items-center gap-2 text-left focus:outline-none group"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                Profil Pajak
              </h3>
            </button>
            <button
              type="button"
              onClick={() => toggleSection('tax_profile')}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {collapsedSections['tax_profile'] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
          {!collapsedSections['tax_profile'] && (
            <TaxProfileSection formData={formData} setFormData={setFormData} taxOptions={taxOptions} />
          )}
        </div>
      </form>
    </div>
  );
}
