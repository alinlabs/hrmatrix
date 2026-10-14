import { PortalGuideData } from './guide-data-types';

export const guideKemenakerData: PortalGuideData = {
  portalId: 'kemenaker',
  section1: {
    title: '1. Dasar Hukum & Ketentuan Kewajiban Lapor',
    icon: 'shield',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan Undang-Undang No. 7 Tahun 1981 tentang Wajib Lapor Ketenagakerjaan di Perusahaan jo. Permenaker No. 18 Tahun 2017, di mana setiap pengusaha atau pengurus wajib melaporkan secara tertulis setiap mendirikan, menghentikan, menjalankan kembali, memindahkan, atau membubarkan perusahaan.',
      'Pelaporan dilakukan secara berkala minimal 1 (satu) tahun sekali pada portal WLKP Online Kemnaker. Bukti pelaporan WLKP merupakan syarat mutlak dalam pengurusan perpanjangan izin berusaha (NIB di OSS), pengesahan Peraturan Perusahaan (PP/PKB), serta permohonan RPTKA bagi tenaga kerja asing.'
    ],
    alert: {
      title: 'Sanksi Hukum Kelalaian:',
      text: 'Pelanggaran terhadap kewajiban WLKP diancam dengan pidana kurungan maksimal 3 (tiga) bulan atau denda setinggi-tingginya sesuai ketentuan peraturan perundang-undangan ketenagakerjaan, serta pembatasan izin operasional di portal OSS.',
      variant: 'amber'
    }
  },
  section2: {
    title: '2. Checklist Berkas & Data yang Harus Disiapkan HR',
    icon: 'checklist',
    cards: [
      {
        title: 'Data Perusahaan & Legalitas',
        items: [
          'Nomor Induk Berusaha (NIB) dan NPWP Badan',
          'Akta Pendirian & SK Kemenkumham terakhir',
          'Alamat kantor pusat dan unit kantor cabang',
          'Nama Direksi, Pengurus, dan Penanggung Jawab HR'
        ]
      },
      {
        title: 'Data Demografi Ketenagakerjaan',
        items: [
          'Jumlah Tenaga Kerja WNI (Laki-laki & Perempuan)',
          'Jumlah Tenaga Kerja Asing (TKA) jika ada',
          'Status Hubungan Kerja (PKWTT, PKWT, Magang)',
          'Tingkat Pendidikan & Struktur Golongan Jabatan'
        ]
      },
      {
        title: 'Program Jaminan Sosial & Pengupahan',
        items: [
          'Nomor Pendaftaran BPJS Ketenagakerjaan (NPP)',
          'Nomor Badan Usaha BPJS Kesehatan',
          'Upah Terendah (UMK/UMP) & Upah Tertinggi',
          'Struktur dan Skala Upah (SUSU) yang berlaku'
        ]
      },
      {
        title: 'Fasilitas K3 & Hubungan Industrial',
        items: [
          'Panitia Pembina Keselamatan & Kesehatan Kerja (P2K3)',
          'Ada/tidaknya Peraturan Perusahaan (PP) atau PKB',
          'Fasilitas Kesejahteraan (Kantin, Ruang Laktasi, dsb)',
          'Pelatihan dan Pengembangan Kompetensi SDM'
        ]
      }
    ]
  },
  section3: {
    title: '3. Langkah-Langkah Pelaporan di WLKP Online',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Akses Portal & Registrasi Akun Kemnaker (SIAPkerja)',
        desc: 'Buka situs wajiblapor.kemnaker.go.id. Masuk menggunakan akun SIAPkerja perusahaan yang terintegrasi dengan NIB / Akun OSS badan usaha.'
      },
      {
        step: '02',
        title: 'Verifikasi Profil & Identitas Perusahaan',
        desc: 'Cek keakuratan data nama badan usaha, kode KBLI operasional, NPWP, alamat fisik, titik koordinat peta lokasi kantor, serta nomor kontak resmi penanggung jawab.'
      },
      {
        step: '03',
        title: 'Input Data Ketenagakerjaan & Rincian Pekerja',
        desc: 'Masukkan komposisi pekerja menurut jenis kelamin, status kontrak (PKWTT, PKWT, outsourcing), kelompok umur, dan golongan disabilitas sesuai data riil HRMatrix.'
      },
      {
        step: '04',
        title: 'Lengkapi Data Pengupahan, Jamsostek & K3',
        desc: 'Isi informasi penerapan UMP/UMK, keikutsertaan BPJS Ketenagakerjaan 5 program, BPJS Kesehatan, ada/tidaknya serikat pekerja, dan struktur kepengurusan K3.'
      },
      {
        step: '05',
        title: 'Kirim Laporan & Unduh Surat Bukti WLKP',
        desc: 'Periksa kembali rekapitulasi data, setujui pakta integritas data, lalu klik tombol "Kirim Laporan". Setelah disetujui sistem, unduh Bukti Lapor WLKP resmi bertanda tangan elektronik (QR Code Disnaker).'
      }
    ]
  },
  section4: {
    title: '4. Kendala Umum & Solusi Teknis (FAQ)',
    icon: 'help',
    faqs: [
      {
        q: 'Kapan bukti WLKP harus diperbarui?',
        a: 'Setiap tahun sekali sejak tanggal persetujuan laporan terakhir, atau selambat-lambatnya 30 hari kalender apabila terjadi perubahan signifikan (perubahan nama, alamat, kepengurusan, atau ekspansi cabang baru).'
      },
      {
        q: 'NIB tidak terbaca atau gagal sinkronisasi di sistem WLKP?',
        a: 'Pastikan profil perusahaan di portal OSS RBA telah berstatus terbit dan aktif. Lakukan logout dan login kembali di SIAPkerja menggunakan email PIC yang sama dengan akun OSS.'
      }
    ]
  }
};
