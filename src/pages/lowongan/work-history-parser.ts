import { 
  CandidateWorkExperience, 
  CandidateExperienceSummary, 
  CandidateEducationHistory, 
  CandidateAchievement,
  CandidateCertification,
  CandidateSkillSet,
  CandidateLanguageItem,
  CandidatePotentialAnalysis,
  SoftSkillTrait,
  ExperienceEvaluation, 
  VacancyItem 
} from './types';

/**
 * Month Dictionary for Indonesian and English
 */
const MONTH_MAP: Record<string, number> = {
  jan: 0, januari: 0, january: 0, '01': 0, '1': 0,
  feb: 1, februari: 1, february: 1, '02': 1, '2': 1,
  mar: 2, maret: 2, march: 2, '03': 2, '3': 2,
  apr: 3, april: 3, '04': 3, '4': 3,
  mei: 4, may: 4, '05': 4, '5': 4,
  jun: 5, juni: 5, june: 5, '06': 5, '6': 5,
  jul: 6, juli: 6, july: 6, '07': 6, '7': 6,
  agu: 7, agust: 7, agustus: 7, aug: 7, august: 7, '08': 7, '8': 7,
  sep: 8, sept: 8, september: 8, '09': 8, '9': 8,
  okt: 9, oktober: 9, oct: 9, october: 9, '10': 9,
  nov: 10, nopember: 10, november: 10, '11': 10,
  des: 11, desember: 11, dec: 11, december: 11, '12': 11,
};

const INDO_CITIES = [
  'Jakarta', 'Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara',
  'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Jogja', 'Depok', 'Tangerang', 'Tangerang Selatan',
  'Bekasi', 'Bogor', 'Medan', 'Palembang', 'Makassar', 'Denpasar', 'Bali', 'Batam', 'Malang',
  'Solo', 'Surakarta', 'Cikarang', 'Karawang', 'Remote', 'Hybrid', 'On-site', 'Indonesia'
];

/**
 * Clean & Format Duration string (e.g. "2 Tahun 4 Bulan")
 */
export function formatDuration(totalMonths: number): string {
  if (totalMonths <= 0) return 'Kurang dari 1 bulan';
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `${years} Tahun ${months} Bulan`;
  }
  if (years > 0) {
    return `${years} Tahun`;
  }
  return `${months} Bulan`;
}

/**
 * Extract work experience section from full CV text
 */
function extractExperienceSection(text: string): string {
  if (!text) return '';

  const startRegex = /(?:pengalaman\s+kerja|riwayat\s+pekerjaan|pengalaman\s+profesional|work\s+experience|professional\s+experience|employment\s+history|career\s+history|riwayat\s+karir|pengalaman\s+kerja\s+&\s+organisasi|riwayat\s+kerja|\bpengalaman\b(?!\s+(?:organisasi|sukarela)))\s*[:|-]?/i;
  const startMatch = text.search(startRegex);

  if (startMatch === -1) {
    return text;
  }

  const afterStart = text.slice(startMatch);

  const endRegex = /(?:\n\s*|\s{3,})(?:pendidikan|education|riwayat\s+pendidikan|keahlian|skills|kemampuan|sertifikasi|certifications|organisasi|organization|prestasi|achievements|awards|penghargaan|proyek|projects|bahasa|languages|referensi|references|kontak|contact)\s*[:|-]?/i;
  const endMatch = afterStart.slice(15).search(endRegex);

  if (endMatch !== -1) {
    return afterStart.slice(0, endMatch + 15).trim();
  }

  return afterStart.slice(0, 3000).trim();
}

/**
 * Parse date ranges (e.g. "Januari 2021 - Desember 2023", "2020 - Sekarang", "08/2019 – 05/2022")
 */
export function parseDateRange(periodStr: string): {
  startYear?: number;
  endYear?: number;
  durationMonths: number;
  isCurrent: boolean;
  formattedPeriod: string;
} {
  const currentYear = 2026;
  const currentMonth = 8; // September

  const isCurrent = /sekarang|saat\s*ini|present|current|now|ongoing|aktif/i.test(periodStr);

  let cleanPeriod = periodStr
    .replace(/\(.*?\)/g, '')
    .replace(/[– ]/g, '-')
    .trim();

  const fullRangeRegex = /([a-z0-9]+)\s*[\/.,\s]*\s*(20\d{2}|19\d{2})\s*(?:-|sampai|to|s\/d|hingga)\s*([a-z0-9]+)?\s*[\/.,\s]*\s*(20\d{2}|19\d{2}|sekarang|saat\s*ini|present|current)/i;
  const fullMatch = cleanPeriod.match(fullRangeRegex);

  if (fullMatch) {
    const startMStr = fullMatch[1].toLowerCase();
    const startY = parseInt(fullMatch[2], 10);
    const startM = MONTH_MAP[startMStr] !== undefined ? MONTH_MAP[startMStr] : 0;

    let endY = currentYear;
    let endM = currentMonth;

    if (!/sekarang|saat\s*ini|present|current/i.test(fullMatch[4])) {
      endY = parseInt(fullMatch[4], 10);
      const endMStr = (fullMatch[3] || '').toLowerCase();
      endM = MONTH_MAP[endMStr] !== undefined ? MONTH_MAP[endMStr] : 11;
    }

    const totalM = Math.max(1, (endY - startY) * 12 + (endM - startM) + 1);
    return {
      startYear: startY,
      endYear: endY,
      durationMonths: totalM,
      isCurrent,
      formattedPeriod: cleanPeriod
    };
  }

  const yearOnlyRegex = /(20\d{2}|19\d{2})\s*(?:-|sampai|to|s\/d|hingga)\s*(20\d{2}|19\d{2}|sekarang|saat\s*ini|present|current)/i;
  const yearMatch = cleanPeriod.match(yearOnlyRegex);

  if (yearMatch) {
    const startY = parseInt(yearMatch[1], 10);
    let endY = currentYear;

    if (!/sekarang|saat\s*ini|present|current/i.test(yearMatch[2])) {
      endY = parseInt(yearMatch[2], 10);
    }

    const totalM = Math.max(6, (endY - startY) * 12);
    return {
      startYear: startY,
      endYear: endY,
      durationMonths: totalM,
      isCurrent,
      formattedPeriod: cleanPeriod
    };
  }

  const singleYear = cleanPeriod.match(/\b(20\d{2}|19\d{2})\b/);
  if (singleYear) {
    const y = parseInt(singleYear[1], 10);
    return {
      startYear: y,
      endYear: y,
      durationMonths: 12,
      isCurrent: false,
      formattedPeriod: `${y}`
    };
  }

  return {
    durationMonths: 12,
    isCurrent: false,
    formattedPeriod: periodStr
  };
}

