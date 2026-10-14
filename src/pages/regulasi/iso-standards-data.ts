import { IsoStandardItem, IsoDomainCategory } from './types';

export const ISO_DOMAINS_META: { id: IsoDomainCategory; label: string; countBadge?: string }[] = [
  { id: 'ALL', label: 'Semua Standar ISO' },
  { id: 'HRM_TALENT_DIVERSITY', label: 'Human Resource Management & D&I' },
  { id: 'MUTU_OPERASIONAL', label: 'Mutu & Manajemen Organisasi' },
  { id: 'K3_LINGKUNGAN', label: 'K3 & Lingkungan Kerja' },
  { id: 'KEAMANAN_DATA_ETIKA', label: 'Keamanan Informasi & Anti Penyuapan' },
  { id: 'KELANGSUNGAN_BISNIS', label: 'Kelangsungan Bisnis & Resiliensi' },
];

export const ISO_STANDARDS_DATA: IsoStandardItem[] = [
  // 1. ISO 30415:2021 (HRM - Diversity & Inclusion)
  {
    id: 'iso-30415-2021',
    code: 'ISO 30415:2021',
    name: 'Human Resource Management — Diversity and Inclusion (D&I)',
    indonesianTitle: 'Manajemen Sumber Daya Manusia — Keberagaman dan Inklusi',
    domain: 'HRM_TALENT_DIVERSITY',
    domainLabel: 'Human Resource Management & D&I',
    badgeColor: 'purple',
    summary: 'Standar internasional panduan arsitektur keberagaman dan inklusi (D&I) dalam seluruh siklus kerja karyawan, mulai dari tata kelola, rekrutmen tanpa bias, pengembangan karier yang adil, hingga remunerasi setara.',
    hrRelevance: 'Panduan utama bagi HR dalam menyusun kebijakan anti-diskriminasi, fasilitas ramah disabilitas, kesetaraan gender (gender pay equity), dan budaya kerja inklusif yang terukur.',
    benefits: [
      'Meningkatkan employer branding dan daya tarik rekrutmen talenta terbaik.',
      'Menghilangkan bias tidak sadar (unconscious bias) dalam penilaian kinerja dan promosi.',
      'Memenuhi kepatuhan prinsip ESG (Environmental, Social, and Governance) pilar Sosial.',
      'Meningkatkan retensi dan keterikatan karyawan (employee engagement).'
    ],
    keyClauses: [
      {
        number: 'Klausul 4',
        name: 'Prinsip Dasar dan Kerangka Kerja D&I',
        requirement: 'Organisasi wajib menetapkan komitmen kepemimpinan terhadap keberagaman, keadilan akses, dan inklusi di seluruh jenjang.',
        hrAction: 'Menyusun Piagam Kebijakan D&I tertulis yang ditandatangani Direksi dan disosialisasikan kepada seluruh karyawan.'
      },
      {
        number: 'Klausul 6',
        name: 'Siklus Hidup Manajemen SDM Inklusif',
        requirement: 'Memastikan proses rekrutmen, onboarding, evaluasi kinerja, remunerasi, dan promosi bebas dari diskriminasi latar belakang.',
        hrAction: 'Menerapkan blind recruitment screening dan standarisasi rubrik wawancara berbasis kompetensi terstruktur.'
      },
      {
        number: 'Klausul 7',
        name: 'Pengukuran, Pelaporan dan Audit D&I',
        requirement: 'Mengumpulkan metrik representasi demografis secara etis dan mengevaluasi efektivitas inisiatif inklusi secara periodik.',
        hrAction: 'Melakukan survei inklusi tahunan dan memonitor rasio kesetaraan upah antar gender (Gender Pay Gap Analysis).'
      }
    ],
    auditChecklist: [
      'Terdapat Kebijakan Diversity & Inclusion resmi yang disahkan pimpinan puncak.',
      'Tersedia deskripsi pekerjaan (Job Description) yang menggunakan bahasa inklusif netral gender.',
      'Tersedia saluran pelaporan aman (Whistleblowing) untuk perlakuan diskriminatif atau pelecehan.',
      'Adanya program pelatihan berkala mengenai Unconscious Bias bagi seluruh hiring manager.'
    ],
    practicalTips: 'Mulailah dengan audit keterwakilan gender dan usia pada level kepemimpinan, lalu lakukan tinjauan berkala terhadap rentang gaji posisi sepadan.'
  },

  // 2. ISO 9001:2015 (Quality Management System)
  {
    id: 'iso-9001-2015',
    code: 'ISO 9001:2015',
    name: 'Quality Management Systems — Requirements',
    indonesianTitle: 'Sistem Manajemen Mutu — Persyaratan',
    domain: 'MUTU_OPERASIONAL',
    domainLabel: 'Mutu & Manajemen Organisasi',
    badgeColor: 'blue',
    summary: 'Standar manajemen mutu paling diakui di dunia yang menekankan pendekatan proses (Process Approach), kepuasan pelanggan, dan peningkatan berkelanjutan (Plan-Do-Check-Act).',
    hrRelevance: 'Mengatur kompetensi personel (Clause 7.2), kepedulian karyawan (Clause 7.3), infrastruktur kerja (Clause 7.1.3), dan lingkungan kerja operasional (Clause 7.1.4).',
    benefits: [
      'Menstandarkan SOP dan alur kerja di seluruh departemen perusahaan.',
      'Menjamin kualifikasi dan kompetensi karyawan sesuai matriks kebutuhan jabatan.',
      'Mengurangi tingkat kesalahan kerja dan retur layanan/produk.',
      'Meningkatkan kepercayaan klien korporat dan memenuhi syarat tender resmi.'
    ],
    keyClauses: [
      {
        number: 'Klausul 7.1.2',
        name: 'Sumber Daya Manusia (People)',
        requirement: 'Organisasi wajib menentukan dan menyediakan orang-orang yang diperlukan untuk penerapan sistem manajemen mutu yang efektif.',
        hrAction: 'Melakukan analisis beban kerja (Workload Analysis) dan perencanaan jumlah tenaga kerja (Manpower Planning).'
      },
      {
        number: 'Klausul 7.2',
        name: 'Kompetensi (Competence)',
        requirement: 'Menentukan kompetensi yang diperlukan bagi personel, memastikan kompetensi berbasis pendidikan/pelatihan, dan menyimpan bukti terdokumentasi.',
        hrAction: 'Membuat Matriks Kompetensi (Skill Matrix), Training Needs Analysis (TNA), dan arsip sertifikat pelatihan karyawan.'
      },
      {
        number: 'Klausul 7.3',
        name: 'Kepedulian dan Pemahaman (Awareness)',
        requirement: 'Memastikan karyawan memahami Kebijakan Mutu, sasaran mutu divisi, serta kontribusi mereka terhadap efektivitas sistem.',
        hrAction: 'Menyelenggarakan program induksi karyawan baru dan sosialisasi KPI mutu secara berkala.'
      }
    ],
    auditChecklist: [
      'Tersedia Job Description dan Standar Kualifikasi Jabatan untuk setiap posisi.',
      'Tersedia Rencana Pelatihan Tahunan (Annual Training Plan) beserta evaluasi efektivitas pasca pelatihan.',
      'Tersimpan rapi riwayat berkas personalia (CV, ijazah, sertifikasi profesi) sebagai bukti kompetensi.',
      'Karyawan yang diwawancarai auditor dapat menjelaskan peran mereka dalam pencapaian Sasaran Mutu.'
    ],
    practicalTips: 'Pastikan form evaluasi efektivitas pelatihan diisi oleh atasan 1-3 bulan setelah karyawan selesai mengikuti pelatihan eksternal.'
  },

  // 3. ISO 45001:2018 (Occupational Health & Safety)
  {
    id: 'iso-45001-2018',
    code: 'ISO 45001:2018',
    name: 'Occupational Health and Safety Management Systems',
    indonesianTitle: 'Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3)',
    domain: 'K3_LINGKUNGAN',
    domainLabel: 'K3 & Lingkungan Kerja',
    badgeColor: 'amber',
    summary: 'Standar global untuk manajemen Keselamatan dan Kesehatan Kerja (K3), pencegahan cedera, penyakit akibat kerja (PAK), dan penyediaan tempat kerja yang aman dan sehat.',
    hrRelevance: 'Sangat vital untuk HR dalam mengelola program keselamatan kerja, konsultasi & partisipasi karyawan (Clause 5.4), pemeriksaan kesehatan kerja (Medical Check-up), serta prosedur tanggap darurat.',
    benefits: [
      'Menekan angka kecelakaan kerja (Zero Accident) dan hari kerja yang hilang.',
      'Mengurangi klaim biaya kesehatan dan premi asuransi kecelakaan kerja.',
      'Menjamin kepatuhan terhadap UU Keselamatan Kerja No. 1/1970 & PP No. 50/2012 (SMK3).',
      'Meningkatkan moral kerja dan rasa aman karyawan saat beraktivitas.'
    ],
    keyClauses: [
      {
        number: 'Klausul 5.4',
        name: 'Konsultasi dan Partisipasi Pekerja',
        requirement: 'Menyediakan mekanisme, waktu, pelatihan, dan sumber daya untuk konsultasi serta partisipasi aktif perwakilan pekerja non-manajerial.',
        hrAction: 'Membentuk Panitia Pembina Keselamatan dan Kesehatan Kerja (P2K3) Bipartit di perusahaan.'
      },
      {
        number: 'Klausul 6.1.2',
        name: 'Identifikasi Bahaya dan Penilaian Risiko K3 (HIRADC)',
        requirement: 'Mengidentifikasi bahaya fisik, kimia, ergonomis, dan psikososial secara proaktif di semua area kerja.',
        hrAction: 'Menyusun dokumen HIRADC (Hazard Identification, Risk Assessment, and Determining Control) bersama perwakilan divisi.'
      },
      {
        number: 'Klausul 8.2',
        name: 'Kesiapsiagaan dan Tanggap Darurat',
        requirement: 'Menetapkan prosedur merespons situasi darurat (kebakaran, gempa, evakuasi medis, kecelakaan parah).',
        hrAction: 'Melakukan simulasi evakuasi darurat (Fire Drill) minimal 1 kali per tahun dan menunjuk Floor Warden terlatih.'
      }
    ],
    auditChecklist: [
      'Tersedia Kebijakan K3 yang ditandatangani Direktur dan terpampang jelas di area kerja.',
      'Tersedia kotak P3K lengkap dengan daftar inspeksi berkala dan petugas P3K berlisensi Kemnaker.',
      'Tersedia bukti pelaksanaan Medical Check-up (MCU) berkala bagi karyawan.',
      'Tersedia rekaman investigasi kecelakaan kerja (Incident Report) dan tindakan korektif pencegahannya.'
    ],
    practicalTips: 'Sertakan klausul komitmen kepatuhan K3 di dalam Peraturan Perusahaan dan kontrak kerja sebagai kewajiban mutlak disiplin karyawan.'
  },

  // 4. ISO 27001:2022 (Information Security Management)
  {
    id: 'iso-27001-2022',
    code: 'ISO/IEC 27001:2022',
    name: 'Information Security, Cybersecurity and Privacy Protection',
    indonesianTitle: 'Sistem Manajemen Keamanan Informasi (SMKI) & Perlindungan Data',
    domain: 'KEAMANAN_DATA_ETIKA',
    domainLabel: 'Keamanan Informasi & Anti Penyuapan',
    badgeColor: 'rose',
    summary: 'Standar internasional terkemuka untuk mengelola keamanan aset informasi melalui Information Security Management System (ISMS) dan kontrol Annex A yang ketat.',
    hrRelevance: 'Memuat kontrol khusus Kontrol A.6 (People Controls / Human Resource Security) mencakup penyaringan calon karyawan (background screening), syarat kerja NDA, pelatihan security awareness, dan proses offboarding aset.',
    benefits: [
      'Mencegah kebocoran data pelanggan, rahasia dagang, dan data pribadi karyawan.',
      'Kepatuhan penuh terhadap UU No. 27/2022 tentang Perlindungan Data Pribadi (UU PDP).',
      'Memitigasi ancaman keamanan berbasis manusia (phishing, social engineering, pencurian data internal).',
      'Membangun reputasi terpercaya di mata investor, perbankan, dan mitra teknologi.'
    ],
    keyClauses: [
      {
        number: 'Kontrol A.6.1',
        name: 'Penyaringan Latar Belakang (Screening)',
        requirement: 'Pemeriksaan verifikasi latar belakang terhadap seluruh kandidat kerja sesuai hukum ketenagakerjaan dan regulasi privasi.',
        hrAction: 'Menjalankan prosedur background check (riwayat pendidikan, referensi kerja atasan sebelumnya, validitas NIK/KTP).'
      },
      {
        number: 'Kontrol A.6.2',
        name: 'Syarat dan Ketentuan Hubungan Kerja (NDA)',
        requirement: 'Perjanjian kerja harus secara eksplisit menyatakan tanggung jawab keamanan informasi dan kerahasiaan data.',
        hrAction: 'Menyertakan Klausul Perjanjian Kerahasiaan (Non-Disclosure Agreement / NDA) pada setiap kontrak PKWT/PKWTT.'
      },
      {
        number: 'Kontrol A.6.5',
        name: 'Tanggung Jawab Pasca Pengakhiran Kerja (Offboarding)',
        requirement: 'Mencabut seluruh hak akses akun dan mengembalikan seluruh aset informasi saat karyawan resign atau diberhentikan.',
        hrAction: 'Menggunakan Checklist Handover Offboarding: penutupan akun email korporat, VPN, SSO, dan serah terima laptop.'
      }
    ],
    auditChecklist: [
      'Seluruh karyawan telah menandatangani pakta kerahasiaan informasi (NDA tertulis).',
      'Tersedia rekaman kehadiran pelatihan berkala Kesadaran Keamanan Informasi (Information Security Awareness Training).',
      'Tersedia prosedur tindakan disiplin formal untuk pelanggaran keamanan data di dalam Peraturan Perusahaan.',
      'Tersedia formulir bukti serah terima inventaris aset saat karyawan bergabung dan saat berhenti bekerja.'
    ],
    practicalTips: 'Selenggarakan tes simulasi phishing email rutin untuk mengukur tingkat kewaspadaan karyawan dan berikan pelatihan ulang bagi yang belum lolos.'
  },

  // 5. ISO 37001:2016 (Anti-Bribery Management System)
  {
    id: 'iso-37001-2016',
    code: 'ISO 37001:2016',
    name: 'Anti-Bribery Management Systems — Requirements',
    indonesianTitle: 'Sistem Manajemen Anti Penyuapan (SMAP)',
    domain: 'KEAMANAN_DATA_ETIKA',
    domainLabel: 'Keamanan Informasi & Anti Penyuapan',
    badgeColor: 'emerald',
    summary: 'Standar manajemen teruji untuk membantu organisasi mencegah, mendeteksi, dan menangani tindak penyuapan, pemerasan, gratifikasi terlarang, dan konflik kepentingan.',
    hrRelevance: 'HR berperan kunci dalam uji kelayakan personel (Due Diligence Karyawan), deklarasi konflik kepentingan tahunan, pakta integritas, saluran pengaduan (Whistleblowing System), dan sanksi pemutusan hubungan kerja atas pelanggaran korupsi.',
    benefits: [
      'Melindungi korporasi dari pertanggungjawaban pidana korporasi sesuai Perma No. 13/2016.',
      'Menciptakan budaya kerja berintegritas tinggi, bersih, dan transparan.',
      'Memenuhi syarat wajib kemitraan BUMN, instansi pemerintah, dan korporasi multinasional.',
      'Mencegah kerugian finansial akibat fraud internal dan suap pengadaan.'
    ],
    keyClauses: [
      {
        number: 'Klausul 7.2.2',
        name: 'Uji Kelayakan Personel (Employment Due Diligence)',
        requirement: 'Menilai risiko penyuapan sebelum mempekerjakan atau mempromosikan personel ke posisi berisiko tinggi (keuangan, pengadaan, perizinan).',
        hrAction: 'Menerapkan verifikasi rekam jejak integritas khusus untuk posisi Pengadaan (Procurement), Finance, dan Sales.'
      },
      {
        number: 'Klausul 7.3',
        name: 'Kesadaran dan Pelatihan Anti Penyuapan',
        requirement: 'Memberikan pelatihan anti-suap yang memadai dan berkala kepada seluruh personel.',
        hrAction: 'Mengadakan sosialisasi kebijakan Anti-Bribery dan mengumpulkan tanda tangan Deklarasi Pakta Integritas tahunan.'
      },
      {
        number: 'Klausul 8.7',
        name: 'Mekanisme Pelaporan Dugaan Penyuapan (Whistleblowing)',
        requirement: 'Menyediakan saluran pelaporan rahasia yang melindungi pelapor dari pembalasan atau diskriminasi karier.',
        hrAction: 'Mengelola kanal pelaporan aman (email/hotline independen) dan menjamin perlindungan identitas pelapor (Whistleblower Protection).'
      }
    ],
    auditChecklist: [
      'Tersedia Kebijakan Anti Penyuapan & Pedoman Pengendalian Gratifikasi yang disahkan Direksi.',
      'Tersimpan formulir Deklarasi Benturan Kepentingan (Conflict of Interest Declaration) dari seluruh level manajerial.',
      'Klausul pelanggaran penyuapan dan gratifikasi tercantum jelas sebagai Pelanggaran Berat dalam Peraturan Perusahaan.',
      'Tersedia bukti investigasi independen terhadap setiap laporan pengaduan pelanggaran etika.'
    ],
    practicalTips: 'Tetapkan batas nominal hadiah/cendera mata wajar (misal maks Rp 500.000) dan wajibkan pelaporan ke Tim Kepatuhan Etika melalui form deklarasi hadiah.'
  },

  // 6. ISO 30401:2018 (Knowledge Management Systems)
  {
    id: 'iso-30401-2018',
    code: 'ISO 30401:2018',
    name: 'Knowledge Management Systems — Requirements',
    indonesianTitle: 'Sistem Manajemen Pengetahuan (Knowledge Management)',
    domain: 'HRM_TALENT_DIVERSITY',
    domainLabel: 'Human Resource Management & D&I',
    badgeColor: 'indigo',
    summary: 'Standar manajemen untuk menciptakan, menyimpan, mentransfer, dan menerapkan pengetahuan organisasi secara sistematis agar tidak hilang saat terjadi pergantian karyawan.',
    hrRelevance: 'Menjadi fondasi program suksesi (Succession Planning), offboarding knowledge transfer, standardisasi dokumentasi operasional, dan continuous learning budaya perusahaan.',
    benefits: [
      'Mencegah hilangnya critical institutional knowledge saat karyawan senior/kunci resign.',
      'Mempercepat waktu adaptasi (time-to-productivity) bagi karyawan baru yang bergabung.',
      'Mendorong inovasi kolaboratif lintas divisi dan standardisasi best practices perusahaan.',
      'Meningkatkan efisiensi kerja tanpa perlu mengulang kesalahan masa lalu.'
    ],
    keyClauses: [
      {
        number: 'Klausul 4.4',
        name: 'Siklus Hidup Pengetahuan (Knowledge Life Cycle)',
        requirement: 'Organisasi harus mengelola tahapan: memperoleh pengetahuan baru, membagikan, memvalidasi, dan memperbarui pengetahuan.',
        hrAction: 'Membangun Corporate Wiki / Knowledge Base portal yang mudah diakses dan dikontribusikan oleh karyawan.'
      },
      {
        number: 'Klausul 4.5',
        name: 'Budaya Berbagi Pengetahuan (Knowledge Culture)',
        requirement: 'Menciptakan lingkungan yang menghargai keterbukaan, kolaborasi, dan kemauan berbagi ilmu.',
        hrAction: 'Mengadakan sesi sharing rutin (Brown Bag Sessions, Tech Talks, Mentoring Program).'
      },
      {
        number: 'Klausul 8.1',
        name: 'Transfer Pengetahuan Saat Transisi Karyawan',
        requirement: 'Memastikan handover pengetahuan eksplisit dan implisit dilakukan sebelum pengakhiran hubungan kerja.',
        hrAction: 'Mewajibkan dokumen Handover of Duties dan sesi video recording transfer keahlian pada masa 30 hari notice resign.'
      }
    ],
    auditChecklist: [
      'Tersedia SOP Knowledge Transfer tertulis untuk proses mutasi, promosi, dan offboarding karyawan.',
      'Tersedia repositori dokumentasi kerja terpusat yang terorganisir per divisi.',
      'Terdapat program apresiasi/insentif bagi Subject Matter Expert (SME) internal yang aktif membagikan ilmu.',
      'Adanya metrik evaluasi pemanfaatan Knowledge Management dalam proses onboarding karyawan baru.'
    ],
    practicalTips: 'Jadikan pembuatan dokumentasi dan sharing session sebagai salah satu Key Performance Indicator (KPI) tahunan bagi posisi Senior dan Lead.'
  },

  // 7. ISO 30405:2016 (HRM - Guidelines on Recruitment)
  {
    id: 'iso-30405-2016',
    code: 'ISO 30405:2016',
    name: 'Human Resource Management — Guidelines on Recruitment',
    indonesianTitle: 'Manajemen Sumber Daya Manusia — Panduan Standar Rekrutmen',
    domain: 'HRM_TALENT_DIVERSITY',
    domainLabel: 'Human Resource Management & D&I',
    badgeColor: 'blue',
    summary: 'Panduan internasional komprehensif mengenai proses penarikan, penyaringan, wawancara, dan seleksi kandidat yang efektif, etis, terukur, dan berstandar profesional.',
    hrRelevance: 'Standar acuan divisi Talent Acquisition dalam menyusun alur rekrutmen objektif, standarisasi wawancara, perlindungan privasi pelamar, dan pengukuran efisiensi rekrutmen (Time-to-Hire, Cost-per-Hire).',
    benefits: [
      'Meningkatkan rasio kecocokan kualitas kandidat (Quality of Hire).',
      'Memberikan pengalaman kandidat (Candidate Experience) yang positif dan profesional.',
      'Menghindari risiko sengketa ketenagakerjaan pra-kerja dan diskriminasi rekrutmen.',
      'Mengoptimalkan efisiensi anggaran biaya rekrutmen perusahaan.'
    ],
    keyClauses: [
      {
        number: 'Panduan 4',
        name: 'Perencanaan dan Identifikasi Kebutuhan Rekrutmen',
        requirement: 'Menganalisis profil kompetensi jabatan yang jelas sebelum membuka lowongan pekerjaan ke publik.',
        hrAction: 'Menyusun Job Description dan Job Specification terverifikasi sebelum penayangan iklan lowongan.'
      },
      {
        number: 'Panduan 5',
        name: 'Pencarian dan Penarikan Kandidat (Attraction & Sourcing)',
        requirement: 'Menggunakan saluran rekrutmen yang etis, transparan, dan menjangkau keragaman kandidat secara luas.',
        hrAction: 'Mengumumkan lowongan melalui kanal resmi karir perusahaan dan portal rekrutmen terverifikasi.'
      },
      {
        number: 'Panduan 6',
        name: 'Penyaringan, Asesmen dan Seleksi Objektif',
        requirement: 'Menerapkan alat tes dan wawancara yang telah tervalidasi relevansinya dengan tugas pekerjaan sesungguhnya.',
        hrAction: 'Menggunakan tes teknis terstandarisasi, wawancara behavioral (STAR method), dan panel reviewer lebih dari 1 orang.'
      }
    ],
    auditChecklist: [
      'Tersedia SOP Alur Rekrutmen dan Seleksi Karyawan tertulis yang disetujui manajemen.',
      'Tersedia lembar penilaian wawancara terstandarisasi yang mendokumentasikan alasan penerimaan/penolakan kandidat.',
      'Tersedia format surat penawaran kerja resmi (Offering Letter) yang mencantumkan detail kompensasi transparan.',
      'Tersedia prosedur perlindungan data pribadi dan penghapusan CV pelamar yang tidak terpilih secara aman.'
    ],
    practicalTips: 'Selalu berikan kabar hasil seleksi (feedback notification) kepada seluruh kandidat yang telah diwawancarai untuk menjaga reputasi employer branding.'
  },

  // 8. ISO 30409:2016 (HRM - Workforce Planning)
  {
    id: 'iso-30409-2016',
    code: 'ISO 30409:2016',
    name: 'Human Resource Management — Workforce Planning',
    indonesianTitle: 'Manajemen Sumber Daya Manusia — Perencanaan Tenaga Kerja (Workforce Planning)',
    domain: 'HRM_TALENT_DIVERSITY',
    domainLabel: 'Human Resource Management & D&I',
    badgeColor: 'indigo',
    summary: 'Panduan terstruktur untuk memprediksi, merencanakan, dan menyelaraskan kapasitas serta kapabilitas tenaga kerja dengan strategi jangka panjang bisnis perusahaan.',
    hrRelevance: 'Pedoman bagi HR Strategis dalam menyusun Manpower Planning (MPP), analisis kesenjangan keterampilan (Skill Gap Analysis), dan perencanaan suksesi kepemimpinan.',
    benefits: [
      'Menghindari kelebihan atau kekurangan tenaga kerja (overstaffing/understaffing).',
      'Mengantisipasi pergeseran kebutuhan keahlian akibat transformasi digital dan otomatisasi.',
      'Mengurangi ketergantungan pada rekrutmen mendesak yang berbiaya mahal.',
      'Menyelaraskan anggaran biaya personalia (Personnel Expenses) dengan target pendapatan perusahaan.'
    ],
    keyClauses: [
      {
        number: 'Klausul 4',
        name: 'Analisis Permintaan Tenaga Kerja (Demand Forecasting)',
        requirement: 'Memproyeksikan kebutuhan jumlah dan tipe keahlian tenaga kerja berdasarkan rencana ekspansi bisnis.',
        hrAction: 'Mengadakan rapat tahunan Manpower Planning bersama seluruh Kepala Divisi.'
      },
      {
        number: 'Klausul 5',
        name: 'Analisis Pasokan Internal dan Eksternal (Supply Analysis)',
        requirement: 'Mengevaluasi ketersediaan talenta internal saat ini (turnover rate, usia pensiun, kesiapan promosi).',
        hrAction: 'Menyusun Nine-Box Matrix (Talent Mapping) untuk memetakan karyawan berpotensi tinggi (High Performers & High Potentials).'
      },
      {
        number: 'Klausul 6',
        name: 'Rencana Penutupan Kesenjangan (Gap Closing Strategy)',
        requirement: 'Menentukan strategi pemenuhan tenaga kerja: Buy (rekrutmen), Build (pelatihan/upskilling), Borrow (konsultan/freelance), atau Bound (retensi).',
        hrAction: 'Membuat program akselerasi kepemimpinan (Management Trainee / Leadership Development Program).'
      }
    ],
    auditChecklist: [
      'Tersedia Dokumen Rencana Tenaga Kerja Tahunan (Manpower Plan) yang disetujui Direksi.',
      'Tersedia data analisis beban kerja (Workload Analysis / Full Time Equivalent - FTE) per departemen.',
      'Tersedia Peta Suksesi (Succession Plan) untuk minimal 100% posisi kunci (Key Executive & Managerial Roles).',
      'Tersedia metrik evaluasi akurasi perencanaan tenaga kerja (Budget vs Actual Headcount).'
    ],
    practicalTips: 'Tinjau Manpower Plan setiap kuartal (Quarterly Review) untuk menyesuaikan dengan dinamika pasar dan performa aktual bisnis.'
  },

  // 9. ISO 14001:2015 (Environmental Management System)
  {
    id: 'iso-14001-2015',
    code: 'ISO 14001:2015',
    name: 'Environmental Management Systems — Requirements',
    indonesianTitle: 'Sistem Manajemen Lingkungan (SML)',
    domain: 'K3_LINGKUNGAN',
    domainLabel: 'K3 & Lingkungan Kerja',
    badgeColor: 'emerald',
    summary: 'Standar internasional untuk mengelola dampak lingkungan hidup dari aktivitas operasional perusahaan, efisiensi energi, pengelolaan limbah, dan kepatuhan regulasi lingkungan.',
    hrRelevance: 'HR bertindak sebagai motor penggerak Green HR Management, pelatihan kepedulian lingkungan (Clause 7.3), kampanye hemat energi di kantor, dan kepatuhan pengelolaan limbah B3/elektronik perkantoran.',
    benefits: [
      'Mengurangi biaya operasional melalui program efisiensi listrik, kertas, dan air.',
      'Meningkatkan kepatuhan terhadap regulasi lingkungan hidup (AMDAL/UKL-UPL).',
      'Mendorong keterlibatan karyawan dalam program keberlanjutan (Sustainability Initiatives).',
      'Meningkatkan skor keberlanjutan ESG perusahaan di mata investor.'
    ],
    keyClauses: [
      {
        number: 'Klausul 7.2 & 7.3',
        name: 'Kompetensi dan Kesadaran Lingkungan Karyawan',
        requirement: 'Memastikan personel yang pekerjaannya berdampak pada lingkungan memiliki kompetensi dan memahami dampak tindakan mereka.',
        hrAction: 'Mengadakan modul pelatihan pemilahan sampah, konservasi energi, dan keselamatan penanganan bahan kimia.'
      },
      {
        number: 'Klausul 8.1',
        name: 'Pengendalian Operasional Lingkungan di Tempat Kerja',
        requirement: 'Menerapkan prosedur kerja yang mengendalikan timbulan limbah dan emisi.',
        hrAction: 'Menerapkan kebijakan Paperless Office digital HR, penggunaan tumbler pribadi, dan pengelolaan limbah elektronik (e-waste).'
      }
    ],
    auditChecklist: [
      'Tersedia Kebijakan Lingkungan tertulis yang dikomunikasikan kepada seluruh karyawan.',
      'Tersedia program kerja Green Office terukur (pengurangan konsumsi kertas dan plastik sekali pakai).',
      'Tersedia catatan pelatihan penanganan tumpahan bahan kimia / limbah bagi staf operasional terkait.'
    ],
    practicalTips: 'Gunakan tanda tangan digital dan form online di HRMatrix untuk mewujudkan inisiatif kantor 100% paperless.'
  },

  // 10. ISO 26000:2010 (Social Responsibility & Labor Practices)
  {
    id: 'iso-26000-2010',
    code: 'ISO 26000:2010',
    name: 'Guidance on Social Responsibility (CSR & Labor Practices)',
    indonesianTitle: 'Panduan Tanggung Jawab Sosial — Praktik Ketenagakerjaan & Hak Asasi Manusia',
    domain: 'HRM_TALENT_DIVERSITY',
    domainLabel: 'Human Resource Management & D&I',
    badgeColor: 'purple',
    summary: 'Panduan standar global mengenai prinsip tanggung jawab sosial korporasi (CSR) dengan fokus mendalam pada Core Subject: Labor Practices (Praktik Ketenagakerjaan yang Adil) dan Human Rights (Hak Asasi Manusia).',
    hrRelevance: 'Menjadi acuan etis HR dalam memastikan upah layak (Living Wage), jam kerja manusiawi, dialog sosial bipartit yang sehat, larangan pekerja anak & kerja paksa, serta keselamatan kerja menyeluruh.',
    benefits: [
      'Mencegah risiko pelanggaran HAM dan reputasi buruk akibat eksploitasi pekerja rantai pasok.',
      'Membangun hubungan industrial yang harmonis dengan serikat pekerja dan komunitas sekitar.',
      'Memenuhi standar audit etika sosial global (seperti SEDEX / SMETA / BSCI).',
      'Meningkatkan loyalitas dan kebanggaan karyawan terhadap nilai-nilai luhur perusahaan.'
    ],
    keyClauses: [
      {
        number: 'Subjek Inti 6.4',
        name: 'Praktik Ketenagakerjaan yang Bertanggung Jawab (Labor Practices)',
        requirement: 'Menjamin kondisi kerja yang layak, upah yang adil, perlindungan sosial, dan kebebasan berserikat.',
        hrAction: 'Memastikan upah pokok dan lembur dibayarkan sesuai standar hukum tanpa potongan sepihak yang melanggar aturan.'
      },
      {
        number: 'Subjek Inti 6.3',
        name: 'Hak Asasi Manusia di Tempat Kerja (Human Rights)',
        requirement: 'Menolak segala bentuk kerja paksa, penahanan dokumen asli tanpa hak, diskriminasi, dan pekerja di bawah umur.',
        hrAction: 'Memverifikasi usia pelamar minimal 18 tahun dan melarang penahanan ijazah asli tanpa persetujuan serta jaminan ganti rugi.'
      }
    ],
    auditChecklist: [
      'Tidak ada praktik penahanan dokumen identitas asli (KTP/Ijazah) yang melanggar kebebasan pekerja.',
      'Semua karyawan memiliki kontrak kerja tertulis yang salinannya dipegang oleh masing-masing pihak.',
      'Tersedia mekanisme dialog sosial berkala antara pimpinan manajemen dan perwakilan pekerja.',
      'Adanya program Corporate Social Responsibility (CSR) yang melibatkan partisipasi aktif sukarelawan karyawan.'
    ],
    practicalTips: 'Lakukan audit berkala terhadap vendor pihak ketiga dan penyedia alih daya (outsourcing) untuk memastikan mereka memperlakukan pekerja sesuai prinsip ISO 26000.'
  },

  // 11. ISO 22301:2019 (Business Continuity Management)
  {
    id: 'iso-22301-2019',
    code: 'ISO 22301:2019',
    name: 'Security and Resilience — Business Continuity Management Systems',
    indonesianTitle: 'Sistem Manajemen Kelangsungan Bisnis (SMKB)',
    domain: 'KELANGSUNGAN_BISNIS',
    domainLabel: 'Kelangsungan Bisnis & Resiliensi',
    badgeColor: 'amber',
    summary: 'Standar untuk merencanakan, menetapkan, menerapkan, dan memelihara sistem manajemen kelangsungan bisnis guna melindungi organisasi dari gangguan tak terduga (bencana alam, pandemi, krisis operasional, pemadaman server).',
    hrRelevance: 'HR bertanggung jawab atas People Continuity: skema kerja darurat (WFH / Split Team), keselamatan karyawan saat krisis (Crisis Communication & Accountability), dan penetapan personel kunci pengganti (Successor Roles).',
    benefits: [
      'Menjamin keselamatan seluruh karyawan saat terjadi situasi krisis darurat.',
      'Menjaga kelangsungan pembayaran payroll dan layanan operasional penting tanpa terputus.',
      'Mempercepat waktu pemulihan organisasi pasca krisis (Recovery Time Objective - RTO).',
      'Meningkatkan kesiapan mental dan ketangguhan (resilience) karyawan dalam menghadapi disrupsi.'
    ],
    keyClauses: [
      {
        number: 'Klausul 8.2',
        name: 'Analisis Dampak Bisnis dan Penilaian Risiko SDM (BIA)',
        requirement: 'Mengidentifikasi aktivitas penting dan sumber daya manusia kunci yang dibutuhkan untuk menjaga kelangsungan bisnis minimum.',
        hrAction: 'Memetakan Critical Roles & Minimum Headcount yang wajib beroperasi saat kondisi darurat.'
      },
      {
        number: 'Klausul 8.4',
        name: 'Rencana dan Prosedur Kelangsungan Bisnis (BCP)',
        requirement: 'Menyusun prosedur evakuasi, komunikasi krisis, dan pemulihan operasi dengan strategi alternatif kerja.',
        hrAction: 'Menyusun SOP Pandemi / Krisis, protokol WFH darurat, dan Call Tree darurat untuk memverifikasi keselamatan staf (Headcount Accountability).'
      }
    ],
    auditChecklist: [
      'Tersedia Dokumen Business Continuity Plan (BCP) pilar Human Resources tertulis.',
      'Tersedia daftar kontak darurat seluruh karyawan (Emergency Contact List) yang diperbarui minimal setiap 6 bulan.',
      'Telah dilakukan simulasi uji coba skema kerja darurat / WFH (BCP Simulation Drill) minimal 1 kali per tahun.',
      'Sistem penggajian (Payroll) memiliki prosedur cadangan darurat (Backup Payroll Processing) jika sistem utama terganggu.'
    ],
    practicalTips: 'Simpan salinan offline daftar kontak darurat dan master data karyawan pada media terenkripsi yang aman untuk antisipasi pemadaman listrik/server total.'
  }
];
