import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ContractDocument } from '../pages/kontrak/types';
import {
  formatEnglishDate,
  formatIndonesianDate,
  formatRupiah,
  getEnglishDayName,
  getIndonesianDayName,
  terbilang,
  terbilangEn,
} from '../pages/kontrak/contract-templates';
import { applyA4RunningChrome } from './pdf-generator';

/**
 * Membangun dokumen PDF Kontrak Kerja / Perjanjian Resmi A4 beresolusi vektor penuh.
 * Menjamin 100% akurasi tata letak antara pratinjau Retina, unduh PDF, dan cetak fisik.
 */
export function buildContractPdf(contract: ContractDocument): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const marginX = 20;
  const maxWidth = pageWidth - marginX * 2;
  const topContinuationY = 21;
  const bottomLimitY = 276;
  const lineH = 4.35;

  let y = 17;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > bottomLimitY) {
      doc.addPage();
      y = topContinuationY;
    }
  };

  const renderWrappedLines = (
    text: string,
    x: number,
    width: number,
    options?: {
      fontSize?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      color?: [number, number, number];
      lineHeight?: number;
      paragraphGap?: number;
    }
  ) => {
    const fontSize = options?.fontSize ?? 9.2;
    const fontStyle = options?.fontStyle ?? 'normal';
    const color = options?.color ?? [30, 41, 59];
    const stepH = options?.lineHeight ?? lineH;
    const gap = options?.paragraphGap ?? 2;

    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines: string[] = doc.splitTextToSize(text, width);
    for (let i = 0; i < lines.length; i++) {
      ensureSpace(stepH + 1);
      doc.text(lines[i], x, y);
      y += stepH;
    }
    y += gap;
  };

  const renderSectionBanner = (label: string) => {
    ensureSpace(14);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.25);
    doc.rect(marginX, y, maxWidth, 6.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(15, 23, 42);
    doc.text(label.toUpperCase(), marginX + 3, y + 4.4);
    y += 9.5;
  };

  const isEnOnly = contract.languageMode === 'en';
  const isBilingual = contract.languageMode === 'bilingual';

  // =========================================================================
  // 1. KOP SURAT RESMI PERUSAHAAN
  // =========================================================================
  const companyFullName = [
    contract.company.legalEntity &&
    !contract.company.companyName.toUpperCase().startsWith(contract.company.legalEntity.toUpperCase())
      ? contract.company.legalEntity
      : '',
    contract.company.companyName,
  ]
    .filter(Boolean)
    .join(' ')
    .toUpperCase();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(15, 23, 42);
  doc.text(companyFullName, pageWidth / 2, y, { align: 'center' });
  y += 4.8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  const addrText = [contract.company.address, contract.company.city].filter(Boolean).join(', ');
  if (addrText) {
    const addrLines = doc.splitTextToSize(addrText, maxWidth);
    doc.text(addrLines, pageWidth / 2, y, { align: 'center' });
    y += addrLines.length * 3.8;
  }

  const contactLine = [
    contract.company.phone ? `Telp: ${contract.company.phone}` : '',
    contract.company.email ? `Email: ${contract.company.email}` : '',
    contract.company.nibOrNpwp ? `NIB/NPWP: ${contract.company.nibOrNpwp}` : '',
  ]
    .filter(Boolean)
    .join('   |   ');
  if (contactLine) {
    doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
    y += 4;
  }

  // Double Corporate Divider
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.75);
  doc.line(marginX, y, pageWidth - marginX, y);
  doc.setLineWidth(0.25);
  doc.line(marginX, y + 1.2, pageWidth - marginX, y + 1.2);
  y += 8.5;

  // =========================================================================
  // 2. BLOK JUDUL & NOMOR PERJANJIAN
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.8);
  doc.setTextColor(15, 23, 42);
  const primaryTitle = isEnOnly
    ? contract.titleEn.toUpperCase()
    : contract.titleId.toUpperCase();
  const titleLines = doc.splitTextToSize(primaryTitle, maxWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
  y += titleLines.length * 4.8;

  if (isBilingual && contract.titleEn) {
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const subTitleLines = doc.splitTextToSize(contract.titleEn.toUpperCase(), maxWidth);
    doc.text(subTitleLines, pageWidth / 2, y, { align: 'center' });
    y += subTitleLines.length * 4.2;
  }

  y += 1;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `${isEnOnly ? 'Agreement No.' : 'Nomor Dokumen'}: ${contract.contractNumber}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 7.5;

  // =========================================================================
  // 3. PEMBUKAAN & KOMPARISI PARA PIHAK
  // =========================================================================
  renderSectionBanner(
    isEnOnly
      ? 'PARTIES TO THE AGREEMENT'
      : isBilingual
        ? 'BAGIAN I — IDENTITAS & KOMPARISI PARA PIHAK / PARTIES TO THE AGREEMENT'
        : 'BAGIAN I — PEMBUKAAN & IDENTITAS PARA PIHAK (KOMPARISI)'
  );

  const dayId = getIndonesianDayName(contract.signingDate);
  const dayEn = getEnglishDayName(contract.signingDate);
  const dateId = formatIndonesianDate(contract.signingDate);
  const dateEn = formatEnglishDate(contract.signingDate);

  const openingParagraph = isEnOnly
    ? `This Agreement is made and entered into on this ${dayEn}, ${dateEn}, in ${contract.signingCity}, Republic of Indonesia, by and between the undersigned parties:`
    : `Pada hari ini, ${dayId}, tanggal ${dateId}, bertempat di ${contract.signingCity}, Negara Kesatuan Republik Indonesia, yang bertanda tangan di bawah ini:`;

  renderWrappedLines(openingParagraph, marginX, maxWidth, { paragraphGap: 2.5 });

  if (isBilingual) {
    renderWrappedLines(
      `This Agreement is made and entered into on ${dayEn}, ${dateEn}, in ${contract.signingCity}, by and between:`,
      marginX,
      maxWidth,
      { fontStyle: 'italic', fontSize: 8.6, color: [71, 85, 105], paragraphGap: 3 }
    );
  }

  // Tabel Komparisi Pihak Pertama & Pihak Kedua agar presisi dan mudah diverifikasi
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX, bottom: 20 },
    theme: 'grid',
    styles: {
      fontSize: 8.4,
      cellPadding: { top: 2.2, right: 3, bottom: 2.2, left: 3 },
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 46, fillColor: [248, 250, 252], textColor: [51, 65, 85] },
      1: { cellWidth: maxWidth - 46 },
    },
    head: [
      [
        isEnOnly ? 'FIRST PARTY (EMPLOYER)' : 'PIHAK PERTAMA (PEMBERI KERJA)',
        companyFullName,
      ],
    ],
    body: [
      [
        isEnOnly ? 'Legal Entity & NIB/NPWP' : 'Badan Hukum & NIB/NPWP',
        `${contract.company.legalEntity || 'PT'} • NIB/NPWP: ${contract.company.nibOrNpwp || '-'}`,
      ],
      [
        isEnOnly ? 'Authorized Representative' : 'Nama Pejabat Perwakilan',
        `${contract.company.representativeName} (${contract.company.representativePosition})`,
      ],
      [
        isEnOnly ? 'Representative ID / NIP' : 'NIK / NIP Pejabat',
        contract.company.representativeIdentityNumber || '-',
      ],
      [
        isEnOnly ? 'Domicile Address' : 'Alamat Kedudukan Hukum',
        `${contract.company.address}, ${contract.company.city}`,
      ],
      [
        isEnOnly ? 'Official Contact' : 'Telepon & Email Resmi',
        `${contract.company.phone || '-'}  |  ${contract.company.email || '-'}`,
      ],
    ],
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 32) + 3.5;

  const party1CapacityText = isEnOnly
    ? `Acting lawfully in their capacity as ${contract.company.representativePosition} for and on behalf of ${companyFullName}, hereinafter referred to as the "FIRST PARTY".`
    : `Dalam hal ini bertindak sah dalam jabatannya selaku ${contract.company.representativePosition} untuk dan atas nama ${companyFullName}, selanjutnya dalam Perjanjian ini disebut sebagai "PIHAK PERTAMA".`;
  renderWrappedLines(party1CapacityText, marginX, maxWidth, { fontSize: 8.8, paragraphGap: 3.5 });

  const empDobText = [contract.employee.birthPlace, formatIndonesianDate(contract.employee.birthDate)]
    .filter(Boolean)
    .join(', ');

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX, bottom: 20 },
    theme: 'grid',
    styles: {
      fontSize: 8.4,
      cellPadding: { top: 2.2, right: 3, bottom: 2.2, left: 3 },
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 46, fillColor: [248, 250, 252], textColor: [51, 65, 85] },
      1: { cellWidth: maxWidth - 46 },
    },
    head: [
      [
        isEnOnly ? 'SECOND PARTY (EMPLOYEE)' : 'PIHAK KEDUA (KARYAWAN / PEKERJA)',
        contract.employee.fullName,
      ],
    ],
    body: [
      [
        isEnOnly ? 'National ID (NIK KTP)' : 'Nomor Induk Kependudukan',
        `${contract.employee.nik || '-'}${contract.employee.npwp ? `   •   NPWP: ${contract.employee.npwp}` : ''}`,
      ],
      [
        isEnOnly ? 'Place & Date of Birth / Gender' : 'Tempat, Tgl Lahir / Gender',
        `${empDobText || '-'}   (${contract.employee.gender || '-'})`,
      ],
      [
        isEnOnly ? 'Residential Address' : 'Alamat KTP / Domisili',
        [contract.employee.address, contract.employee.city].filter(Boolean).join(', '),
      ],
      [
        isEnOnly ? 'Phone & Email' : 'No. Telepon & Email',
        `${contract.employee.phone || '-'}  |  ${contract.employee.email || '-'}`,
      ],
      [
        isEnOnly ? 'BPJS & Emergency Contact' : 'BPJS & Kontak Darurat',
        `BPJS Kes: ${contract.employee.bpjsKesehatanNo || '-'}  |  BPJS TK: ${contract.employee.bpjsKetenagakerjaanNo || '-'}${contract.employee.emergencyContact ? `\nKontak Darurat: ${contract.employee.emergencyContact}` : ''}`,
      ],
    ],
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 36) + 3.5;

  const party2CapacityText = isEnOnly
    ? `Acting for and on their own legal behalf as an individual, hereinafter referred to as the "SECOND PARTY". Both parties are collectively referred to as the "PARTIES".`
    : `Bertindak secara cakap hukum untuk dan atas nama diri sendiri, selanjutnya dalam Perjanjian ini disebut sebagai "PIHAK KEDUA". PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut sebagai "PARA PIHAK".`;
  renderWrappedLines(party2CapacityText, marginX, maxWidth, { fontSize: 8.8, paragraphGap: 4 });

  // =========================================================================
  // 4. KONSIDERAN / RECITALS
  // =========================================================================
  renderSectionBanner(
    isEnOnly
      ? 'RECITALS (PRELIMINARY STATEMENTS)'
      : isBilingual
        ? 'BAGIAN II — MENERANGKAN TERLEBIH DAHULU / RECITALS'
        : 'BAGIAN II — MENERANGKAN TERLEBIH DAHULU (RECITALS)'
  );

  const recitals = isEnOnly
    ? [
        `1. That the FIRST PARTY is a duly incorporated business entity requiring qualified professional personnel in the role of ${contract.job.positionTitleEn || contract.job.positionTitle} within the ${contract.job.departmentEn || contract.job.department} Department to support corporate operations and strategic growth.`,
        `2. That the SECOND PARTY represents and warrants that all academic credentials, employment records, national identification, and professional competencies presented to the FIRST PARTY are true, complete, and legally valid, and that the SECOND PARTY is not bound by any conflicting restrictive covenant or non-compete obligation with any third party.`,
        `3. That in view of the foregoing, the PARTIES hereby agree to enter into this binding Agreement subject to the terms, conditions, and articles set forth below pursuant to Law No. 13/2003 as amended by Law No. 6/2023 and Government Regulation No. 35/2021.`,
      ]
    : [
        `1. Bahwa PIHAK PERTAMA adalah badan usaha berbadan hukum sah yang membutuhkan tenaga kerja profesional berkualifikasi pada posisi jabatan ${contract.job.positionTitle} di lingkungan Departemen ${contract.job.department} guna mendukung kelancaran operasional dan target bisnis perusahaan.`,
        `2. Bahwa PIHAK KEDUA menyatakan dan menjamin secara sadar bahwa seluruh dokumen identitas, ijazah pendidikan, riwayat pekerjaan, serta keterangan kompetensi yang diserahkan kepada PIHAK PERTAMA adalah benar, asli, sah, serta PIHAK KEDUA dalam keadaan sehat jasmani rohani dan tidak sedang terikat perjanjian kerja eksklusif atau larangan persaingan dengan pihak ketiga manapun.`,
        `3. Bahwa berdasarkan hal-hal tersebut di atas dan berpedoman pada Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan jo. Undang-Undang No. 6 Tahun 2023 tentang Cipta Kerja beserta Peraturan Pemerintah No. 35 Tahun 2021, PARA PIHAK sepakat untuk mengikatkan diri dalam perjanjian tertulis dengan ketentuan dan syarat-syarat sebagaimana dituangkan dalam pasal-pasal berikut ini.`,
      ];

  recitals.forEach((rec) => renderWrappedLines(rec, marginX, maxWidth, { fontSize: 8.9, paragraphGap: 2 }));
  y += 2;

  // =========================================================================
  // 5. IKHTISAR KETENTUAN PEKERJAAN, REMUNERASI & DATA KHUSUS
  // =========================================================================
  renderSectionBanner(
    isEnOnly
      ? 'SCHEDULE A — SUMMARY OF EMPLOYMENT & REMUNERATION TERMS'
      : isBilingual
        ? 'BAGIAN III — IKHTISAR KETENTUAN KERJA & REMUNERASI / KEY TERMS'
        : 'BAGIAN III — IKHTISAR KETENTUAN POKOK PEKERJAAN & REMUNERASI'
  );

  const comp = contract.compensation;
  const totalFixed = (comp.basicSalary || 0) + (comp.fixedAllowance || 0);
  const totalGross = totalFixed + (comp.variableAllowance || 0);
  const periodStr = contract.job.endDate
    ? `${formatIndonesianDate(contract.job.startDate)} s/d ${formatIndonesianDate(contract.job.endDate)} (${contract.job.contractDurationMonths || 12} Bulan)`
    : `${formatIndonesianDate(contract.job.startDate)} s/d Tidak Terbatas (Probation ${contract.job.probationDurationMonths || 0} Bulan)`;

  const keySummaryBody: [string, string][] = [
    [
      isEnOnly ? 'Position / Department / Grade' : 'Jabatan / Departemen / Grade',
      `${contract.job.positionTitle}  •  ${contract.job.department}${contract.job.jobGrade ? `  •  ${contract.job.jobGrade}` : ''}`,
    ],
    [
      isEnOnly ? 'Direct Supervisor & Workplace' : 'Atasan & Lokasi Penempatan',
      `${contract.job.directSupervisor}  •  ${contract.job.workLocationAddress} (${contract.job.workLocationType})`,
    ],
    [
      isEnOnly ? 'Effective Term / Probation' : 'Periode Kontrak / Masa Kerja',
      periodStr,
    ],
    [
      isEnOnly ? 'Working Schedule' : 'Pola Hari & Jam Kerja',
      `${contract.job.workDaysDetail || `${contract.job.workingDaysPerWeek} Hari Kerja/Minggu`} (${contract.job.workingHoursPerDay} Jam/Hari) • ${contract.job.workingHoursSchedule}${contract.job.restHoursSchedule ? ` • Istirahat: ${contract.job.restHoursSchedule}` : ''}`,
    ],
    [
      isEnOnly ? 'Basic Salary' : 'Gaji Pokok Bulanan',
      `${formatRupiah(comp.basicSalary)} (${isEnOnly ? terbilangEn(comp.basicSalary) : terbilang(comp.basicSalary)})`,
    ],
    [
      isEnOnly ? 'Fixed Allowance' : 'Tunjangan Tetap',
      `${formatRupiah(comp.fixedAllowance)} — ${comp.fixedAllowanceDescription || 'Tunjangan Jabatan'}`,
    ],
    [
      isEnOnly ? 'Variable Allowance' : 'Tunjangan Variabel (Max)',
      `${formatRupiah(comp.variableAllowance)} — ${comp.variableAllowanceDescription || 'Makan / Transportasi'}`,
    ],
    [
      isEnOnly ? 'Total Gross Monthly Package' : 'Total Paket Bruto Bulanan',
      `${formatRupiah(totalGross)} (${isEnOnly ? terbilangEn(totalGross) : terbilang(totalGross)})`,
    ],
    [
      isEnOnly ? 'Payroll Date & Bank Account' : 'Jadwal & Rekening Gaji',
      `Setiap tanggal ${comp.paydayDate || 25} via ${comp.paymentMethod} • ${comp.bankName} (${comp.bankAccountNumber} a.n. ${comp.bankAccountHolder || contract.employee.fullName})`,
    ],
    [
      isEnOnly ? 'Statutory Benefits' : 'Jaminan Sosial & Hak Lain',
      [
        comp.hasBpjsKesehatan ? 'BPJS Kesehatan' : null,
        comp.hasBpjsKetenagakerjaan ? 'BPJS Ketenagakerjaan' : null,
        comp.hasThr ? 'THR Keagamaan' : null,
        comp.hasPkwtCompensation ? 'Uang Kompensasi PKWT PP 35/2021' : null,
        `Notice Period ${contract.job.noticePeriodDays || 30} Hari`,
      ]
        .filter(Boolean)
        .join('  •  '),
    ],
  ];

  // Append specialized module details when relevant
  if (contract.contractType === 'RENEWAL_PKWT' && contract.renewal) {
    keySummaryBody.push([
      'Rujukan Kontrak Induk',
      `No. ${contract.renewal.previousContractNumber} (${formatIndonesianDate(contract.renewal.previousStartDate)} s/d ${formatIndonesianDate(contract.renewal.previousEndDate)}) → Perpanjangan ${contract.renewal.renewalDurationMonths} Bulan`,
    ]);
  }
  if ((contract.contractType === 'SP1' || contract.contractType === 'SP2' || contract.contractType === 'SP3') && contract.warning) {
    keySummaryBody.push([
      'Rincian Sanksi SP',
      `Tingkat SP-${contract.warning.warningLevel} • Tgl Kejadian: ${formatIndonesianDate(contract.warning.incidentDate)} • Berlaku s/d: ${formatIndonesianDate(contract.warning.validUntilDate)}`,
    ]);
  }
  if (
    (contract.contractType === 'END_CONTRACT' ||
      contract.contractType === 'PHK' ||
      contract.contractType === 'RESIGN_ACCEPTANCE') &&
    contract.termination
  ) {
    keySummaryBody.push([
      'Total Penyelesaian Finansial',
      `${formatRupiah(contract.termination.totalFinancialSettlement)} (Cair Tgl ${formatIndonesianDate(contract.termination.paymentReleaseDate)}) • Paklaring: ${contract.termination.paklaringReferenceNumber}`,
    ]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX, bottom: 20 },
    theme: 'grid',
    styles: {
      fontSize: 8.2,
      cellPadding: { top: 2, right: 2.8, bottom: 2, left: 2.8 },
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, fillColor: [248, 250, 252], textColor: [51, 65, 85] },
      1: { cellWidth: maxWidth - 50 },
    },
    body: keySummaryBody,
    didParseCell: (data) => {
      if (data.row.index === 7 && data.section === 'body') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [239, 246, 255];
      }
    },
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 50) + 6;

  // =========================================================================
  // 6. PASAL-PASAL PERJANJIAN (PAGINASI HALAMAN PER BARIS PRESISI)
  // =========================================================================
  renderSectionBanner(
    isEnOnly
      ? 'ARTICLES OF AGREEMENT'
      : isBilingual
        ? 'BAGIAN IV — PASAL-PASAL PERJANJIAN / ARTICLES OF AGREEMENT'
        : 'BAGIAN IV — BATANG TUBUH PERJANJIAN (PASAL-PASAL)'
  );

  const renderClauseParagraphBlock = (rawContent: string, indentBase = 0, isItalicEn = false) => {
    const paragraphs = rawContent.split('\n');
    for (const rawLine of paragraphs) {
      const trimmedEnd = rawLine.trimEnd();
      if (!trimmedEnd.trim()) {
        y += 1.8;
        continue;
      }

      // Detect indentation level for clean legal outline alignment
      let extraIndent = indentBase;
      if (/^\s{2,}[a-z]\./i.test(trimmedEnd) || /^\s{2,}•/.test(trimmedEnd)) {
        extraIndent = indentBase + 6;
      } else if (/^\s*[0-9]+\./.test(trimmedEnd)) {
        extraIndent = indentBase;
      }

      const contentText = trimmedEnd.trimStart();
      doc.setFont('helvetica', isItalicEn ? 'italic' : 'normal');
      doc.setFontSize(isItalicEn ? 8.6 : 9.1);
      doc.setTextColor(isItalicEn ? 71 : 30, isItalicEn ? 85 : 41, isItalicEn ? 105 : 59);

      const wrapped: string[] = doc.splitTextToSize(contentText, maxWidth - extraIndent);
      for (let lineIdx = 0; lineIdx < wrapped.length; lineIdx++) {
        ensureSpace(lineH + 0.8);
        doc.text(wrapped[lineIdx], marginX + extraIndent, y);
        y += lineH;
      }
      y += 0.9;
    }
  };

  const enabledClauses = (contract.clauses || []).filter((c) => c.isEnabled);
  enabledClauses.forEach((clause, idx) => {
    const articleNum = idx + 1;
    const articleHeading = isEnOnly
      ? `ARTICLE ${articleNum}`
      : isBilingual
        ? `PASAL ${articleNum} / ARTICLE ${articleNum}`
        : `PASAL ${articleNum}`;

    const articleSubTitle = isEnOnly
      ? (clause.titleEn || clause.titleId).toUpperCase()
      : isBilingual
        ? `${clause.titleId.toUpperCase()} (${(clause.titleEn || '').toUpperCase()})`
        : clause.titleId.toUpperCase();

    // Prevent orphaned heading: require minimum 26mm (heading + first 3 body lines)
    ensureSpace(26);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.setTextColor(15, 23, 42);
    doc.text(articleHeading, pageWidth / 2, y, { align: 'center' });
    y += 4.4;

    doc.setFontSize(9.2);
    doc.setTextColor(30, 58, 138);
    const subLines = doc.splitTextToSize(articleSubTitle, maxWidth - 10);
    doc.text(subLines, pageWidth / 2, y, { align: 'center' });
    y += subLines.length * 4.1 + 1.5;

    if (isEnOnly) {
      renderClauseParagraphBlock(clause.contentEn || clause.contentId, 0, false);
    } else if (isBilingual) {
      renderClauseParagraphBlock(clause.contentId, 0, false);
      if (clause.contentEn) {
        ensureSpace(12);
        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(8.2);
        doc.setTextColor(71, 85, 105);
        doc.text('[ENGLISH TRANSLATION]', marginX, y);
        y += 4;
        renderClauseParagraphBlock(clause.contentEn, 0, true);
      }
    } else {
      renderClauseParagraphBlock(clause.contentId, 0, false);
    }

    y += 3.5;
  });

  // Catatan Tambahan Khusus bila diisi oleh HRD
  if (contract.customNotes && contract.customNotes.trim()) {
    ensureSpace(20);
    renderSectionBanner(isEnOnly ? 'SPECIAL ADDITIONAL PROVISIONS' : 'KETENTUAN TAMBAHAN KHUSUS');
    renderWrappedLines(contract.customNotes.trim(), marginX, maxWidth, {
      fontSize: 9.0,
      paragraphGap: 4,
    });
  }

  // =========================================================================
  // 7. KLAUSUL PENUTUP, MATERAI & BLOK TANDA TANGAN LENGKAP
  // =========================================================================
  ensureSpace(68);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  const closingNote = isEnOnly
    ? `IN WITNESS WHEREOF, the PARTIES confirm that they have read, understood, and voluntarily accepted every Article in this Agreement, and execute this document in duplicate originals on the date and place stated below.`
    : `Demikian Perjanjian ini dibuat, dibaca, dipahami seluruh isinya, dan disetujui oleh PARA PIHAK dalam keadaan sehat jasmani serta rohani tanpa adanya paksaan dari pihak manapun, lalu ditandatangani di ${contract.signingCity} pada tanggal tersebut di bawah ini dalam rangkap 2 (dua) asli bermaterai cukup.`;

  renderWrappedLines(closingNote, marginX, maxWidth, {
    fontSize: 8.9,
    paragraphGap: 4,
  });

  const leftColCenterX = marginX + 40;
  const rightColCenterX = pageWidth - marginX - 40;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.1);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `${contract.signingCity}, ${isEnOnly ? formatEnglishDate(contract.signingDate) : formatIndonesianDate(contract.signingDate)}`,
    marginX,
    y
  );
  y += 6.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(15, 23, 42);
  doc.text(isEnOnly ? 'FIRST PARTY (COMPANY)' : 'PIHAK PERTAMA', leftColCenterX, y, { align: 'center' });
  doc.text(isEnOnly ? 'SECOND PARTY (EMPLOYEE)' : 'PIHAK KEDUA', rightColCenterX, y, { align: 'center' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  doc.text(companyFullName, leftColCenterX, y, { align: 'center', maxWidth: 74 });
  doc.text(isEnOnly ? 'Employee / Worker' : 'Karyawan / Pekerja', rightColCenterX, y, { align: 'center' });

  // Kotak Materai Rp 10.000 pada kolom tanda tangan Pihak Kedua
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.25);
  doc.rect(rightColCenterX - 13, y + 4.5, 26, 13, 'D');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text('MATERAI', rightColCenterX, y + 10, { align: 'center' });
  doc.text('Rp 10.000,-', rightColCenterX, y + 13.8, { align: 'center' });

  y += 23;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(15, 23, 42);
  doc.text(contract.company.representativeName, leftColCenterX, y, { align: 'center' });
  doc.text(contract.employee.fullName, rightColCenterX, y, { align: 'center' });

  // Garis bawah nama penandatangan
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(leftColCenterX - 28, y + 1.2, leftColCenterX + 28, y + 1.2);
  doc.line(rightColCenterX - 28, y + 1.2, rightColCenterX + 28, y + 1.2);

  y += 4.8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  doc.text(contract.company.representativePosition, leftColCenterX, y, { align: 'center' });
  doc.text(`NIK: ${contract.employee.nik || '-'}`, rightColCenterX, y, { align: 'center' });

  y += 9;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    isEnOnly
      ? 'Witnessed & Verified by: Human Resources & Legal Compliance Department'
      : 'Mengetahui / Saksi Verifikasi Internal: Departemen Human Resources & Legal Compliance',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  // =========================================================================
  // 8. RUNNING CHROME & NOMOR HALAMAN VEKTOR DI SETIAP LEMBAR A4
  // =========================================================================
  applyA4RunningChrome(doc, {
    leftFooterText: `${contract.contractType} • No: ${contract.contractNumber} • ${contract.employee.fullName}`,
    runningHeaderLeft: `${companyFullName} — ${contract.contractNumber}`,
    runningHeaderRight: contract.employee.fullName,
    marginX,
    skipHeaderOnFirstPage: true,
  });

  return new Uint8Array(doc.output('arraybuffer'));
}
