import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Plus, 
  Printer, 
  Save, 
  ArrowLeft,
  FileSignature,
  FileText,
  Search
} from 'lucide-react';
import { db } from '../../db/database';
import { useCompany } from '../../context/CompanyContext';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions,
  PageHeaderSearch
} from '../../context/MobileNavContext';
import { 
  ContractDocument, 
  ContractType, 
  ContractCategory,
  ContractLanguageMode 
} from './types';
import { 
  createInitialContractDraft, 
  generateDefaultClauses 
} from './contract-templates';
import { 
  getSavedContracts, 
  saveContractToStorage, 
  deleteContractFromStorage, 
  duplicateContractInStorage 
} from './contract-storage';
import { ContractListView } from './ContractListView';
import { ContractEditorView } from './ContractEditorView';
import { ContractDocumentPreview } from './ContractDocumentPreview';
import { ModalFilterDocument } from './modal-filter-document';

export const DokumenKontrakPage: React.FC = () => {
  const { company } = useCompany();
  const availableEmployees = useLiveQuery(() => db.employees.toArray()) || [];

  // View state: 'list' (Halaman 1) or 'editor' (Halaman 2)
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [savedDocuments, setSavedDocuments] = useState<ContractDocument[]>(() => getSavedContracts());
  const [activeDocument, setActiveDocument] = useState<ContractDocument>(() => createInitialContractDraft('PKWT'));
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ContractCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Auto-apply company data to new drafts if not yet customized
  useEffect(() => {
    if (company && !isEditingExisting && currentView === 'editor') {
      setActiveDocument(prev => {
        const updated: ContractDocument = {
          ...prev,
          company: {
            ...prev.company,
            companyName: company.name || prev.company.companyName,
            legalEntity: company.legalEntity || prev.company.legalEntity,
            address: company.address || prev.company.address,
            phone: company.phone || prev.company.phone,
            email: company.email || prev.company.email,
            representativeName: company.userName || prev.company.representativeName,
            representativePosition: company.userRole || prev.company.representativePosition
          }
        };
        updated.clauses = generateDefaultClauses(updated.contractType, updated);
        return updated;
      });
    }
  }, [company, isEditingExisting, currentView]);

  // Handler: Start Creating New Document
  const handleCreateNew = (type: ContractType = 'PKWT') => {
    const fresh = createInitialContractDraft(type);
    if (company) {
      fresh.company.companyName = company.name || fresh.company.companyName;
      fresh.company.legalEntity = company.legalEntity || fresh.company.legalEntity;
      fresh.company.address = company.address || fresh.company.address;
      fresh.company.phone = company.phone || fresh.company.phone;
      fresh.company.email = company.email || fresh.company.email;
      fresh.company.representativeName = company.userName || fresh.company.representativeName;
      fresh.company.representativePosition = company.userRole || fresh.company.representativePosition;
      fresh.clauses = generateDefaultClauses(type, fresh);
    }
    setActiveDocument(fresh);
    setIsEditingExisting(false);
    setCurrentView('editor');
  };

  // Handler: Edit Existing Document
  const handleEditDocument = (doc: ContractDocument) => {
    setActiveDocument(JSON.parse(JSON.stringify(doc)));
    setIsEditingExisting(true);
    setCurrentView('editor');
  };

  // Handler: Preview Document in Modal
  const handlePreviewDocument = (doc: ContractDocument) => {
    setActiveDocument(doc);
    setShowPreviewModal(true);
  };

  // Handler: Save Active Document
  const handleSaveDocument = () => {
    const updatedList = saveContractToStorage(activeDocument);
    setSavedDocuments(updatedList);
    setIsEditingExisting(true);
  };

  // Handler: Duplicate Document
  const handleDuplicateDocument = (docId: string) => {
    const { list } = duplicateContractInStorage(docId);
    setSavedDocuments(list);
  };

  // Handler: Delete Document
  const handleDeleteDocument = (docId: string) => {
    const updatedList = deleteContractFromStorage(docId);
    setSavedDocuments(updatedList);
  };

  // Handler: Switch Language Mode
  const handleLanguageChange = (mode: ContractLanguageMode) => {
    setActiveDocument(prev => ({
      ...prev,
      languageMode: mode
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={currentView === 'list' ? 'Kontrak Kerja' : (isEditingExisting ? 'Edit Kontrak Kerja' : 'Buat Kontrak Kerja')}
        subtitle={currentView === 'list' ? 'PKWT, PKWTT, Magang & Mitra' : (activeDocument.contractNumber && activeDocument.contractNumber.length <= 30 ? activeDocument.contractNumber : 'Draf Perjanjian Kerja')}
        onBack={currentView === 'editor' ? () => setCurrentView('list') : undefined}
      />

      {/* Header Actions for List View */}
      {currentView === 'list' && (
        <>
          {!isSearchOpen && (
            <>
              <DesktopHeaderActions>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className={`h-9 w-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer ${
                    searchQuery ? 'text-blue-600 border-blue-300 bg-blue-50/50' : 'text-slate-600'
                  }`}
                  title="Cari Dokumen"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNew('PKWT')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Dokumen</span>
                </button>
              </DesktopHeaderActions>

              <MobileHeaderActions>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    searchQuery ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Cari Dokumen"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNew('PKWT')}
                  className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                  title="Buat Dokumen Baru"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </MobileHeaderActions>
            </>
          )}

          {isSearchOpen && (
            <PageHeaderSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              placeholder="Cari nama karyawan, nomor berkas, atau jabatan..."
              onFilterClick={() => setIsFilterModalOpen(true)}
              isFilterActive={selectedCategory !== 'ALL' || sortBy !== 'newest'}
            />
          )}
        </>
      )}

      {/* Header Actions for Editor View */}
      {currentView === 'editor' && (
        <>
          <DesktopHeaderActions>
            {/* 3 Pilihan Bahasa */}
            <div className="flex items-center gap-0.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleLanguageChange('id')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeDocument.languageMode === 'id' 
                    ? 'bg-white text-blue-700 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bahasa Indonesia Saja"
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeDocument.languageMode === 'en' 
                    ? 'bg-white text-blue-700 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English Version"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('bilingual')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeDocument.languageMode === 'bilingual' 
                    ? 'bg-white text-blue-700 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bilingual 2 Bahasa (Kolom Berdampingan)"
              >
                2 Bahasa
              </button>
            </div>

            {/* Tombol Simpan */}
            <button
              type="button"
              onClick={handleSaveDocument}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
              title="Simpan Dokumen"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Simpan</span>
            </button>

            {/* Tombol Cetak / PDF */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
              title="Buka pratinjau & cetak dokumen dalam format PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </DesktopHeaderActions>

          <MobileHeaderActions>
            <div className="flex items-center gap-1">
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('id')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${activeDocument.languageMode === 'id' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'}`}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${activeDocument.languageMode === 'en' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('bilingual')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${activeDocument.languageMode === 'bilingual' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'}`}
                  title="2 Bahasa"
                >
                  2B
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                title="Cetak / PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </MobileHeaderActions>
        </>
      )}

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="space-y-4">
        
        {/* HALAMAN 1: DAFTAR BERKAS DOKUMEN YANG PERNAH DIBUAT */}
        {currentView === 'list' && (
          <ContractListView
            documents={savedDocuments}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onCreateNew={(type) => handleCreateNew(type || 'PKWT')}
            onEditDocument={handleEditDocument}
            onPreviewDocument={handlePreviewDocument}
            onDuplicateDocument={handleDuplicateDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {/* HALAMAN 2: EDITOR / PEMBUATAN DOKUMEN */}
        {currentView === 'editor' && (
          <ContractEditorView
            document={activeDocument}
            isEditingExisting={isEditingExisting}
            availableEmployees={availableEmployees}
            onChange={setActiveDocument}
            onSave={handleSaveDocument}
            onBackToList={() => setCurrentView('list')}
            onOpenPreview={() => setShowPreviewModal(true)}
          />
        )}

      </div>

      {/* 3. MODAL PRATINJAU DOKUMEN & BUILD PDF */}
      {showPreviewModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static"
        >
          {/* Backdrop Click to Close */}
          <div 
            className="fixed inset-0 print:hidden cursor-pointer" 
            onClick={() => setShowPreviewModal(false)} 
          />

          {/* Modal Card Container */}
          <div className="relative w-full max-w-5xl h-[90vh] max-h-[92vh] bg-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
            <ContractDocumentPreview
              document={activeDocument}
              onClose={() => setShowPreviewModal(false)}
            />
          </div>
        </div>
      )}

      {/* 4. MODAL FILTER & SORT DOKUMEN */}
      <ModalFilterDocument
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilter={() => {
          setSelectedCategory('ALL');
          setSortBy('newest');
        }}
      />

    </div>
  );
};
