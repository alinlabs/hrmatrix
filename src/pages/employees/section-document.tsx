import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { Input, Select, Button } from '../../components/ui';
import { Employee } from '../../types';

export interface DocumentSectionProps {
  formData: Partial<Employee>;
  availableDocSelectOptions: { value: string; label: string }[];
  handleUpdateDocName: (id: string, name: string) => void;
  handleUpdateDocUrl: (id: string, url: string) => void;
  handleRemoveDoc: (id: string) => void;
  handleAddDocRow: () => void;
}

export function DocumentSection({
  formData,
  availableDocSelectOptions,
  handleUpdateDocName,
  handleUpdateDocUrl,
  handleRemoveDoc,
  handleAddDocRow
}: DocumentSectionProps) {
  if (!formData.documents || formData.documents.length === 0) {
    return (
      <button
        type="button"
        onClick={handleAddDocRow}
        className="w-full py-6 px-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-center transition-all cursor-pointer group space-y-1 block focus:outline-none"
      >
        <p className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
          Belum ada berkas.
        </p>
        <p className="text-slate-500 text-xs font-normal">
          Klik untuk menambahkan berkas
        </p>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleAddDocRow}
        className="w-full py-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-blue-600 font-bold text-xs sm:text-sm transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 focus:outline-none"
      >
        <span>Tambah Berkas</span>
      </button>

      {formData.documents.map((doc) => {
        const hasUrl = Boolean(doc.url && doc.url.trim() !== '');

        const currentDocOptions = [...availableDocSelectOptions];
        if (doc.name && doc.name.trim() !== '' && !currentDocOptions.some(o => o.value.toLowerCase() === doc.name!.trim().toLowerCase())) {
          currentDocOptions.unshift({ value: doc.name.trim(), label: doc.name.trim() });
        }
        const docSelectOptions = currentDocOptions;

        return (
          <div 
            key={doc.id} 
            className="pb-4 border-b border-slate-200/70 last:border-b-0 last:pb-0 space-y-3"
          >
            {/* Row 1: Nama Berkas (Select with innerLabel) + Trash Button */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  innerLabel="Nama Berkas"
                  selectedTextColor="text-blue-700 font-bold text-xs sm:text-sm"
                  value={doc.name || ''}
                  onChange={(e) => handleUpdateDocName(doc.id, e.target.value)}
                  options={docSelectOptions}
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                title="Hapus berkas ini"
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-10 w-10 p-0 shrink-0 rounded-xl border border-slate-200/80" 
                onClick={() => handleRemoveDoc(doc.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Row 2: Link File (Input with innerLabel) + Tes Link Button */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  innerLabel="Link File"
                  value={doc.url || ''}
                  onChange={(e) => handleUpdateDocUrl(doc.id, e.target.value)}
                  placeholder=""
                  className={hasUrl ? 'text-blue-600 text-xs sm:text-sm font-semibold' : ''}
                />
              </div>

              {hasUrl && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
                  title="Buka Link Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tes Link</span>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
