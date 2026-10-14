import { Modal } from '../../../components/ui/Modal';
import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  X, 
  UserPlus, 
  LogIn, 
  LogOut, 
  CalendarOff, 
  ChevronRight,
  ChevronLeft,
  QrCode
} from 'lucide-react';
import { AttendanceConfig } from '../../../types';
import { formatDateIndo } from './utils-helper';
import { Button, Input } from '../../../components/ui';

export type LiburType = 'OFF' | 'HOLIDAY' | 'LEAVE' | 'SICK' | 'ALPHA';

interface ModalToolsProps {
  isOpen: boolean;
  onClose: () => void;
  filterDate: string;
  shiftFilter: string;
  departmentFilter: string;
  attendanceConfig: AttendanceConfig | null;
  filteredCount: number;
  totalActiveEmployees: number;
  onSelectScan?: () => void;
  onSelectManualInput: () => void;
  onHadirkanSemua: (jamMasuk: string, keterangan: string) => void;
  onPulangkanSemua: (jamPulang: string, keterangan: string) => void;
  onLiburkanSemua: (jenisLibur: LiburType, keterangan: string) => void;
}

function getShiftTitleSuffix(shiftFilter: string, attendanceConfig: AttendanceConfig | null): string {
  if (!shiftFilter || shiftFilter === 'ALL') {
    return '';
  }
  const selectedShiftObj = attendanceConfig?.shifts?.find(
    s => s.id === shiftFilter || s.code === shiftFilter
  );
  const rawCodeOrName = selectedShiftObj?.code || selectedShiftObj?.name || shiftFilter;
  
  // Format to Title Case (e.g. "SIANG" -> "Siang", "pagi" -> "Pagi", "SHIFT 1" -> "Shift 1")
  const properText = rawCodeOrName
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  
  if (properText.toLowerCase().startsWith('shift')) {
    return properText;
  }
  return `Shift ${properText}`;
}

