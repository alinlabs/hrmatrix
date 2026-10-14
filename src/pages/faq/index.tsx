import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Database, 
  ArrowRight,
  Sparkles,
  X,
  Users,
  Clock,
  Calculator,
  Target,
  FileCheck
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';
import { Link } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { ContactDeveloperSection } from '../../components/ui/ContactDeveloperSection';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  // Umum & Data Lokal
  {
    id: 'data-1',
    category: 'Umum & Data',
    question: 'Di mana data karyawan dan presensi disimpan?',
    answer: 'Seluruh data disimpan langsung di dalam browser perangkat Anda menggunakan teknologi IndexedDB lokal (Dexie.js). Tidak ada data pribadi Anda yang dikirim atau diunggah ke server pihak ketiga tanpa seizin Anda.'
  },
  {
    id: 'data-2',
    category: 'Umum & Data',
    question: 'Apakah aplikasi bisa digunakan saat tidak ada jaringan internet?',
    answer: 'Ya. HRMatrix dirancang dengan prinsip Offline-First. Seluruh fitur pencatatan absensi, pengelolaan jadwal, kalkulasi gaji, dan penilaian kinerja tetap berfungsi penuh meskipun tanpa koneksi internet.'
  },
  {
    id: 'data-3',
    category: 'Umum & Data',
    question: 'Bagaimana cara mencegah kehilangan data saat membersihkan riwayat browser?',
    answer: 'Sangat disarankan untuk melakukan pencadangan (backup) berkala melalui menu Database Manager. Klik tombol "Unduh Cadangan JSON" dan simpan file cadangan tersebut di tempat yang aman (misalnya Google Drive atau flashdisk).'
  },

  // Karyawan & Organisasi
  {
    id: 'emp-1',
    category: 'Karyawan',
    question: 'Bagaimana langkah menambahkan data karyawan baru?',
    answer: 'Buka menu "Employees" di bilah navigasi kiri, lalu klik tombol "+ Tambah Karyawan". Masukkan informasi identitas, nomor induk karyawan (NIK), departemen, jabatan, status kerja (Tetap/Kontrak/Probation), serta konfigurasi gaji dan status PTKP pajak.'
  },
  {
    id: 'emp-2',
    category: 'Karyawan',
    question: 'Bisakah mengimpor data karyawan secara massal dari Excel atau CSV?',
    answer: 'Ya. Pada halaman Employees, tersedia tombol "Impor Data". Anda dapat mengunggah file CSV sesuai format template yang telah disediakan untuk memasukkan puluhan karyawan secara sekaligus.'
  },

  // Presensi & Jam Kerja
  {
    id: 'att-1',
    category: 'Presensi & Shift',
    question: 'Bagaimana cara merekam kehadiran karyawan jika tidak memakai mesin sidik jari?',
    answer: 'Pada menu Kehadiran > Presensi, Anda dapat menggunakan tombol "Catat Presensi Manual" atau melakukan check-in cepat karyawan berdasarkan shift harian yang sedang berlaku.'
  },
  {
    id: 'att-2',
    category: 'Presensi & Shift',
    question: 'Bagaimana sistem menghitung status Terlambat pada karyawan?',
    answer: 'Sistem membandingkan jam masuk aktual karyawan dengan batas jam mulai shift ditambah batas toleransi keterlambatan (grace period) yang telah ditentukan di Pengaturan Presensi (misal toleransi 15 menit).'
  },
  {
    id: 'att-3',
    category: 'Presensi & Shift',
    question: 'Bagaimana cara karyawan melakukan tukar shift atau perubahan jadwal kerja?',
    answer: 'Pada tab Jadwal di halaman Kehadiran, klik sel tanggal shift karyawan terkait atau buka menu "Tukar Shift". Anda dapat menukar jadwal antar dua karyawan pada tanggal yang sama maupun antar tanggal berbeda.'
  },

  // Cuti & Saldo
  {
    id: 'cuti-1',
    category: 'Cuti & Izin',
    question: 'Berapa kuota cuti tahunan default untuk setiap karyawan?',
    answer: 'Secara default regulasi ketenagakerjaan Indonesia menetapkan kuota cuti tahunan 12 hari kerja. Anda dapat menyesuaikan kuota ini per karyawan atau per kebijakan cuti khusus (cuti melahirkan, cuti menikah, izin duka) pada tab Kebijakan Cuti.'
  },
  {
    id: 'cuti-2',
    category: 'Cuti & Izin',
    question: 'Apakah pengajuan cuti otomatis mengurangi sisa saldo kuota tahunan?',
    answer: 'Ya, permohonan cuti berbayar yang disetujui akan secara otomatis memotong saldo sisa cuti karyawan yang bersangkutan pada periode tahun berjalan.'
  },

  // Payroll & Penggajian
  {
    id: 'pay-1',
    category: 'Payroll & Pajak',
    question: 'Apakah perhitungan PPh 21 sudah menggunakan aturan terbaru (Tarif Efektif Rata-rata / TER)?',
    answer: 'Ya. HRMatrix telah mengimplementasikan kalkulasi PPh 21 TER sesuai Peraturan Pemerintah (PP) No. 58 Tahun 2023 dan PMK No. 168 Tahun 2023 berdasarkan kategori TER A, B, atau C sesuai status PTKP karyawan.'
  },
  {
    id: 'pay-2',
    category: 'Payroll & Pajak',
    question: 'Bagaimana skema pemotongan iuran BPJS Kesehatan dan BPJS Ketenagakerjaan?',
    answer: 'Perhitungan BPJS memisahkan porsi tanggungan perusahaan dan porsi potongan karyawan secara otomatis sesuai batas upah maksimum (ceiling cap) yang berlaku pada regulasi ketenagakerjaan.'
  },
  {
    id: 'pay-3',
    category: 'Payroll & Pajak',
    question: 'Dapatkah saya mencetak atau membagikan slip gaji dalam format PDF?',
    answer: 'Ya. Di dalam rincian periode penggajian, Anda dapat mengunduh slip gaji individual karyawan berformat PDF resmi yang siap dicetak atau dikirimkan ke karyawan.'
  },

  // KPI & Evaluasi
  {
    id: 'kpi-1',
    category: 'KPI & Kinerja',
    question: 'Bagaimana alur evaluasi KPI bulanan di HRMatrix?',
    answer: 'Mulai dengan membuka periode KPI baru (misal KPI September 2026). Tambahkan indikator kinerja beserta target numerik dan bobot persentase. Di akhir periode, masukkan realisasi capaian untuk memperoleh skor performa akhir berbobot.'
  },
  {
    id: 'kpi-2',
    category: 'KPI & Kinerja',
    question: 'Apakah tersedia contoh indikator KPI siap pakai?',
    answer: 'Ya, HRMatrix menyediakan Katalog KPI Umum berisi puluhan indikator standar industri untuk divisi HR, Keuangan, Operasional, Pemasaran, IT, dan Penjualan.'
  }
];

