import { LucideIcon, Tag, ShieldCheck, Calculator, Gift, Percent } from 'lucide-react';
import { PayrollRule } from '../../types';
import { KompensasiStats, KompensasiTab } from './types';

export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '1 Jan 2024';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatCurrency(val?: number): string {
  if (val === undefined || val === null) return 'Rp 0';
  return `Rp ${new Intl.NumberFormat('id-ID').format(val)}`;
}

export function formatRuleValue(rule: PayrollRule): string {
  if (rule.metode_perhitungan === 'berjenjang') {
    const tierList = (rule as any).daftarJenjang || rule.aturan || [];
    const count = tierList.length;
    const isCustom = (rule as any).jenis_jenjang === 'custom_level' || 
      rule.parameter_jenjang?.parameter === 'level_jabatan' || 
      ((rule as any).jenis_jenjang !== 'masa_kerja' && (rule as any).daftarJenjang && (rule as any).daftarJenjang.length > 0);
    return isCustom ? `${count} Jenjang Level` : `${count} Masa Kerja`;
  }

  if (rule.nilai !== null && rule.nilai !== undefined) {
    const isPercent = rule.dasar_perhitungan === 'Gaji Pokok' || 
      rule.dasar_perhitungan === 'gaji_pokok' || 
      (rule as any).satuan_nilai === 'persen' || 
      rule.metode_perhitungan === 'persentase';
    return isPercent ? `${rule.nilai}%` : formatCurrency(rule.nilai);
  }

  if (rule.fixedAmount) {
    return formatCurrency(rule.fixedAmount);
  }

  if (rule.employeeShare !== undefined || rule.employerShare !== undefined) {
    const emp = rule.employeeShare ?? 0;
    const comp = rule.employerShare ?? 0;
    return `Perusahaan ${comp}% • Karyawan ${emp}%`;
  }

  return '-';
}

