import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Tag,
  Pencil,
  Check
} from 'lucide-react';
import { TestQuestion, TestCategory, QuestionType, QuestionOption } from './types';
import { Modal } from '../../components/ui/Modal';
import { saveQuestionToBank } from './assessment-storage';

const INDONESIAN_STOP_WORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'atau', 'pada', 'adalah',
  'ini', 'itu', 'akan', 'dapat', 'bisa', 'agar', 'sebab', 'karena', 'jika', 'maka',
  'serta', 'saja', 'juga', 'oleh', 'secara', 'seperti', 'telah', 'sudah', 'dalam',
  'yaitu', 'ia', 'mereka', 'kami', 'kita', 'saya', 'anda', 'tersebut', 'ada',
  'tidak', 'bukan', 'hanya', 'harus', 'bahwa', 'pula', 'pun', 'antara', 'mengenai',
  'tentang', 'terhadap', 'hingga', 'sampai', 'yakni', 'sehingga', 'namun', 'tetapi',
  'melainkan', 'sambil', 'seraya', 'sewaktu', 'ketika', 'setelah', 'sebelum'
]);

function extractIndonesianKeywords(text: string): string[] {
  if (!text.trim()) return [];
  
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ');

  const words = cleaned.split(' ');
  const rawKeywords: string[] = [];

  words.forEach(word => {
    const trimmed = word.trim();
    if (trimmed.length <= 2) return;
    if (INDONESIAN_STOP_WORDS.has(trimmed)) return;

    let root = trimmed;
    // Strip common suffixes
    root = root.replace(/(nya|kan|an|lah|kah)$/g, '');
    // Strip common prefixes
    root = root.replace(/^(ber|me|di|ter|pe|se)/g, '');

    const finalWord = root.length >= 3 ? root : trimmed;
    if (finalWord.length >= 3 && !INDONESIAN_STOP_WORDS.has(finalWord)) {
      rawKeywords.push(finalWord);
    }
  });

  return Array.from(new Set(rawKeywords));
}

interface ModalCreateQuestionProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated: (newQuestion: TestQuestion) => void;
  questionToEdit?: TestQuestion | null;
  defaultPackageId?: string;
}

