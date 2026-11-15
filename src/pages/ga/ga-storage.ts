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
  OfficeMailLog,
} from './types';
import {
  INITIAL_ASSETS,
  INITIAL_SUPPLIES,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_ROOM_BOOKINGS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_VENDORS,
  INITIAL_PERMITS,
  INITIAL_GUESTS,
  INITIAL_MAILS,
} from './ga-data';

const STORAGE_KEYS = {
  ASSETS: 'hrmatrix_ga_assets_v2',
  SUPPLIES: 'hrmatrix_ga_supplies_v2',
  PR: 'hrmatrix_ga_purchase_requests_v2',
  MAINTENANCE: 'hrmatrix_ga_maintenance_schedules_v2',
  BOOKINGS: 'hrmatrix_ga_room_bookings_v2',
  TICKETS: 'hrmatrix_ga_maintenance_tickets_v2',
  VENDORS: 'hrmatrix_ga_vendors_v2',
  PERMITS: 'hrmatrix_ga_permits_v2',
  GUESTS: 'hrmatrix_ga_guests_v2',
  MAILS: 'hrmatrix_ga_mails_v2',
};

const LEGACY_STORAGE_KEYS = [
  'hrmatrix_ga_assets',
  'hrmatrix_ga_supplies',
  'hrmatrix_ga_purchase_requests',
  'hrmatrix_ga_maintenance_schedules',
  'hrmatrix_ga_room_bookings',
  'hrmatrix_ga_maintenance_tickets',
  'hrmatrix_ga_vendors',
  'hrmatrix_ga_permits',
  'hrmatrix_ga_guests',
  'hrmatrix_ga_mails',
];

const DEMO_FLAG_KEY = 'hrmatrix_ga_demo_seeded_v2';

let legacyPurged = false;
function purgeLegacyKeysOnce() {
  if (legacyPurged || typeof localStorage === 'undefined') return;
  legacyPurged = true;
  try {
    LEGACY_STORAGE_KEYS.forEach((legacyKey) => {
      localStorage.removeItem(legacyKey);
    });
  } catch {
    // ignore storage errors
  }
}

const dispatchChange = (key: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hrmatrix_ga_update', { detail: { key } }));
  }
};

