import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MaintenanceTicket, RoomBooking, FacilityMaintenanceSchedule, FacilityType } from './types';
import { GAStorage } from './ga-storage';
import { Modal } from '../../components/ui/modal';

interface ModalTicketProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'ticket' | 'booking' | 'schedule';
  onSaved?: () => void;
}

export const ModalTicket: React.FC<ModalTicketProps> = ({ isOpen, onClose, mode, onSaved }) => {
  const [ticketTitle, setTicketTitle] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [department, setDepartment] = useState('General Affairs');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('MEDIUM');
  const [description, setDescription] = useState('');

  const [roomName, setRoomName] = useState(
    'Ruang Garuda (Meeting Room Utama - Kapasitas 16 Orang)'
  );
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [purpose, setPurpose] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(6);
  const [needsPantry, setNeedsPantry] = useState(true);
  const [needsProjector, setNeedsProjector] = useState(true);

  const [scheduleTitle, setScheduleTitle] = useState('');
  const [facilityType, setFacilityType] = useState<FacilityType>('AC_HVAC');
  const [scheduleLocation, setScheduleLocation] = useState('Lantai 1, 2, 3 Kantor Pusat');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState<FacilityMaintenanceSchedule['frequency']>('BULANAN');
  const [technicianVendor, setTechnicianVendor] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(1500000);
  const [scheduleNotes, setScheduleNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTicketTitle('');
      setReporterName('');
      setDepartment('General Affairs');
      setLocation('');
      setPriority('MEDIUM');
      setDescription('');
      setBookingDate(new Date().toISOString().split('T')[0]);
      setPurpose('');
      setScheduleTitle('');
      setFacilityType('AC_HVAC');
      setScheduleLocation('Lantai 1, 2, 3 Kantor Pusat');
      setScheduledDate(new Date().toISOString().split('T')[0]);
      setFrequency('BULANAN');
      setTechnicianVendor('');
      setEstimatedCost(1500000);
      setScheduleNotes('');
    }
  }, [isOpen, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'ticket') {
      if (!ticketTitle.trim() || !reporterName.trim()) return;
      const ticketNumber = `WO-GA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      const newTicket: MaintenanceTicket = {
        id: `tkt-${Date.now()}`,
        ticketNumber,
        title: ticketTitle,
        reporterName,
        department,
        location: location || 'Gedung Kantor',
        priority,
        status: 'OPEN',
        createdAt: nowStr,
        description,
      };
      GAStorage.addMaintenanceTicket(newTicket);
    } else if (mode === 'booking') {
      if (!purpose.trim() || !reporterName.trim()) return;
      const newBooking: RoomBooking = {
        id: `rm-${Date.now()}`,
        roomName,
        date: bookingDate,
        startTime,
        endTime,
        bookedByEmployeeName: reporterName,
        department,
        purpose,
        attendeesCount,
        needsPantry,
        needsProjector,
        status: 'CONFIRMED',
      };
      GAStorage.addRoomBooking(newBooking);
    } else {
      if (!scheduleTitle.trim() || !technicianVendor.trim()) return;
      const newSchedule: FacilityMaintenanceSchedule = {
        id: `mnt-${Date.now()}`,
        title: scheduleTitle.trim(),
        facilityType,
        location: scheduleLocation.trim() || 'Gedung Kantor',
        scheduledDate,
        frequency,
        technicianVendor: technicianVendor.trim(),
        estimatedCost: Math.max(0, Number(estimatedCost) || 0),
        status: 'TERJADWAL',
        nextDueDate: scheduledDate,
        notes: scheduleNotes.trim() || undefined,
      };
      GAStorage.addMaintenanceSchedule(newSchedule);
    }

    if (onSaved) onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-lg flex flex-col max-h-[90vh]">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
              {mode === 'ticket'
                ? 'Buat Tiket Perbaikan Fasilitas'
                : mode === 'booking'
                ? 'Reservasi Ruang Rapat'
                : 'Buat Jadwal Servis Fasilitas'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
              {mode === 'ticket'
                ? 'Laporan kerusakan fasilitas & pemeliharaan kantor'
                : mode === 'booking'
                ? 'Peminjaman ruangan & fasilitas rapat'
                : 'Jadwal pemeliharaan berkala AC, genset, kelistrikan & APAR'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Tutup"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          {mode !== 'schedule' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pemohon / Pelapor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahmawati"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departemen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: HR / Finance / Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {mode === 'ticket' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Keluhan / Masalah Fasilitas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AC Lantai 2 Meneteskan Air / Lampu Pantry Mati"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi Spesifik *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lantai 2 Ruang Meeting Merpati"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold text-slate-800"
                  >
                    <option value="LOW">Rendah (Dapat ditunda)</option>
                    <option value="MEDIUM">Sedang (Dalam 1-2 hari)</option>
                    <option value="HIGH">Tinggi (Hari ini juga)</option>
                    <option value="EMERGENCY">Emergency (Darurat Bahaya)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rincian Detail Kerusakan / Gejala
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan secara rinci kondisi kerusakan agar teknisi GA membawa alat yang tepat..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </>
          ) : mode === 'booking' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Ruang Rapat *
                </label>
                <select
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                >
                  <option value="Ruang Garuda (Meeting Room Utama - Kapasitas 16 Orang)">
                    Ruang Garuda (Meeting Room Utama - Kapasitas 16 Orang)
                  </option>
                  <option value="Ruang Merpati (Meeting Room Kecil - Kapasitas 6 Orang)">
                    Ruang Merpati (Meeting Room Kecil - Kapasitas 6 Orang)
                  </option>
                  <option value="Ruang Boardroom Eksekutif (Lantai 3 - Kapasitas 10 Orang)">
                    Ruang Boardroom Eksekutif (Lantai 3 - Kapasitas 10 Orang)
                  </option>
                  <option value="Training Center & Hall (Lantai 1 - Kapasitas 40 Orang)">
                    Training Center & Hall (Lantai 1 - Kapasitas 40 Orang)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Booking *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Mulai *
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Selesai *
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agenda / Keperluan Rapat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Evaluasi Kinerja Tim Q1 & Review Target Bulanan"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Perkiraan Peserta
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={attendeesCount}
                    onChange={(e) => setAttendeesCount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="chk-pantry"
                    checked={needsPantry}
                    onChange={(e) => setNeedsPantry(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <label htmlFor="chk-pantry" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Siapkan Kopi/Snack
                  </label>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="chk-proj"
                    checked={needsProjector}
                    onChange={(e) => setNeedsProjector(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <label htmlFor="chk-proj" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Proyektor & Mic
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Jadwal Servis / Pemeliharaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Servis & Cuci Rutin Unit AC Gedung"
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Fasilitas *
                  </label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value as FacilityType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                  >
                    <option value="AC_HVAC">AC & Sistem HVAC</option>
                    <option value="LISTRIK_GENSET">Kelistrikan & Genset</option>
                    <option value="KEAMANAN_CCTV">Keamanan, CCTV & APAR</option>
                    <option value="PLUMBING_TOILET">Plumbing, Toilet & Kebersihan</option>
                    <option value="RUANG_MEETING">Ruang Meeting & Interior</option>
                    <option value="KENDARAAN_KANTOR">Kendaraan Operasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Frekuensi Pemeliharaan *
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) =>
                      setFrequency(e.target.value as FacilityMaintenanceSchedule['frequency'])
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                  >
                    <option value="MINGGUAN">Mingguan</option>
                    <option value="BULANAN">Bulanan</option>
                    <option value="TRIWULAN">Triwulan</option>
                    <option value="SEMESTERAN">Semesteran</option>
                    <option value="TAHUNAN">Tahunan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vendor / Teknisi Pelaksana *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: CV Sejuk Prima HVAC"
                    value={technicianVendor}
                    onChange={(e) => setTechnicianVendor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi Fasilitas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lantai 1, 2, 3 Kantor Pusat"
                    value={scheduleLocation}
                    onChange={(e) => setScheduleLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Jadwal Berikutnya *
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimasi Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={estimatedCost || ''}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Teknis Servis
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Cek tekanan freon R32, bersihkan filter dan drainase..."
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            {mode === 'ticket'
              ? 'Kirim Tiket Perbaikan'
              : mode === 'booking'
              ? 'Konfirmasi Booking Ruangan'
              : 'Simpan Jadwal Servis'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
