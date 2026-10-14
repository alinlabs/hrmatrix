import { KPIRuleConfig } from '../../types';

/**
 * SAMPLE DATABASE: PENGATURAN & ATURAN UMUM EVALUASI KINERJA / KPI (MODE DEMO)
 * 
 * Konfigurasi standar sistem penilaian kinerja karyawan:
 * 1. Siklus Evaluasi: Bulanan (Monthly), Triwulanan, Semester, atau Tahunan.
 * 2. Proporsi Bobot: KPI Umum Perusahaan (40%) vs KPI Departemen/Spesifik (60%).
 * 3. Nilai Standar Kelulusan (Passing Score): Minimal 75 poin.
 * 4. Otomatisasi Presensi: Integrasi log absensi masuk/pulang ke indikator kedisiplinan.
 * 5. Skala Grading Baku: 4 Tingkat Grade (A, B, C, D) dengan rentang skor, warna & kriteria evaluasi.
 */
export const samplePengaturanKPI: KPIRuleConfig = {
  id: 'kpiConfig',
  evaluationCycle: 'Bulanan',
  generalWeightPercentage: 40,
  departmentWeightPercentage: 60,
  passingScore: 75,
  autoAttendanceKPI: true,
  notes: 'Standar evaluasi kinerja bulanan terintegrasi dengan log presensi dan pencapaian target SLA divisi.',
  updatedAt: '{{ISO_NOW}}',
  grades: [
    {
      grade: 'A',
      label: 'Sangat Baik (Outstanding)',
      minScore: 90,
      maxScore: 100,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Performa melebihi ekspektasi secara konsisten, mencapai efisiensi tinggi, dan direkomendasikan untuk apresiasi kinerja maksimal.'
    },
    {
      grade: 'B',
      label: 'Baik (Meets Expectations)',
      minScore: 75,
      maxScore: 89,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Memenuhi seluruh target operasional dan standar Service Level Agreement (SLA) dengan baik dan konsisten.'
    },
    {
      grade: 'C',
      label: 'Cukup (Needs Improvement)',
      minScore: 60,
      maxScore: 74,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Mendekati target namun terdapat beberapa aspek kompetensi atau ketepatan waktu yang memerlukan bimbingan supervisi.'
    },
    {
      grade: 'D',
      label: 'Kurang (Unsatisfactory)',
      minScore: 0,
      maxScore: 59,
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Pencapaian di bawah standar minimum perusahaan, wajib mengikuti program pembinaan intensif dan monitoring harian.'
    }
  ]
};

export default samplePengaturanKPI;
