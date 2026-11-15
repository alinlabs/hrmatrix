import { TestQuestion } from '../types';

// ============================================================================
// BANK SOAL: KOGNITIF, LOGIKA, DERET, SILOGISME & ARITMATIKA BISNIS (TPA)
// SEMUA SOAL MENGGUNAKAN STANDAR PILIHAN GANDA 4 OPSI (A, B, C, D)
// ============================================================================
export const cognitiveQuestionBank: TestQuestion[] = [
  {
    id: 'cog-1',
    number: 1,
    questionText: 'Tentukan angka lanjutan yang tepat pada deret berikut: 3, 7, 15, 31, 63, ...',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c1-c',
    tags: ['Deret Angka', 'Pola Matematis'],
    explanation: 'Pola deret: (n x 2) + 1. (3x2+1=7), (7x2+1=15), (15x2+1=31), (31x2+1=63), maka: (63x2+1) = 127.',
    options: [
      { id: 'c1-a', label: 'A', text: '95', score: 0 },
      { id: 'c1-b', label: 'B', text: '115', score: 0 },
      { id: 'c1-c', label: 'C', text: '127', score: 10 },
      { id: 'c1-d', label: 'D', text: '135', score: 0 }
    ]
  },
  {
    id: 'cog-2',
    number: 2,
    questionText: 'Premis 1: Semua karyawan divisi operasional wajib memiliki sertifikat K3.\nPremis 2: Sebagian karyawan divisi operasional bertugas di proyek luar kota.\nKesimpulan yang paling tepat adalah:',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c2-b',
    tags: ['Silogisme', 'Logika Deduktif'],
    explanation: 'Semua anggota operasional bersertifikat K3. Sebagian di antaranya bertugas di luar kota, sehingga sebagian yang bertugas di luar kota pasti bersertifikat K3.',
    options: [
      { id: 'c2-a', label: 'A', text: 'Semua karyawan yang bertugas di luar kota adalah divisi operasional.', score: 0 },
      { id: 'c2-b', label: 'B', text: 'Sebagian karyawan yang bertugas di proyek luar kota memiliki sertifikat K3.', score: 10 },
      { id: 'c2-c', label: 'C', text: 'Karyawan yang tidak bersertifikat K3 bertugas di kantor pusat.', score: 0 },
      { id: 'c2-d', label: 'D', text: 'Tidak dapat ditarik kesimpulan yang sahih.', score: 0 }
    ]
  },
  {
    id: 'cog-3',
    number: 3,
    questionText: 'Jika 6 mesin cetak mampu menghasilkan 1.800 lembar brosur dalam waktu 40 menit, berapakah waktu yang dibutuhkan oleh 8 mesin cetak yang identik untuk menghasilkan 3.600 lembar brosur?',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c3-c',
    tags: ['Aritmatika Cepat', 'Perbandingan Berbalik Nilai'],
    explanation: 'Kapasitas 1 mesin per menit = 1.800 / (6 x 40) = 7,5 lembar/menit. Untuk 8 mesin menghasilkan 3.600 lembar: 3.600 / (8 x 7,5) = 3.600 / 60 = 60 menit.',
    options: [
      { id: 'c3-a', label: 'A', text: '45 menit', score: 0 },
      { id: 'c3-b', label: 'B', text: '50 menit', score: 0 },
      { id: 'c3-c', label: 'C', text: '60 menit', score: 10 },
      { id: 'c3-d', label: 'D', text: '75 menit', score: 0 }
    ]
  },
  {
    id: 'cog-4',
    number: 4,
    questionText: 'Sebuah produk dijual seharga Rp 240.000 setelah mendapatkan diskon bertingkat 20% kemudian diskon tambahan 25%. Berapakah harga awal produk tersebut sebelum diskon?',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c4-b',
    tags: ['Aritmatika Bisnis', 'Persentase Diskon'],
    explanation: 'Harga setelah diskon pertama = X x 0,8. Harga akhir = X x 0,8 x 0,75 = X x 0,6 = 240.000. Maka X = 240.000 / 0,6 = Rp 400.000.',
    options: [
      { id: 'c4-a', label: 'A', text: 'Rp 360.000', score: 0 },
      { id: 'c4-b', label: 'B', text: 'Rp 400.000', score: 10 },
      { id: 'c4-c', label: 'C', text: 'Rp 420.000', score: 0 },
      { id: 'c4-d', label: 'D', text: 'Rp 450.000', score: 0 }
    ]
  },
  {
    id: 'cog-5',
    number: 5,
    questionText: 'Tentukan suku berikutnya dari deret huruf alfabetikal: C, F, I, L, O, ...',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c5-a',
    tags: ['Deret Huruf', 'Logika Berpikir'],
    explanation: 'Pola lompatan huruf: +3. C(3) -> F(6) -> I(9) -> L(12) -> O(15) -> R(18).',
    options: [
      { id: 'c5-a', label: 'A', text: 'R', score: 10 },
      { id: 'c5-b', label: 'B', text: 'Q', score: 0 },
      { id: 'c5-c', label: 'C', text: 'S', score: 0 },
      { id: 'c5-d', label: 'D', text: 'P', score: 0 }
    ]
  },
  {
    id: 'cog-6',
    number: 6,
    questionText: 'Keluarga Budi terdiri dari 5 orang. Rata-rata usia mereka adalah 28 tahun. Jika usia kakek yang berusia 70 tahun digabungkan, berapakah rata-rata usia keluarga tersebut sekarang?',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c6-c',
    tags: ['Aritmatika Rata-Rata', 'Statistika Dasar'],
    explanation: 'Total usia awal 5 orang = 5 x 28 = 140. Ditambah usia kakek = 140 + 70 = 210. Rata-rata baru untuk 6 orang = 210 / 6 = 35 tahun.',
    options: [
      { id: 'c6-a', label: 'A', text: '32 tahun', score: 0 },
      { id: 'c6-b', label: 'B', text: '33,5 tahun', score: 0 },
      { id: 'c6-c', label: 'C', text: '35 tahun', score: 10 },
      { id: 'c6-d', label: 'D', text: '36 tahun', score: 0 }
    ]
  },
  {
    id: 'cog-7',
    number: 7,
    questionText: 'AUDITOR : LAPORAN KEUANGAN = ARSITEK : ...',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c7-c',
    tags: ['Analogi Kata', 'Logika Verbal'],
    explanation: 'Hubungan profesi dan hasil rancang bangun/pemeriksaan kerja utamanya. Auditor memeriksa laporan keuangan, Arsitek merancang cetak biru (blueprint) bangunan.',
    options: [
      { id: 'c7-a', label: 'A', text: 'Semen & Batu Bata', score: 0 },
      { id: 'c7-b', label: 'B', text: 'Tukang Bangunan', score: 0 },
      { id: 'c7-c', label: 'C', text: 'Cetak Biru (Blueprint)', score: 10 },
      { id: 'c7-d', label: 'D', text: 'Mandor Proyek', score: 0 }
    ]
  },
  {
    id: 'cog-8',
    number: 8,
    questionText: 'Tentukan dua angka lanjutan pada deret kombinasi: 2, 4, 3, 9, 4, 16, 5, ...',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c8-d',
    tags: ['Deret Kuadrat', 'Pola Campuran'],
    explanation: 'Pola selang-seling: Angka ganjil urut (2, 3, 4, 5, berikutnya 6), dan kuadratnya (2^2=4, 3^2=9, 4^2=16, 5^2=25). Maka angka setelah 5 adalah 25.',
    options: [
      { id: 'c8-a', label: 'A', text: '20', score: 0 },
      { id: 'c8-b', label: 'B', text: '21', score: 0 },
      { id: 'c8-c', label: 'C', text: '24', score: 0 },
      { id: 'c8-d', label: 'D', text: '25', score: 10 }
    ]
  },
  {
    id: 'cog-9',
    number: 9,
    questionText: 'Semua manajer proyek memiliki sertifikat PMP. Tidak ada karyawan magang yang memiliki sertifikat PMP. Kesimpulan yang sah adalah:',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c9-b',
    tags: ['Silogisme Kategorial', 'Logika Negasi'],
    explanation: 'Karena semua manajer proyek bersertifikat PMP dan tidak ada karyawan magang yang bersertifikat PMP, maka tidak ada karyawan magang yang menjabat sebagai manajer proyek.',
    options: [
      { id: 'c9-a', label: 'A', text: 'Sebagian manajer proyek adalah karyawan magang.', score: 0 },
      { id: 'c9-b', label: 'B', text: 'Tidak ada karyawan magang yang merupakan manajer proyek.', score: 10 },
      { id: 'c9-c', label: 'C', text: 'Semua pemegang sertifikat PMP adalah karyawan magang.', score: 0 },
      { id: 'c9-d', label: 'D', text: 'Karyawan magang akan segera menjadi manajer proyek.', score: 0 }
    ]
  },
  {
    id: 'cog-10',
    number: 10,
    questionText: 'Seorang agen properti mendapatkan komisi 2,5% untuk Rp 500 juta pertama dan 1,5% untuk sisa nilai penjualan di atas Rp 500 juta. Jika ia berhasil menjual rumah seharga Rp 1,2 Miliar, berapakah total komisi yang ia terima?',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c10-b',
    tags: ['Aritmatika Bertingkat', 'Komisi Finansial'],
    explanation: 'Komisi pertama = 2,5% x 500jt = Rp 12.500.000. Sisa nilai = 1,2M - 500jt = 700jt. Komisi sisa = 1,5% x 700jt = Rp 10.500.000. Total = 12,5jt + 10,5jt = Rp 23.000.000.',
    options: [
      { id: 'c10-a', label: 'A', text: 'Rp 21.500.000', score: 0 },
      { id: 'c10-b', label: 'B', text: 'Rp 23.000.000', score: 10 },
      { id: 'c10-c', label: 'C', text: 'Rp 24.500.000', score: 0 },
      { id: 'c10-d', label: 'D', text: 'Rp 26.000.000', score: 0 }
    ]
  },
  {
    id: 'cog-11',
    number: 11,
    questionText: 'Tentukan suku berikutnya dari kombinasi deret huruf dan angka berikut: B-2, D-4, G-7, K-11, P-16, ...',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c11-c',
    tags: ['Deret Huruf & Angka', 'Pola Bertingkat'],
    explanation: 'Pola selisih: +2, +3, +4, +5, berikutnya +6. 16 + 6 = 22. Huruf urutan ke-22 dalam alfabet adalah V. Maka jawabannya V-22.',
    options: [
      { id: 'c11-a', label: 'A', text: 'T-20', score: 0 },
      { id: 'c11-b', label: 'B', text: 'U-21', score: 0 },
      { id: 'c11-c', label: 'C', text: 'V-22', score: 10 },
      { id: 'c11-d', label: 'D', text: 'W-23', score: 0 }
    ]
  },
  {
    id: 'cog-12',
    number: 12,
    scenario: 'Sebuah divisi penjualan mencatatkan data: Produk M terjual 2x lebih banyak dari N. Produk O terjual setengah dari P. Produk N terjual sama banyaknya dengan P. Produk Q terjual 3x lipat produk M.',
    questionText: 'Urutan produk dari yang volume penjualannya PALING SEDIKIT ke PALING BANYAK adalah:',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c12-a',
    tags: ['Logika Aljabar Relasi', 'Penalaran Analitis'],
    explanation: 'Misal N = 10 -> P = 10. M = 20. O = 5. Q = 60. Urutan dari terkecil: O (5) < N = P (10) < M (20) < Q (60).',
    options: [
      { id: 'c12-a', label: 'A', text: 'O < N = P < M < Q', score: 10 },
      { id: 'c12-b', label: 'B', text: 'N < O < P < M < Q', score: 0 },
      { id: 'c12-c', label: 'C', text: 'P < M < N < O < Q', score: 0 },
      { id: 'c12-d', label: 'D', text: 'Q < M < P < N < O', score: 0 }
    ]
  },
  {
    id: 'cog-13',
    number: 13,
    scenario: 'Perusahaan memproduksi 1.000 unit produk per hari dengan biaya produksi Rp 50.000/unit dan harga jual Rp 80.000/unit. Manajemen membeli mesin baru Rp 300.000.000 yang meningkatkan kapasitas jadi 1.500 unit/hari dan menurunkan biaya produksi jadi Rp 40.000/unit.',
    questionText: 'Berapa hari investasi mesin baru tersebut akan mencapai titik impas (Payback Period) jika seluruh produk terjual habis?',
    questionType: 'multiple_choice_4',
    category: 'cognitive',
    correctOptionId: 'c13-a',
    tags: ['Analisis Finansial', 'Payback Period'],
    explanation: 'Laba lama = 1.000 x 30.000 = Rp 30jt/hari. Laba baru = 1.500 x 40.000 = Rp 60jt/hari. Selisih laba harian = Rp 30jt/hari. Titik impas = 300jt / 30jt = 10 hari.',
    options: [
      { id: 'c13-a', label: 'A', text: '10 Hari', score: 10 },
      { id: 'c13-b', label: 'B', text: '15 Hari', score: 0 },
      { id: 'c13-c', label: 'C', text: '20 Hari', score: 0 },
      { id: 'c13-d', label: 'D', text: '30 Hari', score: 0 }
    ]
  }
];
