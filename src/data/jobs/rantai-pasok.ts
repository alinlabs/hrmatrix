import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-RAN-001",
    nama: "Supply Chain Director",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "C-Level / Director",
    atasanLangsung: "Board of Directors",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Supply Chain Director pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Supply Chain Director.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-001-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-001-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-001-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Supply Chain Director.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
        minimal: 40000000,
        standar: 70000000,
        maksimal: 120000000
      },
      tunjangan: ["tunjangan_jabatan","tunjangan_transportasi","tunjangan_komunikasi"],
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
    id: "TPL-RAN-002",
    nama: "Demand Planner",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Demand Planner pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Demand Planner.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-002-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-002-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-002-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Demand Planner.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-003",
    nama: "Supply Planner",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Supply Planner pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Supply Planner.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-003-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-003-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-003-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Supply Planner.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-004",
    nama: "Sourcing Manager",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Sourcing Manager pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Sourcing Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-004-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-004-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-004-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Sourcing Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-005",
    nama: "Logistics Coordinator",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Supervisor",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Logistics Coordinator pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Logistics Coordinator.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-005-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-005-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-005-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Logistics Coordinator.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-006",
    nama: "Inventory Manager",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Inventory Manager pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Inventory Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-006-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-006-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-006-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Inventory Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-007",
    nama: "Vendor Management Specialist",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Vendor Management Specialist pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Vendor Management Specialist.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-007-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-007-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-007-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Vendor Management Specialist.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-008",
    nama: "Import/Export Manager",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Import/Export Manager pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Import/Export Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-008-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-008-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-008-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Import/Export Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-009",
    nama: "Warehouse Manager",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Warehouse Manager pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Warehouse Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-009-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-009-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-009-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Warehouse Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
    id: "TPL-RAN-010",
    nama: "Distribution Center Manager",
    kategori: "Rantai Pasok",
    departemen: "Rantai Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Distribution Center Manager pada industri Rantai Pasok.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Distribution Center Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Rantai Pasok.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RAN-010-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RAN-010-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RAN-010-3",
        nama: "Kualitas & Akurasi (Quality Assurance)",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (defect rate), atau zero accident.",
        target: "< 2%",
        satuan: "Tingkat Error",
        bobot: 25,
        periode: "Bulanan",
        caraPengukuran: "Quality Control / Feedback Client"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Rantai Pasok.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Distribution Center Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Rantai Pasok."]
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
