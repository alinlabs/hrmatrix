import { Chapter } from './ebook-types';

export const bab1Arsitektur: Chapter = {
  id: 'arsitektur-dasar',
  number: 1,
  title: 'Pengenalan & Arsitektur HRMatrix',
  subtitle: 'Landasan ilmu HRIS modern, kedaulatan data lokal, serta navigasi eksekutif untuk pengambil keputusan',
  iconName: 'LayoutDashboard',
  category: 'Dasar',
  readingTime: '10 menit',
  summary: 'Selamat datang di EBook HRMatrix! Sebelum kita melangkah lebih jauh ke deretan rumus penggajian atau dokumen legalitas, mari kita sejenak merenungkan pertanyaan sederhana: mengapa urusan HR di perusahaan sering kali terasa sangat melelahkan? Di dunia bisnis modern, HR bukan sekadar divisi yang mengurusi tumpukan kertas absensi atau pembagi amplop gaji. HR adalah fondasi utama pertahanan operasional dan kepatuhan hukum perusahaanmu. Bab ini ditulis secara khusus untuk mengajak kamu memahami bagaimana HRMatrix dirancang dengan kedaulatan data lokal, kecepatan tanpa batas, serta visualisasi eksekutif yang membantumu mengambil keputusan strategis hanya dalam hitungan detik.',
  primaryPath: '/',
  subsections: [
    {
      id: 'konsep-hris-modern',
      title: 'Konsep Utama HRIS & Transformasi HR Administrasi ke HR Strategis',
      description: 'Mengapa perusahaanmu sekecil apa pun skalanya membutuhkan HRIS yang terstruktur? Mari pahami evolusi peran HR dari sekadar pencatat hadir menjadi penggerak pertumbuhan bisnis.',
      uiLocation: 'EBook HRMatrix → Pengenalan Konseptual & Fondasi Sistem',
      details: [
        '**Pernahkah kamu membayangkan apa yang terjadi jika data gaji rahasia atau tanggal habis kontrak karyawanmu mendadak "bocor" atau terhapus dari file Excel kantor?**',
        'Bagi banyak pebisnis dan manajer HR, mengelola data kepegawaian dulunya dianggap sekadar urusan administrasi rutin. Cukup tumpuk berkas fisik di lemari atau buat tabel sederhana di Excel. Namun, bayangkan saat perusahaanmu mulai bertumbuh dari 5 orang menjadi 50 orang. Di sanalah tantangan besar dimulai: file Excel makin lemot, rumus hitung lembur tanpa sengaja terhapus, hingga jadwal habis kontrak karyawan terlewat begitu saja.',
        '**Dari Cost Center Menjadi Value Creator:** HRIS (Human Resource Information System) modern hadir untuk mengubah total cara pandang ini. HR bukan lagi divisi "biaya" (*Cost Center*) yang tugasnya hanya mencatat orang sakit atau memotong gaji, melainkan mitra strategis (*Value Creator*) yang menjamin kelancaran roda bisnis.',
        '**Payung Hukum & Kepatuhan Resmi:** Sesuai **UU No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023 (UU Cipta Kerja)**, setiap pemberi kerja wajib mengelola administrasi ketenagakerjaan, hak kompensasi, dan dokumen kerja secara akurat serta sah secara hukum. Ketiadaan sistem pencatatan resmi bukan cuma memicu kekacauan internal, tapi juga berisiko denda administratif hingga gugatan perselisihan kerja.',
        '**Satu Pusat Data Terpercaya di HRMatrix:** HRMatrix bertindak sebagai *Single Source of Truth*. Seluruh data karyawan, catatan kehadiran, kalkulasi payroll PPh 21 TER, hingga evaluasi KPI saling terhubung secara terotomatisasi di halaman utama (Route: `/`). Tanpa pusing rumit, kamu bisa memantau kesehatan organisasi kapan saja.'
      ]
    },
    {
      id: 'konsep-indexeddb',
      title: 'Kedaulatan Data & Arsitektur Offline-First (IndexedDB)',
      description: 'Mengapa HRMatrix tidak menyimpan data perusahaanmu di server cloud pihak ketiga? Pahami perlindungan data pribadi tingkat tinggi di perangkatmu sendiri.',
      uiLocation: 'Sidebar Kiri Bawah (Indikator Basis Data) & Menu /database',
      details: [
        '**Bayangkan situasi ini:** Hari ini tanggal 25, hari gajian nasional. Seluruh karyawan sudah menunggu slip gaji. Tiba-tiba jaringan internet kantor mati total atau server cloud langgananmu sedang *down*. Stres berat, bukan?',
        '**Rahasia Arsitektur Offline-First:** Inilah alasan utama HRMatrix dibangun menggunakan teknologi *Offline-First* berbasis **IndexedDB**. Seluruh basis data kepegawaian, slip gaji, riwayat presensi, hingga berkas rahasia disimpan 100% di dalam memori internal peramban (*browser*) komputer milikmu sendiri tanpa tergantung pada server cloud pihak ketiga mana pun.',
        '**Kepatuhan Ketat UU Perlindungan Data Pribadi (UU PDP):** Berdasarkan **UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi**, data kepegawaian seperti NIK, NPWP, besaran gaji, nomor rekening, dan riwayat kesehatan merupakan data pribadi yang wajib dilindungi secara amat ketat. Mengunggah data gaji karyawan ke server cloud publik tanpa enkripsi memunculkan risiko kebocoran data yang dapat berujung sanksi pidana dan denda hingga miliaran rupiah.',
        '**Kecepatan Kilat & Bebas Biaya Langganan Bulanan:** Karena pemrosesan data dilakukan langsung oleh prosesor komputermu, setiap klik dan pencarian laporan di HRMatrix berlangsung dalam hitungan milidetik. Tidak ada *lag*, tidak ada risiko kebocoran server, dan tidak ada tagihan langganan bulanan (*SaaS fee*) yang menguras kas perusahaan.',
        '**Pencadangan Mandiri di HRMatrix:** Kamu memegang kendali penuh atas kedaulatan datamu. Kamu bisa mengunduh berkas cadangan terenkapsulasi `.json` kapan saja melalui menu **Database Manager (Route: `/database`)** untuk disimpan aman di harddisk privat atau Google Drive perusahaanmu.'
      ]
    },
    {
      id: 'dashboard-sections',
      title: 'Navigasi Eksekutif: Dashboard & Sistem Peringatan Dini Proaktif',
      description: 'Bagaimana cara seorang Manajer HR atau Pemilik Bisnis memantau kesehatan seluruh organisasi hanya dalam waktu kurang dari 10 detik?',
      uiLocation: 'Halaman Utama Dashboard (Route: /)',
      details: [
        '**Bagaimana caramu mengetahui kondisi terkini timmu pagi ini?** Apakah kamu harus menanyakan satu per satu ke setiap manajer divisi?',
        '**Dashboard Eksekutif yang Interaktif:** Halaman utama HRMatrix dirancang layaknya *cockpit* pesawat terbang modern. Hanya dengan sekali pandang ke Dashboard (Route: `/`), kamu bisa langsung melihat ringkasan indikator utama (*Key Metrics*): jumlah karyawan aktif, demografi divisi, rasio kehadiran harian, hingga estimasi alokasi anggaran penggajian bulan ini.',
        '**Peringatan Dini yang Menyelamatkan Bisnis (Alarm Proaktif):** Salah satu kesalahan paling berbahaya dalam HR adalah kelalaian memantau tanggal jatuh tempo kontrak kerja (PKWT). Sesuai **Pasal 59 UU No. 13/2003 jo. PP No. 35 Tahun 2021**, kontrak PKWT yang habis masa berlakunya tanpa ada pemberitahuan atau perpanjangan resmi bisa dianggap berubah status menjadi Karyawan Tetap (PKWTT) secara otomatis oleh hukum!',
        '**Cerita Nyata dari Lapangan:** Seorang Manajer HR terhindar dari sanksi hukum dan pembengkakan anggaran karena alarm proaktif di HRMatrix memberi notifikasi berwarna kuning dan merah pada H-60 dan H-30 sebelum kontrak 5 staf proyek berakhir. Hasilnya, evaluasi kinerja dapat dilakukan tepat waktu sebelum keputusan perpanjangan disahkan.',
        '**Mekanisme di HRMatrix:** Sistem secara otomatis mendeteksi item kritis mulai dari kontrak jatuh tempo, lonjakan jam lembur, hingga angka keterlambatan tinggi dan menampilkannya secara visual di Dashboard utama.'
      ]
    },
    {
      id: 'setup-perusahaan',
      title: 'Identitas Legal Perusahaan & Konfigurasi Administrasi',
      description: 'Membangun fondasi legalitas dan profil resmi perusahaanmu di dalam sistem sebelum mulai mengelola data operasional.',
      uiLocation: 'Menu Pendaftaran Perusahaan (Route: /daftar) & Modal Pengaturan Profil',
      details: [
        '**Pernahkah karyawanmu mengajukan KPR bank, lalu permohonannya ditolak hanya karena surat keterangan kerja atau slip gajinya tidak mencantumkan NPWP dan identitas legal perusahaan yang sah?**',
        '**Fondasi Legalitas Badan Usaha:** Sebelum kamu memasukkan data karyawan atau menjalankan kalkulasi gaji, kamu perlu memastikan identitas resmi perusahaanmu telah terkonfigurasi dengan benar. Pengaturan ini menentukan kop surat, NPWP Perusahaan, serta nama pejabat yang sah pada seluruh berkas legal dan slip gaji yang diterbitkan oleh sistem.',
        '**Payung Hukum Resmi:** Berdasarkan **UU No. 40 Tahun 2007 tentang Perseroan Terbatas** serta **PER-16/PJ/2016 jo. PMK 168/2023**, entitas pemberi kerja wajib mencantumkan identitas resmi, NPWP Perusahaan, serta pejabat penandatangan berwenang dalam dokumen ketenagakerjaan dan bukti pemotongan pajak PPh 21.',
        '**Dampak Nyata bagi Karyawanmu:** Slip gaji yang memuat identitas legal lengkap bukan sekadar secarik kertas, melainkan bukti sah penghasilan yang diakui oleh instansi perbankan, BPJS, maupun Direktorat Jenderal Pajak (DJP).',
        '**Langkah Mudah di HRMatrix:** Cukup akses menu **Pendaftaran Perusahaan (Route: `/daftar`)**, lalu isikan Nama Legal Badan Usaha (PT/CV/Yayasan/Firma), Alamat Domisili, NPWP Perusahaan, serta Nama & Jabatan Pejabat Penandatangan Resmi. Seluruh dokumen yang dicetak dari HRMatrix akan langsung tampak profesional dan sah secara hukum.'
      ]
    }
  ]
};
