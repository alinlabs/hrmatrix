import { RegulationCategory, RegulationItem } from './types';

export const REGULATION_CATEGORIES_META: { id: RegulationCategory; label: string; countBadge?: string }[] = [
  { id: 'ALL', label: 'Semua Regulasi' },
  { id: 'KONTRAK_PKWT_PKWTT', label: 'Kontrak Kerja (PKWT / PKWTT)' },
  { id: 'KOMPENSASI_PESANGON', label: 'Kompensasi PKWT & Pesangon PHK' },
  { id: 'SURAT_PERINGATAN_DISIPLIN', label: 'Surat Peringatan (SP) & Sanksi' },
  { id: 'JAM_KERJA_LEMBUR', label: 'Waktu Kerja & Upah Lembur' },
  { id: 'PENGUPAHAN_THR', label: 'Upah Minimum & THR Keagamaan' },
  { id: 'BPJS_JAMINAN_SOSIAL', label: 'BPJS Ketenagakerjaan & Kesehatan' },
  { id: 'CUTI_ISTIRAHAT_IZIN', label: 'Hak Cuti & Izin Resmi' },
];

export const REGULATION_DATA: RegulationItem[] = [
  // 1. KONTRAK KERJA PKWT (PP 35/2021)
  {
    id: 'reg-pkwt-rules',
    code: 'PP-35-2021-PKWT',
    title: 'Ketentuan Batas Waktu, Syarat & Pencatatan PKWT',
    lawBasis: 'Peraturan Pemerintah No. 35 Tahun 2021 (Pasal 4 s/d Pasal 14) jo. UU No. 6 Tahun 2023',
    category: 'KONTRAK_PKWT_PKWTT',
    categoryLabel: 'Kontrak Kerja (PKWT / PKWTT)',
    tags: ['PKWT', 'Masa Kontrak', 'Pencatatan Disnaker', 'Bilingual', 'Probation'],
    lastUpdated: 'Berlaku Efektif 2021 - Sekarang',
    summary: 'Ketentuan hukum mengikat mengenai jangka waktu maksimal PKWT (maksimal 5 tahun termasuk perpanjangan), larangan masa percobaan, dan kewajiban pencatatan kontrak kerja ke Kementerian Ketenagakerjaan.',
    keyPoints: [
      'Jangka waktu PKWT berdasarkan jangka waktu paling lama 5 (lima) tahun, termasuk jika dilakukan perpanjangan.',
      'PKWT tidak dapat diadakan untuk pekerjaan yang bersifat tetap (core operational).',
      'PKWT tidak boleh mensyaratkan masa percobaan kerja (probation). Jika disyaratkan, klausul masa percobaan batal demi hukum dan masa kerja tetap dihitung.',
      'PKWT wajib dibuat secara tertulis dengan huruf latin atau alfabet dalam Bahasa Indonesia dan/atau 2 Bahasa (Bilingual). Jika ada sengketa, teks Bahasa Indonesia yang berlaku.',
      'Pengusaha wajib mencatatkan PKWT secara daring (online) kepada Kementerian/Dinas Ketenagakerjaan paling lama 3 (tiga) hari kerja sejak penandatanganan.'
    ],
    articles: [
      {
        number: 'Pasal 8 ayat (1) & (2)',
        title: 'Batas Jangka Waktu Maksimal PKWT 5 Tahun',
        summary: 'PKWT untuk pekerjaan yang selesai dalam waktu tertentu dapat diadakan untuk jangka waktu paling lama 5 tahun, termasuk perpanjangannya.',
        fullText: '(1) PKWT berdasarkan jangka waktu dapat dibuat untuk paling lama 5 (lima) tahun.\n(2) Dalam hal jangka waktu PKWT akan berakhir dan pekerjaan belum selesai, maka dapat dilakukan perpanjangan PKWT dengan jangka waktu sesuai kesepakatan, dengan ketentuan jangka waktu keseluruhan PKWT beserta perpanjangannya tidak lebih dari 5 (lima) tahun.',
        importantNote: 'Penggabungan masa kontrak awal + perpanjangan tidak boleh melampaui akumulasi 5 tahun.',
        practicalHRTip: 'Gunakan template PKWT 1 tahun atau 2 tahun dengan klausul evaluasi perpanjangan berkala agar tidak melanggar ambang batas 5 tahun.'
      },
      {
        number: 'Pasal 12 ayat (1) & (2)',
        title: 'Larangan Masa Percobaan Kerja (Probation) pada PKWT',
        summary: 'PKWT dilarang mensyaratkan masa percobaan kerja. Jika dicantumkan, masa percobaan batal demi hukum.',
        fullText: '(1) PKWT tidak dapat mensyaratkan adanya masa percobaan kerja.\n(2) Dalam hal disyaratkan masa percobaan kerja, masa percobaan kerja yang disyaratkan batal demi hukum dan masa kerja tetap dihitung.',
        importantNote: 'Jika perusahaan membutuhkan masa percobaan 3 bulan, perusahaan harus menggunakan format kontrak PKWTT (Karyawan Tetap).',
        practicalHRTip: 'Pastikan template kontrak PKWT tidak memiliki klausul probation agar tidak menimbulkan tuntutan hukum menjadi karyawan tetap otomatis.'
      },
      {
        number: 'Pasal 14 ayat (1)',
        title: 'Kewajiban Pencatatan PKWT ke Disnaker',
        summary: 'Pengusaha wajib mencatatkan PKWT secara daring pada kementerian ketenagakerjaan paling lambat 3 hari kerja.',
        fullText: '(1) Pengusaha wajib mencatatkan PKWT pada kementerian yang menyelenggarakan urusan pemerintahan di bidang ketenagakerjaan secara daring paling lama 3 (tiga) hari kerja sejak penandatanganan PKWT.\n(2) Dalam hal pencatatan daring belum tersedia, pencatatan dilakukan secara tertulis di dinas ketenagakerjaan paling lambat 7 hari kerja.',
        importantNote: 'Pencatatan dilakukan melalui portal resmi Kemnaker (kemnaker.go.id).',
        practicalHRTip: 'Simpan bukti cetak tanda terima nomor pencatatan Disnaker bersama arsip kontrak fisik karyawan.'
      }
    ],
    penaltiesOrRisks: 'Jika PKWT dibuat tanpa mematuhi ketentuan jenis pekerjaan atau tanpa format tertulis, demi hukum status pekerja berubah menjadi PKWTT (Pekerja Waktu Tidak Tertentu / Karyawan Tetap).'
  },

  // 2. UANG KOMPENSASI PKWT (PP 35/2021)
  {
    id: 'reg-pkwt-compensation',
    code: 'PP-35-2021-KOMPENSASI',
    title: 'Kewajiban Pembayaran Uang Kompensasi PKWT',
    lawBasis: 'Peraturan Pemerintah No. 35 Tahun 2021 (Pasal 15, Pasal 16, & Pasal 17)',
    category: 'KOMPENSASI_PESANGON',
    categoryLabel: 'Kompensasi PKWT & Pesangon PHK',
    tags: ['Uang Kompensasi', 'PP 35/2021', 'Rumus Kompensasi', 'Perhitungan Finansial'],
    lastUpdated: 'Wajib Dibayarkan Sejak 2 Februari 2021',
    calculatorType: 'pkwt_compensation',
    summary: 'Aturan wajib bagi perusahaan untuk membayarkan Uang Kompensasi kepada karyawan PKWT yang telah memiliki masa kerja minimal 1 (satu) bulan saat kontrak berakhir atau saat diperpanjang.',
    keyPoints: [
      'Wajib diberikan kepada pekerja PKWT yang memiliki masa kerja minimal 1 (satu) bulan secara terus menerus.',
      'Diberikan pada saat berakhirnya PKWT atau setiap kali masa perpanjangan PKWT disepakati.',
      'Rumus perhitungan: (Masa Kerja dalam Bulan / 12) x 1 Bulan Upah.',
      'Upah yang menjadi dasar perhitungan adalah Upah Pokok + Tunjangan Tetap.',
      'Jika salah satu pihak mengakhiri PKWT sebelum jangka waktu berakhir, pihak yang mengakhiri wajib membayar sisa masa kontrak dan pengusaha tetap wajib memberikan uang kompensasi proporsional masa kerja yang telah dijalani.'
    ],
    articles: [
      {
        number: 'Pasal 15 ayat (1) & (2)',
        title: 'Kewajiban Pengusaha Memberikan Uang Kompensasi',
        summary: 'Pengusaha wajib memberikan uang kompensasi kepada pekerja yang hubungan kerjanya berdasarkan PKWT.',
        fullText: '(1) Pengusaha wajib memberikan uang kompensasi kepada Pekerja/Buruh yang hubungan kerjanya berdasarkan PKWT.\n(2) Pemberian uang kompensasi dilaksanakan pada saat berakhirnya PKWT.\n(3) Uang kompensasi diberikan kepada Pekerja/Buruh yang telah mempunyai masa kerja paling sedikit 1 (satu) bulan secara terus menerus.',
        importantNote: 'Kompensasi berlaku untuk pekerja lokal WNI. Tidak berlaku untuk Tenaga Kerja Asing (TKA).',
        practicalHRTip: 'Buat pos anggaran cadangan (accrual) uang kompensasi setiap bulan sebesar 1/12 (8.33%) dari gaji bulanan pekerja PKWT.'
      },
      {
        number: 'Pasal 16 ayat (1)',
        title: 'Formula Resmi Perhitungan Uang Kompensasi PKWT',
        summary: 'Kompensasi dihitung proporsional masa kerja dibagi 12 dikali 1 bulan upah.',
        fullText: '(1) Besaran uang kompensasi diberikan sesuai ketentuan:\n  a. PKWT selama 12 bulan terus-menerus, diberikan sebesar 1 (satu) bulan Upah;\n  b. PKWT selama 1 bulan atau lebih tetapi kurang dari 12 bulan, dihitung secara proporsional:\n     (Masa Kerja / 12) x 1 Bulan Upah;\n  c. PKWT selama lebih dari 12 bulan, dihitung secara proporsional:\n     (Masa Kerja / 12) x 1 Bulan Upah.',
        importantNote: 'Jika dilakukan perpanjangan kontrak, uang kompensasi untuk masa kontrak awal wajib dicairkan terlebih dahulu sebelum perpanjangan berjalan.',
        practicalHRTip: 'Gunakan fitur kalkulator kompensasi pada HRMatrix untuk langsung menghitung nominal rupiah secara presisi.'
      }
    ],
    penaltiesOrRisks: 'Perusahaan yang tidak membayarkan uang kompensasi PKWT dapat dikenai sanksi administratif berupa teguran tertulis, pembatasan kegiatan usaha, penghentian sementara sebagian atau seluruh alat produksi, hingga pembekuan kegiatan usaha.'
  },

  // 3. PESANGON PHK & HAK FINANSIAL (PP 35/2021)
  {
    id: 'reg-severance-phk',
    code: 'PP-35-2021-PHK-PESANGON',
    title: 'Tabel Hak Pesangon, UPMK & UPH Akibat PHK',
    lawBasis: 'Peraturan Pemerintah No. 35 Tahun 2021 (Pasal 40 s/d Pasal 59) jo. UU Cipta Kerja',
    category: 'KOMPENSASI_PESANGON',
    categoryLabel: 'Kompensasi PKWT & Pesangon PHK',
    tags: ['Pesangon UP', 'UPMK', 'UPH', 'Faktor Pengali', 'PHK Efisiensi', 'Pensiun'],
    lastUpdated: 'Standar UU Cipta Kerja No. 6/2023',
    calculatorType: 'severance',
    summary: 'Daftar tabel resmi Uang Pesangon (UP), Uang Penghargaan Masa Kerja (UPMK), dan Uang Penggantian Hak (UPH) berdasarkan masa kerja dan alasan pemutusan hubungan kerja.',
    keyPoints: [
      'Uang Pesangon (UP) berkisar dari 1 bulan upah (masa kerja < 1 tahun) hingga maksimal 9 bulan upah (masa kerja 8 tahun atau lebih).',
      'Uang Penghargaan Masa Kerja (UPMK) mulai diberikan untuk masa kerja minimal 3 tahun (2 bulan upah) hingga maksimal 10 bulan upah (masa kerja 24 tahun ke atas).',
      'Uang Penggantian Hak (UPH) mencakup cuti tahunan yang belum gugur dan ongkos kepulangan.',
      'Besaran pengali (multiplier) pesangon ditentukan oleh alasan PHK: Efisiensi rugi (0.5x UP + 1x UPMK), Efisiensi cegah rugi (1x UP + 1x UPMK), Pensiun (1.75x UP + 1x UPMK), Meninggal dunia (2x UP + 1x UPMK), Resign sukarela (Hanya UPH + Uang Pisah).'
    ],
    articles: [
      {
        number: 'Pasal 40 ayat (2)',
        title: 'Tabel Standar Uang Pesangon (UP)',
        summary: 'Tabel besaran uang pesangon berdasarkan rentang masa kerja.',
        fullText: 'Masa Kerja & Besaran Uang Pesangon:\n• < 1 tahun: 1 bulan upah\n• 1 th s/d < 2 th: 2 bulan upah\n• 2 th s/d < 3 th: 3 bulan upah\n• 3 th s/d < 4 th: 4 bulan upah\n• 4 th s/d < 5 th: 5 bulan upah\n• 5 th s/d < 6 th: 6 bulan upah\n• 6 th s/d < 7 th: 7 bulan upah\n• 7 th s/d < 8 th: 8 bulan upah\n• ≥ 8 tahun: 9 bulan upah (maksimal)',
        importantNote: 'Nilai upah yang digunakan adalah Upah Pokok + Tunjangan Tetap terakhir yang diterima.',
        practicalHRTip: 'Pastikan riwayat slip gaji karyawan tersimpan rapi untuk bukti perhitungan hak pesangon.'
      },
      {
        number: 'Pasal 40 ayat (3)',
        title: 'Tabel Uang Penghargaan Masa Kerja (UPMK)',
        summary: 'Tabel besaran penghargaan masa kerja bagi karyawan dengan masa kerja di atas 3 tahun.',
        fullText: 'Masa Kerja & Besaran UPMK:\n• 3 th s/d < 6 th: 2 bulan upah\n• 6 th s/d < 9 th: 3 bulan upah\n• 9 th s/d < 12 th: 4 bulan upah\n• 12 th s/d < 15 th: 5 bulan upah\n• 15 th s/d < 18 th: 6 bulan upah\n• 18 th s/d < 21 th: 7 bulan upah\n• 21 th s/d < 24 th: 8 bulan upah\n• ≥ 24 tahun: 10 bulan upah (maksimal)',
        importantNote: 'UPMK tidak diberikan jika masa kerja kurang dari 3 tahun.',
        practicalHRTip: 'Sertakan lampiran rincian perhitungan UP, UPMK, dan UPH pada dokumen Perjanjian Bersama (PB) PHK.'
      }
    ],
    penaltiesOrRisks: 'Penyelesaian PHK yang tidak sesuai prosedur UU dapat digugat oleh pekerja ke Pengadilan Hubungan Industrial (PHI) dan berisiko kewajiban pembayaran upah proses selama perselisihan berlangsung.'
  },

  // 4. SURAT PERINGATAN (SP) & DISIPLIN
  {
    id: 'reg-warning-letter-sp',
    code: 'UU-13-2003-SP',
    title: 'Masa Berlaku, Tingkatan & Prosedur Surat Peringatan (SP)',
    lawBasis: 'UU No. 13 Tahun 2003 (Pasal 161) jo. UU No. 6 Tahun 2023 & PP No. 35 Tahun 2021 (Pasal 52)',
    category: 'SURAT_PERINGATAN_DISIPLIN',
    categoryLabel: 'Surat Peringatan (SP) & Sanksi',
    tags: ['Surat Peringatan', 'SP 1', 'SP 2', 'SP 3', 'Masa Berlaku 6 Bulan', 'Disiplin Kerja'],
    lastUpdated: 'Standar Prosedur Disiplin Ketenagakerjaan',
    summary: 'Aturan hukum mengenai penerbitan Surat Peringatan Pertama (SP 1), Kedua (SP 2), dan Ketiga (SP 3), masa berlaku 6 bulan, dan syarat sah sebelum dilakukannya PHK atas alasan indisipliner.',
    keyPoints: [
      'Masing-masing surat peringatan (SP 1, SP 2, SP 3) memiliki masa berlaku paling lama 6 (enam) bulan sejak tanggal diterbitkan.',
      'Penerbitan surat peringatan harus dilakukan secara bertingkat dan berurutan, kecuali ditentukan lain dalam Peraturan Perusahaan (PP) atau Perjanjian Kerja Bersama (PKB) untuk jenis pelanggaran berat tertentu.',
      'Apabila karyawan melakukan pelanggaran disiplin dalam masa berlaku SP 1, maka perusahaan dapat menerbitkan SP 2 dengan masa berlaku 6 bulan baru.',
      'Jika masa berlaku SP 1 telah habis (lebih dari 6 bulan) dan karyawan melakukan pelanggaran kembali, maka yang diterbitkan kembali adalah SP 1 (bukan SP 2).',
      'SP 3 adalah peringatan terakhir. Jika karyawan masih melakukan pelanggaran dalam masa berlaku SP 3, perusahaan berhak memproses PHK dengan hak kompensasi sesuai Pasal 52 PP 35/2021 (0.5x UP + 1x UPMK + UPH).'
    ],
    articles: [
      {
        number: 'Pasal 161 ayat (1) & (2) UU 13/2003',
        title: 'Masa Berlaku 6 Bulan & Urutan Surat Peringatan',
        summary: 'Surat peringatan 1, 2, dan 3 masing-masing berlaku untuk jangka waktu 6 bulan.',
        fullText: '(1) Dalam hal Pekerja/Buruh melakukan pelanggaran ketentuan yang diatur dalam Perjanjian Kerja, Peraturan Perusahaan atau Perjanjian Kerja Bersama, Pengusaha dapat melakukan pemutusan hubungan kerja, setelah kepada Pekerja/Buruh yang bersangkutan diberikan surat peringatan pertama, kedua, dan ketiga secara berturut-turut.\n(2) Masing-masing surat peringatan sebagaimana dimaksud dalam ayat (1) berlaku untuk jangka waktu paling lama 6 (enam) bulan, kecuali ditetapkan lain dalam Perjanjian Kerja, Peraturan Perusahaan atau Perjanjian Kerja Bersama.',
        importantNote: 'Penerbitan SP wajib memuat tanggal kejadian, kronologi, pasal pelanggaran, tindakan perbaikan, dan konsekuensi lanjutan.',
        practicalHRTip: 'Gunakan fitur Generator SP pada menu Dokumen Kontrak HRMatrix untuk mencetak SP resmi dengan klausul hukum yang valid.'
      }
    ],
    penaltiesOrRisks: 'Menerbitkan SP langsung ke tingkat 3 tanpa klausul pengecualian dalam Peraturan Perusahaan (PP) yang disahkan Disnaker berisiko dianggap cacat prosedur dalam sidang mediasi hubungan industrial.'
  },

  // 5. WAKTU KERJA & UPAH LEMBUR
  {
    id: 'reg-working-hours-overtime',
    code: 'PP-35-2021-LEMBUR',
    title: 'Ketentuan 40 Jam Kerja & Rumus Upah Lembur (1/173)',
    lawBasis: 'Peraturan Pemerintah No. 35 Tahun 2021 (Pasal 21 s/d Pasal 34)',
    category: 'JAM_KERJA_LEMBUR',
    categoryLabel: 'Waktu Kerja & Upah Lembur',
    tags: ['40 Jam Kerja', 'Upah Lembur', 'Rumus 1/173', 'Surat Perintah Lembur'],
    lastUpdated: 'Regulasi Waktu Kerja PP 35/2021',
    calculatorType: 'overtime',
    summary: 'Standar jam kerja formal di Indonesia (7 jam/hari untuk 6 hari kerja, atau 8 jam/hari untuk 5 hari kerja), batas maksimal lembur 4 jam/hari, serta rumus resmi upah kerja lembur 1/173.',
    keyPoints: [
      'Waktu kerja wajib memenuhi: a) 7 jam 1 hari dan 40 jam 1 minggu untuk 6 hari kerja; atau b) 8 jam 1 hari dan 40 jam 1 minggu untuk 5 hari kerja.',
      'Waktu kerja lembur hanya dapat dilakukan paling banyak 4 (empat) jam dalam 1 (satu) hari dan 18 (delapan belas) jam dalam 1 (satu) minggu (tidak termasuk lembur hari libur resmi).',
      'Untuk melakukan kerja lembur harus ada Surat Perintah Lembur tertulis dari pengusaha dan persetujuan tertulis dari pekerja.',
      'Upah per jam untuk menghitung upah lembur adalah: 1/173 x Upah Sebulan (Upah Pokok + Tunjangan Tetap).',
      'Pengali lembur pada hari kerja: Jam pertama = 1.5x upah sejam, Jam kedua dan seterusnya = 2x upah sejam.',
      'Pengali lembur pada hari libur resmi/istirahat mingguan (5 hari kerja): Jam 1 s/d 8 = 2x, Jam ke-9 = 3x, Jam ke-10 s/d 12 = 4x upah sejam.'
    ],
    articles: [
      {
        number: 'Pasal 26 & Pasal 31 PP 35/2021',
        title: 'Batas Maksimal Lembur & Upah Sejam 1/173',
        summary: 'Dasar perhitungan upah sejam lembur adalah 1/173 dari upah bulanan.',
        fullText: 'Pasal 31:\n(1) Cara menghitung Upah Sejam adalah 1/173 (satu per seratus tujuh puluh tiga) kali Upah sebulan.\n(2) Dalam hal Upah terdiri atas Upah Pokok dan Tunjangan Tetap, dasar perhitungan Upah Lembur adalah 100% dari total Upah tersebut.',
        importantNote: 'Pengusaha yang mempekerjakan pekerja lembur wajib memberi makanan dan minuman minimal 1.400 kkal jika lembur dilakukan selama 4 jam atau lebih.',
        practicalHRTip: 'Modul Payroll HRMatrix secara otomatis menghitung upah lembur presisi 1/173 berdasarkan data absensi kehadiran harian.'
      }
    ],
    penaltiesOrRisks: 'Pelanggaran pembayaran upah kerja lembur merupakan tindak pidana pelanggaran ketenagakerjaan dengan ancaman denda pidana.'
  },

  // 6. PENGUPAHAN, UPAH MINIMUM & THR
  {
    id: 'reg-wages-thr',
    code: 'PP-36-2021-THR',
    title: 'Upah Minimum, Struktur Skala Upah & THR Keagamaan',
    lawBasis: 'PP No. 36 Tahun 2021 jo. PP No. 51 Tahun 2023 & Permenaker No. 6 Tahun 2016',
    category: 'PENGUPAHAN_THR',
    categoryLabel: 'Upah Minimum & THR Keagamaan',
    tags: ['Upah Minimum', 'UMP / UMK', 'Struktur Skala Upah', 'THR Keagamaan', 'H-7 Hari Raya'],
    lastUpdated: 'Regulasi Pengupahan Nasional',
    summary: 'Ketentuan batas bawah Upah Minimum (UMP/UMK), komposisi upah pokok minimal 75%, kewajiban Struktur Skala Upah, serta tata cara pencairan Tunjangan Hari Raya (THR) Keagamaan.',
    keyPoints: [
      'Pengusaha dilarang membayar upah lebih rendah dari Upah Minimum Provinsi/Kabupaten/Kota (UMP/UMK) yang berlaku.',
      'Komponen Upah Pokok minimal 75% dari total upah tetap (Upah Pokok + Tunjangan Tetap).',
      'Setiap perusahaan wajib menyusun dan menerapkan Struktur dan Skala Upah (SUSU) dengan memperhatikan golongan, jabatan, masa kerja, pendidikan, dan kompetensi.',
      'THR Keagamaan wajib dibayarkan pengusaha kepada pekerja paling lambat 7 (tujuh) hari sebelum hari raya keagamaan.',
      'Pekerja dengan masa kerja 12 bulan terus menerus mendapat 1 bulan upah. Masa kerja 1 s/d 11 bulan mendapat proporsional: (Masa Kerja / 12) x 1 Bulan Upah.',
      'THR wajib dibayarkan dalam bentuk uang rupiah dan tidak boleh digantikan dengan barang/bingkisan.'
    ],
    articles: [
      {
        number: 'Pasal 2 Permenaker No. 6/2016',
        title: 'Ketentuan Penerima & Waktu Pembayaran THR',
        summary: 'Pekerja dengan masa kerja minimal 1 bulan berhak atas THR proporsional.',
        fullText: '(1) Pengusaha wajib memberikan THR Keagamaan kepada Pekerja/Buruh yang telah mempunyai masa kerja 1 (satu) bulan secara terus menerus atau lebih.\n(2) THR Keagamaan wajib dibayarkan oleh Pengusaha paling lambat 7 (tujuh) hari sebelum Hari Raya Keagamaan.',
        importantNote: 'Bagi pekerja PKWT yang kontraknya berakhir sebelum hari raya, tidak berhak atas THR jika tanggal berakhir kontrak sebelum H-30.',
        practicalHRTip: 'Lakukan proses rekap THR pada menu Payroll H-14 agar distribusi pembayaran tepat waktu sebelum H-7.'
      }
    ],
    penaltiesOrRisks: 'Keterlambatan pembayaran THR dikenai denda sebesar 5% dari total THR yang harus dibayar sejak berakhirnya batas waktu kewajiban pengusaha untuk membayar.'
  },

  // 7. JAMINAN SOSIAL BPJS
  {
    id: 'reg-bpjs-social-security',
    code: 'UU-24-2011-BPJS',
    title: 'Tarif Iuran BPJS Ketenagakerjaan & BPJS Kesehatan',
    lawBasis: 'UU No. 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial & Peraturan Pelaksana',
    category: 'BPJS_JAMINAN_SOSIAL',
    categoryLabel: 'BPJS Ketenagakerjaan & Kesehatan',
    tags: ['BPJS Kesehatan', 'JHT', 'JKK', 'JKM', 'JP', 'JKP', 'Tarif Iuran'],
    lastUpdated: 'Regulasi Jaminan Sosial Nasional',
    summary: 'Kewajiban kepesertaan jaminan sosial dan rincian persentase pembagian iuran antara perusahaan (pemberi kerja) dan karyawan (pekerja).',
    keyPoints: [
      'BPJS Kesehatan: Total 5% (4% ditanggung Perusahaan, 1% ditanggung Pekerja), dengan batas maksimal dasar upah Rp 12.000.000.',
      'JHT (Jaminan Hari Tua): Total 5.7% (3.7% Perusahaan, 2.0% Pekerja).',
      'JP (Jaminan Pensiun): Total 3.0% (2.0% Perusahaan, 1.0% Pekerja), dengan batas atas upah yang disesuaikan BPS setiap tahun.',
      'JKK (Jaminan Kecelakaan Kerja): 0.24% s/d 1.74% (100% ditanggung Perusahaan berdasar tingkat risiko industri).',
      'JKM (Jaminan Kematian): 0.30% (100% ditanggung Perusahaan).',
      'JKP (Jaminan Kehilangan Pekerjaan): Dibiayai pemerintah dan rekomposisi iuran JKK/JKM tanpa menambah beban iuran baru.'
    ],
    articles: [
      {
        number: 'Pasal 15 UU 24/2011',
        title: 'Kewajiban Pendaftaran Seluruh Karyawan ke BPJS',
        summary: 'Pemberi kerja wajib mendaftarkan dirinya dan pekerjanya sebagai peserta kepada BPJS.',
        fullText: 'Pemberi kerja secara bertahap wajib mendaftarkan dirinya dan Pekerjanya sebagai Peserta kepada BPJS sesuai dengan program jaminan sosial yang diikuti.',
        importantNote: 'Iuran wajib disetorkan paling lambat tanggal 10 (Kesehatan) dan tanggal 15 (Ketenagakerjaan) setiap bulannya.',
        practicalHRTip: 'Gunakan fitur penggajian otomatis HRMatrix untuk memotong dan merekap iuran BPJS secara terstandarisasi.'
      }
    ],
    penaltiesOrRisks: 'Perusahaan yang tidak mendaftarkan pekerjanya dapat dikenai sanksi tidak mendapat pelayanan publik tertentu (lisensi izin usaha, IMB, lelang proyek pemerintah).'
  },

  // 8. HAK CUTI & IZIN RESMI
  {
    id: 'reg-leave-and-permit',
    code: 'UU-13-2003-CUTI',
    title: 'Hak Cuti Tahunan, Cuti Melahirkan & Izin Resmi Berbayar',
    lawBasis: 'UU No. 13 Tahun 2003 (Pasal 79, 82, 85, 93) jo. UU No. 4 Tahun 2024 (UU Kesejahteraan Ibu & Anak)',
    category: 'CUTI_ISTIRAHAT_IZIN',
    categoryLabel: 'Hak Cuti & Izin Resmi',
    tags: ['Cuti Tahunan 12 Hari', 'Cuti Melahirkan', 'UU KIA', 'Izin Menikah', 'Izin Duka'],
    lastUpdated: 'Diperbarui UU KIA No. 4/2024',
    summary: 'Ketentuan hak cuti tahunan (minimal 12 hari kerja), cuti melahirkan/keguguran, serta daftar izin resmi yang tetap wajib dibayarkan upahnya penuh oleh perusahaan.',
    keyPoints: [
      'Cuti Tahunan: Minimal 12 (dua belas) hari kerja setelah pekerja bekerja selama 12 bulan secara terus menerus.',
      'Cuti Melahirkan: Standar 3 bulan (1.5 bulan sebelum & 1.5 bulan sesudah melahirkan). Sesuai UU No. 4/2024 (KIA), dapat diperpanjang hingga paling lama 6 bulan jika ada kondisi medis khusus bagi ibu/anak.',
      'Cuti Keguguran Kandungan: 1.5 bulan atau sesuai surat keterangan dokter kandungan/bidan.',
      'Izin Menikah Pekerja: 3 (tiga) hari kerja (tetap dibayar penuh).',
      'Izin Menikahkan Anak: 2 (dua) hari kerja.',
      'Izin Istri Melahirkan / Keguguran: 2 (dua) hari kerja (UU KIA memberikan hak pendampingan suami hingga 3 hari atau sesuai kesepakatan).',
      'Izin Anggota Keluarga Inti Meninggal (Suami/Istri/Anak/Orang Tua/Mertua): 2 (dua) hari kerja.',
      'Izin Anggota Keluarga Serumah Meninggal: 1 (satu) hari kerja.'
    ],
    articles: [
      {
        number: 'Pasal 93 ayat (2) & (4) UU 13/2003',
        title: 'Daftar Hak Izin Resmi Tetap Menerima Upah Penuh',
        summary: 'Pengusaha wajib membayar upah kepada pekerja yang tidak masuk kerja karena alasan penting keluarga.',
        fullText: 'Upah yang dibayarkan kepada Pekerja/Buruh yang tidak masuk bekerja:\na. Pekerja/Buruh menikah: 3 hari\nb. Menikahkan anaknya: 2 hari\nc. Mengkhitankan anaknya: 2 hari\nd. Membaptiskan anaknya: 2 hari\ne. Isteri melahirkan atau keguguran kandungan: 2 hari\nf. Suami/isteri, orang tua/mertua, anak/menantu meninggal dunia: 2 hari\ng. Anggota keluarga dalam satu rumah meninggal dunia: 1 hari.',
        importantNote: 'Pengambilan izin resmi ini tidak mengurangi jatah hak Cuti Tahunan karyawan.',
        practicalHRTip: 'Kelola alur persetujuan cuti dan permohonan izin resmi secara instan di menu Presensi & Kehadiran.'
      }
    ],
    penaltiesOrRisks: 'Memotong upah karyawan yang mengambil izin resmi duka/menikah sah dapat dipidanakan dan melanggar prinsip perlindungan upah pekerja.'
  }
];
