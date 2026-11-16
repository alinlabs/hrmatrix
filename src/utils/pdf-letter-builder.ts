import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OfficialLetterDocument } from '../pages/surat/types';
import { formatIndonesianDate, formatRupiah } from '../pages/surat/letter-templates';
import { applyA4RunningChrome } from './pdf-generator';

/**
 * Membangun dokumen PDF Surat Resmi & SK Direksi A4 beresolusi vektor penuh.
 * Menjamin 100% kesesuaian tata letak antara pratinjau Retina, unduh, dan cetak fisik.
 */
export function buildLetterPdf(letter: OfficialLetterDocument): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const marginX = 20;
  const maxWidth = pageWidth - marginX * 2;
  const bottomLimitY = 274;
  let y = 18;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > bottomLimitY) {
      doc.addPage();
      y = 22;
    }
  };

  // Kop Surat Perusahaan
  const companyHeader = [
    letter.company.legalEntity &&
    !letter.company.companyName.toUpperCase().startsWith(letter.company.legalEntity.toUpperCase())
      ? letter.company.legalEntity
      : '',
    letter.company.companyName,
  ]
    .filter(Boolean)
    .join(' ')
    .toUpperCase();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(companyHeader, pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const fullAddr = [letter.company.address, letter.company.city].filter(Boolean).join(', ');
  if (fullAddr) {
    doc.text(fullAddr, pageWidth / 2, y, { align: 'center', maxWidth });
    y += 4;
  }
  doc.text(
    `Telp: ${letter.company.phone || '-'}   |   Email: ${letter.company.email || '-'}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 4;

  // Double Formal Divider
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.75);
  doc.line(marginX, y, pageWidth - marginX, y);
  doc.setLineWidth(0.25);
  doc.line(marginX, y + 1.2, pageWidth - marginX, y + 1.2);
  y += 9;

  // Judul & Nomor Surat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(letter.title.toUpperCase(), maxWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
  y += titleLines.length * 4.8 + 1.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(51, 65, 85);
  doc.text(`Nomor: ${letter.letterNumber}`, pageWidth / 2, y, { align: 'center' });
  y += 8.5;

  // Identitas Penerima Terstruktur
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.3);
  doc.setTextColor(30, 41, 59);
  doc.text('Dengan ini menerangkan / memutuskan kepada karyawan berikut:', marginX, y);
  y += 3.5;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX, bottom: 20 },
    theme: 'grid',
    styles: {
      fontSize: 8.6,
      cellPadding: { top: 2, right: 3, bottom: 2, left: 3 },
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 44, fillColor: [248, 250, 252], textColor: [51, 65, 85] },
      1: { cellWidth: maxWidth - 44 },
    },
    body: [
      ['Nama Lengkap', letter.employee.fullName],
      ['NIK / ID Karyawan', letter.employee.nik],
      ['Jabatan / Posisi', `${letter.employee.positionTitle}${letter.employee.jobGrade ? ` (${letter.employee.jobGrade})` : ''}`],
      ['Departemen / Divisi', letter.employee.department],
      ...(letter.employee.address ? [['Alamat Domisili', letter.employee.address] as [string, string]] : []),
    ],
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 30) + 6;

  const addParagraph = (text: string, bold = false, indent = 0) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(9.3);
    doc.setTextColor(30, 41, 59);
    const lines: string[] = doc.splitTextToSize(text, maxWidth - indent);
    for (let i = 0; i < lines.length; i++) {
      ensureSpace(4.6);
      doc.text(lines[i], marginX + indent, y);
      y += 4.5;
    }
    y += 2.2;
  };

  if (letter.careerChange) {
    const cc = letter.careerChange;
    addParagraph(`Efektif terhitung mulai tanggal ${formatIndonesianDate(cc.effectiveDate)}:`, true);

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX, bottom: 20 },
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 2.2, lineColor: [203, 213, 225], lineWidth: 0.2 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
      head: [['ASPEK KEPEGAWAIAN', 'SEBELUMNYA', 'BARU / EFEKTIF']],
      body: [
        ['Jabatan / Posisi', cc.previousPosition || '-', cc.newPosition || '-'],
        ['Departemen / Unit', cc.previousDepartment || '-', cc.newDepartment || '-'],
        ...(cc.previousJobGrade || cc.newJobGrade
          ? [['Grade / Golongan', cc.previousJobGrade || '-', cc.newJobGrade || '-'] as [string, string, string]]
          : []),
        ...(cc.newSalary
          ? [[
              'Gaji Pokok',
              cc.previousSalary ? formatRupiah(cc.previousSalary) : '-',
              formatRupiah(cc.newSalary),
            ] as [string, string, string]]
          : []),
      ],
    });
    y = ((doc as any).lastAutoTable?.finalY || y + 25) + 5;

    if (cc.considerations?.length) {
      addParagraph('MENIMBANG:', true);
      cc.considerations.forEach((c, i) => addParagraph(`${i + 1}. ${c}`, false, 4));
    }
    if (cc.legalReferences?.length) {
      addParagraph('MENGINGAT:', true);
      cc.legalReferences.forEach((r, i) => addParagraph(`${i + 1}. ${r}`, false, 4));
    }
    if (cc.observations?.length) {
      addParagraph('MEMPERHATIKAN:', true);
      cc.observations.forEach((o, i) => addParagraph(`${i + 1}. ${o}`, false, 4));
    }
    if (cc.decisions?.length) {
      addParagraph('MEMUTUSKAN / MENETAPKAN:', true);
      cc.decisions.forEach((d, idx) => addParagraph(`${idx + 1}. ${d}`, false, 4));
    }
  }

  if (letter.warning) {
    const w = letter.warning;
    addParagraph(`Tingkat Sanksi: SURAT PERINGATAN KE-${w.warningLevel} (SP ${w.warningLevel})`, true);
    addParagraph(`Kategori Pelanggaran: ${w.violationCategory}`, true);
    addParagraph(`Tanggal Kejadian: ${formatIndonesianDate(w.incidentDate)}`);
    addParagraph(`Kronologi & Fakta Pelanggaran:\n${w.violationDescription}`);
    addParagraph(`Dasar Ketentuan Dilanggar: ${w.violationClauseReference}`);
    addParagraph(`Tindakan Perbaikan yang Diwajibkan:\n${w.correctiveActions}`);
    addParagraph(`Konsekuensi Lanjutan:\n${w.consequences}`);
    addParagraph(`Masa Berlaku Sanksi Efektif: s/d ${formatIndonesianDate(w.validUntilDate)}`, true);
  }

  if (letter.certificate) {
    const cert = letter.certificate;
    addParagraph(
      `Adalah benar pernah bekerja dan tercatat sebagai karyawan aktif pada ${letter.company.companyName} terhitung mulai tanggal ${formatIndonesianDate(cert.employmentStartDate)} sampai dengan tanggal ${formatIndonesianDate(cert.employmentEndDate)} dengan jabatan terakhir sebagai ${cert.lastPosition} pada Departemen ${cert.lastDepartment}.`
    );
    addParagraph(`Alasan Berakhirnya Hubungan Kerja: ${cert.reasonForLeaving}.`);
    addParagraph(`Penilaian Kinerja & Perilaku: ${cert.conductRating}. ${cert.recommendationNote}`);
  }

  if (letter.termination) {
    const t = letter.termination;
    addParagraph(`Alasan Pengakhiran Hubungan Kerja: ${t.terminationReason}`, true);
    addParagraph(`Tanggal Efektif Berakhir: ${formatIndonesianDate(t.effectiveDate)} (Hari Kerja Terakhir: ${formatIndonesianDate(t.lastWorkingDay)})`);
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX, bottom: 20 },
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 2.2 },
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right', cellWidth: 52 } },
      head: [['KOMPONEN PENYELESAIAN HAK FINANSIAL', 'NOMINAL']],
      body: [
        ['Uang Pesangon (UP)', formatRupiah(t.severancePay)],
        ['Uang Penghargaan Masa Kerja (UPMK)', formatRupiah(t.serviceAwardPay)],
        ['Uang Penggantian Hak (UPH)', formatRupiah(t.rightsCompensationPay)],
        ['Uang Kompensasi PKWT (PP 35/2021)', formatRupiah(t.pkwtCompensationPay)],
        ['TOTAL PENYELESAIAN BERSIH', formatRupiah(t.totalSettlement)],
      ],
    });
    y = ((doc as any).lastAutoTable?.finalY || y + 28) + 5;
  }

  if (letter.assignment) {
    const a = letter.assignment;
    addParagraph(`Tujuan Penugasan: ${a.destinationCompanyOrPlace}, ${a.destinationCity}`, true);
    addParagraph(`Keperluan / Agenda Tugas: ${a.purposeOfDuty}`);
    addParagraph(`Jadwal Tugas Dinas: ${formatIndonesianDate(a.departureDate)} s/d ${formatIndonesianDate(a.returnDate)}`);
    addParagraph(`Transportasi & Akomodasi: ${a.transportationType} — ${a.accommodation}`);
    if (a.dailyAllowance > 0) {
      addParagraph(`Uang Saku / Plafon Harian Dinas: ${formatRupiah(a.dailyAllowance)} / hari`);
    }
    if (a.specialInstructions) {
      addParagraph(`Instruksi Khusus: ${a.specialInstructions}`);
    }
  }

  if (letter.customNotes) {
    addParagraph(`Catatan Tambahan: ${letter.customNotes}`);
  }

  // Tanda Tangan Terproteksi
  ensureSpace(46);
  y = Math.max(y + 6, 208);
  if (y + 42 > bottomLimitY) {
    doc.addPage();
    y = 28;
  }

  const sigX = pageWidth - marginX - 36;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(30, 41, 59);
  doc.text(`${letter.issuingCity}, ${formatIndonesianDate(letter.issuingDate)}`, sigX, y, { align: 'center' });
  y += 4.8;
  doc.setFont('helvetica', 'bold');
  doc.text(companyHeader, sigX, y, { align: 'center', maxWidth: 74 });
  y += 22;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(letter.signatoryName, sigX, y, { align: 'center' });
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(sigX - 26, y + 1.2, sigX + 26, y + 1.2);
  y += 4.6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(letter.signatoryTitle, sigX, y, { align: 'center' });

  applyA4RunningChrome(doc, {
    leftFooterText: `Naskah Dinas Resmi • No: ${letter.letterNumber} • ${letter.employee.fullName}`,
    runningHeaderLeft: `${companyHeader} — ${letter.letterNumber}`,
    runningHeaderRight: letter.employee.fullName,
    marginX,
    skipHeaderOnFirstPage: true,
  });

  return new Uint8Array(doc.output('arraybuffer'));
}
