import { JobTemplate } from '../../pages/job-desk/types';

const templates: JobTemplate[] = [
  {
    id: "TPL-RIT-001",
    nama: "Store Manager",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Store Manager pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Store Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-001-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-001-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-001-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Store Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-002",
    nama: "Area Manager",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Area Manager pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Area Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-002-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-002-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-002-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Area Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-003",
    nama: "Visual Merchandiser",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Visual Merchandiser pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Visual Merchandiser.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-003-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-003-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-003-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Visual Merchandiser.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-004",
    nama: "Retail Buyer",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Retail Buyer pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Retail Buyer.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-004-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-004-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-004-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Retail Buyer.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-005",
    nama: "Inventory Controller Ritel",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Inventory Controller Ritel pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Inventory Controller Ritel.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-005-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-005-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-005-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Inventory Controller Ritel.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-006",
    nama: "Loss Prevention",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Loss Prevention pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Loss Prevention.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-006-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-006-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-006-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Loss Prevention.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-007",
    nama: "Cashier Supervisor",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Supervisor",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Cashier Supervisor pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Cashier Supervisor.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-007-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-007-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-007-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Cashier Supervisor.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-008",
    nama: "Retail Sales Associate",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Staff",
    atasanLangsung: "Manager",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Retail Sales Associate pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Retail Sales Associate.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-008-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-008-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-008-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Retail Sales Associate.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-009",
    nama: "Category Manager Ritel",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Category Manager Ritel pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Category Manager Ritel.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-009-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-009-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-009-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Category Manager Ritel.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
    id: "TPL-RIT-010",
    nama: "Customer Experience Manager",
    kategori: "Ritel",
    departemen: "Ritel Department",
    divisi: "Operational Division",
    level: "Manager",
    atasanLangsung: "Director",
    tujuanJabatan: "Bertanggung jawab atas pengelolaan, operasional, dan pencapaian target di bidang Customer Experience Manager pada industri Ritel.",
    fungsiUtama: ["Perencanaan & Strategi", "Eksekusi Operasional", "Monitoring & Pelaporan", "Pengembangan Berkelanjutan"],
    tanggungJawab: [
      "Mengelola proses dan alur kerja yang relevan dengan spesialisasi Customer Experience Manager.",
      "Memastikan setiap target (KPI) tercapai sesuai standar kualitas industri Ritel.",
      "Melakukan koordinasi dengan tim internal maupun pihak eksternal.",
      "Menyusun laporan kinerja dan dokumentasi teknis/operasional."
    ],
    wewenang: [
      "Mengambil keputusan operasional harian dalam ruang lingkup tugasnya.",
      "Memberikan rekomendasi strategis kepada manajemen terkait optimasi proses."
    ],
    kpi: [
      {
        id: "KPI-RIT-010-1",
        nama: "Pencapaian Target Utama (Productivity)",
        deskripsi: "Tingkat keberhasilan pencapaian target output yang ditetapkan.",
        target: "100%",
        satuan: "Persentase",
        bobot: 40,
        periode: "Bulanan",
        caraPengukuran: "Laporan Kinerja / Sistem Dashboard"
      },
      {
        id: "KPI-RIT-010-2",
        nama: "Efisiensi & SLA (Timeliness)",
        deskripsi: "Penyelesaian tugas sesuai dengan Service Level Agreement yang disepakati.",
        target: ">= 95%",
        satuan: "Persentase",
        bobot: 35,
        periode: "Bulanan",
        caraPengukuran: "Time Tracking / Evaluasi Proses"
      },
      {
        id: "KPI-RIT-010-3",
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
      pendidikan: "Minimal S1 atau setara di bidang yang relevan dengan industri Ritel.",
      pengalaman: "Minimal 3-5 tahun pengalaman spesifik sebagai Customer Experience Manager.",
      sertifikasi: ["Sertifikasi profesi terkait (Diutamakan)"],
      syaratKhusus: ["Memahami standar dan kepatuhan (compliance) di sektor Ritel."]
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
