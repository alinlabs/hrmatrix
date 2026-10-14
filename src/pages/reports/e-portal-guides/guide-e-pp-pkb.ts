import { PortalGuideData } from './guide-data-types';

export const guideEPPPKBData: PortalGuideData = {
  portalId: 'e-pp-pkb',
  section1: {
    title: '1. Dasar Hukum & Ketentuan Pengesahan Peraturan Perusahaan',
    icon: 'scale',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan Pasal 108 UU No. 13 Tahun 2003 tentang Ketenagakerjaan jo. UU Cipta Kerja No. 6/2023 dan Permenaker No. 28 Tahun 2014, di mana pengusaha yang mempekerjakan pekerja/buruh sekurang-kurangnya 10 (sepuluh) orang wajib membuat Peraturan Perusahaan (PP) yang mulai berlaku setelah disahkan oleh Menteri Ketenagakerjaan atau pejabat yang ditunjuk (Disnaker setempat).',
      'Masa berlaku Peraturan Perusahaan paling lama 2 (dua) tahun dan wajib diperbaharui kembali setelah habis masa berlakunya. Pembuatan PP merupakan hak dan kewajiban pengusaha dengan memperhatikan saran dan pertimbangan dari wakil pekerja/buruh.'
    ],
    alert: {
      title: 'Sanksi Pidana Tidak Memiliki PP:',
      text: 'Pengusaha yang mempekerjakan 10 pekerja atau lebih dan tidak membuat/mengesahkan Peraturan Perusahaan dikenakan sanksi pidana denda paling sedikit Rp 5.000.000,- (lima juta rupiah) dan paling banyak Rp 50.000.000,- (lima puluh juta rupiah) sesuai Pasal 188 UU Ketenagakerjaan.',
      variant: 'amber'
    }
  },
  section2: {
    title: '2. Berkas Persyaratan Pengesahan PP di e-PP Kemnaker',
    icon: 'file',
    cards: [
      {
        title: 'Dokumen Naskah & Permohonan',
        items: [
          'Surat Permohonan Pengesahan bermaterai Rp 10.000,-',
          'Naskah rancangan draft Peraturan Perusahaan (PDF)',
          'Struktur dan Skala Upah (SUSU) yang berlaku',
          'Bukti Lapor WLKP Online yang masih berlaku'
        ]
      },
      {
        title: 'Bukti Partisipasi Wakil Pekerja',
        items: [
          'Surat pernyataan saran/pertimbangan wakil pekerja',
          'Daftar hadir sosialisasi pembahasan draft PP',
          'Bukti kepesertaan aktif BPJS Ketenagakerjaan & Kesehatan',
          'SK Pengesahan PP periode sebelumnya (untuk perpanjangan)'
        ]
      }
    ]
  },
  section3: {
    title: '3. Alur Pengajuan Daring di Portal e-PP/PKB',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Login ke Portal pppkb.kemnaker.go.id',
        desc: 'Gunakan akun SIAPkerja Kemnaker yang terdaftar atas nama perusahaan Anda.'
      },
      {
        step: '02',
        title: 'Pilih Wilayah Kewenangan Pengesahan',
        desc: 'Jika perusahaan hanya memiliki kantor di 1 kab/kota, pilih Disnaker Kab/Kota. Jika beroperasi lintas kab/kota dalam 1 provinsi, pilih Disnaker Provinsi. Jika beroperasi di lebih dari 1 provinsi, pilih Ditjen PHI Kemnaker Pusat.'
      },
      {
        step: '03',
        title: 'Unggah Berkas Persyaratan & Draft Naskah PP',
        desc: 'Unggah naskah rancangan PP (format PDF) beserta surat permohonan, bukti saran wakil pekerja, bukti BPJS, dan bukti kepemilikan struktur skala upah.'
      },
      {
        step: '04',
        title: 'Proses Verifikasi Yuridis oleh Pengawas/Mediator',
        desc: 'Pejabat Disnaker memeriksa apakah ada pasal-pasal yang bertentangan dengan hukum ketenagakerjaan atau berada di bawah standar normatif undang-undang. Jangka waktu verifikasi maksimal 30 hari kerja.'
      },
      {
        step: '05',
        title: 'Penerbitan SK Pengesahan & Tanda Tangan Elektronik',
        desc: 'Setelah dinyatakan lengkap dan sah, terbit Surat Keputusan (SK) Pengesahan Peraturan Perusahaan resmi dengan Tanda Tangan Elektronik (TTE / QR Code BSrE). Unduh dan cetak untuk disosialisasikan kepada seluruh karyawan.'
      }
    ]
  },
  section4: {
    title: '4. FAQ Seputar Pengesahan PP',
    icon: 'help',
    faqs: [
      {
        q: 'Kapan permohonan pembaruan PP harus diajukan?',
        a: 'Permohonan pengesahan pembaruan PP wajib diajukan sekurang-kurangnya 30 (tiga puluh) hari kerja sebelum masa berlaku PP yang bersangkutan berakhir.'
      },
      {
        q: 'Apakah perusahaan wajib membagikan naskah PP kepada karyawan?',
        a: 'Ya, pengusaha wajib memberitahukan dan menjelaskan isi serta memberikan naskah Peraturan Perusahaan atau menempelkannya di tempat yang mudah dibaca oleh para pekerja/buruh.'
      }
    ]
  }
};
