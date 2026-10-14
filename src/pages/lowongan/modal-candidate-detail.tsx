import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Briefcase,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
  Building2,
  Calendar,
  MapPin,
  GraduationCap,
  Clock,
  TrendingUp,
  Trophy,
  BadgeCheck,
  Languages,
  Compass,
  UserCheck,
  HelpCircle,
  Lightbulb,
  Target,
  Zap,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Candidate, VacancyItem } from './types';
import { PdfViewer } from './pdf-viewer';
import { 
  extractPhoneNumber, 
  extractAddress, 
  extractEmail, 
  extractSocialLinks,
  extractCandidateName,
  evaluateCandidateAgainstVacancy
} from './ats-parser-standard';
import { 
  extractWorkExperiences, 
  extractEducationHistory,
  extractAchievements,
  extractCertifications,
  extractCandidateSkillSet,
  cleanExecutiveSummary,
  analyzeCandidatePotential
} from './work-history-parser';

interface ModalCandidateDetailProps {
  isOpen: boolean;
  candidate: Candidate | null;
  vacancy: VacancyItem | null;
  onClose: () => void;
  onProceedToInterview?: (candidate: Candidate) => void;
}

interface ParsedContactItem {
  id: string;
  label: string;
  displayValue: string;
  url?: string;
  isExternal?: boolean;
}

