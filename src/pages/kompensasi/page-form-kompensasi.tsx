import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../../db/database';
import { FormJaminanSosial } from './form-jaminan-sosial';
import { FormPajak } from './form-pajak';
import { FormTunjangan } from './form-tunjangan';

export function PageFormKompensasi() {
  const { id, type } = useParams<{ id?: string; type?: string }>();
  const [searchParams] = useSearchParams();

  const [determinedType, setDeterminedType] = useState<'jaminan' | 'tunjangan' | 'pajak' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Direct url parameter /add/:type
    if (type) {
      const t = type.toLowerCase();
      if (t === 'jaminan' || t === 'bpjs') {
        setDeterminedType('jaminan');
        setIsLoading(false);
        return;
      }
      if (t === 'tunjangan' || t === 'allowance') {
        setDeterminedType('tunjangan');
        setIsLoading(false);
        return;
      }
      if (t === 'pajak' || t === 'tax') {
        setDeterminedType('pajak');
        setIsLoading(false);
        return;
      }
    }

    // 2. Query parameter ?category= or ?type=
    const catParam = searchParams.get('category') || searchParams.get('type');
    if (catParam) {
      const c = catParam.toLowerCase();
      if (c.includes('bpjs') || c.includes('jaminan') || c.includes('health') || c.includes('employment')) {
        setDeterminedType('jaminan');
        setIsLoading(false);
        return;
      }
      if (c.includes('tax') || c.includes('pajak')) {
        setDeterminedType('pajak');
        setIsLoading(false);
        return;
      }
      if (c.includes('allowance') || c.includes('tunjangan')) {
        setDeterminedType('tunjangan');
        setIsLoading(false);
        return;
      }
    }

    // 3. Edit mode with ID
    if (id) {
      db.payrollRules.get(id).then(rule => {
        if (rule) {
          if (rule.category === 'BPJS Health' || rule.category === 'BPJS Employment') {
            setDeterminedType('jaminan');
          } else if (rule.category === 'Tax') {
            setDeterminedType('pajak');
          } else {
            setDeterminedType('tunjangan');
          }
        } else {
          setDeterminedType('tunjangan');
        }
        setIsLoading(false);
      }).catch(err => {
        console.error('Error fetching rule by id:', err);
        setDeterminedType('tunjangan');
        setIsLoading(false);
      });
      return;
    }

    // Default
    setDeterminedType('tunjangan');
    setIsLoading(false);
  }, [id, type, searchParams]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm space-y-3">
        <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Memuat formulir kompensasi...</p>
      </div>
    );
  }

  if (determinedType === 'jaminan') {
    return <FormJaminanSosial />;
  }

  if (determinedType === 'pajak') {
    return <FormPajak />;
  }

  return <FormTunjangan />;
}
