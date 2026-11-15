/**
 * Standar Dasar Ukur / Sumber Evaluasi KPI
 * Sumber acuan global untuk standardisasi dasar ukur (measurement base) penilaian KPI karyawan.
 * Digunakan sebagai pilihan acuan combobox dalam penyusunan indikator performa utama (KPI).
 */

import { ComboboxOption } from '../../components/ui/ComboboxInput';

export const STANDARD_DASAR_UKUR = [
  // Laporan & Dashboard Kinerja
  'Laporan Kinerja & Dashboard Operasional',
  'Laporan Penjualan & Pencapaian Target (Sales Report)',
  'Laporan Keuangan & Rekonsiliasi Akuntansi',
  'Laporan Produksi & Output Harian/Bulanan',
  'Laporan Logistik & Mutasi Inventaris',
  'Laporan Rekapitulasi Proyek & Milestone',

  // SLA, Waktu Kerja & Sistem Monitoring
  'Log Monitoring SLA & Evaluasi Proses Kerja',
  'Laporan Monitoring Output & Deadline Tugas',
  'Ticketing System & Log Waktu Respon/Resolusi',
  'Log Aktivitas Sistem & Waktu Tanggap (Uptime)',
  'Jurnal Operasional & Checklist Pemeliharaan',

  // Kualitas, Supervisi & Feedback
  'Quality Control, Evaluasi Supervisi & Feedback',
  'Catatan Kepatuhan SOP & Evaluasi Supervisi',
  'Hasil Audit Internal & Checklist Kepatuhan',
  'Observasi Atasan Langsung & Feedback Tim',
  'Survey Kepuasan Pelanggan (CSAT / NPS)',
  'Review Evaluasi Kinerja Berkala (Penilaian 360)',

  // Presensi, Kedisiplinan & Pemanfaatan Fasilitas
  'Rekap Presensi & Log Absensi Masuk/Pulang',
  'Ketepatan Waktu & Kepatuhan Jam Kerja',
  'Log Utilisasi Aset & Efisiensi Jam Kerja',
  'Dokumentasi Berita Acara & Pelaporan Insiden'
] as const;

export type StandardDasarUkur = (typeof STANDARD_DASAR_UKUR)[number] | string;

/**
 * Pre-formatted Combobox Options untuk zero-latency dropdown & lookup
 */
export const DASAR_UKUR_COMBOBOX_OPTIONS: ComboboxOption[] = STANDARD_DASAR_UKUR.map((item) => ({
  value: item,
  label: item,
  sublabel: 'Dasar Ukur Standar'
}));

/**
 * Dasar ukur rekomendasi umum default pada KPI
 */
export const DEFAULT_DASAR_UKUR: readonly string[] = [
  'Laporan Kinerja & Dashboard Operasional',
  'Log Monitoring SLA & Evaluasi Proses Kerja',
  'Quality Control, Evaluasi Supervisi & Feedback',
  'Rekap Presensi & Log Absensi Masuk/Pulang'
];
