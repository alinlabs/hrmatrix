import { Chapter } from './ebook-types';

export const bab9Rekrutmen: Chapter = {
  id: 'rekrutmen-dan-onboarding',
  number: 9,
  title: 'Rekrutmen, Seleksi & Onboarding Karyawan Baru',
  subtitle: 'Panduan lengkap menarik talenta terbaik, wawancara berbasis kompetensi, hingga membuat karyawan baru betah',
  iconName: 'UserPlus',
  category: 'Strategi & Talent',
  readingTime: '12 menit',
  summary: 'Rekrutmen bukan sekadar urusan mencari orang untuk mengisi kursi kosong yang mendadak ditinggal resign. Rekrutmen adalah investasi jangka panjang terpenting bagi masa depan perusahaanmu! Merekrut orang yang salah harganya sangat mahal: selain membuang biaya pelatihan dan waktu berharga, karyawan yang tidak cocok bisa merusak semangat kerja tim yang sudah solid. Di bab ini, kamu akan mempelajari seni dan ilmu rekrutmen profesional mulai dari menganalisis kebutuhan tenaga kerja, menyaring CV, teknik wawancara STAR, hingga menyusun program Onboarding 90 hari yang membuat karyawan baru merasa dihargai dan betah bekerja.',
  primaryPath: '/employees',
  subsections: [
    {
      id: 'perencanaan-rekrutmen',
      title: 'Perencanaan Tenaga Kerja (Manpower Planning) & Penyusunan Job Posting',
      description: 'Menganalisis kebutuhan riil tenaga kerja dan menyusun penawaran lowongan yang menarik.',
      uiLocation: 'EBook HRMatrix → Implementasi Terkait: Modul /job-desk & /employees',
      details: [
        '**Bagaimana caramu mengetahui bahwa suatu divisi memang BENAR-BENAR butuh tambahan staf baru dan bukan sekadar alasan manajernya yang kurang efisien?**',
        'Inilah pentingnya **Manpower Planning (Perencanaan Tenaga Kerja)** berbasis Analisis Beban Kerja (*Workload Analysis*).',
        '**Risiko Rekrutmen Tanpa Analisis Beban Kerja:** Merekrut tanpa analisis data memicu pembengkakan biaya gaji (*over-staffing*). Sebaliknya, membiarkan tim kekurangan staf kronis menyebabkan tingginya angka lembur dan keluhan kelelahan (*burnout*).',
        '**Larangan Diskriminasi dalam Lowongan Kerja:** Berdasarkan **Pasal 5 UU No. 13 Tahun 2003**, setiap tenaga kerja memiliki hak dan kesempatan yang sama untuk memperoleh pekerjaan tanpa diskriminasi. DILARANG keras mencantumkan syara-syarat diskriminatif (seperti ras, agama, atau batasan fisik yang tidak ada hubungannya dengan pekerjaan) dalam iklan lowongan.',
        '**Pemanfaatan Data HRMatrix:** Kamu bisa membuka laporan lembur di HRMatrix. Jika jam lembur Divisi Logistik konsisten di atas 20 jam/bulan per orang, hal itu menjadi bukti objektif kebutuhan penambahan staf. Gunakan uraian dari modul **Job Desk (Route: `/job-desk`)** sebagai bahan penyusunan iklan lowongan kerja yang presisi.'
      ]
    },
    {
      id: 'teknik-wawancara-star',
      title: 'Menyaring CV & Wawancara Berbasis Kompetensi (Metode STAR)',
      description: 'Menggali perilaku dan pencapaian nyata kandidat melalui wawancara terstruktur.',
      uiLocation: 'EBook HRMatrix → Integrasi Penilaian Kompetensi & KPI (/kpi)',
      details: [
        '**Mengapa pertanyaan wawancara teoritis seperti "Apa kelebihan dan kekuranganmu?" sudah tidak efektif lagi digunakan saat ini?**',
        'Karena pertanyaan teoritis seperti itu sangat mudah dihafalkan oleh kandidat dari contoh-contoh di internet!',
        '**Rahasia Metode Wawancara STAR:** Untuk menggali kompetensi asli kandidat, gunakan **Metode STAR** (**S**ituation, **T**ask, **A**ction, **R**esult). Metode ini berfokus pada pengalaman dan perilaku riil kandidat di masa lalu.',
        '   - **Situation (Situasi):** Minta kandidat menceritakan latar belakang masalah nyata yang pernah dihadapinya.',
        '   - **Task (Tugas):** Apa peran dan tanggung jawab spesifik kandidat dalam situasi tersebut?',
        '   - **Action (Tindakan):** Langkah konkret apa yang diambil oleh kandidat untuk menyelesaikan masalah?',
        '   - **Result (Hasil):** Apa hasil kuantitatif nyata yang dicapai dari tindakan tersebut?',
        '**Contoh Pertanyaan STAR di Lapangan:** *"Ceritakan pengalamanmu saat menghadapi konflik perbedaan pendapat sengit dengan rekan sekerja. Apa peranmu, tindakan konkret apa yang kamu ambil, dan bagaimana hasilnya?"*',
        '**Integrasi Standar Kompetensi di HRMatrix:** Kamu dapat membuat lembar penilaian wawancara terstruktur berdasarkan standar indikator kompetensi pada modul **KPI (Route: `/kpi`)**.'
      ]
    },
    {
      id: 'offering-letter-legal',
      title: 'Penawaran Kerja (Offering Letter) & Legalitas PKWT/PKWTT',
      description: 'Menyusun penawaran kerja mengikat dan menyiapkan perjanjian kerja yang patuh hukum.',
      uiLocation: 'EBook HRMatrix → Input Karyawan Baru di Menu /employees',
      details: [
        '**Apa risiko terbesar dari menyampaikan penawaran kerja (*offering*) hanya lewat percakapan lisan atau telepon?**',
        'Riset menunjukkan kesepakatan lisan tanpa dokumen tertulis resmi sangat rentan memicu pembatalan sepihak, salah paham nominal gaji, atau bahkan perselisihan saat kandidat sudah terlanjur mengundurkan diri dari tempat kerja lamanya.',
        '**Dokumen Resmi Offering Letter:** Offering Letter adalah surat penawaran resmi tertulis dari perusahaan kepada kandidat terpilih yang mencantumkan nama jabatan, rincian komponen gaji, tunjangan, serta tanggal mulai bergabung.',
        '**Payung Hukum:** Pasal 1320 KUHPerdata tentang Keabsahan Perjanjian & PP No. 35 Tahun 2021 tentang Perjanjian Kerja.',
        '**Langkah Legalitas:** Minta kandidat menandatangani Offering Letter di atas materai. Setelah itu, siapkan draf Perjanjian Kerja (PKWT/PKWTT) yang mencantumkan hak dan kewajiban secara transparan.',
        '**Aktivasi Data di HRMatrix:** Setelah calon karyawan menyetujui penawaran, kamu tinggal menginput biodatanya ke modul **Karyawan (Route: `/employees`)** untuk aktivasi status kepegawaian dan sinkronisasi penggajian.'
      ]
    },
    {
      id: 'onboarding-90-hari',
      title: 'Rahasia Onboarding 90-Hari yang Mengesankan',
      description: 'Mendampingi karyawan baru agar cepat produktif dan merasa diterima di lingkungan organisasi.',
      uiLocation: 'EBook HRMatrix → Pengaturan Shift (/attendance) & Target KPI Awal (/kpi)',
      details: [
        '**Tahukah kamu bahwa 69% karyawan akan bertahan lebih dari 3 tahun di perusahaan jika mereka mengalami proses Onboarding yang terstruktur pada bulan pertama?**',
        'Sebaliknya, menyiarkan karyawan baru duduk sendiri tanpa pendamping di hari pertama adalah resep cepat membuat mereka merasa diabaikan dan menyesal bergabung!',
        '**Apa itu Onboarding?** Onboarding adalah proses pengenalan dan pembauran karyawan baru ke dalam budaya, alur kerja, dan nilai-nilai perusahaan selama 90 hari pertama masa kerjanya.',
        '**Rencana Tahapan Onboarding 90 Hari yang Efektif:**',
        '   - **Hari Ke-1:** Sambutan hangat (*Welcoming*), perkenalan seluruh tim, penunjukan rekan pendamping (*Buddy System*), dan penyiapan fasilitas kerja.',
        '   - **Bulan Ke-1:** Pemahaman Peraturan Perusahaan (PP), pelatihan alur kerja harian, dan pendaftaran jadwal shift di HRMatrix.',
        '   - **Bulan Ke-3:** Evaluasi akhir masa percobaan (*Probation Review*) berdasarkan pencapaian target KPI awal.',
        '**Pemantauan di HRMatrix:** Atur target KPI khusus masa percobaan pada modul **KPI (Route: `/kpi`)** dan pantau kedisiplinan kehadirannya di modul **Kehadiran (Route: `/attendance`)**.'
      ]
    }
  ]
};
