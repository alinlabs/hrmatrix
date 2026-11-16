import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Building2, Calculator, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DesktopHeaderActions } from '../../context/mobile-nav-context';
import { useCompany } from '../../context/company-context';
import { useAppModulesConfig } from '../../services/module-config-service';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import { RouteLoadingIndicator } from '../../components/ui/route-loading-indicator';
import emptyDashboardAnimation from '../../assets/animations/empty-dashboard.json';
import { GAStorage } from '../ga/storage-ga';
import { getStoredVacancies, getStoredCandidates } from '../lowongan/storage-helper';
import type { ContractDocument } from '../kontrak/types';
import type { OfficialLetterDocument } from '../surat/types';

import { computeDashboardMetrics, formatCompactRupiah } from './utils-data-dashboard';
import { StatsSummary } from './ringkasan-statistik';
import { AttendanceLineTrendCard, PayrollLineTrendCard } from './grafik-tren-dashboard';
import { PentagonRadarCard } from './grafik-pentagon-dashboard';
import { CircleDistributionSection } from './grafik-lingkaran-dashboard';
import {
  DepartmentAnalysisBarCard,
  OperationsCommandSection,
} from './section-operasional-dashboard';
import { RecentEmployees } from './karyawan-terbaru';
import { QuickActions } from './aksi-cepat';
import type { DashboardScope } from './types';

