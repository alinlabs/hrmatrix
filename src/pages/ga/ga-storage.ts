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
  INITIAL_MAILS 
} from './ga-data';

const STORAGE_KEYS = {
  ASSETS: 'hrmatrix_ga_assets',
  SUPPLIES: 'hrmatrix_ga_supplies',
  PR: 'hrmatrix_ga_purchase_requests',
  MAINTENANCE: 'hrmatrix_ga_maintenance_schedules',
  BOOKINGS: 'hrmatrix_ga_room_bookings',
  TICKETS: 'hrmatrix_ga_maintenance_tickets',
  VENDORS: 'hrmatrix_ga_vendors',
  PERMITS: 'hrmatrix_ga_permits',
  GUESTS: 'hrmatrix_ga_guests',
  MAILS: 'hrmatrix_ga_mails'
};

const dispatchChange = (key: string) => {
  window.dispatchEvent(new CustomEvent('hrmatrix_ga_update', { detail: { key } }));
};

export const GAStorage = {
  // 1. Assets
  getAssets: (): OfficeAsset[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
        return INITIAL_ASSETS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ASSETS;
    }
  },
  saveAssets: (assets: OfficeAsset[]) => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    dispatchChange(STORAGE_KEYS.ASSETS);
  },
  addAsset: (asset: OfficeAsset) => {
    const list = GAStorage.getAssets();
    const updated = [asset, ...list];
    GAStorage.saveAssets(updated);
  },
  updateAsset: (id: string, updatedFields: Partial<OfficeAsset>) => {
    const list = GAStorage.getAssets();
    const updated = list.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    GAStorage.saveAssets(updated);
  },
  deleteAsset: (id: string) => {
    const list = GAStorage.getAssets();
    const updated = list.filter(a => a.id !== id);
    GAStorage.saveAssets(updated);
  },

  // 2. Supplies
  getSupplies: (): OfficeSupplyItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUPPLIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(INITIAL_SUPPLIES));
        return INITIAL_SUPPLIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SUPPLIES;
    }
  },
  saveSupplies: (supplies: OfficeSupplyItem[]) => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies));
    dispatchChange(STORAGE_KEYS.SUPPLIES);
  },
  updateSupplyStock: (id: string, delta: number) => {
    const list = GAStorage.getSupplies();
    const updated = list.map(s => {
      if (s.id === id) {
        const newStock = Math.max(0, s.currentStock + delta);
        return { ...s, currentStock: newStock };
      }
      return s;
    });
    GAStorage.saveSupplies(updated);
  },

  // 3. Purchase Requests
  getPurchaseRequests: (): PurchaseRequest[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PR);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PR, JSON.stringify(INITIAL_PURCHASE_REQUESTS));
        return INITIAL_PURCHASE_REQUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PURCHASE_REQUESTS;
    }
  },
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
    const updated = list.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          approvedBy: approverName || p.approvedBy,
          approvedDate: status === 'DISETUJUI' ? new Date().toISOString().split('T')[0] : p.approvedDate
        };
      }
      return p;
    });
    GAStorage.savePurchaseRequests(updated);
  },

  // 4. Maintenance & Bookings
  getMaintenanceSchedules: (): FacilityMaintenanceSchedule[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE_SCHEDULES));
        return INITIAL_MAINTENANCE_SCHEDULES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MAINTENANCE_SCHEDULES;
    }
  },
  saveMaintenanceSchedules: (schedules: FacilityMaintenanceSchedule[]) => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(schedules));
    dispatchChange(STORAGE_KEYS.MAINTENANCE);
  },
  
  getRoomBookings: (): RoomBooking[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_ROOM_BOOKINGS));
        return INITIAL_ROOM_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ROOM_BOOKINGS;
    }
  },
  saveRoomBookings: (bookings: RoomBooking[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    dispatchChange(STORAGE_KEYS.BOOKINGS);
  },
  addRoomBooking: (booking: RoomBooking) => {
    const list = GAStorage.getRoomBookings();
    GAStorage.saveRoomBookings([booking, ...list]);
  },

  getMaintenanceTickets: (): MaintenanceTicket[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_MAINTENANCE_TICKETS));
        return INITIAL_MAINTENANCE_TICKETS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MAINTENANCE_TICKETS;
    }
  },
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
    const updated = list.map(t => t.id === id ? { ...t, status, resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : t.resolvedAt } : t);
    GAStorage.saveMaintenanceTickets(updated);
  },

  // 5. Vendors & Permits
  getVendors: (): GAVendor[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VENDORS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(INITIAL_VENDORS));
        return INITIAL_VENDORS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_VENDORS;
    }
  },
  saveVendors: (vendors: GAVendor[]) => {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    dispatchChange(STORAGE_KEYS.VENDORS);
  },
  addVendor: (vendor: GAVendor) => {
    const list = GAStorage.getVendors();
    GAStorage.saveVendors([vendor, ...list]);
  },

  getPermits: (): OfficePermit[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERMITS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(INITIAL_PERMITS));
        return INITIAL_PERMITS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PERMITS;
    }
  },
  savePermits: (permits: OfficePermit[]) => {
    localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(permits));
    dispatchChange(STORAGE_KEYS.PERMITS);
  },
  addPermit: (permit: OfficePermit) => {
    const list = GAStorage.getPermits();
    GAStorage.savePermits([permit, ...list]);
  },

  // 6. Guests & Mails
  getGuests: (): GuestVisitorLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GUESTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
        return INITIAL_GUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_GUESTS;
    }
  },
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
    const updated = list.map(g => g.id === id ? { ...g, status: 'CHECKED_OUT' as const, checkOutTime: nowStr } : g);
    GAStorage.saveGuests(updated);
  },

  getMails: (): OfficeMailLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MAILS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MAILS, JSON.stringify(INITIAL_MAILS));
        return INITIAL_MAILS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MAILS;
    }
  },
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
    const updated = list.map(m => m.id === id ? { ...m, receivedStatus: status } : m);
    GAStorage.saveMails(updated);
  }
};
