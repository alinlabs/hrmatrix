import React from 'react';
import { 
  CalendarRange, 
  CalendarClock, 
  ShieldCheck
} from 'lucide-react';

interface CutiDualNavProps {
  activeSubTab: 'pengajuan' | 'kuota' | 'kebijakan';
  onSelectSubTab: (tab: 'pengajuan' | 'kuota' | 'kebijakan') => void;
}

export function CutiDualNav({ activeSubTab, onSelectSubTab }: CutiDualNavProps) {
  // Konfigurasi tombol 1 dan 2 berdasarkan halaman/sub-tab yang sedang aktif
  let button1: {
    title: string;
    subtitle: string;
    targetTab: 'pengajuan' | 'kuota' | 'kebijakan';
    Icon: React.ElementType;
    colorTheme: 'blue' | 'indigo';
  };

  let button2: {
    title: string;
    subtitle: string;
    targetTab: 'pengajuan' | 'kuota' | 'kebijakan';
    Icon: React.ElementType;
    colorTheme: 'blue' | 'indigo';
  };

  if (activeSubTab === 'pengajuan') {
    // Di halaman Pengajuan Cuti -> Tampilkan Saldo Cuti | Kebijakan Cuti
    button1 = {
      title: 'Saldo Cuti',
      subtitle: 'Cek Sisa & Kuota Cuti',
      targetTab: 'kuota',
      Icon: CalendarClock,
      colorTheme: 'blue'
    };
    button2 = {
      title: 'Kebijakan Cuti',
      subtitle: 'Aturan & Master Cuti',
      targetTab: 'kebijakan',
      Icon: ShieldCheck,
      colorTheme: 'indigo'
    };
  } else if (activeSubTab === 'kuota') {
    // Di halaman Saldo Cuti -> Tampilkan Pengajuan Cuti | Kebijakan Cuti
    button1 = {
      title: 'Pengajuan Cuti',
      subtitle: 'Daftar & Form Permohonan',
      targetTab: 'pengajuan',
      Icon: CalendarRange,
      colorTheme: 'blue'
    };
    button2 = {
      title: 'Kebijakan Cuti',
      subtitle: 'Aturan & Master Cuti',
      targetTab: 'kebijakan',
      Icon: ShieldCheck,
      colorTheme: 'indigo'
    };
  } else {
    // Di halaman Kebijakan Cuti -> Tampilkan Pengajuan Cuti | Saldo Cuti
    button1 = {
      title: 'Pengajuan Cuti',
      subtitle: 'Daftar & Form Permohonan',
      targetTab: 'pengajuan',
      Icon: CalendarRange,
      colorTheme: 'blue'
    };
    button2 = {
      title: 'Saldo Cuti',
      subtitle: 'Cek Sisa & Kuota Cuti',
      targetTab: 'kuota',
      Icon: CalendarClock,
      colorTheme: 'indigo'
    };
  }

  const Btn1Icon = button1.Icon;
  const Btn2Icon = button2.Icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-2xs">
      <div className="grid grid-cols-2 divide-x divide-slate-100">
        {/* Tombol 1 */}
        <button
          type="button"
          onClick={() => onSelectSubTab(button1.targetTab)}
          className="flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-blue-700"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs shrink-0">
            <Btn1Icon className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-blue-700 transition-colors truncate">
              {button1.title}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
              {button1.subtitle}
            </div>
          </div>
        </button>

        {/* Tombol 2 */}
        <button
          type="button"
          onClick={() => onSelectSubTab(button2.targetTab)}
          className="flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-indigo-700"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs shrink-0">
            <Btn2Icon className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-indigo-700 transition-colors truncate">
              {button2.title}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
              {button2.subtitle}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
