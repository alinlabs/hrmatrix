import React, { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { populateSampleCompanyAndEmployees } from '../../utils/sampleDataGenerator';
import { Download, Upload, AlertTriangle, Database, Trash2, RotateCcw, ShieldAlert, CheckCircle2, RefreshCw, X, FileText, Sliders } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { Lottie } from 'lottie-react';
import emptyDatabaseAnimation from '../../assets/animations/empty-database.json';
import { sampleAttendanceConfig } from '../../data/sampleDb/pengaturan-presensi';
import { sampleAttendanceRecords } from '../../data/sampleDb/presensi';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions 
} from '../../context/MobileNavContext';

export function DatabaseManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isPopulatingSample, setIsPopulatingSample] = useState(false);
  const [sampleSuccessToast, setSampleSuccessToast] = useState(false);
  
  const stats = useLiveQuery(async () => {
    return {
      company: await db.company.count(),
      employees: await db.employees.count(),
      attendance: await db.attendance.count(),
      payroll: await db.payrollRecords.count(),
      leaves: await db.leaves.count(),
      shiftSchedules: await db.shiftSchedules.count(),
      shiftSwaps: await db.shiftSwaps.count(),
      extraShifts: await db.extraShifts.count(),
    };
  });

  const handlePopulateSample = async () => {
    if (!confirm('Apakah Anda ingin memuat data sampel Mode Demo? Data lengkap (karyawan, jadwal shift, presensi, cuti, dan payroll) akan dimuat untuk keperluan eksplorasi dan demo.')) {
      return;
    }

    try {
      setIsPopulatingSample(true);
      await populateSampleCompanyAndEmployees();
      setSampleSuccessToast(true);
      setTimeout(() => {
        setSampleSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error('Failed to populate sample data', error);
      alert('Gagal memuat data sampel: ' + (error as Error).message);
    } finally {
      setIsPopulatingSample(false);
    }
  };

  const handleResetDatabase = async () => {
    try {
      setIsResetting(true);
      await db.clearAllTables();

      alert('Database berhasil direset ke kondisi awal (kosong).');
      setShowResetModal(false);
      window.location.href = '/daftar';
    } catch (error) {
      console.error('Failed to reset database', error);
      alert('Gagal mereset database: ' + (error as Error).message);
      setIsResetting(false);
    }
  };

  const handleExport = async () => {
    try {
      const settingsArr = await db.settings.toArray();
      const attendanceArr = await db.attendance.toArray();
      const data = {
        version: "2.2",
        exportedAt: new Date().toISOString(),
        company: await db.company.toArray(),
        employees: await db.employees.toArray(),
        departments: await db.departments.toArray(),
        positions: await db.positions.toArray(),
        attendance: attendanceArr,
        presensi: attendanceArr,
        payrollPeriods: await db.payrollPeriods.toArray(),
        payrollRecords: await db.payrollRecords.toArray(),
        settings: settingsArr,
        pengaturanPresensi: settingsArr[0] || sampleAttendanceConfig,
        leaves: await db.leaves.toArray(),
        kpiTemplates: await db.kpiTemplates.toArray(),
        kpiPeriods: await db.kpiPeriods.toArray(),
        kpiResults: await db.kpiResults.toArray(),
        salaryHistory: await db.salaryHistory.toArray(),
        shiftSchedules: await db.shiftSchedules.toArray(),
        shiftSwaps: await db.shiftSwaps.toArray(),
        extraShifts: await db.extraShifts.toArray(),
        regulatorySources: await db.regulatorySources.toArray(),
        payrollRules: await db.payrollRules.toArray(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hrmatrix_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Gagal melakukan export database.");
    }
  };

  const handleExportPengaturanPresensi = async () => {
    try {
      const config = await db.settings.get('attendanceConfig');
      const dataToExport = config || sampleAttendanceConfig;
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pengaturan-presensi.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export pengaturan-presensi failed', error);
      alert('Gagal mengekspor pengaturan presensi: ' + (error as Error).message);
    }
  };

  const handleExportPresensi = async () => {
    try {
      const records = await db.attendance.toArray();
      const dataToExport = records.length > 0 ? records : sampleAttendanceRecords;
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presensi.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export presensi failed', error);
      alert('Gagal mengekspor data presensi: ' + (error as Error).message);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("Mengimpor data dapat memperbarui atau menimpa data yang ada. Apakah Anda yakin ingin melanjutkan?")) {
      e.target.value = '';
      return;
    }

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // 1. Deteksi apakah berkas yang diupload adalah 'pengaturan-presensi.json'
        if (json.id === 'attendanceConfig' || (json.systemType && (json.shifts || json.lateToleranceMinutes !== undefined))) {
          await db.settings.put(json);
          alert("Pengaturan presensi (pengaturan-presensi.json) berhasil diimpor!");
          window.location.reload();
          return;
        }

        // 2. Deteksi apakah berkas yang diupload adalah 'presensi.json' (Array)
        if (Array.isArray(json) && (json.length === 0 || (json[0]?.employeeId && json[0]?.date))) {
          await db.attendance.bulkPut(json);
          alert(`${json.length} Catatan presensi (presensi.json) berhasil diimpor!`);
          window.location.reload();
          return;
        }

        // 3. Deteksi objek pembungkus presensi atau pengaturanPresensi
        if (json.pengaturanPresensi && typeof json.pengaturanPresensi === 'object' && !json.version) {
          await db.settings.put(json.pengaturanPresensi);
          alert("Pengaturan presensi berhasil diimpor!");
          window.location.reload();
          return;
        }

        if (json.presensi && Array.isArray(json.presensi) && !json.version) {
          await db.attendance.bulkPut(json.presensi);
          alert(`${json.presensi.length} Catatan presensi berhasil diimpor!`);
          window.location.reload();
          return;
        }

        if (!json.version) {
          throw new Error("Format berkas JSON cadangan tidak dikenali.");
        }

        // 4. Run full restore in transaction
        await db.transaction('rw', 
          [
            db.company, 
            db.employees, 
            db.departments, 
            db.positions, 
            db.attendance, 
            db.payrollPeriods, 
            db.payrollRecords, 
            db.settings,
            db.leaves, 
            db.kpiTemplates, 
            db.kpiPeriods,
            db.kpiResults, 
            db.salaryHistory,
            db.shiftSchedules,
            db.shiftSwaps,
            db.extraShifts,
            db.regulatorySources,
            db.payrollRules
        ], 
          async () => {
            // Clear existing
            await Promise.all([
              db.company.clear(),
              db.employees.clear(),
              db.departments.clear(),
              db.positions.clear(),
              db.attendance.clear(),
              db.payrollPeriods.clear(),
              db.payrollRecords.clear(),
              db.settings.clear(),
              db.leaves.clear(),
              db.kpiTemplates.clear(),
              db.kpiPeriods.clear(),
              db.kpiResults.clear(),
              db.salaryHistory.clear(),
              db.shiftSchedules.clear(),
              db.shiftSwaps.clear(),
              db.extraShifts.clear(),
              db.regulatorySources.clear(),
              db.payrollRules.clear()
          ]);

            // Bulk put (upsert)
            if (json.company?.length) await db.company.bulkPut(json.company);
            if (json.employees?.length) await db.employees.bulkPut(json.employees);
            if (json.departments?.length) await db.departments.bulkPut(json.departments);
            if (json.positions?.length) await db.positions.bulkPut(json.positions);
            
            const attendanceList = json.presensi?.length ? json.presensi : (json.attendance?.length ? json.attendance : []);
            if (attendanceList.length) await db.attendance.bulkPut(attendanceList);

            if (json.payrollPeriods?.length) await db.payrollPeriods.bulkPut(json.payrollPeriods);
            if (json.payrollRecords?.length) await db.payrollRecords.bulkPut(json.payrollRecords);

            const settingsList = json.settings?.length ? json.settings : (json.pengaturanPresensi ? [json.pengaturanPresensi] : []);
            if (settingsList.length) await db.settings.bulkPut(settingsList);

            if (json.leaves?.length) await db.leaves.bulkPut(json.leaves);
            if (json.kpiTemplates?.length) await db.kpiTemplates.bulkPut(json.kpiTemplates);
            if (json.kpiPeriods?.length) await db.kpiPeriods.bulkPut(json.kpiPeriods);
            if (json.kpiResults?.length) await db.kpiResults.bulkPut(json.kpiResults);
            if (json.salaryHistory?.length) await db.salaryHistory.bulkPut(json.salaryHistory);
            if (json.shiftSchedules?.length) await db.shiftSchedules.bulkPut(json.shiftSchedules);
            if (json.shiftSwaps?.length) await db.shiftSwaps.bulkPut(json.shiftSwaps);
            if (json.extraShifts?.length) await db.extraShifts.bulkPut(json.extraShifts);
            if (json.regulatorySources?.length) await db.regulatorySources.bulkPut(json.regulatorySources);
            if (json.payrollRules?.length) await db.payrollRules.bulkPut(json.payrollRules);
        });

        alert("Database berhasil direstore!");
        window.location.reload(); // Reload to refresh all states
      } catch (error) {
        console.error("Import failed", error);
        alert("Gagal merestore database: " + (error as Error).message);
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const headerActionsContent = (
    <button
      type="button"
      onClick={() => setShowStatusModal(true)}
      className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm cursor-pointer hover:underline transition-colors px-1 py-0.5 focus:outline-none"
    >
      Cek Status
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeaderTitle
        title="Database"
        subtitle="Cadangan & Pemulihan Data"
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* CARD UTAMA: MANAJEMEN DATABASE (EXPORT | IMPORT | RESET) */}
      <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-900 text-base font-bold">
            Cadangkan & Kelola Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ekspor salinan seluruh data ke file JSON, pulihkan data dari berkas cadangan, atau bersihkan basis data lokal untuk memulai dari awal.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full pt-1">
            {/* 1. Export */}
            <Button 
              type="button"
              onClick={handleExport} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-2 sm:px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-all whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Export</span>
            </Button>

            {/* 2. Import */}
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImport} 
            />
            <Button 
              type="button"
              variant="outline" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={importing}
              className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-9 px-2 sm:px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-all whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{importing ? 'Mengimpor...' : 'Import'}</span>
            </Button>

            {/* 3. Reset */}
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setShowResetModal(true)}
              className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold text-xs h-9 px-2 sm:px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-all whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Reset</span>
            </Button>
          </div>

          {/* Ekspor Modul Spesifik Presensi */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Ekspor Berkas Spesifik Presensi (JSON)</span>
              <span className="text-[11px] text-slate-400">Dapat diimpor secara modular</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportPengaturanPresensi}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">pengaturan-presensi.json</p>
                    <p className="text-[10px] text-slate-500 truncate">Aturan, toleransi & shift master</p>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
              </button>

              <button
                type="button"
                onClick={handleExportPresensi}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate">presensi.json</p>
                    <p className="text-[10px] text-slate-500 truncate">Log riwayat check-in/out ({stats?.attendance ?? 0} data)</p>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODE DEMO SAMPLE LOADER CARD (POSISI DI BAWAH) */}
      <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-900 text-base font-bold">
            Mode Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Muat data sampel lengkap (profil perusahaan, struktur karyawan, jadwal shift & roster, absensi, pengajuan cuti, serta payroll) untuk menguji dan mengeksplorasi seluruh fungsionalitas HRMatrix secara langsung.
          </p>

          {/* Lottie Animation Display */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto -my-2 flex items-center justify-center">
            <Lottie
              src={emptyDatabaseAnimation as any}
              loop={true}
              autoplay={true}
              className="w-full h-full drop-shadow-xs pointer-events-none select-none"
            />
          </div>

          {sampleSuccessToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-center gap-2 font-medium animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data sampel Mode Demo berhasil dimuat! Anda dapat langsung menjelajahi seluruh fitur sistem.</span>
            </div>
          )}

          <div className="pt-1 grid grid-cols-2 gap-2 sm:gap-3 w-full">
            <Button 
              type="button" 
              onClick={handlePopulateSample}
              disabled={isPopulatingSample}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-2 sm:px-4 rounded-xl cursor-pointer flex items-center justify-center shadow-2xs transition-all whitespace-nowrap"
            >
              {isPopulatingSample ? 'Sedang Memuat...' : 'Muat Ulang Data'}
            </Button>
            <Button
              type="button"
              onClick={async () => {
                const { getSampleFullDataBundle } = await import('../../data/sampleDb/pengelola-data');
                const bundle = getSampleFullDataBundle();
                const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `hrmatrix-golden-standard-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-9 px-2 sm:px-4 rounded-xl cursor-pointer flex items-center justify-center shadow-2xs transition-all whitespace-nowrap"
            >
              Download Data
            </Button>
          </div>
          <span className="text-[11px] text-slate-400 italic block mt-0.5 w-full">
            *Seluruh data yang dimuat tersimpan lokal di peramban Anda dan dapat diubah atau dihapus kapan saja.
          </span>
        </CardContent>
      </Card>

      {/* Modal Konfirmasi Reset Database */}
      <Modal
        isOpen={showResetModal}
        onClose={() => !isResetting && setShowResetModal(false)}
        contentClassName="sm:max-w-md"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Modal */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  Konfirmasi Reset Database
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                  Pengosongan data & inisialisasi ulang sistem
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                title="Tutup"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Modal */}
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto min-h-0 text-xs flex-1">
            <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-xs text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Tindakan ini permanen dan tidak dapat dibatalkan</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                Seluruh data lokal yang tersimpan di peramban ini akan dikosongkan dan dikembalikan ke kondisi awal (setup):
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-700 font-medium pl-1">
                <li>Profil Perusahaan & Konfigurasi Shift/Jadwal</li>
                <li>{stats?.employees ?? 0} Karyawan & Dokumen Terkait</li>
                <li>{stats?.attendance ?? 0} Catatan Kehadiran & Shift Roster</li>
                <li>{stats?.payroll ?? 0} Data Payroll & Slip Gaji</li>
                <li>{stats?.leaves ?? 0} Riwayat & Saldo Cuti</li>
              </ul>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Pastikan Anda telah mengekspor backup berkas JSON jika sewaktu-waktu data masih dibutuhkan sebelum melanjutkan.
            </p>
          </div>

          {/* Footer Modal: Tombol Batal & Reset berdampingan */}
          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResetModal(false)}
              disabled={isResetting}
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleResetDatabase}
              disabled={isResetting}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isResetting ? 'Mereset...' : 'Reset Database'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal / Bottom Sheet Cek Status Database & Informasi Penyimpanan Lokal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        contentClassName="sm:max-w-lg"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Modal */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  Status Database Lokal
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                  Rekapitulasi entitas data & mekanisme penyimpanan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Modal */}
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto min-h-0 text-xs flex-1">
            {/* Daftar Rincian Status Database */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Storage Type</span>
                <span className="font-semibold text-slate-800">IndexedDB (Offline & Client-Side)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Karyawan</span>
                <span className="font-semibold text-slate-800">{stats?.employees ?? 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Catatan Kehadiran (Presensi)</span>
                <span className="font-semibold text-slate-800">{stats?.attendance ?? 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Pertukaran Shift & Jadwal Ekstra</span>
                <span className="font-semibold text-slate-800">{(stats?.shiftSwaps ?? 0) + (stats?.extraShifts ?? 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Pengajuan & Saldo Cuti</span>
                <span className="font-semibold text-slate-800">{stats?.leaves ?? 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Data Payroll & Slip Gaji</span>
                <span className="font-semibold text-slate-800">{stats?.payroll ?? 0}</span>
              </div>
            </div>

            {/* Paragraf Penjelasan Penyimpanan Lokal */}
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 text-xs">
                Penyimpanan Lokal & Keamanan Data
              </h4>
              <p>
                Semua data HRIS Anda disimpan secara <strong>lokal di dalam browser ini</strong> (IndexedDB). Data tidak dikirim ke server manapun demi privasi penuh.
              </p>
              <p>
                Jika Anda menghapus cache browser atau melakukan reset browser, data lokal Anda akan hilang. Lakukan export backup file JSON secara berkala untuk menjaga keutuhan data.
              </p>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
            <Button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl cursor-pointer shadow-2xs transition-all"
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
