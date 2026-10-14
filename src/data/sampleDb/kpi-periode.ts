import { KPIPeriod, KPIResult } from '../../types';
import { generateDemoKPI } from './generator-kpi-demo';
import samplePeriodAgustus2026Data, { 
  samplePeriodAgustus2026, 
  sampleResultsAgustus2026 
} from './kpi-periode-agustus-2026';

const initialDemo = generateDemoKPI();

export const allSampleKPIPeriods: KPIPeriod[] = initialDemo.periods;
export const allSampleKPIResults: KPIResult[] = initialDemo.results;

export {
  samplePeriodAgustus2026,
  sampleResultsAgustus2026
};

export default {
  periods: allSampleKPIPeriods,
  results: allSampleKPIResults,
  agustus2026: samplePeriodAgustus2026Data
};

