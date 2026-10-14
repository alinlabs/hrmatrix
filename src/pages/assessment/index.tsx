import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Plus, 
  ChevronLeft 
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions,
  PageHeaderSearch
} from '../../context/MobileNavContext';
import { TestPackage, TestQuestion } from './types';
import { getAllPackagesWithBank, resolvePackageFromParams, deletePackage } from './assessment-storage';
import { ModalShareTest } from './modal-share-test';
import { ModalPackageInfo } from './modal-package-info';
import { ModalCreateQuestion } from './modal-create-question';
import { TestTakingView } from './test-taking-view';
import { TestPackagesView } from './test-packages-view';
import { QuestionBankView } from './question-bank-view';
import { CreateQuestionView } from './create-question-view';

type AssessmentViewMode = 'packages' | 'bank' | 'create';

export const AssessmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Active view state derived from route path
  const activeView = useMemo<AssessmentViewMode>(() => {
    const path = location.pathname;
    if (path.includes('/bank-soal') || path.includes('/bank')) return 'bank';
    if (path.includes('/form') || path.includes('/create')) return 'create';
    return 'packages';
  }, [location.pathname]);

  const navigateToView = (view: AssessmentViewMode) => {
    if (view === 'bank') {
      navigate('/assessment/bank-soal');
    } else if (view === 'create') {
      navigate('/assessment/form');
    } else {
      navigate('/assessment');
    }
  };

  // Packages list state
  const [packages, setPackages] = useState<TestPackage[]>(() => getAllPackagesWithBank());

  const refreshPackages = useCallback(() => {
    setPackages(getAllPackagesWithBank());
  }, []);

  // Selected package for action
  const [selectedPackageForAction, setSelectedPackageForAction] = useState<TestPackage>(
    () => packages[0] || getAllPackagesWithBank()[0]
  );

  // Sharing modal state
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Package Info modal state
  const [infoModalPackage, setInfoModalPackage] = useState<TestPackage | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Modal Create Question for Bank Soal
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TestQuestion | null>(null);

  // Active testing session state
  const [activeSessionPackage, setActiveSessionPackage] = useState<TestPackage | null>(null);
  const [activeCandidateName, setActiveCandidateName] = useState('');
  const [activeAppliedPosition, setActiveAppliedPosition] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Detect URL parameters for candidates opening a shared test link
  useEffect(() => {
    const testSlug = searchParams.get('test');
    const mode = searchParams.get('mode');
    const nameParam = searchParams.get('name') || '';
    const posParam = searchParams.get('pos') || '';

    if (testSlug) {
      const match = resolvePackageFromParams(testSlug, searchParams);
      if (match) {
        if (mode === 'take') {
          setActiveSessionPackage(match);
          setActiveCandidateName(nameParam);
          setActiveAppliedPosition(posParam);
        }
      }
    }
  }, [searchParams]);

  // Unified all bank questions
  const allBankQuestions = useMemo(() => {
    const primary = packages[0] || getAllPackagesWithBank()[0];
    return primary && primary.questionBank && primary.questionBank.length > 0
      ? primary.questionBank
      : primary ? primary.questions : [];
  }, [packages]);

  // Handler to initiate creation of a new assessment package
  const handleCreateNewPackage = () => {
    const newPkg: TestPackage = {
      id: `pkg-new-${Date.now()}`,
      slug: `new-test-${Date.now()}`,
      title: 'Paket Asesmen Baru',
      category: 'comprehensive',
      categoryLabel: 'Asesmen Kustom',
      shortDescription: 'Tuliskan ringkasan singkat paket tes baru di sini...',
      fullDescription: 'Tuliskan deskripsi lengkap dan instruksi pengerjaan paket tes ini...',
      durationMinutes: 45,
      totalQuestions: 0,
      difficulty: 'Semua Level',
      targetAudience: 'Semua level calon karyawan',
      measuringPoints: ['Profil & Kapabilitas Kerja'],
      instructions: ['Kerjakan secara mandiri dan optimalkan alokasi waktu.'],
      questions: [],
      questionBank: allBankQuestions,
      selectedQuestionIds: []
    };
    setSelectedPackageForAction(newPkg);
    navigateToView('create');
  };

  // If candidate is actively taking a test, show TestTakingView
  if (activeSessionPackage) {
    return (
      <TestTakingView
        testPackage={activeSessionPackage}
        initialCandidateName={activeCandidateName}
        initialPosition={activeAppliedPosition}
        onExit={() => setActiveSessionPackage(null)}
      />
    );
  }

  // Full-page view for Buat / Kustomisasi Paket Tes (/assessment/form)
  if (activeView === 'create') {
    return (
      <>
        <CreateQuestionView
          packages={packages}
          selectedPackage={selectedPackageForAction}
          onSelectPackageToEdit={(pkg) => setSelectedPackageForAction(pkg)}
          onClose={() => navigateToView('packages')}
          onSaved={(updated) => {
            refreshPackages();
            setSelectedPackageForAction(updated);
          }}
          onStartSimulation={(pkg) => setActiveSessionPackage(pkg)}
          onShareTest={(pkg) => {
            setSelectedPackageForAction(pkg);
            setIsShareOpen(true);
          }}
        />

        <ModalShareTest
          testPackage={selectedPackageForAction}
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={activeView === 'packages' ? 'Test Assesment' : 'Bank Soal'}
        subtitle={activeView === 'packages' ? 'Paket tes & simulasi kandidat' : 'Koleksi soal tes psikometri'}
        onBack={activeView === 'bank' ? () => navigateToView('packages') : undefined}
      />

      {/* Header Search & Actions */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>
            {/* 1. Card Icon Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`h-9 w-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs ${
                searchQuery ? 'text-blue-600 border-blue-300 bg-blue-50/50' : 'text-slate-600'
              }`}
              title="Cari Soal & Asesmen"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>

            {/* 2. Bank Soal (hanya di halaman Test Assesment) */}
            {activeView === 'packages' && (
              <button
                type="button"
                onClick={() => navigateToView('bank')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                <span>Bank Soal</span>
              </button>
            )}

            {/* 3. Tombol Utama (Buat Paket Tes di /assessment vs Buat Soal di /assessment/bank-soal) */}
            {activeView === 'packages' ? (
              <button
                type="button"
                onClick={handleCreateNewPackage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Buat Paket Tes</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsCreateQuestionOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Buat Soal</span>
              </button>
            )}
          </DesktopHeaderActions>

          <MobileHeaderActions>
            {activeView === 'bank' && (
              <button
                type="button"
                onClick={() => navigateToView('packages')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Kembali ke Test Assesment"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Cari Soal"
            >
              <Search className="w-5 h-5" />
            </button>
            {activeView === 'packages' && (
              <button
                type="button"
                onClick={() => navigateToView('bank')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Bank Soal"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (activeView === 'packages') {
                  handleCreateNewPackage();
                } else {
                  setEditingQuestion(null);
                  setIsCreateQuestionOpen(true);
                }
              }}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
              title={activeView === 'packages' ? "Buat Paket Tes" : "Buat Soal"}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
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
          placeholder="Cari butir soal, skenario studi kasus, atau kata kunci..."
          onFilterClick={() => {}}
          isFilterActive={false}
        />
      )}

      {/* Main Container */}
      <div className="w-full space-y-4">
        {activeView === 'packages' && (
          <TestPackagesView
            packages={packages}
            onSelectPackageInfo={(pkg) => {
              setInfoModalPackage(pkg);
              setIsInfoOpen(true);
            }}
            onStartSimulation={(pkg) => setActiveSessionPackage(pkg)}
            onCustomize={(pkg) => {
              setSelectedPackageForAction(pkg);
              navigateToView('create');
            }}
            onDeletePackage={(pkgId) => {
              if (window.confirm('Apakah Anda yakin ingin menghapus paket tes ini?')) {
                deletePackage(pkgId);
                refreshPackages();
              }
            }}
          />
        )}

        {activeView === 'bank' && (
          <QuestionBankView
            allBankQuestions={allBankQuestions}
            onOpenCreateQuestion={() => {
              setEditingQuestion(null);
              setIsCreateQuestionOpen(true);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onDeleteQuestion={() => refreshPackages()}
            onEditQuestion={(question) => {
              setEditingQuestion(question);
              setIsCreateQuestionOpen(true);
            }}
            onResetBankToDefault={() => refreshPackages()}
          />
        )}
      </div>

      {/* Modal Info Paket Tes */}
      <ModalPackageInfo
        testPackage={infoModalPackage}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onShare={(pkg) => {
          setSelectedPackageForAction(pkg);
          setIsShareOpen(true);
        }}
        onStartSimulation={(pkg) => setActiveSessionPackage(pkg)}
        onCustomize={(pkg) => {
          setSelectedPackageForAction(pkg);
          navigateToView('create');
        }}
      />

      {/* Modal Buat / Edit Pertanyaan Baru (Khusus Bank Soal) */}
      <ModalCreateQuestion
        isOpen={isCreateQuestionOpen}
        onClose={() => {
          setIsCreateQuestionOpen(false);
          setEditingQuestion(null);
        }}
        questionToEdit={editingQuestion}
        onQuestionCreated={() => {
          refreshPackages();
        }}
        defaultPackageId={selectedPackageForAction?.id}
      />

      {/* Modal Bagikan Link Tes */}
      <ModalShareTest
        testPackage={selectedPackageForAction}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onStartSimulation={(candidateName, appliedPosition) => {
          setIsShareOpen(false);
          setActiveCandidateName(candidateName);
          setActiveAppliedPosition(appliedPosition);
          setActiveSessionPackage(selectedPackageForAction);
        }}
      />
    </div>
  );
};
