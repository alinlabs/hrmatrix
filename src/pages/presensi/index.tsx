import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, BarChart3 } from 'lucide-react';
import { AttendanceConfig } from '../../types';
import { getAttendanceConfig } from '../../services/attendanceConfigService';
import { PageHeaderSubbar } from '../../context/MobileNavContext';
import { scrollToTop } from '../../components/layout/ScrollToTop';
import { PresentNow as PresensiDaily } from './presensi-daily';
import { Rekapitulasi } from './rekapitulasi';

export { PresensiDaily };
export { Rekapitulasi };

export function PresensiPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const getValidTab = (tab: string | null): 'daily' | 'rekap' => {
    if (tab === 'rekap' || tab === 'summary') return 'rekap';
    return 'daily';
  };

  const [activeTab, setActiveTab] = useState<'daily' | 'rekap'>(() => getValidTab(tabParam));
  const [hideMainTabs, setHideMainTabs] = useState(false);
  const [attendanceConfig, setAttendanceConfig] = useState<AttendanceConfig | null>(null);

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

  const handleTabChange = (tabId: 'daily' | 'rekap') => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
    setHideMainTabs(false);
    scrollToTop();
  };

  return (
    <div className="space-y-3 sm:space-y-4 transition-all duration-200">
      {/* Subbar Navigation: Daily dan Rekap */}
      {!hideMainTabs && (
        <PageHeaderSubbar>
          <div className="flex items-center justify-between w-full px-3 sm:px-8 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
            {([
              { id: 'daily' as const, label: 'Daily', icon: Clock },
              { id: 'rekap' as const, label: 'Rekap', icon: BarChart3 },
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

      {/* Main Content Views */}
      {activeTab === 'daily' && (
        <PresensiDaily 
          config={attendanceConfig} 
          onConfigSaved={loadConfig} 
          onSubViewChange={(isSubView) => setHideMainTabs(isSubView)} 
        />
      )}
      {activeTab === 'rekap' && (
        <Rekapitulasi config={attendanceConfig} />
      )}
    </div>
  );
}

export default PresensiPage;
