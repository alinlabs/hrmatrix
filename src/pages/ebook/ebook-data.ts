import { HR_FORMULA_DETAILS, HRFormulaDetail } from './ebook-formulas';

export { HR_FORMULA_DETAILS, type HRFormulaDetail };

import { Chapter, SubSection } from "./ebook-types";
export type { Chapter, SubSection };

import { bab1Arsitektur } from "./bab-1-arsitektur";
import { bab2Karyawan } from "./bab-2-karyawan";
import { bab3Kehadiran } from "./bab-3-kehadiran";
import { bab4Penggajian } from "./bab-4-penggajian";
import { bab5Kpi } from "./bab-5-kpi";
import { bab6JobDesk } from "./bab-6-jobdesk";
import { bab7Laporan } from "./bab-7-laporan";
import { bab8Database } from "./bab-8-database";
import { bab9Rekrutmen } from "./bab-9-rekrutmen";
import { bab10HubunganIndustrial } from "./bab-10-hubungan-industrial";
import { bab11TalentCulture } from "./bab-11-talent-culture";
import { bab12HrStrategic } from "./bab-12-hr-strategic";

export const PANDUAN_CHAPTERS: Chapter[] = [
  bab1Arsitektur,
  bab2Karyawan,
  bab3Kehadiran,
  bab4Penggajian,
  bab5Kpi,
  bab6JobDesk,
  bab7Laporan,
  bab8Database,
  bab9Rekrutmen,
  bab10HubunganIndustrial,
  bab11TalentCulture,
  bab12HrStrategic
];


// Glosarium Istilah HR, Pajak, dan Ketenagakerjaan
export interface GlossaryTerm {
  term: string;
  fullName: string;
  category: 'Ketenagakerjaan' | 'Pajak' | 'BPJS' | 'Sistem';
  definition: string;
  legalRef?: string;
}

