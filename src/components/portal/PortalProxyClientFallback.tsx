import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { CHECKING_TOOLS_CONFIG } from '../../pages/checking-tools/checking-data';
import { PORTALS_CONFIG } from '../../pages/reports/e-portal-data';

export const PortalProxyClientFallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const portalKey = (searchParams.get('portal') || searchParams.get('tool') || '').toLowerCase();
  const customUrl = searchParams.get('url') || '';

  // Lookup in checking tools or e-portals
  const checkingTool = CHECKING_TOOLS_CONFIG[portalKey];
  const ePortal = PORTALS_CONFIG[portalKey];

  const targetName = checkingTool?.name || ePortal?.name || (portalKey ? portalKey.toUpperCase() : 'Portal Resmi');
  const targetInstansi = checkingTool?.instansi || ePortal?.instansi || 'Instansi Terkait';
  const targetUrl = checkingTool?.officialUrl || ePortal?.officialUrl || customUrl || 'https://wajiblapor.kemnaker.go.id/';
  const targetLaw = checkingTool?.dasarHukum || ePortal?.dasarHukum || 'Regulasi Ketenagakerjaan & Verifikasi Resmi Republik Indonesia';

  let displayHost = targetUrl;
  try {
    displayHost = new URL(targetUrl).hostname;
  } catch {}

  const handleOpen = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-5 animate-fade-in">
        {/* Logo / Badge */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 p-3 mx-auto flex items-center justify-center shadow-xs">
          {checkingTool?.logo || ePortal?.logo ? (
            <div className="w-10 h-10 flex items-center justify-center [&>svg]:w-9 [&>svg]:h-9 [&>img]:w-9 [&>img]:h-9">
              {checkingTool?.logo || ePortal?.logo}
            </div>
          ) : (
            <ShieldCheck className="w-9 h-9 text-blue-600" />
          )}
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <Lock className="w-3 h-3 text-blue-600" />
            Situs Resmi {targetInstansi}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {targetName}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Situs resmi ini mewajibkan koneksi autentikasi langsung atau membatasi protokol penyematan bingkai demi keamanan data.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs text-slate-600 space-y-2">
          <div className="text-[11px] text-blue-700 font-semibold leading-relaxed">
            {targetLaw}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
            <span className="font-semibold text-slate-700">Domain Resmi:</span>
            <span className="font-mono text-slate-800 text-[10px] truncate max-w-[200px]">{displayHost}</span>
          </div>
        </div>

        <div className="pt-2 space-y-2.5">
          <button
            type="button"
            onClick={handleOpen}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka Portal Resmi ({displayHost}) ↗</span>
          </button>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Aplikasi HRMatrix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
