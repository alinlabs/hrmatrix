import React, { useState, useEffect } from 'react';
import { Target, Trash2, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button, Input } from '../../components/ui';
import { ModalKPICatalogProps } from './types';

export function ModalKPICatalog({
  isOpen,
  onClose,
  editingTemplate,
  onSave,
  onDelete
}: ModalKPICatalogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minimumScore: 75,
    weight: 20,
    measurementBase: ''
  });

  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        name: editingTemplate.name,
        description: editingTemplate.description || '',
        minimumScore: editingTemplate.minimumScore !== undefined ? editingTemplate.minimumScore : (editingTemplate.targetDefault || 75),
        weight: editingTemplate.weight || 0,
        measurementBase: editingTemplate.measurementBase || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        minimumScore: 75,
        weight: 20,
        measurementBase: ''
      });
    }
  }, [editingTemplate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      minimumScore: Number(formData.minimumScore),
      weight: Number(formData.weight),
      measurementBase: formData.measurementBase.trim()
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        {/* 1. Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {editingTemplate ? 'Edit Indikator KPI Umum' : 'Tambah Indikator KPI Umum'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Master standar evaluasi kinerja universal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {editingTemplate && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingTemplate.id, editingTemplate.name);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus Indikator"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nama Indikator KPI <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Kehadiran & Kedisiplinan Jam Kerja"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Deskripsi & Tata Cara Penilaian
            </label>
            <textarea
              rows={3}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Penjelasan detail kriteria capaian target dan standar evaluasi skor..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Minimum Skor (0-100) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.minimumScore}
                onChange={(e) => setFormData({ ...formData, minimumScore: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Bobot KPI (%) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Dasar Ukur <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Rekap Presensi & Log Absensi Masuk/Pulang"
              value={formData.measurementBase}
              onChange={(e) => setFormData({ ...formData, measurementBase: e.target.value })}
              required
            />
          </div>
        </div>

        {/* 3. Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            {editingTemplate ? 'Simpan Perubahan' : 'Simpan Indikator'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