function findLocationInText(text: string): string | undefined {
  for (const city of INDO_CITIES) {
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(text)) {
      if (city.toLowerCase() === 'indonesia' || city.toLowerCase() === 'remote' || city.toLowerCase() === 'hybrid') {
        return city;
      }
      return `${city}, Indonesia`;
    }
  }
  return undefined;
}

/**
 * Parse Work Experiences from text
 */
export function extractWorkExperiences(fullCvText: string): {
  experiences: CandidateWorkExperience[];
  summary: CandidateExperienceSummary;
} {
  // Fix hyphenated labels broken across newlines by PDF extraction
  let cleanedCvText = fullCvText.replace(/\(?\b(?:full|part|on|project)[-\s]*\n\s*(?:time|site|based)\b\)?/gi, '\n');
  
  const sectionText = extractExperienceSection(cleanedCvText);
  const lines = (sectionText || cleanedCvText)
    .split(/\r?\n+/)
    .map(l => l.trim())
    .filter(Boolean);

  const rawEntries: Array<{
    headerLines: string[];
    bulletPoints: string[];
  }> = [];

  let currentEntry: { headerLines: string[]; bulletPoints: string[] } | null = null;

  const dateIndicatorRegex = /(?:20\d{2}|19\d{2})\s*(?:-|sampai|to|s\/d|hingga|–| )\s*(?:20\d{2}|19\d{2}|sekarang|saat\s*ini|present|current)|\b(?:Jan(?:uari|uary)?|Feb(?:ruari|ruary)?|Mar(?:et|ch)?|Apr(?:il)?|Mei|May|Jun(?:i|e)?|Jul(?:i|y)?|Agu(?:stus)?|Aug(?:ust)?|Sep(?:tember)?|Okt(?:ober)?|Oct(?:ober)?|Nov(?:ember)?|Des(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/i;
  
  // Dramatically expanded company indicator
  const companyIndicatorRegex = /\b(?:pt\.?|cv\.?|tbk|inc|ltd|corp|corporation|bank|group|agency|startup|hospital|universitas|yayasan|kementerian|dinas|institusi|lembaga|koperasi|bumn|bumd|rsud|klinik|pabrik|hotel|resort|studio|boutique|school|academy|sekolah)\b|\b(?:shopee|tokopedia|gojek|grab|telkom|indosat|xl|astra|unilever|bca|mandiri|bni|bri|pertamina|pln|alfamart|indomaret|jne|jnt|anteraja|sicepat|ruangguru|traveloka|tiket|bukalapak|dana|ovo|gopay|linkaja|nestle|danone|honda|toyota|yamaha)\b/i;
  
  // Dramatically expanded role indicator
  const roleIndicatorRegex = /\b(?:specialist|officer|staff|staf|manager|manajer|lead|leader|head|supervisor|director|direktur|coordinator|koordinator|consultant|konsultan|analyst|analis|engineer|developer|admin|administrator|intern|internship|magang|asisten|assistant|associate|executive|eksekutif|technician|teknisi|operator|mechanic|mekanik|driver|supir|kurir|courier|sales|marketing|kasir|cashier|waiter|waitress|barista|chef|koki|cook|nurse|perawat|bidan|dokter|doctor|guru|teacher|tutor|dosen|lecturer|writer|penulis|editor|designer|desainer|creator|kreator|animator|illustrator|photographer|fotografer|videographer|programmer|coder|hacker|auditor|accountant|akuntan|teller|cs|customer\s+service|receptionist|resepsionis|sekretaris|secretary|hr|hrd|recruiter)\b/i;

  const descriptionVerbRegex = /^(?:memimpin|mengelola|merancang|mengembangkan|mencapai|melakukan|menyusun|membangun|mengidentifikasi|menjalin|mengoordinasikan|mengarahkan|mendukung|mendokumentasikan|menyajikan|menstandardisasi|bertanggung\s+jawab|membantu|menangani|mengawasi|meningkatkan|menganalisis|membuat|merumuskan|menjalankan|memastikan)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[-•*– \d+.)]\s+/.test(line) || /^[•*-]\s*/.test(line) || descriptionVerbRegex.test(line);
    const hasDate = dateIndicatorRegex.test(line);
    const hasCompany = companyIndicatorRegex.test(line);
    const hasRole = roleIndicatorRegex.test(line);
    const isShort = line.length < 130;

    let isNewEntry = false;
    const hasStrongStart = hasCompany || hasRole || (hasDate && (hasCompany || hasRole));

    if (!isBullet && isShort) {
      if (!currentEntry) {
        isNewEntry = hasStrongStart || hasDate;
      } else {
        if (currentEntry.bulletPoints.length > 0) {
          const nextLineStrong = i + 1 < lines.length && (companyIndicatorRegex.test(lines[i + 1]) || roleIndicatorRegex.test(lines[i + 1]));
          if (hasStrongStart || (hasDate && nextLineStrong)) {
            isNewEntry = true;
          }
        } else {
          const headerHasDate = currentEntry.headerLines.some(l => dateIndicatorRegex.test(l));
          if (headerHasDate && hasDate) {
            isNewEntry = true;
          }
        }
      }
    }

    if (isNewEntry) {
      if (currentEntry && (currentEntry.headerLines.length > 0 || currentEntry.bulletPoints.length > 0)) {
        rawEntries.push(currentEntry);
      }
      currentEntry = {
        headerLines: [line],
        bulletPoints: []
      };
    } else if (currentEntry) {
      if (isBullet) {
        currentEntry.bulletPoints.push(line.replace(/^[-•*– \d+.)]\s*/, '').trim());
      } else if (currentEntry.bulletPoints.length === 0 && currentEntry.headerLines.length < 4) {
        currentEntry.headerLines.push(line);
      } else {
        currentEntry.bulletPoints.push(line);
      }
    } else if (isShort && (hasDate || hasCompany || hasRole)) {
      currentEntry = {
        headerLines: [line],
        bulletPoints: []
      };
    }
  }

  if (currentEntry && (currentEntry.headerLines.length > 0 || currentEntry.bulletPoints.length > 0)) {
    rawEntries.push(currentEntry);
  }

  if (rawEntries.length === 0) {
    // Attempt fallback chunking if logic completely missed the patterns
    const fallbackRegex = new RegExp(`([^\\n]+(?:${companyIndicatorRegex.source.replace(/\\b/g, '')}|${roleIndicatorRegex.source.replace(/\\b/g, '')})[^\\n]+\\n[^\\n]+(?:20\\d{2}|19\\d{2})[^\\n]+)`, 'gi');
    const allMatches = fullCvText.match(fallbackRegex);
    if (allMatches) {
      allMatches.slice(0, 5).forEach(m => {
        const parts = m.split('\n').map(p => p.trim()).filter(Boolean);
        rawEntries.push({
          headerLines: parts,
          bulletPoints: []
        });
      });
    }
  }

  const experiences: CandidateWorkExperience[] = [];
  const intervals: Array<{ start: number; end: number }> = [];

  rawEntries.forEach(entry => {
    let companyName = '';
    let position = '';
    let period = 'Tahun tidak tertera';
    let location: string | undefined;

    const fullHeaderString = entry.headerLines.join(' ');
    const fullEntryString = fullHeaderString + ' ' + entry.bulletPoints.join(' ');
    const dateMatch = fullEntryString.match(/((?:(?:jan|feb|mar|apr|mei|may|jun|jul|agu|aug|sep|okt|oct|nov|des|dec|[0-9]{1,2})[\/.,\s]*\s*)?(?:20\d{2}|19\d{2})\s*(?:-|sampai|to|s\/d|hingga|–| )\s*(?:(?:jan|feb|mar|apr|mei|may|jun|jul|agu|aug|sep|okt|oct|nov|des|dec|[0-9]{1,2})[\/.,\s]*\s*)?(?:20\d{2}|19\d{2}|sekarang|saat\s*ini|present|current)|(?:20\d{2}|19\d{2}))/i);
    
    if (dateMatch) {
      period = dateMatch[1].trim();
    }

    const dateParsed = parseDateRange(period);
    location = findLocationInText(fullHeaderString);

    // Clean lines by stripping out dates and location
    const parts: string[] = [];
    entry.headerLines.forEach(line => {
      let cl = line;
      
      cl = cl.replace(/\(?\b(?:full-?time|part-?time|fulltime|parttime|freelance|contract|remote|hybrid|on-?site|project based|project-based)\b\)?/gi, '');

      if (period !== 'Tahun tidak tertera') {
        cl = cl.replace(period, '');
      }
      cl = cl.replace(dateIndicatorRegex, '');
      // Split on | or bullet characters, but NOT comma or dash which often belong in titles
      const subparts = cl.split(/[|•]/).map(p => p.trim()).filter(p => p.length >= 2);
      parts.push(...subparts);
    });

    for (const part of parts) {
      if (!companyName && companyIndicatorRegex.test(part)) {
        companyName = part;
      } else if (!position && roleIndicatorRegex.test(part)) {
        position = part;
      }
    }

    if (!companyName && parts.length > 0) {
      if (position && parts.length > 1) {
        companyName = parts.find(p => p !== position) || parts[0];
      } else {
        companyName = parts[0];
      }
    }
    if (!position && parts.length > 1) {
      position = parts.find(p => p !== companyName) || parts[1];
    } else if (!position && parts.length === 1) {
      // If there's only 1 part and it doesn't match role regex, but company matches company regex
      const part = parts[0];
      const coMatch = part.match(companyIndicatorRegex);
      const roMatch = part.match(roleIndicatorRegex);
      
      if (coMatch && roMatch && coMatch.index !== undefined && roMatch.index !== undefined) {
        if (coMatch.index < roMatch.index) {
          companyName = part.substring(0, roMatch.index).trim();
          position = part.substring(roMatch.index).trim();
        } else {
          position = part.substring(0, coMatch.index).trim();
          companyName = part.substring(coMatch.index).trim();
        }
      } else if (companyName === part) {
        position = 'Posisi Kerja / Profesional';
      } else {
        position = part;
      }
    } else if (!position) {
      position = 'Posisi Kerja / Profesional';
    }
    if (!companyName || companyName === position) {
      companyName = 'Perusahaan / Institusi';
    }

    // Aggressive cleanup for stray brackets or labels
    companyName = companyName
      .replace(/^(pengalaman\s+kerja|riwayat\s+pekerjaan|pengalaman|work\s+experience)\s*/i, '')
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/^[– ,-]\s*/, '')
      .trim();
      
    if (companyName.length > 80) companyName = companyName.substring(0, 77) + '...';

    position = position
      .replace(/^(pengalaman\s+kerja|riwayat\s+pekerjaan|pengalaman|work\s+experience)\s*/i, '')
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/^[– ,-]\s*/, '')
      .trim();
      
    if (position.length > 80) position = position.substring(0, 77) + '...';

    const hasValidDate = Boolean(dateMatch && dateParsed.startYear && period !== 'Tahun tidak tertera');

    if (!hasValidDate) {
      // User directive: "kalau ada yang seperti ini tidak ada tahun atau bulan jangan masukan ke daftar riwayat pekerjaan"
      // If we have a preceding valid experience, append any descriptive bullet points to it instead of creating a ghost entry
      if (experiences.length > 0) {
        const prevExp = experiences[experiences.length - 1];
        const extraBullets = [
          ...entry.headerLines.filter(h => !companyIndicatorRegex.test(h) && !roleIndicatorRegex.test(h) && h.length > 10),
          ...entry.bulletPoints
        ].map(b => b.replace(/^[-•*– \d+.)]\s*/, '').trim()).filter(b => b.length > 5);

        for (const bullet of extraBullets) {
          const formattedBullet = bullet.length > 200 ? bullet.substring(0, 197) + '...' : bullet;
          if (!prevExp.description.includes(formattedBullet) && prevExp.description.length < 10) {
            prevExp.description.push(formattedBullet);
          }
        }
      }
      return;
    }

    const formattedDuration = formatDuration(dateParsed.durationMonths);

    if (dateParsed.startYear && dateParsed.endYear) {
      intervals.push({
        start: dateParsed.startYear * 12,
        end: dateParsed.endYear * 12 + (dateParsed.durationMonths % 12 || 12)
      });
    }

    experiences.push({
      companyName,
      position,
      period: dateParsed.formattedPeriod || period,
      startYear: dateParsed.startYear,
      endYear: dateParsed.endYear,
      durationMonths: dateParsed.durationMonths,
      durationFormatted: formattedDuration,
      location: location || 'Lokasi tidak tertera',
      description: entry.bulletPoints.slice(0, 5).map(b => b.length > 200 ? b.substring(0, 197) + '...' : b),
      isCurrent: dateParsed.isCurrent
    });
  });

  let totalMonths = 0;
  if (intervals.length > 0) {
    intervals.sort((a, b) => a.start - b.start);

    let merged: Array<{ start: number; end: number }> = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const last = merged[merged.length - 1];

      if (current.start <= last.end) {
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }

    totalMonths = merged.reduce((acc, curr) => acc + (curr.end - curr.start), 0);
  } else if (experiences.length > 0) {
    totalMonths = experiences.reduce((acc, exp) => acc + (exp.durationMonths || 12), 0);
  }

  if (totalMonths === 0) {
    const yearMatches = fullCvText.match(/\b(20\d{2}|19\d{2})\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const years = yearMatches.map(y => parseInt(y, 10)).filter(y => y >= 1990 && y <= 2026);
      if (years.length >= 2) {
        const minY = Math.min(...years);
        const maxY = Math.max(...years);
        const diff = maxY - minY;
        if (diff >= 1 && diff <= 25) {
          totalMonths = diff * 12;
        }
      }
    }
  }

  const totalYears = Math.round((totalMonths / 12) * 10) / 10;
  const totalFormatted = formatDuration(totalMonths);

  return {
    experiences,
    summary: {
      totalYears,
      totalMonths,
      totalFormatted: totalYears > 0 ? `${totalYears} Tahun (${totalFormatted})` : 'Belum Terdeteksi',
      history: experiences
    }
  };
}

