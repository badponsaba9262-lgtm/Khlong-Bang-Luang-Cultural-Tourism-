import React from 'react';
import { Place } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { X, Star, Clock, MapPin, Compass, Navigation, CheckCircle2, Sparkles } from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  onGoToMap: (placeId: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  onGoToMap
}) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#fff8f0] rounded-2xl shadow-2xl border border-[#e8e2d9] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close & Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e2d9] bg-[#fff8f0] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#c3e8ff] text-[#00435c] rounded-full">
              {place.categoryLabel}
            </span>
            <span className="text-xs font-medium text-[#98471d] bg-[#ffdbcd] px-2.5 py-1 rounded-full">
              {place.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#f3ede4] text-[#1d1b16] hover:bg-[#e8e2d9] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Place Image (Single Image) */}
          <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-stone-200 shadow-inner">
            <ImageWithFallback 
              src={place.image} 
              alt={place.name} 
              priority={true}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover"
              fallbackText="ยังไม่มีรูปภาพ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                {place.name}
              </h2>
              <p className="text-sm text-[#ffdbcd] font-medium drop-shadow-xs">
                {place.nameEn}
              </p>
            </div>

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-xs font-bold text-stone-900">{place.rating}</span>
              <span className="text-[11px] text-stone-500">({place.reviewsCount} รีวิว)</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#f9f3ea] rounded-xl border border-[#e8e2d9] text-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#98471d] flex-shrink-0" />
              <div>
                <p className="text-xs text-[#71787e] font-medium">เวลาทำการ</p>
                <p className="font-semibold text-[#1d1b16]">{place.openingHours}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#00435c] flex-shrink-0" />
              <div>
                <p className="text-xs text-[#71787e] font-medium">ระยะทางจาก MRT</p>
                <p className="font-semibold text-[#1d1b16]">{place.distanceFromMRT}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#71787e] font-medium">ค่าเข้าชม / งบประมาณ</p>
                <p className="font-semibold text-[#1d1b16]">{place.fee}</p>
              </div>
            </div>
          </div>

          {/* Detailed Story / History */}
          <div className="space-y-3">
            <h3 className="font-serif-thai text-xl font-bold text-[#00435c] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#98471d]" />
              เรื่องเล่าและประวัติศาสตร์ชุมชน
            </h3>
            <p className="text-sm sm:text-base text-[#40484d] leading-relaxed">
              {place.detailedStory}
            </p>
          </div>

          {/* Highlights Checklist */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[#1d1b16] uppercase tracking-wider">
              กิจกรรมและสิ่งที่ไม่ควรพลาด
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {place.highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#e8e2d9]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00435c] flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#1d1b16] font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Address */}
          <div className="p-4 bg-[#f3ede4] rounded-xl border border-[#e8e2d9] space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#98471d] mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-[#1d1b16]">ที่ตั้ง: </strong>
                <span className="text-[#40484d]">{place.address}</span>
              </div>
            </div>
            {place.recommendedTimeOfDay && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#00435c] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#1d1b16]">ช่วงเวลาที่แนะนำ: </strong>
                  <span className="text-[#40484d]">{place.recommendedTimeOfDay}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-[#f9f3ea] border-t border-[#e8e2d9] flex items-center justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              onGoToMap(place.id);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00435c] text-white text-xs sm:text-sm font-semibold hover:bg-[#1a5b78] shadow-xs transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>ดูตำแหน่งบนแผนที่ & เส้นทาง</span>
          </button>
        </div>
      </div>
    </div>
  );
};
