import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { PayrollRule } from '../../types';
import { 
  Receipt, 
  Coins, 
  Sparkles, 
  Check,
  Power
} from 'lucide-react';
import { ensureDefaultPayrollRules } from '../../data/master/aturan-penggajian';

interface PayrollRuleSeekbarCardsProps {
  disabledRuleIds?: string[];
  onToggleRule?: (ruleId: string, isNowDisabled: boolean) => void;
  onToggleAllRules?: (ruleIds: string[], isNowDisabled: boolean) => void;
  onRulesChanged?: () => void;
  className?: string;
}

export const isBonusOrInsentifRule = (rule: PayrollRule): boolean => {
  const n = (rule.name || '').toLowerCase();
  const kat = (rule.kategori || '').toLowerCase();
  const group = (rule.allowanceGroup || '').toLowerCase();
  const type = (rule.allowanceType || '').toLowerCase();

  return (
    kat.includes('bonus') ||
    kat.includes('insentif') ||
    group === 'bonus' ||
    group === 'insentif' ||
    type.includes('bonus') ||
    type.includes('performance') ||
    n.includes('bonus') ||
    n.includes('insentif') ||
    n.includes('komisi') ||
    n.includes('thr')
  );
};

export const isNonMonthlyAllowanceRule = (rule: PayrollRule): boolean => {
  const freq = (rule.frekuensi_pembayaran || '').toLowerCase();
  const period = (rule.paymentPeriod || '').toLowerCase();

  // If frequency/period is explicitly set and is NOT monthly
  const isNonMonthlyFreq = (freq !== '' && freq !== 'bulanan') || (period !== '' && period !== 'monthly');

  // Make sure it's an allowance (category === 'Allowance' or category === 'Tunjangan') and NOT statutory/presence
  const cat = (rule.category || '').toLowerCase();
  const isAllowance = cat === 'allowance' || (rule.kategori || '').toLowerCase().includes('tunjangan');
  const isStatutoryOrPresence =
    cat === 'tax' ||
    cat === 'bpjs health' ||
    cat === 'bpjs employment' ||
    cat === 'deduction' ||
    rule.name.toLowerCase().includes('pph') ||
    rule.name.toLowerCase().includes('bpjs') ||
    rule.name.toLowerCase().includes('lembur') ||
    rule.name.toLowerCase().includes('terlambat') ||
    rule.name.toLowerCase().includes('absen');

  return isAllowance && isNonMonthlyFreq && !isStatutoryOrPresence && !isBonusOrInsentifRule(rule);
};

export const isEligibleRuleForModalSetting = (rule: PayrollRule): boolean => {
  return isBonusOrInsentifRule(rule) || isNonMonthlyAllowanceRule(rule);
};