/**
 * 1. Strictly Extract Formal Education History
 */
export function extractEducationHistory(fullCvText: string): CandidateEducationHistory[] {
  if (!fullCvText) return [];

  const eduRegex = /(?:pendidikan\s+formal|riwayat\s+pendidikan|education\s+history|academic\s+background|\bpendidikan\b|\beducation\b)\s*[:|-]?([\s\S]{30,1200}?)(?=(?:\n\s*|\s{3,})(?:pengalaman|experience|keahlian|skills|sertifikasi|certifications|prestasi|achievements|awards|penghargaan|organisasi|proyek|referensi|bahasa|$))/i;
  const eduMatch = fullCvText.match(eduRegex);
  const targetText = eduMatch ? eduMatch[1] : fullCvText;

  // Split by newlines or multiple spaces or periods to prevent giant blobs
  const lines = targetText.split(/(?:\r?\n+|\.\s+|\s{3,})/).map(l => l.trim()).filter(Boolean);
  const results: CandidateEducationHistory[] = [];

  const uniKeywords = /(?:universitas|institut|politeknik|sekolah\s+tinggi|academy|university|college|smk|sma|stie|ui|itb|ugm|undip|unair|unpad|binus|telkom\s+university)/i;
  const degreeKeywords = /(?:s1|s2|s3|d3|d4|sarjana|magister|diploma|bachelor|master|strata\s*1|sma|smk)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (uniKeywords.test(line)) {
      let degree = '';
      let major = '';
      let year = '';
      let gpa: string | undefined;

      const degMatch = line.match(degreeKeywords) || (i + 1 < lines.length ? lines[i + 1].match(degreeKeywords) : null);
      if (degMatch) {
        degree = degMatch[0].toUpperCase();
      }

      const majorMatch = (line + ' ' + (lines[i + 1] || '')).match(/(?:jurusan|program\s+studi|prodi|major|fakultas|ilmu|manajemen|teknik|akuntansi|psikologi|hukum|informatika|sistem\s+informasi)\s*[:|-]?\s*([a-zA-Z\s]+)/i);
      if (majorMatch) {
        major = majorMatch[1].trim();
      }

      const yearMatch = (line + ' ' + (lines[i + 1] || '')).match(/\b(20\d{2}|19\d{2})\b/);
      if (yearMatch) {
        year = yearMatch[1];
      }

      const gpaMatch = (line + ' ' + (lines[i + 1] || '')).match(/(?:ipk|gpa)\s*[:=]?\s*([0-4](?:\.[0-9]{1,2})?)/i);
      if (gpaMatch) {
        gpa = gpaMatch[1];
      }

      // Truncate institution name to avoid giant blob
      let institution = line.replace(/[•*-]/g, '').trim();
      if (institution.length > 80) {
        const match = institution.match(/(?:universitas|institut|politeknik|sekolah\s+tinggi|academy|university|college|smk|sma|stie|ui|itb|ugm|undip|unair|unpad|binus|telkom\s+university)[\w\s]{0,40}/i);
        if (match) {
           institution = match[0].trim();
        } else {
           institution = institution.substring(0, 80) + '...';
        }
      }

      // Don't push duplicate institutions
      if (!results.some(r => r.institution.includes(institution))) {
        results.push({
          institution,
          degree: degree || 'Sarjana / Diploma',
          major: major || undefined,
          year: year || undefined,
          gpa: gpa || undefined
        });
      }
    }
  }

  return results.slice(0, 3);
}

