import React from 'react';
import { 
  SivilLogo, 
  NisnLogo,
  BNSPLogo, 
  SLIKLogo, 
  DukcapilLogo, 
  SKCKLogo, 
  DJPLogo, 
  SIPPMALogo, 
  KKILogo 
} from '../../components/e-portal/PortalLogos';

export type CheckingCategory = 'akademik' | 'finansial' | 'identitas' | 'hukum';

export interface CheckingStepGuide {
  step: number;
  title: string;
  desc: string;
  tip?: string;
}

export interface CheckingStatusMeaning {
  status: string;
  label: string;
  meaning: string;
  badgeClass: string;
}

export interface CheckingToolMeta {
  id: string;
  name: string;
  shortName: string;
  category: CheckingCategory;
  categoryLabel: string;
  tagline: string;
  officialUrl: string;
  logoKey: string;
  logo: React.ReactNode;
  instansi: string;
  dasarHukum: string;
  targetVerifikasi: string;
  urgensi: string;
  callCenter: string;
  callCenterHours: string;
  deskripsi: string;
  keywords: string[];
  guide: {
    ringkasan: string;
    tataCara: CheckingStepGuide[];
    dokumenWajib: string[];
    statusValidasi: CheckingStatusMeaning[];
    catatanKepatuhan: string;
  };
}

