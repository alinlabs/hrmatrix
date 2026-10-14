import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Laptop, 
  ShoppingBag, 
  Wrench, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Plus, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  FileSignature
} from 'lucide-react';
import { GAStorage } from './ga-storage';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions 
} from '../../context/MobileNavContext';
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

export const GeneralAffairsDashboard: React.FC = () => {
  const [assets, setAssets] = useState<OfficeAsset[]>([]);
  const [supplies, setSupplies] = useState<OfficeSupplyItem[]>([]);
  const [prs, setPrs] = useState<PurchaseRequest[]>([]);
  const [schedules, setSchedules] = useState<FacilityMaintenanceSchedule[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [permits, setPermits] = useState<OfficePermit[]>([]);
  const [guests, setGuests] = useState<GuestVisitorLog[]>([]);
  const [mails, setMails] = useState<OfficeMailLog[]>([]);

  const loadAll = () => {
    setAssets(GAStorage.getAssets());
    setSupplies(GAStorage.getSupplies());
    setPrs(GAStorage.getPurchaseRequests());
    setSchedules(GAStorage.getMaintenanceSchedules());
    setBookings(GAStorage.getRoomBookings());
    setTickets(GAStorage.getMaintenanceTickets());
    setPermits(GAStorage.getPermits());
    setGuests(GAStorage.getGuests());
    setMails(GAStorage.getMails());
  };

  useEffect(() => {
    loadAll();
    const handleUpdate = () => loadAll();
    window.addEventListener('hrmatrix_ga_update', handleUpdate);
    return () => window.removeEventListener('hrmatrix_ga_update', handleUpdate);
  }, []);

  const totalAssetValue = assets.reduce((sum, a) => sum + (a.currentValue || a.purchaseCost || 0), 0);
  const lowStockCount = supplies.filter(s => s.currentStock <= s.minStockLevel).length;
  const pendingPrCount = prs.filter(p => p.status === 'MENUNGGU_APPROVAL').length;
  const openTicketsCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const expiringPermitsCount = permits.filter(p => p.status === 'PERLU_PERPANJANGAN').length;
  const activeVisitorsCount = guests.filter(g => g.status === 'CHECKED_IN').length;

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <Link
        to="/ga/aset"
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Laptop className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Aset</span>
      </Link>
      <Link
        to="/ga/atk"
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-amber-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden sm:inline">ATK & PR</span>
      </Link>
      <Link
        to="/ga/fasilitas"
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Wrench className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden sm:inline">Fasilitas</span>
      </Link>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title="General Affairs"
        subtitle="Operasional & fasilitas kerja"
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Total Nilai Aset</div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-0.5">
            Rp {totalAssetValue.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{assets.length} unit terdata</div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Stok Kritis ATK</div>
          <div className={`text-base sm:text-lg font-bold mt-0.5 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {lowStockCount} Item Menipis
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{lowStockCount > 0 ? 'Perlu reorder segera' : 'Stok aman tercukupi'}</div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Tiket Kerusakan</div>
          <div className="text-base sm:text-lg font-bold text-amber-600 mt-0.5">
            {openTicketsCount} Work Order
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Dalam penanganan</div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Tamu Aktif Frontdesk</div>
          <div className="text-base sm:text-lg font-bold text-blue-600 mt-0.5">
            {activeVisitorsCount} Orang
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sedang di kantor</div>
        </div>
      </div>

      {/* 5 Main GA Module Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            5 Modul Operasional General Affairs
          </h2>
          <span className="text-xs text-slate-400">Pilih modul kerja</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Card 1: Inventaris & Aset */}
          <Link
            to="/ga/aset"
            className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {assets.length} Aset
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  1. Inventaris & Aset Kantor
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pencatatan kepemilikan laptop, PC, kendaraan dinas, furnitur, tagging barcode/QR, dan dokumen BAST.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Buka Manajemen Aset</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Pengadaan & ATK */}
          <Link
            to="/ga/atk"
            className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className={`text-xs font-semibold ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {lowStockCount > 0 ? `${lowStockCount} Menipis` : 'Stok Aman'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                  2. Pengadaan & Stok ATK / Pantry
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Monitoring stok kertas, tinta, konsumsi kopi & galon, formulir Purchase Request (PR), dan alur persetujuan.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>Buka Stok & PR</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Fasilitas & Maintenance */}
          <Link
            to="/ga/fasilitas"
            className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {schedules.length} Jadwal
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  3. Fasilitas & Pemeliharaan
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Jadwal servis berkala AC, genset, APAR K3, reservasi ruang rapat kantor, dan tiket pelaporan kerusakan.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Buka Fasilitas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Vendor & Perizinan */}
          <Link
            to="/ga/vendor"
            className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className={`text-xs font-semibold ${expiringPermitsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {expiringPermitsCount > 0 ? `${expiringPermitsCount} Expiring` : 'Izin Aktif'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                  4. Vendor & Perizinan Gedung
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Database kontak supplier rekanan kantor, evaluasi performa vendor, serta monitoring SLF, K3 & asuransi.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Buka Vendor & Legalitas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Buku Tamu & Surat */}
          <Link
            to="/ga/buku-tamu"
            className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-cyan-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {guests.length} Log Tamu
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-600 transition-colors">
                  5. Buku Tamu & Agenda Surat
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Buku tamu resepsionis, penerbitan ID visitor pass, agenda surat dinas masuk/keluar, dan paket ekspedisi.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
              <span>Buka Buku Tamu & Surat</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Low Stock Supplies Quick Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Peringatan Stok ATK / Pantry Menipis
            </h3>
            <Link to="/ga/atk" className="text-xs text-blue-600 font-semibold hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {supplies.filter(s => s.currentStock <= s.minStockLevel).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.location}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-rose-700">
                    Sisa {item.currentStock} {item.unit}
                  </div>
                  <div className="text-[10px] text-slate-400">Min: {item.minStockLevel} {item.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Tickets / Upcoming Maintenance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-600" />
              Jadwal Servis Fasilitas & Tiket Aktif
            </h3>
            <Link to="/ga/fasilitas" className="text-xs text-blue-600 font-semibold hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {schedules.slice(0, 3).map((sch) => (
              <div key={sch.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{sch.title}</div>
                  <div className="text-[10px] text-slate-500">{sch.technicianVendor}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-indigo-600 font-mono">
                    {sch.nextDueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
