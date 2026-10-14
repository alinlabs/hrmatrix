/**
 * Helper utilitas tanggal dinamis untuk generator data sampel HRMatrix.
 * Menghasilkan tanggal relatif terhadap hari ini agar data dummy selalu relevan dan segar.
 */

export function getRelativeDateStr(offsetDays: number, baseDate = new Date()): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function getRelativeISO(offsetDays: number, timeStr = '08:00:00.000Z', baseDate = new Date()): string {
  const dateStr = getRelativeDateStr(offsetDays, baseDate);
  return `${dateStr}T${timeStr}`;
}

export function getMondayAnchorDateStr(baseDate = new Date()): string {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = (day === 0 ? -6 : 1 - day) - 14; // Mundur 2 pekan ke hari Senin
  d.setDate(d.getDate() + diffToMonday);
  return d.toISOString().split('T')[0];
}

export function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}
