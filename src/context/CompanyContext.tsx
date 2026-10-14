import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Company } from '../types';

interface CompanyModalOptions {
  title?: string;
  message?: string;
  onComplete?: () => void;
}

interface CompanyContextType {
  company: Company | null | undefined;
  isRegistered: boolean;
  isLoading: boolean;
  isBottomSheetOpen: boolean;
  modalOptions: CompanyModalOptions;
  openCompanySetupModal: (options?: CompanyModalOptions) => void;
  closeCompanySetupModal: () => void;
  requireCompanyRegistration: (onAllowed?: () => void, customOptions?: CompanyModalOptions) => boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const companies = useLiveQuery(() => db.company.toArray());
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<CompanyModalOptions>({});

  const isLoading = companies === undefined;
  const company = companies && companies.length > 0 ? companies[0] : null;
  const isRegistered = Boolean(company);

  const openCompanySetupModal = (options?: CompanyModalOptions) => {
    setModalOptions(options || {});
    setIsBottomSheetOpen(true);
  };

  const closeCompanySetupModal = () => {
    setIsBottomSheetOpen(false);
    setModalOptions({});
  };

  const requireCompanyRegistration = (
    onAllowed?: () => void,
    customOptions?: CompanyModalOptions
  ): boolean => {
    if (isRegistered) {
      if (onAllowed) onAllowed();
      return true;
    }

    openCompanySetupModal({
      title: customOptions?.title || 'Daftarkan Perusahaan Terlebih Dahulu',
      message:
        customOptions?.message ||
        'Anda sedang dalam Mode Eksplorasi. Silakan daftarkan profil perusahaan Anda terlebih dahulu untuk mengaktifkan fitur penyimpanan data.',
      onComplete: customOptions?.onComplete || onAllowed
    });
    return false;
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        isRegistered,
        isLoading,
        isBottomSheetOpen,
        modalOptions,
        openCompanySetupModal,
        closeCompanySetupModal,
        requireCompanyRegistration
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