function readSafeContracts(): ContractDocument[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem('hr_matrix_saved_contracts_v1');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readSafeLetters(): OfficialLetterDocument[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem('hrmatrix_saved_official_letters');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readExternalSnapshot() {
  const assets = GAStorage.getAssets();
  const supplies = GAStorage.getSupplies();
  const purchaseRequests = GAStorage.getPurchaseRequests();
  const maintenanceSchedules = GAStorage.getMaintenanceSchedules();
  const roomBookings = GAStorage.getRoomBookings();
  const tickets = GAStorage.getMaintenanceTickets();
  const vendors = GAStorage.getVendors();
  const permits = GAStorage.getPermits();
  const guests = GAStorage.getGuests();
  const mails = GAStorage.getMails();

  const vacancies = getStoredVacancies();
  let totalCandidates = 0;
  let hiredCandidates = 0;
  vacancies.forEach((v) => {
    const candidates = getStoredCandidates(v.id);
    totalCandidates += candidates.length;
    hiredCandidates += candidates.filter((c) => c.status === 'Scored').length;
  });

  const contracts = readSafeContracts();
  const letters = readSafeLetters();

  return {
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
    hiredCandidates,
    contracts,
    letters,
  };
}

export function Dashboard() {
  const navigate = useNavigate();
  const { company } = useCompany();
  const { config: modulesConfig } = useAppModulesConfig();
  const enableGeneralAffairs = modulesConfig.enableGeneralAffairs;
  const enableRecruitment = modulesConfig.enableRecruitment;

  const [scope, setScope] = useState<DashboardScope>('all');
  const [externalData, setExternalData] = useState(() => readExternalSnapshot());

  const refreshExternal = useCallback(() => {
    setExternalData(readExternalSnapshot());
  }, []);

  useEffect(() => {
    window.addEventListener('hrmatrix_ga_update', refreshExternal);
    window.addEventListener('storage', refreshExternal);
    window.addEventListener('focus', refreshExternal);
    return () => {
      window.removeEventListener('hrmatrix_ga_update', refreshExternal);
      window.removeEventListener('storage', refreshExternal);
      window.removeEventListener('focus', refreshExternal);
    };
  }, [refreshExternal]);

  useEffect(() => {
    if (!enableGeneralAffairs && scope === 'ga') {
      setScope('all');
    }
  }, [enableGeneralAffairs, scope]);

  const dexieData = useLiveQuery(async () => {
    const [
      employees,
      departments,
      attendance,
      payrollPeriods,
      payrollRecords,
      leaves,
      kpiPeriods,
      kpiResults,
      extraShifts,
      shiftSwaps,
    ] = await Promise.all([
      db.employees.toArray(),
      db.departments.toArray(),
      db.attendance.toArray(),
      db.payrollPeriods.toArray(),
      db.payrollRecords.toArray(),
      db.leaves.toArray(),
      db.kpiPeriods.toArray(),
      db.kpiResults.toArray(),
      db.extraShifts.toArray(),
      db.shiftSwaps.toArray(),
    ]);

    return {
      employees,
      departments,
      attendance,
      payrollPeriods,
      payrollRecords,
      leaves,
      kpiPeriods,
      kpiResults,
      extraShifts,
      shiftSwaps,
    };
  }, []);

  const recentEmployeesList = useMemo(() => {
    if (!dexieData) return [];
    return [...dexieData.employees].reverse().slice(0, 5);
  }, [dexieData]);

  const metrics = useMemo(() => {
    if (!dexieData) return null;
    return computeDashboardMetrics({
      ...dexieData,
      ...externalData,
    });
  }, [dexieData, externalData]);

  if (!dexieData || !metrics) {
    return <RouteLoadingIndicator showDelayMs={150} />;
  }

  const hasAnyGaData =
    metrics.totalAssetsCount > 0 ||
    metrics.suppliesCount > 0 ||
    metrics.openTicketsCount > 0 ||
    metrics.activeVendorsCount > 0 ||
    metrics.permitsCount > 0;

  const isCompletelyEmpty = metrics.employeesCount === 0 && !hasAnyGaData;
  const effectiveScope: DashboardScope = enableGeneralAffairs ? scope : 'hr';

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 sm:space-y-5">
      <DesktopHeaderActions>
        <Link
          to="/employees"
          className="inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Karyawan
        </Link>
        <Link
          to="/payroll"
          className="inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 h-8 px-3 border border-slate-200"
        >
          <Calculator className="w-3.5 h-3.5 mr-1" /> Payroll
        </Link>
        {enableGeneralAffairs && (
          <Link
            to="/ga"
            className="inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 h-8 px-3 border border-slate-200"
          >
            <Building2 className="w-3.5 h-3.5 mr-1" /> General Affairs
          </Link>
        )}
      </DesktopHeaderActions>

      {isCompletelyEmpty ? (
        <InitialEmptyCard
          title="Ayo, Mulai Bangun Team Hebat!"
          description="Tambahkan karyawan pertama Anda atau kelola inventaris General Affairs untuk membuka seluruh grafik analitik HR & GA."
          buttonText="Tambah Karyawan Pertama"
          ButtonIcon={Plus}
          onAction={() => navigate('/employees')}
          animationData={emptyDashboardAnimation}
        />
      ) : (
        <>
          {/* Scope & Executive Context Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xs">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                {company?.name || 'Ringkasan Eksekutif HR & General Affairs'}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 tabular-nums truncate">
                {metrics.employeesCount} karyawan
                <span className="mx-1.5 text-slate-300">·</span>
                Kehadiran 30H {metrics.attendance30dRate}%
                {enableGeneralAffairs && (
                  <>
                    <span className="mx-1.5 text-slate-300">·</span>
                    {metrics.totalAssetsCount} aset GA ({formatCompactRupiah(metrics.totalAssetValue)})
                  </>
                )}
              </div>
            </div>

            {enableGeneralAffairs && (
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    effectiveScope === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua HR & GA
                </button>
                <button
                  type="button"
                  onClick={() => setScope('hr')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    effectiveScope === 'hr'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SDM & Payroll
                </button>
                <button
                  type="button"
                  onClick={() => setScope('ga')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    effectiveScope === 'ga'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  General Affairs
                </button>
              </div>
            )}
          </div>

          {/* 1. Primary Executive KPI Cards */}
          <StatsSummary
            metrics={metrics}
            scope={effectiveScope}
            enableGeneralAffairs={enableGeneralAffairs}
          />

          {effectiveScope === 'ga' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PentagonRadarCard
                key="ga-pentagon"
                orgPentagon={metrics.orgPentagon}
                gaPentagon={metrics.gaPentagon}
                enableGeneralAffairs={enableGeneralAffairs}
                defaultMode="ga"
              />
              <CircleDistributionSection
                scope="ga"
                enableGeneralAffairs={enableGeneralAffairs}
                employeesCount={metrics.employeesCount}
                deptCircles={metrics.deptCircles}
                contractCircles={metrics.contractCircles}
                statusCircles={metrics.statusCircles}
                payrollCompositionCircles={metrics.payrollCompositionCircles}
                latestPayrollTotalGross={metrics.latestPayrollTotalGross}
                latestPayrollLabel={metrics.latestPayrollLabel}
                assetCategoryCircles={metrics.assetCategoryCircles}
                assetConditionCircles={metrics.assetConditionCircles}
                supplyHealthCircles={metrics.supplyHealthCircles}
                totalAssetsCount={metrics.totalAssetsCount}
                totalAssetValue={metrics.totalAssetValue}
                suppliesCount={metrics.suppliesCount}
              />
            </div>
          ) : (
            <>
              {/* 2. Row 1: Line/Area Attendance Trend + 5-Axis Pentagon Radar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                  <AttendanceLineTrendCard
                    trend14={metrics.attendanceTrend14}
                    trend30={metrics.attendanceTrend30}
                    attendance30dRate={metrics.attendance30dRate}
                    todayAttendanceCount={metrics.todayAttendanceCount}
                    activeEmployees={metrics.activeEmployees}
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col">
                  <PentagonRadarCard
                    key={effectiveScope}
                    orgPentagon={metrics.orgPentagon}
                    gaPentagon={metrics.gaPentagon}
                    enableGeneralAffairs={enableGeneralAffairs}
                    defaultMode="org"
                  />
                </div>
              </div>

              {/* 3. Row 2: Monthly Payroll Multi-Line Chart + Department Bar Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PayrollLineTrendCard
                  payrollTrend={metrics.payrollTrend}
                  latestPayrollTotalNet={metrics.latestPayrollTotalNet}
                  latestPayrollTotalGross={metrics.latestPayrollTotalGross}
                  latestPayrollLabel={metrics.latestPayrollLabel}
                />
                <DepartmentAnalysisBarCard departmentBars={metrics.departmentBars} />
              </div>

              {/* 4. Row 3: Circle / Donut Distribution Charts */}
              <CircleDistributionSection
                scope={effectiveScope}
                enableGeneralAffairs={enableGeneralAffairs}
                employeesCount={metrics.employeesCount}
                deptCircles={metrics.deptCircles}
                contractCircles={metrics.contractCircles}
                statusCircles={metrics.statusCircles}
                payrollCompositionCircles={metrics.payrollCompositionCircles}
                latestPayrollTotalGross={metrics.latestPayrollTotalGross}
                latestPayrollLabel={metrics.latestPayrollLabel}
                assetCategoryCircles={metrics.assetCategoryCircles}
                assetConditionCircles={metrics.assetConditionCircles}
                supplyHealthCircles={metrics.supplyHealthCircles}
                totalAssetsCount={metrics.totalAssetsCount}
                totalAssetValue={metrics.totalAssetValue}
                suppliesCount={metrics.suppliesCount}
              />
            </>
          )}

          {/* 5. Row 4: HR & General Affairs Operational Command Feeds */}
          <OperationsCommandSection
            metrics={metrics}
            scope={effectiveScope}
            enableGeneralAffairs={enableGeneralAffairs}
            enableRecruitment={enableRecruitment}
          />

          {/* 6. Row 5: Recent Employees & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RecentEmployees employees={recentEmployeesList} />
            <QuickActions
              enableGeneralAffairs={enableGeneralAffairs}
              enableRecruitment={enableRecruitment}
            />
          </div>
        </>
      )}
    </div>
  );
}
