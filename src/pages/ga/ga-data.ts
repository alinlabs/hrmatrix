import { 
  OfficeAsset, 
  OfficeSupplyItem, 
  PurchaseRequest, 
  FacilityMaintenanceSchedule, 
  RoomBooking, 
  MaintenanceTicket, 
  GAVendor, 
  OfficePermit, 
  GuestVisitorLog, 
  OfficeMailLog 
} from './types';

export const INITIAL_ASSETS: OfficeAsset[] = [
  {
    id: 'ast-001',
    assetCode: 'AST-IT-2025-001',
    name: 'MacBook Pro 14" M3 Pro 18GB/512GB',
    category: 'ELEKTRONIK_IT',
    brandModel: 'Apple MacBook Pro 14 (Space Gray)',
    serialNumber: 'C02G8492MD6R',
    purchaseDate: '2025-01-15',
    purchaseCost: 31999000,
    currentValue: 27500000,
    status: 'DIPAKAI_KARYAWAN',
    condition: 'SANGAT_BAIK',
    assignedToEmployeeId: 'emp-001',
    assignedToEmployeeName: 'Budi Santoso',
    assignedDepartment: 'Engineering / IT',
    handoverDate: '2025-01-20',
    location: 'Lantai 3 - Workspace Dev',
    warrantyExpiry: '2027-01-15',
    notes: 'Unit operasional Lead Software Engineer. Dilengkapi casing & adaptor 70W.'
  },
  {
    id: 'ast-002',
    assetCode: 'AST-IT-2025-002',
    name: 'ThinkPad T14 Gen 4 Ryzen 7 32GB',
    category: 'ELEKTRONIK_IT',
    brandModel: 'Lenovo ThinkPad T14 Gen 4',
    serialNumber: 'PF49B11029',
    purchaseDate: '2025-02-10',
    purchaseCost: 19500000,
    currentValue: 17200000,
    status: 'DIPAKAI_KARYAWAN',
    condition: 'SANGAT_BAIK',
    assignedToEmployeeId: 'emp-002',
    assignedToEmployeeName: 'Siti Rahmawati',
    assignedDepartment: 'Human Resources',
    handoverDate: '2025-02-12',
    location: 'Lantai 2 - HR & GA Office',
    warrantyExpiry: '2028-02-10',
    notes: 'Laptop operasional HR Supervisor untuk payroll & database personalia.'
  },
  {
    id: 'ast-003',
    assetCode: 'AST-VH-2024-001',
    name: 'Toyota Avanza 1.5 G CVT (B 1829 SZO)',
    category: 'KENDARAAN_OPERASIONAL',
    brandModel: 'Toyota All New Avanza 1.5 G',
    serialNumber: 'MHFM1B3J128912',
    purchaseDate: '2024-03-10',
    purchaseCost: 265000000,
    currentValue: 228000000,
    status: 'TERSEDIA',
    condition: 'BAIK',
    location: 'Basement 1 - Parkir Operasional GA',
    warrantyExpiry: '2027-03-10',
    notes: 'Kendaraan dinas operasional kantor. Servis berkala Auto2000 setiap 10.000 KM.'
  },
  {
    id: 'ast-004',
    assetCode: 'AST-FN-2024-008',
    name: 'Kursi Ergonomis High Back Mesh Ergohuman',
    category: 'FURNITUR_KANTOR',
    brandModel: 'Ergohuman Plus Elite Edition',
    serialNumber: 'ERGO-2024-088',
    purchaseDate: '2024-06-01',
    purchaseCost: 6500000,
    currentValue: 5200000,
    status: 'DIPAKAI_KARYAWAN',
    condition: 'BAIK',
    assignedToEmployeeId: 'emp-003',
    assignedToEmployeeName: 'Ahmad Fauzi',
    assignedDepartment: 'Finance & Accounting',
    handoverDate: '2024-06-05',
    location: 'Lantai 2 - Finance Room',
    notes: 'Kenyamanan kerja ergonomis staf keuangan.'
  },
  {
    id: 'ast-005',
    assetCode: 'AST-MK-2024-003',
    name: 'Mesin Fotocopy Multifungsi Fuji Xerox ApeosPort',
    category: 'MESIN_ALAT_KERJA',
    brandModel: 'Fuji Xerox ApeosPort C3060',
    serialNumber: 'FX-3060-9921',
    purchaseDate: '2024-01-20',
    purchaseCost: 48000000,
    currentValue: 36000000,
    status: 'TERSEDIA',
    condition: 'SANGAT_BAIK',
    location: 'Lantai 2 - Printing Corner',
    notes: 'Kontrak sewa-beli & servis rutin bulanan PT Astragraphia.'
  },
  {
    id: 'ast-006',
    assetCode: 'AST-IT-2024-015',
    name: 'Smart Projector Epson EB-FH52 4000 Lumens',
    category: 'ELEKTRONIK_IT',
    brandModel: 'Epson EB-FH52 Full HD Wireless',
    serialNumber: 'EP-FH52-1849',
    purchaseDate: '2024-08-14',
    purchaseCost: 14500000,
    currentValue: 12000000,
    status: 'TERSEDIA',
    condition: 'SANGAT_BAIK',
    location: 'Lantai 3 - Ruang Rapat Utama (Boardroom)',
    notes: 'Terpasang di ceiling bracket Ruang Meeting Garuda.'
  },
  {
    id: 'ast-007',
    assetCode: 'AST-IT-2023-040',
    name: 'Dell Latitude 3420 Core i5 (Perlu Servis Baterai)',
    category: 'ELEKTRONIK_IT',
    brandModel: 'Dell Latitude 3420',
    serialNumber: 'DL3420-7718',
    purchaseDate: '2023-09-10',
    purchaseCost: 12500000,
    currentValue: 6500000,
    status: 'SEDANG_SERVIS',
    condition: 'PERLU_PERBAIKAN',
    location: 'Gudang GA / Vendor Servis Dell',
    notes: 'Penggantian baterai drop di service center resmi.'
  }
];

