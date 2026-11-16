import React from 'react';
import {
  RotateCcw,
  Send,
  Plus,
  X,
  Save,
  FileQuestion,
  ShieldCheck,
  FileCheck2,
  Clock,
  FileText,
  CheckCircle2,
  Download,
  Eye,
  FileUp,
  Trash2,
  Upload,
} from 'lucide-react';
import { CandidateDocumentAttachment, DocumentRequirementCategory } from './types';

interface TabCandidateBerkasProps {
  vacancyTitle: string;
  uploadedCount: number;
  totalDocs: number;
  progressPercentage: number;
  verifiedCount: number;
  pendingCount: number;
  selectedFilterCategory: 'Semua' | DocumentRequirementCategory;
  setSelectedFilterCategory: (cat: 'Semua' | DocumentRequirementCategory) => void;
  isAddCustomDocOpen: boolean;
  setIsAddCustomDocOpen: (open: boolean) => void;
  customDocName: string;
  setCustomDocName: (val: string) => void;
  customDocCategory: DocumentRequirementCategory;
  setCustomDocCategory: (cat: DocumentRequirementCategory) => void;
  filteredDocuments: CandidateDocumentAttachment[];
  onSyncJobDeskDocs: () => void;
  onRequestAllPendingDocs: () => void;
  onAddCustomDocument: () => void;
  onToggleVerification: (docId: string) => void;
  onTriggerUpload: (docId: string) => void;
  onRemoveUploadedFile: (docId: string) => void;
  onRequestSingleDoc: (docId: string, docName: string) => void;
  onDeleteDocItem: (docId: string) => void;
}

