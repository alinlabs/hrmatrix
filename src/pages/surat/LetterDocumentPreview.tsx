import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Building2, 
  FileText, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react';
import { OfficialLetterDocument } from './types';
import { formatIndonesianDate, formatRupiah } from './letter-templates';

interface LetterDocumentPreviewProps {
  document: OfficialLetterDocument;
  onClose?: () => void;
}

export const LetterDocumentPreview: React.FC<LetterDocumentPreviewProps> = ({
  document,
  onClose
}) => {
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const renderContentBody = () => {
    const { letterType, careerChange, warning, certificate, termination, assignment } = document;

    // 1. SK (Promosi, Demosi, Mutasi, Pengangkatan)
    if (document.category === 'SK_KEPUTUSAN' && careerChange) {
      return (
        <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
          {/* Konsiderans */}
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="font-bold w-28 shrink-0">MENIMBANG</span>
              <div className="flex-1 space-y-1.5">
                {careerChange.considerations.map((c, i) => (
                  <p key={i} className="text-justify"><span className="font-semibold">{String.fromCharCode(97 + i)}.</span> {c}</p>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-bold w-28 shrink-0">MENGINGAT</span>
              <div className="flex-1 space-y-1.5">
                {careerChange.legalReferences.map((r, i) => (
                  <p key={i} className="text-justify"><span className="font-semibold">{i + 1}.</span> {r}</p>
                ))}
              </div>
            </div>

            {careerChange.observations && careerChange.observations.length > 0 && (
              <div className="flex items-start gap-4">
                <span className="font-bold w-28 shrink-0">MEMPERHATIKAN</span>
                <div className="flex-1 space-y-1.5">
                  {careerChange.observations.map((o, i) => (
                    <p key={i} className="text-justify"><span className="font-semibold">{i + 1}.</span> {o}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Diktum Memutuskan */}
          <div className="text-center py-2">
            <h4 className="font-extrabold tracking-widest text-slate-900 uppercase">MEMUTUSKAN:</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="font-bold w-28 shrink-0">MENETAPKAN</span>
              <span className="font-semibold">:</span>
            </div>

            {/* Tabel Identitas & Perubahan */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Nama Karyawan</span>
                  <span className="font-bold text-slate-900 text-sm">{document.employee.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nomor Induk Karyawan (NIK)</span>
                  <span className="font-bold text-slate-900 text-sm">{document.employee.nik}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Posisi / Jabatan Semula</span>
                  <span className="font-medium text-slate-800">{careerChange.previousPosition}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Posisi / Jabatan Baru</span>
                  <span className="font-bold text-blue-700">{careerChange.newPosition}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Departemen / Divisi</span>
                  <span className="font-medium text-slate-800">{careerChange.newDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tanggal Berlaku Efektif</span>
                  <span className="font-bold text-slate-900">{formatIndonesianDate(careerChange.effectiveDate)}</span>
                </div>
                {careerChange.newSalary && (
                  <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">Penyesuaian Upah Pokok Baru:</span>
                    <span className="font-extrabold text-blue-700 text-sm">{formatRupiah(careerChange.newSalary)} / bulan</span>
                  </div>
                )}
              </div>
            </div>

            {/* Butir Keputusan */}
            <div className="space-y-2 pl-4">
              {careerChange.decisions.map((d, i) => {
                const words = ['PERTAMA', 'KEDUA', 'KETIGA', 'KEEMPAT', 'KELIMA'];
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-bold w-20 shrink-0">{words[i] || `KE-${i + 1}`}</span>
                    <p className="flex-1 text-justify">{d}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 2. Surat Peringatan (SP 1, SP 2, SP 3)
    if (document.category === 'PERINGATAN' && warning) {
      return (
        <div className="space-y-5 text-sm text-slate-800 leading-relaxed">
          <p>
            Surat Peringatan ini diterbitkan dan diberikan kepada:
          </p>

          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block">Nama Lengkap</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Nomor Induk Karyawan</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.nik}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Jabatan</span>
              <span className="font-semibold text-slate-800">{document.employee.positionTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Departemen</span>
              <span className="font-semibold text-slate-800">{document.employee.department}</span>
            </div>
          </div>

          <div className="space-y-3 text-justify">
            <p>
              Sehubungan dengan hasil evaluasi kedisiplinan dan laporan pengawasan internal pada tanggal <span className="font-bold">{formatIndonesianDate(warning.incidentDate)}</span>, Saudara/i telah melakukan tindakan pelanggaran berupa:
            </p>
            
            <div className="p-4 bg-amber-50/70 border-l-4 border-amber-500 text-amber-950 font-medium rounded-r-xl">
              <span className="font-bold block mb-1">Kronologi Pelanggaran:</span>
              {warning.violationDescription}
            </div>

            <p>
              Tindakan tersebut telah melanggar ketentuan yang diatur dalam <span className="font-bold">{warning.violationClauseReference}</span>.
            </p>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900">Tindakan Perbaikan yang Wajib Dilakukan:</h5>
              <p className="bg-slate-50 p-3 rounded-lg border border-slate-200">{warning.correctiveActions}</p>
            </div>

            <p>
              Surat Peringatan ini berlaku selama <span className="font-bold">6 (enam) bulan</span> terhitung sejak tanggal diterbitkan sampai dengan tanggal <span className="font-bold">{formatIndonesianDate(warning.validUntilDate)}</span>. {warning.consequences}
            </p>
          </div>
        </div>
      );
    }

    // 3. Paklaring / Keterangan Pengalaman Kerja
    if (document.category === 'KETERANGAN' && certificate) {
      return (
        <div className="space-y-5 text-sm text-slate-800 leading-relaxed text-justify">
          <p>
            Yang bertanda tangan di bawah ini mewakili Manajemen <span className="font-bold">{document.company.companyName}</span>, dengan ini menerangkan dengan sebenarnya bahwa:
          </p>

          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs grid grid-cols-2 gap-3 my-3">
            <div>
              <span className="text-slate-500 block">Nama Lengkap</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Nomor Induk Karyawan</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.nik}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Jabatan Terakhir</span>
              <span className="font-semibold text-slate-800">{certificate.lastPosition}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Departemen Terakhir</span>
              <span className="font-semibold text-slate-800">{certificate.lastDepartment}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-500 block">Masa Hubungan Kerja</span>
              <span className="font-bold text-slate-900">
                {formatIndonesianDate(certificate.employmentStartDate)} s/d {formatIndonesianDate(certificate.employmentEndDate)}
              </span>
            </div>
          </div>

          <p>
            Benar telah bekerja pada perusahaan kami terhitung sejak tanggal <span className="font-semibold">{formatIndonesianDate(certificate.employmentStartDate)}</span> sampai dengan tanggal <span className="font-semibold">{formatIndonesianDate(certificate.employmentEndDate)}</span> dengan jabatan terakhir sebagai <span className="font-bold">{certificate.lastPosition}</span>.
          </p>

          <p>
            {certificate.recommendationNote}
          </p>

          <p>
            Surat keterangan ini diterbitkan untuk dipergunakan sebagaimana mestinya dan kami mendoakan keberhasilan serta kesuksesan Saudara/i dalam karier di masa yang akan datang.
          </p>
        </div>
      );
    }

    // 4. PHK (Pemutusan Hubungan Kerja)
    if (document.category === 'PENGAKHIRAN' && termination) {
      return (
        <div className="space-y-5 text-sm text-slate-800 leading-relaxed text-justify">
          <p>
            Manajemen <span className="font-bold">{document.company.companyName}</span> memberitahukan secara resmi kepada:
          </p>

          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block">Nama Karyawan</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Nomor Induk Karyawan</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.nik}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Jabatan</span>
              <span className="font-semibold text-slate-800">{document.employee.positionTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Departemen</span>
              <span className="font-semibold text-slate-800">{document.employee.department}</span>
            </div>
          </div>

          <p>
            Sehubungan dengan pertimbangan <span className="font-semibold">{termination.terminationReason}</span>, perusahaan menetapkan pengakhiran hubungan kerja efektif per tanggal <span className="font-bold">{formatIndonesianDate(termination.effectiveDate)}</span>.
          </p>

          {/* Rincian Kompensasi / Pesangon */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 font-bold p-3 border-b border-slate-300 text-slate-900">
              Rincian Hak Kompensasi Finansial Pengakhiran Hubungan Kerja:
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between">
                <span>1. Uang Pesangon (UP):</span>
                <span className="font-semibold">{formatRupiah(termination.severancePay)}</span>
              </div>
              <div className="flex justify-between">
                <span>2. Uang Penghargaan Masa Kerja (UPMK):</span>
                <span className="font-semibold">{formatRupiah(termination.serviceAwardPay)}</span>
              </div>
              <div className="flex justify-between">
                <span>3. Uang Penggantian Hak (UPH):</span>
                <span className="font-semibold">{formatRupiah(termination.rightsCompensationPay)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-blue-800">
                <span>Total Kompensasi Diterima:</span>
                <span>{formatRupiah(termination.totalSettlement)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. Surat Tugas & Perjalanan Dinas
    if (document.category === 'PENUGASAN' && assignment) {
      return (
        <div className="space-y-5 text-sm text-slate-800 leading-relaxed text-justify">
          <p>
            Yang bertanda tangan di bawah ini memberikan penugasan dinas resmi kepada:
          </p>

          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block">Nama Lengkap</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Nomor Induk Karyawan</span>
              <span className="font-bold text-slate-900 text-sm">{document.employee.nik}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Jabatan</span>
              <span className="font-semibold text-slate-800">{document.employee.positionTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Departemen</span>
              <span className="font-semibold text-slate-800">{document.employee.department}</span>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
            <h5 className="font-bold text-blue-900 text-sm mb-2">Rincian Pelaksanaan Tugas Dinas:</h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Kota / Tujuan:</span>
                <span className="font-bold text-slate-900">{assignment.destinationCity}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Lokasi / Instansi:</span>
                <span className="font-bold text-slate-900">{assignment.destinationCompanyOrPlace}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Berangkat:</span>
                <span className="font-semibold">{formatIndonesianDate(assignment.departureDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Kembali:</span>
                <span className="font-semibold">{formatIndonesianDate(assignment.returnDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Transportasi:</span>
                <span className="font-semibold">{assignment.transportationType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Uang Harian:</span>
                <span className="font-bold text-blue-700">{formatRupiah(assignment.dailyAllowance)} / hari</span>
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <span className="text-slate-500 block">Agenda & Keperluan Tugas:</span>
              <p className="font-medium text-slate-800 mt-0.5">{assignment.purposeOfDuty}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="print:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-tight">{document.title}</h3>
            <p className="text-xs text-slate-500">{document.letterNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Printable Sheet Viewport Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center print:p-0 print:overflow-visible">
        <div 
          ref={printContainerRef}
          className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl p-8 sm:p-12 text-slate-900 border border-slate-300 print:border-none print:shadow-none print:p-8 flex flex-col justify-between"
        >
          {/* 1. KOP SURAT RESMI PERUSAHAAN */}
          <div>
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-1">
              <div className="space-y-1 max-w-xl">
                <h1 className="font-black text-xl tracking-wider text-slate-900 uppercase">
                  {document.company.companyName}
                </h1>
                <p className="text-xs text-slate-600 leading-snug">
                  {document.company.address}, {document.company.city}
                </p>
                <p className="text-xs text-slate-500">
                  Telp: {document.company.phone} · Email: {document.company.email}
                </p>
              </div>

              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center p-2 text-center shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
            {/* Garis Tipis Tambahan Kop Surat */}
            <div className="border-b border-slate-900 mb-6" />

            {/* 2. JUDUL DAN NOMOR SURAT */}
            <div className="text-center space-y-1 mb-8">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-wide uppercase underline">
                {document.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                Nomor: {document.letterNumber}
              </p>
            </div>

            {/* 3. ISI SURAT DINAMIS */}
            {renderContentBody()}
          </div>

          {/* 4. TANDA TANGAN & PENGESAHAN */}
          <div className="pt-12 mt-8 border-t border-slate-200">
            <div className="flex justify-between items-end text-xs">
              <div className="text-slate-500">
                <p>Dokumen Resmi HRMatrix System</p>
                <p>Dicetak: {formatIndonesianDate(new Date().toISOString())}</p>
              </div>

              <div className="text-center w-64 space-y-1">
                <p className="text-slate-700 font-medium">
                  {document.issuingCity}, {formatIndonesianDate(document.issuingDate)}
                </p>
                <p className="font-bold text-slate-900 uppercase text-xs">
                  {document.company.companyName}
                </p>

                {/* Stempel / TTD Box */}
                <div className="h-20 flex items-center justify-center text-slate-300 italic text-[10px]">
                  [Tanda Tangan & Cap Perusahaan]
                </div>

                <p className="font-bold text-slate-900 text-sm underline">
                  {document.signatoryName}
                </p>
                <p className="text-slate-600 font-medium">
                  {document.signatoryTitle}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
