import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  FileCheck2, 
  ShieldCheck, 
  HelpCircle, 
  Download,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Info
} from 'lucide-react';
import { PortalMeta } from './e-portal-data';

export interface PortalHandlerProps {
  portal: PortalMeta;
  onRefresh: () => void;
  onOpenInfo: () => void;
}

/**
 * Handler Khusus: Kemenaker (WLKP Online & Ketenagakerjaan)
 */
export const KemenakerPortalHandler: React.FC<PortalHandlerProps> = ({ portal, onOpenInfo }) => {
  return (
    <div className="bg-blue-50/80 border-b border-blue-200/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-blue-900">
      <div className="flex items-center gap-2">
        <span className="font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] uppercase">
          Kemenaker Handler
        </span>
        <span className="text-slate-600">
          Wajib Lapor Ketenagakerjaan Perusahaan (UU No. 7/1981) — Siapkan data karyawan aktif & PKWT/PKWTT.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Panduan Pelaporan</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Handler Khusus: BPJS Ketenagakerjaan (SIPP Online)
 */
export const BPJSTKPortalHandler: React.FC<PortalHandlerProps> = ({ portal, onOpenInfo }) => {
  return (
    <div className="bg-emerald-50/80 border-b border-emerald-200/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-emerald-900">
      <div className="flex items-center gap-2">
        <span className="font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] uppercase">
          BPJS TK Handler
        </span>
        <span className="text-slate-600">
          SIPP Online — Rekonsiliasi upah bulanan, pelaporan tenaga kerja baru & validasi program JKK, JKM, JHT, JP, JKP.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Aturan Iuran</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Handler Khusus: BPJS Kesehatan (Edabu 4.2)
 */
export const EdabuPortalHandler: React.FC<PortalHandlerProps> = ({ portal, onOpenInfo }) => {
  return (
    <div className="bg-teal-50/80 border-b border-teal-200/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-teal-900">
      <div className="flex items-center gap-2">
        <span className="font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] uppercase">
          Edabu Handler
        </span>
        <span className="text-slate-600">
          Elektronik Data Badan Usaha — Pendaftaran keluarga pekerja, mutasi gaji, dan tagihan premi 5% (4% PT + 1% Karyawan).
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Batas Gaji Maks</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Handler Khusus: DJP Online (e-Bupot 21/26)
 */
export const DJPPortalHandler: React.FC<PortalHandlerProps> = ({ portal, onOpenInfo }) => {
  return (
    <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-amber-900">
      <div className="flex items-center gap-2">
        <span className="font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] uppercase">
          DJP Pajak Handler
        </span>
        <span className="text-slate-600">
          e-Bupot 21/26 & TER PP 58/2023 — Pembuatan bukti potong 1721-A1 & pelaporan SPT Masa PPh Pasal 21.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-amber-700 hover:text-amber-900 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Skema TER PPh 21</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Handler Khusus: OSS RBA (BKPM & Perizinan Berusaha)
 */
export const OSSPortalHandler: React.FC<PortalHandlerProps> = ({ portal, onOpenInfo }) => {
  return (
    <div className="bg-indigo-50/80 border-b border-indigo-200/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-indigo-900">
      <div className="flex items-center gap-2">
        <span className="font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] uppercase">
          OSS GA Handler
        </span>
        <span className="text-slate-600">
          Online Single Submission Berbasis Risiko — Pengawasan KBLI, NIB, PB-UMKU, dan Pelaporan LKPM Triwulanan.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-indigo-700 hover:text-indigo-900 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Jadwal LKPM</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Registry Mapping Handler untuk setiap portal ID
 */
export const PORTAL_HANDLERS_REGISTRY: Record<string, React.FC<PortalHandlerProps>> = {
  kemenaker: KemenakerPortalHandler,
  bpjstk: BPJSTKPortalHandler,
  edabu: EdabuPortalHandler,
  djp: DJPPortalHandler,
  oss: OSSPortalHandler,
};

/**
 * Komponen Renderer Handler Dinamis
 */
export const DynamicPortalHandler: React.FC<PortalHandlerProps> = (props) => {
  const HandlerComponent = PORTAL_HANDLERS_REGISTRY[props.portal.id.toLowerCase()];
  if (!HandlerComponent) {
    return null;
  }
  return <HandlerComponent {...props} />;
};