export const HR_GLOSSARY: GlossaryTerm[] = [
  {
    term: 'STAR',
    fullName: 'Situation, Task, Action, Result',
    category: 'Ketenagakerjaan',
    definition: 'Teknik wawancara berbasis perilaku (*Behavioral Event Interview*) untuk menilai kompetensi nyata kandidat berdasarkan pengalaman kerja konkret di masa lalu.',
    legalRef: 'Standar Praktik Rekrutmen & Asesmen HR Modern'
  },
  {
    term: 'HRBP',
    fullName: 'Human Resource Business Partner',
    category: 'Sistem',
    definition: 'Peran strategis HR yang berfokus menyelaraskan manajemen sumber daya manusia dengan tujuan finansial dan pertumbuhan bisnis perusahaan.',
    legalRef: 'Kerangka Kerja Manajemen SDM Strategis'
  },
  {
    term: 'TNA',
    fullName: 'Training Needs Analysis',
    category: 'Ketenagakerjaan',
    definition: 'Proses analisis sistematis untuk mengidentifikasi celah kompetensi (*skill gap*) antara kinerja aktual karyawan (skor KPI) dengan standar yang dibutuhkan organisasi.',
    legalRef: 'Manajemen Pengembangan Karyawan & Diklat'
  },
  {
    term: 'eNPS',
    fullName: 'Employee Net Promoter Score',
    category: 'Ketenagakerjaan',
    definition: 'Metrik pengukuran kepuasan dan loyalitas karyawan terhadap perusahaan dengan mengajukan pertanyaan seberapa besar mereka merekomendasikan tempat kerja kepada orang lain.',
    legalRef: 'Metrik Keterikatan Karyawan (Employee Engagement)'
  },
  {
    term: 'PKWT',
    fullName: 'Perjanjian Kerja Waktu Tertentu',
    category: 'Ketenagakerjaan',
    definition: 'Perjanjian kerja antara pekerja/buruh dengan pengusaha untuk mengadakan hubungan kerja dalam waktu tertentu atau untuk pekerjaan tertentu yang selesai dalam jangka waktu tertentu maksimal 5 tahun akumulatif.',
    legalRef: 'Pasal 56-59 UU Ketenagakerjaan jo. PP No. 35/2021'
  },
  {
    term: 'PKWTT',
    fullName: 'Perjanjian Kerja Waktu Tidak Tertentu',
    category: 'Ketenagakerjaan',
    definition: 'Perjanjian kerja antara pekerja/buruh dengan pengusaha untuk mengadakan hubungan kerja yang bersifat tetap sampai masa pensiun, meninggal dunia, atau terjadi pemutusan hubungan kerja.',
    legalRef: 'Pasal 60-63 UU Ketenagakerjaan jo. PP No. 35/2021'
  },
  {
    term: 'TER',
    fullName: 'Tarif Efektif Rata-Rata',
    category: 'Pajak',
    definition: 'Skema pemotongan pajak penghasilan Pasal 21 bulanan yang mempermudah penghitungan dengan mengalikan langsung penghasilan bruto bulanan dengan persentase tarif sesuai layer dan kategori PTKP.',
    legalRef: 'PP No. 58 Tahun 2023 & PMK No. 168 Tahun 2023'
  },
  {
    term: 'PTKP',
    fullName: 'Penghasilan Tidak Kena Pajak',
    category: 'Pajak',
    definition: 'Batasan nominal penghasilan wajib pajak orang pribadi yang dibebaskan dari pengenaan pajak penghasilan (PPh 21). Nilai dasar untuk wajib pajak lajang (TK/0) adalah Rp 54.000.000 per tahun.',
    legalRef: 'UU No. 7 Tahun 2021 tentang Harmonisasi Peraturan Perpajakan (UU HPP)'
  },
  {
    term: '1/173',
    fullName: 'Faktor Pembagi Upah Lembur Sejam',
    category: 'Ketenagakerjaan',
    definition: 'Standar pembagi resmi untuk menghitung upah lembur per jam dari upah bulanan (gaji pokok ditambah tunjangan tetap), yang didasarkan pada rata-rata jam kerja per bulan di Indonesia (`52 minggu ÷ 12 bulan × 40 jam = 173,33 jam`).',
    legalRef: 'Kepmenakertrans No. KEP.102/MEN/VI/2004 Pasal 10'
  },
  {
    term: 'JHT',
    fullName: 'Jaminan Hari Tua',
    category: 'BPJS',
    definition: 'Program perlindungan jaminan sosial tenaga kerja berupa tabungan pensiun yang dibayarkan sekaligus saat pekerja mencapai usia pensiun, mengalami cacat total tetap, atau meninggal dunia. Total iuran 5.7% (3.7% perusahaan + 2% karyawan).',
    legalRef: 'PP No. 46 Tahun 2015'
  },
  {
    term: 'JP',
    fullName: 'Jaminan Pensiun',
    category: 'BPJS',
    definition: 'Program jaminan sosial tenaga kerja berupa penghasilan berkala setiap bulan setelah pekerja pensiun. Total iuran 3.0% (2.0% perusahaan + 1.0% karyawan) dengan batas maksimal upah tertinggi yang ditetapkan BPJS.',
    legalRef: 'PP No. 45 Tahun 2015'
  },
  {
    term: 'JKK',
    fullName: 'Jaminan Kecelakaan Kerja',
    category: 'BPJS',
    definition: 'Perlindungan atas risiko kecelakaan kerja mulai dari perjalanan berangkat kerja, di tempat kerja, hingga perjalanan pulang. Iuran 100% ditanggung oleh perusahaan dengan persentase 0.24% s.d. 1.74%.',
    legalRef: 'PP No. 44 Tahun 2015'
  },
  {
    term: 'JKM',
    fullName: 'Jaminan Kematian',
    category: 'BPJS',
    definition: 'Santunan kematian yang diberikan kepada ahli waris pekerja yang meninggal dunia bukan akibat kecelakaan kerja. Iuran 100% ditanggung perusahaan sebesar 0.30% dari upah sebulan.',
    legalRef: 'PP No. 44 Tahun 2015'
  },
  {
    term: 'IndexedDB',
    fullName: 'Indexed Database API (Client-Side Storage)',
    category: 'Sistem',
    definition: 'Teknologi basis data NoSQL transaksional bawaan peramban (*browser*) yang memungkinkan penyimpanan data berkapasitas besar secara lokal di perangkat pengguna dengan enkripsi sandbox sistem operasi.',
    legalRef: 'W3C Recommendation Indexed Database API 3.0'
  }
];

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
  legalBasis?: string;
}

