import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { db } from '../../db/database';
import { PayrollRule } from '../../types';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';
import { PageHeaderTitle, MobileHeaderActions, DesktopHeaderActions, PageHeaderSearch } from '../../context/MobileNavContext';

import { KompensasiTab, ViewMode } from './types';
import { calculateKompensasiStats, getRuleCategoryGroup, matchPayrollRuleExhaustive } from './utils-helper';
import { KompensasiHeader } from './kompensasi-header';
import { KompensasiCardView } from './kompensasi-card-view';
import { KompensasiTableView } from './kompensasi-table-view';
import { ModalAddKompensasiMenu } from './modal-add-kompensasi-menu';
import { ModalRuleDetail } from './modal-rule-detail';

export interface KompensasiCenterProps {
  fixedTab?: KompensasiTab;
  hideTabs?: boolean;
  backTo?: string;
}

export function KompensasiCenter({
  fixedTab,
  hideTabs = false,
  backTo = '/payroll'
}: KompensasiCenterProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tab State (3 Tabs: Tunjangan, BPJS, Pajak)
  const tabParam = searchParams.get('tab');
  const validTabs: KompensasiTab[] = ['tunjangan', 'jaminan', 'pajak'];
  const activeTab: KompensasiTab = fixedTab || (validTabs.includes(tabParam as any) ? (tabParam as KompensasiTab) : 'tunjangan');

  const handleTabChange = (tab: KompensasiTab) => {
    setSearchParams({ tab });
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [groupFilter, setGroupFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Modal States
  const [selectedRuleForDetail, setSelectedRuleForDetail] = useState<PayrollRule | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Live Query from DB
  const rawRules = useLiveQuery(() => db.payrollRules.toArray(), []) || [];
  const rules = useMemo(() => {
    return rawRules.length > 0 ? rawRules : DEFAULT_PAYROLL_RULES;
  }, [rawRules]);

  // Overall Stats
  const stats = useMemo(() => calculateKompensasiStats(rules), [rules]);

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      // 1. Tab filter
      if (activeTab === 'tunjangan') {
        if (r.category !== 'Allowance' && r.category !== 'Deduction') return false;
      } else if (activeTab === 'jaminan') {
        if (r.category !== 'BPJS Health' && r.category !== 'BPJS Employment' && r.category !== 'BPJS') return false;
      } else if (activeTab === 'pajak') {
        if (r.category !== 'Tax') return false;
      }

      // 2. Sub-group filter (for Tunjangan)
      if (groupFilter !== 'all' && activeTab === 'tunjangan') {
        const grp = getRuleCategoryGroup(r).type;
        if (groupFilter === 'tetap' && grp !== 'tunjangan_tetap') return false;
        if (groupFilter === 'tidak_tetap' && grp !== 'tunjangan_tidak_tetap') return false;
        if (groupFilter === 'bonus' && grp !== 'bonus_insentif') return false;
      }

      // 3. Search query filter using Exhaustive Deep Filtering (Tipe A: Card List)
      if (searchQuery.trim() !== '') {
        return matchPayrollRuleExhaustive(r, searchQuery);
      }

      return true;
    });
  }, [rules, activeTab, groupFilter, searchQuery]);

  // Open Handlers
  const handleOpenDetail = (rule: PayrollRule) => {
    setSelectedRuleForDetail(rule);
    setIsDetailModalOpen(true);
  };

  const handleOpenEdit = (rule: PayrollRule) => {
    setIsDetailModalOpen(false);
    navigate(`/kompensasi/edit/${rule.id}`);
  };

  const handleDeleteRule = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aturan "${name}"?`)) {
      try {
        await db.payrollRules.delete(id);
        setIsDetailModalOpen(false);
      } catch (err) {
        console.error('Failed to delete rule:', err);
        alert('Gagal menghapus aturan.');
      }
    }
  };

  const handlePlusClick = () => {
    if (fixedTab === 'tunjangan') {
      navigate('/kompensasi/add/tunjangan');
    } else if (fixedTab === 'jaminan') {
      navigate('/kompensasi/add/jaminan');
    } else if (fixedTab === 'pajak') {
      navigate('/kompensasi/add/pajak');
    } else {
      setIsAddMenuOpen(true);
    }
  };

  // Header Action Buttons (Search Icon & Plus Card)
  const headerActionButtons = (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* 1. Search Icon (Clean minimalist without card background) */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        title="Cari Kompensasi"
        aria-label="Cari Kompensasi"
        className={`p-1.5 sm:p-2 text-slate-500 hover:text-blue-600 active:scale-95 transition-all cursor-pointer flex items-center justify-center relative ${
          searchQuery ? 'text-blue-600' : ''
        }`}
      >
        <Search className="w-5 h-5 stroke-[2]" />
        {searchQuery && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* 2. Plus Icon Card */}
      <button
        type="button"
        onClick={handlePlusClick}
        title="Tambah Kompensasi"
        aria-label="Tambah Kompensasi"
        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg flex items-center justify-center shadow-xs transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );

  // Standardized Header Title, Subtitle, & Contextual Search Placeholder based on Active Tab (SPEC_HEADER_PAGE Strict <= 30 Chars)
  const { headerTitle, headerSubtitle, searchPlaceholder } = useMemo(() => {
    switch (activeTab) {
      case 'jaminan':
        return {
          headerTitle: 'BPJS',
          headerSubtitle: 'Regulasi iuran BPJS Kes & TK',
          searchPlaceholder: 'Cari BPJS, iuran, persentase, kontributor, atau regulasi...',
        };
      case 'pajak':
        return {
          headerTitle: 'Pajak PPh 21',
          headerSubtitle: 'Regulasi tarif PPh 21 & TER',
          searchPlaceholder: 'Cari tarif TER, status PTKP, lapisan Pasal 17, atau regulasi...',
        };
      case 'tunjangan':
      default:
        return {
          headerTitle: 'Tunjangan',
          headerSubtitle: 'Aturan tunjangan & insentif',
          searchPlaceholder: 'Cari tunjangan, bonus, insentif, nominal, atau frekuensi...',
        };
    }
  }, [activeTab]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Standardized Header Title with Back Button */}
      <PageHeaderTitle 
        title={headerTitle} 
        subtitle={headerSubtitle} 
        onBack={() => navigate(backTo)}
        hideHamburger={true}
      />

      {/* Standardized Header Search Bar (Tipe A: Card List Filtering) */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          placeholder={searchPlaceholder}
        />
      )}

      {/* Action Header Subbar Icons */}
      <MobileHeaderActions>{headerActionButtons}</MobileHeaderActions>
      <DesktopHeaderActions>{headerActionButtons}</DesktopHeaderActions>

      {/* Navigation & Filters Header (only if not standalone page) */}
      {!hideTabs && (
        <KompensasiHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      {/* Content Container */}
      <div className={`${hideTabs ? 'mt-1 sm:mt-2' : '-mt-1 sm:-mt-2 md:-mt-3.5'} space-y-4`}>
        {/* Card Grid View */}
        <KompensasiCardView
          rules={filteredRules}
          activeTab={activeTab}
          viewMode={viewMode}
          searchQuery={searchQuery}
          onOpenDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteRule}
          onAddRule={handlePlusClick}
        />

        {/* Table Data View */}
        <KompensasiTableView
          rules={filteredRules}
          activeTab={activeTab}
          viewMode={viewMode}
          onOpenDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteRule}
        />
      </div>

      {/* Modal Detail View */}
      <ModalRuleDetail
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        rule={selectedRuleForDetail}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteRule}
      />

      {/* Modal Add Menu Selection */}
      <ModalAddKompensasiMenu
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
      />
    </div>
  );
}

export function PayrollTunjanganPage() {
  return <KompensasiCenter fixedTab="tunjangan" hideTabs={true} backTo="/payroll" />;
}

export function PayrollBPJSPage() {
  return <KompensasiCenter fixedTab="jaminan" hideTabs={true} backTo="/payroll" />;
}

export function PayrollPajakPage() {
  return <KompensasiCenter fixedTab="pajak" hideTabs={true} backTo="/payroll" />;
}

export default KompensasiCenter;