export function ModalTools({
  isOpen,
  onClose,
  filterDate,
  shiftFilter,
  attendanceConfig,
  filteredCount,
  onSelectScan,
  onSelectManualInput,
  onHadirkanSemua,
  onPulangkanSemua,
  onLiburkanSemua,
}: ModalToolsProps) {
  const [viewMode, setViewMode] = useState<'menu' | 'hadirkan' | 'pulangkan' | 'liburkan'>('menu');

  // Form states
  const [jamMasuk, setJamMasuk] = useState('08:00');
  const [ketMasuk, setKetMasuk] = useState('');

  const [jamPulang, setJamPulang] = useState('17:00');
  const [ketPulang, setKetPulang] = useState('');

  const [jenisLibur, setJenisLibur] = useState<LiburType>('OFF');
  const [ketLibur, setKetLibur] = useState('');

  // Reset / default values on open
  useEffect(() => {
    if (isOpen) {
      setViewMode('menu');

      // Resolve active shift start/end times if shift filtered
      const selectedShiftObj = attendanceConfig?.shifts?.find(
        s => s.id === shiftFilter || s.code === shiftFilter
      );

      const defaultIn = selectedShiftObj?.startTime || attendanceConfig?.normalStartTime || '08:00';
      const defaultOut = selectedShiftObj?.endTime || attendanceConfig?.normalEndTime || '17:00';

      setJamMasuk(defaultIn);
      setKetMasuk('');
      setJamPulang(defaultOut);
      setKetPulang('');
      setJenisLibur('OFF');
      setKetLibur('');
    }
  }, [isOpen, shiftFilter, attendanceConfig]);

  const formattedDateFull = formatDateIndo(filterDate);
  const shiftSuffix = getShiftTitleSuffix(shiftFilter, attendanceConfig);

  const hadirkanTitle = shiftSuffix ? `Hadirkan Semua ${shiftSuffix}` : 'Hadirkan Semua';
  const pulangkanTitle = shiftSuffix ? `Pulangkan Semua ${shiftSuffix}` : 'Pulangkan Semua';
  const liburkanTitle = shiftSuffix ? `Liburkan Semua ${shiftSuffix}` : 'Liburkan Semua';

  const handleSubmitHadirkan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jamMasuk) {
      alert('Mohon isi jam masuk!');
      return;
    }
    onHadirkanSemua(jamMasuk, ketMasuk.trim());
  };

  const handleSubmitPulangkan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jamPulang) {
      alert('Mohon isi jam pulang!');
      return;
    }
    onPulangkanSemua(jamPulang, ketPulang.trim());
  };

  const handleSubmitLiburkan = (e: React.FormEvent) => {
    e.preventDefault();
    onLiburkanSemua(jenisLibur, ketLibur.trim());
  };

  return (
    
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >

        {/* 1. VIEW MENU UTAMA TOOLS */}
        {viewMode === 'menu' && (
          <div className="flex flex-col flex-1 overflow-hidden overflow-x-hidden min-h-0 w-full">
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 w-full">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Wrench className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-800 truncate">
                    Tools Presensi
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    Aksi cepat otomatis & opsi input presensi
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0 ml-2"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Cards List */}
            <div className="p-4 sm:p-6 space-y-2.5 overflow-y-auto w-full">
              {/* Card 0 (Atas): Scan Barcode / QR Code ID */}
              {onSelectScan && (
                <div
                  onClick={onSelectScan}
                  className="p-3 sm:p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl cursor-pointer transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 group flex items-center justify-between gap-3 w-full border border-blue-400/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-white/20 text-white rounded-xl backdrop-blur-xs group-hover:scale-105 transition-transform shrink-0">
                      <QrCode className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                        <span>Scan ID / QR Code</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase text-amber-300 tracking-wider">Paling Cepat</span>
                      </div>
                      <div className="text-[11px] text-blue-100 line-clamp-1 break-words opacity-90">
                        Scan otomatis via kamera atau pemindai barcode fisik ID karyawan
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4.5 h-4.5 text-blue-200 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              )}

              {/* Card 1: Input Presensi Manual */}
              <div
                onClick={onSelectManualInput}
                className="p-3 sm:p-3.5 bg-white border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-all shadow-2xs group flex items-center justify-between gap-3 w-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <UserPlus className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      Input Presensi Manual
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 break-words">
                      Formulir input atau edit detail presensi karyawan individu
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Card 2: Hadirkan Semua */}
              <div
                onClick={() => setViewMode('hadirkan')}
                className="p-3 sm:p-3.5 bg-white border border-slate-200/90 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-2xl cursor-pointer transition-all shadow-2xs group flex items-center justify-between gap-3 w-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                    <LogIn className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                      Hadirkan Semua
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 break-words">
                      Isi jam masuk (IN) massal untuk seluruh karyawan target
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Card 3: Pulangkan Semua */}
              <div
                onClick={() => setViewMode('pulangkan')}
                className="p-3 sm:p-3.5 bg-white border border-slate-200/90 hover:border-rose-400 hover:bg-rose-50/30 rounded-2xl cursor-pointer transition-all shadow-2xs group flex items-center justify-between gap-3 w-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                    <LogOut className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-600 transition-colors truncate">
                      Pulangkan Semua
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 break-words">
                      Isi jam pulang (OUT) massal sesuai jam selesai shift kerja
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Card 4: Liburkan Semua */}
              <div
                onClick={() => setViewMode('liburkan')}
                className="p-3 sm:p-3.5 bg-white border border-slate-200/90 hover:border-rose-400 hover:bg-rose-50/30 rounded-2xl cursor-pointer transition-all shadow-2xs group flex items-center justify-between gap-3 w-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                    <CalendarOff className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-600 transition-colors truncate">
                      Liburkan Semua
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 break-words">
                      Ubah ke OFF DAY, Hari Libur, Sakit, atau Cuti massal
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </div>
          </div>
        )}

        {/* 2. FORM HADIRKAN SEMUA */}
        {viewMode === 'hadirkan' && (
          <form onSubmit={handleSubmitHadirkan} className="flex flex-col flex-1 min-h-0">
            {/* Header: Back arrow directly before title & date subtitle, close X on right */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setViewMode('menu')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors shrink-0"
                  title="Kembali"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-800 truncate leading-snug">
                    {hadirkanTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate leading-tight mt-0.5">
                    {formattedDateFull}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0 ml-2"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto w-full">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Jam Masuk
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium select-none">
                    Klik Untuk Atur Jam
                  </span>
                </div>
                <div className="relative group">
                  <div className="w-full py-3.5 px-3 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-2xs group-hover:border-slate-300">
                    <div className="text-3xl font-bold text-emerald-600 tracking-wider text-center select-none">
                      {jamMasuk || '08:00'}
                    </div>
                  </div>
                  <input
                    type="time"
                    value={jamMasuk}
                    onChange={(e) => setJamMasuk(e.target.value)}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                  Format jam masuk yang akan diterapkan ke seluruh karyawan target.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Keterangan
                </label>
                <Input
                  type="text"
                  value={ketMasuk}
                  onChange={(e) => setKetMasuk(e.target.value)}
                  placeholder="Contoh: Hadir Tepat Waktu / Masuk Massal"
                  className="text-xs w-full"
                />
              </div>
            </div>

            {/* Sticky Bottom Action Button */}
            <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white w-full">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Terapkan
              </Button>
            </div>
          </form>
        )}

        {/* 3. FORM PULANGKAN SEMUA */}
        {viewMode === 'pulangkan' && (
          <form onSubmit={handleSubmitPulangkan} className="flex flex-col flex-1 min-h-0">
            {/* Header: Back arrow directly before title & date subtitle, close X on right */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setViewMode('menu')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors shrink-0"
                  title="Kembali"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-800 truncate leading-snug">
                    {pulangkanTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate leading-tight mt-0.5">
                    {formattedDateFull}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0 ml-2"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto w-full">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Jam Pulang
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium select-none">
                    Klik Untuk Atur Jam
                  </span>
                </div>
                <div className="relative group">
                  <div className="w-full py-3.5 px-3 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-2xs group-hover:border-slate-300">
                    <div className="text-3xl font-bold text-rose-600 tracking-wider text-center select-none">
                      {jamPulang || '17:00'}
                    </div>
                  </div>
                  <input
                    type="time"
                    value={jamPulang}
                    onChange={(e) => setJamPulang(e.target.value)}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                  Jam kepulangan/selesai kerja yang akan diisi untuk karyawan target.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Keterangan
                </label>
                <Input
                  type="text"
                  value={ketPulang}
                  onChange={(e) => setKetPulang(e.target.value)}
                  placeholder="Contoh: Selesai Jam Kerja / Pulang Massal"
                  className="text-xs w-full"
                />
              </div>
            </div>

            {/* Sticky Bottom Action Button */}
            <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white w-full">
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Terapkan
              </Button>
            </div>
          </form>
        )}

        {/* 4. FORM LIBURKAN SEMUA */}
        {viewMode === 'liburkan' && (
          <form onSubmit={handleSubmitLiburkan} className="flex flex-col flex-1 min-h-0">
            {/* Header: Back arrow directly before title & date subtitle, close X on right */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setViewMode('menu')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors shrink-0"
                  title="Kembali"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-800 truncate leading-snug">
                    {liburkanTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate leading-tight mt-0.5">
                    {formattedDateFull}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0 ml-2"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto w-full">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Jenis Libur / Status
                </label>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {[
                    { id: 'OFF', label: 'OFF DAY (Libur Reguler)', desc: 'Set jadwal OFF di matriks & kosongkan presensi' },
                    { id: 'HOLIDAY', label: 'Hari Libur Nasional / Tanggal Merah', desc: 'Set jadwal Hari Libur di matriks' },
                    { id: 'LEAVE', label: 'Cuti / Izin Bersama', desc: 'Set status presensi menjadi Cuti/Izin' },
                    { id: 'SICK', label: 'Sakit Massal', desc: 'Set status presensi menjadi Sakit' },
                    { id: 'ALPHA', label: 'Alpa / Tidak Hadir', desc: 'Set status presensi menjadi Alpa' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setJenisLibur(item.id as LiburType)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 w-full box-border ${
                        jenisLibur === item.id
                          ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-400/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="jenisLibur"
                        checked={jenisLibur === item.id}
                        onChange={() => setJenisLibur(item.id as LiburType)}
                        className="mt-0.5 text-slate-800 focus:ring-slate-500 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-800 truncate">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 break-words">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Keterangan
                </label>
                <Input
                  type="text"
                  value={ketLibur}
                  onChange={(e) => setKetLibur(e.target.value)}
                  placeholder={
                    jenisLibur === 'HOLIDAY' 
                      ? 'Contoh: Hari Raya Idul Fitri / Tahun Baru' 
                      : jenisLibur === 'LEAVE'
                      ? 'Contoh: Cuti Bersama Perusahaan'
                      : jenisLibur === 'SICK'
                      ? 'Contoh: Istirahat Sakit Massal'
                      : 'Contoh: OFF Rutin / Libur Terjadwal'
                  }
                  className="text-xs w-full"
                />
              </div>
            </div>

            {/* Sticky Bottom Action Button */}
            <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white w-full">
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Terapkan
              </Button>
            </div>
          </form>
        )}
    </Modal>
  );
}

