import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';

export interface AppModulesConfig {
  enableRecruitment: boolean;
  enableGeneralAffairs: boolean;
  activeEPortals: Record<string, boolean>;
}

export const DEFAULT_APP_MODULES_CONFIG: AppModulesConfig = {
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

const GA_PORTAL_IDS = new Set(['oss', 'simpel', 'festronik', 'simbg', 'bapenda']);
const STORAGE_KEY = 'hrmatrix_app_modules_config_v1';
const CONFIG_EVENT = 'hrmatrix_modules_config_updated';

function normalizeConfig(raw?: Partial<AppModulesConfig> | null): AppModulesConfig {
  return {
    enableRecruitment: raw?.enableRecruitment !== undefined ? Boolean(raw.enableRecruitment) : true,
    enableGeneralAffairs: raw?.enableGeneralAffairs !== undefined ? Boolean(raw.enableGeneralAffairs) : true,
    activeEPortals: {
      ...DEFAULT_APP_MODULES_CONFIG.activeEPortals,
      ...(raw?.activeEPortals || {}),
    },
  };
}

export function getAppModulesConfigSync(): AppModulesConfig {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return normalizeConfig(JSON.parse(saved));
      }
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_APP_MODULES_CONFIG;
}

export async function loadAppModulesConfig(): Promise<AppModulesConfig> {
  try {
    const row = await db.settings.get('appModulesConfig');
    if (row && row.data) {
      const normalized = normalizeConfig(row.data as Partial<AppModulesConfig>);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        // Ignore
      }
      return normalized;
    }
  } catch {
    // Fallback to localStorage
  }
  return getAppModulesConfigSync();
}

export async function saveAppModulesConfig(nextConfig: AppModulesConfig): Promise<AppModulesConfig> {
  const normalized = normalizeConfig(nextConfig);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore
  }
  try {
    await db.settings.put({
      id: 'appModulesConfig',
      data: normalized,
    });
  } catch {
    // Ignore IDB write error in restricted contexts
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONFIG_EVENT, { detail: normalized }));
  }
  return normalized;
}

export function isEPortalActive(portalId: string, config?: AppModulesConfig | null): boolean {
  const cfg = config || DEFAULT_APP_MODULES_CONFIG;
  if (GA_PORTAL_IDS.has(portalId) && !cfg.enableGeneralAffairs) {
    return false;
  }
  return cfg.activeEPortals?.[portalId] !== false;
}

export function useAppModulesConfig() {
  const [config, setConfig] = useState<AppModulesConfig>(() => getAppModulesConfigSync());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    loadAppModulesConfig()
      .then((loaded) => {
        if (mounted) {
          setConfig(loaded);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<AppModulesConfig>;
      if (custom.detail && mounted) {
        setConfig(normalizeConfig(custom.detail));
      }
    };

    window.addEventListener(CONFIG_EVENT, handleSync);
    return () => {
      mounted = false;
      window.removeEventListener(CONFIG_EVENT, handleSync);
    };
  }, []);

  const updateConfig = useCallback(async (updater: AppModulesConfig | ((prev: AppModulesConfig) => AppModulesConfig)) => {
    setConfig((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const normalized = normalizeConfig(next);
      saveAppModulesConfig(normalized).catch(() => {});
      return normalized;
    });
  }, []);

  const toggleRecruitment = useCallback(
    async (enabled?: boolean) => {
      await updateConfig((prev) => ({
        ...prev,
        enableRecruitment: enabled !== undefined ? enabled : !prev.enableRecruitment,
      }));
    },
    [updateConfig]
  );

  const toggleGeneralAffairs = useCallback(
    async (enabled?: boolean) => {
      await updateConfig((prev) => ({
        ...prev,
        enableGeneralAffairs: enabled !== undefined ? enabled : !prev.enableGeneralAffairs,
      }));
    },
    [updateConfig]
  );

  const toggleEPortal = useCallback(
    async (portalId: string, enabled?: boolean) => {
      await updateConfig((prev) => ({
        ...prev,
        activeEPortals: {
          ...prev.activeEPortals,
          [portalId]: enabled !== undefined ? enabled : prev.activeEPortals?.[portalId] === false,
        },
      }));
    },
    [updateConfig]
  );

  const setAllEPortals = useCallback(
    async (enabled: boolean, category?: 'hr' | 'ga') => {
      await updateConfig((prev) => {
        const nextPortals = { ...prev.activeEPortals };
        Object.keys(DEFAULT_APP_MODULES_CONFIG.activeEPortals).forEach((key) => {
          const isGa = GA_PORTAL_IDS.has(key);
          if (!category || (category === 'ga' && isGa) || (category === 'hr' && !isGa)) {
            nextPortals[key] = enabled;
          }
        });
        return {
          ...prev,
          activeEPortals: nextPortals,
        };
      });
    },
    [updateConfig]
  );

  const resetToDefaults = useCallback(async () => {
    await updateConfig(DEFAULT_APP_MODULES_CONFIG);
  }, [updateConfig]);

  return {
    config,
    isLoading,
    updateConfig,
    toggleRecruitment,
    toggleGeneralAffairs,
    toggleEPortal,
    setAllEPortals,
    resetToDefaults,
  };
}
