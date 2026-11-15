import { Chapter } from './ebook-types';

export const bab4Penggajian: Chapter = {
  id: 'penggajian-dan-pajak',
  number: 4,
  title: 'Sistem Penggajian, Pajak PPh 21 TER, BPJS & THR',
  subtitle: 'Kalkulasi payroll komprehensif, implementasi PPh 21 TER (PP 58/2023), BPJS Kesehatan/Ketenagakerjaan, dan THR',
  iconName: 'CreditCard',
  category: 'Operasional',
  readingTime: '18 menit',
  summary: 'Penggajian (*Payroll*) sering kali menjadi momen paling menegangkan dalam operasional divisi HR di perusahaan mana pun. Bayangkan: satu kesalahan kecil dalam memotong pajak, menghitung BPJS, atau menjumlahkan uang lembur bisa memicu gelombang kekecewaan dan kemarahan di antara karyawanmu. Sebaliknya, kesalahan menghitung potongan pajak juga bisa membawa perusahaanmu berhadapan dengan pemeriksaan Direktorat Jenderal Pajak (DJP). Bab ini merupakan panduan pamungkas yang disusun secara sistematis agar kamu menguasai seluruh anatomi kalkulasi penggajian mulai dari komponen gaji pokok, potongan BPJS Kesehatan dan Ketenagakerjaan, penerapan PPh 21 TER (PP No. 58/2023), hingga perhitungan THR Keagamaan.',
  primaryPath: '/payroll',
  subsections: [
    {
      id: 'komponen-gaji-dasar',
      title: 'Konsep Dasar Penggajian, Komponen Gaji & Slip Gaji Profesional',
      description: 'Mengenal struktur upah pokok, tunjangan tetap, tunjangan tidak tetap, serta pentingnya transparansi slip gaji.',
      uiLocation: 'Payroll → Form Pengolahan Gaji Bulanan (Route: /payroll)',
      details: [
        '**Pernahkah kamu menerima slip gaji yang isinya hanya berupa deretan angka tanpa penjelasan mana gaji pokok dan mana tunjangan?**',
        'Slip gaji yang membingungkan seperti itu bukan cuma membuat karyawan merasa curiga, tapi juga melanggar ketentuan hukum pengupahan.',
        '**Anatomi Komponen Gaji Sesuai UU No. 13/2003 & PP No. 36/2021:**',
        '   - **Gaji Pokok (*Basic Salary*):** Imbalan dasar yang wajib ditetapkan minimal **75%** dari total akumulasi Gaji Pokok + Tunjangan Tetap.',
        '   - **Tunjangan Tetap:** Pembayaran teratur yang diberikan tanpa dikaitkan dengan kehadiran atau performa harian (misal: Tunjangan Jabatan, Tunjangan Keluarga).',
        '   - **Tunjangan Tidak Tetap:** Pembayaran yang sangat tergantung pada kehadiran atau kinerja riil (misal: Uang Makan Harian, Tunjangan Transport Harian). Jika karyawan tidak hadir, tunjangan ini tidak dibayarkan.',
        '   - **Komponen Penambah:** Uang Lembur, Insentif KPI, dan Bonus.',
        '   - **Komponen Pemotong:** Potongan Denda Terlambat, Iuran BPJS Ketenagakerjaan (JHT 2%, JP 1%), Iuran BPJS Kesehatan (1%), Potongan PPh 21 TER, dan Kasbon/Cicilan.',
        '**Kewajiban Hak Bukti Pembayaran Upah:** Berdasarkan **Pasal 53 PP No. 36 Tahun 2021**, pengusaha wajib memberikan rincian bukti pembayaran upah (slip gaji) yang mencantumkan rincian upah dan potongan secara transparan.',
        '**Kemudahan Slip Gaji di HRMatrix:** Melalui modul **Payroll (Route: `/payroll`)**, kamu bisa memproses kalkulasi gaji seluruh karyawan hanya dengan sekali klik dan mencetak Slip Gaji PDF individual yang rapi dan profesional.'
      ]
    },
    {
      id: 'skema-bpjs',
      title: 'Iuran BPJS Kesehatan & BPJS Ketenagakerjaan (4 Program Utama)',
      description: 'Rincian lengkap persentase iuran tanggungan perusahaan vs potongan gaji karyawan serta batas atas (cap) perhitungan.',
      uiLocation: 'Pengaturan Kompensasi → Tab BPJS Kesehatan & Ketenagakerjaan',
      formulaId: 'formula-bpjs-kesehatan',
      details: [
        '**Berapa persen sih potongan BPJS yang sebenarnya diambil dari gaji karyawan setiap bulan? Dan berapa besar kontribusi yang wajib dibayar perusahaan?**',
        'Pertanyaan ini sangat sering muncul baik di kalangan karyawan maupun staf finance perusahaan.',
        '**2 Pilar Jaminan Sosial Nasional:**',
        '   - **1. BPJS Kesehatan (Jaminan Pemeliharaan Kesehatan):** Total iuran **5%** dari upah sebulan. Pembagiannya: **4%** ditanggung oleh Perusahaan dan **1%** dipotong dari Gaji Karyawan. Batas maksimal upah (*cap*) yang dihitung adalah **Rp 12.000.000/bulan** (berdasarkan Perpres No. 64/2020).',
        '   - **2. BPJS Ketenagakerjaan (4 Program Utama):**',
        '     - **JKK (Jaminan Kecelakaan Kerja):** `0.24% - 1.74%` (100% ditanggung Perusahaan, bervariasi sesuai tingkat risiko usaha).',
        '     - **JKM (Jaminan Kematian):** `0.30%` (100% ditanggung Perusahaan).',
        '     - **JHT (Jaminan Hari Tua):** Total `5.7%` (**3.7%** Perusahaan + **2.0%** dipotong dari Gaji Karyawan).',
        '     - **JP (Jaminan Pensiun):** Total `3.0%` (**2.0%** Perusahaan + **1.0%** dipotong dari Gaji Karyawan). Batas maksimal upah (*cap*) JP disesuaikan berkala oleh BPJS (misal Rp 10.042.300/bulan).',
        '**Dampak terhadap Pajak (Sifat Penambah vs Pemotong Bruto PPh 21):**',
        '   *Sangat Penting!* Premi JKK, JKM, dan BPJS Kesehatan yang dibayarkan oleh perusahaan diperhitungkan sebagai **penambah penghasilan bruto** karyawan untuk pengenaan PPh 21. Sebaliknya, iuran JHT (2%) dan JP (1%) yang dipotong dari gaji karyawan bersifat **pengurang penghasilan bruto**.',
        '**Otomasi di HRMatrix:** HRMatrix menghitung persentase BPJS Kesehatan dan BPJS Ketenagakerjaan secara otomatis sesuai batas plafon resmi tanpa perlu kamu hitung manual.'
      ],
      formula: {
        expression: 'Iuran BPJS Kesehatan Karyawan = 1% × Min(Upah Bulanan, Rp 12.000.000) | Perusahaan = 4%',
        explanation: 'Upah bulanan yang dijadikan dasar perhitungan adalah Gaji Pokok + Tunjangan Tetap dengan plafon maksimal upah Rp 12.000.000.',
        variables: [
          { name: 'Upah Bulanan', desc: 'Gaji Pokok + Tunjangan Tetap' },
          { name: 'Plafon Maksimal BPJS Kes', desc: 'Rp 12.000.000 (Perpres 64/2020)' },
          { name: 'Potongan Karyawan', desc: '1% untuk BPJS Kesehatan + 2% JHT + 1% JP' }
        ],
        regulationBasis: 'Perpres No. 64 Tahun 2020 & PP No. 44, 45, 46 Tahun 2015',
        exampleCase: {
          scenario: 'Karyawan C memiliki Gaji Pokok Rp 10.000.000/bulan. Perusahaan mendaftarkan program BPJS Kesehatan, JKK (0.24%), JKM (0.30%), JHT, dan JP.',
          calculationSteps: [
            '1. BPJS Kesehatan Karyawan (1%): 1% × Rp 10.000.000 = Rp 100.000',
            '2. BPJS Kesehatan Perusahaan (4%): 4% × Rp 10.000.000 = Rp 400.000',
            '3. JHT Karyawan (2%): 2% × Rp 10.000.000 = Rp 200.000',
            '4. JP Karyawan (1%): 1% × Rp 10.000.000 = Rp 100.000',
            '5. Total Potongan Gaji Karyawan C untuk BPJS = Rp 100.000 + Rp 200.000 + Rp 100.000 = Rp 400.000'
          ],
          finalResult: 'Maka total pemotongan dari gaji Karyawan C untuk seluruh program BPJS adalah Rp 400.000/bulan'
        }
      }
    },
    {
      id: 'pajak-pph21-ter',
      title: 'Membedah Pajak PPh 21 TER (Tarif Efektif Rata-Rata) & PTKP',
      description: 'Panduan revolusioner perhitungan pajak karyawan berdasarkan PP No. 58 Tahun 2023 & PMK 168 Tahun 2023.',
      uiLocation: 'Payroll → Kalkulator & Pengolahan Pajak PPh 21 TER',
      formulaId: 'formula-pph21-ter',
      details: [
        '**Pernahkah kamu pusing tujuh keliling saat menghitung pemotongan PPh 21 di Excel dengan rumus Biaya Jabatan dan Tarif Pasal 17 yang sangat rumit?**',
        'Kabar baiknya, sejak dimulainya reforma perpajakan melalui **PP No. 58 Tahun 2023** dan **PMK 168 Tahun 2023**, pemerintah resmi memberlakukan mekanisme **Tarif Efektif Rata-Rata (TER)** untuk pemotongan PPh 21 bulanan (Masa Januari s.d. November)!',
        '**Bagaimana Cara Kerja TER? Simpel dan Praktis!**',
        'Kamu tidak perlu lagi mengurangkan Biaya Jabatan (5%), Iuran Pensiun, dan PTKP setiap bulan secara berbelit-belit. Cukup ikuti 2 langkah mudah berikut:',
        '   - **Langkah 1:** Hitung **Penghasilan Bruto Bulanan** (Gaji Pokok + Tunjangan + Lembur + Premi BPJS Tanggungan Perusahaan [JKK, JKM, BPJS Kes]).',
        '   - **Langkah 2:** Tentukan Kategori TER berdasarkan status PTKP karyawan (TER A, TER B, atau TER C), lalu cari persentase tarif TER pada tabel resmi sesuai rentang penghasilan bruto tersebut.',
        '   `PPh 21 Bulan Ini = Penghasilan Bruto Bulanan × Tarif TER (%)`',
        '**Lalu Bagaimana Perhitungan di Bulan Desember (Masa Pajak Terakhir)?**',
        'Di bulan Desember, hitung ulang total PPh 21 setahun menggunakan Tarif Pasal 17 UU HPP dikurangi PTKP setahun. Selisih antara total pajak setahun dengan akumulasi PPh 21 TER yang telah dipotong (Januari-November) adalah nilai PPh 21 yang dipotong pada bulan Desember.',
        '**Contoh Kasus Nyata Perhitungan TER:** Karyawan D berstatus lajang tanpa tanggungan (`TK/0` → **Kategori TER A**). Penghasilan bruto bulanannya adalah Rp 8.000.000. Berdasarkan tabel resmi TER A, rentang bruto Rp 7.500.001 s.d. Rp 8.550.000 memiliki tarif TER sebesar **1.5%**.',
        '   `Potongan PPh 21 Bulanan = Rp 8.000.000 × 1.5% = Rp 120.000`',
        'Sangat mudah, presisi, dan instan!',
        '**Integrasi PPh 21 TER di HRMatrix:** HRMatrix menyimpan seluruh tabel tarif TER A, TER B, dan TER C secara lengkap. Sistem memotong PPh 21 TER bulanan secara otomatis pada modul Payroll (Route: `/payroll`).'
      ],
      formula: {
        expression: 'PPh 21 TER Bulanan = Penghasilan Bruto Bulanan × Persentase Tarif TER (Kategori A/B/C)',
        explanation: 'Penghasilan Bruto mencakup Gaji Pokok, Tunjangan, Uang Lembur, serta Premi BPJS JKK/JKM/Kesehatan yang dibayar Perusahaan. Persentase TER ditentukan oleh status PTKP dan rentang nominal bruto.',
        variables: [
          { name: 'Penghasilan Bruto', desc: 'Gaji Pokok + Tunjangan + Lembur + Premi JKK/JKM/BPJS Kes Perusahaan' },
          { name: 'Kategori TER A', desc: 'Status PTKP: TK/0, TK/1, K/0' },
          { name: 'Kategori TER B', desc: 'Status PTKP: TK/2, TK/3, K/1, K/2' },
          { name: 'Kategori TER C', desc: 'Status PTKP: K/3' }
        ],
        regulationBasis: 'PP No. 58 Tahun 2023 & PMK No. 168 Tahun 2023',
        exampleCase: {
          scenario: 'Karyawan D berstatus TK/0 (Kategori TER A) dengan Total Penghasilan Bruto Bulan Ini Rp 8.000.000. Tarif TER A untuk rentang Rp 7.500.001 - Rp 8.550.000 adalah 1.5%.',
          calculationSteps: [
            '1. Tentukan Kategori TER: TK/0 → TER A',
            '2. Cari Tarif TER A untuk Bruto Rp 8.000.000 → Tarif = 1.5%',
            '3. Hitung PPh 21 TER: Rp 8.000.000 × 1.5% = Rp 120.000'
          ],
          finalResult: 'Maka pemotongan PPh 21 TER pada slip gaji Karyawan D bulan ini adalah Rp 120.000'
        }
      }
    },
    {
      id: 'formula-thr-keagamaan',
      title: 'Tunjangan Hari Raya (THR) Keagamaan & Formula Prorata',
      description: 'Aturan wajib pembayaran THR H-7 Hari Raya Keagamaan berdasarkan Permenaker No. 6 Tahun 2016.',
      uiLocation: 'Payroll → Tab Pengolahan THR & Bonus',
      formulaId: 'formula-thr-prorata',
      details: [
        '**Apakah karyawan yang baru bekerja selama 3 bulan di perusahaanmu berhak menerima Tunjangan Hari Raya (THR)?**',
        'Jawabannya: **YA, BERHAK!** Jangan sampai terjadi kesalahpahaman yang merugikan hak timmu.',
        '**Syarat Wajib THR Keagamaan (Permenaker No. 6/2016):** Berdasarkan **Permenaker No. 6 Tahun 2016**, setiap pekerja yang telah memiliki masa kerja **minimal 1 bulan secara terus-menerus** (baik status PKWT maupun PKWTT) WAJIB menerima THR Keagamaan paling lambat **H-7 Hari Raya Keagamaan**.',
        '**Rumus Perhitungan THR Keagamaan:**',
        '   - **Masa Kerja ≥ 12 Bulan (Full 1 Bulan Upah):** `THR = 1 Bulan Upah (Gaji Pokok + Tunjangan Tetap)`',
        '   - **Masa Kerja 1 s.d. < 12 Bulan (Prorata Proporsional):**',
        '     `THR Prorata = (Masa Kerja dalam Bulan ÷ 12) × 1 Bulan Upah`',
        '**Contoh Kasus Perhitungan Prorata:** Karyawan E baru bekerja selama 5 bulan saat Hari Raya tiba. Gaji pokoknya Rp 6.000.000/bulan tanpa tunjangan. Maka THR Prorata yang wajib diterimanya adalah:',
        '   `(5 bulan ÷ 12) × Rp 6.000.000 = Rp 2.500.000`',
        '**Sanksi Denda Keterlambatan Bayar THR:** Pengusaha yang terlambat membayar THR dikenakan denda sebesar **5%** dari total THR yang harus dibayar. Denda tersebut dikelola untuk kesejahteraan pekerja dan tidak menghilangkan kewajiban pengusaha untuk tetap membayar THR.',
        '**Kalkulasi Instan di HRMatrix:** Kamu bisa memproses THR massal dengan memilih jenis Hari Raya Keagamaan di tab THR pada modul Payroll (Route: `/payroll`). HRMatrix secara otomatis menghitung mana karyawan yang dapat 100% dan mana yang terkena proporsional masa kerja.'
      ],
      formula: {
        expression: 'THR Prorata = (Masa Kerja dalam Bulan ÷ 12) × 1 Bulan Upah (Gaji Pokok + Tunjangan Tetap)',
        explanation: 'Bagi karyawan dengan masa kerja 12 bulan atau lebih, berhak atas 1 Bulan Upah Penuh. Bagi yang kurang dari 12 bulan, dihitung proporsional sesuai jumlah bulan masa kerja.',
        variables: [
          { name: 'Masa Kerja dalam Bulan', desc: 'Jumlah bulan kerja efektif sebelum Hari Raya' },
          { name: '1 Bulan Upah', desc: 'Gaji Pokok + Tunjangan Tetap' }
        ],
        regulationBasis: 'Permenaker No. 6 Tahun 2016 tentang THR Keagamaan Bagi Pekerja/Buruh',
        exampleCase: {
          scenario: 'Karyawan E memiliki masa kerja 5 bulan berturut-turut dengan Upah Bulanan (Gaji Pokok + Tunjangan Tetap) sebesar Rp 6.000.000.',
          calculationSteps: [
            '1. Hitung Rasio Masa Kerja: 5 bulan ÷ 12 bulan = 0.4167',
            '2. Hitung THR Prorata: (5 ÷ 12) × Rp 6.000.000 = Rp 2.500.000'
          ],
          finalResult: 'Maka THR Keagamaan Prorata yang wajib dibayarkan kepada Karyawan E adalah Rp 2.500.000'
        }
      }
    }
  ]
};