function readStorageList<T>(key: string): T[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    purgeLegacyKeysOnce();
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const GAStorage = {
  // 1. Assets
  getAssets: (): OfficeAsset[] => readStorageList<OfficeAsset>(STORAGE_KEYS.ASSETS),
  saveAssets: (assets: OfficeAsset[]) => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    dispatchChange(STORAGE_KEYS.ASSETS);
  },
  addAsset: (asset: OfficeAsset) => {
    const list = GAStorage.getAssets();
    GAStorage.saveAssets([asset, ...list]);
  },
  updateAsset: (id: string, updatedFields: Partial<OfficeAsset>) => {
    const list = GAStorage.getAssets();
    const updated = list.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
    GAStorage.saveAssets(updated);
  },
  deleteAsset: (id: string) => {
    const list = GAStorage.getAssets();
    GAStorage.saveAssets(list.filter((a) => a.id !== id));
  },

  // 2. Supplies
  getSupplies: (): OfficeSupplyItem[] => readStorageList<OfficeSupplyItem>(STORAGE_KEYS.SUPPLIES),
  saveSupplies: (supplies: OfficeSupplyItem[]) => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies));
    dispatchChange(STORAGE_KEYS.SUPPLIES);
  },
  addSupply: (supply: OfficeSupplyItem) => {
    const list = GAStorage.getSupplies();
    GAStorage.saveSupplies([supply, ...list]);
  },
  updateSupplyStock: (id: string, delta: number) => {
    const list = GAStorage.getSupplies();
    const updated = list.map((s) => {
      if (s.id === id) {
        const newStock = Math.max(0, s.currentStock + delta);
        return { ...s, currentStock: newStock };
      }
      return s;
    });
    GAStorage.saveSupplies(updated);
  },
  deleteSupply: (id: string) => {
    const list = GAStorage.getSupplies();
    GAStorage.saveSupplies(list.filter((s) => s.id !== id));
  },

  // 3. Purchase Requests
  getPurchaseRequests: (): PurchaseRequest[] => readStorageList<PurchaseRequest>(STORAGE_KEYS.PR),
  savePurchaseRequests: (prs: PurchaseRequest[]) => {
    localStorage.setItem(STORAGE_KEYS.PR, JSON.stringify(prs));
    dispatchChange(STORAGE_KEYS.PR);
  },
  addPurchaseRequest: (pr: PurchaseRequest) => {
    const list = GAStorage.getPurchaseRequests();
    GAStorage.savePurchaseRequests([pr, ...list]);
  },
  updatePRStatus: (id: string, status: PurchaseRequest['status'], approverName?: string) => {
    const list = GAStorage.getPurchaseRequests();
    const updated = list.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status,
          approvedBy: approverName || p.approvedBy,
          approvedDate: status === 'DISETUJUI' ? new Date().toISOString().split('T')[0] : p.approvedDate,
        };
      }
      return p;
    });
    GAStorage.savePurchaseRequests(updated);
  },
  deletePurchaseRequest: (id: string) => {
    const list = GAStorage.getPurchaseRequests();
    GAStorage.savePurchaseRequests(list.filter((p) => p.id !== id));
  },

  // 4. Maintenance & Bookings
  getMaintenanceSchedules: (): FacilityMaintenanceSchedule[] =>
    readStorageList<FacilityMaintenanceSchedule>(STORAGE_KEYS.MAINTENANCE),
  saveMaintenanceSchedules: (schedules: FacilityMaintenanceSchedule[]) => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(schedules));
    dispatchChange(STORAGE_KEYS.MAINTENANCE);
  },
  addMaintenanceSchedule: (schedule: FacilityMaintenanceSchedule) => {
    const list = GAStorage.getMaintenanceSchedules();
    GAStorage.saveMaintenanceSchedules([schedule, ...list]);
  },
  updateMaintenanceScheduleStatus: (id: string, status: FacilityMaintenanceSchedule['status']) => {
    const list = GAStorage.getMaintenanceSchedules();
    const today = new Date().toISOString().split('T')[0];
    const updated = list.map((s) =>
      s.id === id
        ? {
            ...s,
            status,
            lastDoneDate: status === 'SELESAI' ? today : s.lastDoneDate,
          }
        : s
    );
    GAStorage.saveMaintenanceSchedules(updated);
  },
  deleteMaintenanceSchedule: (id: string) => {
    const list = GAStorage.getMaintenanceSchedules();
    GAStorage.saveMaintenanceSchedules(list.filter((s) => s.id !== id));
  },

  getRoomBookings: (): RoomBooking[] => readStorageList<RoomBooking>(STORAGE_KEYS.BOOKINGS),
  saveRoomBookings: (bookings: RoomBooking[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    dispatchChange(STORAGE_KEYS.BOOKINGS);
  },
  addRoomBooking: (booking: RoomBooking) => {
    const list = GAStorage.getRoomBookings();
    GAStorage.saveRoomBookings([booking, ...list]);
  },
  deleteRoomBooking: (id: string) => {
    const list = GAStorage.getRoomBookings();
    GAStorage.saveRoomBookings(list.filter((b) => b.id !== id));
  },

  getMaintenanceTickets: (): MaintenanceTicket[] =>
    readStorageList<MaintenanceTicket>(STORAGE_KEYS.TICKETS),
  saveMaintenanceTickets: (tickets: MaintenanceTicket[]) => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    dispatchChange(STORAGE_KEYS.TICKETS);
  },
  addMaintenanceTicket: (ticket: MaintenanceTicket) => {
    const list = GAStorage.getMaintenanceTickets();
    GAStorage.saveMaintenanceTickets([ticket, ...list]);
  },
  updateTicketStatus: (id: string, status: MaintenanceTicket['status']) => {
    const list = GAStorage.getMaintenanceTickets();
    const updated = list.map((t) =>
      t.id === id ? { ...t, status, resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : t.resolvedAt } : t
    );
    GAStorage.saveMaintenanceTickets(updated);
  },
  deleteMaintenanceTicket: (id: string) => {
    const list = GAStorage.getMaintenanceTickets();
    GAStorage.saveMaintenanceTickets(list.filter((t) => t.id !== id));
  },

  // 5. Vendors & Permits
  getVendors: (): GAVendor[] => readStorageList<GAVendor>(STORAGE_KEYS.VENDORS),
  saveVendors: (vendors: GAVendor[]) => {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    dispatchChange(STORAGE_KEYS.VENDORS);
  },
  addVendor: (vendor: GAVendor) => {
    const list = GAStorage.getVendors();
    GAStorage.saveVendors([vendor, ...list]);
  },
  deleteVendor: (id: string) => {
    const list = GAStorage.getVendors();
    GAStorage.saveVendors(list.filter((v) => v.id !== id));
  },

  getPermits: (): OfficePermit[] => readStorageList<OfficePermit>(STORAGE_KEYS.PERMITS),
  savePermits: (permits: OfficePermit[]) => {
    localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(permits));
    dispatchChange(STORAGE_KEYS.PERMITS);
  },
  addPermit: (permit: OfficePermit) => {
    const list = GAStorage.getPermits();
    GAStorage.savePermits([permit, ...list]);
  },
  deletePermit: (id: string) => {
    const list = GAStorage.getPermits();
    GAStorage.savePermits(list.filter((p) => p.id !== id));
  },

  // 6. Guests & Mails
  getGuests: (): GuestVisitorLog[] => readStorageList<GuestVisitorLog>(STORAGE_KEYS.GUESTS),
  saveGuests: (guests: GuestVisitorLog[]) => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
    dispatchChange(STORAGE_KEYS.GUESTS);
  },
  addGuest: (guest: GuestVisitorLog) => {
    const list = GAStorage.getGuests();
    GAStorage.saveGuests([guest, ...list]);
  },
  checkOutGuest: (id: string) => {
    const list = GAStorage.getGuests();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = list.map((g) =>
      g.id === id ? { ...g, status: 'CHECKED_OUT' as const, checkOutTime: nowStr } : g
    );
    GAStorage.saveGuests(updated);
  },
  deleteGuest: (id: string) => {
    const list = GAStorage.getGuests();
    GAStorage.saveGuests(list.filter((g) => g.id !== id));
  },

  getMails: (): OfficeMailLog[] => readStorageList<OfficeMailLog>(STORAGE_KEYS.MAILS),
  saveMails: (mails: OfficeMailLog[]) => {
    localStorage.setItem(STORAGE_KEYS.MAILS, JSON.stringify(mails));
    dispatchChange(STORAGE_KEYS.MAILS);
  },
  addMail: (mail: OfficeMailLog) => {
    const list = GAStorage.getMails();
    GAStorage.saveMails([mail, ...list]);
  },
  updateMailStatus: (id: string, status: OfficeMailLog['receivedStatus']) => {
    const list = GAStorage.getMails();
    const updated = list.map((m) => (m.id === id ? { ...m, receivedStatus: status } : m));
    GAStorage.saveMails(updated);
  },
  deleteMail: (id: string) => {
    const list = GAStorage.getMails();
    GAStorage.saveMails(list.filter((m) => m.id !== id));
  },

  // 7. Demo Seeding & Reset
  isDemoSeeded: (): boolean => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(DEMO_FLAG_KEY) === 'true';
  },
  seedDemoData: () => {
    if (typeof localStorage === 'undefined') return;
    purgeLegacyKeysOnce();
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
    localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(INITIAL_SUPPLIES));
    localStorage.setItem(STORAGE_KEYS.PR, JSON.stringify(INITIAL_PURCHASE_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE_SCHEDULES));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_ROOM_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_MAINTENANCE_TICKETS));
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(INITIAL_VENDORS));
    localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(INITIAL_PERMITS));
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
    localStorage.setItem(STORAGE_KEYS.MAILS, JSON.stringify(INITIAL_MAILS));
    localStorage.setItem(DEMO_FLAG_KEY, 'true');
    dispatchChange('ALL');
  },
  clearDemoDataIfSeeded: () => {
    if (typeof localStorage === 'undefined') return;
    purgeLegacyKeysOnce();
    if (localStorage.getItem(DEMO_FLAG_KEY) === 'true') {
      GAStorage.clearAllData();
    }
  },
  clearAllData: () => {
    if (typeof localStorage === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(DEMO_FLAG_KEY);
    dispatchChange('ALL');
  },
};

