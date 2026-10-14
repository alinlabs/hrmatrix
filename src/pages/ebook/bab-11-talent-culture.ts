import { Chapter } from './ebook-types';

export const bab11TalentCulture: Chapter = {
  id: 'talent-development-culture',
  number: 11,
  title: 'Pengembangan Talenta, Pelatihan & Budaya Organisasi',
  subtitle: 'Merancang analisis kebutuhan pelatihan (TNA), jalur karir, hingga strategi membangun engagement tinggi',
  iconName: 'Award',
  category: 'Strategi & Talent',
  readingTime: '11 menit',
  summary: 'Aset paling berharga dan penentu masa depan perusahaanmu bukanlah gedung perkantoran mewah, mesin canggih, atau perangkat lunak termahal melainkan MANUSIA yang bekerja di dalamnya! Karyawan yang luar biasa tidak tumbuh secara kebetulan. Mereka dibentuk melalui analisis pelatihan yang tepat sasaran, jalur promosi karir yang transparan, serta lingkungan budaya kerja yang suportif dan positif. Di bab ini, kamu akan mempelajari strategi Talent Development & Culture yang akan membuat karyawanmu bangga, setia, dan berkembang bersama perusahaanmu.',
  primaryPath: '/kpi',
  subsections: [
    {
      id: 'training-needs-analysis',
      title: 'Training Needs Analysis (TNA): Agar Anggaran Pelatihan Tepat Sasaran',
      description: 'Menganalisis kebutuhan pelatihan nyata berdasarkan data jurang keterampilan (*skill gap*).',
      uiLocation: 'EBook HRMatrix → Integrasi Evaluasi Nilai KPI di /kpi',
      details: [
        '**Pernahkah kamu mengirim karyawan mengikuti seminar mahal, tapi setelah kembali ke kantor tidak ada satu pun perubahan kinerjanya?**',
        'Inilah bentuk pemborosan anggaran yang sering terjadi ketika program pelatihan diadakan tanpa melakukan **Training Needs Analysis (TNA)** terlebih dahulu.',
        '**Apa itu TNA?** TNA adalah proses sistematis mengidentifikasi kesenjangan (*skill gap*) antara kompetensi riil karyawan saat ini dengan standar kompetensi yang dibutuhkan oleh jabatannya.',
        '**Payung Hukum:** UU No. 13 Tahun 2003 Pasal 9 s.d. 12 tentang Pelatihan Kerja & Pengembangan SDM.',
        '**Model Pengembangan Talenta 70-20-10:**',
        '   - **70% Practical Experience:** Praktik dan pengalaman kerja langsung (*On-the-Job Training* / proyek nyata).',
        '   - **20% Social Learning:** Mentoring, coaching dari atasan, dan diskusi antar-rekan sekerja.',
        '   - **10% Formal Education:** Pelatihan kelas, seminar, atau kursus sertifikasi resmi.',
        '**Mencari Skill Gap di HRMatrix:** Buka evaluasi KPI di modul **KPI (Route: `/kpi`)**. Jika ada karyawan yang konsisten mendapat angka rendah pada indikator teknis tertentu, di sinilah letak *skill gap* yang wajib kamu jadikan materi program TNA.'
      ]
    },
    {
      id: 'career-path-succession',
      title: 'Merancang Jalur Karir (Career Path) & Manajemen Suksesi',
      description: 'Merancang jenjang karir yang adil dan memetakan calon pemimpin masa depan.',
      uiLocation: 'EBook HRMatrix → Pengaturan Tingkat Jabatan di /employees',
      details: [
        '**Mengapa talenta terbaik (*High Performer*) di perusahaan sering kali mengajukan resign secara tiba-tiba padahal gajinya sudah cukup besar?**',
        'Salah satu alasan utamanya adalah karena mereka merasa **stagnan dan tidak melihat masa depan promosi karir yang jelas** di perusahaanmu!',
        '**Inovasi Dual-Track Career Path:** Sediakan 2 pilihan jalur karir yang setara:',
        '   - **Jalur Manajerial (Generalis):** Untuk karyawan yang memiliki bakat kepemimpinan dan mengelola timbawahan.',
        '   - **Jalur Spesialis (Individual Contributor):** Untuk karyawan yang memiliki keahlian teknis sangat tinggi tetapi kurang berminat memimpin orang lain. Mereka tetap bisa naik golongan gaji dan jenjang posisi tanpa harus dipaksa menjadi manajer!',
        '**Manajemen Suksesi (Succession Planning):** Memetakan kandidat-kandidat berpotensi tinggi (*Talent Pool*) yang siap menggantikan posisi kunci (seperti Manager atau Director) apabila pejabat saat ini dipromosikan atau pensiun.',
        '**Pengaturan di HRMatrix:** Pemetaan tingkatan jabatan dan golongan diatur pada profil karyawan di modul **Karyawan (Route: `/employees`)**.'
      ]
    },
    {
      id: 'employee-engagement-enps',
      title: 'Mengukur Kepuasan Kerja (eNPS) & Membangun Budaya Kerja',
      description: 'Metode kuantitatif mengukur keterikatan dan kepuasan pekerja terhadap organisasi.',
      uiLocation: 'EBook HRMatrix → Analitik Retensi Karyawan di /reports',
      details: [
        '**Bagaimana caramu mengukur seberapa bangga karyawanmu bekerja di perusahaanmu saat ini?**',
        'Salah satu metrik standar internasional yang paling populer digunakan adalah **Employee Net Promoter Score (eNPS)**.',
        '**Cara Kerja eNPS:** Berikan 1 pertanyaan sederhana kepada seluruh karyawan secara anonim: *"Dalam skala 0 hingga 10, seberapa besar kemungkinan kamu merekomendasikan perusahaan ini kepada temanmu sebagai tempat kerja yang baik?"*',
        '**Klasifikasi Skor Jawaban Karyawan:**',
        '   - **Promoters (Skor 9-10):** Karyawan yang sangat puas, loyal, dan menjadi duta budaya perusahaan.',
        '   - **Passives (Skor 7-8):** Karyawan yang merasa cukup, tapi bisa tergiur tawaran lain.',
        '   - **Detractors (Skor 0-6):** Karyawan yang tidak puas dan berisiko menyebarkan kebiasaan negatif.',
        '   `Rumus eNPS = % Promoters - % Detractors`',
        '**Pemantauan Retensi di HRMatrix:** Pantau tingkat retensi karyawan, stabilitas kedisiplinan, dan tren masa kerja pada modul **Laporan (Route: `/reports`)**.'
      ]
    }
  ]
};
