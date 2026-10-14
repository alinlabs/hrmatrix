import React from 'react';
import { PaymentRuleTier } from '../../types';
import { DollarSign, Percent, Clock, Gift, Layers, Award, Info, Check, Trash2 } from 'lucide-react';

interface SectionPerhitunganTunjanganProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  activeInfoTooltip: string | null;
  setActiveInfoTooltip: React.Dispatch<React.SetStateAction<string | null>>;
  handleSelectScheme: (scheme: string) => void;
  handleAddAturan: () => void;
  updateAturan: (index: number, updates: Partial<PaymentRuleTier>) => void;
  removeAturan: (index: number) => void;
}

export const SectionPerhitunganTunjangan: React.FC<SectionPerhitunganTunjanganProps> = ({
  formData,
  setFormData,
  activeInfoTooltip,
  setActiveInfoTooltip,
  handleSelectScheme,
  handleAddAturan,
  updateAturan,
  removeAturan
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-normal text-slate-600 mb-1">
        Metode Perhitungan
      </label>
      
      {/* Model Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {[
          {
            id: 'tetap',
            title: 'Nominal Tetap (Rp)',
            desc: 'Jumlah Rupiah pasti diterima utuh per periode.',
            icon: DollarSign
          },
          {
            id: 'persentase',
            title: 'Persentase Gaji Pokok (%)',
            desc: 'Dihitung dari persentase besaran Gaji Pokok.',
            icon: Percent
          },
          {
            id: 'harian',
            title: 'Tarif Harian Kehadiran',
            desc: 'Tarif per hari masuk kerja dikali total kehadiran.',
            icon: Clock
          },
          {
            id: 'prorata',
            title: 'Prorata Masa Kerja (THR)',
            desc: 'Proporsional untuk masa kerja belum 12 bulan.',
            icon: Gift
          },
          {
            id: 'berjenjang',
            title: 'Berjenjang (Tiering)',
            desc: 'Nilai bertingkat sesuai rentang masa kerja.',
            icon: Layers
          },
          {
            id: 'kelipatan',
            title: 'Kelipatan Masa Kerja',
            desc: 'Nominal dikalikan jumlah tahun masa kerja.',
            icon: Award
          }
        ].map(scheme => {
          const active = formData.metode_perhitungan === scheme.id;
          const Icon = scheme.icon;
          return (
            <button
              key={scheme.id}
              type="button"
              onClick={() => handleSelectScheme(scheme.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                active 
                  ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 shadow-2xs' 
                  : 'bg-white border-slate-200/90 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-bold leading-tight ${active ? 'text-blue-900' : 'text-slate-800'}`}>
                  {scheme.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {scheme.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* INPUT VALUE SECTION (Terspesialisasi sesuai skema yang aktif) */}
      <div className="space-y-4 mt-6">
        {/* 1. Jika Nominal Tetap */}
        {formData.metode_perhitungan === 'tetap' && (
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-normal text-slate-600">
                Nominal Tetap
              </label>
              <button
                type="button"
                onClick={() => setActiveInfoTooltip(prev => prev === 'tetap' ? null : 'tetap')}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  activeInfoTooltip === 'tetap' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Informasi Tambahan"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-400 pointer-events-none">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder=""
                value={formData.nilai !== undefined && formData.nilai !== null && formData.nilai !== 0 ? new Intl.NumberFormat('id-ID').format(formData.nilai) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  const val = raw === '' ? 0 : parseInt(raw, 10);
                  setFormData({ ...formData, nilai: val, fixedAmount: val });
                }}
              />
            </div>
            {activeInfoTooltip === 'tetap' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-150">
                Karyawan yang berhak akan menerima nominal ini secara penuh setiap {formData.frekuensi_pembayaran === 'triwulanan' ? 'triwulan (3 bulan)' : formData.frekuensi_pembayaran}.
              </div>
            )}
          </div>
        )}

        {/* 2. Jika Persentase */}
        {formData.metode_perhitungan === 'persentase' && (
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-normal text-slate-600">
                Persentase Gaji Pokok
              </label>
              <button
                type="button"
                onClick={() => setActiveInfoTooltip(prev => prev === 'persentase' ? null : 'persentase')}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  activeInfoTooltip === 'persentase' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Informasi Tambahan"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder=""
                value={formData.nilai !== undefined && formData.nilai !== null && formData.nilai !== 0 ? formData.nilai : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  setFormData({ ...formData, nilai: val === '' ? 0 : parseFloat(val), employeeShare: val === '' ? 0 : parseFloat(val) });
                }}
              />
              <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
            </div>
            {activeInfoTooltip === 'persentase' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-150">
                Nilai tunjangan dihitung langsung dari persentase terhadap besaran gaji pokok aktif karyawan.
              </div>
            )}
          </div>
        )}

        {/* 3. Jika Tarif Harian Kehadiran */}
        {formData.metode_perhitungan === 'harian' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-normal text-slate-600">
                    Nominal Tetap per Kehadiran
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTooltip(prev => prev === 'harian_nominal' ? null : 'harian_nominal')}
                    className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                      activeInfoTooltip === 'harian_nominal' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Informasi Nominal per Kehadiran"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400 pointer-events-none">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder=""
                    value={
                      formData.dasar_perhitungan === 'Nominal' && formData.nilai !== undefined && formData.nilai !== null && formData.nilai !== 0
                        ? new Intl.NumberFormat('id-ID').format(formData.nilai)
                        : (formData.fixedAmount && formData.fixedAmount !== 0 ? new Intl.NumberFormat('id-ID').format(formData.fixedAmount) : '')
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      const val = raw === '' ? 0 : parseInt(raw, 10);
                      setFormData({ 
                        ...formData, 
                        nilai: val,
                        fixedAmount: val,
                        unitRate: val,
                        dasar_perhitungan: 'Nominal'
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-normal text-slate-600">
                    Persentase Upah Harian
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTooltip(prev => prev === 'harian_persen' ? null : 'harian_persen')}
                    className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                      activeInfoTooltip === 'harian_persen' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Informasi Persentase Upah Harian"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder=""
                    value={
                      formData.dasar_perhitungan === 'Gaji Pokok' && formData.nilai !== undefined && formData.nilai !== null && formData.nilai !== 0
                        ? formData.nilai
                        : ((formData as any).persentase_harian && (formData as any).persentase_harian !== 0 ? (formData as any).persentase_harian : '')
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9.]/g, '');
                      const val = raw === '' ? 0 : parseFloat(raw);
                      setFormData({ 
                        ...formData, 
                        nilai: val,
                        employeeShare: val,
                        persentase_harian: val,
                        dasar_perhitungan: 'Gaji Pokok'
                      } as any);
                    }}
                  />
                  <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                </div>
              </div>
            </div>

            {activeInfoTooltip === 'harian_nominal' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-150">
                Total bulanan dihitung dari: [Nominal per Hari] × [Jumlah Hari Karyawan Hadir Masuk Kerja (In-Out)].
              </div>
            )}
            {activeInfoTooltip === 'harian_persen' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-150">
                Total bulanan dihitung dari: [Persentase %] × [Upah Harian (Gaji Pokok / 25)] × [Jumlah Hari Karyawan Hadir Masuk Kerja].
              </div>
            )}
          </div>
        )}

        {/* 4. Jika Prorata Masa Kerja */}
        {formData.metode_perhitungan === 'prorata' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-normal text-slate-600">
                    Persentase Gaji Pokok
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTooltip(prev => prev === 'prorata_persen' ? null : 'prorata_persen')}
                    className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                      activeInfoTooltip === 'prorata_persen' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Informasi Persentase Gaji Pokok"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder=""
                    value={formData.nilai !== undefined && formData.nilai !== null && formData.nilai !== 0 ? formData.nilai : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setFormData({ ...formData, nilai: val === '' ? 0 : parseFloat(val) });
                    }}
                  />
                  <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-normal text-slate-600">
                    Periode Acuan
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTooltip(prev => prev === 'prorata_periode' ? null : 'prorata_periode')}
                    className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                      activeInfoTooltip === 'prorata_periode' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Informasi Periode Acuan"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-14 py-2.5 text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder=""
                    value={formData.periode_dasar !== undefined && formData.periode_dasar !== null && formData.periode_dasar !== 0 ? formData.periode_dasar : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, periode_dasar: val === '' ? 0 : parseInt(val, 10) });
                    }}
                  />
                  <span className="absolute right-3 text-xs font-bold text-slate-400 pointer-events-none">Bulan</span>
                </div>
              </div>
            </div>

            {activeInfoTooltip === 'prorata_persen' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-150">
                Nilai basis penuh tunjangan yang dihitung dari persentase gaji pokok (standar umum THR: 100% atau 1 bulan upah pokok).
              </div>
            )}
            {activeInfoTooltip === 'prorata_periode' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-150">
                Karyawan dengan masa kerja ≥ 12 bulan menerima 100% penuh, sedangkan karyawan dengan masa kerja di bawah 12 bulan dihitung secara prorata (Masa Kerja dalam Bulan / 12 × Gaji Pokok).
              </div>
            )}
          </div>
        )}

        {/* 5. Jika Kelipatan Masa Kerja */}
        {formData.metode_perhitungan === 'kelipatan' && (
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-normal text-slate-600">
                Tarif per 1 Tahun Masa Kerja (Rp / Tahun)
              </label>
              <button
                type="button"
                onClick={() => setActiveInfoTooltip(prev => prev === 'kelipatan' ? null : 'kelipatan')}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  activeInfoTooltip === 'kelipatan' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Informasi Tambahan"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-400 pointer-events-none">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder=""
                value={formData.nilai !== undefined && formData.nilai !== null && formData.nilai !== 0 ? new Intl.NumberFormat('id-ID').format(formData.nilai) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  const val = raw === '' ? 0 : parseInt(raw, 10);
                  setFormData({ ...formData, nilai: val });
                }}
              />
            </div>
            {activeInfoTooltip === 'kelipatan' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-150">
                Total tunjangan dihitung dari perkalian antara tarif per tahun dengan total masa kerja karyawan.
              </div>
            )}
          </div>
        )}

        {/* 6. Jika Berjenjang (Tiering Table) */}
        {formData.metode_perhitungan === 'berjenjang' && (() => {
          const currentJenis = (formData as any).jenis_jenjang || (formData.parameter_jenjang?.parameter === 'level_jabatan' ? 'custom_level' : 'masa_kerja');
          const isCustomLevel = currentJenis === 'custom_level';

          return (
            <div className="space-y-4">
              {/* A. SECTION JENIS JENJANG */}
              <div className="space-y-2">
                <label className="block text-[11px] font-normal text-slate-600 mb-1">
                  Jenis Jenjang
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currentAturan = formData.aturan || [];
                      const convertedAturan = isCustomLevel ? [
                        { min: 0, max: 1, nilai: 25 },
                        { min: 1, max: 3, nilai: 50 },
                        { min: 3, max: 5, nilai: 75 },
                        { min: 5, max: 8, nilai: 90 },
                        { min: 8, max: null, nilai: 100 }
                      ] : currentAturan;
                      setFormData({
                        ...formData,
                        jenis_jenjang: 'masa_kerja',
                        parameter_jenjang: { parameter: 'masa_kerja', satuan: 'tahun' },
                        aturan: convertedAturan
                      } as any);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      !isCustomLevel
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">Masa Kerja</div>
                      <div className="text-[10px] text-slate-500 font-normal">Berdasarkan durasi masa kerja dalam tahun</div>
                    </div>
                    {!isCustomLevel && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const convertedAturan = !isCustomLevel ? [
                        { level: 'C-Level / Executive', namaJenjang: 'C-Level / Executive', nilai: 10000000, nominal: 10000000, persentaseGaji: 25 },
                        { level: 'Director', namaJenjang: 'Director', nilai: 8000000, nominal: 8000000, persentaseGaji: 20 },
                        { level: 'General Manager', namaJenjang: 'General Manager', nilai: 5500000, nominal: 5500000, persentaseGaji: 15 },
                        { level: 'Senior Manager', namaJenjang: 'Senior Manager', nilai: 4500000, nominal: 4500000, persentaseGaji: 13 },
                        { level: 'Manager', namaJenjang: 'Manager', nilai: 3500000, nominal: 3500000, persentaseGaji: 12 },
                        { level: 'Assistant Manager', namaJenjang: 'Assistant Manager', nilai: 2500000, nominal: 2500000, persentaseGaji: 10 },
                        { level: 'Supervisor', namaJenjang: 'Supervisor', nilai: 1750000, nominal: 1750000, persentaseGaji: 8 },
                        { level: 'Team Lead', namaJenjang: 'Team Lead', nilai: 1200000, nominal: 1200000, persentaseGaji: 6 },
                        { level: 'Senior Staff', namaJenjang: 'Senior Staff', nilai: 800000, nominal: 800000, persentaseGaji: 5 },
                        { level: 'Staff', namaJenjang: 'Staff', nilai: 400000, nominal: 400000, persentaseGaji: 3 },
                        { level: 'Supporting / Pelaksana', namaJenjang: 'Supporting / Pelaksana', nilai: 200000, nominal: 200000, persentaseGaji: 2 }
                      ] : (formData.aturan || []);
                      setFormData({
                        ...formData,
                        jenis_jenjang: 'custom_level',
                        parameter_jenjang: { parameter: 'level_jabatan', satuan: 'jenjang' },
                        aturan: convertedAturan
                      } as any);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isCustomLevel
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">Custom Level</div>
                      <div className="text-[10px] text-slate-500 font-normal">Berdasarkan nama/tingkat level jabatan (Teks Level)</div>
                    </div>
                    {isCustomLevel && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* B. SECTION DASAR PERHITUNGAN NILAI JENJANG */}
              <div className="space-y-2">
                <label className="block text-[11px] font-normal text-slate-600 mb-1">
                  Dasar Perhitungan Nilai Jenjang
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currentAturan = formData.aturan || [];
                      const isCurrentlyNominal = formData.dasar_perhitungan === 'Nominal' && currentAturan.some((a: any) => (a.nilai || 0) > 100);
                      const convertedAturan = isCurrentlyNominal ? (
                        isCustomLevel ? [
                          { level: 'C-Level / Executive', namaJenjang: 'C-Level / Executive', nilai: 25 },
                          { level: 'Director', namaJenjang: 'Director', nilai: 20 },
                          { level: 'General Manager', namaJenjang: 'General Manager', nilai: 15 },
                          { level: 'Senior Manager', namaJenjang: 'Senior Manager', nilai: 13 },
                          { level: 'Manager', namaJenjang: 'Manager', nilai: 12 },
                          { level: 'Assistant Manager', namaJenjang: 'Assistant Manager', nilai: 10 },
                          { level: 'Supervisor', namaJenjang: 'Supervisor', nilai: 8 },
                          { level: 'Team Lead', namaJenjang: 'Team Lead', nilai: 6 },
                          { level: 'Senior Staff', namaJenjang: 'Senior Staff', nilai: 5 },
                          { level: 'Staff', namaJenjang: 'Staff', nilai: 3 },
                          { level: 'Supporting / Pelaksana', namaJenjang: 'Supporting / Pelaksana', nilai: 2 }
                        ] : [
                          { min: 0, max: 1, nilai: 25 },
                          { min: 1, max: 3, nilai: 50 },
                          { min: 3, max: 5, nilai: 75 },
                          { min: 5, max: 8, nilai: 90 },
                          { min: 8, max: null, nilai: 100 }
                        ]
                      ) : currentAturan;
                      setFormData({ ...formData, dasar_perhitungan: 'Gaji Pokok', aturan: convertedAturan });
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      formData.dasar_perhitungan === 'Gaji Pokok'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">% Persentase Gaji Pokok</div>
                      <div className="text-[10px] text-slate-500 font-normal">Dihitung proporsional dari persentase gaji pokok karyawan</div>
                    </div>
                    {formData.dasar_perhitungan === 'Gaji Pokok' && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dasar_perhitungan: 'Nominal' })}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      formData.dasar_perhitungan === 'Nominal'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">Nominal Tetap (Rp)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Diberikan dalam besaran nominal rupiah tetap</div>
                    </div>
                    {formData.dasar_perhitungan === 'Nominal' && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* C. HEADER ATURAN MASA KERJA / ATURAN JENJANG LEVEL */}
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-normal text-slate-600 mb-1">
                  {isCustomLevel ? 'Aturan jenjang level' : 'Aturan Masa Kerja'}
                </label>
                <button
                  type="button"
                  onClick={handleAddAturan}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  Tambah
                </button>
              </div>

              {/* D. LIST BARIS ATURAN */}
              <div className="space-y-3">
                {(formData.aturan || []).map((a: any, i: number) => (
                  <div key={i} className="flex items-end gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      {isCustomLevel ? (
                        <div>
                          <span className="block text-[11px] text-slate-500 mb-1 font-normal">
                            Level
                          </span>
                          <input 
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-left focus:border-blue-500 font-bold text-slate-800"
                            placeholder="" 
                            value={a.level || a.namaJenjang || a.min || ''} 
                            onChange={e => {
                              const val = e.target.value;
                              updateAturan(i, { level: val, namaJenjang: val, min: val, max: val } as any);
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="block text-[11px] text-slate-500 mb-1 font-normal">
                            Masa Kerja
                          </span>
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="text"
                              inputMode="numeric"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:border-blue-500 font-bold text-slate-800"
                              placeholder="" 
                              value={a.min !== undefined && a.min !== null ? a.min : ''} 
                              onChange={e => {
                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                updateAturan(i, { min: raw === '' ? 0 : parseInt(raw, 10) });
                              }}
                            />
                            <span className="text-slate-400 font-bold text-xs">-</span>
                            <input 
                              type="text"
                              inputMode="numeric"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:border-blue-500 font-bold text-slate-800"
                              placeholder="" 
                              value={a.max !== undefined && a.max !== null ? a.max : ''} 
                              onChange={e => {
                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                updateAturan(i, { max: raw === '' ? null : parseInt(raw, 10) });
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="block text-[11px] text-slate-500 mb-1 font-normal">
                          {formData.dasar_perhitungan === 'Gaji Pokok' ? 'Persentase' : 'Nominal'}
                        </span>
                        <div className="relative flex items-center">
                          {formData.dasar_perhitungan === 'Nominal' && (
                            <span className="absolute left-2.5 text-xs font-bold text-slate-400 pointer-events-none">Rp</span>
                          )}
                          <input 
                            type="text"
                            inputMode="numeric"
                            className={`w-full bg-white border border-slate-200 rounded-lg py-1.5 text-xs font-bold text-slate-800 text-right focus:border-blue-500 ${
                              formData.dasar_perhitungan === 'Gaji Pokok' ? 'pl-2.5 pr-6' : 'pl-7 pr-2.5'
                            }`}
                            placeholder="" 
                            value={
                              formData.dasar_perhitungan === 'Gaji Pokok'
                                ? (a.nilai !== undefined && a.nilai !== null && a.nilai !== 0 ? a.nilai : '')
                                : (a.nilai && a.nilai !== 0 ? new Intl.NumberFormat('id-ID').format(a.nilai) : '')
                            } 
                            onChange={(e) => {
                              if (formData.dasar_perhitungan === 'Gaji Pokok') {
                                const raw = e.target.value.replace(/[^0-9.]/g, '');
                                const val = raw === '' ? 0 : parseFloat(raw);
                                updateAturan(i, { nilai: val, persentaseGaji: val } as any);
                              } else {
                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                const val = raw === '' ? 0 : parseInt(raw, 10);
                                updateAturan(i, { nilai: val, nominal: val } as any);
                              }
                            }}
                          />
                          {formData.dasar_perhitungan === 'Gaji Pokok' && (
                            <span className="absolute right-2 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => removeAturan(i)}
                      className="h-[34px] w-[34px] flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