export const TabCandidateBerkas: React.FC<TabCandidateBerkasProps> = ({
  vacancyTitle,
  uploadedCount,
  totalDocs,
  progressPercentage,
  verifiedCount,
  pendingCount,
  selectedFilterCategory,
  setSelectedFilterCategory,
  isAddCustomDocOpen,
  setIsAddCustomDocOpen,
  customDocName,
  setCustomDocName,
  customDocCategory,
  setCustomDocCategory,
  filteredDocuments,
  onSyncJobDeskDocs,
  onRequestAllPendingDocs,
  onAddCustomDocument,
  onToggleVerification,
  onTriggerUpload,
  onRemoveUploadedFile,
  onRequestSingleDoc,
  onDeleteDocItem,
}) => {
  return (
    <div className="space-y-5">
      {/* Job Desk Administrative Requirement Header Card */}
      <div className="p-5 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                Persyaratan Job Desk
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {vacancyTitle || 'Dokumen Persyaratan Administrasi'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Daftar berkas administratif resmi untuk posisi ini. HR dapat meminta dokumen ini ke kandidat dan memverifikasi kelengkapannya.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSyncJobDeskDocs}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sinkronkan Ulang dengan Standar Job Desk"
            >
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Sinkron Job Desk</span>
            </button>

            <button
              type="button"
              onClick={onRequestAllPendingDocs}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Request Semua Dokumen</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Kelengkapan Dokumen */}
        <div className="space-y-2 pt-2 border-t border-blue-200/60">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">
              Kelengkapan Berkas: <strong className="text-blue-700">{uploadedCount} dari {totalDocs} Dokumen Terpenuhi</strong> ({progressPercentage}%)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {verifiedCount} Terverifikasi • {pendingCount} Belum/Diminta
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200/90 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercentage === 100 
                  ? 'bg-emerald-500' 
                  : progressPercentage >= 60 
                  ? 'bg-blue-600' 
                  : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Document Button */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={() => setIsAddCustomDocOpen(true)}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-blue-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Persyaratan Tambahan</span>
        </button>
      </div>

      {/* Form Tambah Dokumen Khusus */}
      {isAddCustomDocOpen && (
        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah Persyaratan Dokumen Administratif</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddCustomDocOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700">Nama Dokumen Persyaratan</label>
              <input
                type="text"
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                placeholder="Contoh: Surat Izin Mengemudi (SIM A) / SKCK / Portofolio"
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Kategori Persyaratan</label>
              <select
                value={customDocCategory}
                onChange={(e) => setCustomDocCategory(e.target.value as DocumentRequirementCategory)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Wajib">Wajib (Mandatory)</option>
                <option value="Pendukung">Pendukung (Supporting)</option>
                <option value="Khusus">Khusus / Tambahan</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddCustomDocOpen(false)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onAddCustomDocument}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Tambahkan ke Daftar</span>
            </button>
          </div>
        </div>
      )}

      {/* List of Administrative Documents */}
      <div className="space-y-3">
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Tidak ada persyaratan dokumen pada kategori ini</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Pilih kategori lain atau klik "Tambah Persyaratan Tambahan".</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const isUploaded = !!doc.fileName || doc.status === 'Sudah Diunggah' || doc.status === 'Terverifikasi (Valid)';
            const isVerified = doc.status === 'Terverifikasi (Valid)';
            const isRequested = doc.status === 'Diminta ke Kandidat';
            const isRevision = doc.status === 'Perlu Revisi';

            return (
              <div
                key={doc.id}
                className={`p-4 bg-white border rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group ${
                  isVerified ? 'border-emerald-200 hover:border-emerald-300 bg-emerald-50/10' :
                  isUploaded ? 'border-blue-200 hover:border-blue-300' :
                  isRequested ? 'border-amber-200 bg-amber-50/10' :
                  'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Document Info Left */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                    isUploaded ? 'bg-blue-50 border-blue-200 text-blue-600' :
                    isRequested ? 'bg-amber-50 border-amber-200 text-amber-600' :
                    'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    {isVerified ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : isUploaded ? (
                      <FileCheck2 className="w-5 h-5" />
                    ) : isRequested ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {doc.name}
                      </h4>

                      {/* Requirement Category Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                        doc.category === 'Wajib' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                        doc.category === 'Pendukung' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        'bg-purple-50 border-purple-200 text-purple-700'
                      }`}>
                        {doc.category}
                      </span>

                      {/* Document Status Tag */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                        isVerified ? 'bg-emerald-100 border-emerald-300 text-emerald-800' :
                        isUploaded ? 'bg-blue-100 border-blue-300 text-blue-800' :
                        isRequested ? 'bg-amber-100 border-amber-300 text-amber-800' :
                        isRevision ? 'bg-rose-100 border-rose-300 text-rose-800' :
                        'bg-slate-100 border-slate-300 text-slate-600'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    {/* Uploaded / Requested details */}
                    {isUploaded ? (
                      <p className="text-xs text-slate-500 font-medium truncate mt-1 flex items-center gap-2">
                        <span className="font-semibold text-slate-700 truncate">{doc.fileName}</span>
                        {doc.fileSize && <span>• {doc.fileSize}</span>}
                        {doc.uploadedAt && <span>• Diunggah: {doc.uploadedAt}</span>}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                        {isRequested ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="text-amber-700">Telah diminta ke kandidat ({doc.requestedAt || 'Menunggu unggahan'})</span>
                          </>
                        ) : (
                          <span>Belum diunggah • Siap diminta ke kandidat</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                  {isUploaded ? (
                    <>
                      {/* Toggle Verification Button */}
                      <button
                        type="button"
                        onClick={() => onToggleVerification(doc.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isVerified
                            ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                            : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                        }`}
                        title={isVerified ? "Batalkan status Terverifikasi" : "Verifikasi Validitas Dokumen"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isVerified ? 'Valid' : 'Verifikasi'}</span>
                      </button>

                      {/* Preview File */}
                      {doc.fileDataUrl ? (
                        <a
                          href={doc.fileDataUrl}
                          download={doc.fileName || `${doc.name}.pdf`}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Unduh Berkas"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            alert(`Pratinjau Dokumen: ${doc.name}\nFile: ${doc.fileName || 'dokumen.pdf'}\nKategori: ${doc.category}\nStatus: ${doc.status}`);
                          }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Pratinjau Dokumen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {/* Ganti File */}
                      <button
                        type="button"
                        onClick={() => onTriggerUpload(doc.id)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Ganti File Dokumen"
                      >
                        <FileUp className="w-4 h-4" />
                      </button>

                      {/* Kosongkan File */}
                      <button
                        type="button"
                        onClick={() => onRemoveUploadedFile(doc.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Kosongkan File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Tombol Minta ke Kandidat */}
                      <button
                        type="button"
                        onClick={() => onRequestSingleDoc(doc.id, doc.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isRequested
                            ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                        }`}
                        title="Kirim notifikasi request berkas ke kandidat"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isRequested ? 'Minta Ulang' : 'Minta ke Kandidat'}</span>
                      </button>

                      {/* Tombol Langsung Unggah */}
                      <button
                        type="button"
                        onClick={() => onTriggerUpload(doc.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Unggah file langsung untuk persyaratan ini"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                      </button>

                      {/* Hapus Item Persyaratan */}
                      <button
                        type="button"
                        onClick={() => onDeleteDocItem(doc.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Persyaratan"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
