/**
 * SAMPLE DATABASE: DATA KARYAWAN LENGKAP & TERKONFIGURASI
 * 
 * Sesuai regulasi dan standar tata kelola HR:
 * 1. Setiap posisi dan kompensasi (gaji pokok, tunjangan, dokumen, BPJS, Pajak TER) 
 *    tersinkronisasi 100% dengan Job Desk resmi di src/data/sampleDb/jobdesk.ts
 *    yang bersumber dari template terstandar di src/data/jobs/*.ts.
 * 2. Karyawan pemenang tertinggi (President Director & CEO) adalah Alvareza Hilka Pratama, S.Kom., M.M.
 *    selaku pencipta ide sistem web terpadu ini.
 * 3. Kategori, Divisi, dan Tipe Karyawan (Pegawai Tetap, Kontrak, Magang, Tenaga Ahli)
 *    telah diselaraskan sepenuhnya dengan standar modul HR & perpajakan Indonesia.
 */
export default [
  {
    "id": "emp-001",
    "employeeId": "EMP-001",
    "nik": "3216061408880001",
    "fullName": "Alvareza Hilka Pratama, S.Kom., M.M.",
    "nickname": "Alvareza",
    "birthPlace": "Bekasi",
    "birthDate": "1988-08-14",
    "gender": "Male",
    "address": "Cluster Pasadena Residence Blok B-12, Lippo Cikarang",
    "rt": "003",
    "rw": "012",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 812-8999-7777",
    "email": "alvareza.hilka@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 813-1122-3344",
    "emergencyContactName": "Annisa Putri Pratama",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 813-1122-3344",
    "departmentId": "dept-direksi",
    "positionId": "TPL-DIR-001",
    "level": "C-Level / Director",
    "category": "Eksekutif / C-Level",
    "division": "Direksi",
    "jobGrade": "E",
    "status": "Active",
    "joinDate": "2017-01-10",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Head Office & Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 120000000,
    "fixedAllowance": 21000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "7310889901",
    "bankAccountHolder": "Alvareza Hilka Pratama",
    "bankBranch": "KCU Thamrin Jakarta",
    "bpjsKesehatan": "0001827490001",
    "bpjsKetenagakerjaan": "17018270001",
    "npwp": "75.319.458.1-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-001-jabatan",
        "name": "Tunjangan Jabatan Direksi & Eksekutif",
        "amount": 15000000,
        "ruleId": "tunjangan_jabatan"
      },
      {
        "id": "alw-emp-001-transport",
        "name": "Tunjangan Transportasi & Representasi",
        "amount": 6000000,
        "ruleId": "tunjangan_transportasi"
      },
      {
        "id": "alw-emp-001-komunikasi",
        "name": "Tunjangan Komunikasi Eksekutif & Kuota VIP",
        "amount": 2500000,
        "ruleId": "tunjangan_komunikasi"
      },
      {
        "id": "alw-emp-001-fasilitas",
        "name": "Tunjangan Fasilitas & Kebugaran Direksi",
        "amount": 1500000,
        "ruleId": "tunjangan_fasilitas"
      }
    ],
    "taxProfile": {
      "employeeType": "Pegawai Tetap",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "terRate": 34,
      "taxMethod": "Gross",
      "npwp": "75.319.458.1-413.000",
      "hasNpwp": true,
      "taxHistory": []
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "hasBpjsKesehatan": true,
      "participantType": "PPU",
      "bpjsKesehatanNumber": "0001827490001",
      "faskesName": "Klinik Mitra Sehat Thamrin",
      "familyMembersCovered": 3,
      "autoDeductSalary": true
    },
    "bpjsKetenagakerjaanProfile": {
      "hasBpjsKetenagakerjaan": true,
      "bpjsTkNumber": "17018270001",
      "hasJht": true,
      "hasJkk": true,
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": false,
      "notes": "Kepesertaan Direksi Dewan Eksekutif Terdaftar Lengkap"
    },
    "documents": [
      {
        "id": "doc-emp-001-1",
        "name": "KTP (Kartu Tanda Penduduk)",
        "url": "/documents/emp-001_ktp.pdf",
        "category": "Identitas",
        "uploadedAt": "2017-01-10T08:00:00.000Z",
        "verified": true
      },
      {
        "id": "doc-emp-001-2",
        "name": "NPWP Pribadi",
        "url": "/documents/emp-001_npwp.pdf",
        "category": "Perpajakan",
        "uploadedAt": "2017-01-10T08:00:00.000Z",
        "verified": true
      },
      {
        "id": "doc-emp-001-3",
        "name": "Ijazah S1 & S2 Magister Manajemen",
        "url": "/documents/emp-001_ijazah.pdf",
        "category": "Pendidikan",
        "uploadedAt": "2017-01-10T08:00:00.000Z",
        "verified": true
      },
      {
        "id": "doc-emp-001-4",
        "name": "Akta Notaris & SK Pengangkatan Direksi RUPS",
        "url": "/documents/emp-001_sk_direksi.pdf",
        "category": "Legalitas",
        "uploadedAt": "2017-01-10T08:00:00.000Z",
        "verified": true
      },
      {
        "id": "doc-emp-001-5",
        "name": "Sertifikat Eksekutif & Portofolio Inovasi Sistem",
        "url": "/documents/emp-001_sertifikat.pdf",
        "category": "Kompetensi",
        "uploadedAt": "2017-01-10T08:00:00.000Z",
        "verified": true
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}",
    "deductions": [
      {
        "id": "ded-emp-001-bpjskes",
        "name": "Potongan BPJS Kesehatan (1%)",
        "amount": 120000,
        "ruleId": "rule_bpjs_kes_1"
      },
      {
        "id": "ded-emp-001-jht",
        "name": "Potongan JHT Pekerja (2%)",
        "amount": 2400000,
        "ruleId": "rule_jht_1"
      },
      {
        "id": "ded-emp-001-jp",
        "name": "Potongan JP Pekerja (1% Cap)",
        "amount": 100423,
        "ruleId": "rule_jp_1"
      }
    ],
    "overtimeRatePerHour": 0
  },
  {
    "id": "emp-002",
    "employeeId": "EMP-002",
    "nik": "3216068607240002",
    "fullName": "Dewi Kartika Sari, S.T., M.T.",
    "nickname": "Dewi",
    "birthPlace": "Bandung",
    "birthDate": "1986-07-24",
    "gender": "Female",
    "address": "Cluster Pasadena Blok C3 No. 15, Jababeka",
    "rt": "002",
    "rw": "007",
    "village": "Mekar Mukti",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8196315783",
    "email": "dewi.dewi@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 813-1928-4402",
    "emergencyContactName": "Budi Santoso, S.E.",
    "emergencyContactRelation": "Suami",
    "emergencyContactPhone": "+62 813-1928-4402",
    "departmentId": "dept-qualityassurance",
    "positionId": "TPL-MAN-005",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "Quality Assurance & Control",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-06-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310082910293",
    "bankAccountHolder": "Dewi Kartika Sari, S.T., M.T.",
    "bankBranch": "KC Jababeka Cikarang",
    "bpjsKesehatan": "0001827490002",
    "bpjsKetenagakerjaan": "19018270002",
    "npwp": "800.025.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-002-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-002-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-002-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-002-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068607240002",
      "npwp": "800.025.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490002",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270002",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-002-1",
        "name": "KTP",
        "url": "/documents/emp-002_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-002-2",
        "name": "NPWP",
        "url": "/documents/emp-002_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-002-3",
        "name": "Ijazah",
        "url": "/documents/emp-002_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-002-4",
        "name": "CV",
        "url": "/documents/emp-002_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-002-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-002_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-003",
    "employeeId": "EMP-003",
    "nik": "3216068411050003",
    "fullName": "Bambang Sugiarto, S.T.",
    "nickname": "Bambang",
    "birthPlace": "Surabaya",
    "birthDate": "1984-11-05",
    "gender": "Male",
    "address": "Jl. Kemang Pratama Raya No. 42",
    "rt": "003",
    "rw": "008",
    "village": "Sepanjang Jaya",
    "district": "Rawalumbu",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17114",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8128004447",
    "email": "bambang.bambang@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 3,
    "emergencyContact": "+62 811-9283-4903",
    "emergencyContactName": "Endang Rahayu",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 811-9283-4903",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-001",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "Plant & Factory Operations",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2018-08-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "8220192834",
    "bankAccountHolder": "Bambang Sugiarto, S.T.",
    "bankBranch": "KC Cikarang Barat",
    "bpjsKesehatan": "0001827490003",
    "bpjsKetenagakerjaan": "19018270003",
    "npwp": "800.035.678.9-413.000",
    "taxStatus": "K/3",
    "allowances": [
      {
        "id": "alw-emp-003-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-003-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-003-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-003-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068411050003",
      "npwp": "800.035.678.9-413.000",
      "ptkpStatus": "K/3",
      "terCategory": "C",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490003",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 5,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270003",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-003-1",
        "name": "KTP",
        "url": "/documents/emp-003_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-003-2",
        "name": "NPWP",
        "url": "/documents/emp-003_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-003-3",
        "name": "Ijazah",
        "url": "/documents/emp-003_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-003-4",
        "name": "CV",
        "url": "/documents/emp-003_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-003-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-003_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-004",
    "employeeId": "EMP-004",
    "nik": "3216068309180004",
    "fullName": "Dr. Farah Diba, S.Psi., M.M.",
    "nickname": "Farah",
    "birthPlace": "Yogyakarta",
    "birthDate": "1983-09-18",
    "gender": "Female",
    "address": "Jl. Bougenville Raya Blok A2 No. 8, Harapan Indah",
    "rt": "005",
    "rw": "012",
    "village": "Pejuang",
    "district": "Medan Satria",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17131",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8134012846",
    "email": "farah.dr@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 812-7382-9014",
    "emergencyContactName": "Prof. Anton Wicaksono",
    "emergencyContactRelation": "Suami",
    "emergencyContactPhone": "+62 812-7382-9014",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-001",
    "level": "C-Level / Director",
    "category": "Eksekutif / C-Level",
    "division": "People & Organization (HR)",
    "jobGrade": "E",
    "status": "Active",
    "joinDate": "2018-05-10",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 70000000,
    "fixedAllowance": 10500000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "6040192839",
    "bankAccountHolder": "Dr. Farah Diba, S.Psi., M.M.",
    "bankBranch": "KC Bekasi Central",
    "bpjsKesehatan": "0001827490004",
    "bpjsKetenagakerjaan": "19018270004",
    "npwp": "800.045.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-004-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 8000000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-004-transport",
        "name": "Tunjangan Transportasi",
        "amount": 2500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-004-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 1000000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-004-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068309180004",
      "npwp": "800.045.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490004",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270004",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-004-1",
        "name": "KTP",
        "url": "/documents/emp-004_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-004-2",
        "name": "NPWP",
        "url": "/documents/emp-004_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-004-3",
        "name": "Ijazah",
        "url": "/documents/emp-004_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-004-4",
        "name": "CV",
        "url": "/documents/emp-004_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-004-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-004_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-005",
    "employeeId": "EMP-005",
    "nik": "3216068502280005",
    "fullName": "Christian Aditya, S.Kom., M.T.I.",
    "nickname": "Aditya",
    "birthPlace": "Semarang",
    "birthDate": "1985-02-28",
    "gender": "Male",
    "address": "Cluster Beverly Hills No. 19, Lippo Cikarang",
    "rt": "001",
    "rw": "006",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8162457795",
    "email": "aditya.christian@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 818-0928-3745",
    "emergencyContactName": "Grace Natalia",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 818-0928-3745",
    "departmentId": "dept-teknologi",
    "positionId": "TPL-TEK-001",
    "level": "C-Level / Director",
    "category": "Eksekutif / C-Level",
    "division": "Product & Technology",
    "jobGrade": "E",
    "status": "Active",
    "joinDate": "2019-01-10",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 70000000,
    "fixedAllowance": 10500000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "5270192840",
    "bankAccountHolder": "Christian Aditya, S.Kom., M.T.I.",
    "bankBranch": "KC Kelapa Gading",
    "bpjsKesehatan": "0001827490005",
    "bpjsKetenagakerjaan": "19018270005",
    "npwp": "800.055.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-005-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 8000000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-005-transport",
        "name": "Tunjangan Transportasi",
        "amount": 2500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-005-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 1000000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-005-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068502280005",
      "npwp": "800.055.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490005",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270005",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-005-1",
        "name": "KTP",
        "url": "/documents/emp-005_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-005-2",
        "name": "NPWP",
        "url": "/documents/emp-005_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-005-3",
        "name": "Ijazah",
        "url": "/documents/emp-005_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-005-4",
        "name": "CV",
        "url": "/documents/emp-005_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-005-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-005_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-006",
    "employeeId": "EMP-006",
    "nik": "3216068708140006",
    "fullName": "Agus Priyanto, S.E.",
    "nickname": "Agus",
    "birthPlace": "Solo",
    "birthDate": "1987-08-14",
    "gender": "Male",
    "address": "Perumahan Grand Cikarang City Blok E1 No. 20",
    "rt": "004",
    "rw": "009",
    "village": "Karangraharja",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8190397382",
    "email": "agus.agus@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 856-9182-3846",
    "emergencyContactName": "Sri Wahyuni",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 856-9182-3846",
    "departmentId": "dept-perkantoran",
    "positionId": "TPL-PER-001",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "Operations & Facility Management",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-09-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1560092819201",
    "bankAccountHolder": "Agus Priyanto, S.E.",
    "bankBranch": "KC Cikarang Square",
    "bpjsKesehatan": "0001827490006",
    "bpjsKetenagakerjaan": "19018270006",
    "npwp": "800.065.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-006-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-006-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-006-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-006-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068708140006",
      "npwp": "800.065.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490006",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270006",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-006-1",
        "name": "KTP",
        "url": "/documents/emp-006_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-006-2",
        "name": "NPWP",
        "url": "/documents/emp-006_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-006-3",
        "name": "Ijazah",
        "url": "/documents/emp-006_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-006-4",
        "name": "CV",
        "url": "/documents/emp-006_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-006-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-006_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-007",
    "employeeId": "EMP-007",
    "nik": "3216069003220007",
    "fullName": "Rian Pratama, S.T.",
    "nickname": "Rian",
    "birthPlace": "Bogor",
    "birthDate": "1990-03-22",
    "gender": "Male",
    "address": "Jl. Rusa Raya No. 45, Cikarang Baru",
    "rt": "003",
    "rw": "005",
    "village": "Sertajaya",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8149335036",
    "email": "rian.rian@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 878-1928-3747",
    "emergencyContactName": "Maya Anggraini",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 878-1928-3747",
    "departmentId": "dept-teknik",
    "positionId": "TPL-MAN-004",
    "level": "Specialist / Senior Staff",
    "category": "Teknik & Rekayasa Mesin",
    "division": "Engineering & IT Infrastructure",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2020-02-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BRI",
    "bankAccount": "012901928374501",
    "bankAccountHolder": "Rian Pratama, S.T.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490007",
    "bpjsKetenagakerjaan": "19018270007",
    "npwp": "800.075.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-007-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-007-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-007-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-007-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069003220007",
      "npwp": "800.075.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490007",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270007",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-007-1",
        "name": "KTP",
        "url": "/documents/emp-007_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-007-2",
        "name": "NPWP",
        "url": "/documents/emp-007_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-007-3",
        "name": "Ijazah",
        "url": "/documents/emp-007_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-007-4",
        "name": "CV",
        "url": "/documents/emp-007_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-007-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-007_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-008",
    "employeeId": "EMP-008",
    "nik": "3216068612100008",
    "fullName": "Ahmad Fauzi, S.T., M.M.",
    "nickname": "Fauzi",
    "birthPlace": "Cirebon",
    "birthDate": "1986-12-10",
    "gender": "Male",
    "address": "Jl. Melati IV No. 18, Grand Wisata",
    "rt": "002",
    "rw": "006",
    "village": "Lambangjaya",
    "district": "Tambun Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17510",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8194462520",
    "email": "fauzi.ahmad@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 813-8829-1028",
    "emergencyContactName": "Nurul Hidayah",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 813-8829-1028",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-001",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-04-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310091827361",
    "bankAccountHolder": "Ahmad Fauzi, S.T., M.M.",
    "bankBranch": "KC MM2100 Cikarang Barat",
    "bpjsKesehatan": "0001827490008",
    "bpjsKetenagakerjaan": "19018270008",
    "npwp": "800.085.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-008-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-008-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-008-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-008-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068612100008",
      "npwp": "800.085.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490008",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270008",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-008-1",
        "name": "KTP",
        "url": "/documents/emp-008_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-008-2",
        "name": "NPWP",
        "url": "/documents/emp-008_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-008-3",
        "name": "Ijazah",
        "url": "/documents/emp-008_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-008-4",
        "name": "CV",
        "url": "/documents/emp-008_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-008-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-008_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-009",
    "employeeId": "EMP-009",
    "nik": "3216069105160009",
    "fullName": "Bayu Setiawan, A.Md.T.",
    "nickname": "Bayu",
    "birthPlace": "Magelang",
    "birthDate": "1991-05-16",
    "gender": "Male",
    "address": "Jl. Kasuari No. 33, Perumahan Cikarang Baru",
    "rt": "004",
    "rw": "007",
    "village": "Simpangan",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8161751421",
    "email": "bayu.bayu@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 821-9928-1029",
    "emergencyContactName": "Lestari Handayani",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 821-9928-1029",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-002",
    "level": "Supervisor",
    "category": "Operasional & Lapangan",
    "division": "Plant & Factory Operations",
    "jobGrade": "C",
    "status": "Active",
    "joinDate": "2020-07-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 12000000,
    "fixedAllowance": 2300000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "8220918237",
    "bankAccountHolder": "Bayu Setiawan, A.Md.T.",
    "bankBranch": "KCP Lippo Cikarang",
    "bpjsKesehatan": "0001827490009",
    "bpjsKetenagakerjaan": "19018270009",
    "npwp": "800.095.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-009-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 1500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-009-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-009-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-009-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069105160009",
      "npwp": "800.095.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490009",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270009",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-009-1",
        "name": "KTP",
        "url": "/documents/emp-009_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-009-2",
        "name": "NPWP",
        "url": "/documents/emp-009_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-009-3",
        "name": "Ijazah",
        "url": "/documents/emp-009_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-009-4",
        "name": "CV",
        "url": "/documents/emp-009_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-009-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-009_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-010",
    "employeeId": "EMP-010",
    "nik": "3216068910250010",
    "fullName": "Eko Prasetyo, S.Log.",
    "nickname": "Eko",
    "birthPlace": "Semarang",
    "birthDate": "1989-10-25",
    "gender": "Male",
    "address": "Perum Telaga Pesona Blok L2 No. 12",
    "rt": "005",
    "rw": "011",
    "village": "Telaga Murni",
    "district": "Cikarang Barat",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17520",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8182933443",
    "email": "eko.eko@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 857-1928-3010",
    "emergencyContactName": "Dwi Rahmawati",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 857-1928-3010",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-003",
    "level": "Supervisor",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "C",
    "status": "Active",
    "joinDate": "2020-08-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 12000000,
    "fixedAllowance": 2300000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BNI",
    "bankAccount": "0819283741",
    "bankAccountHolder": "Eko Prasetyo, S.Log.",
    "bankBranch": "KC Jababeka",
    "bpjsKesehatan": "0001827490010",
    "bpjsKetenagakerjaan": "19018270010",
    "npwp": "800.105.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-010-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 1500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-010-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-010-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-010-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068910250010",
      "npwp": "800.105.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490010",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270010",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-010-1",
        "name": "KTP",
        "url": "/documents/emp-010_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-010-2",
        "name": "NPWP",
        "url": "/documents/emp-010_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-010-3",
        "name": "Ijazah",
        "url": "/documents/emp-010_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-010-4",
        "name": "CV",
        "url": "/documents/emp-010_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-010-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-010_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-011",
    "employeeId": "EMP-011",
    "nik": "3216068806110011",
    "fullName": "Jessica Tanuwijaya, S.Psi.",
    "nickname": "Jessica",
    "birthPlace": "Jakarta",
    "birthDate": "1988-06-11",
    "gender": "Female",
    "address": "Apartemen Trivium Terrace Tower 1 Lantai 8 No. 802",
    "rt": "001",
    "rw": "001",
    "village": "Sukaresmi",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8119987680",
    "email": "jessica.jessica@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 811-8829-1011",
    "emergencyContactName": "Hartono Tanuwijaya",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 811-8829-1011",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-002",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "People & Organization (HR)",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-11-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "4580192841",
    "bankAccountHolder": "Jessica Tanuwijaya, S.Psi.",
    "bankBranch": "KC Cikarang Square",
    "bpjsKesehatan": "0001827490011",
    "bpjsKetenagakerjaan": "19018270011",
    "npwp": "800.115.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-011-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-011-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-011-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-011-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068806110011",
      "npwp": "800.115.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490011",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270011",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-011-1",
        "name": "KTP",
        "url": "/documents/emp-011_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-011-2",
        "name": "NPWP",
        "url": "/documents/emp-011_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-011-3",
        "name": "Ijazah",
        "url": "/documents/emp-011_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-011-4",
        "name": "CV",
        "url": "/documents/emp-011_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-011-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-011_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-012",
    "employeeId": "EMP-012",
    "nik": "3216069201190012",
    "fullName": "Siti Aminah, S.Ak.",
    "nickname": "Aminah",
    "birthPlace": "Bekasi",
    "birthDate": "1992-01-19",
    "gender": "Female",
    "address": "Jl. Sultan Hasanudin No. 89, Tambun Selatan",
    "rt": "003",
    "rw": "004",
    "village": "Tambun",
    "district": "Tambun Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17510",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8179269497",
    "email": "aminah.siti@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 813-9018-2912",
    "emergencyContactName": "Fajar Shodiq",
    "emergencyContactRelation": "Suami",
    "emergencyContactPhone": "+62 813-9018-2912",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-008",
    "level": "Supervisor",
    "category": "SDM & General Affairs",
    "division": "People & Organization (HR)",
    "jobGrade": "C",
    "status": "Active",
    "joinDate": "2020-03-10",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 12000000,
    "fixedAllowance": 2300000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310081920392",
    "bankAccountHolder": "Siti Aminah, S.Ak.",
    "bankBranch": "KC Tambun",
    "bpjsKesehatan": "0001827490012",
    "bpjsKetenagakerjaan": "19018270012",
    "npwp": "800.125.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-012-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 1500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-012-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-012-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-012-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069201190012",
      "npwp": "800.125.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490012",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270012",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-012-1",
        "name": "KTP",
        "url": "/documents/emp-012_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-012-2",
        "name": "NPWP",
        "url": "/documents/emp-012_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-012-3",
        "name": "Ijazah",
        "url": "/documents/emp-012_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-012-4",
        "name": "CV",
        "url": "/documents/emp-012_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-012-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-012_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-013",
    "employeeId": "EMP-013",
    "nik": "3216069308300013",
    "fullName": "Dimas Wicaksono, S.Kom.",
    "nickname": "Dimas",
    "birthPlace": "Yogyakarta",
    "birthDate": "1993-08-30",
    "gender": "Male",
    "address": "Jl. Alam Asri No. 17, Graha Asri Cikarang",
    "rt": "002",
    "rw": "005",
    "village": "Jatireja",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8166245207",
    "email": "dimas.dimas@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 812-3918-2013",
    "emergencyContactName": "Susilo Wicaksono",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 812-3918-2013",
    "departmentId": "dept-teknologi",
    "positionId": "TPL-TEK-002",
    "level": "Specialist / Senior Staff",
    "category": "Teknologi & IT",
    "division": "Product & Technology",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2021-02-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "6820192843",
    "bankAccountHolder": "Dimas Wicaksono, S.Kom.",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490013",
    "bpjsKetenagakerjaan": "19018270013",
    "npwp": "800.135.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-013-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-013-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-013-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-013-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069308300013",
      "npwp": "800.135.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490013",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270013",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-013-1",
        "name": "KTP",
        "url": "/documents/emp-013_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-013-2",
        "name": "NPWP",
        "url": "/documents/emp-013_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-013-3",
        "name": "Ijazah",
        "url": "/documents/emp-013_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-013-4",
        "name": "CV",
        "url": "/documents/emp-013_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-013-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-013_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-014",
    "employeeId": "EMP-014",
    "nik": "3216069204140014",
    "fullName": "Rizky Ramadhan, S.Kom.",
    "nickname": "Rizky",
    "birthPlace": "Bandung",
    "birthDate": "1992-04-14",
    "gender": "Male",
    "address": "Apartemen Oasis Cikarang Tower B No. 512",
    "rt": "003",
    "rw": "002",
    "village": "Sukaresmi",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8154185672",
    "email": "rizky.rizky@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 818-1928-4014",
    "emergencyContactName": "Dedi Ramadhan",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 818-1928-4014",
    "departmentId": "dept-teknologi",
    "positionId": "TPL-TEK-005",
    "level": "Specialist / Senior Staff",
    "category": "Teknologi & IT",
    "division": "Engineering & IT Infrastructure",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2021-04-15",
    "employeeType": "Magang",
    "contractType": "Internship",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 4500000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "7310928174",
    "bankAccountHolder": "Rizky Ramadhan, S.Kom.",
    "bankBranch": "KC Bandung Dago",
    "bpjsKesehatan": "0001827490014",
    "bpjsKetenagakerjaan": "19018270014",
    "npwp": "800.145.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-014-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-014-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-014-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-014-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069204140014",
      "npwp": "800.145.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490014",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270014",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-014-1",
        "name": "KTP",
        "url": "/documents/emp-014_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-014-2",
        "name": "NPWP",
        "url": "/documents/emp-014_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-014-3",
        "name": "Ijazah",
        "url": "/documents/emp-014_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-014-4",
        "name": "CV",
        "url": "/documents/emp-014_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-014-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-014_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-015",
    "employeeId": "EMP-015",
    "nik": "3216069109080015",
    "fullName": "Gita Permata, S.Sos.",
    "nickname": "Gita",
    "birthPlace": "Bogor",
    "birthDate": "1991-09-08",
    "gender": "Female",
    "address": "Perum Taman Aster Blok F3 No. 9, Cibitung",
    "rt": "004",
    "rw": "008",
    "village": "Telaga Asih",
    "district": "Cikarang Barat",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17520",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8140536678",
    "email": "gita.gita@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 857-9182-3915",
    "emergencyContactName": "Arif Hidayat",
    "emergencyContactRelation": "Suami",
    "emergencyContactPhone": "+62 857-9182-3915",
    "departmentId": "dept-perkantoran",
    "positionId": "TPL-PER-003",
    "level": "Supervisor",
    "category": "SDM & General Affairs",
    "division": "Operations & Facility Management",
    "jobGrade": "C",
    "status": "Active",
    "joinDate": "2020-05-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 12000000,
    "fixedAllowance": 2300000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1560081928491",
    "bankAccountHolder": "Gita Permata, S.Sos.",
    "bankBranch": "KC Cikarang Barat",
    "bpjsKesehatan": "0001827490015",
    "bpjsKetenagakerjaan": "19018270015",
    "npwp": "800.155.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-015-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 1500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-015-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-015-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-015-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069109080015",
      "npwp": "800.155.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490015",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270015",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-015-1",
        "name": "KTP",
        "url": "/documents/emp-015_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-015-2",
        "name": "NPWP",
        "url": "/documents/emp-015_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-015-3",
        "name": "Ijazah",
        "url": "/documents/emp-015_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-015-4",
        "name": "CV",
        "url": "/documents/emp-015_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-015-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-015_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-016",
    "employeeId": "EMP-016",
    "nik": "3216069512030016",
    "fullName": "Nadya Putri Utami, A.Md.Sek.",
    "nickname": "Nadya",
    "birthPlace": "Jakarta",
    "birthDate": "1995-12-03",
    "gender": "Female",
    "address": "Jl. Kasuari VI No. 22, Cikarang Baru",
    "rt": "002",
    "rw": "006",
    "village": "Mekar Mukti",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8166228603",
    "email": "nadya.nadya@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 813-1928-4016",
    "emergencyContactName": "Subagio Utomo",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 813-1928-4016",
    "departmentId": "dept-perkantoran",
    "positionId": "TPL-PER-002",
    "level": "Staff",
    "category": "Administrasi / Back Office",
    "division": "Operations & Facility Management",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2021-08-01",
    "employeeType": "Magang",
    "contractType": "Internship",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 4500000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "5270918239",
    "bankAccountHolder": "Nadya Putri Utami, A.Md.Sek.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490016",
    "bpjsKetenagakerjaan": "19018270016",
    "npwp": "800.165.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-016-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-016-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-016-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069512030016",
      "npwp": "800.165.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490016",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270016",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-016-1",
        "name": "KTP",
        "url": "/documents/emp-016_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-016-2",
        "name": "NPWP",
        "url": "/documents/emp-016_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-016-3",
        "name": "Ijazah",
        "url": "/documents/emp-016_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-016-4",
        "name": "CV",
        "url": "/documents/emp-016_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-016-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-016_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-017",
    "employeeId": "EMP-017",
    "nik": "3216068907170017",
    "fullName": "Ir. Ferry Kurniawan, S.T.",
    "nickname": "Ferry",
    "birthPlace": "Surabaya",
    "birthDate": "1989-07-17",
    "gender": "Male",
    "address": "Jl. Anggrek VII No. 11, Kota Deltamas",
    "rt": "003",
    "rw": "009",
    "village": "Hegarmukti",
    "district": "Cikarang Pusat",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8168466507",
    "email": "ferry.ir@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 812-8819-3017",
    "emergencyContactName": "Linda Wati",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 812-8819-3017",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-003",
    "level": "Specialist / Senior Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2019-10-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "8220182740",
    "bankAccountHolder": "Ir. Ferry Kurniawan, S.T.",
    "bankBranch": "KC Jababeka",
    "bpjsKesehatan": "0001827490017",
    "bpjsKetenagakerjaan": "19018270017",
    "npwp": "800.175.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-017-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-017-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-017-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-017-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068907170017",
      "npwp": "800.175.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490017",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270017",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-017-1",
        "name": "KTP",
        "url": "/documents/emp-017_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-017-2",
        "name": "NPWP",
        "url": "/documents/emp-017_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-017-3",
        "name": "Ijazah",
        "url": "/documents/emp-017_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-017-4",
        "name": "CV",
        "url": "/documents/emp-017_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-017-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-017_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-018",
    "employeeId": "EMP-018",
    "nik": "3216069103290018",
    "fullName": "Yusuf Maulana, S.T.",
    "nickname": "Yusuf",
    "birthPlace": "Malang",
    "birthDate": "1991-03-29",
    "gender": "Male",
    "address": "Jl. Rusa Raya No. 89, Jababeka II",
    "rt": "002",
    "rw": "004",
    "village": "Sertajaya",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8143493284",
    "email": "yusuf.yusuf@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 821-1928-4018",
    "emergencyContactName": "Aisyah Putri",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 821-1928-4018",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-006",
    "level": "Specialist / Senior Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2020-09-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310092817402",
    "bankAccountHolder": "Yusuf Maulana, S.T.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490018",
    "bpjsKetenagakerjaan": "19018270018",
    "npwp": "800.185.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-018-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-018-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-018-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-018-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069103290018",
      "npwp": "800.185.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490018",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270018",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-018-1",
        "name": "KTP",
        "url": "/documents/emp-018_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-018-2",
        "name": "NPWP",
        "url": "/documents/emp-018_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-018-3",
        "name": "Ijazah",
        "url": "/documents/emp-018_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-018-4",
        "name": "CV",
        "url": "/documents/emp-018_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-018-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-018_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-019",
    "employeeId": "EMP-019",
    "nik": "3216068811120019",
    "fullName": "Hadi Sucipto, S.T., Black Belt Lean",
    "nickname": "Hadi",
    "birthPlace": "Semarang",
    "birthDate": "1988-11-12",
    "gender": "Male",
    "address": "Jl. Bougenville No. 44, Lippo Cikarang",
    "rt": "004",
    "rw": "007",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8148750352",
    "email": "hadi.hadi@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 811-9182-3019",
    "emergencyContactName": "Tri Hapsari",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 811-9182-3019",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-007",
    "level": "Specialist / Senior Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2019-08-01",
    "employeeType": "Tenaga Ahli",
    "contractType": "Freelance",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "7310829104",
    "bankAccountHolder": "Hadi Sucipto, S.T., Black Belt Lean",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490019",
    "bpjsKetenagakerjaan": "19018270019",
    "npwp": "800.195.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-019-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-019-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-019-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-019-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068811120019",
      "npwp": "800.195.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Tenaga Ahli",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490019",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270019",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-019-1",
        "name": "KTP",
        "url": "/documents/emp-019_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-019-2",
        "name": "NPWP",
        "url": "/documents/emp-019_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-019-3",
        "name": "Ijazah",
        "url": "/documents/emp-019_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-019-4",
        "name": "CV",
        "url": "/documents/emp-019_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-019-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-019_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-020",
    "employeeId": "EMP-020",
    "nik": "3216069406200020",
    "fullName": "Budi Santoso, A.Md.T.",
    "nickname": "Budi",
    "birthPlace": "Solo",
    "birthDate": "1994-06-20",
    "gender": "Male",
    "address": "Kp. Pasir Konci RT 003 RW 002",
    "rt": "003",
    "rw": "002",
    "village": "Pasirsari",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8115668206",
    "email": "budi.budi@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 856-1928-4020",
    "emergencyContactName": "Siti Khotimah",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 856-1928-4020",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-008",
    "level": "Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2021-03-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BRI",
    "bankAccount": "012901827461502",
    "bankAccountHolder": "Budi Santoso, A.Md.T.",
    "bankBranch": "KC Cikarang Barat",
    "bpjsKesehatan": "0001827490020",
    "bpjsKetenagakerjaan": "19018270020",
    "npwp": "800.205.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-020-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-020-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-020-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069406200020",
      "npwp": "800.205.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490020",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270020",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-020-1",
        "name": "KTP",
        "url": "/documents/emp-020_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-020-2",
        "name": "NPWP",
        "url": "/documents/emp-020_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-020-3",
        "name": "Ijazah",
        "url": "/documents/emp-020_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-020-4",
        "name": "CV",
        "url": "/documents/emp-020_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-020-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-020_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-021",
    "employeeId": "EMP-021",
    "nik": "3216069302140021",
    "fullName": "Indra Gunawan, S.Tr.T.",
    "nickname": "Indra",
    "birthPlace": "Tegal",
    "birthDate": "1993-02-14",
    "gender": "Male",
    "address": "Kost Graha Asri Blok C No. 5",
    "rt": "001",
    "rw": "004",
    "village": "Jatireja",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8110095856",
    "email": "indra.indra@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 813-8819-2021",
    "emergencyContactName": "Gunawan Wibowo",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 813-8819-2021",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-009",
    "level": "Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2021-05-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "6820918274",
    "bankAccountHolder": "Indra Gunawan, S.Tr.T.",
    "bankBranch": "KC Jababeka",
    "bpjsKesehatan": "0001827490021",
    "bpjsKetenagakerjaan": "19018270021",
    "npwp": "800.215.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-021-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-021-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-021-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069302140021",
      "npwp": "800.215.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490021",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270021",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-021-1",
        "name": "KTP",
        "url": "/documents/emp-021_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-021-2",
        "name": "NPWP",
        "url": "/documents/emp-021_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-021-3",
        "name": "Ijazah",
        "url": "/documents/emp-021_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-021-4",
        "name": "CV",
        "url": "/documents/emp-021_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-021-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-021_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-022",
    "employeeId": "EMP-022",
    "nik": "3216069409050022",
    "fullName": "Lestari Handayani, S.T.",
    "nickname": "Tari",
    "birthPlace": "Purwokerto",
    "birthDate": "1994-09-05",
    "gender": "Female",
    "address": "Jl. Rusa XI No. 12, Cikarang Baru",
    "rt": "002",
    "rw": "005",
    "village": "Sertajaya",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8132071299",
    "email": "tari.lestari@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 812-9928-1022",
    "emergencyContactName": "Bambang Sudibyo",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 812-9928-1022",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-010",
    "level": "Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2021-06-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310081928401",
    "bankAccountHolder": "Lestari Handayani, S.T.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490022",
    "bpjsKetenagakerjaan": "19018270022",
    "npwp": "800.225.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-022-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-022-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-022-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069409050022",
      "npwp": "800.225.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490022",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270022",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-022-1",
        "name": "KTP",
        "url": "/documents/emp-022_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-022-2",
        "name": "NPWP",
        "url": "/documents/emp-022_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-022-3",
        "name": "Ijazah",
        "url": "/documents/emp-022_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-022-4",
        "name": "CV",
        "url": "/documents/emp-022_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-022-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-022_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-023",
    "employeeId": "EMP-023",
    "nik": "3216069010180023",
    "fullName": "Rian Hidayat, S.E.",
    "nickname": "Rian",
    "birthPlace": "Palembang",
    "birthDate": "1990-10-18",
    "gender": "Male",
    "address": "Cluster Pasadena No. 40, Jababeka Residence",
    "rt": "003",
    "rw": "008",
    "village": "Mekar Mukti",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8133055158",
    "email": "rian.rian@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 813-1928-3023",
    "emergencyContactName": "Fitriani",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 813-1928-3023",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-004",
    "level": "Specialist / Senior Staff",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2020-04-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "5270819284",
    "bankAccountHolder": "Rian Hidayat, S.E.",
    "bankBranch": "KC Bekasi Central",
    "bpjsKesehatan": "0001827490023",
    "bpjsKetenagakerjaan": "19018270023",
    "npwp": "800.235.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-023-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-023-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-023-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-023-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069010180023",
      "npwp": "800.235.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490023",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270023",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-023-1",
        "name": "KTP",
        "url": "/documents/emp-023_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-023-2",
        "name": "NPWP",
        "url": "/documents/emp-023_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-023-3",
        "name": "Ijazah",
        "url": "/documents/emp-023_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-023-4",
        "name": "CV",
        "url": "/documents/emp-023_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-023-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-023_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-024",
    "employeeId": "EMP-024",
    "nik": "3216069504120024",
    "fullName": "Wahyu Nugroho, S.Tr.Log.",
    "nickname": "Wahyu",
    "birthPlace": "Yogyakarta",
    "birthDate": "1995-04-12",
    "gender": "Male",
    "address": "Jl. Kasuari III No. 8, Cikarang Baru",
    "rt": "001",
    "rw": "003",
    "village": "Mekar Mukti",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8134853501",
    "email": "wahyu.wahyu@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 857-8819-2024",
    "emergencyContactName": "Nugroho Broto",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 857-8819-2024",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-007",
    "level": "Staff",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-01-10",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BNI",
    "bankAccount": "0819283752",
    "bankAccountHolder": "Wahyu Nugroho, S.Tr.Log.",
    "bankBranch": "KC Jababeka",
    "bpjsKesehatan": "0001827490024",
    "bpjsKetenagakerjaan": "19018270024",
    "npwp": "800.245.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-024-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-024-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-024-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069504120024",
      "npwp": "800.245.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490024",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270024",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-024-1",
        "name": "KTP",
        "url": "/documents/emp-024_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-024-2",
        "name": "NPWP",
        "url": "/documents/emp-024_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-024-3",
        "name": "Ijazah",
        "url": "/documents/emp-024_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-024-4",
        "name": "CV",
        "url": "/documents/emp-024_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-024-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-024_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-025",
    "employeeId": "EMP-025",
    "nik": "3216069601280025",
    "fullName": "Doni Firmansyah, A.Md.",
    "nickname": "Doni",
    "birthPlace": "Bandung",
    "birthDate": "1996-01-28",
    "gender": "Male",
    "address": "Kp. Pasir Gombong RT 004 RW 003",
    "rt": "004",
    "rw": "003",
    "village": "Pasirgombong",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8125356592",
    "email": "doni.doni@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 812-7719-2025",
    "emergencyContactName": "Cecep Firmansyah",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 812-7719-2025",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-008",
    "level": "Staff",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-03-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BRI",
    "bankAccount": "012901827461503",
    "bankAccountHolder": "Doni Firmansyah, A.Md.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490025",
    "bpjsKetenagakerjaan": "19018270025",
    "npwp": "800.255.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-025-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-025-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-025-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069601280025",
      "npwp": "800.255.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490025",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270025",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-025-1",
        "name": "KTP",
        "url": "/documents/emp-025_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-025-2",
        "name": "NPWP",
        "url": "/documents/emp-025_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-025-3",
        "name": "Ijazah",
        "url": "/documents/emp-025_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-025-4",
        "name": "CV",
        "url": "/documents/emp-025_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-025-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-025_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-026",
    "employeeId": "EMP-026",
    "nik": "3216069307090026",
    "fullName": "Slamet Riyadi, A.Md.Log.",
    "nickname": "Slamet",
    "birthPlace": "Kebumen",
    "birthDate": "1993-07-09",
    "gender": "Male",
    "address": "Perumahan Telaga Murni Blok D4 No. 16",
    "rt": "002",
    "rw": "006",
    "village": "Telaga Murni",
    "district": "Cikarang Barat",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17520",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8165356652",
    "email": "slamet.slamet@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 821-9918-2026",
    "emergencyContactName": "Mujiati",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 821-9918-2026",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-010",
    "level": "Staff",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2021-07-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "4580918275",
    "bankAccountHolder": "Slamet Riyadi, A.Md.Log.",
    "bankBranch": "KC MM2100",
    "bpjsKesehatan": "0001827490026",
    "bpjsKetenagakerjaan": "19018270026",
    "npwp": "800.265.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-026-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-026-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-026-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069307090026",
      "npwp": "800.265.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490026",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270026",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-026-1",
        "name": "KTP",
        "url": "/documents/emp-026_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-026-2",
        "name": "NPWP",
        "url": "/documents/emp-026_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-026-3",
        "name": "Ijazah",
        "url": "/documents/emp-026_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-026-4",
        "name": "CV",
        "url": "/documents/emp-026_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-026-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-026_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-027",
    "employeeId": "EMP-027",
    "nik": "3216069411230027",
    "fullName": "Anisa Rahmawati, S.Stat.",
    "nickname": "Anisa",
    "birthPlace": "Bogor",
    "birthDate": "1994-11-23",
    "gender": "Female",
    "address": "Jl. Palem Raya No. 14, Kemang Pratama",
    "rt": "003",
    "rw": "005",
    "village": "Bojong Rawalumbu",
    "district": "Rawalumbu",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17116",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8119037506",
    "email": "anisa.anisa@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 813-8819-3027",
    "emergencyContactName": "Drs. Rahmadi",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 813-8819-3027",
    "departmentId": "dept-logistik",
    "positionId": "TPL-RAN-002",
    "level": "Staff",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2021-09-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1560091827362",
    "bankAccountHolder": "Anisa Rahmawati, S.Stat.",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490027",
    "bpjsKetenagakerjaan": "19018270027",
    "npwp": "800.275.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-027-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-027-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-027-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069411230027",
      "npwp": "800.275.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490027",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270027",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-027-1",
        "name": "KTP",
        "url": "/documents/emp-027_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-027-2",
        "name": "NPWP",
        "url": "/documents/emp-027_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-027-3",
        "name": "Ijazah",
        "url": "/documents/emp-027_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-027-4",
        "name": "CV",
        "url": "/documents/emp-027_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-027-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-027_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-028",
    "employeeId": "EMP-028",
    "nik": "3216068705300028",
    "fullName": "Tommy Wijaya, S.T., CPSM",
    "nickname": "Tommy",
    "birthPlace": "Medan",
    "birthDate": "1987-05-30",
    "gender": "Male",
    "address": "Cluster Woodlake No. 10, Kota Deltamas",
    "rt": "002",
    "rw": "007",
    "village": "Hegarmukti",
    "district": "Cikarang Pusat",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8120529339",
    "email": "tommy.tommy@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 811-1928-4028",
    "emergencyContactName": "Sylvia Chandra",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 811-1928-4028",
    "departmentId": "dept-logistik",
    "positionId": "TPL-RAN-004",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-07-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "8220918276",
    "bankAccountHolder": "Tommy Wijaya, S.T., CPSM",
    "bankBranch": "KC Cikarang Barat",
    "bpjsKesehatan": "0001827490028",
    "bpjsKetenagakerjaan": "19018270028",
    "npwp": "800.285.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-028-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-028-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-028-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-028-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068705300028",
      "npwp": "800.285.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490028",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270028",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-028-1",
        "name": "KTP",
        "url": "/documents/emp-028_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-028-2",
        "name": "NPWP",
        "url": "/documents/emp-028_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-028-3",
        "name": "Ijazah",
        "url": "/documents/emp-028_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-028-4",
        "name": "CV",
        "url": "/documents/emp-028_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-028-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-028_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-029",
    "employeeId": "EMP-029",
    "nik": "3216068608160029",
    "fullName": "Ir. Hendra Wijaya, M.Sc.",
    "nickname": "Hendra",
    "birthPlace": "Surabaya",
    "birthDate": "1986-08-16",
    "gender": "Male",
    "address": "Jl. Menteng Raya Blok B2 No. 5, Lippo Cikarang",
    "rt": "004",
    "rw": "008",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8173718403",
    "email": "hendra.wijaya@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 812-9918-3029",
    "emergencyContactName": "Retno Wulandari",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 812-9918-3029",
    "departmentId": "dept-logistik",
    "positionId": "TPL-RAN-001",
    "level": "C-Level / Director",
    "category": "Eksekutif / C-Level",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "E",
    "status": "Active",
    "joinDate": "2019-05-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 70000000,
    "fixedAllowance": 10500000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310091827403",
    "bankAccountHolder": "Ir. Hendra Wijaya, M.Sc.",
    "bankBranch": "KC Jababeka",
    "bpjsKesehatan": "0001827490029",
    "bpjsKetenagakerjaan": "19018270029",
    "npwp": "800.295.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-029-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-029-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-029-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-029-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068608160029",
      "npwp": "800.295.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter",
      "terRate": 26
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490029",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270029",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-029-1",
        "name": "KTP",
        "url": "/documents/emp-029_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-029-2",
        "name": "NPWP",
        "url": "/documents/emp-029_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-029-3",
        "name": "Ijazah",
        "url": "/documents/emp-029_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-029-4",
        "name": "CV",
        "url": "/documents/emp-029_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-029-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-029_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-030",
    "employeeId": "EMP-030",
    "nik": "3216069112070030",
    "fullName": "Citra Dewi Lestari, S.E.",
    "nickname": "Citra",
    "birthPlace": "Bandung",
    "birthDate": "1991-12-07",
    "gender": "Female",
    "address": "Cluster Meadow Green No. 27, Lippo Cikarang",
    "rt": "001",
    "rw": "004",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8164738137",
    "email": "citra.citra@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 818-8819-2030",
    "emergencyContactName": "Aditya Pratama",
    "emergencyContactRelation": "Suami",
    "emergencyContactPhone": "+62 818-8819-2030",
    "departmentId": "dept-logistik",
    "positionId": "TPL-RAN-007",
    "level": "Specialist / Senior Staff",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2020-11-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "7310819285",
    "bankAccountHolder": "Citra Dewi Lestari, S.E.",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490030",
    "bpjsKetenagakerjaan": "19018270030",
    "npwp": "800.305.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-030-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-030-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-030-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-030-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069112070030",
      "npwp": "800.305.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490030",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270030",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-030-1",
        "name": "KTP",
        "url": "/documents/emp-030_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-030-2",
        "name": "NPWP",
        "url": "/documents/emp-030_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-030-3",
        "name": "Ijazah",
        "url": "/documents/emp-030_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-030-4",
        "name": "CV",
        "url": "/documents/emp-030_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-030-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-030_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-031",
    "employeeId": "EMP-031",
    "nik": "3216068703190031",
    "fullName": "Rudy Hartono, S.E., MM",
    "nickname": "Rudy",
    "birthPlace": "Semarang",
    "birthDate": "1987-03-19",
    "gender": "Male",
    "address": "Jl. Celebration Boulevard Blok AA2 No. 15, Grand Wisata",
    "rt": "005",
    "rw": "010",
    "village": "Lambangsari",
    "district": "Tambun Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17510",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8174951178",
    "email": "rudy.rudy@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 812-7719-3031",
    "emergencyContactName": "Yuliana Tan",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 812-7719-3031",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-003",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "People & Organization (HR)",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-03-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "6040918277",
    "bankAccountHolder": "Rudy Hartono, S.E., MM",
    "bankBranch": "KC Bekasi Timur",
    "bpjsKesehatan": "0001827490031",
    "bpjsKetenagakerjaan": "19018270031",
    "npwp": "800.315.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-031-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-031-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-031-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-031-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068703190031",
      "npwp": "800.315.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490031",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270031",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-031-1",
        "name": "KTP",
        "url": "/documents/emp-031_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-031-2",
        "name": "NPWP",
        "url": "/documents/emp-031_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-031-3",
        "name": "Ijazah",
        "url": "/documents/emp-031_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-031-4",
        "name": "CV",
        "url": "/documents/emp-031_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-031-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-031_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-032",
    "employeeId": "EMP-032",
    "nik": "3216069206250032",
    "fullName": "Nurul Hidayati, S.Psi., CHRP",
    "nickname": "Nurul",
    "birthPlace": "Yogyakarta",
    "birthDate": "1992-06-25",
    "gender": "Female",
    "address": "Jl. Anggrek Raya No. 34, Graha Asri",
    "rt": "002",
    "rw": "006",
    "village": "Jatireja",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8154898755",
    "email": "nurul.nurul@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 813-9918-2032",
    "emergencyContactName": "Fajar Nugraha",
    "emergencyContactRelation": "Suami",
    "emergencyContactPhone": "+62 813-9918-2032",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-004",
    "level": "Specialist / Senior Staff",
    "category": "SDM & General Affairs",
    "division": "People & Organization (HR)",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2021-01-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1560081927363",
    "bankAccountHolder": "Nurul Hidayati, S.Psi., CHRP",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490032",
    "bpjsKetenagakerjaan": "19018270032",
    "npwp": "800.325.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-032-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-032-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-032-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-032-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069206250032",
      "npwp": "800.325.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490032",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270032",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-032-1",
        "name": "KTP",
        "url": "/documents/emp-032_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-032-2",
        "name": "NPWP",
        "url": "/documents/emp-032_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-032-3",
        "name": "Ijazah",
        "url": "/documents/emp-032_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-032-4",
        "name": "CV",
        "url": "/documents/emp-032_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-032-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-032_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-033",
    "employeeId": "EMP-033",
    "nik": "3216068510040033",
    "fullName": "Anton Wibowo, S.H., M.H.",
    "nickname": "Anton",
    "birthPlace": "Solo",
    "birthDate": "1985-10-04",
    "gender": "Male",
    "address": "Jl. Casablanca No. 12, Lippo Cikarang",
    "rt": "003",
    "rw": "008",
    "village": "Sukaresmi",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8121133547",
    "email": "anton.anton@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 3,
    "emergencyContact": "+62 811-8819-3033",
    "emergencyContactName": "Kartika Sari, S.H.",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 811-8819-3033",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-006",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "People & Organization (HR)",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-02-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310081927404",
    "bankAccountHolder": "Anton Wibowo, S.H., M.H.",
    "bankBranch": "KC Cikarang Barat",
    "bpjsKesehatan": "0001827490033",
    "bpjsKetenagakerjaan": "19018270033",
    "npwp": "800.335.678.9-413.000",
    "taxStatus": "K/3",
    "allowances": [
      {
        "id": "alw-emp-033-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-033-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-033-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-033-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068510040033",
      "npwp": "800.335.678.9-413.000",
      "ptkpStatus": "K/3",
      "terCategory": "C",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490033",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 5,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270033",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-033-1",
        "name": "KTP",
        "url": "/documents/emp-033_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-033-2",
        "name": "NPWP",
        "url": "/documents/emp-033_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-033-3",
        "name": "Ijazah",
        "url": "/documents/emp-033_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-033-4",
        "name": "CV",
        "url": "/documents/emp-033_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-033-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-033_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-034",
    "employeeId": "EMP-034",
    "nik": "3216069305180034",
    "fullName": "Danang Tri Wicaksono, S.Kom.",
    "nickname": "Danang",
    "birthPlace": "Klaten",
    "birthDate": "1993-05-18",
    "gender": "Male",
    "address": "Jl. Kasuari V No. 9, Cikarang Baru",
    "rt": "004",
    "rw": "007",
    "village": "Mekar Mukti",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8112334223",
    "email": "danang.danang@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 856-7719-2034",
    "emergencyContactName": "Tri Haryono",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 856-7719-2034",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-009",
    "level": "Specialist / Senior Staff",
    "category": "SDM & General Affairs",
    "division": "People & Organization (HR)",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2021-08-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "5270918278",
    "bankAccountHolder": "Danang Tri Wicaksono, S.Kom.",
    "bankBranch": "KC Cikarang Square",
    "bpjsKesehatan": "0001827490034",
    "bpjsKetenagakerjaan": "19018270034",
    "npwp": "800.345.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-034-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-034-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-034-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-034-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069305180034",
      "npwp": "800.345.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490034",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270034",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-034-1",
        "name": "KTP",
        "url": "/documents/emp-034_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-034-2",
        "name": "NPWP",
        "url": "/documents/emp-034_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-034-3",
        "name": "Ijazah",
        "url": "/documents/emp-034_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-034-4",
        "name": "CV",
        "url": "/documents/emp-034_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-034-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-034_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-035",
    "employeeId": "EMP-035",
    "nik": "3216069408140035",
    "fullName": "Ratna Sulistiawati, S.I.Kom.",
    "nickname": "Ratna",
    "birthPlace": "Jakarta",
    "birthDate": "1994-08-14",
    "gender": "Female",
    "address": "Apartemen Meikarta Tower 53022 No. 1205",
    "rt": "001",
    "rw": "002",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8136314512",
    "email": "ratna.ratna@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 812-1928-4035",
    "emergencyContactName": "Sulistio Purnomo",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 812-1928-4035",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-010",
    "level": "Specialist / Senior Staff",
    "category": "SDM & General Affairs",
    "division": "People & Organization (HR)",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2022-02-01",
    "employeeType": "Magang",
    "contractType": "Internship",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 4500000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "6820819279",
    "bankAccountHolder": "Ratna Sulistiawati, S.I.Kom.",
    "bankBranch": "KC Bekasi Central",
    "bpjsKesehatan": "0001827490035",
    "bpjsKetenagakerjaan": "19018270035",
    "npwp": "800.355.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-035-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-035-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-035-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-035-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069408140035",
      "npwp": "800.355.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490035",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270035",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-035-1",
        "name": "KTP",
        "url": "/documents/emp-035_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-035-2",
        "name": "NPWP",
        "url": "/documents/emp-035_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-035-3",
        "name": "Ijazah",
        "url": "/documents/emp-035_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-035-4",
        "name": "CV",
        "url": "/documents/emp-035_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-035-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-035_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-036",
    "employeeId": "EMP-036",
    "nik": "3216069603310036",
    "fullName": "Dewi Anggraini, A.Md.A.P.",
    "nickname": "Anggi",
    "birthPlace": "Cirebon",
    "birthDate": "1996-03-31",
    "gender": "Female",
    "address": "Jl. Kakaktua II No. 15, Cikarang Baru",
    "rt": "002",
    "rw": "005",
    "village": "Simpangan",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8178644311",
    "email": "anggi.dewi@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 813-8819-2036",
    "emergencyContactName": "Kuswanto",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 813-8819-2036",
    "departmentId": "dept-perkantoran",
    "positionId": "TPL-PER-006",
    "level": "Staff",
    "category": "Administrasi / Back Office",
    "division": "Operations & Facility Management",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-04-15",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1560091827405",
    "bankAccountHolder": "Dewi Anggraini, A.Md.A.P.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490036",
    "bpjsKetenagakerjaan": "19018270036",
    "npwp": "800.365.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-036-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-036-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-036-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069603310036",
      "npwp": "800.365.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490036",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270036",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-036-1",
        "name": "KTP",
        "url": "/documents/emp-036_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-036-2",
        "name": "NPWP",
        "url": "/documents/emp-036_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-036-3",
        "name": "Ijazah",
        "url": "/documents/emp-036_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-036-4",
        "name": "CV",
        "url": "/documents/emp-036_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-036-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-036_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-037",
    "employeeId": "EMP-037",
    "nik": "3216068711200037",
    "fullName": "Joko Susilo, S.T.",
    "nickname": "Joko",
    "birthPlace": "Solo",
    "birthDate": "1987-11-20",
    "gender": "Male",
    "address": "Perum Cikarang Baru Blok C5 No. 22",
    "rt": "003",
    "rw": "006",
    "village": "Sertajaya",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8172835962",
    "email": "joko.joko@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 821-1928-3037",
    "emergencyContactName": "Sri Mulyani",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 821-1928-3037",
    "departmentId": "dept-perkantoran",
    "positionId": "TPL-PER-007",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "Operations & Facility Management",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2019-12-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "7310819286",
    "bankAccountHolder": "Joko Susilo, S.T.",
    "bankBranch": "KC Jababeka",
    "bpjsKesehatan": "0001827490037",
    "bpjsKetenagakerjaan": "19018270037",
    "npwp": "800.375.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-037-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-037-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-037-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-037-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068711200037",
      "npwp": "800.375.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490037",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270037",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-037-1",
        "name": "KTP",
        "url": "/documents/emp-037_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-037-2",
        "name": "NPWP",
        "url": "/documents/emp-037_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-037-3",
        "name": "Ijazah",
        "url": "/documents/emp-037_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-037-4",
        "name": "CV",
        "url": "/documents/emp-037_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-037-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-037_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-038",
    "employeeId": "EMP-038",
    "nik": "3216069507120038",
    "fullName": "Mega Utami, S.E.",
    "nickname": "Mega",
    "birthPlace": "Bogor",
    "birthDate": "1995-07-12",
    "gender": "Female",
    "address": "Jl. Kemuning IV No. 7, Jababeka Residence",
    "rt": "001",
    "rw": "003",
    "village": "Pasirgombong",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8168387815",
    "email": "mega.mega@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 857-1928-4038",
    "emergencyContactName": "Bambang Utomo",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 857-1928-4038",
    "departmentId": "dept-perkantoran",
    "positionId": "TPL-PER-009",
    "level": "Staff",
    "category": "Administrasi / Back Office",
    "division": "Operations & Facility Management",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-05-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "4580819280",
    "bankAccountHolder": "Mega Utami, S.E.",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490038",
    "bpjsKetenagakerjaan": "19018270038",
    "npwp": "800.385.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-038-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-038-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-038-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069507120038",
      "npwp": "800.385.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490038",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270038",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-038-1",
        "name": "KTP",
        "url": "/documents/emp-038_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-038-2",
        "name": "NPWP",
        "url": "/documents/emp-038_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-038-3",
        "name": "Ijazah",
        "url": "/documents/emp-038_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-038-4",
        "name": "CV",
        "url": "/documents/emp-038_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-038-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-038_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-039",
    "employeeId": "EMP-039",
    "nik": "3216068902140039",
    "fullName": "Kevin Sanjaya, S.Kom., M.B.A.",
    "nickname": "Kevin",
    "birthPlace": "Jakarta",
    "birthDate": "1989-02-14",
    "gender": "Male",
    "address": "Cluster Waterfront Blok B No. 3, Lippo Cikarang",
    "rt": "004",
    "rw": "008",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8198242776",
    "email": "kevin.kevin@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 811-9918-2039",
    "emergencyContactName": "Clara Wijaya",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 811-9918-2039",
    "departmentId": "dept-teknologi",
    "positionId": "TPL-TEK-003",
    "level": "Manager",
    "category": "Manajemen / Manajerial",
    "division": "Product & Technology",
    "jobGrade": "D",
    "status": "Active",
    "joinDate": "2020-06-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 25000000,
    "fixedAllowance": 5000000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "8220819287",
    "bankAccountHolder": "Kevin Sanjaya, S.Kom., M.B.A.",
    "bankBranch": "KC Kelapa Gading",
    "bpjsKesehatan": "0001827490039",
    "bpjsKetenagakerjaan": "19018270039",
    "npwp": "800.395.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-039-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 3500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-039-transport",
        "name": "Tunjangan Transportasi",
        "amount": 1500000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-039-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 600000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-039-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216068902140039",
      "npwp": "800.395.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490039",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270039",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-039-1",
        "name": "KTP",
        "url": "/documents/emp-039_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-039-2",
        "name": "NPWP",
        "url": "/documents/emp-039_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-039-3",
        "name": "Ijazah",
        "url": "/documents/emp-039_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-039-4",
        "name": "CV",
        "url": "/documents/emp-039_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-039-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-039_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-040",
    "employeeId": "EMP-040",
    "nik": "3216069510290040",
    "fullName": "Bella Safitri, S.Ds.",
    "nickname": "Bella",
    "birthPlace": "Bandung",
    "birthDate": "1995-10-29",
    "gender": "Female",
    "address": "Apartemen Trivium Tower 2 No. 1104",
    "rt": "002",
    "rw": "001",
    "village": "Sukaresmi",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8139054836",
    "email": "bella.bella@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 813-1928-4040",
    "emergencyContactName": "Drs. Safitri",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 813-1928-4040",
    "departmentId": "dept-teknologi",
    "positionId": "TPL-TEK-006",
    "level": "Staff",
    "category": "Teknologi & IT",
    "division": "Product & Technology",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-06-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310081927406",
    "bankAccountHolder": "Bella Safitri, S.Ds.",
    "bankBranch": "KC Cikarang Square",
    "bpjsKesehatan": "0001827490040",
    "bpjsKetenagakerjaan": "19018270040",
    "npwp": "800.405.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-040-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-040-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-040-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069510290040",
      "npwp": "800.405.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490040",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270040",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-040-1",
        "name": "KTP",
        "url": "/documents/emp-040_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-040-2",
        "name": "NPWP",
        "url": "/documents/emp-040_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-040-3",
        "name": "Ijazah",
        "url": "/documents/emp-040_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-040-4",
        "name": "CV",
        "url": "/documents/emp-040_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-040-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-040_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-041",
    "employeeId": "EMP-041",
    "nik": "3216069104180041",
    "fullName": "Yudha Prasetya, S.Kom., CEH, CISSP",
    "nickname": "Yudha",
    "birthPlace": "Yogyakarta",
    "birthDate": "1991-04-18",
    "gender": "Male",
    "address": "Cluster Greenwood No. 18, Lippo Cikarang",
    "rt": "003",
    "rw": "005",
    "village": "Cibatu",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8186954759",
    "email": "yudha.yudha@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 812-8819-4041",
    "emergencyContactName": "Nadia Pratiwi",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 812-8819-4041",
    "departmentId": "dept-teknologi",
    "positionId": "TPL-TEK-009",
    "level": "Specialist / Senior Staff",
    "category": "Teknologi & IT",
    "division": "Engineering & IT Infrastructure",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2021-03-15",
    "employeeType": "Tenaga Ahli",
    "contractType": "Freelance",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "6040819288",
    "bankAccountHolder": "Yudha Prasetya, S.Kom., CEH, CISSP",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490041",
    "bpjsKetenagakerjaan": "19018270041",
    "npwp": "800.415.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-041-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-041-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-041-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-041-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069104180041",
      "npwp": "800.415.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Tenaga Ahli",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490041",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270041",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-041-1",
        "name": "KTP",
        "url": "/documents/emp-041_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-041-2",
        "name": "NPWP",
        "url": "/documents/emp-041_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-041-3",
        "name": "Ijazah",
        "url": "/documents/emp-041_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-041-4",
        "name": "CV",
        "url": "/documents/emp-041_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-041-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-041_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-042",
    "employeeId": "EMP-042",
    "nik": "3216069208080042",
    "fullName": "Tri Haryanto, A.Md.T.",
    "nickname": "Haryanto",
    "birthPlace": "Boyolali",
    "birthDate": "1992-08-08",
    "gender": "Male",
    "address": "Perum Gramapuri Tamansari Blok D2 No. 8, Cibitung",
    "rt": "004",
    "rw": "009",
    "village": "Wanasari",
    "district": "Cibitung",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17520",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8152852440",
    "email": "haryanto.tri@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 856-9918-2042",
    "emergencyContactName": "Sunarti",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 856-9918-2042",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-002",
    "level": "Supervisor",
    "category": "Operasional & Lapangan",
    "division": "Plant & Factory Operations",
    "jobGrade": "C",
    "status": "Active",
    "joinDate": "2020-10-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-2-siang",
    "basicSalary": 12000000,
    "fixedAllowance": 2300000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BRI",
    "bankAccount": "012901827461504",
    "bankAccountHolder": "Tri Haryanto, A.Md.T.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490042",
    "bpjsKetenagakerjaan": "19018270042",
    "npwp": "800.425.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-042-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 1500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-042-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-042-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-042-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069208080042",
      "npwp": "800.425.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490042",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270042",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-042-1",
        "name": "KTP",
        "url": "/documents/emp-042_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-042-2",
        "name": "NPWP",
        "url": "/documents/emp-042_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-042-3",
        "name": "Ijazah",
        "url": "/documents/emp-042_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-042-4",
        "name": "CV",
        "url": "/documents/emp-042_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-042-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-042_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-043",
    "employeeId": "EMP-043",
    "nik": "3216069503150043",
    "fullName": "Wahyu Hidayat, S.Tr.T.",
    "nickname": "Wahyu",
    "birthPlace": "Semarang",
    "birthDate": "1995-03-15",
    "gender": "Male",
    "address": "Jl. Antilop IV No. 29, Cikarang Baru",
    "rt": "002",
    "rw": "004",
    "village": "Sertajaya",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8199014249",
    "email": "wahyu.wahyu@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 813-8819-4043",
    "emergencyContactName": "Hidayatullah",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 813-8819-4043",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-008",
    "level": "Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-07-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "7310819289",
    "bankAccountHolder": "Wahyu Hidayat, S.Tr.T.",
    "bankBranch": "KC Jababeka",
    "bpjsKesehatan": "0001827490043",
    "bpjsKetenagakerjaan": "19018270043",
    "npwp": "800.435.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-043-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-043-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-043-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069503150043",
      "npwp": "800.435.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490043",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270043",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-043-1",
        "name": "KTP",
        "url": "/documents/emp-043_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-043-2",
        "name": "NPWP",
        "url": "/documents/emp-043_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-043-3",
        "name": "Ijazah",
        "url": "/documents/emp-043_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-043-4",
        "name": "CV",
        "url": "/documents/emp-043_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-043-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-043_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-044",
    "employeeId": "EMP-044",
    "nik": "3216069412010044",
    "fullName": "Fajar Nugraha, S.T.",
    "nickname": "Fajar",
    "birthPlace": "Tasikmalaya",
    "birthDate": "1994-12-01",
    "gender": "Male",
    "address": "Perum Puri Cikarang Hijau Blok A3 No. 11",
    "rt": "001",
    "rw": "003",
    "village": "Karangasih",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8185701233",
    "email": "fajar.fajar@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 821-1928-4044",
    "emergencyContactName": "Asep Nugraha",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 821-1928-4044",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-009",
    "level": "Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-08-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1560091827407",
    "bankAccountHolder": "Fajar Nugraha, S.T.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490044",
    "bpjsKetenagakerjaan": "19018270044",
    "npwp": "800.445.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-044-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-044-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-044-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069412010044",
      "npwp": "800.445.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490044",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270044",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-044-1",
        "name": "KTP",
        "url": "/documents/emp-044_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-044-2",
        "name": "NPWP",
        "url": "/documents/emp-044_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-044-3",
        "name": "Ijazah",
        "url": "/documents/emp-044_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-044-4",
        "name": "CV",
        "url": "/documents/emp-044_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-044-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-044_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-045",
    "employeeId": "EMP-045",
    "nik": "3216069605190045",
    "fullName": "Dian Kusuma, S.T.",
    "nickname": "Dian",
    "birthPlace": "Surabaya",
    "birthDate": "1996-05-19",
    "gender": "Female",
    "address": "Jl. Kasuari VII No. 18, Cikarang Baru",
    "rt": "003",
    "rw": "006",
    "village": "Mekar Mukti",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8189005022",
    "email": "dian.dian@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 812-9918-4045",
    "emergencyContactName": "Kusuma Wardhana",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 812-9918-4045",
    "departmentId": "dept-manufaktur",
    "positionId": "TPL-MAN-010",
    "level": "Staff",
    "category": "Produksi & Manufaktur",
    "division": "Plant & Factory Operations",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-09-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "5270819290",
    "bankAccountHolder": "Dian Kusuma, S.T.",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490045",
    "bpjsKetenagakerjaan": "19018270045",
    "npwp": "800.455.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-045-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-045-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-045-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069605190045",
      "npwp": "800.455.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490045",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270045",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-045-1",
        "name": "KTP",
        "url": "/documents/emp-045_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-045-2",
        "name": "NPWP",
        "url": "/documents/emp-045_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-045-3",
        "name": "Ijazah",
        "url": "/documents/emp-045_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-045-4",
        "name": "CV",
        "url": "/documents/emp-045_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-045-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-045_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-046",
    "employeeId": "EMP-046",
    "nik": "3216069108110046",
    "fullName": "Mulyadi, S.T.",
    "nickname": "Mulyadi",
    "birthPlace": "Cilacap",
    "birthDate": "1991-08-11",
    "gender": "Male",
    "address": "Kp. Kaliulu RT 002 RW 001",
    "rt": "002",
    "rw": "001",
    "village": "Karangraharja",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8117666398",
    "email": "mulyadi.mulyadi@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 857-8819-4046",
    "emergencyContactName": "Wartini",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 857-8819-4046",
    "departmentId": "dept-teknik",
    "positionId": "TPL-MAN-004",
    "level": "Specialist / Senior Staff",
    "category": "Teknik & Rekayasa Mesin",
    "division": "Engineering & IT Infrastructure",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2021-04-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BRI",
    "bankAccount": "012901827461505",
    "bankAccountHolder": "Mulyadi, S.T.",
    "bankBranch": "KC Cikarang Barat",
    "bpjsKesehatan": "0001827490046",
    "bpjsKetenagakerjaan": "19018270046",
    "npwp": "800.465.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-046-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-046-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-046-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-046-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069108110046",
      "npwp": "800.465.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490046",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270046",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Medium",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-046-1",
        "name": "KTP",
        "url": "/documents/emp-046_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-046-2",
        "name": "NPWP",
        "url": "/documents/emp-046_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-046-3",
        "name": "Ijazah",
        "url": "/documents/emp-046_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-046-4",
        "name": "CV",
        "url": "/documents/emp-046_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-046-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-046_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-047",
    "employeeId": "EMP-047",
    "nik": "3216069001200047",
    "fullName": "Agus Santoso, S.E.",
    "nickname": "Agus",
    "birthPlace": "Sragen",
    "birthDate": "1990-01-20",
    "gender": "Male",
    "address": "Perumahan Villa Mutiara Cikarang Blok C2 No. 19",
    "rt": "004",
    "rw": "008",
    "village": "Sukasejati",
    "district": "Cikarang Selatan",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8175876419",
    "email": "agus.agus@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 2,
    "emergencyContact": "+62 813-1928-4047",
    "emergencyContactName": "Siti Maryam",
    "emergencyContactRelation": "Istri",
    "emergencyContactPhone": "+62 813-1928-4047",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-003",
    "level": "Supervisor",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "C",
    "status": "Active",
    "joinDate": "2021-06-15",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-2-siang",
    "basicSalary": 12000000,
    "fixedAllowance": 2300000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "4580819291",
    "bankAccountHolder": "Agus Santoso, S.E.",
    "bankBranch": "KC MM2100",
    "bpjsKesehatan": "0001827490047",
    "bpjsKetenagakerjaan": "19018270047",
    "npwp": "800.475.678.9-413.000",
    "taxStatus": "K/2",
    "allowances": [
      {
        "id": "alw-emp-047-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 1500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-047-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-047-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-047-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069001200047",
      "npwp": "800.475.678.9-413.000",
      "ptkpStatus": "K/2",
      "terCategory": "B",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490047",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 4,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270047",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-047-1",
        "name": "KTP",
        "url": "/documents/emp-047_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-047-2",
        "name": "NPWP",
        "url": "/documents/emp-047_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-047-3",
        "name": "Ijazah",
        "url": "/documents/emp-047_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-047-4",
        "name": "CV",
        "url": "/documents/emp-047_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-047-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-047_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-048",
    "employeeId": "EMP-048",
    "nik": "3216069509040048",
    "fullName": "Rina Marlina, A.Md.Log.",
    "nickname": "Rina",
    "birthPlace": "Subang",
    "birthDate": "1995-09-04",
    "gender": "Female",
    "address": "Jl. Rusa IV No. 21, Cikarang Baru",
    "rt": "002",
    "rw": "005",
    "village": "Sertajaya",
    "district": "Cikarang Timur",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17550",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8116520543",
    "email": "rina.rina@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 821-8819-4048",
    "emergencyContactName": "Marlina Sanjaya",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 821-8819-4048",
    "departmentId": "dept-logistik",
    "positionId": "TPL-LOG-010",
    "level": "Staff",
    "category": "Supply Chain & Logistik",
    "division": "Supply Chain, Logistics & Procurement",
    "jobGrade": "A",
    "status": "Active",
    "joinDate": "2022-10-01",
    "employeeType": "Pegawai Tidak Tetap",
    "contractType": "Contract",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-1-pagi",
    "basicSalary": 8000000,
    "fixedAllowance": 800000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank Mandiri",
    "bankAccount": "1310081927408",
    "bankAccountHolder": "Rina Marlina, A.Md.Log.",
    "bankBranch": "KC Cikarang",
    "bpjsKesehatan": "0001827490048",
    "bpjsKetenagakerjaan": "19018270048",
    "npwp": "800.485.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-048-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-048-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-048-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069509040048",
      "npwp": "800.485.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tidak Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490048",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270048",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-048-1",
        "name": "KTP",
        "url": "/documents/emp-048_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-048-2",
        "name": "NPWP",
        "url": "/documents/emp-048_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-048-3",
        "name": "Ijazah",
        "url": "/documents/emp-048_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-048-4",
        "name": "CV",
        "url": "/documents/emp-048_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-048-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-048_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-049",
    "employeeId": "EMP-049",
    "nik": "3216069311150049",
    "fullName": "Yuni Astuti, S.Ak.",
    "nickname": "Yuni",
    "birthPlace": "Magelang",
    "birthDate": "1993-11-15",
    "gender": "Female",
    "address": "Jl. Kemuning Raya No. 31, Jababeka Residence",
    "rt": "003",
    "rw": "007",
    "village": "Pasirgombong",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Milik Sendiri",
    "phone": "+62 8168414232",
    "email": "yuni.yuni@pabrik-manufaktur.co.id",
    "maritalStatus": "Married",
    "dependents": 1,
    "emergencyContact": "+62 811-1928-4049",
    "emergencyContactName": "Budi Hartono",
    "emergencyContactRelation": "Suami",
    "emergencyContactPhone": "+62 811-1928-4049",
    "departmentId": "dept-sdm",
    "positionId": "TPL-SDM-008",
    "level": "Supervisor",
    "category": "SDM & General Affairs",
    "division": "People & Organization (HR)",
    "jobGrade": "C",
    "status": "Active",
    "joinDate": "2021-11-01",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 12000000,
    "fixedAllowance": 2300000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "6820819292",
    "bankAccountHolder": "Yuni Astuti, S.Ak.",
    "bankBranch": "KC Lippo Cikarang",
    "bpjsKesehatan": "0001827490049",
    "bpjsKetenagakerjaan": "19018270049",
    "npwp": "800.495.678.9-413.000",
    "taxStatus": "K/1",
    "allowances": [
      {
        "id": "alw-emp-049-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 1500000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-049-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-049-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-049-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069311150049",
      "npwp": "800.495.678.9-413.000",
      "ptkpStatus": "K/1",
      "terCategory": "B",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490049",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 3,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270049",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-049-1",
        "name": "KTP",
        "url": "/documents/emp-049_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-049-2",
        "name": "NPWP",
        "url": "/documents/emp-049_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-049-3",
        "name": "Ijazah",
        "url": "/documents/emp-049_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-049-4",
        "name": "CV",
        "url": "/documents/emp-049_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-049-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-049_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  },
  {
    "id": "emp-050",
    "employeeId": "EMP-050",
    "nik": "3216069404020050",
    "fullName": "Aris Munandar, S.Kom.",
    "nickname": "Aris",
    "birthPlace": "Semarang",
    "birthDate": "1994-04-02",
    "gender": "Male",
    "address": "Jl. Kasuari I No. 4, Cikarang Baru",
    "rt": "001",
    "rw": "002",
    "village": "Mekar Mukti",
    "district": "Cikarang Utara",
    "city": "Kabupaten Bekasi",
    "province": "Jawa Barat",
    "postalCode": "17530",
    "residenceStatus": "Kontrak / Sewa",
    "phone": "+62 8155292148",
    "email": "aris.aris@pabrik-manufaktur.co.id",
    "maritalStatus": "Single",
    "dependents": 0,
    "emergencyContact": "+62 812-7719-4050",
    "emergencyContactName": "Munandar Setyo",
    "emergencyContactRelation": "Orang Tua",
    "emergencyContactPhone": "+62 812-7719-4050",
    "departmentId": "dept-teknologi",
    "positionId": "TPL-TEK-002",
    "level": "Specialist / Senior Staff",
    "category": "Teknologi & IT",
    "division": "Product & Technology",
    "jobGrade": "B",
    "status": "Active",
    "joinDate": "2022-11-15",
    "employeeType": "Pegawai Tetap",
    "contractType": "Permanent",
    "workLocation": "Pabrik Cikarang - Kawasan Industri MM2100",
    "shift": "shift-reguler",
    "basicSalary": 15000000,
    "fixedAllowance": 1550000,
    "paymentMethod": "Transfer Bank",
    "bankName": "Bank BCA",
    "bankAccount": "8220819293",
    "bankAccountHolder": "Aris Munandar, S.Kom.",
    "bankBranch": "KC Cikarang Square",
    "bpjsKesehatan": "0001827490050",
    "bpjsKetenagakerjaan": "19018270050",
    "npwp": "800.505.678.9-413.000",
    "taxStatus": "TK/0",
    "allowances": [
      {
        "id": "alw-emp-050-jabatan",
        "name": "Tunjangan Jabatan",
        "amount": 750000,
        "ruleId": "tunjangan_jabatan",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-050-transport",
        "name": "Tunjangan Transportasi",
        "amount": 800000,
        "ruleId": "tunjangan_transportasi",
        "category": "Tunjangan Tetap"
      },
      {
        "id": "alw-emp-050-komunikasi",
        "name": "Tunjangan Komunikasi & Pulsa",
        "amount": 350000,
        "ruleId": "tunjangan_komunikasi",
        "category": "Tunjangan Tidak Tetap"
      },
      {
        "id": "alw-emp-050-makan",
        "name": "Tunjangan Uang Makan",
        "amount": 660000,
        "ruleId": "tunjangan_makan",
        "category": "Tunjangan Tidak Tetap"
      }
    ],
    "taxProfile": {
      "nik": "3216069404020050",
      "npwp": "800.505.678.9-413.000",
      "ptkpStatus": "TK/0",
      "terCategory": "A",
      "employeeType": "Pegawai Tetap",
      "taxMethod": "Gross",
      "hasNpwp": true,
      "ruleId": "rule_pph21_ter"
    },
    "isTaxActive": true,
    "bpjsKesehatanProfile": {
      "participantNumber": "0001827490050",
      "participantType": "PPU Badan Usaha",
      "activeStatus": "Active",
      "employeeRate": 1,
      "employerRate": 4,
      "familyMembersCovered": 1,
      "ruleId": "rule_bpjs_kes_1"
    },
    "bpjsKetenagakerjaanProfile": {
      "kpjNumber": "19018270050",
      "activeStatus": "Active",
      "hasJht": true,
      "hasJkk": true,
      "jkkRiskCategory": "Low",
      "hasJkm": true,
      "hasJp": true,
      "hasJkp": true,
      "ruleId": "rule_bpjs_tk_1"
    },
    "documents": [
      {
        "id": "doc-emp-050-1",
        "name": "KTP",
        "url": "/documents/emp-050_ktp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-050-2",
        "name": "NPWP",
        "url": "/documents/emp-050_npwp.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-050-3",
        "name": "Ijazah",
        "url": "/documents/emp-050_ijazah.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-050-4",
        "name": "CV",
        "url": "/documents/emp-050_cv.pdf",
        "category": "Wajib",
        "notes": "Dokumen terverifikasi oleh HR & Legal"
      },
      {
        "id": "doc-emp-050-khusus-1",
        "name": "Surat Izin Profesi / STR / SIO (jika diwajibkan oleh regulasi)",
        "url": "/documents/emp-050_sertifikat_keahlian.pdf",
        "category": "Khusus",
        "notes": "Sertifikasi kompetensi resmi"
      }
    ],
    "createdAt": "{{NOW-180D}}",
    "updatedAt": "{{ISO_NOW}}"
  }
];
