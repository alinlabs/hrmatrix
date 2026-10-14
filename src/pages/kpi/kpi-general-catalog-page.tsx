import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { KPITemplate } from './types';
import { ensureKPIRulesAndTemplates } from '../../services/kpiService';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  useMobileNav 
} from '../../context/MobileNavContext';
import { Target, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useCompany } from '../../context/CompanyContext';
import { CardKPICatalogItem } from './card-kpi-catalog-item';
import { ModalKPICatalog } from './modal-kpi-catalog';

export function KPIGeneralCatalogPage() {
  const navigate = useNavigate();
  const { requireCompanyRegistration } = useCompany();
  const { setHideBottomNav } = useMobileNav();

  // Hide mobile bottom navigation on KPI General Catalog page
  useEffect(() => {
    setHideBottomNav(true);
    return () => {
      setHideBottomNav(false);
    };
  }, [setHideBottomNav]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<KPITemplate | null>(null);

  // Ensure default general KPI templates exist in database
  useEffect(() => {
    ensureKPIRulesAndTemplates().catch(console.error);
  }, []);

  // Query templates from IndexedDB
  const allTemplates = useLiveQuery(
    () => db.kpiTemplates.toArray(),
    []
  ) || [];

  // Filter for General KPIs
  const generalTemplates = useMemo(() => {
    return allTemplates.filter(t => t.category === 'Umum' || t.isGeneral || !t.category);
  }, [allTemplates]);

  const handleOpenAddModal = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tpl: KPITemplate) => {
    setEditingTemplate(tpl);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: {
    name: string;
    description: string;
    minimumScore: number;
    weight: number;
    measurementBase: string;
  }) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk mengelola katalog KPI Umum.'
    })) {
      return;
    }

    if (!formData.name.trim()) return;

    if (editingTemplate) {
      await db.kpiTemplates.update(editingTemplate.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        minimumScore: Number(formData.minimumScore),
        weight: Number(formData.weight),
        measurementBase: formData.measurementBase.trim(),
        category: 'Umum',
        isGeneral: true,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    } else {
      const newId = `tpl-gen-${uuidv4().slice(0, 8)}`;
      await db.kpiTemplates.add({
        id: newId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        minimumScore: Number(formData.minimumScore),
        weight: Number(formData.weight),
        measurementBase: formData.measurementBase.trim(),
        category: 'Umum',
        isGeneral: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Daftarkan profil perusahaan Anda terlebih dahulu untuk menghapus indikator KPI.'
    })) {
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus indikator KPI Umum "${name}"?`)) {
      await db.kpiTemplates.delete(id);
      setIsModalOpen(false);
    }
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        type="button"
        onClick={handleOpenAddModal}
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
        title="Tambah Indikator KPI Umum Baru"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <PageHeaderTitle 
        title="Katalog KPI Umum" 
        subtitle="Master Indikator Kinerja Karyawan" 
        onBack={() => navigate('/kpi')}
        hideHamburger={false}
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* Grid Cards of KPI Umum */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generalTemplates.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 shadow-2xs">
            <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-800">Tidak ada Indikator KPI Umum ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">
              Klik tombol "+" untuk menambahkan indikator baru.
            </p>
          </div>
        ) : (
          generalTemplates.map((tpl) => (
            <CardKPICatalogItem
              key={tpl.id}
              template={tpl}
              onEdit={handleOpenEditModal}
            />
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <ModalKPICatalog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTemplate={editingTemplate}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
