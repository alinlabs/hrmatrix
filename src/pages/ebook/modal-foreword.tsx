import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

interface ModalForewordProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalForeword({ isOpen, onClose }: ModalForewordProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      contentClassName="sm:max-w-xl"
    >
      {/* Header Modal */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-normal text-slate-500 block leading-tight">
              E-Book Human Resource Matrix
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate mt-0.5">
              Kata Pengantar Penulis
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          title="Tutup"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Modal / Bottom Sheet */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[75vh]">
        {/* Highlight Quote Box */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900 text-xs sm:text-xs font-medium italic leading-relaxed">
          &ldquo;Transformasi Human Resource dari sekadar fungsi administratif operasional menuju pilar arsitektur strategis bisnis berbasis metrik presisi, kepatuhan regulasi, dan keberdayaan talenta manusia.&rdquo;
        </div>

        <p className="text-justify leading-relaxed">
          Puji dan syukur kita panjatkan kepada Tuhan Yang Maha Esa atas tersusunnya <strong>E-Book Human Resource Matrix</strong> ini sebagai panduan komprehensif dan aplikatif dalam tata kelola manajemen sumber daya manusia modern di Indonesia.
        </p>

        <p className="text-justify leading-relaxed">
          Dunia industri dan ketenagakerjaan saat ini bergerak dengan akselerasi yang sangat dinamis. Praktisi HR tidak lagi hanya dituntut mengelola berkas administrasi rutin, melainkan harus berdiri tegak sebagai <em>Strategic Business Partner</em>. Setiap keputusan organisasi mulai dari struktur hierarki, presensi, skema remunerasi dan pajak PPh 21, penetapan KPI kuantitatif, hingga manajemen hubungan industrial harus didasarkan pada landasan hukum yang kokoh serta kalkulasi metrik yang akurat dan transparan.
        </p>

        <p className="text-justify leading-relaxed">
          Buku panduan digital ini dirancang khusus untuk menjembatani teori manajemen SDM dengan regulasi ketenagakerjaan Indonesia yang berlaku saat ini (seperti UU Cipta Kerja, PP 35/2021, PP 36/2021, skema TER PMK 168/2023, hingga ketentuan BPJS Ketenagakerjaan &amp; Kesehatan), sekaligus terintegrasi langsung dengan logika sistem komputasi pada platform HRMatrix.
        </p>

        <p className="text-justify leading-relaxed">
          Tersusun dalam 12 bab tematik yang dilengkapi bedah rumus matematis, studi kasus operasional riil, dan glosarium istilah profesional, e-book ini diharapkan mampu menjadi sahabat belajar serta referensi meja kerja yang praktis bagi para praktisi HR, pemilik bisnis (entrepreneur), manajer lini, akademisi, maupun mahasiswa.
        </p>

        <p className="text-justify leading-relaxed">
          Apresiasi dan terima kasih mendalam saya haturkan kepada seluruh rekan sejawat, tim pengembang, dan komunitas praktisi HR yang telah memberikan masukan berharga demi kesempurnaan materi ini. Semoga kehadiran karya ini membawa kontribusi nyata dalam meningkatkan kualitas tata kelola sumber daya manusia di tanah air.
        </p>

        {/* Signature Block */}
        <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col items-end text-right">
          <span className="text-xs text-slate-500 font-medium">Purwakarta, Jawa Barat</span>
          <span className="text-xs text-slate-500 mt-0.5">Salam hangat dan sukses selalu,</span>
          <div className="mt-3">
            <p className="font-bold text-slate-900 text-sm">Alvareza Hilka Pratama</p>
            <p className="text-[11px] text-slate-500 font-medium">Penulis &amp; Praktisi Human Resource</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
