import { Chapter } from './ebook-types';

export const bab6JobDesk: Chapter = {
  id: 'deskripsi-pekerjaan',
  number: 6,
  title: 'Analisis & Deskripsi Jabatan (Job Description)',
  subtitle: 'Merancang dokumen uraian tugas profesional, pemetaan kualifikasi (Job Spec), serta batas otorisasi wewenang',
  iconName: 'FileText',
  category: 'Performa',
  readingTime: '10 menit',
  summary: 'Mencegah tumpang tindih (*overlapping*) pekerjaan, kebiasaan lempar tanggung jawab, dan gesekan antar-divisi adalah kunci utama mewujudkan operasional bisnis yang mulus. Banyak konflik kerja di perusahaan terjadi bukan karena karyawan malas, melainkan karena tidak ada kejelasan mengenai "siapa yang bertanggung jawab atas apa". Modul Job Description di HRMatrix dirancang khusus untuk membantumu menyusun pemetaan tugas, batas otorisasi wewenang, dan kualifikasi jabatan secara baku, transparan, dan terstruktur.',
  primaryPath: '/job-desk',
  subsections: [
    {
      id: 'konsep-job-description',
      title: 'Konsep Utama Analisis Jabatan & Mencegah Hambatan Operasional',
      description: 'Mengapa dokumen uraian jabatan adalah cermin pertama profesionalisme tata kelola organisasi?',
      uiLocation: 'EBook HRMatrix → Pengenalan Modul /job-desk',
      details: [
        '**Pernahkah kamu mendengar ucapan seperti ini di kantor: "Lho, itu kan bukan tugas saya! Kenapa saya yang disalahkan?"**',
        'Kalimat legendaris ini adalah gejala klasik dari perusahaan yang belum memiliki Dokumen Uraian Jabatan (*Job Description*) yang jelas. Saat terjadi kesalahan operasional, semua orang saling menunjuk dan melempar tanggung jawab. Sebaliknya saat ada pekerjaan penting, tidak ada satu pun yang mengerjakannya!',
        '**Apa itu Analisis Jabatan?** Analisis jabatan adalah proses sistematis mengumpulkan, menganalisis, dan menyusun informasi mengenai tugas, tanggung jawab, kualifikasi, dan batas wewenang suatu posisi.',
        '**Payung Hukum & Standar Manajemen Mutu:** Berdasarkan **Permenaker No. 1 Tahun 2017 tentang Struktur dan Skala Upah** serta standar mutu **ISO 9001**, kejelasan uraian jabatan menjadi dasar mutlak pembentukan struktur upah dan standar operasional prosedur (SOP).',
        '**Cerita Nyata Kebocoran Data:** Terjadi insiden kebocoran data di sebuah perusahaan karena tidak ada kejelasan mengenai siapa yang berwenang memberikan hak akses server apakah Staf IT Admin atau Network Engineer. Setelah Job Description diperbarui dan dikunci batas wewenangnya, insiden serupa tidak pernah terulang.',
        '**Pusat Pengelolaan di HRMatrix:** Pemetaan tugas dan otorisasi wewenang dapat dikelola dan diakses secara mudah pada modul **Job Desk (Route: `/job-desk`)**.'
      ]
    },
    {
      id: 'anatomi-job-desk',
      title: 'Anatomi Dokumen Job Description Standar Internasional',
      description: 'Komponen penting yang wajib dicantumkan dalam menyusun uraian jabatan yang mengikat secara profesional.',
      uiLocation: 'Halaman Job Desk (Route: /job-desk)',
      details: [
        '**Bagaimana cara menyusun dokumen Job Description yang benar agar tidak seperti daftar belanjaan yang asal tumpuk?**',
        'Dokumen Job Description yang lengkap dan profesional wajib memuat 4 komponen baku:',
        '   - **1. Identitas Jabatan:** Nama posisi, kode posisi, nama departemen, level jabatan, dan nama posisi atasan langsung.',
        '   - **2. Ringkasan Tujuan Jabatan (*Job Purpose*):** 1-2 kalimat yang menjelaskan mengapa posisi ini ada dan apa kontribusi utamanya bagi bisnis.',
        '   - **3. Tanggung Jawab Utama (*Key Responsibilities*):** Rincian tugas harian, mingguan, dan bulanan yang ditulis menggunakan **kata kerja aktif** (misal: *Menyusun laporan bulanan...*, *Menganalisis data...*, *Mengelola anggaran...*).',
        '   - **4. Batas Otorisasi Wewenang (*Authority Limit*):** Penjelasan tegas mengenai sejauh mana pemegang posisi berwenang mengambil keputusan mandiri tanpa persetujuan atasan.',
        '**Pentingnya Batas Otorisasi Wewenang:** Contoh batas otorisasi: *"Berwenang menyetujui pengeluaran kas kecil hingga Rp 1.000.000"* atau *"Berwenang memberikan persetujuan libur cuti staf bawahan"*. Tanpa batas otorisasi, staf akan terus-menerus minta persetujuan untuk hal-hal kecil yang membuang waktu manajer.',
        '**Penyusunan Praktis di HRMatrix:** Isikan identitas posisi, atasan langsung, ringkasan tugas, dan batas wewenang pada form Job Description di menu `/job-desk`.'
      ]
    },
    {
      id: 'job-specification',
      title: 'Menyusun Spesifikasi Jabatan (Job Specification & Competency)',
      description: 'Menentukan standar kualifikasi minimal yang dibutuhkan agar pemegang jabatan dapat sukses menjalankan tugasnya.',
      uiLocation: 'Job Desk → Tab Spesifikasi & Kualifikasi Jabatan',
      details: [
        '**Tahukah kamu apa risikonya merekrut orang yang kualifikasinya jauh di bawah standar atau sebaliknya sangat melebihi kualifikasi?**',
        'Merekrut orang yang kualifikasinya di bawah standar (*under-qualified*) membuat target pekerjaan tidak pernah tercapai. Sebaliknya, merekrut orang yang terlalu pintar/beralaman (*over-qualified*) tanpa jalur karir yang siap akan membuatnya merasa cepat bosan dan resign dalam hitungan bulan!',
        '**Pengertian Job Specification:** Spesifikasi Jabatan menentukan kualifikasi minimal SDM yang dibutuhkan suatu posisi, meliputi:',
        '   - **Pendidikan & Pengalaman:** Pendidikan minimal dan jumlah tahun pengalaman kerja di bidang relevan.',
        '   - **Keterampilan Teknis (*Hard Skills*):** Penguasaan perangkat lunak, bahasa pemrograman, sertifikasi profesional (misal: *Brevet Pajak, Lisensi K3, Mahir Excel*).',
        '   - **Kompetensi Perilaku (*Soft Skills*):** Kemampuan kepemimpinan, komunikasi, kepedulian terhadap detail, atau pemikiran analitis.',
        '**Payung Hukum:** Standar Kompetensi Kerja Nasional Indonesia (SKKNI).',
        '**Pengaturan di HRMatrix:** Kelola kualifikasi hard skill dan soft skill pada tab Spesifikasi Jabatan di menu `/job-desk` sebagai acuan pembuatan iklan lowongan kerja dan proses seleksi rekrutmen.'
      ]
    },
    {
      id: 'integrasi-kpi',
      title: 'Menyelaraskan Job Description dengan Indikator Kinerja (KPI)',
      description: 'Menjaga benang merah antara apa yang ditugaskan harian dengan apa yang dinilai pada akhir periode.',
      uiLocation: 'Job Desk → Tab Hubungan Indikator KPI',
      details: [
        '**Bayangkan betapa frustrasinya seorang karyawan jika selama setahun ia mengerjakan tugas A, lalu di akhir tahun ia dinilai dan dihukum berdasarkan indikator B yang tidak pernah ditugaskan kepadanya!**',
        'Inilah ketidakadilan besar yang wajib dihindari oleh setiap praktisi HR.',
        '**Benang Merah Antara Job Description dan KPI:** Penilaian KPI pada akhir periode WAJIB bersumber langsung dari poin-poin tanggung jawab utama yang tertera di dokumen Job Description.',
        '**Evaluasi dan Peninjauan Berkala:** Dokumen Job Description bukan barang mati yang disimpan di lemari selamanya. Job Description perlu ditinjau ulang minimal **1 tahun sekali** untuk menyesuaikan dengan dinamika perkembangan teknologi, otomasi kerja, dan pertumbuhan bisnis perusahaanmu.',
        '**Integrasi Sistem di HRMatrix:** Hubungkan item tanggung jawab di modul **Job Desk (Route: `/job-desk`)** secara langsung dengan indikator penilaian di modul **KPI (Route: `/kpi`)** agar alur kerja dan evaluasi timmu berjalan selaras.'
      ]
    }
  ]
};
