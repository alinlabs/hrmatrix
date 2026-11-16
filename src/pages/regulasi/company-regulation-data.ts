import { CompanyRegulationChapter } from './types';

/**
 * Kompilasi Lengkap Standar Peraturan Perusahaan (PP) Indonesia
 * Sesuai UU No. 13/2003 jo. UU No. 6/2023 (Cipta Kerja) & PP No. 35/2021
 * Siap pakai untuk HR tanpa harus menyusun dari nol.
 */
export const COMPANY_REGULATION_DATA: CompanyRegulationChapter[] = [
  {
    id: 'bab-1',
    chapterNumber: 'BAB I',
    title: 'KETENTUAN UMUM & PENGERTIAN ISTILAH',
    description: 'Definisi formal istilah perusahaan, pengusaha, pekerja, atasan langsung, tempat kerja, serta maksud dan tujuan pembuatan Peraturan Perusahaan.',
    articles: [
      {
        number: 1,
        title: 'Pengertian dan Istilah',
        legalReference: 'Pasal 1 UU No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023',
        hrImplementationNote: 'Pastikan nama PT dan representasi pimpinan disesuaikan dengan Akta Notaris terbaru.',
        content: `Dalam Peraturan Perusahaan ini yang dimaksud dengan:
1. Perusahaan adalah Badan Usaha yang berbadan hukum perseroan terbatas yang menjalankan kegiatan usaha secara sah di wilayah Republik Indonesia.
2. Pengusaha adalah Direksi atau orang perseorangan yang diberi kuasa penuh untuk memimpin dan mewakili jalannya Perusahaan.
3. Pekerja/Karyawan adalah setiap orang yang bekerja pada Perusahaan dengan menerima upah atau imbalan dalam bentuk lain berdasarkan Perjanjian Kerja.
4. Atasan Langsung adalah Pejabat/Pimpinan yang ditunjuk Perusahaan untuk membawahi, mengarahkan, dan mengawasi pelaksanaan tugas pekerjaan Pekerja.
5. Perjanjian Kerja adalah perjanjian antara Pekerja dan Pengusaha yang memuat syarat-syarat kerja, hak, dan kewajiban kedua belah pihak.
6. Tempat Kerja adalah setiap ruangan atau lapangan, tertutup atau terbuka, bergerak atau tetap, di mana Pekerja bekerja untuk kepentingan Perusahaan.`
      },
      {
        number: 2,
        title: 'Maksud dan Tujuan',
        legalReference: 'Pasal 108 UU No. 13 Tahun 2003',
        hrImplementationNote: 'Dasar filosofis hubungan industrial yang harmonis, dinamis, dan berkeadilan (Bipartit).',
        content: `1. Menetapkan hak, kewajiban, tata tertib, dan syarat kerja yang berlaku bagi seluruh Pekerja dan Perusahaan.
2. Menciptakan dan memelihara hubungan kerja yang harmonis, aman, dinamis, dan berkeadilan demi kemajuan bersama serta peningkatan kesejahteraan Pekerja.
3. Menjamin adanya kepastian hukum dalam pengelolaan personalia, tata disiplin, pembinaan karir, serta perlindungan tenaga kerja.`
      },
      {
        number: 3,
        title: 'Ruang Lingkup dan Keberlakuan',
        legalReference: 'Pasal 111 UU No. 13 Tahun 2003',
        hrImplementationNote: 'Berlaku bagi seluruh pekerja kantor pusat, cabang, maupun penempatan remote/hybrid.',
        content: `1. Peraturan Perusahaan ini mengikat dan berlaku bagi seluruh Pekerja di lingkungan Perusahaan, baik di kantor pusat, kantor cabang, proyek operasional, maupun pekerja dengan skema kerja jarak jauh (remote/hybrid).
2. Apabila terdapat perjanjian kerja perorangan yang memuat ketentuan kurang dari standar Peraturan Perusahaan ini, maka ketentuan dalam perjanjian kerja tersebut batal demi hukum dan yang berlaku adalah ketentuan Peraturan Perusahaan ini.`
      }
    ]
  },
  {
    id: 'bab-2',
    chapterNumber: 'BAB II',
    title: 'PENERIMAAN KARYAWAN & HUBUNGAN KERJA',
    description: 'Syarat penerimaan karyawan, jenis hubungan kerja (PKWT & PKWTT), masa percobaan (probation), dan pengangkatan karyawan tetap.',
    articles: [
      {
        number: 4,
        title: 'Syarat dan Prosedur Penerimaan Karyawan',
        legalReference: 'Pasal 5 & 6 UU No. 13 Tahun 2003 (Anti Diskriminasi)',
        hrImplementationNote: 'Proses seleksi wajib transparan, berbasis kompetensi, tanpa diskriminasi SARA atau gender.',
        content: `1. Penerimaan Pekerja didasarkan pada kebutuhan formasi organisasi kerja dan kualifikasi kompetensi jabatan yang ditetapkan Perusahaan.
2. Setiap pelamar wajib memenuhi persyaratan administratif: Kartu Identitas (NIK KTP), Ijazah resmi, Surat Keterangan Sehat, NPWP, dan berkas pendukung lainnya.
3. Proses rekrutmen dilaksanakan secara objektif tanpa membedakan suku, agama, ras, jenis kelamin, status pernikahan, atau disabilitas (Equal Employment Opportunity).`
      },
      {
        number: 5,
        title: 'Perjanjian Kerja Waktu Tertentu (PKWT)',
        legalReference: 'PP No. 35 Tahun 2021 Pasal 4 s/d Pasal 14',
        hrImplementationNote: 'Maksimal 5 tahun total termasuk perpanjangan. Dilarang mensyaratkan probation pada PKWT.',
        content: `1. PKWT hanya dapat diadakan untuk pekerjaan yang selesai dalam waktu tertentu atau pekerjaan yang bersifat musiman/sementara, dan bukan untuk pekerjaan yang bersifat tetap.
2. Jangka waktu PKWT paling lama 5 (lima) tahun termasuk seluruh perpanjangannya sesuai ketentuan PP No. 35 Tahun 2021.
3. PKWT wajib dibuat secara tertulis dalam Bahasa Indonesia atau Bilingual dan dicatatkan secara daring ke Kementerian Ketenagakerjaan paling lambat 3 (tiga) hari kerja sejak ditandatangani.
4. Pada PKWT tidak dapat dipersyaratkan masa percobaan kerja (probation). Jika disyaratkan, klausul tersebut batal demi hukum.`
      },
      {
        number: 6,
        title: 'Masa Percobaan Kerja (Probation) pada PKWTT',
        legalReference: 'Pasal 60 UU No. 13 Tahun 2003',
        hrImplementationNote: 'Masa probation hanya sah pada PKWTT dan paling lama 3 bulan dengan upah tidak boleh di bawah UMR.',
        content: `1. Untuk Perjanjian Kerja Waktu Tidak Tertentu (PKWTT / Karyawan Tetap), Perusahaan dapat mensyaratkan masa percobaan kerja paling lama 3 (tiga) bulan.
2. Selama masa percobaan kerja, Perusahaan dilarang membayar upah di bawah Upah Minimum yang berlaku.
3. Selama masa percobaan, masing-masing pihak berhak mengakhiri hubungan kerja sewaktu-waktu dengan pemberitahuan tertulis tanpa kewajiban ganti rugi.
4. Pekerja yang telah menyelesaikan masa percobaan dengan evaluasi kinerja memuaskan akan diangkat resmi sebagai Karyawan Tetap melalui Surat Keputusan (SK) Direksi.`
      }
    ]
  },
  {
    id: 'bab-3',
    chapterNumber: 'BAB III',
    title: 'HARI KERJA, JAM KERJA, ISTIRAHAT & KERJA LEMBUR',
    description: 'Skema waktu kerja formal 40 jam/minggu, waktu istirahat harian/mingguan, izin meninggalkan kantor, serta aturan kerja lembur dan perhitungan upah lembur 1/173.',
    articles: [
      {
        number: 7,
        title: 'Waktu Kerja dan Jam Kerja',
        legalReference: 'Pasal 21 PP No. 35 Tahun 2021',
        hrImplementationNote: 'Pilih sistem 5 hari kerja (8 jam/hari) atau 6 hari kerja (7 jam/hari).',
        content: `1. Perusahaan menetapkan waktu kerja standar 40 (empat puluh) jam dalam 1 (satu) minggu dengan pilihan sistem:
   a. 5 (lima) hari kerja dalam seminggu: 8 (delapan) jam sehari (Senin s/d Jumat).
   b. 6 (enam) hari kerja dalam seminggu: 7 (tujuh) jam sehari (Senin s/d Sabtu).
2. Jam kerja operasional harian standar ditetapkan pukul 08.30 s/d 17.30 WIB dengan waktu istirahat minimal 1 (satu) jam yang tidak dihitung sebagai jam kerja.
3. Untuk unit kerja tertentu (teknologi, keamanan, pelayanan pelanggan), jam kerja dapat diatur dengan sistem giliran kerja (shift) dengan tetap mematuhi batas 40 jam seminggu.`
      },
      {
        number: 8,
        title: 'Kerja Lembur dan Upah Lembur',
        legalReference: 'Pasal 26 s/d Pasal 34 PP No. 35 Tahun 2021',
        hrImplementationNote: 'Wajib ada Surat Perintah Lembur (SPL) tertulis dan batas lembur maksimal 4 jam/hari atau 18 jam/minggu.',
        content: `1. Kerja lembur adalah pekerjaan yang dilakukan melebihi jam kerja reguler harian atau pekerjaan pada hari istirahat mingguan/hari libur resmi.
2. Kerja lembur hanya dapat dilakukan atas dasar Surat Perintah Lembur tertulis dari Atasan Langsung dan persetujuan dari Pekerja yang bersangkutan.
3. Waktu kerja lembur paling banyak 4 (empat) jam dalam 1 (satu) hari dan 18 (delapan belas) jam dalam 1 (satu) minggu (tidak termasuk lembur hari libur resmi).
4. Perhitungan upah sejam kerja lembur menggunakan rumus resmi: 1/173 x Upah Sebulan (Upah Pokok + Tunjangan Tetap).
5. Perusahaan wajib menyediakan makanan dan minuman bergizi minimal 1.400 kkal apabila kerja lembur berlangsung selama 4 (empat) jam atau lebih.`
      }
    ]
  },
  {
    id: 'bab-4',
    chapterNumber: 'BAB IV',
    title: 'SISTEM PENGUPAHAN, TUNJANGAN & BENEFIT',
    description: 'Prinsip pengupahan, struktur skala upah (SUSU), komponen tunjangan tetap dan variabel, batas waktu pembayaran upah, serta Tunjangan Hari Raya (THR).',
    articles: [
      {
        number: 9,
        title: 'Komponen Upah dan Struktur Skala Upah',
        legalReference: 'PP No. 36 Tahun 2021 jo. Permenaker No. 1 Tahun 2017',
        hrImplementationNote: 'Upah pokok minimal 75% dari total upah tetap jika terdapat tunjangan tetap.',
        content: `1. Komposisi penghasilan Pekerja terdiri dari:
   a. Gaji Pokok (Basic Salary).
   b. Tunjangan Tetap (Fixed Allowance): Tunjangan Jabatan / Keahlian.
   c. Tunjangan Tidak Tetap (Variable Allowance): Tunjangan Kehadiran / Transport / Makan berdasarkan absensi.
2. Besaran Upah Pokok ditetapkan minimal 75% (tujuh puluh lima persen) dari jumlah Upah Pokok dan Tunjangan Tetap.
3. Perusahaan menyusun dan memberlakukan Struktur dan Skala Upah (SUSU) sebagai pedoman penetapan upah berkeadilan berdasarkan kompetensi, jabatan, dan masa kerja.`
      },
      {
        number: 10,
        title: 'Tata Cara Pembayaran Upah dan Pajak',
        legalReference: 'Pasal 53 PP No. 36 Tahun 2021',
        hrImplementationNote: 'Gaji dibayarkan via transfer bank resmi dengan bukti slip gaji digital/cetak.',
        content: `1. Pembayaran upah dilakukan secara teratur setiap 1 (satu) bulan sekali pada tanggal 25 (dua puluh lima) setiap bulannya melalui transfer rekening bank atas nama Pekerja.
2. Apabila tanggal pembayaran upah jatuh pada hari libur resmi atau hari libur perbankan, maka pembayaran dilakukan pada hari kerja sebelumnya.
3. Perusahaan memotong Pajak Penghasilan (PPh Pasal 21) dan iuran wajib Jaminan Sosial dari upah Pekerja sesuai regulasi perpajakan yang berlaku.`
      },
      {
        number: 11,
        title: 'Tunjangan Hari Raya (THR) Keagamaan',
        legalReference: 'Permenaker No. 6 Tahun 2016',
        hrImplementationNote: 'Wajib dibayarkan paling lambat H-7 hari raya dalam bentuk uang tunai/transfer.',
        content: `1. Perusahaan wajib memberikan THR Keagamaan kepada Pekerja yang telah memiliki masa kerja minimal 1 (satu) bulan secara terus menerus.
2. Besaran THR Keagamaan:
   a. Masa kerja 12 bulan terus-menerus: 1 (satu) bulan upah (Upah Pokok + Tunjangan Tetap).
   b. Masa kerja 1 s/d kurang dari 12 bulan: Dihitung proporsional (Masa Kerja / 12) x 1 Bulan Upah.
3. THR Keagamaan dibayarkan paling lambat 7 (tujuh) hari sebelum Hari Raya Keagamaan yang bersangkutan.`
      }
    ]
  },
  {
    id: 'bab-5',
    chapterNumber: 'BAB V',
    title: 'JAMINAN SOSIAL KETENAGAKERJAAN, KESEHATAN & K3',
    description: 'Kepesertaan BPJS Ketenagakerjaan (JKK, JKM, JHT, JP, JKP), BPJS Kesehatan, perlindungan Keselamatan dan Kesehatan Kerja (K3), serta fasilitas P3K.',
    articles: [
      {
        number: 12,
        title: 'Kepesertaan BPJS Kesehatan dan Ketenagakerjaan',
        legalReference: 'UU No. 24 Tahun 2011 tentang BPJS',
        hrImplementationNote: 'Iuran dibayarkan tepat waktu paling lambat tanggal 10 dan 15 setiap bulan.',
        content: `1. Perusahaan mendaftarkan seluruh Pekerja dalam program jaminan sosial:
   a. BPJS Kesehatan untuk jaminan pemeliharaan kesehatan Pekerja beserta anggota keluarga yang sah.
   b. BPJS Ketenagakerjaan mencakup: Jaminan Kecelakaan Kerja (JKK), Jaminan Kematian (JKM), Jaminan Hari Tua (JHT), Jaminan Pensiun (JP), dan Jaminan Kehilangan Pekerjaan (JKP).
2. Pembayaran iuran jaminan sosial dibagi antara Perusahaan dan Pekerja sesuai dengan persentase dan batasan upah yang diatur oleh peraturan perundang-undangan.`
      },
      {
        number: 13,
        title: 'Keselamatan dan Kesehatan Kerja (K3)',
        legalReference: 'UU No. 1 Tahun 1970 tentang Keselamatan Kerja',
        hrImplementationNote: 'Menyediakan APD yang sesuai standar dan membentuk Tim Tanggap Darurat K3.',
        content: `1. Perusahaan berkomitmen menyediakan lingkungan kerja yang aman, higienis, dan sehat bebas dari potensi bahaya kecelakaan kerja.
2. Pekerja wajib menaati prosedur K3, menggunakan Alat Pelindung Diri (APD) yang disediakan, serta segera melaporkan potensi bahaya atau insiden kepada tim K3/Atasan.
3. Perusahaan menyediakan fasilitas Pertolongan Pertama Pada Kecelakaan (P3K) di setiap lantai dan lokasi kerja operasional.`
      }
    ]
  },
  {
    id: 'bab-6',
    chapterNumber: 'BAB VI',
    title: 'HAK CUTI, ISTIRAHAT & IZIN MENINGGALKAN PEKERJAAN',
    description: 'Cuti tahunan 12 hari kerja, cuti sakit dengan surat dokter, cuti melahirkan/keguguran (UU KIA No. 4/2024), cuti haid, serta izin resmi khusus berbayar.',
    articles: [
      {
        number: 14,
        title: 'Cuti Tahunan',
        legalReference: 'Pasal 79 UU No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023',
        hrImplementationNote: 'Cuti tahunan dapat diambil setelah masa kerja 12 bulan terus-menerus.',
        content: `1. Pekerja berhak atas Cuti Tahunan sebanyak 12 (dua belas) hari kerja setelah bekerja selama 12 (dua belas) bulan secara terus menerus pada Perusahaan.
2. Pengajuan cuti tahunan diajukan secara tertulis atau melalui aplikasi HR minimal 3 (tiga) hari kerja sebelumnya dan wajib memperoleh persetujuan Atasan Langsung.
3. Cuti bersama yang ditetapkan pemerintah yang diikuti oleh Perusahaan akan memotong hak cuti tahunan Pekerja.`
      },
      {
        number: 15,
        title: 'Cuti Sakit, Cuti Haid & Cuti Melahirkan',
        legalReference: 'Pasal 81, 82, 93 UU No. 13/2003 jo. UU No. 4 Tahun 2024 (UU KIA)',
        hrImplementationNote: 'Cuti melahirkan standar 3 bulan dan dapat diperpanjang atas indikasi medis sesuai UU KIA.',
        content: `1. Cuti Sakit: Pekerja yang tidak masuk kerja karena sakit berhak atas upah penuh dengan menyerahkan Surat Keterangan Sakit resmi dari dokter pada hari pertama masuk kerja kembali.
2. Cuti Haid: Pekerja perempuan yang merasakan sakit pada hari pertama dan kedua masa haid berhak atas cuti haid dengan pemberitahuan kepada Perusahaan.
3. Cuti Melahirkan: Pekerja perempuan berhak atas cuti melahirkan selama 3 (tiga) bulan (1,5 bulan sebelum dan 1,5 bulan setelah melahirkan) dengan upah dibayar penuh.
4. Sesuai UU No. 4 Tahun 2024 (KIA), cuti melahirkan dapat diperpanjang hingga maksimal 6 (enam) bulan jika terdapat kondisi medis khusus yang dibuktikan dengan surat keterangan dokter.`
      },
      {
        number: 16,
        title: 'Izin Khusus Resmi dengan Upah Penuh',
        legalReference: 'Pasal 93 ayat (4) UU No. 13 Tahun 2003',
        hrImplementationNote: 'Izin resmi ini tidak memotong kuota Cuti Tahunan karyawan.',
        content: `Pekerja berhak mendapatkan izin tidak bekerja dengan tetap menerima upah penuh untuk keperluan sebagai berikut:
a. Pernikahan Pekerja sendiri: 3 (tiga) hari kerja.
b. Pernikahan anak kandung Pekerja: 2 (dua) hari kerja.
c. Khitanan / Pembaptisan anak kandung: 2 (dua) hari kerja.
d. Istri sah melahirkan atau keguguran kandungan: 2 (dua) hari kerja (dapat disesuaikan pendampingan UU KIA).
e. Suami/Istri, Orang Tua/Mertua, atau Anak/Menantu meninggal dunia: 2 (dua) hari kerja.
f. Anggota keluarga dalam satu rumah meninggal dunia: 1 (satu) hari kerja.
g. Melaksanakan kewajiban ibadah keagamaan yang diwajibkan (misal: Ibadah Haji pertama kali): Sesuai jadwal resmi.`
      }
    ]
  },
  {
    id: 'bab-7',
    chapterNumber: 'BAB VII',
    title: 'TATA TERTIB, KODE ETIK & KEWAJIBAN KARYAWAN',
    description: 'Kewajiban disiplin kerja, presensi harian, kerahasiaan informasi (NDA), perlindungan data pribadi, larangan gratifikasi, serta kebijakan anti-pelecehan di tempat kerja.',
    articles: [
      {
        number: 17,
        title: 'Kewajiban Pokok dan Disiplin Kerja',
        legalReference: 'Pasal 126 UU No. 13 Tahun 2003',
        hrImplementationNote: 'Presensi wajib dilakukan mandiri tanpa titip absen (fraud).',
        content: `1. Setiap Pekerja wajib hadir tepat waktu dan melakukan pencatatan presensi kehadiran (clock-in & clock-out) secara mandiri.
2. Melaksanakan tugas dan tanggung jawab pekerjaan dengan penuh integritas, ketelitian, loyalitas, dan dedikasi terbaik bagi Perusahaan.
3. Menjaga dan memelihara seluruh inventaris aset milik Perusahaan (laptop, perangkat kerja, kendaraan, dokumen) serta dilarang menyalahgunakannya untuk kepentingan pribadi.`
      },
      {
        number: 18,
        title: 'Kerahasiaan Informasi dan Perlindungan Data (NDA)',
        legalReference: 'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)',
        hrImplementationNote: 'Pelanggaran data rahasia/source code dapat diproses pidana dan perdata.',
        content: `1. Pekerja dilarang membocorkan, menyebarluaskan, atau membagikan data rahasia perusahaan, source code, rahasia dagang, strategi bisnis, atau data pribadi klien/karyawan kepada pihak ketiga.
2. Kewajiban menjaga kerahasiaan informasi ini tetap berlaku mengikat secara hukum meskipun hubungan kerja Pekerja dengan Perusahaan telah berakhir.`
      },
      {
        number: 19,
        title: 'Kebijakan Anti-Pelecehan dan Tempat Kerja Inklusif',
        legalReference: 'UU No. 12 Tahun 2022 tentang TPKS & Permenaker No. 88 Tahun 2023',
        hrImplementationNote: 'Zero tolerance terhadap pelecehan seksual, perundungan (bullying), dan kekerasan verbal.',
        content: `1. Perusahaan menerapkan kebijakan tanpa toleransi (zero tolerance) terhadap segala bentuk perundungan (bullying), intimidasi, pelecehan seksual, dan diskriminasi di tempat kerja.
2. Setiap laporan dugaan pelecehan akan diproses secara rahasia melalui Tim Satgas Pencegahan & Penanganan Kekerasan dengan perlindungan penuh bagi saksi dan korban.`
      }
    ]
  },
  {
    id: 'bab-8',
    chapterNumber: 'BAB VIII',
    title: 'PELANGGARAN DISIPLIN, TATA CARA PEMERIKSAAN & SANKSI (SP)',
    description: 'Tingkatan sanksi disiplin (Teguran Lisan, SP 1, SP 2, SP 3, Skorsing), masa berlaku SP 6 bulan, hak pembelaan pekerja, dan berita acara klarifikasi.',
    articles: [
      {
        number: 20,
        title: 'Tingkatan dan Jenis Sanksi Disiplin',
        legalReference: 'Pasal 161 UU No. 13 Tahun 2003 jo. PP No. 35 Tahun 2021',
        hrImplementationNote: 'Masa berlaku SP adalah 6 bulan dan gugur otomatis jika tidak ada pelanggaran baru.',
        content: `1. Tindakan disiplin diberikan terhadap Pekerja yang melanggar Peraturan Perusahaan dengan tingkatan:
   a. Teguran Lisan / Surat Peringatan Lisan Tercatat.
   b. Surat Peringatan Pertama (SP 1).
   c. Surat Peringatan Kedua (SP 2).
   d. Surat Peringatan Ketiga / Terakhir (SP 3).
2. Masa berlaku masing-masing Surat Peringatan (SP 1, SP 2, SP 3) adalah 6 (enam) bulan terhitung sejak tanggal diterbitkan.
3. Apabila dalam kurun waktu 6 bulan masa berlaku SP pekerja kembali melakukan pelanggaran, Perusahaan berhak menerbitkan SP tingkat berikutnya.`
      },
      {
        number: 21,
        title: 'Klasifikasi Pelanggaran Ringan, Sedang dan Berat',
        legalReference: 'Pasal 52 PP No. 35 Tahun 2021',
        hrImplementationNote: 'Pelanggaran berat yang menimbulkan kerugian fatal dapat langsung dikenakan SP3 atau PHK.',
        content: `1. Pelanggaran Ringan (Teguran / SP 1): Keterlambatan hadir berulang tanpa izin, tidak memakai tanda pengenal, meninggalkan meja kerja tanpa izin atasan.
2. Pelanggaran Sedang (SP 2): Mengabaikan SOP kerja yang mengakibatkan kendala operasional, menolak perintah kerja wajar dari atasan, mangkir kerja 2 hari berturut-turut tanpa keterangan sah.
3. Pelanggaran Berat (SP 3 / PHK): Melakukan penipuan, pencurian, penggelapan uang/aset perusahaan, memalsukan dokumen, mabuk/menggunakan narkoba di tempat kerja, melakukan tindakan kekerasan atau pelecehan seksual.`
      },
      {
        number: 22,
        title: 'Tata Cara Klarifikasi dan Hak Pembelaan',
        legalReference: 'Pasal 136 UU No. 13 Tahun 2003',
        hrImplementationNote: 'Selalu terbitkan Berita Acara Pemeriksaan (BAP) sebelum menerbitkan Surat Peringatan.',
        content: `1. Sebelum sanksi SP diterbitkan, Departemen HR bersama Atasan Langsung wajib memanggil Pekerja untuk melakukan klarifikasi (Bipartit Internal).
2. Hasil klarifikasi dituangkan dalam Berita Acara Pemeriksaan (BAP) yang ditandatangani oleh kedua belah pihak.
3. Pekerja berhak memberikan keterangan, bukti pendukung, dan pembelaan diri atas dugaan pelanggaran yang disangkakan.`
      }
    ]
  },
  {
    id: 'bab-9',
    chapterNumber: 'BAB IX',
    title: 'PEMUTUSAN HUBUNGAN KERJA (PHK) & PENYELESAIAN HAK',
    description: 'Alasan-alasan pengakhiran hubungan kerja, masa pemberitahuan 14 hari, serta formula perhitungan Uang Pesangon (UP), UPMK, UPH, dan Kompensasi PKWT.',
    articles: [
      {
        number: 23,
        title: 'Alasan Pengakhiran Hubungan Kerja',
        legalReference: 'Pasal 36 s/d Pasal 59 PP No. 35 Tahun 2021',
        hrImplementationNote: 'Perusahaan wajib memberitahukan maksud PHK minimal 14 hari kerja sebelumnya.',
        content: `Hubungan kerja antara Perusahaan dan Pekerja dapat berakhir karena alasan:
a. Berakhirnya jangka waktu Perjanjian Kerja Waktu Tertentu (PKWT).
b. Pengunduran diri sukarela (Resign) oleh Pekerja dengan pemberitahuan tertulis minimal 30 (tiga puluh) hari sebelumnya (one-month notice).
c. Pekerja mencapai usia pensiun normal yang ditetapkan Perusahaan (56 - 58 tahun).
d. Perusahaan melakukan efisiensi, restrukturisasi organisasi, atau penggabungan usaha.
e. Pekerja meninggal dunia.
f. Pekerja melakukan pelanggaran setelah diberikan SP 3 atau melakukan pelanggaran mendesak/berat.`
      },
      {
        number: 24,
        title: 'Penyelesaian Hak Finansial Pesangon & Kompensasi',
        legalReference: 'Pasal 40 s/d Pasal 59 PP No. 35 Tahun 2021',
        hrImplementationNote: 'Gunakan kalkulator regulasi HRMatrix untuk menghitung komponen pesangon sesuai faktor pengali.',
        content: `1. Pada saat berakhirnya hubungan kerja, Perusahaan membayarkan hak finansial sesuai dengan jenis alasan pengakhiran hubungan kerja:
   a. Uang Pesangon (UP) sesuai tabel masa kerja Pasal 40 ayat (2) PP 35/2021.
   b. Uang Penghargaan Masa Kerja (UPMK) sesuai tabel masa kerja Pasal 40 ayat (3) PP 35/2021.
   c. Uang Penggantian Hak (UPH) untuk cuti tahunan yang belum gugur dan ongkos kepulangan.
   d. Uang Kompensasi PKWT secara proporsional sesuai Pasal 16 PP 35/2021.
2. Seluruh pembayaran hak finansial ditransfer ke rekening Pekerja pada hari kerja terakhir atau sesuai tanggal kesepakatan tertulis dalam Perjanjian Bersama (PB).`
      },
      {
        number: 25,
        title: 'Surat Pengalaman Kerja (Paklaring) dan Serah Terima Aset',
        legalReference: 'Pasal 1603t KUHPerdata',
        hrImplementationNote: 'Paklaring wajib diterbitkan jika pekerja meminta setelah menyelesaikan kewajiban serah terima aset.',
        content: `1. Sebelum menerima hak penyelesaian akhir, Pekerja wajib menyelesaikan seluruh proses serah terima pekerjaan (handover) dan mengembalikan seluruh aset milik Perusahaan.
2. Perusahaan wajib menerbitkan Surat Keterangan / Pengalaman Kerja (Paklaring) resmi yang memuat nama, jabatan terakhir, dan masa kerja Pekerja.`
      }
    ]
  },
  {
    id: 'bab-10',
    chapterNumber: 'BAB X',
    title: 'PENYELESAIAN KELUH KESAH & PERSELISIHAN HUBUNGAN INDUSTRIAL',
    description: 'Mekanisme penanganan keluh kesah pekerja, tahapan perundingan bipartit internal, mediasi dinas ketenagakerjaan (Tripartit), dan Pengadilan Hubungan Industrial (PHI).',
    articles: [
      {
        number: 26,
        title: 'Prosedur Penyampaian Keluh Kesah Karyawan',
        legalReference: 'UU No. 2 Tahun 2004 tentang PPHI',
        hrImplementationNote: 'Selesaikan keluhan di tingkat atasan langsung dan HR terlebih dahulu sebelum eskalasi.',
        content: `1. Pekerja yang memiliki keluhan mengenai kondisi kerja, perlakuan atasan, atau hak normatif dapat menyampaikan secara lisan atau tertulis kepada Atasan Langsung.
2. Apabila dalam waktu 7 (tujuh) hari kerja belum terselesaikan, Pekerja dapat meneruskan keluhan kepada Departemen Human Resources (HR).
3. Departemen HR akan memfasilitasi pertemuan mediasi internal untuk mencari solusi mufakat yang adil.`
      },
      {
        number: 27,
        title: 'Penyelesaian Perselisihan Melalui Bipartit dan Tripartit',
        legalReference: 'Pasal 3 s/d Pasal 14 UU No. 2 Tahun 2004',
        hrImplementationNote: 'Perundingan Bipartit wajib dilakukan maksimal 30 hari kerja.',
        content: `1. Segala perselisihan hubungan industrial (perselisihan hak, perselisihan kepentingan, perselisihan PHK) wajib diselesaikan terlebih dahulu melalui musyawarah Bipartit antara Pengusaha dan Pekerja.
2. Perundingan Bipartit diselesaikan dalam jangka waktu paling lama 30 (tiga puluh) hari kerja sejak tanggal dimulainya perundingan.
3. Apabila perundingan Bipartit mencapai kesepakatan, maka dibuat Perjanjian Bersama (PB) yang didaftarkan ke Pengadilan Hubungan Industrial (PHI).
4. Apabila Bipartit gagal, salah satu pihak dapat mencatatkan perselisihan kepada Dinas Ketenagakerjaan setempat untuk proses Mediasi Tripartit.`
      }
    ]
  },
  {
    id: 'bab-11',
    chapterNumber: 'BAB XI',
    title: 'KETENTUAN PENUTUP, PENGESAHAN & MASA BERLAKU',
    description: 'Masa berlaku Peraturan Perusahaan selama 2 (dua) tahun, kewajiban sosialisasi dan pembagian salinan kepada seluruh pekerja, serta pengesahan pejabat Disnaker.',
    articles: [
      {
        number: 28,
        title: 'Masa Berlaku Peraturan Perusahaan',
        legalReference: 'Pasal 111 ayat (1) UU No. 13 Tahun 2003',
        hrImplementationNote: 'Masa berlaku maksimal 2 tahun dan wajib diperbarui sebelum habis masa berlakunya.',
        content: `1. Peraturan Perusahaan ini berlaku untuk jangka waktu 2 (dua) tahun terhitung sejak tanggal disahkan oleh Dinas Tenaga Kerja yang berwenang.
2. Paling lambat 3 (tiga) bulan sebelum berakhirnya masa berlaku Peraturan Perusahaan ini, Perusahaan wajib mengajukan permohonan pembaharuan kepada Dinas Tenaga Kerja.`
      },
      {
        number: 29,
        title: 'Sosialisasi dan Pembagian Naskah kepada Pekerja',
        legalReference: 'Pasal 114 UU No. 13 Tahun 2003',
        hrImplementationNote: 'Simpan tanda terima pembagian buku PP / akses digital sebagai bukti kepatuhan audit Disnaker.',
        content: `1. Perusahaan wajib memberitahukan dan menjelaskan isi serta membagikan naskah Peraturan Perusahaan atau salinan digitalnya kepada setiap Pekerja.
2. Setiap Pekerja wajib membaca, memahami, dan mematuhi seluruh ketentuan yang termuat dalam Peraturan Perusahaan ini.`
      }
    ]
  }
];
