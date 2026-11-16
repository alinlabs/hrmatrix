import { KPITemplate } from '../../types';

/**
 * SAMPLE DATABASE: KATALOG MASTER INDIKATOR KPI UMUM & SPESIFIK (MODE DEMO)
 * 
 * Master katalog template indikator kinerja utama (Key Performance Indicators).
 * Pengguna dapat:
 * - Menambah indikator baru ke dalam katalog
 * - Mengubah bobot, dasar ukur, deskripsi, atau skor minimum
 * - Menghapus atau menonaktifkan indikator pada mode operasional nyata
 * - Menggunakan template bawaan tanpa resiko tertimpa secara merusak
 */
export const sampleKatalogKPI: KPITemplate[] = [
  {
    id: 'kpi-master-01',
    name: 'Kehadiran & Kedisiplinan Jam Kerja',
    description: 'Tingkat kehadiran tepat waktu, ketepatan jam kerja (minim keterlambatan dan pulang awal), serta ketertiban pengisian presensi masuk dan pulang.',
    minimumScore: 80,
    weight: 25,
    measurementBase: 'Rekap Presensi & Log Absensi Masuk/Pulang',
    category: 'Umum',
    isGeneral: true,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  },
  {
    id: 'kpi-master-02',
    name: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
    description: 'Kecepatan dan ketepatan waktu dalam menuntaskan penugasan harian atau proyek kerja sesuai Service Level Agreement (SLA) dan batas waktu target.',
    minimumScore: 75,
    weight: 25,
    measurementBase: 'Laporan Monitoring Output & Deadline Tugas',
    category: 'Umum',
    isGeneral: true,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  },
  {
    id: 'kpi-master-03',
    name: 'Kepatuhan SOP & Kebijakan Perusahaan',
    description: 'Ketaatan terhadap prosedur operasional standar (SOP), tata tertib kerja, kerahasiaan data perusahaan, norma K3 (Keselamatan & Kesehatan Kerja), dan etika profesi.',
    minimumScore: 75,
    weight: 20,
    measurementBase: 'Catatan Kepatuhan SOP & Evaluasi Supervisi',
    category: 'Umum',
    isGeneral: true,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  },
  {
    id: 'kpi-master-04',
    name: 'Inisiatif & Kerjasama Tim',
    description: 'Kemampuan berkoordinasi secara proaktif lintas divisi, komunikasi efektif, sikap mencari solusi atas kendala kerja, dan kontribusi pada target kelompok.',
    minimumScore: 70,
    weight: 15,
    measurementBase: 'Observasi Atasan Langsung & Feedback Rekan Kerja',
    category: 'Umum',
    isGeneral: true,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  },
  {
    id: 'kpi-master-05',
    name: 'Efisiensi Penggunaan Waktu & Fasilitas',
    description: 'Pemanfaatan jam kerja secara produktif dan optimal, serta kepedulian terhadap efisiensi energi dan pemeliharaan peralatan inventaris kantor/pabrik.',
    minimumScore: 70,
    weight: 15,
    measurementBase: 'Pengamatan Produktivitas & Inventaris Kerja',
    category: 'Umum',
    isGeneral: true,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  },
  {
    id: 'kpi-master-06',
    name: 'Pencapaian Volume Output & Target Produksi',
    description: 'Realisasi kuantitas hasil kerja dan kapasitas produksi dibandingkan dengan target Rencana Kerja Anggaran Perusahaan (RKAP) periode berjalan.',
    minimumScore: 80,
    weight: 30,
    measurementBase: 'Log Sistem ERP & Laporan Hasil Produksi/Output Harian',
    category: 'Bidang',
    isGeneral: false,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  },
  {
    id: 'kpi-master-07',
    name: 'Pengendalian Tingkat Cacat / Scrap Rate (Kualitas)',
    description: 'Menjaga standar kualitas hasil produksi dengan meminimalkan produk cacat, retur pelanggan, atau reject material di bawah batas toleransi maksimal.',
    minimumScore: 85,
    weight: 25,
    measurementBase: 'Laporan Quality Control & Rekap Scrap Rate Divisi QC',
    category: 'Bidang',
    isGeneral: false,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  },
  {
    id: 'kpi-master-08',
    name: 'Akurasi Rekonsiliasi Finansial & Payroll',
    description: 'Tingkat ketelitian dan ketepatan perhitungan kompensasi, pembayaran gaji, pelaporan pajak PPh 21, dan pencatatan transaksi keuangan tanpa kekeliruan.',
    minimumScore: 90,
    weight: 25,
    measurementBase: 'Hasil Audit Internal & Rekonsiliasi Payroll Bulanan',
    category: 'Bidang',
    isGeneral: false,
    createdAt: '{{ISO_NOW}}',
    updatedAt: '{{ISO_NOW}}'
  }
];

export default sampleKatalogKPI;
