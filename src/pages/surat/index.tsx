import React, { useState, useEffect, Suspense } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Search, X } from 'lucide-react';
import { db } from '../../db/database';
import { useCompany } from '../../context/company-context';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions,
  PageHeaderSearch
} from '../../context/mobile-nav-context';
import { DokumenHeader } from '../../components/layout/dokumen-header';
import { OfficialLetterDocument, LetterType, LetterCategory } from './types';
import { createInitialLetterDraft } from './letter-templates';
import { 
  getSavedLetters, 
  saveLetterToStorage, 
  deleteLetterFromStorage, 
  duplicateLetterInStorage 
} from './letter-storage';
import { LetterListView } from './letter-list-view';
import { Modal } from '../../components/ui/modal';
import { lazyWithRetry } from '../../utils/lazy-with-retry';
import { RouteLoadingIndicator } from '../../components/ui/route-loading-indicator';

const LetterEditorView = lazyWithRetry(() => import('./letter-editor-view').then(m => ({ default: m.LetterEditorView })));
const LetterDocumentPreview = lazyWithRetry(() => import('./letter-document-preview').then(m => ({ default: m.LetterDocumentPreview })));

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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const hasActiveFilter = selectedCategory !== 'ALL' || sortBy !== 'newest';

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
    <div className="w-full flex-1 flex flex-col space-y-4">
      
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={currentView === 'list' ? 'Surat & SK Resmi' : (isEditingExisting ? 'Edit Surat & SK' : 'Buat Surat & SK')}
        subtitle={currentView === 'list' ? 'Naskah dinas & SK keputusan' : (activeDocument.letterNumber && activeDocument.letterNumber.length <= 30 ? activeDocument.letterNumber : 'Draf Naskah Dinas')}
        onBack={currentView === 'editor' ? () => setCurrentView('list') : undefined}
      />

      {currentView === 'list' && <DokumenHeader activeTab="surat" />}

      {/* Header Actions for List View */}
      {currentView === 'list' && (
        <>
          {!isSearchOpen && (
            <>
              <DesktopHeaderActions>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
                      searchQuery || hasActiveFilter
                        ? 'border-blue-300 text-blue-600 bg-blue-50/50'
                        : 'border-slate-200 text-slate-700 hover:text-blue-600'
                    }`}
                    title="Cari Surat"
                  >
                    <Search className="w-4 h-4" />
                    {(searchQuery || hasActiveFilter) && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateNew('SK_PROMOSI')}
                    className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white inline-flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Surat & SK</span>
                  </button>
                </div>
              </DesktopHeaderActions>

              <MobileHeaderActions>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className={`h-8 w-8 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center relative ${
                      searchQuery || hasActiveFilter
                        ? 'border-blue-300 text-blue-600 bg-blue-50/50'
                        : 'border-slate-200 text-slate-700'
                    }`}
                    title="Cari Surat"
                  >
                    <Search className="w-4 h-4" />
                    {(searchQuery || hasActiveFilter) && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateNew('SK_PROMOSI')}
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    title="Buat Surat Baru"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
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
              onFilterClick={() => setIsFilterModalOpen(true)}
              isFilterActive={hasActiveFilter}
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
          <Suspense fallback={<RouteLoadingIndicator />}>
            <LetterEditorView
              document={activeDocument}
              isEditingExisting={isEditingExisting}
              availableEmployees={availableEmployees}
              onChange={setActiveDocument}
              onSave={handleSaveDocument}
              onBackToList={() => setCurrentView('list')}
              onOpenPreview={() => setShowPreviewModal(true)}
            />
          </Suspense>
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
            <Suspense fallback={<RouteLoadingIndicator />}>
              <LetterDocumentPreview
                document={activeDocument}
                onClose={() => setShowPreviewModal(false)}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Filter Surat & SK Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        contentClassName="sm:max-w-md"
        hideBottomNav={false}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0">
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Filter & Urutkan Surat
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Saring naskah dinas berdasarkan kategori & urutan
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Kategori Naskah Dinas
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                {[
                  { id: 'ALL', label: 'Semua Surat & SK' },
                  { id: 'SK_KEPUTUSAN', label: 'SK Direksi' },
                  { id: 'PERINGATAN', label: 'Surat Peringatan' },
                  { id: 'KETERANGAN', label: 'Paklaring & Keterangan' },
                  { id: 'PENGAKHIRAN', label: 'PHK & Resign' },
                  { id: 'PENUGASAN', label: 'Surat Tugas' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as LetterCategory | 'ALL')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Urutkan Berkas
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                {[
                  { id: 'newest', label: 'Terbaru' },
                  { id: 'oldest', label: 'Terlama' },
                  { id: 'name', label: 'Nama A-Z' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSortBy(item.id as 'newest' | 'oldest' | 'name')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      sortBy === item.id
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white space-y-2">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Terapkan Filter
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSortBy('newest');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};
