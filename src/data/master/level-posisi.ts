/**
 * Standar Level Jabatan (Job Levels)
 * Sumber acuan global untuk standardisasi jenjang karir dan tingkatan posisi.
 * Berisi nama-nama level baku (string) tanpa ID agar seragam di seluruh form dan template.
 */

export const JOB_LEVELS = [
  'Magang / Internship',
  'Supporting / Pelaksana',
  'Staff',
  'Senior Staff',
  'Specialist',
  'Specialist / Senior Staff',
  'Team Lead',
  'Supervisor',
  'Assistant Manager',
  'Manager',
  'Senior Manager',
  'General Manager',
  'Director',
  'C-Level / Director',
  'C-Level / Executive',
  'Komisaris / Board of Commissioners'
] as const;

export type JobLevel = (typeof JOB_LEVELS)[number] | string;

/**
 * Pengelompokan level jabatan untuk kebutuhan filter atau navigasi hierarki
 */
export const JOB_LEVEL_GROUPS = {
  entry: ['Magang / Internship', 'Supporting / Pelaksana'],
  staff: ['Staff', 'Senior Staff', 'Specialist'],
  supervisory: ['Team Lead', 'Supervisor'],
  management: ['Assistant Manager', 'Manager', 'Senior Manager', 'General Manager'],
  executive: ['Director', 'C-Level / Executive', 'Komisaris / Board of Commissioners']
} as const;