export const INITIAL_SUPPLIES: OfficeSupplyItem[] = [
  {
    id: 'sup-001',
    code: 'ATK-KRT-01',
    name: 'Kertas HVS PaperOne A4 80gr',
    category: 'ATK_KERTAS',
    currentStock: 18,
    minStockLevel: 25,
    unit: 'Rim',
    unitPrice: 58000,
    location: 'Lemari ATK Lantai 2',
    lastRestockedDate: '2026-02-15',
    supplierName: 'CV Sumber Makmur Stationery'
  },
  {
    id: 'sup-002',
    code: 'ATK-KRT-02',
    name: 'Kertas HVS PaperOne F4/Folio 75gr',
    category: 'ATK_KERTAS',
    currentStock: 35,
    minStockLevel: 15,
    unit: 'Rim',
    unitPrice: 62000,
    location: 'Lemari ATK Lantai 2',
    lastRestockedDate: '2026-03-01',
    supplierName: 'CV Sumber Makmur Stationery'
  },
  {
    id: 'sup-003',
    code: 'ATK-TNK-01',
    name: 'Toner Cartridge HP LaserJet 85A Black',
    category: 'TINTA_TONER',
    currentStock: 3,
    minStockLevel: 5,
    unit: 'Pcs',
    unitPrice: 850000,
    location: 'Rak IT & Toner Lt. 2',
    lastRestockedDate: '2026-01-20',
    supplierName: 'PT Mitra Sukses Solusindo'
  },
  {
    id: 'sup-004',
    code: 'PTR-KOP-01',
    name: 'Kopi Arabika Biji/Bubuk House Blend 1 Kg',
    category: 'PANTRY_KONSUMSI',
    currentStock: 8,
    minStockLevel: 4,
    unit: 'Pack',
    unitPrice: 145000,
    location: 'Pantry Utama Lantai 2 & 3',
    lastRestockedDate: '2026-03-10',
    supplierName: 'Otten Coffee Roastery'
  },
  {
    id: 'sup-005',
    code: 'PTR-AIR-01',
    name: 'Air Mineral Galon Aqua 19 Liter',
    category: 'PANTRY_KONSUMSI',
    currentStock: 6,
    minStockLevel: 8,
    unit: 'Galon',
    unitPrice: 22000,
    location: 'Storage Galon Pantry Lt. 1',
    lastRestockedDate: '2026-03-28',
    supplierName: 'Agen Resmi Aqua Mitra Mandiri'
  },
  {
    id: 'sup-006',
    code: 'KBR-HYG-01',
    name: 'Hand Soap Anti-Bacterial Refill 4 Liter',
    category: 'KEBERSIHAN_SANITASI',
    currentStock: 12,
    minStockLevel: 6,
    unit: 'Jerigen',
    unitPrice: 75000,
    location: 'Gudang Janitor Basement',
    lastRestockedDate: '2026-03-05',
    supplierName: 'PT Clean Guard Indonesia'
  },
  {
    id: 'sup-007',
    code: 'KBR-TIS-01',
    name: 'Tissue Facial Paseo 250s & Tissue Roll Toilet',
    category: 'KEBERSIHAN_SANITASI',
    currentStock: 40,
    minStockLevel: 30,
    unit: 'Dus/Pack',
    unitPrice: 12000,
    location: 'Gudang Janitor Basement',
    lastRestockedDate: '2026-03-12',
    supplierName: 'CV Sumber Makmur Stationery'
  },
  {
    id: 'sup-008',
    code: 'SFT-MED-01',
    name: 'Refill Kotak P3K Standar K3 Disnaker Bentuk A',
    category: 'SAFETY_FIRSTAID',
    currentStock: 5,
    minStockLevel: 3,
    unit: 'Set',
    unitPrice: 280000,
    location: 'Pos P3K Lt. 1, 2, 3',
    lastRestockedDate: '2026-02-01',
    supplierName: 'PT Medika Safety Tools'
  }
];

