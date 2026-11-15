import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-PEN-001",
    nama: "Kepala Sekolah / Principal",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Kepala Sekolah / Principal pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Kepala Sekolah / Principal.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-001-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-001-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-001-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Kepala Sekolah / Principal.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 15000000,
        standar: 25000000,
        maksimal: 35000000
      },
      tunjangan: ["tunjangan_jabatan","tunjangan_komunikasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-002",
    nama: "Guru / Tenaga Pendidik",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Guru / Tenaga Pendidik pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Guru / Tenaga Pendidik.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-002-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-002-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-002-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Guru / Tenaga Pendidik.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 5000000,
        standar: 8000000,
        maksimal: 12000000
      },
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-003",
    nama: "Curriculum Developer",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Curriculum Developer pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Curriculum Developer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-003-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-003-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-003-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Curriculum Developer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 5000000,
        standar: 8000000,
        maksimal: 12000000
      },
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-004",
    nama: "Dosen / Lecturer",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Dosen / Lecturer pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Dosen / Lecturer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-004-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-004-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-004-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Dosen / Lecturer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 5000000,
        standar: 8000000,
        maksimal: 12000000
      },
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-005",
    nama: "Instructional Designer",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Instructional Designer pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Instructional Designer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-005-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-005-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-005-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Instructional Designer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 5000000,
        standar: 8000000,
        maksimal: 12000000
      },
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-006",
    nama: "Education Counselor",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Education Counselor pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Education Counselor.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-006-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-006-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-006-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Education Counselor.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 5000000,
        standar: 8000000,
        maksimal: 12000000
      },
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-007",
    nama: "Academic Coordinator",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Supervisor",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Academic Coordinator pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Academic Coordinator.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-007-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-007-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-007-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Academic Coordinator.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 8000000,
        standar: 12000000,
        maksimal: 18000000
      },
      tunjangan: ["tunjangan_jabatan","tunjangan_makan"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-008",
    nama: "E-learning Specialist",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang E-learning Specialist pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi E-learning Specialist.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-008-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-008-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-008-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai E-learning Specialist.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 10000000,
        standar: 15000000,
        maksimal: 25000000
      },
      tunjangan: ["tunjangan_keahlian","tunjangan_komunikasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-009",
    nama: "Librarian",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Librarian pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Librarian.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-009-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-009-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-009-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Librarian.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 5000000,
        standar: 8000000,
        maksimal: 12000000
      },
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  },
  {
    id: "TPL-PEN-010",
    nama: "Student Affairs Manager",
    kategori: "Pendidikan",
    departemen: "Pendidikan Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Student Affairs Manager pada industri Pendidikan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Student Affairs Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pendidikan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PEN-010-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PEN-010-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PEN-010-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pendidikan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Student Affairs Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pendidikan."]
    },
    kompetensi: {
      teknis: ["Penguasaan tools industri", "Analisis Data", "Problem Solving Teknis"],
      nonTeknis: ["Leadership", "Komunikasi Efektif", "Teamwork", "Adaptabilitas"]
    },
    hubunganKerja: {
      internal: ["Manajemen", "Lintas Departemen", "Tim Operasional"],
      eksternal: ["Vendor", "Klien", "Regulator"]
    },
    outputDiharapkan: [
      "Operasional berjalan efisien tanpa bottleneck.",
      "Laporan yang akurat sebagai dasar pengambilan keputusan.",
      "Inovasi proses yang berdampak pada penghematan biaya atau peningkatan revenue."
    ],
    kompensasi: {
      gajiPokok: {
        minimal: 15000000,
        standar: 25000000,
        maksimal: 35000000
      },
      tunjangan: ["tunjangan_jabatan","tunjangan_komunikasi"],
      bpjs: ["rule_bpjs_kes_1","rule_jht_1","rule_jp_1","rule_jkk_1","rule_jkm_1"],
      pajak: ["rule_pph21_ter"],
      pajakRuleId: "rule_pph21_ter",
      fasilitas: ["Asuransi Kesehatan Swasta", "Laptop/Perangkat Kerja", "Program Pelatihan Tahunan"]
    },
    dokumenAdministrasi: {
      wajib: ["KTP", "NPWP", "Ijazah", "CV"],
      pendukung: ["Sertifikat Pelatihan", "Referensi Kerja"],
      khusus: ["Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)"]
    }
  }
];

export default templates;
