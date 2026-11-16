import React from 'react';
import { PayrollRule } from '../../types';
import { 
  Gift, 
  Clock, 
  Layers, 
  Percent,
  Calendar,
  DollarSign,
  Briefcase,
  TrendingUp,
  Sparkles,
  Award,
  Tag,
  Utensils
} from 'lucide-react';

export interface AllowanceTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  data: Partial<PayrollRule>;
}

export const QUICK_TEMPLATES: AllowanceTemplate[] = [
  // --- JABATAN PER LEVEL ---
  {
    id: 'jabatan_direksi',
    title: 'Tunjangan Jabatan - Direksi / C-Level',
    subtitle: '25% dari gaji pokok bulanan untuk Dewan Direksi & C-Level.',
    icon: Briefcase,
    badge: '25% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - Direksi / C-Level',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 25,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 25,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'jabatan_direksi_nominal',
    title: 'Tunjangan Jabatan - Direksi (Nominal Flat)',
    subtitle: 'Flat Rp 12.500.000 per bulan untuk jajaran Direksi.',
    icon: Briefcase,
    badge: 'Rp 12.500.000 / bln',
    data: {
      nama: 'Tunjangan Jabatan - Direksi (Nominal Flat)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 12500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 12500000
    }
  },
  {
    id: 'jabatan_svp_vp',
    title: 'Tunjangan Jabatan - Senior VP & VP',
    subtitle: '20% dari gaji pokok bulanan untuk jenjang SVP & VP.',
    icon: Briefcase,
    badge: '20% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - Senior VP & VP',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 20,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 20,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'jabatan_svp_vp_nominal',
    title: 'Tunjangan Jabatan - SVP & VP (Nominal Flat)',
    subtitle: 'Flat Rp 8.000.000 per bulan untuk jenjang SVP & VP.',
    icon: Briefcase,
    badge: 'Rp 8.000.000 / bln',
    data: {
      nama: 'Tunjangan Jabatan - SVP & VP (Nominal Flat)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 8000000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 8000000
    }
  },
  {
    id: 'jabatan_gm',
    title: 'Tunjangan Jabatan - General Manager / Plant Head',
    subtitle: '18% dari gaji pokok bulanan untuk GM / Plant Head.',
    icon: Briefcase,
    badge: '18% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - General Manager / Plant Head',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 18,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 18,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'jabatan_gm_nominal',
    title: 'Tunjangan Jabatan - General Manager (Nominal Flat)',
    subtitle: 'Flat Rp 5.500.000 per bulan untuk jenjang GM / Division Head.',
    icon: Briefcase,
    badge: 'Rp 5.500.000 / bln',
    data: {
      nama: 'Tunjangan Jabatan - General Manager (Nominal Flat)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 5500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 5500000
    }
  },
  {
    id: 'jabatan',
    title: 'Tunjangan Jabatan - Managerial',
    subtitle: '15% dari gaji pokok bulanan untuk level Manager.',
    icon: Briefcase,
    badge: '15% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - Managerial',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 15,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 15,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'jabatan_manager_nominal',
    title: 'Tunjangan Jabatan - Manager (Nominal Flat)',
    subtitle: 'Flat Rp 3.500.000 per bulan untuk jenjang Manager.',
    icon: Briefcase,
    badge: 'Rp 3.500.000 / bln',
    data: {
      nama: 'Tunjangan Jabatan - Manager (Nominal Flat)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 3500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 3500000
    }
  },
  {
    id: 'jabatan_asst_manager',
    title: 'Tunjangan Jabatan - Assistant Manager',
    subtitle: '12% dari gaji pokok bulanan untuk Asst Manager / Superintendent.',
    icon: Briefcase,
    badge: '12% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - Assistant Manager / Superintendent',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 12,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 12,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'jabatan_spv',
    title: 'Tunjangan Jabatan - Supervisor (SPV)',
    subtitle: '10% dari gaji pokok bulanan untuk level Supervisor / Section Head.',
    icon: Briefcase,
    badge: '10% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - Supervisor (SPV)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 10,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 10,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'jabatan_spv_nominal',
    title: 'Tunjangan Jabatan - Supervisor (Nominal Flat)',
    subtitle: 'Flat Rp 1.250.000 per bulan untuk level Supervisor.',
    icon: Briefcase,
    badge: 'Rp 1.250.000 / bln',
    data: {
      nama: 'Tunjangan Jabatan - Supervisor (Nominal Flat)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 1250000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 1250000
    }
  },
  {
    id: 'jabatan_lead',
    title: 'Tunjangan Jabatan - Team Leader / Foreman',
    subtitle: '8% dari gaji pokok untuk Team Leader, Foreman, atau Kepala Regu.',
    icon: Briefcase,
    badge: '8% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - Team Leader / Foreman',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 8,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 8,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'jabatan_staff_specialist',
    title: 'Tunjangan Jabatan - Senior Staff / Specialist',
    subtitle: '5% dari gaji pokok untuk jenjang Senior Staff & Specialist.',
    icon: Briefcase,
    badge: '5% Gaji Pokok',
    data: {
      nama: 'Tunjangan Jabatan - Senior Staff / Specialist',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 5,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 5,
      employerShare: 0,
      fixedAmount: 0
    }
  },

  // --- KEAHLIAN & SERTIFIKASI ---
  {
    id: 'keahlian',
    title: 'Tunjangan Keahlian & Spesialisasi',
    subtitle: '10% dari gaji pokok berdasarkan sertifikasi kompetensi atau keahlian khusus.',
    icon: Award,
    badge: '10% Gaji Pokok',
    data: {
      nama: 'Tunjangan Keahlian & Spesialisasi',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 10,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 10,
      employerShare: 0,
      fixedAmount: 0
    }
  },
  {
    id: 'sertifikasi_k3',
    title: 'Tunjangan Sertifikasi Ahli K3',
    subtitle: 'Flat Rp 750.000/bulan untuk pemegang lisensi SKP Ahli K3 Umum Kemenaker.',
    icon: Award,
    badge: 'Rp 750.000 / bln',
    data: {
      nama: 'Tunjangan Sertifikasi Ahli K3 (Kemenaker)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 750000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 750000
    }
  },
  {
    id: 'sio_forklift',
    title: 'Tunjangan Lisensi SIO / Forklift Operator',
    subtitle: 'Flat Rp 500.000/bulan untuk pemegang Surat Izin Operator (SIO) resmi.',
    icon: Award,
    badge: 'Rp 500.000 / bln',
    data: {
      nama: 'Tunjangan Lisensi SIO / Forklift Operator',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 500000
    }
  },
  {
    id: 'lead_auditor_iso',
    title: 'Tunjangan Lead Auditor Mutu & ISO',
    subtitle: 'Flat Rp 600.000/bulan untuk personil bersertifikat Lead Auditor ISO.',
    icon: Award,
    badge: 'Rp 600.000 / bln',
    data: {
      nama: 'Tunjangan Lead Auditor Mutu & ISO',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 600000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 600000
    }
  },

  // --- OPERASIONAL, TRANSPORT & SHIFT ---
  {
    id: 'makan_operasional',
    title: 'Tunjangan Transportasi Harian (In-Out)',
    subtitle: 'Tarif harian Rp 25.000 dikalikan jumlah hari kehadiran kerja aktual.',
    icon: Clock,
    badge: 'Rp 25.000 / hari',
    data: {
      nama: 'Tunjangan Transportasi Harian (In-Out)',
      kategori: 'Tunjangan Tidak Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'harian',
      dasar_perhitungan: 'Nominal',
      nilai: 25000,
      ruleType: 'DailyWage',
      calculationModel: 'unit_based',
      fixedAmount: 25000,
      unitRate: 25000
    }
  },
  {
    id: 'tunjangan_makan',
    title: 'Tunjangan Makan Harian',
    subtitle: 'Tarif harian Rp 35.000 dikalikan jumlah hari kehadiran masuk kerja.',
    icon: Clock,
    badge: 'Rp 35.000 / hari',
    data: {
      nama: 'Tunjangan Makan Harian',
      kategori: 'Tunjangan Tidak Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'harian',
      dasar_perhitungan: 'Nominal',
      nilai: 35000,
      ruleType: 'DailyWage',
      calculationModel: 'unit_based',
      fixedAmount: 35000,
      unitRate: 35000
    }
  },
  {
    id: 'shift_malam_pabrik',
    title: 'Tunjangan Shift Malam Pabrik',
    subtitle: 'Tarif kompensasi shift malam Rp 30.000 per kehadiran shift malam.',
    icon: Clock,
    badge: 'Rp 30.000 / shift',
    data: {
      nama: 'Tunjangan Shift Malam Pabrik (3-Shift)',
      kategori: 'Tunjangan Tidak Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'harian',
      dasar_perhitungan: 'Nominal',
      nilai: 30000,
      ruleType: 'DailyWage',
      calculationModel: 'unit_based',
      fixedAmount: 30000,
      unitRate: 30000
    }
  },
  {
    id: 'extra_fooding',
    title: 'Tunjangan Extra Fooding Shift Malam',
    subtitle: 'Suplemen nutrisi Rp 20.000 per kehadiran shift malam.',
    icon: Clock,
    badge: 'Rp 20.000 / shift',
    data: {
      nama: 'Tunjangan Extra Fooding / Shift Malam',
      kategori: 'Tunjangan Tidak Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'harian',
      dasar_perhitungan: 'Nominal',
      nilai: 20000,
      ruleType: 'DailyWage',
      calculationModel: 'unit_based',
      fixedAmount: 20000,
      unitRate: 20000
    }
  },
  {
    id: 'mobilitas_lapangan',
    title: 'Tunjangan Mobilitas Lapangan & Dinas',
    subtitle: 'Uang saku penugasan luar kantor Rp 45.000 per hari mobilitas.',
    icon: Clock,
    badge: 'Rp 45.000 / hari',
    data: {
      nama: 'Tunjangan Mobilitas Lapangan & Dinas',
      kategori: 'Tunjangan Tidak Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'harian',
      dasar_perhitungan: 'Nominal',
      nilai: 45000,
      ruleType: 'DailyWage',
      calculationModel: 'unit_based',
      fixedAmount: 45000,
      unitRate: 45000
    }
  },
  {
    id: 'kendaraan_manajerial',
    title: 'Tunjangan Kendaraan Dinas (Car Allowance)',
    subtitle: 'Flat Rp 1.500.000 per bulan operasional transportasi level Manager ke atas.',
    icon: Briefcase,
    badge: 'Rp 1.500.000 / bln',
    data: {
      nama: 'Tunjangan Kendaraan Dinas / Car Allowance',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 1500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 1500000
    }
  },
  {
    id: 'komunikasi_pulsa',
    title: 'Tunjangan Komunikasi & Pulsa',
    subtitle: 'Flat Rp 250.000 per bulan untuk pulsa dan paket data kerja.',
    icon: Tag,
    badge: 'Rp 250.000 / bln',
    data: {
      nama: 'Tunjangan Komunikasi & Pulsa',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 250000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 250000
    }
  },
  {
    id: 'bahaya_resiko_k3',
    title: 'Tunjangan Resiko Bahaya Lingkungan & K3',
    subtitle: 'Flat Rp 500.000 per bulan untuk personil di area kerja berisiko tinggi.',
    icon: Tag,
    badge: 'Rp 500.000 / bln',
    data: {
      nama: 'Tunjangan Resiko Bahaya Lingkungan & K3',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 500000
    }
  },
  {
    id: 'housing_allowance',
    title: 'Tunjangan Tempat Tinggal / Housing',
    subtitle: 'Flat Rp 1.500.000 per bulan untuk bantuan tempat tinggal karyawan.',
    icon: Tag,
    badge: 'Rp 1.500.000 / bln',
    data: {
      nama: 'Tunjangan Tempat Tinggal / Housing Allowance',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 1500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 1500000
    }
  },
  {
    id: 'tunjangan_keluarga',
    title: 'Tunjangan Keluarga (Pasangan & Anak)',
    subtitle: '5% dari gaji pokok untuk karyawan dengan tanggungan resmi.',
    icon: Tag,
    badge: '5% Gaji Pokok',
    data: {
      nama: 'Tunjangan Keluarga (Pasangan & Anak)',
      kategori: 'Tunjangan Tetap',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'persentase',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 5,
      ruleType: 'Percentage',
      calculationModel: 'percentage',
      employeeShare: 5,
      employerShare: 0,
      fixedAmount: 0
    }
  },

  // --- BONUS & INSENTIF ---
  {
    id: 'insentif_kehadiran',
    title: 'Insentif Kehadiran Bulanan',
    subtitle: 'Nominal flat Rp 150.000 per bulan berdasarkan presensi penuh & disiplin.',
    icon: Sparkles,
    badge: 'Rp 150.000 / bln',
    data: {
      nama: 'Insentif Kehadiran & Kedisiplinan',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 150000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 150000
    }
  },
  {
    id: 'insentif_produktivitas_line',
    title: 'Insentif Produktivitas Line (OEE)',
    subtitle: 'Flat Rp 500.000 per bulan bila lini produksi mencapai target OEE >= 85%.',
    icon: Sparkles,
    badge: 'Rp 500.000 / bln',
    data: {
      nama: 'Insentif Produktivitas Line Manufaktur / OEE',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 500000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 500000
    }
  },
  {
    id: 'insentif_triwulan',
    title: 'Insentif Kinerja Triwulanan (Q1-Q4)',
    subtitle: 'Pencairan per 3 bulan (Maret, Juni, Sept, Des) sebesar Rp 2.000.000 evaluasi KPI.',
    icon: Calendar,
    badge: 'Rp 2.000.000 / Triwulan',
    data: {
      nama: 'Insentif Kinerja Triwulanan (Q1-Q4)',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'triwulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 2000000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 2000000
    }
  },
  {
    id: 'thr',
    title: 'THR Keagamaan',
    subtitle: 'Tahunan, 1 bulan gaji (100%) dengan prorata untuk masa kerja < 12 bulan.',
    icon: Gift,
    badge: 'Prorata 12 Bulan',
    data: {
      nama: 'Tunjangan Hari Raya (THR) Keagamaan',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'tahunan',
      metode_perhitungan: 'prorata',
      dasar_perhitungan: 'Gaji Pokok',
      nilai: 100,
      periode_dasar: 12,
    }
  },
  {
    id: 'bonus_tahunan_masa_kerja',
    title: 'Bonus Tahunan & Masa Kerja',
    subtitle: 'Persentase Gaji Pokok bertingkat sesuai masa kerja (>8 tahun = 100% Gaji Pokok).',
    icon: Layers,
    badge: '% Gaji Pokok (Multi-Tier)',
    data: {
      nama: 'Bonus Tahunan & Masa Kerja',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'tahunan',
      metode_perhitungan: 'berjenjang',
      dasar_perhitungan: 'Gaji Pokok',
      parameter_jenjang: { parameter: 'masa_kerja', satuan: 'tahun' },
      aturan: [
        { min: 0, max: 1, nilai: 25 },
        { min: 1, max: 3, nilai: 50 },
        { min: 3, max: 5, nilai: 75 },
        { min: 5, max: 8, nilai: 90 },
        { min: 8, max: null, nilai: 100 }
      ]
    }
  },
  {
    id: 'kelipatan_tahun',
    title: 'Insentif Loyalitas Masa Kerja (Kelipatan Tahun)',
    subtitle: 'Nominal dikalikan jumlah tahun masa kerja karyawan (Rp 100.000 x Tahun).',
    icon: Award,
    badge: 'Kelipatan Tahun',
    data: {
      nama: 'Insentif Loyalitas Masa Kerja (Kelipatan Tahun)',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'tahunan',
      metode_perhitungan: 'kelipatan',
      dasar_perhitungan: 'Nominal',
      nilai: 100000,
    }
  },
  {
    id: 'service_charge_fnb',
    title: 'Tunjangan Service Charge F&B & Restoran',
    subtitle: 'Alokasi bagi hasil service charge tamu restoran/outlet F&B bulanan.',
    icon: DollarSign,
    badge: 'F&B Service Charge',
    data: {
      nama: 'Tunjangan Service Charge Restoran & F&B',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 1250000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 1250000
    }
  },
  {
    id: 'tunjangan_keahlian_creative',
    title: 'Tunjangan Keahlian Desain & Multimedia',
    subtitle: 'Tunjangan profesi desainer grafis, video editor, 3D animator & multimedia.',
    icon: Award,
    badge: 'Creative Skill',
    data: {
      nama: 'Tunjangan Keahlian Desain & Multimedia',
      kategori: 'Tunjangan Keahlian',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 600000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 600000
    }
  },
  {
    id: 'tunjangan_shooting_media',
    title: 'Uang Saku Shooting & Liputan Media',
    subtitle: 'Tunjangan harian saat tim videografer/jurnalis bertugas di lokasi shooting.',
    icon: Calendar,
    badge: 'Rp 75.000 / Hari Shooting',
    data: {
      nama: 'Uang Saku Shooting & Liputan Media',
      kategori: 'Tunjangan Operasional',
      frekuensi_pembayaran: 'harian',
      metode_perhitungan: 'harian',
      dasar_perhitungan: 'Nominal',
      nilai: 75000,
      ruleType: 'DailyWage',
      calculationModel: 'unit_based',
      fixedAmount: 75000,
      unitRate: 75000
    }
  },
  {
    id: 'duty_meal_fnb',
    title: 'Uang Makan Shift F&B / Duty Meal Resto',
    subtitle: 'Tunjangan makan harian berbasis shift kerja front of house / kitchen resto.',
    icon: Utensils,
    badge: 'Rp 30.000 / Shift Kerja',
    data: {
      nama: 'Uang Makan Shift F&B & Restoran',
      kategori: 'Tunjangan Operasional',
      frekuensi_pembayaran: 'harian',
      metode_perhitungan: 'harian',
      dasar_perhitungan: 'Nominal',
      nilai: 30000,
      ruleType: 'DailyWage',
      calculationModel: 'unit_based',
      fixedAmount: 30000,
      unitRate: 30000
    }
  },
  {
    id: 'insentif_omzet_fnb',
    title: 'Insentif Target Omzet Outlet Resto & Cafe',
    subtitle: 'Insentif pencapaian target penjualan outlet F&B bulanan.',
    icon: TrendingUp,
    badge: 'Rp 750.000 / Bulan',
    data: {
      nama: 'Insentif Target Omzet Outlet F&B',
      kategori: 'Bonus & Insentif',
      frekuensi_pembayaran: 'bulanan',
      metode_perhitungan: 'tetap',
      dasar_perhitungan: 'Nominal',
      nilai: 750000,
      ruleType: 'Fixed',
      calculationModel: 'fixed',
      fixedAmount: 750000
    }
  }
];
