import sampleJobDesks from './jobdesk';
import rawDepartments from './departemen';

export interface SamplePosition {
  id: string;
  name: string;
  departmentId: string;
  departmentName?: string;
}

/**
 * SAMPLE DATABASE: POSISI / JABATAN RESMI
 * 
 * Terkonfigurasi 1-to-1 secara dinamis dengan Job Desk (src/data/sampleDb/jobdesk.ts)
 * yang berpatokan langsung pada katalog template terstandar (src/data/jobs/*.ts).
 */
export const samplePositions: SamplePosition[] = sampleJobDesks.map(j => {
  const deptMatch = rawDepartments.find(
    d => d.name.toLowerCase() === (j.departemen || '').toLowerCase()
  );

  const departmentId = deptMatch ? deptMatch.id : (j.departemen || 'dept-manufaktur');

  return {
    id: j.id,
    name: j.nama,
    departmentId,
    departmentName: j.departemen || deptMatch?.name || 'Umum'
  };
});

export default samplePositions;
