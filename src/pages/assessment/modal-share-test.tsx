import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  MessageSquare, 
  QrCode, 
  Clock, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { TestPackage } from './types';
import { Modal } from '../../components/ui/Modal';

interface ModalShareTestProps {
  testPackage: TestPackage;
  isOpen: boolean;
  onClose: () => void;
  onStartSimulation: (candidateName: string, appliedPosition: string) => void;
}

export const ModalShareTest: React.FC<ModalShareTestProps> = ({
  testPackage: pkg,
  isOpen,
  onClose,
  onStartSimulation
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [appliedPosition, setAppliedPosition] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Generate shareable URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hrmatrix.my.id';
  const queryParams = new URLSearchParams();
  queryParams.set('test', pkg.slug);
  if (candidateName.trim()) queryParams.set('name', candidateName.trim());
  if (appliedPosition.trim()) queryParams.set('pos', appliedPosition.trim());
  queryParams.set('mode', 'take');
  
  // Customization parameters from HR
  if (pkg.durationMinutes) {
    queryParams.set('dur', String(pkg.durationMinutes));
  }
  if (pkg.questions && pkg.questions.length > 0) {
    queryParams.set('qids', pkg.questions.map(q => q.id).join(','));
  }
  if (pkg.randomizePerCandidate) {
    queryParams.set('rand', '1');
  }
  if (pkg.subsetCount) {
    queryParams.set('sub', String(pkg.subsetCount));
  }

  const shareableUrl = `${origin}/assessment?${queryParams.toString()}`;

  const greetingName = candidateName.trim() || 'Bapak/Ibu/Rekan Kandidat';
  const positionText = appliedPosition.trim() ? `posisi *${appliedPosition.trim()}*` : 'tahapan rekrutmen kami';

  // Professional WhatsApp / Email Invitation Template
  const invitationMessage = `Halo ${greetingName},

Terima kasih atas partisipasi Anda dalam proses seleksi untuk ${positionText} di perusahaan kami.

Sebagai bagian dari tahapan evaluasi, kami mengundang Anda untuk menyelesaikan asesmen online:
📋 *Paket Asesmen:* ${pkg.title}
⏱ *Durasi:* ± ${pkg.durationMinutes} Menit (${pkg.totalQuestions} Soal)
🔗 *Link Pengerjaan Tes:*
${shareableUrl}

*Petunjuk Penting:*
1. Pastikan koneksi internet stabil dan gunakan perangkat (Laptop/PC/Smartphone) yang nyaman.
2. Kerjakan di ruangan yang tenang dan fokus hingga selesai.
3. Kerjakan secara mandiri dan jujur.

Semoga berhasil! Jika ada pertanyaan atau kendala teknis, silakan hubungi tim HR kami.

Salam hangat,
*Tim Rekrutmen & Talent Acquisition*`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(invitationMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch (err) {
      console.error('Failed to copy message', err);
    }
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(invitationMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-xl max-h-[92vh] flex flex-col"
    >
      <div 
        className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Bagikan Tes ke Kandidat</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{pkg.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Custom Candidate Info (Optional) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Personalisasi Undangan (Opsional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Nama Kandidat
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Contoh: Dimas Aditya"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Posisi yang Dilamar
                </label>
                <input
                  type="text"
                  value={appliedPosition}
                  onChange={(e) => setAppliedPosition(e.target.value)}
                  placeholder="Contoh: Frontend Engineer"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Tautan Pengerjaan Tes Khusus Kandidat
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* WhatsApp / Email Template Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Pesan Undangan WhatsApp / Email Siap Kirim
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>{showQr ? 'Tutup QR' : 'Tampilkan QR'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-semibold cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMessage ? 'Pesan Tersalin!' : 'Salin Pesan'}</span>
                </button>
              </div>
            </div>

            {/* QR Code Container */}
            {showQr && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-2 text-center animate-in fade-in">
                <QRCodeSVG value={shareableUrl} size={150} level="M" />
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Kandidat dapat langsung memindai QR code ini di ponsel saat wawancara on-site di kantor.
                </p>
              </div>
            )}

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {invitationMessage}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartSimulation(candidateName.trim() || 'Kandidat Uji Coba', appliedPosition.trim() || 'Pelamar Kerja');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Uji Coba Kerjakan Tes (Mode HR)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Buka WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
