import { PortalGuideData } from './guide-data-types';

export const guideTKAOnlineData: PortalGuideData = {
  portalId: 'tka-online',
  section1: {
    title: '1. Dasar Hukum Penggunaan Tenaga Kerja Asing (TKA)',
    icon: 'globe',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan PP No. 34 Tahun 2021 tentang Penggunaan Tenaga Kerja Asing dan Permenaker No. 8 Tahun 2021, di mana setiap pemberi kerja yang mempekerjakan TKA wajib memiliki Rencana Penggunaan Tenaga Kerja Asing (RPTKA) yang disahkan oleh Menteri Ketenagakerjaan atau pejabat yang ditunjuk.',
      'TKA hanya dapat dipekerjakan dalam hubungan kerja untuk jabatan tertentu dan waktu tertentu (PKWT), serta dilarang menduduki jabatan yang mengurusi personalia (HRD/Personalia) dan/atau jabatan-jabatan tertentu sebagaimana diatur dalam Kepmenaker No. 349 Tahun 2019.'
    ],
    alert: {
      title: 'Dana Kompensasi Penggunaan TKA (DKP-TKA):',
      text: 'Pemberi kerja wajib membayar DKP-TKA sebesar USD 100 (seratus dolar Amerika Serikat) per bulan untuk setiap TKA yang dibayarkan di muka sebagai Penerimaan Negara Bukan Pajak (PNBP) Kemnaker.',
      variant: 'blue'
    }
  },
  section2: {
    title: '2. Kewajiban Pendampingan Tenaga Kerja WNI (Transfer of Knowledge)',
    icon: 'globe',
    cards: [
      {
        title: 'Penunjukan TKI Pendamping:',
        desc: 'Pemberi kerja TKA wajib menunjuk tenaga kerja warga negara Indonesia sebagai tenaga kerja pendamping TKA yang dipekerjakan untuk alih teknologi dan alih keahlian.'
      },
      {
        title: 'Pendidikan & Pelatihan Kerja:',
        desc: 'Melaksanakan pendidikan dan pelatihan kerja bagi tenaga kerja pendamping WNI sesuai dengan kualifikasi jabatan yang diduduki oleh TKA bersangkutan.'
      }
    ]
  },
  section3: {
    title: '3. Alur Pengesahan RPTKA & Notifikasi Izin Kerja',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Pengajuan Permohonan Pengesahan RPTKA',
        desc: 'Akses tka-online.kemnaker.go.id. Isi identitas pemberi kerja TKA, alasan penggunaan, jabatan yang akan diduduki, jangka waktu, dan jumlah TKA.'
      },
      {
        step: '02',
        title: 'Penilaian Kelayakan & Ekspose Jabatan',
        desc: 'Kemnaker melakukan verifikasi dokumen dan kelayakan teknis secara online, memastikan jabatan tidak termasuk daftar terlarang untuk TKA.'
      },
      {
        step: '03',
        title: 'Input Calon TKA & Unggah Dokumen Paspor/Ijazah',
        desc: 'Masukkan data paspor calon TKA, ijazah pendidikan yang relevan, sertifikat kompetensi atau bukti pengalaman kerja minimal 5 tahun, dan polis asuransi.'
      },
      {
        step: '04',
        title: 'Pembayaran Billing DKP-TKA (PNBP)',
        desc: 'Sistem menerbitkan kode billing Simponi Kemenkeu untuk pembayaran DKP-TKA (USD 100/bln x masa kerja). Lakukan pembayaran melalui bank devisa / persepsi.'
      },
      {
        step: '05',
        title: 'Penerbitan Notifikasi & Integrasi Visa Imigrasi (VITAS)',
        desc: 'Notifikasi persetujuan diterbitkan dan langsung dikirim secara elektronik ke Sistem Informasi Manajemen Keimigrasian (SIMKIM) Ditjen Imigrasi untuk penerbitan Telex Visa / KITAS.'
      }
    ]
  },
  section4: {
    title: '4. FAQ & Larangan Terkait TKA',
    icon: 'help',
    faqs: [
      {
        q: 'Apakah TKA boleh menjabat sebagai HR Director atau HR Manager?',
        a: 'Tegas DILARANG. Sesuai Pasal 46 UU Ketenagakerjaan dan Kepmenaker 349/2019, TKA dilarang menduduki jabatan yang membidangi personalia dan ketenagakerjaan perusahaan (HRD, Personnel Specialist, Industrial Relations).'
      },
      {
        q: 'Apakah Direksi / Komisaris yang merupakan pemegang saham wajib memiliki RPTKA?',
        a: 'Sesuai PP 34/2021, Direksi atau Komisaris dengan kepemilikan saham tertentu dikecualikan dari kewajiban RPTKA, namun tetap wajib mengurus visa tinggal terbatas dan izin tinggal keimigrasian.'
      }
    ]
  }
};
