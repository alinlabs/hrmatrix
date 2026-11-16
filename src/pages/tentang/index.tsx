import React from 'react';
import { 
  CheckCircle2, 
  Users, 
  Clock, 
  Calculator, 
  Target 
} from 'lucide-react';
import { PageHeaderTitle } from '../../context/mobile-nav-context';
import { HRMatrixLogo } from '../../components/ui/logo';
import { useCompany } from '../../context/company-context';
import { ContactDeveloperSection } from '../../components/ui/contact-developer-section';

export function TentangPage() {
  const { company } = useCompany();

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      <PageHeaderTitle
        title="Tentang"
        subtitle="Informasi Sistem & Keamanan"
      />

      {/* 1. Identitas Sistem & Hero (Logo di Tengah, Judul di Bawah) */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-blue-50/90 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
          <HRMatrixLogo className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>

        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            HRMatrix
          </h1>
          <p className="text-xs sm:text-sm font-normal text-slate-500">
            Versi 1.0.0 - 2026
          </p>
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed text-center max-w-3xl pt-1">
          <p>
            Sistem Manajemen Sumber Daya Manusia dan Penggajian (HRMS & Payroll) mandiri yang dirancang untuk efisiensi pengelolaan tim kerja di Indonesia.
          </p>
          <p className="text-xs text-slate-400 font-medium text-center">
            Arsitektur Lokal Mandiri • Privasi Penuh • Tanpa Biaya Berlangganan Server
          </p>
        </div>
      </div>

      {/* 2 & 4. Ikhtisar + Privasi & Keamanan Data Lokal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full space-y-2.5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Ikhtisar & Nilai Utama
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal text-justify">
            <p>
              HRMatrix dibangun untuk menjawab tantangan pengelolaan personalia harian bagi bisnis, UMKM, hingga organisasi korporat. Aplikasi ini mengintegrasikan seluruh rantai operasional mulai dari basis data karyawan, pencatatan absensi real-time, penyusunan matriks shift kerja fleksibel, perizinan cuti, hingga perhitungan gaji bersih otomatis sesuai regulasi pajak Indonesia (skema PPh 21 TER dan iuran BPJS).
            </p>
            <p>
              Seluruh data operasional Anda tersimpan secara lokal dan mandiri pada perangkat Anda sendiri, memberikan kendali penuh tanpa dependensi server pihak ketiga atau risiko kebocoran data.
            </p>
          </div>
        </div>

        <div className="h-full space-y-3 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Privasi & Keamanan Data Lokal
          </h2>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal text-justify">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="flex-1">
                <strong className="text-slate-800 font-semibold">Tersimpan di Perangkat Sendiri:</strong> Basis data aplikasi disimpan langsung di dalam browser lokal Anda menggunakan teknologi browser IndexedDB (didukung oleh Dexie.js).
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="flex-1">
                <strong className="text-slate-800 font-semibold">Bebas Koneksi Internet (Offline-Ready):</strong> Sistem dapat dijalankan sepenuhnya tanpa membutuhkan koneksi internet aktif setelah aplikasi dimuat.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="flex-1">
                <strong className="text-slate-800 font-semibold">Pencadangan Mandiri & Portabel:</strong> Anda dapat mengekspor seluruh basis data ke file backup JSON kapan saja melalui menu Database Manager untuk disimpan di flashdisk atau cloud drive pribadi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pilar Fungsional Sistem */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Pilar Fungsional Sistem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Manajemen Karyawan & Struktur
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Pencatatan data induk karyawan, riwayat jabatan, departemen, konfigurasi status pajak (PTKP), dan dokumen pendukung personalia.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Presensi & Roster Shift Kerja
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Pemantauan absensi harian, toleransi jam keterlambatan, matriks roster multi-shift, pertukaran shift kerja, dan jadwal lembur.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900">
              <Calculator className="w-4 h-4 text-blue-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Otomasi Payroll & Pajak
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Kalkulasi upah pokok, tunjangan variabel, upah lembur resmi, potongan iuran BPJS, serta pemotongan PPh 21 TER akurat.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900">
              <Target className="w-4 h-4 text-blue-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Evaluasi KPI & Kinerja
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Penyusunan indikator kinerja individu dan departemen bulanan, penilaian berbobot, serta katalog indikator standar kerja.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Profil Pendiri & Arsitek Sistem (Creator & Founder Profile) */}
      <div 
        className="pt-2 border-t border-slate-100 space-y-3"
        itemScope 
        itemType="https://schema.org/Person"
      >
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Arsitek & Pendiri Sistem
        </h2>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-2xl shrink-0">
              AHP
            </div>
            <div className="space-y-1 flex-1">
              <h3 
                className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
                itemProp="name"
              >
                Alvareza Hilka Pratama
              </h3>
              <p 
                className="text-xs text-blue-600 font-medium"
                itemProp="jobTitle"
              >
                Founder, Creator & Lead Software Architect · HRMatrix Indonesia
              </p>
              <p 
                className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1 text-justify sm:text-left"
                itemProp="description"
              >
                HRMatrix Indonesia diciptakan, dirancang, dan dikembangkan secara independen oleh <strong className="text-slate-900 font-semibold">Alvareza Hilka Pratama</strong> sebagai ekosistem HRIS, Software Payroll, dan General Affair modern berbasis arsitektur lokal-mandiri (Local-First PWA) untuk memberikan kontrol privasi data penuh dan efisiensi operasional bagi dunia usaha di Indonesia.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              Sistem Dirilis & Dikelola Penuh · Hak Cipta Terdaftar
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Alvareza Hilka Pratama © 2026 HRMatrix
            </div>
          </div>
        </div>
      </div>

      {/* 6. Hubungi Pengembang */}
      <div className="pt-2 border-t border-slate-100">
        <ContactDeveloperSection
          title="Hubungi"
          subtitle="Hubungi langsung developer & pencipta HRMatrix untuk konsultasi, bantuan integrasi, atau umpan balik pengembangan:"
        />
      </div>

      {/* 7. Informasi Perusahaan & Footer Ringkas */}
      <div className="pt-2 text-xs text-slate-500 font-normal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="font-semibold text-slate-700">Entitas Organisasi Terhubung:</span>{' '}
          <span className="text-slate-900 font-medium">
            {company?.name ? company.name : 'HRMatrix Demo / Belum Terdaftar'}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} HRMatrix. Hak cipta dilindungi undang-undang.
        </div>
      </div>
    </div>
  );
}
