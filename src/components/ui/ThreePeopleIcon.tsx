import React from 'react';

interface ThreePeopleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  withSparkles?: boolean;
  withOrbits?: boolean;
}

/**
 * Icon 3 People (Tim / Komunitas) yang dipelajari dari animasi Lottie logo HRMatrix:
 * - Rekan Kiri (Biru): Kepala & Badan Tegak/Pillar (#2563EB)
 * - Pemimpin Tengah (Kuning/Oranye Amber): Kepala Besar & Badan Bantalan Melengkung di depan (#F59E0B)
 * - Rekan Kanan (Hijau): Kepala & Badan Tegak/Pillar (#16A34A)
 * - Elemen Sparkles bintang 4 sudut & garis orbit sirkular halus
 */
export const ThreePeopleIcon: React.FC<ThreePeopleIconProps> = ({
  className = 'w-5 h-5',
  size,
  withSparkles = true,
  withOrbits = true,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      width={size || undefined}
      height={size || undefined}
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Garis lintasan sirkular konsentris halus (Orbit background) */}
      {withOrbits && (
        <>
          <circle
            cx="150"
            cy="150"
            r="136"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          <circle
            cx="150"
            cy="150"
            r="105"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            opacity="0.4"
          />
        </>
      )}

      {/* Sparkle Bintang Kiri (Amber / Oranye) */}
      {withSparkles && (
        <g transform="translate(34, 70) rotate(55)">
          <rect x="-3.92" y="-14" width="7.84" height="28" rx="3.92" fill="#F59E0B" />
          <rect x="-14" y="-3.92" width="28" height="7.84" rx="3.92" fill="#F59E0B" />
        </g>
      )}

      {/* Sparkle Bintang Kanan (Amber / Oranye) */}
      {withSparkles && (
        <g transform="translate(266, 70) rotate(48)">
          <rect x="-3.36" y="-12" width="6.72" height="24" rx="3.36" fill="#F59E0B" />
          <rect x="-12" y="-3.36" width="24" height="6.72" rx="3.36" fill="#F59E0B" />
        </g>
      )}

      {/* Rekan Tim Kiri - Biru (#2563EB) */}
      <g transform="rotate(-2.5, 78, 154)">
        {/* Kepala Rekan Kiri */}
        <circle cx="78" cy="114" r="28" fill="#2563EB" />
        {/* Tubuh Rekan Kiri (Pillar Melengkung) */}
        <rect x="35" y="154" width="86" height="80" rx="33" fill="#2563EB" />
      </g>

      {/* Rekan Tim Kanan - Hijau (#16A34A) */}
      <g transform="rotate(2.5, 222, 154)">
        {/* Kepala Rekan Kanan */}
        <circle cx="222" cy="114" r="28" fill="#16A34A" />
        {/* Tubuh Rekan Kanan (Pillar Melengkung) */}
        <rect x="179" y="154" width="86" height="80" rx="33" fill="#16A34A" />
      </g>

      {/* Pemimpin Tengah - Amber / Oranye (#F59E0B) - Berada di layer depan */}
      <g>
        {/* Kepala Pemimpin Tengah */}
        <circle cx="150" cy="74" r="36" fill="#F59E0B" />
        {/* Tubuh Pemimpin Tengah (Bantalan melengkung di depan badan biru & hijau) */}
        <rect x="91" y="126" width="118" height="88" rx="26" fill="#F59E0B" />
      </g>
    </svg>
  );
};
