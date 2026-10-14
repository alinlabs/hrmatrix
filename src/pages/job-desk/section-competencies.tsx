import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Zap, 
  Sparkles, 
  Plus, 
  Trash2, 
  X 
} from 'lucide-react';
import { 
  JobTemplate, 
  EducationDegreeLevel, 
  StructuredExperienceItem, 
  StructuredCertificationItem, 
  StructuredSkillItem,
  CertificationTypeCategory 
} from './types';
import { 
  DEGREE_LEVEL_OPTIONS, 
  STANDARD_MAJORS_COMBOBOX, 
  EXPERIENCE_DURATION_OPTIONS, 
  INDUSTRY_SECTOR_OPTIONS, 
  CERTIFICATION_CATEGORY_OPTIONS, 
  SKILL_PROFICIENCY_LEVELS 
} from './qualification-options';
import { ComboboxInput, ComboboxOption } from '../../components/ui';

interface SectionCompetenciesProps {
  formData: JobTemplate;
  eduLevel: EducationDegreeLevel;
  setEduLevel: React.Dispatch<React.SetStateAction<EducationDegreeLevel>>;
  selectedMajors: string[];
  setSelectedMajors: React.Dispatch<React.SetStateAction<string[]>>;
  eduDesc: string;
  setEduDesc: React.Dispatch<React.SetStateAction<string>>;
  expItems: StructuredExperienceItem[];
  setExpItems: React.Dispatch<React.SetStateAction<StructuredExperienceItem[]>>;
  certItems: StructuredCertificationItem[];
  setCertItems: React.Dispatch<React.SetStateAction<StructuredCertificationItem[]>>;
  hardSkillsDetailed: StructuredSkillItem[];
  setHardSkillsDetailed: React.Dispatch<React.SetStateAction<StructuredSkillItem[]>>;
  softSkillsDetailed: StructuredSkillItem[];
  setSoftSkillsDetailed: React.Dispatch<React.SetStateAction<StructuredSkillItem[]>>;
  hardSkillComboboxOptions: ComboboxOption[];
  softSkillComboboxOptions: ComboboxOption[];
  documentComboboxOptions: ComboboxOption[];
  handleUpdateItem: (path: string, index: number, value: string) => void;
  handleRemoveItem: (path: string, index: number) => void;
  handleAddRow: (path: string) => void;
}

