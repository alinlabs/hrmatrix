import {
  DashboardRawData,
  DashboardMetricsSummary,
  AttendanceTrendPoint,
  PayrollTrendPoint,
  PentagonAxisPoint,
  CircleSlicePoint,
  DepartmentBarPoint,
} from './types';

export const CHART_PALETTE = [
  '#2563EB', // Blue 600
  '#0D9488', // Teal 600
  '#D97706', // Amber 600
  '#4F46E5', // Indigo 600
  '#059669', // Emerald 600
  '#E11D48', // Rose 600
  '#0284C7', // Sky 600
  '#7C3AED', // Violet 600
];

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function formatCompactRupiah(val: number): string {
  if (!val || isNaN(val)) return 'Rp 0';
  const abs = Math.abs(val);
  if (abs >= 1_000_000_000) {
    return `Rp ${(val / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
  }
  if (abs >= 1_000_000) {
    return `Rp ${(val / 1_000_000).toFixed(1).replace('.', ',')} Jt`;
  }
  if (abs >= 1_000) {
    return `Rp ${Math.round(val / 1_000)} Rb`;
  }
  return `Rp ${Math.round(val).toLocaleString('id-ID')}`;
}

export function formatFullRupiah(val: number): string {
  return `Rp ${Math.round(val || 0).toLocaleString('id-ID')}`;
}

function formatShortDateLabel(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${SHORT_MONTHS[monthIdx] || parts[1]}`;
}

const ASSET_CATEGORY_LABELS: Record<string, string> = {
  ELEKTRONIK_IT: 'Elektronik & IT',
  KENDARAAN_OPERASIONAL: 'Kendaraan',
  FURNITUR_KANTOR: 'Furnitur Kantor',
  MESIN_ALAT_KERJA: 'Mesin & Alat Kerja',
  PERLENGKAPAN_GEDUNG: 'Perlengkapan Gedung',
};

const ASSET_CONDITION_LABELS: Record<string, string> = {
  SANGAT_BAIK: 'Sangat Baik',
  BAIK: 'Baik',
  PERLU_PERBAIKAN: 'Perlu Perbaikan',
  RUSAK_BERAT: 'Rusak Berat',
};

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  Permanent: 'Karyawan Tetap (PKWTT)',
  Contract: 'Kontrak (PKWT)',
  Internship: 'Magang / Intern',
  Freelance: 'Lepas / Freelance',
};

const EMPLOYEE_STATUS_LABELS: Record<string, string> = {
  Active: 'Aktif',
  Probation: 'Probation',
  Inactive: 'Non-Aktif',
  Terminated: 'Berakhir',
};

