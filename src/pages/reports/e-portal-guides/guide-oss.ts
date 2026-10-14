import { PortalGuideData } from './guide-data-types';

export const guideOSSData: PortalGuideData = {
  portalId: 'oss',
  section1: {
    title: '1. Dasar Hukum & Kewajiban Penyampaian LKPM',
    icon: 'shield',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan PP No. 5 Tahun 2021 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko jo. Peraturan BKPM No. 5 Tahun 2021 tentang Pedoman dan Tata Cara Pengawasan Perizinan Berusaha Berbasis Risiko, di mana setiap pelaku usaha penanaman modal wajib menyampaikan Laporan Kegiatan Penanaman Modal (LKPM) secara berkala melalui portal OSS RBA (oss.go.id).',
      'LKPM mencakup pelaporan realisasi investasi modal tetap, modal kerja, penyerapan tenaga kerja (WNI dan TKA), serta permasalahan yang dihadapi perusahaan dalam merealisasikan investasinya.'
    ],
    alert: {
      title: 'Peringatan & Sanksi Pencabutan NIB:',
      text: 'Kelalaian menyampaikan LKPM selama 3 (tiga) periode berturut-turut akan dikenakan sanksi peringatan tertulis pertama, kedua, hingga sanksi pembekuan dan pencabutan hak akses kepabeanan serta pembatalan izin berusaha (NIB) otomatis oleh sistem OSS RBA.',
      variant: 'amber'
    }
  },
  section2: {
    title: '2. Jadwal & Periode Penyampaian LKPM',
    icon: 'clock',
    noticeCards: [
      {
        title: 'Usaha Menengah & Besar (Triwulanan):',
        list: [
          'Triwulan I (Jan - Mar): Lapor tgl 1 - 10 April',
          'Triwulan II (Apr - Jun): Lapor tgl 1 - 10 Juli',
          'Triwulan III (Jul - Sep): Lapor tgl 1 - 10 Oktober',
          'Triwulan IV (Okt - Des): Lapor tgl 1 - 10 Januari tahun berikutnya'
        ],
        variant: 'blue'
      },
      {
        title: 'Usaha Kecil (Semesteran):',
        list: [
          'Semester I (Jan - Jun): Lapor tgl 1 - 10 Juli',
          'Semester II (Jul - Des): Lapor tgl 1 - 10 Januari tahun berikutnya',
          'Catatan: Usaha Mikro tidak diwajibkan menyampaikan LKPM.'
        ],
        variant: 'slate'
      }
    ]
  },
  section3: {
    title: '4. Panduan Langkah Submit LKPM di OSS RBA',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Login Akun Hak Akses OSS Perusahaan',
        desc: 'Akses oss.go.id, klik Masuk. Masukkan Username, Password, dan kode verifikasi Captcha. Pastikan menggunakan hak akses badan usaha.'
      },
      {
        step: '02',
        title: 'Masuk Menu Pelaporan LKPM',
        desc: 'Pilih menu "Pelaporan" > "Laporan LKPM" > "Tambah Laporan". Pilih Nomor Induk Berusaha (NIB) dan proyek KBLI yang akan dilaporkan.'
      },
      {
        step: '03',
        title: 'Input Realisasi Investasi & Tenaga Kerja',
        desc: 'Isi nilai realisasi penambahan modal, belanja aktiva gedung, mesin kantor, serta jumlah kumulatif tenaga kerja Indonesia dan asing yang aktif bekerja.'
      },
      {
        step: '04',
        title: 'Catat Kendala Operasional (Jika Ada)',
        desc: 'Sampaikan kendala perizinan daerah, pengadaan utilitas, atau regulasi agar dapat difasilitasi oleh Satgas Percepatan Investasi BKPM / Kementerian Investasi.'
      },
      {
        step: '05',
        title: 'Kirim LKPM & Unduh Tanda Terima Elektronik',
        desc: 'Kirim laporan sebelum tanggal 10. Periksa status verifikasi (Disetujui / Perbaikan). Unduh bukti tanda terima laporan LKPM elektronik resmi.'
      }
    ]
  },
  section4: {
    title: '5. FAQ Pelaporan LKPM & OSS RBA',
    icon: 'help',
    faqs: [
      {
        q: 'Apakah perusahaan yang belum beroperasi komersial (tahap konstruksi) wajib lapor LKPM?',
        a: 'Ya, tetap wajib. Pilih jenis LKPM "Tahap Konstruksi / Belum Berproduksi Komersial" untuk melaporkan biaya pengadaan tanah, sewa kantor, renovasi, dan perizinan awal.'
      },
      {
        q: 'Bagaimana jika status LKPM dikembalikan untuk perbaikan?',
        a: 'Pelaku usaha diberikan waktu maksimal 5 (lima) hari kerja untuk memperbaiki catatan verifikator dan mengirimkan kembali melalui sistem OSS.'
      }
    ]
  },
  extraSection: {
    title: '3. Checklist Komponen Data Realisasi LKPM',
    icon: 'coins',
    cards: [
      {
        title: 'Realisasi Modal Tetap (Aktiva Tetap):',
        desc: 'Pembelian tanah, biaya sewa gedung kantor, renovasi bangunan, pembelian mesin, kendaraan dinas, peralatan komputer IT, dan mebeler kantor General Affairs.'
      },
      {
        title: 'Realisasi Modal Kerja:',
        desc: 'Biaya operasional bahan baku, pengeluaran utilitas listrik, air, sewa internet, dan total pengeluaran beban gaji karyawan (payroll) dalam periode yang bersangkutan.'
      },
      {
        title: 'Penyerapan Tenaga Kerja:',
        desc: 'Jumlah penambahan atau mutasi tenaga kerja Indonesia (laki-laki & perempuan) serta tenaga kerja asing dalam periode berjalan sesuai rekap database HRMatrix.'
      },
      {
        title: 'Tanggung Jawab Sosial & Lingkungan (TJSL):',
        desc: 'Realisasi kegiatan CSR, pembinaan kemitraan dengan UMKM lokal, dan perizinan lingkungan hidup yang dimiliki perusahaan.'
      }
    ]
  }
};
