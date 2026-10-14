import React, { useState } from 'react';
import { 
  CalendarDays, 
  X, 
  Info, 
  ShieldCheck, 
  Building2, 
  Headphones, 
  Stethoscope, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { ShiftPattern, AttendanceConfig, WorkShift } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button, Input } from '../../../components/ui';
import { getShiftBadgeClasses, getShiftBadgeStyle } from './utils-helper';
import { RotationTemplate } from './types';

export interface ModalPatternFormProps {
  isOpen: boolean;
  editingPattern: ShiftPattern | null;
  patternFormData: Partial<ShiftPattern>;
  setPatternFormData: React.Dispatch<React.SetStateAction<Partial<ShiftPattern>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  rotationTemplates: RotationTemplate[];
  selectedTemplateId: string;
  setSelectedTemplateId: React.Dispatch<React.SetStateAction<string>>;
  onApplyTemplate: (templateId: string) => void;
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
  hasPagiSiangMalam: boolean;
}

export function ModalPatternForm({
  isOpen,
  editingPattern,
  patternFormData,
  setPatternFormData,
  onClose,
  onSubmit,
  rotationTemplates,
  selectedTemplateId,
  setSelectedTemplateId,
  onApplyTemplate,
  activeConfig,
  availableShifts,
  hasPagiSiangMalam,
}: ModalPatternFormProps) {
  const [isPatternGuideOpen, setIsPatternGuideOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);

  const nonOffShifts = (activeConfig?.shifts || availableShifts).filter(s => !s.isOff && s.code?.toUpperCase() !== 'OFF');

  const handleClose = () => {
    setIsPatternGuideOpen(false);
    setIsTemplateDropdownOpen(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      contentClassName="sm:max-w-md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  {editingPattern ? 'Edit Pola Rotasi' : 'Buat Pola Rotasi'}
                </h3>
                {isPatternGuideOpen && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 animate-in fade-in duration-150">
                    Panduan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                Atur siklus & urutan pergantian shift harian
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => setIsPatternGuideOpen(!isPatternGuideOpen)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center border ${
                isPatternGuideOpen
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs hover:bg-blue-700'
                  : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isPatternGuideOpen ? "Tutup Panduan (Kembali ke Form)" : "Informasi & Panduan Pola Rotasi"}
            >
              <Info className="w-4 h-4" />
            </button>

            <button 
              type="button"
              onClick={handleClose} 
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup Modal"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Conditional Content: Guide View vs Form View */}
        {isPatternGuideOpen ? (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Guidelines Content */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 min-h-0 text-xs">
              {/* Highlight Banner */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-blue-950">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-blue-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-blue-950">
                      Panduan & Tata Cara Pola Rotasi
                    </h4>
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                      Pola rotasi mengatur urutan perputaran shift otomatis bagi karyawan operasional. Gunakan panduan ini jika Anda mengubah kode shift atau ingin menyusun urutan manual.
                    </p>
                  </div>
                </div>
              </div>

              {/* Standard Department Patterns */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-0.5">
                  Penerapan Pola Berdasarkan Departemen
                </h5>

                {/* Security */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-xs text-slate-900">Keamanan / Security / Satpam (24 Jam)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Didesain untuk operasional 24/7 nonstop. 
                    <br />
                    • Pola 8-Hari: <span className="font-bold text-slate-800">2 Pagi → 2 Siang → 2 Malam → 2 OFF</span>
                    <br />
                    • Pola 4-Hari: <span className="font-bold text-slate-800">1 Pagi → 1 Malam → 2 OFF</span>
                  </p>
                </div>

                {/* Produksi / Pabrik */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-bold text-xs text-slate-900">Produksi / Pabrik / Manufaktur</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Rotasi bertahap untuk menjaga ritme stamina kerja.
                    <br />
                    • Pola 12-Hari: <span className="font-bold text-slate-800">3 Pagi → 3 Siang → 3 Malam → 3 OFF</span>
                    <br />
                    • Pola Mingguan: 6 hari shift sama, 1 hari libur, minggu berikutnya berganti shift.
                  </p>
                </div>

                {/* Customer Support & Kasir */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-xs text-slate-900">Customer Support / Helpdesk / Kasir</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Ideal untuk operasional 2-shift layanan pelanggan.
                    <br />
                    • Pola 5-Hari: <span className="font-bold text-slate-800">2 Pagi → 2 Siang → 1 OFF</span>
                    <br />
                    • Pola Rotasi Bergantian: <span className="font-bold text-slate-800">Pagi → Siang → Pagi → Siang → OFF</span>
                  </p>
                </div>

                {/* Medis & Rumah Sakit */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-bold text-xs text-slate-900">Klinik / Rumah Sakit / Tenaga Medis</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Siklus 7-Hari berkesinambungan:
                    <br />
                    • Pola 7-Hari: <span className="font-bold text-slate-800">2 Pagi → 2 Siang → 1 Malam → 2 OFF</span>
                  </p>
                </div>
              </div>

              {/* Note if custom shift codes are used */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-[11px] text-amber-950 space-y-1">
                <span className="font-bold text-xs block text-amber-950">💡 Tips Kode Shift Custom:</span>
                <p className="leading-relaxed font-medium text-amber-900">
                  Jika kode shift utama diubah dari nama standar (<code className="bg-amber-100/80 px-1 py-0.5 rounded text-[10px] font-mono">PAGI</code>, <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[10px] font-mono">SIANG</code>, <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[10px] font-mono">MALAM</code>), opsi template otomatis tidak muncul di dropdown. Anda dapat dengan mudah menyusun pola rotasi apa pun secara manual dengan mengeklik tombol <span className="font-bold text-amber-950">+ Kode Shift</span> di form utama.
                </p>
              </div>
            </div>

            {/* Single Action Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
              <Button 
                type="button" 
                onClick={() => setIsPatternGuideOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Kembali ke Form Buat Pola
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Form Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 min-h-0 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pola</label>
                <Input 
                  required 
                  value={patternFormData.name || ''} 
                  onChange={e => setPatternFormData({...patternFormData, name: e.target.value})} 
                  placeholder="Pola Security 2-Shift" 
                />
              </div>
              
              {hasPagiSiangMalam && (
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Template Siklus Otomatis
                  </label>
                  
                  {/* Dropdown Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 flex items-center justify-between cursor-pointer select-none text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className={selectedTemplateId ? "font-semibold text-slate-900 animate-fade-in" : "text-slate-400"}>
                        {selectedTemplateId ? (rotationTemplates.find(t => t.id === selectedTemplateId)?.label) : 'Pilih Template'}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isTemplateDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Custom Popup Menu */}
                  {isTemplateDropdownOpen && (
                    <>
                      {/* Backdrop for easy dismiss */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsTemplateDropdownOpen(false)} 
                      />
                      
                      <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-72 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* Reset option */}
                        <div className="p-1 border-b border-slate-100 bg-slate-50/50">
                          <button
                            type="button"
                            onClick={() => {
                              onApplyTemplate('');
                              setIsTemplateDropdownOpen(false);
                            }}
                            className="w-full text-left text-[11px] px-2.5 py-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition-all font-medium flex items-center justify-between"
                          >
                            <span>Tanpa Template (Pilih Manual)</span>
                            {!selectedTemplateId && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </button>
                        </div>

                        {/* List container */}
                        <div className="overflow-y-auto py-1 overscroll-contain max-h-56">
                          {(() => {
                            const grouped = rotationTemplates.reduce((acc: {[key: string]: RotationTemplate[]}, t) => {
                              if (!acc[t.group]) acc[t.group] = [];
                              acc[t.group].push(t);
                              return acc;
                            }, {});

                            return Object.entries(grouped).map(([groupName, templates]) => (
                              <div key={groupName} className="mb-2 last:mb-0">
                                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                                  {groupName}
                                </div>
                                <div className="space-y-0.5 px-1 mt-1">
                                  {templates.map((tmpl) => {
                                    const isSelected = selectedTemplateId === tmpl.id;
                                    return (
                                      <button
                                        key={tmpl.id}
                                        type="button"
                                        onClick={() => {
                                          onApplyTemplate(tmpl.id);
                                          setIsTemplateDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-2.5 py-2 rounded-md transition-all duration-150 flex flex-col gap-0.5 ${
                                          isSelected 
                                            ? 'bg-blue-50 hover:bg-blue-100/80 text-blue-900 border-l-2 border-blue-500 pl-2' 
                                            : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          <span className="text-xs font-semibold">{tmpl.label}</span>
                                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                        </div>
                                        <span className={`text-[10px] ${isSelected ? 'text-blue-700/80' : 'text-slate-400'}`}>
                                          {tmpl.description}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Premium Card Info */}
                  {selectedTemplateId && (() => {
                    const activeTmpl = rotationTemplates.find(t => t.id === selectedTemplateId);
                    if (!activeTmpl) return null;
                    
                    const bulletPoints = activeTmpl.description 
                      ? activeTmpl.description.split(',').map(item => item.trim()) 
                      : [];

                    return (
                      <div className="mt-3 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-xs">
                        <div className="text-center mb-3">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                            {activeTmpl.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Siklus Rotasi Terjadwal ({activeTmpl.days} Hari)
                          </p>
                        </div>
                        
                        <div className="border-t border-slate-200/60 my-2" />
                        
                        <ul className="space-y-2 mt-1 px-1">
                          {bulletPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed font-medium">
                              <span className="text-blue-600 font-bold text-sm shrink-0 leading-none select-none">•</span>
                              <span className="first-letter:uppercase">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  Siklus Rotasi
                  <span className="text-[10px] text-slate-400 font-normal">Klik untuk tambah</span>
                </label>
                <div className="flex gap-1.5 flex-wrap mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {nonOffShifts.map(s => (
                    <button 
                      type="button" 
                      key={s.id} 
                      onClick={() => {
                        setPatternFormData({...patternFormData, cycle: [...(patternFormData.cycle||[]), s.id]});
                        setSelectedTemplateId('');
                      }} 
                      style={getShiftBadgeStyle(s.color)}
                      className={`px-2 py-0.5 text-xs font-bold rounded border hover:opacity-80 transition-opacity cursor-pointer ${getShiftBadgeClasses(s.color)}`}
                    >
                      + {s.code}
                    </button>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => {
                      setPatternFormData({...patternFormData, cycle: [...(patternFormData.cycle||[]), 'OFF']});
                      setSelectedTemplateId('');
                    }} 
                    className="px-2 py-0.5 text-xs font-bold rounded border bg-rose-50 text-rose-700 border-rose-200 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    + OFF
                  </button>
                </div>

                <div className="min-h-[48px] p-2 border border-dashed border-slate-300 rounded-lg flex gap-1 flex-wrap items-center">
                  {(patternFormData.cycle || []).length === 0 && <span className="text-xs text-slate-400 italic">Belum ada siklus. Klik opsi di atas.</span>}
                  {(patternFormData.cycle || []).map((c, i) => {
                    const s = (activeConfig?.shifts || availableShifts).find(x => x.id === c);
                    const isOff = c === 'OFF' || s?.isOff || s?.code?.toUpperCase() === 'OFF';
                    const color = isOff ? 'rose' : (s?.color || 'blue');
                    const codeLabel = isOff ? 'OFF' : (s?.code || c);
                    return (
                      <div 
                        key={i} 
                        style={getShiftBadgeStyle(color)}
                        className={`flex items-center rounded border overflow-hidden text-xs ${getShiftBadgeClasses(color)}`}
                      >
                        <span className="px-1.5 py-0.5 font-bold border-r border-current/20 opacity-75 text-[10px]">{i+1}</span>
                        <span className="px-1.5 py-0.5 font-bold text-xs">
                          {codeLabel}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newC = [...(patternFormData.cycle||[])];
                            newC.splice(i, 1);
                            setPatternFormData({...patternFormData, cycle: newC});
                          }} 
                          className="px-1 py-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Single-Action Full-Width Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Simpan Pola
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