export function computeDashboardMetrics(raw: DashboardRawData): DashboardMetricsSummary {
  const todayStr = new Date().toISOString().split('T')[0];
  const {
    employees,
    departments,
    attendance,
    payrollPeriods,
    payrollRecords,
    leaves,
    kpiResults,
    extraShifts,
    shiftSwaps,
    assets,
    supplies,
    purchaseRequests,
    maintenanceSchedules,
    roomBookings,
    tickets,
    vendors,
    permits,
    guests,
    mails,
    vacancies,
    totalCandidates,
    contracts,
    letters,
  } = raw;

  const employeesCount = employees.length;
  const activeEmployeesList = employees.filter((e) => e.status === 'Active');
  const activeEmployees = activeEmployeesList.length;
  const probationEmployees = employees.filter((e) => e.status === 'Probation').length;
  const contractEmployees = employees.filter((e) => e.contractType === 'Contract').length;
  const permanentEmployees = employees.filter((e) => e.contractType === 'Permanent').length;

  // Department id -> name lookup
  const deptNameMap = new Map<string, string>();
  departments.forEach((d) => {
    deptNameMap.set(d.id, d.name);
  });

  // Today's attendance
  const todayLogs = attendance.filter((a) => a.date === todayStr);
  const todayPresentLogs = todayLogs.filter(
    (a) => a.status === 'Present' || a.status === 'Late' || a.status === 'WFH'
  );
  const todayAttendanceCount = todayPresentLogs.length;
  const todayPresentRate = activeEmployees > 0
    ? Math.min(100, Math.round((todayAttendanceCount / activeEmployees) * 100))
    : 0;

  // Build Attendance 30-day & 14-day series
  const uniqueDates = Array.from(new Set(attendance.map((a) => a.date))).sort();
  const recentDates30 = uniqueDates.slice(-30);
  const buildAttendanceSeries = (dates: string[]): AttendanceTrendPoint[] => {
    return dates.map((d) => {
      const dayLogs = attendance.filter((a) => a.date === d);
      const hadir = dayLogs.filter((a) => a.status === 'Present' || a.status === 'WFH').length;
      const terlambat = dayLogs.filter((a) => a.status === 'Late').length;
      const izinCuti = dayLogs.filter((a) => a.status === 'Sick' || a.status === 'Leave').length;
      const alpa = dayLogs.filter((a) => a.status === 'Absent').length;
      const totalDay = hadir + terlambat + izinCuti + alpa;
      const tingkatHadir = totalDay > 0 ? Math.round(((hadir + terlambat) / totalDay) * 100) : 0;
      return {
        date: d,
        label: formatShortDateLabel(d),
        hadir,
        terlambat,
        izinCuti,
        alpa,
        tingkatHadir,
      };
    });
  };
  const attendanceTrend30 = buildAttendanceSeries(recentDates30);
  const attendanceTrend14 = attendanceTrend30.slice(-14);

  // 30-day aggregate attendance rate
  const logs30Set = new Set(recentDates30);
  const logs30 = attendance.filter((a) => logs30Set.has(a.date));
  const logs30PresentOrLate = logs30.filter(
    (a) => a.status === 'Present' || a.status === 'Late' || a.status === 'WFH'
  ).length;
  const logs30EffectiveTotal = logs30.filter((a) => a.status !== 'Holiday').length;
  const attendance30dRate = logs30EffectiveTotal > 0
    ? Math.round((logs30PresentOrLate / logs30EffectiveTotal) * 100)
    : 0;

  // Payroll trend across periods
  const sortedPeriods = [...payrollPeriods].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const payrollTrend: PayrollTrendPoint[] = sortedPeriods.map((period) => {
    const recs = payrollRecords.filter((r) => r.payrollPeriodId === period.id);
    const grossRaw = recs.reduce((sum, r) => sum + (r.grossSalary || 0), 0);
    const netRaw = recs.reduce((sum, r) => sum + (r.netSalary || 0), 0);
    const deductionRaw = recs.reduce((sum, r) => sum + (r.totalDeduction || 0), 0);
    const shortMonth = period.month ? period.month.slice(0, 3) : period.startDate.slice(5, 7);
    const shortYear = String(period.year || '').slice(-2);
    return {
      periodId: period.id,
      label: `${shortMonth} '${shortYear}`,
      grossMillions: Number((grossRaw / 1_000_000).toFixed(2)),
      netMillions: Number((netRaw / 1_000_000).toFixed(2)),
      deductionMillions: Number((deductionRaw / 1_000_000).toFixed(2)),
      grossRaw,
      netRaw,
      deductionRaw,
      headcount: recs.length,
    };
  });

  const latestPayroll = payrollTrend.length > 0 ? payrollTrend[payrollTrend.length - 1] : null;
  const latestPayrollTotalNet = latestPayroll?.netRaw || 0;
  const latestPayrollTotalGross = latestPayroll?.grossRaw || 0;
  const latestPayrollLabel = latestPayroll?.label || '-';

  // Payroll composition donut (from latest period records, or all records fallback)
  const latestRecords = latestPayroll
    ? payrollRecords.filter((r) => r.payrollPeriodId === latestPayroll.periodId)
    : payrollRecords;
  const sumBasic = latestRecords.reduce((s, r) => s + (r.basicSalary || 0), 0);
  const sumAllowances = latestRecords.reduce(
    (s, r) => s + (r.fixedAllowance || 0) + (r.variableAllowance || 0),
    0
  );
  const sumOvertimeBonus = latestRecords.reduce(
    (s, r) => s + (r.overtime || 0) + (r.bonus || 0) + (r.commission || 0) + (r.otherIncome || 0),
    0
  );
  const sumTaxBpjs = latestRecords.reduce((s, r) => s + (r.bpjs || 0) + (r.tax || 0), 0);

  const payrollCompositionCircles: CircleSlicePoint[] = [
    { name: 'Gaji Pokok', value: sumBasic, color: '#2563EB', formattedValue: formatCompactRupiah(sumBasic) },
    { name: 'Tunjangan', value: sumAllowances, color: '#0D9488', formattedValue: formatCompactRupiah(sumAllowances) },
    { name: 'Lembur & Bonus', value: sumOvertimeBonus, color: '#D97706', formattedValue: formatCompactRupiah(sumOvertimeBonus) },
    { name: 'BPJS & PPh 21', value: sumTaxBpjs, color: '#E11D48', formattedValue: formatCompactRupiah(sumTaxBpjs) },
  ].filter((item) => item.value > 0);

  // KPI Average
  const avgKpiScore = kpiResults.length > 0
    ? Math.round(kpiResults.reduce((s, k) => s + (k.score || 0), 0) / kpiResults.length)
    : 0;

  // Leaves & shift requests
  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;
  const pendingShiftRequestsCount =
    extraShifts.filter((s) => s.status === 'Pending').length +
    shiftSwaps.filter((s) => s.status === 'Pending').length;

  // Recruitment & Legal
  const openVacanciesCount = vacancies.filter((v) => v.status === 'Aktif').length;

  // General Affairs calculations
  const totalAssetsCount = assets.length;
  const totalAssetValue = assets.reduce((s, a) => s + (a.currentValue || a.purchaseCost || 0), 0);
  const assetsInUseCount = assets.filter((a) => a.status === 'DIPAKAI_KARYAWAN').length;
  const assetsDamagedOrServiceCount = assets.filter(
    (a) => a.status === 'SEDANG_SERVIS' || a.status === 'RUSAK'
  ).length;
  const healthyAssetsCount = assets.filter(
    (a) => a.condition === 'SANGAT_BAIK' || a.condition === 'BAIK'
  ).length;

  const lowStockSupplies = supplies.filter((s) => s.currentStock <= s.minStockLevel);
  const healthySuppliesCount = supplies.length - lowStockSupplies.length;
  const pendingPRCount = purchaseRequests.filter(
    (pr) => pr.status === 'MENUNGGU_APPROVAL' || pr.status === 'DRAFT'
  ).length;
  const openTicketsCount = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS'
  ).length;
  const urgentTicketsCount = tickets.filter(
    (t) => (t.status === 'OPEN' || t.status === 'IN_PROGRESS') && (t.priority === 'HIGH' || t.priority === 'EMERGENCY')
  ).length;
  const resolvedTicketsCount = tickets.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'CLOSED'
  ).length;
  const scheduledMaintenanceCount = maintenanceSchedules.filter(
    (m) => m.status === 'TERJADWAL' || m.status === 'DALAM_PROSES'
  ).length;
  const todayBookingsCount = roomBookings.filter(
    (b) => b.date === todayStr && b.status !== 'CANCELLED'
  ).length;
  const activeVendorsCount = vendors.filter((v) => v.contractStatus === 'AKTIF').length;
  const expiringPermitsCount = permits.filter(
    (p) => p.status === 'PERLU_PERPANJANGAN' || p.status === 'KADALUWARSA'
  ).length;
  const validPermitsCount = permits.filter((p) => p.status === 'BERLAKU').length;
  const activeVisitorsCount = guests.filter((g) => g.status === 'CHECKED_IN').length;

  // Compliance: NPWP + BPJS completeness across employees
  const compliantTaxBpjsCount = employees.filter(
    (e) =>
      Boolean(e.npwp || e.taxProfile?.npwp) &&
      Boolean(e.bpjsKesehatan || e.bpjsKesehatanProfile?.participantNumber) &&
      Boolean(e.bpjsKetenagakerjaan || e.bpjsKetenagakerjaanProfile?.kpjNumber)
  ).length;
  const complianceRate = employeesCount > 0
    ? Math.round((compliantTaxBpjsCount / employeesCount) * 100)
    : 0;

  // On-time ratio among logs30
  const onTimeLogs30 = logs30.filter((a) => a.status === 'Present' || a.status === 'WFH').length;
  const punctualityRate = logs30PresentOrLate > 0
    ? Math.round((onTimeLogs30 / logs30PresentOrLate) * 100)
    : attendance30dRate;

  // GA Readiness rates
  const assetHealthRate = totalAssetsCount > 0 ? Math.round((healthyAssetsCount / totalAssetsCount) * 100) : 0;
  const supplyHealthRate = supplies.length > 0 ? Math.round((healthySuppliesCount / supplies.length) * 100) : 0;
  const ticketResolutionRate = tickets.length > 0 ? Math.round((resolvedTicketsCount / tickets.length) * 100) : 100;
  const vendorActiveRate = vendors.length > 0 ? Math.round((activeVendorsCount / vendors.length) * 100) : 0;
  const permitValidityRate = permits.length > 0 ? Math.round((validPermitsCount / permits.length) * 100) : 0;

  const gaCompositeReadiness = totalAssetsCount + supplies.length + permits.length > 0
    ? Math.round(
        [assetHealthRate, supplyHealthRate, permitValidityRate].reduce((a, b) => a + b, 0) / 3
      )
    : 0;

  // Pentagon 1: 5 Pilar Organisasi (HR & GA)
  const orgPentagon: PentagonAxisPoint[] = [
    {
      subject: 'Kehadiran',
      score: attendance30dRate,
      target: 95,
      detail: `${attendance30dRate}% hadir 30 hari (${punctualityRate}% tepat waktu)`,
    },
    {
      subject: 'Kinerja KPI',
      score: avgKpiScore,
      target: 85,
      detail: kpiResults.length > 0 ? `Rata-rata ${avgKpiScore}/100 (${kpiResults.length} penilaian)` : 'Belum ada penilaian KPI',
    },
    {
      subject: 'Kepatuhan BPJS/Pajak',
      score: complianceRate,
      target: 100,
      detail: `${compliantTaxBpjsCount}/${employeesCount} karyawan lengkap NPWP & BPJS`,
    },
    {
      subject: 'Kesiapan Aset GA',
      score: gaCompositeReadiness,
      target: 90,
      detail: `${healthyAssetsCount}/${totalAssetsCount} aset baik · ${healthySuppliesCount}/${supplies.length} stok ATK aman`,
    },
    {
      subject: 'Legal & Perizinan',
      score: permits.length > 0 ? permitValidityRate : (contracts.length > 0 ? 100 : 0),
      target: 100,
      detail: `${validPermitsCount}/${permits.length} izin berlaku · ${contracts.length} kontrak`,
    },
  ];

  // Pentagon 2: 5 Pilar Operasional GA
  const gaPentagon: PentagonAxisPoint[] = [
    {
      subject: 'Kondisi Aset',
      score: assetHealthRate,
      target: 90,
      detail: `${healthyAssetsCount} dari ${totalAssetsCount} aset kondisi baik`,
    },
    {
      subject: 'Ketersediaan ATK',
      score: supplyHealthRate,
      target: 90,
      detail: `${healthySuppliesCount} dari ${supplies.length} item di atas minimum`,
    },
    {
      subject: 'Penyelesaian Tiket',
      score: tickets.length > 0 ? ticketResolutionRate : 0,
      target: 85,
      detail: `${resolvedTicketsCount} selesai · ${openTicketsCount} terbuka`,
    },
    {
      subject: 'Vendor Aktif',
      score: vendorActiveRate,
      target: 90,
      detail: `${activeVendorsCount} dari ${vendors.length} kontrak vendor aktif`,
    },
    {
      subject: 'Kepatuhan Izin',
      score: permitValidityRate,
      target: 100,
      detail: `${validPermitsCount} berlaku · ${expiringPermitsCount} perlu perpanjangan`,
    },
  ];

  // Circle 1A: Employees by Department
  const deptCounts = new Map<string, number>();
  employees.forEach((emp) => {
    const label = deptNameMap.get(emp.departmentId) || emp.departmentId || 'Lainnya';
    deptCounts.set(label, (deptCounts.get(label) || 0) + 1);
  });
  const deptCircles: CircleSlicePoint[] = Array.from(deptCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], idx) => ({
      name,
      value,
      color: CHART_PALETTE[idx % CHART_PALETTE.length],
    }));

  // Circle 1B: Employees by Contract Type
  const contractCounts = new Map<string, number>();
  employees.forEach((emp) => {
    const key = CONTRACT_TYPE_LABELS[emp.contractType] || emp.contractType || 'Lainnya';
    contractCounts.set(key, (contractCounts.get(key) || 0) + 1);
  });
  const contractCircles: CircleSlicePoint[] = Array.from(contractCounts.entries()).map(([name, value], idx) => ({
    name,
    value,
    color: CHART_PALETTE[idx % CHART_PALETTE.length],
  }));

  // Circle 1C: Employees by Status
  const statusCounts = new Map<string, number>();
  employees.forEach((emp) => {
    const key = EMPLOYEE_STATUS_LABELS[emp.status] || emp.status || 'Lainnya';
    statusCounts.set(key, (statusCounts.get(key) || 0) + 1);
  });
  const statusCircles: CircleSlicePoint[] = Array.from(statusCounts.entries()).map(([name, value], idx) => ({
    name,
    value,
    color: CHART_PALETTE[idx % CHART_PALETTE.length],
  }));

  // Circle 3A: GA Assets by Category (value-based)
  const assetCatValues = new Map<string, number>();
  assets.forEach((a) => {
    const label = ASSET_CATEGORY_LABELS[a.category] || a.category;
    assetCatValues.set(label, (assetCatValues.get(label) || 0) + (a.currentValue || a.purchaseCost || 0));
  });
  const assetCategoryCircles: CircleSlicePoint[] = Array.from(assetCatValues.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], idx) => ({
      name,
      value,
      color: CHART_PALETTE[idx % CHART_PALETTE.length],
      formattedValue: formatCompactRupiah(value),
    }));

  // Circle 3B: GA Assets by Condition (count-based)
  const assetCondCounts = new Map<string, number>();
  assets.forEach((a) => {
    const label = ASSET_CONDITION_LABELS[a.condition] || a.condition;
    assetCondCounts.set(label, (assetCondCounts.get(label) || 0) + 1);
  });
  const assetConditionCircles: CircleSlicePoint[] = Array.from(assetCondCounts.entries()).map(([name, value], idx) => ({
    name,
    value,
    color: ['#059669', '#2563EB', '#D97706', '#E11D48'][idx % 4],
  }));

  // Circle 3C: GA Supplies Stock Health
  const supplyHealthCircles: CircleSlicePoint[] = supplies.length > 0
    ? [
        { name: 'Stok Aman', value: healthySuppliesCount, color: '#059669' },
        { name: 'Stok Menipis', value: lowStockSupplies.length, color: '#E11D48' },
      ].filter((x) => x.value > 0)
    : [];

  // Department Bar Chart (Headcount, Avg Salary Millions, Avg KPI, Attendance Rate)
  const empDeptMap = new Map<string, string>();
  employees.forEach((e) => {
    empDeptMap.set(e.id, deptNameMap.get(e.departmentId) || e.departmentId || 'Lainnya');
  });

  const deptGroup = new Map<string, {
    employees: typeof employees;
    kpiScores: number[];
    attPresent: number;
    attTotal: number;
  }>();

  employees.forEach((emp) => {
    const dName = deptNameMap.get(emp.departmentId) || emp.departmentId || 'Lainnya';
    if (!deptGroup.has(dName)) {
      deptGroup.set(dName, { employees: [], kpiScores: [], attPresent: 0, attTotal: 0 });
    }
    deptGroup.get(dName)!.employees.push(emp);
  });

  kpiResults.forEach((k) => {
    const dName = empDeptMap.get(k.employeeId);
    if (dName && deptGroup.has(dName)) {
      deptGroup.get(dName)!.kpiScores.push(k.score || 0);
    }
  });

  logs30.forEach((a) => {
    if (a.status === 'Holiday') return;
    const dName = empDeptMap.get(a.employeeId);
    if (dName && deptGroup.has(dName)) {
      const grp = deptGroup.get(dName)!;
      grp.attTotal += 1;
      if (a.status === 'Present' || a.status === 'Late' || a.status === 'WFH') {
        grp.attPresent += 1;
      }
    }
  });

  const departmentBars: DepartmentBarPoint[] = Array.from(deptGroup.entries())
    .sort((a, b) => b[1].employees.length - a[1].employees.length)
    .slice(0, 8)
    .map(([name, grp]) => {
      const avgSal = grp.employees.length > 0
        ? grp.employees.reduce((s, e) => s + (e.basicSalary || 0), 0) / grp.employees.length
        : 0;
      const avgKpi = grp.kpiScores.length > 0
        ? Math.round(grp.kpiScores.reduce((s, v) => s + v, 0) / grp.kpiScores.length)
        : 0;
      const hadirRate = grp.attTotal > 0 ? Math.round((grp.attPresent / grp.attTotal) * 100) : 0;
      return {
        name,
        karyawan: grp.employees.length,
        avgSalaryMillions: Number((avgSal / 1_000_000).toFixed(1)),
        avgKpi,
        hadirRate,
      };
    });

  return {
    employeesCount,
    activeEmployees,
    probationEmployees,
    contractEmployees,
    permanentEmployees,
    todayAttendanceCount,
    todayPresentRate,
    attendance30dRate,
    latestPayrollTotalNet,
    latestPayrollTotalGross,
    latestPayrollLabel,
    payrollCount: payrollRecords.length,
    avgKpiScore,
    kpiEvaluatedCount: kpiResults.length,
    pendingLeavesCount,
    pendingShiftRequestsCount,
    openVacanciesCount,
    totalCandidates,
    contractsCount: contracts.length,
    lettersCount: letters.length,
    totalAssetsCount,
    totalAssetValue,
    assetsInUseCount,
    assetsDamagedOrServiceCount,
    suppliesCount: supplies.length,
    lowStockSupplies,
    pendingPRCount,
    openTicketsCount,
    urgentTicketsCount,
    scheduledMaintenanceCount,
    todayBookingsCount,
    activeVendorsCount,
    permitsCount: permits.length,
    expiringPermitsCount,
    activeVisitorsCount,
    totalMailsCount: mails.length,
    attendanceTrend14,
    attendanceTrend30,
    payrollTrend,
    orgPentagon,
    gaPentagon,
    deptCircles,
    contractCircles,
    statusCircles,
    payrollCompositionCircles,
    assetCategoryCircles,
    assetConditionCircles,
    supplyHealthCircles,
    departmentBars,
  };
}