/**
 * 2. Strictly Extract Achievements, Awards & Honors (Prestasi & Penghargaan)
 */
export function extractAchievements(fullCvText: string): CandidateAchievement[] {
  if (!fullCvText) return [];

  const achRegex = /(?:prestasi(?:\s+dan\s+penghargaan)?|penghargaan|awards?(?:\s+and\s+honors?)?|honors?|kejuaraan|pencapaian\s+khusus)\s*[:|-]?([\s\S]{20,1000}?)(?=(?:\n\s*|\s{3,})(?:pendidikan|pengalaman|experience|keahlian|skills|sertifikasi|certifications|organisasi|bahasa|$))/i;
  const achMatch = fullCvText.match(achRegex);
  
  const achievements: CandidateAchievement[] = [];

  if (achMatch) {
    const lines = achMatch[1].split(/(?:\r?\n+|\.\s+|\s{3,})/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.length < 5) continue;
      const cleanLine = line.replace(/^[-•*– \d+.)]\s*/, '').trim();
      
      const yearMatch = cleanLine.match(/\b(20\d{2}|19\d{2})\b/);
      const year = yearMatch ? yearMatch[1] : undefined;
      
      let type: CandidateAchievement['type'] = 'Penghargaan';
      if (/juara|winner|1st|2nd|3rd|champion|finalist|lomba|kompetisi|hackathon/i.test(cleanLine)) {
        type = 'Kejuaraan / Lomba';
      } else if (/beasiswa|scholarship/i.test(cleanLine)) {
        type = 'Beasiswa';
      } else if (/cumlaude|mahasiswa\s+berprestasi|ipk\s+tertinggi|dean's\s+list/i.test(cleanLine)) {
        type = 'Prestasi Akademik';
      }

      let title = cleanLine.replace(/\b(20\d{2}|19\d{2})\b/, '').trim();
      if (title.length > 120) title = title.substring(0, 117) + '...';

      achievements.push({
        title,
        year,
        type
      });
    }
  } else {
    // Scan text for direct award bullet lines
    const directMatches = fullCvText.match(/(?:juara\s+\d+|penerima\s+beasiswa|best\s+employee|mahasiswa\s+berprestasi|winner\s+of|top\s+\d+\s+finalist)[^\n\.]+/gi);
    if (directMatches) {
      directMatches.slice(0, 3).forEach(m => {
        let clean = m.replace(/^[-•*– \d+.)]\s*/, '').trim();
        if (clean.length > 120) clean = clean.substring(0, 117) + '...';
        achievements.push({
          title: clean,
          type: 'Penghargaan'
        });
      });
    }
  }

  return achievements.slice(0, 5);
}

