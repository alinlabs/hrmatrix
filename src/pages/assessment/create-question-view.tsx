import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Check, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Plus, 
  RotateCcw, 
  Search, 
  Sliders, 
  ListChecks, 
  CheckCircle2, 
  Share2, 
  Play, 
  AlertCircle,
  Tag,
  Layers,
  FileText
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions 
} from '../../context/MobileNavContext';
import { 
  TestPackage, 
  TestQuestion, 
  QuestionOption, 
  TestCategory,
  CATEGORY_LABELS,
  CATEGORY_BADGE_COLORS 
} from './types';
import { savePackageCustomization, resetPackageCustomization, saveCustomQuestionToBank, savePackage, deleteQuestionFromBank } from './assessment-storage';

interface CreateQuestionViewProps {
  packages: TestPackage[];
  selectedPackage: TestPackage;
  onSelectPackageToEdit?: (pkg: TestPackage) => void;
  onClose: () => void;
  onSaved: (updatedPackage: TestPackage) => void;
  onStartSimulation: (pkg: TestPackage) => void;
  onShareTest: (pkg: TestPackage) => void;
}

export const CreateQuestionView: React.FC<CreateQuestionViewProps> = ({
  packages,
  selectedPackage: initialPkg,
  onSelectPackageToEdit,
  onClose,
  onSaved,
  onStartSimulation,
  onShareTest
}) => {
  // Title & Description state
  const [title, setTitle] = useState(initialPkg.title);
  const [shortDescription, setShortDescription] = useState(initialPkg.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(initialPkg.fullDescription || '');
  const [targetAudience, setTargetAudience] = useState(initialPkg.targetAudience || '');
  // Dynamic Instructions List state
  const [instructionsList, setInstructionsList] = useState<string[]>(() => {
    if (initialPkg.instructions && initialPkg.instructions.length > 0) {
      return [...initialPkg.instructions];
    }
    return [
      'Bacalah petunjuk soal dengan teliti sebelum menjawab.',
      'Kerjakan secara mandiri tanpa bantuan pihak ketiga.',
      'Pastikan koneksi internet Anda stabil selama ujian.'
    ];
  });

  const handleInstructionChange = (index: number, val: string) => {
    setInstructionsList(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddInstruction = () => {
    setInstructionsList(prev => [...prev, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructionsList(prev => prev.filter((_, i) => i !== index));
  };

  // Duration state
  const [durationMinutes, setDurationMinutes] = useState(initialPkg.durationMinutes);

  // Anti-cheat & candidate randomization state
  const [randomizePerCandidate, setRandomizePerCandidate] = useState<boolean>(
    initialPkg.randomizePerCandidate ?? false
  );
  const [isExitLimitEnabled, setIsExitLimitEnabled] = useState<boolean>(
    initialPkg.maxSessionExits !== undefined
  );
  const [maxSessionExits, setMaxSessionExits] = useState<number>(
    initialPkg.maxSessionExits ?? 0
  );
  
  // Bank questions & selected question IDs
  const allBankQuestions = useMemo(() => {
    return initialPkg.questionBank && initialPkg.questionBank.length > 0 
      ? initialPkg.questionBank 
      : initialPkg.questions;
  }, [initialPkg]);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return initialPkg.selectedQuestionIds && initialPkg.selectedQuestionIds.length > 0
      ? initialPkg.selectedQuestionIds
      : initialPkg.questions.map(q => q.id);
  });

  // Filter & search state in question bank
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchBankQuery, setSearchBankQuery] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Add new question form toggle (Standard PG 4 Opsi)
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [newQuestionCategory, setNewQuestionCategory] = useState<TestCategory>('cognitive');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newScenario, setNewScenario] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newOptions, setNewOptions] = useState<QuestionOption[]>([
    { id: 'opt-a', label: 'A', text: '', score: 10 },
    { id: 'opt-b', label: 'B', text: '', score: 0 },
    { id: 'opt-c', label: 'C', text: '', score: 0 },
    { id: 'opt-d', label: 'D', text: '', score: 0 },
  ]);
  const [correctOptId, setCorrectOptId] = useState('opt-a');

  // Filtered bank questions
  const filteredBank = useMemo(() => {
    return allBankQuestions.filter((q) => {
      let matchCat = true;
      if (categoryFilter !== 'all') {
        matchCat = q.category === categoryFilter;
      }

      let matchType = true;
      if (typeFilter !== 'all') {
        if (typeFilter === 'disc') matchType = q.questionType === 'disc_quadrant';
        else if (typeFilter === 'mc4') matchType = q.questionType === 'multiple_choice_4' || q.questionType === 'multiple_choice';
      }

      let matchSearch = true;
      if (searchBankQuery.trim()) {
        const query = searchBankQuery.toLowerCase();
        matchSearch = 
          q.questionText.toLowerCase().includes(query) ||
          (q.scenario && q.scenario.toLowerCase().includes(query)) ||
          (q.tags && q.tags.some(t => t.toLowerCase().includes(query)));
      }

      return matchCat && matchType && matchSearch;
    });
  }, [allBankQuestions, categoryFilter, typeFilter, searchBankQuery]);

  // Toggle selection
  const handleToggleQuestion = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Batch actions
  const handleSelectAllFiltered = () => {
    const idsToAdd = filteredBank.map(q => q.id);
    setSelectedIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleSelectRandom = (count: number) => {
    const shuffled = [...allBankQuestions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(count, allBankQuestions.length));
    setSelectedIds(picked.map(q => q.id));
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan paket asesmen ini ke konfigurasi butir soal, durasi waktu, dan petunjuk bawaan standar?')) {
      resetPackageCustomization(initialPkg.id);
      setTitle(initialPkg.title);
      setShortDescription(initialPkg.shortDescription || '');
      setFullDescription(initialPkg.fullDescription || '');
      setTargetAudience(initialPkg.targetAudience || '');
      setInstructionsList(initialPkg.instructions && initialPkg.instructions.length > 0 ? [...initialPkg.instructions] : []);
      setDurationMinutes(initialPkg.durationMinutes);
      setSelectedIds(initialPkg.questions.map(q => q.id));
      setRandomizePerCandidate(false);
      setIsExitLimitEnabled(initialPkg.maxSessionExits !== undefined);
      setMaxSessionExits(initialPkg.maxSessionExits ?? 0);
      alert('Pengaturan tes berhasil direset ke standar bawaan.');
    }
  };

  // Save new custom question to bank (PG 4 Opsi)
  const handleSaveNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      alert('Harap isi teks pertanyaan.');
      return;
    }

    const newId = `custom-${initialPkg.id}-${Date.now()}`;
    const questionObj: TestQuestion = {
      id: newId,
      number: allBankQuestions.length + 1,
      category: newQuestionCategory,
      scenario: newScenario.trim() || undefined,
      questionText: newQuestionText.trim(),
      questionType: 'multiple_choice_4',
      options: newOptions.map((o) => ({
        ...o,
        score: o.id === correctOptId ? 10 : 0
      })),
      correctOptionId: correctOptId,
      explanation: newExplanation.trim() || undefined,
      tags: ['Kustom HR', CATEGORY_LABELS[newQuestionCategory] || newQuestionCategory, 'PG 4 Opsi']
    };

    saveCustomQuestionToBank(initialPkg.id, questionObj);
    setSelectedIds((prev) => [...prev, newId]);
    setShowAddQuestionForm(false);
    setNewQuestionText('');
    setNewScenario('');
    setNewExplanation('');
    alert('Soal PG 4 Opsi baru berhasil disimpan ke Bank Soal Terpadu dan otomatis terpilih!');
  };

  // Build customized package object
  const buildCustomizedPackage = (): TestPackage => {
    const selectedSet = new Set(selectedIds);
    const selectedQuestions = allBankQuestions
      .filter((q) => selectedSet.has(q.id))
      .map((q, idx) => ({ ...q, number: idx + 1 }));

    const isNew = initialPkg.id.startsWith('pkg-new-');
    const finalId = isNew ? `pkg-custom-${Date.now()}` : initialPkg.id;
    const finalSlug = isNew ? `custom-test-${Date.now()}` : initialPkg.slug;

    const parsedInstructions = instructionsList
      .map(s => s.trim())
      .filter(Boolean);

    return {
      ...initialPkg,
      id: finalId,
      slug: finalSlug,
      title: title.trim() || initialPkg.title,
      shortDescription: fullDescription.trim() || initialPkg.shortDescription || initialPkg.title,
      fullDescription: fullDescription.trim() || initialPkg.fullDescription,
      targetAudience: targetAudience.trim() || initialPkg.targetAudience,
      instructions: parsedInstructions.length > 0 ? parsedInstructions : initialPkg.instructions,
      durationMinutes,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions,
      questionBank: allBankQuestions,
      selectedQuestionIds: selectedIds,
      isCustomized: true,
      randomizePerCandidate,
      maxSessionExits: isExitLimitEnabled ? maxSessionExits : undefined
    };
  };

  // Save & Apply
  const handleSaveAndApply = () => {
    if (selectedIds.length === 0) {
      alert('Pilih minimal 1 butir soal untuk asesmen.');
      return;
    }

    const updated = buildCustomizedPackage();
    savePackage(updated);
    onSaved(updated);
    onClose();
  };

  const renderCategoryBadge = (cat?: TestCategory) => {
    const categoryKey = cat || 'personality';
    const label = CATEGORY_LABELS[categoryKey] || categoryKey;
    const colors = CATEGORY_BADGE_COLORS[categoryKey] || { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };

    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-in fade-in duration-150 pb-20">
      
      {/* Page Header */}
      <PageHeaderTitle
        title={initialPkg.id.startsWith('pkg-new-') ? "Buat Paket Asesmen Baru" : "Edit Paket Asesmen"}
        subtitle={initialPkg.id.startsWith('pkg-new-') ? "Atur nama, durasi, keracakan anti-curang, dan komposisi butir soal" : `Kustomisasi nama, durasi, dan komposisi butir soal untuk "${initialPkg.title}"`}
        onBack={onClose}
      />

      <DesktopHeaderActions>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={handleResetToDefault}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Standar</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAndApply}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{initialPkg.id.startsWith('pkg-new-') ? 'Simpan Paket Asesmen' : 'Simpan Perubahan'}</span>
        </button>
      </DesktopHeaderActions>

      <MobileHeaderActions>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleSaveAndApply}
          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
          title="Simpan"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
        </button>
      </MobileHeaderActions>

      {/* Main Full Page Form Content */}
      <div className="space-y-6">

        {/* SECTION 0: Identitas & Deskripsi Paket Tes (Langsung di Layout Utama) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Identitas &amp; Deskripsi Paket Tes Asesmen
            </h3>
          </div>

          {/* 1. Nama / Judul Paket */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nama / Judul Paket Tes <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Asesmen Komprehensif Staff & Spesialis"
              className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 2. Deskripsi Lengkap (Full width) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Deskripsi / Petunjuk Lengkap <span className="text-slate-400 font-normal">(Tampil pada modal info)</span>
            </label>
            <textarea
              rows={2}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Tuliskan deskripsi rinci dan petunjuk pelaksanaan tes..."
              className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3. Sasaran Posisi / Target Kandidat (Full width) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Sasaran Posisi / Target Kandidat
            </label>
            <textarea
              rows={2}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Contoh: Semua level calon karyawan & staf (Entry level, Spesialis, Supervisor)"
              className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 4. Petunjuk Pengerjaan Ujian (Paling Bawah - Dynamic Input List per Nomor) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="block text-xs font-bold text-slate-800">
                Petunjuk Pengerjaan Ujian <span className="text-slate-400 font-normal">(Dapat ditambah &amp; dihapus per nomor)</span>
              </label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
              >
                Tambah Petunjuk
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {instructionsList.map((inst, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-extrabold text-slate-500 shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={inst}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={`Petunjuk pengerjaan nomor ${index + 1}...`}
                    className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(index)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Hapus Petunjuk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {instructionsList.length === 0 && (
                <div className="p-3 text-center bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                  Belum ada petunjuk pengerjaan. Klik "Tambah Petunjuk" di atas.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: Pengaturan Pengerjaan Soal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Pengaturan Pengerjaan Soal
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Card 1: Durasi Waktu & Estimasi Per Soal */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-start space-y-3">
              <div className="flex items-center justify-between min-h-[24px]">
                <span className="text-xs font-bold text-slate-900 leading-snug">Durasi Tes (Waktu)</span>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                {/* Left: Duration Number Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    DURASI (MENIT)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(1, parseInt(e.target.value, 10) || 15))}
                    className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                </div>

                {/* Right: Symmetrical Read-only Box for Per-Question Time Estimate */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    EST. MENIT/SOAL
                  </label>
                  <div className="w-full text-xs font-bold text-blue-900 border border-slate-200 rounded-xl p-2 bg-slate-50 text-center select-none cursor-default">
                    {selectedIds.length > 0 ? (
                      (durationMinutes * 60) / selectedIds.length < 60
                        ? `${Math.round((durationMinutes * 60) / selectedIds.length)} Detik`
                        : `~${(durationMinutes / selectedIds.length).toFixed(1)} Menit`
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Acak Soal */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-start space-y-2.5">
              <div className="flex items-center justify-between gap-3 min-h-[24px]">
                <span className="text-xs font-bold text-slate-900 leading-snug">Acak Urutan Soal &amp; Opsi</span>
                <button
                  type="button"
                  onClick={() => setRandomizePerCandidate(!randomizePerCandidate)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    randomizePerCandidate ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  title={randomizePerCandidate ? "Nonaktifkan Acak Soal" : "Aktifkan Acak Soal"}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      randomizePerCandidate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Urutan nomor soal dan susunan pilihan A-D diacak otomatis untuk tiap kandidat.
              </p>
            </div>

            {/* Card 3: Batas Keluar Sesi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-start space-y-2.5">
              <div className="flex items-center justify-between gap-3 min-h-[24px]">
                <span className="text-xs font-bold text-slate-900 leading-snug">Batas Keluar Sesi / Tab</span>
                <button
                  type="button"
                  onClick={() => setIsExitLimitEnabled(!isExitLimitEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isExitLimitEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  title={isExitLimitEnabled ? "Nonaktifkan Batas Keluar" : "Aktifkan Batas Keluar Sesi"}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isExitLimitEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Toleransi kandidat keluar dari tab/layar browser selama ujian.
              </p>

              {isExitLimitEnabled && (
                <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                  <label className="text-[11px] font-semibold text-slate-700 shrink-0">Limit Exits:</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={maxSessionExits}
                    onChange={(e) => setMaxSessionExits(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-20 px-2.5 py-1 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-700 font-bold truncate">
                    {maxSessionExits === 0 ? '0 (Langsung Diakhiri)' : `${maxSessionExits}x Toleransi`}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 3: Form Tambah Butir Soal Baru (PG 4 Opsi) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tambah Butir Soal Kustom Baru (Format PG 4 Opsi)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddQuestionForm ? 'Sembunyikan Form' : 'Tulis Soal Baru'}</span>
            </button>
          </div>

          {showAddQuestionForm && (
            <form onSubmit={handleSaveNewQuestion} className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kategori Dimensi Asesmen *
                </label>
                <select
                  value={newQuestionCategory}
                  onChange={(e) => setNewQuestionCategory(e.target.value as TestCategory)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="cognitive">Logika &amp; Kognitif Analitis</option>
                  <option value="situational">Studi Kasus Etika Kerja (SJT)</option>
                  <option value="english">Bahasa Inggris Bisnis</option>
                  <option value="leadership">Kepemimpinan &amp; Manajemen</option>
                  <option value="personality">Kepribadian &amp; Perilaku</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pertanyaan / Instruksi Soal *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ketikkan teks pertanyaan di sini..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Opsi A - D */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">
                  Opsi Jawaban (Pilih Kunci Jawaban yang Benar):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {newOptions.map((opt, idx) => (
                    <div key={opt.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-opt"
                        checked={correctOptId === opt.id}
                        onChange={() => setCorrectOptId(opt.id)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        title="Tandai sebagai kunci jawaban benar"
                      />
                      <span className="font-extrabold text-xs text-slate-700 w-4">{opt.label}.</span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewOptions((prev) => prev.map((o) => o.id === opt.id ? { ...o, text: val } : o));
                        }}
                        placeholder={`Teks Opsi ${opt.label}...`}
                        className="flex-1 text-xs border-0 bg-transparent focus:outline-none focus:ring-0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionForm(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Simpan Soal Baru ke Bank
                </button>
              </div>
            </form>
          )}
        </div>

        {/* SECTION 4: Penyeleksian Butir Soal dari Bank Soal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pilih Komposisi Butir Soal dari Bank ({selectedIds.length} / {allBankQuestions.length} Terpilih)
              </span>
            </div>

            {/* Batch Selection Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Pilih Semua Sesuai Filter
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Kosongkan
              </button>
              <button
                type="button"
                onClick={() => handleSelectRandom(15)}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Acak 15 Soal
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchBankQuery}
                onChange={(e) => setSearchBankQuery(e.target.value)}
                placeholder="Cari butir soal di bank..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Semua Kategori ({allBankQuestions.length})</option>
              <option value="personality">Psikotes DISC</option>
              <option value="cognitive">Logika &amp; Kognitif</option>
              <option value="situational">Studi Kasus Etika (SJT)</option>
              <option value="english">Bahasa Inggris Bisnis</option>
              <option value="leadership">Kepemimpinan</option>
            </select>
          </div>

          {/* Question Checkboxes List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredBank.length > 0 ? (
              filteredBank.map((q, idx) => {
                const isSelected = selectedIds.includes(q.id);
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3 ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Question Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Checkbox for package selection */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleQuestion(q.id)}
                          className="w-4.5 h-4.5 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
                          title={isSelected ? "Batalkan pilihan soal ini" : "Pilih soal ini untuk paket tes"}
                        />

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-xs text-slate-800">
                              #{idx + 1}
                            </span>
                            {renderCategoryBadge(q.category)}
                            <span className="text-[11px] font-semibold text-slate-400">
                              {q.questionType === 'disc_quadrant' 
                                ? 'Kuadran DISC' 
                                : q.questionType === 'multiple_answers'
                                ? 'Multi Jawaban'
                                : q.questionType === 'essay' 
                                ? 'Esai' 
                                : 'Pilihan Ganda'}
                            </span>
                          </div>

                          <h4 
                            onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                            className="font-bold text-slate-900 text-sm leading-snug cursor-pointer hover:text-blue-600 transition-colors"
                          >
                            {q.questionText}
                          </h4>
                        </div>
                      </div>

                      {/* Top Right Action Icons: Delete & Expand/Collapse Chevron */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Apakah Anda yakin ingin menghapus butir soal ini dari bank soal?')) {
                              deleteQuestionFromBank(q.id);
                              setSelectedIds(prev => prev.filter(id => id !== q.id));
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Soal dari Bank"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title={isExpanded ? "Sembunyikan Opsi" : "Lihat Opsi & Kunci Jawaban"}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Scenario if present */}
                    {q.scenario && (
                      <div className="p-3 bg-slate-50 border-l-3 border-blue-500 rounded-r-xl text-xs text-slate-700 leading-relaxed font-sans italic">
                        <span className="font-bold text-slate-800 not-italic block mb-0.5">Skenario Situasi:</span>
                        {q.scenario}
                      </div>
                    )}

                    {/* Expanded Question Details (Options & Correct Key) */}
                    {isExpanded && (
                      <div className="pt-2 space-y-3 text-xs animate-in fade-in duration-100 border-t border-slate-100">
                        
                        {/* Options List */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isDisc = q.questionType === 'disc_quadrant';
                              const isMulti = q.questionType === 'multiple_answers';
                              const discCode = opt.discType || opt.discDimension || (optIdx === 0 ? 'D' : optIdx === 1 ? 'I' : optIdx === 2 ? 'S' : 'C');
                              const isCorrect = isMulti 
                                ? (q.correctOptionIds?.includes(opt.id) || (opt.score !== undefined && opt.score > 0))
                                : (!isDisc && (opt.id === q.correctOptionId || (opt.score !== undefined && opt.score > 0)));
                              const optionPrefix = isDisc 
                                ? `${discCode}.` 
                                : isMulti 
                                ? `${opt.label || (optIdx + 1)}.` 
                                : `${String.fromCharCode(65 + optIdx)}.`;

                              return (
                                <div
                                  key={opt.id || optIdx}
                                  className={`p-2.5 bg-slate-50 rounded-xl border text-slate-800 flex items-center justify-between gap-2.5 ${
                                    isCorrect ? 'border-green-300 bg-green-50/15' : 'border-slate-200/70'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <span className="font-bold text-slate-500 w-5 shrink-0">
                                      {optionPrefix}
                                    </span>
                                    <span className="flex-1 text-xs min-w-0 break-words">{opt.text}</span>
                                  </div>
                                  {isCorrect && (
                                    <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 shadow-3xs" title="Kunci Jawaban Benar">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Tags */}
                        {q.tags && q.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {q.tags.map((t, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Explanation if present */}
                        {q.explanation && (
                          <p className="text-[11px] text-slate-500 bg-blue-50/40 p-2.5 rounded-xl border border-blue-100">
                            <strong className="text-blue-900">Pembahasan:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Tidak ada soal yang sesuai filter pencarian.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 sm:px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg font-extrabold">
              {selectedIds.length} Soal Terpilih
            </span>
            <span>• Durasi {durationMinutes} Mnt</span>
            {randomizePerCandidate && <span>• Acak Per Kandidat</span>}
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Reset Standar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSaveAndApply}
              className="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan Perubahan Paket Soal</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
