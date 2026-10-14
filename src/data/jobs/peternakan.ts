import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-PET-001",
    nama: "Farm Manager Peternakan",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Farm Manager Peternakan pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Farm Manager Peternakan.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-001-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-001-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-001-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Farm Manager Peternakan.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-002",
    nama: "Dokter Hewan (Veterinarian)",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Dokter Hewan (Veterinarian) pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Dokter Hewan (Veterinarian).",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-002-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-002-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-002-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Dokter Hewan (Veterinarian).",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
        maksimal: 40000000
      },
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi","tunjangan_profesi"],
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
    id: "TPL-PET-003",
    nama: "Animal Nutritionist",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Animal Nutritionist pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Animal Nutritionist.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-003-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-003-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-003-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Animal Nutritionist.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-004",
    nama: "Breeding Supervisor",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Supervisor",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Breeding Supervisor pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Breeding Supervisor.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-004-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-004-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-004-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Breeding Supervisor.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-005",
    nama: "Livestock QC",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Livestock QC pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Livestock QC.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-005-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-005-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-005-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Livestock QC.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-006",
    nama: "Hatchery Manager",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Hatchery Manager pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Hatchery Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-006-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-006-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-006-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Hatchery Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-007",
    nama: "Dairy Farm Supervisor",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Supervisor",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Dairy Farm Supervisor pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Dairy Farm Supervisor.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-007-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-007-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-007-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Dairy Farm Supervisor.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-008",
    nama: "Biosecurity Officer",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Biosecurity Officer pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Biosecurity Officer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-008-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-008-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-008-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Biosecurity Officer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-009",
    nama: "Feedmill Manager",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Feedmill Manager pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Feedmill Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-009-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-009-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-009-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Feedmill Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
    id: "TPL-PET-010",
    nama: "Livestock Procurement",
    kategori: "Peternakan",
    departemen: "Peternakan Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Livestock Procurement pada industri Peternakan.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Livestock Procurement.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Peternakan.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-PET-010-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-PET-010-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-PET-010-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Peternakan.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Livestock Procurement.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Peternakan."]
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