export const CHECKING_TOOLS_CONFIG: Record<string, CheckingToolMeta> = {
  // 1. SIVIL / PDDikti (Ijazah Perguruan Tinggi: S1, S2, S3, D3, D4)
  sivil: {
    id: 'sivil',
    name: 'SIVIL Kemdiktisaintek (Ijazah Perguruan Tinggi & PDDikti)',
    shortName: 'Ijazah PT (S1/D3)',
    category: 'akademik',
    categoryLabel: 'Akademik & Pendidikan',
    tagline: 'Verifikasi Ijazah Sarjana & Diploma via Pangkalan Data Perguruan Tinggi (PDDikti)',
    officialUrl: 'https://pddikti.kemdiktisaintek.go.id/',
    logoKey: 'sivil',
    logo: <SivilLogo className="w-5 h-5" />,
    instansi: 'Kementerian Pendidikan Tinggi, Sains, dan Teknologi RI',
    dasarHukum: 'UU No. 12 Tahun 2012 tentang Pendidikan Tinggi & Permenristekdikti No. 59 Tahun 2018',
    targetVerifikasi: 'Nomor Seri Ijazah Nasional (NINA), NIM mahasiswa, Program Studi, Jenjang (D3/D4/S1/S2/S3) & Perguruan Tinggi terakreditasi.',
    urgensi: 'Sangat Tinggi (Wajib untuk semua level posisi Sarjana/Diploma/Spesialis)',
    callCenter: '126 (Pusat Panggilan Kemdiktisaintek) / pddikti@kemdikbud.go.id',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Portal resmi pemerintah Republik Indonesia untuk memastikan keaslian lembar ijazah perguruan tinggi (universitas, institut, politeknik, sekolah tinggi), riwayat studi mahasiswa pada pangkalan data nasional (PDDikti), serta mencegah penggunaan ijazah palsu atau kampus tidak berizin.',
    keywords: ['sivil', 'ijazah pt', 'perguruan tinggi', 'pddikti', 'kemdiktisaintek', 'kampus', 'universitas', 'gelar', 'wisuda', 'sarjana', 'diploma', 's1', 's2', 'd3'],
    guide: {
      ringkasan: 'Layanan terpusat untuk memverifikasi keabsahan lembar ijazah sarjana dan diploma calon karyawan langsung ke pangkalan data perguruan tinggi nasional.',
      tataCara: [
        {
          step: 1,
          title: 'Kumpulkan Dokumen Ijazah Asli / Scan',
          desc: 'Minta salinan scan ijazah beresolusi tinggi dari pelamar. Pastikan Nomor Ijazah Nasional (NINA) atau nomor seri perguruan tinggi terlihat jelas.',
          tip: 'Periksa pula nama perguruan tinggi, fakultas, dan program studi sesuai akreditasi BAN-PT saat tahun kelulusan.'
        },
        {
          step: 2,
          title: 'Input Data ke Form Pencarian PDDikti / SIVIL',
          desc: 'Ketik nama perguruan tinggi (akan muncul dropdown resmi), pilih program studi, lalu masukkan Nomor Ijazah calon karyawan dan selesaikan captcha.',
          tip: 'Bila nomor ijazah belum menggunakan format nasional NINA, gunakan opsi pencarian manual via PDDikti menggunakan NIM dan nama lengkap.'
        },
        {
          step: 3,
          title: 'Periksa Kesesuaian Hasil Pencarian',
          desc: 'Sistem akan menampilkan nama mahasiswa, nomor pokok mahasiswa (NIM), nomor ijazah, tanggal kelulusan, dan status "LULUS".',
          tip: 'Pastikan nama dan tanggal lahir yang tertera cocok 100% dengan KTP pelamar.'
        }
      ],
      dokumenWajib: [
        'Scan Asli Ijazah Terakhir (S1/S2/S3/D3/D4)',
        'Nomor Induk Mahasiswa (NIM)',
        'Transkrip Nilai Akademik Resmi'
      ],
      statusValidasi: [
        { status: 'VERIFIED', label: 'Ditemukan / Terverifikasi', meaning: 'Ijazah sah, terdaftar di PDDikti dan diterbitkan oleh kampus berizin resmi.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'PENDING_PDDIKTI', label: 'Data Belum Terlapor', meaning: 'Ijazah kemungkinan diterbitkan sebelum tahun 2003 atau belum disinkronkan oleh pihak kampus (perlu surat keterangan kampus).', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'UNREGISTERED', label: 'Tidak Ditemukan', meaning: 'Nomor ijazah tidak terdaftar di database nasional; waspadai indikasi ijazah tidak resmi.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Sesuai UU No. 12 Tahun 2012 Pasal 28 ayat (6) & (7), penggunaan gelar akademik atau ijazah palsu dikenakan sanksi pidana penjara paling lama 10 tahun dan/atau denda paling banyak Rp 1.000.000.000,00.'
    }
  },

  // 2. NISN Kemdikbud (Ijazah SD, SMP, SMA, SMK)
  nisn: {
    id: 'nisn',
    name: 'NISN Kemdikbud (Ijazah SD, SMP, SMA & SMK)',
    shortName: 'Ijazah SD-SMA (NISN)',
    category: 'akademik',
    categoryLabel: 'Akademik & Pendidikan',
    tagline: 'Pengecekan Nomor Induk Siswa Nasional & Validasi Ijazah Sekolah Dasar-Menengah',
    officialUrl: 'https://nisn.data.kemdikbud.go.id/',
    logoKey: 'nisn',
    logo: <NisnLogo className="w-5 h-5" />,
    instansi: 'Kementerian Pendidikan Dasar dan Menengah RI / Pusdatin Kemdikbud',
    dasarHukum: 'Permendikbud No. 1 Tahun 2021 & Juknis Pengelolaan Ijazah dan Sertifikasi Dikdasmen',
    targetVerifikasi: 'Nomor Induk Siswa Nasional (10 Digit NISN), NPSN Sekolah Asal, Nama Siswa, Tanggal Lahir, Nama Ibu Kandung & Kode Blanko Ijazah (DN/LN).',
    urgensi: 'Tinggi (Wajib untuk posisi Operator Produksi, Driver, Sekuriti, Teknisi Lapangan & Lulusan SMA/SMK)',
    callCenter: 'Pusat Panggilan Kemdikbud 177 / pengaduan@kemdikbud.go.id',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Portal resmi pencarian dan validasi data identitas siswa nasional sepanjang hayat untuk memastikan keabsahan lembar ijazah kelulusan SD, SMP, SMA, dan SMK di seluruh Indonesia berdasarkan pangkalan data Dapodik dan Pusdatin.',
    keywords: ['nisn', 'ijazah sma', 'ijazah smk', 'ijazah smp', 'ijazah sd', 'sekolah', 'dapodik', 'kemdikbud', 'kemendikdasmen', 'pusdatin', 'siswa', 'sma', 'smk'],
    guide: {
      ringkasan: 'Verifikasi keabsahan lembar ijazah tingkat pendidikan dasar dan menengah (SD, SMP, SMA, SMK) melalui pencocokan 10 digit NISN dan database Dapodik Pusdatin.',
      tataCara: [
        {
          step: 1,
          title: 'Kumpulkan Ijazah Asli & Kartu Keluarga (KK)',
          desc: 'Periksa fisik lembar ijazah sekolah: kertas berpola pengaman khusus, logo Tut Wuri Handayani, cap stempel basah sekolah, dan nomor seri blanko ijazah (contoh: DN-01/M-SMA/13/0000001).',
          tip: 'Nomor kode provinsi: DN-01 (DKI Jakarta), DN-02 (Jawa Barat), DN-03 (Jawa Tengah), DN-04 (DI Yogyakarta), DN-05 (Jawa Timur), dst.'
        },
        {
          step: 2,
          title: 'Akses Portal Pencarian NISN Kemdikbud',
          desc: 'Buka menu Pencarian Nama di portal nisn.data.kemdikbud.go.id. Masukkan Nama Lengkap Siswa, Tempat Lahir, Tanggal Lahir, dan Nama Ibu Kandung sesuai KTP/KK.',
          tip: 'Pastikan ejaan nama ibu kandung persis dengan yang tercantum pada Kartu Keluarga (KK) pelamar.'
        },
        {
          step: 3,
          title: 'Cocokkan 10 Digit Nomor NISN & NPSN Sekolah',
          desc: 'Sistem akan menampilkan 10 digit NISN aktif, nama sekolah asal, status keaktifan peserta didik, dan NPSN (Nomor Pokok Sekolah Nasional).',
          tip: 'Tiga digit pertama NISN mencerminkan tahun kelahiran siswa (contoh: 004xxxxxxx berarti lahir tahun 2004).'
        }
      ],
      dokumenWajib: [
        'Scan Asli Ijazah SD/SMP/SMA/SMK Berwarna',
        'Salinan Kartu Keluarga (KK) untuk validasi nama ibu kandung',
        'Scan Transkrip Nilai / SKHUN Sekolah'
      ],
      statusValidasi: [
        { status: 'VERIFIED', label: 'NISN Aktif Terdata di Dapodik', meaning: 'Data siswa dan ijazah valid, terdaftar resmi di pangkalan data nasional Kemdikbud.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'PENDING_VERVAL', label: 'Perlu VerVal Ijazah Sekolah', meaning: 'NISN terdaftar namun data sekolah asal telah berganti nama atau merger, perlu konfirmasi pihak sekolah.', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'NOT_FOUND', label: 'NISN Tidak Ditemukan', meaning: 'Nomor NISN atau kombinasi nama + ibu kandung tidak cocok; waspadai indikasi ijazah tidak resmi.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Berdasarkan Permendikbud No. 1/2021, pemalsuan lembar ijazah atau penggunaan blanko ijazah tanpa izin merupakan tindak pidana pemalsuan surat otentik (Pasal 263 dan 264 KUHP) dengan ancaman hukuman penjara hingga 8 tahun.'
    }
  },

  // 2. Sertifikasi BNSP (Badan Nasional Sertifikasi Profesi)
  bnsp: {
    id: 'bnsp',
    name: 'Sertifikasi BNSP (Badan Nasional Sertifikasi Profesi)',
    shortName: 'Sertifikasi BNSP',
    category: 'akademik',
    categoryLabel: 'Akademik & Pendidikan',
    tagline: 'Verifikasi Sertifikat Kompetensi Kerja Nasional Indonesia (SKKNI)',
    officialUrl: 'https://bnsp.go.id/',
    logoKey: 'bnsp',
    logo: <BNSPLogo className="w-5 h-5" />,
    instansi: 'Badan Nasional Sertifikasi Profesi (BNSP RI)',
    dasarHukum: 'PP No. 10 Tahun 2018 tentang Badan Nasional Sertifikasi Profesi',
    targetVerifikasi: 'Nomor Sertifikat Kompetensi, Lembaga Sertifikasi Profesi (LSP), skema kompetensi & masa berlaku (3-5 tahun).',
    urgensi: 'Tinggi (Khusus staf profesional bersertifikasi, Ahli K3, Auditor, HR Manager, IT & Keuangan)',
    callCenter: '(021) 7992685 / info@bnsp.go.id',
    callCenterHours: 'Senin - Jumat: 08.30 - 16.30 WIB',
    deskripsi: 'Database registrasi pemegang sertifikat kompetensi profesi berstandar nasional dan internasional di Indonesia yang diterbitkan oleh Lembaga Sertifikasi Profesi (LSP) terlisensi resmi BNSP.',
    keywords: ['bnsp', 'sertifikasi', 'skkni', 'kompetensi', 'ahli k3', 'lsp', 'profesi', 'asesor', 'sertifikat kerja'],
    guide: {
      ringkasan: 'Verifikasi keabsahan sertifikat profesi berstandar SKKNI untuk memastikan calon pekerja telah lulus uji kompetensi resmi.',
      tataCara: [
        {
          step: 1,
          title: 'Periksa Lembar Sertifikat BNSP',
          desc: 'Periksa nomor registrasi kompetensi pada sertifikat fisik atau digital dengan lambang burung garuda berlatar merah.',
          tip: 'Catat nama LSP penerbit sertifikat, nomor seri sertifikat, dan tanggal kedaluwarsa uji kompetensi.'
        },
        {
          step: 2,
          title: 'Cek Database Sertifikasi BNSP',
          desc: 'Masukkan nomor registrasi sertifikat atau nama lengkap kandidat pada kolom pencarian sertifikat kompetensi BNSP.',
          tip: 'Periksa apakah nama skema sertifikasi sesuai dengan deskripsi keahlian yang tercantum pada CV/resume pelamar.'
        },
        {
          step: 3,
          title: 'Validasi Masa Berlaku Sertifikat',
          desc: 'Sertifikat BNSP umumnya berlaku 3 sampai 5 tahun. Pastikan sertifikat masih aktif atau pelamar sedang dalam proses resertifikasi.',
          tip: 'Jika masa berlaku telah kedaluwarsa, mintalah portofolio uji ulang kompetensi terkini.'
        }
      ],
      dokumenWajib: [
        'Scan Sertifikat Kompetensi BNSP Berwarna',
        'Nomor Registrasi Sertifikat Profesi',
        'Nama Lembaga Sertifikasi Profesi (LSP) Penguji'
      ],
      statusValidasi: [
        { status: 'ACTIVE', label: 'Aktif & Terdaftar', meaning: 'Sertifikat terdaftar di BNSP dan masa berlakunya masih aktif.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'EXPIRED', label: 'Kedaluwarsa (Expired)', meaning: 'Pernah terdaftar namun masa berlaku 3/5 tahun telah habis.', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'NOT_FOUND', label: 'Nomor Tidak Valid', meaning: 'Nomor sertifikat tidak ditemukan pada direktori LSP resmi BNSP.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Pastikan sertifikat diterbitkan oleh LSP berlisensi resmi BNSP sesuai bidang kejuruan yang diatur dalam Permenaker terkait standar SKKNI.'
    }
  },

  // 3. SLIK OJK (iDebKu - Sistem Layanan Informasi Keuangan)
  slik: {
    id: 'slik',
    name: 'SLIK OJK / iDebKu (Sistem Layanan Informasi Keuangan)',
    shortName: 'SLIK OJK (iDebKu)',
    category: 'finansial',
    categoryLabel: 'Finansial & Keuangan',
    tagline: 'Cek Riwayat Kredit, Kolektibilitas & Integritas Finansial Calon Karyawan',
    officialUrl: 'https://idebku.ojk.go.id/',
    logoKey: 'slik',
    logo: <SLIKLogo className="w-5 h-5" />,
    instansi: 'Otoritas Jasa Keuangan (OJK Republik Indonesia)',
    dasarHukum: 'POJK No. 18/POJK.03/2017 & POJK No. 64/POJK.03/2020 tentang Pelaporan dan Permintaan Informasi Debitur',
    targetVerifikasi: 'Tingkat Kolektibilitas Kredit (Kol 1 Lancar s.d. Kol 5 Macet), baki debet, status restrukturisasi & pinjaman aktif.',
    urgensi: 'Sangat Tinggi (Wajib untuk posisi Finance, Kasir, Purchasing, Auditor, C-Level, & Legal)',
    callCenter: 'Kontak OJK 157 / konsumen@ojk.go.id',
    callCenterHours: 'Senin - Jumat: 08.00 - 17.00 WIB',
    deskripsi: 'Sistem Layanan Informasi Keuangan (dahulu BI Checking) untuk meneliti catatan kelancaran pembayaran fasilitas kredit atau pembiayaan perbankan dan fintech resmi yang diajukan oleh calon tenaga kerja.',
    keywords: ['slik', 'idebku', 'ojk', 'bi checking', 'kredit', 'kolektibilitas', 'pinjaman', 'keuangan', 'finance', 'integritas'],
    guide: {
      ringkasan: 'Pemeriksaan riwayat pinjaman perbankan dan lembaga pembiayaan resmi untuk posisi yang mengelola aset finansial atau kas perusahaan.',
      tataCara: [
        {
          step: 1,
          title: 'Dapatkan Surat Kuasa / Persetujuan Tertulis (Consent)',
          desc: 'Berdasarkan regulasi OJK & UU Perlindungan Data Pribadi (UU PDP), pemeriksaan informasi debitur memerlukan persetujuan eksplisit dari calon karyawan.',
          tip: 'Pelamar dapat diminta mengunduh sendiri hasil iDeb SLIK resmi via portal idebku.ojk.go.id dan menyerahkan hasil PDF resminya.'
        },
        {
          step: 2,
          title: 'Verifikasi Keaslian Dokumen iDeb OJK',
          desc: 'Periksa QR Code digital signature pada lembar iDeb OJK yang diberikan oleh pelamar untuk memvalidasi tanggal cetak terkini.',
          tip: 'Pastikan lembar iDeb bertanggal cetak maksimal 30 hari ke belakang agar riwayat kredit mencerminkan kondisi terbaru.'
        },
        {
          step: 3,
          title: 'Analisis Status Kolektibilitas Kredit',
          desc: 'Perhatikan kolom kualitas kredit: Kol 1 (Lancar), Kol 2 (Dalam Perhatian Khusus), Kol 3 (Kurang Lancar), Kol 4 (Diragukan), Kol 5 (Macet).',
          tip: 'Bagi posisi finance/kasir/purchasing, calon karyawan dengan status Kol 3-5 memiliki risiko benturan kepentingan atau risiko fraud yang tinggi.'
        }
      ],
      dokumenWajib: [
        'Formulir Persetujuan Background Check Calon Karyawan',
        'Lembar Laporan Informasi Debitur (iDeb) Resmi OJK bertanggal baru',
        'Scan Asli KTP Elektronik Pemohon'
      ],
      statusValidasi: [
        { status: 'KOL_1', label: 'Kolektibilitas 1 (Lancar)', meaning: 'Pembayaran pokok dan bunga kredit selalu tepat waktu tanpa tunggakan.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'KOL_2', label: 'Kolektibilitas 2 (Perhatian Khusus)', meaning: 'Terdapat tunggakan 1 - 90 hari kalender.', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'KOL_3_5', label: 'Kolektibilitas 3 - 5 (Bermasalah / Macet)', meaning: 'Tunggakan di atas 90 hari s.d. kredit macet atau hapus buku.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Informasi debitur bersifat rahasia perbankan dan wajib dijaga kerahasiaannya sesuai UU No. 27 Tahun 2022 (UU PDP). Dilarang menyebarluaskan data kredit kepada pihak ketiga yang tidak berwenang.'
    }
  },

  // 4. Cek KTP & NIK Dukcapil Kemendagri
  dukcapil: {
    id: 'dukcapil',
    name: 'Verifikasi NIK & KTP (Dukcapil Kemendagri)',
    shortName: 'Cek KTP Dukcapil',
    category: 'identitas',
    categoryLabel: 'Identitas & Legalitas',
    tagline: 'Validasi NIK 16 Digit, Kesesuaian Nama & Keabsahan KTP Elektronik',
    officialUrl: 'https://layananonline.dukcapil.kemendagri.go.id/',
    logoKey: 'dukcapil',
    logo: <DukcapilLogo className="w-5 h-5" />,
    instansi: 'Ditjen Kependudukan dan Pencatatan Sipil, Kemendagri RI',
    dasarHukum: 'UU No. 24 Tahun 2013 tentang Administrasi Kependudukan & Permendagri No. 102/2019',
    targetVerifikasi: '16 digit NIK, nama lengkap sesuai akta kelahiran, tanggal lahir, dan status kependudukan aktif WNI.',
    urgensi: 'Sangat Tinggi (Wajib untuk seluruh proses onboarding karyawan)',
    callCenter: 'Halo Dukcapil 1500-537 / WhatsApp 0811-800-537',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Pemeriksaan validitas nomor induk kependudukan (NIK) e-KTP calon karyawan untuk menghindari penggunaan identitas fiktif, KTP orang lain, atau dokumen palsu pada kontrak kerja dan pendaftaran BPJS.',
    keywords: ['dukcapil', 'nik', 'ktp', 'e-ktp', 'kependudukan', 'kemendagri', 'identitas', 'warga negara', 'kk'],
    guide: {
      ringkasan: 'Verifikasi awal dokumen identitas kependudukan untuk memastikan calon pekerja adalah pemilik sah identitas yang diajukan.',
      tataCara: [
        {
          step: 1,
          title: 'Bedah Struktur 16 Digit NIK KTP',
          desc: 'Digit 1-2: Kode Provinsi, 3-4: Kode Kota/Kab, 5-6: Kode Kecamatan, 7-12: Tanggal Lahir (wanita: tgl + 40), 13-16: Nomor urut sistem.',
          tip: 'Jika tanggal lahir di KTP tidak cocok dengan rumus digit ke-7 sampai 12, segera klarifikasi ke kandidat.'
        },
        {
          step: 2,
          title: 'Pencocokan Foto Fisik & Fisik KTP',
          desc: 'Periksa ciri fisik KTP elektronik: hologram burung garuda, chip e-KTP, kualitas cetak latar belakang biru/merah, dan kejernihan tanda tangan.',
          tip: 'Waspadai KTP hasil suntingan digital/photoshop dengan font tidak seragam atau garis tepi terpotong.'
        },
        {
          step: 3,
          title: 'Validasi Melalui Kanal Resmi Dukcapil',
          desc: 'Gunakan kanal resmi WhatsApp/call center Halo Dukcapil atau portal layanan online untuk memverifikasi keaktifan NIK dalam database kependudukan nasional.',
          tip: 'NIK yang valid wajib untuk pendaftaran BPJS Ketenagakerjaan (SIPP), BPJS Kesehatan (Edabu), dan validasi NIK-NPWP DJP.'
        }
      ],
      dokumenWajib: [
        'Scan Asli KTP Elektronik (e-KTP) Berwarna',
        'Salinan Kartu Keluarga (KK) Terkini',
        'Foto Selfie Pelamar Memegang e-KTP (Opsional untuk rekrutmen jarak jauh)'
      ],
      statusValidasi: [
        { status: 'ACTIVE', label: 'NIK Aktif & Valid', meaning: '16 digit NIK terdaftar pada database kependudukan Ditjen Dukcapil RI.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'MISMATCH', label: 'Data Tidak Sinkron', meaning: 'NIK terdaftar namun terdapat perbedaan ejaan nama atau tanggal lahir.', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'NOT_FOUND', label: 'NIK Tidak Terdaftar', meaning: 'Format NIK salah atau belum terekam di sistem server kependudukan nasional.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Data kependudukan dilindungi secara ketat berdasarkan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi. Perusahaan wajib menyimpan data KTP di server terenkripsi.'
    }
  },

  // 5. SKCK Online Polri
  skck: {
    id: 'skck',
    name: 'SKCK Online Polri (Surat Keterangan Catatan Kepolisian)',
    shortName: 'SKCK Online Polri',
    category: 'hukum',
    categoryLabel: 'Integritas Hukum & Perkara',
    tagline: 'Pengecekan Rekam Jejak Kriminal & Keabsahan Lembar SKCK Resmi',
    officialUrl: 'https://skck.polri.go.id/',
    logoKey: 'skck',
    logo: <SKCKLogo className="w-5 h-5" />,
    instansi: 'Badan Intelijen Keamanan Kepolisian Negara Republik Indonesia (Polri)',
    dasarHukum: 'Perkapolri No. 18 Tahun 2014 tentang Tata Cara Penerbitan SKCK',
    targetVerifikasi: 'Nomor Register SKCK, barcode validasi, kantor kepolisian penerbit (Mabes/Polda/Polres/Polsek) & masa berlaku 6 bulan.',
    urgensi: 'Tinggi (Standar baku syarat rekrutmen perusahaan)',
    callCenter: 'Call Center Polri 110 / skck@polri.go.id',
    callCenterHours: '24 Jam / 7 Hari',
    deskripsi: 'Layanan terpadu Kepolisian RI untuk memverifikasi riwayat rekam jejak kriminal, keterlibatan perkara hukum pidana, serta status bebas dari tindak pidana calon tenaga kerja.',
    keywords: ['skck', 'polri', 'polres', 'polda', 'catatan kriminal', 'pidana', 'kelakuan baik', 'sidik jari', 'keamanan'],
    guide: {
      ringkasan: 'Validasi dokumen resmi kepolisian untuk memastikan calon karyawan tidak memiliki catatan kriminal yang membahayakan operasional kantor.',
      tataCara: [
        {
          step: 1,
          title: 'Cek Barcode & QR Verifikasi SKCK',
          desc: 'Lembar SKCK resmi masa kini dilengkapi QR Code pengaman di sudut kanan atas lembar dokumen.',
          tip: 'Pindai QR code menggunakan kamera ponsel untuk memastikan diarahkan ke domain resmi berakhiran polri.go.id.'
        },
        {
          step: 2,
          title: 'Validasi Masa Berlaku SKCK',
          desc: 'SKCK berlaku selama 6 bulan sejak tanggal diterbitkan. Pastikan SKCK masih aktif saat proses offering dan penandatanganan kontrak kerja.',
          tip: 'Jika masa berlaku telah lewat, mintalah pembaruan perpanjangan lembar SKCK di Polsek/Polres domisili pelamar.'
        },
        {
          step: 3,
          title: 'Verifikasi Tingkat Penerbitan Sesuai Jabatan',
          desc: 'Tingkat Polsek (staf umum lokal), Polres (staf operasional/perusahaan biasa), Polda (staf manajerial/investasi), Mabes Polri (posisi sensitif/luar negeri).',
          tip: 'Periksa kesesuaian tujuan pembuatan SKCK yang tertera pada lembar dokumen ("Untuk Keperluan Melamar Pekerjaan").'
        }
      ],
      dokumenWajib: [
        'Scan Asli Lembar SKCK Berwarna',
        'Rumus Sidik Jari Kiri & Kanan (Tercantum pada SKCK)',
        'KTP Elektronik Pemegang SKCK'
      ],
      statusValidasi: [
        { status: 'CLEAR', label: 'Berkelakuan Baik (Nihil Pidana)', meaning: 'Pemohon tidak memiliki catatan keterlibatan dalam tindak kejahatan pidana.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'EXPIRED', label: 'SKCK Kedaluwarsa', meaning: 'Lembar SKCK telah melewati batas waktu 6 bulan sejak diterbitkan.', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'INVALID', label: 'Barcode Tidak Terdaftar', meaning: 'QR code atau nomor registrasi tidak cocok dengan server Baintelkam Polri.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Berdasarkan Perkapolri No. 18/2014, pemalsuan lembar SKCK merupakan tindak pidana pemalsuan surat autentik Pasal 263 KUHP dengan ancaman pidana 6 tahun penjara.'
    }
  },

  // 6. Cek NPWP DJP
  ceknpwp: {
    id: 'ceknpwp',
    name: 'Cek NPWP DJP (Direktorat Jenderal Pajak)',
    shortName: 'Cek NPWP DJP',
    category: 'identitas',
    categoryLabel: 'Identitas & Legalitas',
    tagline: 'Validasi Status Wajib Pajak & Pemadanan NIK 16 Digit CoreTax',
    officialUrl: 'https://ereg.pajak.go.id/ceknpwp',
    logoKey: 'ceknpwp',
    logo: <DJPLogo className="w-5 h-5" />,
    instansi: 'Direktorat Jenderal Pajak, Kementerian Keuangan RI',
    dasarHukum: 'PMK No. 112/PMK.03/2022 & PMK No. 136/2023 tentang NPWP Wajib Pajak Orang Pribadi',
    targetVerifikasi: 'Status NPWP Aktif/Non-Efektif (NE), NIK 16 digit terpadan, nama KPP terdaftar & kesesuaian PTKP.',
    urgensi: 'Sangat Tinggi (Wajib untuk perhitungan penggajian PPh 21 TER)',
    callCenter: 'Kring Pajak 1500-200 / pengaduan@pajak.go.id',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Layanan pengecekan keaktifan nomor pokok wajib pajak (NPWP) orang pribadi dan validasi pemadanan NIK 16 digit yang wajib digunakan dalam pelaporan bukti potong PPh 21 TER dan sistem perpajakan CoreTax DJP.',
    keywords: ['npwp', 'pajak', 'djp', 'coretax', 'pph 21', 'kring pajak', 'nik npwp', 'wajib pajak'],
    guide: {
      ringkasan: 'Pemeriksaan status perpajakan karyawan untuk menjamin kepatuhan pemotongan PPh 21 TER tanpa denda tarif lebih tinggi.',
      tataCara: [
        {
          step: 1,
          title: 'Kumpulkan Kartu NPWP / Bukti NIK Terpadan',
          desc: 'Minta salinan kartu NPWP (format 15 digit atau kartu NIK 16 digit baru) beserta surat keterangan terdaftar dari DJP.',
          tip: 'Sejak implementasi PMK 136/2023, seluruh WNI wajib memadankan NIK 16 digit menjadi NPWP resmi.'
        },
        {
          step: 2,
          title: 'Cek Validitas via Portal DJP Online',
          desc: 'Kunjungi portal ereg.pajak.go.id/ceknpwp, masukkan NIK dan nomor Kartu Keluarga pelamar, lalu selesaikan kode keamanan.',
          tip: 'Sistem akan menampilkan nomor NPWP, nama Wajib Pajak, KPP Pratama domisili, dan status "AKTIF" atau "NE".'
        },
        {
          step: 3,
          title: 'Tindak Lanjut Status Non-Efektif (NE)',
          desc: 'Jika berstatus Non-Efektif (NE), instruksikan karyawan untuk mengaktifkan kembali NPWP secara online melalui live chat Kring Pajak sebelum tanggal penggajian.',
          tip: 'Karyawan tanpa NPWP valid berisiko terkena ketentuan tarif pemotongan pajak lebih tinggi sesuai regulasi PPh 21.'
        }
      ],
      dokumenWajib: [
        'Kartu NPWP / Bukti Pemadanan NIK-NPWP DJP Online',
        'Nomor Induk Kependudukan (NIK) 16 Digit',
        'Nomor Kartu Keluarga (KK)'
      ],
      statusValidasi: [
        { status: 'ACTIVE', label: 'NPWP Aktif Terpadan', meaning: 'NPWP aktif dan telah terintegrasi dengan NIK 16 digit di sistem DJP CoreTax.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'NON_EFFECTIVE', label: 'Non-Efektif (NE)', meaning: 'NPWP berstatus pasif (perlu aktivasi ulang via formulir permohonan aktif kembali).', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'NOT_REGISTERED', label: 'Belum Terdaftar', meaning: 'Karyawan belum memiliki NPWP dan wajib didaftarkan akun NPWP baru.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Data NPWP digunakan langsung untuk pelaporan SPT Masa PPh 21 Unifikasi 1721-VIII pada software HRMatrix dan portal resmi DJP Online.'
    }
  },

  // 7. SIPP Mahkamah Agung RI (Pengecekan Kasus Hukum & Pengadilan)
  sippma: {
    id: 'sippma',
    name: 'SIPP Mahkamah Agung RI (Penelusuran Perkara Pengadilan)',
    shortName: 'SIPP Mahkamah Agung',
    category: 'hukum',
    categoryLabel: 'Integritas Hukum & Perkara',
    tagline: 'Penelusuran Riwayat Gugatan Perdata, Pidana & Perselisihan Kerja',
    officialUrl: 'https://putusan3.mahkamahagung.go.id/',
    logoKey: 'sippma',
    logo: <SIPPMALogo className="w-5 h-5" />,
    instansi: 'Mahkamah Agung Republik Indonesia',
    dasarHukum: 'UU No. 14 Tahun 2008 tentang KIP & SK KMA No. 1-144/KMA/SK/I/2011',
    targetVerifikasi: 'Riwayat perkara perdata, gugatan wanprestasi, perkara PHI (Pengadilan Hubungan Industrial), kepailitan & pidana.',
    urgensi: 'Tinggi (Direkomendasikan untuk posisi Eksekutif, Manajerial, Legal & Pengadaan)',
    callCenter: '(021) 3843348 / info@mahkamahagung.go.id',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Sistem Informasi Penelusuran Perkara (SIPP) Pengadilan Negeri, Pengadilan Niaga, dan Mahkamah Agung di seluruh Indonesia untuk menelusuri apakah calon karyawan sedang atau pernah terlibat dalam gugatan sengketa hukum atau perkara perselisihan industri.',
    keywords: ['sipp', 'mahkamah agung', 'pengadilan', 'perkara', 'gugatan', 'perdata', 'pidana', 'phi', 'hukum', 'sengketa'],
    guide: {
      ringkasan: 'Penelusuran rekam jejak perkara hukum perdata, niaga, dan perselisihan hubungan industrial calon pekerja tingkat senior/manajerial.',
      tataCara: [
        {
          step: 1,
          title: 'Tentukan Pengadilan Negeri Sesuai Domisili Pelamar',
          desc: 'Buka portal direktori putusan atau SIPP Mahkamah Agung dan pilih wilayah yurisdiksi Pengadilan Negeri domisili kandidat.',
          tip: 'Untuk sengketa ketenagakerjaan, cari di bagian Pengadilan Hubungan Industrial (PHI).'
        },
        {
          step: 2,
          title: 'Cari Berdasarkan Nama Lengkap Kandidat',
          desc: 'Ketik nama lengkap kandidat pada kolom "Pihak / Para Pihak" atau "Terdakwa/Penggugat/Tergugat".',
          tip: 'Gunakan tanda kutip bila nama kandidat cukup panjang untuk mempersempit hasil pencarian.'
        },
        {
          step: 3,
          title: 'Analisis Amar Putusan Perkara',
          desc: 'Jika ditemukan hasil, periksa apakah kandidat bertindak sebagai Penggugat, Tergugat, Saksi, atau Korban serta baca amar putusan akhir.',
          tip: 'Pastikan kesesuaian identitas pihak yang berperkara untuk menghindari kesamaan nama (homonim).'
        }
      ],
      dokumenWajib: [
        'Nama Lengkap Sesuai KTP Pelamar',
        'Kota/Kabupaten Domisili Tinggal 5 Tahun Terakhir',
        'Nama Perusahaan Tempat Bekerja Sebelumnya'
      ],
      statusValidasi: [
        { status: 'NO_RECORD', label: 'Nihil Perkara Pengadilan', meaning: 'Tidak ditemukan riwayat sengketa atau perkara hukum atas nama kandidat.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'CIVIL_RECORD', label: 'Tercatat Perkara Perdata/PHI', meaning: 'Ditemukan riwayat sengketa perdata, gugatan wanprestasi, atau perselisihan PHI.', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'CRIMINAL_RECORD', label: 'Tercatat Terpidana', meaning: 'Ditemukan putusan pidana yang telah berkekuatan hukum tetap (Inkracht).', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Data direktori putusan pengadilan Mahkamah Agung bersifat terbuka untuk umum berdasarkan UU Keterbukaan Informasi Publik No. 14 Tahun 2008.'
    }
  },

  // 8. KKI / SATUSEHAT SDMK Kemenkes (Tenaga Medis & Kesehatan)
  kki: {
    id: 'kki',
    name: 'SATUSEHAT SDMK / KKI (Surat Tanda Registrasi Kemenkes)',
    shortName: 'STR / SIP Kemenkes',
    category: 'akademik',
    categoryLabel: 'Akademik & Pendidikan',
    tagline: 'Cek Surat Tanda Registrasi (STR) & SIP Tenaga Kesehatan / Medis',
    officialUrl: 'https://satusehat.kemkes.go.id/sdmk',
    logoKey: 'kki',
    logo: <KKILogo className="w-5 h-5" />,
    instansi: 'Konsil Tenaga Kesehatan Indonesia / Kementerian Kesehatan RI',
    dasarHukum: 'UU No. 17 Tahun 2023 tentang Kesehatan & Permenkes No. 83/2019',
    targetVerifikasi: 'Nomor STR Seumur Hidup, Surat Izin Praktik (SIP), masa berlaku, kualifikasi profesi dokter/perawat/apoteker.',
    urgensi: 'Wajib Khusus (Untuk Dokter Perusahaan, Perawat Klinik Kantor, Apoteker, & Paramedis)',
    callCenter: 'HALO KEMENKES 1500-567 / kontak@kemkes.go.id',
    callCenterHours: '24 Jam / 7 Hari',
    deskripsi: 'Portal verifikasi profil tenaga medis dan tenaga kesehatan berizin resmi di Indonesia untuk memvalidasi keabsahan Surat Tanda Registrasi (STR) dan Surat Izin Praktik (SIP) dokter perusahaan, perawat klinik kerja, dan staf medis institusi.',
    keywords: ['kki', 'kemenkes', 'str', 'sip', 'dokter', 'perawat', 'paramedis', 'satusehat', 'sdmk', 'klinik perusahaan'],
    guide: {
      ringkasan: 'Verifikasi legalitas izin praktik dokter dan tenaga kesehatan perusahaan sesuai standar UU Kesehatan No. 17/2023.',
      tataCara: [
        {
          step: 1,
          title: 'Kumpulkan Lembar STR / SIP Pelamar Medis',
          desc: 'Minta salinan scan STR seumur hidup bertanda tangan elektronik (TTE) resmi Konsil Kedokteran Indonesia (KKI) atau KTKI.',
          tip: 'Pastikan profesi yang tertera cocok (Dokter Umum, Dokter Spesialis Okupasi, Perawat, Ahli Gizi, dll).'
        },
        {
          step: 2,
          title: 'Cek Database SATUSEHAT SDMK',
          desc: 'Buka portal satusehat.kemkes.go.id/sdmk dan masukkan nomor STR atau NIK tenaga medis.',
          tip: 'Sistem akan menampilkan status keaktifan registrasi dan rekam kompetensi tenaga kesehatan.'
        },
        {
          step: 3,
          title: 'Pastikan Status Praktik Legal',
          desc: 'Pastikan tenaga medis tidak sedang menjalani sanksi pencabutan izin praktik oleh Majelis Disiplin Profesi.',
          tip: 'Dokter klinik perusahaan wajib memiliki SIP yang diterbitkan oleh Dinas Kesehatan setempat.'
        }
      ],
      dokumenWajib: [
        'Scan Surat Tanda Registrasi (STR) Seumur Hidup Berwarna',
        'Surat Izin Praktik (SIP) Aktif',
        'Ijazah Profesi Kedokteran / Keperawatan'
      ],
      statusValidasi: [
        { status: 'ACTIVE', label: 'STR Aktif & Terdaftar', meaning: 'Tenaga kesehatan memiliki izin resmi yang terdaftar di pangkalan data Kemenkes RI.', badgeClass: 'bg-emerald-100 text-emerald-800' },
        { status: 'SUSPENDED', label: 'Dibekukan / Tidak Aktif', meaning: 'Status registrasi dalam pembekuan atau evaluasi etik/disiplin medis.', badgeClass: 'bg-amber-100 text-amber-800' },
        { status: 'NOT_FOUND', label: 'Nomor STR Tidak Valid', meaning: 'Nomor STR tidak ditemukan pada database SATUSEHAT SDMK.', badgeClass: 'bg-rose-100 text-rose-800' }
      ],
      catatanKepatuhan: 'Sesuai UU No. 17 Tahun 2023 Pasal 439, setiap orang yang mempekerjakan tenaga medis/kesehatan tanpa STR dan SIP diancam pidana denda hingga ratusan juta rupiah.'
    }
  }
};
