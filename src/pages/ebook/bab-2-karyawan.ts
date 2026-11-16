import { Chapter } from './ebook-types';

export const bab2Karyawan: Chapter = {
  id: 'manajemen-karyawan',
  number: 2,
  title: 'Pusat Data Karyawan & Legalitas Perjanjian Kerja',
  subtitle: 'Fondasi utama manajemen SDM: pengelolaan biodata, status hukum PKWT/PKWTT, klasifikasi PTKP, dan kompensasi kontrak',
  iconName: 'Users',
  category: 'Operasional',
  readingTime: '14 menit',
  summary: 'Data karyawan adalah "jantung" dari seluruh ekosistem HR di perusahaanmu. Setiap rupiah yang keluar untuk pembayaran gaji, setiap rupiah pajak yang dipotong, serta setiap kewajiban hukum yang ditanggung bisnis bersumber dari pusat data kepegawaian ini. Bayangkan jika ada kesalahan kecil dalam memasukkan tanggal bergabung, status pernikahan, atau jenis ikatan kerja. Dampaknya bisa menjalar ke mana-mana: dari salah hitung pajak PPh 21, pertengkaran di hari gajian, hingga risiko gugatan hukum di Pengadilan Hubungan Industrial (PHI). Di bab ini, kita akan membongkar rahasia mengelola data karyawan secara akurat, rapi, dan 100% patuh hukum.',
  primaryPath: '/employees',
  subsections: [
    {
      id: 'konsep-manajemen-data',
      title: 'Konsep Utama Data Karyawan & Kerahasiaan (Privacy)',
      description: 'Memahami alasan mengapa data kepegawaian harus diperlakukan sebagai aset rahasia berharga tinggi.',
      uiLocation: 'EBook HRMatrix → Pengenalan Modul /employees',
      details: [
        '**Apa yang akan terjadi jika daftar besaran gaji seluruh karyawan di kantormu mendadak tersebar bebas di grup WhatsApp?**',
        'Bisa dipastikan, suasana kantor akan langsung panas! Kecemburuan sosial (*internal friction*) akan meletus, produktivitas merosot tajam, dan talenta terbaikmu mungkin langsung mengajukan surat pengunduran diri sebelum jam makan siang.',
        '**Kerahasiaan Tingkat Tinggi (Strictly Confidential):** Itulah mengapa data kepegawaian mulai dari gaji, bonus, hingga catatan medis merupakan aset berkerahasiaan tinggi. Sesuai **UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**, perusahaan bertindak sebagai Pengendali Data Pribadi yang wajib menjaga kerahasiaan data setiap pekerja.',
        '**Risiko Nyata dari Kesalahan Data:** Bukan cuma urusan gaji, kesalahan menginput NIK KTP atau tanggal lahir juga bisa memicu bencana operasional. Kasus nyata: seorang karyawan baru gagal mendapatkan tindakan medis darurat karena klaim BPJS Kesehatan miliknya ditolak rumah sakit akibat NIK di sistem beda 1 angka dengan KTP asli!',
        '**Pengelolaan Aman di HRMatrix:** Melalui modul **Karyawan (Route: `/employees`)**, kamu dapat menyimpan seluruh biodata, nomor rekening bank, dokumen digital, dan profil perpajakan secara privat. Semua terenkapsulasi aman di perangkatmu tanpa pernah dikirim ke pihak luar.'
      ]
    },
    {
      id: 'data-personal-kontrak',
      title: 'Membedah Legalitas Perjanjian Kerja: PKWT (Kontrak) vs PKWTT (Tetap)',
      description: 'Pelajari perbedaan fundamental secara hukum, batas waktu 5 tahun, serta larangan keras masa percobaan pada karyawan kontrak.',
      uiLocation: 'Employees → Tambah / Edit Karyawan → Tab Informasi Pribadi & Kontrak',
      details: [
        '**Tahukah kamu bahwa mencantumkan klausa "masa percobaan 3 bulan" pada karyawan kontrak (PKWT) bisa berakibat fatal bagi perusahaanmu?**',
        'Banyak manajer HR dan pemilik usaha pemula terjebak di sini. Mereka merekrut karyawan kontrak, lalu memberikan masa percobaan (*probation*) 3 bulan dengan pemikiran "kalau kerjanya jelek, bisa langsung dicopot". Padahal secara hukum, tindakan ini adalah jebakan besar!',
        '**Larangan Masa Percobaan pada PKWT:** Berdasarkan **Pasal 58 UU Ketenagakerjaan jo. PP No. 35 Tahun 2021**, PKWT DILARANG keras mensyaratkan masa percobaan. Jika dalam surat kontrak PKWT tetap dicantumkan klausa masa percobaan, maka secara hukum masa percobaan tersebut **batal demi hukum** dan status karyawan otomatis berubah menjadi Karyawan Tetap (PKWTT) sejak hari pertama bekerja!',
        '**Studi Kasus Hukum yang Sering Terjadi:** Perusahaan A merekrut Karyawan X secara kontrak 1 tahun dengan *probation* 3 bulan. Di bulan ke-2, Karyawan X diberhentikan sepihak. Karyawan X menggugat ke Pengadilan Hubungan Industrial (PHI) dan menang penuh! Perusahaan diwajibkan membayar uang pesangon Karyawan Tetap karena klausa masa percobaan membatalkan status PKWT-nya.',
        '**Batas Waktu Akumulasi PKWT Maksimal 5 Tahun:** Ingat juga bahwa jangka waktu PKWT beserta perpanjangannya kini dibatasi maksimal **5 tahun secara akumulatif**. Lebih dari itu, karyawan wajib diangkat menjadi PKWTT atau diakhiri kontraknya dengan memberikan Uang Kompensasi PKWT.',
        '**Pencegahan Otomatis di HRMatrix:** Saat kamu menginput status kerja karyawan di menu `/employees`, HRMatrix membantumu merekam tanggal mulai dan berakhirnya kontrak secara presisi, serta memberikan alarm peringatan otomatis pada H-60 dan H-30 sebelum kontrak berakhir.'
      ]
    },
    {
      id: 'data-gaji-ptkp',
      title: 'Klasifikasi PTKP (Penghasilan Tidak Kena Pajak) & NIK sebagai NPWP',
      description: 'Pengaruh status pernikahan dan jumlah tanggungan keluarga terhadap pemotongan pajak PPh 21 TER.',
      uiLocation: 'Employees → Edit Karyawan → Bagian Gaji & Perpajakan',
      details: [
        '**Pernahkah karyawanmu mengeluh, "Kenapa potongan pajak gajiku lebih besar daripada rekanku yang gajinya sama?"**',
        'Jawabannya sering kali terletak pada satu kode sederhana: **Status PTKP (Penghasilan Tidak Kena Pajak)**.',
        '**Apa itu PTKP?** PTKP adalah batas nominal penghasilan bulanan/tahunan yang dibebaskan dari pemotongan pajak PPh 21. Berdasarkan **UU No. 7 Tahun 2021 (UU HPP)** dan skema pajak **PP No. 58 Tahun 2023 / PMK 168 Tahun 2023**, pemotongan PPh 21 bulanan kini menggunakan skema **Tarif Efektif Rata-Rata (TER)** yang dikelompokkan menjadi TER A, TER B, dan TER C.',
        '**Pengelompokan Kategori TER Berdasarkan PTKP:**',
        '   - **TER A:** Untuk status PTKP `TK/0` (Lajang tanpa tanggungan), `TK/1`, dan `K/0` (Menikah tanpa tanggungan).',
        '   - **TER B:** Untuk status PTKP `TK/2`, `TK/3`, `K/1` (Menikah anak 1), dan `K/2` (Menikah anak 2).',
        '   - **TER C:** Untuk status PTKP `K/3` (Menikah anak 3 atau lebih).',
        '**Dampak Nyata dari Kesalahan Input:** Jika karyawanmu yang sudah menikah dan punya 2 anak (`K/2`) salah diinput sebagai lajang (`TK/0`), tarif pajak TER yang memotong gajinya setiap bulan akan jauh lebih tinggi dari yang seharusnya! Akibatnya, timmu merasa dirugikan.',
        '**Integrasi NIK sebagai NPWP:** Jangan lupa, sesuai aturan pajak terbaru, NIK 16-digit pada KTP kini secara resmi berfungsi sebagai NPWP Wajib Pajak Orang Pribadi.',
        '**Kemudahan di HRMatrix:** Kamu cukup memilih kode PTKP karyawan di tab Perpajakan pada modul Karyawan (Route: `/employees`). HRMatrix secara otomatis memetakan status PTKP tersebut ke dalam tarif TER yang tepat saat pemrosesan payroll bulanan.'
      ]
    },
    {
      id: 'jenjang-jabatan',
      title: 'Struktur Hierarki Jabatan, Departemen & Keadilan Internal (Internal Equity)',
      description: 'Merancang penjenjangan karir yang seimbang agar tidak ada ketimpangan peran atau kecemburuan sosial.',
      uiLocation: 'Employees → Bagian Departemen & Posisi Jabatan',
      details: [
        '**Apa yang terjadi jika staf senior di kantormu tahu bahwa staf baru yang bebannya lebih ringan ternyata menerima gaji jauh lebih besar tanpa kualifikasi yang jelas?**',
        'Ketimpangan ini dinamakan *Internal Inequity* (ketidakadilan internal). Efek merusaknya sangat nyata: motivasi kerja runtuh, konflik antar-staf memuncak, dan suasana kerja menjadi tidak sehat.',
        '**Struktur dan Skala Upah (Permenaker No. 1/2017):** Untuk mencegah hal ini, pemerintah melalui **Permenaker No. 1 Tahun 2017** mewajibkan setiap perusahaan menyusun Struktur dan Skala Upah yang memperhatikan tingkat jabatan, masa kerja, pendidikan, dan kompetensi.',
        '**Penjenjangan Hierarki yang Jelas:** Struktur organisasi yang sehat membagi jenjang posisi secara logis: `Staff` → `Senior Staff` → `Supervisor` → `Assistant Manager` → `Manager` → `Director`. Setiap tingkatan memiliki rentang upah (*salary band*) batas bawah dan batas atas yang terukur.',
        '**Penerapan di HRMatrix:** Kamu dapat mengelompokkan karyawan berdasarkan Departemen dan Level Jabatan pada profil karyawan (Route: `/employees`). Data ini akan otomatis digunakan oleh sistem untuk menyusun Laporan Analisis Biaya Tenaga Kerja per Departemen di menu `/reports`.'
      ]
    },
    {
      id: 'kompensasi-pkwt-karyawan',
      title: 'Membedah Rumus Uang Kompensasi PKWT saat Kontrak Selesai (PP 35/2021)',
      description: 'Hak wajib karyawan kontrak yang telah menyelesaikan masa baktinya secara adil dan patuh hukum.',
      uiLocation: 'Employees → Detail Karyawan & Ringkasan Kontrak',
      formulaId: 'formula-kompensasi-pkwt',
      details: [
        '**Bayangkan kamu baru saja menyelesaikan kontrak kerja staf proyekmu selama 1 tahun. Apakah hubungan kerja berakhir begitu saja tanpa hak finansial tambahan?**',
        'Jawabannya: **TIDAK!** Sejak berlakunya **PP No. 35 Tahun 2021**, setiap karyawan kontrak (PKWT) yang memiliki masa kerja minimal 1 bulan secara terus-menerus WAJIB menerima **Uang Kompensasi PKWT** saat jangka waktu kontraknya berakhir atau diperpanjang.',
        '**Hukuman Bagi Perusahaan yang Mengabaikan:** Pengabaian pembayaran uang kompensasi PKWT merupakan bentuk pelanggaran aturan pengupahan yang dapat memicu nota pemeriksaan dari Pengawas Ketenagakerjaan Disnaker dan sanksi denda.',
        '**Rumus Perhitungan Kompensasi PKWT (Resmi PP 35/2021):**',
        '   `Uang Kompensasi PKWT = (Masa Kerja Efektif dalam Bulan ÷ 12) × 1 Bulan Upah`',
        '   *(Catatan: 1 Bulan Upah adalah akumulasi Gaji Pokok + Tunjangan Tetap)*',
        '**Contoh Kasus Nyata Perhitungan:** Karyawan B bekerja kontrak selama 9 bulan dengan Gaji Pokok Rp 4.000.000 dan Tunjangan Jabatan Tetap Rp 1.000.000 (Total Upah = Rp 5.000.000). Saat kontrak 9 bulan tersebut berakhir, besaran kompensasi wajibnya adalah:',
        '   `(9 bulan ÷ 12) × Rp 5.000.000 = Rp 3.750.000`',
        '**Perhitungan Otomatis di HRMatrix:** Kamu tidak perlu menghitung manual dengan kalkulator. Pada ringkasan profil karyawan di menu `/employees`, HRMatrix menghitung potensi Uang Kompensasi PKWT ini secara proporsional sesuai tanggal kontrak yang berjalan.'
      ],
      formula: {
        expression: 'Uang Kompensasi PKWT = (Masa Kerja Efektif dalam Bulan ÷ 12) × 1 Bulan Upah',
        explanation: '1 Bulan Upah adalah akumulasi Gaji Pokok ditambah Tunjangan Tetap. Nilai kompensasi ini wajib dibayarkan saat jangka waktu PKWT berakhir atau mengalami perpanjangan.',
        variables: [
          { name: 'Masa Kerja Efektif', desc: 'Jumlah total bulan masa kerja karyawan dalam ikatan kontrak PKWT' },
          { name: '1 Bulan Upah', desc: 'Gaji Pokok + Tunjangan Tetap' }
        ],
        regulationBasis: 'Pasal 15, 16, dan 17 Peraturan Pemerintah (PP) No. 35 Tahun 2021',
        exampleCase: {
          scenario: 'Karyawan B telah menyelesaikan kontrak PKWT selama 8 bulan. Gaji pokoknya Rp 4.500.000 dan Tunjangan Jabatan Tetap Rp 1.500.000.',
          calculationSteps: [
            '1. Hitung Upah 1 Bulan: Rp 4.500.000 + Rp 1.500.000 = Rp 6.000.000',
            '2. Hitung Rasio Masa Kerja: 8 bulan ÷ 12 bulan = 0.6667',
            '3. Hitung Kompensasi: (8 ÷ 12) × Rp 6.000.000 = Rp 4.000.000'
          ],
          finalResult: 'Maka, Uang Kompensasi PKWT yang wajib dibayarkan kepada Karyawan B saat kontrak berakhir adalah Rp 4.000.000'
        }
      }
    }
  ]
};
