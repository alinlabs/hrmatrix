import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Info, 
  HelpCircle, 
  Plus, 
  PlusCircle, 
  Minus, 
  Trash2, 
  Pencil,
  Download,
  Upload
} from 'lucide-react';
import { Input } from '../../components/ui';
import { 
  PageHeaderTitle, 
  HideBottomNav 
} from '../../context/MobileNavContext';
import { useScrollToTop } from '../../components/layout/ScrollToTop';
import { 
  AttendanceConfig, 
  LateDeductionConfig, 
  LateDeductionScheme, 
  TieredDeductionSubMethod, 
  StaticDeductionSubMethod, 
  TieredLateRate, 
  AbsenceReasonConfig, 
  AbsenceDeductionType 
} from '../../types';
import { ModalJenisKetidakhadiran } from './modal-jenis-ketidakhadiran';

// Helper format ribuan (titik sebagai pemisah ribuan)
const formatRibuan = (val: number | string): string => {
  if (val === undefined || val === null || val === '') return '';
  const cleanStr = String(val).replace(/\D/g, '');
  if (!cleanStr) return '';
  return parseInt(cleanStr, 10).toLocaleString('id-ID');
};

const parseRibuan = (str: string): number => {
  const clean = str.replace(/\D/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

export interface LocalAbsenceReasonConfig {
  id: string;
  name: string;
  description: string;
  deductionEnabled: boolean;
  deductionType: AbsenceDeductionType;
  deductionNominal: number;
  deductionPercentage: number;
}

const DEFAULT_ABSENCE_CONFIGS: LocalAbsenceReasonConfig[] = [
  {
    id: 'libur-nasional',
    name: 'Hari Libur Nasional',
    description: 'Hari libur resmi penetapan pemerintah / perusahaan',
    deductionEnabled: false,
    deductionType: 'full_day',
    deductionNominal: 0,
    deductionPercentage: 100,
  },
  {
    id: 'cuti',
    name: 'Cuti',
    description: 'Izin tidak masuk berbayar / mengurangi kuota cuti tahunan',
    deductionEnabled: false,
    deductionType: 'full_day',
    deductionNominal: 0,
    deductionPercentage: 100,
  },
  {
    id: 'sakit',
    name: 'Sakit',
    description: 'Tidak hadir karena alasan kesehatan / sakit dengan keterangan',
    deductionEnabled: false,
    deductionType: 'full_day',
    deductionNominal: 0,
    deductionPercentage: 100,
  },
  {
    id: 'izin',
    name: 'Izin',
    description: 'Izin tidak masuk kerja tanpa keterangan berbayar',
    deductionEnabled: true,
    deductionType: 'daily_percentage',
    deductionNominal: 50000,
    deductionPercentage: 50,
  },
  {
    id: 'alpa',
    name: 'Alpa',
    description: 'Ketidakhadiran tanpa keterangan resmi atau melebihi batas jam telat',
    deductionEnabled: true,
    deductionType: 'full_day',
    deductionNominal: 100000,
    deductionPercentage: 100,
  },
];

interface ModalPengaturanProps {
  isOpen: boolean;
  onClose: () => void;
  config: AttendanceConfig | null;
  onSaveConfig: (updatedConfig: AttendanceConfig) => Promise<void>;
  savingConfig?: boolean;
}

export function ModalPengaturan({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}: ModalPengaturanProps) {
  useScrollToTop();

  // Local Form State
  const [lateTolerance, setLateTolerance] = useState<number>(15);
  const [maxLateHours, setMaxLateHours] = useState<number>(4);
  const [showLateInfo, setShowLateInfo] = useState<boolean>(false);
  
  // Absence Reasons State
  const [absenceConfigs, setAbsenceConfigs] = useState<LocalAbsenceReasonConfig[]>([...DEFAULT_ABSENCE_CONFIGS]);
  
  // Modal Jenis Ketidakhadiran state
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [selectedAbsenceForEdit, setSelectedAbsenceForEdit] = useState<LocalAbsenceReasonConfig | null>(null);

  // Late Deduction Config State
  const [deductionEnabled, setDeductionEnabled] = useState<boolean>(false);
  const [deductionScheme, setDeductionScheme] = useState<LateDeductionScheme>('duration');
  
  // Konversi umum
  const [workingDaysPerMonth] = useState<number>(21);
  const [workingHoursPerDay] = useState<number>(8);

  // Bertingkat scheme states
  const [tieredSubMethod, setTieredSubMethod] = useState<TieredDeductionSubMethod>('nominal');
  const [tieredRates, setTieredRates] = useState<TieredLateRate[]>([
    { hour: 1, amount: 10000, percentage: 5 },
    { hour: 2, amount: 20000, percentage: 10 },
    { hour: 3, amount: 30000, percentage: 15 },
    { hour: 4, amount: 40000, percentage: 20 },
  ]);

  // Statis scheme states
  const [staticSubMethod, setStaticSubMethod] = useState<StaticDeductionSubMethod>('nominal');
  const [staticAmount, setStaticAmount] = useState<number>(25000);
  const [staticPercentage, setStaticPercentage] = useState<number>(5);

  const isLoadedRef = useRef(false);

  // Sync state when config prop is received
  useEffect(() => {
    if (config) {
      setLateTolerance(config.lateToleranceMinutes ?? 15);
      const hours = config.maxLateHours ?? (config.maxLateMinutes ? Math.round(config.maxLateMinutes / 60) : 4);
      setMaxLateHours(hours);
      
      if (config.absenceReasons && config.absenceReasons.length > 0) {
        const parsedConfigs: LocalAbsenceReasonConfig[] = config.absenceReasons.map((item, idx) => {
          if (typeof item === 'string') {
            const foundDefault = DEFAULT_ABSENCE_CONFIGS.find(d => d.name.toLowerCase() === item.toLowerCase());
            if (foundDefault) return { ...foundDefault, id: `reason-${idx}-${Date.now()}` };
            return {
              id: `reason-${idx}-${Date.now()}`,
              name: item,
              description: `Alasan ketidakhadiran: ${item}`,
              deductionEnabled: item.toLowerCase() === 'alpa' || item.toLowerCase() === 'izin',
              deductionType: item.toLowerCase() === 'alpa' ? 'full_day' : 'daily_percentage',
              deductionNominal: 50000,
              deductionPercentage: 50,
            };
          } else {
            return {
              id: item.id || `reason-${idx}-${Date.now()}`,
              name: item.name,
              description: item.description || '',
              deductionEnabled: item.deductionEnabled ?? false,
              deductionType: item.deductionType || 'full_day',
              deductionNominal: item.deductionNominal ?? 50000,
              deductionPercentage: item.deductionPercentage ?? 50,
            };
          }
        });
        setAbsenceConfigs(parsedConfigs);
      } else {
        setAbsenceConfigs([...DEFAULT_ABSENCE_CONFIGS]);
      }

      if (config.lateDeductionConfig) {
        const dCfg = config.lateDeductionConfig;
        setDeductionEnabled(dCfg.enabled ?? false);
        
        let s: LateDeductionScheme = 'duration';
        if (dCfg.scheme === 'tiered' || dCfg.scheme === 'hourly') s = 'tiered';
        else if (dCfg.scheme === 'static' || dCfg.scheme === 'uniform') s = 'static';
        else if (dCfg.scheme === 'duration' || dCfg.scheme === 'daily_wage') s = 'duration';
        setDeductionScheme(s);

        setTieredSubMethod(dCfg.tieredSubMethod || 'nominal');
        if (dCfg.tieredRates && dCfg.tieredRates.length > 0) {
          setTieredRates(dCfg.tieredRates.map(t => ({
            hour: t.hour,
            amount: t.amount ?? 10000,
            percentage: t.percentage ?? 5,
          })));
        } else {
          setTieredRates([
            { hour: 1, amount: 10000, percentage: 5 },
            { hour: 2, amount: 20000, percentage: 10 },
            { hour: 3, amount: 30000, percentage: 15 },
          ]);
        }

        setStaticSubMethod(dCfg.staticSubMethod || 'nominal');
        setStaticAmount(dCfg.staticAmount ?? dCfg.uniformAmount ?? 25000);
        setStaticPercentage(dCfg.staticPercentage ?? dCfg.dailyWagePercentage ?? 5);
      }

      // Mark as loaded so subsequent user changes trigger auto-save
      setTimeout(() => {
        isLoadedRef.current = true;
      }, 50);
    }
  }, [config]);

  // Centralized Auto-save method
  const triggerAutoSave = useCallback((partial?: {
    lateTolerance?: number;
    maxLateHours?: number;
    deductionEnabled?: boolean;
    deductionScheme?: LateDeductionScheme;
    tieredSubMethod?: TieredDeductionSubMethod;
    tieredRates?: TieredLateRate[];
    staticSubMethod?: StaticDeductionSubMethod;
    staticAmount?: number;
    staticPercentage?: number;
    absenceConfigs?: LocalAbsenceReasonConfig[];
  }) => {
    if (!config) return;

    const effLateTolerance = partial?.lateTolerance !== undefined ? partial.lateTolerance : lateTolerance;
    const effMaxLateHours = partial?.maxLateHours !== undefined ? partial.maxLateHours : maxLateHours;
    const effDeductionEnabled = partial?.deductionEnabled !== undefined ? partial.deductionEnabled : deductionEnabled;
    const effDeductionScheme = partial?.deductionScheme !== undefined ? partial.deductionScheme : deductionScheme;
    const effTieredSubMethod = partial?.tieredSubMethod !== undefined ? partial.tieredSubMethod : tieredSubMethod;
    const effTieredRates = partial?.tieredRates !== undefined ? partial.tieredRates : tieredRates;
    const effStaticSubMethod = partial?.staticSubMethod !== undefined ? partial.staticSubMethod : staticSubMethod;
    const effStaticAmount = partial?.staticAmount !== undefined ? partial.staticAmount : staticAmount;
    const effStaticPercentage = partial?.staticPercentage !== undefined ? partial.staticPercentage : staticPercentage;
    const effAbsenceConfigs = partial?.absenceConfigs !== undefined ? partial.absenceConfigs : absenceConfigs;

    const maxLateMinutes = Math.round(effMaxLateHours * 60);

    const lateDeductionConfig: LateDeductionConfig = {
      enabled: effDeductionEnabled,
      scheme: effDeductionScheme,
      workingDaysPerMonth,
      workingHoursPerDay,
      tieredSubMethod: effTieredSubMethod,
      tieredRates: effTieredRates,
      staticSubMethod: effStaticSubMethod,
      staticAmount: effStaticAmount,
      staticPercentage: effStaticPercentage,
      uniformAmount: effStaticAmount,
      hourlyMode: 'tiered',
      ratePerHour: effStaticAmount,
      dailyWageMode: 'percentage',
      dailyWagePercentage: effStaticPercentage,
    };

    const updatedConfig: AttendanceConfig = {
      ...config,
      lateToleranceMinutes: effLateTolerance,
      maxLateHours: effMaxLateHours,
      maxLateMinutes,
      lateDeductionConfig,
      absenceReasons: effAbsenceConfigs as AbsenceReasonConfig[],
    };

    onSaveConfig(updatedConfig);
  }, [
    config,
    lateTolerance,
    maxLateHours,
    deductionEnabled,
    deductionScheme,
    workingDaysPerMonth,
    workingHoursPerDay,
    tieredSubMethod,
    tieredRates,
    staticSubMethod,
    staticAmount,
    staticPercentage,
    absenceConfigs,
    onSaveConfig
  ]);

  // Handlers for Toleransi & Jam Keterlambatan with immediate auto-save
  const handleUpdateLateTolerance = (val: number) => {
    const newVal = Math.max(0, val);
    setLateTolerance(newVal);
    triggerAutoSave({ lateTolerance: newVal });
  };

  const handleUpdateMaxLateHours = (val: number) => {
    const newVal = Math.max(1, Math.min(12, val));
    setMaxLateHours(newVal);
    
    // Also adjust tieredRates length if needed
    const currentRates = [...tieredRates];
    let newRates = currentRates;
    if (newVal > currentRates.length) {
      newRates = [...currentRates];
      for (let i = currentRates.length; i < newVal; i++) {
        const lastAmount = newRates.length > 0 ? (newRates[newRates.length - 1].amount || 10000) : 10000;
        const lastPct = newRates.length > 0 ? (newRates[newRates.length - 1].percentage || 5) : 5;
        newRates.push({
          hour: i + 1,
          amount: lastAmount + 10000,
          percentage: Math.min(100, lastPct + 5),
        });
      }
    } else if (newVal < currentRates.length) {
      newRates = currentRates.slice(0, newVal);
    }
    setTieredRates(newRates);

    triggerAutoSave({ maxLateHours: newVal, tieredRates: newRates });
  };

  const handleToggleDeduction = () => {
    const newVal = !deductionEnabled;
    setDeductionEnabled(newVal);
    triggerAutoSave({ deductionEnabled: newVal });
  };

  const handleChangeScheme = (scheme: LateDeductionScheme) => {
    setDeductionScheme(scheme);
    triggerAutoSave({ deductionScheme: scheme });
  };

  const handleChangeTieredSubMethod = (method: TieredDeductionSubMethod) => {
    setTieredSubMethod(method);
    triggerAutoSave({ tieredSubMethod: method });
  };

  const handleUpdateTierAmount = (index: number, amount: number) => {
    const updated = [...tieredRates];
    updated[index] = { ...updated[index], amount };
    setTieredRates(updated);
    triggerAutoSave({ tieredRates: updated });
  };

  const handleUpdateTierPercentage = (index: number, percentage: number) => {
    const updated = [...tieredRates];
    updated[index] = { ...updated[index], percentage };
    setTieredRates(updated);
    triggerAutoSave({ tieredRates: updated });
  };

  const handleChangeStaticSubMethod = (method: StaticDeductionSubMethod) => {
    setStaticSubMethod(method);
    triggerAutoSave({ staticSubMethod: method });
  };

  const handleUpdateStaticAmount = (amount: number) => {
    setStaticAmount(amount);
    triggerAutoSave({ staticAmount: amount });
  };

  const handleUpdateStaticPercentage = (pct: number) => {
    setStaticPercentage(pct);
    triggerAutoSave({ staticPercentage: pct });
  };

  // Absence Reasons Actions
  const handleOpenCreateAbsence = () => {
    setSelectedAbsenceForEdit(null);
    setIsAbsenceModalOpen(true);
  };

  const handleOpenEditAbsence = (item: LocalAbsenceReasonConfig) => {
    setSelectedAbsenceForEdit(item);
    setIsAbsenceModalOpen(true);
  };

  const handleSaveAbsenceFromModal = (savedItem: LocalAbsenceReasonConfig) => {
    let updatedList: LocalAbsenceReasonConfig[];
    if (selectedAbsenceForEdit) {
      updatedList = absenceConfigs.map(item => item.id === savedItem.id ? savedItem : item);
    } else {
      updatedList = [...absenceConfigs, savedItem];
    }
    setAbsenceConfigs(updatedList);
    triggerAutoSave({ absenceConfigs: updatedList });
  };

  const handleRemoveAbsenceCard = (id: string) => {
    const updatedList = absenceConfigs.filter(item => item.id !== id);
    setAbsenceConfigs(updatedList);
    triggerAutoSave({ absenceConfigs: updatedList });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    try {
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pengaturan-presensi.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor berkas JSON: ' + (err as Error).message);
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const importedConfig = json.pengaturanPresensi || (json.settings?.[0]) || json;
        if (typeof importedConfig === 'object' && importedConfig !== null) {
          onSaveConfig(importedConfig);
          alert('Pengaturan presensi berhasil diperbarui dari berkas JSON!');
        } else {
          throw new Error('Format berkas tidak valid.');
        }
      } catch (err) {
        alert('Gagal mengimpor berkas JSON: ' + (err as Error).message);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      <HideBottomNav />

      {/* Top Header Title with Back Action (No check card in header) */}
      <PageHeaderTitle 
        title="Pengaturan Presensi" 
        subtitle="Konfigurasi Aturan & Toleransi"
        onBack={onClose} 
        hideHamburger={true} 
      />

      {/* Main Settings Form (Changes are auto-saved) */}
      <div className="space-y-6">
        {/* Skema Keterlambatan - 2 Columns 1 Row without outer cards */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-700">Skema Keterlambatan</h4>
              <button
                type="button"
                onClick={() => setShowLateInfo(!showLateInfo)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  showLateInfo ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title="Informasi Skema Keterlambatan"
              >
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Information Card (Toggleable) */}
          {showLateInfo && (
            <div className="mb-3 p-3 bg-blue-50/80 border border-blue-200/90 rounded-xl text-xs text-blue-950 space-y-1.5 animate-in fade-in duration-150">
              <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Penjelasan Skema Keterlambatan:
              </div>
              <ul className="list-disc list-inside space-y-1 text-blue-900/90 text-[11px] leading-relaxed pl-1">
                <li><strong>Toleransi (Menit)</strong>: Batas waktu menit awal di mana keterlambatan belum dikenakan potongan denda gaji.</li>
                <li><strong>Batas (Jam)</strong>: Batas waktu maksimal jam keterlambatan. Terlambat melebihi batas ini akan otomatis dianggap <strong>Alpa / Tidak Hadir</strong> oleh sistem.</li>
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Column 1: Toleransi (Menit) */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 block truncate">
                Toleransi (Menit)
              </label>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateLateTolerance(lateTolerance - 5)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 shrink-0 transition-all cursor-pointer select-none"
                  title="Kurangi 5 menit"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="relative flex-1 min-w-0">
                  <Input 
                    type="number" 
                    min="0"
                    step="5"
                    value={lateTolerance}
                    onChange={e => handleUpdateLateTolerance(parseInt(e.target.value) || 0)}
                    className="text-center font-bold text-slate-800 text-xs sm:text-sm h-8 sm:h-9 px-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateLateTolerance(lateTolerance + 5)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 shrink-0 transition-all cursor-pointer select-none"
                  title="Tambah 5 menit"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Column 2: Batas (Jam) */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 block truncate">
                Batas (Jam)
              </label>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateMaxLateHours(maxLateHours - 1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 shrink-0 transition-all cursor-pointer select-none"
                  title="Kurangi 1 jam"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="relative flex-1 min-w-0">
                  <Input 
                    type="number" 
                    min="1"
                    max="12"
                    value={maxLateHours}
                    onChange={e => handleUpdateMaxLateHours(parseInt(e.target.value) || 1)}
                    className="text-center font-bold text-slate-800 text-xs sm:text-sm h-8 sm:h-9 px-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateMaxLateHours(maxLateHours + 1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 shrink-0 transition-all cursor-pointer select-none"
                  title="Tambah 1 jam"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Denda Keterlambatan */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-700">
              {deductionEnabled ? 'Denda Keterlambatan' : 'Aktifkan Denda Keterlambatan'}
            </h4>
            <label className="flex items-center cursor-pointer gap-2">
              {deductionEnabled && (
                <span className="text-xs font-semibold text-blue-600">Aktif</span>
              )}
              <div className={`relative w-9 sm:w-10 h-5 sm:h-6 transition-colors rounded-full ${deductionEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={deductionEnabled} 
                  onChange={handleToggleDeduction} 
                />
                <div className={`absolute w-3.5 sm:w-4 h-3.5 sm:h-4 bg-white rounded-full top-0.5 sm:top-1 transition-transform ${deductionEnabled ? 'translate-x-4 sm:translate-x-5' : 'translate-x-1'}`} />
              </div>
            </label>
          </div>

          {deductionEnabled && (
            <div className="space-y-4 sm:space-y-5">
              {/* Skema Option Selector - 3 Choices */}
              <div>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80">
                  {[
                    { id: 'duration', label: 'Durasi', desc: 'Per Menit' },
                    { id: 'tiered', label: 'Bertingkat', desc: 'Jam ke-N' },
                    { id: 'static', label: 'Statis', desc: 'Nominal Flat' },
                  ].map(scheme => (
                    <button 
                      key={scheme.id}
                      type="button"
                      onClick={() => handleChangeScheme(scheme.id as LateDeductionScheme)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center ${
                        deductionScheme === scheme.id 
                          ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-500/20 font-bold' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <span>{scheme.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{scheme.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SKEMA DURASI */}
              {deductionScheme === 'duration' && (
                <div className="pt-1 animate-in fade-in duration-150">
                  <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-lg text-xs text-blue-900">
                    <p className="leading-relaxed">
                      Nominal denda keterlambatan dihitung secara otomatis per menit dari durasi keterlambatan berdasarkan pembagian upah dari roster jadwal shift pada sistem Payroll.
                    </p>
                  </div>
                </div>
              )}

              {/* SKEMA BERTINGKAT */}
              {deductionScheme === 'tiered' && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                  {/* Sub-method Select Dropdown */}
                  <div className="w-full">
                    <select 
                      value={tieredSubMethod} 
                      onChange={(e) => handleChangeTieredSubMethod(e.target.value as TieredDeductionSubMethod)}
                      className="w-full text-xs font-semibold h-9 rounded-xl border border-slate-300 bg-white px-3 py-1 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                    >
                      <option value="nominal">Berdasarkan Nominal (Rp)</option>
                      <option value="percentage">Berdasarkan Persentase Gaji Harian (%)</option>
                    </select>
                  </div>

                  {/* Tier rows in 2-column grid */}
                  <div className="pt-1">
                    <div className="grid grid-cols-2 gap-2.5">
                      {tieredRates.map((tier, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          {/* Card Jam Ke-X 2 Line */}
                          <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-2 py-1 text-center shrink-0 min-w-[48px] flex flex-col justify-center items-center shadow-2xs">
                            <span className="text-[10px] font-normal text-slate-400 leading-none">Jam</span>
                            <span className="text-xs font-bold text-slate-800 leading-tight mt-0.5">Ke-{tier.hour}</span>
                          </div>
                          
                          {tieredSubMethod === 'nominal' ? (
                            <div className="relative flex-1 min-w-0">
                              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                                Rp
                              </div>
                              <Input 
                                type="text"
                                inputMode="numeric"
                                value={formatRibuan(tier.amount || 0)}
                                onChange={e => handleUpdateTierAmount(idx, parseRibuan(e.target.value))}
                                className="text-xs h-9 pl-8 rounded-xl font-bold text-slate-900 border-slate-300 focus-visible:ring-blue-500/20 w-full"
                                placeholder="0"
                              />
                            </div>
                          ) : (
                            <div className="relative flex-1 min-w-0">
                              <Input 
                                type="number" min="0" max="100" step="0.5"
                                value={tier.percentage || 0}
                                onChange={e => handleUpdateTierPercentage(idx, Math.max(0, parseFloat(e.target.value) || 0))}
                                className="text-xs h-9 pr-7 rounded-xl font-bold text-slate-900 border-slate-300 focus-visible:ring-blue-500/20 w-full"
                                placeholder="0"
                              />
                              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                                %
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SKEMA STATIS */}
              {deductionScheme === 'static' && (
                <div className="pt-1 animate-in fade-in duration-150">
                  {/* 2-Column Grid: Left dropdown, Right input */}
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-700 block">Dasar Perhitungan</label>
                      <select 
                        value={staticSubMethod} 
                        onChange={(e) => handleChangeStaticSubMethod(e.target.value as StaticDeductionSubMethod)}
                        className="w-full text-xs font-semibold h-9 rounded-xl border border-slate-300 bg-white px-3 py-1 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                      >
                        <option value="nominal">Nominal</option>
                        <option value="percentage">Persentase</option>
                      </select>
                    </div>

                    {staticSubMethod === 'nominal' ? (
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-700 block">Nominal (Rp)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                            Rp
                          </div>
                          <Input 
                            type="text"
                            inputMode="numeric"
                            value={formatRibuan(staticAmount)}
                            onChange={e => handleUpdateStaticAmount(parseRibuan(e.target.value))}
                            className="text-xs h-9 pl-9 rounded-xl font-bold text-slate-900 border-slate-300 focus-visible:ring-blue-500/20"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-700 block">Persentase (%)</label>
                        <div className="relative">
                          <Input 
                            type="number" min="0" max="100" step="0.5"
                            value={staticPercentage}
                            onChange={e => handleUpdateStaticPercentage(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="text-xs h-9 pr-8 rounded-xl font-bold text-slate-900 border-slate-300 focus-visible:ring-blue-500/20"
                            placeholder="0"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                            %
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Jenis Ketidakhadiran (Card System for Payroll Sync) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-700">Jenis Ketidakhadiran</h4>
            </div>
            <button 
              type="button" 
              onClick={handleOpenCreateAbsence}
              className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
              title="Tambah Jenis Ketidakhadiran"
            >
              <PlusCircle className="w-7 h-7 text-white fill-blue-600" />
            </button>
          </div>

          {/* List Cards Ketidakhadiran */}
          <div className="space-y-2.5">
            {absenceConfigs.map((item) => (
              <div 
                key={item.id} 
                className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      {item.description || 'Tidak ada deskripsi'}
                    </p>
                  </div>

                  {/* Card Action Buttons (Pencil & Delete) */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button 
                      type="button" 
                      onClick={() => handleOpenEditAbsence(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Jenis Ketidakhadiran"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAbsenceCard(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Jenis Ketidakhadiran"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Potongan Card (Hanya muncul jika potongan aktif) */}
                {item.deductionEnabled && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                    <p className="text-xs text-slate-700">
                      Potongan :{' '}
                      <span className="font-bold text-blue-600">Aktif</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {item.deductionType === 'daily_percentage' && (
                        `Berdasarkan Persentase Gaji Harian Sebesar ${item.deductionPercentage}%`
                      )}
                      {item.deductionType === 'fixed_nominal' && (
                        `Berdasarkan Nominal Sebesar Rp ${item.deductionNominal.toLocaleString('id-ID')}`
                      )}
                      {item.deductionType === 'full_day' && (
                        'Berdasarkan Pengurangan Gaji 1 Hari Kerja'
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {absenceConfigs.length === 0 && (
              <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                Belum ada jenis ketidakhadiran. Klik tombol "+" di atas untuk membuat jenis baru.
              </div>
            )}
          </div>
        </section>

        {/* Cadangan Berkas JSON Pengaturan Presensi */}
        <section className="pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-700">Berkas Cadangan (JSON)</h4>
              <p className="text-[11px] text-slate-500">Ekspor atau impor konfigurasi aturan presensi dan shift dalam format pengaturan-presensi.json</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Ekspor JSON</span>
            </button>

            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleImportJson} 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Impor JSON</span>
            </button>
          </div>
        </section>
      </div>

      {/* Standalone Modal Buat / Edit Ketidakhadiran conforming to SPEC_MODAL.md */}
      <ModalJenisKetidakhadiran
        isOpen={isAbsenceModalOpen}
        onClose={() => {
          setIsAbsenceModalOpen(false);
          setSelectedAbsenceForEdit(null);
        }}
        onSave={handleSaveAbsenceFromModal}
        initialData={selectedAbsenceForEdit}
      />
    </div>
  );
}
