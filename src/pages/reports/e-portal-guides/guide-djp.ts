import { PortalGuideData } from './guide-data-types';

export const guideDJPData: PortalGuideData = {
  portalId: 'djp',
  section1: {
    title: '1. Dasar Hukum & Skema PPh 21 TER (PP 58/2023 & PMK 168/2023)',
    icon: 'receipt',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP No. 7/2021), PP No. 58 Tahun 2023, dan Peraturan Menteri Keuangan No. 168 Tahun 2023, di mana penghitungan PPh Pasal 21 masa Januari s.d. November menggunakan mekanisme Tarif Efektif Rata-Rata (TER) yang diklasifikasikan ke dalam 3 kategori berdasarkan status Penghasilan Tidak Kena Pajak (PTKP):',
      'Pada Masa Pajak Terakhir (Desember), pajak dihitung kembali menggunakan tarif umum Pasal 17 ayat (1) huruf a UU PPh atas seluruh penghasilan bruto setahun dikurangi biaya jabatan (maks Rp 6 jt/thn), iuran pensiun/JHT, dan PTKP, kemudian dikurangkan dengan PPh 21 yang telah dipotong pada masa Januari-November.'
    ],
    bulletPoints: [
      'TER Kategori A: PTKP TK/0 (Rp 54 jt), TK/1 & K/0 (Rp 58.5 jt)',
      'TER Kategori B: PTKP TK/2 & K/1 (Rp 63 jt), TK/3 & K/2 (Rp 67.5 jt)',
      'TER Kategori C: PTKP K/3 (Rp 72 jt)'
    ]
  },
  section2: {
    title: '2. Batas Penyetoran (e-Billing) & Pelaporan SPT Masa',
    icon: 'clock',
    noticeCards: [
      {
        title: 'Jatuh Tempo Pembayaran (Setor):',
        desc: 'Penyetoran PPh Pasal 21 terutang wajib dilakukan paling lambat tanggal 10 bulan berikutnya setelah masa pajak berakhir. Keterlambatan dikenakan sanksi bunga administrasi per bulan.',
        variant: 'amber'
      },
      {
        title: 'Jatuh Tempo Pelaporan (SPT Masa):',
        desc: 'Pelaporan SPT Masa PPh Pasal 21/26 melalui e-Bupot 21/26 wajib disampaikan paling lambat tanggal 20 bulan berikutnya. Denda keterlambatan pelaporan SPT Masa adalah Rp 100.000,- per SPT.',
        variant: 'blue'
      }
    ]
  },
  section3: {
    title: '3. Alur Pelaporan di Aplikasi e-Bupot 21/26',
    icon: 'spreadsheet',
    steps: [
      {
        step: '01',
        title: 'Login DJP Online Akun NPWP Badan',
        desc: 'Akses djponline.pajak.go.id, masukkan 16 digit NPWP Badan (NIK/NPWP 16), kata sandi akun, dan captcha. Masuk ke tab "Layanan" lalu pilih "e-Bupot 21/26".'
      },
      {
        step: '02',
        title: 'Pembuatan Bukti Potong (Bupot) Pegawai Tetap',
        desc: 'Buka menu "Bukti Pemotongan" > "Daftar Bupot Pasal 21". Anda dapat mengimpor file skema Excel / XML hasil ekspor penggajian HRMatrix yang memuat data NIK, Nama, PTKP, Bruto, dan potongan TER.'
      },
      {
        step: '03',
        title: 'Pembuatan Kode Billing Penyetoran',
        desc: 'Buka menu "e-Billing", buat kode billing dengan Kode Jenis Setoran (KJS) 411121 - 100 (PPh Pasal 21 Masa). Bayar melalui ATM/Teller/Internet Banking sebelum tanggal 10.'
      },
      {
        step: '04',
        title: 'Rekam Bukti Penyetoran (NTPN)',
        desc: 'Pada menu SPT Masa e-Bupot, input Nomor Transaksi Penerimaan Negara (NTPN) dari bukti setor bank untuk mencocokkan jumlah pajak terutang dengan pembayaran.'
      },
      {
        step: '05',
        title: 'Kirim SPT Masa & Unduh Bukti Penerimaan Elektronik (BPE)',
        desc: 'Verifikasi induk SPT, masukkan pass-phrase sertifikat elektronik / kode verifikasi SMS/Email, klik "Kirim SPT". Simpan Bukti Penerimaan Elektronik (BPE) sebagai dokumen arsip resmi.'
      }
    ]
  },
  section4: {
    title: '4. FAQ & Catatan Penting Pajak Penghasilan',
    icon: 'help',
    faqs: [
      {
        q: 'Apakah setiap bulan wajib menerbitkan bukti potong untuk setiap karyawan?',
        a: 'Menurut ketentuan e-Bupot 21/26 PMK 168/2023, bukti potong bulanan (Formulir 1721-VIII) dibuat untuk setiap pegawai tetap. Pada akhir tahun atau saat berhenti bekerja, perusahaan wajib memberikan Formulir 1721-A1 kepada karyawan untuk pelaporan SPT Tahunan Orang Pribadi.'
      },
      {
        q: 'Bagaimana jika terjadi lebih bayar pada masa pajak Desember?',
        a: 'Kelebihan pemotongan PPh 21 pada bulan Desember wajib dikembalikan oleh pemotong pajak (perusahaan) kepada pegawai yang bersangkutan bersamaan dengan pemberian bukti potong 1721-A1.'
      }
    ]
  }
};
