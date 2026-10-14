import { PortalGuideData } from './guide-data-types';

export const guideSimpelData: PortalGuideData = {
  portalId: 'simpel',
  section1: {
    title: '1. Dasar Hukum Pelaporan Lingkungan Hidup Kantor (SIMPEL KLHK)',
    icon: 'leaf',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan PP No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup dan Permen LHK No. 24 Tahun 2020, di mana setiap penanggung jawab usaha dan/atau kegiatan yang memiliki dokumen persetujuan lingkungan (AMDAL, UKL-UPL, atau SPPL) wajib menyampaikan laporan pelaksanaan pengelolaan dan pemantauan lingkungan hidup secara elektronik melalui SIMPEL (Sistem Informasi Pelaporan Elektronik Lingkungan Hidup).',
      'Bagi fasilitas perkantoran dan gedung komersial yang dikelola tim General Affairs (GA), aspek wajib lapor meliputi: emisi cerobong genset cadangan darurat, pengolahan air limbah domestik (Septic Tank / Sewage Treatment Plant STP), kualitas udara dalam ruangan, serta pengelolaan sampah padat domestik.'
    ],
    alert: {
      title: 'Jadwal Pelaporan Semesteran:',
      text: 'Semester I (Januari - Juni): Batas lapor maksimal 31 Juli. Semester II (Juli - Desember): Batas lapor maksimal 31 Januari tahun berikutnya.',
      variant: 'emerald'
    }
  },
  section2: {
    title: '2. Aspek Pengelolaan Lingkungan Fasilitas Kantor GA',
    icon: 'file',
    cards: [
      {
        title: 'Pengendalian Pencemaran Udara (Emisi Genset):',
        desc: 'Hasil uji laboratorium lingkungan terakreditasi KAN atas emisi genset kantor (parameter Opasitas, CO, NOx, SO2) dan jam operasional running genset.'
      },
      {
        title: 'Pengendalian Pencemaran Air (Air Limbah Domestik):',
        desc: 'Laporan debit air limbah harian fasilitas kantor, pemeliharaan STP (Sewage Treatment Plant), dan hasil uji lab efluen (BOD, COD, TSS, Minyak & Lemak, E. coli).'
      },
      {
        title: 'Pelaksanaan RKL-RPL / UKL-UPL:',
        desc: 'Laporan narasi pelaksanaan upaya pengelolaan lingkungan sesuai matriks arahan dokumen lingkungan yang disahkan Dinas Lingkungan Hidup (DLH).'
      },
      {
        title: 'Pengurangan Sampah & Konservasi Energi:',
        desc: 'Pencatatan tonase sampah non-B3 yang dipilah, program 3R (Reduce, Reuse, Recycle) perkantoran, dan efisiensi pemakaian daya listrik gedung.'
      }
    ]
  },
  section3: {
    title: '3. Langkah-Langkah Pelaporan di Portal SIMPEL KLHK',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Login ke simpel.menlhk.go.id',
        desc: 'Masukkan Akun SIMPEL perusahaan (ID Perusahaan & Password). Jika belum memiliki akun, lakukan registrasi dengan melampirkan izin lingkungan / persetujuan teknis.'
      },
      {
        step: '02',
        title: 'Pilih Periode Semester Pelaporan',
        desc: 'Pilih Semester I atau Semester II pada tahun berjalan sesuai batas waktu jatuh tempo.'
      },
      {
        step: '03',
        title: 'Isi Data Teknis Pengelolaan & Input Hasil Uji Lab',
        desc: 'Masukkan data parameter pengujian kualitas lingkungan dari sertifikat hasil uji (CoA) laboratorium lingkungan terakreditasi KAN.'
      },
      {
        step: '04',
        title: 'Unggah Dokumen Laporan Lengkap (PDF)',
        desc: 'Unggah file laporan pelaksanaan RKL-RPL / UKL-UPL yang telah ditandatangani oleh pimpinan badan usaha serta dokumen pendukung lainnya.'
      },
      {
        step: '05',
        title: 'Validasi & Penerbitan Tanda Bukti Pelaporan (TBP)',
        desc: 'Kirim laporan. Sistem akan menerbitkan Tanda Bukti Pelaporan (TBP) Elektronik dengan QR Code resmi KLHK. Simpan TBP untuk bukti kepatuhan audit AMDAL / DLH.'
      }
    ]
  },
  section4: {
    title: '4. FAQ SIMPEL & Pengelolaan Lingkungan Kantor',
    icon: 'help',
    faqs: [
      {
        q: 'Apakah kantor sewa di gedung perkantoran bersama tetap wajib lapor SIMPEL?',
        a: 'Jika kantor Anda berstatus tenant/penyewa di gedung komersial, kewajiban pelaporan SIMPEL atas genset dan STP umum biasanya diemban oleh Pengelola Gedung (Building Management). Namun tenant tetap wajib mematuhi aturan pemilahan limbah internal.'
      },
      {
        q: 'Laboratorium apa yang diakui untuk pengujian sampel air/emisi?',
        a: 'Wajib menggunakan Laboratorium Lingkungan yang telah teregistrasi di KLHK dan memiliki akreditasi ISO/IEC 17025 dari Komite Akreditasi Nasional (KAN).'
      }
    ]
  }
};
