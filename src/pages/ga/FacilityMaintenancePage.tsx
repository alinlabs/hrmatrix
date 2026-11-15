import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  Tv,
  Coffee,
  Check,
  ShieldCheck,
  Flame,
  Zap,
  Droplets,
  Trash2,
  ClipboardList,
} from 'lucide-react';
import { FacilityMaintenanceSchedule, RoomBooking, MaintenanceTicket } from './types';
import { GAStorage } from './ga-storage';
import { ModalTicket } from './modal-ticket';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyGaFacilityAnimation from '../../assets/animations/empty-ga-facility.json';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
} from '../../context/MobileNavContext';

export const FacilityMaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');

  const activeTab: 'booking' | 'maintenance' | 'ticket' = useMemo(() => {
    if (currentTabParam === 'servis' || currentTabParam === 'service' || currentTabParam === 'maintenance') return 'maintenance';
    if (currentTabParam === 'kerusakan' || currentTabParam === 'ticket' || currentTabParam === 'keluhan') return 'ticket';
    return 'booking';
  }, [currentTabParam]);

  const handleTabChange = (tab: 'booking' | 'maintenance' | 'ticket') => {
    const tabMap = {
      booking: 'ruangan',
      maintenance: 'servis',
      ticket: 'kerusakan',
    };
    setSearchParams({ tab: tabMap[tab] });
  };

  const [schedules, setSchedules] = useState<FacilityMaintenanceSchedule[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);

  const [modalMode, setModalMode] = useState<'ticket' | 'booking' | 'schedule'>('ticket');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setSchedules(GAStorage.getMaintenanceSchedules());
    setBookings(GAStorage.getRoomBookings());
    setTickets(GAStorage.getMaintenanceTickets());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('hrmatrix_ga_update', handleUpdate);
    return () => window.removeEventListener('hrmatrix_ga_update', handleUpdate);
  }, []);

  const openTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');

  const handleUpdateTicketStatus = (id: string, status: MaintenanceTicket['status']) => {
    GAStorage.updateTicketStatus(id, status);
    loadData();
  };

  const handleMarkScheduleDone = (id: string) => {
    GAStorage.updateMaintenanceScheduleStatus(id, 'SELESAI');
    loadData();
  };

  const handleDeleteBooking = (id: string, roomName: string) => {
    if (window.confirm(`Batalkan & hapus reservasi "${roomName}"?`)) {
      GAStorage.deleteRoomBooking(id);
      loadData();
    }
  };

  const handleDeleteSchedule = (id: string, title: string) => {
    if (window.confirm(`Hapus jadwal servis "${title}"?`)) {
      GAStorage.deleteMaintenanceSchedule(id);
      loadData();
    }
  };

  const handleDeleteTicket = (id: string, ticketNumber: string) => {
    if (window.confirm(`Hapus tiket perbaikan "${ticketNumber}"?`)) {
      GAStorage.deleteMaintenanceTicket(id);
      loadData();
    }
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => {
          setModalMode('booking');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Booking Ruang Meeting"
      >
        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden sm:inline">Booking Ruang</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setModalMode('schedule');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Buat Jadwal Servis"
      >
        <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden md:inline">Jadwal Servis</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setModalMode('ticket');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Wrench className="w-3.5 h-3.5" />
        <span>Lapor Kerusakan</span>
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={
          activeTab === 'booking'
            ? 'Jadwal Ruangan'
            : activeTab === 'maintenance'
            ? 'Jadwal Service'
            : 'Keluhan Kerusakan'
        }
        subtitle={
          activeTab === 'booking'
            ? 'Reservasi ruang meeting, jadwal sesi & fasilitas'
            : activeTab === 'maintenance'
            ? 'Pemeliharaan berkala AC, genset, kelistrikan & APAR'
            : 'Tiket work order, pelaporan kerusakan sarana & status'
        }
        onBack={() => navigate('/ga')}
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* 3 Main Tabs: Jadwal Ruangan, Jadwal Service, Keluhan Kerusakan */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('booking')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'booking' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Jadwal Ruangan ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('maintenance')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'maintenance' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Jadwal Service ({schedules.length})
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('ticket')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ticket' ? 'border-rose-600 text-rose-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Keluhan Kerusakan ({openTickets.length} Terbuka)
        </button>
      </div>

      {activeTab === 'maintenance' && (
        schedules.length === 0 ? (
          <div className="mt-2">
            <InitialEmptyCard
              id="ga-facility-schedule-empty-card"
              title="Jadwalkan Servis Fasilitas Rutin!"
              description="Catat pemeliharaan berkala AC, genset, dan APAR agar kantor selalu prima."
              buttonText="Buat Jadwal Servis Pertama"
              ButtonIcon={Wrench}
              onAction={() => {
                setModalMode('schedule');
                setIsModalOpen(true);
              }}
              animationData={emptyGaFacilityAnimation}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((sch) => (
              <div key={sch.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      {sch.facilityType === 'AC_HVAC' && <Zap className="w-5 h-5" />}
                      {sch.facilityType === 'LISTRIK_GENSET' && <Flame className="w-5 h-5" />}
                      {sch.facilityType === 'PLUMBING_TOILET' && <Droplets className="w-5 h-5" />}
                      {sch.facilityType === 'KEAMANAN_CCTV' && <ShieldCheck className="w-5 h-5" />}
                      {(sch.facilityType === 'RUANG_MEETING' || sch.facilityType === 'KENDARAAN_KANTOR') && (
                        <Wrench className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{sch.title}</h4>
                      <p className="text-xs text-slate-500">{sch.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {sch.frequency}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(sch.id, sch.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Vendor Pelaksana:</span>
                    <span className="font-semibold text-slate-800">{sch.technicianVendor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimasi Biaya:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">Rp {sch.estimatedCost.toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Jatuh Tempo Berikutnya:</span>
                    <span className="font-bold text-indigo-600 tabular-nums">{sch.nextDueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Terakhir Dikerjakan:</span>
                    <span className="text-slate-600 tabular-nums">{sch.lastDoneDate || '-'}</span>
                  </div>
                </div>

                {sch.notes && (
                  <div className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    {sch.notes}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sch.status === 'SELESAI'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sch.status === 'TERTUNDA'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {sch.status}
                  </span>
                  {sch.status !== 'SELESAI' && (
                    <button
                      type="button"
                      onClick={() => handleMarkScheduleDone(sch.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3 h-3" />
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'booking' && (
        bookings.length === 0 ? (
          <div className="mt-2">
            <InitialEmptyCard
              id="ga-facility-booking-empty-card"
              title="Atur Reservasi Ruang Rapat!"
              description="Jadwalkan pemakaian ruang meeting dan perlengkapan presentasi tanpa bentrok."
              buttonText="Booking Ruang Pertama"
              ButtonIcon={Calendar}
              onAction={() => {
                setModalMode('booking');
                setIsModalOpen(true);
              }}
              animationData={emptyGaFacilityAnimation}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((bm) => (
              <div key={bm.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded tabular-nums">
                      {bm.date} • {bm.startTime} - {bm.endTime} WIB
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {bm.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{bm.roomName}</h4>
                  <div className="text-xs text-slate-600">
                    Agenda: <strong>{bm.purpose}</strong> (Pemesan: {bm.bookedByEmployeeName} - {bm.department})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 tabular-nums">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {bm.attendeesCount} Orang
                    </span>
                    {bm.needsPantry && (
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        • <Coffee className="w-3.5 h-3.5" /> Pantry Kopi
                      </span>
                    )}
                    {bm.needsProjector && (
                      <span className="flex items-center gap-1 text-blue-700 font-medium">
                        • <Tv className="w-3.5 h-3.5" /> Proyektor
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteBooking(bm.id, bm.roomName)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Hapus Reservasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'ticket' && (
        tickets.length === 0 ? (
          <div className="mt-2">
            <InitialEmptyCard
              id="ga-facility-ticket-empty-card"
              title="Laporkan Perbaikan Fasilitas Kantor!"
              description="Catat keluhan kerusakan sarana gedung agar tim teknisi segera menindaklanjuti."
              buttonText="Buat Tiket Perbaikan Pertama"
              ButtonIcon={Wrench}
              onAction={() => {
                setModalMode('ticket');
                setIsModalOpen(true);
              }}
              animationData={emptyGaFacilityAnimation}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {tkt.ticketNumber}
                    </span>
                    <span className="text-xs text-slate-400 tabular-nums">{tkt.createdAt}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        tkt.priority === 'HIGH' || tkt.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      Prioritas {tkt.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tkt.status !== 'RESOLVED' ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateTicketStatus(tkt.id, 'RESOLVED')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Tandai Selesai Diperbaiki
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selesai Diperbaiki
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteTicket(tkt.id, tkt.ticketNumber)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Tiket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{tkt.title}</h4>
                <p className="text-xs text-slate-600">{tkt.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>
                    Lokasi: <strong>{tkt.location}</strong>
                  </span>
                  <span>
                    Pelapor: <strong>{tkt.reporterName}</strong> ({tkt.department})
                  </span>
                  {tkt.assignedStaff && (
                    <span>
                      Teknisi PIC: <strong>{tkt.assignedStaff}</strong>
                    </span>
                  )}
                  {tkt.cost && (
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      Biaya: Rp {tkt.cost.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal Ticket, Booking, or Schedule */}
      <ModalTicket
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onSaved={loadData}
      />
    </div>
  );
};

