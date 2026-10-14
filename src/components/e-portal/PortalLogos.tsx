import React from 'react';

export const GARUDA_INDONESIA_URL = '/gambar/garuda-pancasila.png';

export const GarudaLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src={GARUDA_INDONESIA_URL}
    alt="Lambang Negara Garuda Pancasila"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

interface PortalLogoProps {
  logoKey?: string;
  className?: string;
}

/**
 * Mapping presisi logo resmi instansi pemerintah & perbankan Indonesia
 * Mengacu langsung ke file aset beresolusi tinggi di folder /public/gambar/logo/*.webp
 */
export const PORTAL_WEBP_LOGOS: Record<string, { src: string; alt: string }> = {
  // ==================== CHECKING TOOLS (VERIFIKASI REKRUTMEN) ====================
  // 1. Ijazah Perguruan Tinggi (SIVIL / PDDikti Kemdiktisaintek)
  sivil: { src: '/gambar/logo/logo-diktisaintek.webp', alt: 'Kemdiktisaintek SIVIL PDDikti' },
  'ijazah-pt': { src: '/gambar/logo/logo-diktisaintek.webp', alt: 'Kemdiktisaintek SIVIL PDDikti' },
  pddikti: { src: '/gambar/logo/logo-diktisaintek.webp', alt: 'Kemdiktisaintek SIVIL PDDikti' },
  ijazah: { src: '/gambar/logo/logo-diktisaintek.webp', alt: 'Kemdiktisaintek SIVIL PDDikti' },
  diktisaintek: { src: '/gambar/logo/logo-diktisaintek.webp', alt: 'Kemdiktisaintek SIVIL PDDikti' },
  kemdiktisaintek: { src: '/gambar/logo/logo-diktisaintek.webp', alt: 'Kemdiktisaintek SIVIL PDDikti' },
  'logo-diktisaintek.webp': { src: '/gambar/logo/logo-diktisaintek.webp', alt: 'Kemdiktisaintek SIVIL PDDikti' },

  // 2. Ijazah SD, SMP, SMA, SMK (NISN Kemendikbud)
  nisn: { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },
  'ijazah-sd-sma': { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },
  'ijazah-sekolah': { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },
  sekolah: { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },
  'sd-sma': { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },
  kemendikbud: { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },
  kemendikdasmen: { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },
  dapodik: { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud Dapodik' },
  dapo: { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud Dapodik' },
  'logo-kemendikbud.webp': { src: '/gambar/logo/logo-kemendikbud.webp', alt: 'Kemendikbud NISN Ijazah SD-SMA' },

  // 3. Sertifikasi Profesi BNSP
  bnsp: { src: '/gambar/logo/logo-bnsp.webp', alt: 'BNSP Badan Nasional Sertifikasi Profesi' },
  'sertifikasi-bnsp': { src: '/gambar/logo/logo-bnsp.webp', alt: 'BNSP Badan Nasional Sertifikasi Profesi' },
  'logo-bnsp.webp': { src: '/gambar/logo/logo-bnsp.webp', alt: 'BNSP Badan Nasional Sertifikasi Profesi' },

  // 4. SLIK OJK (iDebKu)
  slik: { src: '/gambar/logo/logo-ojk.webp', alt: 'Otoritas Jasa Keuangan SLIK iDebKu' },
  idebku: { src: '/gambar/logo/logo-ojk.webp', alt: 'Otoritas Jasa Keuangan SLIK iDebKu' },
  ojk: { src: '/gambar/logo/logo-ojk.webp', alt: 'Otoritas Jasa Keuangan' },
  'logo-ojk.webp': { src: '/gambar/logo/logo-ojk.webp', alt: 'Otoritas Jasa Keuangan' },

  // 5. Cek KTP / NIK Dukcapil (Kemendagri)
  dukcapil: { src: '/gambar/logo/logo-kemendagri.webp', alt: 'Kemendagri Dukcapil KTP' },
  kemendagri: { src: '/gambar/logo/logo-kemendagri.webp', alt: 'Kemendagri Dukcapil KTP' },
  nik: { src: '/gambar/logo/logo-kemendagri.webp', alt: 'Kemendagri Dukcapil KTP' },
  ktp: { src: '/gambar/logo/logo-kemendagri.webp', alt: 'Kemendagri Dukcapil KTP' },
  'logo-kemendagri.webp': { src: '/gambar/logo/logo-kemendagri.webp', alt: 'Kemendagri Dukcapil KTP' },

  // 6. Cek NPWP DJP (Direktorat Jenderal Pajak)
  ceknpwp: { src: '/gambar/logo/logo-djp.webp', alt: 'Direktorat Jenderal Pajak NPWP' },
  'cek-npwp': { src: '/gambar/logo/logo-djp.webp', alt: 'Direktorat Jenderal Pajak NPWP' },
  npwp: { src: '/gambar/logo/logo-djp.webp', alt: 'Direktorat Jenderal Pajak NPWP' },
  'logo-djp.webp': { src: '/gambar/logo/logo-djp.webp', alt: 'Direktorat Jenderal Pajak NPWP' },

  // 7. SKCK Online Polri
  skck: { src: '/gambar/logo/logo-polri.webp', alt: 'Kepolisian Negara Republik Indonesia Polri SKCK' },
  polri: { src: '/gambar/logo/logo-polri.webp', alt: 'Kepolisian Negara Republik Indonesia Polri' },
  kepolisian: { src: '/gambar/logo/logo-polri.webp', alt: 'Kepolisian Negara Republik Indonesia Polri' },
  'logo-polri.webp': { src: '/gambar/logo/logo-polri.webp', alt: 'Kepolisian Negara Republik Indonesia Polri' },

  // 8. SIPP Mahkamah Agung
  sippma: { src: '/gambar/logo/logo-mahkamah-agung.webp', alt: 'Mahkamah Agung RI SIPP' },
  'sipp-ma': { src: '/gambar/logo/logo-mahkamah-agung.webp', alt: 'Mahkamah Agung RI SIPP' },
  mahkamahagung: { src: '/gambar/logo/logo-mahkamah-agung.webp', alt: 'Mahkamah Agung RI' },
  'mahkamah-agung': { src: '/gambar/logo/logo-mahkamah-agung.webp', alt: 'Mahkamah Agung RI' },
  'logo-mahkamah-agung.webp': { src: '/gambar/logo/logo-mahkamah-agung.webp', alt: 'Mahkamah Agung RI' },

  // 9. STR / SIP Kemenkes (Satusehat SDMK)
  kki: { src: '/gambar/logo/logo-kemenakes.webp', alt: 'Kementerian Kesehatan KKI STR' },
  str: { src: '/gambar/logo/logo-kemenakes.webp', alt: 'Kementerian Kesehatan STR' },
  sip: { src: '/gambar/logo/logo-kemenakes.webp', alt: 'Kementerian Kesehatan SIP' },
  kemenkes: { src: '/gambar/logo/logo-kemenakes.webp', alt: 'Kementerian Kesehatan' },
  kemenakes: { src: '/gambar/logo/logo-kemenakes.webp', alt: 'Kementerian Kesehatan' },
  satusehat: { src: '/gambar/logo/logo-kemenakes.webp', alt: 'Satusehat Kemenkes' },
  'logo-kemenakes.webp': { src: '/gambar/logo/logo-kemenakes.webp', alt: 'Kementerian Kesehatan' },

  // ==================== E-PORTAL (RANAH HR) ====================
  // 10. Kemenaker WLKP
  kemenaker: { src: '/gambar/logo/logo-kemnaker.webp', alt: 'Kementerian Ketenagakerjaan WLKP' },
  kemnaker: { src: '/gambar/logo/logo-kemnaker.webp', alt: 'Kementerian Ketenagakerjaan WLKP' },
  wlkp: { src: '/gambar/logo/logo-kemnaker.webp', alt: 'Kementerian Ketenagakerjaan WLKP' },
  'logo-kemnaker.webp': { src: '/gambar/logo/logo-kemnaker.webp', alt: 'Kementerian Ketenagakerjaan WLKP' },

  // 11. BPJS Ketenagakerjaan (SIPP Online)
  bpjstk: { src: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp', alt: 'BPJS Ketenagakerjaan SIPP' },
  'bpjs-tk': { src: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp', alt: 'BPJS Ketenagakerjaan SIPP' },
  'bpjs-ketenagakerjaan': { src: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp', alt: 'BPJS Ketenagakerjaan SIPP' },
  sipp: { src: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp', alt: 'BPJS Ketenagakerjaan SIPP' },
  'logo-bpjs-ketenagakerjaan.webp': { src: '/gambar/logo/logo-bpjs-ketenagakerjaan.webp', alt: 'BPJS Ketenagakerjaan SIPP' },

  // 12. BPJS Kesehatan (e-Dabu Badan Usaha)
  edabu: { src: '/gambar/logo/logo-bpjs-kesehatan.webp', alt: 'BPJS Kesehatan e-Dabu' },
  'e-dabu': { src: '/gambar/logo/logo-bpjs-kesehatan.webp', alt: 'BPJS Kesehatan e-Dabu' },
  bpjskes: { src: '/gambar/logo/logo-bpjs-kesehatan.webp', alt: 'BPJS Kesehatan' },
  'bpjs-kesehatan': { src: '/gambar/logo/logo-bpjs-kesehatan.webp', alt: 'BPJS Kesehatan' },
  'logo-bpjs-kesehatan.webp': { src: '/gambar/logo/logo-bpjs-kesehatan.webp', alt: 'BPJS Kesehatan' },

  // 13. DJP Online Pajak / CoreTax
  djp: { src: '/gambar/logo/logo-djp.webp', alt: 'Direktorat Jenderal Pajak DJP Online' },
  pajak: { src: '/gambar/logo/logo-djp.webp', alt: 'Direktorat Jenderal Pajak DJP Online' },
  coretax: { src: '/gambar/logo/logo-djp.webp', alt: 'CoreTax DJP Pajak' },

  // 14. E-PP & PKB (Hubungan Industrial Kemnaker)
  'e-pp-pkb': { src: '/gambar/logo/logo-industrial.webp', alt: 'E-PP & PKB Hubungan Industrial' },
  epppkb: { src: '/gambar/logo/logo-industrial.webp', alt: 'E-PP & PKB Hubungan Industrial' },
  pppkb: { src: '/gambar/logo/logo-industrial.webp', alt: 'E-PP & PKB Hubungan Industrial' },
  'pp-pkb': { src: '/gambar/logo/logo-industrial.webp', alt: 'E-PP & PKB Hubungan Industrial' },
  industrial: { src: '/gambar/logo/logo-industrial.webp', alt: 'E-PP & PKB Hubungan Industrial' },
  'logo-industrial.webp': { src: '/gambar/logo/logo-industrial.webp', alt: 'E-PP & PKB Hubungan Industrial' },

  // 15. Teman K3 (P2K3 & Keselamatan Kerja Kemnaker)
  temank3: { src: '/gambar/logo/logo-k3.webp', alt: 'Teman K3 Kemnaker' },
  'teman-k3': { src: '/gambar/logo/logo-k3.webp', alt: 'Teman K3 Kemnaker' },
  k3: { src: '/gambar/logo/logo-k3.webp', alt: 'Keselamatan & Kesehatan Kerja K3' },
  p2k3: { src: '/gambar/logo/logo-k3.webp', alt: 'P2K3 Kemnaker' },
  'logo-k3.webp': { src: '/gambar/logo/logo-k3.webp', alt: 'Keselamatan & Kesehatan Kerja K3' },

  // 16. TKA Online (RPTKA & Izin Tenaga Kerja Asing / KITAS)
  tka: { src: '/gambar/logo/logo-kitas.webp', alt: 'TKA Online Kemnaker KITAS' },
  'tka-online': { src: '/gambar/logo/logo-kitas.webp', alt: 'TKA Online Kemnaker KITAS' },
  rptka: { src: '/gambar/logo/logo-kitas.webp', alt: 'TKA Online Kemnaker KITAS' },
  kitas: { src: '/gambar/logo/logo-kitas.webp', alt: 'TKA Online Kemnaker KITAS' },
  'logo-kitas.webp': { src: '/gambar/logo/logo-kitas.webp', alt: 'TKA Online Kemnaker KITAS' },

  // 17. Karirhub (SIAPkerja Kemnaker)
  karirhub: { src: '/gambar/logo/logo-siap-kerja.webp', alt: 'Karirhub SIAPkerja Kemnaker' },
  siapkerja: { src: '/gambar/logo/logo-siap-kerja.webp', alt: 'SIAPkerja Kemnaker' },
  'siap-kerja': { src: '/gambar/logo/logo-siap-kerja.webp', alt: 'SIAPkerja Kemnaker' },
  'pasar-kerja': { src: '/gambar/logo/logo-siap-kerja.webp', alt: 'SIAPkerja Kemnaker' },
  'logo-siap-kerja.webp': { src: '/gambar/logo/logo-siap-kerja.webp', alt: 'SIAPkerja Kemnaker' },

  // 18. PPHI (Perselisihan Hubungan Industrial / SIMASNAKER)
  pphi: { src: '/gambar/logo/logo-industrial.webp', alt: 'PPHI Hubungan Industrial Kemnaker' },
  simasnaker: { src: '/gambar/logo/logo-industrial.webp', alt: 'PPHI SIMASNAKER Kemnaker' },
  phi: { src: '/gambar/logo/logo-industrial.webp', alt: 'PPHI Hubungan Industrial Kemnaker' },

  // ==================== E-PORTAL (RANAH GA) ====================
  // 19. OSS RBA (Kementerian Investasi / BKPM - LKPM)
  oss: { src: '/gambar/logo/logo-bkpm.webp', alt: 'BKPM OSS RBA' },
  'oss-rba': { src: '/gambar/logo/logo-bkpm.webp', alt: 'BKPM OSS RBA' },
  bkpm: { src: '/gambar/logo/logo-bkpm.webp', alt: 'BKPM OSS RBA' },
  lkpm: { src: '/gambar/logo/logo-bkpm.webp', alt: 'BKPM OSS RBA LKPM' },
  'logo-bkpm.webp': { src: '/gambar/logo/logo-bkpm.webp', alt: 'BKPM OSS RBA' },

  // 20. SIMPEL KLHK (Lingkungan Hidup)
  simpel: { src: '/gambar/logo/logo-klh.webp', alt: 'Kementerian Lingkungan Hidup SIMPEL' },
  'simpel-klhk': { src: '/gambar/logo/logo-klh.webp', alt: 'Kementerian Lingkungan Hidup SIMPEL' },
  lingkungan: { src: '/gambar/logo/logo-klh.webp', alt: 'Kementerian Lingkungan Hidup SIMPEL' },
  klh: { src: '/gambar/logo/logo-klh.webp', alt: 'Kementerian Lingkungan Hidup SIMPEL' },
  klhk: { src: '/gambar/logo/logo-klh.webp', alt: 'Kementerian Lingkungan Hidup SIMPEL' },
  'logo-klh.webp': { src: '/gambar/logo/logo-klh.webp', alt: 'Kementerian Lingkungan Hidup SIMPEL' },

  // 21. Festronik (Limbah B3 KLHK / DLH)
  festronik: { src: '/gambar/logo/logo-dlh.webp', alt: 'Festronik Limbah B3 KLHK' },
  'festronik-klhk': { src: '/gambar/logo/logo-dlh.webp', alt: 'Festronik Limbah B3 KLHK' },
  'limbah-b3': { src: '/gambar/logo/logo-dlh.webp', alt: 'Festronik Limbah B3 KLHK' },
  dlh: { src: '/gambar/logo/logo-dlh.webp', alt: 'Festronik Limbah B3 KLHK' },
  'logo-dlh.webp': { src: '/gambar/logo/logo-dlh.webp', alt: 'Festronik Limbah B3 KLHK' },

  // 22. SIMBG PUPR (PBG & SLF Gedung)
  simbg: { src: '/gambar/logo/logo-pupr.webp', alt: 'Kementerian PUPR SIMBG' },
  'simbg-pupr': { src: '/gambar/logo/logo-pupr.webp', alt: 'Kementerian PUPR SIMBG' },
  pupr: { src: '/gambar/logo/logo-pupr.webp', alt: 'Kementerian PUPR' },
  pbg: { src: '/gambar/logo/logo-pupr.webp', alt: 'SIMBG PUPR PBG' },
  slf: { src: '/gambar/logo/logo-pupr.webp', alt: 'SIMBG PUPR SLF' },
  'logo-pupr.webp': { src: '/gambar/logo/logo-pupr.webp', alt: 'Kementerian PUPR' },

  // 23. Bapenda (Pajak Daerah)
  bapenda: { src: '/gambar/logo/logo-dirjen-pajak.webp', alt: 'Bapenda Pajak Daerah' },
  'pajak-daerah': { src: '/gambar/logo/logo-dirjen-pajak.webp', alt: 'Bapenda Pajak Daerah' },
  reklame: { src: '/gambar/logo/logo-dirjen-pajak.webp', alt: 'Bapenda Pajak Daerah' },
  'dirjen-pajak': { src: '/gambar/logo/logo-dirjen-pajak.webp', alt: 'Bapenda Pajak Daerah' },
  'logo-dirjen-pajak.webp': { src: '/gambar/logo/logo-dirjen-pajak.webp', alt: 'Bapenda Pajak Daerah' },

  // 24. Skillhub Kemnaker
  skillhub: { src: '/gambar/logo/logo-skill-hub.webp', alt: 'Skillhub Kemnaker' },
  'skill-hub': { src: '/gambar/logo/logo-skill-hub.webp', alt: 'Skillhub Kemnaker' },
  'logo-skill-hub.webp': { src: '/gambar/logo/logo-skill-hub.webp', alt: 'Skillhub Kemnaker' },

  // 25. HRMatrix
  hrmatrix: { src: '/gambar/logo/logo-hrmatrix.webp', alt: 'HRMatrix' },
  'logo-hrmatrix.webp': { src: '/gambar/logo/logo-hrmatrix.webp', alt: 'HRMatrix' },
};

// ==================== INDIVIDUAL LOGO COMPONENTS ====================
// Komponen-komponen ini mengekspor gambar resmi WebP beresolusi tajam dari public/gambar/logo/*.webp

export const SivilLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-diktisaintek.webp"
    alt="Kemdiktisaintek SIVIL PDDikti"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const NisnLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-kemendikbud.webp"
    alt="Kemendikbud NISN Ijazah SD-SMA"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const BNSPLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-bnsp.webp"
    alt="BNSP Badan Nasional Sertifikasi Profesi"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const SLIKLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-ojk.webp"
    alt="OJK SLIK iDebKu"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const DukcapilLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-kemendagri.webp"
    alt="Kemendagri Dukcapil KTP"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const DJPLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-djp.webp"
    alt="Direktorat Jenderal Pajak DJP"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const SKCKLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-polri.webp"
    alt="Polri SKCK Online"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const SIPPMALogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-mahkamah-agung.webp"
    alt="Mahkamah Agung SIPP"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const KKILogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-kemenakes.webp"
    alt="Kementerian Kesehatan Satusehat SDMK KKI STR"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const KemenakerLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-kemnaker.webp"
    alt="Kementerian Ketenagakerjaan WLKP"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const BPJSTKLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-bpjs-ketenagakerjaan.webp"
    alt="BPJS Ketenagakerjaan SIPP"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const EdabuLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-bpjs-kesehatan.webp"
    alt="BPJS Kesehatan e-Dabu"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const EPPPKBLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-industrial.webp"
    alt="E-PP & PKB Hubungan Industrial"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const TemanK3Logo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-k3.webp"
    alt="Teman K3 Kemnaker"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const TKALogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-kitas.webp"
    alt="TKA Online RPTKA KITAS"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const KarirhubLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-siap-kerja.webp"
    alt="Karirhub SIAPkerja Kemnaker"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const PPHILogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-industrial.webp"
    alt="PPHI Hubungan Industrial Kemnaker"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const OSSRBALogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-bkpm.webp"
    alt="BKPM OSS RBA"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const SimpelKLHKLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-klh.webp"
    alt="Kementerian Lingkungan Hidup SIMPEL"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const FestronikLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-dlh.webp"
    alt="Festronik Limbah B3 KLHK"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const SIMBGPUPRLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-pupr.webp"
    alt="Kementerian PUPR SIMBG"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

export const BapendaLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/gambar/logo/logo-dirjen-pajak.webp"
    alt="Bapenda Pajak Daerah"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

/**
 * Komponen penyaji logo di sidebar navigation.
 * Mengembalikan logo instansi resmi dalam format WebP dari /public/gambar/logo/*.webp
 * Mendukung format: path langsung (/gambar/logo/...), prefix public/ (public/gambar/logo/...),
 * nama file (logo-kemendikbud.webp), maupun key singkat (nisn, kemendikbud, sivil, dsb).
 */
export const PortalNavLogo: React.FC<PortalLogoProps> = ({ logoKey, className = 'w-3.5 h-3.5' }) => {
  if (!logoKey) {
    return (
      <img
        src="/gambar/logo/logo-kemnaker.webp"
        alt="Logo Portal Resmi"
        className={`${className} object-contain block`}
        loading="lazy"
      />
    );
  }

  let raw = logoKey.trim();

  // Bersihkan prefix public/ jika ada
  if (raw.startsWith('public/')) {
    raw = '/' + raw.replace(/^public\//, '');
  } else if (raw.startsWith('/public/')) {
    raw = raw.replace(/^\/public/, '');
  }

  // 1. Direct path check (e.g. '/gambar/logo/logo-kemendikbud.webp')
  if (raw.startsWith('/') || raw.startsWith('http://') || raw.startsWith('https://')) {
    return (
      <img
        src={raw}
        alt="Logo Resmi Instansi"
        className={`${className} object-contain block`}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('/gambar/logo/logo-kemnaker.webp')) {
            target.src = '/gambar/logo/logo-kemnaker.webp';
          }
        }}
      />
    );
  }

  // 2. Filename check (e.g. 'logo-kemendikbud.webp')
  if (raw.endsWith('.webp') || raw.endsWith('.png') || raw.endsWith('.svg')) {
    const filename = raw.startsWith('logo-') ? raw : `logo-${raw}`;
    return (
      <img
        src={`/gambar/logo/${filename}`}
        alt={raw}
        className={`${className} object-contain block`}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('/gambar/logo/logo-kemnaker.webp')) {
            target.src = '/gambar/logo/logo-kemnaker.webp';
          }
        }}
      />
    );
  }

  // 3. Mapping lookup via PORTAL_WEBP_LOGOS
  const lower = raw.toLowerCase();
  const stripped = lower.replace(/^logo-/, '');
  const info = PORTAL_WEBP_LOGOS[lower] || PORTAL_WEBP_LOGOS[stripped];

  if (info) {
    return (
      <img
        src={info.src}
        alt={info.alt}
        className={`${className} object-contain block`}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('/gambar/logo/logo-kemnaker.webp')) {
            target.src = '/gambar/logo/logo-kemnaker.webp';
          }
        }}
      />
    );
  }

  // 4. Default fallback ke file webp berbasis nama key
  return (
    <img
      src={`/gambar/logo/logo-${stripped}.webp`}
      alt={`Logo ${stripped}`}
      className={`${className} object-contain block`}
      loading="lazy"
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.src.endsWith('/gambar/logo/logo-kemnaker.webp')) {
          target.src = '/gambar/logo/logo-kemnaker.webp';
        }
      }}
    />
  );
};
