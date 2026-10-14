import { PayrollRule } from '../../types';
import { masterPajak } from '../master/pajak';

/**
 * SAMPLE DATABASE: PRESET & MASTER PERPAJAKAN PPH 21 (TER & PASAL 17)
 * 
 * Mencakup seluruh preset perpajakan penghasilan pasal 21 Republik Indonesia:
 * - PPh 21 TER (Tarif Efektif Rata-Rata Bulanan PP 58/2023 & PMK 168/2023)
 *   - TER Kategori A (TK/0, TK/1, K/0)
 *   - TER Kategori B (TK/2, TK/3, K/1, K/2)
 *   - TER Kategori C (K/3)
 * - PPh 21 Tarif Progresif Pasal 17 UU HPP (Masa Pajak Terakhir / Tahunan)
 *   - Lapisan I: s/d Rp 60 Juta (5%)
 *   - Lapisan II: > Rp 60 Jt s/d Rp 250 Jt (15%)
 *   - Lapisan III: > Rp 250 Jt s/d Rp 500 Jt (25%)
 *   - Lapisan IV: > Rp 500 Jt s/d Rp 5 Miliar (30%)
 *   - Lapisan V: > Rp 5 Miliar (35%)
 */
export const sampleKompensasiPajak: PayrollRule[] = [...masterPajak];

export default sampleKompensasiPajak;
