import { TestQuestion } from '../types';

// ============================================================================
// BANK SOAL: SITUATIONAL JUDGEMENT TEST (SJT), ETIKA, INTEGRITAS & KEPATUHAN SOP
// SEMUA SOAL MENGGUNAKAN STANDAR PILIHAN GANDA 4 OPSI (A, B, C, D)
// ============================================================================
export const situationalQuestionBank: TestQuestion[] = [
  {
    id: 'sjt-1',
    number: 1,
    scenario: 'Menjelang batas akhir pengiriman laporan bulanan ke klien penting, Anda menemukan kesalahan perhitungan data signifikan yang dibuat oleh rekan satu tim Anda. Memperbaiki kesalahan ini akan memakan waktu 2 jam dan berisiko membuat laporan terlambat 30 menit dari tenggat waktu.',
    questionText: 'Tindakan manakah yang paling tepat Anda lakukan?',
    questionType: 'multiple_choice_4',
    category: 'situational',
    correctOptionId: 's1-b',
    tags: ['Integritas Laporan', 'Komunikasi Klien', 'Standar Mutu'],
    explanation: 'Transparansi kualitas dan komunikasi proaktif ke klien adalah standar tertinggi etika profesional daripada mengirim data cacat.',
    options: [
      { id: 's1-a', label: 'A', text: 'Mengirimkan laporan apa adanya tepat waktu agar tidak melanggar SLA, lalu merevisi kesalahan tersebut besok secara diam-diam.', score: 0 },
      { id: 's1-b', label: 'B', text: 'Segera menginformasikan rekan tim dan atasan, mengoreksi data secara akurat, serta proaktif memberi tahu klien bahwa laporan sedang difinalisasi untuk memastikan presisi data tertinggi.', score: 10 },
      { id: 's1-c', label: 'C', text: 'Menyerahkan kembali seluruh dokumen ke rekan yang bersalah dan memintanya bertanggung jawab menyelesaikannya sendiri.', score: 2 },
      { id: 's1-d', label: 'D', text: 'Mengabaikan kesalahan tersebut karena bukan tugas utama Anda yang menghitung data tersebut.', score: 0 }
    ]
  },
  {
    id: 'sjt-2',
    number: 2,
    scenario: 'Seorang vendor mitra perusahaan menawarkan bingkisan hadiah pribadi bernilai mahal menjelang proses seleksi perpanjangan kontrak pengadaan barang tahunan.',
    questionText: 'Bagaimana sikap berintegritas yang Anda ambil terhadap pemberian tersebut?',
    questionType: 'multiple_choice_4',
    category: 'situational',
    correctOptionId: 's2-c',
    tags: ['Anti-Gratifikasi', 'Benturan Kepentingan', 'Etika Bisnis'],
    explanation: 'Menolak gratifikasi secara santun dan melaporkannya ke atasan/divisi kepatuhan adalah bentuk integritas anti-suap.',
    options: [
      { id: 's2-a', label: 'A', text: 'Menerima hadiah tersebut karena itu adalah bentuk silaturahmi wajar asalkan tidak mempengaruhi keputusan seleksi.', score: 0 },
      { id: 's2-b', label: 'B', text: 'Menerima hadiah tersebut lalu membagikannya ke seluruh anggota divisi agar tidak dinikmati sendiri.', score: 2 },
      { id: 's2-c', label: 'C', text: 'Menolak hadiah tersebut secara sopan, menjelaskan kebijakan anti-gratifikasi perusahaan, dan melaporkan kejadian ini kepada atasan / divisi kepatuhan.', score: 10 },
      { id: 's2-d', label: 'D', text: 'Meminta vendor mengganti hadiah pribadi tersebut menjadi voucher belanja umum.', score: 0 }
    ]
  },
  {
    id: 'sjt-3',
    number: 3,
    scenario: 'Dua orang anggota tim Anda terlibat pertengkaran sengit mengenai pembagian beban kerja dalam proyek bersama, yang mulai mengganggu suasana kerja divisi dan memperlambat pencapaian milestone proyek.',
    questionText: 'Langkah manakah yang paling konstruktif untuk Anda ambil?',
    questionType: 'multiple_choice_4',
    category: 'situational',
    correctOptionId: 's3-a',
    tags: ['Resolusi Konflik', 'Teamwork', 'Manajemen Tim'],
    explanation: 'Mediasi objektif dengan mendengarkan kedua belah pihak secara terpisah lalu mempertemukannya pada matriks tugas terukur adalah solusi profesional.',
    options: [
      { id: 's3-a', label: 'A', text: 'Mengajak kedua rekan bicara secara terpisah untuk mendengar sudut pandang masing-masing, lalu memfasilitasi diskusi bersama dengan matriks pembagian tanggung jawab (RACI) yang jelas dan adil.', score: 10 },
      { id: 's3-b', label: 'B', text: 'Membiarkan mereka menyelesaikan masalah sendiri karena mereka adalah orang dewasa profesional.', score: 0 },
      { id: 's3-c', label: 'C', text: 'Langsung melaporkan pertengkaran mereka ke HRD agar keduanya dijatuhi surat peringatan disiplin.', score: 2 },
      { id: 's3-d', label: 'D', text: 'Mengambil alih seluruh pekerjaan mereka agar proyek lekas selesai tanpa memedulikan konflik mereka.', score: 3 }
    ]
  },
  {
    id: 'sjt-4',
    number: 4,
    scenario: 'Atasan langsung Anda meminta Anda merevisi tanggal nota transaksi pembayaran mundur ke bulan sebelumnya agar target pembukuan kuartal divisi tampak memenuhi target KPI direksi.',
    questionText: 'Bagaimana tindakan berintegritas yang Anda ambil?',
    questionType: 'multiple_choice_4',
    category: 'situational',
    correctOptionId: 's4-b',
    tags: ['Integritas Akuntansi', 'Tekanan Atasan', 'Audit Compliance'],
    explanation: 'Menolak pemalsuan tanggal secara santun dengan berpegang pada standar audit kepatuhan, serta berdiskusi terbuka tentang alternatif solusi legal.',
    options: [
      { id: 's4-a', label: 'A', text: 'Mematuhi arahan tersebut karena perintah atasan wajib dilaksanakan oleh bawahan tanpa bantahan.', score: 0 },
      { id: 's4-b', label: 'B', text: 'Menjelaskan secara santun namun tegas bahwa memanipulasi tanggal melanggar standar audit kepatuhan dan berisiko hukum, lalu menawarkan alternatif penyajian laporan sesuai tanggal riil.', score: 10 },
      { id: 's4-c', label: 'C', text: 'Menolak secara kasar di depan rekan-rekan kerja dan langsung memviralkan hal ini di media sosial.', score: 0 },
      { id: 's4-d', label: 'D', text: 'Mengundurkan diri tanpa membicarakan risiko kepatuhan tersebut terlebih dahulu.', score: 2 }
    ]
  },
  {
    id: 'sjt-5',
    number: 5,
    scenario: 'Seorang klien VIP menghubungi Anda pada akhir pekan dalam keadaan sangat marah karena layanan sistem aplikasi perusahaan yang digunakannya mengalami down total dan mengancam akan membatalkan kontrak bernilai miliaran rupiah.',
    questionText: 'Langkah pertama yang paling tepat Anda lakukan adalah:',
    questionType: 'multiple_choice_4',
    category: 'situational',
    correctOptionId: 's5-b',
    tags: ['Manajemen Krisis', 'De-eskalasi Klien', 'Ketahanan Emosi'],
    explanation: 'Mendengarkan aktif, menyampaikan empati profesional tanpa defensif, berjanji mengawal eskalasi darurat, dan memberikan update berkala terukur.',
    options: [
      { id: 's5-a', label: 'A', text: 'Menjelaskan bahwa hari ini adalah hari libur dan memintanya menghubungi tim customer service pada hari kerja.', score: 0 },
      { id: 's5-b', label: 'B', text: 'Mendengarkan keluhan klien dengan empati penuh tanpa memotong, mencatat detail kegagalan sistem, segera mengoordinasikan tim teknis on-call darurat, dan menjanjikan update progres dalam 30 menit.', score: 10 },
      { id: 's5-c', label: 'C', text: 'Menyalahkan tim IT perusahaan di depan klien agar Anda tidak dianggap bersalah.', score: 0 },
      { id: 's5-d', label: 'D', text: 'Mematikan telepon untuk menghindari luapan emosi klien yang berlebihan.', score: 0 }
    ]
  },
  {
    id: 'sjt-6',
    number: 6,
    scenario: 'Anda secara tidak sengaja melihat dokumen slip gaji dan bonus eksekutif rekan kerja yang tertinggal di atas meja printer kantor terbuka.',
    questionText: 'Bagaimana tindakan etis yang harus Anda lakukan?',
    questionType: 'multiple_choice_4',
    category: 'situational',
    correctOptionId: 's6-a',
    tags: ['Kerahasiaan Data', 'Etika Kantor', 'Integritas'],
    explanation: 'Menjaga kerahasiaan dokumen sensitif dan mengembalikannya langsung ke pemiliknya dalam map tertutup tanpa menyebarkannya.',
    options: [
      { id: 's6-a', label: 'A', text: 'Mengambil dokumen tersebut tanpa membaca isinya lebih lanjut, menyimpannya dalam amplop tertutup, dan mengembalikannya langsung secara privat kepada pemilik dokumen.', score: 10 },
      { id: 's6-b', label: 'B', text: 'Membaca rincian gajinya lalu mendiskusikannya dengan rekan-rekan kerja untuk membandingkan standar gaji kantor.', score: 0 },
      { id: 's6-c', label: 'C', text: 'Memotret dokumen tersebut sebagai bahan negosiasi kenaikan gaji Anda kepada atasan.', score: 0 },
      { id: 's6-d', label: 'D', text: 'Membiarkannya tetap tergeletak di atas meja printer karena bukan urusan Anda.', score: 2 }
    ]
  },
  {
    id: 'sjt-7',
    number: 7,
    scenario: 'Perusahaan meluncurkan sistem perangkat lunak baru yang kompleks untuk menggantikan sistem lama. Beberapa rekan kerja senior menolak menggunakan sistem tersebut dan tetap menggunakan cara manual yang memperlambat konsolidasi data divisi.',
    questionText: 'Bagaimana kontribusi proaktif Anda untuk mendorong adopsi teknologi tersebut?',
    questionType: 'multiple_choice_4',
    category: 'situational',
    correctOptionId: 's7-c',
    tags: ['Manajemen Perubahan', 'Agility', 'Kepemimpinan Informal'],
    explanation: 'Menjadi teladan pengguna awal, mendengarkan kendala rekan senior, dan membuat panduan praktis singkat untuk membantu adaptasi mereka.',
    options: [
      { id: 's7-a', label: 'A', text: 'Ikut-ikutan menggunakan cara manual agar tercipta solidaritas dengan rekan senior.', score: 0 },
      { id: 's7-b', label: 'B', text: 'Mengejek rekan senior yang lambat beradaptasi dengan teknologi digital.', score: 0 },
      { id: 's7-c', label: 'C', text: 'Menguasai sistem baru tersebut, membuat ringkasan panduan praktis 1 lembar, dan menawarkan sesi pendampingan santai bagi rekan senior yang mengalami kesulitan.', score: 10 },
      { id: 's7-d', label: 'D', text: 'Membiarkan divisi kepatuhan dan IT memberikan sanksi kepada rekan-rekan tersebut.', score: 2 }
    ]
  }
];
