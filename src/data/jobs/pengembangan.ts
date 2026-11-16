import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-PEN-001",
    nama: "R&D Manager",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang R&D Manager pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi R&D Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai R&D Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    nama: "Research Scientist",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Research Scientist pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Research Scientist.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Research Scientist.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    nama: "Product Innovator",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Product Innovator pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Product Innovator.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Product Innovator.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    nama: "Prototyping Engineer",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Prototyping Engineer pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Prototyping Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Prototyping Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    id: "TPL-PEN-005",
    nama: "Material Scientist",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Material Scientist pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Material Scientist.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Material Scientist.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    nama: "Innovation Strategist",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Innovation Strategist pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Innovation Strategist.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Innovation Strategist.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    nama: "Patent Engineer",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Patent Engineer pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Patent Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Patent Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    id: "TPL-PEN-008",
    nama: "Data Analyst R&D",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Data Analyst R&D pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Data Analyst R&D.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Data Analyst R&D.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    nama: "Lab Manager",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Lab Manager pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Lab Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Lab Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
    id: "TPL-PEN-010",
    nama: "Technology Scout",
    kategori: "Pengembangan",
    departemen: "Pengembangan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Technology Scout pada industri Pengembangan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Technology Scout.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Pengembangan.",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Pengembangan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Technology Scout.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Pengembangan."]
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
  }
];

export default templates;