/**
 * 3. Strictly Extract Professional Certifications & Licenses (Sertifikasi Profesional)
 */
export function extractCertifications(fullCvText: string): CandidateCertification[] {
  if (!fullCvText) return [];

  const certRegex = /(?:sertifikasi(?:\s+profesi)?|certifications?|licenses?(?:\s+and\s+certifications?)?|lisensi|pelatihan\s+bersertifikat)\s*[:|-]?([\s\S]{10,2500}?)(?=(?:\n\s*|\s{3,})(?:pendidikan|pengalaman|experience|keahlian|skills|prestasi|organisasi|bahasa|proyek|portfolio|portofolio|$))/i;
  const certMatch = fullCvText.match(certRegex);

  if (!certMatch) {
    // Fallback: direct pattern match
    const directCerts = fullCvText.match(/(?:sertifikasi\s+bnsp|certified\s+[a-zA-Z\s]+|google\s+certified|aws\s+certified|brevet\s+[a-b]|scrum\s+master|pmp\b)[^\n\,\.]+/gi);
    if (!directCerts) return [];
    return directCerts.slice(0, 5).map(c => {
      const name = c.trim();
      return { name, title: name };
    });
  }

  // Remove section heading if included in line 1
  const sectionContent = certMatch[1].trim();

  // Split into raw lines
  const rawLines = sectionContent
    .split(/\r?\n+/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !/^(sertifikasi(?:\s+profesi)?|certifications?|licenses?|lisensi|pelatihan\s+bersertifikat)$/i.test(l));

  const certs: CandidateCertification[] = [];
  let currentTitle = '';
  let currentIssuer = '';
  let currentYear = '';
  let lineCount = 0;

  function pushCurrent() {
    if (currentTitle) {
      // Clean leading bullet symbols
      let title = currentTitle.replace(/^[-•*– \d+.)]\s*/, '').trim();
      let issuer = currentIssuer ? currentIssuer.replace(/^[-•*– \d+.)]\s*/, '').trim() : undefined;

      // Extract year if present in title or issuer
      const yearMatch = (title + ' ' + (issuer || '')).match(/\b(20\d{2}|19\d{2})\b/);
      const year = currentYear || (yearMatch ? yearMatch[1] : undefined);

      // Clean right-aligned status tags separated by multiple spaces or tabs
      // e.g., "Six Sigma White Belt (SSWB)        Official Certified Standard" -> title = "Six Sigma White Belt (SSWB)"
      const titleSplit = title.split(/\s{2,}/);
      if (titleSplit.length > 1) {
        title = titleSplit[0].trim();
      }

      if (issuer) {
        const issuerSplit = issuer.split(/\s{2,}/);
        if (issuerSplit.length > 1) {
          issuer = issuerSplit[0].trim();
        }
      }

      if (title.length > 3) {
        certs.push({
          name: title,
          title: title,
          issuer: issuer || undefined,
          issueDate: year,
          year: year
        });
      }
    }
    currentTitle = '';
    currentIssuer = '';
    currentYear = '';
    lineCount = 0;
  }

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Check if line is a description paragraph line (starts with "Sertifikasi ", "Sertifikat ", "Mencakup ", "Memvalidasi ", etc.)
    // or if lineCount === 2 (we already took Line 1 as title and Line 2 as issuer)
    const isDescriptionLine = /^(sertifikasi\s+resmi|sertifikasi\s+keahlian|sertifikasi\s+kompetensi|sertifikasi\s+penguasaan|sertifikasi\s+|sertifikat\s+|mencakup\s+|memvalidasi\s+|diterbitkan\s+oleh|program\s+pelatihan|memberikan\s+|persyaratan\s+|topik\s+materi|kualifikasi\s+ini)/i.test(line)
      || (lineCount >= 2 && !/^[-•*– \d+.)]/.test(line) && line.length > 50);

    const isBullet = /^[-•*– \d+.)]/.test(line);

    if (isDescriptionLine) {
      // Description paragraph (line 3+). Skip line and close current block
      if (lineCount > 0) {
        pushCurrent();
      }
      continue;
    }

    if (isBullet) {
      if (lineCount > 0) {
        pushCurrent();
      }
      currentTitle = line;
      lineCount = 1;

      // Check if title has inline issuer e.g. "Certified Scrum Master - Scrum Alliance"
      const inlineIssuerMatch = line.match(/[-– |]\s*([a-zA-Z0-9\s.,()&]+)$/);
      if (inlineIssuerMatch && inlineIssuerMatch[1].length > 3) {
        currentIssuer = inlineIssuerMatch[1].trim();
      }
    } else {
      if (lineCount === 0) {
        // Line 1: Certification Title
        currentTitle = line;
        lineCount = 1;
      } else if (lineCount === 1) {
        // Line 2: Issuer / Institution
        currentIssuer = line;
        lineCount = 2;
      } else {
        // Line 3+ without description keyword: close block and treat line as line 1 of next cert
        pushCurrent();
        currentTitle = line;
        lineCount = 1;
      }
    }
  }

  if (lineCount > 0) {
    pushCurrent();
  }

  return certs.slice(0, 6);
}

