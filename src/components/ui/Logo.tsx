import React from 'react';
import { Lottie } from 'lottie-react';
import logoAnimationData from '../../assets/animations/logo-hrmatrix.json';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  textColor?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  animated?: boolean;
}

export function HRMatrixLogo({ 
  className = "w-8 h-8", 
  iconClassName,
  showText = false, 
  textColor = "text-slate-900",
  showSubtitle = true,
  subtitle = "Indonesia",
  animated = true
}: LogoProps) {
  const [hasError, setHasError] = React.useState(false);

  // If showText is true, the size class belongs to the icon
  const iconSize = iconClassName || (showText ? className : "w-full h-full");
  const containerClass = showText ? "inline-flex items-center gap-2.5" : `inline-flex items-center justify-center ${className}`;

  const shouldShowLottie = animated && !hasError && Boolean(logoAnimationData);

  return (
    <div className={containerClass}>
      <div className={`relative shrink-0 flex items-center justify-center aspect-square ${iconSize}`}>
        {shouldShowLottie ? (
          <Lottie
            src={logoAnimationData}
            loop={true}
            autoplay={true}
            className="w-full h-full aspect-square select-none pointer-events-none drop-shadow-xs"
            subscriptions={{
              error: () => setHasError(true)
            }}
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full shrink-0"
          >
            {/* Left Pillar - Electric Blue */}
            <rect x="8" y="8" width="22" height="84" rx="11" fill="#2563EB" />
            
            {/* Right Pillar - Fresh Green */}
            <rect x="70" y="8" width="22" height="84" rx="11" fill="#16A34A" />
            
            {/* Top Sun/Head Dot - Warm Yellow */}
            <circle cx="50" cy="22" r="13" fill="#F59E0B" />
            
            {/* U-Shape Connecting Bridge - Smooth Arc */}
            <path
              d="M 19 42 C 28 72, 72 72, 81 42 C 73 56, 27 56, 19 42 Z"
              fill="url(#logoBridgeGrad)"
            />
            
            <defs>
              <linearGradient id="logoBridgeGrad" x1="19" y1="42" x2="81" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="0.6" stopColor="#2563EB" />
                <stop offset="1" stopColor="#22C55E" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className={`font-extrabold tracking-tight ${textColor} text-base leading-none`}>
            HRMatrix
          </span>
          {showSubtitle && (
            <span className="text-[11px] font-medium text-slate-400 mt-1 leading-none">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

