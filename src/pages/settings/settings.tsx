import React, { useState, useEffect, useRef } from 'react';
import { useCompany } from '../../context/company-context';
import { db } from '../../db/database';
import { Building2, User, Upload, Trash2, X, Sliders, Database } from 'lucide-react';
import { Input, PhoneInput, Select, CustomDevInquirySection } from '../../components/ui';
import { Modal } from '../../components/ui/modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeaderTitle, PageHeaderSubbar } from '../../context/mobile-nav-context';
import { scrollToTop } from '../../components/layout/scroll-to-top';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyCompanyAnimation from '../../assets/animations/empty-company.json';
import { ModuleNavigationSettings } from './module-navigation-settings';
import { DatabaseManager } from '../database/database-manager';

type SettingsTab = 'akun' | 'modul' | 'database';

export function SettingsPage() {
  const { company, isRegistered } = useCompany();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const getValidTab = (tab: string | null): SettingsTab => {
    if (tab === 'modul' || tab === 'modules') return 'modul';
    if (tab === 'database' || tab === 'db') return 'database';
    return 'akun';
  };

  const [activeTab, setActiveTab] = useState<SettingsTab>(() => getValidTab(tabParam));

  useEffect(() => {
    const valid = getValidTab(tabParam);
    if (valid !== activeTab) {
      setActiveTab(valid);
    }
  }, [tabParam]);

  const handleTabChange = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
    scrollToTop();
  };

  const [formData, setFormData] = useState({
    // Section 1: Data Pengguna
    userName: '',
    userEmail: '',
    userPhone: '',
    userRole: '',

    // Section 2: Data Perusahaan
    name: '',
    shortName: '',
    legalEntity: '',
    industry: '',
    employeeCount: '',
    email: '',
    phone: '',
    address: '',
    currency: 'IDR',
    payrollFormat: 'Monthly',
    logo: '',
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProcessingAccountAction, setIsProcessingAccountAction] = useState(false);

  const handleConfirmDeleteAccount = async () => {
    setIsProcessingAccountAction(true);
    try {
      await db.clearAllTables();
      try {
        const { GAStorage } = await import('../ga/ga-storage');
        GAStorage.clearAllData();
      } catch {}
      try {
        sessionStorage.setItem('hrmatrix_reg_modal_dismissed', 'true');
      } catch {}
      setIsDeleteModalOpen(false);
      navigate('/daftar');
    } catch (err) {
      console.error('Failed to process account deletion:', err);
    } finally {
      setIsProcessingAccountAction(false);
    }
  };

  useEffect(() => {
    if (company) {
      setFormData({
        userName: company.userName || '',
        userEmail: company.userEmail || '',
        userPhone: company.userPhone || '',
        userRole: company.userRole || '',

        name: company.name || '',
        shortName: company.shortName || '',
        legalEntity: company.legalEntity || '',
        industry: company.industry || '',
        employeeCount: company.employeeCount || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        currency: company.currency || 'IDR',
        payrollFormat: company.payrollFormat || 'Monthly',
        logo: company.logo || '',
      });
    }
  }, [company]);

  // Debounced auto-save function
  const triggerAutoSave = (updatedData: typeof formData) => {
    if (!company?.id) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await db.company.update(company.id, {
          userName: updatedData.userName,
          userEmail: updatedData.userEmail,
          userPhone: updatedData.userPhone,
          userRole: updatedData.userRole,

          name: updatedData.name,
          shortName: updatedData.shortName,
          legalEntity: updatedData.legalEntity,
          industry: updatedData.industry,
          employeeCount: updatedData.employeeCount,
          email: updatedData.email,
          phone: updatedData.phone,
          address: updatedData.address,
          currency: updatedData.currency,
          payrollFormat: updatedData.payrollFormat,
          logo: updatedData.logo || undefined,
        });
      } catch (err) {
        console.error('Error auto-saving company settings:', err);
      }
    }, 450);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      triggerAutoSave(next);
      return next;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Ukuran file logo maksimal 1.5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateField('logo', base64);
    };
    reader.readAsDataURL(file);
  };

  const headerSubtitle =
    activeTab === 'modul'
      ? 'Modul & Navigasi Sistem'
      : activeTab === 'database'
      ? 'Cadangan & Pemulihan Data'
      : 'Profil & Pengelola';

  return (
    <div className="w-full flex-1 flex flex-col space-y-6 sm:space-y-8">
      <PageHeaderTitle
        title="Pengaturan"
        subtitle={headerSubtitle}
      />

      <PageHeaderSubbar>
        <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
          {([
            { id: 'akun' as const, label: 'Akun', icon: User },
            { id: 'modul' as const, label: 'Modul', icon: Sliders },
            { id: 'database' as const, label: 'Database', icon: Database },
          ]).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2 text-center shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                    isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                  }`}
                />
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                )}
              </button>
            );
          })}
        </div>
      </PageHeaderSubbar>

      {activeTab === 'modul' && (
        <div className="w-full flex-1 flex flex-col space-y-8">
          <ModuleNavigationSettings />
        </div>
      )}

      {activeTab === 'database' && (
        <DatabaseManager embedded />
      )}

      {activeTab === 'akun' && (!isRegistered ? (
        <div className="w-full flex-1 flex flex-col space-y-8">
          <InitialEmptyCard
            id="empty-settings-card"
            title="Daftarkan Profil Perusahaan Anda"
            description="Lengkapi identitas organisasi dan akun pengelola untuk mengaktifkan pengaturan profil resmi dan konfigurasi sistem."
            buttonText="Daftarkan Perusahaan Sekarang"
            ButtonIcon={Building2}
            onAction={() => navigate('/daftar')}
            animationData={emptyCompanyAnimation}
            trustNote="Proses cepat & mandiri • Tersimpan aman di perangkat lokal Anda"
          />
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col space-y-8">
          {/* SECTION 1: DATA PENGGUNA (PENGELOLA) */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Data Pengguna (Pengelola / Admin)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <Input
                label="Nama Pengguna"
                value={formData.userName}
                onChange={(e) => updateField('userName', e.target.value)}
                placeholder="Contoh: Budi Santoso"
              />

              <Input
                label="Email Pengguna"
                type="email"
                value={formData.userEmail}
                onChange={(e) => updateField('userEmail', e.target.value)}
                placeholder="Contoh: budi.santoso@gmail.com"
              />

              <PhoneInput
                label="Nomor Telepon Pengguna"
                value={formData.userPhone}
                onChange={(e) => updateField('userPhone', e.target.value)}
                placeholder="+62 812-3456-7890"
              />

              <Select
                label="Sebagai (Peran Anda)"
                value={formData.userRole}
                onChange={(e) => updateField('userRole', e.target.value)}
                placeholder="Pilih Peran Anda"
                options={[
                  { value: 'karyawan', label: 'Karyawan' },
                  { value: 'hrd', label: 'HRD / General Affair' },
                  { value: 'owner', label: 'Business Owner' },
                  { value: 'mahasiswa', label: 'Mahasiswa / Akademisi' },
                ]}
              />
            </div>
          </div>

          {/* SECTION 2: DATA PERUSAHAAN */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Data Perusahaan
            </h3>

            {/* Logo Upload Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group">
                {formData.logo ? (
                  <>
                    <img
                      src={formData.logo}
                      alt="Logo Perusahaan"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => updateField('logo', '')}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 text-[10px] font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Hapus
                    </button>
                  </>
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300 stroke-[1.25]" />
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-xs font-semibold text-slate-700 block">
                  Logo Resmi Perusahaan
                </span>
                <p className="text-[11px] text-slate-500 font-normal">
                  Format disarankan PNG atau JPG dengan latar transparan / putih (maksimal 1.5MB).
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-2xs inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Unggah Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                  {formData.logo && (
                    <button
                      type="button"
                      onClick={() => updateField('logo', '')}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    >
                      Hapus Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Nama Resmi Perusahaan"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Contoh: Maju Jaya Sejahtera"
              />

              <Input
                label="Nama Singkatan / Brand"
                value={formData.shortName}
                onChange={(e) => updateField('shortName', e.target.value)}
                placeholder="Contoh: Maju Jaya"
              />

              <Select
                label="Badan Hukum"
                value={formData.legalEntity}
                onChange={(e) => updateField('legalEntity', e.target.value)}
                placeholder="Pilih Badan Hukum"
                options={[
                  { value: 'PT', label: 'Perseroan Terbatas (PT)' },
                  { value: 'CV', label: 'Commanditaire Vennootschap (CV)' },
                  { value: 'Yayasan', label: 'Yayasan' },
                  { value: 'Perorangan', label: 'Usaha Perorangan (UD)' },
                  { value: 'Lainnya', label: 'Lainnya / Belum Berbadan Hukum' },
                ]}
              />

              <Select
                label="Jenis Industri"
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                placeholder="Pilih Bidang Industri"
                options={[
                  { value: 'Manufaktur', label: 'Manufaktur & Produksi' },
                  { value: 'Teknologi', label: 'Teknologi & Informasi' },
                  { value: 'F&B', label: 'F&B / Kuliner' },
                  { value: 'Jasa', label: 'Jasa Profesional / Konsultan' },
                  { value: 'Retail', label: 'Perdagangan & Retail' },
                  { value: 'Konstruksi', label: 'Konstruksi & Properti' },
                  { value: 'Lainnya', label: 'Lainnya' },
                ]}
              />

              <Select
                label="Estimasi Jumlah Karyawan"
                value={formData.employeeCount}
                onChange={(e) => updateField('employeeCount', e.target.value)}
                placeholder="Pilih Rentang Karyawan"
                options={[
                  { value: '1-10', label: '1 - 10 Karyawan' },
                  { value: '11-50', label: '11 - 50 Karyawan' },
                  { value: '51-200', label: '51 - 200 Karyawan' },
                  { value: '201+', label: 'Lebih dari 200 Karyawan' },
                ]}
              />

              <Input
                label="Email Resmi Perusahaan"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Contoh: info@majujayasejahtera.com"
              />

              <PhoneInput
                label="Telepon Perusahaan"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+62 812-3456-7890"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Mata Uang"
                  value={formData.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                />
                <Input
                  label="Format Payroll"
                  value={formData.payrollFormat}
                  onChange={(e) => updateField('payrollFormat', e.target.value)}
                />
              </div>
            </div>

            <Input
              label="Alamat Perusahaan"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Alamat lengkap operasional kantor atau entitas usaha"
            />
          </div>

          {/* SECTION 4: INFORMASI SISTEM */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Informasi Sistem & Lingkungan Kerja
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Versi Web:</span>
                <div className="font-semibold text-slate-900">v1.0.0 Stable</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Penyimpanan:</span>
                <div className="font-semibold text-slate-900">IndexedDB Lokal (Offline)</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Regulasi Pajak:</span>
                <div className="font-semibold text-slate-900">PPh 21 TER (PP 58/2023)</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Status Akun:</span>
                <div className="font-semibold text-emerald-600">Terdaftar & Aktif</div>
              </div>
            </div>
          </div>

          {/* SECTION 5: KELOLA AKUN (HAPUS AKUN) */}
          <div className="space-y-3 pt-4 border-t border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Kelola Akun
            </h4>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Hapus Akun & Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* SECTION PENAWARAN: KUSTOMISASI WEB & PENGEMBANGAN LANJUTAN */}
      {activeTab === 'akun' && (
        <div className="pt-2">
          <CustomDevInquirySection />
        </div>
      )}

      {/* Modal Konfirmasi Hapus Akun */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isProcessingAccountAction && setIsDeleteModalOpen(false)}
        contentClassName="sm:max-w-md"
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600">
                <Trash2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Hapus Akun & Reset Data?
              </h3>
            </div>
            <button
              type="button"
              onClick={() => !isProcessingAccountAction && setIsDeleteModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Seluruh profil perusahaan, data karyawan, presensi, jadwal, payroll, KPI, serta data General Affairs di penyimpanan lokal browser akan dihapus secara permanen.
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isProcessingAccountAction}
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isProcessingAccountAction}
              onClick={handleConfirmDeleteAccount}
              className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-colors cursor-pointer bg-rose-600 hover:bg-rose-700"
            >
              {isProcessingAccountAction ? 'Memproses...' : 'Ya, Hapus Semua'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

