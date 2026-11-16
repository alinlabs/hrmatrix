import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Company, PayrollPeriod } from '../types';
import { ExtendedPayrollRecord } from '../pages/payroll/types';
import { createPdfArtifact, GeneratedPdfArtifact } from './pdf-single-source';
import { getDepartmentName, getPositionName } from '../services/position-service';

function formatIdr(value: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(value || 0))}`;
}

export async function buildPayslipPdfArtifact(
  record: ExtendedPayrollRecord,
  period: PayrollPeriod,
  company?: Company | null
): Promise<GeneratedPdfArtifact> {
  const emp = record.employee;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const companyName = company?.name || 'Perusahaan';
  const companyAddress = [company?.address, company?.city, company?.provinsi]
    .filter(Boolean)
    .join(', ');
  const periodTitle = period.name || `${period.month} ${period.year}`;

  // Header Band
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(companyName.toUpperCase(), 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  if (companyAddress) {
    doc.text(companyAddress.slice(0, 95), 14, 20);
  }
  if (company?.phone || company?.email) {
    doc.text(
      [company?.phone, company?.email].filter(Boolean).join('  •  '),
      14,
      25
    );
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('SLIP GAJI', 196, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(147, 197, 253);
  doc.text(periodTitle, 196, 20, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`${period.startDate} s/d ${period.endDate}`, 196, 25, { align: 'right' });

  // Employee Identity Grid
  const deptName =
    record.departmentName ||
    getDepartmentName(emp?.departmentId, emp?.positionId) ||
    '-';
  const posName =
    record.positionName || getPositionName(emp?.positionId) || '-';

  autoTable(doc, {
    startY: 38,
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 34, textColor: [100, 116, 139] },
      1: { cellWidth: 62 },
      2: { fontStyle: 'bold', cellWidth: 34, textColor: [100, 116, 139] },
      3: { cellWidth: 52 },
    },
    body: [
      ['Nama Karyawan', emp?.fullName || '-', 'ID Karyawan', emp?.employeeId || '-'],
      ['Jabatan', posName, 'Departemen', deptName],
      ['Status Pajak', emp?.taxProfile?.ptkpStatus || emp?.taxStatus || 'TK/0', 'Status Kerja', emp?.employeeType || emp?.contractType || 'Permanent'],
      ['Bank Transfer', emp?.bankName || '-', 'No. Rekening', emp?.bankAccount || '-'],
    ],
  });

  const afterIdentityY = (doc as any).lastAutoTable?.finalY || 68;

  // Earnings Breakdown
  const earningsRows: [string, string][] = [
    ['Gaji Pokok', formatIdr(record.basicSalary)],
  ];

  if (Array.isArray(record.allowancesBreakdown) && record.allowancesBreakdown.length > 0) {
    record.allowancesBreakdown.forEach((item) => {
      if ((item.amount || 0) !== 0) {
        earningsRows.push([item.name, formatIdr(item.amount)]);
      }
    });
  } else {
    if ((record.fixedAllowance || 0) > 0) {
      earningsRows.push(['Tunjangan Tetap', formatIdr(record.fixedAllowance)]);
    }
    if ((record.variableAllowance || 0) > 0) {
      earningsRows.push(['Tunjangan Tidak Tetap', formatIdr(record.variableAllowance)]);
    }
  }

  if ((record.overtime || 0) > 0) {
    earningsRows.push(['Upah Lembur', formatIdr(record.overtime)]);
  }
  if ((record.bonus || 0) > 0) {
    earningsRows.push(['Bonus & Insentif', formatIdr(record.bonus)]);
  }
  if ((record.commission || 0) > 0) {
    earningsRows.push(['Komisi', formatIdr(record.commission)]);
  }
  if ((record.otherIncome || 0) > 0) {
    earningsRows.push(['Pendapatan Lainnya', formatIdr(record.otherIncome)]);
  }
  earningsRows.push(['TOTAL PENDAPATAN KOTOR (GROSS)', formatIdr(record.grossSalary)]);

  autoTable(doc, {
    startY: afterIdentityY + 4,
    head: [['RINCIAN PENERIMAAN', 'NOMINAL']],
    body: earningsRows,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      1: { halign: 'right', cellWidth: 50 },
    },
    didParseCell: (data) => {
      if (data.row.index === earningsRows.length - 1 && data.section === 'body') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [239, 246, 255];
      }
    },
  });

  const afterEarningsY = (doc as any).lastAutoTable?.finalY || 125;

  // Deductions Breakdown
  const deductionRows: [string, string][] = [];
  if (Array.isArray(record.deductionsBreakdown) && record.deductionsBreakdown.length > 0) {
    record.deductionsBreakdown.forEach((item) => {
      if ((item.amount || 0) !== 0) {
        deductionRows.push([item.name, formatIdr(item.amount)]);
      }
    });
  } else {
    if ((record.bpjs || 0) > 0) deductionRows.push(['Iuran BPJS Karyawan', formatIdr(record.bpjs)]);
    if ((record.tax || 0) > 0) deductionRows.push(['PPh 21', formatIdr(record.tax)]);
    if ((record.lateDeduction || 0) > 0) deductionRows.push(['Potongan Terlambat', formatIdr(record.lateDeduction)]);
    if ((record.absenceDeduction || 0) > 0) deductionRows.push(['Potongan Ketidakhadiran', formatIdr(record.absenceDeduction)]);
    if ((record.loan || 0) > 0) deductionRows.push(['Cicilan Pinjaman', formatIdr(record.loan)]);
    if ((record.advance || 0) > 0) deductionRows.push(['Kasbon', formatIdr(record.advance)]);
    if ((record.otherDeduction || 0) > 0) deductionRows.push(['Potongan Lainnya', formatIdr(record.otherDeduction)]);
  }
  if (deductionRows.length === 0) {
    deductionRows.push(['Tidak ada potongan', formatIdr(0)]);
  }
  deductionRows.push(['TOTAL POTONGAN', formatIdr(record.totalDeduction)]);

  autoTable(doc, {
    startY: afterEarningsY + 6,
    head: [['RINCIAN POTONGAN', 'NOMINAL']],
    body: deductionRows,
    theme: 'grid',
    headStyles: { fillColor: [225, 29, 72], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      1: { halign: 'right', cellWidth: 50 },
    },
    didParseCell: (data) => {
      if (data.row.index === deductionRows.length - 1 && data.section === 'body') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [255, 241, 242];
      }
    },
  });

  const afterDeductionsY = (doc as any).lastAutoTable?.finalY || 180;

  // Net Salary Box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(14, afterDeductionsY + 8, 182, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70);
  doc.text('TAKE HOME PAY (GAJI BERSIH DITERIMA)', 18, afterDeductionsY + 18);

  doc.setFontSize(13);
  doc.setTextColor(4, 120, 87);
  doc.text(formatIdr(record.netSalary), 192, afterDeductionsY + 18, { align: 'right' });

  // Attendance & Signature Footer
  const footerY = Math.min(258, afterDeductionsY + 34);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Ringkasan Kehadiran: Hadir ${record.attendanceDays ?? 0} hari  |  Cuti ${record.leaveDays ?? 0} hari  |  Sakit ${record.sickDays ?? 0} hari  |  Alpa ${record.absentDays ?? 0} hari  |  Lembur ${record.overtimeHours ?? 0} jam`,
    14,
    footerY
  );

  doc.setTextColor(51, 65, 85);
  doc.text('Dokumen slip gaji ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah.', 14, footerY + 7);

  const rawBytes = doc.output('arraybuffer');
  const safeName = (emp?.fullName || 'Karyawan').replace(/[^a-zA-Z0-9_-]+/g, '_');
  const safePeriod = periodTitle.replace(/[^a-zA-Z0-9_-]+/g, '_');

  return createPdfArtifact(
    new Uint8Array(rawBytes),
    `Slip_Gaji_${safeName}_${safePeriod}.pdf`,
    `Slip Gaji ${emp?.fullName || ''} - ${periodTitle}`
  );
}
