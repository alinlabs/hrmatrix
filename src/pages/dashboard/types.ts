import type {
  Employee,
  Department,
  Attendance,
  PayrollPeriod,
  PayrollRecord,
  Leave,
  KPIPeriod,
  KPIResult,
  ExtraShift,
  ShiftSwap,
} from '../../types';
import type {
  OfficeAsset,
  OfficeSupplyItem,
  PurchaseRequest,
  FacilityMaintenanceSchedule,
  RoomBooking,
  MaintenanceTicket,
  GAVendor,
  OfficePermit,
  GuestVisitorLog,
  OfficeMailLog,
} from '../ga/types';
import type { VacancyItem } from '../lowongan/types';
import type { ContractDocument } from '../kontrak/types';
import type { OfficialLetterDocument } from '../surat/types';

export type DashboardScope = 'all' | 'hr' | 'ga';

export interface DashboardRawData {
  employees: Employee[];
  departments: Department[];
  attendance: Attendance[];
  payrollPeriods: PayrollPeriod[];
  payrollRecords: PayrollRecord[];
  leaves: Leave[];
  kpiPeriods: KPIPeriod[];
  kpiResults: KPIResult[];
  extraShifts: ExtraShift[];
  shiftSwaps: ShiftSwap[];
  // General Affairs
  assets: OfficeAsset[];
  supplies: OfficeSupplyItem[];
  purchaseRequests: PurchaseRequest[];
  maintenanceSchedules: FacilityMaintenanceSchedule[];
  roomBookings: RoomBooking[];
  tickets: MaintenanceTicket[];
  vendors: GAVendor[];
  permits: OfficePermit[];
  guests: GuestVisitorLog[];
  mails: OfficeMailLog[];
  // Recruitment & Legal Docs
  vacancies: VacancyItem[];
  totalCandidates: number;
  hiredCandidates: number;
  contracts: ContractDocument[];
  letters: OfficialLetterDocument[];
}

export interface AttendanceTrendPoint {
  date: string;
  label: string;
  hadir: number;
  terlambat: number;
  izinCuti: number;
  alpa: number;
  tingkatHadir: number;
}

export interface PayrollTrendPoint {
  periodId: string;
  label: string;
  grossMillions: number;
  netMillions: number;
  deductionMillions: number;
  grossRaw: number;
  netRaw: number;
  deductionRaw: number;
  headcount: number;
}

export interface PentagonAxisPoint {
  subject: string;
  score: number;
  target: number;
  detail: string;
}

export interface CircleSlicePoint {
  name: string;
  value: number;
  color: string;
  formattedValue?: string;
}

export interface DepartmentBarPoint {
  name: string;
  karyawan: number;
  avgSalaryMillions: number;
  avgKpi: number;
  hadirRate: number;
}

export interface DashboardMetricsSummary {
  // Primary HR
  employeesCount: number;
  activeEmployees: number;
  probationEmployees: number;
  contractEmployees: number;
  permanentEmployees: number;
  todayAttendanceCount: number;
  todayPresentRate: number;
  attendance30dRate: number;
  latestPayrollTotalNet: number;
  latestPayrollTotalGross: number;
  latestPayrollLabel: string;
  payrollCount: number;
  avgKpiScore: number;
  kpiEvaluatedCount: number;
  // Operational HR
  pendingLeavesCount: number;
  pendingShiftRequestsCount: number;
  openVacanciesCount: number;
  totalCandidates: number;
  contractsCount: number;
  lettersCount: number;
  // General Affairs
  totalAssetsCount: number;
  totalAssetValue: number;
  assetsInUseCount: number;
  assetsDamagedOrServiceCount: number;
  suppliesCount: number;
  lowStockSupplies: OfficeSupplyItem[];
  pendingPRCount: number;
  openTicketsCount: number;
  urgentTicketsCount: number;
  scheduledMaintenanceCount: number;
  todayBookingsCount: number;
  activeVendorsCount: number;
  permitsCount: number;
  expiringPermitsCount: number;
  activeVisitorsCount: number;
  totalMailsCount: number;
  // Chart Series
  attendanceTrend14: AttendanceTrendPoint[];
  attendanceTrend30: AttendanceTrendPoint[];
  payrollTrend: PayrollTrendPoint[];
  orgPentagon: PentagonAxisPoint[];
  gaPentagon: PentagonAxisPoint[];
  deptCircles: CircleSlicePoint[];
  contractCircles: CircleSlicePoint[];
  statusCircles: CircleSlicePoint[];
  payrollCompositionCircles: CircleSlicePoint[];
  assetCategoryCircles: CircleSlicePoint[];
  assetConditionCircles: CircleSlicePoint[];
  supplyHealthCircles: CircleSlicePoint[];
  departmentBars: DepartmentBarPoint[];
}
