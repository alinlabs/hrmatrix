import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { JobTemplate, KPIItem } from './types';
import { Input, Select, ComboboxInput, ComboboxOption } from '../../components/ui';
import { cn } from '../../utils/cn';

interface SectionJobDetailsProps {
  formData: JobTemplate;
  setFormData: React.Dispatch<React.SetStateAction<JobTemplate>>;
  errors: Record<string, string>;
  activeStep: 'posisi' | 'tugas' | 'kpi';
  categoryOptions: ComboboxOption[];
  departmentOptions: ComboboxOption[];
  levelOptions: ComboboxOption[];
  atasanOptions: ComboboxOption[];
  dasarUkurComboboxOptions: ComboboxOption[];
  handleUpdateItem: (path: string, index: number, value: string) => void;
  handleRemoveItem: (path: string, index: number) => void;
  handleAddRow: (path: string) => void;
  handleAddKpiCard: () => void;
  handleUpdateKpiField: (index: number, field: keyof KPIItem, value: any) => void;
  handleRemoveKpiIndex: (index: number) => void;
}

export const SectionJobDetails: React.FC<SectionJobDetailsProps> = ({
  formData,
  setFormData,
  errors,
  activeStep,
  categoryOptions,
  departmentOptions,
  levelOptions,
  atasanOptions,
  dasarUkurComboboxOptions,
  handleUpdateItem,
  handleRemoveItem,
  handleAddRow,
  handleAddKpiCard,
  handleUpdateKpiField,
  handleRemoveKpiIndex,
}) => {
  // Helper for rendering dynamic editable row list
  const renderListEditor = (
    label: string,
    items: string[],
    path: string,
    placeholder?: string,
    comboboxOptions?: ComboboxOption[]
  ) => {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="block text-[11px] font-normal text-slate-600">
            {label}
          </label>
          <button
            type="button"
            onClick={() => handleAddRow(path)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors cursor-pointer shrink-0"
            title="Tambah Baris Input"
            aria-label={`Tambah ${label}`}
          >
            Tambah
          </button>
        </div>

        {/* List Input Rows */}
        {items.length === 0 ? (
          <div 
            onClick={() => handleAddRow(path)}
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
                          handleAddRow(path);
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

  if (activeStep === 'posisi') {
    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        {/* Nama Posisi */}
        <div>
          <Input
            label="Nama Posisi / Jabatan *"
            required
            placeholder=""
            value={formData.nama}
            onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
            error={errors.nama}
          />
        </div>

        {/* Kategori, Departemen & Level Jabatan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Select
            label="Kategori / Sektor"
            value={formData.kategori}
            onChange={(e) => {
              const newCat = e.target.value;
              setFormData(prev => ({ 
                ...prev, 
                kategori: newCat,
                departemen: prev.departemen || (newCat ? `${newCat} Department` : '')
              }));
            }}
            options={categoryOptions}
          />

          <Select
            label="Departemen *"
            value={formData.departemen}
            onChange={(e) => {
              const newDept = e.target.value;
              setFormData(prev => ({ 
                ...prev, 
                departemen: newDept,
                kategori: prev.kategori || newDept.replace(/\s+department$/i, '').trim()
              }));
            }}
            options={departmentOptions}
          />

          <Select
            label="Level Jabatan"
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
            options={levelOptions}
          />
        </div>

        {/* Atasan Langsung */}
        <Select
          label="Atasan Langsung"
          value={formData.atasanLangsung}
          onChange={(e) => setFormData(prev => ({ ...prev, atasanLangsung: e.target.value }))}
          options={atasanOptions}
        />

        {/* Tujuan Jabatan */}
        <div>
          <label className="block text-[11px] font-normal text-slate-600 mb-1">
            Tujuan Utama Jabatan <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder=""
            value={formData.tujuanJabatan}
            onChange={(e) => setFormData(prev => ({ ...prev, tujuanJabatan: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent leading-relaxed"
          />
          {errors.tujuanJabatan && <p className="text-[11px] text-red-500 mt-1">{errors.tujuanJabatan}</p>}
        </div>

        {/* Hubungan Kerja */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderListEditor("Hubungan Kerja Internal", formData.hubunganKerja.internal, "hubunganKerja.internal")}
          {renderListEditor("Hubungan Kerja Eksternal", formData.hubunganKerja.eksternal, "hubunganKerja.eksternal")}
        </div>
      </div>
    );
  }

  if (activeStep === 'tugas') {
    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        {/* Fungsi Utama */}
        <div>
          {renderListEditor("Fungsi & Pilar Utama Posisi", formData.fungsiUtama, "fungsiUtama")}
        </div>

        {/* Tanggung Jawab */}
        <div>
          {renderListEditor("Tanggung Jawab Utama *", formData.tanggungJawab, "tanggungJawab")}
          {errors.tanggungJawab && <p className="text-[11px] text-red-500 mt-1">{errors.tanggungJawab}</p>}
        </div>

        {/* Wewenang */}
        <div>
          {renderListEditor("Wewenang Resmi Posisi", formData.wewenang, "wewenang")}
        </div>

        {/* Rutinitas & Tugas Harian (Daily Work) */}
        <div>
          {renderListEditor(
            "Rutinitas & Checklist Tugas Harian (Daily Work / SOP Harian)",
            formData.tugasHarian || [],
            "tugasHarian",
            "Contoh: Rekonsiliasi data operasional harian dan checklist SOP..."
          )}
          <p className="text-[11px] text-slate-500 mt-1">
            * Panduan tugas harian per orang untuk operasional, SOP, checklist harian, dan evaluasi kinerja.
          </p>
        </div>

        {/* Output yang Diharapkan */}
        <div>
          {renderListEditor("Output / Deliverables yang Diharapkan", formData.outputDiharapkan, "outputDiharapkan")}
        </div>
      </div>
    );
  }

  if (activeStep === 'kpi') {
    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        {/* Section Header with Title on Left & Blue "Tambah" Text Button on Right */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="block text-[11px] font-normal text-slate-600">
            Indikator Performa Utama (KPI)
          </label>
          <button
            type="button"
            onClick={handleAddKpiCard}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors cursor-pointer shrink-0"
            title="Tambah Indikator KPI Baru"
          >
            Tambah
          </button>
        </div>

        {/* KPI Editable Group Items (Flat Layout - No Card Wrapper) */}
        <div className="space-y-5">
          {formData.kpi.map((kpiItem, index) => (
            <div
              key={kpiItem.id || index}
              className={cn("space-y-3 relative", index > 0 && "pt-4 border-t border-slate-200/80")}
            >
              {/* Input fields directly without card box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="block text-[11px] font-normal text-slate-600">
                      Nama Indikator KPI <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveKpiIndex(index)}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 active:text-rose-800 transition-colors cursor-pointer"
                      title="Hapus Indikator KPI"
                    >
                      <span>Hapus indikator</span>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Input
                    placeholder=""
                    value={kpiItem.nama}
                    onChange={(e) => handleUpdateKpiField(index, 'nama', e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Deskripsi & Tata Cara Penilaian
                  </label>
                  <textarea
                    rows={2}
                    placeholder=""
                    value={kpiItem.deskripsi}
                    onChange={(e) => handleUpdateKpiField(index, 'deskripsi', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent leading-relaxed"
                  />
                </div>

                {/* Minimum Skor & Bobot KPI - Always side-by-side (2 columns) */}
                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-normal text-slate-600 mb-1">
                      Minimum Skor (0-100) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder=""
                      value={kpiItem.minimumSkor !== undefined && kpiItem.minimumSkor !== 0 ? kpiItem.minimumSkor : ''}
                      onChange={(e) => handleUpdateKpiField(index, 'minimumSkor', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent box-border min-h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-normal text-slate-600 mb-1">
                      Bobot KPI (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder=""
                      value={kpiItem.bobot !== undefined && kpiItem.bobot !== 0 ? kpiItem.bobot : ''}
                      onChange={(e) => handleUpdateKpiField(index, 'bobot', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent box-border min-h-[36px]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Dasar Ukur <span className="text-red-500">*</span>
                  </label>
                  <ComboboxInput
                    placeholder="Pilih dasar ukur standar atau ketik kustom..."
                    value={kpiItem.dasarUkur || ''}
                    onChange={(val) => handleUpdateKpiField(index, 'dasarUkur', val)}
                    options={dasarUkurComboboxOptions}
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.kpi.length === 0 && (
            <div className="text-center py-8 bg-slate-50/50 border border-dashed border-slate-200/90 rounded-xl">
              <p className="text-xs text-slate-500 mb-2">Belum ada Indikator KPI yang ditambahkan.</p>
              <button
                type="button"
                onClick={handleAddKpiCard}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal rounded-lg inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Indikator KPI
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
