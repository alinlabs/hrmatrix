import { Chapter } from './ebook-types';

export const bab5Kpi: Chapter = {
  id: 'manajemen-kpi',
  number: 5,
  title: 'Manajemen Kinerja (KPI), Evaluasi & Performance Grading',
  subtitle: 'Merancang indikator kinerja objektif (SMART), formula indikator positif vs negatif, dan skema penentuan Grade A-D',
  iconName: 'Target',
  category: 'Performa',
  readingTime: '12 menit',
  summary: 'Mengevaluasi kinerja manusia adalah salah satu tugas HR yang paling sensitif sekaligus paling rawan memicu konflik di tempat kerja. Bayangkan: tanpa angka dan kriteria terukur yang disepakati sejak awal, penilaian kinerja sangat mudah bergeser menjadi ajang "suka atau tidak suka" (*like and dislike*), prasangka emosional, atau bias persepsi seperti *Halo Effect* dan *Recency Bias*. Modul Key Performance Indicator (KPI) di HRMatrix hadir untuk membantumu membangun sistem evaluasi yang transparan, adil, objektif, dan terukur secara matematis. Di bab ini, kita akan mempelajari prinsip penyusunan target kinerja hingga penentuan predikat Grade A s.d. D.',
  primaryPath: '/kpi',
  subsections: [
    {
      id: 'konsep-kpi',
      title: 'Konsep Utama Evaluasi Kinerja & Menghilangkan Bias Penilaian',
      description: 'Mengapa perusahaanmu membutuhkan indikator terukur untuk mendorong pertumbuhan bisnis dan motivasi tim?',
      uiLocation: 'EBook HRMatrix → Pengenalan Modul /kpi',
      details: [
        '**Pernahkah kamu melihat seorang karyawan yang bekerja sangat keras sepanjang tahun, tapi mendadak dapat nilai jelek hanya karena di minggu penilaian ia membuat kesalahan kecil?**',
        'Inilah fenomena berbahaya yang dinamakan **Recency Bias** kecenderungan atasan hanya mengingat kejadian yang baru saja terjadi. Ada lagi **Halo Effect**, yaitu kecenderungan menilai seseorang secara berlebihan hanya karena ia pandai berbicara atau dekat secara personal dengan atasan.',
        '**KPI sebagai Solusi Objektivitas:** Key Performance Indicator (KPI) adalah alat pengukur terstruktur untuk menilai pencapaian hasil kerja individu dan tim terhadap sasaran strategis perusahaan secara obyektif berdasarkan fakta data.',
        '**Regulasi & Payung Hukum Resmi:** Sesuai **Permenaker No. 1 Tahun 2017 tentang Struktur dan Skala Upah**, evaluasi kinerja yang objektif menjadi dasar resmi pemberian insentif, bonus tahunan, kenaikan berkala, promosi jabatan, maupun tindakan demosi.',
        '**Studi Kasus Nyata di Lapangan:** Tanpa KPI terukur, Manajer menilai Staf A buruk karena terlambat 1 kali di minggu penilaian. Namun dengan data KPI di HRMatrix, terbukti bahwa pencapaian penjualan Staf A sepanjang tahun mencapai 120% dari target! Penilaian Staf A pun selamat secara adil.',
        '**Penerapan di HRMatrix:** Melalui modul **KPI (Route: `/kpi`)**, penilaian kinerja dikelola secara transparan, akuntabel, dan siap dijadikan bahan dialog kinerja 1-on-1 antara atasan dan bawahan.'
      ]
    },
    {
      id: 'katalog-kpi',
      title: 'Menyusun Target Berbasis Metodologi SMART & Bobot Total 100%',
      description: 'Langkah praktis merumuskan indikator kerja yang spesifik, relevan, dan terukur secara matematis.',
      uiLocation: 'Halaman KPI (Route: /kpi) & Katalog Indikator Standar',
      details: [
        '**Mengapa target seperti "Bekerja dengan rajin dan ramah" adalah contoh target kinerja yang buruk?**',
        'Karena kata "rajin" dan "ramah" bersifat ambigu dan tidak bisa dihitung nilainya dengan rumus matematika!',
        '**Prinsip Metodologi S.M.A.R.T:** Setiap indikator KPI yang kamu susun wajib memenuhi kriteria baku:',
        '   - **Specific (Spesifik):** Sasaran kerja harus jelas dan fokus (misal: *Menjual produk X*).',
        '   - **Measurable (Terukur):** Wajib berbentuk angka/kuantitas (misal: *Rp 500.000.000 atau 100 unit*).',
        '   - **Achievable (Dapat Dicapai):** Target harus masuk akal, tidak terlalu rendah dan tidak mustahil.',
        '   - **Relevant (Relevan):** Sesuai dengan uraian tanggung jawab di Job Description posisi bersangkutan.',
        '   - **Time-bound (Tenggat Waktu):** Memiliki batas waktu pencapaian (misal: *Periode Bulanan atau Triwulan*).',
        '**Aturan Wajib Akumulasi Bobot 100%:** Setiap jabatan disarankan memiliki 3 hingga 5 indikator utama. Jumlah total persentase bobot dari seluruh indikator tersebut **WAKTU TEPAT 100%**.',
        '**Contoh Distribusi Bobot Staf Penjualan:** Total Penjualan (Bobot 50%) + Kepuasan Pelanggan (Bobot 30%) + Kedisiplinan Waktu (Bobot 20%) = **100%**.',
        '**Eksekusi di HRMatrix:** Kamu bisa memasukkan nama indikator, satuan unit (persen/rupiah/unit/hari), target, dan bobot persentase di modul KPI (Route: `/kpi`). Sistem akan memverifikasi agar akumulasi bobotnya pas 100%.'
      ]
    },
    {
      id: 'formula-kpi-positif-negatif',
      title: 'Membedah Rumus Indikator Positif vs Indikator Negatif',
      description: 'Bagaimana menghitung skor kinerja untuk target yang makin tinggi makin bagus vs target yang makin rendah makin bagus?',
      uiLocation: 'Halaman Detail Penilaian KPI Karyawan',
      formulaId: 'formula-kpi',
      details: [
        '**Tahukah kamu bahwa menggunakan rumus hitung biasa untuk target komplain pelanggan akan menghasilkan logika matematika yang salah besar?**',
        'Jika kamu menggunakan rumus standar pada target komplain, makin banyak komplain yang didapat karyawan justru akan membuat skor kinerjanya makin tinggi! Lucu dan salah, bukan?',
        '**Inilah Mengapa Indikator Dibagi Menjadi 2 Tipe:**',
        '   - **1. Indikator Positif (*Higher is Better*):** Digunakan untuk target pertumbuhan, penjualan, atau efisiensi di mana makin besar realisasi angka pencapaian, makin bagus skornya.',
        '     `Skor Indikator Positif = (Realisasi ÷ Target) × 100%`',
        '   - **2. Indikator Negatif (*Lower is Better*):** Digunakan untuk minimasi kesalahan, kecelakaan kerja, cacat produk, atau komplain di mana makin kecil realisasi angka kesalahan, makin bagus skor kinerjanya!',
        '     `Skor Indikator Negatif = (Target ÷ Realisasi) × 100%`',
        '     *(Catatan: Skor indikator negatif biasanya di-cap/dibatasi maksimal 120%-150% agar pencapaian ekstrem tidak merusak bobot total)*.',
        '**Rumus Nilai Akhir KPI Total:**',
        '   `Nilai Akhir KPI = Akumulasi dari (Skor Indikator × Bobot Persentase Indikator)`',
        '**Contoh Perhitungan Kasus Nyata:** Karyawan F memiliki 2 Indikator:',
        '   - Indikator 1 (Positif, Bobot 60%): Target Penjualan 100 unit, Realisasi 110 unit → Skor = `(110 ÷ 100) × 100% = 110%`. Poin Bobot = `110% × 60% = 66.0`.',
        '   - Indikator 2 (Negatif, Bobot 40%): Target Maksimal 5 Komplain, Realisasi 2 Komplain → Skor = `(5 ÷ 2) × 100% = 250%` (Di-cap maksimal 120%). Poin Bobot = `120% × 40% = 48.0`.',
        '   - **Total Skor KPI Akhir:** `66.0 + 48.0 = 114.0` (Sangat Baik / Grade A).',
        '**Otomasi di HRMatrix:** HRMatrix secara cerdas memproses tipe indikator positif dan negatif secara otomatis di halaman penilaian KPI (Route: `/kpi`).'
      ],
      formula: {
        expression: 'Nilai Akhir KPI = Akumulasi dari (Skor Indikator × Bobot Persentase Indikator)',
        explanation: 'Skor Indikator Positif = (Realisasi ÷ Target) × 100% | Skor Indikator Negatif = (Target ÷ Realisasi) × 100%',
        variables: [
          { name: 'Target', desc: 'Angka sasaran awal yang disepakati bersama' },
          { name: 'Realisasi', desc: 'Angka pencapaian riil aktual di lapangan' },
          { name: 'Bobot', desc: 'Tingkat kepentingan indikator (total seluruh indikator = 100%)' }
        ],
        regulationBasis: 'Kerangka Kerja Manajemen Kinerja & Evaluasi SDM Modern',
        exampleCase: {
          scenario: 'Karyawan F memiliki 2 Indikator. Indikator 1: Penjualan (Positif, Bobot 60%, Target 100, Realisasi 110). Indikator 2: Komplain (Negatif, Bobot 40%, Target 5, Realisasi 2, di-cap 120%).',
          calculationSteps: [
            '1. Skor Indikator 1 (Positif) = (110 ÷ 100) × 100% = 110%. Poin Bobot = 110% × 60% = 66.0',
            '2. Skor Indikator 2 (Negatif) = (5 ÷ 2) × 100% = 250% → Di-cap 120%. Poin Bobot = 120% × 40% = 48.0',
            '3. Total Skor KPI Akhir = 66.0 + 48.0 = 114.0'
          ],
          finalResult: 'Karyawan F meraih Skor Akhir 114.0 (Mencapai Predikat Grade A)'
        }
      }
    },
    {
      id: 'skala-predikat-grading',
      title: 'Klasifikasi Predikat Kinerja (Grade A s.d. D) & Tindak Lanjut PIP',
      description: 'Menerjemahkan skor angka KPI menjadi predikat kualitatif yang menentukan insentif, bonus, promosi, atau program perbaikan kerja.',
      uiLocation: 'Laporan Performa KPI & Pengaturan Skala Grade',
      details: [
        '**Apa yang harus kamu lakukan jika seorang karyawan secara konsisten mendapatkan nilai KPI di bawah 60%? Apakah boleh langsung di-PHK begitu saja?**',
        'Ternyata secara hukum, **TIDAK BOLEH** langsung di-PHK!',
        '**Klasifikasi Predikat Performance Grading:**',
        '   - **Grade A (Sangat Baik / Skor ≥ 90%):** *High Performer*. Berhak atas bonus tertinggi, insentif khusus, dan jalur promosi cepat (*Fast-Track Promotion*).',
        '   - **Grade B (Baik / Skor 75% s.d. 89%):** *Core Performer*. Memenuhi seluruh ekspektasi standar perusahaan.',
        '   - **Grade C (Cukup / Skor 60% s.d. 74%):** Butuh bimbingan, pembinaan, dan mentoring dari atasan langsung.',
        '   - **Grade D (Buruk / Skor < 60%):** *Low Performer*. Wajib mengikuti program perbaikan kinerja tertulis.',
        '**Prosedur Wajib Performance Improvement Plan (PIP):** Berdasarkan **Pasal 52 PP No. 35 Tahun 2021**, karyawan dengan predikat kinerjanya di bawah standar (Grade D) DILARANG langsung di-PHK. Perusahaan WAJIB memberikan masa pembinaan melalui program **PIP (Performance Improvement Plan)** selama 1 hingga 3 bulan dengan target tertulis yang jelas.',
        '**Kapan PHK Kinerja Sah Secara Hukum?** Apabila setelah melewati program PIP dan pembinaan tertulis karyawan tetap tidak mampu mencapai standar minimal, barulah proses PHK Karena Alasan Kinerja dapat dijalankan sesuai koridor hukum.',
        '**Konversi Otomatis di HRMatrix:** HRMatrix mengonversi total skor KPI angka menjadi predikat Grade A-D secara instan pada modul KPI (Route: `/kpi`).'
      ]
    }
  ]
};
