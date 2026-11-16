import { VacancyItem } from '../../pages/lowongan/types';
import { sampleJobDesks } from './jobdesk';
import { generateAtsBreakdown } from '../../pages/lowongan/utils-ats';

export function createSampleVacancies(companyName = 'PT Perusahaan Solusi'): VacancyItem[] {
  const samples: VacancyItem[] = [];
  
  if (sampleJobDesks && sampleJobDesks.length > 0) {
    const targets = [
      sampleJobDesks.find(j => j.id.includes('DIR') || j.id.includes('001')) || sampleJobDesks[0],
      sampleJobDesks.find(j => j.id.includes('TKN') || j.departemen.includes('Teknologi') || j.nama.includes('Engineer')) || sampleJobDesks[1],
      sampleJobDesks.find(j => j.id.includes('SDM') || j.departemen.includes('SDM') || j.nama.includes('Staff')) || sampleJobDesks[2],
    ].filter(Boolean);

    targets.forEach((job, idx) => {
      if (!job) return;
      const salaryMin = job.kompensasi?.gajiPokok?.minimal || 8000000;
      const salaryMax = job.kompensasi?.gajiPokok?.maksimal || 15000000;
      const formState = {
        jobTemplateId: job.id,
        jobTitle: job.nama,
        department: job.departemen,
        division: job.divisi || job.departemen,
        level: job.level,
        companyName,
        location: idx === 0 ? 'Jakarta Pusat' : idx === 1 ? 'Bandung' : 'Jakarta Selatan',
        candidateDomicile: idx === 0 ? 'Jabodetabek' : idx === 1 ? 'Jawa Barat' : 'Terbuka Semua Domisili',
        workType: idx === 2 ? ('Kontrak (PKWT)' as const) : ('Penuh Waktu (Full-Time)' as const),
        workModel: idx === 1 ? ('Hybrid' as const) : ('On-site (WFO)' as const),
        salaryDisplay: true,
        salaryMin,
        salaryMax,
        applicationDeadline: '2026-10-30',
        contactEmail: 'recruitment@perusahaan.co.id',
        status: idx === 2 ? ('Draft' as const) : ('Aktif' as const),
      };

      const breakdown = generateAtsBreakdown(job, formState as any);

      samples.push({
        id: `VAC-${1001 + idx}`,
        jobTemplateId: job.id,
        jobTitle: job.nama,
        department: job.departemen,
        division: job.divisi || job.departemen,
        level: job.level,
        companyName,
        location: formState.location,
        candidateDomicile: formState.candidateDomicile,
        workType: formState.workType,
        workModel: formState.workModel,
        salaryDisplay: true,
        salaryMin,
        salaryMax,
        applicationDeadline: formState.applicationDeadline,
        contactEmail: formState.contactEmail,
        status: formState.status,
        createdAt: new Date(Date.now() - idx * 86400000 * 2).toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        rawJobTemplate: job,
        atsBreakdown: breakdown,
      });
    });
  }

  return samples;
}

export const sampleVacancies: VacancyItem[] = createSampleVacancies();
