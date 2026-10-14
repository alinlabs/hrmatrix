/**
 * Standar Fasilitas & Inventaris Kerja Perusahaan
 * Sumber acuan global untuk standardisasi fasilitas kerja, perangkat, dan inventaris operasional.
 * Digunakan sebagai pilihan acuan combobox dalam template posisi (job desk) dan manajemen kompensasi.
 */

import { ComboboxOption } from '../../components/ui/ComboboxInput';

export const STANDARD_FACILITIES = [
  // Fasilitas Utama & Perangkat Kerja
  'Laptop/Perangkat Kerja',
  'Monitor Eksternal Tambahan',
  'Komputer Desktop / PC Kantor',
  'Tablet / iPad Kerja',
  'Smartphone / Ponsel Operasional Perusahaan',
  'Peralatan & Toolset Teknis Lapangan',
  'Seragam Kerja & APD (Alat Pelindung Diri)',

  // Transportasi & Mobilitas
  'Mobil Operasional Perusahaan',
  'Motor Operasional Perusahaan',
  'Kartu BBM / Uang Bensin Operasional',
  'Kartu Tol / Flazz Elektronik Operasional',
  'Layanan Antar-Jemput Karyawan / Shuttle Bus',
  'Fasilitas Parkir Khusus / Tiket Langganan Parkir',

  // Kesehatan, Kebugaran & Asuransi Tambahan
  'Asuransi Kesehatan Swasta',
  'Asuransi Jiwa & Kecelakaan Diri',
  'Medical Check-Up (MCU) Tahunan',
  'Fasilitas Gym / Membership Kebugaran',
  'Konseling Psikolog & Kesehatan Mental (EAP)',

  // Pengembangan & Kesejahteraan
  'Program Pelatihan Tahunan',
  'Budget Sertifikasi Profesional',
  'Akses Kursus / E-Learning Premium',
  'Subsidi Kuota Internet / Wi-Fi Rumah',
  'Subsidi Perangkat Kerja Jarak Jauh (WFA Setup)',
  'Makan Siang Gratis / Voucher Kafetaria',
  'Mess Karyawan / Akomodasi Tempat Tinggal Perusahaan',
  'Ruang Laktasi & Nursery'
] as const;

export type StandardFacility = (typeof STANDARD_FACILITIES)[number] | string;

/**
 * Pre-formatted Combobox Options untuk zero-latency dropdown & lookup
 */
export const FACILITY_COMBOBOX_OPTIONS: ComboboxOption[] = STANDARD_FACILITIES.map((fac) => ({
  value: fac,
  label: fac,
  sublabel: 'Fasilitas & Inventaris Standar'
}));

/**
 * Fasilitas rekomendasi umum default pada template posisi
 */
export const DEFAULT_FACILITIES: readonly string[] = [
  'Asuransi Kesehatan Swasta',
  'Laptop/Perangkat Kerja',
  'Program Pelatihan Tahunan'
];
