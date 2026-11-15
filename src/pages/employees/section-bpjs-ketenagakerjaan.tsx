import React from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Calculator, 
  Activity,
  Layers,
  Info,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Input, Select, CurrencyInput, ComboboxInput, ComboboxOption, Button } from '../../components/ui';
import { Employee, BpjsKetenagakerjaanProfile } from '../../types';
import { 
  BPJS_CONFIG, 
  JKK_RISK_OPTIONS,
  calculateEmployeeBpjsSimulation
} from '../../services/taxBpjsService';
import { isFixedAllowance } from '../../utils/allowanceClassification';
import { cn } from '../../utils/cn';

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

interface BpjsKetenagakerjaanSectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  showRegulationInfo?: boolean;
  bpjsOptions?: ComboboxOption[];
}

function ToggleSwitch({ 
  checked, 
  onChange, 
  disabled 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-blue-600" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function BpjsKetenagakerjaanSection({ 
  formData, 
  setFormData,
  showRegulationInfo = false,
  bpjsOptions = []
}: BpjsKetenagakerjaanSectionProps) {
  const [openInfo, setOpenInfo] = React.useState<Record<string, boolean>>({});
  const [showDetails, setShowDetails] = React.useState(false);
  const [showWageDetails, setShowWageDetails] = React.useState(false);

  const toggleInfo = (key: string) => {
    setOpenInfo(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const profile: BpjsKetenagakerjaanProfile = formData.bpjsKetenagakerjaanProfile || {
    ruleId: undefined,
    kpjNumber: formData.bpjsKetenagakerjaan || '',
    activeStatus: ((formData.positionId || formData.bpjsKetenagakerjaan) ? 'Active' : 'Inactive') as any,
    effectiveDate: formData.joinDate || '',
    hasJht: true,
    hasJkk: true,
    jkkRiskCategory: formData.jkkRisk || 'Very Low',
    hasJkm: true,
    hasJp: true,
    hasJkp: true,
    useCustomReportedWage: false
  };

  // Hanya tunjangan dengan kategori "Tunjangan Tetap" yang menjadi komponen upah yang dilaporkan
  const fixedAllowanceList = (formData.allowances || []).filter(
    a => typeof a.amount === 'number' && a.amount > 0 && isFixedAllowance(a)
  );
  const totalFixedAllowances = (formData.allowances !== undefined && formData.allowances !== null)
    ? fixedAllowanceList.reduce((acc, a) => acc + (a.amount || 0), 0)
    : (formData.fixedAllowance || 0);

  const standardWage = (formData.basicSalary || 0) + totalFixedAllowances;

  const simulation = calculateEmployeeBpjsSimulation(
    formData.basicSalary || 0,
    totalFixedAllowances,
    formData.bpjsKesehatanProfile,
    profile
  );

  const handleUpdate = (field: keyof BpjsKetenagakerjaanProfile, value: any) => {
    setFormData(prev => {
      const currentProfile = prev.bpjsKetenagakerjaanProfile || profile;
      const updatedProfile = {
        ...currentProfile,
        [field]: value
      };

      if (field === 'kpjNumber') {
        if (value && String(value).trim().length > 0) {
          updatedProfile.activeStatus = 'Active';
        }
      }

      return {
        ...prev,
        bpjsKetenagakerjaan: field === 'kpjNumber' ? value : prev.bpjsKetenagakerjaan,
        jkkRisk: field === 'jkkRiskCategory' ? value : prev.jkkRisk,
        bpjsKetenagakerjaanProfile: updatedProfile
      };
    });
  };

  const activeWage = profile.useCustomReportedWage && profile.customReportedWage !== undefined
    ? profile.customReportedWage
    : standardWage;

  const isJpCapped = activeWage > BPJS_CONFIG.KETENAGAKERJAAN.JP.MAX_WAGE_CAP;

  const jkkRiskKey = profile.jkkRiskCategory || 'Very Low';
  let jkkRate = 0.0024;
  if (jkkRiskKey === 'Low') jkkRate = 0.0054;
  else if (jkkRiskKey === 'Medium') jkkRate = 0.0089;
  else if (jkkRiskKey === 'High') jkkRate = 0.0127;
  else if (jkkRiskKey === 'Very High') jkkRate = 0.0174;

  const jhtEeRate = profile.hasJht ? 2 : 0;
  const jpEeRate = profile.hasJp ? 1 : 0;
  const workerPercent = jhtEeRate + jpEeRate;

  const jhtErRate = profile.hasJht ? 3.7 : 0;
  const jpErRate = profile.hasJp ? 2 : 0;
  const jkkErRate = profile.hasJkk ? parseFloat((jkkRate * 100).toFixed(2)) : 0;
  const jkmErRate = profile.hasJkm ? 0.3 : 0;
  const companyPercent = parseFloat((jhtErRate + jpErRate + jkkErRate + jkmErRate).toFixed(2));

  const totalPercent = parseFloat((workerPercent + companyPercent).toFixed(2));

  return (
    <div className="space-y-4">
      {/* Regulation Header Banner */}
      {showRegulationInfo && (
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">Program Jaminan Sosial Ketenagakerjaan</h4>
            <p className="text-[11px] text-slate-500 font-normal">PP No. 44, 45, 46/2015 & PP No. 37/2021</p>
          </div>
          <ul className="space-y-3 pt-3 border-t border-slate-200/50 text-[11px] text-slate-600 list-disc list-outside pl-5 text-left leading-relaxed">
            <li className="marker:text-blue-600 pl-0.5">Meliputi 5 Pilar Perlindungan: JHT (Hari Tua), JP (Pensiun), JKK (Kecelakaan Kerja), JKM (Kematian), dan JKP (Kehilangan Pekerjaan).</li>
            <li className="marker:text-blue-600 pl-0.5">Iuran otomatis dihitung berdasarkan persentase resmi dari upah dasar yang dilaporkan.</li>
          </ul>
        </div>
      )}

      {/* Main Grid Inputs: KPJ, Status, Effective Date, Reported Wage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* 1. KPJ Number */}
        <div>
          <Input
            label="Nomor KPJ (Kartu Peserta BPJSTK)"
            value={profile.kpjNumber || formData.bpjsKetenagakerjaan || ''}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
              handleUpdate('kpjNumber', val);
            }}
            placeholder=""
            maxLength={11}
          />
        </div>

        {/* Group Status Kepesertaan and Tanggal Efektif horizontally */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 col-span-1 sm:col-span-2 lg:col-span-3">
          {/* 2. Active Status */}
          <div>
            <Select
              label="Status Kepesertaan"
              value={profile.activeStatus || ''}
              onChange={e => handleUpdate('activeStatus', e.target.value)}
              options={[
                { value: 'Active', label: 'Aktif' },
                { value: 'Inactive', label: 'Non-Aktif' }
              ]}
            />
          </div>

          {/* 3. Effective Date */}
          <div>
            <label className="block text-[11px] font-normal text-slate-600 mb-1.5">Tanggal Efektif</label>
            <div className="relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px]">
              <span className={`flex-1 text-xs truncate ${(profile.effectiveDate || formData.joinDate) ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                {(profile.effectiveDate || formData.joinDate) ? formatDateDisplay(profile.effectiveDate || formData.joinDate) : ''}
              </span>
              <input 
                type="date" 
                value={profile.effectiveDate || formData.joinDate || ''} 
                onChange={e => handleUpdate('effectiveDate', e.target.value)} 
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base"
              />
            </div>
          </div>
        </div>

        {/* 4. Reported Wage (Upah yang Dilaporkan) */}
        <div className="sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-normal text-slate-600">Upah Yang Dilaporkan</label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-normal text-slate-600">Atur Manual</span>
              <ToggleSwitch
                checked={profile.useCustomReportedWage || false}
                onChange={val => handleUpdate('useCustomReportedWage', val)}
              />
              <button
                type="button"
                onClick={() => toggleInfo('customWage')}
                className={cn(
                  "p-1 rounded-full transition-colors",
                  openInfo.customWage ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                )}
                title="Informasi Regulasi Dasar Upah"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {openInfo.customWage && (
            <div className="mb-2.5 p-4 sm:p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl space-y-4 text-xs text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
              <div className="text-center">
                <div className="text-sm font-bold text-slate-900 leading-snug">Regulasi Dasar Upah BPJS</div>
                <div className="text-[11px] text-slate-500 mt-1 font-normal">PP No. 44/2015 & SE Menaker</div>
              </div>
              <ul className="space-y-3 pt-3 border-t border-slate-200/50 text-[11px] text-slate-600 list-disc list-outside pl-5 leading-relaxed">
                <li className="marker:text-blue-600 pl-0.5">Secara ketentuan perundang-undangan, dasar upah dilaporkan adalah gabungan Gaji Pokok + Tunjangan Tetap.</li>
                <li className="marker:text-blue-600 pl-0.5">Opsi Nilai Manual (Custom) digunakan jika perusahaan menerapkan kebijakan penetapan batas upah khusus atau pelaporan upah yang disepakati dengan BPJS Ketenagakerjaan.</li>
              </ul>
            </div>
          )}

          <div>
            {profile.useCustomReportedWage ? (
              <CurrencyInput
                placeholder=""
                value={profile.customReportedWage || ''}
                onChange={e => handleUpdate('customReportedWage', Number(e.target.value))}
              />
            ) : (
              <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
                <div 
                  onClick={() => setShowWageDetails(!showWageDetails)}
                  className="min-h-[44px] px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none gap-3"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base shrink-0">
                    Rp {new Intl.NumberFormat('id-ID').format(standardWage)}
                  </span>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs font-normal text-slate-500 text-right">
                      (Gaji Pokok + Tunjangan Tetap)
                    </span>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors shrink-0"
                      aria-label={showWageDetails ? "Sembunyikan rincian upah" : "Tampilkan rincian upah"}
                    >
                      {showWageDetails ? (
                        <ChevronUp className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {showWageDetails && (
                  <div className="px-4 py-3.5 bg-white border-t border-slate-200/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                    <span className="text-xs font-bold text-slate-900 block tracking-wide">
                      Rincian Penghasilan Bruto / Bulan
                    </span>

                    <div className="grid grid-cols-[1fr_auto_auto] items-start gap-y-2.5 gap-x-2 pt-1">
                      {/* Gaji Pokok */}
                      <span className="font-normal text-slate-600 text-xs">Gaji Pokok</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs min-w-[70px]">
                        {new Intl.NumberFormat('id-ID').format(formData.basicSalary || 0)}
                      </span>

                      {/* Tunjangan Tetap (Hanya kategori Tunjangan Tetap) */}
                      {fixedAllowanceList.length > 0 ? (
                        fixedAllowanceList.map((allowance, idx) => (
                          <React.Fragment key={allowance.id || idx}>
                            <span className="font-normal text-slate-600 text-xs truncate max-w-[200px] sm:max-w-none" title={allowance.name}>
                              {allowance.name || `Tunjangan Tetap ${idx + 1}`}
                            </span>
                            <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                            <span className="font-normal text-slate-600 text-right text-xs min-w-[70px]">
                              {new Intl.NumberFormat('id-ID').format(allowance.amount || 0)}
                            </span>
                          </React.Fragment>
                        ))
                      ) : (formData.fixedAllowance || 0) > 0 ? (
                        <React.Fragment>
                          <span className="font-normal text-slate-600 text-xs">Tunjangan Tetap</span>
                          <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                          <span className="font-normal text-slate-600 text-right text-xs min-w-[70px]">
                            {new Intl.NumberFormat('id-ID').format(formData.fixedAllowance || 0)}
                          </span>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <span className="font-normal text-slate-400 text-xs">Tunjangan Tetap</span>
                          <span className="font-normal text-slate-400 text-right text-xs">Rp</span>
                          <span className="font-normal text-slate-400 text-right text-xs min-w-[70px]">0</span>
                        </React.Fragment>
                      )}

                      {/* Divider */}
                      <div className="col-span-3 border-t border-slate-100 my-1" />

                      {/* Total Upah Yang Dilaporkan */}
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">Total Upah Yang Dilaporkan</span>
                      <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                      <span className="font-bold text-slate-900 text-right text-xs sm:text-sm min-w-[70px]">
                        {new Intl.NumberFormat('id-ID').format(standardWage)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 Program Cards & Toggle Switches in Order: JHT, JP, JKK, JKM, JKP */}
      <div className="pt-2">
        <h5 className="text-[11px] font-normal text-slate-600 mb-3">
          Program Kepesertaan & Tingkat Risiko
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 1. Program: JHT */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold text-[11px] text-slate-900">Jaminan Hari Tua (JHT)</h6>
                <p className="text-[10px] text-slate-500">Pekerja 2% & Perusahaan 3.7% (5.7%)</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <ToggleSwitch
                  checked={Boolean(profile.hasJht)}
                  onChange={val => handleUpdate('hasJht', val)}
                />
                <button
                  type="button"
                  onClick={() => toggleInfo('jht')}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    openInfo.jht ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                  )}
                  title="Informasi Regulasi JHT"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {openInfo.jht && (
              <div className="p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-3 text-[11px] text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-900 leading-snug">Jaminan Hari Tua (JHT)</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-normal">PP No. 46/2015 & Permenaker No. 11/2022</div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-600 list-disc list-outside pl-4 leading-relaxed">
                  <li className="marker:text-blue-600 pl-0.5">Program tabungan jangka panjang sebagai perlindungan finansial saat memasuki usia pensiun (56 tahun), mengalami cacat total tetap, atau meninggal dunia.</li>
                  <li className="marker:text-blue-600 pl-0.5">Iuran total 5.7% dari upah sebulan (2% dari dipotong Gaji Pekerja, 3.7% ditanggung Perusahaan).</li>
                </ul>
              </div>
            )}

            {Boolean(profile.hasJht) && (
              <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-600 space-y-0.5">
                <div>Pekerja : Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.jht.employeeAmount)} (2%)</div>
                <div>Perusahaan : Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.jht.employerAmount)} (3.7%)</div>
              </div>
            )}
          </div>

          {/* 2. Program: JP */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold text-[11px] text-slate-900">Jaminan Pensiun (JP)</h6>
                <p className="text-[10px] text-slate-500">Pekerja 1% & Perusahaan 2% (3%)</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <ToggleSwitch
                  checked={Boolean(profile.hasJp)}
                  onChange={val => handleUpdate('hasJp', val)}
                />
                <button
                  type="button"
                  onClick={() => toggleInfo('jp')}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    openInfo.jp ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                  )}
                  title="Informasi Regulasi JP"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {openInfo.jp && (
              <div className="p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-3 text-[11px] text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-900 leading-snug">Jaminan Pensiun (JP)</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-normal">PP No. 45/2015 & Permenaker No. 29/2015</div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-600 list-disc list-outside pl-4 leading-relaxed">
                  <li className="marker:text-blue-600 pl-0.5">Total iuran 3% (1% dipotong Pekerja, 2% ditanggung Perusahaan) dengan batas maksimal upah (wage cap) Rp 10.042.300/bulan.</li>
                  <li className="marker:text-blue-600 pl-0.5">Memberikan jaminan penghasilan bulanan bagi pekerja yang memasuki usia pensiun atau mengalami cacat total tetap.</li>
                </ul>
              </div>
            )}

            {Boolean(profile.hasJp) && (
              <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-600 space-y-0.5">
                <div>Pekerja : Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.jp.employeeAmount)} (1%)</div>
                <div>Perusahaan : Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.jp.employerAmount)} (2%)</div>
                {isJpCapped && (
                  <p className="text-[9px] text-amber-700 font-medium pt-0.5">
                    * Kena batas maksimal upah JP Rp 10.042.300
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 3. Program: JKK (with Risk Category Selector) */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold text-[11px] text-slate-900">Jaminan Kecelakaan Kerja (JKK)</h6>
                <p className="text-[10px] text-slate-500">Ditanggung Penuh Perusahaan {(simulation.ketenagakerjaan.jkk.rate * 100).toFixed(2).replace(/\.00$/, '')}%</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <ToggleSwitch
                  checked={Boolean(profile.hasJkk)}
                  onChange={val => handleUpdate('hasJkk', val)}
                />
                <button
                  type="button"
                  onClick={() => toggleInfo('jkk')}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    openInfo.jkk ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                  )}
                  title="Informasi Regulasi JKK"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {openInfo.jkk && (
              <div className="p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-3 text-[11px] text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-900 leading-snug">Jaminan Kecelakaan Kerja (JKK)</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-normal">PP No. 44/2015 & PP No. 82/2019</div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-600 list-disc list-outside pl-4 leading-relaxed">
                  <li className="marker:text-blue-600 pl-0.5">Iuran 100% ditanggung oleh Perusahaan (0% Pekerja).</li>
                  <li className="marker:text-blue-600 pl-0.5">Besaran tarif berdasarkan kelompok risiko kerja: Sangat Rendah (0.24%), Rendah (0.54%), Sedang (0.89%), Tinggi (1.27%), dan Sangat Tinggi (1.74%).</li>
                  <li className="marker:text-blue-600 pl-0.5">Menjamin perawatan medis tanpa batas biaya dan santunan STMB.</li>
                </ul>
              </div>
            )}

            {Boolean(profile.hasJkk) && (() => {
              const selectedValue = profile.jkkRiskCategory || formData.jkkRisk || 'Very Low';
              const selectedOpt = JKK_RISK_OPTIONS.find(o => o.value === selectedValue);
              return (
                <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                  <Select
                    value={selectedValue}
                    onChange={e => handleUpdate('jkkRiskCategory', e.target.value)}
                    options={JKK_RISK_OPTIONS.map(opt => ({
                      value: opt.value,
                      label: opt.label
                    }))}
                    className="h-8 text-[11px]"
                  />
                  {selectedOpt && (
                    <div className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-2 leading-relaxed animate-in fade-in duration-200">
                      <span className="font-medium text-slate-700 block mb-0.5">Rekomendasi Industri:</span>
                      {selectedOpt.subtitle}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-600 pt-0.5">
                    Perusahaan : Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.jkk.amount)} ({(simulation.ketenagakerjaan.jkk.rate * 100).toFixed(2).replace(/\.00$/, '')}%)
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4. Program: JKM */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold text-[11px] text-slate-900">Jaminan Kematian (JKM)</h6>
                <p className="text-[10px] text-slate-500">Ditanggung Penuh Perusahaan 0.3%</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <ToggleSwitch
                  checked={Boolean(profile.hasJkm)}
                  onChange={val => handleUpdate('hasJkm', val)}
                />
                <button
                  type="button"
                  onClick={() => toggleInfo('jkm')}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    openInfo.jkm ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                  )}
                  title="Informasi Regulasi JKM"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {openInfo.jkm && (
              <div className="p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-3 text-[11px] text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-900 leading-snug">Jaminan Kematian (JKM)</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-normal">PP No. 44/2015 & PP No. 82/2019</div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-600 list-disc list-outside pl-4 leading-relaxed">
                  <li className="marker:text-blue-600 pl-0.5">Iuran sebesar 0.30% dari upah sebulan dan 100% ditanggung Perusahaan.</li>
                  <li className="marker:text-blue-600 pl-0.5">Memberikan santunan kematian total Rp 42.000.000 bagi ahli waris peserta yang meninggal dunia bukan akibat kecelakaan kerja, serta beasiswa pendidikan untuk 2 orang anak.</li>
                </ul>
              </div>
            )}

            {Boolean(profile.hasJkm) && (
              <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-600 space-y-0.5">
                <div>Perusahaan : Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.jkm.amount)} (0.3%)</div>
              </div>
            )}
          </div>

          {/* 5. Program: JKP */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5 md:col-span-2 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold text-[11px] text-slate-900">Jaminan Kehilangan Pekerjaan (JKP)</h6>
                <p className="text-[10px] text-slate-500">APBN 0.22% & Rekomposisi 0.24% (0.46%)</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <ToggleSwitch
                  checked={Boolean(profile.hasJkp)}
                  onChange={val => handleUpdate('hasJkp', val)}
                />
                <button
                  type="button"
                  onClick={() => toggleInfo('jkp')}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    openInfo.jkp ? "text-blue-600 bg-blue-100/70" : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                  )}
                  title="Informasi Regulasi JKP"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {openInfo.jkp && (
              <div className="p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-3 text-[11px] text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-in fade-in duration-150">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-900 leading-snug">Jaminan Kehilangan Pekerjaan (JKP)</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-normal">PP No. 37/2021 (Turunan UU Cipta Kerja)</div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-600 list-disc list-outside pl-4 leading-relaxed">
                  <li className="marker:text-blue-600 pl-0.5">Potongan untuk Pekerja adalah 0% (Gratis).</li>
                  <li className="marker:text-blue-600 pl-0.5">Sumber iuran berasal dari APBN (0.22%) dan rekomposisi iuran JKK (0.14%) serta JKM (0.10%).</li>
                  <li className="marker:text-blue-600 pl-0.5">Memberikan manfaat tunai selama 6 bulan pasca PHK, akses lowongan kerja, serta pelatihan vokasi.</li>
                </ul>
              </div>
            )}

            {Boolean(profile.hasJkp) && (
              <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-600 space-y-0.5">
                <div>Sumber Iuran : 0.22% APBN + 0.24% Rekomposisi (0.46%)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Total Calculation Breakdown List Wrapped in clean white card */}
      <div className="mt-6 p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold text-slate-900 text-sm">Estimasi BPJS Ketenagakerjaan Bulanan</h5>
          <button 
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={cn(
              "p-1.5 rounded-full transition-all duration-200",
              showDetails 
                ? "text-blue-600 bg-blue-50/80 hover:bg-blue-100" 
                : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
            )}
            title={showDetails ? "Sembunyikan Detail" : "Tampilkan Detail"}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {!showDetails ? (
          <div className="animate-in fade-in duration-200">
            <span className="text-xs text-slate-400 font-medium block mb-1">Total Setoran Bulanan</span>
            <div className="text-lg font-bold text-slate-900">
              Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.totalStatutoryPayment)}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-slate-500 mb-4">
              Upah dasar: <strong className="font-semibold text-slate-700">Rp {new Intl.NumberFormat('id-ID').format(activeWage)}</strong>
            </p>

            <div className="max-w-md grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              <span className="text-slate-600 font-medium py-1.5 border-b border-slate-100/60">Pekerja ({workerPercent}%)</span>
              <span className="font-semibold text-slate-900 py-1.5 border-b border-slate-100/60">: &nbsp;Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.totalEmployeeDeduction)}</span>

              <span className="text-slate-600 font-medium py-1.5 border-b border-slate-100/60">Perusahaan ({companyPercent}%)</span>
              <span className="font-semibold text-slate-900 py-1.5 border-b border-slate-100/60">: &nbsp;Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.totalEmployerContribution)}</span>

              <span className="text-slate-800 font-bold py-1.5">Total ({totalPercent}%)</span>
              <span className="font-bold text-slate-950 py-1.5">: &nbsp;Rp {new Intl.NumberFormat('id-ID').format(simulation.ketenagakerjaan.totalStatutoryPayment)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
