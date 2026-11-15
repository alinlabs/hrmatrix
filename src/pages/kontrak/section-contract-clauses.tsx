import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ContractClause, ContractDocument } from './types';
import { generateDefaultClauses } from './contract-templates';

interface SectionContractClausesProps {
  doc: ContractDocument;
  onChange: (updated: ContractDocument) => void;
  expandedClauseId: string | null;
  setExpandedClauseId: (id: string | null) => void;
  onToggleClause: (clauseId: string) => void;
  onUpdateClause: (clauseId: string, updates: Partial<ContractClause>) => void;
}

export const SectionContractClauses: React.FC<SectionContractClausesProps> = ({
  doc,
  onChange,
  expandedClauseId,
  setExpandedClauseId,
  onToggleClause,
  onUpdateClause,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Daftar Pasal & Ketentuan Dokumen
        </span>
        <button
          type="button"
          onClick={() => {
            const refreshed = generateDefaultClauses(doc.contractType, doc);
            onChange({ ...doc, clauses: refreshed });
          }}
          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
        >
          Reset Pasal Standar
        </button>
      </div>

      <div className="space-y-2.5">
        {doc.clauses.map((clause, idx) => {
          const isExpanded = expandedClauseId === clause.id;

          return (
            <div 
              key={clause.id}
              className={`rounded-xl border transition-all ${
                clause.isEnabled 
                  ? 'border-slate-200 bg-white' 
                  : 'border-slate-200/60 bg-slate-50 opacity-60'
              }`}
            >
              <div className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={clause.isEnabled}
                    onChange={() => onToggleClause(clause.id)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Pasal {idx + 1}: {clause.titleId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3.5 pt-1 border-t border-slate-100 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Judul Pasal (Bahasa Indonesia):
                    </label>
                    <input
                      type="text"
                      value={clause.titleId}
                      onChange={(e) => onUpdateClause(clause.id, { titleId: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Isi Teks Pasal (Bahasa Indonesia):
                    </label>
                    <textarea
                      rows={4}
                      value={clause.contentId}
                      onChange={(e) => onUpdateClause(clause.id, { contentId: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 leading-relaxed font-sans"
                    />
                  </div>

                  {doc.languageMode !== 'id' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        Isi Teks Pasal (English Translation):
                      </label>
                      <textarea
                        rows={4}
                        value={clause.contentEn}
                        onChange={(e) => onUpdateClause(clause.id, { contentEn: e.target.value })}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 leading-relaxed font-sans"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
