import React from 'react';
import { PayrollRule } from '../../types';
import { ModalBpjsDetail } from './modal-bpjs-detail';
import { ModalTunjanganDetail } from './modal-tunjangan-detail';
import { ModalPajakDetail } from './modal-pajak-detail';
import { ModalRuleDetailProps } from './types';

/**
 * Orchestrator Modal Detail Kompensasi:
 * Meneruskan ke modal detail atomik sesuai kategori aturan
 * (BPJS Kesehatan & Ketenagakerjaan, Tunjangan & Bonus, atau Pajak PPh 21)
 */
export const ModalRuleDetail: React.FC<ModalRuleDetailProps> = (props) => {
  const { rule, isOpen } = props;
  if (!isOpen || !rule) return null;

  if (rule.category === 'Tax') {
    return <ModalPajakDetail {...props} />;
  }

  if (rule.category === 'Allowance' || rule.category === 'Deduction') {
    return <ModalTunjanganDetail {...props} />;
  }

  // Default: BPJS Health, BPJS Employment, or general Jaminan Sosial
  return <ModalBpjsDetail {...props} />;
};

export { ModalBpjsDetail, ModalTunjanganDetail, ModalPajakDetail };
