import React from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { JobTemplate } from './types';
import { CurrencyInput, ComboboxInput, ComboboxOption } from '../../components/ui';
import { 
  normalizeTunjanganId, 
  isTunjanganSelected, 
  normalizeBpjsId, 
  isBpjsSelected, 
  normalizePajakId,
  TunjanganItem,
  BpjsItem
} from './compensation-catalog';

export const ToggleSwitch: React.FC<{
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

interface SectionCompensationProps {
  formData: JobTemplate;
  setFormData: React.Dispatch<React.SetStateAction<JobTemplate>>;
  availableTunjanganList: TunjanganItem[];
  availableBpjsList: BpjsItem[];
  tunjanganTetapList: TunjanganItem[];
  tunjanganTidakTetapList: TunjanganItem[];
  bonusInsentifList: TunjanganItem[];
  bpjsKesehatanList: BpjsItem[];
  bpjsKetenagakerjaanList: BpjsItem[];
  facilityComboboxOptions: ComboboxOption[];
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  handleToggleTunjangan: (id: string) => void;
  handleToggleBpjs: (id: string) => void;
  handleUpdateItem: (path: string, index: number, value: string) => void;
  handleRemoveItem: (path: string, index: number) => void;
  handleAddRow: (path: string) => void;
}

export const SectionCompensation: React.FC<SectionCompensationProps> = ({
  formData,
  setFormData,
  availableTunjanganList,
  availableBpjsList,
  tunjanganTetapList,
  tunjanganTidakTetapList,
  bonusInsentifList,
  bpjsKesehatanList,
  bpjsKetenagakerjaanList,
  facilityComboboxOptions,
  expandedSections,
  toggleSection,
  handleToggleTunjangan,
  handleToggleBpjs,
  handleUpdateItem,
  handleRemoveItem,
  handleAddRow,
}) => {
  const tunjanganTetapSelectedCount = tunjanganTetapList.filter(item =>
    isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList)
  ).length;

  const tunjanganTidakTetapSelectedCount = tunjanganTidakTetapList.filter(item =>
    isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList)
  ).length;

  const bonusInsentifSelectedCount = bonusInsentifList.filter(item =>
    isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList)
  ).length;

  const bpjsKesehatanSelectedCount = bpjsKesehatanList.filter(item =>
    isBpjsSelected(formData.kompensasi.bpjs, item.id, availableBpjsList)
  ).length;

  const bpjsKetenagakerjaanSelectedCount = bpjsKetenagakerjaanList.filter(item =>
    isBpjsSelected(formData.kompensasi.bpjs, item.id, availableBpjsList)
  ).length;

  const pajakSelectedCount = formData.kompensasi.pajakRuleId || formData.kompensasi.pajak?.length ? 1 : 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Rentang Gaji */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CurrencyInput
            label="Gaji Minimal"
            value={formData.kompensasi.gajiPokok.minimal}
            onChange={(e) => {
              const parsed = e.target.value ? Number(e.target.value) : 0;
              setFormData(prev => ({
                ...prev,
                kompensasi: {
                  ...prev.kompensasi,
                  gajiPokok: { ...prev.kompensasi.gajiPokok, minimal: parsed }
                }
              }));
            }}
          />
          <CurrencyInput
            label="Gaji Standar (Acuan Utama)"
            value={formData.kompensasi.gajiPokok.standar}
            onChange={(e) => {
              const parsed = e.target.value ? Number(e.target.value) : 0;
              setFormData(prev => ({
                ...prev,
                kompensasi: {
                  ...prev.kompensasi,
                  gajiPokok: { ...prev.kompensasi.gajiPokok, standar: parsed }
                }
              }));
            }}
          />
          <CurrencyInput
            label="Gaji Maksimal"
            value={formData.kompensasi.gajiPokok.maksimal}
            onChange={(e) => {
              const parsed = e.target.value ? Number(e.target.value) : 0;
              setFormData(prev => ({
                ...prev,
                kompensasi: {
                  ...prev.kompensasi,
                  gajiPokok: { ...prev.kompensasi.gajiPokok, maksimal: parsed }
                }
              }));
            }}
          />
        </div>
      </div>

      {/* TUNJANGAN GROUPS */}
      <div className="space-y-4">
        {/* 1. Tunjangan Tetap */}
        <div className="space-y-2">
          <div
            onClick={() => toggleSection('tunjanganTetap')}
            className="flex items-center justify-between cursor-pointer select-none group py-1"
          >
            <label className="block text-xs font-semibold text-slate-800 cursor-pointer group-hover:text-blue-600 transition-colors">
              Tunjangan Tetap
            </label>
            <div className="flex items-center gap-2">
              {!expandedSections.tunjanganTetap && tunjanganTetapSelectedCount > 0 && (
                <span className="text-[11px] font-normal text-slate-400">
                  {tunjanganTetapSelectedCount} Tunjangan
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedSections.tunjanganTetap ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {expandedSections.tunjanganTetap && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {tunjanganTetapList.map((item) => {
                const isSelected = isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleTunjangan(item.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-sm font-semibold text-slate-900 truncate">
                        {item.nama}
                      </span>
                      <span className="block text-[11px] font-normal text-slate-500 truncate">
                        {item.nominalFormula || item.deskripsi || `ID: ${item.id}`}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <ToggleSwitch
                        checked={isSelected}
                        onChange={() => handleToggleTunjangan(item.id)}
                        activeColor="bg-blue-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Tunjangan Tidak Tetap */}
        <div className="space-y-2">
          <div
            onClick={() => toggleSection('tunjanganTidakTetap')}
            className="flex items-center justify-between cursor-pointer select-none group py-1"
          >
            <label className="block text-xs font-semibold text-slate-800 cursor-pointer group-hover:text-blue-600 transition-colors">
              Tunjangan Tidak Tetap
            </label>
            <div className="flex items-center gap-2">
              {!expandedSections.tunjanganTidakTetap && tunjanganTidakTetapSelectedCount > 0 && (
                <span className="text-[11px] font-normal text-slate-400">
                  {tunjanganTidakTetapSelectedCount} Tunjangan
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedSections.tunjanganTidakTetap ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {expandedSections.tunjanganTidakTetap && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {tunjanganTidakTetapList.map((item) => {
                const isSelected = isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleTunjangan(item.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-sm font-semibold text-slate-900 truncate">
                        {item.nama}
                      </span>
                      <span className="block text-[11px] font-normal text-slate-500 truncate">
                        {item.nominalFormula || item.deskripsi || `ID: ${item.id}`}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <ToggleSwitch
                        checked={isSelected}
                        onChange={() => handleToggleTunjangan(item.id)}
                        activeColor="bg-blue-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Bonus & Insentif */}
        <div className="space-y-2">
          <div
            onClick={() => toggleSection('bonusInsentif')}
            className="flex items-center justify-between cursor-pointer select-none group py-1"
          >
            <label className="block text-xs font-semibold text-slate-800 cursor-pointer group-hover:text-blue-600 transition-colors">
              Bonus &amp; Insentif
            </label>
            <div className="flex items-center gap-2">
              {!expandedSections.bonusInsentif && bonusInsentifSelectedCount > 0 && (
                <span className="text-[11px] font-normal text-slate-400">
                  {bonusInsentifSelectedCount} Tunjangan
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedSections.bonusInsentif ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {expandedSections.bonusInsentif && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {bonusInsentifList.map((item) => {
                const isSelected = isTunjanganSelected(formData.kompensasi.tunjangan, item.id, availableTunjanganList);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleTunjangan(item.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-sm font-semibold text-slate-900 truncate">
                        {item.nama}
                      </span>
                      <span className="block text-[11px] font-normal text-slate-500 truncate">
                        {item.nominalFormula || item.deskripsi || `ID: ${item.id}`}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <ToggleSwitch
                        checked={isSelected}
                        onChange={() => handleToggleTunjangan(item.id)}
                        activeColor="bg-blue-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* BPJS GROUPS */}
      <div className="space-y-4">
        {/* BPJS Kesehatan */}
        <div className="space-y-2">
          <div
            onClick={() => toggleSection('bpjsKesehatan')}
            className="flex items-center justify-between cursor-pointer select-none group py-1"
          >
            <label className="block text-xs font-semibold text-slate-800 cursor-pointer group-hover:text-blue-600 transition-colors">
              BPJS Kesehatan
            </label>
            <div className="flex items-center gap-2">
              {!expandedSections.bpjsKesehatan && bpjsKesehatanSelectedCount > 0 && (
                <span className="text-[11px] font-normal text-slate-400">
                  {bpjsKesehatanSelectedCount} BPJS
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedSections.bpjsKesehatan ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {expandedSections.bpjsKesehatan && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {bpjsKesehatanList.map((prog) => {
                const isChecked = isBpjsSelected(formData.kompensasi.bpjs, prog.id, availableBpjsList);
                return (
                  <div
                    key={prog.id}
                    onClick={() => handleToggleBpjs(prog.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-sm font-semibold text-slate-900 truncate">
                        {prog.nama}
                      </span>
                      <span className="block text-[11px] font-normal text-slate-500 truncate">
                        {prog.nominalFormula || prog.deskripsi || `ID: ${prog.id}`}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <ToggleSwitch
                        checked={isChecked}
                        onChange={() => handleToggleBpjs(prog.id)}
                        activeColor="bg-blue-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BPJS Ketenagakerjaan */}
        <div className="space-y-2">
          <div
            onClick={() => toggleSection('bpjsKetenagakerjaan')}
            className="flex items-center justify-between cursor-pointer select-none group py-1"
          >
            <label className="block text-xs font-semibold text-slate-800 cursor-pointer group-hover:text-blue-600 transition-colors">
              BPJS Ketenagakerjaan
            </label>
            <div className="flex items-center gap-2">
              {!expandedSections.bpjsKetenagakerjaan && bpjsKetenagakerjaanSelectedCount > 0 && (
                <span className="text-[11px] font-normal text-slate-400">
                  {bpjsKetenagakerjaanSelectedCount} BPJS
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedSections.bpjsKetenagakerjaan ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {expandedSections.bpjsKetenagakerjaan && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {bpjsKetenagakerjaanList.map((prog) => {
                const isChecked = isBpjsSelected(formData.kompensasi.bpjs, prog.id, availableBpjsList);
                return (
                  <div
                    key={prog.id}
                    onClick={() => handleToggleBpjs(prog.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-sm font-semibold text-slate-900 truncate">
                        {prog.nama}
                      </span>
                      <span className="block text-[11px] font-normal text-slate-500 truncate">
                        {prog.nominalFormula || prog.deskripsi || `ID: ${prog.id}`}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <ToggleSwitch
                        checked={isChecked}
                        onChange={() => handleToggleBpjs(prog.id)}
                        activeColor="bg-blue-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. REGULASI PAJAK (PPH 21) */}
      <div className="space-y-2">
        <div
          onClick={() => toggleSection('pajak')}
          className="flex items-center justify-between cursor-pointer select-none group py-1"
        >
          <label className="block text-xs font-semibold text-slate-800 cursor-pointer group-hover:text-blue-600 transition-colors">
            Regulasi Pajak (PPh 21)
          </label>
          <div className="flex items-center gap-2">
            {!expandedSections.pajak && pajakSelectedCount > 0 && (
              <span className="text-[11px] font-normal text-slate-400">
                {pajakSelectedCount} Pajak
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedSections.pajak ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {expandedSections.pajak && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {[
              {
                id: 'pajak-pph21-ter',
                name: 'PPh 21 Tarif Efektif Rata Rata',
                desc: 'Tarif Efektif Rata-rata Kategori A, B, C untuk pegawai tetap / bulanan'
              },
              {
                id: 'pajak-pph21-pasal17',
                name: 'PPh 21 Tarif Progresif',
                desc: 'Lapis Tarif Progresif UU HPP (5% s/d 35%) berbasis PKP setelah PTKP'
              },
              {
                id: 'pajak-pph21-harian',
                name: 'PPh 21 Pegawai Harian / Lepas',
                desc: 'Perhitungan khusus upah harian / tidak tetap sesuai PMK 168 Pasal 5'
              }
            ].map(taxOpt => {
              const currentRuleId = normalizePajakId(formData.kompensasi.pajakRuleId || formData.kompensasi.pajak?.[0]);
              const isSelected = currentRuleId === taxOpt.id;
              return (
                <div
                  key={taxOpt.id}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      kompensasi: {
                        ...prev.kompensasi,
                        pajakRuleId: taxOpt.id,
                        pajak: [taxOpt.id]
                      }
                    }));
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 opacity-80'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="block text-sm font-semibold text-slate-900 truncate">
                      {taxOpt.name}
                    </span>
                    <span className="block text-[11px] font-normal text-slate-500 truncate">
                      {taxOpt.desc}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <ToggleSwitch
                      checked={isSelected}
                      onChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          kompensasi: {
                            ...prev.kompensasi,
                            pajakRuleId: taxOpt.id,
                            pajak: [taxOpt.id]
                          }
                        }));
                      }}
                      activeColor="bg-blue-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. FASILITAS KERJA */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="block text-[11px] font-normal text-slate-600">
            Fasilitas Kerja (Inventaris & Fasilitas Tambahan)
          </label>
          <button
            type="button"
            onClick={() => handleAddRow('kompensasi.fasilitas')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors cursor-pointer shrink-0"
            title="Tambah Baris Input"
          >
            + Tambah
          </button>
        </div>

        {formData.kompensasi.fasilitas.length === 0 ? (
          <div
            onClick={() => handleAddRow('kompensasi.fasilitas')}
            className="p-3 border border-dashed border-slate-200/90 rounded-xl bg-slate-50/50 hover:bg-blue-50/20 hover:border-blue-300 text-center text-xs text-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
            <span>Klik Tambah untuk menambah fasilitas</span>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.kompensasi.fasilitas.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[11px] font-normal text-slate-400 select-none shrink-0 w-4 text-right">
                    {idx + 1}.
                  </span>
                  <div className="flex-1">
                    <ComboboxInput
                      value={item}
                      onChange={(val) => handleUpdateItem('kompensasi.fasilitas', idx, val)}
                      options={facilityComboboxOptions}
                      placeholder="Pilih fasilitas standar atau ketik fasilitas..."
                      customPromptText="sebagai fasilitas baru"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem('kompensasi.fasilitas', idx)}
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
    </div>
  );
};
