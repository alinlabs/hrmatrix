import { 
  EducationDegreeLevel, 
  CertificationTypeCategory, 
  SkillProficiencyLevel,
  StructuredEducationConfig,
  StructuredExperienceItem,
  StructuredCertificationItem,
  StructuredSkillItem
} from './types';
import { ComboboxOption } from '../../components/ui';

export const DEGREE_LEVEL_OPTIONS: { value: EducationDegreeLevel; label: string; desc: string }[] = [
  { value: 'SLTA / SMA / SMK', label: 'SLTA / SMA / SMK / Sederajat', desc: 'Sekolah Menengah Atas / Kejuruan / Madrasah Aliyah' },
  { value: 'D1 / D2 / D3', label: 'Diploma I / II / III (D1 / D2 / D3)', desc: 'Pendidikan Vokasi / Ahli Madya' },
  { value: 'S1 / D4', label: 'Sarjana / Diploma IV (S1 / D4)', desc: 'Pendidikan Sarjana Terapan / Strata 1' },
  { value: 'S2', label: 'Magister / Pascasarjana (S2)', desc: 'Pendidikan Strata 2 / Master' },
  { value: 'S3', label: 'Doktor / Ph.D (S3)', desc: 'Pendidikan Strata 3 / Gelar Tertinggi' },
  { value: 'Tanpa Minimal Pendidikan', label: 'Tanpa Minimal Pendidikan (Non-Gelar)', desc: 'Berdasarkan keterampilan & portfolio kerja' },
];

export const STANDARD_MAJORS_COMBOBOX: ComboboxOption[] = [
  { value: 'Teknik Informatika / Ilmu Komputer', label: 'Teknik Informatika / Ilmu Komputer', sublabel: 'Teknologi & Komputer' },
  { value: 'Sistem Informasi / Manajemen Informatika', label: 'Sistem Informasi / Manajemen Informatika', sublabel: 'Teknologi & Komputer' },
  { value: 'Teknik Elektro / Telekomunikasi', label: 'Teknik Elektro / Telekomunikasi', sublabel: 'Teknik & Rekayasa' },
  { value: 'Teknik Sipil / Arsitektur', label: 'Teknik Sipil / Arsitektur', sublabel: 'Teknik & Rekayasa' },
  { value: 'Teknik Mesin / Otomotif', label: 'Teknik Mesin / Otomotif', sublabel: 'Teknik & Rekayasa' },
  { value: 'Teknik Industri', label: 'Teknik Industri', sublabel: 'Teknik & Rekayasa' },
  { value: 'Manajemen / Administrasi Bisnis', label: 'Manajemen / Administrasi Bisnis', sublabel: 'Bisnis & Ekonomi' },
  { value: 'Akuntansi / Keuangan / Perpajakan', label: 'Akuntansi / Keuangan / Perpajakan', sublabel: 'Bisnis & Ekonomi' },
  { value: 'Ekonomi Pembangunan / Perbankan', label: 'Ekonomi Pembangunan / Perbankan', sublabel: 'Bisnis & Ekonomi' },
  { value: 'Psikologi / Manajemen SDM (HR)', label: 'Psikologi / Manajemen SDM (HR)', sublabel: 'Sosial & Humaniora' },
  { value: 'Hukum / Legal Affairs', label: 'Hukum / Legal Affairs', sublabel: 'Sosial & Humaniora' },
  { value: 'Ilmu Komunikasi / Public Relations / Marcom', label: 'Ilmu Komunikasi / Public Relations / Marcom', sublabel: 'Sosial & Humaniora' },
  { value: 'Desain Komunikasi Visual (DKV) / Desain Grafis', label: 'Desain Komunikasi Visual (DKV) / Desain Grafis', sublabel: 'Seni & Kreatif' },
  { value: 'Sastra Inggris / Bahasa Asing / Hubungan Internasional', label: 'Sastra Inggris / Bahasa Asing / Hubungan Internasional', sublabel: 'Sosial & Humaniora' },
  { value: 'Farmasi / Apoteker', label: 'Farmasi / Apoteker', sublabel: 'Kesehatan & Medis' },
  { value: 'Kedokteran / Keperawatan / Kebidanan', label: 'Kedokteran / Keperawatan / Kebidanan', sublabel: 'Kesehatan & Medis' },
  { value: 'Kesehatan Masyarakat / K3 (Keselamatan Kerja)', label: 'Kesehatan Masyarakat / K3 (Keselamatan Kerja)', sublabel: 'Kesehatan & Medis' },
  { value: 'Pendidikan / Keguruan', label: 'Pendidikan / Keguruan', sublabel: 'Pendidikan' },
  { value: 'Semua Jurusan (Terbuka Semua Jurusan Relevan)', label: 'Semua Jurusan (Terbuka Semua Jurusan Relevan)', sublabel: 'Umum' },
];

