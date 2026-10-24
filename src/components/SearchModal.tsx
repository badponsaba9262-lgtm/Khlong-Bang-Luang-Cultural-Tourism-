import React, { useState } from 'react';
import { PLACES, CULTURAL_ARTICLES, TOUR_ROUTES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { Place } from '../types';
import { Search, X, MapPin, BookOpen, Compass, ChevronRight, Glasses } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
  onNavigateTab: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedPlaces = query.trim() ? PLACES.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.highlights.some(h => h.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const matchedArticles = query.trim() ? CULTURAL_ARTICLES.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const matches360 = query.trim() && (
    '360'.includes(query.toLowerCase()) ||
    'vr'.includes(query.toLowerCase()) ||
    'วิดีโอ 360'.includes(query.toLowerCase()) ||
    'รอบทิศทาง'.includes(query.toLowerCase()) ||
    'สายน้ำ'.includes(query.toLowerCase())
  );

  const totalResults = matchedPlaces.length + matchedArticles.length + (matches360 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#fff8f0] rounded-2xl shadow-2xl border border-[#e8e2d9] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-[#e8e2d9] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#00435c]" />
          <input
            type="text"
            placeholder="ค้นหาสถานที่, หุ่นละครเล็ก, วัดโบราณ, ของกินริมน้ำ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base bg-transparent focus:outline-hidden text-[#1d1b16] placeholder:text-[#71787e]"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f3ede4] text-[#71787e]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query.trim() ? (
            <div className="py-8 text-center space-y-2 text-[#71787e] text-xs sm:text-sm">
              <p className="font-semibold text-[#00435c]">คำค้นหายอดนิยม:</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['บ้านศิลปิน', 'บ้านพึ่งศิลป์', 'หุ่นละครเล็ก', 'วิดีโอ 360', 'วัดกำแพงบางจาก', 'ครัวคุณอ๋อย', 'สะพานไม้'].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-xs font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-[#71787e] text-sm">
              ไม่พบผลลัพธ์ที่ตรงกับ "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* 360 Video match */}
              {matches360 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#00435c] uppercase tracking-wider flex items-center gap-1.5">
                    <Glasses className="w-3.5 h-3.5 text-[#fe9666]" />
                    วิดีโอ 360 องศา เสมือนจริง (VR)
                  </span>
                  <div
                    onClick={() => {
                      onNavigateTab('video360');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-gradient-to-r from-[#00435c] to-[#002f41] text-white cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:brightness-110 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#fe9666] text-[#1d1b16] flex items-center justify-center font-bold flex-shrink-0">
                        <Glasses className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif-thai font-bold text-sm text-white truncate">
                          วิดีโอ 360° VR คลองบางหลวง
                        </h4>
                        <p className="text-xs text-[#c3e8ff] truncate">
                          เปิดมุมมองรอบทิศทาง 360 องศา สัมผัสสายน้ำและวิถีชุมชนริมคลองบางหลวง
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#fe9666] flex-shrink-0" />
                  </div>
                </div>
              )}

              {/* Places Results */}
              {matchedPlaces.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#98471d] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    สถานที่ท่องเที่ยว ({matchedPlaces.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedPlaces.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => {
                          onSelectPlace(place);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#f3ede4] border border-[#e8e2d9] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ImageWithFallback 
                            src={place.image} 
                            alt={place.name} 
                            containerClassName="w-12 h-12 rounded-lg flex-shrink-0"
                            className="w-full h-full object-cover"
                            fallbackText="ไม่มีรูป"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif-thai font-bold text-sm text-[#1d1b16] truncate">
                              {place.name}
                            </h4>
                            <p className="text-xs text-[#71787e] truncate">{place.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#71787e] flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Results */}
              {matchedArticles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#563800] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    บทความวัฒนธรรม ({matchedArticles.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedArticles.map((article) => (
                      <div
                        key={article.id}
                        onClick={() => {
                          onNavigateTab('culture');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#f3ede4] border border-[#e8e2d9] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-serif-thai font-bold text-sm text-[#1d1b16] truncate">
                            {article.title}
                          </h4>
                          <p className="text-xs text-[#71787e] truncate">{article.subtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#71787e] flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
