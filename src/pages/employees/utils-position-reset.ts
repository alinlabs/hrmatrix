import { v4 as uuidv4 } from 'uuid';
import {
  Employee,
  EmployeeDocument,
  BpjsKetenagakerjaanProfile,
  BpjsKesehatanProfile,
  TaxProfile,
} from '../../types';
import { ComboboxOption } from '../../components/ui';
import { masterTunjangan } from '../../data/master';
import { PositionDetails } from '../../services/positionService';
import { calculateAllowancePreview } from '../../utils/allowanceCalculator';
import { calculateTunjanganJabatan } from '../../services/tunjanganJabatanService';
import { getAllowanceCategory } from '../../utils/allowanceClassification';

/**
 * Intensive Documents Reset & Rewrite:
 * - Completely rebuilds document requirements from the new position's template (Wajib, Pendukung, Khusus).
 * - Retains any already uploaded documents (with non-empty url).
 * - Discards old empty placeholder documents that are not required by the new position.
 */
export function buildDocumentsForPosition(
  currentDocs: EmployeeDocument[] = [],
  details: PositionDetails | null
): EmployeeDocument[] {
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
        category: existing.category || category,
      });
    } else {
      nextDocs.push({
        id: existing?.id || uuidv4(),
        name: clean,
        url: '',
        category,
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
          category: d.category || 'Dokumen Tambahan',
        });
        processed.add(lower);
      }
    }
  });

  return nextDocs;
}

/**
 * Intensive Allowances Reset & Rewrite:
 * - Completely rebuilds allowances according to the new position.
 * - Recalculates Tunjangan Jabatan based on the new level and basic salary.
 * - Extracts and computes nominal for all allowances defined in the new position's template.
 */
export function buildAllowancesForPosition(
  positionAllowanceIds: string[],
  level: string,
  salary: number,
  allowanceOptions: ComboboxOption[]
) {
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
    category: 'Tunjangan Tetap',
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
      const isProrata =
        ruleDef.metode_perhitungan === 'prorata' ||
        ruleDef.calculationModel === 'prorata' ||
        ruleName.toUpperCase().includes('THR') ||
        ruleName.toLowerCase().includes('hari raya');

      if (isProrata) {
        const pct = ruleDef.nilai || 100;
        initAmt = Math.round((pct / 100) * salary);
      } else {
        const calc = calculateAllowancePreview(ruleDef, {
          basicSalary: salary,
          level,
          serviceMonths: 12,
          daysAttended: 22,
          workingDaysInMonth: 25,
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
      category: assignedCategory,
    });
    addedRuleIds.add(lowerId);
    addedNames.add(ruleName.toLowerCase());
  });

  return updatedAllowances;
}

/**
 * Intensive BPJS Reset & Rewrite:
 * - Resets BPJS Ketenagakerjaan programs (JHT, JKK, JKM, JP, JKP) and risk category to match the new position.
 * - Resets BPJS Kesehatan rates, participation, and family coverage to match the new position and standard rules.
 */
export function buildBpjsProfiles(
  details: PositionDetails | null,
  prev: Partial<Employee>
) {
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

  const hasBpjsTkData =
    (hasExplicitList && bpjsList.some(id => id.includes('jht') || id.includes('jkk') || id.includes('jkm') || id.includes('jp') || id.includes('tk') || id.includes('ketenagakerjaan'))) ||
    !!details ||
    (kpjNum && kpjNum.trim().length > 0);
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
    useCustomReportedWage: prev.bpjsKetenagakerjaanProfile?.useCustomReportedWage || false,
  };

  const bpjsKesNum = prev.bpjsKesehatanProfile?.participantNumber || prev.bpjsKesehatan || '';

  const hasBpjsKesData =
    (hasExplicitList && bpjsList.some(id => id.includes('kes') || id.includes('kesehatan') || id.includes('ppu'))) ||
    !!details ||
    (bpjsKesNum && bpjsKesNum.trim().length > 0);
  const bpjsKesActiveStatus = hasBpjsKesData ? 'Active' : (prev.bpjsKesehatanProfile?.activeStatus || 'Inactive');

  const defaultParticipantType =
    prev.bpjsKesehatanProfile?.participantType && prev.bpjsKesehatanProfile.participantType !== 'None'
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
    useCustomWageBase: prev.bpjsKesehatanProfile?.useCustomWageBase || false,
  };

  return {
    bpjsTK: newBpjsTK,
    bpjsKes: newBpjsKes,
    jkkRiskCategory,
    kpjNum,
    bpjsKesNum,
  };
}

/**
 * Intensive Tax Profile Reset & Rewrite:
 * - Resets tax rule to the new position's rule (PMK 168/2023 & PP 58/2023 TER).
 * - Resets employeeType, taxMethod, PTKP status, and TER category.
 */
export function buildTaxProfile(
  details: PositionDetails | null,
  prev: Partial<Employee>
): { taxProfile: TaxProfile; taxStatus: string } {
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
    dependents: prev.taxProfile?.dependents ?? prev.dependents ?? 0,
    employeeType: (prev.taxProfile?.employeeType || '') as any,
    taxMethod: prev.taxProfile?.taxMethod || ('' as any),
    hasNpwp: Boolean(prev.npwp && prev.npwp.trim().length > 0) || true,
    taxHistory: prev.taxProfile?.taxHistory || [],
  };

  return {
    taxProfile: newTaxProfile,
    taxStatus: newTaxProfile.ptkpStatus || '',
  };
}
