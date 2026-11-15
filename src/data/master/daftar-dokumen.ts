/**
 * Standar Dokumen Administrasi & Persyaratan Kerja
 * Sumber acuan global untuk standardisasi dokumen karyawan dan pelamar.
 * Berisi nama-nama dokumen baku (string) tanpa ID agar seragam di seluruh form dan template posisi.
 */

import { ComboboxOption } from '../../components/ui/ComboboxInput';

export const STANDARD_DOCUMENTS = [
  // Identitas & Kependudukan
  'KTP (Kartu Tanda Penduduk)',
  'Kartu Keluarga (KK)',
  'NPWP (Nomor Pokok Wajib Pajak)',
  'Pas Foto Terbaru (Formal)',
  'Buku Rekening Payroll / Tabungan',
  'Kartu BPJS Kesehatan',
  'Kartu BPJS Ketenagakerjaan',
  'SIM A',
  'SIM B / B1 / B2',
  'SIM C',

  // Pendidikan & Rekam Jejak
  'Curriculum Vitae (CV)',
  'Ijazah Terakhir',
  'Transkrip Nilai',
  'Surat Pengalaman Kerja (Paklaring)',
  'Portofolio Karya / Rekam Jejak Proyek',
  'Sertifikat Kompetensi / BNSP',
  'Sertifikat Pelatihan / Kursus Terkait',

  // Legalitas & Kesehatan
  'SKCK (Surat Keterangan Catatan Kepolisian)',
  'Surat Keterangan Sehat dari Dokter',
  'Surat Bebas Narkoba (SKBN)',
  'Surat Keterangan Bebas Buta Warna',
  'Hasil Medical Check-Up (MCU)',
  'Pakta Integritas / Surat Pernyataan Kepatuhan'
] as const;

export type AdministrativeDocument = (typeof STANDARD_DOCUMENTS)[number] | string;

/**
 * Daftar rekomendasi dokumen wajib umum
 */
export const DEFAULT_MANDATORY_DOCUMENTS: readonly string[] = [
  'KTP (Kartu Tanda Penduduk)',
  'NPWP (Nomor Pokok Wajib Pajak)',
  'Kartu Keluarga (KK)',
  'Ijazah Terakhir',
  'Curriculum Vitae (CV)'
];

/**
 * Daftar rekomendasi dokumen pendukung umum
 */
export const DEFAULT_SUPPORTING_DOCUMENTS: readonly string[] = [
  'Transkrip Nilai',
  'Surat Pengalaman Kerja (Paklaring)',
  'Portofolio Karya / Rekam Jejak Proyek',
  'Sertifikat Pelatihan / Kursus Terkait',
  'SKCK (Surat Keterangan Catatan Kepolisian)'
];

/**
 * Pilihan Combobox Dokumen untuk lookup cepat dan terstandarisasi
 */
export const DOCUMENT_COMBOBOX_OPTIONS: ComboboxOption[] = STANDARD_DOCUMENTS.map((doc) => ({
  value: doc,
  label: doc,
  sublabel: 'Dokumen Persyaratan Standar'
}));
