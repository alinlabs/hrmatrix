import { WorkShift } from '../../types';
import { RotationTemplate } from './types';

interface BuildRotationTemplatesParams {
  regularShift?: WorkShift;
  nonOffShifts: WorkShift[];
  pagiShift?: WorkShift;
  siangShift?: WorkShift;
  malamShift?: WorkShift;
  fallbackRegularId?: string;
  includeExtendedWeeklyBlocks?: boolean;
}

export function buildRotationTemplates({
  regularShift,
  nonOffShifts,
  pagiShift,
  siangShift,
  malamShift,
  fallbackRegularId,
  includeExtendedWeeklyBlocks = true,
}: BuildRotationTemplatesParams): RotationTemplate[] {
  const regId = regularShift?.id || nonOffShifts[0]?.id || fallbackRegularId;
  const off = 'OFF';
  const templates: RotationTemplate[] = [];

  // Template 1 & 2: Pola Jam Kerja Kantor (Non-Shift Standar)
  if (regId) {
    templates.push(
      {
        id: 'office-5-2',
        group: 'Pola Jam Kantor (Non-Shift)',
        name: 'Pola Jam Kantor 5 Hari (Senin - Jumat)',
        label: 'Kantor 5 Hari Kerja (5 Kerja + 2 Libur)',
        days: 7,
        description: '5 hari kerja kantor normal (Senin-Jumat) diikuti 2 hari libur akhir pekan (Sabtu-Minggu)',
        cycle: [regId, regId, regId, regId, regId, off, off],
      },
      {
        id: 'office-6-1',
        group: 'Pola Jam Kantor (Non-Shift)',
        name: 'Pola Jam Kantor 6 Hari (Senin - Sabtu)',
        label: 'Kantor 6 Hari Kerja (6 Kerja + 1 Libur)',
        days: 7,
        description: '6 hari kerja kantor normal (Senin-Sabtu) diikuti 1 hari libur akhir pekan (Minggu)',
        cycle: [regId, regId, regId, regId, regId, regId, off],
      }
    );
  }

  // Template 3+: Pola Operasional Rotasi Shift
  if (pagiShift && siangShift && malamShift) {
    const p = pagiShift.id;
    const s = siangShift.id;
    const m = malamShift.id;

    templates.push(
      {
        id: '4-regu-3-shift',
        group: 'Mekanisme Operasional 24 Jam',
        name: 'Pola 4 Regu 3 Shift (2P-2S-2M-2OFF)',
        label: '4 Regu 3 Shift Standar (8 Hari)',
        days: 8,
        description: '2 Pagi, 2 Siang, 2 Malam, 2 Libur (Siklus rotasi 8 hari standar industri 24 jam)',
        cycle: [p, p, s, s, m, m, off, off],
      },
      {
        id: '2-shift-1-off',
        group: 'Mekanisme Operasional 2 Shift',
        name: 'Pola Rotasi 2 Shift 1 Off (2P-2S-1OFF)',
        label: 'Rotasi 2 Shift (5 Hari)',
        days: 5,
        description: '2 Pagi, 2 Siang, 1 Libur (Siklus 5 hari untuk Helpdesk / Support)',
        cycle: [p, p, s, s, off],
      },
      {
        id: '3-1-cepat',
        group: 'Mekanisme 3 Hari Kerja',
        name: 'Pola Rotasi Cepat 3-1',
        label: 'Rotasi Cepat (Pagi, Siang, Malam, Libur)',
        days: 4,
        description: '3 hari kerja bergantian (P-S-M) diikuti 1 hari libur (Siklus 4 hari)',
        cycle: [p, s, m, off],
      },
      {
        id: '3-1-blok',
        group: 'Mekanisme 3 Hari Kerja',
        name: 'Pola Rotasi Blok 3-1',
        label: 'Rotasi Blok 3 Hari (3P-Off, 3S-Off, 3M-Off)',
        days: 12,
        description: '3 Pagi + 1 Libur, 3 Siang + 1 Libur, 3 Malam + 1 Libur (Siklus 12 hari)',
        cycle: [p, p, p, off, s, s, s, off, m, m, m, off],
      },
      {
        id: '6-1-ganti',
        group: 'Mekanisme 6 Hari Kerja',
        name: 'Pola Rotasi Bergantian 6-1',
        label: 'Rotasi Bergantian (P-S-M-P-S-M, Libur)',
        days: 7,
        description: '6 hari kerja rolling (P-S-M-P-S-M) diikuti 1 hari libur (Siklus 7 hari)',
        cycle: [p, s, m, p, s, m, off],
      }
    );

    if (includeExtendedWeeklyBlocks) {
      templates.push(
        {
          id: '6-1-blok',
          group: 'Mekanisme 6 Hari Kerja',
          name: 'Pola Rotasi Blok Mingguan 6-1',
          label: 'Rotasi Blok Mingguan (6P-Off, 6S-Off, 6M-Off)',
          days: 21,
          description: '6 Pagi + 1 Libur, 6 Siang + 1 Libur, 6 Malam + 1 Libur (Siklus 21 hari)',
          cycle: [
            p, p, p, p, p, p, off,
            s, s, s, s, s, s, off,
            m, m, m, m, m, m, off,
          ],
        },
        {
          id: '5-2-ganti',
          group: 'Mekanisme 5 Hari Kerja',
          name: 'Pola Rotasi Bergantian Berkelanjutan 5-2',
          label: 'Rotasi Bergantian Berkelanjutan (5 Kerja, 2 Libur)',
          days: 21,
          description: '5 hari rolling kerja, 2 libur, lalu berlanjut dari shift terakhir (Siklus 21 hari)',
          cycle: [
            p, s, m, p, s, off, off,
            m, p, s, m, p, off, off,
            s, m, p, s, m, off, off,
          ],
        },
        {
          id: '5-2-blok',
          group: 'Mekanisme 5 Hari Kerja',
          name: 'Pola Rotasi Blok Mingguan 5-2',
          label: 'Rotasi Blok Mingguan (5P-2Off, 5S-2Off, 5M-2Off)',
          days: 21,
          description: '5 Pagi + 2 Libur, 5 Siang + 2 Libur, 5 Malam + 2 Libur (Siklus 21 hari)',
          cycle: [
            p, p, p, p, p, off, off,
            s, s, s, s, s, off, off,
            m, m, m, m, m, off, off,
          ],
        }
      );
    }
  }

  return templates;
}
