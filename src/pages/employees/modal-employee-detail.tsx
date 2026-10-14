import React, { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  X, 
  User, 
  Building2, 
  Briefcase, 
  CreditCard, 
  Award, 
  ShieldCheck, 
  MapPin, 
  Banknote,
  Edit,
  Trash2,
  Folder,
  ExternalLink,
  QrCode,
  Share2,
  Download,
  Check
} from 'lucide-react';
import { SoftQRCode, SoftQRCodeHandle } from './soft-qr-code';
import { Modal } from '../../components/ui/Modal';
import { Employee } from '../../types';
import { db } from '../../db/database';
import { getPositionName, getDepartmentName, getPositionDetails } from '../../services/positionService';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { useCompany } from '../../context/CompanyContext';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit?: (emp: Employee) => void;
  onDelete?: (id: string) => void;
}

type TabType = 'profil' | 'detail' | 'berkas' | 'kpi' | 'payroll';

export function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete,
}: EmployeeDetailModalProps) {
  const { company } = useCompany();
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const qrRef = useRef<SoftQRCodeHandle>(null);
  const [qrActions, setQrActions] = useState<{
    download: () => Promise<void>;
    share: () => Promise<void>;
    openMyPresensi: () => void;
    copied: boolean;
    isDownloading: boolean;
  } | null>(null);

  // Query KPI Results for this employee
  const kpiResults = useLiveQuery(
    () => (employee?.id ? db.kpiResults.where('employeeId').equals(employee.id).toArray() : []),
    [employee?.id]
  ) || [];

  const kpiPeriods = useLiveQuery(
    () => db.kpiPeriods.toArray(),
    []
  ) || [];

  // Query Payroll Records for this employee
  const payrollRecords = useLiveQuery(
    () => (employee?.id ? db.payrollRecords.where('employeeId').equals(employee.id).toArray() : []),
    [employee?.id]
  ) || [];

  const payrollPeriods = useLiveQuery(
    () => db.payrollPeriods.toArray(),
    []
  ) || [];

  if (!employee) return null;

  const posDetails = getPositionDetails(employee.positionId);
  const positionDisplay = posDetails?.name || getPositionName(employee.positionId) || 'Staff';
  const departmentDisplay = getDepartmentName(employee.departmentId, employee.positionId) || posDetails?.department || 'Direksi & Eksekutif';
  const divisionDisplay = employee.division || posDetails?.division || 'Direksi';
  const categoryDisplay = employee.category || posDetails?.category || 'Eksekutif / C-Level';
  const levelDisplay = employee.level || posDetails?.level || 'Level C-Level / Director';
  const qrValue = employee.employeeId || employee.nik || employee.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fixedHeight
      contentClassName="sm:max-w-lg p-0 overflow-hidden bg-white"
    >
      <div className="flex flex-col h-full bg-white text-slate-900 overflow-hidden">
        {/* Header Modal - Clean Minimalist */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <EmployeeAvatar employee={employee} size="md" />
            <div className="min-w-0">
              <h3 className="font-bold text-base text-slate-900 leading-tight truncate">
                {employee.fullName}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {employee.employeeId || employee.nik} • {positionDisplay}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="Edit Karyawan"
                aria-label="Edit Karyawan"
              >
                <Edit className="w-4.5 h-4.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Apakah Anda yakin ingin menghapus data karyawan ${employee.fullName}?`)) {
                    onClose();
                    onDelete(employee.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus Karyawan"
                aria-label="Hapus Karyawan"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation - Full from Left to Right (Grid 5 Cols) */}
        <div className="w-full grid grid-cols-5 border-b border-slate-200 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`py-3 text-center text-xs transition-colors cursor-pointer w-full border-b-2 ${
              activeTab === 'profil'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'
            }`}
          >
            Akun
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`py-3 text-center text-xs transition-colors cursor-pointer w-full border-b-2 ${
              activeTab === 'detail'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'
            }`}
          >
            Detail
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('berkas')}
            className={`py-3 text-center text-xs transition-colors cursor-pointer w-full border-b-2 ${
              activeTab === 'berkas'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'
            }`}
          >
            Berkas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kpi')}
            className={`py-3 text-center text-xs transition-colors cursor-pointer w-full border-b-2 ${
              activeTab === 'kpi'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'
            }`}
          >
            KPI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payroll')}
            className={`py-3 text-center text-xs transition-colors cursor-pointer w-full border-b-2 ${
              activeTab === 'payroll'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'
            }`}
          >
            Payroll
          </button>
        </div>

        {/* Modal Body Content - Clean White Background without Card Enclosures, Stable Height with min-h-0 */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-6 bg-white">
          {/* TAB 1: PROFIL */}
          {activeTab === 'profil' && (
            <div className="space-y-6">
              {/* QR Code Section with Model Level Tabs (Standard | Strong) */}
              <div className="flex justify-center items-center py-1">
                <SoftQRCode
                  ref={qrRef}
                  hideInlineActions={true}
                  onActionsChange={setQrActions}
                  employeeId={employee.employeeId || employee.id}
                  nik={employee.nik}
                  employeeName={employee.fullName}
                  logoUrl={company?.logoUrl || '/icon.svg'}
                  size={220}
                  onCloseModal={onClose}
                />
              </div>

              {/* Info Posisi & 4 Card Struktur: Kategori | Level, Departemen | Divisi */}
              <div className="space-y-3 pt-1">
                {/* Nama Posisi (Bold tanpa judul kecil) */}
                <div className="text-base font-bold text-slate-900 leading-snug">
                  {positionDisplay}
                </div>

                {/* 4 Card Putih dengan Outline Tipis */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Card 1: Kategori */}
                  <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs">
                    <span className="text-[11px] font-medium text-slate-400 block">Kategori</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1 leading-snug">
                      {categoryDisplay}
                    </span>
                  </div>

                  {/* Card 2: Level */}
                  <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs">
                    <span className="text-[11px] font-medium text-slate-400 block">Level</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1 leading-snug">
                      {levelDisplay}
                    </span>
                  </div>

                  {/* Card 3: Departemen */}
                  <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs">
                    <span className="text-[11px] font-medium text-slate-400 block">Departemen</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1 leading-snug">
                      {departmentDisplay}
                    </span>
                  </div>

                  {/* Card 4: Divisi */}
                  <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs">
                    <span className="text-[11px] font-medium text-slate-400 block">Divisi</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1 leading-snug">
                      {divisionDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAIL (STATIC TEXT VIEW MODE - FLAT CLEAN WITHOUT CARDS) */}
          {activeTab === 'detail' && (
            <div className="space-y-6">
              {/* 1. Informasi Pribadi */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-xs border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Informasi Pribadi</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Lengkap</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Panggilan</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.nickname || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">NIK e-KTP</span>
                    <span className="text-sm font-normal text-slate-900 font-mono block mt-0.5">{employee.nik || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tempat, Tgl Lahir</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.birthPlace || '-'}{employee.birthDate ? `, ${employee.birthDate}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jenis Kelamin</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.gender === 'Male' ? 'Laki-Laki' : 'Perempuan'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Pernikahan</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.maritalStatus || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jumlah Tanggungan</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.dependents ?? 0} Orang</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">No. Telepon / HP</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kontak Darurat</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.emergencyContactName || employee.emergencyContact || '-'}{' '}
                      {employee.emergencyContactPhone ? `(${employee.emergencyContactPhone})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Alamat & Domisili */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-xs border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Alamat &amp; Domisili</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Alamat Jalan</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.address || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">RT / RW</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.rt ? `RT ${employee.rt}` : '-'} / {employee.rw ? `RW ${employee.rw}` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kelurahan / Kecamatan</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.village || '-'} / {employee.district || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kota / Provinsi</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.city || '-'}, {employee.province || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kode Pos &amp; Status Tinggal</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.postalCode || '-'} • {employee.residenceStatus || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Kepegawaian & Status Kerja */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-xs border-b border-slate-100 pb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Kepegawaian &amp; Kerja</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">ID Karyawan</span>
                    <span className="text-sm font-normal text-slate-900 font-mono block mt-0.5">{employee.employeeId || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Karyawan</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.status || 'Active'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tipe Kontrak</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.contractType || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tanggal Bergabung</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.joinDate || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lokasi Kerja</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.workLocation || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Shift Kerja</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">{employee.shift || '-'}</span>
                  </div>
                </div>
              </div>

              {/* 4. Rekening Bank & Penggajian */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-xs border-b border-slate-100 pb-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Penggajian &amp; Rekening Bank</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gaji Pokok</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      Rp {new Intl.NumberFormat('id-ID').format(employee.basicSalary || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tunjangan Tetap</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      Rp {new Intl.NumberFormat('id-ID').format(employee.fixedAllowance || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bank &amp; No. Rekening</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.bankName || 'BCA'} • {employee.bankAccount || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Atas Nama Rekening</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.bankAccountHolder || employee.fullName}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Pajak & BPJS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-xs border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Pajak &amp; BPJS</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status PTKP</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.taxProfile?.ptkpStatus || employee.taxStatus || 'TK/0'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Metode Pajak PPh 21</span>
                    <span className="text-sm font-normal text-slate-900 block mt-0.5">
                      {employee.taxProfile?.taxMethod || 'Gross'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nomor NPWP</span>
                    <span className="text-sm font-normal text-slate-900 font-mono block mt-0.5">
                      {employee.taxProfile?.npwp || employee.npwp || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">BPJS Kesehatan</span>
                    <span className="text-sm font-normal text-slate-900 font-mono block mt-0.5">
                      {employee.bpjsKesehatanProfile?.participantNumber || (typeof employee.bpjsKesehatan === 'string' ? employee.bpjsKesehatan : '-') || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">BPJS Ketenagakerjaan (KPJ)</span>
                    <span className="text-sm font-normal text-slate-900 font-mono block mt-0.5">
                      {employee.bpjsKetenagakerjaanProfile?.kpjNumber || (typeof employee.bpjsKetenagakerjaan === 'string' ? employee.bpjsKetenagakerjaan : '-') || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BERKAS */}
          {activeTab === 'berkas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-xs">
                  <Folder className="w-4 h-4 text-blue-600" />
                  <span>Daftar Berkas &amp; Dokumen Karyawan</span>
                </div>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(employee);
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
                  >
                    + Kelola Berkas
                  </button>
                )}
              </div>

              {(!employee.documents || employee.documents.length === 0) ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Belum ada berkas terlampir.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {employee.documents.map((doc, idx) => {
                    const hasUrl = Boolean(doc.url && doc.url.trim() !== '');
                    return (
                      <div key={doc.id || idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-slate-400">Nama Berkas</div>
                          <div className="text-sm font-normal text-slate-900 mt-0.5 truncate">
                            {doc.name || 'Berkas Tanpa Nama'}
                          </div>
                          {hasUrl ? (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline truncate mt-0.5 inline-flex items-center gap-1 max-w-full"
                            >
                              <span className="truncate">{doc.url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <div className="text-xs text-slate-400 mt-0.5">
                              Belum ada link
                            </div>
                          )}
                        </div>
                        {hasUrl && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Buka Link Berkas"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KPI */}
          {activeTab === 'kpi' && (
            <div className="space-y-3">
              {kpiResults.length === 0 ? (
                <div className="py-8 px-4 text-center space-y-1">
                  <Award className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-medium text-slate-700">Belum Ada Data KPI</p>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Tidak ada catatan penilaian KPI per periode untuk karyawan ini.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {kpiResults.map((kpi) => {
                    const period = kpiPeriods.find((p) => p.id === kpi.periodId);
                    return (
                      <div
                        key={kpi.id}
                        className="py-3 first:pt-0 last:pb-0 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-normal text-slate-900">
                            {period ? `${period.month} ${period.year}` : `Periode: ${kpi.periodId}`}
                          </div>
                          <div className="text-sm font-normal text-blue-600">
                            Skor: {kpi.score ?? '-'}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 font-normal flex justify-between">
                          <span>Grade: {kpi.gradeLabel || kpi.grade || 'Lulus'}</span>
                          <span>{kpi.notes || 'Penilaian Sesuai Target'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PAYROLL */}
          {activeTab === 'payroll' && (
            <div className="space-y-3">
              {payrollRecords.length === 0 ? (
                <div className="py-8 px-4 text-center space-y-1">
                  <Banknote className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-medium text-slate-700">Belum Ada Riwayat Payroll</p>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Tidak ada slip atau catatan penggajian per periode untuk karyawan ini.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {payrollRecords.map((pay) => {
                    const period = payrollPeriods.find((p) => p.id === pay.payrollPeriodId);
                    const takeHomePay = pay.netSalary ?? pay.grossSalary ?? pay.basicSalary ?? 0;
                    return (
                      <div
                        key={pay.id}
                        className="py-3 first:pt-0 last:pb-0 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-normal text-slate-900">
                            {period ? `Periode ${period.month} ${period.year}` : 'Periode Penggajian'}
                          </div>
                          <div className="text-sm font-normal text-slate-900">
                            Take Home Pay: Rp {new Intl.NumberFormat('id-ID').format(takeHomePay)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-normal pt-1">
                          <div>Gaji Pokok: Rp {new Intl.NumberFormat('id-ID').format(pay.basicSalary || 0)}</div>
                          <div>Status: {pay.status === 'Paid' ? 'Dibayar' : 'Draft'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STICKY FOOTER: ACTION BUTTONS ONLY FOR TAB 'profil' (AKUN) */}
        {activeTab === 'profil' && (
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200/90 shrink-0 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 w-full">
              {/* Tombol 1: Buka My Presensi */}
              <button
                type="button"
                onClick={() => (qrActions?.openMyPresensi ? qrActions.openMyPresensi() : qrRef.current?.openMyPresensi())}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl border border-blue-600 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                title="Buka Halaman My Presensi"
              >
                <QrCode className="w-4 h-4" />
                <span>Buka My Presensi</span>
              </button>

              {/* Tombol 2: Icon Link (Share / Copy Link) */}
              <button
                type="button"
                onClick={() => (qrActions?.share ? qrActions.share() : qrRef.current?.share())}
                className={`p-2.5 h-10 sm:h-11 w-10 sm:w-11 flex items-center justify-center rounded-xl border transition-all active:scale-95 cursor-pointer shrink-0 shadow-2xs ${
                  qrActions?.copied
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600'
                }`}
                title="Salin Tautan Presensi"
                aria-label="Salin Tautan Presensi"
              >
                {qrActions?.copied ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              {/* Tombol 3: Icon Download (Unduh Gambar QR) */}
              <button
                type="button"
                onClick={() => (qrActions?.download ? qrActions.download() : qrRef.current?.download())}
                disabled={qrActions?.isDownloading}
                className="p-2.5 h-10 sm:h-11 w-10 sm:w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-600 transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-60 shadow-2xs"
                title="Unduh Gambar QR Code"
                aria-label="Unduh Gambar QR Code"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

