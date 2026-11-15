import React from 'react';
import { 
  EditableBracketRow, 
  EditablePasal17Tier, 
  EditableDailyTier,
  StandardNominalInput, 
  StandardPercentInput,
  DEFAULT_PASAL17_TIERS
} from './types-pajak';
import { Info, Plus, Trash2, RotateCcw } from 'lucide-react';

interface SectionTabelTarifPajakProps {
  taxMethod: string;
  activeTerTab: 'A' | 'B' | 'C';
  setActiveTerTab: (tab: 'A' | 'B' | 'C') => void;
  filteredTerRows: EditableBracketRow[];
  terMinGrossWidth: number;
  terMaxGrossWidth: number;
  terRatePercentWidth: number;
  handleUpdateTerRow: (cat: 'A' | 'B' | 'C', rowId: string, field: keyof EditableBracketRow, value: any) => void;
  handleDeleteTerRow: (cat: 'A' | 'B' | 'C', rowId: string) => void;
  handleAddTerRow: (cat: 'A' | 'B' | 'C') => void;
  handleResetTerCategory: (cat: 'A' | 'B' | 'C') => void;
  terBracketsA: EditableBracketRow[];
  terBracketsB: EditableBracketRow[];
  terBracketsC: EditableBracketRow[];
  pasal17Tiers: EditablePasal17Tier[];
  setPasal17Tiers: React.Dispatch<React.SetStateAction<EditablePasal17Tier[]>>;
  pasal17MinPkpWidth: number;
  pasal17MaxPkpWidth: number;
  pasal17RatePercentWidth: number;
  handleUpdatePasal17Tier: (tierId: string, field: keyof EditablePasal17Tier, value: any) => void;
  handleAddPasal17Tier: () => void;
  handleDeletePasal17Tier: (tierId: string) => void;
  dailyTiers: EditableDailyTier[];
  setDailyTiers: React.Dispatch<React.SetStateAction<EditableDailyTier[]>>;
  dailyMinWageWidth: number;
  dailyMaxWageWidth: number;
  dailyRatePercentWidth: number;
  customFlatRate: number;
  setCustomFlatRate: (val: number) => void;
  activeInfoTooltip: string | null;
  toggleTooltip: (key: string) => void;
}

