import jsPDF from 'jspdf';
import { ContractDocument } from './types';
import {
  formatIndonesianDate,
  formatEnglishDate,
  getIndonesianDayName,
  getEnglishDayName,
  formatRupiah
} from './contract-templates';
import {
  GeneratedPdfArtifact,
  createPdfArtifactFromJsPdf
} from '../../utils/pdfSingleSource';

// A4 Page Geometry Constants (in mm)
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_LEFT = 18;
const MARGIN_RIGHT = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 174 mm
const FIRST_PAGE_TOP_Y = 15;
const NEXT_PAGE_TOP_Y = 23;
const MAX_CONTENT_Y = 272; // Reserves 272..297mm for legal footer & page numbering

/**
 * Menghasilkan teks polos (plain text) deterministik dari ContractDocument
 * untuk fitur "Salin Teks" ke clipboard.
 */
export function extractContractPlainText(doc: ContractDocument): string {
  const isBilingual = doc.languageMode === 'bilingual';
  const isEnglish = doc.languageMode === 'en';
  const fullDateId = formatIndonesianDate(doc.signingDate);
  const fullDateEn = formatEnglishDate(doc.signingDate);
  const dayNameId = getIndonesianDayName(doc.signingDate);
  const dayNameEn = getEnglishDayName(doc.signingDate);
  const activeClauses = doc.clauses.filter(c => c.isEnabled);

  const lines: string[] = [];
  lines.push(doc.company.companyName.toUpperCase());
  lines.push(`${doc.company.address}, ${doc.company.city}`);
  lines.push(`Tel: ${doc.company.phone} | Email: ${doc.company.email} | NIB/NPWP: ${doc.company.nibOrNpwp}`);
  lines.push('====================================================================');
  lines.push('');

  if (isBilingual) {
    lines.push(doc.titleId.toUpperCase());
    if (doc.titleEn) lines.push(doc.titleEn.toUpperCase());
  } else if (isEnglish) {
    lines.push((doc.titleEn || doc.titleId).toUpperCase());
  } else {
    lines.push(doc.titleId.toUpperCase());
  }
  lines.push(`Nomor / Number: ${doc.contractNumber}`);
  lines.push('');

  if (doc.category === 'SURAT_PERINGATAN') {
    lines.push(
      `Surat Peringatan ini diterbitkan secara resmi oleh Manajemen ${doc.company.companyName} pada tanggal ${fullDateId} dan ditujukan kepada:`
    );
    lines.push(`- Nama Karyawan : ${doc.employee.fullName}`);
    lines.push(`- NIK KTP / NIP : ${doc.employee.nik}`);
    lines.push(`- Jabatan       : ${doc.job.positionTitle}`);
    lines.push(`- Departemen    : ${doc.job.department}`);
  } else if (doc.category === 'PEMBERHENTIAN') {
    lines.push(
      `Surat Keterangan Pengakhiran Hubungan Kerja ini diterbitkan oleh ${doc.company.companyName} pada tanggal ${fullDateId} kepada:`
    );
    lines.push(`- Nama Karyawan    : ${doc.employee.fullName}`);
    lines.push(`- NIK KTP          : ${doc.employee.nik}`);
    lines.push(`- Jabatan Terakhir : ${doc.job.positionTitle} (${doc.job.department})`);
    lines.push(
      `- Masa Pengabdian  : Mulai ${formatIndonesianDate(doc.job.startDate)} s/d ${formatIndonesianDate(
        doc.termination?.effectiveDate || doc.signingDate
      )}`
    );
  } else {
    if (!isEnglish) {
      lines.push(
        `Pada hari ini ${dayNameId}, tanggal ${fullDateId}, bertempat di ${doc.signingCity}, telah dibuat dan ditandatangani perjanjian oleh dan antara:`
      );
    }
    if (isEnglish || isBilingual) {
      lines.push(
        `On this day ${dayNameEn}, date ${fullDateEn}, in ${doc.signingCity}, this agreement is made and entered into by and between:`
      );
    }
    lines.push('');
    lines.push(`PIHAK PERTAMA (Pemberi Kerja / Employer):`);
    lines.push(`- Perusahaan : ${doc.company.companyName} (${doc.company.legalEntity})`);
    lines.push(`- Alamat     : ${doc.company.address}, ${doc.company.city}`);
    lines.push(`- Wakil      : ${doc.company.representativeName} (${doc.company.representativePosition})`);
    lines.push('');
    lines.push(`PIHAK KEDUA (Pekerja / Employee):`);
    lines.push(`- Nama       : ${doc.employee.fullName}`);
    lines.push(`- NIK KTP    : ${doc.employee.nik}`);
    lines.push(`- TTL        : ${doc.employee.birthPlace}, ${formatIndonesianDate(doc.employee.birthDate)}`);
    lines.push(`- Domisili   : ${doc.employee.address}, ${doc.employee.city}`);
  }

  lines.push('');
  activeClauses.forEach((clause, idx) => {
    const num = idx + 1;
    lines.push('--------------------------------------------------------------------');
    if (isBilingual) {
      lines.push(`PASAL ${num} - ${clause.titleId} / ARTICLE ${num} - ${clause.titleEn}`);
      lines.push('');
      lines.push(clause.contentId);
      lines.push('');
      lines.push(`[EN] ${clause.contentEn}`);
    } else if (isEnglish) {
      lines.push(`ARTICLE ${num} - ${clause.titleEn}`);
      lines.push('');
      lines.push(clause.contentEn);
    } else {
      lines.push(`PASAL ${num} - ${clause.titleId}`);
      lines.push('');
      lines.push(clause.contentId);
    }
    lines.push('');
  });

  if (doc.customNotes && doc.customNotes.trim()) {
    lines.push('--------------------------------------------------------------------');
    lines.push('CATATAN TAMBAHAN / ADDITIONAL NOTES:');
    lines.push(doc.customNotes.trim());
    lines.push('');
  }

  lines.push('====================================================================');
  lines.push(`${doc.signingCity}, ${isEnglish ? fullDateEn : fullDateId}`);
  lines.push('');
  lines.push(
    `PIHAK PERTAMA: ${doc.company.representativeName} (${doc.company.representativePosition} - ${doc.company.companyName})`
  );
  lines.push(`PIHAK KEDUA  : ${doc.employee.fullName} (NIK: ${doc.employee.nik || '-'})`);

  return lines.join('\n');
}