export const INITIAL_PURCHASE_REQUESTS: PurchaseRequest[] = [
  {
    id: 'pr-001',
    prNumber: 'PR-GA-2026-004',
    requestDate: '2026-03-30',
    requesterName: 'Farhan Rizki (Admin GA)',
    department: 'General Affairs',
    title: 'Pengadaan Ulang Kertas A4 & Toner Printer Bulan April 2026',
    status: 'MENUNGGU_APPROVAL',
    priority: 'TINGGI',
    estimatedCost: 3840000,
    justification: 'Stok Kertas A4 di bawah batas minimum (18 rim tersisa) menjelang rekap audit Q1 dan penagihan invoice.',
    items: [
      { itemName: 'Kertas HVS PaperOne A4 80gr', quantity: 30, unit: 'Rim', estimatedPrice: 58000, notes: 'Untuk departemen Finance, HR & Operasional' },
      { itemName: 'Toner Cartridge HP 85A Black', quantity: 2, unit: 'Pcs', estimatedPrice: 850000, notes: 'Cadangan printer admin' },
      { itemName: 'Air Mineral Galon Aqua 19L', quantity: 18, unit: 'Galon', estimatedPrice: 22000, notes: 'Kebutuhan pantry 2 minggu' }
    ]
  },
  {
    id: 'pr-002',
    prNumber: 'PR-GA-2026-003',
    requestDate: '2026-03-15',
    requesterName: 'Dewi Lestari (Marketing Lead)',
    department: 'Marketing & Sales',
    title: 'Pengadaan Standing Banner & Brosur Pameran HR Summit 2026',
    status: 'DISETUJUI',
    priority: 'SEDANG',
    estimatedCost: 4500000,
    justification: 'Materi booth pameran sponsorship HR & Tech Conference Jakarta.',
    items: [
      { itemName: 'Roll Up Banner Aluminium 80x200cm Albatros', quantity: 3, unit: 'Unit', estimatedPrice: 350000 },
      { itemName: 'Brosur Company Profile Full Color Art Paper 150gr', quantity: 1000, unit: 'Lembar', estimatedPrice: 3450 }
    ],
    approvedBy: 'Hendra Wijaya (HR & GA Manager)',
    approvedDate: '2026-03-16'
  },
  {
    id: 'pr-003',
    prNumber: 'PR-GA-2026-002',
    requestDate: '2026-02-20',
    requesterName: 'Andi Pratama',
    department: 'IT Infrastructure',
    title: 'Pengadaan 2 Unit UPS APC 1500VA untuk Server Room',
    status: 'DIBELI',
    priority: 'URGENT',
    estimatedCost: 7200000,
    justification: 'Mencegah server down saat perpindahan listrik PLN ke Genset otomatis.',
    items: [
      { itemName: 'APC Back-UPS Pro 1500VA BR1500GI', quantity: 2, unit: 'Unit', estimatedPrice: 3600000 }
    ],
    approvedBy: 'Direktur Operasional',
    approvedDate: '2026-02-21'
  }
];

