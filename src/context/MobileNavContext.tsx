import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, X, Filter } from 'lucide-react';
import { resetAllScrollLocks } from '../hooks/useScrollLock';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface MobileNavContextType {
  isCustomActionActive: boolean;
  setIsCustomActionActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  registerCustomAction: (id: string) => () => void;
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
  pageSubtitle: React.ReactNode;
  setPageSubtitle: (subtitle: React.ReactNode) => void;
  onBackClick: (() => void) | null;
  setOnBackClick: (cb: (() => void) | null) => void;
  hideHamburger: boolean;
  setHideHamburger: (hide: boolean) => void;
  hideDesktopSidebar: boolean;
  setHideDesktopSidebar: (hide: boolean) => void;
  isHeaderSearchActive: boolean;
  setIsHeaderSearchActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  hideBottomNav: boolean;
  setHideBottomNav: (hide: boolean | ((prev: boolean) => boolean)) => void;
  registerBottomNavHide: (id: string) => () => void;
}

function areReactNodesEqual(a: React.ReactNode, b: React.ReactNode): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
    return a === b;
  }
  if (React.isValidElement(a) && React.isValidElement(b)) {
    if (a.type !== b.type || a.key !== b.key) return false;
    const propsA = (a.props as Record<string, any>) || {};
    const propsB = (b.props as Record<string, any>) || {};
    const keysA = Object.keys(propsA);
    const keysB = Object.keys(propsB);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (key === 'children') {
        if (!areReactNodesEqual(propsA.children, propsB.children)) return false;
      } else if (typeof propsA[key] === 'function' && typeof propsB[key] === 'function') {
        continue;
      } else if (propsA[key] !== propsB[key]) {
        return false;
      }
    }
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => areReactNodesEqual(item, b[i]));
  }
  return false;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export const MobileNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manualCustomAction, setManualCustomAction] = useState(false);
  const [customActionTokens, setCustomActionTokens] = useState<Set<string>>(() => new Set());
  const [pageTitle, setPageTitleState] = useState<string | null>(null);
  const [pageSubtitle, setPageSubtitleState] = useState<React.ReactNode>('Human Resource Matrix');
  const [onBackClick, setOnBackClickState] = useState<(() => void) | null>(null);
  const [hideHamburger, setHideHamburgerState] = useState<boolean>(false);
  const [hideDesktopSidebar, setHideDesktopSidebarState] = useState<boolean>(false);
  const [isHeaderSearchActive, setIsHeaderSearchActiveState] = useState<boolean>(false);
  const [manualHideBottomNav, setManualHideBottomNav] = useState<boolean>(false);
  const [hideBottomNavTokens, setHideBottomNavTokens] = useState<Set<string>>(() => new Set());
  const location = useLocation();

  const registerCustomAction = useCallback((id: string) => {
    setCustomActionTokens(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    return () => {
      setCustomActionTokens(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };
  }, []);

  const setIsCustomActionActive = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setManualCustomAction(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      return prev === next ? prev : next;
    });
  }, []);

  const isCustomActionActive = useMemo(() => {
    return manualCustomAction || customActionTokens.size > 0;
  }, [manualCustomAction, customActionTokens]);

  const setPageTitle = useCallback((title: string | null) => {
    setPageTitleState(prev => prev === title ? prev : title);
  }, []);

  const setPageSubtitle = useCallback((subtitle: React.ReactNode) => {
    setPageSubtitleState(prev => areReactNodesEqual(prev, subtitle) ? prev : subtitle);
  }, []);

  const setOnBackClick = useCallback((cb: (() => void) | null) => {
    setOnBackClickState(prev => {
      if (!cb && !prev) return null;
      if (prev === cb) return prev;
      return cb;
    });
  }, []);

  const setHideHamburger = useCallback((hide: boolean) => {
    setHideHamburgerState(prev => prev === hide ? prev : hide);
  }, []);

  const setHideDesktopSidebar = useCallback((hide: boolean) => {
    setHideDesktopSidebarState(prev => prev === hide ? prev : hide);
  }, []);

  const setIsHeaderSearchActive = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setIsHeaderSearchActiveState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      return prev === next ? prev : next;
    });
  }, []);

  const registerBottomNavHide = useCallback((id: string) => {
    setHideBottomNavTokens(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    return () => {
      setHideBottomNavTokens(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };
  }, []);

  const setHideBottomNav = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setManualHideBottomNav(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      return prev === next ? prev : next;
    });
  }, []);

  const hideBottomNav = useMemo(() => {
    return manualHideBottomNav || hideBottomNavTokens.size > 0;
  }, [manualHideBottomNav, hideBottomNavTokens]);

  // Reset custom action and non-header page state when navigating to another route
  useEffect(() => {
    setManualCustomAction(false);
    setHideDesktopSidebarState(false);
    setIsHeaderSearchActiveState(false);
    setManualHideBottomNav(false);
    resetAllScrollLocks();
    document.body.removeAttribute('data-header-custom-title');
    document.body.removeAttribute('data-header-hide-hamburger');
    document.body.removeAttribute('data-hide-bottom-nav');
  }, [location.pathname]);

  const contextValue = useMemo(() => ({
    isCustomActionActive,
    setIsCustomActionActive,
    registerCustomAction,
    pageTitle,
    setPageTitle,
    pageSubtitle,
    setPageSubtitle,
    onBackClick,
    setOnBackClick,
    hideHamburger,
    setHideHamburger,
    hideDesktopSidebar,
    setHideDesktopSidebar,
    isHeaderSearchActive,
    setIsHeaderSearchActive,
    hideBottomNav,
    setHideBottomNav,
    registerBottomNavHide,
  }), [
    isCustomActionActive,
    setIsCustomActionActive,
    registerCustomAction,
    pageTitle,
    setPageTitle,
    pageSubtitle,
    setPageSubtitle,
    onBackClick,
    setOnBackClick,
    hideHamburger,
    setHideHamburger,
    hideDesktopSidebar,
    setHideDesktopSidebar,
    isHeaderSearchActive,
    setIsHeaderSearchActive,
    hideBottomNav,
    setHideBottomNav,
    registerBottomNavHide,
  ]);

  return (
    <MobileNavContext.Provider value={contextValue}>
      {children}
    </MobileNavContext.Provider>
  );
};