export const getRuleShortFormula = (rule: PayrollRule): string => {
  const n = (rule.name || rule.nama || '').toLowerCase();
  const desc = (rule.description || '').toLowerCase();
  const metode = (rule.metode_perhitungan || '').toLowerCase();
  const ruleType = (rule.ruleType || '').toLowerCase();
  const dasar = (rule.dasar_perhitungan || '').toLowerCase();

  // 1. Pro Rata
  if (
    n.includes('prorata') || n.includes('pro-rata') || n.includes('pro rata') ||
    n.includes('thr') || n.includes('hari raya') ||
    desc.includes('prorata') || desc.includes('pro-rata') || desc.includes('pro rata')
  ) {
    return 'Pro Rata Sesuai Masa Kerja';
  }

  // 2. Berjenjang Masa Kerja
  if (
    rule.id === 'bonus-tahunan-masa-kerja' ||
    n.includes('bonus tahunan') ||
    (n.includes('masa kerja') && (metode === 'berjenjang' || ruleType === 'tiered' || desc.includes('berjenjang')))
  ) {
    return 'Berjenjang Sesuai Masa Kerja';
  }

  // 3. Berjenjang Level / Posisi
  if (
    n.includes('level') || n.includes('posisi') || n.includes('jabatan') ||
    dasar.includes('level') || desc.includes('level') || desc.includes('posisi')
  ) {
    if (metode === 'berjenjang' || ruleType === 'tiered' || desc.includes('berjenjang')) {
      return 'Berjenjang Sesuai Level Posisi';
    }
  }

  // 4. Other Berjenjang
  if (metode === 'berjenjang' || ruleType === 'tiered') {
    return 'Berjenjang Sesuai Masa Kerja';
  }

  // 5. Daily wage (Harian)
  if (metode === 'harian' || ruleType === 'dailywage' || n.includes('harian')) {
    const val = rule.unitRate || rule.nilai || rule.fixedAmount;
    if (val && val > 0) {
      return `Rp ${val.toLocaleString('id-ID')} / hari`;
    }
  }

  // 6. Fixed Nominal
  if (metode === 'tetap' || ruleType === 'fixed' || dasar.includes('nominal')) {
    const val = rule.fixedAmount || rule.nilai || rule.unitRate;
    if (val && val > 0) {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
  }

  // 7. Percentage of Gaji Pokok
  if (metode === 'persentase' || ruleType === 'percentage' || dasar.includes('gaji pokok')) {
    const pct = rule.nilai || rule.employeeShare || rule.prorataBasePercent;
    if (pct && pct > 0) {
      return `${pct}% Gaji Pokok`;
    }
    return 'Persentase Gaji Pokok';
  }

  // 8. Generic Fallback by numeric values
  const numericVal = rule.fixedAmount || rule.nilai;
  if (numericVal && numericVal > 0) {
    if (numericVal <= 100) {
      return `${numericVal}% Gaji Pokok`;
    }
    return `Rp ${numericVal.toLocaleString('id-ID')}`;
  }

  // 9. Parsing description if numeric values aren't set
  const rpMatch = desc.match(/rp\s*([\d\.]+)/i);
  if (rpMatch && rpMatch[1]) {
    return `Rp ${rpMatch[1]}`;
  }

  const pctMatch = desc.match(/(\d+)%\s*(gaji pokok|upah)/i);
  if (pctMatch && pctMatch[1]) {
    return `${pctMatch[1]}% Gaji Pokok`;
  }

  return 'Formula Sesuai Ketentuan';
};

export const PayrollRuleSeekbarCards: React.FC<PayrollRuleSeekbarCardsProps> = ({
  disabledRuleIds,
  onToggleRule,
  onToggleAllRules,
  onRulesChanged,
  className = ''
}) => {
  // 1. Live Query for payroll rules from IndexedDB
  const allRules = useLiveQuery(async () => {
    await ensureDefaultPayrollRules();
    return db.payrollRules.toArray();
  }) || [];

  // 2. Filter ONLY eligible rules (Bonus/Insentif or Non-monthly Allowance)
  const eligibleRules = allRules.filter(isEligibleRuleForModalSetting);

  const isRuleActive = (rule: PayrollRule) => {
    if (disabledRuleIds !== undefined) {
      return !disabledRuleIds.includes(rule.id);
    }
    return rule.status === 'Active';
  };

  const handleToggleClick = async (rule: PayrollRule) => {
    const currentlyActive = isRuleActive(rule);
    if (onToggleRule) {
      onToggleRule(rule.id, currentlyActive);
    } else {
      const nextStatus = currentlyActive ? 'Expired' : 'Active';
      await db.payrollRules.update(rule.id, { status: nextStatus });
      if (onRulesChanged) {
        onRulesChanged();
      }
    }
  };

  const handleToggleAllInGroup = async (targetRules: PayrollRule[], targetActive: boolean) => {
    if (onToggleAllRules) {
      onToggleAllRules(targetRules.map(r => r.id), !targetActive);
    } else {
      const nextStatus = targetActive ? 'Active' : 'Expired';
      await db.transaction('rw', db.payrollRules, async () => {
        for (const rule of targetRules) {
          await db.payrollRules.update(rule.id, { status: nextStatus });
        }
      });
      if (onRulesChanged) {
        onRulesChanged();
      }
    }
  };

  const getRuleIconAndColor = (rule: PayrollRule) => {
    const nameLower = rule.name.toLowerCase();

    if (nameLower.includes('thr') || nameLower.includes('bonus')) {
      return {
        icon: <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />,
        bg: 'bg-purple-50 border-purple-200'
      };
    }
    if (nameLower.includes('insentif') || nameLower.includes('komisi')) {
      return {
        icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />,
        bg: 'bg-amber-50 border-amber-200'
      };
    }
    return {
      icon: <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200'
    };
  };

  const activeCount = eligibleRules.filter(r => isRuleActive(r)).length;
  const totalCount = eligibleRules.length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cards Grid - Direct layout without internal scroll */}
      {eligibleRules.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-900 bg-white rounded-xl border border-dashed border-slate-200 font-medium">
          Tidak ada bonus, insentif, atau tunjangan non-bulanan yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {eligibleRules.map(rule => {
            const isActive = isRuleActive(rule);

            return (
              <div
                key={rule.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  isActive 
                    ? 'bg-white border-slate-200/90 shadow-2xs' 
                    : 'bg-slate-50/80 border-slate-200/60 opacity-60'
                }`}
              >
                {/* Left Info Box without Icon */}
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold truncate text-slate-900">
                    {rule.name}
                  </h5>
                  <p className="text-xs font-normal text-slate-500 mt-0.5 leading-tight truncate">
                    {getRuleShortFormula(rule)}
                  </p>
                </div>

                {/* Right Seekbar / Toggle Switch */}
                <div className="flex items-center shrink-0 pl-2">
                  <button
                    type="button"
                    onClick={() => handleToggleClick(rule)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                      isActive ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={isActive}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

