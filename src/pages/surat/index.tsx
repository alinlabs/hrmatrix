import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Search, FileText } from 'lucide-react';
import { db } from '../../db/database';
import { useCompany } from '../../context/CompanyContext';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions,
  PageHeaderSearch
} from '../../context/MobileNavContext';
import { OfficialLetterDocument, LetterType, LetterCategory } from './types';
import { createInitialLetterDraft } from './letter-templates';
import { 
  getSavedLetters, 
  saveLetterToStorage, 
  deleteLetterFromStorage, 
  duplicateLetterInStorage 
} from './letter-storage';
import { LetterListView } from './LetterListView';
import { LetterEditorView } from './LetterEditorView';
import { LetterDocumentPreview } from './LetterDocumentPreview';

export const SuratResmiPage: React.FC = () => {
  const { company } = useCompany();
  const availableEmployees = useLiveQuery(() => db.employees.toArray()) || [];

  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [savedDocuments, setSavedDocuments] = useState<OfficialLetterDocument[]>(() => getSavedLetters());
  const [activeDocument, setActiveDocument] = useState<OfficialLetterDocument>(() => createInitialLetterDraft('SK_PROMOSI'));
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<LetterCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Auto-apply company data to new drafts
  useEffect(() => {
    if (company && !isEditingExisting && currentView === 'editor') {
      setActiveDocument(prev => ({
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
        },
        signatoryName: company.userName || prev.signatoryName,
        signatoryTitle: company.userRole || prev.signatoryTitle
      }));
    }
  }, [company, isEditingExisting, currentView]);

  const handleCreateNew = (type: LetterType = 'SK_PROMOSI') => {
    const fresh = createInitialLetterDraft(type);
    if (company) {
      fresh.company.companyName = company.name || fresh.company.companyName;
      fresh.company.legalEntity = company.legalEntity || fresh.company.legalEntity;
      fresh.company.address = company.address || fresh.company.address;
      fresh.company.phone = company.phone || fresh.company.phone;
      fresh.company.email = company.email || fresh.company.email;
      fresh.company.representativeName = company.userName || fresh.company.representativeName;
      fresh.company.representativePosition = company.userRole || fresh.company.representativePosition;
      fresh.signatoryName = company.userName || fresh.signatoryName;
      fresh.signatoryTitle = company.userRole || fresh.signatoryTitle;
    }
    setActiveDocument(fresh);
    setIsEditingExisting(false);
    setCurrentView('editor');
  };

  const handleEditDocument = (doc: OfficialLetterDocument) => {
    setActiveDocument(JSON.parse(JSON.stringify(doc)));
    setIsEditingExisting(true);
    setCurrentView('editor');
  };

  const handlePreviewDocument = (doc: OfficialLetterDocument) => {
    setActiveDocument(doc);
    setShowPreviewModal(true);
  };

  const handleSaveDocument = () => {
    const updatedList = saveLetterToStorage(activeDocument);
    setSavedDocuments(updatedList);
    setIsEditingExisting(true);
  };

  const handleDuplicateDocument = (docId: string) => {
    const { list } = duplicateLetterInStorage(docId);
    setSavedDocuments(list);
  };

  const handleDeleteDocument = (docId: string) => {
    const updated = deleteLetterFromStorage(docId);
    setSavedDocuments(updated);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={currentView === 'list' ? 'Surat & SK Resmi' : (isEditingExisting ? 'Edit Surat & SK' : 'Buat Surat & SK')}
        subtitle={currentView === 'list' ? 'Naskah dinas & SK keputusan' : (activeDocument.letterNumber && activeDocument.letterNumber.length <= 30 ? activeDocument.letterNumber : 'Draf Naskah Dinas')}
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
                  title="Cari Surat"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNew('SK_PROMOSI')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Surat & SK</span>
                </button>
              </DesktopHeaderActions>

              <MobileHeaderActions>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Cari Surat"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNew('SK_PROMOSI')}
                  className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                  title="Buat Surat Baru"
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
              placeholder="Cari nomor SK, nama karyawan, jabatan, atau divisi..."
              onFilterClick={() => {}}
              isFilterActive={selectedCategory !== 'ALL' || sortBy !== 'newest'}
            />
          )}
        </>
      )}

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="space-y-4">
        {currentView === 'list' && (
          <LetterListView
            documents={savedDocuments}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onCreateNew={handleCreateNew}
            onEditDocument={handleEditDocument}
            onPreviewDocument={handlePreviewDocument}
            onDuplicateDocument={handleDuplicateDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {currentView === 'editor' && (
          <LetterEditorView
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

      {/* 3. MODAL PREVIEW & CETAK */}
      {showPreviewModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static"
        >
          <div 
            className="fixed inset-0 print:hidden cursor-pointer" 
            onClick={() => setShowPreviewModal(false)} 
          />
          <div className="relative w-full max-w-5xl h-[90vh] max-h-[92vh] bg-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
            <LetterDocumentPreview
              document={activeDocument}
              onClose={() => setShowPreviewModal(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