export const useMobileNav = (): MobileNavContextType => {
  const context = useContext(MobileNavContext);
  if (!context) {
    throw new Error('useMobileNav must be used within a MobileNavProvider');
  }
  return context;
};

/**
 * PageHeaderTitle component
 * Updates the global top header's title, subtitle, back button, and hamburger visibility via React context.
 * Guarantees a single title block rendered in AppLayout without overlapping titles or DOM portal conflicts.
 */
export const PageHeaderTitle: React.FC<{ 
  title: string; 
  subtitle?: React.ReactNode; 
  onBack?: () => void;
  hideHamburger?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
}> = ({ 
  title, 
  subtitle = 'Human Resource Matrix',
  onBack,
  hideHamburger = false,
}) => {
  const { setPageTitle, setPageSubtitle, setOnBackClick, setHideHamburger } = useMobileNav();

  const onBackRef = useRef(onBack);
  useIsomorphicLayoutEffect(() => {
    onBackRef.current = onBack;
  });

  const hasBack = Boolean(onBack);

  useIsomorphicLayoutEffect(() => {
    setPageTitle(title);
    setPageSubtitle(subtitle);
    setHideHamburger(hideHamburger);
  }, [title, subtitle, hideHamburger, setPageTitle, setPageSubtitle, setHideHamburger]);

  useIsomorphicLayoutEffect(() => {
    if (hasBack) {
      const handleBack = () => {
        onBackRef.current?.();
      };
      setOnBackClick(handleBack);
    } else {
      setOnBackClick(null);
    }

    return () => {
      setOnBackClick(null);
    };
  }, [hasBack, setOnBackClick]);

  useIsomorphicLayoutEffect(() => {
    return () => {
      setPageTitle(null);
      setPageSubtitle('Human Resource Matrix');
      setHideHamburger(false);
    };
  }, [setPageTitle, setPageSubtitle, setHideHamburger]);

  return null;
};

/**
 * DesktopHeaderActions component
 * Renders custom action buttons directly into the desktop top header
 */
