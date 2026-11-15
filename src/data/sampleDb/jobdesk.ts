import { JobTemplate } from '../../pages/job-desk/types';
import { enrichJobTemplateWithStructuredFields } from '../../pages/job-desk/qualification-options';
import manufaktur from '../jobs/manufaktur';
import rantaiPasok from '../jobs/rantai-pasok';
import logistik from '../jobs/logistik';
import sdm from '../jobs/sdm';
import perkantoran from '../jobs/perkantoran';
import teknologi from '../jobs/teknologi';

export const presidentDirectorTemplate: JobTemplate = {
  id: 'TPL-DIR-001',
  nama: 'President Director & Chief Executive Officer (CEO)',
  kategori: 'Eksekutif / C-Level',
  departemen: 'Direksi & Eksekutif',
  divisi: 'Direksi',
  level: 'C-Level / Director',
  atasanLangsung: 'Dewan Komisaris & RUPS',
  tujuanJabatan: 'Memimpin visi strategis korporasi, inovasi teknologi sistem informasi, tata kelola perusahaan yang sehat (GCG), dan pertumbuhan bisnis berkelanjutan sebagai pemegang komando eksekutif tertinggi.',
  fungsiUtama: [
    'Kepemimpinan Visi & Strategi Korporasi',
    'Tata Kelola & Akuntabilitas Finansial (GCG)',
    'Inovasi Digital & Transformasi Sistem Terintegrasi',
    'Pengembangan Hubungan Stakeholder & Kemitraan'
  ],
  tanggungJawab: [
    'Menetapkan arah strategis jangka panjang, target tahunan, dan kebijakan umum perusahaan.',
    'Memimpin dan mengarahkan jajaran direksi serta kepala departemen untuk mencapai target kinerja terpadu.',
    'Mendorong inovasi teknologi dan transformasi digital sistem operasional perusahaan secara berkelanjutan.',
    'Menjaga kepatuhan hukum, regulasi ketenagakerjaan, perpajakan, dan transparansi bisnis kepada pemegang saham.'
  ],
  wewenang: [
    'Menetapkan keputusan strategis dan kebijakan tertinggi operasional korporasi.',
    'Mengesahkan anggaran belanja modal (CAPEX), operasional (OPEX), dan struktur skala upah.',
    'Menunjuk dan mengangkat pimpinan departemen serta eksekutif struktural perusahaan.'
  ],
  kpi: [
    {
      id: 'KPI-DIR-001-1',
      nama: 'Pertumbuhan Revenue & Profitabilitas (EBITDA)',
      deskripsi: 'Pencapaian target pertumbuhan pendapatan korporat dan rasio profitabilitas sehat.',
      target: '>= 100%',
      satuan: 'Persentase',
      bobot: 35,
      periode: 'Tahunan',
      caraPengukuran: 'Audit Laporan Keuangan Tahunan'
    },
    {
      id: 'KPI-DIR-001-2',
      nama: 'Sukses Transformasi Digital & Efisiensi Sistem',
      deskripsi: 'Implementasi platform manajemen SDM & operasional modern tanpa downtime kritikal.',
      target: '>= 98%',
      satuan: 'Persentase',
      bobot: 25,
      periode: 'Semesteran',
      caraPengukuran: 'Evaluasi Adopsi Sistem & SLA'
    },
    {
      id: 'KPI-DIR-001-3',
      nama: 'Kepuasan Stakeholder & Retensi Karyawan Kunci',
      deskripsi: 'Indeks kepuasan investor, mitra strategis, dan retensi talenta terbaik perusahaan.',
      target: '>= 92%',
      satuan: 'Persentase',
      bobot: 20,
      periode: 'Tahunan',
      caraPengukuran: 'Survei Kepuasan & Turn Over Rate'
    },
    {
      id: 'KPI-DIR-001-4',
      nama: 'Kepatuhan Regulasi & Zero Legal Violation (GCG)',
      deskripsi: 'Kepatuhan penuh pada hukum ketenagakerjaan, perpajakan, keselamatan, dan tata kelola perusahaan yang baik.',
      target: '100%',
      satuan: 'Kepatuhan',
      bobot: 20,
      periode: 'Tahunan',
      caraPengukuran: 'Audit Hukum & Kepatuhan'
    }
  ],
  kualifikasi: {
    pendidikan: 'Minimal S1 / D4 Jurusan Teknik Informatika / Ilmu Komputer, Sistem Informasi / Manajemen Informatika, Manajemen / Administrasi Bisnis',
    detailPendidikan: {
      tingkatPendidikan: 'S1 / D4',
      jurusan: [
        'Teknik Informatika / Ilmu Komputer',
        'Sistem Informasi / Manajemen Informatika',
        'Manajemen / Administrasi Bisnis'
      ],
      deskripsiPendidikan: 'Lulusan Perguruan Tinggi Negeri atau Swasta Terakreditasi Minimal B'
    },
    pengalaman: 'Pengalaman Lebih dari 10 Tahun (Senior Executive) sebagai President Director / CEO / VP di Industri Teknologi Informasi & Software',
    detailPengalaman: [
      {
        id: 'exp-dir-1',
        lamaPengalaman: 'Lebih dari 10 Tahun (Senior Executive)',
        posisi: 'President Director / Chief Executive Officer / VP Operations',
        bidangIndustri: 'Teknologi Informasi & Perangkat Lunak (IT & Software)'
      }
    ],
    sertifikasi: [
      '[BNSP] Certified Professional Director Bidang Executive Leadership',
      '[ISO] Digital Transformation & Enterprise Architecture Management'
    ],
    detailSertifikasi: [
      {
        id: 'cert-dir-1',
        jenisSertifikasi: 'BNSP',
        namaSertifikasi: 'Certified Professional Director',
        bidangSertifikasi: 'Executive Leadership'
      },
      {
        id: 'cert-dir-2',
        jenisSertifikasi: 'ISO',
        namaSertifikasi: 'Digital Transformation & Enterprise Architecture',
        bidangSertifikasi: 'Teknologi Informasi'
      }
    ],
    syaratKhusus: [
      'Memiliki rekam jejak teruji dalam kepemimpinan organisasi dan penciptaan inovasi sistem berbasis web.'
    ]
  },
  kompetensi: {
    teknis: [
      'Strategic Corporate Planning [Level: Ahli]',
      'Enterprise System Architecture [Level: Ahli]',
      'Financial & Business Acumen [Level: Mahir]',
      'Regulatory & Compliance Oversight [Level: Mahir]'
    ],
    detailTeknis: [
      { id: 'tech-dir-1', namaSkill: 'Strategic Corporate Planning', tingkatKemahiran: 'Ahli', kategori: 'Teknis' },
      { id: 'tech-dir-2', namaSkill: 'Enterprise System Architecture', tingkatKemahiran: 'Ahli', kategori: 'Teknis' },
      { id: 'tech-dir-3', namaSkill: 'Financial & Business Acumen', tingkatKemahiran: 'Mahir', kategori: 'Teknis' },
      { id: 'tech-dir-4', namaSkill: 'Regulatory & Compliance Oversight', tingkatKemahiran: 'Mahir', kategori: 'Teknis' }
    ],
    nonTeknis: [
      'Visionary Leadership [Level: Ahli]',
      'High-Stakes Decision Making [Level: Ahli]',
      'Strategic Communication [Level: Mahir]',
      'Inspirational Mentorship [Level: Mahir]'
    ],
    detailNonTeknis: [
      { id: 'nontech-dir-1', namaSkill: 'Visionary Leadership', tingkatKemahiran: 'Ahli', kategori: 'Non-Teknis' },
      { id: 'nontech-dir-2', namaSkill: 'High-Stakes Decision Making', tingkatKemahiran: 'Ahli', kategori: 'Non-Teknis' },
      { id: 'nontech-dir-3', namaSkill: 'Strategic Communication', tingkatKemahiran: 'Mahir', kategori: 'Non-Teknis' },
      { id: 'nontech-dir-4', namaSkill: 'Inspirational Mentorship', tingkatKemahiran: 'Mahir', kategori: 'Non-Teknis' }
    ]
  },
  hubunganKerja: {
    internal: [
      'Dewan Komisaris & RUPS',
      'Jajaran Direktur & Kepala Divisi',
      'Seluruh Karyawan'
    ],
    eksternal: [
      'Pemegang Saham & Investor',
      'Regulator Pemerintah',
      'Mitra Perbankan & Asosiasi Industri'
    ]
  },
  outputDiharapkan: [
    'Arah korporat dan keberlanjutan bisnis terencana dengan presisi.',
    'Peningkatan produktivitas berkat otomatisasi sistem informasi internal.',
    'Budaya kerja yang berdaya saing tinggi dan berintegritas.'
  ],
  kompensasi: {
    gajiPokok: {
      minimal: 80000000,
      standar: 120000000,
      maksimal: 180000000
    },
    tunjangan: [
      'tunjangan_jabatan',
      'tunjangan_transportasi',
      'tunjangan_komunikasi'
    ],
    bpjs: [
      'rule_bpjs_kes_1',
      'rule_jht_1',
      'rule_jp_1',
      'rule_jkk_1',
      'rule_jkm_1'
    ],
    pajak: [
      'rule_pph21_ter'
    ],
    pajakRuleId: 'rule_pph21_ter',
    fasilitas: [
      'Kendaraan Dinas Eksekutif & Driver',
      'Asuransi Kesehatan VVIP Seluruh Keluarga',
      'Perangkat Kerja High-End & Dedicated Workspace'
    ]
  },
  dokumenAdministrasi: {
    wajib: [
      'KTP',
      'NPWP',
      'Ijazah S1/S2',
      'Akta Pendirian / SK Pengangkatan Direksi RUPS',
      'Buku Tabungan / Rekening Bank'
    ],
    pendukung: [
      'Sertifikat Kepemimpinan Eksekutif',
      'Portofolio Inovasi Sistem'
    ],
    khusus: [
      'Akta Notaris Pengangkatan Direksi & Persetujuan Kemenkumham'
    ]
  },
  waktuKerja: {
    polaKerja: 'Non Shift',
    hariKerja: '5 Hari',
    waktuIstirahatMenit: 60,
    totalJamKerja: 40,
    scheduleType: '5_HARI',
    workDays: 'Senin s/d Jumat (5 Hari Kerja per Minggu)',
    workingHours: '08:30 - 17:30 WIB (8 Jam Kerja Efektif)',
    restHours: '12:00 - 13:00 WIB (60 Menit - Tidak Dihitung Jam Kerja)',
    totalHoursPerWeek: 40,
    overtimeEligible: false,
    overtimeClause: 'Tingkat Direksi / Eksekutif Tertinggi (Non-Overtime, Kompensasi melekat pada Fasilitas & Tunjangan Jabatan)',
    shiftDescription: 'Non-Shift (Reguler Executive Hours)'
  }
};

/**
 * SAMPLE DATABASE: JOB DESK / DESKRIPSI JABATAN RESMI PERUSAHAAN
 * 
 * Standar regulasi HR & alur pembuatan data:
 * 1. HR mendefinisikan Job Desk (jabatan, tugas, KPI, kualifikasi, kompensasi, dokumen)
 *    terlebih dahulu dari template terstandar (src/data/jobs/*.ts).
 * 2. Setelah Job Desk resmi terbentuk, data Karyawan (karyawan.ts) dibuat dengan mengacu
 *    langsung pada posisi di job desk ini, sehingga gaji, tunjangan, level, departemen,
 *    dan BPJS/pajak tersinkronisasi secara presisi dan patuh regulasi.
 */
const rawSampleJobDesks: JobTemplate[] = [
  presidentDirectorTemplate,
  ...manufaktur,
  ...rantaiPasok,
  ...logistik,
  ...sdm,
  ...perkantoran,
  ...teknologi,
];

export const sampleJobDesks: JobTemplate[] = rawSampleJobDesks.map(t => enrichJobTemplateWithStructuredFields(t));

export default sampleJobDesks;
