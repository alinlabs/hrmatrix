import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HideBottomNav } from '../../context/MobileNavContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  hideBottomNav?: boolean; // Default true
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  hideBottomNav = true
}) => {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  useEffect(() => setMounted(true), []);

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
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm cursor-pointer"
              onClick={onClose}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={isDesktop ? { opacity: 0, scale: 0.95, y: 10 } : { y: "100%", opacity: 1, scale: 1 }}
              animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0, opacity: 1, scale: 1 }}
              exit={isDesktop ? { opacity: 0, scale: 0.95, y: 10 } : { y: "100%", opacity: 1, scale: 1 }}
              transition={isDesktop ? 
                { type: "spring", damping: 25, stiffness: 300, mass: 0.8 } : 
                { type: "spring", damping: 28, stiffness: 300, mass: 0.8 }
              }
              className={`relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-4 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden overscroll-contain z-10 ${className}`}
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
