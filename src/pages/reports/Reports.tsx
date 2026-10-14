import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock, 
  Globe, 
  Briefcase,
  Calendar,
  ShieldCheck,
  Boxes, 
  PackageCheck,
  Wrench,
  CheckCircle2, 
  Calculator,
  Receipt,
  MailCheck,
  ChevronDown,
  ArrowUpRight,
  Table,
  FileEdit,
  X,
  Loader2
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { db } from '../../db/database';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  PortalNavLogo 
} from '../../components/e-portal/PortalLogos';
import { COMPANY_REGULATION_DATA } from '../regulasi/company-regulation-data';
import { GAStorage } from '../ga/ga-storage';
import { getStoredVacancies, getStoredCandidates } from '../lowongan/storage-helper';
import { useAppModulesConfig, isEPortalActive } from '../../services/moduleConfigService';

export interface ReportItem {
  id: string;
  category: 'hr' | 'payroll' | 'recruitment' | 'ga';
  categoryLabel: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  stats?: string;
  directRoute?: string;
  directRouteLabel?: string;
}

export function Reports() {
  const navigate = useNavigate();
  const { config: modulesConfig } = useAppModulesConfig();

    const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [selectedReportForExport, setSelectedReportForExport] = useState<ReportItem | null>(null);
  const [isExportingFormat, setIsExportingFormat] = useState<'pdf' | 'csv' | 'docs' | null>(null);

  // Toggle menampilkan seluruh card e-Portal
  const [showAllPortals, setShowAllPortals] = useState(false);

  // List e-Portal sesuai sidebar navigasi (Laporan HR & Laporan GA)
  const hrPortals = useMemo(() => [
    { id: 'kemenaker', name: 'Kemenaker', sub: 'WLKP Online', href: '/e-portal/kemenaker', logo: 'kemenaker', desc: 'Wajib Lapor Ketenagakerjaan Perusahaan' },
    { id: 'bpjstk', name: 'BPJSTK', sub: 'SIPP Online', href: '/e-portal/bpjstk', logo: 'bpjstk', desc: 'SIPP Online & Rekonsiliasi Iuran' },
    { id: 'edabu', name: 'EDABU', sub: 'BPJS Kesehatan', href: '/e-portal/edabu', logo: 'edabu', desc: 'Data Badan Usaha & Mutasi Peserta' },
    { id: 'djp', name: 'DJP Online', sub: 'e-Bupot & PPh 21', href: '/e-portal/djp', logo: 'djp', desc: 'e-Bupot 21/26 & Tarif Efektif TER' },
    { id: 'e-pp-pkb', name: 'E-PP & PKB', sub: 'Pengesahan PP', href: '/e-portal/e-pp-pkb', logo: 'e-pp-pkb', desc: 'Pengesahan Peraturan Perusahaan' },
    { id: 'temank3', name: 'Teman K3', sub: 'P2K3 & Sertifikasi', href: '/e-portal/temank3', logo: 'temank3', desc: 'Pelaporan Panitia K3 & Sertifikasi' },
    { id: 'tka-online', name: 'TKA Online', sub: 'RPTKA Kemnaker', href: '/e-portal/tka-online', logo: 'tka-online', desc: 'Izin Tenaga Kerja Asing Kemnaker' },
    { id: 'karirhub', name: 'Karirhub', sub: 'SIAPkerja Nasional', href: '/e-portal/karirhub', logo: 'karirhub', desc: 'Pusat Informasi Pasar Kerja Nasional' },
    { id: 'pphi', name: 'PPHI', sub: 'Hubungan Industrial', href: '/e-portal/pphi', logo: 'pphi', desc: 'Pencegahan Perselisihan Hubungan Industrial' },
  ].filter(p => isEPortalActive(p.logo, modulesConfig)), [modulesConfig]);

  const gaPortals = useMemo(() => [
    { id: 'oss', name: 'OSS RBA', sub: 'LKPM & Investasi', href: '/e-portal/oss', logo: 'oss', desc: 'Perizinan Berusaha Berbasis Risiko & Investasi' },
    { id: 'simpel', name: 'SIMPEL KLHK', sub: 'Lingkungan Hidup', href: '/e-portal/simpel', logo: 'simpel', desc: 'Pelaporan Kepatuhan Lingkungan Hidup' },
    { id: 'festronik', name: 'Festronik', sub: 'Limbah B3 Online', href: '/e-portal/festronik', logo: 'festronik', desc: 'Manifest Elektronik Limbah Bahan Berbahaya' },
    { id: 'simbg', name: 'SIMBG PUPR', sub: 'PBG & SLF Gedung', href: '/e-portal/simbg', logo: 'simbg', desc: 'Persetujuan Bangunan Gedung & Laik Fungsi' },
    { id: 'bapenda', name: 'Pajak Daerah', sub: 'Bapenda & PBB', href: '/e-portal/bapenda', logo: 'bapenda', desc: 'Pajak Reklame, Air Bawah Tanah & PBB' },
  ].filter(p => isEPortalActive(p.logo, modulesConfig)), [modulesConfig]);

  const allActivePortals = useMemo(() => {
    return [...hrPortals, ...gaPortals];
  }, [hrPortals, gaPortals]);

  const totalActivePortals = allActivePortals.length;

  const displayedPortals = useMemo(() => {
    return showAllPortals ? allActivePortals : allActivePortals.slice(0, 5);
  }, [showAllPortals, allActivePortals]);

  // All Report Definitions
  const allReports: ReportItem[] = useMemo(() => {
    const list: ReportItem[] = [
      // HR & Personalia
      {
        id: 'employee',
        category: 'hr',
        categoryLabel: 'HR & Personalia',
        title: 'Laporan Data Karyawan',
        description: 'Rekapitulasi profil lengkap pegawai aktif, status kerja (PKWT/PKWTT/Probation), masa kerja, dan penempatan departemen.',
        icon: Users,
        color: 'bg-blue-50 text-blue-600 border-blue-200',
        badge: 'Master SDM',
        stats: 'Profil Pegawai & Organisasi',
        directRoute: '/employees',
        directRouteLabel: 'Data Karyawan'
      },
      {
        id: 'attendance',
        category: 'hr',
        categoryLabel: 'HR & Personalia',
        title: 'Laporan Kehadiran & Presensi',
        description: 'Rekapitulasi rekor absensi masuk/pulang, keterlambatan kerja, ketidakhadiran (alpa/izin/sakit), dan jam produktif bulanan.',
        icon: Clock,
        color: 'bg-amber-50 text-amber-600 border-amber-200',
        badge: 'Presensi',
        stats: 'Kehadiran & Durasi Jam Kerja',
        directRoute: '/presensi',
        directRouteLabel: 'Rekap Presensi'
      },
      {
        id: 'schedule',
        category: 'hr',
        categoryLabel: 'HR & Personalia',
        title: 'Laporan Jadwal Kerja & Shift',
        description: 'Rekapitulasi plotting jadwal kerja karyawan, alokasi pola shift reguler vs bergilir, catatan tukar shift (swap), dan lembur jadwal.',
        icon: Calendar,
        color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        badge: 'Jadwal & Roster',
        stats: 'Alokasi Shift & Shift Swap',
        directRoute: '/jadwal',
        directRouteLabel: 'Kelola Jadwal'
      },
      {
        id: 'company_regulation',
        category: 'hr',
        categoryLabel: 'HR & Personalia',
        title: 'Laporan Peraturan Perusahaan (PP)',
        description: 'Rekapitulasi kompilasi 9 BAB dan seluruh pasal operasional Peraturan Perusahaan sesuai UU No. 13/2003 jo. UU No. 6/2023 Cipta Kerja.',
        icon: ShieldCheck,
        color: 'bg-purple-50 text-purple-600 border-purple-200',
        badge: 'Kepatuhan Regulasi',
        stats: '9 BAB • 30+ Pasal Operasional',
        directRoute: '/legal/peraturan-perusahaan',
        directRouteLabel: 'Buka Regulasi'
      },

      // Payroll & Kompensasi
      {
        id: 'payroll',
        category: 'payroll',
        categoryLabel: 'Payroll & Remunerasi',
        title: 'Laporan Penggajian (Payroll)',
        description: 'Rekapitulasi slip gaji berkala, total take-home-pay, biaya beban gaji perusahaan, serta ringkasan status pembayaran.',
        icon: DollarSign,
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        badge: 'Payroll Bulanan',
        stats: 'Gaji Pokok, Bruto & Neto',
        directRoute: '/payroll',
        directRouteLabel: 'Buka Payroll'
      },
      {
        id: 'allowance_deduction',
        category: 'payroll',
        categoryLabel: 'Payroll & Remunerasi',
        title: 'Laporan Tunjangan & Potongan',
        description: 'Rekapitulasi rinci komponen tunjangan tetap, tunjangan variabel, denda keterlambatan, iuran BPJS (TK & Kesehatan), PPh 21, dan kasbon.',
        icon: Receipt,
        color: 'bg-teal-50 text-teal-600 border-teal-200',
        badge: 'Tunjangan & Potongan',
        stats: 'Breakdown Komponen Upah',
        directRoute: '/payroll/tunjangan',
        directRouteLabel: 'Master Tunjangan'
      },

      // Rekrutmen & Performa
      {
        id: 'recruitment',
        category: 'recruitment',
        categoryLabel: 'Rekrutmen & Talenta',
        title: 'Laporan Rekrutmen & Penilaian',
        description: 'Rekapitulasi tahapan seleksi lowongan kerja, data pelamar/kandidat ATS, hasil tes assessment, nilai wawancara, dan status kelulusan.',
        icon: Briefcase,
        color: 'bg-sky-50 text-sky-600 border-sky-200',
        badge: 'ATS & Evaluasi',
        stats: 'Pipeline Seleksi & Nilai Kandidat',
        directRoute: '/screening',
        directRouteLabel: 'Rekrutmen ATS'
      },
      {
        id: 'kpi',
        category: 'recruitment',
        categoryLabel: 'Rekrutmen & Talenta',
        title: 'Laporan Penilaian Kinerja (KPI)',
        description: 'Rekapitulasi pencapaian Key Performance Indicators seluruh departemen, rasio realisasi target, dan akumulasi skor evaluasi kinerja.',
        icon: TrendingUp,
        color: 'bg-rose-50 text-rose-600 border-rose-200',
        badge: 'Performa Kerja',
        stats: 'Skor Evaluasi & Bobot Target',
        directRoute: '/kpi',
        directRouteLabel: 'Buka KPI'
      },

      // General Affairs (GA) & Analisa
      {
        id: 'ga_assets',
        category: 'ga',
        categoryLabel: 'General Affairs (GA)',
        title: 'Laporan Analisa Aset & Inventaris GA',
        description: 'Rekapitulasi aset fisik kantor (elektronik, furniture, kendaraan, mesin), nilai buku perolehan, kondisi kelayakan, dan ruangan penempatan.',
        icon: Boxes,
        color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
        badge: 'Aset Kantor',
        stats: 'Inventaris & Nilai Depresiasi',
        directRoute: '/ga/aset',
        directRouteLabel: 'Inventaris Aset'
      },
      {
        id: 'ga_supplies',
        category: 'ga',
        categoryLabel: 'General Affairs (GA)',
        title: 'Laporan Logistik & ATK (Office Supplies)',
        description: 'Rekapitulasi pergerakan barang habis pakai / ATK kantor, kuantitas stok saat ini vs safety stock, dan daftar Purchase Request pengadaan.',
        icon: PackageCheck,
        color: 'bg-orange-50 text-orange-600 border-orange-200',
        badge: 'Pengadaan & Logistik',
        stats: 'Safety Stock & Purchase Request',
        directRoute: '/ga/atk',
        directRouteLabel: 'Kelola ATK'
      },
      {
        id: 'ga_facility_vendor',
        category: 'ga',
        categoryLabel: 'General Affairs (GA)',
        title: 'Laporan Fasilitas Gedung & Vendor GA',
        description: 'Rekapitulasi pemeliharaan berkala sarana gedung (AC, Lift, Genset, Sanitasi), tiket perbaikan fasilitas, dan daftar kontrak rekanan vendor.',
        icon: Wrench,
        color: 'bg-slate-100 text-slate-700 border-slate-300',
        badge: 'Fasilitas & Vendor',
        stats: 'Maintenance & Tiket Keluhan',
        directRoute: '/ga/fasilitas',
        directRouteLabel: 'Jadwal Fasilitas'
      },
      {
        id: 'ga_guest_mail',
        category: 'ga',
        categoryLabel: 'General Affairs (GA)',
        title: 'Laporan Buku Tamu & Surat Menyurat GA',
        description: 'Rekapitulasi log pengunjung/tamu kantor, agenda surat masuk & keluar perusahaan, nomor resi ekspedisi, serta status serah terima dokumen.',
        icon: MailCheck,
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        badge: 'Administrasi GA',
        stats: 'Buku Tamu & Ekspedisi Surat',
        directRoute: '/ga/buku-tamu',
        directRouteLabel: 'Buku Tamu & Surat'
      }
    ];

    return list.filter(item => {
      // Saring modul rekrutmen jika dinonaktifkan
      if (item.category === 'recruitment' && !modulesConfig.enableRecruitment) {
        return false;
      }
      // Saring modul GA jika dinonaktifkan
      if (item.category === 'ga' && !modulesConfig.enableGeneralAffairs) {
        return false;
      }
      return true;
    });
  }, [modulesConfig]);

    // Data Fetcher untuk Ekspor Laporan
  const fetchReportData = async (type: string): Promise<Record<string, any>[] | null> => {
    let exportData: Record<string, any>[] = [];

    try {
      if (type === 'employee') {
        const employees = await db.employees.toArray();
        if (employees.length === 0) {
          alert('Belum ada data karyawan di sistem.');
          return null;
        }
        exportData = employees.map(emp => ({
          'ID Karyawan / NIP': emp.employeeId || emp.id,
          'Nama Lengkap': emp.fullName,
          'Email': emp.email,
          'Nomor Telepon': emp.phone || '-',
          'Status Kepegawaian': emp.status,
          'ID Departemen': emp.departmentId,
          'ID Posisi / Jabatan': emp.positionId,
          'Tanggal Bergabung': emp.joinDate,
          'Gaji Pokok (Rp)': emp.basicSalary,
          'Status Wajib Pajak': emp.taxStatus || 'TK/0'
        }));
      } 
      else if (type === 'payroll') {
        const payrolls = await db.payrollRecords.toArray();
        const employees = await db.employees.toArray();
        const empMap = new Map(employees.map(e => [e.id, e.fullName]));

        if (payrolls.length === 0) {
          alert('Belum ada data catatan payroll.');
          return null;
        }
        exportData = payrolls.map(rec => ({
          'ID Catatan': rec.id,
          'ID Periode': rec.payrollPeriodId,
          'ID Karyawan': rec.employeeId,
          'Nama Karyawan': empMap.get(rec.employeeId) || 'Pegawai',
          'Gaji Pokok (Rp)': rec.basicSalary,
          'Tunjangan Tetap (Rp)': rec.fixedAllowance,
          'Tunjangan Variabel (Rp)': rec.variableAllowance,
          'Lembur (Rp)': rec.overtime,
          'Bonus / Komisi (Rp)': (rec.bonus || 0) + (rec.commission || 0),
          'Gaji Bruto (Rp)': rec.grossSalary,
          'Potongan Keterlambatan (Rp)': rec.lateDeduction,
          'Potongan Kehadiran (Rp)': rec.absenceDeduction,
          'Potongan BPJS (Rp)': rec.bpjs,
          'Potongan PPh 21 (Rp)': rec.tax,
          'Total Potongan (Rp)': rec.totalDeduction,
          'Gaji Bersih / Neto (Rp)': rec.netSalary,
          'Status Pembayaran': rec.status
        }));
      } 
      else if (type === 'attendance') {
        const attendance = await db.attendance.toArray();
        const employees = await db.employees.toArray();
        const empMap = new Map(employees.map(e => [e.id, e.fullName]));

        if (attendance.length === 0) {
          alert('Belum ada data riwayat presensi.');
          return null;
        }
        exportData = attendance.map(att => ({
          'Tanggal': att.date,
          'ID Karyawan': att.employeeId,
          'Nama Karyawan': empMap.get(att.employeeId) || 'Pegawai',
          'Jam Masuk': att.checkIn || '-',
          'Jam Pulang': att.checkOut || '-',
          'Status Hadir': att.status,
          'Menit Terlambat': att.lateMinutes || 0,
          'Catatan / Alasan': att.notes || '-'
        }));
      } 
      else if (type === 'kpi') {
        const kpi = await db.kpiResults.toArray();
        const employees = await db.employees.toArray();
        const empMap = new Map(employees.map(e => [e.id, e.fullName]));

        if (kpi.length === 0) {
          alert('Belum ada data evaluasi KPI.');
          return null;
        }
        exportData = kpi.map(res => ({
          'ID Hasil': res.id,
          'ID Periode': res.periodId,
          'ID Karyawan': res.employeeId,
          'Nama Karyawan': empMap.get(res.employeeId) || 'Pegawai',
          'ID Template': res.templateId || '-',
          'Skor Akhir KPI': res.score,
          'Predikat / Grade': res.grade || res.gradeLabel || '-',
          'Tanggal Evaluasi': res.evaluatedAt || '-'
        }));
      }
      else if (type === 'allowance_deduction') {
        const payrolls = await db.payrollRecords.toArray();
        const employees = await db.employees.toArray();
        const empMap = new Map(employees.map(e => [e.id, e]));

        if (payrolls.length > 0) {
          exportData = payrolls.map(rec => {
            const emp = empMap.get(rec.employeeId);
            return {
              'ID Karyawan': rec.employeeId,
              'Nama Pegawai': emp?.fullName || 'Karyawan',
              'Departemen': emp?.departmentId || '-',
              'Gaji Pokok (Rp)': rec.basicSalary,
              'Tunjangan Tetap (Rp)': rec.fixedAllowance,
              'Tunjangan Variabel (Rp)': rec.variableAllowance,
              'Uang Lembur (Rp)': rec.overtime,
              'Bonus & Komisi (Rp)': (rec.bonus || 0) + (rec.commission || 0),
              'Total Seluruh Tunjangan (Rp)': rec.fixedAllowance + rec.variableAllowance + (rec.bonus || 0) + (rec.commission || 0) + (rec.otherIncome || 0),
              'Potongan Terlambat (Rp)': rec.lateDeduction,
              'Potongan Absen (Rp)': rec.absenceDeduction,
              'Potongan BPJS Ketenagakerjaan & Kesehatan (Rp)': rec.bpjs,
              'Potongan Pajak PPh 21 (Rp)': rec.tax,
              'Potongan Kasbon / Pinjaman (Rp)': (rec.loan || 0) + (rec.advance || 0),
              'Potongan Lainnya (Rp)': rec.otherDeduction || 0,
              'Total Potongan (Rp)': rec.totalDeduction,
              'Gaji Bersih Diterima (Rp)': rec.netSalary
            };
          });
        } else if (employees.length > 0) {
          exportData = employees.map(emp => ({
            'ID Karyawan': emp.employeeId || emp.id,
            'Nama Pegawai': emp.fullName,
            'Departemen': emp.departmentId || '-',
            'Gaji Pokok (Rp)': emp.basicSalary,
            'Estimasi Tunjangan Tetap (Rp)': Math.round(emp.basicSalary * 0.15),
            'Estimasi Tunjangan Variabel (Rp)': Math.round(emp.basicSalary * 0.1),
            'Iuran BPJS Ketenagakerjaan (3%)': Math.round(emp.basicSalary * 0.03),
            'Iuran BPJS Kesehatan (1%)': Math.round(emp.basicSalary * 0.01),
            'Status Pajak': emp.taxStatus || 'TK/0',
            'Keterangan': 'Data estimasi master karyawan (periode payroll belum dikalkulasi)'
          }));
        } else {
          alert('Belum ada data karyawan atau payroll untuk kalkulasi tunjangan & potongan.');
          return null;
        }
      }
      else if (type === 'recruitment') {
        const vacancies = getStoredVacancies();
        if (vacancies.length === 0) {
          alert('Belum ada data lowongan atau pelamar di modul rekrutmen.');
          return null;
        }

        const candidateRows: Record<string, any>[] = [];
        for (const vac of vacancies) {
          const candidates = getStoredCandidates(vac.id);
          if (candidates.length > 0) {
            candidates.forEach(cand => {
              candidateRows.push({
                'ID Lowongan': vac.id,
                'Judul Lowongan': vac.jobTitle,
                'Departemen': vac.department,
                'ID Pelamar': cand.id,
                'Nama Pelamar': cand.name,
                'Email': cand.contactEmail,
                'No WhatsApp': cand.contactPhone,
                'Status Proses': cand.status,
                'Skor Kecocokan ATS (%)': cand.matchScore || '-',
                'Total Skor Match': cand.atsMatchBreakdown?.totalScore || '-',
                'Tanggal Unggah / Melamar': cand.uploadedAt || '-',
                'Keterangan Seleksi': cand.status === 'Scored' ? 'Sudah Dinilai' : 'Menunggu Review'
              });
            });
          } else {
            candidateRows.push({
              'ID Lowongan': vac.id,
              'Judul Lowongan': vac.jobTitle,
              'Departemen': vac.department,
              'ID Pelamar': '-',
              'Nama Pelamar': '(Belum ada pelamar)',
              'Email': '-',
              'No WhatsApp': '-',
              'Status Proses': 'Open Vacancy',
              'Skor Kecocokan ATS (%)': '-',
              'Total Skor Match': '-',
              'Tanggal Unggah / Melamar': vac.applicationDeadline || '-',
              'Keterangan Seleksi': 'Lowongan Aktif'
            });
          }
        }
        exportData = candidateRows;
      }
      else if (type === 'schedule') {
        const schedules = await db.shiftSchedules.toArray();
        const employees = await db.employees.toArray();
        const empMap = new Map(employees.map(e => [e.id, e.fullName]));

        if (schedules.length > 0) {
          exportData = schedules.map(sch => ({
            'ID Jadwal': sch.id,
            'ID Karyawan': sch.employeeId,
            'Nama Karyawan': empMap.get(sch.employeeId) || 'Pegawai',
            'Tanggal Penugasan': sch.date,
            'ID Shift': sch.shiftId,
            'Nama Shift': sch.shiftName,
            'Jam Masuk': sch.startTime || '-',
            'Jam Pulang': sch.endTime || '-',
            'Status Extra Shift': sch.isExtraShift ? 'Ya' : 'Tidak',
            'Hasil Tukar Shift': sch.isSwapResult ? 'Ya' : 'Tidak',
            'Catatan': sch.notes || '-'
          }));
        } else if (employees.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          exportData = employees.map(emp => ({
            'ID Karyawan': emp.employeeId || emp.id,
            'Nama Karyawan': emp.fullName,
            'Tanggal Penugasan': today,
            'Skema Kerja': 'Reguler Non-Shift',
            'Hari Kerja': 'Senin - Jumat',
            'Jam Kerja': '08:00 - 17:00 (Istirahat 12:00 - 13:00)',
            'Status Penugasan': 'Aktif Terjadwal'
          }));
        } else {
          alert('Belum ada data jadwal atau karyawan.');
          return null;
        }
      }
      else if (type === 'company_regulation') {
        const regRows: Record<string, any>[] = [];
        COMPANY_REGULATION_DATA.forEach(chap => {
          chap.articles.forEach(art => {
            regRows.push({
              'Nomor BAB': chap.chapterNumber,
              'Judul BAB': chap.title,
              'Nomor Pasal': `Pasal ${art.number}`,
              'Judul Ketentuan': art.title,
              'Dasar Hukum Regulasi': art.legalReference,
              'Catatan Implementasi HR': art.hrImplementationNote || '-',
              'Ringkasan Ketentuan': art.content.replace(/\n/g, ' ')
            });
          });
        });
        exportData = regRows;
      }
      else if (type === 'ga_assets') {
        const assets = GAStorage.getAssets();
        if (assets.length === 0) {
          alert('Belum ada data aset kantor di modul General Affairs.');
          return null;
        }
        exportData = assets.map(ast => ({
          'Kode Aset': ast.assetCode,
          'Nama Aset / Inventaris': ast.name,
          'Kategori': ast.category,
          'Lokasi Ruangan': ast.location,
          'Kondisi Fisik': ast.condition,
          'Tanggal Perolehan': ast.purchaseDate,
          'Biaya Perolehan (Rp)': ast.purchaseCost,
          'Nilai Saat Ini (Rp)': ast.currentValue,
          'Penanggung Jawab': ast.assignedToEmployeeName || 'General Affairs',
          'Status Operasional': ast.status
        }));
      }
      else if (type === 'ga_supplies') {
        const supplies = GAStorage.getSupplies();
        if (supplies.length === 0) {
          alert('Belum ada data inventaris logistik / ATK.');
          return null;
        }
        exportData = supplies.map(sup => ({
          'Kode Barang': sup.code,
          'Nama Barang ATK': sup.name,
          'Kategori': sup.category,
          'Stok Tersedia Saat Ini': sup.currentStock,
          'Batas Minimum (Safety Stock)': sup.minStockLevel,
          'Satuan': sup.unit,
          'Estimasi Harga Satuan (Rp)': sup.unitPrice,
          'Nilai Total Stok (Rp)': sup.currentStock * sup.unitPrice,
          'Status Kebutuhan Reorder': sup.currentStock <= sup.minStockLevel ? 'Segera Pengadaan (Kritis)' : 'Aman'
        }));
      }
      else if (type === 'ga_facility_vendor') {
        const maintenance = GAStorage.getMaintenanceSchedules();
        const tickets = GAStorage.getMaintenanceTickets();

        if (maintenance.length === 0 && tickets.length === 0) {
          alert('Belum ada data pemeliharaan fasilitas kantor.');
          return null;
        }
        exportData = maintenance.map(maint => ({
          'Fasilitas / Peralatan Gedung': maint.title,
          'Kategori Fasilitas': maint.facilityType,
          'Lokasi': maint.location,
          'Frekuensi': maint.frequency,
          'Jadwal Terakhir': maint.lastDoneDate || '-',
          'Jadwal Berikutnya': maint.nextDueDate || maint.scheduledDate,
          'Teknisi / Vendor Pelaksana': maint.technicianVendor || '-',
          'Estimasi Biaya Servis (Rp)': maint.estimatedCost || 0,
          'Status Kesiapan': maint.status
        }));
      }
      else if (type === 'ga_guest_mail') {
        const guests = GAStorage.getGuests();
        const mails = GAStorage.getMails();

        if (guests.length === 0 && mails.length === 0) {
          alert('Belum ada data buku tamu atau surat masuk/keluar di General Affairs.');
          return null;
        }

        const rows: Record<string, any>[] = [];
        guests.forEach(g => {
          rows.push({
            'Kategori Administrasi': 'Kunjungan Tamu Kantor',
            'No Pass / ID Resi': g.visitorPassNumber || '-',
            'Nama Tamu / Pihak': g.visitorName,
            'Instansi / Perusahaan': g.institution || '-',
            'Kontak / Telepon': g.phone || '-',
            'Tujuan Departemen': g.destinationDepartment,
            'PIC / Penerima': g.destinationPerson,
            'Keperluan / Perihal': g.purpose,
            'Waktu Masuk / Tanggal': g.checkInTime,
            'Waktu Selesai': g.checkOutTime || '-',
            'Status': g.status === 'CHECKED_IN' ? 'Sedang Berkunjung' : 'Selesai (Check-Out)'
          });
        });

        mails.forEach(m => {
          rows.push({
            'Kategori Administrasi': m.type.replace(/_/g, ' '),
            'No Pass / ID Resi': m.referenceNumber,
            'Nama Tamu / Pihak': m.senderOrRecipient,
            'Instansi / Perusahaan': m.courierService || '-',
            'Kontak / Telepon': '-',
            'Tujuan Departemen': 'Resepsionis GA',
            'PIC / Penerima': m.recipientEmployeeName,
            'Keperluan / Perihal': m.subject,
            'Waktu Masuk / Tanggal': m.date,
            'Waktu Selesai': m.receivedAt || '-',
            'Status': m.receivedStatus.replace(/_/g, ' ')
          });
        });

        exportData = rows;
      }

      if (exportData.length === 0) {
        alert(`Belum ada data yang tersedia untuk laporan ${type}.`);
        return null;
      }

      return exportData;
    } catch (err) {
      console.error('Fetch report error:', err);
      alert('Terjadi kesalahan saat memproses data laporan.');
      return null;
    }
  };

  // Handler Download Format: PDF, CSV, Docs
  const handleDownloadReport = async (report: ReportItem, format: 'pdf' | 'csv' | 'docs') => {
    setIsExportingFormat(format);
    try {
      const exportData = await fetchReportData(report.id);
      if (!exportData || exportData.length === 0) {
        return;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const filenameBase = `laporan_${report.id}_${todayStr}`;

      if (format === 'csv') {
        const csv = Papa.unparse(exportData);
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${filenameBase}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } 
      else if (format === 'pdf') {
        const columns = Object.keys(exportData[0]);
        const rows = exportData.map(row => columns.map(col => String(row[col] ?? '-')));
        const isLandscape = columns.length > 5;
        
        const doc = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Header Title
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text(report.title.toUpperCase(), 14, 15);

        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.text(`HRMatrix Human Resource & GA System • Tanggal Unduh: ${dateStr} • Total Data: ${exportData.length} baris`, 14, 21);

        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 25,
          styles: {
            fontSize: 7.5,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          theme: 'grid'
        });

        doc.save(`${filenameBase}.pdf`);
      } 
      else if (format === 'docs') {
        const columns = Object.keys(exportData[0]);
        const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const htmlContent = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset="utf-8">
            <title>${report.title}</title>
            <style>
              body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; margin: 24px; }
              h1 { font-size: 16pt; color: #1e40af; margin-bottom: 4px; }
              p.subtitle { font-size: 9pt; color: #64748b; margin-top: 0; margin-bottom: 18px; }
              table { border-collapse: collapse; width: 100%; margin-top: 12px; font-size: 9.5pt; }
              th { background-color: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; padding: 7px 10px; text-align: left; }
              td { border: 1px solid #cbd5e1; padding: 6px 10px; color: #334155; }
              tr:nth-child(even) { background-color: #f8fafc; }
              .footer-note { margin-top: 24px; font-size: 8.5pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
            </style>
          </head>
          <body>
            <h1>${report.title}</h1>
            <p class="subtitle">HRMatrix HRIS & General Affairs System • Tanggal Ekspor: ${dateStr} • Jumlah Baris: ${exportData.length}</p>
            <table>
              <thead>
                <tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${exportData.map(row => `<tr>${columns.map(col => `<td>${row[col] !== undefined && row[col] !== null ? String(row[col]) : '-'}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
            <div class="footer-note">Dicetak otomatis dari Sistem HRMatrix. Dokumen ini sah dan dapat dipergunakan untuk arsip internal perusahaan.</div>
          </body>
          </html>
        `;
        const blob = new Blob(['\uFEFF' + htmlContent], { type: 'application/msword;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${filenameBase}.doc`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setDownloadSuccessMessage(`Laporan ${report.title} (${format.toUpperCase()}) berhasil diekspor (${exportData.length} baris).`);
      setTimeout(() => setDownloadSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Export error:', err);
      alert(`Terjadi kesalahan saat memproses ekspor format ${format.toUpperCase()}.`);
    } finally {
      setIsExportingFormat(null);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Download Alert Notification */}
      {downloadSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 4 Cards Ringkasan Langsung (Tanpa Pembungkus & Tanpa Judul/Deskripsi/Tombol) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Katalog Laporan</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-bold text-slate-900 block">{allReports.length} Format</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Siap diekspor ke CSV / Excel</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Modul HR & Payroll</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-bold text-emerald-600 block">Aktif</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Karyawan, Tunjangan & Jadwal</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">General Affairs (GA)</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${modulesConfig.enableGeneralAffairs ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-slate-400'}`}>
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className={`text-xl font-bold block ${modulesConfig.enableGeneralAffairs ? 'text-cyan-600' : 'text-slate-400'}`}>
            {modulesConfig.enableGeneralAffairs ? 'Aktif' : 'Nonaktif'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {modulesConfig.enableGeneralAffairs ? 'Aset, ATK & Fasilitas' : 'Dapat diaktifkan di Settings'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Integrasi e-Portal</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-bold text-purple-600 block">{totalActivePortals} Portal</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Kemenaker, BPJS, DJP, OSS, dsb</span>
        </div>
      </div>

      {/* Portal Kelembagaan Negara & Kepatuhan Hukum (Frameless Section) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Portal Kelembagaan Negara & Kepatuhan Hukum
          </h2>

          <button
            type="button"
            onClick={() => setShowAllPortals(prev => !prev)}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <span>{showAllPortals ? 'Tampilkan Lebih Sedikit' : 'Lihat Selengkapnya'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showAllPortals ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {displayedPortals.map(portal => (
            <button
              key={portal.id}
              type="button"
              onClick={() => navigate(portal.href)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 bg-white transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
                <PortalNavLogo logoKey={portal.logo} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                  {portal.name}
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  {portal.sub}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Laporan Internal Perusahaan */}
      <div className="pt-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Laporan Internal Perusahaan
        </h2>
      </div>

            {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allReports.map((report) => {
          const Icon = report.icon;
          return (
            <div 
              key={report.id} 
              onClick={() => setSelectedReportForExport(report)}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xs bg-white transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${report.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>
                    </div>
                  </div>
                  <ArrowUpRight 
                    className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 mt-0.5" 
                    strokeWidth={1.5} 
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Ekspor Laporan: PDF, CSV, Docs */}
      <Modal
        isOpen={!!selectedReportForExport}
        onClose={() => setSelectedReportForExport(null)}
        contentClassName="sm:max-w-lg"
      >
        {selectedReportForExport && (
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${selectedReportForExport.color}`}>
                  {React.createElement(selectedReportForExport.icon, { className: 'w-4 h-4' })}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                    {selectedReportForExport.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Pilih format berkas untuk mengunduh laporan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReportForExport(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Tutup"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-4 sm:p-5 space-y-3">
              {/* Opsi 1: PDF */}
              <div 
                onClick={() => handleDownloadReport(selectedReportForExport, 'pdf')}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-3xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-rose-700 transition-colors">
                        Dokumen PDF (.pdf)
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                        PDF
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      Format siap cetak resmi berlogo HRMatrix dengan tabel terstruktur
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isExportingFormat !== null}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {isExportingFormat === 'pdf' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Unduh</span>
                </button>
              </div>

              {/* Opsi 2: CSV */}
              <div 
                onClick={() => handleDownloadReport(selectedReportForExport, 'csv')}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-3xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Spreadsheet CSV (.csv)
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        Excel / Sheets
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      Data mentah terstruktur untuk Microsoft Excel atau Google Sheets
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isExportingFormat !== null}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {isExportingFormat === 'csv' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Unduh</span>
                </button>
              </div>

              {/* Opsi 3: Docs */}
              <div 
                onClick={() => handleDownloadReport(selectedReportForExport, 'docs')}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-3xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                        Dokumen Word / Docs (.doc)
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        Word / Docs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      Format dokumen teks yang dapat diedit di Word atau Google Docs
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isExportingFormat !== null}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {isExportingFormat === 'docs' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Unduh</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Reports;

