import { PayrollRule } from '../../types';

export const masterPajak: PayrollRule[] = [
  {
    "id": "rule_pph21_1",
    "name": "PPh 21 Tarif Efektif Rata Rata",
    "category": "Tax",
    "description": "Pemotongan PPh 21 menggunakan TER Kategori A, B, dan C berdasarkan status PTKP bulanan dan tarif progresif Pasal 17 pada masa pajak terakhir (Desember).",
    "ruleType": "Formula",
    "employeeShare": 5,
    "employerShare": 0,
    "effectiveFrom": "2024-01-01",
    "regulatorySourceId": "src_pph21_ter",
    "origin": "PMK No. 168/2023 & PP No. 58/2023",
    "status": "Active",
    "version": "2024.1",
    "isMultiTier": true,
    "tiers": [
      {
        "id": "tier_ter_a",
        "name": "TER Kategori A",
        "employeeShare": 0,
        "employerShare": 0,
        "description": "Status PTKP: TK/0 (Rp 54 jt), TK/1 (Rp 58.5 jt), K/0 (Rp 58.5 jt). Tarif 0% s/d 34%.",
        "rateType": "Percentage"
      },
      {
        "id": "tier_ter_b",
        "name": "TER Kategori B",
        "employeeShare": 0,
        "employerShare": 0,
        "description": "Status PTKP: TK/2 (Rp 63 jt), TK/3 (Rp 67.5 jt), K/1 (Rp 63 jt), K/2 (Rp 67.5 jt). Tarif 0% s/d 34%.",
        "rateType": "Percentage"
      },
      {
        "id": "tier_ter_c",
        "name": "TER Kategori C",
        "employeeShare": 0,
        "employerShare": 0,
        "description": "Status PTKP: K/3 (Rp 72 jt). Tarif 0% s/d 34%.",
        "rateType": "Percentage"
      }
    ]
  },
  {
    "id": "rule_pph21_pasal17",
    "name": "PPh 21 Tarif Progresif",
    "category": "Tax",
    "description": "Perhitungan PPh 21 tahunan / masa Desember menggunakan 5 lapis tarif progresif Penghasilan Kena Pajak (PKP) UU HPP.",
    "ruleType": "Percentage",
    "employeeShare": 5,
    "employerShare": 0,
    "effectiveFrom": "2022-01-01",
    "regulatorySourceId": "src_pph21_ter",
    "origin": "UU No. 7/2021 (Harmonisasi Peraturan Perpajakan)",
    "status": "Active",
    "version": "2022.1",
    "isMultiTier": true,
    "tiers": [
      {
        "id": "tier_p17_1",
        "name": "Lapisan I (s/d Rp 60 Juta)",
        "employeeShare": 5,
        "employerShare": 0,
        "description": "Tarif 5% untuk PKP s/d Rp 60.000.000"
      },
      {
        "id": "tier_p17_2",
        "name": "Lapisan II (> Rp 60 Jt s/d Rp 250 Jt)",
        "employeeShare": 15,
        "employerShare": 0,
        "description": "Tarif 15% untuk PKP di atas Rp 60.000.000 s/d Rp 250.000.000"
      },
      {
        "id": "tier_p17_3",
        "name": "Lapisan III (> Rp 250 Jt s/d Rp 500 Jt)",
        "employeeShare": 25,
        "employerShare": 0,
        "description": "Tarif 25% untuk PKP di atas Rp 250.000.000 s/d Rp 500.000.000"
      },
      {
        "id": "tier_p17_4",
        "name": "Lapisan IV (> Rp 500 Jt s/d Rp 5 Miliar)",
        "employeeShare": 30,
        "employerShare": 0,
        "description": "Tarif 30% untuk PKP di atas Rp 500.000.000 s/d Rp 5.000.000.000"
      },
      {
        "id": "tier_p17_5",
        "name": "Lapisan V (> Rp 5 Miliar)",
        "employeeShare": 35,
        "employerShare": 0,
        "description": "Tarif 35% untuk PKP di atas Rp 5.000.000.000"
      }
    ]
  }
];