export const HR_FAQ: FAQItem[] = [
  {
    question: 'Bagaimana jika karyawan masuk di pertengahan bulan, berapa gaji yang wajib dibayarkan?',
    answer: 'Karyawan yang mulai bekerja di pertengahan siklus penggajian berhak menerima gaji pokok prorata yang dihitung berdasarkan jumlah hari kerja efektif aktual yang dijalaninya dibagi total hari kerja normal di bulan tersebut dikalikan upah pokok bulanan.',
    category: 'Penggajian',
    legalBasis: 'Pasal 93 UU No. 13/2003 jo. PP No. 36/2021 tentang Pengupahan'
  },
  {
    question: 'Apakah karyawan berstatus PKWT (Kontrak) boleh diberikan masa percobaan (Probation)?',
    answer: 'TIDAK BOLEH. Berdasarkan Pasal 58 UU Ketenagakerjaan jo. PP No. 35/2021, perjanjian kerja waktu tertentu (PKWT) tidak dapat mensyaratkan adanya masa percobaan kerja. Jika dalam PKWT disyaratkan masa percobaan, maka masa percobaan yang disyaratkan tersebut batal demi hukum dan status karyawan secara hukum otomatis berubah menjadi PKWTT (Karyawan Tetap).',
    category: 'Ketenagakerjaan',
    legalBasis: 'Pasal 58 UU No. 13/2003 & PP No. 35/2021'
  },
  {
    question: 'Berapa lama masa berlaku Surat Peringatan (SP) dan apakah SP harus diberikan secara berurutan?',
    answer: 'Masing-masing Surat Peringatan (SP 1, SP 2, SP 3) berlaku selama 6 (enam) bulan. SP tidak harus diberikan berurutan; perusahaan dapat menerbitkan SP 3 atau SP Terakhir secara langsung apabila pekerja melakukan pelanggaran berat yang diatur dalam Peraturan Perusahaan (PP) atau Perjanjian Kerja Bersama (PKB).',
    category: 'Hubungan Industrial',
    legalBasis: 'Pasal 161 UU No. 13/2003 jo. PP No. 35/2021'
  },
  {
    question: 'Apakah pekerja kontrak (PKWT) yang mengundurkan diri (resign) berhak mendapat kompensasi PKWT?',
    answer: 'Berdasarkan Pasal 17 PP No. 35 Tahun 2021, apabila salah satu pihak mengakhiri hubungan kerja sebelum berakhirnya jangka waktu yang ditetapkan dalam PKWT, pihak yang mengakhiri wajib membayar ganti rugi sebesar upah pekerja sampai batas waktu berakhirnya jangka waktu perjanjian kerja, namun pengusaha tetap membayarkan uang kompensasi yang besarannya dihitung proporsional sesuai masa kerja yang telah diselesaikan.',
    category: 'Ketenagakerjaan',
    legalBasis: 'Pasal 17 PP No. 35 Tahun 2021'
  },
  {
    question: 'Berapa batas maksimal pemotongan denda keterlambatan dari gaji karyawan?',
    answer: 'Berdasarkan regulasi ketenagakerjaan, total seluruh pemotongan upah (termasuk denda disiplin, cicilan pinjaman, dan ganti rugi) dalam 1 periode pembayaran upah tidak boleh melebihi 50% dari total upah bulanan yang seharusnya diterima karyawan agar tidak mengganggu kelangsungan hidup pekerja.',
    category: 'Kompensasi',
    legalBasis: 'Pasal 65 PP No. 36 Tahun 2021 tentang Pengupahan'
  },
  {
    question: 'Bagaimana cara memindahkan seluruh data HRMatrix ke laptop/komputer lain?',
    answer: 'Buka menu Database Manager pada laptop lama, klik tombol "Download Backup JSON" untuk mengunduh berkas cadangan. Kemudian buka HRMatrix di browser laptop baru, masuk ke Database Manager, dan unggah berkas *.json* tersebut melalui fitur "Restore Backup". Seluruh data karyawan, gaji, dan riwayat presensi akan langsung pulih seketika.',
    category: 'Sistem & Teknis'
  },
  {
    question: 'Apakah perhitungan PPh 21 TER berlaku juga untuk THR dan bonus tahunan?',
    answer: 'Ya. Berdasarkan PMK No. 168 Tahun 2023, pada bulan di mana karyawan menerima THR atau bonus, nominal THR/bonus tersebut ditambahkan ke dalam Penghasilan Bruto bulan bersangkutan, lalu total penghasilan bruto tersebut dikalikan dengan persentase tarif TER sesuai kategori PTKP karyawan.',
    category: 'Pajak',
    legalBasis: 'PMK No. 168 Tahun 2023 Pasal 5 & Lampiran PP No. 58 Tahun 2023'
  }
];

