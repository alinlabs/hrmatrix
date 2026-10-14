import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  PhoneCall, 
  Clock, 
  FileText, 
  HelpCircle,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Scale,
  HardHat,
  Globe,
  Briefcase,
  Leaf,
  Trash2,
  Coins,
  HeartPulse,
  Activity,
  Search,
  FileSpreadsheet,
  Truck,
  Users
} from 'lucide-react';
import { PortalMeta } from './e-portal-data';
import { PORTAL_GUIDES_DATA, PortalGuideData } from './e-portal-guides';

export interface EPortalGuideProps {
  portal: PortalMeta;
  onBackToPortal: () => void;
}

export const EPortalGuide: React.FC<EPortalGuideProps> = ({
  portal,
  onBackToPortal
}) => {
  const guideData: PortalGuideData = PORTAL_GUIDES_DATA[portal.id] || PORTAL_GUIDES_DATA.kemenaker;

  // Helper for Section 1 Icon
  const renderSection1Icon = () => {
    switch (guideData.section1.icon) {
      case 'heart':
        return <HeartPulse className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'receipt':
        return <Receipt className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'scale':
        return <Scale className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'hardhat':
        return <HardHat className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'leaf':
        return <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'trash':
        return <Trash2 className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'building':
        return <Building2 className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'coins':
        return <Coins className="w-5 h-5 text-amber-600 shrink-0" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-28">
      {/* Top Floating Mini Bar for Return to Portal */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToPortal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Kembali ke Portal</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-slate-100 p-0.5 flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4 [&>img]:w-4 [&>img]:h-4">
                {portal.logo}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Panduan Laporan: {portal.shortName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200 p-2 sm:p-3 flex items-center justify-center shrink-0 shadow-xs [&>svg]:w-10 [&>svg]:h-10 [&>img]:w-10 [&>img]:h-10">
              {portal.logo}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                  portal.category === 'hr'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {portal.category === 'hr' ? 'Kepatuhan HR & Naker' : 'Kepatuhan GA & Fasilitas'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-600">
                  {portal.instansi}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Panduan Lengkap Pelaporan {portal.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {portal.deskripsi}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/90 text-blue-800 text-xs font-semibold border border-blue-200/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>HR MATRIX telah melakukan penyesuaian berdasarkan {portal.dasarHukum}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Quick Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Jadwal & Periode Lapor
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {portal.jadwal}
              </p>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Tingkat Urgensi
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {portal.urgensi}
              </p>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                Helpdesk & Call Center
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {portal.callCenter} ({portal.callCenterHours})
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Dasar Hukum & Ketentuan Kewajiban Lapor */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-blue-700">
            {renderSection1Icon()}
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {guideData.section1.title}
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
            {guideData.section1.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            {guideData.section1.bulletPoints && guideData.section1.bulletPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-1 font-medium text-slate-700 pl-2">
                {guideData.section1.bulletPoints.map((bp, bidx) => (
                  <li key={bidx}>{bp}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Table (e.g. BPJSTK) */}
          {guideData.section1.table && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    {guideData.section1.table.headers.map((h, hidx) => (
                      <th key={hidx} className="p-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {guideData.section1.table.rows.map((row, ridx) => (
                    <tr key={ridx}>
                      <td className="p-3 font-semibold text-slate-800">{row.col1}</td>
                      <td className="p-3 font-mono">{row.col2}</td>
                      <td className="p-3 font-mono">{row.col3}</td>
                      <td className="p-3 font-mono">{row.col4}</td>
                      {row.col5 && <td className="p-3 font-semibold text-slate-900">{row.col5}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SubCards if any (e.g. e-Dabu, Teman K3, SIMBG) */}
          {guideData.section1.subCards && guideData.section1.subCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {guideData.section1.subCards.map((sc, scidx) => (
                <div 
                  key={scidx} 
                  className={`p-3.5 rounded-2xl border space-y-1 ${
                    sc.variant === 'emerald'
                      ? 'bg-emerald-50 border-emerald-200/80 text-emerald-900'
                      : sc.variant === 'rose'
                      ? 'bg-rose-50 border-rose-200/80 text-rose-900'
                      : 'bg-blue-50 border-blue-200/80 text-blue-900'
                  }`}
                >
                  <span className="font-bold block">{sc.title}</span>
                  <p className="leading-relaxed opacity-90">{sc.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Alert box if any */}
          {guideData.section1.alert && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              guideData.section1.alert.variant === 'blue'
                ? 'bg-blue-50 border-blue-200/80 text-blue-900'
                : guideData.section1.alert.variant === 'emerald'
                ? 'bg-emerald-50 border-emerald-200/80 text-emerald-900'
                : guideData.section1.alert.variant === 'rose'
                ? 'bg-rose-50 border-rose-200/80 text-rose-900'
                : 'bg-amber-50 border-amber-200/80 text-amber-900'
            }`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                guideData.section1.alert.variant === 'blue'
                  ? 'text-blue-600'
                  : guideData.section1.alert.variant === 'emerald'
                  ? 'text-emerald-600'
                  : guideData.section1.alert.variant === 'rose'
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`} />
              <div className="text-xs space-y-1">
                <span className="font-bold block">{guideData.section1.alert.title}</span>
                <p className="leading-relaxed opacity-95">{guideData.section1.alert.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Checklist Berkas / Fitur / Jadwal */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-blue-700">
            <FileText className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {guideData.section2.title}
            </h2>
          </div>

          {/* Cards grid */}
          {guideData.section2.cards && guideData.section2.cards.length > 0 && (
            <div className={`grid gap-3 text-xs sm:text-sm ${
              guideData.section2.columns === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {guideData.section2.cards.map((c, cidx) => (
                <div key={cidx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {c.title}
                  </span>
                  {c.desc && (
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {c.desc}
                    </p>
                  )}
                  {c.items && c.items.length > 0 && (
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {c.items.map((item, iidx) => (
                        <li key={iidx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Notice cards (e.g. DJP, BPJSTK, OSS) */}
          {guideData.section2.noticeCards && guideData.section2.noticeCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              {guideData.section2.noticeCards.map((nc, ncidx) => (
                <div 
                  key={ncidx}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    nc.variant === 'rose'
                      ? 'bg-rose-50 border-rose-200/80 text-rose-900'
                      : nc.variant === 'amber'
                      ? 'bg-amber-50 border-amber-200/80 text-amber-900'
                      : nc.variant === 'blue'
                      ? 'bg-blue-50 border-blue-200/80 text-blue-900'
                      : 'bg-slate-50 border-slate-200/80 text-slate-900'
                  }`}
                >
                  <span className="font-bold block">{nc.title}</span>
                  {nc.desc && <p className="leading-relaxed opacity-95">{nc.desc}</p>}
                  {nc.list && nc.list.length > 0 && (
                    <ul className="space-y-1 list-disc list-inside opacity-95">
                      {nc.list.map((item, lidx) => (
                        <li key={lidx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXTRA SECTION (e.g. OSS Realisasi Investasi LKPM) */}
        {guideData.extraSection && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-blue-700">
              <Coins className="w-5 h-5" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {guideData.extraSection.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              {guideData.extraSection.cards.map((ec, ecidx) => (
                <div key={ecidx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <span className="font-bold text-slate-900 block">{ec.title}</span>
                  {ec.desc && <p className="text-slate-600 leading-relaxed">{ec.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Langkah-Langkah Pelaporan */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 text-blue-700">
            <Clock className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {guideData.section3.title}
            </h2>
          </div>

          <div className="space-y-3.5">
            {guideData.section3.steps.map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {item.step}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: FAQ & Kendala Umum */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-blue-700">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {guideData.section4.title}
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm">
            {guideData.section4.faqs.map((faq, fidx) => (
              <div key={fidx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <h4 className="font-bold text-slate-900">{faq.q}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Support Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-white">
              Siap Memulai Pelaporan ke {portal.shortName}?
            </h3>
            <p className="text-xs text-blue-200 max-w-xl">
              Pastikan berkas dan data internal perusahaan telah terverifikasi sebelum masuk ke portal resmi pemerintah.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToPortal}
            className="py-2.5 px-5 bg-white hover:bg-blue-50 active:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Kembali ke Portal
          </button>
        </div>
      </div>
    </div>
  );
};
