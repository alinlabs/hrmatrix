import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Trophy 
} from 'lucide-react';
import { KPIPeriod, KPIResult, Employee, Department, Position } from './types';
import { calculateGrade } from '../../services/kpiService';
import { CardKPIEmployeeItem } from './card-kpi-employee-item';
import { ModalInputKPI } from './modal-input-kpi';
import { ModalDetailKPI } from './modal-detail-kpi';
import { KPIPeriodDetailProps } from './types';

export function KPIPeriodDetail({
  period,
  results,
  employees,
  departments,
  positions,
  templates,
  rules,
  scoringConfig,
  globalSearch = '',
  onSaveResult,
  onRefresh
}: KPIPeriodDetailProps) {
  // Modals state
  const [selectedEmployeeForInput, setSelectedEmployeeForInput] = useState<Employee | null>(null);
  const [selectedResultForInput, setSelectedResultForInput] = useState<KPIResult | null>(null);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  const [selectedResultForDetail, setSelectedResultForDetail] = useState<KPIResult | null>(null);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Department & Position Lookups
  const deptMap = useMemo(() => new Map<string, Department>(departments.map(d => [d.id, d])), [departments]);
  const posMap = useMemo(() => new Map<string, Position>(positions.map(p => [p.id, p])), [positions]);

  // Active employees for this evaluation
  const activeEmployees = useMemo(() => {
    return employees.filter(e => e.status !== 'Inactive');
  }, [employees]);

  // Results for this specific period
  const periodResults = useMemo(() => {
    return results.filter(r => r.periodId === period.id);
  }, [results, period.id]);

  const resultsByEmployeeId = useMemo(() => {
    const map = new Map<string, KPIResult>();
    for (const r of periodResults) {
      map.set(r.employeeId, r);
    }
    return map;
  }, [periodResults]);

  // Combined Employee evaluation status list
  const combinedRoster = useMemo(() => {
    return activeEmployees.map(emp => {
      const res = resultsByEmployeeId.get(emp.id) || null;
      const dept = deptMap.get(emp.departmentId);
      const pos = posMap.get(emp.positionId);
      return {
        employee: emp,
        result: res,
        isEvaluated: !!res,
        department: dept,
        position: pos
      };
    });
  }, [activeEmployees, resultsByEmployeeId, deptMap, posMap]);

  // Filtered Roster by globalSearch
  const filteredRoster = useMemo(() => {
    return combinedRoster.filter(item => {
      const q = globalSearch.toLowerCase().trim();
      if (q) {
        const name = item.employee.fullName.toLowerCase();
        const nip = item.employee.employeeId.toLowerCase();
        const dept = (item.department?.name || '').toLowerCase();
        const pos = (item.position?.name || '').toLowerCase();
        if (!name.includes(q) && !nip.includes(q) && !dept.includes(q) && !pos.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [combinedRoster, globalSearch]);

  // Metric computations
  const totalCount = activeEmployees.length;
  const evaluatedCount = combinedRoster.filter(r => r.isEvaluated).length;
  const evaluatedResults = periodResults.filter(r => r.score !== undefined);

  const avgScore = evaluatedResults.length > 0
    ? Math.round((evaluatedResults.reduce((s, r) => s + (r.score || 0), 0) / evaluatedResults.length) * 100) / 100
    : 0;

  const passedCount = evaluatedResults.filter(r => (r.score || 0) >= rules.passingScore).length;

  const gradeCounts = {
    A: evaluatedResults.filter(r => r.grade === 'A').length,
    B: evaluatedResults.filter(r => r.grade === 'B').length,
    C: evaluatedResults.filter(r => r.grade === 'C').length,
    D: evaluatedResults.filter(r => r.grade === 'D').length,
  };

  // Top scoring employee calculation
  const topEvaluated = useMemo(() => {
    if (evaluatedResults.length === 0) return null;
    const sorted = [...evaluatedResults].sort((a, b) => (b.score || 0) - (a.score || 0));
    const topRes = sorted[0];
    if (!topRes || topRes.score === undefined) return null;
    const emp = activeEmployees.find(e => e.id === topRes.employeeId);
    return {
      result: topRes,
      employee: emp
    };
  }, [evaluatedResults, activeEmployees]);

  const handleOpenInput = (emp: Employee, existingRes: KPIResult | null) => {
    setSelectedEmployeeForInput(emp);
    setSelectedResultForInput(existingRes);
    setIsInputModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* 1. Direct Grade A - D Cards */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
        <div className="bg-emerald-50/90 p-2.5 sm:p-3 rounded-xl border border-emerald-200 flex flex-col justify-center items-center shadow-2xs">
          <span className="text-xs sm:text-sm font-extrabold text-emerald-800">Grade A</span>
          <span className="text-base sm:text-xl font-black text-emerald-700 mt-0.5">{gradeCounts.A}</span>
        </div>
        <div className="bg-blue-50/90 p-2.5 sm:p-3 rounded-xl border border-blue-200 flex flex-col justify-center items-center shadow-2xs">
          <span className="text-xs sm:text-sm font-extrabold text-blue-800">Grade B</span>
          <span className="text-base sm:text-xl font-black text-blue-700 mt-0.5">{gradeCounts.B}</span>
        </div>
        <div className="bg-amber-50/90 p-2.5 sm:p-3 rounded-xl border border-amber-200 flex flex-col justify-center items-center shadow-2xs">
          <span className="text-xs sm:text-sm font-extrabold text-amber-800">Grade C</span>
          <span className="text-base sm:text-xl font-black text-amber-700 mt-0.5">{gradeCounts.C}</span>
        </div>
        <div className="bg-rose-50/90 p-2.5 sm:p-3 rounded-xl border border-rose-200 flex flex-col justify-center items-center shadow-2xs">
          <span className="text-xs sm:text-sm font-extrabold text-rose-800">Grade D</span>
          <span className="text-base sm:text-xl font-black text-rose-700 mt-0.5">{gradeCounts.D}</span>
        </div>
      </div>

      {/* 2. Monthly Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Progres Penilaian Card */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium text-slate-500">Progres Penilaian</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {evaluatedCount} <span className="text-sm font-semibold text-slate-400">/ {totalCount}</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (evaluatedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-500 shrink-0">
              {totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Average Score Card */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium text-slate-500">Rata-Rata Skor KPI</div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5">
                {avgScore}
              </div>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Passing Score: <strong>{rules.passingScore} Skor</strong>
          </div>
        </div>

        {/* Passing Rate Card */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium text-slate-500">Tingkat Kelulusan</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
                {evaluatedCount > 0 ? Math.round((passedCount / evaluatedCount) * 100) : 0}%
              </div>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {passedCount}/{evaluatedCount} Memenuhi Standar
          </div>
        </div>

        {/* KPI Tertinggi Card */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium text-slate-500">KPI Tertinggi</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">
                {topEvaluated ? topEvaluated.result.score : 0}
              </div>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-600 font-semibold mt-2 truncate max-w-[180px]" title={topEvaluated?.employee?.fullName || 'Belum ada data'}>
            {topEvaluated?.employee ? topEvaluated.employee.fullName : 'Belum Ada Data'}
          </div>
        </div>
      </div>

      {/* 3. Employee Cards List Directly After Statistics */}
      <div>
        {filteredRoster.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center text-slate-500 shadow-2xs">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">Tidak Ada Karyawan Ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian di header atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {filteredRoster.map(({ employee: emp, result, isEvaluated, department, position }) => (
              <CardKPIEmployeeItem
                key={emp.id}
                employee={emp}
                result={result}
                isEvaluated={isEvaluated}
                department={department}
                position={position}
                templates={templates}
                rules={rules}
                onClick={() => handleOpenInput(emp, result || null)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input Modal */}
      <ModalInputKPI
        isOpen={isInputModalOpen}
        onClose={() => {
          setIsInputModalOpen(false);
          setSelectedEmployeeForInput(null);
          setSelectedResultForInput(null);
        }}
        employee={selectedEmployeeForInput}
        period={period}
        existingResult={selectedResultForInput}
        templates={templates}
        rules={rules}
        scoringConfig={scoringConfig}
        department={selectedEmployeeForInput ? deptMap.get(selectedEmployeeForInput.departmentId) : undefined}
        position={selectedEmployeeForInput ? posMap.get(selectedEmployeeForInput.positionId) : undefined}
        onSave={async (newRes) => {
          await onSaveResult(newRes);
          onRefresh();
        }}
      />

      {/* Detail Modal */}
      <ModalDetailKPI
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedResultForDetail(null);
          setSelectedEmployeeForDetail(null);
        }}
        result={selectedResultForDetail}
        employee={selectedEmployeeForDetail}
        period={period}
        department={selectedEmployeeForDetail ? deptMap.get(selectedEmployeeForDetail.departmentId) : undefined}
        position={selectedEmployeeForDetail ? posMap.get(selectedEmployeeForDetail.positionId) : undefined}
        rules={rules}
        onEdit={() => {
          if (selectedEmployeeForDetail && selectedResultForDetail) {
            handleOpenInput(selectedEmployeeForDetail, selectedResultForDetail);
          }
        }}
      />
    </div>
  );
}