/**
 * Generator utama jsPDF berbasis vektor untuk seluruh kategori ContractDocument.
 * Menghasilkan tata letak A4 presisi tinggi dengan:
 * - Kop Surat Resmi Perusahaan
 * - Judul & Nomor Berkas
 * - Komparisi / Identitas Para Pihak (ID / EN / Bilingual 2 Kolom)
 * - Rincian Khusus (Addendum/Promosi, Surat Peringatan, Penyelesaian PHK/Resign)
 * - Klausul / Pasal bernomor dengan proteksi orphan heading & pemenggalan baris presisi
 * - Blok Pengesahan, Tanda Tangan & Meterai Rp 10.000 (break-inside-avoid)
 * - Lampiran Paklaring (Surat Pengalaman Kerja) otomatis jika diaktifkan
 * - Running Header & Penomoran Halaman (Halaman X dari Y)
 */
export function generateContractJsPdf(doc: ContractDocument): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const isBilingual = doc.languageMode === 'bilingual';
  const isEnglish = doc.languageMode === 'en';
  const isWarningLetter = doc.category === 'SURAT_PERINGATAN';
  const isTerminationDoc = doc.category === 'PEMBERHENTIAN';
  const isRenewalDoc = doc.category === 'PERPANJANG_KONTRAK';

  const dayNameId = getIndonesianDayName(doc.signingDate);
  const dayNameEn = getEnglishDayName(doc.signingDate);
  const fullDateId = formatIndonesianDate(doc.signingDate);
  const fullDateEn = formatEnglishDate(doc.signingDate);
  const activeClauses = doc.clauses.filter(c => c.isEnabled);

  let y = FIRST_PAGE_TOP_Y;

  const addNewPage = () => {
    pdf.addPage('a4', 'portrait');
    y = NEXT_PAGE_TOP_Y;
  };

  const ensureSpace = (requiredMm: number) => {
    if (y + requiredMm > MAX_CONTENT_Y) {
      addNewPage();
    }
  };

  // =========================================================================
  // 1. OFFICIAL LETTERHEAD (KOP SURAT PERUSAHAAN)
  // =========================================================================
  const drawLetterhead = () => {
    // Company Initial Emblem Box
    pdf.setFillColor(15, 23, 42); // slate-900
    pdf.roundedRect(MARGIN_LEFT, y, 12, 12, 1.5, 1.5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    const initial = (doc.company.companyName || 'H').trim().charAt(0).toUpperCase();
    pdf.text(initial, MARGIN_LEFT + 6, y + 8, { align: 'center' });

    // Company Name & Details
    const infoX = MARGIN_LEFT + 15;
    const maxCompanyInfoWidth = CONTENT_WIDTH - 62;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    const compNameLines = pdf.splitTextToSize(
      (doc.company.companyName || 'PERUSAHAAN').toUpperCase(),
      maxCompanyInfoWidth
    );
    pdf.text(compNameLines[0], infoX, y + 4.2);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105); // slate-600
    const addressLine = `${doc.company.address || '-'}, ${doc.company.city || ''}`.replace(/,\s*$/, '');
    const addrLines = pdf.splitTextToSize(addressLine, maxCompanyInfoWidth);
    pdf.text(addrLines[0] || '-', infoX, y + 8.2);

    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139); // slate-500
    const contactLine = `Tel: ${doc.company.phone || '-'}  •  Email: ${doc.company.email || '-'}  •  NIB/NPWP: ${doc.company.nibOrNpwp || '-'}`;
    const contactLines = pdf.splitTextToSize(contactLine, maxCompanyInfoWidth);
    pdf.text(contactLines[0] || '', infoX, y + 11.8);

    // Right Classification Badge
    const rightEdge = PAGE_WIDTH - MARGIN_RIGHT;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(51, 65, 85);
    const docBadgeLabel = isWarningLetter
      ? 'OFFICIAL WARNING NOTICE'
      : isTerminationDoc
      ? 'EMPLOYMENT SETTLEMENT'
      : isRenewalDoc
      ? 'CONTRACT AMENDMENT'
      : 'LEGAL EMPLOYMENT CONTRACT';
    pdf.text(docBadgeLabel, rightEdge, y + 5, { align: 'right' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text('Republic of Indonesia Labor Compliance', rightEdge, y + 9, { align: 'right' });

    y += 15;

    // Double Legal Rule Line
    pdf.setDrawColor(15, 23, 42);
    pdf.setLineWidth(0.6);
    pdf.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
    pdf.setLineWidth(0.2);
    pdf.line(MARGIN_LEFT, y + 1.1, PAGE_WIDTH - MARGIN_RIGHT, y + 1.1);

    y += 7;
  };

  drawLetterhead();

  // =========================================================================
  // 2. DOCUMENT TITLE & OFFICIAL NUMBER
  // =========================================================================
  const centerX = PAGE_WIDTH / 2;

  if (isBilingual) {
    pdf.setFont('times', 'bold');
    pdf.setFontSize(11.5);
    pdf.setTextColor(15, 23, 42);
    const titleIdLines = pdf.splitTextToSize((doc.titleId || '').toUpperCase(), CONTENT_WIDTH - 10);
    pdf.text(titleIdLines, centerX, y, { align: 'center' });
    y += titleIdLines.length * 4.8;

    if (doc.titleEn) {
      pdf.setFont('times', 'bolditalic');
      pdf.setFontSize(9.5);
      pdf.setTextColor(71, 85, 105);
      const titleEnLines = pdf.splitTextToSize(doc.titleEn.toUpperCase(), CONTENT_WIDTH - 10);
      pdf.text(titleEnLines, centerX, y, { align: 'center' });
      y += titleEnLines.length * 4.2;
    }
  } else if (isEnglish) {
    pdf.setFont('times', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(15, 23, 42);
    const titleLines = pdf.splitTextToSize((doc.titleEn || doc.titleId || '').toUpperCase(), CONTENT_WIDTH - 10);
    pdf.text(titleLines, centerX, y, { align: 'center' });
    y += titleLines.length * 5;
  } else {
    pdf.setFont('times', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(15, 23, 42);
    const titleLines = pdf.splitTextToSize((doc.titleId || '').toUpperCase(), CONTENT_WIDTH - 10);
    pdf.text(titleLines, centerX, y, { align: 'center' });
    y += titleLines.length * 5;
  }

  // Document Number
  y += 0.5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(51, 65, 85);
  const numberText = `Nomor / Number: ${doc.contractNumber || '-'}`;
  pdf.text(numberText, centerX, y, { align: 'center' });
  y += 6.5;

  // =========================================================================
  // 3. OPENING & PARTY IDENTITIES (KOMPARISI)
  // =========================================================================
  if (isWarningLetter) {
    // Format Pembuka Khusus Surat Peringatan (SP 1 / 2 / 3)
    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(15, 23, 42);
    const introText = isEnglish
      ? `This Official Warning Notice is formally issued by the Management of ${doc.company.companyName} on ${fullDateEn} and is addressed to:`
      : `Surat Peringatan ini diterbitkan secara resmi oleh Manajemen ${doc.company.companyName} pada tanggal ${fullDateId} dan ditujukan kepada:`;
    const introLines = pdf.splitTextToSize(introText, CONTENT_WIDTH);
    pdf.text(introLines, MARGIN_LEFT, y);
    y += introLines.length * 4.5 + 2;

    // Amber Highlight Box for Employee Identity
    const boxHeight = doc.warning ? 28 : 22;
    ensureSpace(boxHeight + 4);
    pdf.setFillColor(255, 251, 235); // amber-50
    pdf.setDrawColor(245, 158, 11); // amber-500
    pdf.setLineWidth(0.3);
    pdf.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, boxHeight, 1.5, 1.5, 'FD');

    // Left accent bar
    pdf.setFillColor(217, 119, 6); // amber-600
    pdf.rect(MARGIN_LEFT, y, 2, boxHeight, 'F');

    const labelX = MARGIN_LEFT + 6;
    const valX = MARGIN_LEFT + 48;
    let rowY = y + 5.5;

    const spRows: [string, string][] = [
      ['Nama Karyawan', doc.employee.fullName || '-'],
      ['NIK KTP / NIP', doc.employee.nik || '-'],
      ['Jabatan / Posisi', doc.job.positionTitle || '-'],
      ['Departemen / Divisi', doc.job.department || '-']
    ];
    if (doc.warning) {
      spRows.push([
        'Tingkat & Masa Berlaku SP',
        `SP ${doc.warning.warningLevel}  •  Berlaku s/d ${formatIndonesianDate(doc.warning.validUntilDate)}`
      ]);
    }

    spRows.forEach(([lbl, val], idx) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.2);
      pdf.setTextColor(100, 116, 139);
      pdf.text(lbl, labelX, rowY);
      pdf.text(':', valX - 3, rowY);

      pdf.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      pdf.setTextColor(15, 23, 42);
      const truncated = pdf.splitTextToSize(val, CONTENT_WIDTH - 52)[0] || '-';
      pdf.text(truncated, valX, rowY);
      rowY += 4.6;
    });

    y += boxHeight + 5;
  } else if (isTerminationDoc) {
    // Format Pembuka Khusus Pemberhentian / PHK / Resign
    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(15, 23, 42);
    const introText = isEnglish
      ? `This Notice of Employment Termination / Settlement is officially issued by ${doc.company.companyName} on ${fullDateEn} to:`
      : `Surat Keterangan Pengakhiran Hubungan Kerja ini diterbitkan secara resmi oleh ${doc.company.companyName} pada tanggal ${fullDateId} kepada:`;
    const introLines = pdf.splitTextToSize(introText, CONTENT_WIDTH);
    pdf.text(introLines, MARGIN_LEFT, y);
    y += introLines.length * 4.5 + 2;

    const boxHeight = 24;
    ensureSpace(boxHeight + 4);
    pdf.setFillColor(255, 241, 242); // rose-50
    pdf.setDrawColor(244, 63, 94); // rose-500
    pdf.setLineWidth(0.3);
    pdf.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, boxHeight, 1.5, 1.5, 'FD');

    pdf.setFillColor(225, 29, 72); // rose-600
    pdf.rect(MARGIN_LEFT, y, 2, boxHeight, 'F');

    const labelX = MARGIN_LEFT + 6;
    const valX = MARGIN_LEFT + 48;
    let rowY = y + 5.5;

    const termRows: [string, string][] = [
      ['Nama Karyawan', doc.employee.fullName || '-'],
      ['NIK KTP', doc.employee.nik || '-'],
      ['Jabatan Terakhir', `${doc.job.positionTitle || '-'} (${doc.job.department || '-'})`],
      [
        'Masa Pengabdian',
        `Mulai ${formatIndonesianDate(doc.job.startDate)} s/d ${formatIndonesianDate(
          doc.termination?.effectiveDate || doc.signingDate
        )}`
      ]
    ];

    termRows.forEach(([lbl, val], idx) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.2);
      pdf.setTextColor(100, 116, 139);
      pdf.text(lbl, labelX, rowY);
      pdf.text(':', valX - 3, rowY);

      pdf.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      pdf.setTextColor(15, 23, 42);
      const truncated = pdf.splitTextToSize(val, CONTENT_WIDTH - 52)[0] || '-';
      pdf.text(truncated, valX, rowY);
      rowY += 4.8;
    });

    y += boxHeight + 5;
  } else if (isBilingual) {
    // Format Bilingual (2 Kolom Berdampingan untuk Pembuka & Komparisi)
    const colGap = 6;
    const colWidth = (CONTENT_WIDTH - colGap) / 2; // 84 mm each
    const leftX = MARGIN_LEFT;
    const rightX = MARGIN_LEFT + colWidth + colGap;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(15, 23, 42);
    const recId = `Pada hari ini ${dayNameId}, tanggal ${fullDateId}, bertempat di ${doc.signingCity}, telah dibuat dan ditandatangani perjanjian oleh dan antara:`;
    const recIdLines = pdf.splitTextToSize(recId, colWidth);
    pdf.text(recIdLines, leftX, y);

    pdf.setFont('times', 'italic');
    pdf.setFontSize(9);
    pdf.setTextColor(51, 65, 85);
    const recEn = `On this day ${dayNameEn}, date ${fullDateEn}, in ${doc.signingCity}, this agreement is made and entered into by and between:`;
    const recEnLines = pdf.splitTextToSize(recEn, colWidth);
    pdf.text(recEnLines, rightX, y);

    y += Math.max(recIdLines.length, recEnLines.length) * 4.2 + 2.5;

    // Party 1 & Party 2 Boxes in Bilingual Mode
    const drawBilingualPartyBox = (
      titleLeft: string,
      titleRight: string,
      rowsLeft: [string, string][],
      rowsRight: [string, string][],
      footerLeft: string,
      footerRight: string
    ) => {
      const boxH = Math.max(rowsLeft.length, rowsRight.length) * 4.5 + 13;
      ensureSpace(boxH + 3);

      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.25);
      pdf.roundedRect(leftX, y, colWidth, boxH, 1.2, 1.2, 'FD');
      pdf.roundedRect(rightX, y, colWidth, boxH, 1.2, 1.2, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.8);
      pdf.setTextColor(30, 58, 138);
      pdf.text(titleLeft, leftX + 3, y + 4.5);
      pdf.text(titleRight, rightX + 3, y + 4.5);

      let rY = y + 9;
      const maxLen = Math.max(rowsLeft.length, rowsRight.length);
      for (let i = 0; i < maxLen; i++) {
        if (rowsLeft[i]) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7.5);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`${rowsLeft[i][0]}:`, leftX + 3, rY);
          pdf.setFont('helvetica', i === 0 ? 'bold' : 'normal');
          pdf.setTextColor(15, 23, 42);
          const lVal = pdf.splitTextToSize(rowsLeft[i][1] || '-', colWidth - 25)[0] || '-';
          pdf.text(lVal, leftX + 23, rY);
        }
        if (rowsRight[i]) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7.5);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`${rowsRight[i][0]}:`, rightX + 3, rY);
          pdf.setFont('helvetica', i === 0 ? 'bold' : 'normal');
          pdf.setTextColor(15, 23, 42);
          const rVal = pdf.splitTextToSize(rowsRight[i][1] || '-', colWidth - 25)[0] || '-';
          pdf.text(rVal, rightX + 23, rY);
        }
        rY += 4.3;
      }

      pdf.setFont('times', 'bolditalic');
      pdf.setFontSize(7.8);
      pdf.setTextColor(51, 65, 85);
      pdf.text(footerLeft, leftX + 3, y + boxH - 2.2);
      pdf.text(footerRight, rightX + 3, y + boxH - 2.2);

      y += boxH + 3;
    };

    drawBilingualPartyBox(
      'PIHAK PERTAMA (Pemberi Kerja)',
      'FIRST PARTY (Employer)',
      [
        ['Perusahaan', `${doc.company.companyName} (${doc.company.legalEntity})`],
        ['Alamat', `${doc.company.address}, ${doc.company.city}`],
        ['Diwakili', `${doc.company.representativeName} (${doc.company.representativePosition})`]
      ],
      [
        ['Company', `${doc.company.companyName} (${doc.company.legalEntity})`],
        ['Address', `${doc.company.address}, ${doc.company.city}`],
        ['Rep. By', `${doc.company.representativeName} (${doc.company.representativePosition})`]
      ],
      'Selanjutnya disebut "PIHAK PERTAMA"',
      'Hereinafter referred to as "FIRST PARTY"'
    );

    drawBilingualPartyBox(
      'PIHAK KEDUA (Pekerja / Karyawan)',
      'SECOND PARTY (Employee)',
      [
        ['Nama', doc.employee.fullName || '-'],
        ['NIK KTP', doc.employee.nik || '-'],
        ['TTL', `${doc.employee.birthPlace}, ${formatIndonesianDate(doc.employee.birthDate)}`],
        ['Domisili', `${doc.employee.address}, ${doc.employee.city}`]
      ],
      [
        ['Name', doc.employee.fullName || '-'],
        ['ID No.', doc.employee.nik || '-'],
        ['Birth', `${doc.employee.birthPlace}, ${formatEnglishDate(doc.employee.birthDate)}`],
        ['Address', `${doc.employee.address}, ${doc.employee.city}`]
      ],
      'Selanjutnya disebut "PIHAK KEDUA"',
      'Hereinafter referred to as "SECOND PARTY"'
    );

    y += 2;
  } else {
    // Format 1 Bahasa (Bahasa Indonesia atau Bahasa Inggris)
    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(15, 23, 42);

    const openingParagraph = isEnglish
      ? `On this day ${dayNameEn}, date ${fullDateEn}, located in ${doc.signingCity}, an Employment Agreement has been made and entered into by and between the undersigned parties:`
      : `Pada hari ini ${dayNameId}, tanggal ${fullDateId}, bertempat di ${doc.signingCity}, telah dibuat dan ditandatangani Perjanjian Kerja oleh dan antara pihak-pihak:`;

    const openingLines = pdf.splitTextToSize(openingParagraph, CONTENT_WIDTH);
    pdf.text(openingLines, MARGIN_LEFT, y);
    y += openingLines.length * 4.5 + 2.5;

    // 2-Column Side-by-Side Identity Cards for PIHAK PERTAMA & PIHAK KEDUA
    const colGap = 5;
    const cardW = (CONTENT_WIDTH - colGap) / 2;
    const cardH = 27;
    ensureSpace(cardH + 4);

    const leftCardX = MARGIN_LEFT;
    const rightCardX = MARGIN_LEFT + cardW + colGap;

    pdf.setFillColor(248, 250, 252); // slate-50
    pdf.setDrawColor(203, 213, 225); // slate-300
    pdf.setLineWidth(0.25);
    pdf.roundedRect(leftCardX, y, cardW, cardH, 1.5, 1.5, 'FD');
    pdf.roundedRect(rightCardX, y, cardW, cardH, 1.5, 1.5, 'FD');

    // Left Card: PIHAK PERTAMA
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(30, 58, 138); // blue-900
    pdf.text(
      isEnglish ? 'FIRST PARTY (Employer):' : 'PIHAK PERTAMA (Pemberi Kerja):',
      leftCardX + 3.5,
      y + 5
    );

    const p1Rows: [string, string][] = isEnglish
      ? [
          ['Company', `${doc.company.companyName} (${doc.company.legalEntity})`],
          ['Address', `${doc.company.address}, ${doc.company.city}`],
          ['Rep. By', `${doc.company.representativeName} (${doc.company.representativePosition})`]
        ]
      : [
          ['Perusahaan', `${doc.company.companyName} (${doc.company.legalEntity})`],
          ['Alamat', `${doc.company.address}, ${doc.company.city}`],
          ['Wakil Resmi', `${doc.company.representativeName} (${doc.company.representativePosition})`]
        ];

    let p1Y = y + 9.8;
    p1Rows.forEach(([lbl, val], idx) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${lbl}:`, leftCardX + 3.5, p1Y);

      pdf.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      pdf.setTextColor(15, 23, 42);
      const wrapped = pdf.splitTextToSize(val || '-', cardW - 24);
      pdf.text(wrapped.slice(0, 2), leftCardX + 22, p1Y);
      p1Y += wrapped.length > 1 ? 6.8 : 4.6;
    });

    // Right Card: PIHAK KEDUA
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(30, 58, 138);
    pdf.text(
      isEnglish ? 'SECOND PARTY (Employee):' : 'PIHAK KEDUA (Pekerja / Karyawan):',
      rightCardX + 3.5,
      y + 5
    );

    const p2Rows: [string, string][] = isEnglish
      ? [
          ['Full Name', doc.employee.fullName || '-'],
          ['ID Number', doc.employee.nik || '-'],
          ['Birth Info', `${doc.employee.birthPlace}, ${formatEnglishDate(doc.employee.birthDate)}`],
          ['Domicile', `${doc.employee.address}, ${doc.employee.city}`]
        ]
      : [
          ['Nama', doc.employee.fullName || '-'],
          ['NIK KTP', doc.employee.nik || '-'],
          ['TTL', `${doc.employee.birthPlace}, ${formatIndonesianDate(doc.employee.birthDate)}`],
          ['Domisili', `${doc.employee.address}, ${doc.employee.city}`]
        ];

    let p2Y = y + 9.8;
    p2Rows.forEach(([lbl, val], idx) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${lbl}:`, rightCardX + 3.5, p2Y);

      pdf.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      pdf.setTextColor(15, 23, 42);
      const wrapped = pdf.splitTextToSize(val || '-', cardW - 22);
      pdf.text(wrapped[0] || '-', rightCardX + 20, p2Y);
      p2Y += 4.3;
    });

    y += cardH + 5;
  }

  // Divider below Recitals
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.25);
  pdf.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 5;

  // =========================================================================
  // 4. NUMBERED ARTICLES & CLAUSES (PASAL DEMI PASAL)
  // =========================================================================
  activeClauses.forEach((clause, index) => {
    const articleNum = index + 1;

    // Prevent orphan article header at bottom of page (require at least 22mm for header + first lines)
    ensureSpace(22);

    if (index > 0) {
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.2);
      pdf.line(MARGIN_LEFT, y - 1.5, PAGE_WIDTH - MARGIN_RIGHT, y - 1.5);
      y += 2.5;
    }

    if (isBilingual) {
      const colGap = 6;
      const colWidth = (CONTENT_WIDTH - colGap) / 2;
      const leftX = MARGIN_LEFT;
      const rightX = MARGIN_LEFT + colWidth + colGap;
      const midLineX = MARGIN_LEFT + colWidth + colGap / 2;

      // Bilingual Article Header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`PASAL ${articleNum}`, leftX + colWidth / 2, y, { align: 'center' });

      pdf.setFont('helvetica', 'bolditalic');
      pdf.setTextColor(100, 116, 139);
      pdf.text(`ARTICLE ${articleNum}`, rightX + colWidth / 2, y, { align: 'center' });
      y += 4;

      pdf.setFont('times', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(15, 23, 42);
      const titleIdWrapped = pdf.splitTextToSize((clause.titleId || '').toUpperCase(), colWidth - 4);
      pdf.text(titleIdWrapped, leftX + colWidth / 2, y, { align: 'center' });

      pdf.setFont('times', 'bolditalic');
      pdf.setFontSize(9);
      pdf.setTextColor(51, 65, 85);
      const titleEnWrapped = pdf.splitTextToSize((clause.titleEn || '').toUpperCase(), colWidth - 4);
      pdf.text(titleEnWrapped, rightX + colWidth / 2, y, { align: 'center' });

      y += Math.max(titleIdWrapped.length, titleEnWrapped.length) * 4.2 + 2;

      // Split paragraphs and synchronize row-by-row
      const parasId = (clause.contentId || '').split('\n');
      const parasEn = (clause.contentEn || '').split('\n');
      const maxParas = Math.max(parasId.length, parasEn.length);

      for (let p = 0; p < maxParas; p++) {
        const pId = (parasId[p] ?? '').trim();
        const pEn = (parasEn[p] ?? '').trim();

        if (!pId && !pEn) {
          y += 2;
          continue;
        }

        pdf.setFont('times', 'normal');
        pdf.setFontSize(9);
        const linesId: string[] = pId ? pdf.splitTextToSize(pId, colWidth - 1) : [];

        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8.2);
        const linesEn: string[] = pEn ? pdf.splitTextToSize(pEn, colWidth - 1) : [];

        const maxLines = Math.max(linesId.length, linesEn.length);
        const lineH = 4.1;

        for (let l = 0; l < maxLines; l++) {
          ensureSpace(lineH + 1);

          // Draw subtle vertical divider segment
          pdf.setDrawColor(226, 232, 240);
          pdf.setLineWidth(0.2);
          pdf.line(midLineX, y - 3, midLineX, y + 1.2);

          if (linesId[l]) {
            pdf.setFont('times', 'normal');
            pdf.setFontSize(9);
            pdf.setTextColor(30, 41, 59);
            pdf.text(linesId[l], leftX, y);
          }

          if (linesEn[l]) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(8.2);
            pdf.setTextColor(71, 85, 105);
            pdf.text(linesEn[l], rightX, y);
          }

          y += lineH;
        }
        y += 1.2;
      }
      y += 2.5;
    } else {
      // Single Language Clause (ID or EN)
      const headerLabel = isEnglish ? `ARTICLE ${articleNum}` : `PASAL ${articleNum}`;
      const clauseTitle = (isEnglish ? clause.titleEn || clause.titleId : clause.titleId).toUpperCase();
      const clauseContent = isEnglish ? clause.contentEn || clause.contentId : clause.contentId;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.2);
      pdf.setTextColor(71, 85, 105);
      pdf.text(headerLabel, centerX, y, { align: 'center' });
      y += 4;

      pdf.setFont('times', 'bold');
      pdf.setFontSize(9.8);
      pdf.setTextColor(15, 23, 42);
      const titleWrapped = pdf.splitTextToSize(clauseTitle, CONTENT_WIDTH - 16);
      pdf.text(titleWrapped, centerX, y, { align: 'center' });
      y += titleWrapped.length * 4.3 + 2;

      const paragraphs = (clauseContent || '').split('\n');
      const lineH = 4.3;

      for (const rawPara of paragraphs) {
        const para = rawPara.trimEnd();
        if (!para.trim()) {
          y += 2;
          continue;
        }

        pdf.setFont('times', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(30, 41, 59);

        const wrappedLines: string[] = pdf.splitTextToSize(para, CONTENT_WIDTH);
        for (const line of wrappedLines) {
          ensureSpace(lineH + 1);
          pdf.text(line, MARGIN_LEFT, y);
          y += lineH;
        }
        y += 1.2;
      }

      y += 2.5;
    }
  });

  // =========================================================================
  // 5. CUSTOM NOTES (JIKA ADA CATATAN KHUSUS)
  // =========================================================================
  if (doc.customNotes && doc.customNotes.trim()) {
    const noteLines = pdf.splitTextToSize(doc.customNotes.trim(), CONTENT_WIDTH - 8);
    const noteBoxH = noteLines.length * 4.2 + 11;
    ensureSpace(noteBoxH + 4);

    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.25);
    pdf.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, noteBoxH, 1.2, 1.2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(51, 65, 85);
    pdf.text(
      isEnglish ? 'ADDITIONAL NOTES / SPECIAL PROVISIONS:' : 'CATATAN TAMBAHAN / KETENTUAN KHUSUS:',
      MARGIN_LEFT + 4,
      y + 5
    );

    pdf.setFont('times', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(30, 41, 59);
    pdf.text(noteLines, MARGIN_LEFT + 4, y + 9.5);

    y += noteBoxH + 5;
  }

  // =========================================================================
  // 6. CLOSING & SIGNATURES BLOCK (ATOMIC BREAK-INSIDE-AVOID)
  // =========================================================================
  const signatureSectionHeight = isBilingual ? 64 : 56;
  ensureSpace(signatureSectionHeight);

  y += 2;
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.3);
  pdf.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 5;

  // Closing Witness Statement
  if (isWarningLetter) {
    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(30, 41, 59);
    const closingSp = isEnglish
      ? 'This Warning Letter is issued truthfully to be strictly observed and complied with by the employee concerned in order to maintain corporate discipline and operational excellence.'
      : 'Demikian Surat Peringatan ini dibuat dengan sebenar-benarnya untuk diperhatikan dan ditaati sebaik-baiknya oleh karyawan yang bersangkutan demi menjaga kedisiplinan dan kelancaran operasional perusahaan.';
    const closingLines = pdf.splitTextToSize(closingSp, CONTENT_WIDTH);
    pdf.text(closingLines, MARGIN_LEFT, y);
    y += closingLines.length * 4.3 + 5;
  } else if (isTerminationDoc) {
    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(30, 41, 59);
    const closingTerm = isEnglish
      ? 'In witness whereof, this Employment Termination Notice is executed in 2 (two) original counterparts possessing equal legal force for BOTH PARTIES.'
      : 'Demikian Surat Pengakhiran Hubungan Kerja ini dibuat dalam rangkap 2 (dua) asli yang memiliki kekuatan hukum yang sama bagi PARA PIHAK.';
    const closingLines = pdf.splitTextToSize(closingTerm, CONTENT_WIDTH);
    pdf.text(closingLines, MARGIN_LEFT, y);
    y += closingLines.length * 4.3 + 5;
  } else if (isBilingual) {
    const colGap = 6;
    const colWidth = (CONTENT_WIDTH - colGap) / 2;
    const leftX = MARGIN_LEFT;
    const rightX = MARGIN_LEFT + colWidth + colGap;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(8.8);
    pdf.setTextColor(30, 41, 59);
    const closeId =
      'Demikianlah Perjanjian ini dibuat dan ditandatangani oleh PARA PIHAK pada hari dan tanggal sebagaimana tersebut di atas dalam rangkap 2 (dua) asli bermeterai cukup Rp 10.000,- yang mempunyai kekuatan hukum pembuktian yang sama.';
    const closeIdLines = pdf.splitTextToSize(closeId, colWidth);
    pdf.text(closeIdLines, leftX, y);

    pdf.setFont('times', 'italic');
    pdf.setFontSize(8.8);
    pdf.setTextColor(71, 85, 105);
    const closeEn =
      'In witness whereof, this Agreement has been executed by THE PARTIES on the date first above written in 2 (two) counterparts with valid stamp duty of IDR 10,000.- possessing equal legal evidentiary force.';
    const closeEnLines = pdf.splitTextToSize(closeEn, colWidth);
    pdf.text(closeEnLines, rightX, y);

    y += Math.max(closeIdLines.length, closeEnLines.length) * 4.1 + 5;
  } else {
    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(30, 41, 59);
    const closeStd = isEnglish
      ? 'In witness whereof, this Agreement has been executed by THE PARTIES on the date first above written in 2 (two) original counterparts with valid stamp duty of IDR 10,000.- possessing equal legal evidentiary force.'
      : 'Demikianlah Perjanjian ini dibuat dan disepakati oleh PARA PIHAK pada hari dan tanggal tersebut di atas dalam rangkap 2 (dua) asli bermeterai cukup Rp 10.000,- yang mempunyai kekuatan hukum pembuktian yang sama.';
    const closeLines = pdf.splitTextToSize(closeStd, CONTENT_WIDTH);
    pdf.text(closeLines, MARGIN_LEFT, y);
    y += closeLines.length * 4.3 + 5;
  }

  // Two-Column Signature Grid
  const leftCenterX = MARGIN_LEFT + CONTENT_WIDTH * 0.25;
  const rightCenterX = MARGIN_LEFT + CONTENT_WIDTH * 0.75;

  const leftHeader = isWarningLetter
    ? 'DITERBITKAN OLEH:'
    : isTerminationDoc
    ? 'PIHAK PERUSAHAAN:'
    : isBilingual
    ? 'PIHAK PERTAMA / FIRST PARTY'
    : isEnglish
    ? 'FIRST PARTY (Employer)'
    : 'PIHAK PERTAMA (Pemberi Kerja)';

  const rightHeader = isWarningLetter
    ? 'DITERIMA OLEH:'
    : isTerminationDoc
    ? 'PIHAK KARYAWAN:'
    : isBilingual
    ? 'PIHAK KEDUA / SECOND PARTY'
    : isEnglish
    ? 'SECOND PARTY (Employee)'
    : 'PIHAK KEDUA (Pekerja / Karyawan)';

  const rightSub = isWarningLetter
    ? 'Karyawan yang Bersangkutan'
    : isTerminationDoc
    ? 'Menerima & Menyetujui'
    : isBilingual
    ? 'Pekerja / Employee'
    : isEnglish
    ? 'Employee'
    : 'Pekerja / Karyawan';

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text(leftHeader, leftCenterX, y, { align: 'center' });
  pdf.text(rightHeader, rightCenterX, y, { align: 'center' });
  y += 4;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(doc.company.companyName || '-', leftCenterX, y, { align: 'center' });
  pdf.text(rightSub, rightCenterX, y, { align: 'center' });
  y += 4;

  // Stamp Duty (Meterai Rp 10.000) Box on Left Signatory (unless Warning Letter)
  if (!isWarningLetter) {
    const meteraiW = 28;
    const meteraiH = 14;
    const meteraiX = leftCenterX - meteraiW / 2;
    const meteraiY = y + 2;

    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(0.25);
    pdf.setLineDashPattern([1.2, 1.2], 0);
    pdf.roundedRect(meteraiX, meteraiY, meteraiW, meteraiH, 1, 1, 'S');
    pdf.setLineDashPattern([], 0);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text('METERAI TEMPEL', leftCenterX, meteraiY + 4.8, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text('Rp 10.000,-', leftCenterX, meteraiY + 8.5, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6);
    pdf.text('/ e-Meterai', leftCenterX, meteraiY + 11.8, { align: 'center' });
  } else {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(180, 190, 205);
    pdf.text('(Tanda Tangan & Stempel)', leftCenterX, y + 10, { align: 'center' });
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(180, 190, 205);
  pdf.text('(Tanda Tangan)', rightCenterX, y + 10, { align: 'center' });

  y += 21;

  // Signatory Names (Bold + Underlined)
  pdf.setFont('times', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(15, 23, 42);
  const repName = doc.company.representativeName || 'Perwakilan Perusahaan';
  const empName = doc.employee.fullName || 'Nama Karyawan';

  pdf.text(repName, leftCenterX, y, { align: 'center' });
  pdf.text(empName, rightCenterX, y, { align: 'center' });

  // Underlines
  const repWidth = Math.max(pdf.getTextWidth(repName) + 4, 42);
  const empWidth = Math.max(pdf.getTextWidth(empName) + 4, 42);
  pdf.setDrawColor(15, 23, 42);
  pdf.setLineWidth(0.3);
  pdf.line(leftCenterX - repWidth / 2, y + 1, leftCenterX + repWidth / 2, y + 1);
  pdf.line(rightCenterX - empWidth / 2, y + 1, rightCenterX + empWidth / 2, y + 1);

  y += 4.5;

  // Signatory Positions / NIK
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(doc.company.representativePosition || 'Direktur Utama', leftCenterX, y, { align: 'center' });
  pdf.text(`NIK: ${doc.employee.nik || '-'}`, rightCenterX, y, { align: 'center' });

  // =========================================================================
  // 7. LAMPIRAN SURAT PENGALAMAN KERJA (PAKLARING) JIKA DIAKTIFKAN
  // =========================================================================
  if (isTerminationDoc && doc.termination?.includePaklaring) {
    pdf.addPage('a4', 'portrait');
    y = FIRST_PAGE_TOP_Y;
    drawLetterhead();

    pdf.setFont('times', 'bold');
    pdf.setFontSize(12.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text('SURAT KETERANGAN PENGALAMAN KERJA', centerX, y, { align: 'center' });
    y += 4.8;

    pdf.setFont('times', 'bolditalic');
    pdf.setFontSize(10);
    pdf.setTextColor(71, 85, 105);
    pdf.text('CERTIFICATE OF EMPLOYMENT (PAKLARING)', centerX, y, { align: 'center' });
    y += 5;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(51, 65, 85);
    pdf.text(
      `Nomor Referensi / Ref. No: ${doc.termination.paklaringReferenceNumber || doc.contractNumber}`,
      centerX,
      y,
      { align: 'center' }
    );
    y += 9;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    const pakOpening = `Yang bertanda tangan di bawah ini, Manajemen ${doc.company.companyName} (${doc.company.legalEntity}), menerangkan dengan sesungguhnya bahwa:`;
    const pakOpenLines = pdf.splitTextToSize(pakOpening, CONTENT_WIDTH);
    pdf.text(pakOpenLines, MARGIN_LEFT, y);
    y += pakOpenLines.length * 4.8 + 3;

    // Employee Details Box in Paklaring
    const pakBoxH = 34;
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, pakBoxH, 1.5, 1.5, 'FD');

    const pakRows: [string, string][] = [
      ['Nama Lengkap / Full Name', doc.employee.fullName || '-'],
      ['Nomor Induk Kependudukan (NIK)', doc.employee.nik || '-'],
      ['Tempat, Tanggal Lahir', `${doc.employee.birthPlace}, ${formatIndonesianDate(doc.employee.birthDate)}`],
      ['Jabatan Terakhir / Last Position', doc.job.positionTitle || '-'],
      ['Departemen / Department', doc.job.department || '-'],
      [
        'Masa Kerja / Period of Service',
        `${formatIndonesianDate(doc.job.startDate)} s/d ${formatIndonesianDate(
          doc.termination.effectiveDate || doc.signingDate
        )}`
      ]
    ];

    let pRowY = y + 5.5;
    pakRows.forEach(([lbl, val], idx) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(lbl, MARGIN_LEFT + 5, pRowY);
      pdf.text(':', MARGIN_LEFT + 62, pRowY);

      pdf.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      pdf.setTextColor(15, 23, 42);
      pdf.text(val, MARGIN_LEFT + 66, pRowY);
      pRowY += 4.8;
    });

    y += pakBoxH + 6;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    const conductText =
      doc.termination.employmentConductDescription ||
      `Benar telah bekerja pada ${doc.company.companyName} selama periode tersebut di atas. Selama masa pengabdiannya, yang bersangkutan telah menunjukkan dedikasi, integritas, dan kontribusi kerja yang baik bagi perusahaan.`;
    const conductLines = pdf.splitTextToSize(conductText, CONTENT_WIDTH);
    pdf.text(conductLines, MARGIN_LEFT, y);
    y += conductLines.length * 4.8 + 4;

    const appreciationText =
      'Kami mengucapkan terima kasih yang sebesar-besarnya atas segala karya dan dedikasi yang telah diberikan, serta mendoakan kesuksesan karier yang bersangkutan di masa mendatang. Demikian Surat Keterangan Pengalaman Kerja ini diterbitkan agar dapat dipergunakan sebagaimana mestinya.';
    const appLines = pdf.splitTextToSize(appreciationText, CONTENT_WIDTH);
    pdf.text(appLines, MARGIN_LEFT, y);
    y += appLines.length * 4.8 + 12;

    // Right-aligned Official Signature for Paklaring
    const signX = PAGE_WIDTH - MARGIN_RIGHT - 35;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(51, 65, 85);
    pdf.text(`${doc.signingCity}, ${fullDateId}`, signX, y, { align: 'center' });
    y += 4.5;
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(doc.company.companyName, signX, y, { align: 'center' });
    y += 22;

    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.text(doc.company.representativeName, signX, y, { align: 'center' });
    pdf.setLineWidth(0.3);
    pdf.line(signX - 28, y + 1, signX + 28, y + 1);
    y += 4.5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.2);
    pdf.setTextColor(71, 85, 105);
    pdf.text(doc.company.representativePosition, signX, y, { align: 'center' });
  }

  // =========================================================================
  // 8. TWO-PASS RUNNING HEADERS & FOOTERS (HALAMAN X DARI Y)
  // =========================================================================
  const totalPages = pdf.getNumberOfPages();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    pdf.setPage(pageNum);

    // Running Header on Pages 2..N
    if (pageNum > 1) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.2);
      pdf.setTextColor(100, 116, 139);
      const shortTitle = (doc.titleId || 'DOKUMEN RESMI').slice(0, 65);
      pdf.text(`${shortTitle}  •  No: ${doc.contractNumber}`, MARGIN_LEFT, 12);
      pdf.text(doc.company.companyName || '', PAGE_WIDTH - MARGIN_RIGHT, 12, { align: 'right' });

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.2);
      pdf.line(MARGIN_LEFT, 14.5, PAGE_WIDTH - MARGIN_RIGHT, 14.5);
    }

    // Bottom Legal Compliance Footer & Page Numbering on All Pages
    const footerLineY = 281;
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.25);
    pdf.line(MARGIN_LEFT, footerLineY, PAGE_WIDTH - MARGIN_RIGHT, footerLineY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      `Sistem Pembuat Dokumen Legal HRMatrix Indonesia  •  Standar UU No. 6/2023 & PP No. 35/2021`,
      MARGIN_LEFT,
      footerLineY + 4
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    const pageLabel = isEnglish
      ? `Page ${pageNum} of ${totalPages}`
      : isBilingual
      ? `Halaman ${pageNum} dari ${totalPages} (Page ${pageNum}/${totalPages})`
      : `Halaman ${pageNum} dari ${totalPages}`;
    pdf.text(pageLabel, PAGE_WIDTH - MARGIN_RIGHT, footerLineY + 4, { align: 'right' });
  }

  return pdf;
}

/**
 * Membangun objek Single Source of Truth `GeneratedPdfArtifact` untuk ContractDocument.
 */
export async function buildContractPdfArtifact(
  doc: ContractDocument
): Promise<GeneratedPdfArtifact> {
  const pdf = generateContractJsPdf(doc);
  const empSlug = (doc.employee.fullName || 'Karyawan').replace(/\s+/g, '_');
  const numSlug = (doc.contractNumber || doc.contractType).replace(/[\\/:*?"<>|\s]+/g, '-');
  const rawFileName = `${doc.contractType}_${empSlug}_${numSlug}.pdf`;
  return createPdfArtifactFromJsPdf(pdf, rawFileName);
}
