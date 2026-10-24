import React, { useState, useEffect } from 'react';
import { Camera, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  lazy?: boolean;
  aspectRatioClass?: string;
  fallbackText?: string;
  showFallbackBadge?: boolean;
  overlay?: React.ReactNode;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover object-center",
  containerClassName = "",
  priority = false,
  lazy = true,
  aspectRatioClass = "",
  fallbackText = "ยังไม่มีรูปภาพ",
  showFallbackBadge = true,
  overlay,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${containerClassName}`}>
      {/* Actual Image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : lazy ? "lazy" : undefined}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          {...props}
        />
      )}

      {/* Fallback Area if image cannot load (Rule 7: Fallback "ยังไม่มีรูปภาพ" without breaking layout) */}
      {hasError && (
        <div className="absolute inset-0 bg-[#001f2c] border border-stone-800/80 flex flex-col items-center justify-center p-4 text-center select-none">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#fe9666] mb-2 shadow-inner">
            <Camera className="w-5 h-5 stroke-[1.5]" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-stone-200">
            {fallbackText}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 line-clamp-1 max-w-[85%] font-light">
            {alt}
          </span>
        </div>
      )}

      {/* Optional Custom Overlay (e.g. Gradients for text legibility) */}
      {overlay}
    </div>
  );
};
