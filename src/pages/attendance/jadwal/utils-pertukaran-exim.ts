import { ShiftSwap, Employee } from '../../../types';
import { formatTanggalIndo, getJenisPengajuanLabel } from './utils-pertukaran-helper';

export function exportShiftSwapsToCSV(
  swaps: ShiftSwap[],
  empMap: Map<string, Employee>
): string {
  const headers = [
    'No',
    'Inisiator',
    'Jenis Pengajuan',
    'Karyawan Pemohon',
    'NIK Pemohon',
    'Tanggal Shift Awal',
    'Shift Awal',
    'Karyawan Pengganti / Info',
    'Tanggal Shift Pengganti',
    'Shift Pengganti',
    'Keterangan'
  ];

  const rows = swaps.map((swap, index) => {
    const reqEmp = empMap.get(swap.requesterEmployeeId);
    const targetEmp = swap.targetEmployeeId ? empMap.get(swap.targetEmployeeId) : null;
    const reqName = reqEmp?.fullName || swap.requesterEmployeeId;
    const reqNik = reqEmp?.employeeId || '-';
    const targetName = targetEmp?.fullName || swap.targetEmployeeId || '-';
    const initiatorText = swap.initiator === 'Company' ? 'Perusahaan' : 'Karyawan';
    const jenisText = getJenisPengajuanLabel(swap.swapType);

    return [
      index + 1,
      `"${initiatorText}"`,
      `"${jenisText}"`,
      `"${reqName}"`,
      `"${reqNik}"`,
      `"${swap.requesterDate || '-'}"`,
      `"${swap.requesterShiftId || '-'}"`,
      `"${targetName}"`,
      `"${swap.targetDate || swap.requesterDate || '-'}"`,
      `"${swap.targetShiftId || '-'}"`,
      `"${(swap.reason || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(content: string, filename = 'riwayat-pertukaran-shift.csv') {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