export const INITIAL_MAINTENANCE_SCHEDULES: FacilityMaintenanceSchedule[] = [
  {
    id: 'mnt-001',
    title: 'Servis & Cuci Rutin 16 Unit AC Split & Cassette Gedung',
    facilityType: 'AC_HVAC',
    location: 'Lantai 1, 2, 3 Kantor Pusat',
    scheduledDate: '2026-04-12',
    frequency: 'BULANAN',
    technicianVendor: 'CV Sejuk Prima HVAC Servis',
    estimatedCost: 1850000,
    status: 'TERJADWAL',
    lastDoneDate: '2026-03-10',
    nextDueDate: '2026-04-12',
    notes: 'Termasuk cek tekanan freon R32, pembersihan filter dan drainase air.'
  },
  {
    id: 'mnt-002',
    title: 'Uji Beban & Penggantian Oli Filter Genset Cummins 60 kVA',
    facilityType: 'LISTRIK_GENSET',
    location: 'Ruang Genset Basement',
    scheduledDate: '2026-04-25',
    frequency: 'TRIWULAN',
    technicianVendor: 'PT Power Electric Nusantara',
    estimatedCost: 3500000,
    status: 'TERJADWAL',
    lastDoneDate: '2026-01-20',
    nextDueDate: '2026-04-25',
    notes: 'Wajib dijalankan saat hari Sabtu agar tidak mengganggu jam operasional kantor.'
  },
  {
    id: 'mnt-003',
    title: 'Inspeksi & Uji Tekanan Tabung APAR (Alat Pemadam Api Ringan)',
    facilityType: 'KEAMANAN_CCTV',
    location: '12 Titik Seluruh Lantai Gedung',
    scheduledDate: '2026-05-05',
    frequency: 'SEMESTERAN',
    technicianVendor: 'PT Pemadam Safety Guard',
    estimatedCost: 1200000,
    status: 'TERJADWAL',
    lastDoneDate: '2025-11-05',
    nextDueDate: '2026-05-05',
    notes: 'Pemeriksaan manometer, nozzle dan masa kadaluwarsa bubuk powder ABC.'
  },
  {
    id: 'mnt-004',
    title: 'Deep Cleaning & Fogging Disinfeksi Ruang Kerja & Karpet',
    facilityType: 'PLUMBING_TOILET',
    location: 'Area Open Space Lantai 2 & 3',
    scheduledDate: '2026-04-05',
    frequency: 'BULANAN',
    technicianVendor: 'PT Kilap Bersih Indonesia',
    estimatedCost: 2200000,
    status: 'TERJADWAL',
    lastDoneDate: '2026-03-05',
    nextDueDate: '2026-04-05'
  }
];

