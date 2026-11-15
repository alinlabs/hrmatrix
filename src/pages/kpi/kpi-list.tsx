import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { 
  ensureKPIRulesAndTemplates, 
  DEFAULT_KPI_RULES, 
  ensureKPIPeriods, 
  createKPIPeriod 
} from '../../services/kpiService';
import { KPIRuleConfig, KPIResult, Employee, KPIPeriod, KPIScoringAssistantConfig, KPIScoringInputType, KPIGradeStrategy, KPIViewMode } from './types';
import { KPIHeader } from './kpi-header';
import { KPIPeriodCardView } from './kpi-period-card-view';
import { KPIPeriodDetail } from './kpi-period-detail';
import { KPIConfigurationPage } from './kpi-configuration';
import { ModalCreatePeriod as ModalCreateKPIPeriod } from './modal-create-period';
import { ModalScoringAssistant as ModalKPIScoringAssistant } from './modal-scoring-assistant';
import { calculateGrade, calculateEmployeeAttendanceScore } from '../../services/kpiService';
import { useCompany } from '../../context/CompanyContext';
import { useMobileNav } from '../../context/MobileNavContext';
import { scrollToTop } from '../../components/layout/ScrollToTop';


export function KPIList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requireCompanyRegistration } = useCompany();
  const { setHideBottomNav } = useMobileNav();
  const [viewMode, setViewMode] = useState<KPIViewMode>(() => {
    return searchParams.get('view') === 'config' ? 'config' : 'periods';
  });
  const [selectedPeriod, setSelectedPeriod] = useState<KPIPeriod | null>(null);
  const [isCreatePeriodOpen, setIsCreatePeriodOpen] = useState(false);
  const [isScoringAssistantOpen, setIsScoringAssistantOpen] = useState(false);
  const [scoringConfig, setScoringConfig] = useState<KPIScoringAssistantConfig>(() => {
    const savedMode = localStorage.getItem('kpi_scoring_mode') as KPIScoringInputType;
    const savedStrategy = localStorage.getItem('kpi_grade_strategy') as KPIGradeStrategy;
    return {
      inputType: savedMode || 'MANUAL',
      gradeStrategy: savedStrategy || 'MAX'
    };
  });
  const [search, setSearch] = useState('');
  const [rulesConfig, setRulesConfig] = useState<KPIRuleConfig>(DEFAULT_KPI_RULES);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Reset scroll ke atas saat berpindah mode tampilan atau periode KPI
  useEffect(() => {
    scrollToTop(false);
  }, [viewMode, selectedPeriod]);

  // Hide mobile bottom navigation when inside KPI Detail or Config page
  useEffect(() => {
    if (viewMode === 'detail' || viewMode === 'config') {
      setHideBottomNav(true);
    } else {
      setHideBottomNav(false);
    }
    return () => {
      setHideBottomNav(false);
    };
  }, [viewMode, setHideBottomNav]);

  // Sync viewMode if searchParams change
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'config') {
      setViewMode('config');
      setSelectedPeriod(null);
    } else if (!view || view === 'periods') {
      setViewMode('periods');
      setSelectedPeriod(null);
    }
  }, [searchParams]);

  // Initialize default rules, templates, and periods
  useEffect(() => {
    let isMounted = true;
    async function initData() {
      try {
        const { rules } = await ensureKPIRulesAndTemplates();
        await ensureKPIPeriods();
        if (isMounted && rules) {
          setRulesConfig(rules);
        }
      } catch (err) {
        console.error('Failed to initialize KPI data:', err);
      }
    }
    initData();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  // Live queries from IndexedDB
  const periods = useLiveQuery(
    () => db.kpiPeriods.toArray().then(items => items.sort((a, b) => b.startDate.localeCompare(a.startDate))),
    [refreshTrigger]
  ) || [];

  const employees = useLiveQuery(() => db.employees.toArray(), [refreshTrigger]) || [];
  const departments = useLiveQuery(() => db.departments.toArray(), [refreshTrigger]) || [];
  const positions = useLiveQuery(() => db.positions.toArray(), [refreshTrigger]) || [];
  const templates = useLiveQuery(() => db.kpiTemplates.toArray(), [refreshTrigger]) || [];
  const kpiResults = useLiveQuery(() => db.kpiResults.toArray(), [refreshTrigger]) || [];

  // If a selected period is deleted or changed, sync it
  useEffect(() => {
    if (selectedPeriod && periods.length > 0) {
      const found = periods.find(p => p.id === selectedPeriod.id);
      if (found) {
        setSelectedPeriod(found);
      }
    }
  }, [periods, selectedPeriod]);

  // Filter periods based on search
  const filteredPeriods = useMemo(() => {
    if (!search.trim()) return periods;
    const q = search.toLowerCase().trim();
    return periods.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.month.toLowerCase().includes(q) || 
      String(p.year).includes(q)
    );
  }, [periods, search]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreatePeriod = async (name: string, startDate: string, endDate: string) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Daftarkan profil perusahaan Anda untuk membuat periode evaluasi KPI baru.'
    })) {
      return;
    }

    const created = await createKPIPeriod(name, startDate, endDate);
    handleRefresh();
    setSelectedPeriod(created);
    setViewMode('detail');
  };

  const handleDeletePeriod = async (periodId: string, periodName: string) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Daftarkan profil perusahaan Anda untuk menghapus periode evaluasi.'
    })) {
      return;
    }

    if (confirm(`Hapus periode "${periodName}" beserta seluruh catatan penilaiannya?`)) {
      await db.kpiPeriods.delete(periodId);
      // Clean up results for this period
      const toDelete = await db.kpiResults.where('periodId').equals(periodId).toArray();
      for (const res of toDelete) {
        await db.kpiResults.delete(res.id);
      }
      if (selectedPeriod?.id === periodId) {
        setSelectedPeriod(null);
        setViewMode('periods');
      }
      handleRefresh();
    }
  };

  const handleSaveResult = async (result: KPIResult) => {
    await db.kpiResults.put(result);
    handleRefresh();
  };

  const handleDeleteResult = async (id: string) => {
    await db.kpiResults.delete(id);
    handleRefresh();
  };

  const handleSelectPeriod = (period: KPIPeriod) => {
    setSelectedPeriod(period);
    setViewMode('detail');
  };

  // Pending and total count for scoring assistant in selected period
  const pendingEmployeeCount = useMemo(() => {
    if (!selectedPeriod) return 0;
    const periodResults = kpiResults.filter(r => r.periodId === selectedPeriod.id);
    const evaluatedIds = new Set(periodResults.map(r => r.employeeId));
    return employees.filter(e => !evaluatedIds.has(e.id)).length;
  }, [selectedPeriod, kpiResults, employees]);

  const handleAutoFillAverage = async (targetScore: number) => {
    if (!selectedPeriod) return;
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Daftarkan profil perusahaan Anda untuk menggunakan fitur kalkulasi otomatis.'
    })) {
      return;
    }

    const activeGeneralTemplates = templates.filter(
      t => t.category === 'Umum' || t.isGeneral || !t.category
    );
    const periodResults = kpiResults.filter(r => r.periodId === selectedPeriod.id);
    const evaluatedIds = new Set(periodResults.map(r => r.employeeId));
    const unevaluated = employees.filter(e => !evaluatedIds.has(e.id));

    if (unevaluated.length === 0) {
      alert('Semua karyawan sudah dinilai pada periode ini.');
      return;
    }

    for (const emp of unevaluated) {
      const defaultItems = activeGeneralTemplates.map(t => {
        const w = t.weight || 20;
        const weighted = Math.round((targetScore * w) / 100);
        return {
          templateId: t.id,
          kpiName: t.name,
          category: t.category || 'Umum',
          weight: w,
          unit: 'Skor',
          target: 100,
          actual: targetScore,
          score: targetScore,
          weightedScore: weighted
        };
      });

      const totWeight = defaultItems.reduce((s, i) => s + i.weight, 0);
      const totScore = totWeight > 0
        ? Math.round(defaultItems.reduce((s, i) => s + i.weightedScore, 0) * (100 / totWeight))
        : targetScore;

      const gr = calculateGrade(totScore, rulesConfig.grades);

      const newRes: KPIResult = {
        id: `kpi-${emp.id}-${selectedPeriod.id}`,
        employeeId: emp.id,
        periodId: selectedPeriod.id,
        items: defaultItems,
        score: totScore,
        grade: gr.grade,
        gradeLabel: gr.label,
        evaluatorId: 'Asisten Penilai',
        notes: `Diisi otomatis dengan skor acuan ${targetScore} Skor.`,
        evaluatedAt: new Date().toISOString().split('T')[0]
      };

      await db.kpiResults.put(newRes);
    }

    handleRefresh();
    alert(`Berhasil menerapkan skor rata-rata ${targetScore} Skor ke ${unevaluated.length} karyawan.`);
  };

  const handleAutoSyncAttendance = async () => {
    if (!selectedPeriod) return;
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Daftarkan profil perusahaan Anda untuk menyinkronkan data kehadiran.'
    })) {
      return;
    }

    const activeGeneralTemplates = templates.filter(
      t => t.category === 'Umum' || t.isGeneral || !t.category
    );
    const periodResults = kpiResults.filter(r => r.periodId === selectedPeriod.id);
    const resultMap = new Map(periodResults.map(r => [r.employeeId, r]));

    let updatedCount = 0;
    for (const emp of employees) {
      const existing = resultMap.get(emp.id);
      const attScore = await calculateEmployeeAttendanceScore(emp.id, selectedPeriod.startDate, selectedPeriod.endDate);

      if (!existing) {
        const defaultItems = activeGeneralTemplates.map(t => {
          const isAtt = t.name.toLowerCase().includes('hadir') || t.name.toLowerCase().includes('absensi') || t.name.toLowerCase().includes('disiplin');
          const scoreVal = isAtt ? attScore.score : 85;
          const w = t.weight || 20;
          const weighted = Math.round((scoreVal * w) / 100);
          return {
            templateId: t.id,
            kpiName: t.name,
            category: t.category || 'Umum',
            weight: w,
            unit: 'Skor',
            target: 100,
            actual: scoreVal,
            score: scoreVal,
            weightedScore: weighted
          };
        });

        const totWeight = defaultItems.reduce((s, i) => s + i.weight, 0);
        const totScore = totWeight > 0
          ? Math.round(defaultItems.reduce((s, i) => s + i.weightedScore, 0) * (100 / totWeight))
          : 0;

        const gr = calculateGrade(totScore, rulesConfig.grades);

        const newRes: KPIResult = {
          id: `kpi-${emp.id}-${selectedPeriod.id}`,
          employeeId: emp.id,
          periodId: selectedPeriod.id,
          items: defaultItems,
          score: totScore,
          grade: gr.grade,
          gradeLabel: gr.label,
          evaluatorId: 'HR Auto-Sync',
          notes: `Evaluasi diinisialisasi otomatis dengan skor kehadiran ${attScore.score} Skor.`,
          evaluatedAt: new Date().toISOString().split('T')[0]
        };

        await db.kpiResults.put(newRes);
        updatedCount++;
      } else {
        const updatedItems = (existing.items || []).map(i => {
          const isAtt = i.kpiName.toLowerCase().includes('hadir') || i.kpiName.toLowerCase().includes('absensi') || i.kpiName.toLowerCase().includes('disiplin');
          if (!isAtt) return i;

          const scoreVal = attScore.score;
          const weighted = Math.round((scoreVal * (i.weight || 20)) / 100);
          return {
            ...i,
            actual: scoreVal,
            score: scoreVal,
            weightedScore: weighted
          };
        });

        const totWeight = updatedItems.reduce((s, i) => s + i.weight, 0);
        const totScore = totWeight > 0
          ? Math.round(updatedItems.reduce((s, i) => s + i.weightedScore, 0) * (100 / totWeight))
          : 0;

        const gr = calculateGrade(totScore, rulesConfig.grades);

        const updatedRes: KPIResult = {
          ...existing,
          items: updatedItems,
          score: totScore,
          grade: gr.grade,
          gradeLabel: gr.label,
          evaluatedAt: new Date().toISOString().split('T')[0]
        };

        await db.kpiResults.put(updatedRes);
        updatedCount++;
      }
    }

    handleRefresh();
    alert(`Berhasil menyinkronkan data kehadiran absensi untuk ${updatedCount} karyawan.`);
  };

  const handleSaveScoringConfig = (newCfg: KPIScoringAssistantConfig) => {
    setScoringConfig(newCfg);
    localStorage.setItem('kpi_scoring_mode', newCfg.inputType);
    localStorage.setItem('kpi_grade_strategy', newCfg.gradeStrategy);
  };

  // Determine Title and Subtitle for Header
  const headerTitle = useMemo(() => {
    if (viewMode === 'config') return 'Konfigurasi & Aturan KPI';
    if (viewMode === 'detail' && selectedPeriod) return selectedPeriod.name;
    return 'Halaman KPI';
  }, [viewMode, selectedPeriod]);

  const headerSubtitle = useMemo(() => {
    if (viewMode === 'config') return 'Aturan & Matriks Penilaian KPI';
    if (viewMode === 'detail' && selectedPeriod) return 'Detail Evaluasi Kinerja Karyawan';
    return 'Daftar Periode KPI Karyawan';
  }, [viewMode, selectedPeriod]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 
        Header KPI Module
        - Tidak ada tab di halaman utama
        - Di samping kiri icon setting terdapat icon buku untuk Katalog KPI Umum
        - Icon setting untuk masuk ke Konfigurasi Aturan Penilaian KPI
        - Icon lampu di paling kanan halaman detail KPI untuk asisten penilaian
      */}
      <KPIHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        onBack={
          viewMode === 'detail' || viewMode === 'config'
            ? () => {
                setViewMode('periods');
                setSelectedPeriod(null);
                if (searchParams.get('view')) {
                  navigate('/kpi', { replace: true });
                }
              }
            : undefined
        }
        search={search}
        onSearchChange={setSearch}
        onOpenGeneralCatalog={() => navigate('/kpi/katalog-umum')}
        onOpenSettings={() => setViewMode('config')}
        onAddPeriod={() => setIsCreatePeriodOpen(true)}
        showAddPeriod={viewMode === 'periods'}
        showSettings={viewMode === 'periods'}
        showGeneralCatalog={viewMode === 'periods'}
        showSearch={viewMode !== 'config'}
        showLightbulb={viewMode === 'detail'}
        onOpenLightbulb={() => setIsScoringAssistantOpen(true)}
        searchPlaceholder={viewMode === 'detail' ? 'Cari nama karyawan / NIP...' : 'Cari periode KPI...'}
      />

      {/* 
        Main View Modes (Mirip Payroll, perbulan di-update)
      */}
      {viewMode === 'config' ? (
        <KPIConfigurationPage
          rules={rulesConfig}
          onBack={() => {
            setViewMode('periods');
            setSelectedPeriod(null);
            if (searchParams.get('view')) {
              navigate('/kpi', { replace: true });
            }
          }}
          onRefresh={handleRefresh}
        />
      ) : viewMode === 'detail' && selectedPeriod ? (
        <KPIPeriodDetail
          period={selectedPeriod}
          periods={periods}
          results={kpiResults}
          employees={employees}
          departments={departments}
          positions={positions}
          templates={templates}
          rules={rulesConfig}
          scoringConfig={scoringConfig}
          globalSearch={search}
          onBack={() => setViewMode('periods')}
          onSelectPeriod={(p) => setSelectedPeriod(p)}
          onSaveResult={handleSaveResult}
          onDeleteResult={handleDeleteResult}
          onRefresh={handleRefresh}
        />
      ) : (
        /* Periods Overview (Cards List) */
        <KPIPeriodCardView
          periods={filteredPeriods}
          results={kpiResults}
          employees={employees}
          onSelectPeriod={handleSelectPeriod}
          onDeletePeriod={handleDeletePeriod}
          onAddPeriod={() => setIsCreatePeriodOpen(true)}
          onOpenGeneralCatalog={() => navigate('/kpi/katalog-umum')}
        />
      )}

      {/* Modal Buka Periode KPI Baru */}
      <ModalCreateKPIPeriod
        isOpen={isCreatePeriodOpen}
        onClose={() => setIsCreatePeriodOpen(false)}
        onCreate={handleCreatePeriod}
      />

      {/* Modal Asisten & Pengaturan Input Penilaian KPI (Icon Lampu) */}
      <ModalKPIScoringAssistant
        isOpen={isScoringAssistantOpen}
        onClose={() => setIsScoringAssistantOpen(false)}
        config={scoringConfig}
        rules={rulesConfig}
        pendingEmployeeCount={pendingEmployeeCount}
        totalEmployeeCount={employees.length}
        onSaveConfig={handleSaveScoringConfig}
        onAutoFillAverage={handleAutoFillAverage}
        onAutoSyncAttendance={handleAutoSyncAttendance}
      />
    </div>
  );
}