export const DesktopHeaderActions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(() =>
    typeof document !== 'undefined' ? document.getElementById('desktop-header-action-portal') : null
  );

  useIsomorphicLayoutEffect(() => {
    const node = document.getElementById('desktop-header-action-portal');
    if (node && node !== targetNode) {
      setTargetNode(node);
    }
  }, [targetNode]);

  const activeNode = targetNode || (typeof document !== 'undefined' ? document.getElementById('desktop-header-action-portal') : null);
  if (!activeNode) return null;

  return createPortal(
    <div className="flex items-center gap-2 animate-in fade-in duration-150">
      {children}
    </div>,
    activeNode
  );
};

/**
 * MobileHeaderActions component
 * Renders custom action buttons directly into the mobile top header
 */
export const MobileHeaderActions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(() =>
    typeof document !== 'undefined' ? document.getElementById('mobile-header-action-portal') : null
  );

  useIsomorphicLayoutEffect(() => {
    const node = document.getElementById('mobile-header-action-portal');
    if (node && node !== targetNode) {
      setTargetNode(node);
    }
  }, [targetNode]);

  const activeNode = targetNode || (typeof document !== 'undefined' ? document.getElementById('mobile-header-action-portal') : null);
  if (!activeNode) return null;

  return createPortal(
    <div className="flex items-center gap-1 animate-in fade-in duration-150">
      {children}
    </div>,
    activeNode
  );
};

/**
 * MobileBottomBar component
 * Renders custom action buttons directly into the mobile bottom container
 * using React Portal, with automatic mount/unmount cleanup.
 */
export const MobileBottomBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { registerCustomAction } = useMobileNav();
  const [id] = useState(() => Math.random().toString(36).substring(2, 9));
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(() =>
    typeof document !== 'undefined' ? document.getElementById('mobile-bottom-action-portal') : null
  );

  useIsomorphicLayoutEffect(() => {
    const unregister = registerCustomAction(id);
    const node = document.getElementById('mobile-bottom-action-portal');
    if (node && node !== targetNode) {
      setTargetNode(node);
    }

    return () => {
      unregister();
    };
  }, [registerCustomAction, id, targetNode]);

  useEffect(() => {
    if (!targetNode) {
      const node = document.getElementById('mobile-bottom-action-portal');
      if (node) {
        setTargetNode(node);
      }
    }
  }, [targetNode]);

  const activeNode = targetNode || (typeof document !== 'undefined' ? document.getElementById('mobile-bottom-action-portal') : null);
  if (!activeNode) return null;

  return createPortal(
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-150">
      {children}
    </div>,
    activeNode
  );
};

/**
 * PageHeaderSubbar component
 * Renders an inline subbar (like custom full-width tabs) directly attached to the fixed top headers
 * on both Mobile and Desktop, guaranteeing they never scroll and are 100% full-width.
 */
export const PageHeaderSubbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileNode, setMobileNode] = useState<HTMLElement | null>(null);
  const [desktopNode, setDesktopNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMobileNode(document.getElementById('page-header-subbar-portal-mobile'));
    setDesktopNode(document.getElementById('page-header-subbar-portal-desktop'));
  }, []);

  return (
    <>
      {mobileNode && createPortal(
        <div className="w-full bg-white border-t border-slate-100 animate-in fade-in duration-150">
          {children}
        </div>,
        mobileNode
      )}
      {desktopNode && createPortal(
        <div className="w-full bg-white border-t border-slate-100 animate-in fade-in duration-150">
          {children}
        </div>,
        desktopNode
      )}
    </>
  );
};

export interface InPageSearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  targetId?: string;
  onSelect?: () => void;
}

/**
 * Utility to scroll smoothly to an in-page element and apply a brief highlight ring
 */
export const scrollToElementWithHighlight = (targetId: string) => {
  const el = document.getElementById(targetId);
  if (!el) return;

  const scrollContainer = document.getElementById('main-content-scroll');
  if (scrollContainer) {
    const elRect = el.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const scrollTop = scrollContainer.scrollTop + (elRect.top - containerRect.top) - 80;
    scrollContainer.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Visual highlight effect
  el.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50/50', 'transition-all', 'duration-500');
  setTimeout(() => {
    el.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50/50');
  }, 2000);

  // Focus if interactive
  if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON') {
    el.focus();
  } else {
    const focusable = el.querySelector<HTMLElement>('input, select, textarea, button, [tabindex="0"]');
    if (focusable) focusable.focus();
  }
};

