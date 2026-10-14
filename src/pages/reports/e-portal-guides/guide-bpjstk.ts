import { PortalGuideData } from './guide-data-types';

export const guideBPJSTKData: PortalGuideData = {
  portalId: 'bpjstk',
  section1: {
    title: '1. Dasar Hukum & Struktur 5 Program Jamsostek',
    icon: 'shield',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan UU No. 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial, PP No. 44/2015 (JKK & JKM), PP No. 45/2015 (JP), PP No. 46/2015 (JHT), dan PP No. 37/2021 (JKP), di mana setiap pemberi kerja wajib mendaftarkan pekerjanya dan membayar iuran jaminan sosial secara tertib setiap bulan.',
      'Portal SIPP Online (Sistem Informasi Pelaporan Peserta) digunakan untuk melakukan mutasi tenaga kerja (tambah/keluar), pelaporan perubahan upah bulanan, serta mengunduh rincian iuran dan kode bayar EPS (Electronic Payment System).'
    ],
    table: {
      headers: ['Program', 'Beban Perusahaan', 'Beban Karyawan', 'Total Iuran', 'Batas Maksimal Upah'],
      rows: [
        {
          col1: 'JKK (Kecelakaan Kerja)',
          col2: '0.24% - 1.74%',
          col3: '0%',
          col4: 'Sesuai Tingkat Risiko',
          col5: 'Tanpa batas plafon'
        },
        {
          col1: 'JKM (Kematian)',
          col2: '0.30%',
          col3: '0%',
          col4: '0.30%',
          col5: 'Tanpa batas plafon'
        },
        {
          col1: 'JHT (Hari Tua)',
          col2: '3.70%',
          col3: '2.00%',
          col4: '5.70%',
          col5: 'Tanpa batas plafon'
        },
        {
          col1: 'JP (Pensiun)',
          col2: '2.00%',
          col3: '1.00%',
          col4: '3.00%',
          col5: 'Plafon Rp 10.042.300 / bln'
        },
        {
          col1: 'JKP (Kehilangan Pekerjaan)',
          col2: '0.22% + 0.24% APBN',
          col3: '0%',
          col4: '0.46% (Rekomposisi)',
          col5: 'Maks Rp 5.000.000 / bln'
        }
      ]
    }
  },
  section2: {
    title: '2. Batas Waktu & Denda Administratif',
    icon: 'clock',
    noticeCards: [
      {
        title: 'Jatuh Tempo Pembayaran:',
        desc: 'Iuran wajib disetorkan paling lambat tanggal 15 setiap bulan berjalan (misal: Iuran periode gaji Januari wajib dibayar paling lambat 15 Februari).',
        variant: 'blue'
      },
      {
        title: 'Denda Keterlambatan Iuran:',
        desc: 'Keterlambatan pembayaran dikenakan denda sebesar 2% (dua persen) per bulan dari total tagihan iuran yang tertunggak.',
        variant: 'rose'
      }
    ]
  },
  section3: {
    title: '3. Alur Rekonsiliasi & Pelaporan di SIPP Online',
    icon: 'spreadsheet',
    steps: [
      {
        step: '01',
        title: 'Login SIPP Menggunakan Akun Perusahaan',
        desc: 'Akses sipp.bpjsketenagakerjaan.go.id, masukkan email terdaftar, kata sandi, dan captcha keamanan. Pastikan memilih Nomor Pendaftaran Perusahaan (NPP) yang sesuai.'
      },
      {
        step: '02',
        title: 'Input Mutasi Tenaga Kerja (Tambah / Nonaktifkan)',
        desc: 'Tambahkan data karyawan baru dengan menginput NIK KTP, Nama lengkap sesuai Dukcapil, tanggal lahir, dan besaran upah pokok + tunjangan tetap. Bagi karyawan yang resign/PHK, lakukan proses nonaktifasi (Formulir 1a).'
      },
      {
        step: '03',
        title: 'Rekonsiliasi Upah Bulanan (Upload Excel / Input Manual)',
        desc: 'Jika ada penyesuaian gaji atau kenaikan UMK, unggah template file Excel mutasi upah karyawan yang diekspor dari aplikasi HRMatrix.'
      },
      {
        step: '04',
        title: 'Finalisasi Hitung Iuran & Generate Kode Billing EPS',
        desc: 'Klik menu "Hitung Iuran". Periksa rincian iuran per program. Jika sudah sesuai, klik "Finalisasi" untuk menerbitkan Kode Pembayaran EPS (16 digit angka).'
      },
      {
        step: '05',
        title: 'Pembayaran Melalui Virtual Account / Bank Partner',
        desc: 'Lakukan pembayaran melalui ATM, Teller, atau Internet Banking Corporate (Mandiri MCM, BCA KlikBCA Bisnis, BNI Direct, BRI CMS) sebelum tanggal 15.'
      }
    ]
  },
  section4: {
    title: '4. FAQ & Solusi Kendala Teknis SIPP',
    icon: 'help',
    faqs: [
      {
        q: 'NIK Karyawan baru ditolak atau berstatus "NIK Tidak Ditemukan"?',
        a: 'SIPP terhubung langsung ke Dukcapil Pusat. Pastikan e-KTP dan KK karyawan telah terupdate. Jika baru pindah domisili, minta karyawan melakukan konsolidasi NIK di Disdukcapil setempat atau call center 175.'
      },
      {
        q: 'Kode EPS sudah dibayar tetapi status di SIPP masih "Belum Lunas"?',
        a: 'Sistem perbankan membutuhkan waktu rekonsiliasi otomatis 15-30 menit. Simpan struk bukti transfer dan lakukan refresh berkala di halaman riwayat transaksi SIPP.'
      }
    ]
  }
};
