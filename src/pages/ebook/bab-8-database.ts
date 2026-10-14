import { Chapter } from './ebook-types';

export const bab8Database: Chapter = {
  id: 'database-dan-pemulihan',
  number: 8,
  title: 'Keamanan Data, Pemulihan Bencana & Manajemen Backup',
  subtitle: 'Prosedur pemeliharaan basis data lokal, ekspor cadangan (.json), serta pemulihan sistem (Disaster Recovery)',
  iconName: 'Database',
  category: 'Teknis',
  readingTime: '10 menit',
  summary: 'Aset paling berharga dari sebuah divisi HR bukan sekadar meja kantor atau komputer canggih, melainkan integritas dan keberlanjutan data kepegawaiannya. Pernahkah kamu membayangkan apa yang akan terjadi jika laptop HR di kantormu tiba-tiba rusak, dicuri, tersiram air, atau riwayat perambannya terhapus tidak sengaja? Tanpa strategi pencadangan (*backup*) yang disiplin, seluruh riwayat absensi, dokumen gaji, dan status pajak karyawan yang telah kamu bangun bertahun-tahun bisa musnah dalam sekejap mata. Bab ini akan memandu kamu menguasai strategi keamanan data dan prosedur pemulihan bencana (*Disaster Recovery Plan*) menggunakan fitur Database Manager di HRMatrix.',
  primaryPath: '/database',
  subsections: [
    {
      id: 'konsep-bcp',
      title: 'Konsep Utama Keberlanjutan Operasional (Business Continuity Plan / BCP)',
      description: 'Mengapa pencadangan data rutin adalah tugas kedinasan wajib setiap pengelola HRIS.',
      uiLocation: 'EBook HRMatrix → Pengenalan Modul /database',
      details: [
        '**Bayangkan situasi mengerikan ini:** Hari Senin pagi, laptop kerja tempat menyimpan seluruh data payroll mendadak mengalami *blue screen* atau harddisknya rusak total. Sementara tanggal penggajian sisa 2 hari lagi!',
        'Situasi panik ini bisa dihindari total jika kamu memiliki **Business Continuity Plan (BCP)** dan disiplin melakukan pencadangan data.',
        '**Apa itu Business Continuity Plan?** BCP dalam pengelolaan HRIS adalah perencanaan terstruktur untuk menjamin ketersediaan dan keamanan data kepegawaian saat terjadi gangguan teknis, kerusakan perangkat, atau bencana.',
        '**Payung Hukum & Risiko Audit Pajak/Ketenagakerjaan:** Sesuai **UU No. 27 Tahun 2022 (UU PDP)** serta regulasi perpajakan, perusahaan wajib menyimpan bukti transaksi keuangan dan penggajian minimal selama **5 hingga 10 tahun**. Tanpa bukti riwayat pembayaran gaji dan pemotongan PPh 21 yang utuh, perusahaanmu tidak dapat membuktikan kepatuhan saat diaudit oleh Direktorat Jenderal Pajak (DJP) atau Disnaker.',
        '**Prinsip Emas 3-2-1 Backup Strategy:**',
        '   - **3** Simpan minimal 3 salinan data.',
        '   - **2** Gunakan 2 jenis media penyimpanan berbeda (memori komputer & Cloud Drive privat).',
        '   - **1** Simpan minimal 1 salinan cadangan di lokasi aman terpisah (*offsite*).',
        '**Pengelolaan Mandiri di HRMatrix:** Pengelolaan pencadangan dan pemulihan data dilakukan secara mandiri di modul **Database Manager (Route: `/database`)**.'
      ]
    },
    {
      id: 'backup-json',
      title: 'Prosedur Pencadangan Mandiri (Ekspor Berkas JSON)',
      description: 'Tata cara membuat salinan enkapsulasi seluruh data HRMatrix secara aman dan cepat.',
      uiLocation: 'Database Manager (Route: /database) → Tombol Download Backup JSON',
      details: [
        '**Seberapa sering kamu harus mengunduh berkas pencadangan data HRMatrix?**',
        'Disarankan minimal **1 kali sebulan** segera setelah kamu selesai memproses penggajian bulanan, atau setiap kali ada perubahan besar pada data karyawan baru.',
        '**Bagaimana Cara Kerja Fitur Backup JSON?**',
        'Saat kamu menekan tombol **Download Backup JSON**, HRMatrix mengekstrak seluruh tabel basis data lokal IndexedDB mulai dari profil karyawan, riwayat presensi, slip gaji, evaluasi KPI, hingga profil legal perusahaan menjadi satu berkas `.json` terenkapsulasi yang aman.',
        '**Standar Penamaan Berkas Cadangan yang Rapi:** Gunakan format penamaan berkas yang terstruktur agar mudah ditemukan saat dibutuhkan, contoh: `HRMatrix-Backup-PT-Maju-Maret-2026.json`.',
        '**Penyimpanan Offsite Aman:** Pindahkan berkas cadangan `.json` tersebut ke Google Drive perusahaan yang dilindungi otentikasi dua langkah (2FA) atau ke harddisk eksternal terenkripsi.',
        '**Langkah di HRMatrix:** Buka Database Manager (Route: `/database`), klik tombol **Download Backup JSON**. Berkas cadangan akan langsung terunduh otomatis ke komputermu dalam hitungan detik.'
      ],
      keyTips: [
        'Standar Penamaan Berkas: Gunakan format penamaan file yang rapi dan terstruktur, contoh: `HRMatrix-Backup-PT-Maju-Maret-2026.json`.',
        'Penyimpanan Offsite: Pindahkan berkas .json cadangan tersebut ke Google Drive perusahaan yang terlindungi otentikasi dua langkah (2FA) atau harddisk eksternal terenkripsi.'
      ]
    },
    {
      id: 'restore-dan-reset',
      title: 'Prosedur Migrasi Perangkat & Pemulihan Bencana (Restore System)',
      description: 'Langkah mudah memindahkan seluruh data ke komputer baru atau mengembalikan data saat terjadi masalah.',
      uiLocation: 'Database Manager → Bagian Restore Backup & Reset Database',
      details: [
        '**Bagaimana jika kantor memberikan laptop baru untukmu? Apakah kamu harus memasukkan ulang data puluhan karyawan dari nol?**',
        'Tentu saja **TIDAK!** Dengan fitur Restore di HRMatrix, migrasi perangkat dapat dilakukan dalam waktu kurang dari 10 detik!',
        '**Prosedur Pemulihan Bencana (*Restore System*):**',
        '   - **Langkah 1:** Buka peramban di komputer/laptop barumu dan akses HRMatrix.',
        '   - **Langkah 2:** Masuk ke menu **Database Manager (Route: `/database`)**.',
        '   - **Langkah 3:** Klik tombol **Restore Backup**, lalu pilih berkas `.json` cadangan terbaru yang telah kamu simpan sebelumnya.',
        '   - **Selesai!** Dalam hitungan detik, seluruh data karyawan, slip gaji, dan riwayat presensi akan langsung pulih 100% utuh tanpa ada satu pon pun yang hilang!',
        '**Peringatan Penting Sebelum Menekan Reset Database:** HRMatrix menyediakan tombol *Reset Database* untuk membersihkan data uji coba. Pastikan kamu telah mengunduh berkas backup JSON terbaru sebelum menekan tombol reset ini karena penghapusan basis data bersifat permanen.'
      ]
    }
  ]
};
