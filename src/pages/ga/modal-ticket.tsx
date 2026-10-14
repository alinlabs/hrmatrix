import React, { useState } from 'react';
import { X, Wrench, Calendar, CheckCircle2 } from 'lucide-react';
import { MaintenanceTicket, RoomBooking } from './types';
import { GAStorage } from './ga-storage';
import { Modal } from '../../components/ui/Modal';

interface ModalTicketProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'ticket' | 'booking';
  onSaved?: () => void;
}

export const ModalTicket: React.FC<ModalTicketProps> = ({ isOpen, onClose, mode, onSaved }) => {
  // Ticket fields
  const [ticketTitle, setTicketTitle] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [department, setDepartment] = useState('General Affairs');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('MEDIUM');
  const [description, setDescription] = useState('');

  // Booking fields
  const [roomName, setRoomName] = useState('Ruang Garuda (Meeting Room Utama - Kapasitas 16 Orang)');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [purpose, setPurpose] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(6);
  const [needsPantry, setNeedsPantry] = useState(true);
  const [needsProjector, setNeedsProjector] = useState(true);

  if (!isOpen) return null;

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
        description
      };
      GAStorage.addMaintenanceTicket(newTicket);
    } else {
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
        status: 'CONFIRMED'
      };
      GAStorage.addRoomBooking(newBooking);
    }

    if (onSaved) onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-lg flex flex-col max-h-[90vh]"
    >
      <div className="bg-white rounded-2xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              mode === 'ticket' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
            }`}>
              {mode === 'ticket' ? <Wrench className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {mode === 'ticket' ? 'Buat Tiket Perbaikan Fasilitas' : 'Reservasi Ruang Rapat'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {mode === 'ticket' ? 'Laporan kerusakan fasilitas & pemeliharaan kantor' : 'Peminjaman ruangan & fasilitas rapat'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Pemohon / Pelapor *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Siti Rahmawati"
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Departemen *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: HR / Finance / Engineering"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {mode === 'ticket' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Keluhan / Masalah Fasilitas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AC Lantai 2 Meneteskan Air / Lampu Pantry Mati"
                  value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lokasi Spesifik *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lantai 2 Ruang Meeting Merpati"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tingkat Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 font-semibold text-rose-700"
                  >
                    <option value="LOW">Rendah (Dapat ditunda)</option>
                    <option value="MEDIUM">Sedang (Dalam 1-2 hari)</option>
                    <option value="HIGH">Tinggi (Hari ini juga)</option>
                    <option value="EMERGENCY">Emergency (Darurat Bahaya)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rincian Detail Kerusakan / Gejala
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan secara rinci kondisi kerusakan agar teknisi GA membawa alat yang tepat..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Ruang Rapat *
                </label>
                <select
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                >
                  <option value="Ruang Garuda (Meeting Room Utama - Kapasitas 16 Orang)">Ruang Garuda (Meeting Room Utama - Kapasitas 16 Orang)</option>
                  <option value="Ruang Merpati (Meeting Room Kecil - Kapasitas 6 Orang)">Ruang Merpati (Meeting Room Kecil - Kapasitas 6 Orang)</option>
                  <option value="Ruang Boardroom Eksekutif (Lantai 3 - Kapasitas 10 Orang)">Ruang Boardroom Eksekutif (Lantai 3 - Kapasitas 10 Orang)</option>
                  <option value="Training Center & Hall (Lantai 1 - Kapasitas 40 Orang)">Training Center & Hall (Lantai 1 - Kapasitas 40 Orang)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Booking *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Mulai *
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Selesai *
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Agenda / Keperluan Rapat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Evaluasi Kinerja Tim Q1 & Review Target Bulanan"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                <div>
                  <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                    Perkiraan Peserta
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={attendeesCount}
                    onChange={e => setAttendeesCount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="chk-pantry"
                    checked={needsPantry}
                    onChange={e => setNeedsPantry(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                  <label htmlFor="chk-pantry" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Siapkan Kopi/Snack Pantry
                  </label>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="chk-proj"
                    checked={needsProjector}
                    onChange={e => setNeedsProjector(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                  <label htmlFor="chk-proj" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Proyektor & Mic
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons (SPEC_MODAL: Single Full-Width Primary Action) */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
            <button
              type="submit"
              className={`w-full h-10 ${
                mode === 'ticket' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
              } active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer`}
            >
              {mode === 'ticket' ? 'Kirim Tiket Perbaikan' : 'Konfirmasi Booking Ruangan'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