/**
 * 4. Strictly Extract Candidate Skills (Hard Skills, Tools, Soft Skills, Languages)
 */
export function extractCandidateSkillSet(fullCvText: string): CandidateSkillSet {
  const textLower = fullCvText.toLowerCase();

  // Tech / Hard skills registry
  const HARD_SKILLS_POOL = [
    'hris', 'talenta', 'workday', 'sap', 'payroll management', 'kpi formulation', 
    'compensation & benefit', 'recruitment', 'talent acquisition', 'job analysis',
    'python', 'react', 'typescript', 'javascript', 'sql', 'postgresql', 'node.js',
    'docker', 'aws', 'git', 'tableau', 'power bi', 'excel', 'financial modeling',
    'taxation', 'brevet a/b', 'seo', 'sem', 'copywriting', 'ui/ux design', 'figma'
  ];

  const SOFT_SKILLS_POOL = [
    'leadership', 'kepemimpinan', 'problem solving', 'pemecahan masalah',
    'communication', 'komunikasi efektif', 'teamwork', 'kolaborasi tim',
    'analytical thinking', 'berpikir analitis', 'adaptability', 'adaptabilitas',
    'time management', 'manajemen waktu', 'negotiation', 'negosiasi',
    'critical thinking', 'conflict resolution', 'emotional intelligence'
  ];

  const matchedHard: string[] = [];
  HARD_SKILLS_POOL.forEach(skill => {
    if (textLower.includes(skill)) {
      matchedHard.push(skill.toUpperCase());
    }
  });

  const matchedSoft: string[] = [];
  SOFT_SKILLS_POOL.forEach(skill => {
    if (textLower.includes(skill)) {
      const formatted = skill.charAt(0).toUpperCase() + skill.slice(1);
      if (!matchedSoft.includes(formatted)) {
        matchedSoft.push(formatted);
      }
    }
  });

  // Languages detection
  const languages: CandidateLanguageItem[] = [];
  if (textLower.includes('bahasa indonesia') || textLower.includes('indonesian') || textLower.includes('native')) {
    languages.push({ language: 'Bahasa Indonesia', proficiency: 'Penutur Asli (Native)' });
  } else {
    languages.push({ language: 'Bahasa Indonesia', proficiency: 'Mahir / Fasih (Fluent)' });
  }

  if (textLower.includes('english') || textLower.includes('bahasa inggris') || textLower.includes('toefl') || textLower.includes('ielts')) {
    const isFluent = textLower.includes('fluent') || textLower.includes('advanced') || textLower.includes('toefl > 550') || textLower.includes('ielts > 6');
    languages.push({
      language: 'Bahasa Inggris (English)',
      proficiency: isFluent ? 'Mahir / Fasih (Fluent)' : 'Menengah (Conversational)'
    });
  }

  if (textLower.includes('mandarin') || textLower.includes('chinese')) {
    languages.push({ language: 'Bahasa Mandarin', proficiency: 'Menengah (Conversational)' });
  }

  return {
    hardSkills: matchedHard.slice(0, 10),
    toolsAndTech: matchedHard.filter(h => ['TALENTA', 'WORKDAY', 'SAP', 'PYTHON', 'REACT', 'SQL', 'TABLEAU', 'POWER BI', 'EXCEL', 'FIGMA', 'AWS', 'DOCKER'].includes(h)),
    softSkills: matchedSoft.slice(0, 8),
    languages
  };
}

/**
 * 5. Clean Executive Summary - removing items that belong to other sections
 */
export function cleanExecutiveSummary(rawSummary?: string, fullText?: string): string[] {
  let sourceText = rawSummary?.trim() || '';

  if (!sourceText || sourceText.length < 25) {
    if (fullText) {
      const match = fullText.match(/(?:Ringkasan(?:\s+Profil)?|Summary|About\s+Me|Profil(?:\s+Singkat)?|Tentang\s+Saya|Sorotan\s+Kinerja)\s*[:|-]?\s*([\s\S]{30,700}?)(?=\n\s*(?:Experience|Pengalaman|Pendidikan|Education|Keahlian|Skills|Riwayat\s+Kerja|Sertifikasi|Prestasi|$))/i);
      if (match) {
        sourceText = match[1].trim();
      }
    }
  }

  if (!sourceText) {
    return ['Kandidat memiliki profil profesional dengan latar belakang kerja yang relevan pada bidang terkait.'];
  }

  // Filter out dirty lines and split by sentences/newlines
  const lines = sourceText
    .split(/(?:\r?\n+|\.\s+|\s{3,})/)
    .map(l => l.replace(/^[-•*– \d+.)]\s*/, '').trim())
    .filter(l => {
      if (l.length < 10) return false;
      if (/^(email|phone|telepon|alamat|address|linkedin|github|portfolio|pendidikan|pengalaman)/i.test(l)) return false;
      if (l.includes('@') && l.includes('.')) return false;
      if (/^[\d\s\-\+]+$/.test(l)) return false; // exclude phone numbers
      return true;
    });

  if (lines.length === 0) {
    return ['Profesional yang berdedikasi dengan fokus pada pencapaian target dan efisiensi operasional.'];
  }

  // Limit line length so it doesn't look like a blob
  return lines.slice(0, 4).map(l => l.length > 150 ? l.substring(0, 147) + '...' : l);
}