export const INITIAL_ROOM_BOOKINGS: RoomBooking[] = [
  {
    id: 'rm-001',
    roomName: 'Ruang Garuda (Meeting Room Utama - Kapasitas 16 Orang)',
    date: '2026-04-06',
    startTime: '09:00',
    endTime: '11:30',
    bookedByEmployeeName: 'Budi Santoso',
    department: 'Engineering',
    purpose: 'Sprint Planning Q2 & Product Architecture Review',
    attendeesCount: 12,
    needsPantry: true,
    needsProjector: true,
    status: 'CONFIRMED'
  },
  {
    id: 'rm-002',
    roomName: 'Ruang Merpati (Meeting Room Kecil - Kapasitas 6 Orang)',
    date: '2026-04-06',
    startTime: '13:30',
    endTime: '15:00',
    bookedByEmployeeName: 'Siti Rahmawati',
    department: 'Human Resources',
    purpose: 'Interview Kandidat Senior Backend Engineer & HR Assessment',
    attendeesCount: 4,
    needsPantry: true,
    needsProjector: false,
    status: 'CONFIRMED'
  },
  {
    id: 'rm-003',
    roomName: 'Ruang Boardroom Eksekutif (Lantai 3 - Kapasitas 10 Orang)',
    date: '2026-04-07',
    startTime: '10:00',
    endTime: '12:00',
    bookedByEmployeeName: 'Hendra Wijaya',
    department: 'Management',
    purpose: 'Monthly Board of Directors & General Affairs Budget Meeting',
    attendeesCount: 8,
    needsPantry: true,
    needsProjector: true,
    status: 'CONFIRMED'
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'WO-GA-2026-018',
    title: 'AC Ruang Meeting Merpati Mengeluarkan Tetesan Air',
    reporterName: 'Anisa Putri (Finance)',
    department: 'Finance',
    location: 'Lantai 2 - Ruang Meeting Merpati',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-04-04 08:30',
    description: 'Pipa pembuangan AC indoor tersumbat lumut sehingga air menetes ke karpet lantai.',
    assignedStaff: 'Joko (Tim Teknisi GA Internal)'
  },
  {
    id: 'tkt-002',
    ticketNumber: 'WO-GA-2026-017',
    title: 'Lampu LED Downlight Pantry Lantai 3 Berkedip',
    reporterName: 'Rian Pratama',
    department: 'Design / Creative',
    location: 'Pantry Lantai 3',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: '2026-04-03 14:15',
    description: 'Driver LED perlu diganti dengan lampu baru 12W Phillips warm white.'
  },
  {
    id: 'tkt-003',
    ticketNumber: 'WO-GA-2026-016',
    title: 'Kran Wastafel Toilet Pria Lantai 1 Bocor Halus',
    reporterName: 'Suryanto',
    department: 'Logistik',
    location: 'Toilet Pria Lantai 1',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-03-29 11:00',
    resolvedAt: '2026-03-30 09:30',
    cost: 85000,
    description: 'Penggantian seal karet kran wastafel toto.'
  }
];

export const INITIAL_VENDORS: GAVendor[] = [
  {
    id: 'vnd-001',
    companyName: 'CV Sumber Makmur Stationery',
    category: 'SUPPLIER_ATK',
    contactPerson: 'Ibu Linda (Sales Manager)',
    phone: '0812-9988-7766',
    email: 'sales@sumbermakmur-atk.co.id',
    address: 'Jl. Percetakan Negara No. 42, Jakarta Pusat',
    contractStatus: 'AKTIF',
    contractStartDate: '2025-01-01',
    contractEndDate: '2026-12-31',
    paymentTerms: 'TOP 30 Hari Invoice',
    rating: 5,
    notes: 'Rekan pengadaan ATK resmi kantor. Diskon 12% untuk pembelian grosir kertas.'
  },
  {
    id: 'vnd-002',
    companyName: 'PT Astragraphia Tbk',
    category: 'IT_HARDWARE_LEASING',
    contactPerson: 'Pak Dimas (Account Executive)',
    phone: '021-3908888',
    email: 'support@astragraphia.co.id',
    address: 'Jl. Kramat Raya No. 43, Senen, Jakarta',
    contractStatus: 'AKTIF',
    contractStartDate: '2024-06-01',
    contractEndDate: '2027-05-31',
    paymentTerms: 'Sewa Bulanan Rp 2.500.000 / Mesin',
    rating: 5,
    notes: 'Sewa mesin fotocopy all-in-one Fuji Xerox include toner & maintenance free.'
  },
  {
    id: 'vnd-003',
    companyName: 'CV Sejuk Prima HVAC Servis',
    category: 'MAINTENANCE_AC_GEDUNG',
    contactPerson: 'Pak Wahyu (Koordinator Teknisi)',
    phone: '0813-8877-1122',
    email: 'info@sejukprimahvac.com',
    address: 'Komp. Ruko Fatmawati Mas Blok B-12, Jakarta Selatan',
    contractStatus: 'AKTIF',
    contractStartDate: '2025-04-01',
    contractEndDate: '2026-03-31',
    paymentTerms: 'COD / Transfer per Kedatangan',
    rating: 4,
    notes: 'Kontrak maintenance berkala AC seluruh gedung 16 unit setiap 45 hari.'
  },
  {
    id: 'vnd-004',
    companyName: 'PT Garda Utama Security & Cleaning Service',
    category: 'CLEANING_SECURITY',
    contactPerson: 'Mayor (Purn) Bambang',
    phone: '021-7890123',
    email: 'kontrak@gardautama.co.id',
    address: 'Jl. TB Simatupang No. 88, Jakarta Selatan',
    contractStatus: 'MENDEKATI_BERAKHIR',
    contractStartDate: '2025-05-01',
    contractEndDate: '2026-04-30',
    paymentTerms: 'Bulanan Net 15',
    rating: 4,
    notes: 'Penyedia 4 personil security 24/7 dan 3 personil cleaning service kantor.'
  }
];

