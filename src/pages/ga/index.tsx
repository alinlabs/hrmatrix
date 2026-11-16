import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Laptop,
  ShoppingBag,
  Wrench,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { GAStorage } from './ga-storage';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
} from '../../context/mobile-nav-context';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyGaOverviewAnimation from '../../assets/animations/empty-ga-overview.json';
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

export const GeneralAffairsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<OfficeAsset[]>([]);
  const [supplies, setSupplies] = useState<OfficeSupplyItem[]>([]);
  const [prs, setPrs] = useState<PurchaseRequest[]>([]);
  const [schedules, setSchedules] = useState<FacilityMaintenanceSchedule[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [vendors, setVendors] = useState<GAVendor[]>([]);
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
    setVendors(GAStorage.getVendors());
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

  const isAllEmpty =
    assets.length === 0 &&
    supplies.length === 0 &&
    prs.length === 0 &&
    schedules.length === 0 &&
    bookings.length === 0 &&
    tickets.length === 0 &&
    vendors.length === 0 &&
    permits.length === 0 &&
    guests.length === 0 &&
    mails.length === 0;

  const totalAssetValue = assets.reduce(
    (sum, a) => sum + (a.currentValue || a.purchaseCost || 0),
    0
  );
  const lowStockSupplies = supplies.filter((s) => s.currentStock <= s.minStockLevel);
  const lowStockCount = lowStockSupplies.length;
  const openTicketsCount = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS'
  ).length;
  const expiringPermitsCount = permits.filter((p) => p.status === 'PERLU_PERPANJANGAN').length;
  const activeVisitorsCount = guests.filter((g) => g.status === 'CHECKED_IN').length;

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
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">ATK & PR</span>
      </Link>
      <Link
        to="/ga/fasilitas"
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Wrench className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Fasilitas</span>
      </Link>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5">
      <PageHeaderTitle
        title="General Affairs"
        subtitle="Operasional & fasilitas kerja"
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {isAllEmpty ? (
        <div className="mt-1 w-full flex-1 flex flex-col">
          <InitialEmptyCard
            id="ga-overview-empty-card"
            title="Mulai Kelola Operasional Kantor!"
            description="Catat aset, stok ATK, pemeliharaan gedung, vendor, hingga buku tamu dalam satu tempat."
            buttonText="Mulai Catat Aset Pertama"
            ButtonIcon={Building2}
            onAction={() => navigate('/ga/aset')}
            animationData={emptyGaOverviewAnimation}
          />
        </div>
      ) : (
        <>
          {/* 4 Stat Cards (ikon kanan halus standar HR Operational) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Total Nilai Aset</span>
                <Laptop className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base sm:text-xl font-bold font-mono tabular-nums text-slate-900">
                Rp {totalAssetValue.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                {assets.length} unit terdata
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Stok Kritis ATK</span>
                <AlertTriangle
                  className={`w-4 h-4 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}
                />
              </div>
              <div
                className={`text-base sm:text-xl font-bold tabular-nums ${
                  lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {lowStockCount} Item Menipis
              </div>
              <div className="text-[11px] text-slate-400">
                {lowStockCount > 0 ? 'Perlu pengadaan segera' : 'Stok aman tercukupi'}
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Tiket Kerusakan</span>
                <Wrench className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-base sm:text-xl font-bold tabular-nums text-slate-900">
                {openTicketsCount} Work Order
              </div>
              <div className="text-[11px] text-slate-400">Dalam penanganan teknisi</div>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Tamu Aktif</span>
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base sm:text-xl font-bold tabular-nums text-slate-900">
                {activeVisitorsCount} Orang
              </div>
              <div className="text-[11px] text-slate-400">Sedang berada di kantor</div>
            </div>
          </div>

          {/* 5 Main GA Module Cards (clean white cards without icon clutter) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Modul Operasional General Affairs
              </h2>
              <span className="text-xs text-slate-400">Pilih modul kerja</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Link
                to="/ga/aset"
                className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                      {assets.length} Aset Terdata
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      Inventaris & Aset Kantor
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Pencatatan kepemilikan laptop, PC, kendaraan dinas, furnitur, tag barcode/QR, dan dokumen BAST.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Buka Manajemen Aset</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/ga/atk"
                className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {lowStockCount > 0 ? `${lowStockCount} Item Menipis` : 'Stok Aman'}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      Pengadaan & Stok ATK / Pantry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Monitoring stok kertas, tinta, konsumsi kantor, formulir Purchase Request (PR), dan persetujuan.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Buka Stok & PR</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/ga/fasilitas"
                className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                      {schedules.length} Jadwal Servis
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      Fasilitas & Pemeliharaan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Jadwal servis berkala AC, genset, APAR K3, reservasi ruang rapat kantor, dan tiket kerusakan.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Buka Fasilitas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/ga/vendor"
                className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        expiringPermitsCount > 0 ? 'text-amber-600' : 'text-slate-500'
                      }`}
                    >
                      {expiringPermitsCount > 0
                        ? `${expiringPermitsCount} Izin Jatuh Tempo`
                        : `${vendors.length} Rekanan Vendor`}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      Vendor & Perizinan Gedung
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Database kontak supplier rekanan kantor, evaluasi vendor, serta monitoring SLF, K3 & asuransi.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Buka Vendor & Legalitas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/ga/buku-tamu"
                className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                      {guests.length} Log Tamu
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      Buku Tamu & Agenda Surat
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Buku tamu resepsionis, ID visitor pass, agenda surat dinas masuk/keluar, dan paket ekspedisi.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Buka Buku Tamu & Surat</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Summary Grid (clean white lists without title icons) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Peringatan Stok ATK / Pantry Menipis
                </h3>
                <Link to="/ga/atk" className="text-xs text-blue-600 font-semibold hover:underline shrink-0">
                  Lihat Semua &rarr;
                </Link>
              </div>

              <div className="space-y-2">
                {lowStockSupplies.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-700">
                      {supplies.length === 0
                        ? 'Belum ada item stok ATK & Pantry tercatat'
                        : 'Seluruh stok ATK & Pantry dalam batas aman'}
                    </p>
                    <Link to="/ga/atk" className="inline-block text-xs font-semibold text-blue-600 hover:underline">
                      Kelola Katalog Stok &rarr;
                    </Link>
                  </div>
                ) : (
                  lowStockSupplies.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-bold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{item.location}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-rose-600 tabular-nums">
                          Sisa {item.currentStock} {item.unit}
                        </div>
                        <div className="text-[11px] text-slate-400 tabular-nums">
                          Min: {item.minStockLevel} {item.unit}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Jadwal Servis Fasilitas & Tiket Aktif
                </h3>
                <Link to="/ga/fasilitas" className="text-xs text-blue-600 font-semibold hover:underline shrink-0">
                  Lihat Semua &rarr;
                </Link>
              </div>

              <div className="space-y-2">
                {schedules.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-700">
                      Belum ada jadwal pemeliharaan fasilitas terdaftar
                    </p>
                    <Link
                      to="/ga/fasilitas?tab=servis"
                      className="inline-block text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Atur Jadwal Servis &rarr;
                    </Link>
                  </div>
                ) : (
                  schedules.slice(0, 3).map((sch) => (
                    <div
                      key={sch.id}
                      className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-bold text-slate-900 truncate">{sch.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">{sch.technicianVendor}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold text-blue-600 font-mono tabular-nums">
                          {sch.nextDueDate}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
