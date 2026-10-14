import { useState, useEffect } from 'react';
import { db } from '../db/database';

export interface AppModulesConfig {
  enableRecruitment: boolean;
  enableGeneralAffairs: boolean;
  activeEPortals: Record<string, boolean>;
}

export const HR_EPORTAL_IDS = [
  'kemenaker',
  'bpjstk',
  'edabu',
  'djp',
  'e-pp-pkb',
  'temank3',
  'tka-online',
  'karirhub',
  'pphi',
];

export const GA_EPORTAL_IDS = [
  'oss',
  'simpel',
  'festronik',
  'simbg',
  'bapenda',
];

export const ALL_EPORTAL_IDS = [...HR_EPORTAL_IDS, ...GA_EPORTAL_IDS];

export const DEFAULT_MODULES_CONFIG: AppModulesConfig = {
  enableRecruitment: true,
  enableGeneralAffairs: true,
  activeEPortals: {
    kemenaker: true,
    bpjstk: true,
    edabu: true,
    djp: true,
    'e-pp-pkb': true,
    temank3: true,
    'tka-online': true,
    karirhub: true,
    pphi: true,
    oss: true,
    simpel: true,
    festronik: true,
    simbg: true,
    bapenda: true,
  },
};

const STORAGE_KEY = 'hrmatrix_modules_config';
const EVENT_NAME = 'hrmatrix_modules_config_changed';

export function getStoredModulesConfig(): AppModulesConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_MODULES_CONFIG;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_MODULES_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      enableRecruitment: parsed.enableRecruitment !== undefined ? Boolean(parsed.enableRecruitment) : true,
      enableGeneralAffairs: parsed.enableGeneralAffairs !== undefined ? Boolean(parsed.enableGeneralAffairs) : true,
      activeEPortals: {
        ...DEFAULT_MODULES_CONFIG.activeEPortals,
        ...(parsed.activeEPortals || {}),
      },
    };
  } catch {
    return DEFAULT_MODULES_CONFIG;
  }
}

export function saveModulesConfig(config: AppModulesConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: config }));
    
    // Also save asynchronously to IndexedDB for backup
    db.settings.put({
      id: 'appModulesConfig',
      ...config,
    } as any).catch(() => {});
  } catch (err) {
    console.error('Failed to save modules configuration:', err);
  }
}

/**
 * Checks if a specific e-portal is active based on the config.
 * IMPORTANT: GA e-portals are STRICTLY inactive if enableGeneralAffairs is false!
 */
export function isEPortalActive(portalId: string, config: AppModulesConfig): boolean {
  const normalizedId = portalId.toLowerCase();

  // If this portal belongs to GA and GA module is turned off, portal is deemed disabled
  if (GA_EPORTAL_IDS.includes(normalizedId)) {
    if (!config.enableGeneralAffairs) {
      return false;
    }
  }

  return config.activeEPortals[normalizedId] !== undefined
    ? config.activeEPortals[normalizedId]
    : true;
}

export function useAppModulesConfig() {
  const [config, setConfig] = useState<AppModulesConfig>(() => getStoredModulesConfig());

  useEffect(() => {
    // Initial fetch from IndexedDB if localStorage was empty
    db.settings.get('appModulesConfig').then((stored: any) => {
      if (stored) {
        setConfig(prev => {
          const merged: AppModulesConfig = {
            enableRecruitment: stored.enableRecruitment !== undefined ? stored.enableRecruitment : prev.enableRecruitment,
            enableGeneralAffairs: stored.enableGeneralAffairs !== undefined ? stored.enableGeneralAffairs : prev.enableGeneralAffairs,
            activeEPortals: {
              ...prev.activeEPortals,
              ...(stored.activeEPortals || {}),
            },
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    }).catch(() => {});

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<AppModulesConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getStoredModulesConfig());
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setConfig(getStoredModulesConfig());
      }
    };

    window.addEventListener(EVENT_NAME, handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateConfig = (updater: (prev: AppModulesConfig) => AppModulesConfig) => {
    setConfig(prev => {
      const next = updater(prev);
      saveModulesConfig(next);
      return next;
    });
  };

  const toggleRecruitment = (value?: boolean) => {
    updateConfig(prev => ({
      ...prev,
      enableRecruitment: value !== undefined ? value : !prev.enableRecruitment,
    }));
  };

  const toggleGeneralAffairs = (value?: boolean) => {
    updateConfig(prev => ({
      ...prev,
      enableGeneralAffairs: value !== undefined ? value : !prev.enableGeneralAffairs,
    }));
  };

  const toggleEPortal = (portalId: string, value?: boolean) => {
    const normalizedId = portalId.toLowerCase();
    updateConfig(prev => {
      const current = prev.activeEPortals[normalizedId] !== undefined ? prev.activeEPortals[normalizedId] : true;
      const nextVal = value !== undefined ? value : !current;
      return {
        ...prev,
        activeEPortals: {
          ...prev.activeEPortals,
          [normalizedId]: nextVal,
        },
      };
    });
  };

  const setAllEPortals = (value: boolean, category?: 'hr' | 'ga') => {
    updateConfig(prev => {
      const updatedPortals = { ...prev.activeEPortals };
      const targets = category === 'hr' ? HR_EPORTAL_IDS : category === 'ga' ? GA_EPORTAL_IDS : ALL_EPORTAL_IDS;
      targets.forEach(id => {
        updatedPortals[id] = value;
      });
      return {
        ...prev,
        activeEPortals: updatedPortals,
      };
    });
  };

  const resetToDefaults = () => {
    saveModulesConfig(DEFAULT_MODULES_CONFIG);
    setConfig(DEFAULT_MODULES_CONFIG);
  };

  return {
    config,
    updateConfig,
    toggleRecruitment,
    toggleGeneralAffairs,
    toggleEPortal,
    setAllEPortals,
    resetToDefaults,
    isEPortalActive: (portalId: string) => isEPortalActive(portalId, config),
  };
}