export const INITIAL_PERMITS: OfficePermit[] = [
  {
    id: 'pmt-001',
    permitNumber: '503/SLF-DKI/2023/0488',
    name: 'Sertifikat Laik Fungsi (SLF) Gedung Perkantoran',
    issuer: 'Dinas Penanaman Modal & PTSP Provinsi DKI Jakarta',
    category: 'GEDUNG_TATA_KOTA',
    issuedDate: '2023-08-15',
    expiryDate: '2028-08-15',
    status: 'BERLAKU',
    picName: 'Hendra Wijaya (HR & GA Lead)',
    notes: 'Wajib perpanjangan 5 tahunan dengan uji kelayakan struktur & sistem mekanikal.'
  },
  {
    id: 'pmt-002',
    permitNumber: 'KEP.118/DISNAKER-K3/GENSET/2024',
    name: 'Surat Izin Operasional K3 Bejana Tekan & Genset 60 kVA',
    issuer: 'Dinas Tenaga Kerja, Transmigrasi & Energi',
    category: 'K3_KESELAMATAN',
    issuedDate: '2024-05-10',
    expiryDate: '2027-05-10',
    status: 'BERLAKU',
    picName: 'Farhan Rizki (GA Staff)',
    annualCost: 1500000,
    notes: 'Riksa uji berkala oleh PJK3 resmi terdaftar Kemenaker.'
  },
  {
    id: 'pmt-003',
    permitNumber: 'POL-PAR-2025-098812',
    name: 'Polis Asuransi Property All Risk (PAR) & Gempa Gedung Kantor',
    issuer: 'PT Asuransi Allianz Utama Indonesia',
    category: 'ASURANSI_ASET',
    issuedDate: '2025-06-01',
    expiryDate: '2026-05-31',
    status: 'PERLU_PERPANJANGAN',
    picName: 'Siti Rahmawati (HR/GA)',
    annualCost: 14500000,
    notes: 'Nilai pertanggungan gedung & seluruh aset inventaris sebesar Rp 8.5 Miliar. Jatuh tempo akhir Mei 2026!'
  },
  {
    id: 'pmt-004',
    permitNumber: 'SPPL-LH-JKT/2022/1004',
    name: 'Surat Pernyataan Pengelolaan Lingkungan Hidup (SPPL) Limbah Domestik',
    issuer: 'Dinas Lingkungan Hidup',
    category: 'LINGKUNGAN_AMDAL',
    issuedDate: '2022-11-20',
    expiryDate: '2027-11-20',
    status: 'BERLAKU',
    picName: 'Hendra Wijaya'
  }
];

