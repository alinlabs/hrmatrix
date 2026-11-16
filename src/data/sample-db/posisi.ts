import { POSITION_INDEX_LITE, LitePositionEntry } from '../jobs/position-index-lite';
import rawDepartments from './departemen';
import rawEmployees from './karyawan';

export interface SamplePosition {
  id: string;
  name: string;
  departmentId: string;
  departmentName?: string;
}

const liteMap = new Map<string, LitePositionEntry>();
POSITION_INDEX_LITE.forEach((entry) => {
  liteMap.set(entry.id, entry);
});

const FALLBACK_DEPT_MAP: Record<string, string> = {
  'sdm department': 'dept-sdm',
  'manufaktur department': 'dept-manufaktur',
  'logistik department': 'dept-logistik',
  'rantai department': 'dept-logistik',
  'perkantoran department': 'dept-perkantoran',
  'teknologi department': 'dept-teknologi',
};

// Ambil urutan unik posisi langsung dari karyawan demo (TPL-SDM-011 / HR Operations di urutan ke-1)
const empPosDeptMap = new Map<string, string>();
const orderedUsedPositionIds: string[] = [];

(rawEmployees as Array<{ positionId?: string; departmentId?: string }>).forEach((emp) => {
  if (emp.positionId && !empPosDeptMap.has(emp.positionId)) {
    empPosDeptMap.set(emp.positionId, emp.departmentId || 'dept-manufaktur');
    orderedUsedPositionIds.push(emp.positionId);
  }
});

/**
 * SAMPLE DATABASE: POSISI / JABATAN RESMI
 * 
 * Terkonfigurasi 1-to-1 secara dinamis dengan Job Desk (src/data/sample-db/jobdesk.ts)
 * dan Karyawan (src/data/sample-db/karyawan.ts) tanpa menarik seluruh payload jobdesk.
 */
export const samplePositions: SamplePosition[] = orderedUsedPositionIds.map((posId) => {
  const j = liteMap.get(posId);
  const empDeptId = empPosDeptMap.get(posId);
  const deptByEmp = rawDepartments.find((d) => d.id === empDeptId);
  const deptByLiteName = j
    ? rawDepartments.find((d) => d.name.toLowerCase() === (j.departemen || '').toLowerCase())
    : undefined;
  const fallbackDeptId = j
    ? FALLBACK_DEPT_MAP[(j.departemen || '').toLowerCase()]
    : undefined;

  const resolvedDeptId = deptByEmp?.id || deptByLiteName?.id || fallbackDeptId || empDeptId || 'dept-manufaktur';
  const resolvedDeptObj = rawDepartments.find((d) => d.id === resolvedDeptId);

  return {
    id: posId,
    name: j?.nama || posId,
    departmentId: resolvedDeptId,
    departmentName: resolvedDeptObj?.name || j?.departemen || 'Umum',
  };
});

export default samplePositions;
