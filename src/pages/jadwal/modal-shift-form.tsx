import React from 'react';
import { Clock, X, Sparkles } from 'lucide-react';
import { WorkShift } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button, Input, TimePickerInput } from '../../components/ui';
import { getShiftBadgeClasses, getShiftBadgeStyle } from './utils-helper';

export interface ModalShiftFormProps {
  isOpen: boolean;
  editingShift: WorkShift | null;
  shiftFormData: Partial<WorkShift>;
  setShiftFormData: React.Dispatch<React.SetStateAction<Partial<WorkShift>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ModalShiftForm({
  isOpen,
  editingShift,
  shiftFormData,
  setShiftFormData,
  onClose,
  onSubmit,
}: ModalShiftFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {editingShift ? 'Edit Shift Master' : 'Tambah Shift Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                {editingShift ? 'Ubah informasi jam kerja & aturan shift' : 'Buat master jam kerja shift baru'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button 
              type="button"
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto min-h-0 text-xs flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Shift</label>
              <Input 
                required 
                value={shiftFormData.code || ''} 
                onChange={e => setShiftFormData({...shiftFormData, code: e.target.value.toUpperCase()})} 
                placeholder="PAGI" 
                className="w-full text-xs" 
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Shift</label>
              <Input 
                required 
                value={shiftFormData.name || ''} 
                onChange={e => setShiftFormData({...shiftFormData, name: e.target.value})} 
                placeholder="Shift 1 (Pagi)" 
                className="w-full text-xs" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <TimePickerInput
                label="Jam Masuk"
                required
                value={shiftFormData.startTime || ''}
                onChange={val => setShiftFormData({...shiftFormData, startTime: val})}
              />
            </div>
            <div className="min-w-0">
              <TimePickerInput
                label="Jam Pulang"
                required
                value={shiftFormData.endTime || ''}
                onChange={val => setShiftFormData({...shiftFormData, endTime: val})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <TimePickerInput
                label="Mulai Istirahat"
                value={shiftFormData.breakStartTime || ''}
                onChange={val => setShiftFormData({...shiftFormData, breakStartTime: val})}
                placeholder="Pilih Jam (Opsional)"
              />
            </div>
            <div className="min-w-0">
              <TimePickerInput
                label="Selesai Istirahat"
                value={shiftFormData.breakEndTime || ''}
                onChange={val => setShiftFormData({...shiftFormData, breakEndTime: val})}
                placeholder="Pilih Jam (Opsional)"
              />
            </div>
          </div>

          {/* Automatic Cross-Midnight (Shift Lintas Hari) Detection Banner */}
          {Boolean(shiftFormData.startTime && shiftFormData.endTime && shiftFormData.endTime < shiftFormData.startTime) && (
            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs flex items-start gap-2 max-w-full">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-bold text-[11px] truncate">Terdeteksi: Shift Lintas Hari (Cross-Midnight)</p>
                <p className="text-[11px] text-purple-700 leading-tight mt-0.5">
                  Jam pulang ({shiftFormData.endTime}) lebih awal dari jam masuk ({shiftFormData.startTime}). Ditandai otomatis melewati tengah malam (+1 hari).
                </p>
              </div>
            </div>
          )}
          
          {/* Hex Color Picker */}
          <div className="max-w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Warna Label (Kode Hex)</span>
              <span className="text-[10px] text-slate-400 font-normal">Kustomisasi Warna Hex</span>
            </label>
            <div className="flex items-center gap-2 max-w-full">
              <div className="relative shrink-0">
                <input 
                  type="color" 
                  value={shiftFormData.color?.startsWith('#') ? shiftFormData.color : '#2563EB'} 
                  onChange={e => setShiftFormData({...shiftFormData, color: e.target.value})}
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white overflow-hidden shadow-2xs shrink-0"
                />
              </div>
              <Input 
                type="text" 
                value={shiftFormData.color || '#2563EB'} 
                onChange={e => setShiftFormData({...shiftFormData, color: e.target.value})} 
                placeholder="#2563EB"
                className="flex-1 text-xs font-mono uppercase min-w-0"
              />
            </div>
            
            {/* Palette Hex Presets */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2 max-w-full">
              {[
                { name: 'Biru', hex: '#2563EB' },
                { name: 'Hijau', hex: '#10B981' },
                { name: 'Kuning', hex: '#F59E0B' },
                { name: 'Ungu', hex: '#8B5CF6' },
                { name: 'Merah', hex: '#EF4444' },
                { name: 'Nila', hex: '#6366F1' },
                { name: 'Cyan', hex: '#0EA5E9' },
                { name: 'Pink', hex: '#EC4899' },
                { name: 'Teal', hex: '#14B8A6' },
                { name: 'Orange', hex: '#F97316' },
                { name: 'Slate', hex: '#64748B' },
              ].map(preset => (
                <button
                  type="button"
                  key={preset.hex}
                  onClick={() => setShiftFormData({...shiftFormData, color: preset.hex})}
                  title={`${preset.name} (${preset.hex})`}
                  className={`w-6 h-6 rounded-full border border-black/10 transition-all cursor-pointer hover:scale-110 shrink-0 ${
                    shiftFormData.color?.toLowerCase() === preset.hex.toLowerCase() ? 'ring-2 ring-offset-1 ring-blue-600 scale-110 shadow-xs' : ''
                  }`}
                  style={{ backgroundColor: preset.hex }}
                />
              ))}
            </div>

            {/* Badge Live Preview */}
            <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs max-w-full">
              <span className="text-slate-500 text-[11px] shrink-0">Preview Badge Shift:</span>
              <span 
                style={getShiftBadgeStyle(shiftFormData.color || '#2563EB')}
                className={`px-2 py-0.5 rounded text-xs font-bold border truncate ${getShiftBadgeClasses(shiftFormData.color as any)}`}
              >
                {shiftFormData.code || 'SHIFT'}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Single-Action Full-Width Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            Simpan Shift
          </Button>
        </div>
      </form>
    </Modal>
  );
}
