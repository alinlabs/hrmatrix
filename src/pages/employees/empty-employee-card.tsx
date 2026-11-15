import React from 'react';
import { Lottie } from 'lottie-react';
import { UserPlus, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import emptyEmployeeAnimation from '../../assets/animations/empty-employees.json';

interface EmptyEmployeeCardProps {
  onAdd: () => void;
  search?: string;
  onClearSearch?: () => void;
}

export const EmptyEmployeeCard: React.FC<EmptyEmployeeCardProps> = ({
  onAdd,
  search = '',
  onClearSearch,
}) => {
  const isSearching = Boolean(search && search.trim().length > 0);

  if (isSearching) {
    return (
      <div 
        id="empty-employee-search-state"
        className="p-8 sm:p-10 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs transition-all"
      >
        <div className="w-12 h-12 mx-auto mb-3.5 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
          <RefreshCw className="w-5 h-5 text-slate-500" />
        </div>
        <h4 className="text-base font-bold text-slate-800 tracking-tight">
          Karyawan Tidak Ditemukan
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          Tidak ada data karyawan yang cocok dengan kata kunci{' '}
          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">"{search}"</span>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Reset Pencarian
            </button>
          )}
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Tambah Karyawan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="empty-employee-card-invitation"
      className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10 text-center transition-all duration-300 hover:border-slate-300"
    >
      {/* Soft Decorative Ambient Background */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Main Heading (Singkat & Hangat) */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Ayo, Mulai Bangun Team Hebat!
        </h3>

        {/* Supporting Narrative (Singkat & To-The-Point) */}
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
          Tambahkan karyawan pertama Anda untuk memulai pengelolaan data dan penggajian tim.
        </p>

        {/* Primary Interactive Call-To-Action Button (Tanpa Teks Plus Ganda) */}
        <div className="mt-5 mb-2 flex justify-center">
          <button
            type="button"
            onClick={onAdd}
            id="btn-add-first-employee"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Tambah Karyawan Pertama</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 opacity-80" />
          </button>
        </div>

        {/* Lottie Animation Display (Tepat di Bawah Ajakan) */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto -mt-2 -mb-2 flex items-center justify-center">
          <Lottie
            src={emptyEmployeeAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-full drop-shadow-xs pointer-events-none select-none"
          />
        </div>

        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
          Proses cepat & praktis • Data tersimpan aman
        </p>
      </div>
    </div>
  );
};