export const SectionTabelTarifPajak: React.FC<SectionTabelTarifPajakProps> = ({
  taxMethod,
  activeTerTab,
  setActiveTerTab,
  filteredTerRows,
  terMinGrossWidth,
  terMaxGrossWidth,
  terRatePercentWidth,
  handleUpdateTerRow,
  handleDeleteTerRow,
  handleAddTerRow,
  handleResetTerCategory,
  terBracketsA,
  terBracketsB,
  terBracketsC,
  pasal17Tiers,
  setPasal17Tiers,
  pasal17MinPkpWidth,
  pasal17MaxPkpWidth,
  pasal17RatePercentWidth,
  handleUpdatePasal17Tier,
  handleAddPasal17Tier,
  handleDeletePasal17Tier,
  dailyTiers,
  setDailyTiers,
  dailyMinWageWidth,
  dailyMaxWageWidth,
  dailyRatePercentWidth,
  customFlatRate,
  setCustomFlatRate,
  activeInfoTooltip,
  toggleTooltip
}) => {
  return (
    <>
      {/* 1. JIKA METODE TER */}
      {taxMethod === 'TER' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold text-slate-800">Tabel Tarif Efektif Rata Rata (TER)</h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleResetTerCategory(activeTerTab)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title={`Reset Kategori ${activeTerTab} ke Standar`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleTooltip('terBrackets')}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  activeInfoTooltip === 'terBrackets' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="Informasi Tarif Efektif Rata-Rata"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {activeInfoTooltip === 'terBrackets' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Setiap baris rentang penghasilan bruto dan persentase tarif TER dapat diubah secara langsung di kolom tabel.
              Kolom nominal mendukung format hingga 9 digit (xxx.xxx.xxx) dengan lebar simetris, dan persentase mendukung hingga 4 digit (xx,xx%).
            </div>
          )}

          {/* Sub-tab Kategori A, B, C */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {(['A', 'B', 'C'] as const).map(tabKey => {
              const count = tabKey === 'A' ? terBracketsA.length : tabKey === 'B' ? terBracketsB.length : terBracketsC.length;
              const isSelected = activeTerTab === tabKey;
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveTerTab(tabKey)}
                  className={`w-full py-2 px-3 text-xs rounded-xl text-center transition-all cursor-pointer font-medium min-h-[36px] flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90'
                  }`}
                >
                  <span>Kategori {tabKey}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tabel Lapisan TER */}
          <div className="w-full border border-slate-200/90 rounded-xl overflow-x-auto bg-white shadow-2xs overscroll-x-contain">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-normal">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center font-normal whitespace-nowrap">No</th>
                  <th
                    className="py-2.5 px-3 font-normal text-left whitespace-normal break-words leading-snug"
                    style={{ width: `${terMinGrossWidth}px`, minWidth: `${terMinGrossWidth}px` }}
                  >
                    Penghasilan Bruto Dari (Rp)
                  </th>
                  <th
                    className="py-2.5 px-3 font-normal text-left whitespace-normal break-words leading-snug"
                    style={{ width: `${terMaxGrossWidth}px`, minWidth: `${terMaxGrossWidth}px` }}
                  >
                    Sampai Dengan (Rp)
                  </th>
                  <th
                    className="py-2.5 px-3 font-normal text-right whitespace-normal break-words leading-snug"
                    style={{ width: `${terRatePercentWidth}px`, minWidth: `${terRatePercentWidth}px` }}
                  >
                    Tarif TER (%)
                  </th>
                  <th className="py-2.5 px-3 w-10 text-center font-normal whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTerRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      Tidak ada lapisan tarif yang sesuai pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTerRows.map((row, idx) => {
                    const isTop = row.maxGross === Infinity;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3 w-10 text-center text-slate-400 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3" style={{ width: `${terMinGrossWidth}px`, minWidth: `${terMinGrossWidth}px` }}>
                          <StandardNominalInput
                            compact
                            value={row.minGross}
                            onChange={val => handleUpdateTerRow(activeTerTab, row.id, 'minGross', val)}
                          />
                        </td>
                        <td className="py-2 px-3" style={{ width: `${terMaxGrossWidth}px`, minWidth: `${terMaxGrossWidth}px` }}>
                          <StandardNominalInput
                            compact
                            value={isTop ? 0 : row.maxGross}
                            onChange={val => handleUpdateTerRow(activeTerTab, row.id, 'maxGross', val === 0 ? Infinity : val)}
                          />
                        </td>
                        <td className="py-2 px-3" style={{ width: `${terRatePercentWidth}px`, minWidth: `${terRatePercentWidth}px` }}>
                          <StandardPercentInput
                            compact
                            value={row.ratePercent}
                            onChange={val => handleUpdateTerRow(activeTerTab, row.id, 'ratePercent', val)}
                          />
                        </td>
                        <td className="py-2 px-3 w-10 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteTerRow(activeTerTab, row.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Hapus lapisan ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => handleAddTerRow(activeTerTab)}
            className="w-full py-2.5 px-4 text-xs font-medium border-2 border-dashed border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lapisan</span>
          </button>
        </div>
      )}

      {/* 2. JIKA METODE TARIF PROGRESIF PASAL 17 */}
      {taxMethod === 'Pasal17' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-xs font-semibold text-slate-800 leading-tight">Tabel Tarif Progresif PKP</h3>
              <p className="text-[11px] text-slate-500 font-normal leading-tight">17 UU HPP</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPasal17Tiers(DEFAULT_PASAL17_TIERS)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset Lapisan Pasal 17 UU HPP ke Standar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleTooltip('pasal17')}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  activeInfoTooltip === 'pasal17' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="Informasi Pasal 17"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {activeInfoTooltip === 'pasal17' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Tarif progresif diterapkan pada Penghasilan Kena Pajak (PKP) tahunan setelah dikurangi PTKP dan Biaya Jabatan.
              Anda dapat mengubah batas rentang nilai PKP serta persentase tarif pajak pada tiap baris lapisan.
            </div>
          )}

          <div className="w-full border border-slate-200/90 rounded-xl overflow-x-auto bg-white shadow-2xs overscroll-x-contain">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-normal">
                <tr>
                  <th className="py-2.5 px-3 w-32 min-w-[110px] font-normal whitespace-nowrap">Nama Lapisan</th>
                  <th
                    className="py-2.5 px-3 font-normal text-left whitespace-normal break-words leading-snug"
                    style={{ width: `${pasal17MinPkpWidth}px`, minWidth: `${pasal17MinPkpWidth}px` }}
                  >
                    Batas PKP Dari (Rp)
                  </th>
                  <th
                    className="py-2.5 px-3 font-normal text-left whitespace-normal break-words leading-snug"
                    style={{ width: `${pasal17MaxPkpWidth}px`, minWidth: `${pasal17MaxPkpWidth}px` }}
                  >
                    Sampai Dengan (Rp)
                  </th>
                  <th
                    className="py-2.5 px-3 font-normal text-right whitespace-normal break-words leading-snug"
                    style={{ width: `${pasal17RatePercentWidth}px`, minWidth: `${pasal17RatePercentWidth}px` }}
                  >
                    Tarif Pajak (%)
                  </th>
                  <th className="py-2.5 px-3 w-10 text-center font-normal whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pasal17Tiers.map(tier => {
                  const isTop = tier.maxPkp === Infinity;
                  return (
                    <tr key={tier.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2 px-3 w-32 min-w-[110px]">
                        <input
                          type="text"
                          value={tier.name}
                          onChange={e => handleUpdatePasal17Tier(tier.id, 'name', e.target.value)}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-normal"
                        />
                      </td>
                      <td className="py-2 px-3" style={{ width: `${pasal17MinPkpWidth}px`, minWidth: `${pasal17MinPkpWidth}px` }}>
                        <StandardNominalInput
                          compact
                          value={tier.minPkp}
                          onChange={val => handleUpdatePasal17Tier(tier.id, 'minPkp', val)}
                        />
                      </td>
                      <td className="py-2 px-3" style={{ width: `${pasal17MaxPkpWidth}px`, minWidth: `${pasal17MaxPkpWidth}px` }}>
                        <StandardNominalInput
                          compact
                          value={isTop ? 0 : tier.maxPkp}
                          onChange={val => handleUpdatePasal17Tier(tier.id, 'maxPkp', val === 0 ? Infinity : val)}
                        />
                      </td>
                      <td className="py-2 px-3" style={{ width: `${pasal17RatePercentWidth}px`, minWidth: `${pasal17RatePercentWidth}px` }}>
                        <StandardPercentInput
                          compact
                          value={tier.ratePercent}
                          onChange={val => handleUpdatePasal17Tier(tier.id, 'ratePercent', val)}
                        />
                      </td>
                      <td className="py-2 px-3 w-10 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletePasal17Tier(tier.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Hapus lapisan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddPasal17Tier}
            className="w-full py-2.5 px-4 text-xs font-medium border-2 border-dashed border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lapisan PKP</span>
          </button>
        </div>
      )}

      {/* 3. JIKA METODE TER HARIAN */}
      {taxMethod === 'Harian' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold text-slate-800">Tabel Lapisan TER Harian (Pegawai Lepas)</h3>
            <button
              type="button"
              onClick={() => toggleTooltip('daily')}
              className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                activeInfoTooltip === 'daily' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Informasi TER Harian"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInfoTooltip === 'daily' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Digunakan untuk menghitung PPh 21 pegawai tidak tetap dengan sistem pembayaran upah harian, mingguan,
              atau satuan sesuai ketentuan PMK 168/2023.
            </div>
          )}

          <div className="w-full border border-slate-200/90 rounded-xl overflow-x-auto bg-white shadow-2xs overscroll-x-contain">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-normal">
                <tr>
                  <th
                    className="py-2.5 px-3 font-normal text-left whitespace-normal break-words leading-snug"
                    style={{ width: `${dailyMinWageWidth}px`, minWidth: `${dailyMinWageWidth}px` }}
                  >
                    Rentang Upah Harian Min (Rp)
                  </th>
                  <th
                    className="py-2.5 px-3 font-normal text-left whitespace-normal break-words leading-snug"
                    style={{ width: `${dailyMaxWageWidth}px`, minWidth: `${dailyMaxWageWidth}px` }}
                  >
                    Rentang Upah Harian Maks (Rp)
                  </th>
                  <th
                    className="py-2.5 px-3 font-normal text-right whitespace-normal break-words leading-snug"
                    style={{ width: `${dailyRatePercentWidth}px`, minWidth: `${dailyRatePercentWidth}px` }}
                  >
                    Tarif Efektif (%)
                  </th>
                  <th className="py-2.5 px-3 w-10 text-center font-normal whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyTiers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 px-3" style={{ width: `${dailyMinWageWidth}px`, minWidth: `${dailyMinWageWidth}px` }}>
                      <StandardNominalInput
                        compact
                        value={t.minWage}
                        onChange={val =>
                          setDailyTiers(prev =>
                            prev.map(item => (item.id === t.id ? { ...item, minWage: val } : item))
                          )
                        }
                      />
                    </td>
                    <td className="py-2 px-3" style={{ width: `${dailyMaxWageWidth}px`, minWidth: `${dailyMaxWageWidth}px` }}>
                      <StandardNominalInput
                        compact
                        value={t.maxWage === Infinity ? 0 : t.maxWage}
                        onChange={val =>
                          setDailyTiers(prev =>
                            prev.map(item => (item.id === t.id ? { ...item, maxWage: val === 0 ? Infinity : val } : item))
                          )
                        }
                      />
                    </td>
                    <td className="py-2 px-3" style={{ width: `${dailyRatePercentWidth}px`, minWidth: `${dailyRatePercentWidth}px` }}>
                      <StandardPercentInput
                        compact
                        value={t.ratePercent}
                        onChange={val =>
                          setDailyTiers(prev =>
                            prev.map(item => (item.id === t.id ? { ...item, ratePercent: val } : item))
                          )
                        }
                      />
                    </td>
                    <td className="py-2 px-3 w-12 text-center">
                      <button
                        type="button"
                        onClick={() => setDailyTiers(prev => prev.filter(item => item.id !== t.id))}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. JIKA METODE TARIF KUSTOM / FLAT */}
      {taxMethod === 'Custom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold text-slate-800">Tarif Pajak Tunggal / Flat Rate</h3>
            <button
              type="button"
              onClick={() => toggleTooltip('customRate')}
              className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                activeInfoTooltip === 'customRate' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Informasi Flat Rate"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInfoTooltip === 'customRate' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Gunakan flat rate jika perusahaan menerapkan tarif persentase tetap khusus untuk pemotongan pajak jenis ini.
            </div>
          )}

          <div className="max-w-xs">
            <label className="block text-[11px] font-normal text-slate-600 mb-1">
              Persentase Pemotongan Pajak (%)
            </label>
            <StandardPercentInput
              value={customFlatRate}
              onChange={val => setCustomFlatRate(val)}
            />
          </div>
        </div>
      )}
    </>
  );
};
