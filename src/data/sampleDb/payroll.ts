import { PayrollPeriod, PayrollRecord } from '../../types';
import { generateDemoPayroll } from './generator-payroll-demo';
import agustusData, {
  samplePayrollPeriodAgustus2026,
  samplePayrollRecordsAgustus2026
} from './payroll-agustus-2026';

const initialDemo = generateDemoPayroll();

export const allSamplePayrollPeriods: PayrollPeriod[] = initialDemo.periods;
export const allSamplePayrollRecords: PayrollRecord[] = initialDemo.records;

export {
  samplePayrollPeriodAgustus2026,
  samplePayrollRecordsAgustus2026
};

export default {
  periods: allSamplePayrollPeriods,
  records: allSamplePayrollRecords,
  agustus2026: agustusData
};

