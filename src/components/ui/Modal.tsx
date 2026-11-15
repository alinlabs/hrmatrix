import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HideBottomNav } from '../../context/MobileNavContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollLock } from '../../hooks/useScrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string; // Additional classes for the backdrop wrapper
  contentClassName?: string; // Classes for the inner modal container
  hideBottomNav?: boolean;
  fixedHeight?: boolean; // Standarisasi modal dengan tab atau searchbar agar tinggi tetap stabil saat berpindah tab
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  contentClassName = '',
  hideBottomNav = true,
  fixedHeight = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  
  // Mencegah scroll pada layout utama saat modal terbuka
  useScrollLock(isOpen);
  
  useEffect(() => setMounted(true), []);

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {hideBottomNav && <HideBottomNav />}
          <div 
            className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto overflow-hidden overscroll-none touch-none select-none ${className}`}
            onClick={(e) => {
              if (e.target === e.currentTarget && onClose) onClose();
            }}
            onWheel={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
          >
            {/* Backdrop with elegant blur covering entire screen including header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-pointer"
              onClick={onClose}
            />
            
            {/* Modal Content - Full height up to header on mobile and desktop */}
            <motion.div
              initial={isDesktop ? { opacity: 0, scale: 0.95, y: 0 } : { y: "100%", opacity: 1, scale: 1 }}
              animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0, opacity: 1, scale: 1 }}
              exit={isDesktop ? { opacity: 0, scale: 0.95, y: 0 } : { y: "100%", opacity: 1, scale: 1 }}
              transition={isDesktop ? 
                { type: "spring", damping: 25, stiffness: 300, mass: 0.8 } : 
                { type: "spring", damping: 28, stiffness: 300, mass: 0.8 }
              }
              // Standardized height: Full height minus header height (mobile header: h-14/3.5rem, desktop header: h-16/4rem)
              className={`relative bg-white w-full rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-100 flex flex-col ${
                fixedHeight 
                  ? 'h-[calc(100dvh-3.5rem)] sm:h-[calc(100vh-5rem)] sm:max-h-[760px]' 
                  : 'max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100vh-5rem)]'
              } overflow-hidden overscroll-contain z-10 box-border cursor-default select-auto touch-pan-y ${contentClassName}`}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
