import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db/database';
import { populateSampleCompanyAndEmployees } from '../../utils/sampleDataGenerator';
import { Button, Input, PhoneInput, Select, HRMatrixLogo } from '../../components/ui';
import { CheckCircle2, Sparkles, ChevronLeft, Info, ShieldCheck, FileText, Check, Upload, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Wizard } from './wizard';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { sendRegistrationAutoEmails } from '../../services/emailService';
import { validateEmailFormat } from '../../services/emailValidator';

export function FormDaftar() {
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loadingMode, setLoadingMode] = useState<'demo' | 'empty' | 'submit' | null>(null);
  const [sampleSuccess, setSampleSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Form states divided by sections
  const [formData, setFormData] = useState({
    // Section 1: Data Pengguna
    userName: '',
    userEmail: '',
    userPhone: '',
    userRole: '',

    // Section 2: Data Perusahaan
    name: '',
    legalEntity: '',
    industry: '',
    employeeCount: '',
    email: '',
    logo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper untuk memformat nomor telepon Indonesia secara rapi (e.g. 0812-3456-7890 atau +62 812-3456-7890)
  const handlePhoneChange = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, '');
    let formatted = '';

    if (cleaned.startsWith('+62')) {
      let digits = cleaned.slice(3).replace(/\D/g, '');
      formatted = '+62';
      if (digits.length > 0) {
        formatted += ' ' + digits.slice(0, 3);
      }
      if (digits.length > 3) {
        formatted += '-' + digits.slice(3, 7);
      }
      if (digits.length > 7) {
        formatted += '-' + digits.slice(7, 12);
      }
    } else {
      let digits = cleaned.replace(/\D/g, '');
      if (digits.length > 0) {
        formatted = digits.slice(0, 4);
      }
      if (digits.length > 4) {
        formatted += '-' + digits.slice(4, 8);
      }
      if (digits.length > 8) {
        formatted += '-' + digits.slice(8, 13);
      }
    }

    setFormData({ ...formData, userPhone: formatted });
  };

  // Validasi akhir lengkap ketika tombol Daftarkan di langkah terakhir ditekan
  const validateAllFields = () => {
    const newErrors: Record<string, string> = {};
    
    // Validasi Langkah 1
    if (!formData.userName.trim()) newErrors.userName = 'Nama pengguna wajib diisi';
    
    const userEmailValidation = validateEmailFormat(formData.userEmail);
    if (!userEmailValidation.valid) {
      newErrors.userEmail = userEmailValidation.reason || 'Format email pengguna tidak valid';
    }

    if (!formData.userPhone.trim()) newErrors.userPhone = 'Nomor telepon wajib diisi';
    if (!formData.userRole) newErrors.userRole = 'Silakan pilih peran Anda';

    // Validasi Langkah 2
    if (!formData.name.trim()) {
      newErrors.name = 'Nama perusahaan wajib diisi';
    } else {
      const lowerName = formData.name.toLowerCase();
      if (lowerName.startsWith('pt') || lowerName.startsWith('cv') || lowerName.startsWith('pt.') || lowerName.startsWith('cv.')) {
        newErrors.name = 'Jangan gunakan kata PT. atau CV. di depan nama perusahaan (isi nama aslinya saja)';
      }
    }
    if (!formData.legalEntity) newErrors.legalEntity = 'Badan hukum wajib diisi';
    if (!formData.industry) newErrors.industry = 'Jenis industri wajib diisi';
    if (!formData.employeeCount) newErrors.employeeCount = 'Estimasi karyawan wajib diisi';
    
    const companyEmailValidation = validateEmailFormat(formData.email);
    if (!companyEmailValidation.valid) {
      newErrors.email = companyEmailValidation.reason || 'Format email perusahaan tidak valid';
    }

    setErrors(newErrors);
    return newErrors;
  };

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Tombol Lanjut: Pada mode desktop langsung memvalidasi formulir dan berpindah ke Syarat & Ketentuan (Step 3)
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDesktop) {
      const validationErrors = validateAllFields();
      if (Object.keys(validationErrors).length > 0) {
        alert('Mohon lengkapi seluruh Data Pengguna & Data Perusahaan dengan benar terlebih dahulu.');
        return;
      }
      setStep(3);
    } else {
      if (step === 1) {
        const step1Errors: Record<string, string> = {};
        if (!formData.userName.trim()) step1Errors.userName = 'Nama pengguna wajib diisi';
        const userEmailValidation = validateEmailFormat(formData.userEmail);
        if (!userEmailValidation.valid) {
          step1Errors.userEmail = userEmailValidation.reason || 'Format email pengguna tidak valid';
        }
        if (!formData.userPhone.trim()) step1Errors.userPhone = 'Nomor telepon wajib diisi';
        if (!formData.userRole) step1Errors.userRole = 'Silakan pilih peran Anda';

        if (Object.keys(step1Errors).length > 0) {
          setErrors((prev) => ({ ...prev, ...step1Errors }));
          return;
        }
      } else if (step === 2) {
        const step2Errors: Record<string, string> = {};
        if (!formData.name.trim()) {
          step2Errors.name = 'Nama perusahaan wajib diisi';
        } else {
          const lowerName = formData.name.toLowerCase();
          if (lowerName.startsWith('pt') || lowerName.startsWith('cv') || lowerName.startsWith('pt.') || lowerName.startsWith('cv.')) {
            step2Errors.name = 'Jangan gunakan kata PT. atau CV. di depan nama perusahaan (isi nama aslinya saja)';
          }
        }
        if (!formData.legalEntity) step2Errors.legalEntity = 'Badan hukum wajib diisi';
        if (!formData.industry) step2Errors.industry = 'Jenis industri wajib diisi';
        if (!formData.employeeCount) step2Errors.employeeCount = 'Estimasi karyawan wajib diisi';
        const companyEmailValidation = validateEmailFormat(formData.email);
        if (!companyEmailValidation.valid) {
          step2Errors.email = companyEmailValidation.reason || 'Format email perusahaan tidak valid';
        }

        if (Object.keys(step2Errors).length > 0) {
          setErrors((prev) => ({ ...prev, ...step2Errors }));
          return;
        }
      }

      if (step < 3) {
        setStep((prev) => (prev + 1) as 1 | 2 | 3);
      }
    }
  };

  const handleBack = () => {
    if (isDesktop) {
      setStep(1);
    } else {
      if (step > 1) {
        setStep((prev) => (prev - 1) as 1 | 2 | 3);
      }
    }
  };

  const handleUseSampleData = async () => {
    try {
      setLoadingMode('demo');
      await populateSampleCompanyAndEmployees();
      setLoadingMode(null);
      setShowWizard(true);
    } catch (error) {
      console.error('Failed to populate sample data', error);
      alert('Gagal mengisi data sampel: ' + (error as Error).message);
      setLoadingMode(null);
    }
  };

  const handleExploreDirectly = async () => {
    try {
      setLoadingMode('empty');
      setLoadingMode(null);
      setShowWizard(true);
    } catch (error) {
      console.error('Failed to explore directly', error);
      alert('Gagal menjelajahi langsung: ' + (error as Error).message);
      setLoadingMode(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Anda harus menyetujui syarat & ketentuan layanan sebelum melanjutkan.');
      return;
    }

    const validationErrors = validateAllFields();
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      if (isDesktop) {
        setStep(1);
        alert('Mohon periksa kembali isian formulir pendaftaran Anda.');
      } else {
        // Deteksi letak kesalahan pengisian pertama dan arahkan pengguna kembali ke langkah tersebut secara otomatis
        const step1ErrorKeys = ['userName', 'userEmail', 'userPhone', 'userRole'];
        const hasStep1Error = Object.keys(validationErrors).some(key => step1ErrorKeys.includes(key));

        if (hasStep1Error) {
          setStep(1);
          alert('Mohon lengkapi seluruh Data Pengguna di Langkah 1 dengan benar.');
        } else {
          setStep(2);
          alert('Mohon lengkapi seluruh Data Perusahaan di Langkah 2 dengan benar.');
        }
      }
      return;
    }

    try {
      setLoadingMode('submit');
      const companyId = uuidv4();
      await db.company.add({
        id: companyId,
        name: formData.name,
        shortName: formData.name.substring(0, 15),
        logo: formData.logo || undefined,
        address: 'Alamat Perusahaan Belum Ditentukan',
        phone: formData.userPhone || '',
        email: formData.email,
        currentYear: new Date().getFullYear(),
        currency: 'IDR',
        payrollFormat: 'Monthly',
        payrollPeriod: '26-25',
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        userRole: formData.userRole,
        legalEntity: formData.legalEntity,
        industry: formData.industry,
        employeeCount: formData.employeeCount,
      });

      // Kirim email konfirmasi pendaftaran otomatis via EmailJS (User & Company Email)
      sendRegistrationAutoEmails({
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        userRole: formData.userRole,
        companyName: formData.name,
        companyEmail: formData.email,
        legalEntity: formData.legalEntity,
        industry: formData.industry,
        employeeCount: formData.employeeCount,
      }).catch((err) => {
        console.warn('Auto email background trigger error:', err);
      });

      setLoadingMode(null);
      setShowWizard(true);
    } catch (error) {
      console.error('Failed to setup company', error);
      alert('Gagal menyimpan data perusahaan. Silakan coba kembali.');
      setLoadingMode(null);
    }
  };

  if (showWizard) {
    return <Wizard onComplete={() => navigate('/')} />;
  }

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* BAGIAN KIRI: Visual Banner Brand (Desktop Split Screen Full View) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-slate-100/90 border-r border-slate-200/80 p-10 xl:p-16 text-slate-800 flex-col justify-between relative overflow-hidden select-none h-full shrink-0">
          {/* Background Decorative Blur Orbs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3.5">
            <HRMatrixLogo className="w-16 h-16 xl:w-20 xl:h-20 text-blue-600 shrink-0" />
            <div>
              <span className="text-2xl xl:text-3xl font-black tracking-tight text-slate-900 block leading-none">HRMatrix</span>
              <span className="text-xs xl:text-sm text-slate-500 font-semibold tracking-widest mt-1 block">INDONESIA</span>
            </div>
          </div>

          {/* Middle Content Feature Highlights */}
          <div className="relative z-10 my-auto py-6 space-y-6">
            <div>
              <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug text-slate-900 tracking-tight">
                Kelola SDM, Absensi, KPI, & Penggajian Secara Otomatis
              </h1>
              <p className="text-sm text-slate-600 font-normal mt-2.5 leading-relaxed">
                Platform HRIS modern ramah UMKM & Korporasi dengan kalkulasi PPh 21 TER, BPJS Kesehatan, BPJS Ketenagakerjaan, dan slip gaji PDF instan.
              </p>
            </div>

            {/* List Keunggulan */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                </div>
                <div>
                  <h2 className="text-xs xl:text-sm font-semibold text-slate-900">100% Aman & Bebas Server</h2>
                  <p className="text-xs text-slate-500 font-normal">Seluruh data tersimpan privat di IndexedDB browser Anda.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                </div>
                <div>
                  <h2 className="text-xs xl:text-sm font-semibold text-slate-900">Kalkulator Regulasi Resmi</h2>
                  <p className="text-xs text-slate-500 font-normal">Formula PPh 21 TER, BPJS Kesehatan & TK teruji standar DJP.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                </div>
                <div>
                  <h2 className="text-xs xl:text-sm font-semibold text-slate-900">Peta Shift & Presensi Mandiri</h2>
                  <p className="text-xs text-slate-500 font-normal">Dukungan QR presensi, pertukaran jadwal, dan evaluasi KPI.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Keamanan Data Privat
            </span>
            <span className="text-slate-400 font-mono text-[11px]">v1.0.0</span>
          </div>
        </div>

        {/* BAGIAN KANAN: Form Area Putih (Responsif: Full di Mobile, Kanan di Desktop) */}
        <div className="w-full lg:w-7/12 xl:w-1/2 bg-white flex flex-col h-full min-h-0 overflow-hidden relative">
          
          {/* Header Mobile Only (Tampil hanya di layar HP/Tablet kecil) */}
          <div className="lg:hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-5 pt-5 pb-4 shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md shrink-0">
              <HRMatrixLogo className="w-full h-full text-blue-600" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-white">HRMatrix Indonesia</h1>
              <p className="text-xs text-blue-100/90 font-medium">Pendaftaran Perusahaan & Pengelola</p>
            </div>
          </div>

          {/* PROGRESS STEP INDICATOR */}
          <div className="px-5 sm:px-7 pt-5 pb-4 bg-white border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between min-h-[32px]">
              <div className="flex items-center gap-1.5 min-h-[32px]">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors mr-1 cursor-pointer animate-in fade-in zoom-in-90"
                    title="Kembali ke langkah sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {isDesktop ? (
                      step === 3 ? 'Ketentuan Layanan' : 'Formulir Pendaftaran Perusahaan'
                    ) : (
                      <>
                        {step === 1 && 'Data Pengguna'}
                        {step === 2 && 'Data Perusahaan'}
                        {step === 3 && 'Ketentuan Layanan'}
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    {isDesktop ? (
                      step === 3 ? 'Langkah 2 dari 2 - Syarat & Ketentuan' : 'Langkah 1 dari 2 - Data Pengguna & Perusahaan'
                    ) : (
                      `Langkah ${step} dari 3`
                    )}
                  </p>
                </div>
              </div>

              {/* Stepper Dots */}
              <div className="flex items-center gap-1.5">
                {(isDesktop ? [1, 3] : [1, 2, 3]).map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      (isDesktop ? (step < 3 ? s === 1 : s === step) : s === step)
                        ? 'w-6 bg-blue-600'
                        : (isDesktop ? (step === 3 ? s < step : false) : s < step)
                        ? 'w-2 bg-blue-300'
                        : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        {/* Scrollable Form Area inside Bottom Sheet ONLY */}
        <div className="overflow-y-auto px-5 sm:px-7 pt-4 pb-6 flex-1 min-h-0">
          {sampleSuccess && (
            <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm flex items-center gap-2 font-medium animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {loadingMode === 'demo' 
                  ? 'Data demo berhasil dimuat! Mengalihkan ke Dashboard...'
                  : 'Sistem siap dijalankan! Mengalihkan ke Dashboard...'}
              </span>
            </div>
          )}

          {/* MODE DESKTOP: FULL FORM (DATA PENGGUNA + DATA PERUSAHAAN) */}
          {isDesktop && step < 3 && (
            <form onSubmit={handleNext} id="form-step-1" className="space-y-5" noValidate>
              {/* BAGIAN 1: DATA PENGGUNA */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Pengguna"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    error={errors.userName}
                    placeholder="Contoh: Budi Santoso"
                  />

                  <div>
                    <Input
                      label="Email Pengguna"
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, userEmail: val });
                        if (errors.userEmail) {
                          const res = validateEmailFormat(val);
                          if (res.valid) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.userEmail;
                              return next;
                            });
                          }
                        }
                      }}
                      error={errors.userEmail}
                      placeholder="Contoh: budi.santoso@gmail.com"
                    />
                    {validateEmailFormat(formData.userEmail).suggestion && (
                      <button
                        type="button"
                        onClick={() => {
                          const sug = validateEmailFormat(formData.userEmail).suggestion;
                          if (sug) {
                            setFormData((prev) => ({ ...prev, userEmail: sug }));
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.userEmail;
                              return next;
                            });
                          }
                        }}
                        className="mt-1.5 text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md text-left transition-colors cursor-pointer inline-flex items-center gap-1 font-medium"
                      >
                        <span>Maksud Anda: <strong>{validateEmailFormat(formData.userEmail).suggestion}</strong>?</span>
                        <span className="underline ml-0.5 font-semibold">Terapkan</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PhoneInput
                    label="Nomor Telepon"
                    value={formData.userPhone}
                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                    error={errors.userPhone}
                    placeholder="+62 812-3456-7890"
                  />

                  <Select
                    label="Sebagai (Peran Anda)"
                    value={formData.userRole}
                    onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                    error={errors.userRole}
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

              {/* BAGIAN 2: DATA PERUSAHAAN */}
              <div className="space-y-4 pt-1">
                {/* LOGO UPLOAD COMPONENT */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm group">
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
                          onClick={() => setFormData({ ...formData, logo: '' })}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 text-[10px] font-semibold uppercase tracking-wider"
                        >
                          Hapus
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-300">
                        <Building2 className="w-8 h-8 stroke-[1.25]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                      Logo Perusahaan (Opsional)
                    </span>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        Unggah Logo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setFormData({ ...formData, logo: event.target.result as string });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {formData.logo && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: '' })}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
                        >
                          Hapus Logo
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal pt-1 text-justify">
                      Mendukung semua format gambar. Direkomendasikan menggunakan rasio dimensi <strong className="text-slate-700 font-semibold">1:1 (Persegi)</strong> agar tampilan presisi dan tidak terpotong otomatis oleh sistem.
                    </p>
                  </div>
                </div>

                {/* Nama Perusahaan Full Width */}
                <div>
                  <Input
                    label="Nama Perusahaan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    placeholder="Contoh: Maju Jaya Sejahtera"
                  />
                  <div className="mt-1.5 flex items-start gap-1 text-[10px] sm:text-[11px] text-slate-500 bg-slate-50 border border-slate-200 p-2 rounded-lg">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tips:</strong> Masukkan nama asli/komersial saja. Jangan menggunakan kata singkatan hukum seperti <strong>PT.</strong> atau <strong>CV.</strong> di bagian depan.
                    </span>
                  </div>
                </div>

                {/* Email Perusahaan | Badan Hukum dalam satu baris */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Email Resmi Perusahaan"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, email: val });
                        if (errors.email) {
                          const res = validateEmailFormat(val);
                          if (res.valid) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.email;
                              return next;
                            });
                          }
                        }
                      }}
                      error={errors.email}
                      placeholder="Contoh: info@majujayasejahtera.com"
                    />
                    {validateEmailFormat(formData.email).suggestion && (
                      <button
                        type="button"
                        onClick={() => {
                          const sug = validateEmailFormat(formData.email).suggestion;
                          if (sug) {
                            setFormData((prev) => ({ ...prev, email: sug }));
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.email;
                              return next;
                            });
                          }
                        }}
                        className="mt-1.5 text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md text-left transition-colors cursor-pointer inline-flex items-center gap-1 font-medium"
                      >
                        <span>Maksud Anda: <strong>{validateEmailFormat(formData.email).suggestion}</strong>?</span>
                        <span className="underline ml-0.5 font-semibold">Terapkan</span>
                      </button>
                    )}
                  </div>

                  <Select
                    label="Badan Hukum"
                    value={formData.legalEntity}
                    onChange={(e) => setFormData({ ...formData, legalEntity: e.target.value })}
                    error={errors.legalEntity}
                    placeholder="Pilih Badan Hukum"
                    options={[
                      { value: 'PT', label: 'Perseroan Terbatas (PT)' },
                      { value: 'CV', label: 'Commanditaire Vennootschap (CV)' },
                      { value: 'Yayasan', label: 'Yayasan' },
                      { value: 'Perorangan', label: 'Usaha Perorangan (UD)' },
                      { value: 'Lainnya', label: 'Lainnya / Belum Berbadan Hukum' },
                    ]}
                  />
                </div>

                {/* Jenis Industri | Estimasi Jumlah Karyawan dalam satu baris */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Jenis Industri"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    error={errors.industry}
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
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    error={errors.employeeCount}
                    placeholder="Pilih Rentang Jumlah Karyawan"
                    options={[
                      { value: '1-10', label: '1 - 10 Karyawan' },
                      { value: '11-50', label: '11 - 50 Karyawan' },
                      { value: '51-200', label: '51 - 200 Karyawan' },
                      { value: '201+', label: 'Lebih dari 200 Karyawan' },
                    ]}
                  />
                </div>
              </div>
            </form>
          )}

          {/* MODE MOBILE: MULTI-STEP WIZARD (STEP 1: DATA PENGGUNA) */}
          {!isDesktop && step === 1 && (
            <form onSubmit={handleNext} id="form-step-1" className="space-y-4" noValidate>
              <Input
                label="Nama Pengguna"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                error={errors.userName}
                placeholder="Contoh: Budi Santoso"
              />

              <div>
                <Input
                  label="Email Pengguna"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, userEmail: val });
                    if (errors.userEmail) {
                      const res = validateEmailFormat(val);
                      if (res.valid) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.userEmail;
                          return next;
                        });
                      }
                    }
                  }}
                  error={errors.userEmail}
                  placeholder="Contoh: budi.santoso@gmail.com"
                />
                {validateEmailFormat(formData.userEmail).suggestion && (
                  <button
                    type="button"
                    onClick={() => {
                      const sug = validateEmailFormat(formData.userEmail).suggestion;
                      if (sug) {
                        setFormData((prev) => ({ ...prev, userEmail: sug }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.userEmail;
                          return next;
                        });
                      }
                    }}
                    className="mt-1.5 text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md text-left transition-colors cursor-pointer inline-flex items-center gap-1 font-medium"
                  >
                    <span>Maksud Anda: <strong>{validateEmailFormat(formData.userEmail).suggestion}</strong>?</span>
                    <span className="underline ml-0.5 font-semibold">Terapkan</span>
                  </button>
                )}
              </div>

              <PhoneInput
                label="Nomor Telepon"
                value={formData.userPhone}
                onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                error={errors.userPhone}
                placeholder="+62 812-3456-7890"
              />

              <Select
                label="Sebagai (Peran Anda)"
                value={formData.userRole}
                onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                error={errors.userRole}
                placeholder="Pilih Peran Anda"
                options={[
                  { value: 'karyawan', label: 'Karyawan' },
                  { value: 'hrd', label: 'HRD / General Affair' },
                  { value: 'owner', label: 'Business Owner' },
                  { value: 'mahasiswa', label: 'Mahasiswa / Akademisi' },
                ]}
              />
            </form>
          )}

          {/* MODE MOBILE: MULTI-STEP WIZARD (STEP 2: DATA PERUSAHAAN) */}
          {!isDesktop && step === 2 && (
            <form onSubmit={handleNext} id="form-step-2" className="space-y-4" noValidate>
              {/* LOGO UPLOAD COMPONENT */}
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm group">
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
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 text-[10px] font-semibold uppercase tracking-wider"
                      >
                        Hapus
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <Building2 className="w-8 h-8 stroke-[1.25]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Logo Perusahaan (Opsional)
                  </span>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Unggah Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setFormData({ ...formData, logo: event.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {formData.logo && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
                      >
                        Hapus Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal pt-1 text-justify">
                    Mendukung semua format gambar. Direkomendasikan menggunakan rasio dimensi <strong className="text-slate-700 font-semibold">1:1 (Persegi)</strong> agar tampilan presisi dan tidak terpotong otomatis oleh sistem.
                  </p>
                </div>
              </div>

              <div>
                <Input
                  label="Nama Perusahaan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  placeholder="Contoh: Maju Jaya Sejahtera"
                />
                <div className="mt-1.5 flex items-start gap-1 text-[10px] sm:text-[11px] text-slate-500 bg-slate-50 border border-slate-200 p-2 rounded-lg">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Tips:</strong> Masukkan nama asli/komersial saja. Jangan menggunakan kata singkatan hukum seperti <strong>PT.</strong> atau <strong>CV.</strong> di bagian depan.
                  </span>
                </div>
              </div>

              <div>
                <Input
                  label="Email Resmi Perusahaan"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, email: val });
                    if (errors.email) {
                      const res = validateEmailFormat(val);
                      if (res.valid) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }
                  }}
                  error={errors.email}
                  placeholder="Contoh: info@majujayasejahtera.com"
                />
                {validateEmailFormat(formData.email).suggestion && (
                  <button
                    type="button"
                    onClick={() => {
                      const sug = validateEmailFormat(formData.email).suggestion;
                      if (sug) {
                        setFormData((prev) => ({ ...prev, email: sug }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }}
                    className="mt-1.5 text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md text-left transition-colors cursor-pointer inline-flex items-center gap-1 font-medium"
                  >
                    <span>Maksud Anda: <strong>{validateEmailFormat(formData.email).suggestion}</strong>?</span>
                    <span className="underline ml-0.5 font-semibold">Terapkan</span>
                  </button>
                )}
              </div>

              <Select
                label="Badan Hukum"
                value={formData.legalEntity}
                onChange={(e) => setFormData({ ...formData, legalEntity: e.target.value })}
                error={errors.legalEntity}
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
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                error={errors.industry}
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
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                error={errors.employeeCount}
                placeholder="Pilih Rentang Jumlah Karyawan"
                options={[
                  { value: '1-10', label: '1 - 10 Karyawan' },
                  { value: '11-50', label: '11 - 50 Karyawan' },
                  { value: '51-200', label: '51 - 200 Karyawan' },
                  { value: '201+', label: 'Lebih dari 200 Karyawan' },
                ]}
              />
            </form>
          )}

          {/* SECTION 3: PERJANJIAN & KESEPAKATAN */}
          {step === 3 && (
            <form onSubmit={handleSubmit} id="form-step-3" className="space-y-4">
              <div className="space-y-5 text-xs text-slate-500 leading-relaxed text-justify">
                {/* Prolog Sapaan Pencipta */}
                <div className="pb-3 border-b border-slate-100 text-slate-600 text-justify">
                  <p className="font-semibold text-slate-800 mb-1.5 text-left">
                    Halo, Selamat Datang!
                  </p>
                  <p className="font-light">
                    Saya <strong className="font-semibold text-slate-700">Alvareza Hilka Pratama</strong> selaku Pencipta aplikasi HRMatrix mengucapkan terima kasih yang sebesar-besarnya atas kepercayaan Anda dalam memilih platform ini sebagai solusi manajemen operasional bisnis Anda. Aplikasi ini dirancang secara khusus untuk mengoptimalkan efisiensi pengelolaan payroll, SDM, dan evaluasi performa kerja secara modern dan transparan. Sebelum Anda melangkah lebih jauh, mohon luangkan waktu sejenak untuk membaca dan memahami beberapa poin ketentuan penting serta landasan hukum ketenagakerjaan dan privasi di bawah ini demi menjamin rasa aman, nyaman, dan kejelasan hak penggunaan kita bersama.
                  </p>
                </div>

                {/* Pasal 1 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">1.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Transparansi Pengiriman Data ke Server (UU No. 27 Tahun 2022 tentang PDP)
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Sesuai dengan ketentuan ketat dalam Undang-Undang Pelindungan Data Pribadi (UU PDP), platform HRMatrix berkomitmen penuh menjaga kedaulatan informasi digital Anda. Hanya informasi identitas dasar pengguna (seperti nama akun administratif dan alamat email utama) serta identitas profil eksternal perusahaan (nama perusahaan dan email kontak resmi) yang dikirimkan dan disimpan pada sistem cloud server HRMatrix. Seluruh transmisi data ini dilindungi menggunakan protokol enkripsi Secure Sockets Layer (SSL/TLS) tingkat lanjut guna mencegah intersepsi ilegal oleh pihak ketiga. Data yang dikirimkan ini digunakan secara eksklusif untuk kepentingan administrasi lisensi operasional, verifikasi keandalan sistem, pemantauan kepatuhan lisensi, serta analisis statistik performa layanan agregat tanpa menyentuh data personal karyawan Anda.
                    </p>
                  </div>
                </div>

                {/* Pasal 2 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">2.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Keamanan Data Lokal & Penerapan Teknologi IndexedDB
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Seluruh data operasional yang bersifat sangat rahasia, krusial, dan sensitif, termasuk profil lengkap seluruh karyawan, struktur rincian jabatan, bagan departemen, rekam kehadiran harian, lembar evaluasi kinerja (KPI), hingga rincian nominal kompensasi serta slip gaji bulanan, disimpan secara lokal di dalam penyimpanan web browser peramban Anda dengan memanfaatkan infrastruktur teknologi <em className="font-normal text-slate-600">IndexedDB</em>. Merujuk pada Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik (PSTE), metode penyimpanan sandboxed ini menjamin kedaulatan penuh berada di tangan Anda; tidak ada kebocoran data terpusat pada server pihak ketiga karena kendali fisik media penyimpanan sepenuhnya berada di dalam perangkat keras yang Anda operasikan sendiri.
                    </p>
                  </div>
                </div>

                {/* Pasal 3 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">3.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Akurasi & Kepatuhan Perhitungan Pajak Penghasilan (PP No. 58 Tahun 2023)
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Sistem kalkulasi potongan Pajak Penghasilan (PPh) Pasal 21 dalam platform HRMatrix sepenuhnya diprogram untuk tunduk pada skema Tarif Efektif Rata-Rata (TER) yang diatur berdasarkan Peraturan Pemerintah Republik Indonesia Nomor 58 Tahun 2023 serta peraturan turunan dari Direktorat Jenderal Pajak (DJP). Sistem ini berfungsi sebagai alat bantu hitung otomatis; perusahaan pengguna tetap bertanggung jawab penuh atas validitas penentuan status Penghasilan Tidak Kena Pajak (PTKP), penggolongan status perkawinan/tanggungan, dan kebenaran input nilai parameter awal yang dimasukkan ke dalam sistem perhitungan. Kelalaian pengisian parameter pajak yang berdampak pada selisih lapor pajak di luar tanggung jawab sistem.
                    </p>
                  </div>
                </div>

                {/* Pasal 4 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">4.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Integrasi & Kebijakan Program Jaminan Sosial BPJS
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Formulasi kalkulasi iuran jaminan sosial BPJS Kesehatan dan BPJS Ketenagakerjaan (mencakup iuran Jaminan Hari Tua [JHT], Jaminan Pensiun [JP], Jaminan Kecelakaan Kerja [JKK], Jaminan Kematian [JKM], serta Jaminan Kehilangan Pekerjaan [JKP]) dirancang merujuk pada Undang-Undang Nomor 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial serta regulasi pemerintah pelaksana terkait lainnya. Akurasi pemotongan nilai iuran sangat bergantung pada ketepatan input nilai dasar upah minimum wilayah (UMR/UMK) serta kepatuhan batas atas upah (ceiling wage) yang disetel oleh pengguna dalam modul pengaturan payroll.
                    </p>
                  </div>
                </div>

                {/* Pasal 5 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">5.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Ketentuan Kustomisasi, Modifikasi Fitur, & Integrasi Eksternal
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      HRMatrix menyediakan fungsionalitas aplikasi siap pakai sesuai standar sistem yang telah diuji (as-is). Segala bentuk permintaan kustomisasi antarmuka pengguna khusus, perubahan logika perhitungan formula internal yang bersifat non-standar, penambahan integrasi dengan Application Programming Interface (API) eksternal milik pihak ketiga, atau implementasi fitur tambahan khusus yang disesuaikan secara spesifik dengan struktur unik operasional perusahaan Anda, dikategorikan sebagai layanan pengembangan profesional tambahan dan akan diatur dalam kontrak kerja sama serta kesepakatan nilai jasa profesional terpisah yang disetujui bersama secara tertulis.
                    </p>
                  </div>
                </div>

                {/* Pasal 6 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">6.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Kepemilikan Kekayaan Intelektual & Perlindungan Hak Cipta (UU No. 28 Tahun 2014)
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Seluruh arsitektur kode sumber, kesatuan desain tata letak visual, ilustrasi grafis, nama merek dagang, basis algoritma kalkulasi payroll, dan fungsionalitas sistem HRMatrix secara keseluruhan dirancang, dibangun, dan dimiliki sepenuhnya secara mutlak oleh <strong className="text-slate-700 font-semibold">Alvareza Hilka Pratama</strong> selaku pencipta dan pemegang hak cipta sah yang dilindungi undang-undang. Berdasarkan Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta, dilarang keras menyalin, menggandakan, memodifikasi, mendistribusikan ulang, membongkar paksa kode sumber (reverse engineering), atau menjual kembali sistem ini tanpa persetujuan tertulis yang sah dari pemilik cipta. Pelanggaran atas hak eksklusif ini dapat dikenakan sanksi perdata yang berat serta tuntutan pidana sesuai ketentuan hukum yang berlaku di wilayah hukum Republik Indonesia.
                    </p>
                  </div>
                </div>

                {/* Pasal 7 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">7.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Batasan Tanggung Jawab & Hukum Transaksi Elektronik (UU ITE)
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Sistem HRMatrix ini disediakan "sebagaimana adanya" tanpa jaminan tersurat maupun tersirat mengenai kecocokan mutlak untuk tujuan bisnis spesifik tanpa penyesuaian parameter mandiri. Berdasarkan UU No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016 serta perubahannya pada UU No. 1 Tahun 2024 tentang Informasi dan Transaksi Elektronik (UU ITE), pihak pengembang tidak bertanggung jawab atas kerugian finansial, sengketa hubungan industrial ketenagakerjaan, selisih perhitungan internal, atau hilangnya data lokal yang disebabkan oleh kelalaian input parameter, kerusakan perangkat keras fisik pengguna, serangan malware lokal pada browser, ataupun terhapusnya cache penyimpanan lokal secara tidak sengaja oleh pihak pengguna.
                    </p>
                  </div>
                </div>

                {/* Pasal 8 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">8.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Keamanan Kredensial, Autentikasi, dan Perlindungan Akun Pengguna
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Pengguna bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi, token akses sesi, dan data otorisasi administratif yang digunakan untuk masuk ke dalam dasbor HRMatrix. Anda menyetujui untuk tidak membagikan kredensial login kepada pihak ketiga yang tidak berwenang dalam struktur manajemen perusahaan Anda. Segala bentuk transaksi, manipulasi data karyawan, persetujuan payroll, dan pengisian data administratif yang dilakukan menggunakan akun yang sah dari perusahaan Anda akan dianggap sebagai tindakan hukum resmi yang sah dari perusahaan tersebut.
                    </p>
                  </div>
                </div>

                {/* Pasal 9 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">9.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Penanganan Sengketa Hukum, Arbitrase, dan Jurisdiksi Pengadilan
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Ketentuan layanan dan seluruh hubungan hukum yang timbul dari penggunaan platform HRMatrix ini diatur dan ditafsirkan berdasarkan hukum positif yang berlaku di Republik Indonesia. Apabila timbul perselisihan atau perbedaan penafsiran mengenai pelaksanaan syarat dan ketentuan ini, Anda dan pihak pengembang sepakat untuk menyelesaikan permasalahan tersebut terlebih dahulu melalui musyawarah untuk mencapai mufakat. Jika penyelesaian mufakat tidak tercapai dalam waktu 30 (tiga puluh) hari kalender, maka penyelesaian sengketa akan dibawa ke hadapan jurisdiksi hukum Pengadilan Negeri yang ditentukan oleh pemegang hak cipta sah.
                    </p>
                  </div>
                </div>

                {/* Pasal 10 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">10.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Kebijakan Audit, Pemulihan, dan Rekonsiliasi Data Historis
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Mengingat penyimpanan utama berada pada database lokal browser (`IndexedDB`), sistem menyediakan fitur ekspor data dalam format cadangan (backup/export) untuk memfasilitasi audit internal dan rekonsiliasi periodik perusahaan. Pengguna sangat disarankan untuk melakukan pengunduhan berkas cadangan data secara berkala setiap kali selesai melakukan penutupan buku payroll bulanan. Kehilangan data historis akibat kegagalan sinkronisasi atau pembersihan total sistem browser tanpa adanya berkas cadangan lokal sepenuhnya merupakan risiko operasional pengguna.
                    </p>
                  </div>
                </div>

                {/* Pasal 11 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">11.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Keadaan Memaksa (Force Majeure) dalam Layanan Operasional Digital
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Pihak pengembang dibebaskan dari tanggung jawab atas kegagalan kinerja, keterlambatan fungsional sistem, atau ketidaktersediaan layanan sementara yang disebabkan oleh keadaan di luar kendali wajar (Force Majeure). Keadaan memaksa tersebut mencakup namun tidak terbatas pada bencana alam, pemadaman listrik massal nasional, kegagalan infrastruktur internet global, sabotase siber pihak ketiga, kebijakan restriksi jaringan internet oleh pemerintah, atau kerusakan masif pada pusat data server autentikasi eksternal yang menghambat kelancaran operasional sistem.
                    </p>
                  </div>
                </div>

                {/* Pasal 12 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">12.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Kepatuhan Pelaporan Wajib Ketenagakerjaan (UU No. 7 Tahun 1981)
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Meskipun HRMatrix memfasilitasi pelaporan statistik demografi karyawan, rekapitulasi upah, dan pelaporan internal departemen, platform ini tidak menggantikan kewajiban hukum perusahaan pengguna untuk melaporkan data ketenagakerjaannya secara periodik kepada Kementerian Ketenagakerjaan Republik Indonesia sebagaimana diamanatkan oleh Undang-Undang Nomor 7 Tahun 1981 tentang Wajib Lapor Ketenagakerjaan di Perusahaan. Segala bentuk pelaporan hukum eksternal wajib dilakukan secara mandiri oleh tim legal perusahaan Anda.
                    </p>
                  </div>
                </div>

                {/* Pasal 13 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">13.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Kebijakan Penghapusan Data, Retensi Informasi, dan Hak untuk Dilupakan
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Anda memiliki hak penuh untuk menghapus seluruh data perusahaan yang tersimpan di dalam IndexedDB browser Anda kapan saja melalui fitur hapus database yang disediakan pada panel keamanan aplikasi. Setelah instruksi penghapusan tersebut dieksekusi oleh pengguna administratif, seluruh data karyawan, slip gaji, absensi, dan informasi sensitif lainnya akan terhapus secara permanen dari penyimpanan browser lokal tanpa menyisakan salinan apa pun di server kami, sejalan dengan asas "Right to be Forgotten" dalam pelindungan privasi global.
                    </p>
                  </div>
                </div>

                {/* Pasal 14 */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 text-right font-semibold text-slate-700">14.</span>
                  <div className="flex-1">
                    <strong className="text-slate-700 font-medium block text-left">
                      Hak Perubahan, Adendum, dan Pembaruan Ketentuan Layanan secara Berkala
                    </strong>
                    <p className="mt-1.5 font-light text-slate-500 text-justify">
                      Pencipta berhak untuk melakukan pembaruan, perubahan, penambahan, atau pengurangan klausul pada dokumen Syarat & Ketentuan Layanan ini sewaktu-waktu guna menyesuaikan dengan perubahan regulasi undang-undang ketenagakerjaan, peraturan perpajakan baru, atau peningkatan infrastruktur keamanan teknologi aplikasi. Setiap pembaruan mayor akan diinformasikan secara transparan kepada pengguna melalui notifikasi dasbor utama sistem sebelum perubahan tersebut mulai berlaku secara efektif.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Action Footer Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shadow-lg shrink-0 flex flex-col gap-2.5">
          <AnimatePresence mode="wait">
            {step < 3 ? (
              <motion.div
                key="next-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  form={isDesktop && step < 3 ? 'form-step-1' : `form-step-${step}`}
                  disabled={loadingMode !== null}
                  size="lg"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center"
                >
                  {isDesktop ? 'Lanjut ke Syarat & Ketentuan' : 'Lanjut'}
                </Button>
              </motion.div>
            ) : !agreed ? (
              <motion.div
                key="checkbox-agree"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <label className="flex items-center justify-between w-full px-4 h-11 sm:h-12 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer select-none transition-colors shadow-xs">
                  <span className="text-xs sm:text-sm text-blue-700 font-semibold truncate pr-2">
                    Setujui Syarat & Ketentuan Layanan
                  </span>
                  <div className="relative flex items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="sr-only"
                    />
                    <div className="w-5 h-5 rounded border-2 border-blue-600 bg-white flex items-center justify-center transition-all">
                      {agreed && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
                    </div>
                  </div>
                </label>
              </motion.div>
            ) : (
              <motion.div
                key="register-btn"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, type: "spring", stiffness: 180 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  form="form-step-3"
                  disabled={loadingMode !== null}
                  size="lg"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold text-white rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loadingMode === 'submit' ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Mendaftarkan...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      Daftarkan Perusahaan
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TWO SEPARATE OPTIONS FOOTER */}
          <div className="w-full py-1.5 text-xs sm:text-sm text-slate-500 transition-colors text-center flex items-center justify-center gap-1 font-normal">
            <button
              type="button"
              disabled={loadingMode !== null}
              onClick={handleUseSampleData}
              className={`text-slate-400 hover:text-slate-600 hover:underline cursor-pointer transition-colors font-normal ${
                loadingMode === 'demo' ? 'animate-pulse text-amber-500' : ''
              }`}
            >
              {loadingMode === 'demo' ? 'Memuat Data Demo...' : 'Masuk Mode Demo'}
            </button>
            <span className="text-slate-300 mx-1">|</span>
            <button
              type="button"
              disabled={loadingMode !== null}
              onClick={handleExploreDirectly}
              className={`text-slate-400 hover:text-slate-600 hover:underline cursor-pointer transition-colors font-normal ${
                loadingMode === 'empty' ? 'animate-pulse text-blue-600' : ''
              }`}
            >
              {loadingMode === 'empty' ? 'Menyiapkan...' : 'Jelajahi Langsung'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { FormDaftar as Setup };
export default FormDaftar;
