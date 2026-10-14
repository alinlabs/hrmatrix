import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Chapter } from './ebook-types';
import { PANDUAN_CHAPTERS } from './ebook-data';
import { EbookChapterView } from './ebook-chapter-view';

interface EbookBookViewProps {
  readMode: 'slide' | 'scroll';
  activeChapter: Chapter;
  filteredChapters: Chapter[];
  completedChapters: string[];
  copiedFormula: string | null;
  onCopy: (text: string) => void;
  onNavigatePage: (path: string) => void;
  onToggleCompleted: (chapterId: string) => void;
  onJumpToFormula: (formulaId?: string) => void;
}

export function EbookBookView({
  readMode,
  activeChapter,
  filteredChapters,
  completedChapters,
  copiedFormula,
  onCopy,
  onNavigatePage,
  onToggleCompleted,
  onJumpToFormula,
}: EbookBookViewProps) {
  return (
    <div className="space-y-4">
      {/* Main Book Content (Full width without sidebar) */}
      <div className="w-full space-y-4">
        {readMode === 'slide' ? (
          /* Mode Slide per Bab */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <EbookChapterView 
                chapter={activeChapter} 
                onCopy={onCopy} 
                copiedFormula={copiedFormula}
                onNavigatePage={onNavigatePage}
                isCompleted={completedChapters.includes(activeChapter.id)}
                onToggleCompleted={() => onToggleCompleted(activeChapter.id)}
                onJumpToFormula={onJumpToFormula}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Mode Baca Full ke Bawah */
          <div className="space-y-6">
            <div className="pb-1 text-xs text-slate-500">
              Mode Baca Full ke Bawah &mdash; Seluruh {PANDUAN_CHAPTERS.length} Bab ditampilkan secara berurutan.
            </div>

            {filteredChapters.map((ch) => (
              <div key={ch.id} id={`chapter-${ch.id}`} className="pt-2">
                <EbookChapterView 
                  chapter={ch} 
                  onCopy={onCopy} 
                  copiedFormula={copiedFormula}
                  onNavigatePage={onNavigatePage}
                  isCompleted={completedChapters.includes(ch.id)}
                  onToggleCompleted={() => onToggleCompleted(ch.id)}
                  onJumpToFormula={onJumpToFormula}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
