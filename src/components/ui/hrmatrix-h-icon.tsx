import React, { useId } from 'react';

interface HRMatrixHIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Icon SVG 'H' HRMatrix resmi:
 * - Pilar kiri biru (#2563EB)
 * - Pilar kanan hijau (#16A34A)
 * - Titik kepala oranye (#F59E0B)
 * - Jembatan lengkung U dengan gradasi biru-hijau
 */
export const HRMatrixHIcon: React.FC<HRMatrixHIconProps> = ({
  className = 'w-5 h-5',
  size,
  ...props
}) => {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      width={size || undefined}
      height={size || undefined}
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Pilar Kiri - Biru */}
      <rect x="8" y="8" width="22" height="84" rx="11" fill="#2563EB" />

      {/* Pilar Kanan - Hijau */}
      <rect x="70" y="8" width="22" height="84" rx="11" fill="#16A34A" />

      {/* Titik Kepala Tengah - Oranye/Kuning */}
      <circle cx="50" cy="22" r="13" fill="#F59E0B" />

      {/* Jembatan Penghubung Lengkung U */}
      <path
        d="M 19 42 C 28 72, 72 72, 81 42 C 73 56, 27 56, 19 42 Z"
        fill={`url(#${gradientId})`}
      />

      <defs>
        <linearGradient
          id={gradientId}
          x1="19"
          y1="42"
          x2="81"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3B82F6" />
          <stop offset="0.6" stopColor="#2563EB" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
      </defs>
    </svg>
  );
};
