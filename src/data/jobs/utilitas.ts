import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-UTI-001",
    nama: "Water Treatment Plant Manager",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Water Treatment Plant Manager pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Water Treatment Plant Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-001-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-001-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-001-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Water Treatment Plant Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-002",
    nama: "Electrical Grid Manager",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Electrical Grid Manager pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Electrical Grid Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-002-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-002-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-002-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Electrical Grid Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-003",
    nama: "Power Plant Engineer",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Power Plant Engineer pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Power Plant Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-003-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-003-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-003-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Power Plant Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-004",
    nama: "Utility Maintenance Supervisor",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Supervisor",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Utility Maintenance Supervisor pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Utility Maintenance Supervisor.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-004-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-004-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-004-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Utility Maintenance Supervisor.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-005",
    nama: "Meter Data Analyst",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Meter Data Analyst pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Meter Data Analyst.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-005-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-005-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-005-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Meter Data Analyst.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-006",
    nama: "SCADA Engineer",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang SCADA Engineer pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi SCADA Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-006-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-006-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-006-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai SCADA Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-007",
    nama: "HSE Utilitas",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang HSE Utilitas pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi HSE Utilitas.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-007-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-007-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-007-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai HSE Utilitas.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-008",
    nama: "Waste Management Coordinator",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Supervisor",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Waste Management Coordinator pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Waste Management Coordinator.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-008-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-008-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-008-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Waste Management Coordinator.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-009",
    nama: "Pipeline Integrity Engineer",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Pipeline Integrity Engineer pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Pipeline Integrity Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-009-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-009-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-009-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Pipeline Integrity Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
    id: "TPL-UTI-010",
    nama: "Energy Efficiency Consultant",
    kategori: "Utilitas",
    departemen: "Utilitas Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Energy Efficiency Consultant pada industri Utilitas.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Energy Efficiency Consultant.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Utilitas.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-UTI-010-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-UTI-010-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-UTI-010-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Utilitas.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Energy Efficiency Consultant.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Utilitas."]
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
