import { PayrollRule } from '../../types';

export const masterJaminanSosial: PayrollRule[] = [
  {
    "id": "rule_bpjs_kes_1",
    "name": "BPJS Kesehatan",
    "category": "BPJS Health",
    "description": "Program jaminan pemeliharaan kesehatan nasional dengan beberapa formulasi kepesertaan.",
    "ruleType": "PercentageWithMax",
    "employeeShare": 1,
    "employerShare": 4,
    "maximumBase": 12000000,
    "effectiveFrom": "2020-07-01",
    "regulatorySourceId": "src_bpjs_kes",
    "origin": "Perpres No. 64/2020 & Perpres No. 59/2024",
    "status": "Active",
    "version": "2024.1",
    "isMultiTier": true,
    "tiers": [
      {
        "id": "kes_tier_swasta",
        "name": "PPU Badan Usaha Swasta",
        "employeeShare": 1,
        "employerShare": 4,
        "description": "Pekerja 1% & Perusahaan 4%. Batas maksimum dasar upah Rp 12.000.000.",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_swasta_er",
            "name": "Perusahaan (ER)",
            "share": 4,
            "fixedAmount": 0
          },
          {
            "id": "c_swasta_ee",
            "name": "Pekerja (EE)",
            "share": 1,
            "fixedAmount": 0
          }
        ]
      },
      {
        "id": "kes_tier_gov",
        "name": "PPU PNS, TNI, POLRI & BUMN",
        "employeeShare": 1,
        "employerShare": 4,
        "description": "Pekerja 1% & Pemerintah/BUMN 4%. Batas maksimum dasar upah Rp 12.000.000.",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_gov_er",
            "name": "Pemerintah / BUMN (ER)",
            "share": 4,
            "fixedAmount": 0
          },
          {
            "id": "c_gov_ee",
            "name": "Pekerja (EE)",
            "share": 1,
            "fixedAmount": 0
          }
        ]
      },
      {
        "id": "kes_tier_additional",
        "name": "Keluarga Tambahan",
        "employeeShare": 1,
        "employerShare": 0,
        "description": "Tambahan 1% per jiwa untuk anggota keluarga ke-4 dst, atau orang tua/mertua.",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_add_ee",
            "name": "Pekerja (EE)",
            "share": 1,
            "fixedAmount": 0
          }
        ]
      },
      {
        "id": "kes_tier_m1",
        "name": "Mandiri Kelas I (PBPU)",
        "employeeShare": 100,
        "employerShare": 0,
        "fixedAmount": 150000,
        "description": "Iuran tetap Rp 150.000 per bulan per jiwa untuk ruang perawatan Kelas I.",
        "rateType": "Fixed",
        "contributors": [
          {
            "id": "c_m1_ee",
            "name": "Peserta Mandiri",
            "share": 0,
            "fixedAmount": 150000
          }
        ]
      },
      {
        "id": "kes_tier_m2",
        "name": "Mandiri Kelas II (PBPU)",
        "employeeShare": 100,
        "employerShare": 0,
        "fixedAmount": 100000,
        "description": "Iuran tetap Rp 100.000 per bulan per jiwa untuk ruang perawatan Kelas II.",
        "rateType": "Fixed",
        "contributors": [
          {
            "id": "c_m2_ee",
            "name": "Peserta Mandiri",
            "share": 0,
            "fixedAmount": 100000
          }
        ]
      },
      {
        "id": "kes_tier_m3",
        "name": "Mandiri Kelas III (PBPU)",
        "employeeShare": 100,
        "employerShare": 0,
        "fixedAmount": 35000,
        "description": "Iuran tetap Rp 35.000 per bulan per jiwa (setelah subsidi pemerintah Rp 7.000).",
        "rateType": "Fixed",
        "contributors": [
          {
            "id": "c_m3_ee",
            "name": "Peserta Mandiri",
            "share": 0,
            "fixedAmount": 35000
          }
        ]
      }
    ]
  },
  {
    "id": "rule_jht_1",
    "name": "Jaminan Hari Tua (JHT)",
    "category": "BPJS Employment",
    "description": "Pekerja 2% & Perusahaan 3.7% (Total 5.7%) dari Upah yang dilaporkan.",
    "ruleType": "Percentage",
    "employeeShare": 2,
    "employerShare": 3.7,
    "effectiveFrom": "2015-07-01",
    "regulatorySourceId": "src_bpjs_tk",
    "origin": "PP No. 46/2015 & UU No. 24/2011",
    "status": "Active",
    "version": "2015.1",
    "isMultiTier": false,
    "tiers": [
      {
        "id": "tier_jht_std",
        "name": "Standar Nasional",
        "employeeShare": 2,
        "employerShare": 3.7,
        "description": "Pekerja 2% & Perusahaan 3.7%",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jht_er",
            "name": "Perusahaan (ER)",
            "share": 3.7,
            "fixedAmount": 0
          },
          {
            "id": "c_jht_ee",
            "name": "Pekerja (EE)",
            "share": 2,
            "fixedAmount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "rule_jp_1",
    "name": "Jaminan Pensiun (JP)",
    "category": "BPJS Employment",
    "description": "Pekerja 1% & Perusahaan 2% (Total 3%, Batas Maksimum Upah Rp 10.042.300)",
    "ruleType": "PercentageWithMax",
    "employeeShare": 1,
    "employerShare": 2,
    "maximumBase": 10042300,
    "effectiveFrom": "2024-03-01",
    "regulatorySourceId": "src_jp",
    "origin": "PP No. 45/2015 & Permenaker No. 4/2024",
    "status": "Active",
    "version": "2024.1",
    "isMultiTier": false,
    "tiers": [
      {
        "id": "tier_jp_std",
        "name": "Standar Nasional",
        "employeeShare": 1,
        "employerShare": 2,
        "description": "Pekerja 1% & Perusahaan 2% (Maksimum Upah Rp 10.042.300)",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jp_er",
            "name": "Perusahaan (ER)",
            "share": 2,
            "fixedAmount": 0
          },
          {
            "id": "c_jp_ee",
            "name": "Pekerja (EE)",
            "share": 1,
            "fixedAmount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "rule_jkk_1",
    "name": "Jaminan Kecelakaan Kerja (JKK)",
    "category": "BPJS Employment",
    "description": "Iuran ditanggung 100% oleh Perusahaan berdasarkan 5 tingkat risiko lingkungan kerja.",
    "ruleType": "Percentage",
    "employeeShare": 0,
    "employerShare": 0.24,
    "effectiveFrom": "2015-07-01",
    "regulatorySourceId": "src_bpjs_tk",
    "origin": "PP No. 44/2015 & Permenaker No. 10/2016",
    "status": "Active",
    "version": "2015.1",
    "isMultiTier": true,
    "tiers": [
      {
        "id": "tier_jkk_1",
        "name": "Tingkat I (Sangat Rendah)",
        "employeeShare": 0,
        "employerShare": 0.24,
        "description": "Perkantoran, IT, Perbankan",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jkk1_er",
            "name": "Perusahaan (ER)",
            "share": 0.24,
            "fixedAmount": 0
          }
        ]
      },
      {
        "id": "tier_jkk_2",
        "name": "Tingkat II (Rendah)",
        "employeeShare": 0,
        "employerShare": 0.54,
        "description": "Perdagangan, Jasa Umum, Perhotelan",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jkk2_er",
            "name": "Perusahaan (ER)",
            "share": 0.54,
            "fixedAmount": 0
          }
        ]
      },
      {
        "id": "tier_jkk_3",
        "name": "Tingkat III (Sedang)",
        "employeeShare": 0,
        "employerShare": 0.89,
        "description": "Industri Makanan, Tekstil, Logistik",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jkk3_er",
            "name": "Perusahaan (ER)",
            "share": 0.89,
            "fixedAmount": 0
          }
        ]
      },
      {
        "id": "tier_jkk_4",
        "name": "Tingkat IV (Tinggi)",
        "employeeShare": 0,
        "employerShare": 1.27,
        "description": "Manufaktur Heavy, Konstruksi",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jkk4_er",
            "name": "Perusahaan (ER)",
            "share": 1.27,
            "fixedAmount": 0
          }
        ]
      },
      {
        "id": "tier_jkk_5",
        "name": "Tingkat V (Sangat Tinggi)",
        "employeeShare": 0,
        "employerShare": 1.74,
        "description": "Pertambangan, Minyak & Gas, Perkebunan",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jkk5_er",
            "name": "Perusahaan (ER)",
            "share": 1.74,
            "fixedAmount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "rule_jkm_1",
    "name": "Jaminan Kematian (JKM)",
    "category": "BPJS Employment",
    "description": "Ditanggung Penuh Perusahaan 0.30% dari Upah Karyawan.",
    "ruleType": "Percentage",
    "employeeShare": 0,
    "employerShare": 0.3,
    "effectiveFrom": "2015-07-01",
    "regulatorySourceId": "src_bpjs_tk",
    "origin": "PP No. 44/2015 & Permenaker No. 4/2018",
    "status": "Active",
    "version": "2015.1",
    "isMultiTier": false,
    "tiers": [
      {
        "id": "tier_jkm_std",
        "name": "Standar Nasional",
        "employeeShare": 0,
        "employerShare": 0.3,
        "description": "Ditanggung Penuh Perusahaan 0.3%",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jkm_er",
            "name": "Perusahaan (ER)",
            "share": 0.3,
            "fixedAmount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "rule_jkp_1",
    "name": "Jaminan Kehilangan Pekerjaan (JKP)",
    "category": "BPJS Employment",
    "description": "APBN 0.22% & Rekomposisi Iuran 0.24% (Total 0.46%) - Perlindungan PHK.",
    "ruleType": "Percentage",
    "employeeShare": 0,
    "employerShare": 0.24,
    "effectiveFrom": "2021-02-01",
    "regulatorySourceId": "src_bpjs_tk",
    "origin": "PP No. 37/2021 & UU No. 6/2023",
    "status": "Active",
    "version": "2021.1",
    "isMultiTier": false,
    "tiers": [
      {
        "id": "tier_jkp_std",
        "name": "Standar Nasional",
        "employeeShare": 0,
        "employerShare": 0.24,
        "description": "Sumber: 0.22% APBN + 0.24% Rekomposisi",
        "rateType": "Percentage",
        "contributors": [
          {
            "id": "c_jkp_apbn",
            "name": "Pemerintah (APBN)",
            "share": 0.22,
            "fixedAmount": 0
          },
          {
            "id": "c_jkp_er",
            "name": "Rekomposisi BPJSTK",
            "share": 0.24,
            "fixedAmount": 0
          }
        ]
      }
    ]
  }
];