function formatSlugToTitle(slug: string): string {
  if (!slug) return '';
  return slug
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export const ModalCandidateDetail: React.FC<ModalCandidateDetailProps> = ({
  isOpen,
  candidate,
  vacancy,
  onClose,
  onProceedToInterview
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'kecocokan' | 'pdf'>('ringkasan');
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    softSkills: true,
    hardSkills: true,
    location: true,
    career: true,
    hrRec: true,
    experience: true,
    fivePillars: true,
    duties: true,
    matchedKeywords: true,
    missingKeywords: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !(prev[key] ?? true) }));
  };

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('ringkasan');
    }
  }, [isOpen]);

  // Reset scroll position to top whenever active tab changes
  useEffect(() => {
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  if (!candidate || !vacancy) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-2xl">
        <div className="p-6 text-center text-xs text-slate-500">
          Memuat data pelamar...
        </div>
      </Modal>
    );
  }

  const parsed = candidate.parsedDetail;
  const matchScore = candidate.matchScore || 0;
  const text = candidate.extractedText || '';

  // 1. Parse Contacts with Standard ATS Parsers
  const contactItems: ParsedContactItem[] = [];

  // Full Name / Nama Lengkap
  const parsedName = extractCandidateName(text, candidate.fileName);
  const fullNameVal = (candidate.name && candidate.name !== 'Kandidat Tanpa Nama' && !candidate.name.toLowerCase().endsWith('.pdf'))
    ? candidate.name
    : (parsedName || candidate.fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));

  contactItems.push({
    id: 'fullname',
    label: 'Nama Lengkap',
    displayValue: fullNameVal,
  });

  // Email
  const parsedEmail = extractEmail(text);
  const emailVal = (candidate.contactEmail && candidate.contactEmail !== 'Tidak terdeteksi')
    ? candidate.contactEmail
    : (parsedEmail !== 'Tidak terdeteksi' ? parsedEmail : '');

  if (emailVal) {
    contactItems.push({
      id: 'email',
      label: 'Email',
      displayValue: emailVal,
      url: `mailto:${emailVal}`,
      isExternal: true,
    });
  } else {
    contactItems.push({
      id: 'email',
      label: 'Email',
      displayValue: 'Tidak terdeteksi di CV',
    });
  }

  // Phone / WhatsApp
  const standardExtractedPhone = extractPhoneNumber(text);
  const candidatePhoneClean = candidate.contactPhone && candidate.contactPhone !== 'Tidak terdeteksi'
    ? candidate.contactPhone
    : '';

  const rawPhone = standardExtractedPhone !== 'Tidak terdeteksi' 
    ? standardExtractedPhone 
    : (candidatePhoneClean || '');

  if (rawPhone) {
    // Generate valid WhatsApp URL
    let digitsOnly = rawPhone.replace(/\D/g, '');
    if (digitsOnly.startsWith('0')) {
      digitsOnly = '62' + digitsOnly.slice(1);
    } else if (!digitsOnly.startsWith('62') && digitsOnly.length >= 9) {
      digitsOnly = '62' + digitsOnly;
    }

    contactItems.push({
      id: 'phone',
      label: 'Telepon / WhatsApp',
      displayValue: rawPhone,
      url: `https://wa.me/${digitsOnly}`,
      isExternal: true,
    });
  } else {
    contactItems.push({
      id: 'phone',
      label: 'Telepon / WhatsApp',
      displayValue: 'Tidak terdeteksi di CV',
    });
  }

  // Address / Domisili
  const standardExtractedAddress = extractAddress(text);
  const addressVal = parsed?.address && parsed.address !== 'Tidak terdeteksi'
    ? parsed.address
    : (standardExtractedAddress !== 'Tidak terdeteksi' ? standardExtractedAddress : '');

  if (addressVal) {
    contactItems.push({
      id: 'address',
      label: 'Alamat / Domisili',
      displayValue: addressVal,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressVal)}`,
      isExternal: true,
    });
  } else {
    contactItems.push({
      id: 'address',
      label: 'Alamat / Domisili',
      displayValue: 'Tidak terdeteksi di CV',
    });
  }

  // 2. Parse Links & Portfolios (LinkedIn, GitHub, Instagram, Portofolio/Website)
  const standardSocials = extractSocialLinks(text);
  const linkItems: ParsedContactItem[] = [];

  // LinkedIn
  const linkedinRaw = parsed?.socialMedia?.linkedin || standardSocials.linkedin;
  if (linkedinRaw) {
    const slugMatch = linkedinRaw.match(/linkedin\.com\/(?:in|pub|profile)\/([a-zA-Z0-9_%-]+)/i);
    const slug = slugMatch ? slugMatch[1] : '';
    const cleanSlug = slug.replace(/-[0-9a-f]{5,}$/i, '');
    const formattedName = formatSlugToTitle(cleanSlug) || candidate.name || slug;

    linkItems.push({
      id: 'linkedin',
      label: 'Linkedin',
      displayValue: formattedName,
      url: linkedinRaw.startsWith('http') ? linkedinRaw : `https://${linkedinRaw}`,
      isExternal: true,
    });
  }

  // GitHub
  const githubRaw = parsed?.socialMedia?.github || standardSocials.github;
  if (githubRaw) {
    const handleMatch = githubRaw.match(/github\.com\/([a-zA-Z0-9_%-]+)/i);
    const handle = handleMatch ? handleMatch[1] : '';
    const formattedName = handle.includes('-') || handle.includes('_') ? formatSlugToTitle(handle) : handle;

    linkItems.push({
      id: 'github',
      label: 'GitHub',
      displayValue: formattedName || handle,
      url: githubRaw.startsWith('http') ? githubRaw : `https://${githubRaw}`,
      isExternal: true,
    });
  }

  // Instagram
  const instagramRaw = (parsed?.socialMedia as any)?.instagram || standardSocials.instagram;
  if (instagramRaw) {
    const igMatch = instagramRaw.match(/instagram\.com\/([a-zA-Z0-9_.]+)/i);
    const igHandle = igMatch ? igMatch[1] : '';

    linkItems.push({
      id: 'instagram',
      label: 'Instagram',
      displayValue: igHandle ? `@${igHandle}` : 'Instagram Profile',
      url: instagramRaw.startsWith('http') ? instagramRaw : `https://${instagramRaw}`,
      isExternal: true,
    });
  }

  // Portfolio / Website
  const portfolioRaw = parsed?.socialMedia?.portfolio || standardSocials.portfolio;
  if (portfolioRaw && !portfolioRaw.includes('linkedin') && !portfolioRaw.includes('github') && !portfolioRaw.includes('instagram') && !portfolioRaw.includes('gmail') && !portfolioRaw.includes('google')) {
    const cleanUrl = portfolioRaw.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
    linkItems.push({
      id: 'portfolio',
      label: 'Portofolio / Website',
      displayValue: cleanUrl,
      url: portfolioRaw.startsWith('http') ? portfolioRaw : `https://${portfolioRaw}`,
      isExternal: true,
    });
  }

  // 3. Work History, Education, Achievements, Certifications, Skillset
  const workExps = parsed?.workExperiences || (text ? extractWorkExperiences(text).experiences : []);
  const expSummary = parsed?.experienceSummary || (text ? extractWorkExperiences(text).summary : null);
  const eduHistory = parsed?.educationHistory || (text ? extractEducationHistory(text) : []);
  const achievements = parsed?.achievements || (text ? extractAchievements(text) : []);
  const certifications = parsed?.certifications || (text ? extractCertifications(text) : []);
  const skillSet = parsed?.skillSet || (text ? extractCandidateSkillSet(text) : null);

  // Clean summary bullets (strictly separated from education/achievements/contacts)
  const summaryBulletPoints = cleanExecutiveSummary(parsed?.summary, text);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fixedHeight
      contentClassName="sm:max-w-3xl flex flex-col"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* 1. Modal Header */}
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
              {candidate.name || 'Detail Kandidat'}
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5 truncate flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {candidate.fileName}
            </p>
          </div>

          {/* Right Header Action (X Close) */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-100 shrink-0 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className={`flex-1 py-3 text-xs transition-colors border-b-2 cursor-pointer text-center font-medium ${
              activeTab === 'ringkasan'
                ? 'border-blue-600 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            Ringkasan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kecocokan')}
            className={`flex-1 py-3 text-xs transition-colors border-b-2 cursor-pointer text-center flex items-center justify-center gap-1.5 font-medium ${
              activeTab === 'kecocokan'
                ? 'border-blue-600 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <span>Potensi</span>
            {candidate.status === 'Scored' && (
              <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                matchScore >= 75 ? 'bg-emerald-100 text-emerald-800' :
                matchScore >= 50 ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {matchScore}%
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-3 text-xs transition-colors border-b-2 cursor-pointer text-center font-medium ${
              activeTab === 'pdf'
                ? 'border-blue-600 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            CV File
          </button>
        </div>

        {/* 2. Modal Body (Scrollable) */}
        <div ref={bodyScrollRef} className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs flex-1 min-h-0 bg-slate-50/30">
          
          {/* TAB 1: RINGKASAN */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-6">
              
              {/* Kontak & Domisili */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Informasi Pribadi & Kontak
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {contactItems.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-slate-200/90 rounded-xl bg-white hover:bg-slate-50/70 transition-colors gap-3 shadow-2xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-slate-400">
                          {item.label}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5 select-all">
                          {item.displayValue}
                        </div>
                      </div>

                      {item.url && (
                        <a
                          href={item.url}
                          target={item.id === 'phone' || item.id === 'address' ? '_blank' : undefined}
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                          title={`Buka ${item.label}`}
                          aria-label={`Buka ${item.label}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tautan Sosial Media & Portofolio */}
              {linkItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-purple-600" />
                    Tautan Sosial Media & Portofolio
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {linkItems.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 border border-slate-200/90 rounded-xl bg-white hover:bg-slate-50/70 transition-colors gap-3 shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-medium text-slate-400">
                            {item.label}
                          </div>
                          <div className="text-xs font-bold text-slate-900 truncate mt-0.5 select-all">
                            {item.displayValue}
                          </div>
                        </div>

                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                            title={`Buka ${item.label}`}
                            aria-label={`Buka ${item.label}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ringkasan Profil Profesional (Executive Summary) */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Ringkasan Profil Profesional
                </h4>
                <div className="p-4 border border-slate-200/80 rounded-2xl bg-white shadow-2xs">
                  <ul className="space-y-2">
                    {summaryBulletPoints.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span className="flex-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Riwayat Pengalaman Kerja & Perusahaan */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Riwayat Pengalaman Kerja & Perusahaan
                  </h4>
                  {expSummary && expSummary.totalMonths > 0 && (
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-200/80 self-start sm:self-auto">
                      Total Pengalaman: {expSummary.totalFormatted} ({workExps.length} Perusahaan)
                    </span>
                  )}
                </div>

                {workExps && workExps.length > 0 ? (
                  <div className="space-y-3">
                    {workExps.map((exp, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 sm:p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-2.5 transition-all hover:border-blue-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {exp.position}
                            </div>
                            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{exp.companyName}</span>
                              {exp.isCurrent && (
                                <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 shrink-0">
                                  Aktif
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Periode & Durasi */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {exp.period}
                            </span>
                            {exp.durationFormatted && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-lg border border-blue-100">
                                {exp.durationFormatted}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Lokasi */}
                        {exp.location && exp.location !== 'Lokasi tidak tertera' && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-normal">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{exp.location}</span>
                          </div>
                        )}

                        {/* Poin Tanggung Jawab / Pencapaian */}
                        {exp.description && exp.description.length > 0 && (
                          <div className="pt-2 border-t border-slate-100">
                            <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                              {exp.description.map((desc, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                  <span className="flex-1">{desc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-slate-500 text-xs">
                    Riwayat perusahaan belum terstruktur dalam format teks CV. Silakan periksa tab PDF Asli.
                  </div>
                )}
              </div>

              {/* Riwayat Pendidikan Formal */}
              {eduHistory && eduHistory.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Riwayat Pendidikan Formal ({eduHistory.length})
                  </h4>
                  <div className="space-y-2">
                    {eduHistory.map((edu, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 border border-slate-200/90 rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900">
                            {edu.institution}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-800">{edu.degree}</span>
                            {edu.major && <span>• {edu.major}</span>}
                            {edu.gpa && (
                              <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">
                                IPK: {edu.gpa}
                              </span>
                            )}
                          </div>
                        </div>

                        {edu.year && (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg shrink-0 self-start sm:self-auto">
                            {edu.year}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prestasi & Penghargaan */}
              {achievements && achievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Prestasi & Penghargaan ({achievements.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {achievements.map((ach, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 border border-amber-200/80 rounded-2xl bg-amber-50/30 flex flex-col justify-between gap-2 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider border ${
                              ach.type === 'Kejuaraan' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                              ach.type === 'Beasiswa' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' :
                              'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}>
                              {ach.type}
                            </span>
                            {ach.year && (
                              <span className="text-[10px] font-semibold text-slate-500">
                                {ach.year}
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                            {ach.title}
                          </div>
                        </div>

                        {ach.description && (
                          <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-amber-200/50">
                            {ach.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sertifikasi & Lisensi Profesional */}
              {certifications && certifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    Sertifikasi & Lisensi Profesional ({certifications.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {certifications.map((cert, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 border border-emerald-200/80 rounded-2xl bg-emerald-50/20 flex flex-col justify-between gap-1.5 shadow-2xs"
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {cert.title}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5 flex items-center justify-between">
                            <span>{cert.issuer || 'Lembaga / Penerbit Resmi'}</span>
                            {cert.year && (
                              <span className="text-[10px] font-semibold text-emerald-700">
                                {cert.year}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keahlian Teknis, Tools & Bahasa */}
              {skillSet && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Keahlian Teknis, Tools & Penguasaan Bahasa
                  </h4>
                  <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-3.5">
                    
                    {/* Hard Skills */}
                    {skillSet.hardSkills && skillSet.hardSkills.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Hard Skills & Spesialisasi
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {skillSet.hardSkills.map((s, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium rounded-lg">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tools & Tech */}
                    {skillSet.tools && skillSet.tools.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Tools & Aplikasi Kerja
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {skillSet.tools.map((t, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium rounded-lg">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Soft Skills */}
                    {skillSet.softSkills && skillSet.softSkills.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Soft Skills & Atribut Kerja
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {skillSet.softSkills.map((sk, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium rounded-lg">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {skillSet.languages && skillSet.languages.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5 text-indigo-600" />
                          Penguasaan Bahasa
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skillSet.languages.map((lang, idx) => (
                            <div key={idx} className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2">
                              <span className="text-xs font-bold text-indigo-900">{lang.language}</span>
                              {lang.proficiency && (
                                <span className="text-[10px] text-indigo-600 font-medium">({lang.proficiency})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: KECOCOKAN & ANALISA POTENSI */}
          {activeTab === 'kecocokan' && (() => {
            const atsEvaluation = candidate.atsMatchBreakdown || (vacancy ? evaluateCandidateAgainstVacancy(vacancy, candidate.extractedText) : null);
            const effectiveScore = atsEvaluation ? atsEvaluation.totalScore : matchScore;
            const duties = atsEvaluation?.responsibilities || candidate.matchedResponsibilities || [];
            const matchedDutiesCount = atsEvaluation ? atsEvaluation.matchedDutiesCount : duties.filter(d => d.isMatched).length;
            const totalDutiesCount = atsEvaluation ? atsEvaluation.totalDutiesCount : duties.length;

            const potential = atsEvaluation?.potentialAnalysis || (vacancy ? analyzeCandidatePotential(
              candidate.extractedText,
              vacancy,
              workExps,
              eduHistory,
              certifications,
              achievements
            ) : null);

            return (
              <div className="space-y-5">
                {/* 1. Master Match Score (Vertical, Centered, Unwrapped) */}
                <div className="flex flex-col items-center text-center space-y-3 py-1">
                  {/* Card Persen */}
                  <div className={`px-7 py-3.5 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-2xs border ${
                    effectiveScore >= 75 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    effectiveScore >= 50 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {effectiveScore}%
                  </div>

                  {/* Badge */}
                  <div>
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                      effectiveScore >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      effectiveScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {effectiveScore >= 75 ? 'Sangat Cocok (High Fit)' :
                       effectiveScore >= 50 ? 'Potensial (Medium Fit)' :
                       'Perlu Pertimbangan (Low Fit)'}
                    </span>
                  </div>

                  {/* Judul */}
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">Skor Kecocokan ATS Teruji</h4>

                  {/* Deskripsi */}
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    Dihitung dari kesesuaian tugas nyata, masa kerja perusahaan, keahlian teknis, dan soft skills.
                  </p>

                  {/* Indikator */}
                  <div className="w-full max-w-md space-y-1 pt-1 text-left">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Kecocokan Total</span>
                      <span>{effectiveScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          effectiveScore >= 75 ? 'bg-emerald-500' :
                          effectiveScore >= 50 ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${effectiveScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. ACCORDION SECTIONS (ATTACHED DIRECTLY TO MODAL LAYOUT) */}
                <div className="border-t border-b border-slate-200 divide-y divide-slate-200 mt-2">
                  {/* SECTION 1: Rincian Bobot Penilaian ATS (5-Pilar) */}
                  {atsEvaluation && (
                    <div className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleSection('fivePillars')}
                        className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Rincian Bobot Penilaian ATS (5-Pilar)
                          </h5>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.fivePillars ? 'rotate-180' : ''}`} />
                      </button>

                      {openSections.fivePillars && (
                        <div className="pt-2 pb-1 space-y-4 px-0.5">
                          {/* Pilar 1 */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-bold text-slate-900">
                                Riwayat Tugas (Bobot 30%)
                              </span>
                              <span className="font-extrabold text-slate-900">{atsEvaluation.responsibilitiesScore}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${atsEvaluation.responsibilitiesScore}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              {matchedDutiesCount} dari {totalDutiesCount} tugas terbukti pernah diemban
                            </p>
                          </div>

                          {/* Pilar 2 */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-bold text-slate-900">
                                Keahlian & Tools (Bobot 25%)
                              </span>
                              <span className="font-extrabold text-slate-900">{atsEvaluation.technicalSkillsScore}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${atsEvaluation.technicalSkillsScore}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Pencocokan hard skills & perangkat kerja yang relevan
                            </p>
                          </div>
                          
                          {/* Pilar 3 */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-bold text-slate-900">
                                Lokasi & Domisili (Bobot 20%)
                              </span>
                              <span className="font-extrabold text-slate-900">{atsEvaluation.locationScore || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-600 rounded-full transition-all" style={{ width: `${atsEvaluation.locationScore || 0}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              {atsEvaluation.locationEvaluation?.status || 'Tidak ada data'}
                            </p>
                          </div>

                          {/* Pilar 4 */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-bold text-slate-900">
                                Masa Kerja & Kualifikasi (Bobot 15%)
                              </span>
                              <span className="font-extrabold text-slate-900">{atsEvaluation.qualificationsScore}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${atsEvaluation.qualificationsScore}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Kesesuaian masa kerja (tenure) & jenjang sertifikasi
                            </p>
                          </div>

                          {/* Pilar 5 */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-bold text-slate-900">
                                Soft Skills (Bobot 10%)
                              </span>
                              <span className="font-extrabold text-slate-900">{atsEvaluation.softSkillsScore}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-600 rounded-full transition-all" style={{ width: `${atsEvaluation.softSkillsScore}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Kompetensi kepemimpinan, komunikasi, & problem solving
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 2: Kecenderungan Soft Skills & Gaya Kerja Dominan */}
                  {potential && (
                    <div className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleSection('softSkills')}
                        className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Kecenderungan Soft Skills & Gaya Kerja Dominan
                          </h5>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.softSkills ? 'rotate-180' : ''}`} />
                      </button>

                      {openSections.softSkills && (
                        <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                          {/* Full-width Card 2-line */}
                          <div className="w-full p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl shadow-2xs flex flex-col gap-0.5">
                            <span className="text-[11px] font-medium text-slate-500">Gaya Kerja Dominan</span>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {potential.softSkillTendency.dominantWorkStyle}
                            </span>
                          </div>

                          {/* Traits Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {potential.softSkillTendency.traits.map((trait, idx) => (
                              <div 
                                key={idx}
                                className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900">{trait.trait}</span>
                                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                                    trait.strengthLevel === 'Tinggi' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                                    trait.strengthLevel === 'Sedang' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                                    'bg-slate-200 text-slate-900 border-slate-300'
                                  }`}>
                                    {trait.strengthLevel}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                                  {trait.description}
                                </p>
                                {trait.evidence && (
                                  <div className="text-[10px] text-slate-700 italic pt-1.5 border-t border-slate-200">
                                    Bukti: "{trait.evidence}"
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 2: Penguasaan Hard Skills & Kedalaman Domain */}
                  {potential && (
                    <div className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleSection('hardSkills')}
                        className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Penguasaan Hard Skills & Kedalaman Domain
                          </h5>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.hardSkills ? 'rotate-180' : ''}`} />
                      </button>

                      {openSections.hardSkills && (
                        <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                          {/* Full-width Card 2-line */}
                          <div className="w-full p-3 bg-blue-50/80 border border-blue-200/90 rounded-xl shadow-2xs flex flex-col gap-0.5">
                            <span className="text-[11px] font-medium text-slate-500">Spesialisasi Domain & Level</span>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {potential.hardSkillCompetency.domainSpecialization} • {potential.hardSkillCompetency.masteryLevel}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="space-y-3 pt-1">
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {potential.hardSkillCompetency.depthAnalysis}
                            </p>

                            {potential.hardSkillCompetency.keyTechnologies.length > 0 && (
                              <div className="space-y-2 pt-1">
                                <span className="text-xs font-bold text-slate-900 block">Teknologi / Domain Utama:</span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {potential.hardSkillCompetency.keyTechnologies.map((t, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-white border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg shadow-2xs">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 3: Kesesuaian Lokasi & Mobilitas */}
                  {atsEvaluation.locationEvaluation && (
                    <div className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleSection('location')}
                        className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Kesesuaian Lokasi & Mobilitas
                          </h5>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.location ? 'rotate-180' : ''}`} />
                      </button>

                      {openSections.location && (
                        <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                          {/* Full-width Card 2-line */}
                          <div className="w-full p-3 bg-rose-50/80 border border-rose-200/90 rounded-xl shadow-2xs flex flex-col gap-0.5">
                            <span className="text-[11px] font-medium text-slate-500">Status Kesesuaian Lokasi</span>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {atsEvaluation.locationEvaluation.status} ({atsEvaluation.locationEvaluation.matchPercentage}%)
                            </span>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center text-center gap-0.5">
                              <span className="text-[11px] font-medium text-slate-500">Lokasi Penempatan</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900">{vacancy.location || 'Tidak spesifik'}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center text-center gap-0.5">
                              <span className="text-[11px] font-medium text-slate-500">Domisili Kandidat</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900">{atsEvaluation.locationEvaluation.candidateExplicitLocation}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1">
                            {atsEvaluation.locationEvaluation.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 4: Pola Pertumbuhan Karir & Stabilitas Tenure */}
                  {potential && (
                    <div className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleSection('career')}
                        className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Pola Pertumbuhan Karir & Stabilitas Tenure
                          </h5>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.career ? 'rotate-180' : ''}`} />
                      </button>

                      {openSections.career && (
                        <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                          {/* Full-width Card 2-line */}
                          <div className="w-full p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-xl shadow-2xs flex flex-col gap-0.5">
                            <span className="text-[11px] font-medium text-slate-500">Tingkat Stabilitas Karir</span>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {potential.careerTrajectory.stabilityRating} ({potential.careerTrajectory.averageTenurePerCompany})
                            </span>
                          </div>

                          {/* Details */}
                          <div className="space-y-1 pt-1">
                            <div className="text-xs font-bold text-slate-900">
                              Pola: {potential.careerTrajectory.growthPattern}
                            </div>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {potential.careerTrajectory.insights}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 5: Rekomendasi Strategis HR & Panduan Wawancara */}
                  {potential && (
                    <div className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleSection('hrRec')}
                        className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <Target className="w-4 h-4 text-indigo-600 shrink-0" />
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Rekomendasi Strategis HR & Panduan Wawancara
                          </h5>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.hrRec ? 'rotate-180' : ''}`} />
                      </button>

                      {openSections.hrRec && (
                        <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                          {/* Full-width Card 2-line */}
                          <div className="w-full p-3 bg-indigo-50/80 border border-indigo-200/90 rounded-xl shadow-2xs flex flex-col gap-0.5">
                            <span className="text-[11px] font-medium text-slate-500">Rekomendasi Level Senioritas</span>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              Level: {potential.hiringRecommendations.suggestedSeniority}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="space-y-3.5 pt-1">
                            {potential.hiringRecommendations.keyStrengths.length > 0 && (
                              <div>
                                <h6 className="text-xs font-bold text-slate-800 mb-2">
                                  Kekuatan Kunci Kandidat:
                                </h6>
                                <div className="space-y-1.5">
                                  {potential.hiringRecommendations.keyStrengths.map((str, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700 leading-relaxed">
                                      <span className="text-slate-700 font-bold shrink-0">•</span>
                                      <span>{str}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {potential.hiringRecommendations.areasToProbeInInterview.length > 0 && (
                              <div className="pt-2">
                                <h6 className="text-xs font-bold text-slate-800 mb-2">
                                  Pertanyaan Kunci untuk Digali saat Wawancara:
                                </h6>
                                <div className="space-y-2">
                                  {potential.hiringRecommendations.areasToProbeInInterview.map((q, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-800 leading-relaxed">
                                      <span className="font-bold text-slate-800 shrink-0">{idx + 1}.</span>
                                      <span className="flex-1">{q}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1">
                              {potential.hiringRecommendations.overallFitSummary}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 6: Penilaian Kesesuaian Masa Kerja & Pengalaman */}
                  {atsEvaluation?.experienceEvaluation && (
                    <div className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleSection('experience')}
                        className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Penilaian Kesesuaian Masa Kerja & Pengalaman
                          </h5>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.experience ? 'rotate-180' : ''}`} />
                      </button>

                      {openSections.experience && (
                        <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                          {/* Full-width Card 2-line */}
                          <div className="w-full p-3 bg-indigo-50/80 border border-indigo-200/90 rounded-xl shadow-2xs flex flex-col gap-0.5">
                            <span className="text-[11px] font-medium text-slate-500">Status Kesesuaian Masa Kerja</span>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {atsEvaluation.experienceEvaluation.status} ({atsEvaluation.experienceEvaluation.matchPercentage}%)
                            </span>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col gap-0.5">
                              <span className="text-[11px] font-medium text-slate-500">Total Masa Kerja Terdeteksi di CV</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                                {atsEvaluation.experienceEvaluation.candidateFormatted || 'Tidak tertera spesifik'}
                              </span>
                            </div>

                            <div className="p-3 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col gap-0.5">
                              <span className="text-[11px] font-medium text-slate-500">Syarat Minimal Pengalaman Lowongan</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                                Minimal {atsEvaluation.experienceEvaluation.requiredYearsMin}{atsEvaluation.experienceEvaluation.requiredYearsMax ? ` - ${atsEvaluation.experienceEvaluation.requiredYearsMax}` : ''} Tahun
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1">
                            {atsEvaluation.experienceEvaluation.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 8: Pendeteksian Tugas & Tanggung Jawab yang Pernah Diemban */}
                  <div className="py-3">
                    <button
                      type="button"
                      onClick={() => toggleSection('duties')}
                      className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Pendeteksian Tugas & Tanggung Jawab yang Pernah Diemban
                        </h5>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.duties ? 'rotate-180' : ''}`} />
                    </button>

                    {openSections.duties && (
                      <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                        {/* Full-width Card 2-line */}
                        <div className="w-full p-3 bg-blue-50/80 border border-blue-200/90 rounded-xl shadow-2xs flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium text-slate-500">Tugas Terdeteksi Cocok</span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {matchedDutiesCount} / {totalDutiesCount} Tugas
                          </span>
                        </div>

                        {duties.length > 0 ? (
                          <div className="space-y-2.5 pt-1">
                            {duties.map((item, idx) => (
                              <div 
                                key={idx}
                                className={`p-3 rounded-xl border transition-all ${
                                  item.matchConfidence === 'Tinggi' ? 'bg-emerald-50/50 border-emerald-300' :
                                  item.matchConfidence === 'Sedang' ? 'bg-amber-50/50 border-amber-300' :
                                  'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2.5">
                                  <div className="flex items-start gap-2 flex-1">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                      item.matchConfidence === 'Tinggi' ? 'bg-emerald-600 text-white' :
                                      item.matchConfidence === 'Sedang' ? 'bg-amber-600 text-white' :
                                      'bg-slate-400 text-white'
                                    }`}>
                                      {idx + 1}
                                    </span>
                                    <p className="text-xs font-bold text-slate-900 leading-relaxed">
                                      {item.duty}
                                    </p>
                                  </div>
                                </div>

                                {item.matchedKeywords && item.matchedKeywords.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-2 pl-7">
                                    <span className="text-[10px] font-bold text-slate-700">Kata kunci cocok:</span>
                                    {item.matchedKeywords.map((kw, kidx) => (
                                      <span 
                                        key={kidx}
                                        className="px-1.5 py-0.5 bg-white border border-slate-300 text-slate-900 text-[10px] font-bold rounded capitalize shadow-2xs"
                                      >
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {item.matchedContext && (
                                  <div className="mt-2.5 pl-7">
                                    <div className="p-2.5 bg-white border-l-2 border-emerald-500 rounded-r-xl shadow-2xs flex flex-col gap-0.5">
                                      <span className="text-[11px] font-bold text-slate-800">Bukti Riwayat CV</span>
                                      <span className="text-xs text-slate-700 font-medium leading-relaxed">
                                        {item.matchedContext}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-700 font-medium italic p-3 text-center">
                            Belum ada data tugas spesifik yang tercatat pada jobdesk lowongan ini.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SECTION 9: Kualifikasi & Kata Kunci Terdeteksi */}
                  <div className="py-3">
                    <button
                      type="button"
                      onClick={() => toggleSection('matchedKeywords')}
                      className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Kualifikasi & Kata Kunci Terdeteksi ({atsEvaluation?.structuredRequirements?.filter(r => r.isMatched).length || candidate.matchedKeywords?.length || 0})
                        </h5>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.matchedKeywords ? 'rotate-180' : ''}`} />
                    </button>

                    {openSections.matchedKeywords && (
                      <div className="pt-2.5 pb-1 space-y-3 px-0.5">
                        {atsEvaluation?.structuredRequirements ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {atsEvaluation.structuredRequirements.filter(r => r.isMatched).map((req, idx) => (
                              <div 
                                key={idx}
                                className="px-2.5 py-1.5 bg-white border border-emerald-300 rounded-xl shadow-2xs flex flex-col gap-0.5"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="text-xs font-bold text-slate-900">
                                    {req.displayLabel}
                                  </span>
                                </div>
                                {req.matchedAlias && req.matchedAlias !== req.displayLabel.toLowerCase() && (
                                  <span className="text-[10px] text-emerald-900 font-bold pl-5">
                                    Terdeteksi di CV: <span className="underline italic">"{req.matchedAlias}"</span>
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : candidate.matchedKeywords && candidate.matchedKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {candidate.matchedKeywords.map((kw, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-white border border-emerald-300 text-emerald-950 text-[11px] font-bold rounded-md shadow-2xs flex items-center gap-1 capitalize"
                              >
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                {kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-700 font-medium italic">Belum ada kata kunci kualifikasi yang terdeteksi cocok secara spesifik.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SECTION 10: Kualifikasi / Keyword Belum Ditemukan */}
                  <div className="py-3">
                    <button
                      type="button"
                      onClick={() => toggleSection('missingKeywords')}
                      className="w-full flex items-center justify-between py-1.5 text-left hover:bg-slate-50/80 rounded-lg px-2 transition-colors select-none group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Kualifikasi / Keyword Belum Ditemukan ({atsEvaluation?.structuredRequirements?.filter(r => !r.isMatched).length || candidate.missingKeywords?.length || 0})
                        </h5>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${openSections.missingKeywords ? 'rotate-180' : ''}`} />
                    </button>

                    {openSections.missingKeywords && (
                      <div className="pt-2.5 pb-1 space-y-3 px-2">
                        {atsEvaluation?.structuredRequirements ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {atsEvaluation.structuredRequirements.filter(r => !r.isMatched).map((req, idx) => (
                              <span 
                                key={idx}
                                className="px-2.5 py-1 bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs"
                              >
                                {req.displayLabel}
                              </span>
                            ))}
                          </div>
                        ) : candidate.missingKeywords && candidate.missingKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {candidate.missingKeywords.map((kw, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-white border border-slate-300 text-slate-800 text-[11px] font-medium rounded-md capitalize"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-800 font-bold text-xs">Semua kualifikasi standar berhasil ditemukan pada CV!</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 3: PDF FILE */}
          {activeTab === 'pdf' && (
            <div className="w-full">
              <PdfViewer 
                fileDataUrl={candidate.fileDataUrl}
                file={candidate.file}
                fileName={candidate.fileName}
              />
            </div>
          )}
        </div>

        {/* 3. Modal Sticky Bottom Action Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 rounded-b-2xl shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <span className="font-bold text-slate-800 truncate">{candidate.name || candidate.fileName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-600 font-semibold truncate">{vacancy.jobTitle}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onProceedToInterview) {
                onProceedToInterview(candidate);
              }
              onClose();
              navigate(`/candidate?candidateId=${candidate.id}`);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            <span>Daftarkan Sebagai Kandidat</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
