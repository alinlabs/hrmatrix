import { Employee, EmployeeDocument } from '../../types';
import { getPositionName, getDepartmentName } from '../../services/positionService';

export const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(m, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(d, 10)} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const formatBirthDateDisplay = formatDateDisplay;

export const formatFullAddress = (emp: Partial<Employee>): string => {
  const parts = [
    emp.address,
    (emp.rt || emp.rw) ? `RT ${emp.rt || '-'}/RW ${emp.rw || '-'}` : '',
    emp.village ? `Kel. ${emp.village}` : '',
    emp.district ? `Kec. ${emp.district}` : '',
    emp.city,
    emp.province,
    emp.postalCode
  ];
  return parts.filter(p => p && p.trim() !== '').join(', ') || '-';
};

export const getInitialDefaultDocs = (): EmployeeDocument[] => {
  return [];
};

export const formatIdr = (val: number): string => {
  return new Intl.NumberFormat('id-ID').format(val);
};

export const exportEmployeesToCSV = (employees: Employee[]) => {
  if (!employees || employees.length === 0) return;

  const headers = [
    'ID Karyawan',
    'Nama Lengkap',
    'NIK',
    'Posisi',
    'Departemen',
    'Divisi',
    'Level',
    'Status Kerja',
    'Tipe Karyawan',
    'Tanggal Masuk',
    'Gaji Pokok',
    'Metode Pembayaran',
    'Nama Bank',
    'Nomor Rekening',
    'Pemilik Rekening',
    'Email',
    'Nomor Telepon',
    'Alamat',
    'Status PTKP',
    'NPWP',
    'BPJS Kesehatan',
    'BPJS Ketenagakerjaan'
  ];

  const rows = employees.map(emp => [
    `"${emp.employeeId || ''}"`,
    `"${emp.fullName || ''}"`,
    `"${emp.nik || ''}"`,
    `"${getPositionName(emp.positionId) || emp.positionId || ''}"`,
    `"${getDepartmentName(emp.departmentId, emp.positionId) || emp.departmentId || ''}"`,
    `"${emp.division || ''}"`,
    `"${emp.level || ''}"`,
    `"${emp.status || ''}"`,
    `"${emp.employeeType || emp.contractType || ''}"`,
    `"${emp.joinDate || ''}"`,
    emp.basicSalary || 0,
    `"${emp.paymentMethod || ''}"`,
    `"${emp.bankName || ''}"`,
    `"${emp.bankAccount || ''}"`,
    `"${emp.bankAccountHolder || ''}"`,
    `"${emp.email || ''}"`,
    `"${emp.phone || ''}"`,
    `"${formatFullAddress(emp)}"`,
    `"${emp.taxProfile?.ptkpStatus || emp.taxStatus || ''}"`,
    `"${emp.taxProfile?.npwp || emp.npwp || ''}"`,
    `"${emp.bpjsKesehatanProfile?.participantNumber || emp.bpjsKesehatan || ''}"`,
    `"${emp.bpjsKetenagakerjaanProfile?.kpjNumber || emp.bpjsKetenagakerjaan || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `data_karyawan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
