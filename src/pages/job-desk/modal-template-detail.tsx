import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Pencil,
  Trash2,
  Tag,
  Percent,
  Gift,
  ShieldCheck,
  Calculator,
  Building2,
  Clock,
  Calendar,
  Coffee,
  Sun,
  Moon,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { db } from '../../db/database';
import { PayrollRule } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { JobTemplate, ModalTab, IndexJobTemplate } from './types';
import { formatCurrency, getLevelBadgeStyle, resolveJobWorkSchedule, getShiftBadgeInfo } from './utils-helper';
import {
  TunjanganItem,
  BpjsItem,
  MASTER_TUNJANGAN_LIST,
  MASTER_BPJS_LIST,
  mapPayrollRuleToTunjanganItem,
  mapPayrollRuleToBpjsItem,
  isTunjanganSelected,
  isBpjsSelected,
  normalizeTunjanganId,
  normalizePajakId,
  getTunjanganName,
} from './compensation-catalog';

interface ModalTemplateDetailProps {
  selectedRoleDetail: JobTemplate | null;
  onClose: () => void;
  activeModalTab: ModalTab;
  setActiveModalTab: (tab: ModalTab) => void;
  indexTemplates?: IndexJobTemplate[];
  onOpenRelatedRole?: (tpl: IndexJobTemplate) => void;
  onUseTemplate?: (template: JobTemplate) => void;
  actionButtonText?: string;
  onBackToCatalog?: () => void;
  isOpenedFromModal?: boolean;
  onEdit?: (template: JobTemplate) => void;
  onDelete?: (templateId: string) => void;
}

