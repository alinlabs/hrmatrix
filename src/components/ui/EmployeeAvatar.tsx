import React, { useState, useEffect, useMemo } from 'react';
import { Employee } from '../../types';
import { cn } from '../../utils/cn';

export interface EmployeeAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  employee?: Employee | null;
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imageClassName?: string;
  alt?: string;
}

/**
 * Resolves Google Drive sharing links to direct thumbnail image URLs
 */
export function resolveGoogleDriveImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Transform Google Drive links to loadable thumbnail images
  if (trimmed.includes('drive.google.com')) {
    const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w500`;
    }
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w500`;
    }
  }

  return trimmed;
}

/**
 * Extracts photo URL from an Employee object by inspecting documents or direct photo fields
 */
export function getEmployeePhotoUrl(employee?: Employee | null): string | null {
  if (!employee) return null;

  // 1. Direct photoUrl or avatarUrl property
  const directUrl = (employee as any).photoUrl || (employee as any).avatarUrl;
  if (directUrl && typeof directUrl === 'string' && directUrl.trim() !== '') {
    return resolveGoogleDriveImageUrl(directUrl);
  }

  // 2. Documents check: find document with photo/avatar/pas foto
  if (Array.isArray(employee.documents)) {
    const photoDoc = employee.documents.find(doc => {
      if (!doc.url || doc.url.trim() === '') return false;
      const nameLower = (doc.name || '').toLowerCase();
      const catLower = (doc.category || '').toLowerCase();
      return (
        nameLower.includes('foto') ||
        nameLower.includes('photo') ||
        nameLower.includes('avatar') ||
        catLower.includes('foto') ||
        (catLower.includes('identitas') && nameLower.includes('foto'))
      );
    });

    if (photoDoc && photoDoc.url && photoDoc.url.trim() !== '') {
      return resolveGoogleDriveImageUrl(photoDoc.url);
    }
  }

  return null;
}

/**
 * Extracts 2-letter uppercase initials from full name
 * Examples:
 * - "Agus Santoso" -> "AS"
 * - "Budi" -> "BU"
 * - "Siti Nurhaliza" -> "SN"
 */
export function getEmployeeInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'HR';
  const cleanName = name.trim();
  const words = cleanName.split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  if (cleanName.length >= 2) {
    return cleanName.slice(0, 2).toUpperCase();
  }
  return cleanName.charAt(0).toUpperCase();
}

const sizeClasses = {
  sm: 'w-8 h-8 rounded-[10px] text-xs',
  md: 'w-10 h-10 rounded-[12px] text-[13px]', // Exact match with employee card list
  lg: 'w-12 h-12 rounded-[14px] text-sm',
  xl: 'w-16 h-16 rounded-[18px] text-base font-black'
};

/**
 * Global Employee Avatar Component
 * 
 * Mekanisme:
 * 1. Jika ada link foto profil pada berkas karyawan (atau prop src/photoUrl), tampilkan gambar.
 * 2. Jika belum ada link terisi (atau gambar gagal dimuat), tampilkan placeholder warna abu tipis soft
 *    dengan 2 huruf inisial nama berwarna biru.
 * 3. Ukuran default w-10 h-10 dan lengkungan rounded-[12px] persis dengan card daftar karyawan.
 */
export const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({
  employee,
  name,
  src,
  size = 'md',
  className,
  imageClassName,
  alt,
  ...rest
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  // Resolved display name
  const displayName = name || employee?.fullName || employee?.nickname || 'Karyawan';

  // Resolved initials
  const initials = useMemo(() => getEmployeeInitials(displayName), [displayName]);

  // Resolved photo URL: prioritize direct src prop, then employee documents
  const photoUrl = useMemo(() => {
    if (src && src.trim() !== '') {
      return resolveGoogleDriveImageUrl(src);
    }
    return getEmployeePhotoUrl(employee);
  }, [src, employee]);

  // Reset error state if photoUrl changes
  useEffect(() => {
    setHasImageError(false);
  }, [photoUrl]);

  const hasPhoto = Boolean(photoUrl && !hasImageError);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={cn(
        'relative shrink-0 select-none overflow-hidden flex items-center justify-center transition-all',
        sizeClass,
        hasPhoto
          ? 'bg-slate-100 border border-slate-200/80 shadow-3xs'
          : 'bg-slate-100/90 border border-slate-200/80 text-blue-600 font-extrabold tracking-wider shadow-3xs',
        className
      )}
      title={displayName}
      aria-label={displayName}
      {...rest}
    >
      {hasPhoto && photoUrl ? (
        <img
          src={photoUrl}
          alt={alt || displayName}
          className={cn(
            'w-full h-full object-cover rounded-[inherit] transition-opacity duration-200',
            imageClassName
          )}
          onError={() => setHasImageError(true)}
          loading="lazy"
        />
      ) : (
        <span className="leading-none select-none drop-shadow-xs">
          {initials}
        </span>
      )}
    </div>
  );
};

export default EmployeeAvatar;
