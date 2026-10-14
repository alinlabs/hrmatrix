import { PortalGuideData } from './guide-data-types';

export const guidePPHIData: PortalGuideData = {
  portalId: 'pphi',
  section1: {
    title: '1. Dasar Hukum Hubungan Industrial & Penyelesaian Perselisihan',
    icon: 'scale',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan Undang-Undang No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial (PPHI) dan UU No. 21 Tahun 2000 tentang Serikat Pekerja/Serikat Buruh, di mana setiap perselisihan hubungan industrial wajib diupayakan terlebih dahulu penyelesaiannya melalui perundingan Bipartit secara musyawarah untuk mufakat.',
      'Portal PPHI / SIMASNAKER Kemnaker (hi.kemnaker.go.id) digunakan untuk pencatatan nomor bukti Serikat Pekerja/Serikat Buruh (SP/SB), pencatatan Lembaga Kerja Sama (LKS) Bipartit perusahaan, serta registrasi permohonan Mediasi Hubungan Industrial apabila perundingan bipartit menemui jalan buntu (deadlock).'
    ],
    alert: {
      title: 'Kewajiban Pembentukan LKS Bipartit:',
      text: 'Setiap pengusaha yang mempekerjakan 50 (lima puluh) orang pekerja atau lebih wajib membentuk LKS Bipartit yang berfungsi sebagai forum komunikasi dan konsultasi mengenai hal-hal yang berkaitan dengan hubungan ketenagakerjaan di perusahaan.',
      variant: 'blue'
    }
  },
  section2: {
    title: '2. Klasifikasi 4 Jenis Perselisihan Hubungan Industrial',
    icon: 'file',
    cards: [
      {
        title: '1. Perselisihan Hak:',
        desc: 'Perselisihan akibat tidak dipenuhinya hak normatif pekerja yang bersumber dari peraturan perundang-undangan, perjanjian kerja, PP, atau PKB (misal: lembur tidak dibayar, pesangon kurang).'
      },
      {
        title: '2. Perselisihan Kepentingan:',
        desc: 'Perselisihan yang timbul karena tidak adanya kesesuaian pendapat mengenai pembuatan dan/atau perubahan syarat-syarat kerja (misal: kenaikan upah tahunan, bonus tahunan).'
      },
      {
        title: '3. Perselisihan Pemutusan Hubungan Kerja (PHK):',
        desc: 'Perselisihan yang timbul karena tidak adanya kesesuaian pendapat mengenai pengakhiran hubungan kerja atau besaran kompensasi pesangon/uang penghargaan masa kerja.'
      },
      {
        title: '4. Perselisihan Antar Serikat Pekerja:',
        desc: 'Perselisihan mengenai keanggotaan, pelaksanaan hak, dan kewajiban keserikatan pekerja dalam 1 (satu) perusahaan yang sama.'
      }
    ]
  },
  section3: {
    title: '3. Alur Penyelesaian Perselisihan (Bipartit hingga Tripartit)',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Perundingan Bipartit (Maksimal 30 Hari Kerja)',
        desc: 'Pengusaha dan pekerja berunding secara musyawarah. Wajib dibuat Risalah Bipartit yang memuat nama para pihak, pokok masalah, pendirian masing-masing pihak, dan kesimpulan kesepakatan atau ketidaksepakatan.'
      },
      {
        step: '02',
        title: 'Pembuatan Perjanjian Bersama (Jika Sepakat)',
        desc: 'Jika tercapai kesepakatan, dibuat Perjanjian Bersama (PB) yang ditandatangani kedua belah pihak dan didaftarkan pada Pengadilan Hubungan Industrial (PHI) setempat untuk mendapatkan akta bukti pendaftaran.'
      },
      {
        step: '03',
        title: 'Pencatatan ke Disnaker / Portal PPHI (Jika Deadlock)',
        desc: 'Jika bipartit gagal, salah satu atau kedua belah pihak mencatatkan perselisihan kepada Disnaker setempat dengan melampirkan bukti risalah bipartit yang gagal.'
      },
      {
        step: '04',
        title: 'Sidang Mediasi Tripartit oleh Mediator Disnaker',
        desc: 'Mediator memanggil para pihak untuk sidang mediasi maksimal 30 hari kerja. Jika tidak tercapai mufakat, Mediator menerbitkan Anjuran Tertulis resmi.'
      },
      {
        step: '05',
        title: 'Penerimaan Anjuran atau Gugatan ke Pengadilan Hubungan Industrial (PHI)',
        desc: 'Para pihak memberikan jawaban menyetujui atau menolak anjuran dalam 10 hari kerja. Pihak yang menolak dapat melanjutkan gugatan ke Pengadilan Hubungan Industrial (PHI).'
      }
    ]
  },
  section4: {
    title: '4. FAQ Hubungan Industrial & Bipartit',
    icon: 'help',
    faqs: [
      {
        q: 'Bisakah langsung mendaftarkan mediasi ke Disnaker tanpa perundingan bipartit?',
        a: 'Tidak bisa. Berdasarkan UU No. 2/2004, instansi ketenagakerjaan wajib mengembalikan berkas pencatatan jika tidak dilampiri bukti bahwa perundingan bipartit telah dilakukan secara sah.'
      },
      {
        q: 'Berapa minimal jumlah pekerja untuk membentuk Serikat Pekerja (SP/SB)?',
        a: 'Sekurang-kurangnya 10 (sepuluh) orang pekerja berhak membentuk serikat pekerja/serikat buruh secara bebas, terbuka, mandiri, dan demokratis.'
      }
    ]
  }
};
