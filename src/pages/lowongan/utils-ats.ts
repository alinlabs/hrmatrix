import { JobTemplate } from '../job-desk/types';
import { 
  AtsBreakdown, 
  AtsKeywordCategory, 
  CreateVacancyFormState 
} from './types';

export function formatRupiah(num?: number): string {
  if (!num || isNaN(num)) return 'Rp 0';
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

export function generateAtsBreakdown(
  job: JobTemplate,
  formState: Partial<CreateVacancyFormState>
): AtsBreakdown {
  const companyName = formState.companyName || 'Perusahaan';
  const jobTitle = formState.jobTitle || job.nama;
  const workType = formState.workType || 'Penuh Waktu (Full-Time)';
  const workModel = formState.workModel || 'On-site (WFO)';
  const location = formState.location || 'Jakarta, Indonesia';
  const contactEmail = formState.contactEmail || 'recruitment@perusahaan.co.id';
  const deadline = formState.applicationDeadline || 'Terbuka Hingga Posisi Terisi';

  // 1. Role Summary
  const roleSummary = job.tujuanJabatan 
    ? `${companyName} sedang membuka lowongan posisi ${jobTitle} (${workType} - ${workModel}) untuk unit kerja ${job.departemen || 'Operasional'}. ${job.tujuanJabatan}`
    : `${companyName} mengundang talenta berdedikasi tinggi untuk bergabung sebagai ${jobTitle} guna mendorong akselerasi kinerja dan keunggulan operasional di divisi ${job.divisi || job.departemen || 'Terkait'}.`;

  // 2. Core Responsibilities (Formatted with action verbs)
  const coreResponsibilities = (job.tanggungJawab && job.tanggungJawab.length > 0)
    ? job.tanggungJawab.map(item => item.trim())
    : (job.fungsiUtama && job.fungsiUtama.length > 0)
      ? job.fungsiUtama.map(item => `Melaksanakan dan mengoptimalkan fungsi ${item.trim()}`)
      : [`Menjalankan operasional harian posisi ${jobTitle} secara profesional dan terukur.`];

  // 3. Mandatory Qualifications
  const education = job.kualifikasi?.pendidikan || 'Minimal D3 / S1 dari jurusan yang relevan';
  const experience = job.kualifikasi?.pengalaman || 'Memiliki pengalaman minimal 1-3 tahun di bidang terkait';
  const certifications = job.kualifikasi?.sertifikasi || [];
  const hardSkills = job.kompetensi?.teknis || [];
  const mandatoryDocs = job.dokumenAdministrasi?.wajib || ['CV Lengkap / Resume ATS', 'KTP & NPWP', 'Ijazah & Transkrip'];

  // 4. Preferred Qualifications & Soft Skills
  const softSkills = job.kompetensi?.nonTeknis || ['Komunikasi Efektif', 'Problem Solving', 'Kerja Sama Tim', 'Integritas & Tanggung Jawab'];
  const specialRequirements = job.kualifikasi?.syaratKhusus || [];
  const bonusSkills = job.dokumenAdministrasi?.pendukung || [];

  // 5. ATS Keyword Extraction
  const atsKeywords: AtsKeywordCategory[] = [
    {
      category: 'Hard Skills & Teknis',
      keywords: hardSkills.length > 0 ? hardSkills : [jobTitle, job.departemen || 'Operasional', 'Standard Operating Procedure (SOP)', 'Analisis Data']
    },
    {
      category: 'Soft Skills & Perilaku',
      keywords: softSkills
    },
    {
      category: 'Tools & Metodologi',
      keywords: [
        'Sistem HRIS / ERP',
        'Microsoft Office',
        'Google Workspace',
        'Project Management',
        'Reporting & Dokumentasi'
      ]
    },
    {
      category: 'Administrasi & Sertifikasi',
      keywords: [
        education.includes('S1') ? 'Pendidikan S1' : education.includes('D3') ? 'Pendidikan D3' : 'Pendidikan Formal',
        ...certifications.map(c => c.replace(/\s*\((?:diutamakan|wajib|opsional)\)/gi, '').trim()),
        'Kepatuhan Regulasi'
      ].filter(Boolean)
    }
  ];

  // 6. Benefits & Facilities
  const benefitsAndFacilities: string[] = [];
  if (formState.salaryDisplay && formState.salaryMin && formState.salaryMax) {
    benefitsAndFacilities.push(`Gaji Pokok Kompetitif: ${formatRupiah(formState.salaryMin)} - ${formatRupiah(formState.salaryMax)} / bulan`);
  } else if (job.kompensasi?.gajiPokok) {
    if (formState.salaryDisplay) {
      benefitsAndFacilities.push(`Rentang Gaji Pokok: ${formatRupiah(job.kompensasi.gajiPokok.minimal)} - ${formatRupiah(job.kompensasi.gajiPokok.maksimal)}`);
    } else {
      benefitsAndFacilities.push('Paket Remunerasi & Gaji Pokok Kompetitif (Sesuai Kualifikasi & Standar Perusahaan)');
    }
  }

  if (job.kompensasi?.bpjs && job.kompensasi.bpjs.length > 0) {
    benefitsAndFacilities.push('Jaminan Sosial Lengkap (BPJS Ketenagakerjaan & BPJS Kesehatan)');
  }
  if (job.kompensasi?.tunjangan && job.kompensasi.tunjangan.length > 0) {
    benefitsAndFacilities.push(`Tunjangan Kerja (${job.kompensasi.tunjangan.map(t => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')})`);
  }
  if (job.kompensasi?.fasilitas && job.kompensasi.fasilitas.length > 0) {
    job.kompensasi.fasilitas.forEach(f => benefitsAndFacilities.push(f));
  }
  benefitsAndFacilities.push('Peluang Pengembangan Karir & Evaluasi Kinerja (KPI) Terstruktur');

  // 7. Calculate ATS Score
  const scoreNotes: string[] = [];
  let score = 70; // baseline

  if (jobTitle.length >= 4) {
    score += 5;
    scoreNotes.push('Judul posisi jelas dan standar industri (+5)');
  }
  if (coreResponsibilities.length >= 3) {
    score += 5;
    scoreNotes.push('Rincian tanggung jawab spesifik dan menggunakan kata kerja aktif (+5)');
  }
  if (hardSkills.length >= 3) {
    score += 8;
    scoreNotes.push('Hard skills dan kata kunci teknis terdefinisi kuat (+8)');
  }
  if (education && experience) {
    score += 6;
    scoreNotes.push('Kualifikasi pendidikan dan pengalaman terukur (+6)');
  }
  if (contactEmail && contactEmail.includes('@')) {
    score += 3;
    scoreNotes.push('Alur kontak lamaran valid (+3)');
  }
  if (formState.salaryDisplay) {
    score += 3;
    scoreNotes.push('Transparansi kompensasi meningkatkan engagement pelamar (+3)');
  }

  const finalScore = Math.min(100, Math.max(75, score));

  // 8. Generate Plain Text ATS Format
  const plainTextATS = `LOWONGAN KERJA RESMI (ATS-COMPLIANT FORMAT)
============================================================
POSISI: ${jobTitle.toUpperCase()}
PERUSAHAAN: ${companyName.toUpperCase()}
DEPARTEMEN: ${job.departemen || 'Umum'}
LEVEL JABATAN: ${job.level || 'Staff'}
TIPE PEKERJAAN: ${workType}
MODEL KERJA: ${workModel}
LOKASI: ${location}
BATAS AKHIR LAMARAN: ${deadline}
KONTAK REKRUTMEN: ${contactEmail}
${formState.salaryDisplay && formState.salaryMin ? `RENTANG GAJI: ${formatRupiah(formState.salaryMin)} - ${formatRupiah(formState.salaryMax)}` : ''}

DESKRIPSI PERAN & TUJUAN JABATAN:
------------------------------------------------------------
${roleSummary}

TANGGUNG JAWAB UTAMA:
------------------------------------------------------------
${coreResponsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

KUALIFIKASI WAJIB (HARD REQUIREMENTS):
------------------------------------------------------------
* Pendidikan: ${education}
* Pengalaman Kerja: ${experience}
${certifications.length > 0 ? `* Sertifikasi Wajib: ${certifications.join(', ')}` : ''}
* Keahlian Teknis: ${hardSkills.join(', ')}
* Dokumen Wajib: ${mandatoryDocs.join(', ')}

KUALIFIKASI PILIHAN & SOFT SKILLS:
------------------------------------------------------------
* Soft Skills: ${softSkills.join(', ')}
${specialRequirements.length > 0 ? `* Persyaratan Khusus: ${specialRequirements.join('; ')}` : ''}

BENEFIT & FASILITAS KERJA:
------------------------------------------------------------
${benefitsAndFacilities.map(b => `- ${b}`).join('\n')}

KATA KUNCI ATS (ATS KEYWORDS):
------------------------------------------------------------
${atsKeywords.map(k => `[${k.category}]: ${k.keywords.join(' | ')}`).join('\n')}

CARA MELAMAR:
------------------------------------------------------------
Kirimkan CV terbaru dengan format ATS-friendly ke email ${contactEmail} dengan subjek: [LAMARAN] - ${jobTitle} - [Nama Lengkap Pelamar] sebelum ${deadline}.
`;

  // 9. Generate Markdown for Job Boards (LinkedIn, Glints, Jobstreet)
  const markdownJobBoard = `# 🚀 Lowongan Kerja: ${jobTitle}
**${companyName}** • 📍 ${location} (${workModel}) • 💼 ${workType}

---

### 📋 Tentang Peran Ini
${roleSummary}

### 🎯 Tanggung Jawab Utama
${coreResponsibilities.map(r => `- ${r}`).join('\n')}

### 🎓 Kualifikasi yang Dicari
- **Pendidikan**: ${education}
- **Pengalaman**: ${experience}
${certifications.length > 0 ? `- **Sertifikasi**: ${certifications.join(', ')}\n` : ''}- **Keterampilan Utama**: ${hardSkills.join(', ')}
- **Soft Skills**: ${softSkills.join(', ')}
${specialRequirements.length > 0 ? specialRequirements.map(s => `- ${s}`).join('\n') + '\n' : ''}
### 🎁 Benefit & Fasilitas
${benefitsAndFacilities.map(b => `- ✅ ${b}`).join('\n')}

### 📬 Cara Melamar
Kirimkan CV format ATS Anda ke **${contactEmail}** dengan subjek:
\`[LAMARAN] - ${jobTitle} - [Nama Anda]\`

*Batas Akhir: **${deadline}***
`;

  return {
    atsScore: finalScore,
    atsScoreNotes: scoreNotes,
    roleSummary,
    coreResponsibilities,
    mandatoryQualifications: {
      education,
      experience,
      certifications,
      hardSkills,
      mandatoryDocs,
    },
    preferredQualifications: {
      softSkills,
      specialRequirements,
      bonusSkills,
    },
    atsKeywords,
    benefitsAndFacilities,
    plainTextATS,
    markdownJobBoard,
  };
}
