import React from 'react';
import { Plus, Search, Loader2, Sparkles, Briefcase } from 'lucide-react';
import { IndexJobTemplate } from './types';
import { KatalogCardItem } from './katalog-card-item';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyJobdeskAnimation from '../../assets/animations/empty-jobdesk.json';

interface KatalogViewProps {
  templates: IndexJobTemplate[];
  isLoading: boolean;
  isLoadingDetail: boolean;
  onSelectTemplate: (template: IndexJobTemplate) => void;
  onAddPosition: () => void;
}

export const KatalogView: React.FC<KatalogViewProps> = ({
  templates,
  isLoading,
  isLoadingDetail,
  onSelectTemplate,
  onAddPosition,
}) => {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-slate-600 font-medium">Memuat master template...</span>
        </div>
      ) : templates.length === 0 ? (
        <div className="mt-4">
          <InitialEmptyCard
            title="Bangun Struktur Job Desk Tim!"
            description="Tentukan tugas, tanggung jawab, dan kualifikasi untuk setiap posisi di perusahaan."
            buttonText="Buat Posisi Pertama"
            ButtonIcon={Briefcase}
            onAction={onAddPosition}
            animationData={emptyJobdeskAnimation}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((tpl, idx) => (
            <KatalogCardItem
              key={`${tpl.id}-${idx}`}
              template={tpl}
              onSelect={onSelectTemplate}
              disabled={isLoadingDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};

