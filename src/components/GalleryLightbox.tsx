import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Info } from 'lucide-react';
import { GalleryItem } from '../data/homeContent';
import { soundManager } from '../utils/audio';
import { ImageWithFallback } from './ImageWithFallback';

interface GalleryLightboxProps {
  isOpen: boolean;
  currentIndex: number;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  isOpen,
  currentIndex,
  items,
  onClose,
  onNavigate
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          soundManager.playClick();
          onNavigate(currentIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < items.length - 1) {
          soundManager.playClick();
          onNavigate(currentIndex + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || items.length === 0 || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      soundManager.playClick();
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < items.length - 1) {
      soundManager.playClick();
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-[#fe9666]" />
          <span>{currentItem.credit}</span>
          <span className="text-white/40">•</span>
          <span>{currentIndex + 1} / {items.length}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all transform hover:scale-105 pointer-events-auto cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image View */}
      <div 
        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/40 max-h-[70vh] min-h-[300px] w-full flex items-center justify-center">
          <ImageWithFallback
            src={currentItem.src}
            alt={currentItem.title}
            containerClassName="max-h-[68vh] w-auto max-w-full flex items-center justify-center"
            className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl"
            fallbackText="ยังไม่มีรูปภาพ"
          />
        </div>

        {/* Caption & Category Card */}
        <div className="mt-4 bg-stone-900/90 backdrop-blur-md border border-white/15 rounded-xl px-5 py-3 text-center max-w-2xl w-full shadow-lg">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#00435c] text-[#c3e8ff] text-[11px] font-semibold mb-1">
            {currentItem.category}
          </div>
          <h4 className="text-white font-serif-thai text-base sm:text-lg font-bold">
            {currentItem.title}
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-0.5">
            {currentItem.caption}
          </p>
        </div>

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-[#00435c] text-white border border-white/20 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg cursor-pointer z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < items.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-[#00435c] text-white border border-white/20 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg cursor-pointer z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
