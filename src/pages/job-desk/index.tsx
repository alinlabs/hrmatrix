import React, { useState, useMemo } from 'react';
import { LayoutTemplate, PenLine } from 'lucide-react';
import { JobTemplate, IndexJobTemplate, ModalTab } from './types';
import { filterJobTemplates } from './utils-helper';
import { getStoredCustomTemplates, saveCustomTemplate, deleteCustomTemplate, convertToJobIndex } from './storage-helper';
import { db } from '../../db/database';
import { JobDeskHeader } from './header-job-desk';
import { KatalogView } from './view-katalog';
import { ModalTemplateDetail } from './modal-detail-template';
import { CreateJobDeskView } from './view-buat-job-desk';
import { ModalTemplateCatalog } from './modal-katalog-template';

export function JobDesk() {
  const [search, setSearch] = useState('');

  const initialCustom = useMemo(() => getStoredCustomTemplates(), []);
  const [baseIndexTemplates, setBaseIndexTemplates] = useState<IndexJobTemplate[]>([]);
  const [customIndexTemplates, setCustomIndexTemplates] = useState<IndexJobTemplate[]>(() =>
    initialCustom.map(convertToJobIndex)
  );
  const [templateCache, setTemplateCache] = useState<{
    custom?: JobTemplate[];
    masterMap?: Record<string, JobTemplate>;
  }>(() => ({
    custom: initialCustom,
  }));
  const [isLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<JobTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<JobTemplate | null>(null);
  const [isDetailFromModal, setIsDetailFromModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('seputar');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTemplateCatalogOpen, setIsTemplateCatalogOpen] = useState(false);

  const catalogPromiseRef = React.useRef<Promise<Record<string, JobTemplate>> | null>(null);

  const loadMasterCatalog = React.useCallback((): Promise<Record<string, JobTemplate>> => {
    if (templateCache.masterMap && Object.keys(templateCache.masterMap).length > 0) {
      return Promise.resolve(templateCache.masterMap);
    }
    if (!catalogPromiseRef.current) {
      catalogPromiseRef.current = import('../../data/jobs/index')
        .then(({ default: baseIndex, allTemplates }) => {
          const masterMap: Record<string, JobTemplate> = {};
          if (Array.isArray(allTemplates)) {
            allTemplates.forEach((t) => {
              if (t && t.id) {
                masterMap[t.id] = t;
              }
            });
          }
          setTemplateCache((prev) => ({
            ...prev,
            masterMap,
          }));
          setBaseIndexTemplates(baseIndex);
          return masterMap;
        })
        .catch((error) => {
          catalogPromiseRef.current = null;
          console.error('Failed to load job index:', error);
          return {};
        });
    }
    return catalogPromiseRef.current;
  }, [templateCache.masterMap]);

  const allIndexTemplates = useMemo(() => {
    const seen = new Set<string>();
    const combined: IndexJobTemplate[] = [];

    customIndexTemplates.forEach(t => {
      if (t && t.id && !seen.has(t.id)) {
        seen.add(t.id);
        combined.push(t);
      }
    });

    baseIndexTemplates.forEach(t => {
      if (t && t.id && !seen.has(t.id)) {
        seen.add(t.id);
        combined.push(t);
      }
    });

    return combined;
  }, [customIndexTemplates, baseIndexTemplates]);

  // Save New Custom Job Template
  const handleSaveNewTemplate = async (newTemplate: JobTemplate) => {
    saveCustomTemplate(newTemplate);

    try {
      await db.positions.put({
        id: newTemplate.id,
        name: newTemplate.nama,
        departmentId: newTemplate.departemen || 'General'
      });
    } catch (e) {
      console.error('Failed to sync to db.positions', e);
    }

    // Update Cache
    setTemplateCache(prev => {
      const existingCustom = prev.custom || [];
      return {
        ...prev,
        custom: [newTemplate, ...existingCustom.filter(t => t.id !== newTemplate.id)]
      };
    });

    // Update Index
    const newIndexItem = convertToJobIndex(newTemplate);
    setCustomIndexTemplates(prev => [newIndexItem, ...prev.filter(t => t.id !== newTemplate.id)]);

    // Automatically open the detail modal to preview the created position
    setSelectedRoleDetail(newTemplate);
    setActiveModalTab('seputar');
    setIsTemplateCatalogOpen(false); // Close catalog if open
  };

  // Use a Template -> Open CreateJobDeskView pre-populated with template data
  const handleUseTemplate = (template: JobTemplate) => {
    const templateDataForEdit: JobTemplate = {
      ...JSON.parse(JSON.stringify(template)),
      id: '', // Blank ID so saving creates a new position from template
    };
    setEditingTemplate(templateDataForEdit);
    setSelectedRoleDetail(null);
    setIsCreateModalOpen(true);
  };

  // Open Template Detail Modal
  const openRoleDetail = async (indexItem: IndexJobTemplate | any) => {
    // When viewing detail, close any background selector modals
    setIsTemplateCatalogOpen(false);

    if (indexItem.tanggungJawab) {
      setSelectedRoleDetail(indexItem as JobTemplate);
      setActiveModalTab('seputar');
      return;
    }

    // Check if it's a custom template
    if (indexItem.sourceFile === 'custom') {
      const customTemplates = templateCache.custom || getStoredCustomTemplates();
      const matched = customTemplates.find(t => t.id === indexItem.id);
      if (matched) {
        setSelectedRoleDetail(matched);
        setActiveModalTab('seputar');
        return;
      }
    }

    setIsLoadingDetail(true);
    try {
      const loadedMap = await loadMasterCatalog();
      const fullTemplate: JobTemplate | undefined = loadedMap[indexItem.id];

      if (fullTemplate) {
        setSelectedRoleDetail(fullTemplate);
        setActiveModalTab('seputar');
      } else {
        alert('Template lengkap tidak ditemukan untuk posisi ini.');
      }
    } catch (error) {
      console.error('Failed to fetch detail:', error);
      alert('Gagal memuat detail posisi.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Edit existing custom template
  const handleEditTemplate = (template: JobTemplate) => {
    setEditingTemplate(template);
    setSelectedRoleDetail(null);
    setIsCreateModalOpen(true);
  };

  // Delete existing custom template
  const handleDeleteTemplate = async (id: string) => {
    deleteCustomTemplate(id);

    try {
      await db.positions.delete(id);
    } catch (e) {
      console.error('Failed to delete from db.positions', e);
    }

    setTemplateCache(prev => {
      const existingCustom = prev.custom || [];
      return {
        ...prev,
        custom: existingCustom.filter(t => t.id !== id)
      };
    });
    setCustomIndexTemplates(prev => prev.filter(t => t.id !== id));
    setSelectedRoleDetail(null);
  };

  // Filtered Catalog (only custom templates)
  const filteredTemplates = useMemo(() => {
    return filterJobTemplates(customIndexTemplates, search);
  }, [customIndexTemplates, search]);

  const isMasterTemplateSelected = selectedRoleDetail && 
    baseIndexTemplates.some(t => t.id === selectedRoleDetail.id) &&
    !customIndexTemplates.some(t => t.id === selectedRoleDetail.id); // Show Use Template only for master templates not yet added exactly

  const isCustomOrExported = selectedRoleDetail && 
    customIndexTemplates.some(t => t.id === selectedRoleDetail.id);

  if (isCreateModalOpen) {
    return (
      <div className="w-full flex-1 flex flex-col">
        <CreateJobDeskView
          initialData={editingTemplate}
          onBack={() => {
            setIsCreateModalOpen(false);
            setEditingTemplate(null);
          }}
          onSave={(template) => {
            handleSaveNewTemplate(template);
            setIsCreateModalOpen(false);
            setEditingTemplate(null);
          }}
          indexTemplates={allIndexTemplates}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col space-y-3 sm:space-y-4">
      {/* Header Controls in Top Navigation Bar */}
      <JobDeskHeader
        search={search}
        onSearchChange={setSearch}
        onAddPosition={() => {
          setEditingTemplate(null);
          loadMasterCatalog();
          setIsCreateModalOpen(true);
        }}
      />

      {/* Action Card: Buat Dengan Template | Buat Jobdesk Manual */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-2xs">
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          {/* Buat Dengan Template Button */}
          <button
            type="button"
            onClick={() => {
              loadMasterCatalog();
              setIsTemplateCatalogOpen(true);
            }}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-emerald-700"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs shrink-0">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-emerald-700 transition-colors">
                Buat Dengan Template
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
                Katalog Standar Posisi
              </div>
            </div>
          </button>

          {/* Buat Jobdesk Manual Button */}
          <button
            type="button"
            onClick={() => {
              setEditingTemplate(null);
              loadMasterCatalog();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-blue-700"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs shrink-0">
              <PenLine className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-blue-700 transition-colors">
                Buat Jobdesk Manual
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
                Form Kosong Terstruktur
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Katalog View */}
      <KatalogView
        templates={filteredTemplates}
        isLoading={isLoading}
        isLoadingDetail={isLoadingDetail}
        onSelectTemplate={(tpl) => {
          setIsDetailFromModal(false);
          openRoleDetail(tpl);
        }}
        onAddPosition={() => {
          setEditingTemplate(null);
          loadMasterCatalog();
          setIsCreateModalOpen(true);
        }}
      />

      {/* Detail Modal Component */}
      <ModalTemplateDetail
        selectedRoleDetail={selectedRoleDetail}
        onClose={() => setSelectedRoleDetail(null)}
        activeModalTab={activeModalTab}
        setActiveModalTab={setActiveModalTab}
        indexTemplates={allIndexTemplates}
        onOpenRelatedRole={openRoleDetail}
        onUseTemplate={isMasterTemplateSelected ? handleUseTemplate : undefined}
        onEdit={handleEditTemplate}
        onDelete={isCustomOrExported ? handleDeleteTemplate : undefined}
        onBackToCatalog={isDetailFromModal ? () => {
          setSelectedRoleDetail(null);
          loadMasterCatalog();
          setIsTemplateCatalogOpen(true);
        } : undefined}
        isOpenedFromModal={isDetailFromModal}
      />

      {/* Master Template Catalog */}
      <ModalTemplateCatalog
        isOpen={isTemplateCatalogOpen}
        onClose={() => setIsTemplateCatalogOpen(false)}
        templates={baseIndexTemplates}
        onSelectTemplate={(tpl) => {
          setIsDetailFromModal(true);
          openRoleDetail(tpl);
        }}
        isLoadingDetail={isLoadingDetail}
      />
    </div>
  );
}

export default JobDesk;

