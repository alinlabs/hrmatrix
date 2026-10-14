import { PortalGuideData } from './guide-data-types';

export const guideKarirhubData: PortalGuideData = {
  portalId: 'karirhub',
  section1: {
    title: '1. Dasar Hukum Pelaporan Lowongan & Penempatan Kerja',
    icon: 'briefcase',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan Keppres No. 4 Tahun 1980 tentang Wajib Lapor Lowongan Pekerjaan jo. Permenaker No. 39 Tahun 2016 tentang Penempatan Tenaga Kerja, di mana setiap pengusaha wajib melaporkan secara tertulis setiap lowongan pekerjaan kepada instansi ketenagakerjaan atau melalui portal resmi Karirhub Kemnaker (Pusat Pasar Kerja).',
      'Pelaporan lowongan dan penempatan tenaga kerja bertujuan menciptakan transparansi pasar kerja nasional, akurasi data pengangguran, serta menjamin pemenuhan hak-hak pencari kerja terdaftar (Kartu AK-1 / Kartu Kuning Disnaker).'
    ],
    alert: {
      title: 'Mandat Kuota Tenaga Kerja Disabilitas (UU No. 8/2016):',
      text: 'Perusahaan swasta wajib mempekerjakan paling sedikit 1% (satu persen) penyandang disabilitas dari total seluruh pekerja, sedangkan BUMN/BUMD wajib mempekerjakan paling sedikit 2% (dua persen). Karirhub memfasilitasi pencarian talenta disabilitas terverifikasi.',
      variant: 'emerald'
    }
  },
  section2: {
    title: '2. Fitur Unggulan Karirhub bagi HR Perusahaan',
    icon: 'search',
    cards: [
      {
        title: 'Publikasi Lowongan Nasional Gratis:',
        desc: 'Menjangkau jutaan talenta pencari kerja terverifikasi NIK di seluruh provinsi Indonesia tanpa biaya pemasangan iklan loker.'
      },
      {
        title: 'Database Terverifikasi BNSP & Disnaker:',
        desc: 'Melihat sertifikat kompetensi kerja resmi BNSP, riwayat pelatihan Balai Latihan Kerja (BLK), dan status kartu AK-1 pelamar.'
      },
      {
        title: 'Pelaporan Penempatan Otomatis:',
        desc: 'Kandidat yang diterima (hired) secara otomatis tercatat dalam statistik penempatan resmi Disnaker untuk memenuhi kewajiban regulasi.'
      },
      {
        title: 'Integrasi Program Pemagangan Nasional:',
        desc: 'Mendaftarkan program magang bersertifikasi industri dalam negeri yang mendapatkan insentif Super Tax Deduction (PMK 128/2019).'
      }
    ]
  },
  section3: {
    title: '3. Langkah Publikasi Loker di Karirhub Kemnaker',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Login Profil Perusahaan SIAPkerja',
        desc: 'Akses karirhub.kemnaker.go.id. Masuk menggunakan akun perusahaan yang telah terhubung dengan NIB badan usaha.'
      },
      {
        step: '02',
        title: 'Buat Lowongan Pekerjaan Baru',
        desc: 'Klik "Buat Lowongan". Masukkan judul posisi jabatan, jumlah kuota yang dibutuhkan, tipe kontrak (PKWT/PKWTT/Magang), dan lokasi penempatan kantor.'
      },
      {
        step: '03',
        title: 'Definisikan Kualifikasi & Range Gaji',
        desc: 'Tentukan pendidikan minimum, pengalaman kerja, keterampilan khusus, serta rentang kompensasi gaji (wajib memenuhi standar UMK setempat).'
      },
      {
        step: '04',
        title: 'Screening Kandidat & Pemanggilan Tes',
        desc: 'Tinjau lamaran yang masuk, unduh CV pencari kerja, dan jadwalkan proses wawancara atau psikotes assessment online melalui sistem.'
      },
      {
        step: '05',
        title: 'Update Status Diterima & Finalisasi Penempatan',
        desc: 'Tandai kandidat yang lolos seleksi sebagai "Diterima / Hired" untuk menutup lowongan secara resmi dan menyelesaikan laporan penempatan.'
      }
    ]
  },
  section4: {
    title: '4. FAQ & Informasi Tambahan',
    icon: 'help',
    faqs: [
      {
        q: 'Apakah perusahaan dikenakan biaya saat memasang lowongan di Karirhub?',
        a: 'Tidak ada biaya sama sekali (100% Gratis). Karirhub adalah layanan publik resmi Kementerian Ketenagakerjaan RI untuk memfasilitasi penempatan tenaga kerja.'
      },
      {
        q: 'Apakah mencantumkan rentang gaji di lowongan itu wajib?',
        a: 'Sangat dianjurkan untuk transparansi. Sistem Karirhub akan memvalidasi agar batas bawah gaji tidak berada di bawah ketentuan UMK/UMP wilayah yang berlaku.'
      }
    ]
  }
};
