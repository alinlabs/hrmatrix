import { TestQuestion } from '../types';

// ============================================================================
// BANK SOAL: PSIKOTES KEPRIBADIAN & GAYA PERILAKU KERJA (DISC)
// ============================================================================
export const discQuestionBank: TestQuestion[] = [
  {
    id: 'disc-q1',
    number: 1,
    questionText: 'Pilihlah satu pernyataan yang PALING menggambarkan dan satu yang PALING TIDAK menggambarkan diri Anda dalam lingkungan kerja:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Gaya Kerja', 'Dominan'],
    options: [
      { id: 'd1-a', label: 'A', text: 'Cepat mengambil keputusan, berani mengambil risiko, dan fokus pada pencapaian target.', discType: 'D' },
      { id: 'd1-b', label: 'B', text: 'Antusias, ramah, mudah bergaul, dan pandai memotivasi rekan kerja di sekitar.', discType: 'I' },
      { id: 'd1-c', label: 'C', text: 'Sabar, pendengar yang baik, dapat diandalkan, dan menyukai ritme kerja stabil.', discType: 'S' },
      { id: 'd1-d', label: 'D', text: 'Sistematis, teliti pada detail, berhati-hati, dan selalu berpatokan pada standar baku.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q2',
    number: 2,
    questionText: 'Dalam menghadapi situasi proyek yang mengalami hambatan tak terduga:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Pemecahan Masalah', 'Respon Krisis'],
    options: [
      { id: 'd2-a', label: 'A', text: 'Langsung mengambil inisiatif memimpin dan mencari jalan pintas tercepat untuk solusi.', discType: 'D' },
      { id: 'd2-b', label: 'B', text: 'Mengajak tim berdiskusi dengan semangat optimis agar tidak ada yang putus asa.', discType: 'I' },
      { id: 'd2-c', label: 'C', text: 'Tetap tenang, tidak panik, dan membantu menopang anggota tim yang kewalahan.', discType: 'S' },
      { id: 'd2-d', label: 'D', text: 'Memeriksa data dan akar permasalahan secara metodis sebelum menentukan langkah korektif.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q3',
    number: 3,
    questionText: 'Bagaimana rekan kerja biasanya menggambarkan gaya kerja Anda?',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Citra Diri', 'Reputasi'],
    options: [
      { id: 'd3-a', label: 'A', text: 'Tegas, kompetitif, berorientasi hasil, dan tidak suka bertele-tele.', discType: 'D' },
      { id: 'd3-b', label: 'B', text: 'Ekspresif, persuasif, menyenangkan, dan membawa energi positif bagi ruangan.', discType: 'I' },
      { id: 'd3-c', label: 'C', text: 'Kooperatif, setia, sabar, dan selalu siap memberikan dukungan tanpa pamrih.', discType: 'S' },
      { id: 'd3-d', label: 'D', text: 'Akurat, terorganisir rapi, kritis, dan sangat mengutamakan mutu kerja.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q4',
    number: 4,
    questionText: 'Saat diberikan kebebasan mengatur jadwal dan prioritas kerja:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Manajemen Waktu', 'Otonomi'],
    options: [
      { id: 'd4-a', label: 'A', text: 'Menetapkan target ambisius baru dan bergerak cepat mengeksekusi ide besar.', discType: 'D' },
      { id: 'd4-b', label: 'B', text: 'Membangun jejaring relasi baru, berkolaborasi antardepartemen, dan presentasi ide.', discType: 'I' },
      { id: 'd4-c', label: 'C', text: 'Menyusun alur kerja harian yang teratur dan menyelesaikan tugas secara tuntas.', discType: 'S' },
      { id: 'd4-d', label: 'D', text: 'Menganalisis proses kerja, memeriksa checklist kepatuhan, dan menyempurnakan dokumen.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q5',
    number: 5,
    questionText: 'Hal apa yang paling membuat Anda merasa tidak nyaman di tempat kerja?',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Faktor Stres', 'Pemicu Emosi'],
    options: [
      { id: 'd5-a', label: 'A', text: 'Proses birokrasi yang lambat, keraguan mengambil keputusan, dan hilangnya kendali.', discType: 'D' },
      { id: 'd5-b', label: 'B', text: 'Suasana kerja yang kaku, terisolasi, dan tidak adanya apresiasi sosial.', discType: 'I' },
      { id: 'd5-c', label: 'C', text: 'Perubahan mendadak yang kacau, konflik interpersonal, dan ketidakpastian rencana.', discType: 'S' },
      { id: 'd5-d', label: 'D', text: 'Pekerjaan yang berantakan, standar mutu rendah, dan instruksi yang tidak jelas.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q6',
    number: 6,
    questionText: 'Ketika terjadi perbedaan pendapat dalam rapat koordinasi tim:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Resolusi Konflik', 'Komunikasi'],
    options: [
      { id: 'd6-a', label: 'A', text: 'Menyampaikan argumen secara lugas dan mendesak keputusan segera diambil.', discType: 'D' },
      { id: 'd6-b', label: 'B', text: 'Menggunakan diplomasi dan humor untuk mencairkan ketegangan suasana.', discType: 'I' },
      { id: 'd6-c', label: 'C', text: 'Menghindari perdebatan terbuka dan berupaya mencari jalan tengah yang disepakati bersama.', discType: 'S' },
      { id: 'd6-d', label: 'D', text: 'Menyajikan fakta angka dan argumen logis berbasis regulasi untuk membuktikan solusi.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q7',
    number: 7,
    questionText: 'Karakter utama yang paling menonjol menjadi keunggulan pribadi Anda:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Kekuatan Diri', 'Kompetensi Alami'],
    options: [
      { id: 'd7-a', label: 'A', text: 'Keteguhan, kepemimpinan alami, dan keberanian mendobrak rintangan.', discType: 'D' },
      { id: 'd7-b', label: 'B', text: 'Karisma, daya persuasi, dan kemampuan membakar semangat tim.', discType: 'I' },
      { id: 'd7-c', label: 'C', text: 'Ketulusan, kehandalan, dan loyalitas tinggi terhadap komitmen kerja.', discType: 'S' },
      { id: 'd7-d', label: 'D', text: 'Presisi tinggi, wawasan analitis tajam, dan kepatuhan pada aturan.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q8',
    number: 8,
    questionText: 'Bagaimana pendekatan Anda dalam berkomunikasi dengan atasan atau manajemen puncak?',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Komunikasi Vertikal', 'Etiket'],
    options: [
      { id: 'd8-a', label: 'A', text: 'To the point, menyajikan kesimpulan inti dan langsung meminta persetujuan eksekusi.', discType: 'D' },
      { id: 'd8-b', label: 'B', text: 'Antusias, menceritakan visi besar, dan membangun kedekatan emosional.', discType: 'I' },
      { id: 'd8-c', label: 'C', text: 'Sopan, mendengarkan instruksi secara utuh, dan siap menjalankan tugas yang diminta.', discType: 'S' },
      { id: 'd8-d', label: 'D', text: 'Menyusun laporan tertulis lengkap dengan lampiran data pendukung dan analisis risiko.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q9',
    number: 9,
    questionText: 'Dorongan motivasi utama yang paling membuat Anda bersemangat bekerja:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Motivasi Kerja', 'Intrinsik'],
    options: [
      { id: 'd9-a', label: 'A', text: 'Pencapaian kemenangan, kekuasaan memimpin, dan penghargaan atas prestasi tinggi.', discType: 'D' },
      { id: 'd9-b', label: 'B', text: 'Pengakuan sosial, popularitas, dan kesempatan berinteraksi dengan banyak orang.', discType: 'I' },
      { id: 'd9-c', label: 'C', text: 'Rasa aman, hubungan kerja yang harmonis, dan apresiasi atas kontribusi tim.', discType: 'S' },
      { id: 'd9-d', label: 'D', text: 'Peluang melakukan pekerjaan dengan sempurna, keahlian teknis, dan standar kualitas tinggi.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q10',
    number: 10,
    questionText: 'Ketika harus bekerja sama dengan anggota tim baru yang belum Anda kenal:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Orientasi Sosial', 'Kolaborasi'],
    options: [
      { id: 'd10-a', label: 'A', text: 'Langsung membagi tugas berdasarkan target tanpa membuang banyak waktu basa-basi.', discType: 'D' },
      { id: 'd10-b', label: 'B', text: 'Menyapa hangat, mengajak mengobrol santai, dan mencairkan suasana dengan cepat.', discType: 'I' },
      { id: 'd10-c', label: 'C', text: 'Menyambut dengan ramah, menawarkan bantuan, dan bersikap akomodatif.', discType: 'S' },
      { id: 'd10-d', label: 'D', text: 'Menjelaskan alur kerja baku, pembagian peran tertulis, dan batasan tanggung jawab.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q11',
    number: 11,
    questionText: 'Kelemahan atau area perbaikan yang paling sering Anda sadari pada diri Anda:',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Self-Awareness', 'Area Pengembangan'],
    options: [
      { id: 'd11-a', label: 'A', text: 'Terkadang tidak sabar terhadap orang yang bekerja lambat dan terkesan menuntut.', discType: 'D' },
      { id: 'd11-b', label: 'B', text: 'Terkadang kurang teliti pada detail kecil dan terlalu cepat menyetujui komitmen baru.', discType: 'I' },
      { id: 'd11-c', label: 'C', text: 'Sulit berkata "tidak" kepada orang lain dan cenderung enggan menerima perubahan mendadak.', discType: 'S' },
      { id: 'd11-d', label: 'D', text: 'Terlalu perfeksionis, lambat memutuskan karena over-thinking analisis data.', discType: 'C' }
    ]
  },
  {
    id: 'disc-q12',
    number: 12,
    questionText: 'Dalam mengelola pekerjaan di bawah tenggat waktu yang sangat ketat (*tight deadline*):',
    questionType: 'disc_quadrant',
    category: 'personality',
    tags: ['DISC', 'Ketahanan Stres', 'Deadlines'],
    options: [
      { id: 'd12-a', label: 'A', text: 'Semakin terpacu adrenalinnya untuk menuntaskan pekerjaan dan mendorong tim melipatgandakan kecepatan.', discType: 'D' },
      { id: 'd12-b', label: 'B', text: 'Menjaga energi positif tim agar tetap ceria dan tidak tenggelam dalam kepanikan beban kerja.', discType: 'I' },
      { id: 'd12-c', label: 'C', text: 'Fokus konsisten mengerjakan tugas bagian diri secara tekun tahap demi tahap hingga selesai.', discType: 'S' },
      { id: 'd12-d', label: 'D', text: 'Membuat checklist terperinci untuk memastikan tidak ada prosedur mutu yang terlewat dalam ketergesaan.', discType: 'C' }
    ]
  }
];
