import { Chapter } from './ebook-types';

export const bab10HubunganIndustrial: Chapter = {
  id: 'hubungan-industrial-sp-phk',
  number: 10,
  title: 'Hubungan Industrial, Disiplin Kerja & Etika PHK',
  subtitle: 'Panduan menegakkan Peraturan Perusahaan, mekanisme SP 1-3, perundingan Bipartit, hingga proses PHK yang kondusif',
  iconName: 'ShieldAlert',
  category: 'Legal & Hubungan Industrial',
  readingTime: '13 menit',
  summary: 'Hubungan Industrial adalah seni menjaga keseimbangan harmonis antara hak dan kewajiban pekerja dengan kepentingan bisnis perusahaan. Banyak praktisi HR pemula merasa gentar saat harus menghadapi konflik kerja, memberikan Surat Peringatan, atau menjalankan proses Pemutusan Hubungan Kerja (PHK). Padahal, jika kamu memahami koridor hukumnya dengan baik, penyelesaian masalah kepegawaian dapat dilakukan dengan sangat tenang, adil, profesional, bermartabat, dan minim risiko gugatan hukum. Mari pelajari langkah-langkah legalnya di bab ini.',
  primaryPath: '/attendance',
  subsections: [
    {
      id: 'peraturan-perusahaan-pkb',
      title: 'Peraturan Perusahaan (PP) & Perjanjian Kerja Bersama (PKB)',
      description: 'Payung hukum internal yang menjadi panduan aturan main antara pekerja dan pengusaha.',
      uiLocation: 'EBook HRMatrix → Pengaturan Shift & Denda di /attendance',
      details: [
        '**Pernahkah kamu membayangkan apa yang terjadi jika kantor tidak memiliki aturan tertulis mengenai jam kerja, sanksi keterlambatan, atau hak cuti?**',
        'Tanpa aturan tertulis, setiap keputusan manajemen akan dianggap sewenang-wenang oleh karyawan!',
        '**Apa itu Peraturan Perusahaan (PP) & PKB?** Peraturan Perusahaan (PP) disusun oleh pengusaha dan disahkan oleh Dinas Tenaga Kerja (Disnaker). **PP wajib dimiliki oleh setiap perusahaan yang mempekerjakan sekurang-kurangnya 10 orang pekerja**. Sementara Perjanjian Kerja Bersama (PKB) adalah hasil musyawarah antara Serikat Pekerja dengan manajemen.',
        '**Payung Hukum:** Pasal 108 s.d. 135 UU No. 13/2003 jo. Permenaker No. 28 Tahun 2014. Masa berlaku dokumen PP/PKB adalah maksimal **2 tahun** dan wajib diperbarui.',
        '**Pentingnya Bukti Sosialisasi Aturan:** Sanksi disiplin atau pemotongan denda tidak memiliki kekuatan hukum jika aturan PP belum pernah disosialisasikan. Pastikan seluruh karyawan baru menandatangani bukti tanda terima salinan Peraturan Perusahaan.',
        '**Implementasi di HRMatrix:** Aturan jam kerja, sanksi keterlambatan, dan kebijakan izin yang diatur dalam PP diimplementasikan secara teknis pada modul **Kehadiran (Route: `/attendance`)**.'
      ]
    },
    {
      id: 'mekanisme-surat-peringatan',
      title: 'Prosedur Hukum Surat Peringatan (SP 1, SP 2, SP 3)',
      description: 'Tata cara penerbitan sanksi kedisiplinan yang sah menurut undang-undang.',
      uiLocation: 'EBook HRMatrix → Rekam Data Kedisiplinan & Terlambat di /attendance',
      details: [
        '**Bolehkah perusahaan langsung memberikan Surat Peringatan Ketiga (SP 3) kepada karyawan tanpa memberikan SP 1 dan SP 2 terlebih dahulu?**',
        'Jawabannya: **BOLEH!** Tergantung pada kadar tingkat pelanggaran yang dilakukannya.',
        '**Mekanisme Penerbitan SP Sesuai UU:** Berdasarkan **Pasal 161 UU No. 13/2003 jo. PP No. 35 Tahun 2021**:',
        '   - Masing-masing Surat Peringatan (SP 1, SP 2, SP 3) berlaku selama **6 bulan**.',
        '   - Jika dalam kurun waktu 6 bulan tersebut karyawan tidak melakukan pelanggaran baru, maka status catatannya kembali bersih.',
        '   - SP tidak harus diberikan berurutan. Untuk pelanggaran berat (seperti pemalsuan dokumen, pencurian, atau penganiayaan), perusahaan berhak langsung menerbitkan **SP 3 atau Surat Peringatan Terakhir**.',
        '**Prinsip Internal Hearing (Klarifikasi):** Menerbitkan SP tanpa memanggil karyawan untuk memintanya memberikan klarifikasi resmi (*Due Process of Law*) adalah tindakan cacat prosedur yang berisiko dibatalkan di Pengadilan Hubungan Industrial.',
        '**Bukti Objektif di HRMatrix:** Gunakan rekap data absensi dan keterlambatan dari modul **Kehadiran (Route: `/attendance`)** sebagai bukti data objektif saat kamu mengadakan panggilan klarifikasi.'
      ]
    },
    {
      id: 'penyelesaian-perselisihan-bipartit',
      title: 'Perundingan Bipartit, Tripartit & Mediation Disnaker',
      description: 'Alur hukum penyelesaian sengketa hubungan industrial antara pekerja dan manajemen.',
      uiLocation: 'EBook HRMatrix → Laporan Ketenagakerjaan & Audit Data Karyawan',
      details: [
        '**Bagaimana alur hukum yang benar jika terjadi perselisihan atau ketidaksepakatan antara pekerja dan manajemen perusahaan?**',
        'Undang-Undang No. 2 Tahun 2004 mengatur tahapan Penyelesaian Perselisihan Hubungan Industrial (PPHI) secara amat rapi:',
        '   - **Tahap 1: Musyawarah Bipartit (Internal):** Perundingan langsung antara pekerja dan manajemen secara musyawarah (maksimal 30 hari kerja). Jika sepakat, buat Perjanjian Bersama (PB). Jika gagal (*deadlock*), buat Risalah Bipartit.',
        '   - **Tahap 2: Tripartit (Mediasi Disnaker):** Jika Bipartit gagal, salah satu pihak melapor ke Disnaker. Mediator Disnaker akan memfasilitasi mediasi dan mengeluarkan Anjuran Tertulis.',
        '   - **Tahap 3: Pengadilan Hubungan Industrial (PHI):** Jika Anjuran Disnaker ditolak, kasus dibawa ke sidang Pengadilan Hubungan Industrial.',
        '**Pentingnya Kelengkapan Berkas:** Dalam perundingan Bipartit maupun Tripartit, kelengkapan bukti dokumen (kontrak kerja, bukti transfer gaji, dan rekap absensi) menentukan kemenangan hukum.',
        '**Pengambilan Data di HRMatrix:** Data riwayat kontrak, bukti kalkulasi gaji, dan rekaman presensi dapat kamu cetak secara instan dari HRMatrix sebagai bahan berkas BAP Bipartit.'
      ]
    },
    {
      id: 'etika-proses-phk-pesangon',
      title: 'Tata Cara PHK, Uang Pesangon & Kompensasi Sesuai PP 35/2021',
      description: 'Prosedur pengakhiran hubungan kerja yang profesional, bermartabat, dan patuh aturan pesangon.',
      uiLocation: 'EBook HRMatrix → Hitung Kompensasi Kontrak di /employees',
      details: [
        '**Berapa hari sebelum tanggal efektif PHK perusahaan wajib memberikan Surat Pemberitahuan PHK kepada karyawan?**',
        'Berdasarkan **Pasal 37 PP No. 35 Tahun 2021**, Maksud Pemutusan Hubungan Kerja (PHK) wajib disampaikan secara tertulis oleh pengusaha kepada pekerja paling lambat **14 hari kerja** sebelum tanggal pengakhiran hubungan kerja.',
        '**Anatomi Hak Finansial PHK Karyawan Tetap (PKWTT):**',
        '   - **1. Uang Pesangon (UP):** Dihitung berdasarkan tabel masa kerja (1 bulan upah per 1 tahun masa kerja, maksimal 9 bulan upah).',
        '   - **2. Uang Penghargaan Masa Kerja (UPMK):** Diberikan untuk masa kerja minimal 3 tahun (2 bulan upah) hingga maksimal 10 bulan upah.',
        '   - **3. Uang Penggantian Hak (UPH):** Penggantian sisa cuti tahunan yang belum gugur dan ongkos kepulangan.',
        '**Pengali Alasan PHK:** Faktor pengali uang pesangon bervariasi sesuai alasan PHK (misal: PHK karena Efisiensi/Rugi pengali 0.5x atau 1x, PHK Pensiun pengali 1.75x, PHK Pelanggaran SP3 pengali 0.5x).',
        '**Perhitungan di HRMatrix:** Kamu bisa menghitung estimasi kompensasi berakhirnya kontrak PKWT atau hak cuti karyawan pada modul **Karyawan (Route: `/employees`)**.'
      ]
    }
  ]
};