export function getRuleCategoryGroup(rule: PayrollRule): {
  type: 'tunjangan_tetap' | 'tunjangan_tidak_tetap' | 'bonus_insentif' | 'bpjs_kesehatan' | 'bpjs_ketenagakerjaan' | 'pajak';
  label: string;
  badgeColor: string;
} {
  const cat = rule.category;
  const nameLower = (rule.nama || rule.name || '').toLowerCase();
  const kat = (rule.kategori || '').toLowerCase();
  const grp = (rule.subCategory || rule.allowanceGroup || '').toLowerCase();

  if (cat === 'Tax') {
    return { type: 'pajak', label: 'Pajak Penghasilan', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }

  if (cat === 'BPJS Health' || nameLower.includes('kesehatan') || rule.id.toLowerCase().includes('kes')) {
    return { type: 'bpjs_kesehatan', label: 'BPJS Kesehatan', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' };
  }

  if (cat === 'BPJS Employment' || (cat as any) === 'BPJS' || nameLower.includes('ketenagakerjaan') || nameLower.includes('jht') || nameLower.includes('jp') || nameLower.includes('jkk') || nameLower.includes('jkm')) {
    return { type: 'bpjs_ketenagakerjaan', label: 'BPJS Ketenagakerjaan', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' };
  }

  // Allowance classification
  if (kat.includes('bonus') || kat.includes('insentif') || kat.includes('thr') || grp === 'bonus' || grp === 'insentif' || grp === 'bonus_appreciation' || grp === 'religious_allowance') {
    return { type: 'bonus_insentif', label: 'Bonus & Insentif', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' };
  }

  if (kat.includes('tidak_tetap') || kat.includes('tidak tetap') || grp === 'variable_allowance') {
    return { type: 'tunjangan_tidak_tetap', label: 'Tunjangan Tidak Tetap', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' };
  }

  return { type: 'tunjangan_tetap', label: 'Tunjangan Tetap', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
}

export function getRuleIconAndColors(rule: PayrollRule): {
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
} {
  const nameLower = (rule.nama || rule.name || '').toLowerCase();

  // Identifikasi berdasarkan nama: "komisi" / "insentif" -> Insentif (Percent), "bonus" / "reward" -> Bonus (Gift)
  const isInsentif = nameLower.includes('komisi') || nameLower.includes('insentif');
  const isBonus = !isInsentif && (nameLower.includes('bonus') || nameLower.includes('reward'));

  if (isInsentif) {
    return { icon: Percent, bgColor: 'bg-red-50', textColor: 'text-red-600' };
  }
  if (isBonus) {
    return { icon: Gift, bgColor: 'bg-purple-50', textColor: 'text-purple-600' };
  }

  const isBPJS = rule.category === 'BPJS Health' || rule.category === 'BPJS Employment' || nameLower.includes('bpjs');
  const isTax = rule.category === 'Tax' || nameLower.includes('pph') || nameLower.includes('pajak');

  if (isBPJS) {
    return { icon: ShieldCheck, bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
  }
  if (isTax) {
    return { icon: Calculator, bgColor: 'bg-slate-100', textColor: 'text-blue-900' };
  }

  // Tunjangan (Default Allowance)
  return { icon: Tag, bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
}

export function calculateKompensasiStats(rules: PayrollRule[]): KompensasiStats {
  const allowanceRules = rules.filter(r => r.category === 'Allowance');
  const bpjsRules = rules.filter(r => r.category === 'BPJS Health' || r.category === 'BPJS Employment');
  const taxRules = rules.filter(r => r.category === 'Tax');

  let fixed = 0;
  let variable = 0;
  let insentif = 0;
  let bonus = 0;

  allowanceRules.forEach(r => {
    const nameLower = (r.nama || r.name || '').toLowerCase();
    const katLower = (r.kategori || '').toLowerCase();
    const grpLower = (r.subCategory || r.allowanceGroup || '').toLowerCase();
    const idLower = (r.id || '').toLowerCase();

    const isInsentif = nameLower.includes('insentif') || katLower.includes('insentif') || grpLower.includes('insentif') || idLower.includes('insentif');
    const isBonus = nameLower.includes('bonus') || katLower.includes('bonus') || katLower.includes('thr') || grpLower.includes('bonus') || idLower.includes('bonus');

    if (isInsentif) {
      insentif++;
    } else if (isBonus) {
      bonus++;
    } else if (katLower.includes('tidak_tetap') || katLower.includes('tidak tetap') || grpLower === 'variable_allowance') {
      variable++;
    } else {
      fixed++;
    }
  });

  let bpjsKes = 0;
  let bpjsTK = 0;

  bpjsRules.forEach(r => {
    const grp = getRuleCategoryGroup(r).type;
    if (grp === 'bpjs_kesehatan') bpjsKes++;
    else bpjsTK++;
  });

  return {
    totalRules: rules.length,
    totalTunjangan: allowanceRules.length,
    tunjanganTetap: fixed,
    tunjanganTidakTetap: variable,
    insentifCount: insentif,
    bonusCount: bonus,
    bonusInsentif: insentif + bonus,
    totalBPJS: bpjsRules.length,
    bpjsKesehatan: bpjsKes,
    bpjsKetenagakerjaan: bpjsTK,
    totalPajak: taxRules.length,
  };
}

/**
 * Exhaustive deep search matcher for PayrollRule (Tipe A: Card List Filtering).
 * Inspects and filters all card elements:
 * - Nama aturan, sub-label grup, kategori, dan deskripsi
 * - Nilai nominal Rupiah terformat (misal Rp 500.000), angka mentah (500000), persentase iuran (1%, 4%, 20%, dll)
 * - Metode perhitungan (Tetap, Persentase, Harian, Prorata, Berjenjang, Kelipatan)
 * - Frekuensi pembayaran (Bulanan, Triwulanan, Tahunan, Insidental)
 * - Dasar hukum / regulasi (Peraturan Perusahaan, PP 58/2023, PP 44/2015, PMK 168/2023, dll)
 * - Detail kontributor iuran (Perusahaan, Karyawan, Pemerintah, share, fixed)
 * - Aturan rentang / jenjang / brackets (levels, min, max, PTKP TK/0, TER A/B/C, Pasal 17)
 */
export function matchPayrollRuleExhaustive(rule: PayrollRule, rawQuery: string): boolean {
  if (!rawQuery || rawQuery.trim() === '') return true;

  const query = rawQuery.toLowerCase().trim();
  const searchTerms = query.split(/\s+/).filter(Boolean);
  if (searchTerms.length === 0) return true;

  const corpus: string[] = [];

  const add = (val?: string | number | null) => {
    if (val !== undefined && val !== null && val !== '') {
      corpus.push(String(val).toLowerCase());
    }
  };

  const addNumber = (val?: number | null) => {
    if (val !== undefined && val !== null && !isNaN(val)) {
      add(val);
      add(formatCurrency(val));
      try {
        add(new Intl.NumberFormat('id-ID').format(val));
      } catch {}
      add(`${val}%`);
    }
  };

  // 1. Identifiers and Names
  add(rule.id);
  add(rule.nama);
  add(rule.name);

  // 2. Categories, Groups, Sub-labels
  add(rule.category);
  add(rule.kategori);
  add(rule.allowanceGroup);
  add(rule.allowanceType);
  add(rule.subCategory);
  
  const group = getRuleCategoryGroup(rule);
  add(group.label);
  add(group.type);

  // Specific contextual badge labels
  const nameLower = (rule.nama || rule.name || '').toLowerCase();
  if (nameLower.includes('komisi') || nameLower.includes('insentif')) {
    add('insentif & komisi');
    add('insentif');
    add('komisi');
  }
  if (nameLower.includes('bonus') || nameLower.includes('reward')) {
    add('bonus & reward');
    add('bonus');
    add('reward');
  }
  if (rule.category === 'BPJS Health' || nameLower.includes('kesehatan') || rule.id.toLowerCase().includes('kes')) {
    add('bpjs kesehatan');
    add('jaminan kesehatan');
    add('iuran kesehatan');
  }
  if (rule.category === 'BPJS Employment' || (rule.category as any) === 'BPJS' || nameLower.includes('ketenagakerjaan') || nameLower.includes('jht') || nameLower.includes('jp') || nameLower.includes('jkk') || nameLower.includes('jkm')) {
    add('bpjs ketenagakerjaan');
    add('jaminan sosial tenaga kerja');
    add('jamsostek');
    add('jht');
    add('jkk');
    add('jkm');
    add('jp');
  }
  if (rule.category === 'Tax' || nameLower.includes('pph') || nameLower.includes('pajak')) {
    add('pajak penghasilan');
    add('pph 21');
    add('pajak');
    add('ter');
    add('tarif efektif');
    add('tarif efektif rata-rata');
    add('pasal 17');
  }

  // 3. Descriptions & Notes
  add(rule.description);
  add((rule as any).deskripsi);
  add(rule.criteriaDescription);
  add((rule as any).notes);
  add((rule as any).keterangan);

  // 4. Formatted Value & Raw Numbers
  add(formatRuleValue(rule));
  addNumber(rule.nilai);
  addNumber(rule.fixedAmount);
  addNumber(rule.unitRate);
  addNumber(rule.maximumBase);
  addNumber(rule.minimumBase);
  addNumber(rule.employeeShare);
  addNumber(rule.employerShare);

  if (rule.employeeShare !== undefined || rule.employerShare !== undefined) {
    add(`perusahaan ${rule.employerShare}%`);
    add(`karyawan ${rule.employeeShare}%`);
  }

  // 5. Calculation Methods & Types
  add(rule.metode_perhitungan);
  add(rule.ruleType);
  add(rule.calculationModel);
  add(rule.dasar_perhitungan);
  add(rule.jenis_jenjang);
  if (rule.parameter_jenjang) {
    add(rule.parameter_jenjang.parameter);
    add(rule.parameter_jenjang.satuan);
  }

  // Common Indonesian aliases for methods
  const metode = (rule.metode_perhitungan || rule.ruleType || rule.calculationModel || '').toLowerCase();
  if (metode.includes('tetap') || metode.includes('fixed')) {
    add('tetap');
    add('nominal tetap');
    add('flat');
  }
  if (metode.includes('persen') || metode.includes('percentage')) {
    add('persentase');
    add('persen');
  }
  if (metode.includes('harian') || metode.includes('daily')) {
    add('harian');
    add('upah harian');
    add('kehadiran');
  }
  if (metode.includes('jenjang') || metode.includes('tiered')) {
    add('berjenjang');
    add('bertingkat');
    add('rentang');
    add('jenjang');
  }
  if (metode.includes('prorata')) {
    add('prorata');
    add('pro rata');
  }
  if (metode.includes('kelipatan') || metode.includes('multiplier')) {
    add('kelipatan');
    add('pengali');
  }
  if (metode.includes('apresiasi')) {
    add('apresiasi');
  }

  // 6. Payment Frequency
  add(rule.frekuensi_pembayaran);
  add(rule.paymentPeriod);
  const freq = (rule.frekuensi_pembayaran || rule.paymentPeriod || '').toLowerCase();
  if (freq.includes('bulan') || freq.includes('month')) {
    add('bulanan');
    add('per bulan');
  }
  if (freq.includes('triwulan') || freq.includes('quarter')) {
    add('triwulanan');
    add('triwulan');
  }
  if (freq.includes('tahun') || freq.includes('annual')) {
    add('tahunan');
    add('per tahun');
  }
  if (freq.includes('insidental')) {
    add('insidental');
    add('sewaktu-waktu');
  }

  // 7. Legal Basis / Regulation & Origin
  add(rule.origin);
  add(rule.version);
  add(rule.status);
  if (rule.status === 'Active') {
    add('aktif');
  } else if (rule.status === 'Needs Verification') {
    add('verifikasi');
  } else if (rule.status === 'Expired') {
    add('kedaluwarsa');
    add('nonaktif');
  }

  // 8. Contributors
  if (rule.contributors && Array.isArray(rule.contributors)) {
    rule.contributors.forEach(c => {
      add(c.name);
      addNumber(c.share);
      addNumber(c.fixedAmount);
    });
  }

  // 9. Tiers, Brackets, and Aturan
  if (rule.aturan && Array.isArray(rule.aturan)) {
    rule.aturan.forEach(a => {
      add(a.namaJenjang);
      add(a.level);
      add(a.keterangan);
      add(a.tipeNilai);
      addNumber(a.nilai);
      addNumber(a.nominal);
      addNumber(a.persentaseGaji);
      if (typeof a.min === 'number') addNumber(a.min);
      if (typeof a.max === 'number') addNumber(a.max);
    });
  }

  if (rule.tiers && Array.isArray(rule.tiers)) {
    rule.tiers.forEach(t => {
      add(t.name);
      add(t.description);
      addNumber(t.employeeShare);
      addNumber(t.employerShare);
      addNumber(t.fixedAmount);
      if (t.contributors && Array.isArray(t.contributors)) {
        t.contributors.forEach(tc => {
          add(tc.name);
          addNumber(tc.share);
          addNumber(tc.fixedAmount);
        });
      }
    });
  }

  if (rule.tenureTiers && Array.isArray(rule.tenureTiers)) {
    rule.tenureTiers.forEach(tt => {
      addNumber(tt.amount);
      addNumber(tt.minYears);
      if (tt.maxYears) addNumber(tt.maxYears);
      add(tt.description);
    });
  }

  // 10. Tax Custom Config (if available on Tax rule)
  const taxConfig = (rule as any).taxCustomConfig;
  if (taxConfig) {
    add('ter');
    add('tarif efektif');
    add('pasal 17');
    add('ptkp');
    ['tk/0', 'tk/1', 'tk/2', 'tk/3', 'k/0', 'k/1', 'k/2', 'k/3', 'k/i/0', 'k/i/1', 'k/i/2', 'k/i/3'].forEach(ptkp => add(ptkp));
    ['ter a', 'ter b', 'ter c', 'kategori a', 'kategori b', 'kategori c'].forEach(ter => add(ter));
    ['lapisan i', 'lapisan ii', 'lapisan iii', 'lapisan iv', 'lapisan v'].forEach(lap => add(lap));
    if (taxConfig.terBracketsA && Array.isArray(taxConfig.terBracketsA)) {
      taxConfig.terBracketsA.forEach((b: any) => {
        addNumber(b.ratePercent);
        addNumber(b.minGross);
        addNumber(b.maxGross);
      });
    }
  }

  const fullText = corpus.join(' ');
  const numbersOnlyText = fullText.replace(/[^0-9]/g, '');

  return searchTerms.every(term => {
    // 1. Direct match in full text
    if (fullText.includes(term)) return true;

    // 2. Cleaned alphanumeric match
    const termClean = term.replace(/[^a-z0-9]/g, '');
    if (termClean.length > 0 && fullText.replace(/[^a-z0-9]/g, '').includes(termClean)) {
      return true;
    }

    // 3. Cleaned numbers match
    const termNumbers = term.replace(/[^0-9]/g, '');
    if (termNumbers.length >= 2 && numbersOnlyText.includes(termNumbers)) {
      return true;
    }

    return false;
  });
}