/**
 * 6. Deep Potential Analysis Engine (Soft Skills, Hard Skills, Career Growth Trajectory & Strategic Hiring Insights)
 */
export function analyzeCandidatePotential(
  candidateText: string,
  vacancy: VacancyItem,
  workExperiences: CandidateWorkExperience[],
  educationHistory: CandidateEducationHistory[],
  certifications: CandidateCertification[],
  achievements: CandidateAchievement[]
): CandidatePotentialAnalysis {
  const textLower = candidateText.toLowerCase();

  // 1. Soft Skill Traits & Tendency
  const traits: SoftSkillTrait[] = [];

  // Leadership & Mentorship
  if (/lead|leader|lead\b|memimpin|mengkoordinasikan|supervisor|manager|head|kepala|mentoring|delegasi/i.test(candidateText)) {
    traits.push({
      trait: 'Kepemimpinan & Koordinasi Tim (Leadership)',
      description: 'Memiliki kecenderungan alami untuk mengarahkan tim, menetapkan prioritas, dan mendelegasikan tugas secara terukur.',
      strengthLevel: 'Tinggi',
      evidence: 'Tercermin dari riwayat peran koordinasi tim dan pengelolaan operasional pada pengalaman kerja.'
    });
  } else {
    traits.push({
      trait: 'Kerjasama & Kolaborasi Tim (Team Collaboration)',
      description: 'Mampu beradaptasi secara efektif dalam kelompok kerja lintas departemen dengan koordinasi yang harmonis.',
      strengthLevel: 'Sedang',
      evidence: 'Terbukti dari keterlibatan aktif dalam pencapaian target kolektif organisasi.'
    });
  }

  // Problem Solving & Analytical Drive
  if (/analis|menganalisis|evaluasi|optimasi|efisiensi|troubleshoot|investigasi|problem\s+solving|solusi/i.test(candidateText)) {
    traits.push({
      trait: 'Pemecahan Masalah & Daya Analitis (Analytical Drive)',
      description: 'Cenderung mendiagnosis akar permasalahan menggunakan data konkret sebelum mengambil tindakan mitigasi.',
      strengthLevel: 'Tinggi',
      evidence: 'Terdapat catatan perbaikan proses operasional dan formulasi solusi berbasis data.'
    });
  } else {
    traits.push({
      trait: 'Eksekusi & Konsistensi Kerja (Operational Execution)',
      description: 'Fokus pada ketelitian pengerjaan prosedur operasional standar dan stabilitas deliverable harian.',
      strengthLevel: 'Sedang',
      evidence: 'Kandidat menunjukkan keandalan dalam mematuhi jadwal dan alur kerja yang ditetapkan.'
    });
  }

  // Communication & Stakeholder Engagement
  if (/komunikasi|presentasi|klien|vendor|stakeholder|negosiasi|pelatihan|briefing|hubungan\s+industrial/i.test(candidateText)) {
    traits.push({
      trait: 'Komunikasi & Pengaruh Stakeholder (Stakeholder Engagement)',
      description: 'Mampu menjembatani kebutuhan antar-divisi dan menyampaikan laporan teknis secara lugas kepada pimpinan.',
      strengthLevel: 'Tinggi',
      evidence: 'Pengalaman dalam memfasilitasi interaksi lintas divisi dan pelaporan manajemen.'
    });
  }

  // 2. Hard Skill Competency & Mastery
  let masteryLevel: CandidatePotentialAnalysis['hardSkillCompetency']['masteryLevel'] = 'Mid-Level Specialist';
  const totalYears = workExperiences.reduce((acc, exp) => acc + (exp.durationMonths || 12), 0) / 12;

  if (totalYears >= 7 || /head|lead|senior\s+manager|principal|director/i.test(candidateText)) {
    masteryLevel = 'Expert / Lead';
  } else if (totalYears >= 4 || /senior|spesialis\s+utama|lead/i.test(candidateText)) {
    masteryLevel = 'Senior Specialist';
  } else if (totalYears < 2) {
    masteryLevel = 'Junior / Entry';
  }

  const keyTech = extractCandidateSkillSet(candidateText).toolsAndTech;
  const domainSpecialization = vacancy.jobTitle ? `${vacancy.jobTitle} & Operasional Terkait` : 'Spesialisasi Domain Relevan';

  const depthAnalysis = `Kandidat memiliki penguasaan teknis pada tingkat ${masteryLevel}, didukung oleh familiaritas terhadap perangkat kerja modern (${keyTech.slice(0, 4).join(', ') || 'sistem standar industri'}) dan pemahaman regulasi operasional di bidangnya.`;

  // 3. Career Trajectory
  let growthPattern: CandidatePotentialAnalysis['careerTrajectory']['growthPattern'] = 'Progression Konsisten (Naik Tingkat)';
  if (workExperiences.length <= 1) {
    growthPattern = 'Early Career Stage';
  } else {
    const roles = workExperiences.map(w => w.position.toLowerCase());
    if (roles.some(r => /lead|head|manager|senior/i.test(r))) {
      growthPattern = 'Progression Konsisten (Naik Tingkat)';
    } else {
      growthPattern = 'Specialist Mendalam';
    }
  }

  const avgTenureMonths = workExperiences.length > 0
    ? Math.round((totalYears * 12) / workExperiences.length)
    : 12;
  const avgTenureFormatted = formatDuration(avgTenureMonths);

  let stabilityRating: CandidatePotentialAnalysis['careerTrajectory']['stabilityRating'] = 'Stabil';
  if (avgTenureMonths >= 24) {
    stabilityRating = 'Sangat Stabil (Low Turnover Risk)';
  } else if (avgTenureMonths < 12) {
    stabilityRating = 'Dinamis (Agile)';
  }

  // 4. Strategic Hiring Recommendations
  const strengths: string[] = [];
  if (totalYears >= 3) strengths.push(`Memiliki akumulasi pengalaman terbangun (${Math.round(totalYears * 10) / 10} Tahun) yang matang.`);
  if (certifications.length > 0) strengths.push(`Tervalidasi secara profesional dengan ${certifications.length} lisensi/sertifikasi industri.`);
  if (achievements.length > 0) strengths.push(`Memiliki rekam jejak prestasi (${achievements[0].title}) yang menunjukkan keunggulan kompetitif.`);
  if (traits.some(t => t.strengthLevel === 'Tinggi')) strengths.push('Memiliki inisiatif kepemimpinan dan kapabilitas komunikasi lintas fungsi yang kuat.');

  if (strengths.length === 0) {
    strengths.push('Memiliki fondasi keilmuan dan motivasi pengembangan karir yang adaptif.');
  }

  const interviewProbes: string[] = [
    `Eksplorasi kontribusi paling signifikan kandidat saat bertugas di ${workExperiences[0]?.companyName || 'perusahaan sebelumnya'}.`,
    `Uji studi kasus praktis mengenai penanganan situasi kritis atau tantangan operasional ${vacancy.jobTitle}.`,
    `Klarifikasi kedalaman penggunaan tools kerja teknis (${keyTech.slice(0, 3).join(', ') || 'sistem kerja'}) dalam skala beban kerja penuh.`
  ];

  return {
    softSkillTendency: {
      dominantWorkStyle: traits.some(t => t.strengthLevel === 'Tinggi' && t.trait.includes('Kepemimpinan')) 
        ? 'Strategic Leader & Collaborative Orchestrator' 
        : 'Agile Executor & Problem Solver',
      summary: 'Kandidat memperlihatkan kecenderungan kerja yang berorientasi pada pencapaian hasil dengan integrasi komunikasi tim yang konstruktif.',
      traits
    },
    hardSkillCompetency: {
      domainSpecialization,
      masteryLevel,
      keyTechnologies: keyTech,
      depthAnalysis
    },
    careerTrajectory: {
      growthPattern,
      averageTenurePerCompany: `${avgTenureFormatted} per institusi`,
      stabilityRating,
      promotionHistory: `Terdata ${workExperiences.length} riwayat penempatan kerja dengan jalur pertumbuhan karir terstruktur.`,
      insights: `Kandidat mempertahankan rasio stabilitas '${stabilityRating}' dengan rata-rata masa bakti ${avgTenureFormatted}, mengindikasikan komitmen kerja yang baik.`
    },
    hiringRecommendations: {
      suggestedSeniority: masteryLevel,
      keyStrengths: strengths,
      areasToProbeInInterview: interviewProbes,
      overallFitSummary: `Kandidat direkomendasikan untuk tahap wawancara pendalaman pada jenjang ${masteryLevel}. Kualifikasi masa kerja dan portofolio tugas telah terverifikasi secara proporsional.`
    }
  };
}

