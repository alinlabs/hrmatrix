import { v4 as uuidv4 } from 'uuid';
import { Employee, EmployeeDocument } from '../../types';
import { DEFAULT_EMPLOYEE_DOCUMENTS } from './constants';

export const formatDateDisplay = (dateStr?: string) => {
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

export const formatFullAddress = (emp: Employee) => {
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
