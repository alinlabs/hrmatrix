/**
 * Master Data Kamus Indikator KPI Umum (Universal)
 * Master referensi indikator KPI standar perusahaan untuk seluruh karyawan.
 * 
 * Struktur data baku:
 * - nama (Nama KPI)
 * - deskripsi (Deskripsi lengkap & tata cara penilaian)
 * - minimumSkor (Minimum Skor Standar, misal: 70, 75, 80)
 * - bobot (Bobot KPI dalam %)
 * - dasarUkur (Dasar Ukur / Sumber Evaluasi)
 */

export interface MasterKPIUmum {
  id: string;
  name: string; // Nama KPI
  description: string; // Deskripsi & Tata Cara Penilaian
  minimumScore: number; // Minimum Skor
  weight: number; // Bobot KPI (%)
  measurementBase: string; // Dasar Ukur
}

export const MASTER_KPI_UMUM: MasterKPIUmum[] = [
  {
    id: 'kpi-master-01',
    name: 'Kehadiran & Kedisiplinan Jam Kerja',
    description: 'Tingkat kehadiran tepat waktu, ketepatan jam kerja (minim keterlambatan dan pulang awal), serta ketertiban pengisian absensi presensi masuk dan pulang.',
    minimumScore: 80,
    weight: 25,
    measurementBase: 'Rekap Presensi & Log Absensi Masuk/Pulang'
  },
  {
    id: 'kpi-master-02',
    name: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
    description: 'Kecepatan dan ketepatan waktu dalam menuntaskan penugasan harian/proyek sesuai Service Level Agreement (SLA) dan target deadline yang ditentukan.',
    minimumScore: 75,
    weight: 25,
    measurementBase: 'Laporan Monitoring Output & Deadline Tugas'
  },
  {
    id: 'kpi-master-03',
    name: 'Kepatuhan SOP & Kebijakan Perusahaan',
    description: 'Ketaatan terhadap prosedur operasional standar (SOP), tata tertib kerja, kerahasiaan data perusahaan, serta kepatuhan norma K3 dan etika profesi.',
    minimumScore: 75,
    weight: 20,
    measurementBase: 'Catatan Kepatuhan SOP & Evaluasi Supervisi'
  },
  {
    id: 'kpi-master-04',
    name: 'Inisiatif & Kerjasama Tim',
    description: 'Kemampuan berkoordinasi secara efektif dengan rekan kerja, sikap proaktif mencari solusi atas kendala kerja, dan kontribusi aktif dalam pencapaian target tim.',
    minimumScore: 70,
    weight: 15,
    measurementBase: 'Observasi Atasan Langsung & Feedback Tim'
  },
  {
    id: 'kpi-master-05',
    name: 'Efisiensi Penggunaan Waktu & Fasilitas',
    description: 'Pemanfaatan jam kerja secara produktif dan optimal, serta kepedulian terhadap pemeliharaan peralatan dan fasilitas kantor yang digunakan.',
    minimumScore: 70,
    weight: 15,
    measurementBase: 'Pengamatan Produktivitas & Inventaris Kerja'
  }
];