export const EXPERIENCE_DURATION_OPTIONS: string[] = [
  'Kurang dari 1 Tahun (Fresh Graduate / Entry Level)',
  '1 - 2 Tahun',
  '2 - 3 Tahun',
  '3 - 5 Tahun',
  '5 - 8 Tahun',
  '8 - 10 Tahun',
  'Lebih dari 10 Tahun (Senior Executive)',
];

export const INDUSTRY_SECTOR_OPTIONS: ComboboxOption[] = [
  { value: 'Teknologi Informasi & Perangkat Lunak (IT & Software)', label: 'Teknologi Informasi & Software' },
  { value: 'Ritel, E-Commerce & Perdagangan', label: 'Ritel, E-Commerce & Perdagangan' },
  { value: 'Perbankan, Keuangan, Finansial & Asuransi', label: 'Perbankan, Keuangan & Asuransi' },
  { value: 'Makanan & Minuman (F&B), Restoran & Hospitality', label: 'F&B, Restoran & Hospitality' },
  { value: 'Manufaktur, Pabrikasi & Alat Berat', label: 'Manufaktur & Pabrikasi' },
  { value: 'Properti, Real Estate, Arsitektur & Konstruksi', label: 'Properti, Arsitektur & Konstruksi' },
  { value: 'Logistik, Rantai Pasok, Kurir & Transportasi', label: 'Logistik, Rantai Pasok & Transportasi' },
  { value: 'Kesehatan, Farmasi, Rumah Sakit & Alat Medis', label: 'Kesehatan, Farmasi & Medis' },
  { value: 'Media, Iklan, Agensi Kreatif & Pemasaran', label: 'Media, Agensi Kreatif & Pemasaran' },
  { value: 'Jasa Profesional, Konsultan & Hukum', label: 'Jasa Profesional & Konsultan' },
  { value: 'Energi, Pertambangan, Minyak & Gas (Mining & Oil/Gas)', label: 'Energi, Pertambangan & Migas' },
  { value: 'Pendidikan, Pelatihan & EdTech', label: 'Pendidikan & Pelatihan' },
  { value: 'Otomotif & Transportasi Darat/Laut/Udara', label: 'Otomotif & Transportasi' },
  { value: 'Lembaga Nirlaba, Yayasan & Pemerintahan', label: 'Nirlaba & Pemerintahan' },
];

export const CERTIFICATION_CATEGORY_OPTIONS: { value: CertificationTypeCategory; label: string; desc: string }[] = [
  { value: 'BNSP', label: 'Sertifikasi BNSP', desc: 'Sertifikat Kompetensi Kerja Badan Nasional Sertifikasi Profesi' },
  { value: 'ISO', label: 'Sertifikasi Standar ISO', desc: 'Standardisasi Mutu, K3, Keamanan Informasi ISO' },
  { value: 'Profesional Umum', label: 'Sertifikasi Profesional Industri', desc: 'Lisensi keahlian internasional / nasional (CFA, CHRP, AWS, PMP, dll)' },
  { value: 'Lisensi Resmi / SIM', label: 'Lisensi Resmi / SIM / Surat Izin', desc: 'Surat Izin Mengemudi (SIM A/C/B2), SIA, STR, SIK' },
];

