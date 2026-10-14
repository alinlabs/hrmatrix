import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, BarChart3, CalendarRange, CalendarDays } from 'lucide-react';
import { AttendanceConfig } from '../../../types';
import { getAttendanceConfig } from '../../../services/attendanceConfigService';
import { PageHeaderSubbar } from '../../../context/MobileNavContext';
import { scrollToTop } from '../../../components/layout/ScrollToTop';
import { PresentNow } from '../presensi';
import { Rekapitulasi } from '../rekapitulasi';
import { PengajuanCuti } from '../cuti';
import { JadwalContainer } from '../jadwal';

export function AttendanceContainer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const getValidTab = (tab: string | null): 'present' | 'schedule' | 'leave' | 'summary' => {
    if (tab === 'schedule') return 'schedule';
    if (tab === 'leave') return 'leave';
    if (tab === 'summary') return 'summary';
    return 'present';
  };

  const [activeTab, setActiveTab] = useState<'present' | 'schedule' | 'leave' | 'summary'>(() => getValidTab(tabParam));
  const [hideMainTabs, setHideMainTabs] = useState(false);
  const [attendanceConfig, setAttendanceConfig] = useState<AttendanceConfig | null>(null);

  // Synchronize tab state with URL query parameter
  useEffect(() => {
    const valid = getValidTab(tabParam);
    if (valid !== activeTab) {
      setActiveTab(valid);
    }
  }, [tabParam]);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await getAttendanceConfig();
    setAttendanceConfig(config);
  };

  const handleTabChange = (tabId: 'present' | 'schedule' | 'leave' | 'summary') => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
    setHideMainTabs(false);
    scrollToTop();
  };

  return (
    <div className="space-y-3 sm:space-y-4 transition-all duration-200">
      {/* Full-width Compact Navigation Tabs Bar - Rendered directly in Fixed Top Header via PageHeaderSubbar so it never scrolls away or disappears */}
      {!hideMainTabs && (
        <PageHeaderSubbar>
          <div className="flex items-center justify-between w-full px-3 sm:px-8 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
            {([
              { id: 'present' as const, label: 'Presensi', icon: Clock },
              { id: 'schedule' as const, label: 'Jadwal', icon: CalendarDays },
              { id: 'leave' as const, label: 'Cuti', icon: CalendarRange },
              { id: 'summary' as const, label: 'Rekap', icon: BarChart3 },
            ]).map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2 text-center shrink-0 ${
                    isActive
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                  )}
                </button>
              );
            })}
          </div>
        </PageHeaderSubbar>
      )}

      {/* Main Tab Views */}
      {activeTab === 'present' && (
        <PresentNow 
          config={attendanceConfig} 
          onConfigSaved={loadConfig} 
          onSubViewChange={(isSubView) => setHideMainTabs(isSubView)} 
        />
      )}
      {activeTab === 'schedule' && (
        <JadwalContainer 
          config={attendanceConfig} 
          onSubTabChange={(subTab) => setHideMainTabs(subTab !== 'matriks')} 
        />
      )}
      {activeTab === 'leave' && <PengajuanCuti />}
      {activeTab === 'summary' && <Rekapitulasi config={attendanceConfig} />}
    </div>
  );
}
