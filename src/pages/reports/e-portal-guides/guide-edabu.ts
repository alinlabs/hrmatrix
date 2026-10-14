import { PortalGuideData } from './guide-data-types';

export const guideEdabuData: PortalGuideData = {
  portalId: 'edabu',
  section1: {
    title: '1. Regulasi Iuran JKN-KIS & Skema 4% + 1%',
    icon: 'heart',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan UU No. 24 Tahun 2011 dan Peraturan Presiden No. 82 Tahun 2018 jo. Perpres No. 64 Tahun 2020 tentang Jaminan Kesehatan, di mana iuran bagi peserta Pekerja Penerima Upah (PPU) Badan Usaha ditetapkan sebesar 5% (lima persen) dari Upah per bulan.',
      'Besaran iuran mencakup perlindungan untuk 5 (lima) orang anggota keluarga, yaitu pekerja, suami/istri yang sah, dan 3 (tiga) orang anak yang sah (belum menikah, belum bekerja, dan berusia maksimal 21 tahun atau 25 tahun jika masih menempuh pendidikan formal).'
    ],
    bulletPoints: [
      '4% (empat persen) dibayar oleh Pemberi Kerja (Perusahaan)',
      '1% (satu persen) dipotong dari gaji Pekerja'
    ],
    subCards: [
      {
        title: 'Batas Plafon Gaji Maksimal:',
        desc: 'Dasar perhitungan maksimal iuran adalah Rp 12.000.000,- / bulan. Jika gaji karyawan di atas Rp 12 juta, iuran maksimal tetap dihitung dari batas plafon tersebut (maks iuran total Rp 600.000,-).',
        variant: 'emerald'
      },
      {
        title: 'Batas Upah Terendah:',
        desc: 'Dasar perhitungan terendah iuran adalah Upah Minimum Kabupaten/Kota (UMK) atau Upah Minimum Provinsi (UMP) wilayah kerja yang berlaku.',
        variant: 'blue'
      }
    ]
  },
  section2: {
    title: '2. Batas Cut-Off Mutasi & Jatuh Tempo Pembayaran',
    icon: 'clock',
    noticeCards: [
      {
        title: 'Cut-Off Mutasi Data Peserta (e-Dabu):',
        desc: 'Seluruh mutasi tambah karyawan, penonaktifan karyawan resign, mutasi gaji, dan pendaftaran anggota keluarga wajib dilakukan paling lambat tanggal 20 setiap bulan agar tidak tertagih pada tagihan iuran bulan berikutnya.',
        variant: 'slate'
      },
      {
        title: 'Batas Pembayaran Premi:',
        desc: 'Pembayaran iuran paling lambat tanggal 10 setiap bulan berjalan. Keterlambatan pembayaran mengakibatkan penonaktifan sementara status kepesertaan aktif seluruh karyawan dan dikenakan denda pelayanan rawat inap sebesar 5%.',
        variant: 'amber'
      }
    ]
  },
  section3: {
    title: '3. Langkah-Langkah Operasional di e-Dabu',
    icon: 'users',
    steps: [
      {
        step: '01',
        title: 'Masuk ke Portal e-Dabu Badan Usaha',
        desc: 'Buka edabu.bpjs-kesehatan.go.id. Masukkan Username badan usaha, Password, dan kode Captcha. Pilih nomor Badan Usaha (BU).'
      },
      {
        step: '02',
        title: 'Pendaftaran Peserta Baru / Tambah Keluarga',
        desc: 'Pilih menu "Peserta" > "Pendaftaran Peserta". Masukkan Nomor Kartu Keluarga (KK) dan NIK karyawan. Pilih fasilitas kesehatan tingkat pertama (FKTP) seperti Puskesmas / Klinik pratama terdekat.'
      },
      {
        step: '03',
        title: 'Mutasi Gaji / Penyesuaian Upah Berkala',
        desc: 'Pilih menu "Mutasi Peserta" > "Ubah Gaji". Anda dapat mengunggah file template Excel pembaharuan gaji karyawan yang dihasilkan otomatis dari modul payroll HRMatrix.'
      },
      {
        step: '04',
        title: 'Cek Tagihan & Rincian Peserta (Daftar Tagihan)',
        desc: 'Pada tanggal 1 awal bulan, buka menu "Tagihan" > "Daftar Tagihan". Verifikasi jumlah peserta dan total premi yang harus dibayarkan.'
      },
      {
        step: '05',
        title: 'Generate Kode Virtual Account (VA) & Pembayaran',
        desc: 'Salin 16 digit nomor Virtual Account (VA) Badan Usaha (BNI, BRI, Mandiri, BCA). Bayar melalui cash management perbankan sebelum tanggal 10.'
      }
    ]
  },
  section4: {
    title: '4. Kendala Umum & Solusi Teknis e-Dabu',
    icon: 'help',
    faqs: [
      {
        q: 'Karyawan baru sudah terdaftar sebagai peserta mandiri / segmen lain yang menunggak?',
        a: 'Saat didaftarkan ke segmen PPU Badan Usaha, status peserta akan dialihkan secara otomatis. Namun tunggakan mandiri sebelumnya tetap menjadi kewajiban pribadi pekerja yang bersangkutan.'
      },
      {
        q: 'Karyawan telah resign tapi tagihannya masih muncul di bulan ini?',
        a: 'Pastikan penonaktifan peserta dilakukan sebelum tanggal 20 bulan sebelumnya. Jika dinonaktifkan setelah tanggal 20, tagihan bulan berjalan masih akan tetap tertagih sesuai ketentuan sistem BPJS Kesehatan.'
      }
    ]
  }
};
