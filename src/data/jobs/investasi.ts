import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-INV-001",
    nama: "Investment Analyst",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Investment Analyst pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Investment Analyst.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-001-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-001-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-001-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Investment Analyst.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-002",
    nama: "Portfolio Manager",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Portfolio Manager pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Portfolio Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-002-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-002-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-002-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Portfolio Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-003",
    nama: "Wealth Advisor",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Wealth Advisor pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Wealth Advisor.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-003-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-003-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-003-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Wealth Advisor.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-004",
    nama: "Risk Manager Investasi",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Risk Manager Investasi pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Risk Manager Investasi.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-004-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-004-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-004-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Risk Manager Investasi.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-005",
    nama: "Equity Research Analyst",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Equity Research Analyst pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Equity Research Analyst.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-005-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-005-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-005-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Equity Research Analyst.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-006",
    nama: "Private Equity Associate",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Private Equity Associate pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Private Equity Associate.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-006-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-006-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-006-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Private Equity Associate.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-007",
    nama: "Fund Accountant",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Fund Accountant pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Fund Accountant.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-007-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-007-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-007-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Fund Accountant.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-008",
    nama: "Compliance Officer Pasar Modal",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Compliance Officer Pasar Modal pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Compliance Officer Pasar Modal.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-008-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-008-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-008-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Compliance Officer Pasar Modal.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-009",
    nama: "Trader",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Trader pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Trader.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-009-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-009-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-009-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Trader.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
    id: "TPL-INV-010",
    nama: "Investor Relations",
    kategori: "Investasi",
    departemen: "Investasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Investor Relations pada industri Investasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Investor Relations.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Investasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-INV-010-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-INV-010-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-INV-010-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Investasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Investor Relations.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Investasi."]
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