const CATEGORIES = [
  'Semua',
  'Umum & Data',
  'Karyawan',
  'Presensi & Shift',
  'Cuti & Izin',
  'Payroll & Pajak',
  'KPI & Kinerja'
];

export function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Umum & Data':
        return Database;
      case 'Karyawan & Organisasi':
        return Users;
      case 'Presensi & Shift':
        return Clock;
      case 'Gaji & PPh 21':
        return Calculator;
      case 'KPI & Kinerja':
        return Target;
      default:
        return HelpCircle;
    }
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch = !searchQuery || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Card Icon Search */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          searchQuery
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Pertanyaan FAQ"
        aria-label="Cari Pertanyaan FAQ"
      >
        <Search className="w-4 h-4" />
        {searchQuery && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-12">
      {/* 1. Page Header Title */}
      <PageHeaderTitle
        title="FAQ"
        subtitle="Pusat Bantuan & Solusi"
      />

      {/* 2. Normal Header Action Cards (visible when search is not open) */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {/* 3. Expanded Inline Header Searchbar (SPEC_HEADER_SEARCHBAR_EXPAND.md) */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari pertanyaan bantuan (contoh: PPh 21, cuti, backup, shift)..."
        />
      )}

      {/* Kategori Tab Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-2xs'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Active Search Badge */}
      {searchQuery && (
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs text-slate-500 font-medium">Pencarian Aktif:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            "{searchQuery}"
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="hover:text-blue-900 cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* List Kartu Pertanyaan (Default: Jawaban Tersembunyi, Klik untuk Modal/Bottom Sheet) */}
      <div className="space-y-2.5">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">Tidak ada pertanyaan ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada topik yang cocok dengan pencarian "{searchQuery}". Coba gunakan kata kunci yang lebih umum atau pilih kategori lain.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-2 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          filteredFaqs.map(item => {
            const IconComponent = getCategoryIcon(item.category);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFaq(item)}
                className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 shadow-2xs hover:border-blue-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-3xs">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.question}
                    </h3>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Modal & Bottom Sheet Detail Informasi FAQ */}
      <Modal
        isOpen={Boolean(selectedFaq)}
        onClose={() => setSelectedFaq(null)}
        contentClassName="sm:max-w-lg w-full rounded-t-[1.75rem] sm:rounded-2xl bg-white overflow-hidden shadow-xl"
      >
        {selectedFaq && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Drag Handle Indicator untuk Mobile Bottom Sheet */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

            {/* Header Modal / Sheet */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1.5 flex-1 pr-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedFaq.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {selectedFaq.question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFaq(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Tutup"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Jawaban */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Jawaban & Panduan Solusi
              </h4>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
                {selectedFaq.answer}
              </div>
            </div>

            {/* Tombol Aksi di Bawah */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-slate-100">
              <Link
                to="/ebook"
                onClick={() => setSelectedFaq(null)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                Buka EBook HRMatrix
              </Link>
              <button
                type="button"
                onClick={() => setSelectedFaq(null)}
                className="inline-flex items-center justify-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Kontak Developer */}
      <ContactDeveloperSection 
        title="Hubungi" 
        subtitle="Memerlukan bantuan teknis, konsultasi implementasi, atau pertanyaan seputar aplikasi? Hubungi developer kami:"
        className="pt-2"
      />

      {/* Banner Bantuan Tambahan */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
            Butuh rincian rumus atau panduan operasional lebih lanjut?
          </h4>
          <p className="text-xs text-slate-500 font-normal">
            Buka EBook HRMatrix Digital untuk membaca pedoman alur kerja lengkap dan glosarium istilah HR.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/ebook"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/60 px-3.5 py-2 rounded-lg border border-blue-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            EBook HRMatrix
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>
          <Link
            to="/navigasi-cepat"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 transition-colors"
          >
            Navigasi Cepat
          </Link>
        </div>
      </div>
    </div>
  );
}