/**
 * Evaluate Candidate Experience vs Vacancy Requirements
 */
export function evaluateExperienceRequirement(
  vacancy: VacancyItem,
  candidateSummary: CandidateExperienceSummary
): ExperienceEvaluation {
  const reqText = (
    (vacancy.rawJobTemplate?.kualifikasi?.pengalaman || '') + ' ' +
    (vacancy.atsBreakdown?.mandatoryQualifications?.experience || '')
  ).toLowerCase();

  let minYears = 1;
  let maxYears: number | undefined;

  const rangeMatch = reqText.match(/(?:minimal|min\.?|pengalaman)?\s*(\d+)\s*(?:-|sampai|to|s\/d|hingga)\s*(\d+)\s*(?:tahun|thn)/i);
  if (rangeMatch) {
    minYears = parseInt(rangeMatch[1], 10);
    maxYears = parseInt(rangeMatch[2], 10);
  } else {
    const singleMatch = reqText.match(/(?:minimal|min\.?|pengalaman)\s*(\d+)\+?\s*(?:tahun|thn)/i);
    if (singleMatch) {
      minYears = parseInt(singleMatch[1], 10);
    }
  }

  const candYears = candidateSummary.totalYears;
  let status: ExperienceEvaluation['status'] = 'Belum Tertera';
  let matchPercentage = 0;
  let notes = '';

  if (candYears <= 0) {
    status = 'Belum Tertera';
    matchPercentage = 20;
    notes = `Riwayat masa kerja tidak tertera jelas di CV (Dibutuhkan Min. ${minYears} Tahun).`;
  } else if (candYears >= minYears) {
    status = 'Memenuhi Syarat';
    matchPercentage = 100;
    notes = `Total masa kerja ${candYears} Tahun telah memenuhi kriteria minimal (${minYears} Tahun).`;
  } else if (candYears >= minYears * 0.6) {
    status = 'Cukup';
    matchPercentage = Math.round((candYears / minYears) * 85);
    notes = `Total masa kerja ${candYears} Tahun mendekati kualifikasi yang dipersyaratkan (${minYears} Tahun).`;
  } else {
    status = 'Di Bawah Syarat';
    matchPercentage = Math.round((candYears / minYears) * 50);
    notes = `Total masa kerja ${candYears} Tahun masih di bawah syarat minimal posisi (${minYears} Tahun).`;
  }

  return {
    candidateYears: candYears,
    candidateFormatted: candidateSummary.totalFormatted,
    requiredYearsMin: minYears,
    requiredYearsMax: maxYears,
    status,
    matchPercentage,
    notes
  };
}
