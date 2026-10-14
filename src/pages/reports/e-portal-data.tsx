import React from 'react';
import { 
  KemenakerLogo, 
  BPJSTKLogo, 
  EdabuLogo, 
  DJPLogo, 
  EPPPKBLogo,
  TemanK3Logo,
  TKALogo,
  KarirhubLogo,
  PPHILogo,
  OSSRBALogo,
  SimpelKLHKLogo,
  FestronikLogo,
  SIMBGPUPRLogo,
  BapendaLogo
} from '../../components/e-portal/PortalLogos';

export interface PortalMeta {
  id: string;
  name: string;
  shortName: string;
  category: 'hr' | 'ga';
  categoryLabel: string;
  tagline: string;
  officialUrl: string;
  logo: React.ReactNode;
  instansi: string;
  dasarHukum: string;
  jadwal: string;
  urgensi: string;
  callCenter: string;
  callCenterHours: string;
  deskripsi: string;
  keywords: string[];
}

export const PORTALS_CONFIG: Record<string, PortalMeta> = {
  // ==================== KELOMPOK A: RANAH HR ====================
  kemenaker: {
    id: 'kemenaker',
    name: 'Kementerian Ketenagakerjaan RI (WLKP Online)',
    shortName: 'Kemenaker WLKP',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Wajib Lapor Ketenagakerjaan Perusahaan & Profil Institusi',
    officialUrl: 'https://wajiblapor.kemnaker.go.id/',
    logo: <KemenakerLogo className="w-5 h-5" />,
    instansi: 'Kementerian Ketenagakerjaan Republik Indonesia',
    dasarHukum: 'UU No. 7 Tahun 1981 & Permenaker No. 18 Tahun 2017',
    jadwal: 'Wajib dilaporkan berkala 1 tahun sekali atau maks 30 hari pasca pendirian/perubahan unit usaha.',
    urgensi: 'Sangat Tinggi (Wajib Kepatuhan Hukum)',
    callCenter: '1500-799 / (021) 5255733',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Portal wajib lapor ketenagakerjaan berkala tahunan (UU No. 7/1981), pelaporan komposisi tenaga kerja (WNI/WNA, PKWT/PKWTT), fasilitas K3, dan kepesertaan jaminan sosial perusahaan.',
    keywords: ['kemenaker', 'kemnaker', 'wlkp', 'wajib lapor', 'disnaker', 'tenaga kerja', 'ketenagakerjaan']
  },
  bpjstk: {
    id: 'bpjstk',
    name: 'BPJS Ketenagakerjaan (SIPP Online)',
    shortName: 'BPJSTK SIPP',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Sistem Informasi Pelaporan Peserta & Pembayaran Iuran EPS',
    officialUrl: 'https://sipp.bpjsketenagakerjaan.go.id/',
    logo: <BPJSTKLogo className="w-5 h-5" />,
    instansi: 'Badan Penyelenggara Jaminan Sosial Ketenagakerjaan',
    dasarHukum: 'UU No. 24 Tahun 2011, PP No. 44/2015 & PP No. 45/2015',
    jadwal: 'Paling lambat tanggal 15 setiap bulan sebelum batas jatuh tempo pembayaran iuran.',
    urgensi: 'Sangat Tinggi (Kepatuhan Payroll Bulanan)',
    callCenter: '175 (Tanya BPJAMSOSTEK)',
    callCenterHours: '24 Jam / 7 Hari',
    deskripsi: 'Pengelolaan data tenaga kerja, pendaftaran kepesertaan baru, mutasi upah bulanan, pelaporan JHT, JKK, JKM, JP, JKP, dan generate kode Electronic Payment System (EPS).',
    keywords: ['bpjstk', 'bpjs ketenagakerjaan', 'sipp', 'jht', 'jkk', 'jkm', 'jp', 'jkp', 'iuran', 'eps']
  },
  edabu: {
    id: 'edabu',
    name: 'BPJS Kesehatan (e-Dabu Badan Usaha)',
    shortName: 'EDABU BPJS Kes',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Elektronik Data Badan Usaha - Pengelolaan Data JKN-KIS',
    officialUrl: 'https://edabu.bpjs-kesehatan.go.id/Edabu/Home/Login',
    logo: <EdabuLogo className="w-5 h-5" />,
    instansi: 'Badan Penyelenggara Jaminan Sosial Kesehatan',
    dasarHukum: 'UU No. 24 Tahun 2011 & Perpres No. 82 Tahun 2018',
    jadwal: 'Paling lambat tanggal 20 setiap bulan sebelum terbit tagihan premi tanggal 1 bulan berikutnya.',
    urgensi: 'Sangat Tinggi (Kepatuhan Payroll Bulanan)',
    callCenter: '165 (Care Center BPJS Kesehatan)',
    callCenterHours: '24 Jam / 7 Hari',
    deskripsi: 'Portal mutasi data pekerja badan usaha, pendaftaran anggota keluarga tambahan (anak/pasangan), cetak e-ID KIS karyawan, dan rincian tagihan premi 4% perusahaan + 1% pekerja.',
    keywords: ['edabu', 'bpjs kesehatan', 'jkn', 'kis', 'badan usaha', 'faskes', 'premi bpjs']
  },
  djp: {
    id: 'djp',
    name: 'Direktorat Jenderal Pajak (DJP Online / CoreTax)',
    shortName: 'DJP Online Pajak',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Layanan Pajak Digital, SPT Masa PPh 21/26 & e-Bupot CoreTax',
    officialUrl: 'https://djponline.pajak.go.id/account/login',
    logo: <DJPLogo className="w-5 h-5" />,
    instansi: 'Direktorat Jenderal Pajak - Kementerian Keuangan RI',
    dasarHukum: 'UU HPP No. 7/2021, PP No. 58/2023 & PMK No. 168/2023 (PPh 21 TER)',
    jadwal: 'Setor pajak maks tgl 10 bulan berikutnya; Lapor SPT Masa maks tgl 20 bulan berikutnya.',
    urgensi: 'Sangat Tinggi (Kepatuhan Pajak & e-Billing)',
    callCenter: '1500-200 (Kring Pajak)',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Pelaporan SPT Masa PPh 21/26 skema TER, pembuatan bukti potong unifikasi 1721-VIII / 1721-A1 tahunan, generate kode e-Billing, dan pengawasan kepatuhan wajib pajak badan.',
    keywords: ['djp', 'pajak', 'pph 21', 'ter', 'ebupot', 'coretax', 'ebilling', 'spt masa', 'npwp']
  },
  'e-pp-pkb': {
    id: 'e-pp-pkb',
    name: 'Portal e-PP & e-PKB Kemnaker RI',
    shortName: 'E-PP & PKB',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Pengesahan Peraturan Perusahaan (PP) & Pendaftaran PKB Daring',
    officialUrl: 'https://pppkb.kemnaker.go.id/',
    logo: <EPPPKBLogo className="w-5 h-5" />,
    instansi: 'Ditjen Pembinaan Hubungan Industrial & Jamsos Kemnaker',
    dasarHukum: 'UU No. 13/2003 jo. UU Cipta Kerja No. 6/2023 & Permenaker No. 28/2014',
    jadwal: 'Wajib diajukan sebelum masa berlaku PP (2 tahun) kedaluwarsa, disarankan min 30 hari sebelumnya.',
    urgensi: 'Tinggi (Kepastian Hukum Tata Tertib Perusahaan)',
    callCenter: '(021) 5255733 / Ditjen PHI Kemnaker',
    callCenterHours: 'Senin - Jumat: 08.00 - 15.30 WIB',
    deskripsi: 'Pengajuan daring draf naskah Peraturan Perusahaan (PP) untuk memperoleh Surat Keputusan (SK) Pengesahan resmi dari Disnaker/Kemnaker dan pendaftaran Perjanjian Kerja Bersama (PKB).',
    keywords: ['e-pp-pkb', 'pppkb', 'peraturan perusahaan', 'pkb', 'perjanjian kerja', 'disnaker', 'sk pengesahan']
  },
  temank3: {
    id: 'temank3',
    name: 'Teman K3 Kemnaker (P2K3 & Keselamatan Kerja)',
    shortName: 'Teman K3 P2K3',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Pelaporan P2K3, Lisensi Ahli K3, Riksa Uji & Insiden Kecelakaan Kerja',
    officialUrl: 'https://temank3.kemnaker.go.id/',
    logo: <TemanK3Logo className="w-5 h-5" />,
    instansi: 'Ditjen Pembinaan Pengawasan Ketenagakerjaan dan K3 (Binwasnaker & K3)',
    dasarHukum: 'Permenaker No. 04/MEN/1987 & UU No. 1 Tahun 1970 tentang Keselamatan Kerja',
    jadwal: 'Laporan Triwulanan P2K3 (per 3 bulan) & Insidental maks 2x24 jam saat terjadi insiden kecelakaan kerja.',
    urgensi: 'Sangat Tinggi (Wajib untuk Perusahaan ≥100 Karyawan / Berisiko Tinggi)',
    callCenter: '1500-799 / (021) 5255733',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Setiap perusahaan yang mempekerjakan 100 orang atau lebih atau memiliki risiko bahaya tinggi wajib membentuk Panitia Pembina Keselamatan dan Kesehatan Kerja (P2K3), melaporkan kegiatan triwulanan, verifikasi lisensi Ahli K3 Umum, dan pelaporan kecelakaan kerja (KK/PAK).',
    keywords: ['temank3', 'k3', 'p2k3', 'keselamatan kerja', 'ahli k3', 'kecelakaan kerja', 'binwasnaker', 'riksa uji']
  },
  'tka-online': {
    id: 'tka-online',
    name: 'TKA Online Kemnaker (Tenaga Kerja Asing)',
    shortName: 'TKA Online RPTKA',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Pengesahan RPTKA, Notifikasi Izin Kerja & Kompensasi DKP-TKA',
    officialUrl: 'https://tka-online.kemnaker.go.id/',
    logo: <TKALogo className="w-5 h-5" />,
    instansi: 'Ditjen Pembinaan Penempatan Tenaga Kerja (Binapenta) Kemnaker RI',
    dasarHukum: 'PP No. 34 Tahun 2021 & Permenaker No. 8 Tahun 2021 tentang Penggunaan TKA',
    jadwal: 'Tahunan atau insidental saat perencanaan perekrutan ekspatriat/pekerja asing.',
    urgensi: 'Tinggi (Bila Perusahaan Mempekerjakan Expatriate)',
    callCenter: '1500-799 / (021) 5255733',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Sistem pengesahan Rencana Penggunaan Tenaga Kerja Asing (RPTKA), penerbitan notifikasi izin kerja, integrasi visa tinggal terbatas (VITAS/KITAS) Ditjen Imigrasi, dan verifikasi billing pembayaran Dana Kompensasi Penggunaan TKA (DKP-TKA senilai USD 100/bulan/posisi).',
    keywords: ['tka', 'tka-online', 'rptka', 'tenaga kerja asing', 'expatriate', 'dkp-tka', 'vitas', 'kitas', 'imigrasi']
  },
  karirhub: {
    id: 'karirhub',
    name: 'SIAPkerja / Karirhub Kemnaker RI',
    shortName: 'Karirhub SIAPkerja',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Pusat Pasar Kerja Resmi & Pelaporan Penempatan Tenaga Kerja',
    officialUrl: 'https://karirhub.kemnaker.go.id/',
    logo: <KarirhubLogo className="w-5 h-5" />,
    instansi: 'Pusat Pasar Kerja (Pasker ID) - Kementerian Ketenagakerjaan RI',
    dasarHukum: 'Kepmenaker No. 40 Tahun 2023 & Permenaker No. 39 Tahun 2016',
    jadwal: 'Insidental setiap pembukaan lowongan pekerjaan dan penempatan tenaga kerja baru.',
    urgensi: 'Sedang-Tinggi (Kepatuhan Wajib Lapor Loker & Penempatan)',
    callCenter: '1500-799 (Call Center Kemnaker)',
    callCenterHours: '24 Jam Online / Jam Kerja: 08.00 - 16.00 WIB',
    deskripsi: 'Portal bursa kerja resmi pemerintah untuk publikasi lowongan kerja perusahaan, screening database pencari kerja nasional (AK-1), pemenuhan kuota tenaga kerja disabilitas (min 1% swasta / 2% BUMN), dan pelaporan penempatan tenaga kerja.',
    keywords: ['karirhub', 'siapkerja', 'pasar kerja', 'lowongan kerja', 'loker', 'penempatan', 'kemnaker', 'disabilitas']
  },
  pphi: {
    id: 'pphi',
    name: 'PPHI / SIMASNAKER Kemnaker RI',
    shortName: 'PPHI / Hub Industrial',
    category: 'hr',
    categoryLabel: 'Laporan HR (Ketenagakerjaan & Pajak)',
    tagline: 'Pencatatan Serikat Pekerja (SP/SB) & Mediasi Perselisihan Industrial',
    officialUrl: 'https://hi.kemnaker.go.id/',
    logo: <PPHILogo className="w-5 h-5" />,
    instansi: 'Ditjen Pembinaan Hubungan Industrial & Jamsos Kemnaker RI',
    dasarHukum: 'UU No. 2 Tahun 2004 (PPHI) & UU No. 21 Tahun 2000 (Serikat Pekerja)',
    jadwal: 'Insidental saat pencatatan pembentukan serikat atau permohonan mediasi perselisihan.',
    urgensi: 'Sedang (Manajemen Hubungan Industrial & Mitigasi Risiko)',
    callCenter: '(021) 5255733 / Ditjen PHI Kemnaker',
    callCenterHours: 'Senin - Jumat: 08.00 - 15.30 WIB',
    deskripsi: 'Sistem pencatatan pembentukan dan nomor bukti pencatatan Serikat Pekerja/Serikat Buruh (SP/SB) di perusahaan, penatausahaan risalah LKS Bipartit, serta registrasi permohonan mediasi tripartit atas perselisihan hak, perselisihan kepentingan, atau perselisihan PHK.',
    keywords: ['pphi', 'simasnaker', 'hubungan industrial', 'serikat pekerja', 'sp/sb', 'bipartit', 'tripartit', 'mediasi']
  },

  // ==================== KELOMPOK B: RANAH GA ====================
  oss: {
    id: 'oss',
    name: 'OSS RBA (Kementerian Investasi / BKPM)',
    shortName: 'OSS RBA / LKPM',
    category: 'ga',
    categoryLabel: 'Laporan GA (Perizinan, Investasi & Fasilitas)',
    tagline: 'Perizinan Berusaha Berbasis Risiko & Laporan Kegiatan Penanaman Modal (LKPM)',
    officialUrl: 'https://oss.go.id/',
    logo: <OSSRBALogo className="w-5 h-5" />,
    instansi: 'Kementerian Investasi / Badan Koordinasi Penanaman Modal (BKPM) RI',
    dasarHukum: 'PP No. 5 Tahun 2021 & Perka BKPM No. 5 Tahun 2021',
    jadwal: 'Triwulanan untuk Usaha Menengah/Besar (April, Juli, Oktober, Januari) / Semesteran untuk Usaha Kecil.',
    urgensi: 'Sangat Tinggi (Wajib Mutlak - Mencegah Pembekuan NIB)',
    callCenter: '169 (Kontak OSS) / (021) 25522555',
    callCenterHours: 'Senin - Jumat: 08.30 - 16.30 WIB',
    deskripsi: 'Pintu gerbang legalitas badan usaha, penerbitan Nomor Induk Berusaha (NIB), sertifikat standar KBLI operasional, dan kewajiban pelaporan LKPM triwulanan. Perusahaan yang tidak melaporkan LKPM akan dikenai sanksi peringatan bertahap hingga pencabutan izin usaha.',
    keywords: ['oss', 'oss rba', 'bkpm', 'lkpm', 'nib', 'izin usaha', 'kbli', 'investasi', 'perizinan']
  },
  simpel: {
    id: 'simpel',
    name: 'SIMPEL KLHK (Pelaporan Kinerja Lingkungan Hidup)',
    shortName: 'SIMPEL KLHK',
    category: 'ga',
    categoryLabel: 'Laporan GA (Perizinan, Investasi & Fasilitas)',
    tagline: 'Sistem Informasi Pelaporan Elektronik Lingkungan Hidup Kantor & Fasilitas',
    officialUrl: 'https://simpel.menlhk.go.id/',
    logo: <SimpelKLHKLogo className="w-5 h-5" />,
    instansi: 'Ditjen Gakkum & Ditjen PPKL - Kementerian Lingkungan Hidup dan Kehutanan RI',
    dasarHukum: 'Permen LHK No. 24 Tahun 2020 & PP No. 22 Tahun 2021',
    jadwal: 'Semesteran: Periode 1 maks 31 Juli, Periode 2 maks 31 Januari setiap tahun.',
    urgensi: 'Tinggi (Kepatuhan Lingkungan Gedung Perkantoran / Pabrik)',
    callCenter: '(021) 57903085 / Ditjen PPKL KLHK',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Sistem pelaporan kepatuhan lingkungan terpadu (RKL-RPL / UKL-UPL): pelaporan uji emisi berkala cerobong genset kantor, pengolahan air limbah domestik (STP gedung), pengujian kualitas udara dalam ruangan, dan pengelolaan sampah non-B3 fasilitas kantor.',
    keywords: ['simpel', 'simpel-klhk', 'lingkungan hidup', 'klhk', 'genset', 'air limbah', 'stp', 'amdal', 'ukl-upl']
  },
  festronik: {
    id: 'festronik',
    name: 'FESTRONIK KLHK (Manifest Elektronik Limbah B3)',
    shortName: 'Festronik Limbah B3',
    category: 'ga',
    categoryLabel: 'Laporan GA (Perizinan, Investasi & Fasilitas)',
    tagline: 'Manifest Elektronik Penyerahan Limbah Bahan Berbahaya & Beracun (B3)',
    officialUrl: 'https://festronik.menlhk.go.id/',
    logo: <FestronikLogo className="w-5 h-5" />,
    instansi: 'Ditjen Pengelolaan Sampah, Limbah & B3 (PSLB3) KLHK RI',
    dasarHukum: 'PP No. 22 Tahun 2021 & Permen LHK No. 6 Tahun 2021',
    jadwal: 'Setiap kali dilakukan serah terima limbah B3 fasilitas kantor kepada vendor transporter berizin.',
    urgensi: 'Tinggi (Kepatuhan Lingkungan Hidup & Audit PROPER)',
    callCenter: '(021) 57902751 / Subdit Pengangkutan Limbah B3',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Penerbitan nomor manifest elektronik (e-manifest) serah terima limbah B3 fasilitas perkantoran (oli bekas genset, sisa toner cartridge printer, lampu neon/TL bekas, baterai/aki UPS rusak, limbah medis P3K kantor) bersama vendor pihak ketiga transporter limbah B3 yang memiliki izin KLHK.',
    keywords: ['festronik', 'limbah b3', 'b3', 'klhk', 'manifest', 'oli bekas', 'toner', 'genset', 'aki', 'transporter']
  },
  simbg: {
    id: 'simbg',
    name: 'SIMBG (Sistem Informasi Manajemen Bangunan Gedung)',
    shortName: 'SIMBG PUPR',
    category: 'ga',
    categoryLabel: 'Laporan GA (Perizinan, Investasi & Fasilitas)',
    tagline: 'Persetujuan Bangunan Gedung (PBG) & Sertifikat Laik Fungsi (SLF)',
    officialUrl: 'https://simbg.pu.go.id/',
    logo: <SIMBGPUPRLogo className="w-5 h-5" />,
    instansi: 'Direktorat Jenderal Cipta Karya - Kementerian PUPR RI',
    dasarHukum: 'PP No. 16 Tahun 2021 & UU No. 28 Tahun 2002 tentang Bangunan Gedung',
    jadwal: 'Sebelum renovasi/pembangunan kantor baru dan perpanjangan SLF berkala setiap 5 tahun.',
    urgensi: 'Sedang-Tinggi (Kelaikan & Keselamatan Fisik Fasilitas Kantor)',
    callCenter: '158 (Halo PUPR) / (021) 72796155',
    callCenterHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    deskripsi: 'Layanan terpadu penerbitan Persetujuan Bangunan Gedung (PBG pengganti IMB) dan Sertifikat Laik Fungsi (SLF) gedung kantor, ruko operasional, atau gudang logistik untuk menjamin keandalan struktur, proteksi sistem kebakaran, instalasi listrik, dan evakuasi darurat.',
    keywords: ['simbg', 'pupr', 'pbg', 'slf', 'imb', 'gedung', 'bangunan', 'renovasi', 'kantor', 'laik fungsi']
  },
  bapenda: {
    id: 'bapenda',
    name: 'Bapenda / Pajak Daerah (Pajak Reklame & Operasional)',
    shortName: 'Pajak Daerah Bapenda',
    category: 'ga',
    categoryLabel: 'Laporan GA (Perizinan, Investasi & Fasilitas)',
    tagline: 'Pajak Reklame Nama Kantor, Pajak Air Tanah (ABT) & PKB Dinas',
    officialUrl: 'https://pajakonline.jakarta.go.id/',
    logo: <BapendaLogo className="w-5 h-5" />,
    instansi: 'Badan Pendapatan Daerah (Bapenda) / Pemerintah Provinsi & Daerah Setempat',
    dasarHukum: 'UU Hubungan Keuangan Pusat & Daerah (HKPD) No. 1/2022 & Perda Pajak Daerah Setempat',
    jadwal: 'Tahunan (Pajak Reklame papan nama & PKB kendaraan dinas) serta Bulanan (Pajak Air Tanah ABT).',
    urgensi: 'Sedang (Operasional Fasilitas Kantor & Aset Dinas)',
    callCenter: '1500-174 (Call Center Pajak Daerah)',
    callCenterHours: 'Senin - Jumat: 08.00 - 15.30 WIB',
    deskripsi: 'Sistem pelaporan Surat Ketetapan Pajak Daerah (SKPD) dan pembayaran pajak daerah operasional General Affairs (GA): Pajak Reklame (neon box papan nama kantor di pinggir jalan/gedung), Pajak Air Tanah (ABT) sumur bor kantor, serta Pajak Kendaraan Bermotor (PKB) armada dinas perusahaan.',
    keywords: ['bapenda', 'pajak daerah', 'reklame', 'neon box', 'air tanah', 'abt', 'pkb', 'kendaraan dinas', 'skpd']
  }
};