export const INITIAL_GUESTS: GuestVisitorLog[] = [
  {
    id: 'gst-001',
    visitorName: 'Ir. Ahmad Subagyo',
    institution: 'PT Telkom Indonesia (Enterprise Division)',
    phone: '0811-2345-6789',
    destinationPerson: 'Budi Santoso (Lead Engineer)',
    destinationDepartment: 'Engineering / IT',
    purpose: 'Presentasi Upgrade Bandwidth Dedicated Internet 500 Mbps & Cloud Connect',
    visitorPassNumber: 'VIS-008',
    checkInTime: '2026-04-04 09:15',
    checkOutTime: '2026-04-04 11:30',
    status: 'CHECKED_OUT',
    identityType: 'KTP'
  },
  {
    id: 'gst-002',
    visitorName: 'Dra. Endang Sulistyowati',
    institution: 'Pengawas Ketenagakerjaan Disnaker Prov. DKI Jakarta',
    phone: '0812-4455-6677',
    destinationPerson: 'Hendra Wijaya (HR & GA Lead)',
    destinationDepartment: 'HR & Legal Affairs',
    purpose: 'Kunjungan Verifikasi Rutin Pendaftaran Peraturan Perusahaan (PP) & K3',
    visitorPassNumber: 'VIS-001',
    checkInTime: '2026-04-04 13:00',
    status: 'CHECKED_IN',
    identityType: 'ID_CARD',
    temperatureOrNotes: 'Tamu VIP Dinas Ketenagakerjaan. Didampingi di Ruang Boardroom.'
  },
  {
    id: 'gst-003',
    visitorName: 'Rudi Hartono (Auditor ISO)',
    institution: 'TÜV Rheinland Indonesia',
    phone: '0815-9988-1234',
    destinationPerson: 'Siti Rahmawati',
    destinationDepartment: 'Quality & HR',
    purpose: 'Pra-Audit Standar ISO 9001:2015 Sistem Manajemen Mutu',
    visitorPassNumber: 'VIS-002',
    checkInTime: '2026-04-03 08:45',
    checkOutTime: '2026-04-03 16:30',
    status: 'CHECKED_OUT',
    identityType: 'ID_CARD'
  }
];

export const INITIAL_MAILS: OfficeMailLog[] = [
  {
    id: 'ml-001',
    type: 'SURAT_MASUK',
    referenceNumber: '042/DISNAKER-WAS/IV/2026',
    date: '2026-04-02',
    senderOrRecipient: 'Dinas Tenaga Kerja & Transmigrasi Provinsi',
    subject: 'Surat Pemberitahuan Jadwal Monev Wajib Lapor Ketenagakerjaan (WLKP)',
    recipientEmployeeName: 'Hendra Wijaya (HR & GA)',
    courierService: 'Pos Kilat Khusus',
    receivedStatus: 'DISERAHKAN_KE_PENERIMA',
    receivedAt: '2026-04-02 11:15'
  },
  {
    id: 'ml-002',
    type: 'SURAT_KELUAR',
    referenceNumber: '088/HRM-GA/EXT/III/2026',
    date: '2026-03-28',
    senderOrRecipient: 'PT Asuransi Allianz Utama Indonesia',
    subject: 'Surat Permohonan Penawaran Perpanjangan Polis Property All Risk Gedung 2026',
    recipientEmployeeName: 'Farhan Rizki (GA Staff)',
    courierService: 'Email Resmi & Kurir JNE Express',
    receivedStatus: 'TERKIRIM'
  },
  {
    id: 'ml-003',
    type: 'PAKET_EKSPEDISI',
    referenceNumber: 'RESI: JNE-CGK0891823901',
    date: '2026-04-04',
    senderOrRecipient: 'Apple Authorized Reseller (iBox Central)',
    subject: 'Paket Aksesoris USB-C Hub & DisplayPort Adaptor',
    recipientEmployeeName: 'Budi Santoso (Engineering)',
    courierService: 'JNE Express Reguler',
    receivedStatus: 'DITERIMA_RESEPSIONIS',
    receivedAt: '2026-04-04 10:45',
    notes: 'Paket ada di meja resepsionis lantai 1.'
  }
];
