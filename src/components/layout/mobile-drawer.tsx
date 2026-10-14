import React, { useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn } from 'lucide-react';
import { cn } from '../../utils/cn';
import { HRMatrixLogo } from '../ui/Logo';
import { EmployeeAvatar } from '../ui/EmployeeAvatar';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { useCompany } from '../../context/CompanyContext';
import { NavMainItem } from './navigation-config';
import { SidebarNavItem } from './sidebar-nav-item';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavigation: NavMainItem[];
  recruitmentNavigation: NavMainItem[];
  legalNavigation: NavMainItem[];
  gaNavigation: NavMainItem[];
  reportsNavigation: NavMainItem[];
  systemNavigation: NavMainItem[];
  infoNavigation: NavMainItem[];
  openDropdowns: Record<string, boolean>;
  toggleDropdown: (name: string) => void;
  currentPathname: string;
  currentSearch: string;
  onDaftarClick: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  mainNavigation,
  recruitmentNavigation,
  legalNavigation,
  gaNavigation,
  reportsNavigation,
  systemNavigation,
  infoNavigation,
  openDropdowns,
  toggleDropdown,
  currentPathname,
  currentSearch,
  onDaftarClick
}) => {
  const navigate = useNavigate();
  const dashboardItem = useMemo(() => mainNavigation.find(item => item.name === 'Dashboard'), [mainNavigation]);
  const operasionalNavigation = useMemo(() => mainNavigation.filter(item => item.name !== 'Dashboard'), [mainNavigation]);

  const { company, isRegistered } = useCompany();

  const userName = company?.userName?.trim() || 'Alvareza Hilka Pratama';
  const userPosition = company?.userRole === 'admin' 
    ? 'HR Manager & Ops' 
    : (company?.userRole || 'HR Administrator');

  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 flex overscroll-contain touch-none select-none"
          id="mobile-drawer-portal"
        >
          {/* Backdrop with smooth blur and fade animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            onWheel={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            id="mobile-drawer-backdrop"
          />

          {/* Sidebar drawer with smooth slide in / slide out animation */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
            data-sidebar="true"
            data-no-scroll-reset="true"
            className="relative w-72 max-w-[85vw] bg-white text-slate-700 h-full flex flex-col shadow-2xl border-r border-slate-200 overscroll-contain touch-auto select-auto z-10"
            onClick={e => e.stopPropagation()}
            id="mobile-drawer-sidebar"
          >
            {/* Drawer Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/80 bg-white shrink-0">
              <div className="flex items-center space-x-2.5">
                <HRMatrixLogo className="w-8 h-8" showText={true} textColor="text-slate-900" showSubtitle={true} subtitle="Indonesia" />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav data-sidebar="true" data-no-scroll-reset="true" className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
              {/* Dashboard: Di paling atas tanpa judul group */}
              {dashboardItem && (
                <SidebarNavItem
                  key={dashboardItem.name}
                  item={dashboardItem}
                  isOpen={!!openDropdowns[dashboardItem.name]}
                  onToggle={() => toggleDropdown(dashboardItem.name)}
                  onItemClick={onClose}
                  currentPathname={currentPathname}
                  currentSearch={currentSearch}
                />
              )}

              <div className="pt-2 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Operasional
              </div>
              {operasionalNavigation.map((item) => (
                <SidebarNavItem
                  key={item.name}
                  item={item}
                  isOpen={!!openDropdowns[item.name]}
                  onToggle={() => toggleDropdown(item.name)}
                  onItemClick={onClose}
                  currentPathname={currentPathname}
                  currentSearch={currentSearch}
                />
              ))}

              {recruitmentNavigation.length > 0 && (
                <>
                  <div className="pt-2.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                    Rekrutmen
                  </div>
                  {recruitmentNavigation.map((item) => (
                    <SidebarNavItem
                      key={item.name}
                      item={item}
                      isOpen={!!openDropdowns[item.name]}
                      onToggle={() => toggleDropdown(item.name)}
                      onItemClick={onClose}
                      currentPathname={currentPathname}
                      currentSearch={currentSearch}
                    />
                  ))}
                </>
              )}

              <div className="pt-2.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                Legal Affairs
              </div>
              {legalNavigation.map((item) => (
                <SidebarNavItem
                  key={item.name}
                  item={item}
                  isOpen={!!openDropdowns[item.name]}
                  onToggle={() => toggleDropdown(item.name)}
                  onItemClick={onClose}
                  currentPathname={currentPathname}
                  currentSearch={currentSearch}
                />
              ))}

              {gaNavigation.length > 0 && (
                <>
                  <div className="pt-2.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                    General Affair
                  </div>
                  {gaNavigation.map((item) => (
                    <SidebarNavItem
                      key={item.name}
                      item={item}
                      isOpen={!!openDropdowns[item.name]}
                      onToggle={() => toggleDropdown(item.name)}
                      onItemClick={onClose}
                      currentPathname={currentPathname}
                      currentSearch={currentSearch}
                    />
                  ))}
                </>
              )}

              <div className="pt-2.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                Laporan
              </div>
              {reportsNavigation.map((item) => (
                <SidebarNavItem
                  key={item.name}
                  item={item}
                  isOpen={!!openDropdowns[item.name]}
                  onToggle={() => toggleDropdown(item.name)}
                  onItemClick={onClose}
                  currentPathname={currentPathname}
                  currentSearch={currentSearch}
                />
              ))}

              <div className="pt-2.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                Sistem
              </div>
              {systemNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href!}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive && currentPathname === item.href
                        ? 'text-blue-600 font-semibold hover:bg-slate-50'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )
                  }
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                        currentPathname === item.href ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}

              <div className="pt-2.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                Informasi
              </div>
              {infoNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href!}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive && currentPathname === item.href
                        ? 'text-blue-600 font-semibold hover:bg-slate-50'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )
                  }
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                        currentPathname === item.href ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}

              {/* Tombol Install Aplikasi dengan logo Google selalu ada di paling bawah Tentang */}
              <PWAInstallButton variant="nav-item" onItemClick={onClose} />
            </nav>

            {/* Drawer Footer / Account Card atau Tombol Daftar & Claim Promo */}
            <div className="p-3 bg-slate-50/95 border-t border-slate-200/80 shrink-0">
              {isRegistered ? (
                /* User Account Card (Hanya muncul jika sudah daftar) */
                <div 
                  onClick={() => {
                    onClose();
                    onDaftarClick();
                  }}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                  title="Buka Pengaturan Akun"
                >
                  {/* Gambar Akun: Terstandarisasi seperti card karyawan di daftar karyawan */}
                  <EmployeeAvatar
                    name={userName}
                    src={company?.logo}
                    size="md"
                    className="group-hover:scale-105 transition-transform shrink-0"
                  />

                  {/* Nama & Posisi (Tanpa Badge) */}
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors" title={userName}>
                      {userName}
                    </span>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {userPosition}
                    </p>
                  </div>

                  {/* Icon arah kanan ke pintu masuk (tanpa dibungkus card) untuk membuka pengaturan akun */}
                  <LogIn 
                    className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" 
                    aria-hidden="true" 
                  />
                </div>
              ) : (
                /* Tombol Daftar dan Claim Promo dengan Nominal Price (Jika belum daftar) */
                <div className="space-y-2">
                  {/* Teks diatas card promo: Rata tengah dan tidak bold */}
                  <p 
                    onClick={() => {
                      onClose();
                      navigate('/promo');
                    }}
                    className="text-center text-xs font-normal text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    Klaim Promo Sekarang
                  </p>

                  {/* Promo Price Card: Biru Gradasi dengan Shimmer Effect, Teks Putih & Judul Promo Terbatas */}
                  <div
                    onClick={() => {
                      onClose();
                      navigate('/promo');
                    }}
                    className="relative overflow-hidden p-2.5 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white border border-blue-400/30 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-md group"
                    title="Klaim Promo Terbatas Rp 11.980/Bulan"
                  >
                    {/* Shimmer Effect Otomatis Berulang */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                      <div className="absolute -top-4 -bottom-4 -left-full w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-promo-shimmer pointer-events-none" />
                    </div>

                    {/* Baris Konten: Kiri (Promo Terbatas & Badge Merah) | Kanan (Harga Coret & Harga Real) - Vertikal Rata Tengah */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      {/* Sisi Kiri: Teks Bold Putih 'Promo Terbatas' & Badge Merah Hemat 52% */}
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-black text-white tracking-tight leading-tight">
                          Promo Terbatas
                        </span>
                        <span className="inline-flex items-center bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          Hemat 52%
                        </span>
                      </div>

                      {/* Sisi Kanan: Harga Coret & Harga Real Putih, Rata Tengah Vertikal */}
                      <div className="flex flex-col items-end text-right justify-center">
                        <span className="text-[10.5px] text-white/60 line-through font-bold leading-none mb-0.5">
                          Rp 25.000/bln
                        </span>
                        <div className="text-sm font-black text-white leading-tight tracking-tight">
                          Rp 11.980<span className="text-[11px] font-bold text-white/80">/Bulan</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teks Masuk atau Daftar disini (Normal tanpa bold) */}
                  <p className="text-center text-xs font-normal leading-relaxed text-slate-600 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDaftarClick();
                      }}
                      className="font-normal text-slate-600 hover:text-slate-900 cursor-pointer transition-colors inline p-0"
                    >
                      Masuk atau Daftar disini
                    </button>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
