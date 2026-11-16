import { JobTemplate } from '../../pages/job-desk/types';
import { enrichJobTemplateWithStructuredFields } from '../../pages/job-desk/qualification-options';
import manufaktur from '../jobs/manufaktur';
import rantaiPasok from '../jobs/rantai-pasok';
import logistik from '../jobs/logistik';
import sdm from '../jobs/sdm';
import perkantoran from '../jobs/perkantoran';
import teknologi from '../jobs/teknologi';
import rawEmployees from './karyawan';

/**
 * SAMPLE DATABASE: JOB DESK / DESKRIPSI JABATAN RESMI PERUSAHAAN
 * 
 * Standar regulasi HR & alur pembuatan data:
 * 1. Setiap posisi yang dimiliki karyawan di mode demo (karyawan.ts) di-export
 *    secara otomatis dari template standar resmi (src/data/jobs/*.ts) sehingga
 *    selalu tersedia lengkap pada halaman Job Desk tanpa ada posisi yang kosong.
 * 2. Urutan pertama ditempati oleh posisi utama demo (HR Operations / TPL-SDM-011).
 */
const allCandidateTemplates: JobTemplate[] = [
  ...sdm,
  ...manufaktur,
  ...rantaiPasok,
  ...logistik,
  ...perkantoran,
  ...teknologi,
];

const templateMap = new Map<string, JobTemplate>();
allCandidateTemplates.forEach((tpl) => {
  if (tpl?.id && !templateMap.has(tpl.id)) {
    templateMap.set(tpl.id, tpl);
  }
});

// Ambil daftar positionId unik sesuai urutan karyawan demo (emp-001 / TPL-SDM-011 pertama)
const usedPositionIds: string[] = [];
const seenPos = new Set<string>();
(rawEmployees as Array<{ positionId?: string }>).forEach((emp) => {
  const posId = emp.positionId;
  if (posId && !seenPos.has(posId)) {
    seenPos.add(posId);
    usedPositionIds.push(posId);
  }
});

const rawSampleJobDesks: JobTemplate[] = usedPositionIds
  .map((posId) => templateMap.get(posId))
  .filter((tpl): tpl is JobTemplate => Boolean(tpl));

export const sampleJobDesks: JobTemplate[] = rawSampleJobDesks.map((t) =>
  enrichJobTemplateWithStructuredFields(t)
);

export default sampleJobDesks;
