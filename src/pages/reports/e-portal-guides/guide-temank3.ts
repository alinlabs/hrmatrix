import { PortalGuideData } from './guide-data-types';

export const guideTemanK3Data: PortalGuideData = {
  portalId: 'temank3',
  section1: {
    title: '1. Dasar Hukum & Ketentuan Kewajiban K3 di Perusahaan',
    icon: 'hardhat',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan UU No. 1 Tahun 1970 tentang Keselamatan Kerja jo. Permenaker No. 04/MEN/1987 tentang Panitia Pembina Keselamatan dan Kesehatan Kerja (P2K3), di mana setiap tempat kerja yang:',
      'Wajib membentuk P2K3 dan menunjuk sekurang-kurangnya 1 (satu) orang Ahli Keselamatan dan Kesehatan Kerja (Ahli K3 Umum) yang memiliki Surat Keputusan Penunjukan (SKP) resmi dari Menteri Ketenagakerjaan.'
    ],
    bulletPoints: [
      'Mempekerjakan 100 (seratus) orang tenaga kerja atau lebih; ATAU',
      'Mempekerjakan kurang dari 100 orang tetapi mempunyai tingkat potensi bahaya tinggi (bahan kimia, tekanan, radiasi, mudah terbakar, ledakan)'
    ],
    subCards: [
      {
        title: 'Jadwal Lapor Berkala P2K3:',
        desc: 'Wajib dilaporkan secara tertulis setiap 3 (tiga) bulan sekali (Triwulanan) kepada Disnaker/Kemnaker melalui portal Teman K3.',
        variant: 'blue'
      },
      {
        title: 'Pelaporan Insiden Kecelakaan Kerja (KK):',
        desc: 'Setiap kejadian kecelakaan kerja wajib dilaporkan selambat-lambatnya 2 x 24 jam sejak terjadinya kecelakaan.',
        variant: 'rose'
      }
    ]
  },
  section2: {
    title: '2. Ruang Lingkup Layanan di Portal Teman K3',
    icon: 'activity',
    cards: [
      {
        title: 'Laporan Triwulan P2K3',
        desc: 'Pelaporan risalah rapat bulanan P2K3, hasil inspeksi K3 di tempat kerja, identifikasi bahaya dan penilaian risiko (HIRADC), serta statistik jam kerja selamat (Zero Accident).'
      },
      {
        title: 'Perpanjangan Lisensi & SKP Ahli K3',
        desc: 'Pengurusan perpanjangan Surat Keputusan Penunjukan (SKP) Ahli K3 Umum, Ahli K3 Kimia, Ahli K3 Listrik, dan Lisensi K3 Petugas yang masa berlakunya 3 tahun.'
      },
      {
        title: 'Riksa Uji Alat & Objek K3 Fasilitas',
        desc: 'Registrasi pengesahan pemakaian pesawat angkat-angkut (forklift, lift elevator), bejana tekan, instalasi petir, genset listrik kantor bersama PJK3 berizin.'
      },
      {
        title: 'Audit SMK3 (Sistem Manajemen K3)',
        desc: 'Pendaftaran dan pelaporan audit sertifikasi SMK3 PP No. 50/2012 untuk memperoleh bendera perak atau emas dan penghargaan Keselamatan Kerja dari Menaker.'
      }
    ]
  },
  section3: {
    title: '3. Langkah Pelaporan Triwulan P2K3 di Teman K3',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Login Akun Perusahaan di temank3.kemnaker.go.id',
        desc: 'Masuk menggunakan kredensial akun perusahaan atau akun personil Ahli K3 yang terafiliasi dengan perusahaan.'
      },
      {
        step: '02',
        title: 'Pilih Modul Pelaporan P2K3',
        desc: 'Buka menu "Pelaporan" > "Laporan Triwulan P2K3". Pilih periode triwulan yang dilaporkan (Triwulan I: Jan-Mar, II: Apr-Jun, III: Jul-Sep, IV: Okt-Des).'
      },
      {
        step: '03',
        title: 'Input Data Jam Kerja & Statistik Insiden',
        desc: 'Masukkan total jumlah pekerja, total jam kerja orang (man-hours), jumlah hari hilang (Lost Time Injury / LTI), Frequency Rate (FR), dan Severity Rate (SR).'
      },
      {
        step: '04',
        title: 'Unggah Berkas Notula Rapat & Program K3',
        desc: 'Unggah dokumen notulen rapat P2K3 tiga bulan terakhir, hasil inspeksi K3, dan foto dokumentasi kegiatan penanganan bahaya dalam format PDF.'
      },
      {
        step: '05',
        title: 'Kirim Laporan & Arsipkan Tanda Terima',
        desc: 'Kirim laporan dan simpan tanda terima pengesahan digital sebagai bukti kepatuhan K3 saat dilakukan inspeksi pengawas ketenagakerjaan.'
      }
    ]
  },
  section4: {
    title: '4. FAQ K3 & Keselamatan Kerja',
    icon: 'help',
    faqs: [
      {
        q: 'Siapa yang menjabat sebagai Ketua dan Sekretaris P2K3?',
        a: 'Sesuai Permenaker 04/MEN/1987, Ketua P2K3 wajib dijabat oleh pimpinan puncak perusahaan (Direktur/GM), dan Sekretaris P2K3 wajib dijabat oleh Ahli K3 Umum perusahaan.'
      },
      {
        q: 'Apakah kantor perbankan / IT yang berisiko rendah wajib memiliki P2K3?',
        a: 'Jika jumlah karyawan di kantor tersebut mencapai 100 orang atau lebih, maka tetap wajib membentuk P2K3 meskipun dikategorikan sebagai jenis usaha risiko rendah.'
      }
    ]
  }
};
