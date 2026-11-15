import React from 'react';
import { Card } from '../../components/ui';
import { Calculator, Clock, Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActions() {
  return (
    <Card>
      <div className="p-3 sm:p-4 border-b border-slate-100">
        <h3 className="font-semibold text-sm sm:text-base text-slate-900">Aksi Cepat</h3>
      </div>
      <div className="p-3 sm:p-4 space-y-2">
        <Link 
          to="/payroll" 
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 transition-colors group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-blue-700">Hitung Payroll</span>
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
            <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-amber-700">Catat Kehadiran</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
        </Link>

        <Link 
          to="/kompensasi" 
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-100 transition-colors group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-emerald-700">Kompensasi & BPJS</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
        </Link>
      </div>
    </Card>
  );
}
