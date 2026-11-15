export type GATab = 'overview' | 'aset' | 'atk' | 'fasilitas' | 'vendor' | 'buku-tamu';

// 1. INVENTARIS & ASET KANTOR
export type AssetCategory = 'ELEKTRONIK_IT' | 'KENDARAAN_OPERASIONAL' | 'FURNITUR_KANTOR' | 'MESIN_ALAT_KERJA' | 'PERLENGKAPAN_GEDUNG';
export type AssetStatus = 'TERSEDIA' | 'DIPAKAI_KARYAWAN' | 'SEDANG_SERVIS' | 'RUSAK' | 'DIHAPUSKAN';
export type AssetCondition = 'SANGAT_BAIK' | 'BAIK' | 'PERLU_PERBAIKAN' | 'RUSAK_BERAT';

export interface OfficeAsset {
  id: string;
  assetCode: string; // e.g. AST-IT-2025-001
  name: string;
  category: AssetCategory;
  brandModel: string;
  serialNumber?: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  status: AssetStatus;
  condition: AssetCondition;
  assignedToEmployeeId?: string;
  assignedToEmployeeName?: string;
  assignedDepartment?: string;
  handoverDate?: string;
  location: string;
  notes?: string;
  warrantyExpiry?: string;
}

// 2. PENGADAAN & STOK ATK / PANTRY
export type SupplyCategory = 'ATK_KERTAS' | 'TINTA_TONER' | 'PANTRY_KONSUMSI' | 'KEBERSIHAN_SANITASI' | 'SAFETY_FIRSTAID';
export type PRStatus = 'DRAFT' | 'MENUNGGU_APPROVAL' | 'DISETUJUI' | 'DIBELI' | 'DITOLAK';

export interface OfficeSupplyItem {
  id: string;
  code: string;
  name: string;
  category: SupplyCategory;
  currentStock: number;
  minStockLevel: number;
  unit: string; // Rim, Pcs, Dus, Box, Botol, Galon
  unitPrice: number;
  location: string;
  lastRestockedDate: string;
  supplierName?: string;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string; // PR-GA-2026-001
  requestDate: string;
  requesterName: string;
  department: string;
  title: string;
  status: PRStatus;
  priority: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'URGENT';
  estimatedCost: number;
  items: {
    itemName: string;
    quantity: number;
    unit: string;
    estimatedPrice: number;
    notes?: string;
  }[];
  justification: string;
  approvedBy?: string;
  approvedDate?: string;
}

// 3. FASILITAS, PEMELIHARAAN & WORK ORDER
export type FacilityType = 'RUANG_MEETING' | 'KENDARAAN_KANTOR' | 'AC_HVAC' | 'LISTRIK_GENSET' | 'PLUMBING_TOILET' | 'KEAMANAN_CCTV';
export type MaintenanceStatus = 'TERJADWAL' | 'DALAM_PROSES' | 'SELESAI' | 'TERTUNDA';

export interface FacilityMaintenanceSchedule {
  id: string;
  title: string;
  facilityType: FacilityType;
  location: string;
  scheduledDate: string;
  frequency: 'MINGGUAN' | 'BULANAN' | 'TRIWULAN' | 'SEMESTERAN' | 'TAHUNAN';
  technicianVendor: string;
  estimatedCost: number;
  status: MaintenanceStatus;
  lastDoneDate?: string;
  nextDueDate: string;
  notes?: string;
}

export interface RoomBooking {
  id: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedByEmployeeName: string;
  department: string;
  purpose: string;
  attendeesCount: number;
  needsPantry: boolean;
  needsProjector: boolean;
  status: 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  title: string;
  reporterName: string;
  department: string;
  location: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  description: string;
  assignedStaff?: string;
  resolvedAt?: string;
  cost?: number;
}

// 4. VENDOR & PERIZINAN OPERASIONAL
export type VendorCategory = 'SUPPLIER_ATK' | 'IT_HARDWARE_LEASING' | 'MAINTENANCE_AC_GEDUNG' | 'CATERING_PANTRY' | 'CLEANING_SECURITY' | 'LOGISTIK_EKSPEDISI';

export interface GAVendor {
  id: string;
  companyName: string;
  category: VendorCategory;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  contractStatus: 'AKTIF' | 'MENDEKATI_BERAKHIR' | 'KADALUWARSA' | 'TIDAK_AKTIF';
  contractStartDate: string;
  contractEndDate: string;
  paymentTerms: string; // e.g. TOP 30 Hari, COD, Net 14
  rating: number; // 1-5
  notes?: string;
}

export interface OfficePermit {
  id: string;
  permitNumber: string;
  name: string; // e.g. Sertifikat Laik Fungsi (SLF), Izin Operasional K3 Genset, Asuransi Property All Risk
  issuer: string; // e.g. Dinas PUPR, Disnaker, Asuransi
  category: 'K3_KESELAMATAN' | 'GEDUNG_TATA_KOTA' | 'LINGKUNGAN_AMDAL' | 'ASURANSI_ASET' | 'LEGAL_OPERASIONAL';
  issuedDate: string;
  expiryDate: string;
  status: 'BERLAKU' | 'PERLU_PERPANJANGAN' | 'KADALUWARSA';
  picName: string;
  annualCost?: number;
  documentFileUrl?: string;
  notes?: string;
}

// 5. BUKU TAMU & SURAT MASUK/KELUAR
export interface GuestVisitorLog {
  id: string;
  visitorName: string;
  institution: string;
  phone: string;
  destinationPerson: string;
  destinationDepartment: string;
  purpose: string;
  visitorPassNumber: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT';
  identityType: 'KTP' | 'SIM' | 'PASSPORT' | 'ID_CARD';
  temperatureOrNotes?: string;
}

export interface OfficeMailLog {
  id: string;
  type: 'SURAT_MASUK' | 'SURAT_KELUAR' | 'PAKET_EKSPEDISI';
  referenceNumber: string; // No Surat Resmi or Resi
  date: string;
  senderOrRecipient: string; // Asal atau Tujuan
  subject: string;
  recipientEmployeeName: string; // Diterima oleh / Ditujukan ke
  courierService?: string; // JNE, SiCepat, Internal Messanger
  receivedStatus: 'DITERIMA_RESEPSIONIS' | 'DISERAHKAN_KE_PENERIMA' | 'TERKIRIM';
  receivedAt?: string;
  notes?: string;
}