export const ModalCreateQuestion: React.FC<ModalCreateQuestionProps> = ({
  isOpen,
  onClose,
  onQuestionCreated,
  questionToEdit,
  defaultPackageId = 'executive-assessment'
}) => {
  const [category, setCategory] = useState<TestCategory>('cognitive');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [questionText, setQuestionText] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Multiple Choice Options State (Dynamic 2-8 options)
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: 'opt-a', label: 'A', text: '', score: 10 },
    { id: 'opt-b', label: 'B', text: '', score: 0 },
    { id: 'opt-c', label: 'C', text: '', score: 0 },
    { id: 'opt-d', label: 'D', text: '', score: 0 },
  ]);
  const [correctOptId, setCorrectOptId] = useState('opt-a');

  // Multi Jawaban Options State (Dynamic 2-8 options with numbers 1, 2, 3...)
  const [multiOptions, setMultiOptions] = useState<QuestionOption[]>([
    { id: 'multi-1', label: '1', text: '', score: 10 },
    { id: 'multi-2', label: '2', text: '', score: 10 },
    { id: 'multi-3', label: '3', text: '', score: 0 },
    { id: 'multi-4', label: '4', text: '', score: 0 },
  ]);
  const [correctMultiOptIds, setCorrectMultiOptIds] = useState<string[]>(['multi-1', 'multi-2']);

  // DISC Options State
  const [discOptions, setDiscOptions] = useState<QuestionOption[]>([
    { id: 'disc-d', label: 'A', text: '', discType: 'D', trait: 'Dominance' },
    { id: 'disc-i', label: 'B', text: '', discType: 'I', trait: 'Influence' },
    { id: 'disc-s', label: 'C', text: '', discType: 'S', trait: 'Steadiness' },
    { id: 'disc-c', label: 'D', text: '', discType: 'C', trait: 'Compliance' },
  ]);

  // Essay State
  const [essayAnswerText, setEssayAnswerText] = useState('');
  const [isKeywordEnabled, setIsKeywordEnabled] = useState(true);

  const detectedKeywords = useMemo(() => {
    return extractIndonesianKeywords(essayAnswerText);
  }, [essayAnswerText]);

  const [formError, setFormError] = useState('');

  // Populate form state when modal opens or questionToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (questionToEdit) {
        setCategory(questionToEdit.category || 'cognitive');
        setQuestionType(questionToEdit.questionType || 'multiple_choice');
        setQuestionText(questionToEdit.questionText || '');
        setTagsInput(questionToEdit.tags ? questionToEdit.tags.join(', ') : '');

        if (questionToEdit.questionType === 'disc_quadrant') {
          if (questionToEdit.options && questionToEdit.options.length > 0) {
            setDiscOptions(questionToEdit.options);
          }
        } else if (questionToEdit.questionType === 'multiple_answers') {
          if (questionToEdit.options && questionToEdit.options.length > 0) {
            setMultiOptions(questionToEdit.options);
          }
          if (questionToEdit.correctOptionIds && questionToEdit.correctOptionIds.length > 0) {
            setCorrectMultiOptIds(questionToEdit.correctOptionIds);
          } else if (questionToEdit.options) {
            setCorrectMultiOptIds(questionToEdit.options.filter(o => o.score !== undefined && o.score > 0).map(o => o.id));
          }
        } else if (questionToEdit.questionType === 'essay') {
          setEssayAnswerText(questionToEdit.essaySampleAnswer || '');
          setIsKeywordEnabled(questionToEdit.isKeywordEnabled !== false);
        } else {
          // Multiple choice
          if (questionToEdit.options && questionToEdit.options.length > 0) {
            setOptions(questionToEdit.options);
          }
          if (questionToEdit.correctOptionId) {
            setCorrectOptId(questionToEdit.correctOptionId);
          } else if (questionToEdit.options) {
            const correctOpt = questionToEdit.options.find(o => o.score !== undefined && o.score > 0);
            if (correctOpt) setCorrectOptId(correctOpt.id);
          }
        }
      } else {
        // Reset form for new question creation
        setCategory('cognitive');
        setQuestionType('multiple_choice');
        setQuestionText('');
        setTagsInput('');
        setOptions([
          { id: 'opt-a', label: 'A', text: '', score: 10 },
          { id: 'opt-b', label: 'B', text: '', score: 0 },
          { id: 'opt-c', label: 'C', text: '', score: 0 },
          { id: 'opt-d', label: 'D', text: '', score: 0 },
        ]);
        setCorrectOptId('opt-a');
        setMultiOptions([
          { id: 'multi-1', label: '1', text: '', score: 10 },
          { id: 'multi-2', label: '2', text: '', score: 10 },
          { id: 'multi-3', label: '3', text: '', score: 0 },
          { id: 'multi-4', label: '4', text: '', score: 0 },
        ]);
        setCorrectMultiOptIds(['multi-1', 'multi-2']);
        setDiscOptions([
          { id: 'disc-d', label: 'A', text: '', discType: 'D', trait: 'Dominance' },
          { id: 'disc-i', label: 'B', text: '', discType: 'I', trait: 'Influence' },
          { id: 'disc-s', label: 'C', text: '', discType: 'S', trait: 'Steadiness' },
          { id: 'disc-c', label: 'D', text: '', discType: 'C', trait: 'Compliance' },
        ]);
        setEssayAnswerText('');
        setIsKeywordEnabled(true);
      }
      setFormError('');
    }
  }, [isOpen, questionToEdit]);

  // Multiple Choice handlers
  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleAddOption = () => {
    if (options.length >= 8) return;
    const nextIdx = options.length;
    const nextLabel = String.fromCharCode(65 + nextIdx);
    const newOpt: QuestionOption = {
      id: `opt-${nextLabel.toLowerCase()}`,
      label: nextLabel,
      text: '',
      score: 0
    };
    setOptions(prev => [...prev, newOpt]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    const filtered = options.filter(o => o.id !== id);
    const reLabeled = filtered.map((o, idx) => ({
      ...o,
      label: String.fromCharCode(65 + idx)
    }));
    setOptions(reLabeled);
    if (correctOptId === id && reLabeled.length > 0) {
      setCorrectOptId(reLabeled[0].id);
    }
  };

  // Multi Jawaban handlers
  const handleMultiOptionTextChange = (id: string, text: string) => {
    setMultiOptions(prev => prev.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleAddMultiOption = () => {
    if (multiOptions.length >= 8) return;
    const nextIdx = multiOptions.length + 1;
    const newOpt: QuestionOption = {
      id: `multi-${nextIdx}`,
      label: String(nextIdx),
      text: '',
      score: 0
    };
    setMultiOptions(prev => [...prev, newOpt]);
  };

  const handleRemoveMultiOption = (id: string) => {
    if (multiOptions.length <= 2) return;
    const filtered = multiOptions.filter(o => o.id !== id);
    const reLabeled = filtered.map((o, idx) => ({
      ...o,
      label: String(idx + 1)
    }));
    setMultiOptions(reLabeled);
    setCorrectMultiOptIds(prev => prev.filter(item => item !== id));
  };

  const handleToggleCorrectMultiOpt = (id: string) => {
    setCorrectMultiOptIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // DISC handler
  const handleDiscTextChange = (id: string, text: string) => {
    setDiscOptions(prev => prev.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!questionText.trim()) {
      setFormError('Silakan isi pertanyaan / butir soal.');
      return;
    }

    let finalOptions: QuestionOption[] = [];
    let essayKeywords: string[] | undefined = undefined;

    if (questionType === 'disc_quadrant') {
      const emptyDisc = discOptions.some(o => !o.text.trim());
      if (emptyDisc) {
        setFormError('Lengkapi keempat pilihan pernyataan untuk kuadran DISC (D, I, S, C).');
        return;
      }
      finalOptions = discOptions;
    } else if (questionType === 'multiple_choice' || questionType === 'multiple_choice_4') {
      const emptyOpts = options.some(o => !o.text.trim());
      if (emptyOpts) {
        setFormError('Lengkapi teks untuk setiap opsi pilihan ganda yang disediakan.');
        return;
      }
      finalOptions = options.map(opt => ({
        ...opt,
        score: opt.id === correctOptId ? 10 : 0
      }));
    } else if (questionType === 'multiple_answers') {
      const emptyOpts = multiOptions.some(o => !o.text.trim());
      if (emptyOpts) {
        setFormError('Lengkapi teks untuk setiap opsi nomor Multi Jawaban yang disediakan.');
        return;
      }
      if (correctMultiOptIds.length === 0) {
        setFormError('Pilih minimal 1 atau 2 nomor opsi sebagai kunci jawaban yang benar.');
        return;
      }
      finalOptions = multiOptions.map(opt => ({
        ...opt,
        score: correctMultiOptIds.includes(opt.id) ? 10 : 0
      }));
    } else if (questionType === 'essay') {
      if (!essayAnswerText.trim()) {
        setFormError('Harap isi kolom Jawaban acuan dari HR.');
        return;
      }
      essayKeywords = isKeywordEnabled ? detectedKeywords : undefined;
    }

    const targetId = questionToEdit ? questionToEdit.id : `custom-bank-${Date.now()}`;
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const savedQuestion: TestQuestion = {
      id: targetId,
      number: questionToEdit ? questionToEdit.number : 1,
      category,
      questionText: questionText.trim(),
      questionType,
      options: finalOptions,
      correctOptionId: (questionType === 'multiple_choice' || questionType === 'multiple_choice_4') ? correctOptId : undefined,
      correctOptionIds: questionType === 'multiple_answers' ? correctMultiOptIds : undefined,
      essayKeywords,
      essaySampleAnswer: questionType === 'essay' ? essayAnswerText.trim() : undefined,
      isKeywordEnabled: questionType === 'essay' ? isKeywordEnabled : undefined,
      tags: tags.length > 0 ? tags : ['HRMatrix Bank'],
      difficulty: questionToEdit?.difficulty || 'Sedang'
    };

    // Save to localStorage bank (handles edit or create)
    saveQuestionToBank(savedQuestion);

    // Callback to parent view
    onQuestionCreated(savedQuestion);

    // Reset form
    setQuestionText('');
    setEssayAnswerText('');
    setTagsInput('');
    setFormError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-2xl max-h-[92vh] flex flex-col"
    >
      <div 
        className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              {questionToEdit ? <Pencil className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {questionToEdit ? 'Edit Butir Soal' : 'Buat Butir Soal Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {questionToEdit 
                  ? 'Perbarui pertanyaan, opsi jawaban, dan kunci acuan di Bank Soal HRMatrix' 
                  : 'Tambahkan pertanyaan & kunci acuan ke Bank Soal HRMatrix'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {formError}
            </div>
          )}

          {/* Kategori & Tipe Soal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kategori Soal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TestCategory)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="personality">Psikotes & DISC</option>
                <option value="cognitive">Logika & Kognitif (TPA)</option>
                <option value="situational">Studi Kasus & Etika (SJT)</option>
                <option value="language">Bahasa Inggris Bisnis</option>
                <option value="leadership">Kepemimpinan & Manajerial</option>
                <option value="technical">Keahlian Teknis</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Format / Tipe Jawaban <span className="text-red-500">*</span>
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
              >
                <option value="disc_quadrant">Kuadran DISC (Paling &amp; Kurang)</option>
                <option value="multiple_choice">Pilihan Ganda (Tunggal: A, B, C, D...)</option>
                <option value="multiple_answers">Multi Jawaban (Nomor 1, 2, 3... Kunci &gt; 1)</option>
                <option value="essay">Esai (Prediksi Match Kata Kunci)</option>
              </select>
            </div>
          </div>

          {/* Teks Pertanyaan Utama */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Pertanyaan / Butir Soal <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Tuliskan pertanyaan lengkap, instruksi tugas, atau skenario studi kasus di sini..."
              className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
            />
          </div>

          {/* DYNAMIC FORM SECTION BASED ON QUESTION TYPE */}

          {/* 1. PILIHAN GANDA (2 - 8 OPS) */}
          {(questionType === 'multiple_choice' || questionType === 'multiple_choice_4') && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-800">
                  Opsi Pilihan Ganda ({options.length} Opsi) - Klik Huruf untuk Kunci Jawaban Benar
                </label>
                {options.length < 8 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Opsi ({String.fromCharCode(65 + options.length)})</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectOptId(opt.id)}
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        correctOptId === opt.id 
                          ? 'bg-emerald-600 text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={correctOptId === opt.id ? 'Kunci Jawaban Benar' : 'Pilih sebagai kunci jawaban'}
                    >
                      {opt.label}
                    </button>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                      placeholder={`Opsi Pilihan ${opt.label}...`}
                      className="flex-1 text-xs border border-slate-200 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {correctOptId === opt.id && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg shrink-0">
                        ✓ Kunci Jawaban
                      </span>
                    )}

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Hapus opsi ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. MULTI JAWABAN (NOMOR 1, 2, 3... KUNCI JAWABAN BISA > 1) */}
          {questionType === 'multiple_answers' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-slate-800">
                    Opsi Multi Jawaban ({multiOptions.length} Opsi) - Klik Nomor untuk Memilih Kunci Jawaban Benar
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Bisa memilih 2 atau lebih jawaban yang benar. Nomor hijau menandakan kunci jawaban aktif ({correctMultiOptIds.length} terpilih).
                  </p>
                </div>
                {multiOptions.length < 8 && (
                  <button
                    type="button"
                    onClick={handleAddMultiOption}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Opsi ({multiOptions.length + 1})</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {multiOptions.map((opt) => {
                  const isSelected = correctMultiOptIds.includes(opt.id);
                  return (
                    <div key={opt.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCorrectMultiOpt(opt.id)}
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-green-600 text-white shadow-2xs' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={isSelected ? 'Kunci Jawaban Benar (Klik untuk batal)' : 'Pilih sebagai kunci jawaban'}
                      >
                        {opt.label}
                      </button>

                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleMultiOptionTextChange(opt.id, e.target.value)}
                        placeholder={`Teks Opsi Pilihan Nomor ${opt.label}...`}
                        className="flex-1 text-xs border border-slate-200 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {isSelected && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg shrink-0">
                          ✓ Kunci Benar
                        </span>
                      )}

                      {multiOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMultiOption(opt.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Hapus opsi ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. KUADRAN DISC */}
          {questionType === 'disc_quadrant' && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-800">
                Pernyataan Karakter Kerja DISC (D, I, S, C)
              </label>

              <div className="space-y-2">
                {discOptions.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="w-8 h-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {opt.discType}
                    </span>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleDiscTextChange(opt.id, e.target.value)}
                      placeholder={`Pernyataan tipe ${opt.trait} (${opt.discType})...`}
                      className="flex-1 text-xs border border-slate-200 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ESAI (JAWABAN & DETEKSI KEYWORD) */}
          {questionType === 'essay' && (
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              {/* Single Input Field: Jawaban */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  Jawaban <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={essayAnswerText}
                  onChange={(e) => setEssayAnswerText(e.target.value)}
                  placeholder="Tuliskan jawaban di sini secara deskriptif..."
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Tuliskan jawaban acuan dari HR di sini secara deskriptif.
                </span>
              </div>

              {/* Seekbar / Toggle Switch: Aktifkan Keyword */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Aktifkan Keyword (Deteksi Kata Kunci)
                  </span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {isKeywordEnabled
                      ? 'Mendeteksi kata kunci utama & mengabaikan kata penghubung/imbuhan ("yang", "dan", dll.).'
                      : 'Keyword nonaktif: Jawaban kandidat harus 100% persis sama dengan teks Jawaban di atas.'}
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsKeywordEnabled(!isKeywordEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isKeywordEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  title={isKeywordEnabled ? 'Nonaktifkan Keyword' : 'Aktifkan Keyword'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isKeywordEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card Container for Detected Keywords when Toggle ON */}
              {isKeywordEnabled && (
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-bold text-blue-900">
                        Kata Kunci Terdeteksi Otomatis ({detectedKeywords.length} Kata)
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                      Mengecualikan Kata Penghubung &amp; Imbuhan
                    </span>
                  </div>

                  {/* Card input-like container displaying keywords */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200/90 shadow-2xs min-h-[50px] flex items-center">
                    {detectedKeywords.length > 0 ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {detectedKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold border border-blue-200 shadow-2xs flex items-center gap-1"
                          >
                            <span>#{kw}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Ketikkan jawaban deskriptif pada kolom Jawaban di atas untuk mendeteksi kata kunci secara otomatis...
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-blue-800/80 pt-1 leading-relaxed">
                    💡 <strong>Mekanisme Penilaian:</strong> Hasil jawaban kandidat tidak harus persis sama, melainkan diukur berdasarkan kesamaan persentase kata kunci terdeteksi di atas untuk menentukan nilainya.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tag / Kata Kunci */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Tag / Kata Kunci <span className="text-slate-400 font-normal">(Pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Contoh: Logika Analitis, Kepemimpinan, Problem Solving"
              className="w-full text-xs border border-slate-200 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              {questionToEdit ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{questionToEdit ? 'Simpan Perubahan Soal' : 'Simpan Soal ke Bank'}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