export const HR_FAQS = HR_FAQ;

export interface RegulatoryReference {
  nomor: string;
  tentang: string;
  keterangan: string;
}

export const REGULATORY_REFERENCES: RegulatoryReference[] = [
  {
    nomor: 'PP No. 35 Tahun 2021',
    tentang: 'PKWT, Alih Daya, Waktu Kerja dan Waktu Istirahat, serta PHK',
    keterangan: 'Mengatur batas maksimal kontrak PKWT 5 tahun, formula wajib perhitungan uang kompensasi berakhirnya kontrak (1 bulan gaji per 12 bulan kerja), dan skema pengali lembur resmi.'
  },
  {
    nomor: 'PP No. 58 Tahun 2023',
    tentang: 'Tarif Pemotongan Pajak Penghasilan Pasal 21 atas Penghasilan Wajib Pajak Orang Pribadi',
    keterangan: 'Menetapkan standarisasi pemotongan PPh 21 bulanan masa Januari s.d. November menggunakan Tarif Efektif Rata-Rata (TER) Kategori A, B, dan C berdasarkan status PTKP.'
  },
  {
    nomor: 'PMK No. 168 Tahun 2023',
    tentang: 'Petunjuk Pelaksanaan Pemotongan Pajak atas Penghasilan Sehubungan dengan Pekerjaan',
    keterangan: 'Petunjuk teknis penggabungan gaji pokok, tunjangan, lembur, bonus, dan premi jaminan sosial ke dalam dasar pengenaan pajak bruto bulanan untuk penerapan TER.'
  },
  {
    nomor: 'Kepmenakertrans No. 102/2004',
    tentang: 'Waktu Kerja Lembur dan Upah Kerja Lembur',
    keterangan: 'Landasan hukum baku faktor pengali upah lembur 1/173 per jam dari upah bulanan, pengali 1.5x dan 2.0x hari kerja biasa, serta pengali 2.0x, 3.0x, 4.0x pada hari libur resmi.'
  },
  {
    nomor: 'PP No. 44, 45, 46 Tahun 2015',
    tentang: 'Penyelenggaraan Program JKK, JKM, JP, dan JHT BPJS Ketenagakerjaan',
    keterangan: 'Menetapkan rincian tarif iuran jaminan sosial tenaga kerja: JKK (0.24%-1.74%), JKM (0.30%), JHT (5.7% total: 3.7% perusahaan + 2% pekerja), dan JP (3% total: 2% perusahaan + 1% pekerja).'
  },
  {
    nomor: 'Perpres No. 64 Tahun 2020',
    tentang: 'Jaminan Pemeliharaan Kesehatan BPJS Kesehatan',
    keterangan: 'Menetapkan total iuran jaminan kesehatan 5% (4% ditanggung perusahaan + 1% dipotong dari gaji pekerja) dengan batas atas perhitungan (plafon) maksimal Rp 12.000.000.'
  },
  {
    nomor: 'Permenaker No. 6 Tahun 2016',
    tentang: 'Tunjangan Hari Raya (THR) Keagamaan Bagi Pekerja/Buruh',
    keterangan: 'Mewajibkan pembayaran THR keagamaan minimal 1 bulan upah untuk masa kerja 12 bulan dan proporsional untuk masa kerja 1 s.d. <12 bulan paling lambat H-7 hari raya.'
  },
  {
    nomor: 'UU No. 13/2003 jo. UU No. 6/2023',
    tentang: 'Undang-Undang Ketenagakerjaan & Cipta Kerja',
    keterangan: 'Pondasi utama hukum ketenagakerjaan Republik Indonesia mengenai hak dasar pekerja, waktu kerja 40 jam seminggu, hak cuti tahunan, dan tata cara penerbitan Surat Peringatan (SP).'
  }
];
