import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-TEL-001",
    nama: "Telecommunications Engineer",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Telecommunications Engineer pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Telecommunications Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-001-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-001-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-001-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Telecommunications Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-002",
    nama: "Network Architect",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Network Architect pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Network Architect.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-002-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-002-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-002-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Network Architect.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-003",
    nama: "RF Engineer",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang RF Engineer pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi RF Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-003-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-003-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-003-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai RF Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-004",
    nama: "NOC (Network Operations Center) Engineer",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang NOC (Network Operations Center) Engineer pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi NOC (Network Operations Center) Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-004-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-004-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-004-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai NOC (Network Operations Center) Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-005",
    nama: "Transmission Engineer",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Transmission Engineer pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Transmission Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-005-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-005-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-005-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Transmission Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-006",
    nama: "Fiber Optic Technician",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Fiber Optic Technician pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Fiber Optic Technician.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-006-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-006-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-006-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Fiber Optic Technician.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-007",
    nama: "BSS/OSS Engineer",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang BSS/OSS Engineer pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi BSS/OSS Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-007-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-007-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-007-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai BSS/OSS Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-008",
    nama: "Tower Manager",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Tower Manager pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Tower Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-008-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-008-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-008-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Tower Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
    id: "TPL-TEL-009",
    nama: "Telecom Sales",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Telecom Sales pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Telecom Sales.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-009-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-009-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-009-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Telecom Sales.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
      tunjangan: ["tunjangan_kehadiran","tunjangan_makan","tunjangan_transportasi","bonus_penjualan"],
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
    id: "TPL-TEL-010",
    nama: "Core Network Engineer",
    kategori: "Telekomunikasi",
    departemen: "Telekomunikasi Department",
    divisi: "Operational Division",
    level: "Specialist / Senior Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Core Network Engineer pada industri Telekomunikasi.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Core Network Engineer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Telekomunikasi.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-TEL-010-1",
        nama: "Pencapaian Target Output & Produktivitas",
        deskripsi: "Tingkat pemenuhan dan penyelesaian target output kerja utama serta deliverables operasional sesuai standar kualitas posisi.",
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: "Laporan Kinerja & Dashboard Operasional"
      },
      {
        id: "KPI-TEL-010-2",
        nama: "Efisiensi Waktu & Ketepatan SLA",
        deskripsi: "Ketepatan waktu dan kecepatan penyelesaian tugas operasional harian sesuai batas Service Level Agreement (SLA) yang disepakati.",
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: "Log Monitoring SLA & Evaluasi Proses Kerja"
      },
      {
        id: "KPI-TEL-010-3",
        nama: "Kualitas Hasil Kerja & Kepatuhan SOP",
        deskripsi: "Tingkat akurasi kerja, minimnya kesalahan (zero defect/accident), kepatuhan terhadap SOP, serta kepuasan evaluasi atasan.",
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: "Quality Control, Evaluasi Supervisi & Feedback"
      }
    ],
    kualifikasi: {
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Telekomunikasi.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Core Network Engineer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Telekomunikasi."]
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
  }
];

export default templates;
