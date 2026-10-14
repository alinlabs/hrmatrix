export interface HRFormulaDetail {
  id: string;
  title: string;
  shortTitle: string;
  category: 'Lembur' | 'BPJS' | 'Pajak PPh 21' | 'Penggajian' | 'Kedisiplinan' | 'Performa' | 'Kompensasi Kontrak';
  tag: string;
  primaryPath: string;
  summary: string;
  legalBasis: string;
  expression: string;
  legend?: { symbol: string; label: string }[];
  logicExplanation: string;
  variables: {
    symbol: string;
    name: string;
    description: string;
    componentIncluded?: string[];
  }[];
  conditionalRules: {
    condition: string;
    rule: string;
    multiplierOrRate: string;
  }[];
  exampleCase: {
    scenario: string;
    inputs: { label: string; value: string }[];
    calculationSteps: string[];
    finalResult: string;
    slipImpact: string;
  };
  hrBestPractice: string[];
}

export const HR_FORMULA_DETAILS: HRFormulaDetail[] = [
  {
    id: 'formula-lembur',
    title: 'Formula Upah Kerja Lembur (Standar Depnaker)',
    shortTitle: 'Upah Lembur (1/173)',
    category: 'Lembur',
    tag: 'Kepmenaker 102/2004',
    primaryPath: '/attendance',
    summary: 'Digunakan oleh modul Kehadiran & Payroll untuk mengkonversi total durasi lembur karyawan menjadi nominal rupiah kompensasi lembur sesuai standar baku ketenagakerjaan Republik Indonesia.',
    legalBasis: 'Keputusan Menteri Tenaga Kerja dan Transmigrasi No. KEP.102/MEN/VI/2004 & PP No. 35 Tahun 2021 Pasal 31',
    expression: 'TULS = (1 / 173) × UB\nTotal Upah Lembur = Σ (DJK-n × PTK-n × TULS)',
    legend: [
      { symbol: 'TULS', label: 'Tarif Upah Lembur Sejam' },
      { symbol: 'UB', label: 'Upah Bulanan (Gaji Pokok + Tunjangan Tetap)' },
      { symbol: 'DJK-n', label: 'Durasi Jam Kerja Lembur ke-n' },
      { symbol: 'PTK-n', label: 'Pengali Tarif ke-n (1.5x, 2x, 3x, 4x)' }
    ],
    logicExplanation: 'Angka 173 diperoleh secara matematis dari rata-rata jam kerja per bulan di Indonesia: dalam 1 tahun kalender terdapat 52 minggu. Sesuai UU, jam kerja formal adalah 40 jam per minggu. Maka rata-rata jam kerja bulanan adalah (52 minggu × 40 jam) ÷ 12 bulan = 173,33 jam (dibulatkan menjadi 173 jam). Upah bulanan yang digunakan sebagai dasar perhitungan adalah 100% dari Gaji Pokok ditambah Tunjangan Tetap (apabila ada).',
    variables: [
      {
        symbol: 'Upah Bulanan',
        name: 'Dasar Upah Bulanan Lembur',
        description: '100% Gaji Pokok ditambah Tunjangan Tetap (misal Tunjangan Jabatan). Tunjangan tidak tetap (seperti uang makan harian berbasis absensi) TIDAK dimasukkan.',
        componentIncluded: ['Gaji Pokok', 'Tunjangan Tetap (Jabatan, Masa Kerja)']
      },
      {
        symbol: '1/173',
        name: 'Konstanta Pengali Sejam Depnaker',
        description: 'Rasio jam kerja rata-rata per bulan (173 jam) untuk menghasilkan tarif per 1 jam kerja lembur.'
      },
      {
        symbol: 'Pengali Jam',
        name: 'Faktor Pengali Jam Kerja',
        description: 'Faktor pengali progresif (1.5x, 2.0x, 3.0x, atau 4.0x) tergantung jenis hari lembur (hari kerja reguler vs hari libur resmi).'
      }
    ],
    conditionalRules: [
      {
        condition: 'Hari Kerja Biasa (Senin - Jumat / Sabtu)',
        rule: 'Jam Pertama (Jam ke-1)',
        multiplierOrRate: '1.5 × Upah Sejam'
      },
      {
        condition: 'Hari Kerja Biasa (Senin - Jumat / Sabtu)',
        rule: 'Jam Berikutnya (Jam ke-2, ke-3, dst)',
        multiplierOrRate: '2.0 × Upah Sejam'
      },
      {
        condition: 'Hari Libur Resmi / Istirahat Mingguan (Sistem 5 Hari Kerja)',
        rule: '8 Jam Pertama (Jam ke-1 s.d. Jam ke-8)',
        multiplierOrRate: '2.0 × Upah Sejam'
      },
      {
        condition: 'Hari Libur Resmi / Istirahat Mingguan (Sistem 5 Hari Kerja)',
        rule: 'Jam ke-9',
        multiplierOrRate: '3.0 × Upah Sejam'
      },
      {
        condition: 'Hari Libur Resmi / Istirahat Mingguan (Sistem 5 Hari Kerja)',
        rule: 'Jam ke-10 s.d. Jam ke-12',
        multiplierOrRate: '4.0 × Upah Sejam'
      },
      {
        condition: 'Hari Libur Resmi / Istirahat Mingguan (Sistem 6 Hari Kerja)',
        rule: '7 Jam Pertama (Jam ke-1 s.d. Jam ke-7)',
        multiplierOrRate: '2.0 × Upah Sejam'
      },
      {
        condition: 'Hari Libur Resmi / Istirahat Mingguan (Sistem 6 Hari Kerja)',
        rule: 'Jam ke-8 (Hari terpendek)',
        multiplierOrRate: '3.0 × Upah Sejam'
      },
      {
        condition: 'Hari Libur Resmi / Istirahat Mingguan (Sistem 6 Hari Kerja)',
        rule: 'Jam ke-9 & Jam ke-10',
        multiplierOrRate: '4.0 × Upah Sejam'
      }
    ],
    exampleCase: {
      scenario: 'Budi memiliki Gaji Pokok Rp 5.000.000 dan Tunjangan Jabatan Tetap Rp 190.000 (Total Upah Bulanan = Rp 5.190.000). Budi diperintahkan melakukan lembur pada hari kerja biasa selama 3 jam.',
      inputs: [
        { label: 'Gaji Pokok + Tunjangan Tetap', value: 'Rp 5.190.000' },
        { label: 'Jenis Hari', value: 'Hari Kerja Biasa' },
        { label: 'Total Durasi Lembur', value: '3 Jam' }
      ],
      calculationSteps: [
        'Langkah 1 (Hitung Tarif Sejam): Rp 5.190.000 ÷ 173 = Rp 30.000 per jam',
        'Langkah 2 (Jam ke-1 @ 1.5x): 1 jam × 1.5 × Rp 30.000 = Rp 45.000',
        'Langkah 3 (Jam ke-2 dan ke-3 @ 2.0x): 2 jam × 2.0 × Rp 30.000 = Rp 120.000',
        'Langkah 4 (Jumlahkan Seluruh Jam): Rp 45.000 + Rp 120.000 = Rp 165.000'
      ],
      finalResult: 'Rp 165.000',
      slipImpact: 'Masuk ke komponen Penghasilan Tambahan (Earnings: Upah Lembur) pada Slip Gaji dan menambah Penghasilan Bruto untuk perhitungan PPh 21.'
    },
    hrBestPractice: [
      'Pastikan ada Surat Perintah Kerja Lembur (SPKL) tertulis yang disetujui atasan sebelum lembur dicatat ke sistem.',
      'Sesuai PP 35/2021, waktu kerja lembur pada hari kerja biasa dibatasi maksimal 4 jam dalam 1 hari dan maksimal 18 jam dalam 1 minggu (tidak termasuk lembur pada hari libur resmi).',
      'Karyawan level Manajerial ke atas yang memiliki kendali dan tanggung jawab strategis dapat dikecualikan dari hak kompensasi lembur dengan syarat dinyatakan tegas dalam Perjanjian Kerja.'
    ]
  },
  {
    id: 'formula-bpjs-tk',
    title: 'Formula Iuran BPJS Ketenagakerjaan (4 Program Wajib)',
    shortTitle: 'BPJS Ketenagakerjaan',
    category: 'BPJS',
    tag: 'PP 44/2015, PP 45/2015, PP 46/2015',
    primaryPath: '/payroll',
    summary: 'Digunakan oleh modul Payroll untuk memisahkan beban premi yang wajib dibayarkan oleh Perusahaan dengan porsi yang dipotong langsung dari gaji bulanan karyawan (JHT & JP).',
    legalBasis: 'PP No. 44 Tahun 2015 (JKK & JKM), PP No. 45 Tahun 2015 (JP), dan PP No. 46 Tahun 2015 (JHT)',
    expression: 'Potongan Karyawan = (GP × 2%) + (MIN(GP, PJP) × 1%)\nBeban Perusahaan = (GP × %JKK) + (GP × 0.3%) + (GP × 3.7%) + (MIN(GP, PJP) × 2%)',
    legend: [
      { symbol: 'GP', label: 'Gaji Pokok' },
      { symbol: 'PJP', label: 'Plafon Jaminan Pensiun (Maks. Rp 10.042.300)' },
      { symbol: 'JKK', label: 'Jaminan Kecelakaan Kerja (0.24%–1.74%)' }
    ],
    logicExplanation: 'Hanya porsi JHT (2%) dan JP (1%) yang menjadi pengurang langsung dari gaji bersih karyawan (Take Home Pay). Porsi JKK (0.24%-1.74%) dan JKM (0.30%) yang dibayar perusahaan menjadi penambah penghasilan bruto karyawan untuk perhitungan pajak PPh 21 (karena dianggap fasilitas/premi yang dinikmati pekerja), sedangkan porsi JHT dan JP perusahaan tidak menambah bruto pajak.',
    variables: [
      {
        symbol: 'Gaji Pokok',
        name: 'Dasar Upah Perhitungan BPJS',
        description: 'Upah bulanan yang dilaporkan ke SIPP BPJS Ketenagakerjaan (Gaji Pokok + Tunjangan Tetap).'
      },
      {
        symbol: 'JKK (0.24% - 1.74%)',
        name: 'Jaminan Kecelakaan Kerja',
        description: '100% ditanggung Perusahaan. Tarif tergantung tingkat risiko lingkungan kerja (Kelompok I Sangat Rendah: 0.24%; Kelompok II Rendah: 0.54%; Kelompok III Sedang: 0.89%; Kelompok IV Tinggi: 1.27%; Kelompok V Sangat Tinggi: 1.74%). Default HRMatrix: 0.24%.'
      },
      {
        symbol: 'JKM (0.30%)',
        name: 'Jaminan Kematian',
        description: '100% ditanggung Perusahaan sebesar 0.30% dari upah sebulan.'
      },
      {
        symbol: 'JHT (5.70%)',
        name: 'Jaminan Hari Tua',
        description: 'Total iuran 5.70%: Beban Perusahaan 3.70% dan Potongan Gaji Karyawan 2.00%.'
      },
      {
        symbol: 'JP (3.00%)',
        name: 'Jaminan Pensiun (Ada Batas Plafon)',
        description: 'Total iuran 3.00%: Beban Perusahaan 2.00% dan Potongan Gaji Karyawan 1.00%. Tunduk pada batas upah tertinggi (Plafon Upah Maksimal JP sebesar Rp 10.042.300).'
      }
    ],
    conditionalRules: [
      {
        condition: 'Karyawan dengan Upah Bulanan ≤ Plafon JP (Rp 10.042.300)',
        rule: 'JP Karyawan (1%) & JP Perusahaan (2%) dihitung dari upah penuh aktual',
        multiplierOrRate: '1.0% × Upah Penuh'
      },
      {
        condition: 'Karyawan dengan Upah Bulanan > Plafon JP (misal Gaji Rp 15.000.000)',
        rule: 'JP dibatasi maksimal pada Plafon JP (Rp 10.042.300)',
        multiplierOrRate: '1.0% × Rp 10.042.300 = Rp 100.423 (Maksimal)'
      },
      {
        condition: 'JHT (Jaminan Hari Tua)',
        rule: 'Tidak ada plafon batas atas gaji',
        multiplierOrRate: '2.0% × Gaji Pokok Penuh'
      }
    ],
    exampleCase: {
      scenario: 'Karyawan menerima Gaji Pokok Rp 6.000.000. Perusahaan tergolong tingkat risiko JKK Sangat Rendah (0.24%).',
      inputs: [
        { label: 'Gaji Pokok Bulanan', value: 'Rp 6.000.000' },
        { label: 'Tarif JKK', value: '0.24%' },
        { label: 'Plafon JP BPJS TK', value: 'Rp 10.042.300' }
      ],
      calculationSteps: [
        '1. JKK (Perusahaan): 0.24% × Rp 6.000.000 = Rp 14.400',
        '2. JKM (Perusahaan): 0.30% × Rp 6.000.000 = Rp 18.000',
        '3. JHT Perusahaan (3.7%): 3.70% × Rp 6.000.000 = Rp 222.000',
        '4. JHT Potong Karyawan (2.0%): 2.00% × Rp 6.000.000 = Rp 120.000',
        '5. JP Perusahaan (2.0%): 2.00% × Rp 6.000.000 = Rp 120.000',
        '6. JP Potong Karyawan (1.0%): 1.00% × Rp 6.000.000 = Rp 60.000',
        '7. Total Potongan Slip Gaji Karyawan: Rp 120.000 (JHT) + Rp 60.000 (JP) = Rp 180.000',
        '8. Total Beban Iuran Perusahaan: Rp 14.400 + Rp 18.000 + Rp 222.000 + Rp 120.000 = Rp 374.400',
        '9. Total Setoran Kas ke BPJS TK: Rp 180.000 + Rp 374.400 = Rp 554.400'
      ],
      finalResult: 'Potongan Karyawan: Rp 180.000 | Beban Perusahaan: Rp 374.400',
      slipImpact: 'Potongan Rp 180.000 masuk ke kolom Deductions (Potongan BPJS TK) mengurangi Take Home Pay. Premi JKK (Rp 14.400) dan JKM (Rp 18.000) ditambahkan ke Penghasilan Bruto Pajak PPh 21.'
    },
    hrBestPractice: [
      'Plafon batas atas upah Jaminan Pensiun (JP) diperbarui pemerintah setiap bulan Maret berdasarkan formula inflasi dan pertumbuhan PDB nasional.',
      'Potongan JHT Karyawan (2%) dan JP Karyawan (1%) berstatus Non-Taxable Deduction (pengurang neto dalam formulir bukti potong 1721-A1 akhir tahun).'
    ]
  },
  {
    id: 'formula-bpjs-kes',
    title: 'Formula Iuran BPJS Kesehatan',
    shortTitle: 'BPJS Kesehatan (5%)',
    category: 'BPJS',
    tag: 'Perpres 64/2020',
    primaryPath: '/payroll',
    summary: 'Digunakan oleh modul Payroll untuk menghitung iuran jaminan kesehatan pekerja dan keluarga inti dengan ketentuan batas atas upah (capping plafon).',
    legalBasis: 'Perpres No. 64 Tahun 2020 & Perpres No. 75 Tahun 2019 Pasal 30 - 32',
    expression: 'DP = MIN(UB, Rp 12.000.000)\nPotongan Karyawan = 1% × DP (Maks. Rp 120 rb)\nBeban Perusahaan = 4% × DP (Maks. Rp 480 rb)\nTotal Disetor = 5% × DP (Maks. Rp 600 rb)',
    legend: [
      { symbol: 'DP', label: 'Dasar Perhitungan BPJS Kesehatan' },
      { symbol: 'UB', label: 'Upah Bulanan (Gaji Pokok + Tunjangan Tetap)' }
    ],
    logicExplanation: 'Total tarif iuran adalah 5% dari upah bulanan, di mana 4% ditanggung oleh Perusahaan dan 1% dipotong dari upah karyawan. Pemerintah menetapkan batas upah tertinggi (plafon) sebesar Rp 12.000.000 per bulan. Jika gaji karyawan melampaui Rp 12.000.000 (misal Rp 20.000.000), iuran tetap dihitung dari angka Rp 12.000.000, sehingga potongan karyawan tidak pernah melebihi Rp 120.000 per bulan.',
    variables: [
      {
        symbol: 'Upah Bulanan',
        name: 'Upah Dasar BPJS Kesehatan',
        description: 'Gaji Pokok ditambah Tunjangan Tetap karyawan.'
      },
      {
        symbol: 'Rp 12.000.000',
        name: 'Plafon Batas Upah Tertinggi',
        description: 'Batas atas upah perhitungan sesuai Perpres 64/2020.'
      },
      {
        symbol: '1%',
        name: 'Porsi Potongan Karyawan',
        description: 'Dipotong langsung dari gaji karyawan (Take Home Pay).'
      },
      {
        symbol: '4%',
        name: 'Porsi Tunjangan Perusahaan',
        description: 'Dibayarkan perusahaan sebagai tunjangan fasilitas kesehatan pekerja.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Gaji Bulanan ≤ Rp 12.000.000',
        rule: 'Dihitung proporsional 1% dari gaji aktual',
        multiplierOrRate: '1.0% × Gaji Pokok'
      },
      {
        condition: 'Gaji Bulanan > Rp 12.000.000 (Gaji Tinggi / Eksekutif)',
        rule: 'Menggunakan batas plafon maksimal Rp 12.000.000',
        multiplierOrRate: '1.0% × Rp 12.000.000 = Rp 120.000 (Flat Maksimal)'
      }
    ],
    exampleCase: {
      scenario: 'Perusahaan memiliki Karyawan A dengan gaji Rp 5.000.000 dan Direktur B dengan gaji Rp 25.000.000.',
      inputs: [
        { label: 'Gaji Karyawan A', value: 'Rp 5.000.000' },
        { label: 'Gaji Direktur B', value: 'Rp 25.000.000' },
        { label: 'Batas Plafon', value: 'Rp 12.000.000' }
      ],
      calculationSteps: [
        'Karyawan A (Gaji di bawah plafon):',
        '• Potongan Karyawan = 1% × Rp 5.000.000 = Rp 50.000',
        '• Beban Perusahaan = 4% × Rp 5.000.000 = Rp 200.000',
        '• Total Iuran Karyawan A = Rp 250.000',
        'Direktur B (Gaji melebihi plafon Rp 12.000.000):',
        '• Dasar Pengali dibatasi maksimal Rp 12.000.000',
        '• Potongan Karyawan = 1% × Rp 12.000.000 = Rp 120.000',
        '• Beban Perusahaan = 4% × Rp 12.000.000 = Rp 480.000',
        '• Total Iuran Direktur B = Rp 600.000'
      ],
      finalResult: 'Karyawan A: Potong Rp 50.000 | Direktur B: Potong Rp 120.000 (Maksimal)',
      slipImpact: 'Potongan BPJS Kesehatan muncul di slip gaji pada kolom Potongan Karyawan dan mengurangi Take Home Pay.'
    },
    hrBestPractice: [
      'Iuran 5% BPJS Kesehatan ini mencakup jaminan kesehatan untuk 5 orang anggota keluarga inti (Pekerja, 1 Suami/Istri sah, dan 3 Anak yang sah/diakui).',
      'Jika pekerja ingin mendaftarkan anak ke-4 atau orang tua/mertua, dikenakan tambahan iuran 1% per jiwa yang dipotong dari upah pekerja.'
    ]
  },
  {
    id: 'formula-pph21-ter',
    title: 'Formula PPh 21 Bulanan Skema TER (Tarif Efektif Rata-Rata)',
    shortTitle: 'PPh 21 TER (PP 58/2023)',
    category: 'Pajak PPh 21',
    tag: 'PP 58/2023 & PMK 168/2023',
    primaryPath: '/payroll',
    summary: 'Digunakan oleh modul Payroll untuk memotong pajak bulanan periode Januari s.d. November secara cepat, transparan, dan terstandarisasi tanpa perlu menghitung PTKP manual tiap bulan.',
    legalBasis: 'Peraturan Pemerintah No. 58 Tahun 2023 & Peraturan Menteri Keuangan No. 168 Tahun 2023',
    expression: 'PBS = GP + TT + TTT + Lembur + JKK + JKM\nPPh 21 Terutang = PBS × Tarif TER (%)',
    legend: [
      { symbol: 'PBS', label: 'Penghasilan Bruto Sebulan' },
      { symbol: 'GP', label: 'Gaji Pokok' },
      { symbol: 'TT / TTT', label: 'Tunjangan Tetap / Tidak Tetap' },
      { symbol: 'TER', label: 'Tarif Efektif Rata-Rata (PP 58/2023)' }
    ],
    logicExplanation: 'Pemerintah menetapkan metode TER sejak 1 Januari 2024. Status PTKP karyawan dikelompokkan ke dalam 3 Kategori (A, B, C). Setiap kategori memiliki tabel layer penghasilan bruto dengan persentase tarif spesifik. Pemotongan pajak bulanan cukup mengalikan bruto riil bulan itu dengan tarif TER tabel. Pada masa pajak Desember, barulah dilakukan perhitungan tahunan ulang menggunakan Tarif Pasal 17 UU HPP, lalu dikurangi total pajak yang sudah dipotong dari bulan Januari hingga November.',
    variables: [
      {
        symbol: 'Penghasilan Bruto',
        name: 'Total Penghasilan Bruto Bulanan',
        description: 'Seluruh hak penerimaan uang karyawan ditambah premi asuransi kecelakaan & kematian yang dibayarkan pemberi kerja.',
        componentIncluded: [
          'Gaji Pokok',
          'Tunjangan Jabatan / Tunjangan Makan / Transport',
          'Kompensasi Lembur',
          'Premi JKK Perusahaan (0.24%)',
          'Premi JKM Perusahaan (0.30%)'
        ]
      },
      {
        symbol: 'Tarif TER (%)',
        name: 'Persentase Tarif Efektif Rata-Rata',
        description: 'Persentase tarif berdasarkan tabel PP 58/2023 yang ditentukan oleh Kategori PTKP dan layer nominal bruto.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Kategori TER A (PTKP: TK/0 [54 jt], TK/1 [58.5 jt], K/0 [58.5 jt])',
        rule: 'Layer Bruto s.d. Rp 5.400.000',
        multiplierOrRate: 'Tarif TER = 0.00% (Bebas Pajak)'
      },
      {
        condition: 'Kategori TER A',
        rule: 'Layer Bruto > Rp 5.400.000 s.d. Rp 5.650.000',
        multiplierOrRate: 'Tarif TER = 0.25%'
      },
      {
        condition: 'Kategori TER A',
        rule: 'Layer Bruto > Rp 5.650.000 s.d. Rp 5.950.000',
        multiplierOrRate: 'Tarif TER = 0.50%'
      },
      {
        condition: 'Kategori TER A',
        rule: 'Layer Bruto > Rp 7.350.000 s.d. Rp 8.000.000',
        multiplierOrRate: 'Tarif TER = 1.50%'
      },
      {
        condition: 'Kategori TER A',
        rule: 'Layer Bruto > Rp 9.050.000 s.d. Rp 10.300.000',
        multiplierOrRate: 'Tarif TER = 3.00%'
      },
      {
        condition: 'Kategori TER B (PTKP: TK/2 [63 jt], TK/3 [67.5 jt], K/1 [63 jt], K/2 [67.5 jt])',
        rule: 'Layer Bruto s.d. Rp 6.200.000',
        multiplierOrRate: 'Tarif TER = 0.00% (Bebas Pajak)'
      },
      {
        condition: 'Kategori TER B',
        rule: 'Layer Bruto > Rp 7.400.000 s.d. Rp 8.400.000',
        multiplierOrRate: 'Tarif TER = 1.50%'
      },
      {
        condition: 'Kategori TER C (PTKP: K/3 [72 jt])',
        rule: 'Layer Bruto s.d. Rp 6.600.000',
        multiplierOrRate: 'Tarif TER = 0.00% (Bebas Pajak)'
      },
      {
        condition: 'Kategori TER C',
        rule: 'Layer Bruto > Rp 7.800.000 s.d. Rp 8.850.000',
        multiplierOrRate: 'Tarif TER = 1.50%'
      }
    ],
    exampleCase: {
      scenario: 'Ahmad belum menikah dan tanpa tanggungan (Status PTKP: TK/0 → Kategori TER A). Pada bulan berjalan ia menerima Gaji Pokok Rp 7.000.000, Tunjangan Transport Rp 300.000, dan Lembur Rp 150.000. Premi JKK dan JKM perusahaan adalah Rp 37.800.',
      inputs: [
        { label: 'Status PTKP', value: 'TK/0 (Kategori TER A)' },
        { label: 'Gaji + Tunjangan + Lembur', value: 'Rp 7.450.000' },
        { label: 'Premi JKK + JKM Perusahaan', value: 'Rp 37.800' }
      ],
      calculationSteps: [
        '1. Hitung Total Penghasilan Bruto = Rp 7.450.000 + Rp 37.800 = Rp 7.487.800',
        '2. Cek Kategori TER A pada layer Rp 7.350.000 s.d. Rp 8.000.000: Tarif TER = 1.50%',
        '3. Hitung PPh 21 Terutang = Rp 7.487.800 × 1.50% = Rp 112.317'
      ],
      finalResult: 'Rp 112.317',
      slipImpact: 'Nominal Rp 112.317 dipotong pada slip gaji karyawan sebagai Pajak PPh 21 dan disetorkan ke kas negara (e-Billing DJP).'
    },
    hrBestPractice: [
      'Iuran JHT Karyawan (2%) dan Iuran JP Karyawan (1%) TIDAK mengurangi Bruto TER pada masa Januari-November; pengurang tersebut baru dihitung pada rekonsiliasi akhir tahun di masa Desember.',
      'Jika karyawan menerima bonus atau THR pada bulan tertentu, otomatis bruto bulan tersebut meningkat dan tarif TER yang dikenakan pada bulan tersebut akan otomatis naik layer sesuai tabel PP 58/2023.'
    ]
  },
  {
    id: 'formula-pph21-desember',
    title: 'Formula PPh 21 Rekonsiliasi Tahunan (Masa Pajak Desember)',
    shortTitle: 'PPh 21 Masa Desember (Pasal 17)',
    category: 'Pajak PPh 21',
    tag: 'Pasal 17 UU HPP & PMK 168/2023',
    primaryPath: '/payroll',
    summary: 'Digunakan oleh modul Payroll pada akhir tahun buku (Masa Pajak Desember) untuk menghitung ulang seluruh pajak setahun karyawan dan menerbitkan Formulir Bukti Potong 1721-A1.',
    legalBasis: 'Pasal 17 ayat (1) huruf a UU No. 7 Tahun 2021 (Harmonisasi Peraturan Perpajakan / HPP) & PMK No. 168 Tahun 2023',
    expression: 'PNS = Bruto Setahun - Biaya Jabatan - Iuran JHT - Iuran JP\nPKP = PNS - PTKP Karyawan\nPPh 21 Setahun = Tarif Progresif Pasal 17 × PKP\nPPh 21 Des = PPh 21 Setahun - Total TER (Jan–Nov)',
    legend: [
      { symbol: 'PNS', label: 'Penghasilan Neto Setahun' },
      { symbol: 'PKP', label: 'Penghasilan Kena Pajak' },
      { symbol: 'PTKP', label: 'Penghasilan Tidak Kena Pajak' },
      { symbol: 'Biaya Jabatan', label: '5% dari Bruto (Maks. Rp 6 Juta/Tahun)' }
    ],
    logicExplanation: 'Skema TER hanyalah formula pemotongan bulanan yang bersifat estimasi terukur. Pada bulan Desember (atau saat karyawan resign di tengah tahun), seluruh penghasilan setahun direkonsiliasi. Jika total pajak TER yang telah dipotong selama 11 bulan lebih kecil dari pajak terutang setahun, karyawan membayar selisih kekurangannya di bulan Desember. Sebaliknya, jika lebih bayar (misal karena ada periode alpa/gaji turun), selisih lebih bayar wajib dikembalikan ke karyawan.',
    variables: [
      {
        symbol: 'Biaya Jabatan',
        name: 'Pengurang Biaya Jabatan',
        description: '5% dari Penghasilan Bruto Setahun, dengan batas maksimal Rp 500.000 per bulan atau Rp 6.000.000 per tahun.'
      },
      {
        symbol: 'Iuran Pensiun / JHT',
        name: 'Iuran Resmi Pengurang Pajak',
        description: 'Akumulasi iuran JHT (2%) dan JP (1%) yang telah dipotong dari gaji karyawan selama setahun.'
      },
      {
        symbol: 'PTKP',
        name: 'Penghasilan Tidak Kena Pajak',
        description: 'TK/0: 54 jt; TK/1: 58.5 jt; TK/2: 63 jt; TK/3: 67.5 jt; K/0: 58.5 jt; K/1: 63 jt; K/2: 67.5 jt; K/3: 72 jt.'
      },
      {
        symbol: 'Tarif Pasal 17',
        name: 'Tarif Progresif PPh Orang Pribadi',
        description: 'Lapisan PKP: s.d. 60 jt = 5%; > 60 jt s.d. 250 jt = 15%; > 250 jt s.d. 500 jt = 25%; > 500 jt s.d. 5 Miliar = 30%; > 5 Miliar = 35%.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Lapisan PKP 1 (Rp 0 s.d. Rp 60.000.000)',
        rule: 'Dikenakan tarif pajak dasar',
        multiplierOrRate: '5.0%'
      },
      {
        condition: 'Lapisan PKP 2 (> Rp 60.000.000 s.d. Rp 250.000.000)',
        rule: 'Dikenakan tarif pajak layer 2',
        multiplierOrRate: '15.0%'
      },
      {
        condition: 'Lapisan PKP 3 (> Rp 250.000.000 s.d. Rp 500.000.000)',
        rule: 'Dikenakan tarif pajak layer 3',
        multiplierOrRate: '25.0%'
      },
      {
        condition: 'Lapisan PKP 4 (> Rp 500.000.000 s.d. Rp 5.000.000.000)',
        rule: 'Dikenakan tarif pajak layer 4',
        multiplierOrRate: '30.0%'
      }
    ],
    exampleCase: {
      scenario: 'Karyawan status TK/0 memiliki Bruto Setahun Rp 96.000.000. Iuran JHT+JP yang dipotong selama setahun adalah Rp 2.880.000. Total PPh 21 TER yang telah dipotong dari bulan Jan s.d. Nov adalah Rp 1.350.000.',
      inputs: [
        { label: 'Bruto Setahun', value: 'Rp 96.000.000' },
        { label: 'Biaya Jabatan (5%)', value: 'Rp 4.800.000' },
        { label: 'Iuran JHT & JP Karyawan', value: 'Rp 2.880.000' },
        { label: 'PTKP TK/0', value: 'Rp 54.000.000' },
        { label: 'Pajak Terpotong Jan-Nov', value: 'Rp 1.350.000' }
      ],
      calculationSteps: [
        '1. Penghasilan Neto = Rp 96.000.000 - Rp 4.800.000 (Biaya Jabatan) - Rp 2.880.000 (JHT/JP) = Rp 88.320.000',
        '2. Penghasilan Kena Pajak (PKP) = Rp 88.320.000 - Rp 54.000.000 (PTKP) = Rp 34.320.000 (Dibulatkan ribuan ke bawah)',
        '3. PPh 21 Terutang Setahun (Lapisan 1: 5%) = 5% × Rp 34.320.000 = Rp 1.716.000',
        '4. PPh 21 Masa Desember = Rp 1.716.000 - Rp 1.350.000 (Sudah dipotong Jan-Nov) = Rp 366.000'
      ],
      finalResult: 'Rp 366.000',
      slipImpact: 'Nilai Rp 366.000 menjadi potongan PPh 21 pada slip gaji bulan Desember karyawan.'
    },
    hrBestPractice: [
      'Gunakan menu Laporan Pajak HRMatrix untuk mengunduh rekap Formulir 1721-A1 yang wajib diserahkan kepada seluruh karyawan paling lambat bulan Januari tahun berikutnya.',
      'Jika hasil rekonsiliasi bernilai negatif (Lebih Bayar), sistem otomatis menandai pengembalian restitusi pajak (Tax Refund) yang menambah gaji bersih karyawan di bulan Desember.'
    ]
  },
  {
    id: 'formula-prorata',
    title: 'Formula Gaji Pokok Prorata (Masuk / Resign Tengah Bulan)',
    shortTitle: 'Gaji Prorata',
    category: 'Penggajian',
    tag: 'PP 36/2021 Pasal 53',
    primaryPath: '/payroll',
    summary: 'Digunakan oleh modul Payroll ketika seorang karyawan baru bergabung (Join Date) atau mengundurkan diri (Resign Date) di pertengahan periode cut-off penggajian.',
    legalBasis: 'PP No. 36 Tahun 2021 tentang Pengupahan & Peraturan Perusahaan',
    expression: 'Metode Hari Kerja Efektif:\nGaji Prorata = (HKA ÷ HKNS) × GP\n\nMetode Kalender:\nGaji Prorata = (HKA ÷ HKB) × GP',
    legend: [
      { symbol: 'GP', label: 'Gaji Pokok Penuh' },
      { symbol: 'HKA', label: 'Hari Kerja / Kalender Aktual Hadir' },
      { symbol: 'HKNS', label: 'Hari Kerja Normal Sebulan (20–22 Hari)' },
      { symbol: 'HKB', label: 'Hari Kalender Bulan (28–31 Hari)' }
    ],
    logicExplanation: 'Prinsip hukum ketenagakerjaan menganut asas "No Work No Pay" dengan pengecualian yang dilindungi UU. Karyawan yang tidak menjalani periode kalender kerja secara utuh berhak atas upah yang dihitung proporsional. Metode Hari Kerja Efektif lebih adil bagi kedua belah pihak karena hari libur mingguan (Sabtu-Minggu) tidak mendistorsi rasio kehadiran kerja riil.',
    variables: [
      {
        symbol: 'Hari Kerja Aktual',
        name: 'Jumlah Hari Kerja Hadir Karyawan',
        description: 'Total hari kerja riil yang dijalani karyawan sejak tanggal bergabung sampai akhir periode cut-off.'
      },
      {
        symbol: 'Total Hari Kerja',
        name: 'Total Hari Kerja Normal Periode',
        description: 'Jumlah hari kerja operasional normal dalam bulan terkait (umumnya 20 s.d. 22 hari kerja untuk sistem 5 hari kerja seminggu).'
      },
      {
        symbol: 'Gaji Pokok',
        name: 'Nominal Upah Pokok Penuh',
        description: 'Upah pokok bulanan standar karyawan sesuai perjanjian kerja.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Masuk Pertengahan Bulan (Misal Join Date tanggal 15)',
        rule: 'Dihitung mulai dari tanggal join date s.d. tanggal cut-off payroll',
        multiplierOrRate: '(Hari Hadir ÷ Hari Kerja Normal) × Gaji Pokok'
      },
      {
        condition: 'Karyawan Resign / Berhenti di Pertengahan Bulan',
        rule: 'Dihitung mulai tanggal awal periode cut-off s.d. hari kerja terakhir',
        multiplierOrRate: '(Hari Hadir Bekerja ÷ Hari Kerja Normal) × Gaji Pokok'
      },
      {
        condition: 'Bekerja Penuh 1 Bulan Kalender',
        rule: 'Tidak dikenakan prorata',
        multiplierOrRate: '100% Gaji Pokok Penuh'
      }
    ],
    exampleCase: {
      scenario: 'Citra mulai bekerja pada hari Senin tanggal 16 dengan Gaji Pokok Rp 6.000.000. Dalam bulan tersebut, total hari kerja normal perusahaan adalah 22 hari kerja. Citra hadir bekerja penuh selama 11 hari kerja.',
      inputs: [
        { label: 'Gaji Pokok Penuh', value: 'Rp 6.000.000' },
        { label: 'Total Hari Kerja Normal', value: '22 Hari' },
        { label: 'Hari Hadir Aktual Citra', value: '11 Hari' }
      ],
      calculationSteps: [
        '1. Hitung Rasio Kehadiran = 11 hari ÷ 22 hari = 0.50 (50%)',
        '2. Gaji Prorata = 0.50 × Rp 6.000.000 = Rp 3.000.000'
      ],
      finalResult: 'Rp 3.000.000',
      slipImpact: 'Komponen Basic Salary di slip gaji tercetak sebesar Rp 3.000.000 dengan keterangan prorata 11/22 hari kerja.'
    },
    hrBestPractice: [
      'Pastikan konsistensi penentuan cut-off date di perusahaan (misal tanggal 21 bulan lalu s.d. tanggal 20 bulan berjalan, atau tanggal 1 s.d. akhir bulan).',
      'Tunjangan tetap (seperti tunjangan jabatan) biasanya juga diprorata dengan rasio yang sama, sedangkan tunjangan tidak tetap (seperti uang makan harian) dibayarkan murni sesuai absensi riil.'
    ]
  },
  {
    id: 'formula-thr',
    title: 'Formula Tunjangan Hari Raya (THR) Keagamaan',
    shortTitle: 'THR Keagamaan',
    category: 'Penggajian',
    tag: 'Permenaker 6/2016',
    primaryPath: '/payroll',
    summary: 'Digunakan oleh modul Penggajian Khusus untuk menghitung kewajiban pembayaran THR keagamaan proporsional bagi karyawan baru dan 1 bulan gaji penuh bagi karyawan senior.',
    legalBasis: 'Peraturan Menteri Ketenagakerjaan No. 6 Tahun 2016 tentang Tunjangan Hari Raya Keagamaan Bagi Pekerja/Buruh di Perusahaan',
    expression: 'Masa Kerja ≥ 12 Bulan: THR = 1 × UB\nMasa Kerja 1–12 Bulan: THR = (MK ÷ 12) × UB\nMasa Kerja < 1 Bulan: THR = Rp 0',
    legend: [
      { symbol: 'THR', label: 'Tunjangan Hari Raya Keagamaan' },
      { symbol: 'MK', label: 'Masa Kerja (dalam Bulan)' },
      { symbol: 'UB', label: 'Upah Bulanan Penuh (Gaji Pokok + Tunjangan Tetap)' }
    ],
    logicExplanation: 'THR adalah pendapatan non-upah yang wajib dibayarkan pengusaha kepada pekerja menjelang hari raya keagamaan masing-masing karyawan. Dasar perhitungan THR adalah 1 bulan upah yang terdiri dari Gaji Pokok ditambah Tunjangan Tetap. THR wajib dibayarkan paling lambat 7 hari kalender (H-7) sebelum hari raya keagamaan.',
    variables: [
      {
        symbol: 'Masa Kerja',
        name: 'Masa Kerja Terus Menerus',
        description: 'Dihitung sejak tanggal bergabung (Join Date) resmi sampai dengan tanggal jatuhnya hari raya keagamaan dalam satuan bulan.',
        componentIncluded: ['Masa Kontrak PKWT', 'Masa Karyawan PKWTT']
      },
      {
        symbol: 'Upah Bulanan',
        name: 'Komponen Dasar THR',
        description: 'Gaji Pokok ditambah Tunjangan Tetap (misal Tunjangan Jabatan). Tunjangan tidak tetap tidak boleh dihitung ke dalam dasar THR.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Masa Kerja ≥ 12 Bulan Secara Terus Menerus',
        rule: 'Memperoleh 1 bulan upah penuh tanpa potongan prorata',
        multiplierOrRate: '1.0 × Upah Bulanan'
      },
      {
        condition: 'Masa Kerja 1 Bulan s.d. Kurang dari 12 Bulan',
        rule: 'Dihitung secara proporsional sesuai perbandingan masa kerja terhadap 12 bulan',
        multiplierOrRate: '(Masa Kerja ÷ 12) × Upah Bulanan'
      },
      {
        condition: 'Masa Kerja Kurang dari 1 Bulan (< 30 Hari)',
        rule: 'Belum memenuhi syarat masa kerja minimal Permenaker 6/2016',
        multiplierOrRate: 'Rp 0'
      }
    ],
    exampleCase: {
      scenario: 'Dian mulai bekerja tanggal 1 Oktober dan Hari Raya Idul Fitri jatuh pada tanggal 1 Mei tahun berikutnya (Masa kerja genap 7 bulan). Upah bulanan Dian (Gaji Pokok + Tunjangan Tetap) adalah Rp 6.000.000.',
      inputs: [
        { label: 'Tanggal Bergabung', value: '1 Oktober' },
        { label: 'Jatuh Tempo Hari Raya', value: '1 Mei (7 Bulan Masa Kerja)' },
        { label: 'Upah Bulanan', value: 'Rp 6.000.000' }
      ],
      calculationSteps: [
        '1. Hitung Masa Kerja = 7 bulan',
        '2. Hitung Rasio Proporsional = 7 ÷ 12 = 0.5833',
        '3. Hitung Nominal THR = (7 ÷ 12) × Rp 6.000.000 = Rp 3.500.000'
      ],
      finalResult: 'Rp 3.500.000',
      slipImpact: 'Dibayarkan melalui Slip Gaji Khusus THR atau slip gaji reguler dengan komponen Non-Wage Income (Penghasilan Non-Upah).'
    },
    hrBestPractice: [
      'THR Keagamaan dikenakan pemotongan PPh 21 TER pada bulan pembayarannya, karena dimasukkan ke dalam penghasilan bruto bulan bersangkutan.',
      'Bagi karyawan PKWTT (Tetap) yang mengalami PHK terhitung sejak 30 hari sebelum hari raya keagamaan, tetap berhak atas THR. Namun bagi karyawan PKWT (Kontrak) yang berakhir masa kontraknya sebelum hari raya, tidak berhak atas THR.'
    ]
  },
  {
    id: 'formula-denda',
    title: 'Formula Denda Keterlambatan Disiplin Jam Kerja',
    shortTitle: 'Denda Keterlambatan',
    category: 'Kedisiplinan',
    tag: 'PP 36/2021 & SOP Internal',
    primaryPath: '/attendance',
    summary: 'Digunakan oleh modul Presensi & Payroll untuk menghitung pemotongan upah akibat keterlambatan kerja karyawan setelah melewati batas toleransi keterlambatan (Grace Period).',
    legalBasis: 'PP No. 36 Tahun 2021 Pasal 63 & 65 serta Peraturan Perusahaan (PP) / Perjanjian Kerja Bersama (PKB)',
    expression: 'TUPM = GP ÷ (HKS × JKH × 60)\nTotal Denda = TMT × TUPM\nBatas Maksimal = Akumulasi Denda ≤ 50% × UB',
    legend: [
      { symbol: 'TUPM', label: 'Tarif Upah Per Menit' },
      { symbol: 'GP', label: 'Gaji Pokok' },
      { symbol: 'HKS / JKH', label: 'Hari Kerja Sebulan / Jam Kerja per Hari' },
      { symbol: 'TMT', label: 'Total Menit Terlambat (Setelah Grace Period)' },
      { symbol: 'UB', label: 'Upah Bulanan' }
    ],
    logicExplanation: 'Keterlambatan jam kerja merugikan jam produktif operasional. Untuk menjaga keadilan dan ketertiban, perusahaan menetapkan toleransi (misal 10 s.d. 15 menit). Apabila karyawan hadir melebihi batas toleransi, sistem menghitung durasi menit keterlambatan dan mengalikannya dengan nilai upah per menit karyawan. Sesuai PP 36/2021 Pasal 65, total seluruh pemotongan upah tidak boleh melebihi 50% dari total upah bulanan pekerja.',
    variables: [
      {
        symbol: 'Grace Period',
        name: 'Toleransi Waktu Masuk (Menit)',
        description: 'Batas menit kelonggaran dari jam masuk jadwal (misal 10-15 menit). Jam masuk di bawah batas ini belum dikenakan denda.'
      },
      {
        symbol: 'Menit Kerja Bulanan',
        name: 'Total Menit Kerja Efektif Bulanan',
        description: 'Standar: 21 hari kerja × 8 jam/hari × 60 menit = 10.080 menit kerja sebulan.'
      },
      {
        symbol: 'Upah Per Menit',
        name: 'Nilai Waktu Kerja per Menit',
        description: 'Gaji Pokok bulanan dibagi 10.080 menit.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Datang Tepat Waktu atau Terlambat ≤ Grace Period (misal 5 menit dari toleransi 15 menit)',
        rule: 'Status Dimaafkan (Toleransi Masuk Aktif)',
        multiplierOrRate: 'Denda = Rp 0'
      },
      {
        condition: 'Terlambat Melebihi Grace Period (misal 35 menit)',
        rule: 'Dikenakan denda upah per menit proporsional',
        multiplierOrRate: 'Total Menit × Upah Per Menit'
      },
      {
        condition: 'Total Pemotongan Melebihi 50% Upah Karyawan',
        rule: 'Dibatasi plafon maksimal pemotongan upah PP 36/2021',
        multiplierOrRate: 'Maksimal Potongan = 50% Upah'
      }
    ],
    exampleCase: {
      scenario: 'Eko bergaji pokok Rp 5.040.000 dengan jadwal kerja 21 hari @ 8 jam/hari (Total 10.080 menit kerja per bulan). Selama satu bulan kalender, Eko terlambat sebanyak 3 kali dengan akumulasi total 35 menit setelah grace period.',
      inputs: [
        { label: 'Gaji Pokok Eko', value: 'Rp 5.040.000' },
        { label: 'Total Menit Kerja Sebulan', value: '10.080 Menit' },
        { label: 'Akumulasi Keterlambatan', value: '35 Menit' }
      ],
      calculationSteps: [
        '1. Hitung Upah per Menit = Rp 5.040.000 ÷ 10.080 menit = Rp 500 per menit',
        '2. Hitung Total Denda = 35 menit × Rp 500 = Rp 17.500',
        '3. Cek Batas Maksimal Pemotongan: Rp 17.500 jauh di bawah 50% upah (Rp 2.520.000) → Valid'
      ],
      finalResult: 'Rp 17.500',
      slipImpact: 'Masuk ke komponen Potongan Kedisiplinan / Denda Keterlambatan pada Slip Gaji dan mengurangi gaji bersih (Take Home Pay).'
    },
    hrBestPractice: [
      'Kebijakan denda keterlambatan wajib tertuang secara sah dalam Buku Peraturan Perusahaan (PP) atau Perjanjian Kerja Bersama (PKB) yang disahkan Dinas Tenaga Kerja.',
      'Dana hasil pemotongan denda disiplin menurut aturan ketenagakerjaan sebaiknya dialokasikan untuk kegiatan kesejahteraan karyawan perusahaan.'
    ]
  },
  {
    id: 'formula-kpi',
    title: 'Formula Realisasi Skor KPI (Indikator Positif vs Negatif)',
    shortTitle: 'Skor KPI & Grading',
    category: 'Performa',
    tag: 'Metodologi SMART KPI',
    primaryPath: '/kpi',
    summary: 'Digunakan oleh modul KPI & Manajemen Kinerja untuk mengukur persentase pencapaian kinerja individu secara objektif dan mengkonversinya menjadi predikat Grade (A, B, C, D).',
    legalBasis: 'Standar Manajemen Kinerja SDM (SMART Performance Appraisal)',
    expression: 'Indikator Positif (Higher is Better):\nSkor Capaian = (RA ÷ TS) × 100%\n\nIndikator Negatif (Lower is Better):\nSkor Capaian = (TS ÷ RA) × 100% [Capped 120%]\n\nSkor Total KPI = Σ (SC-i × Bobot-i)',
    legend: [
      { symbol: 'SC', label: 'Skor Capaian (%)' },
      { symbol: 'RA', label: 'Realisasi Aktual' },
      { symbol: 'TS', label: 'Target Sasaran' }
    ],
    logicExplanation: 'Dalam penilaian kinerja, tidak semua metrik berorientasi semakin besar semakin baik. Penjualan atau omset adalah indikator positif (makin tinggi capaian makin bagus). Sebaliknya, rasio komplain pelanggan, jumlah cacat produk, atau keterlambatan pengiriman adalah indikator negatif (makin kecil realisasinya, justru semakin tinggi prestasi karyawannya). Oleh karena itu rumusnya dibalik: Target dibagi Realisasi.',
    variables: [
      {
        symbol: 'Target',
        name: 'Sasaran Kuantitatif Awal Periode',
        description: 'Target angka yang disepakati antara atasan dan bawahan di awal periode penilaian.'
      },
      {
        symbol: 'Realisasi',
        name: 'Hasil Kinerja Riil Akhir Periode',
        description: 'Pencapaian aktual yang diverifikasi dengan data bukti fisik / sistem.'
      },
      {
        symbol: 'Bobot (%)',
        name: 'Tingkat Kepentingan Relatif',
        description: 'Porsi kontribusi indikator terhadap total nilai akhir. Total seluruh indikator wajib tepat 100%.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Indikator Positif (Misal Target Omset Rp 100 Juta, Capai Rp 110 Juta)',
        rule: 'Realisasi dibagi Target',
        multiplierOrRate: '(Realisasi ÷ Target) × 100% = 110%'
      },
      {
        condition: 'Indikator Negatif (Misal Target Komplain Maks 2 kasus, Realisasi hanya 1 kasus)',
        rule: 'Target dibagi Realisasi (Dibatasi Capping Maks 120%)',
        multiplierOrRate: '(Target ÷ Realisasi) × 100% = (2 ÷ 1) × 100% = 200% → Capped 120%'
      },
      {
        condition: 'Indikator Negatif dengan Realisasi = 0 (Prestasi Sempurna Tanpa Cacat)',
        rule: 'Diberikan skor maksimal batas atas',
        multiplierOrRate: '120% (Maksimal)'
      }
    ],
    exampleCase: {
      scenario: 'Seorang Supervisor dinilai dengan 2 indikator: Indikator 1 Positif (Pencapaian Proyek, Bobot 60%, Target 10, Realisasi 11). Indikator 2 Negatif (Jumlah Komplain Klien, Bobot 40%, Target 2 kasus, Realisasi 1 kasus).',
      inputs: [
        { label: 'Indikator 1 (Positif, Bobot 60%)', value: 'Target 10 | Realisasi 11' },
        { label: 'Indikator 2 (Negatif, Bobot 40%)', value: 'Target 2 | Realisasi 1' }
      ],
      calculationSteps: [
        '1. Skor Indikator 1 (Positif) = (11 ÷ 10) × 100% = 110%',
        '   Kontribusi Bobot Indikator 1 = 110% × 60% = 66.0%',
        '2. Skor Indikator 2 (Negatif) = (2 ÷ 1) × 100% = 200% (Dibatasi cap 120%) = 120%',
        '   Kontribusi Bobot Indikator 2 = 120% × 40% = 48.0%',
        '3. Total Skor KPI Akhir = 66.0% + 48.0% = 114.0%'
      ],
      finalResult: 'Skor Total: 114.0% (Predikat: Grade A - Istimewa / Exceeds Target)',
      slipImpact: 'Menjadi dasar pertimbangan persentase kenaikan gaji tahunan (Merit Increase) dan kelipatan bonus kinerja.'
    },
    hrBestPractice: [
      'Gunakan batas capping (misal 120%) pada indikator negatif agar skor total tidak terdistorsi secara ekstrem ketika realisasi mendekati angka nol.',
      'Skala Predikat Standar: Grade A (≥ 100% = Istimewa); Grade B (80% - 99% = Baik / Sesuai Ekspektasi); Grade C (60% - 79% = Butuh Pembinaan); Grade D (< 60% = Perlu Surat Peringatan / PIP).'
    ]
  },
  {
    id: 'formula-kompensasi-pkwt',
    title: 'Formula Uang Kompensasi Berakhirnya Kontrak PKWT',
    shortTitle: 'Kompensasi PKWT (PP 35/2021)',
    category: 'Kompensasi Kontrak',
    tag: 'PP 35/2021 Pasal 15-17',
    primaryPath: '/employees',
    summary: 'Digunakan untuk menghitung hak uang kompensasi yang wajib dibayarkan perusahaan kepada pekerja kontrak (PKWT) saat masa kontrak kerjanya berakhir atau selesai.',
    legalBasis: 'Peraturan Pemerintah No. 35 Tahun 2021 Pasal 15, 16, dan 17 & UU No. 6 Tahun 2023',
    expression: 'Masa Kerja 12 Bulan: UKP = 1 × UB\nMasa Kerja ≠ 12 Bulan: UKP = (MK ÷ 12) × UB',
    legend: [
      { symbol: 'UKP', label: 'Uang Kompensasi PKWT' },
      { symbol: 'MK', label: 'Masa Kerja (dalam Bulan)' },
      { symbol: 'UB', label: '1 Bulan Upah (Gaji Pokok + Tunjangan Tetap)' }
    ],
    logicExplanation: 'UU Cipta Kerja dan PP 35/2021 mewajibkan pengusaha memberikan uang kompensasi kepada pekerja PKWT yang telah mempunyai masa kerja paling sedikit 1 bulan secara terus menerus saat kontrak selesai. Jika kontrak PKWT diperpanjang, kompensasi wajib dibayarkan untuk periode kontrak pertama sebelum perpanjangan dimulai. Dasar perhitungan kompensasi adalah 1 bulan upah (Gaji Pokok + Tunjangan Tetap).',
    variables: [
      {
        symbol: 'Masa Kerja PKWT',
        name: 'Durasi Kontrak Terus Menerus',
        description: 'Jumlah bulan bekerja secara sah dalam surat perjanjian kerja PKWT (minimal 1 bulan).'
      },
      {
        symbol: '1 Bulan Upah',
        name: 'Upah Bulanan Karyawan Kontrak',
        description: 'Gaji Pokok ditambah Tunjangan Tetap yang berlaku pada bulan terakhir kontrak.'
      }
    ],
    conditionalRules: [
      {
        condition: 'Masa Kerja Tepat 12 Bulan Penuh',
        rule: 'Berhak atas 1 bulan upah utuh',
        multiplierOrRate: '1.0 × Upah Bulanan'
      },
      {
        condition: 'Masa Kerja Lebih atau Kurang dari 12 Bulan (misal 6 bulan atau 18 bulan)',
        rule: 'Dihitung proporsional terhadap 12 bulan',
        multiplierOrRate: '(Masa Kerja Bulan ÷ 12) × Upah Bulanan'
      },
      {
        condition: 'Kontrak PKWT Diperpanjang',
        rule: 'Uang kompensasi wajib diselesaikan untuk masa kontrak lama sebelum perpanjangan berjalan',
        multiplierOrRate: 'Dibayarkan per termin berakhirnya kontrak'
      },
      {
        condition: 'Pengusaha Mengakhiri PKWT Sebelum Waktunya',
        rule: 'Pengusaha tetap wajib membayarkan uang kompensasi proporsional sesuai masa kerja yang telah dilalui',
        multiplierOrRate: '(Masa Kerja Aktual ÷ 12) × Upah Bulanan'
      }
    ],
    exampleCase: {
      scenario: 'Fajar menandatangani kontrak PKWT selama 6 bulan dengan upah bulanan Rp 5.400.000. Saat masa kontrak 6 bulan tersebut selesai dan tidak diperpanjang, perusahaan wajib membayarkan uang kompensasi PKWT.',
      inputs: [
        { label: 'Masa Kerja PKWT', value: '6 Bulan' },
        { label: 'Upah Bulanan', value: 'Rp 5.400.000' }
      ],
      calculationSteps: [
        '1. Hitung Rasio Masa Kerja = 6 bulan ÷ 12 bulan = 0.50',
        '2. Hitung Nilai Kompensasi = 0.50 × Rp 5.400.000 = Rp 2.700.000'
      ],
      finalResult: 'Rp 2.700.000',
      slipImpact: 'Dibayarkan pada slip gaji bulan terakhir karyawan sebagai Kompensasi Akhir Kontrak PKWT (PP 35/2021).'
    },
    hrBestPractice: [
      'Uang kompensasi PKWT ini TIDAK berlaku bagi tenaga kerja asing (TKA) yang dipekerjakan dengan PKWT.',
      'Pastikan anggaran dana kompensasi PKWT dicadangkan (accrued) setiap bulannya oleh bagian keuangan agar kas perusahaan siap saat jatuh tempo kontrak karyawan.'
    ]
  }
];
