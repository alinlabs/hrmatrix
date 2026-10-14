import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { NavMainItem, isParentItemActive, isSubItemActive } from './navigation-config';
import { PortalNavLogo } from '../e-portal/PortalLogos';

interface SidebarNavItemProps {
  item: NavMainItem;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
  currentPathname: string;
  currentSearch: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isOpen,
  onToggle,
  onItemClick,
  currentPathname,
  currentSearch
}) => {
  const isParentActive = isParentItemActive(item, currentPathname, currentSearch);

  if (item.hasDropdown && item.subItems) {
    const hasCustomLogo = item.subItems.some(s => !!s.logo);

    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'group w-full flex items-center justify-between px-4 py-2.5 mx-0 rounded-xl text-sm font-medium transition-colors cursor-pointer',
            isParentActive
              ? 'text-blue-600 font-semibold hover:bg-slate-50'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <div className="flex items-center min-w-0">
            {item.iconImg ? (
              <span className="mr-3 flex-shrink-0 h-5 w-5 rounded flex items-center justify-center overflow-hidden">
                <img
                  src={item.iconImg}
                  alt={item.name}
                  className="w-4.5 h-4.5 object-contain"
                />
              </span>
            ) : item.icon ? (
              <item.icon
                className={cn(
                  'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                  isParentActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                )}
                aria-hidden="true"
              />
            ) : null}
            <span className={cn('truncate', isParentActive ? 'text-blue-600 font-semibold' : '')}>
              {item.name}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 shrink-0 transition-transform duration-200 ml-2',
              isOpen ? 'rotate-180' : '',
              isParentActive || isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            )}
          />
        </button>

        {/* Collapsible Sub-items with vertical line or branded logos */}
        <div
          className={cn(
            'grid transition-all duration-200 ease-in-out overflow-hidden',
            isOpen ? 'grid-rows-[1fr] opacity-100 my-0.5' : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="min-h-0 relative space-y-0.5">
            {item.subItems.map((sub, idx) => {
              const isSubActive = isSubItemActive(sub.href, currentPathname, currentSearch);
              const isLastItem = idx === item.subItems!.length - 1;

              return (
                <React.Fragment key={sub.name}>
                  {sub.groupHeader && (
                    <div className={cn(
                      "relative flex items-center pl-[48px] pr-3 select-none",
                      idx > 0 
                        ? "mt-2.5 pt-2 pb-1" 
                        : "mt-1 pt-1 pb-1"
                    )}>
                      {/* Garis vertikal berlanjut melewati baris judul tanpa bullet/point */}
                      <span 
                        className="absolute left-[26px] -translate-x-1/2 w-0.5 bg-slate-200 top-0 bottom-0 pointer-events-none z-0" 
                        aria-hidden="true" 
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {sub.groupHeader}
                      </span>
                    </div>
                  )}

                  <NavLink
                    to={sub.href}
                    onClick={onItemClick}
                    className={cn(
                      'group relative flex items-center py-2 pr-3 rounded-xl text-xs sm:text-[13px] font-medium transition-colors w-full',
                      hasCustomLogo ? 'pl-4' : 'pl-[48px]',
                      isSubActive
                        ? 'text-blue-600 font-semibold hover:bg-slate-50/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/70'
                    )}
                  >
                    {hasCustomLogo ? (
                      <>
                        {/* Garis ke bawah menghubungkan antar item melewati tengah card icon list navigasi */}
                        <span 
                          className={cn(
                            "absolute left-[26px] -translate-x-1/2 w-0.5 bg-slate-200 pointer-events-none z-0",
                            isLastItem ? "top-0 bottom-1/2" : "top-0 bottom-0"
                          )} 
                          aria-hidden="true" 
                        />

                        {/* Card icon list navigasi dengan logo instansi presisi di sumbu 26px */}
                        <span className="relative z-10 w-5 h-5 rounded-md flex items-center justify-center shrink-0 mr-3 overflow-hidden bg-white shadow-3xs border border-slate-200/90 p-0.5 group-hover:border-blue-400 transition-colors">
                          <PortalNavLogo logoKey={sub.logo} className="w-full h-full object-contain" />
                        </span>
                      </>
                    ) : (
                      <>
                        {/* Garis panduan vertikal presisi di tengah menghubungkan antar bullet */}
                        <span 
                          className={cn(
                            "absolute left-[26px] -translate-x-1/2 w-0.5 bg-slate-200 pointer-events-none z-0",
                            idx === 0 
                              ? "top-1/2 bottom-0" 
                              : isLastItem 
                                ? "top-0 bottom-1/2" 
                                : "top-0 bottom-0"
                          )} 
                          aria-hidden="true" 
                        />

                        {/* Bullet dot - presisi tepat di tengah 26px sejajar vertikal icon navigasi utama */}
                        <span
                          className={cn(
                            'absolute left-[26px] top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full ring-2 ring-white transition-all duration-150 z-10',
                            isSubActive
                              ? 'w-2 h-2 bg-blue-600 ring-blue-100'
                              : 'w-1.5 h-1.5 bg-slate-300 group-hover:bg-slate-400'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}

                    <span className="truncate relative z-10">{sub.name}</span>
                  </NavLink>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const isItemActive = item.href ? isSubItemActive(item.href, currentPathname, currentSearch) : false;

  return (
    <NavLink
      to={item.href!}
      onClick={onItemClick}
      className={
        cn(
          'group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isItemActive
            ? 'text-blue-600 font-semibold hover:bg-slate-50'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        )
      }
    >
      {item.iconImg ? (
        <span className="mr-3 flex-shrink-0 h-5 w-5 rounded flex items-center justify-center overflow-hidden">
          <img
            src={item.iconImg}
            alt={item.name}
            className="w-4.5 h-4.5 object-contain"
          />
        </span>
      ) : item.icon ? (
        <item.icon
          className={cn(
            'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
            isItemActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
          )}
          aria-hidden="true"
        />
      ) : null}
      <span className="truncate">{item.name}</span>
    </NavLink>
  );
};
