import React from 'react';
import { Card } from '../../components/ui';
import {
  Calculator,
  Clock,
  Activity,
  Award,
  Building2,
  Package,
  Briefcase,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionsProps {
  enableGeneralAffairs: boolean;
  enableRecruitment: boolean;
}

export function QuickActions({ enableGeneralAffairs, enableRecruitment }: QuickActionsProps) {
  return (
    <Card className="shadow-xs">
      <div className="p-3.5 sm:p-4 border-b border-slate-100">
        <h3 className="font-semibold text-sm sm:text-base text-slate-900">Aksi Cepat HR & GA</h3>
      </div>
      <div className="p-3.5 sm:p-4 space-y-2">
        <Link
          to="/payroll"
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 transition-colors group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-blue-700">
              Hitung Payroll
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
        </Link>

        <Link
          to="/presensi"
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-amber-50 hover:border-amber-100 transition-colors group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-amber-700">
              Catat Kehadiran
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
        </Link>

        <Link
          to="/kpi"
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-colors group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-indigo-700">
              Penilaian KPI
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
        </Link>

        <Link
          to="/kompensasi"
          state={{ backTo: '/' }}
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-100 transition-colors group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-emerald-700">
              Kompensasi, BPJS & Pajak
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
        </Link>

        {enableRecruitment && (
          <Link
            to="/lowongan"
            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-sky-50 hover:border-sky-100 transition-colors group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-sky-100 text-sky-600 rounded-md">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-sky-700">
                Lowongan & Pelamar ATS
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
          </Link>
        )}

        {enableGeneralAffairs && (
          <>
            <Link
              to="/ga/aset"
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-100 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-teal-100 text-teal-600 rounded-md">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-teal-700">
                  Inventaris & Aset GA
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
            </Link>

            <Link
              to="/ga/atk"
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-slate-200 text-slate-700 rounded-md">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Stok ATK & Pengadaan
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}