export const SKILL_PROFICIENCY_LEVELS: { value: SkillProficiencyLevel; label: string; color: string; badgeBg: string }[] = [
  { value: 'Dasar', label: 'Dasar (Basic)', color: 'text-slate-600', badgeBg: 'bg-slate-100 border-slate-200 text-slate-700' },
  { value: 'Pemula', label: 'Pemula (Novice)', color: 'text-blue-600', badgeBg: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'Menengah', label: 'Menengah (Intermediate)', color: 'text-indigo-600', badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { value: 'Mahir', label: 'Mahir (Advanced)', color: 'text-purple-600', badgeBg: 'bg-purple-50 border-purple-200 text-purple-700' },
  { value: 'Ahli', label: 'Ahli (Expert / Specialist)', color: 'text-emerald-700', badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' },
];

/**
 * Format summary string for Education Requirement
 */
export function formatEducationSummary(detail?: StructuredEducationConfig): string {
  if (!detail) return '';
  const degree = detail.tingkatPendidikan || 'S1 / D4';
  const majorsStr = detail.jurusan && detail.jurusan.length > 0
    ? ` Jurusan ${detail.jurusan.join(', ')}`
    : '';
  const extra = detail.deskripsiPendidikan ? ` (${detail.deskripsiPendidikan})` : '';
  return `Minimal ${degree}${majorsStr}${extra}`.trim();
}

/**
 * Format summary string for Experience Requirements
 */
export function formatExperienceSummary(items?: StructuredExperienceItem[]): string {
  if (!items || items.length === 0) return '';
  return items.map(exp => {
    const dur = exp.lamaPengalaman || '1 - 2 Tahun';
    const pos = exp.posisi ? `sebagai ${exp.posisi}` : '';
    const ind = exp.bidangIndustri ? `di Industri ${exp.bidangIndustri}` : '';
    return `Pengalaman ${dur} ${pos} ${ind}`.replace(/\s+/g, ' ').trim();
  }).join('; ');
}

/**
 * Format summary list for Certifications
 */
export function formatCertificationSummaryList(items?: StructuredCertificationItem[]): string[] {
  if (!items || items.length === 0) return [];
  return items.map(c => {
    const catBadge = c.jenisSertifikasi ? `[${c.jenisSertifikasi}]` : '';
    const name = c.namaSertifikasi || 'Sertifikasi Keahlian';
    const field = c.bidangSertifikasi ? ` Bidang ${c.bidangSertifikasi}` : '';
    return `${catBadge} ${name}${field}`.trim();
  });
}

/**
 * Format summary list for Skills (Competencies)
 */
export function formatSkillSummaryList(items?: StructuredSkillItem[]): string[] {
  if (!items || items.length === 0) return [];
  return items.map(s => {
    const lvl = s.tingkatKemahiran ? ` [Level: ${s.tingkatKemahiran}]` : '';
    return `${s.namaSkill}${lvl}`;
  });
}

/**
 * Intelligent Enricher: Ensures any JobTemplate (from src/data/jobs/*.ts)
 * has fully structured qualification and competency fields for ATS matching.
 */
export function enrichJobTemplateWithStructuredFields(template: any): any {
  if (!template || !template.kualifikasi) return template;

  const kual = template.kualifikasi;
  const komp = template.kompetensi || { teknis: [], nonTeknis: [] };

  // 1. Enrich Pendidikan
  let detailPendidikan = kual.detailPendidikan;
  if (!detailPendidikan) {
    const rawEdu = (kual.pendidikan || '').toUpperCase();
    let tingkatPendidikan: EducationDegreeLevel = 'S1 / D4';
    if (rawEdu.includes('SLTA') || rawEdu.includes('SMA') || rawEdu.includes('SMK')) {
      tingkatPendidikan = 'SLTA / SMA / SMK';
    } else if (rawEdu.includes('D1') || rawEdu.includes('D2') || rawEdu.includes('D3') || rawEdu.includes('DIPLOMA')) {
      tingkatPendidikan = 'D1 / D2 / D3';
    } else if (rawEdu.includes('S2') || rawEdu.includes('MAGISTER') || rawEdu.includes('MASTER')) {
      tingkatPendidikan = 'S2';
    } else if (rawEdu.includes('S3') || rawEdu.includes('DOKTOR') || rawEdu.includes('PH.D')) {
      tingkatPendidikan = 'S3';
    }

    const jurusanList: string[] = [];
    if (kual.pendidikan) {
      STANDARD_MAJORS_COMBOBOX.forEach(opt => {
        const majorKeyword = opt.value.split('/')[0].trim().toUpperCase();
        if (rawEdu.includes(majorKeyword) && !jurusanList.includes(opt.value)) {
          jurusanList.push(opt.value);
        }
      });
    }
    if (jurusanList.length === 0) {
      jurusanList.push(template.departemen || 'Semua Jurusan (Terbuka Semua Jurusan Relevan)');
    }

    detailPendidikan = {
      tingkatPendidikan,
      jurusan: jurusanList,
      deskripsiPendidikan: kual.pendidikan || `Lulusan ${tingkatPendidikan} terakreditasi`
    };
  }

  // 2. Enrich Pengalaman
  let detailPengalaman = kual.detailPengalaman;
  if (!detailPengalaman || detailPengalaman.length === 0) {
    const rawExp = (kual.pengalaman || '').toUpperCase();
    let lamaPengalaman = '1 - 2 Tahun';
    if (rawExp.includes('10+') || rawExp.includes('10 TAHUN') || rawExp.includes('SENIOR EXECUTIVE')) {
      lamaPengalaman = 'Lebih dari 10 Tahun (Senior Executive)';
    } else if (rawExp.includes('5-8') || rawExp.includes('5 SAMPAI 8') || rawExp.includes('5 TAHUN')) {
      lamaPengalaman = '5 - 8 Tahun';
    } else if (rawExp.includes('3-5') || rawExp.includes('3 SAMPAI 5') || rawExp.includes('3 TAHUN')) {
      lamaPengalaman = '3 - 5 Tahun';
    } else if (rawExp.includes('2-3') || rawExp.includes('2 SAMPAI 3') || rawExp.includes('2 TAHUN')) {
      lamaPengalaman = '2 - 3 Tahun';
    } else if (rawExp.includes('FRESH') || rawExp.includes('ENTRY')) {
      lamaPengalaman = 'Kurang dari 1 Tahun (Fresh Graduate / Entry Level)';
    }

    detailPengalaman = [
      {
        id: `exp-${template.id || 'job'}-1`,
        lamaPengalaman,
        posisi: template.nama || 'Posisi Relevan',
        bidangIndustri: template.kategori || template.departemen || 'Industri Terkait'
      }
    ];
  }

  // 3. Enrich Sertifikasi
  let detailSertifikasi = kual.detailSertifikasi;
  if (!detailSertifikasi && Array.isArray(kual.sertifikasi)) {
    detailSertifikasi = kual.sertifikasi.map((c: string, idx: number) => {
      const upperC = c.toUpperCase();
      let jenisSertifikasi: CertificationTypeCategory = 'Profesional Umum';
      if (upperC.includes('BNSP')) jenisSertifikasi = 'BNSP';
      else if (upperC.includes('ISO')) jenisSertifikasi = 'ISO';
      else if (upperC.includes('SIM') || upperC.includes('LISENSI') || upperC.includes('STR')) jenisSertifikasi = 'Lisensi Resmi / SIM';

      return {
        id: `cert-${template.id || 'job'}-${idx}`,
        jenisSertifikasi,
        namaSertifikasi: c.replace(/\[.*?\]/g, '').trim() || c,
        bidangSertifikasi: template.departemen || 'Spesialisasi Posisi'
      };
    });
  }

  // 4. Enrich Technical Skills
  let detailTeknis = komp.detailTeknis;
  if (!detailTeknis && Array.isArray(komp.teknis)) {
    const isSenior = (template.level || '').toUpperCase().includes('MANAGER') || (template.level || '').toUpperCase().includes('DIRECTOR') || (template.level || '').toUpperCase().includes('SENIOR');
    detailTeknis = komp.teknis.map((t: string, idx: number) => {
      let level: SkillProficiencyLevel = isSenior ? 'Mahir' : 'Menengah';
      if (t.includes('[Level:')) {
        const match = t.match(/\[Level:\s*([^\]]+)\]/);
        if (match && match[1]) {
          level = match[1].trim() as SkillProficiencyLevel;
        }
      }
      return {
        id: `tech-${template.id || 'job'}-${idx}`,
        namaSkill: t.replace(/\[Level:\s*[^\]]+\]/g, '').trim() || t,
        tingkatKemahiran: level,
        kategori: 'Teknis'
      };
    });
  }

  // 5. Enrich Soft Skills
  let detailNonTeknis = komp.detailNonTeknis;
  if (!detailNonTeknis && Array.isArray(komp.nonTeknis)) {
    const isSenior = (template.level || '').toUpperCase().includes('MANAGER') || (template.level || '').toUpperCase().includes('DIRECTOR') || (template.level || '').toUpperCase().includes('SENIOR');
    detailNonTeknis = komp.nonTeknis.map((nt: string, idx: number) => {
      let level: SkillProficiencyLevel = isSenior ? 'Mahir' : 'Menengah';
      if (nt.includes('[Level:')) {
        const match = nt.match(/\[Level:\s*([^\]]+)\]/);
        if (match && match[1]) {
          level = match[1].trim() as SkillProficiencyLevel;
        }
      }
      return {
        id: `nontech-${template.id || 'job'}-${idx}`,
        namaSkill: nt.replace(/\[Level:\s*[^\]]+\]/g, '').trim() || nt,
        tingkatKemahiran: level,
        kategori: 'Non-Teknis'
      };
    });
  }

  // 6. Enrich Waktu Kerja
  let waktuKerja = template.waktuKerja;
  if (!waktuKerja) {
    const isShiftDept = (template.departemen || '').toLowerCase().includes('operasional') || 
                        (template.departemen || '').toLowerCase().includes('produksi') ||
                        (template.departemen || '').toLowerCase().includes('keamanan') ||
                        (template.departemen || '').toLowerCase().includes('medis');
    waktuKerja = {
      polaKerja: isShiftDept ? 'Shift' : 'Non Shift',
      hariKerja: isShiftDept ? '6 Hari' : '5 Hari',
      waktuIstirahatMenit: 60,
      totalJamKerja: 40,
      scheduleType: isShiftDept ? 'SHIFT' : '5_HARI',
      workDays: isShiftDept ? 'Roster Jadwal Shift Bergilir (6 Hari Kerja)' : 'Senin s/d Jumat (5 Hari Kerja per Minggu)',
      workingHours: isShiftDept ? 'Rotasi Shift 8 Jam (Pagi / Siang / Malam)' : '08:30 - 17:30 WIB (8 Jam Kerja Efektif)',
      restHours: '12:00 - 13:00 WIB (60 Menit)',
      totalHoursPerWeek: 40,
      overtimeEligible: true
    };
  } else {
    waktuKerja = {
      ...waktuKerja,
      polaKerja: waktuKerja.polaKerja || (waktuKerja.scheduleType === 'SHIFT' ? 'Shift' : 'Non Shift'),
      hariKerja: waktuKerja.hariKerja || (waktuKerja.scheduleType === '6_HARI' ? '6 Hari' : waktuKerja.scheduleType === 'SHIFT' ? '6 Hari' : '5 Hari'),
      waktuIstirahatMenit: waktuKerja.waktuIstirahatMenit ?? 60,
      totalJamKerja: waktuKerja.totalJamKerja ?? waktuKerja.totalHoursPerWeek ?? 40
    };
  }

  return {
    ...template,
    kualifikasi: {
      ...kual,
      detailPendidikan,
      detailPengalaman,
      detailSertifikasi
    },
    kompetensi: {
      ...komp,
      detailTeknis,
      detailNonTeknis
    },
    waktuKerja
  };
}

