import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PayrollRecord, Employee, PayrollPeriod, Company } from '../types';
import {
  GeneratedPdfArtifact,
  createPdfArtifactFromJsPdf,
  downloadPdfArtifact
} from './pdfSingleSource';

export type EnrichedPayrollRecord = PayrollRecord & {
  employee?: Employee;
  departmentName?: string;
  positionName?: string;
};

/**
 * Fungsi murni (Single Source of Truth) untuk menyusun dokumen jsPDF Slip Gaji Karyawan.
 * Digunakan bersama oleh Modal Preview, Download PDF, dan Print PDF.
 */
export const createPayslipJsPdf = (
  record: EnrichedPayrollRecord,
  period: PayrollPeriod,
  company?: Company
): jsPDF | null => {
  if (!record || !record.employee) return null;
  const employee = record.employee;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 15;

  // Formatting helpers
  const formatRupiah = (amount?: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatFullAddress = (emp: Employee) => {
    const parts = [
      emp.address,
      emp.rt || emp.rw ? `RT ${emp.rt || '-'}/RW ${emp.rw || '-'}` : '',
      emp.village ? `Kel. ${emp.village}` : '',
      emp.district ? `Kec. ${emp.district}` : '',
      emp.city,
      emp.province,
      emp.postalCode
    ];
    return parts.filter(p => p && p.trim() !== '').join(', ') || '-';
  };

  // 1. Header (Company Info)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text((company?.name || 'PERUSAHAAN HRMATRIX').toUpperCase(), 15, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const compAddr = `${company?.address || 'Jakarta, Indonesia'} | ${company?.email || 'hr@company.com'}`;
  const compAddrLines = doc.splitTextToSize(compAddr, pageWidth - 85);
  doc.text(compAddrLines[0] || compAddr, 15, yPos + 5.5);

  // Right Side Header (Slip Title)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 64, 175); // Blue
  doc.text('SLIP GAJI KARYAWAN', pageWidth - 15, yPos, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Periode: ${period.name || `${period.month} ${period.year}`}`,
    pageWidth - 15,
    yPos + 5.5,
    { align: 'right' }
  );

  // Draw a horizontal line
  yPos += 11;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 7;

  // 2. Employee Details
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  const col1X = 15;
  const col1ValX = 48;
  const col2X = pageWidth / 2 + 4;
  const col2ValX = pageWidth / 2 + 42;

  const leftDetails = [
    ['Nama Karyawan', ':', employee.fullName || '-'],
    ['ID / NIK', ':', `${employee.employeeId || '-'} / ${employee.nik || '-'}`],
    [
      'Jabatan / Bagian',
      ':',
      `${record.positionName || employee.level || '-'} (${record.departmentName || '-'})`
    ],
    ['Alamat', ':', formatFullAddress(employee)]
  ];

  let bankAccountHolder = employee.bankAccountHolder || '';
  if (bankAccountHolder.trim().toLowerCase() === (employee.fullName || '').trim().toLowerCase()) {
    bankAccountHolder = '';
  }

  const rightDetails = [
    ['Status PTKP / NPWP', ':', `${employee.taxStatus || 'TK/0'} | ${employee.npwp || 'Non-NPWP'}`],
    ['Kepesertaan BPJS', ':', employee.bpjsHealthParticipant || 'PPU'],
    ['Rekening Bank', ':', `${employee.paymentMethod || 'Transfer'} • ${employee.bankName || 'BCA'}`],
    [
      'No. Rekening',
      ':',
      `${employee.bankAccount || '-'}${bankAccountHolder ? ` (a/n ${bankAccountHolder})` : ''}`
    ]
  ];

  doc.setFont('helvetica', 'normal');
  for (let i = 0; i < leftDetails.length; i++) {
    doc.setTextColor(100, 116, 139);
    doc.text(leftDetails[i][0], col1X, yPos);
    doc.text(leftDetails[i][1], col1ValX - 2, yPos);

    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42);
    const valLines = doc.splitTextToSize(leftDetails[i][2], pageWidth / 2 - col1ValX - 4);
    doc.text(valLines, col1ValX, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(rightDetails[i][0], col2X, yPos);
    doc.text(rightDetails[i][1], col2ValX - 2, yPos);

    doc.setTextColor(15, 23, 42);
    const rightValLines = doc.splitTextToSize(rightDetails[i][2], pageWidth - col2ValX - 15);
    doc.text(rightValLines, col2ValX, yPos);

    yPos += Math.max(valLines.length, rightValLines.length) * 4.8;
  }

  yPos += 4;

  // 3. Allowances & Deductions
  const allowances =
    record.allowancesBreakdown && record.allowancesBreakdown.length > 0
      ? record.allowancesBreakdown
      : [
          { name: 'Tunjangan Tetap / Umum', amount: record.fixedAllowance || 0 },
          { name: 'Uang Lembur (Overtime)', amount: record.overtime || 0 },
          { name: 'Bonus & Insentif', amount: record.bonus || 0 },
          { name: 'Komisi Penjualan', amount: record.commission || 0 },
          { name: 'Pendapatan Lain-lain', amount: record.otherIncome || 0 }
        ];

  const deductions =
    record.deductionsBreakdown && record.deductionsBreakdown.length > 0
      ? record.deductionsBreakdown
      : [
          { name: 'BPJS Kesehatan', amount: record.bpjs ? record.bpjs * 0.25 : 0 },
          { name: 'BPJS Ketenagakerjaan', amount: record.bpjs ? record.bpjs * 0.75 : 0 },
          { name: 'Pajak Penghasilan (PPh 21)', amount: record.tax || 0 },
          { name: 'Potongan Ketidakhadiran', amount: record.absenceDeduction || 0 },
          { name: 'Potongan Keterlambatan', amount: record.lateDeduction || 0 },
          { name: 'Potongan Kasbon / Pinjaman', amount: record.loan || 0 },
          { name: 'Potongan Lain-lain', amount: record.otherDeduction || 0 }
        ];

  const tableData: any[] = [];
  const allAllowances = [
    { name: 'Gaji Pokok (Basic Salary)', amount: record.basicSalary || 0 },
    ...allowances
  ];
  const maxRows = Math.max(allAllowances.length, deductions.length);

  for (let i = 0; i < maxRows; i++) {
    const allowance = allAllowances[i];
    const deduction = deductions[i];

    tableData.push([
      allowance ? allowance.name : '',
      allowance ? formatRupiah(allowance.amount) : '',
      deduction ? deduction.name : '',
      deduction ? formatRupiah(deduction.amount) : ''
    ]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [['PENGHASILAN / TUNJANGAN', 'JUMLAH (Rp)', 'PEMOTONGAN', 'JUMLAH (Rp)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 8.5
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 35, halign: 'right', fontStyle: 'bold', textColor: [4, 120, 87] },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold', textColor: [220, 38, 38] }
    },
    didParseCell: data => {
      if (data.section === 'body') {
        if (
          data.column.index === 1 &&
          (!data.cell.raw || data.cell.raw === 'Rp\u00a00' || data.cell.raw === 'Rp 0' || data.cell.raw === 'Rp0')
        ) {
          data.cell.styles.textColor = [148, 163, 184];
          data.cell.styles.fontStyle = 'normal';
        }
        if (
          data.column.index === 3 &&
          (!data.cell.raw || data.cell.raw === 'Rp\u00a00' || data.cell.raw === 'Rp 0' || data.cell.raw === 'Rp0')
        ) {
          data.cell.styles.textColor = [148, 163, 184];
          data.cell.styles.fontStyle = 'normal';
        }
      }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 2;

  // Totals Row
  autoTable(doc, {
    startY: yPos,
    body: [
      [
        'TOTAL PENGHASILAN BRUTO',
        formatRupiah(record.grossSalary),
        'TOTAL PEMOTONGAN',
        formatRupiah(record.totalDeduction)
      ]
    ],
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 3.5,
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42]
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { cellWidth: 35, halign: 'right', textColor: [4, 120, 87] },
      2: { cellWidth: 'auto', halign: 'left' },
      3: { cellWidth: 35, halign: 'right', textColor: [220, 38, 38] }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 8;

  // 4. Net Salary (Take Home Pay) Section
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(15, yPos, pageWidth - 30, 20, 2.5, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GAJI BERSIH DITERIMA (TAKE HOME PAY)', 20, yPos + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Total Penghasilan Bruto dikurangi Total Pemotongan', 20, yPos + 14);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(formatRupiah(record.netSalary), pageWidth - 20, yPos + 12.5, { align: 'right' });

  yPos += 32;

  // 5. Signatures
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);

  doc.setFont('helvetica', 'normal');
  doc.text('Penerima (Karyawan),', 40, yPos, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(employee.fullName || '-', 40, yPos + 20, { align: 'center' });
  doc.setLineWidth(0.3);
  doc.line(18, yPos + 21, 62, yPos + 21);

  doc.setFont('helvetica', 'normal');
  doc.text('Finance & HR Manager,', pageWidth - 40, yPos, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(company?.name || 'HR & Payroll Dept.', pageWidth - 40, yPos + 20, { align: 'center' });
  doc.line(pageWidth - 62, yPos + 21, pageWidth - 18, yPos + 21);

  // Footer text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Slip gaji ini diterbitkan secara otomatis oleh sistem HRMatrix Indonesia. Dokumen sah dan rahasia.',
    pageWidth / 2,
    yPos + 33,
    { align: 'center' }
  );

  return doc;
};

/**
 * Membangun objek Single Source of Truth `GeneratedPdfArtifact` untuk Slip Gaji.
 */
export const buildPayslipPdfArtifact = async (
  record: EnrichedPayrollRecord,
  period: PayrollPeriod,
  company?: Company
): Promise<GeneratedPdfArtifact | null> => {
  const pdf = createPayslipJsPdf(record, period, company);
  if (!pdf || !record.employee) return null;

  const rawFilename = `Slip_Gaji_${(record.employee.fullName || 'Karyawan').replace(/\s+/g, '_')}_${period.month}_${period.year}.pdf`;
  return createPdfArtifactFromJsPdf(pdf, rawFilename);
};

/**
 * Fungsi unduh langsung (backward-compatible) yang menggunakan generator PDF yang sama.
 */
export const generatePayslipPdf = async (
  record: EnrichedPayrollRecord,
  period: PayrollPeriod,
  company?: Company
) => {
  const artifact = await buildPayslipPdfArtifact(record, period, company);
  if (artifact) {
    downloadPdfArtifact(artifact);
  }
};
