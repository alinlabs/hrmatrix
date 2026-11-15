import { Chapter } from './ebook-types';

export const bab7Laporan: Chapter = {
  id: 'laporan-dan-analitik',
  number: 7,
  title: 'Pusat Laporan & Analitik Data HR (HR Analytics)',
  subtitle: 'Mengubah data mentah operasional menjadi wawasan strategis (*data-driven insights*) untuk jajaran Direksi',
  iconName: 'FileText',
  category: 'Operasional',
  readingTime: '11 menit',
  summary: 'Di era bisnis modern saat ini, keputusan manajemen tidak boleh lagi diambil hanya berdasarkan "perasaan" (*gut feeling*), bisikan asumsi, atau persepsi emosional semata. Jajaran Direksi, CEO, dan pemilik perusahaan membutuhkan fakta data kuantitatif yang akurat untuk mengalokasikan anggaran dan menilai kesehatan organisasi. Modul Laporan & Analitik di HRMatrix adalah mesin pengolah data pintar yang menyajikan analisis biaya tenaga kerja, tren kedisiplinan, hingga proyeksi biaya secara visual, instan, dan siap dipresentasikan.',
  primaryPath: '/reports',
  subsections: [
    {
      id: 'konsep-hr-analytics',
      title: 'Konsep Utama Data-Driven HR: Dari Opini Menjadi Fakta Bisnis',
      description: 'Bagaimana praktisi HR berbicara dalam bahasa bisnis yang dipahami dan dihormati oleh CEO dan Direktur Keuangan.',
      uiLocation: 'EBook HRMatrix → Pengenalan Modul /reports',
      details: [
        '**Mengapa usulan penambahan anggota tim baru dari divisi HR sering kali ditolak dingin oleh Direktur Keuangan?**',
        'Sering kali penyebabnya adalah cara penyampaian informasi yang kurang tepat. Jika kamu datang ke ruang rapat Direksi hanya membawa klaim subjektif seperti *"Tim kami rasanya sangat sibuk dan capek, butuh tambah orang"*, Direktur Keuangan tentu akan bersikap skeptis.',
        '**Berbicara dalam Bahasa Bisnis (Data-Driven Language):** Bayangkan jika kamu mengubah kalimat tersebut menjadi fakta data kuantitatif: *"Berdasarkan data HRMatrix 3 bulan terakhir, rasio jam lembur Divisi Logistik mencapai 28% dari total gaji pokok. Secara finansial, membayar lembur ini memakan biaya Rp 45 juta/bulan, sedangkan merekrut 2 staf baru hanya membutuhkan Rp 12 juta/bulan. Penambahan staf akan menghemat anggaran perusahaan sebesar Rp 33 juta/bulan!"*',
        'Bisa dipastikan, CEO dan Direktur Keuangan akan langsung menyetujui usulanmu dalam hitungan detik!',
        '**Definisi HR Analytics:** HR Analytics adalah metode mengolah data mentah kepegawaian (presensi, payroll, perputaran karyawan) menjadi wawasan bisnis kuantitatif untuk mengambil keputusan strategis.',
        '**Visualisasi Otomatis di HRMatrix:** Akses grafik dan rekapitulasi analitik data kepegawaian secara instan pada modul **Laporan (Route: `/reports`)**.'
      ]
    },
    {
      id: 'laporan-eksekutif',
      title: 'Membedah 4 Analitik Utama Kesehatan Organisasi',
      description: 'Panduan membaca metrik biaya tenaga kerja, ketidakhadiran, beban lembur, dan rasio kompensasi.',
      uiLocation: 'Halaman Laporan & Analitik (Route: /reports)',
      details: [
        '**Metrik apa saja yang wajib kamu pantau setiap bulan untuk memastikan kesehatan organisasi tempatmu bekerja?**',
        'HRMatrix menyediakan 4 analitik utama yang mengukur stabilitas arus kas dan produktivitas timmu:',
        '   - **1. Tren Biaya Penggajian (*Gross Payroll Trend*):** Melacak pergerakan total gaji kotor, iuran BPJS tanggungan perusahaan, dan PPh 21 dari bulan ke bulan untuk mencegah pembengkakan anggaran (*payroll blowout*).',
        '   - **2. Tingkat Ketidakhadiran (*Absenteeism Rate*):** Mengukur seberapa banyak jam kerja yang hilang akibat mangkir atau sakit.',
        '     `Absenteeism Rate = (Total Hari Absen ÷ [Total Karyawan × Hari Kerja Normal]) × 100%`',
        '     *(Catatan: Absenteeism Rate di atas 3%-5% menjadi indikator awal menurunnya tingkat keterikatan karyawan atau adanya masalah lingkungan kerja yang kurang sehat)*.',
        '   - **3. Analisis Rasio Lembur (*Overtime Ratio*):** Mengidentifikasi divisi mana yang menyerap biaya lembur tertinggi untuk dievaluasi penataan shift kerjanya.',
        '   - **4. Rekapitulasi Kewajiban BPJS & PPh 21:** Rekonsiliasi data bulanan untuk keperluan pelaporan SPT Masa PPh 21 ke DJP Online dan portal BPJS.',
        '**Payung Hukum & Kepatuhan:** PER-16/PJ/2016 jo. PMK 168/2023 & Regulasi Pelaporan BPJS Kesehatan/Ketenagakerjaan.',
        '**Penyajian Otomatis di HRMatrix:** Seluruh kalkulasi 4 analitik utama ini disajikan secara otomatis dalam bentuk grafik interaktif dan tabel di modul Laporan (Route: `/reports`).'
      ]
    },
    {
      id: 'presentasi-direksi',
      title: 'Panduan Menyajikan Laporan HR kepada Pemilik Perusahaan & CEO',
      description: 'Tips komunikasi eksekutif dalam menyampaikan temuan analitik HR secara ringkas dan berdampak.',
      uiLocation: 'Fitur Ekspor Laporan PDF/Excel & Ringkasan Eksekutif',
      details: [
        '**Tahukah kamu apa kesalahan terbesar yang sering dilakukan praktisi HR saat menyajikan laporan ke jajaran pimpinan?**',
        'Kesalahan terbesarnya adalah menyodorkan deretan puluhan tabel angka mentah tanpa ada ringkasan temuan (*key findings*) dan tanpa rekomendasi tindakan!',
        '**3 Aturan Emas Presentasi Laporan Eksekutif:**',
        '   - **1. Mulai dari Ringkasan Tingkat Tinggi (*Executive Summary*):** Sajikan dulu 3-4 angka metrik utama, baru masuk ke rincian jika diminta.',
        '   - **2. Tunjukkan Hubungan Sebab-Akibat:** Jangan cuma sebut angka, tapi jelaskan maknanya. Contoh: *"Biaya lembur Divisi Logistik naik 15% bulan ini karena ada lonjakan pengiriman akhir tahun"*.',
        '   - **3. Selalu Bawa Solusi & Rekomendasi Bisnis:** Contoh: *"Rekomendasi kami: Penyesuaian jadwal shift atau penambahan 1 staf kontrak untuk memangkas biaya lembur sebesar 40% di bulan depan"*.',
        '**Ekspor Siap Cetak di HRMatrix:** Gunakan tombol **Ekspor Laporan PDF/Excel** di menu `/reports` untuk mengunduh berkas ringkasan eksekutif yang rapi dan siap dibagikan dalam rapat Direksi.'
      ]
    }
  ]
};
