import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  Sparkles,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { PromoOrder } from './types';
import { BANK_ACCOUNTS } from './promo-order-helper';
import { formatRupiah } from './utils-helper';
import { cn } from '../../utils/cn';

interface PromoOrderInvoiceProps {
  order: PromoOrder;
  onBackToPromo: () => void;
  onNewOrder?: () => void;
}

export function PromoOrderInvoice({
  order,
  onBackToPromo,
  onNewOrder
}: PromoOrderInvoiceProps) {
  const [copiedVa, setCopiedVa] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const bankInfo = BANK_ACCOUNTS[order.paymentChannel] || BANK_ACCOUNTS.bca;

  const handleCopyVa = () => {
    navigator.clipboard.writeText(order.virtualAccountNumber.replace(/-/g, '').replace(/\s+/g, ''));
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2500);
  };

  const handleResendEmail = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailResent(true);
      setTimeout(() => setEmailResent(false), 3500);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppConfirmUrl = () => {
    const text = encodeURIComponent(
      `Halo Tim Billing HRMatrix,\n\nSaya ingin konfirmasi pemesanan lisensi:\n- No Invoice: ${order.id}\n- Perusahaan: ${order.customer.companyName}\n- PIC: ${order.customer.fullName}\n- Paket: ${order.item.tierName} (${order.item.billingMode.toUpperCase()})\n- Skema: ${order.payment.paymentMethod === 'full' ? 'Tunai Lunas' : `Cicilan (DP ${order.payment.downPaymentPercent}%)`}\n- Tagihan Saat Ini: ${formatRupiah(order.payment.dueToday)}\n- Bank: ${bankInfo.name}\n\nMohon dibantu verifikasi pembayarannya. Terima kasih.`
    );
    return `https://wa.me/6281234567890?text=${text}`;
  };

  const getBillingModeLabel = (mode: string) => {
    switch (mode) {
      case 'trial': return 'Masa Uji Coba (3 Bulan)';
      case 'annual': return 'Sewa Cloud Tahunan (12 Bulan)';
      case 'whitelabel': return 'White Label (Full Customisasi / On-Premise)';
      case 'agent': return 'Dedicated Agent HR & GA Hybrid';
      default: return mode;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBackToPromo}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Paket Promo</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak / Simpan PDF</span>
          </button>

          {onNewOrder && (
            <button
              type="button"
              onClick={onNewOrder}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <span>+ Buat Pesanan Lain</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Automated Email Success Banner */}
      <div className="bg-linear-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3 print:hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                Invoice Resmi Otomatis Terbit
              </span>
              <span className="text-xs text-slate-500">
                {order.createdAt}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-emerald-950 mt-1">
              Invoice #{order.id} Berhasil Diterbitkan!
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
              Salinan invoice resmi berformat digital beserta rincian rekening virtual account telah <strong>otomatis dikirimkan ke email:</strong>{' '}
              <span className="underline font-bold text-emerald-950">{order.customer.email}</span>.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Terkirim otomatis ke inbox klien pada {order.invoiceEmailSentAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSendingEmail}
              onClick={handleResendEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isSendingEmail ? 'Mengirim...' : emailResent ? 'Email Terkirim Ulang!' : 'Kirim Ulang Salinan'}</span>
            </button>

            <a
              href={`mailto:${order.customer.email}?subject=Invoice%20HRMatrix%20${order.id}&body=Berikut%20tautan%20invoice%20resmi%20HRMatrix%20Anda.`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Buka Email Client</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Official Printable Invoice Paper Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200/80">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-xs">
                M
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  HRMatrix<span className="text-blue-600">.id</span>
                </span>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Cloud Human Capital & General Affairs Enterprise
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              PT MATRIX TEKNOLOGI HR INDONESIA<br />
              Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950<br />
              NPWP: 01.382.910.4-012.000 | billing@hrmatrix.id
            </p>
          </div>

          <div className="sm:text-right space-y-1.5">
            <span className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {order.payment.paymentMethod === 'full' ? 'Menunggu Pelunasan' : 'Menunggu Pembayaran DP'}
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              INVOICE #{order.id}
            </h2>
            <div className="text-xs text-slate-500 space-y-0.5">
              <div>Tanggal Terbit: <strong className="text-slate-700">{order.createdAt}</strong></div>
              <div>Jatuh Tempo: <strong className="text-red-600">{order.dueDate}</strong></div>
            </div>
          </div>
        </div>

        {/* Invoice Parties (Billed To) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-xs">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>DITAGIHKAN KEPADA (KLIEN):</span>
            </div>
            <div className="text-sm font-black text-slate-900">
              {order.customer.companyName}
            </div>
            <div className="text-slate-600">
              <strong>PIC:</strong> {order.customer.fullName} ({order.customer.role || 'Penanggung Jawab'})
            </div>
            <div className="text-slate-600">
              <strong>Email:</strong> {order.customer.email}
            </div>
            <div className="text-slate-600">
              <strong>WhatsApp:</strong> {order.customer.phone}
            </div>
            {order.customer.city && (
              <div className="text-slate-500">
                <strong>Lokasi:</strong> {order.customer.city}
              </div>
            )}
          </div>

          <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-6">
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SPESIFIKASI LAYANAN & LISENSI:</span>
            </div>
            <div className="text-sm font-black text-blue-950">
              {order.item.tierName}
            </div>
            <div className="text-slate-600">
              <strong>Model Lisensi:</strong> {getBillingModeLabel(order.item.billingMode)}
            </div>
            <div className="text-slate-600">
              <strong>Kapasitas Karyawan:</strong> s/d {order.item.headcount} Orang
            </div>
            {order.customer.subdomain && (
              <div className="text-slate-600">
                <strong>Subdomain Cloud:</strong> {order.customer.subdomain}.hrmatrix.id
              </div>
            )}
            <div className="text-slate-600">
              <strong>Jumlah Modul:</strong> {order.item.moduleIds.length} Modul Aktif
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500">
            Rincian Item Lisensi & Layanan
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Deskripsi Layanan</th>
                  <th className="py-3 px-3 text-center">Durasi / Model</th>
                  <th className="py-3 px-3 text-right">Harga Normal</th>
                  <th className="py-3 px-3 text-right">Diskon Promo</th>
                  <th className="py-3 px-4 text-right">Subtotal Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-900 text-sm">
                      {order.item.tierName}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Kapasitas {order.item.headcount} karyawan • Server Cloud Dedicated • Pelatihan intensif gratis
                    </div>
                    {order.item.moduleNames.length > 0 && (
                      <div className="text-[10px] text-slate-400 mt-1">
                        Modul: {order.item.moduleNames.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-medium text-slate-700">
                    {order.item.billingMode === 'trial' ? '3 Bulan (Trial)' :
                     order.item.billingMode === 'annual' ? '12 Bulan (Tahunan)' :
                     order.item.billingMode === 'whitelabel' ? 'Beli Putus (Perpetual)' :
                     `${order.payment.installmentMonths + 1} Bulan (Hybrid Agent)`}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-400 line-through">
                    {formatRupiah(order.payment.normalTransaction)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-emerald-600">
                    -{formatRupiah(order.payment.savingsAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                    {formatRupiah(order.payment.totalTransaction)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Scheme & Summary Calculation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Left: Schedule / Scheme breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Skema Pembayaran yang Dipilih
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
              <div className="font-extrabold text-blue-950 flex items-center justify-between">
                <span>{order.payment.schemeDescription}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] font-black uppercase">
                  {order.payment.paymentMethod === 'full' ? 'Lunas 100%' : `DP ${order.payment.downPaymentPercent}%`}
                </span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                {order.payment.paymentMethod === 'full' 
                  ? 'Pembayaran penuh di awal untuk mengaktifkan seluruh fitur server instan tanpa kewajiban angsuran bulanan.'
                  : `Pembayaran bertahap: Down Payment sebesar ${order.payment.downPaymentPercent}% dibayar hari ini, dan sisa kewajiban dicicil setiap bulan sesuai jadwal di bawah.`}
              </p>
            </div>

            {/* Installment Schedule Table */}
            {order.payment.schedule.length > 1 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  Jadwal Angsuran & Tagihan Berjangka:
                </div>
                <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3 text-left">Termin</th>
                        <th className="py-2 px-2 text-left">Jatuh Tempo</th>
                        <th className="py-2 px-3 text-right">Nominal</th>
                        <th className="py-2 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.payment.schedule.map((item) => (
                        <tr key={item.periodNumber} className={item.isInitialPayment ? 'bg-amber-50/40 font-bold' : ''}>
                          <td className="py-2 px-3 text-slate-800">
                            {item.label}
                          </td>
                          <td className="py-2 px-2 text-slate-600 text-[11px]">
                            {item.dueDate}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-900 font-black">
                            {formatRupiah(item.amount)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {item.isInitialPayment ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                                Tagihan Saat Ini
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-medium">
                                Mendatang
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right: Payment Totals Box */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Nilai Lisensi Standar:</span>
                <span>{formatRupiah(order.payment.normalTransaction)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Total Diskon Promo:</span>
                <span>-{formatRupiah(order.payment.savingsAmount)}</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-2">
                <span>Total Nilai Kontrak Bersih:</span>
                <span>{formatRupiah(order.payment.totalTransaction)}</span>
              </div>

              {order.payment.paymentMethod === 'installment' && (
                <>
                  <div className="flex justify-between text-amber-300">
                    <span>DP Awal ({order.payment.downPaymentPercent}%):</span>
                    <span>{formatRupiah(order.payment.downPaymentAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sisa Angsuran ({order.payment.installmentMonths}x cicilan):</span>
                    <span>{formatRupiah(order.payment.remainingAmount)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-1">
              <div className="text-[10px] uppercase font-black text-amber-400 tracking-wider">
                {order.payment.paymentMethod === 'full' 
                  ? 'TOTAL TAGIHAN PELUNASAN HARI INI:' 
                  : `JUMLAH DP YANG HARUS DIBAYAR HARI INI (${order.payment.downPaymentPercent}%):`}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {formatRupiah(order.payment.dueToday)}
              </div>
              <div className="text-[10px] text-slate-400">
                *Bebas biaya admin & sudah termasuk PPN 11%
              </div>
            </div>
          </div>
        </div>

        {/* Bank Transfer & Virtual Account Details */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-slate-50 to-blue-50/30 border border-blue-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                Instruksi Transfer & Rekening Resmi
              </span>
              <h4 className="text-sm font-black text-slate-900">
                {bankInfo.name} ({bankInfo.badge})
              </h4>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              A.n. {bankInfo.accountName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Nomor Virtual Account / Rekening:
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-wider">
                {order.virtualAccountNumber}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyVa}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              {copiedVa ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedVa ? 'Nomor Tersalin!' : 'Salin No. Rekening'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1 leading-relaxed">
            <p>1. Lakukan transfer sejumlah persis <strong>{formatRupiah(order.payment.dueToday)}</strong> sebelum batas jatuh tempo <strong>{order.dueDate}</strong>.</p>
            <p>2. Server akan otomatis ter-deploy dalam waktu 15 - 30 menit setelah pembayaran terverifikasi.</p>
            <p>3. Konfirmasi pembayaran instan dapat dilakukan dengan mengirim bukti transfer via WhatsApp tombol di bawah.</p>
          </div>
        </div>

        {/* WhatsApp & Footer Actions */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Butuh bantuan faktur pajak atau invoice corporate khusus? Hubungi tim finance kami.
          </div>

          <a
            href={generateWhatsAppConfirmUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>Konfirmasi Pembayaran via WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