export const SectionCompetencies: React.FC<SectionCompetenciesProps> = ({
  formData,
  eduLevel,
  setEduLevel,
  selectedMajors,
  setSelectedMajors,
  eduDesc,
  setEduDesc,
  expItems,
  setExpItems,
  certItems,
  setCertItems,
  hardSkillsDetailed,
  setHardSkillsDetailed,
  softSkillsDetailed,
  setSoftSkillsDetailed,
  hardSkillComboboxOptions,
  softSkillComboboxOptions,
  documentComboboxOptions,
  handleUpdateItem,
  handleRemoveItem,
  handleAddRow,
}) => {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. PENDIDIKAN MINIMAL & JURUSAN / BIDANG STUDI */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">1. Kualifikasi Pendidikan & Jurusan Relevan</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tingkat Pendidikan Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tingkat Pendidikan Minimal <span className="text-rose-500">*</span>
            </label>
            <select
              value={eduLevel}
              onChange={(e) => setEduLevel(e.target.value as EducationDegreeLevel)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            >
              {DEGREE_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Pilih kualifikasi tingkat pendidikan minimal posisi ini</p>
          </div>

          {/* Jurusan / Bidang Studi Combobox Multi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Jurusan / Bidang Studi Terkait (Combobox)
            </label>
            <ComboboxInput
              placeholder="Pilih jurusan standar atau ketik jurusan kustom..."
              value=""
              onChange={(val) => {
                if (val.trim() && !selectedMajors.includes(val.trim())) {
                  setSelectedMajors(prev => [...prev, val.trim()]);
                }
              }}
              options={STANDARD_MAJORS_COMBOBOX}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedMajors.map((m, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                  <span>{m}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedMajors(prev => prev.filter((_, i) => i !== idx))}
                    className="text-blue-400 hover:text-rose-600 cursor-pointer"
                    title="Hapus Jurusan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Catatan Tambahan Kualifikasi Pendidikan (Opsional)
          </label>
          <input
            type="text"
            value={eduDesc}
            onChange={(e) => setEduDesc(e.target.value)}
            placeholder="Contoh: Akreditasi jurusan minimal B / Sangat diutamakan dari Perguruan Tinggi Negeri"
            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* 2. PENGALAMAN KERJA RELEVAN */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">2. Persyaratan Pengalaman Kerja (Structured Row)</h3>
          </div>
          <button
            type="button"
            onClick={() => setExpItems(prev => [...prev, { id: `exp-${Date.now()}`, lamaPengalaman: '1 - 2 Tahun', posisi: '', bidangIndustri: '' }])}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Baris Pengalaman</span>
          </button>
        </div>

        <div className="space-y-3">
          {expItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-3">Belum ada baris pengalaman. Klik "Tambah Baris Pengalaman".</p>
          ) : (
            expItems.map((exp, idx) => (
              <div key={exp.id} className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 relative shadow-2xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Lama Pengalaman</label>
                  <select
                    value={exp.lamaPengalaman}
                    onChange={(e) => {
                      const val = e.target.value;
                      setExpItems(prev => prev.map((item, i) => i === idx ? { ...item, lamaPengalaman: val } : item));
                    }}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    {EXPERIENCE_DURATION_OPTIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Posisi / Jabatan Relevan</label>
                  <input
                    type="text"
                    value={exp.posisi}
                    onChange={(e) => {
                      const val = e.target.value;
                      setExpItems(prev => prev.map((item, i) => i === idx ? { ...item, posisi: val } : item));
                    }}
                    placeholder="Contoh: Senior Software Engineer"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bidang Industri Relevan</label>
                    <ComboboxInput
                      value={exp.bidangIndustri}
                      onChange={(val) => {
                        setExpItems(prev => prev.map((item, i) => i === idx ? { ...item, bidangIndustri: val } : item));
                      }}
                      options={INDUSTRY_SECTOR_OPTIONS}
                      placeholder="Pilih bidang industri..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpItems(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg self-end mb-1 cursor-pointer shrink-0"
                    title="Hapus Pengalaman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. SERTIFIKASI PROFESI & LISENSI */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">3. Persyaratan Sertifikasi & Lisensi</h3>
          </div>
          <button
            type="button"
            onClick={() => setCertItems(prev => [...prev, { id: `cert-${Date.now()}`, jenisSertifikasi: 'BNSP', namaSertifikasi: '', bidangSertifikasi: '' }])}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sertifikasi</span>
          </button>
        </div>

        <div className="space-y-3">
          {certItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-2">Belum ada persyaratan sertifikasi khusus. Klik "Tambah Sertifikasi".</p>
          ) : (
            certItems.map((cert, idx) => (
              <div key={cert.id} className="p-3.5 bg-purple-50/30 border border-purple-100 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 relative shadow-2xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jenis Sertifikasi</label>
                  <select
                    value={cert.jenisSertifikasi}
                    onChange={(e) => {
                      const val = e.target.value as CertificationTypeCategory;
                      setCertItems(prev => prev.map((item, i) => i === idx ? { ...item, jenisSertifikasi: val } : item));
                    }}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    {CERTIFICATION_CATEGORY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Sertifikasi</label>
                  <input
                    type="text"
                    value={cert.namaSertifikasi}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCertItems(prev => prev.map((item, i) => i === idx ? { ...item, namaSertifikasi: val } : item));
                    }}
                    placeholder="Contoh: CHRP / Certified HR Manager"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bidang Keahlian Sertifikasi</label>
                    <input
                      type="text"
                      value={cert.bidangSertifikasi}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCertItems(prev => prev.map((item, i) => i === idx ? { ...item, bidangSertifikasi: val } : item));
                      }}
                      placeholder="Contoh: Manajemen SDM & Hubungan Industrial"
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCertItems(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg self-end mb-1 cursor-pointer shrink-0"
                    title="Hapus Sertifikasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. HARD SKILLS & SOFT SKILLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* HARD SKILLS */}
        <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Hard Skills (Kompetensi Teknis) & Level</span>
            </h3>
            <button
              type="button"
              onClick={() => setHardSkillsDetailed(prev => [...prev, { id: `tech-${Date.now()}`, namaSkill: '', tingkatKemahiran: 'Mahir', kategori: 'Teknis' }])}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Skill</span>
            </button>
          </div>

          <div className="space-y-3">
            {hardSkillsDetailed.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">Belum ada hard skill. Klik "Tambah Skill".</p>
            ) : (
              hardSkillsDetailed.map((skill, idx) => (
                <div key={skill.id} className="p-3 bg-blue-50/20 border border-blue-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <ComboboxInput
                        value={skill.namaSkill}
                        onChange={(val) => {
                          setHardSkillsDetailed(prev => prev.map((s, i) => i === idx ? { ...s, namaSkill: val } : s));
                        }}
                        options={hardSkillComboboxOptions}
                        placeholder="Pilih hard skill atau ketik..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setHardSkillsDetailed(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                      title="Hapus Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">Level Kemahiran:</span>
                    {SKILL_PROFICIENCY_LEVELS.map(lvl => {
                      const isSelected = skill.tingkatKemahiran === lvl.value;
                      return (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setHardSkillsDetailed(prev => prev.map((s, i) => i === idx ? { ...s, tingkatKemahiran: lvl.value } : s))}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                            isSelected ? lvl.badgeBg + ' shadow-2xs ring-1' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lvl.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SOFT SKILLS */}
        <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Soft Skills (Non-Teknis) & Level</span>
            </h3>
            <button
              type="button"
              onClick={() => setSoftSkillsDetailed(prev => [...prev, { id: `soft-${Date.now()}`, namaSkill: '', tingkatKemahiran: 'Mahir', kategori: 'Non-Teknis' }])}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Skill</span>
            </button>
          </div>

          <div className="space-y-3">
            {softSkillsDetailed.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">Belum ada soft skill. Klik "Tambah Skill".</p>
            ) : (
              softSkillsDetailed.map((skill, idx) => (
                <div key={skill.id} className="p-3 bg-indigo-50/20 border border-indigo-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <ComboboxInput
                        value={skill.namaSkill}
                        onChange={(val) => {
                          setSoftSkillsDetailed(prev => prev.map((s, i) => i === idx ? { ...s, namaSkill: val } : s));
                        }}
                        options={softSkillComboboxOptions}
                        placeholder="Pilih soft skill atau ketik..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoftSkillsDetailed(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                      title="Hapus Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">Level Kemahiran:</span>
                    {SKILL_PROFICIENCY_LEVELS.map(lvl => {
                      const isSelected = skill.tingkatKemahiran === lvl.value;
                      return (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setSoftSkillsDetailed(prev => prev.map((s, i) => i === idx ? { ...s, tingkatKemahiran: lvl.value } : s))}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                            isSelected ? lvl.badgeBg + ' shadow-2xs ring-1' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lvl.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. SYARAT KHUSUS & DOKUMEN ADMINISTRASI WAJIB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderListEditor(
          "Syarat Khusus Tambahan",
          formData.kualifikasi.syaratKhusus,
          "kualifikasi.syaratKhusus",
          "Contoh: Bersedia dinas luar kota, SIM A aktif"
        )}

        {renderListEditor(
          "Dokumen Administrasi Wajib",
          formData.dokumenAdministrasi.wajib,
          "dokumenAdministrasi.wajib",
          "Pilih dokumen standar atau ketik dokumen...",
          documentComboboxOptions
        )}
      </div>
    </div>
  );
};