/**
 * PageHeaderSearch component
 * Replaces all top header elements (hamburger, logo, title, actions) on both Mobile & Desktop
 * with an expanded full-width search input bar.
 * Supports:
 * 1. Type A: Live card list filtering via onSearchChange.
 * 2. Type B: In-page section popup search with smooth scroll to target elements via results prop.
 */
export const PageHeaderSearch: React.FC<{
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onClose: () => void;
  placeholder?: string;
  onFilterClick?: () => void;
  isFilterActive?: boolean;
  results?: InPageSearchResult[];
  onSelectResult?: (result: InPageSearchResult) => void;
}> = ({
  searchQuery,
  onSearchChange,
  onClose,
  placeholder = "Ketik kata kunci...",
  onFilterClick,
  isFilterActive = false,
  results,
  onSelectResult,
}) => {
  const { setIsHeaderSearchActive } = useMobileNav();
  const [mobileNode, setMobileNode] = useState<HTMLElement | null>(null);
  const [desktopNode, setDesktopNode] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsHeaderSearchActive(true);
    setMobileNode(document.getElementById('mobile-header-search-portal'));
    setDesktopNode(document.getElementById('desktop-header-search-portal'));

    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);

    return () => {
      setIsHeaderSearchActive(false);
      clearTimeout(timer);
    };
  }, [setIsHeaderSearchActive]);

  const handleResultClick = (item: InPageSearchResult) => {
    if (item.targetId) {
      scrollToElementWithHighlight(item.targetId);
    }
    if (item.onSelect) {
      item.onSelect();
    }
    if (onSelectResult) {
      onSelectResult(item);
    }
    onClose();
  };

  const hasPopupResults = results !== undefined;
  const showResultsPopup = hasPopupResults && searchQuery.trim().length > 0;

  const searchContent = (
    <div className="relative w-full flex items-center gap-2.5 sm:gap-3 py-1 animate-in fade-in duration-150">
      {/* 1. Icon Back di posisi Hamburger (Langsung di Layout Header, Tanpa Card) */}
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
        aria-label="Kembali & Tutup Pencarian"
        title="Kembali"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
      </button>

      {/* 2. Kolom Input Search Frameless (Tanpa Card & Tanpa Sub-label) */}
      <div className="relative flex-1 flex items-center min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-8 sm:h-9 p-0 text-xs sm:text-sm bg-transparent border-none outline-none ring-0 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-0"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-1"
            title="Hapus pencarian"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* 3. Icon Filter Corong di Paling Kanan (Langsung di Layout Header, Tanpa Card) */}
      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer shrink-0 relative ${
            isFilterActive
              ? 'text-blue-600 font-semibold bg-blue-50/80'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Filter Data"
          aria-label="Filter"
        >
          <Filter className="w-5 h-5" />
          {isFilterActive && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </button>
      )}

      {/* 4. Type B In-Page Search Popup Menu */}
      {showResultsPopup && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-2 max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
          {results && results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleResultClick(item)}
                className="w-full text-left p-3 hover:bg-blue-50/60 rounded-xl transition-colors cursor-pointer flex flex-col group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </span>
                  {item.category && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <span className="text-[11px] text-slate-500 font-normal mt-0.5 leading-relaxed">
                    {item.subtitle}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 font-normal">
              Tidak ditemukan bagian atau data yang cocok dengan "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileNode && createPortal(searchContent, mobileNode)}
      {desktopNode && createPortal(searchContent, desktopNode)}
    </>
  );
};

/**
 * HideBottomNav component
 * Hides the mobile bottom navigation bar while mounted.
 * Uses token-based registration so that unmounting this component (e.g., closing a Modal)
 * will NEVER re-show the bottom navigation bar if the underlying page originally had it hidden!
 */
export const HideBottomNav: React.FC<{ id?: string }> = ({ id }) => {
  const navContext = useContext(MobileNavContext);
  const tokenRef = useRef<string>(id || `hide-nav-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    if (!navContext?.registerBottomNavHide) return;
    const unregister = navContext.registerBottomNavHide(tokenRef.current);
    return () => {
      unregister();
    };
  }, [navContext?.registerBottomNavHide]);

  return null;
};