export const ModalTemplateDetail: React.FC<ModalTemplateDetailProps> = ({
  selectedRoleDetail,
  onClose,
  activeModalTab,
  setActiveModalTab,
  indexTemplates = [],
  onOpenRelatedRole,
  onUseTemplate,
  actionButtonText,
  onBackToCatalog,
  isOpenedFromModal = false,
  onEdit,
  onDelete,
}) => {
  // Resolve Atasan Langsung Match (support both ID and role name)
  const atasanMatch = selectedRoleDetail?.atasanLangsung 
    ? indexTemplates.find(tpl => 
        tpl.id === selectedRoleDetail.atasanLangsung || 
        tpl.nama.toLowerCase() === selectedRoleDetail.atasanLangsung.toLowerCase()
      )
    : null;

  // Fetch dynamic payroll rules from IndexedDB (synced with Kompensasi master)
  const [dbRules, setDbRules] = useState<PayrollRule[]>([]);

  useEffect(() => {
    let isMounted = true;
    db.payrollRules.toArray().then(rules => {
      if (isMounted) {
        setDbRules(rules || []);
      }
    }).catch(err => {
      console.warn('Failed to load payroll rules in ModalTemplateDetail:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Compensation categories items calculation
  const {
    selectedTunjanganTetap,
    selectedTunjanganTidakTetap,
    selectedBonusInsentif,
    selectedBpjsKesehatan,
    selectedBpjsKetenagakerjaan,
    matchedTax
  } = useMemo(() => {
    if (!selectedRoleDetail?.kompensasi) {
      return {
        selectedTunjanganTetap: [],
        selectedTunjanganTidakTetap: [],
        selectedBonusInsentif: [],
        selectedBpjsKesehatan: [],
        selectedBpjsKetenagakerjaan: [],
        matchedTax: null
      };
    }

    const rawTunjangan: string[] = [];
    if (Array.isArray(selectedRoleDetail.kompensasi.tunjangan)) rawTunjangan.push(...selectedRoleDetail.kompensasi.tunjangan);
    if (Array.isArray(selectedRoleDetail.kompensasi.tunjanganTetap)) rawTunjangan.push(...selectedRoleDetail.kompensasi.tunjanganTetap);
    if (Array.isArray(selectedRoleDetail.kompensasi.tunjanganTidakTetap)) rawTunjangan.push(...selectedRoleDetail.kompensasi.tunjanganTidakTetap);
    if (Array.isArray((selectedRoleDetail.kompensasi as any).insentif)) rawTunjangan.push(...(selectedRoleDetail.kompensasi as any).insentif);
    if (Array.isArray((selectedRoleDetail.kompensasi as any).bonus)) rawTunjangan.push(...(selectedRoleDetail.kompensasi as any).bonus);
    const uniqueRawTunjangan = Array.from(new Set(rawTunjangan));

    const tetapList = availableTunjanganList.filter(
      item => item.kategori !== 'Tunjangan Tidak Tetap' &&
              item.kategori !== 'Bonus & Insentif' &&
              isTunjanganSelected(uniqueRawTunjangan, item.id, availableTunjanganList)
    );

    const tidakTetapList = availableTunjanganList.filter(
      item => item.kategori === 'Tunjangan Tidak Tetap' &&
              isTunjanganSelected(uniqueRawTunjangan, item.id, availableTunjanganList)
    );

    const bonusList = availableTunjanganList.filter(
      item => item.kategori === 'Bonus & Insentif' &&
              isTunjanganSelected(uniqueRawTunjangan, item.id, availableTunjanganList)
    );

    // Capture any raw tunjangan items that might not have matched available catalog
    const matchedIds = new Set([
      ...tetapList.map(t => t.id),
      ...tidakTetapList.map(t => t.id),
      ...bonusList.map(t => t.id),
    ]);
    const unmatched = uniqueRawTunjangan.filter(rawId => {
      const norm = normalizeTunjanganId(rawId, availableTunjanganList);
      return !matchedIds.has(norm) && !matchedIds.has(rawId);
    });
    unmatched.forEach(rawId => {
      const isBonus = rawId.toLowerCase().includes('bonus') || rawId.toLowerCase().includes('insentif');
      const isVar = rawId.toLowerCase().includes('tidak_tetap') || rawId.toLowerCase().includes('harian') || rawId.toLowerCase().includes('makan') || rawId.toLowerCase().includes('transport');
      const item: TunjanganItem = {
        id: rawId,
        nama: getTunjanganName(rawId),
        kategori: isBonus ? 'Bonus & Insentif' : isVar ? 'Tunjangan Tidak Tetap' : 'Tunjangan Tetap',
        nominalFormula: 'Nominal Sesuai Ketentuan'
      };
      if (item.kategori === 'Bonus & Insentif') bonusList.push(item);
      else if (item.kategori === 'Tunjangan Tidak Tetap') tidakTetapList.push(item);
      else tetapList.push(item);
    });

    // BPJS
    const rawBpjs = selectedRoleDetail.kompensasi.bpjs || [];
    const bpjsKes = availableBpjsList.filter(
      b => b.program === 'BPJS Kesehatan' && isBpjsSelected(rawBpjs, b.id, availableBpjsList)
    );
    const bpjsTk = availableBpjsList.filter(
      b => b.program !== 'BPJS Kesehatan' && isBpjsSelected(rawBpjs, b.id, availableBpjsList)
    );

    // Pajak
    const rawTax = selectedRoleDetail.kompensasi.pajakRuleId || selectedRoleDetail.kompensasi.pajak?.[0];
    let matchedTax: { id: string; name: string; desc: string } | null = null;
    if (rawTax) {
      const normTax = normalizePajakId(rawTax);
      const taxOptions = [
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
      ];
      matchedTax = taxOptions.find(t => t.id === normTax) || {
        id: normTax,
        name: normTax,
        desc: 'Regulasi Pajak Penghasilan (PPh 21)'
      };
    }

    return {
      selectedTunjanganTetap: tetapList,
      selectedTunjanganTidakTetap: tidakTetapList,
      selectedBonusInsentif: bonusList,
      selectedBpjsKesehatan: bpjsKes,
      selectedBpjsKetenagakerjaan: bpjsTk,
      matchedTax
    };
  }, [selectedRoleDetail, availableTunjanganList, availableBpjsList]);

  return (
    <Modal
      isOpen={Boolean(selectedRoleDetail)}
      onClose={onClose}
      contentClassName="sm:max-w-4xl max-h-[92vh] sm:max-h-[85vh] p-0 overflow-hidden"
    >
      {selectedRoleDetail && (
        <>
          {/* Modal Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-2.5 min-w-0 pr-3">
              {isOpenedFromModal ? (
              <button
                type="button"
                onClick={onBackToCatalog || onClose}
                className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Kembali ke Daftar Posisi"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                {selectedRoleDetail.nama}
              </h3>
              <p className="text-[11px] text-slate-500 font-normal truncate">
                {selectedRoleDetail.level} • {selectedRoleDetail.departemen}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(selectedRoleDetail)}
                className="w-8 h-8 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Edit Posisi & Job Desk"
                aria-label="Edit Posisi"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(selectedRoleDetail.id)}
                className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Hapus Posisi & Job Desk"
                aria-label="Hapus Posisi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Full-width Compact Tabs Bar */}
        <div className="flex items-center justify-between w-full border-b border-slate-200 bg-white px-2 sm:px-5 shrink-0 overflow-x-auto no-scrollbar">
          {(['seputar', 'tugas', 'kpi', 'kualifikasi', 'kompensasi', 'waktu_kerja'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveModalTab(tab)}
              className={`py-2 text-xs font-semibold capitalize transition-all relative cursor-pointer px-1 sm:px-2.5 shrink-0 whitespace-nowrap ${
                activeModalTab === tab 
                  ? 'text-blue-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>
                {tab === 'kpi' ? 'KPI' : tab === 'waktu_kerja' ? 'Waktu Kerja' : tab}
              </span>
              {activeModalTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
              )}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-6">
          
          {/* TAB 1: SEPUTAR */}
          {activeModalTab === 'seputar' && (
            <div className="max-w-3xl animate-in fade-in duration-300 space-y-6">
              <section>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  {selectedRoleDetail.tujuanJabatan}
                </p>
              </section>

              <section className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3.5 gap-x-6 p-4 bg-slate-50/60 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-600 font-normal block mb-0.5">Kategori</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedRoleDetail.kategori}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-600 font-normal block mb-0.5">Departemen</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedRoleDetail.departemen}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-600 font-normal block mb-1">Level</span>
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md border ${getLevelBadgeStyle(selectedRoleDetail.level)}`}>
                      {selectedRoleDetail.level}
                    </span>
                  </div>
                </div>
                
                {atasanMatch ? (
                  <button 
                    onClick={() => onOpenRelatedRole?.(atasanMatch)}
                    className="w-full text-left p-4 bg-slate-50/60 hover:bg-blue-50/50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors group flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <div>
                      <span className="text-xs text-slate-600 font-normal block mb-0.5 group-hover:text-blue-600 transition-colors">Atasan Langsung</span>
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{atasanMatch.nama}</span>
                      <span className="text-xs font-medium text-slate-500 block mt-0.5 group-hover:text-blue-500 transition-colors">{atasanMatch.level}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-xs">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ) : (
                  <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-600 font-normal block mb-0.5">Atasan Langsung</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {selectedRoleDetail.atasanLangsung ? selectedRoleDetail.atasanLangsung : 'Dewan Komisaris / Pemilik Perusahaan (Top Level)'}
                    </span>
                  </div>
                )}
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <section className="bg-slate-50/40 p-4 rounded-xl border border-slate-100/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-center">
                    Hubungan Kerja
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-900 block mb-1.5">Internal</span>
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        {selectedRoleDetail.hubunganKerja.internal.map((rel: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" /> <span>{rel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-900 block mb-1.5">Eksternal</span>
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        {selectedRoleDetail.hubunganKerja.eksternal.map((rel: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" /> <span>{rel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: TUGAS */}
          {activeModalTab === 'tugas' && (
            <div className="max-w-4xl animate-in fade-in duration-300 space-y-6">
              <section className="bg-slate-50/40 p-4 rounded-xl border border-slate-100/80">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-center">
                  Fungsi Utama
                </h4>
                <ul className="space-y-2.5">
                  {selectedRoleDetail.fungsiUtama.map((func: string, index: number) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                      <span className="leading-relaxed">{func}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-slate-50/40 p-4 rounded-xl border border-slate-100/80">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-center">
                  Tanggung Jawab Utama
                </h4>
                <ul className="space-y-2.5">
                  {selectedRoleDetail.tanggungJawab.map((task: string, index: number) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                      <span className="leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Rutinitas & Tugas Harian (Daily Work) */}
              {selectedRoleDetail.tugasHarian && selectedRoleDetail.tugasHarian.length > 0 && (
                <section className="bg-blue-50/30 p-4 rounded-xl border border-blue-100/80">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3 text-center flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Rutinitas &amp; Tugas Harian (Daily Work / SOP Checklist)</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedRoleDetail.tugasHarian.map((dh: string, index: number) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                        <span className="leading-relaxed">{dh}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-slate-50/40 p-4 rounded-xl border border-slate-100/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-center">
                    Wewenang
                  </h4>
                  <ul className="space-y-2">
                    {selectedRoleDetail.wewenang.map((auth: string, index: number) => (
                      <li key={index} className="flex gap-2.5 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                        <span className="leading-relaxed">{auth}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-slate-50/40 p-4 rounded-xl border border-slate-100/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-center">
                    Output / Target Posisi
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {selectedRoleDetail.outputDiharapkan.map((out: string, i: number) => (
                      <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                        <span className="leading-relaxed">{out}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* TAB 3: KPI */}
          {activeModalTab === 'kpi' && (
            <div className="animate-in fade-in duration-300">
              <div className="space-y-3">
                {selectedRoleDetail.kpi.map((kpi: any) => {
                  const minSkor = kpi.minimumSkor !== undefined ? kpi.minimumSkor : 75;
                  const dasarUkur = kpi.dasarUkur || kpi.caraPengukuran || 'Laporan Kinerja & Supervisi';

                  return (
                    <div key={kpi.id} className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                      {/* Header: Nama & Deskripsi KPI */}
                      <div className="pb-1">
                        <h6 className="font-bold text-sm text-slate-900">{kpi.nama}</h6>
                        {kpi.deskripsi && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{kpi.deskripsi}</p>
                        )}
                      </div>

                      {/* Grid Detail Informasi KPI */}
                      <div className="space-y-2.5">
                        {/* 2 Card Kanan Kiri: Minimum Skor & Bobot KPI */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Minimum Skor */}
                          <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-center">
                            <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Minimum Skor</span>
                            <span className="text-xs font-bold text-slate-900 block">
                              {minSkor} Skor
                            </span>
                          </div>

                          {/* Bobot KPI */}
                          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-center">
                            <span className="text-[11px] text-blue-600 font-medium block mb-0.5">Bobot KPI</span>
                            <span className="text-xs font-bold text-blue-700 block">
                              {kpi.bobot}%
                            </span>
                          </div>
                        </div>

                        {/* Dasar Ukur */}
                        <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-center">
                          <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Dasar Ukur</span>
                          <span className="text-xs text-slate-700 font-medium block" title={dasarUkur}>
                            {dasarUkur}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: KUALIFIKASI & KOMPETENSI */}
          {activeModalTab === 'kualifikasi' && (
            <div className="max-w-4xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-slate-50/40 p-4.5 rounded-xl border border-slate-100/80 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-center">
                    Persyaratan Kualifikasi Relevan
                  </h4>

                  {/* Pendidikan Minimal & Jurusan */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-700 block">Pendidikan Minimal</span>
                    <div className="text-xs font-extrabold text-slate-900">
                      {selectedRoleDetail.kualifikasi.detailPendidikan?.tingkatPendidikan || selectedRoleDetail.kualifikasi.pendidikan}
                    </div>
                    {selectedRoleDetail.kualifikasi.detailPendidikan?.jurusan && selectedRoleDetail.kualifikasi.detailPendidikan.jurusan.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-semibold text-slate-500 block mb-1">Jurusan / Bidang Studi Relevan:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedRoleDetail.kualifikasi.detailPendidikan.jurusan.map((j, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[11px] font-semibold">{j}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pengalaman Kerja Structured */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-700 block">Pengalaman Kerja</span>
                    {selectedRoleDetail.kualifikasi.detailPengalaman && selectedRoleDetail.kualifikasi.detailPengalaman.length > 0 ? (
                      <div className="space-y-1.5">
                        {selectedRoleDetail.kualifikasi.detailPengalaman.map((exp, i) => (
                          <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                            <span className="font-bold text-slate-900 block">{exp.lamaPengalaman}</span>
                            <span className="text-slate-600 block">{exp.posisi ? `Posisi: ${exp.posisi}` : ''} {exp.bidangIndustri ? `• Industri: ${exp.bidangIndustri}` : ''}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-800 leading-relaxed">{selectedRoleDetail.kualifikasi.pengalaman}</p>
                    )}
                  </div>

                  {/* Sertifikasi Structured */}
                  {((selectedRoleDetail.kualifikasi.detailSertifikasi && selectedRoleDetail.kualifikasi.detailSertifikasi.length > 0) || selectedRoleDetail.kualifikasi.sertifikasi.length > 0) && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2 shadow-2xs">
                      <span className="text-[11px] font-bold text-purple-700 block">Sertifikasi & Lisensi</span>
                      {selectedRoleDetail.kualifikasi.detailSertifikasi && selectedRoleDetail.kualifikasi.detailSertifikasi.length > 0 ? (
                        <div className="space-y-1.5">
                          {selectedRoleDetail.kualifikasi.detailSertifikasi.map((cert, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-purple-50/50 border border-purple-100 text-xs">
                              <span className="font-bold text-slate-900">{cert.namaSertifikasi}</span>
                              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">{cert.jenisSertifikasi}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="space-y-1 text-xs text-slate-800">
                          {selectedRoleDetail.kualifikasi.sertifikasi.map((c: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Persyaratan Khusus */}
                  {selectedRoleDetail.kualifikasi.syaratKhusus.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-700 block">Persyaratan Khusus</span>
                      <ul className="space-y-1 text-xs text-slate-800">
                        {selectedRoleDetail.kualifikasi.syaratKhusus.map((c: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
                
                <div className="space-y-6">
                  <section className="bg-slate-50/40 p-4.5 rounded-xl border border-slate-100/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-center">
                      Kompetensi & Level Kemahiran
                    </h4>
                    
                    {/* Technical Skills */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2 shadow-2xs">
                      <span className="text-[11px] font-bold text-blue-700 block">Technical Skills (Hard Skills)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRoleDetail.kompetensi.detailTeknis && selectedRoleDetail.kompetensi.detailTeknis.length > 0 ? (
                          selectedRoleDetail.kompetensi.detailTeknis.map((item, i) => (
                            <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1">
                              <span>{item.namaSkill}</span>
                              <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded text-[9px] uppercase font-extrabold">{item.tingkatKemahiran}</span>
                            </span>
                          ))
                        ) : (
                          selectedRoleDetail.kompetensi.teknis.map((c: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold">{c}</span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2 shadow-2xs">
                      <span className="text-[11px] font-bold text-indigo-700 block">Soft Skills (Non-Teknis)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRoleDetail.kompetensi.detailNonTeknis && selectedRoleDetail.kompetensi.detailNonTeknis.length > 0 ? (
                          selectedRoleDetail.kompetensi.detailNonTeknis.map((item, i) => (
                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1">
                              <span>{item.namaSkill}</span>
                              <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded text-[9px] uppercase font-extrabold">{item.tingkatKemahiran}</span>
                            </span>
                          ))
                        ) : (
                          selectedRoleDetail.kompetensi.nonTeknis.map((c: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">{c}</span>
                          ))
                        )}
                      </div>
                    </div>
                  </section>
                  
                  <section className="bg-slate-50/40 p-4.5 rounded-xl border border-slate-100/80">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-center">
                      Dokumen Administratif
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {selectedRoleDetail.dokumenAdministrasi.wajib.map((doc: string, i: number) => (
                        <li key={`m-${i}`} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                          <span className="leading-relaxed font-normal">{doc}</span>
                          <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded font-bold ml-auto shrink-0 mt-0.5">WAJIB</span>
                        </li>
                      ))}
                      {selectedRoleDetail.dokumenAdministrasi.pendukung.map((doc: string, i: number) => (
                        <li key={`s-${i}`} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                          <span className="leading-relaxed font-normal text-slate-600">{doc}</span>
                        </li>
                      ))}
                      {selectedRoleDetail.dokumenAdministrasi.khusus.map((doc: string, i: number) => (
                        <li key={`sp-${i}`} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                          <span className="leading-relaxed font-normal text-slate-600">{doc}</span>
                          <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold ml-auto shrink-0 mt-0.5">KHUSUS</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KOMPENSASI */}
          {activeModalTab === 'kompensasi' && (
            <div className="max-w-4xl animate-in fade-in duration-300 space-y-6">
              <section>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 text-center">
                  Struktur Gaji Pokok
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Baris 1: Minimum | Maksimum */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Minimum</span>
                    <span className="text-sm font-semibold text-slate-700">{formatCurrency(selectedRoleDetail.kompensasi.gajiPokok.minimal)}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Maksimum</span>
                    <span className="text-sm font-semibold text-slate-700">{formatCurrency(selectedRoleDetail.kompensasi.gajiPokok.maksimal)}</span>
                  </div>

                  {/* Baris 2: Target */}
                  <div className="col-span-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-blue-700 block mb-0.5 uppercase tracking-wider">Target / Standar</span>
                    <span className="text-base sm:text-lg font-extrabold text-blue-700">{formatCurrency(selectedRoleDetail.kompensasi.gajiPokok.standar)}</span>
                  </div>
                </div>
              </section>

              {/* DAFTAR KOMPONEN KOMPENSASI (GROUP HANYA TEKS TANPA ICON & TANPA DIBUNGKUS CARD) */}
              <div className="space-y-5 pt-1">
                {/* 1. Tunjangan Tetap */}
                {selectedTunjanganTetap.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-800">
                      Tunjangan Tetap
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {selectedTunjanganTetap.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs bg-white flex items-center gap-3 transition-all"
                        >
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs shrink-0 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-blue-600 stroke-[2.4]" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="block text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                              {item.nama}
                            </span>
                            <span className="block text-[11px] font-medium text-slate-500 truncate">
                              {item.nominalFormula || item.deskripsi || '-'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Tunjangan Tidak Tetap */}
                {selectedTunjanganTidakTetap.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-800">
                      Tunjangan Tidak Tetap
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {selectedTunjanganTidakTetap.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs bg-white flex items-center gap-3 transition-all"
                        >
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs shrink-0 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-blue-600 stroke-[2.4]" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="block text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                              {item.nama}
                            </span>
                            <span className="block text-[11px] font-medium text-slate-500 truncate">
                              {item.nominalFormula || item.deskripsi || '-'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Bonus & Insentif */}
                {selectedBonusInsentif.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-800">
                      Bonus & Insentif
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {selectedBonusInsentif.map((item) => {
                        const nameLower = (item.nama || item.id).toLowerCase();
                        const isInsentif = nameLower.includes('komisi') || nameLower.includes('insentif');
                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs bg-white flex items-center gap-3 transition-all"
                          >
                            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs shrink-0 flex items-center justify-center">
                              {isInsentif ? (
                                <Percent className="w-4 h-4 text-red-600 stroke-[2.4]" />
                              ) : (
                                <Gift className="w-4 h-4 text-purple-600 stroke-[2.4]" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <span className="block text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                                {item.nama}
                              </span>
                              <span className="block text-[11px] font-medium text-slate-500 truncate">
                                {item.nominalFormula || item.deskripsi || '-'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. BPJS Kesehatan */}
                {selectedBpjsKesehatan.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-800">
                      BPJS Kesehatan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {selectedBpjsKesehatan.map((prog) => (
                        <div
                          key={prog.id}
                          className="p-3 rounded-xl border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs bg-white flex items-center gap-3 transition-all"
                        >
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs shrink-0 flex items-center justify-center">
                            <img src="/gambar/logo/logo-bpjs-kesehatan.webp" alt="BPJS Kesehatan" className="w-5 h-5 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="block text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                              {prog.nama}
                            </span>
                            <span className="block text-[11px] font-medium text-slate-500 truncate">
                              {prog.nominalFormula || prog.deskripsi || `ID: ${prog.id}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. BPJS Ketenagakerjaan */}
                {selectedBpjsKetenagakerjaan.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-800">
                      BPJS Ketenagakerjaan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {selectedBpjsKetenagakerjaan.map((prog) => (
                        <div
                          key={prog.id}
                          className="p-3 rounded-xl border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs bg-white flex items-center gap-3 transition-all"
                        >
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs shrink-0 flex items-center justify-center">
                            <img src="/gambar/logo/logo-bpjs-ketenagakerjaan.webp" alt="BPJS Ketenagakerjaan" className="w-5 h-5 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="block text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                              {prog.nama}
                            </span>
                            <span className="block text-[11px] font-medium text-slate-500 truncate">
                              {prog.nominalFormula || prog.deskripsi || `ID: ${prog.id}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Pajak Penghasilan */}
                {matchedTax && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-800">
                      Pajak Penghasilan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div
                        className="p-3 rounded-xl border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs bg-white flex items-center gap-3 transition-all"
                      >
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs shrink-0 flex items-center justify-center">
                          <img src="/gambar/logo/logo-djp.webp" alt="Pajak" className="w-5 h-5 object-contain" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="block text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                            {matchedTax.name}
                          </span>
                          <span className="block text-[11px] font-medium text-slate-500 truncate">
                            {matchedTax.desc}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Fasilitas Kerja (Opsional jika ada) */}
                {selectedRoleDetail.kompensasi.fasilitas && selectedRoleDetail.kompensasi.fasilitas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-800">
                      Fasilitas Kerja
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {selectedRoleDetail.kompensasi.fasilitas.map((f: string, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl border border-[#d2dbe8] bg-[#f0f4f9] shadow-2xs flex items-center gap-3 transition-all hover:bg-[#eaf0f7]"
                        >
                          <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 flex items-center justify-center border border-slate-200/60">
                            <Building2 className="w-4 h-4 text-blue-600 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="block text-xs sm:text-sm font-bold text-blue-700 tracking-tight truncate">
                              {f}
                            </span>
                            <span className="block text-[11px] font-medium text-slate-600 truncate">
                              Fasilitas & Inventaris Perusahaan
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback jika tidak ada sama sekali komponen terdaftar */}
                {selectedTunjanganTetap.length === 0 &&
                 selectedTunjanganTidakTetap.length === 0 &&
                 selectedBonusInsentif.length === 0 &&
                 selectedBpjsKesehatan.length === 0 &&
                 selectedBpjsKetenagakerjaan.length === 0 &&
                 !matchedTax &&
                 (!selectedRoleDetail.kompensasi.fasilitas || selectedRoleDetail.kompensasi.fasilitas.length === 0) && (
                  <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 italic">Tidak ada tunjangan, benefit jaminan sosial, atau fasilitas tambahan yang terdaftar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: WAKTU KERJA & POLA JADWAL */}
          {activeModalTab === 'waktu_kerja' && (() => {
            const schedule = resolveJobWorkSchedule(selectedRoleDetail);
            const polaKerja = schedule.polaKerja || (schedule.scheduleType === 'SHIFT' ? 'Shift' : 'Non Shift');
            const hariKerja = schedule.hariKerja || (schedule.scheduleType === '6_HARI' ? '6 Hari' : schedule.scheduleType === 'SHIFT' ? '6 Hari' : '5 Hari');
            const istirahatMenit = schedule.waktuIstirahatMenit ?? 60;
            const totalJam = schedule.totalJamKerja ?? schedule.totalHoursPerWeek ?? 40;
            const isOverLegal = totalJam > 40;

            return (
              <div className="max-w-3xl animate-in fade-in duration-300 space-y-5">
                
                {/* Notice Integrasi Dokumen & Kontrak */}
                <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs text-slate-700">
                    <span className="font-bold text-blue-900 block">Integrasi Otomatis Dokumen &amp; Kontrak Kerja</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Konfigurasi pola kerja, hari kerja, jam istirahat, dan total jam kerja ini secara otomatis tertaut ke <strong>Pasal 3 (Hari &amp; Waktu Kerja)</strong> pada pembuatan Kontrak PKWT/PKWTT, Surat Keputusan (SK), dan modul presensi karyawan.
                    </p>
                  </div>
                </div>

                {/* Main Schedule Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Card 1: Pola & Hari Kerja */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-900">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pola &amp; Hari Kerja</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            polaKerja === 'Shift' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {polaKerja}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">
                            {hariKerja} Kerja
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
                      {schedule.workDays}
                    </div>
                    {/* Active Days Badges */}
                    {schedule.hariKerjaList && schedule.hariKerjaList.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => {
                          const isActive = schedule.hariKerjaList?.includes(day);
                          return (
                            <span
                              key={day}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                isActive
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60'
                              }`}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Card Pola Shift & Rotasi Roster (jika Pola Shift) */}
                  {(polaKerja === 'Shift' || schedule.polaShiftName) && (
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-2.5 sm:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-purple-950">
                          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Pola Shift &amp; Rotasi Roster</span>
                            <span className="text-xs font-extrabold text-slate-900">
                              {schedule.polaShiftName || 'Pola 4 Regu 3 Shift Pabrik (2P-2S-2M-2OFF)'}
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 self-start sm:self-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Tersinkron Pengaturan Jadwal
                        </span>
                      </div>
                      {schedule.polaShiftCycle && schedule.polaShiftCycle.length > 0 && (
                        <div className="p-2.5 bg-white rounded-xl border border-purple-200/60">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {schedule.polaShiftCycle.map((shiftCode, idx) => {
                              const badge = getShiftBadgeInfo(shiftCode);
                              return (
                                <React.Fragment key={`modal-shift-c-${idx}`}>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.colorClass}`}
                                    title={`${badge.label}: ${badge.timeRange}`}
                                  >
                                    {badge.label}
                                  </span>
                                  {idx < (schedule.polaShiftCycle?.length ?? 0) - 1 && (
                                    <span className="text-slate-300 text-[10px]">→</span>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card 2: Jam Kerja Harian & Jam Masuk-Pulang */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-900">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Masuk Kerja</span>
                          <span className="text-xs font-extrabold text-slate-900">Jam Operasional Harian</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        24 Jam
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-emerald-800">
                      {schedule.workingHours}
                    </div>
                    {/* Breakdown Jam Masuk & Jam Pulang */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-0.5">
                      <div className="p-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                        <span className="text-slate-400 block font-medium">Jam Masuk</span>
                        <span className="font-extrabold text-slate-900 text-xs">{schedule.jamMasuk || (polaKerja === 'Shift' ? '07:00' : '08:30')}</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                        <span className="text-slate-400 block font-medium">Jam Pulang</span>
                        <span className="font-extrabold text-slate-900 text-xs">{schedule.jamPulang || (polaKerja === 'Shift' ? '16:00' : '17:30')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Istirahat (Mulai & Selesai) */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-900">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Istirahat</span>
                          <span className="text-xs font-extrabold text-slate-900">{istirahatMenit} Menit Jeda</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200">
                        24 Jam
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
                      {schedule.restHours || `${schedule.jamIstirahatMulai || '12:00'} - ${schedule.jamIstirahatSelesai || '13:00'} WIB (${istirahatMenit} Menit)`}
                    </div>
                    {/* Breakdown Mulai & Selesai Istirahat */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-0.5">
                      <div className="p-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                        <span className="text-slate-400 block font-medium">Mulai Istirahat</span>
                        <span className="font-extrabold text-slate-900 text-xs">{schedule.jamIstirahatMulai || '12:00'}</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                        <span className="text-slate-400 block font-medium">Selesai Istirahat</span>
                        <span className="font-extrabold text-slate-900 text-xs">{schedule.jamIstirahatSelesai || '13:00'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 block italic">
                      * Sesuai regulasi PP 35/2021, istirahat minimal 30 menit dan tidak dihitung jam kerja.
                    </span>
                  </div>

                  {/* Card 4: Total Jam Kerja per Minggu */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isOverLegal ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {isOverLegal ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Beban Jam Kerja</span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {totalJam} Jam / Minggu {isOverLegal ? '(Over Limit)' : '(Sesuai UU)'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-2.5 bg-white rounded-xl border text-xs font-bold ${
                      isOverLegal ? 'border-rose-300 text-rose-700' : 'border-slate-200/70 text-indigo-900'
                    }`}>
                      {totalJam} Jam per Minggu {isOverLegal ? '⚠️ Melebihi Batas Legal 40 Jam' : '✓ Maksimal Legal 40 Jam'}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {isOverLegal 
                        ? 'Wajib diperhitungkan kompensasi Upah Kerja Lembur resmi.' 
                        : 'Memenuhi batas maksimum UU Ketenagakerjaan No. 13/2003 & PP 35/2021.'}
                    </span>
                  </div>

                </div>

                {/* CARD WARNING IF TOTAL JAM KERJA > 40 */}
                {isOverLegal && (
                  <div className="p-4 bg-rose-50 border border-rose-200/90 rounded-2xl flex items-start gap-3.5 text-rose-900 shadow-2xs animate-in fade-in duration-200">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-rose-950 block text-sm">
                        Peringatan Regulasi Ketenagakerjaan (Batas Maksimal 40 Jam / Minggu)
                      </span>
                      <p className="text-[11px] text-rose-800 leading-relaxed font-normal">
                        Total jam kerja pada posisi ini adalah <strong>{totalJam} jam per minggu</strong>. Berdasarkan <strong>Pasal 77 UU Ketenagakerjaan No. 13/2003 jo. PP No. 35 Tahun 2021</strong>, batas waktu kerja standar maksimal adalah <strong>40 jam dalam 1 minggu</strong>. Kelebihan jam kerja di atas ketentuan wajib dihitung dan dibayarkan sebagai <strong>Upah Kerja Lembur</strong> resmi.
                      </p>
                    </div>
                  </div>
                )}

                {/* Overtime & Shift Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Ketentuan Lembur &amp; Rotasi Shift
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      schedule.overtimeEligible 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {schedule.overtimeEligible ? 'Eligible Lembur (PP 35/2021)' : 'Non-Overtime (Manajerial)'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1">
                      <span className="text-[11px] font-bold text-slate-800 block">Klausul Lembur Resmi:</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {schedule.overtimeClause || 'Pekerjaan melebihi jam kerja normal atas instruksi tertulis atasan dihitung sebagai upah lembur resmi sesuai PP 35/2021.'}
                      </p>
                    </div>

                    {schedule.shiftDescription && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1">
                        <span className="text-[11px] font-bold text-slate-800 block">Pembagian Giliran Kerja (Shift):</span>
                        <p className="text-[11px] text-slate-600 font-mono leading-relaxed">
                          {schedule.shiftDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
        
        {onUseTemplate && (
          <div className="p-3.5 border-t border-slate-100 bg-white shrink-0">
            <button
              onClick={() => onUseTemplate(selectedRoleDetail)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center justify-center"
            >
              <span>{actionButtonText || 'Gunakan Template'}</span>
            </button>
          </div>
        )}
        </>
      )}
    </Modal>
  );
};

