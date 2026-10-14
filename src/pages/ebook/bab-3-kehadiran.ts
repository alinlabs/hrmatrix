import { Chapter } from './ebook-types';

export const bab3Kehadiran: Chapter = {
  id: 'kehadiran-dan-shift',
  number: 3,
  title: 'Manajemen Kehadiran, Shift Kerja & Kalkulasi Lembur',
  subtitle: 'Membangun budaya kedisiplinan berkeadilan, regulasi jam kerja nasional, dan perhitungan uang lembur resmi',
  iconName: 'Clock',
  category: 'Operasional',
  readingTime: '15 menit',
  summary: 'Presensi atau kehadiran karyawan di kantormu bukan sekadar pencatatan jam datang dan jam pulang. Bagi sebuah bisnis, catatan kehadiran adalah cermin langsung dari komitmen, budaya kerja, dan efisiensi operasional timmu. Di sisi lain, masalah uang lembur (*overtime*) sering kali menjadi pemicu perselisihan paling sengit antara manajemen dan karyawan jika tidak dihitung transparan. Bab ini hadir untuk membantumu membangun sistem kedisiplinan yang adil, memahami regulasi jam kerja nasional, memutus potensi konflik lembur, serta menghitung uang lembur secara presisi menggunakan formula resmi Depnaker (Faktor 1/173).',
  primaryPath: '/attendance',
  subsections: [
    {
      id: 'konsep-kedisiplinan',
      title: 'Konsep Kedisiplinan Kerja & Regulasi Jam Kerja Nasional',
      description: 'Memahami dasar hukum 40 jam kerja seminggu serta dampaknya terhadap operasional dan hak timmu.',
      uiLocation: 'Attendance → Tab Pengaturan Shift & Jam Kerja',
      details: [
        '**Mengapa jam kerja di sebagian kantor ditetapkan 8 jam sehari, sementara di toko atau pabrik menggunakan jadwal shift?**',
        'Pemberlakuan jam kerja di Indonesia bukan diputuskan secara acak oleh pemilik bisnis, melainkan memiliki aturan hukum yang amat jelas untuk melindungi kesehatan kerja dan keseimbangan hidup pekerja.',
        '**2 Skema Jam Kerja Resmi Nasional:** Berdasarkan **Pasal 77 UU No. 13/2003 jo. PP No. 35 Tahun 2021**, pemerintah menetapkan 2 skema standar jam kerja formal (maksimal 40 jam seminggu):',
        '   - **Skema 5 Hari Kerja:** 8 jam sehari (Senin-Jumat) + 1 jam istirahat.',
        '   - **Skema 6 Hari Kerja:** 7 jam sehari (Senin-Jumat) + 5 jam (Sabtu) + 1 jam istirahat.',
        '**Menghindari Kebiasaan Micromanagement:** Sistem kedisiplinan yang baik tidak bertujuan membuat karyawan merasa diawasi secara paranoid (*micromanagement*), melainkan menciptakan kepastian dan keadilan. Karyawan yang selalu hadir tepat waktu tidak boleh disamakan dengan yang sering Mangkir atau Mangkid (Mangkir Tanpa Alasan).',
        '**Toleransi Keterlambatan (Grace Period):** Banyak perusahaan memberikan kelonggaran *Grace Period* (misalnya 10-15 menit). Jika karyawan datang dalam batas toleransi, ia tidak dianggap terlambat. Namun jika melewati batas toleransi, durasi keterlambatannya dihitung objektif.',
        '**Pencatatan Presensi di HRMatrix:** Melalui modul **Kehadiran (Route: `/attendance`)**, kamu bisa mencatat dan memantau status harian secara rinci: *Tepat Waktu, Terlambat, Pulang Awal, Izin Resmi, Sakit (Surat Dokter), Cuti, dan Mangkir*.'
      ]
    },
    {
      id: 'pola-shift',
      title: 'Manajemen Shift Kerja, Istirahat & Kesehatan Kerja',
      description: 'Pengaturan pola kerja bergilir (shift) untuk industri manufaktur, ritel, kesehatan, dan operasional 24 jam.',
      uiLocation: 'Attendance → Tab Jadwal Shift',
      details: [
        '**Bagaimana caramu menjaga operasional toko, pabrik, atau rumah sakit tetap berjalan 24 jam nonstop tanpa membuat timmu kelelahan ekstrem?**',
        'Kuncinya ada pada penyusunan **Rotasi Shift Kerja** yang sehat dan manusiawi.',
        '**Peraturan Istirahat Antar-Shift (Aturan Minimal 12 Jam):** Berdasarkan **Pasal 76 dan 79 UU No. 13/2003**, perusahaan wajib memberikan jeda waktu istirahat antar-shift minimal **12 jam berturut-turut**. Memaksa pekerja mengambil jadwal *back-to-back shift* (misal selesai Shift Malam jam 07.00 pagi lalu masuk lagi Shift Siang jam 15.00) melanggar aturan keselamatan kerja (K3) dan memicu risiko kecelakaan kerja akibat kelelahan (*fatigue*).',
        '**Perlindungan Khusus Pekerja Perempuan Shift Malam:** Untuk pekerja perempuan yang bekerja antara pukul 23.00 hingga 07.00 pagi, undang-undang mewajibkan perusahaan menyediakan makanan dan minuman bergizi serta fasilitas transportasi antar-jemput yang aman.',
        '**Contoh Pola Shift 3 Rotasi Standar:**',
        '   - **Shift 1 (Pagi):** 07.00 - 15.00 WIB',
        '   - **Shift 2 (Siang/Sore):** 15.00 - 23.00 WIB',
        '   - **Shift 3 (Malam):** 23.00 - 07.00 WIB',
        '**Pengaturan Shift di HRMatrix:** Kamu bisa menambah master nama shift, menentukan toleransi jam masuk, dan mengatur jadwal bergilir karyawan dengan fleksibel pada tab Pengaturan Shift di modul Kehadiran (Route: `/attendance`).'
      ]
    },
    {
      id: 'formula-denda-telat',
      title: 'Kebijakan Denda Keterlambatan & Batas Maksimal Pemotongan Gaji',
      description: 'Syarat legal penerapan denda disiplin agar tidak melanggar PP No. 36 Tahun 2021 tentang Pengupahan.',
      uiLocation: 'Pengaturan Kompensasi → Komponen Potongan Kedisiplinan',
      formulaId: 'formula-denda',
      details: [
        '**Bolehkah perusahaan memotong gaji karyawan yang terlambat masuk kantor? Dan seberapa besar potongan yang diperbolehkan hukum?**',
        'Pertanyaan ini sering kali memicu perdebatan panas antara karyawan dan pihak manajemen.',
        '**Syarat Sah Penerapan Denda Disiplin:** Berdasarkan **Pasal 63 s.d. 65 PP No. 36 Tahun 2021 tentang Pengupahan**, pemotongan denda atas keterlambatan atau pelanggaran disiplin **HANYA SAH** apabila jenis pelanggaran dan besaran dendanya telah dicantumkan secara tegas dalam Peraturan Perusahaan (PP) atau Perjanjian Kerja Bersama (PKB) yang disahkan Disnaker.',
        '**Batas Maksimal Pemotongan Gaji (Maksimal 50%):** Undang-undang dengan sangat tegas menetapkan bahwa **total seluruh pemotongan upah (denda + cicilan + ganti rugi) dalam 1 bulan TIDAK BOLEH melebihi 50% dari gaji bersih karyawan!** Memotong gaji hingga tersisa di bawah 50% adalah tindakan ilegal yang merugikan kelangsungan hidup pekerja.',
        '**Rumus Perhitungan Denda Proporsional per Menit:**',
        '   `Denda Keterlambatan = Total Menit Terlambat (setelah toleransi) × Upah Per Menit`',
        '   *(Upah Per Menit dihitung dari: Gaji Pokok Bulanan ÷ Total Menit Kerja Normal Sebulan)*',
        '**Contoh Kasus Perhitungan:** Karyawan A memiliki Gaji Pokok Rp 5.040.000/bulan (21 hari kerja × 8 jam × 60 menit = 10.080 menit kerja normal). Maka tarif upahnya per menit adalah `Rp 5.040.000 ÷ 10.080 = Rp 500/menit`. Jika ia terlambat 40 menit setelah dikurangi batas toleransi, denda disiplinnya adalah `40 menit × Rp 500 = Rp 20.000`.',
        '**Kalkulasi Otomatis di HRMatrix:** Nilai denda keterlambatan ini diproses secara otomatis oleh HRMatrix berdasarkan data absensi harian dan dimasukkan secara transparan ke dalam komponen potongan slip gaji di menu `/payroll`.'
      ],
      formula: {
        expression: 'Denda Keterlambatan = Total Menit Terlambat (setelah toleransi) × Upah Per Menit',
        explanation: 'Upah Per Menit dihitung dari Gaji Pokok Bulanan dibagi Total Menit Kerja Normal Efektif dalam sebulan.',
        variables: [
          { name: 'Total Menit Kerja Normal', desc: 'Misal 21 hari kerja × 8 jam × 60 menit = 10.080 menit' },
          { name: 'Upah Per Menit', desc: 'Gaji Pokok ÷ Total Menit Kerja Normal' },
          { name: 'Total Menit Terlambat', desc: 'Durasi telat aktual dikurangi batas toleransi' }
        ],
        regulationBasis: 'Pasal 63 s.d. 65 PP No. 36 Tahun 2021 tentang Pengupahan & Peraturan Perusahaan',
        exampleCase: {
          scenario: 'Karyawan A memiliki Gaji Pokok Rp 5.040.000 per bulan (10.080 menit kerja normal). Pada bulan ini, total keterlambatannya setelah batas toleransi adalah 40 menit.',
          calculationSteps: [
            '1. Hitung Upah per Menit: Rp 5.040.000 ÷ 10.080 menit = Rp 500 per menit',
            '2. Hitung Total Denda: 40 menit × Rp 500 = Rp 20.000'
          ],
          finalResult: 'Maka potongan denda kedisiplinan pada slip gaji Karyawan A bulan ini adalah Rp 20.000'
        }
      }
    },
    {
      id: 'lembur-depnaker',
      title: 'Membedah Formula Uang Lembur Resmi Depnaker (Faktor Pembagi 1/173)',
      description: 'Panduan lengkap menghitung upah kerja lembur untuk hari kerja biasa dan hari libur resmi secara akurat.',
      uiLocation: 'Attendance → Input Lembur & Sinkronisasi Penggajian',
      formulaId: 'formula-lembur',
      details: [
        '**Mengapa angka ajaib "1/173" selalu muncul saat kita menghitung uang lembur karyawan? Dari mana asal-usul rumus ini?**',
        'Bagi praktisi HR, faktor pembagi **1/173** adalah kitab suci kalkulasi lembur di Indonesia. Mari kita bedah rahasia matematis di baliknya!',
        '**Asal-Usul Matematis Angka 173:** Dalam 1 tahun kalender terdapat 52 minggu. Sesuai undang-undang, jam kerja formal adalah 40 jam per minggu. Maka rata-rata jam kerja bulanan pekerja di Indonesia adalah `(52 minggu × 40 jam) ÷ 12 bulan = 173,33 jam` (dibulatkan oleh pemerintah menjadi **173 jam**).',
        '**Payung Hukum Resmi Lembur:** Berdasarkan **Kepmenakertrans No. KEP.102/MEN/VI/2004** dan **Pasal 26 s.d. 31 PP No. 35 Tahun 2021**, tarif dasar upah lembur per jam dihitung dengan rumus:',
        '   `Tarif Upah Lembur Sejam = (1 ÷ 173) × (Gaji Pokok + Tunjangan Tetap)`',
        '**Ketentuan Faktor Pengali Progresif:**',
        '   - **Lembur Hari Kerja Biasa:** Jam ke-1 dikalikan **1.5x**, sedangkan jam ke-2 dan seterusnya dikalikan **2.0x** tarif per jam.',
        '   - **Lembur Hari Libur Resmi / Istirahat Mingguan (5 Hari Kerja):** Jam ke-1 s.d. ke-8 dikalikan **2.0x**, jam ke-9 dikalikan **3.0x**, dan jam ke-10 s.d. ke-12 dikalikan **4.0x**.',
        '**Contoh Kasus Nyata Perhitungan:** Karyawan B bergaji pokok Rp 5.190.000/bulan tanpa tunjangan lain. Tarif upah per jamnya adalah `Rp 5.190.000 ÷ 173 = Rp 30.000/jam`. Ia ditugaskan lembur pada hari Selasa selama 3 jam:',
        '   - **Jam ke-1 (1.5x):** 1 jam × 1.5 × Rp 30.000 = Rp 45.000',
        '   - **Jam ke-2 & ke-3 (2.0x):** 2 jam × 2.0 × Rp 30.000 = Rp 120.000',
        '   - **Total Uang Lembur yang Berhak Diterima:** `Rp 45.000 + Rp 120.000 = Rp 165.000`.',
        '**Sinkronisasi Otomatis di HRMatrix:** Kamu tinggal menginput jam lembur aktual di modul Kehadiran (Route: `/attendance`), dan HRMatrix akan mengalikan pengali progresif serta memasukkannya ke komponen lembur slip gaji di modul Payroll.'
      ],
      formula: {
        expression: 'Upah Lembur Sejam = (1 ÷ 173) × Upah Bulanan (Gaji Pokok + Tunjangan Tetap)',
        explanation: 'Upah Bulanan yang dijadikan dasar pembagi 1/173 adalah 100% Gaji Pokok ditambah Tunjangan Tetap (apabila ada). Tunjangan tidak tetap seperti uang makan harian tidak diikutsertakan.',
        variables: [
          { name: 'Upah Bulanan', desc: 'Gaji Pokok + Tunjangan Tetap' },
          { name: 'Pengali Hari Kerja', desc: 'Jam ke-1 (1.5x), Jam ke-2 dst (2.0x)' },
          { name: 'Pengali Hari Libur', desc: 'Jam 1-8 (2.0x), Jam 9 (3.0x), Jam 10-12 (4.0x)' }
        ],
        regulationBasis: 'Kepmenakertrans No. KEP.102/MEN/VI/2004 & Pasal 31 PP No. 35 Tahun 2021',
        exampleCase: {
          scenario: 'Karyawan B bergaji pokok Rp 5.190.000 tanpa tunjangan lain. Ditugaskan kerja lembur pada hari Selasa selama 3 jam.',
          calculationSteps: [
            '1. Hitung Upah Lembur Sejam: Rp 5.190.000 ÷ 173 = Rp 30.000 per jam',
            '2. Jam Pertama (1.5x): 1 jam × 1.5 × Rp 30.000 = Rp 45.000',
            '3. Jam Kedua & Ketiga (2.0x): 2 jam × 2.0 × Rp 30.000 = Rp 120.000',
            '4. Total Uang Lembur: Rp 45.000 + Rp 120.000 = Rp 165.000'
          ],
          finalResult: 'Maka total uang lembur yang wajib dibayarkan kepada Karyawan B adalah Rp 165.000'
        }
      }
    }
  ]
};
