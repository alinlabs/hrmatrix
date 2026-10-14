import React from 'react';
import { 
  Pencil,
  Trash2,
  Play
} from 'lucide-react';
import { TestPackage } from './types';

interface TestPackagesViewProps {
  packages: TestPackage[];
  onSelectPackageInfo: (pkg: TestPackage) => void;
  onStartSimulation: (pkg: TestPackage) => void;
  onCustomize: (pkg: TestPackage) => void;
  onDeletePackage?: (pkgId: string) => void;
}

export const TestPackagesView: React.FC<TestPackagesViewProps> = ({
  packages,
  onSelectPackageInfo,
  onStartSimulation,
  onCustomize,
  onDeletePackage
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Grid Daftar Card Paket Soal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {packages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackageInfo(pkg)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full cursor-pointer hover:border-slate-300 group"
            >
              {/* Top Content */}
              <div className="space-y-4">
                
                {/* Title & Actions Inline Row */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCustomize(pkg);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Paket / Kustomisasi Soal"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePackage?.(pkg.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Paket Tes"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {pkg.shortDescription}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 block font-medium">Durasi Pengerjaan</span>
                    <span className="font-bold text-slate-800">{pkg.durationMinutes} Menit</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 block font-medium">Jumlah Soal</span>
                    <span className="font-bold text-slate-800">{pkg.totalQuestions} Butir Soal</span>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 block">Sasaran Posisi:</span>
                  <span className="font-medium text-slate-700 text-xs mt-0.5 line-clamp-1">
                    {pkg.targetAudience}
                  </span>
                </div>

              </div>

              {/* Bottom Action Footer (Hanya Simulasi Tes) */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartSimulation(pkg);
                  }}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Simulasi Tes</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
