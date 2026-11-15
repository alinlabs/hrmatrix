import { TestQuestion } from '../types';

// ============================================================================
// BANK SOAL: KEPEMIMPINAN, MANAJEMEN TIM, DELEGASI & TURNAROUND (LEADERSHIP)
// SEMUA SOAL MENGGUNAKAN STANDAR PILIHAN GANDA 4 OPSI (A, B, C, D)
// ============================================================================
export const leadershipQuestionBank: TestQuestion[] = [
  {
    id: 'ldr-1',
    number: 1,
    scenario: 'Salah satu staf senior terbaik di tim Anda yang biasanya berkinerja luar biasa, tiba-tiba mengalami penurunan produktivitas tajam selama dua minggu berturut-turut dan tampak murung.',
    questionText: 'Sebagai manajer/leader, tindakan pertama apa yang paling tepat Anda ambil?',
    questionType: 'multiple_choice_4',
    category: 'leadership',
    correctOptionId: 'l1-b',
    tags: ['People Management', 'Empati', 'One-on-One'],
    explanation: 'Sesi one-on-one privat dengan pendekatan empatik membuka ruang komunikasi sebelum mengambil tindakan formal.',
    options: [
      { id: 'l1-a', label: 'A', text: 'Menegurnya di depan rapat evaluasi tim agar staf lain menyadari bahwa standar kinerja tidak boleh turun.', score: 0 },
      { id: 'l1-b', label: 'B', text: 'Mengajaknya berdiskusi empatik secara privat (One-on-One) dalam suasana santai untuk memahami kendala yang sedang dihadapinya serta menawarkan bantuan yang memungkinkan.', score: 10 },
      { id: 'l1-c', label: 'C', text: 'Langsung menerbitkan Surat Peringatan (SP 1) agar ia lekas memperbaiki kinerjanya.', score: 0 },
      { id: 'l1-d', label: 'D', text: 'Mengurangi beban kerjanya secara permanen dan memberikannya kepada staf junior tanpa berdiskusi.', score: 2 }
    ]
  },
  {
    id: 'ldr-2',
    number: 2,
    scenario: 'Manajemen puncak menetapkan perubahan sistem operasional baru yang harus segera diterapkan dalam sebulan. Mayoritas anggota tim Anda menunjukkan resistensi dan keengganan karena merasa sistem lama sudah nyaman.',
    questionText: 'Bagaimana pendekatan Anda memimpin transisi perubahan ini?',
    questionType: 'multiple_choice_4',
    category: 'leadership',
    correctOptionId: 'l2-c',
    tags: ['Change Management', 'Visi', 'Komunikasi Strategis'],
    explanation: 'Menjelaskan visi "mengapa perubahan diperlukan" (*the why*), memfasilitasi pelatihan, dan mendengarkan kekhawatiran tim meminimalkan resistensi.',
    options: [
      { id: 'l2-a', label: 'A', text: 'Mengancam akan memotong insentif siapa pun yang menolak atau lambat mempelajari sistem baru.', score: 0 },
      { id: 'l2-b', label: 'B', text: 'Mengabaikan keluhan mereka dan memaksakan sistem baru berjalan tepat tanggal yang ditentukan.', score: 2 },
      { id: 'l2-c', label: 'C', text: 'Mengadakan sesi townhall tim untuk menjelaskan latar belakang strategis dan manfaat jangka panjang perubahan tersebut, serta menyusun program pelatihan bertahap dengan mendengarkan kekhawatiran tim.', score: 10 },
      { id: 'l2-d', label: 'D', text: 'Menolak arahan manajemen puncak untuk membela kenyamanan anggota tim Anda.', score: 0 }
    ]
  },
  {
    id: 'ldr-3',
    number: 3,
    scenario: 'Anda memiliki penugasan proyek baru berskala besar dengan batas waktu ketat. Anda memiliki seorang staf junior yang berbakat tetapi belum pernah menangani proyek sebesar ini sendirian.',
    questionText: 'Bagaimana Anda mendelegasikan tugas tersebut secara efektif?',
    questionType: 'multiple_choice_4',
    category: 'leadership',
    correctOptionId: 'l3-a',
    tags: ['Delegasi Terstruktur', 'Mentoring', 'Pengembangan Staf'],
    explanation: 'Delegasi terstruktur dengan pendampingan (*milestone review*) memberikan ruang pertumbuhan bagi staf tanpa mengorbankan keamanan proyek.',
    options: [
      { id: 'l3-a', label: 'A', text: 'Memberikan mandat tugas tersebut dengan rincian objective yang jelas, menetapkan jadwal evaluasi berkala (checkpoint mingguan), dan menyediakan waktu konsultasi pendampingan saat ia menemui hambatan.', score: 10 },
      { id: 'l3-b', label: 'B', text: 'Menyerahkan tugas tersebut sepenuhnya tanpa perlu mengecek hingga hari tenggat waktu agar ia belajar dari pengalaman.', score: 0 },
      { id: 'l3-c', label: 'C', text: 'Mengerjakan sendiri seluruh proyek tersebut karena khawatir staf junior akan melakukan kesalahan fatal.', score: 2 },
      { id: 'l3-d', label: 'D', text: 'Mengawasi setiap jam dan mengatur setiap langkah teknisnya secara mendetail (micromanagement ketat).', score: 3 }
    ]
  },
  {
    id: 'ldr-4',
    number: 4,
    scenario: 'Terjadi kesalahan fatal dalam pengiriman laporan data ke direksi yang disebabkan oleh keteledoran salah satu anggota divisi Anda. Direktur utama memanggil Anda untuk meminta pertanggungjawaban.',
    questionText: 'Sebagai seorang pemimpin divisi, sikap akuntabilitas manakah yang harus Anda tunjukkan?',
    questionType: 'multiple_choice_4',
    category: 'leadership',
    correctOptionId: 'l4-b',
    tags: ['Extreme Ownership', 'Akuntabilitas', 'Integritas Leader'],
    explanation: 'Seorang pemimpin sejati mengambil tanggung jawab penuh atas kesalahan tim di depan manajemen (*Extreme Ownership*), lalu membina anggota tim secara internal.',
    options: [
      { id: 'l4-a', label: 'A', text: 'Langsung menyebutkan nama staf yang bersalah di depan direktur utama agar reputasi kepemimpinan Anda tidak tercemar.', score: 0 },
      { id: 'l4-b', label: 'B', text: 'Mengakui tanggung jawab kepemimpinan penuh atas kegagalan tersebut di depan direksi, menyampaikan langkah perbaikan darurat yang telah diambil, dan melakukan coaching internal kepada staf terkait.', score: 10 },
      { id: 'l4-c', label: 'C', text: 'Menyalahkan keterbatasan waktu dan beban kerja yang terlalu tinggi sebagai pembelaan.', score: 2 },
      { id: 'l4-d', label: 'D', text: 'Membela kesalahan tersebut dan menganggap kesalahan kecil adalah hal yang wajar dalam bekerja.', score: 0 }
    ]
  },
  {
    id: 'ldr-5',
    number: 5,
    scenario: 'Sebuah proyek tim mengalami kegagalan memenuhi target kuartal karena adanya ketidakcocokan cara kerja antara staf generasi senior dan staf generasi muda (Gen Z).',
    questionText: 'Bagaimana langkah Anda membangun keharmonisan dan sinergi lintas generasi di dalam tim?',
    questionType: 'multiple_choice_4',
    category: 'leadership',
    correctOptionId: 'l5-b',
    tags: ['Sinergi Antargenerasi', 'Kolaborasi', 'Culture Building'],
    explanation: 'Membuat program mentoring dua arah (reverse mentoring) di mana pengalaman senior dipadukan dengan kecakapan teknologi staf muda.',
    options: [
      { id: 'l5-a', label: 'A', text: 'Memisahkan divisi menjadi dua tim terpisah berdasarkan kelompok usia agar tidak terjadi gesekan.', score: 0 },
      { id: 'l5-b', label: 'B', text: 'Membangun program kolaborasi berpasangan (cross-mentoring) di mana staf senior membagikan wawasan industri dan staf muda membagikan inovasi alat kerja digital dengan menyepakati aturan komunikasi bersama.', score: 10 },
      { id: 'l5-c', label: 'C', text: 'Memaksa staf muda untuk sepenuhnya tunduk pada gaya kerja tradisional staf senior.', score: 2 },
      { id: 'l5-d', label: 'D', text: 'Mengganti semua staf senior dengan karyawan baru yang sebaya.', score: 0 }
    ]
  }
];
