import React, { useState, useMemo } from 'react';
import { PLACES } from '../data/mockData';
import { Place } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Grid, 
  List, 
  Navigation,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PlacesScreenProps {
  onSelectPlace: (place: Place) => void;
  onGoToMap: (placeId: string) => void;
  lang: 'th' | 'en';
}

export const PlacesScreen: React.FC<PlacesScreenProps> = ({
  onSelectPlace,
  onGoToMap,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'distance'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', label: 'ทั้งหมด (All)' },
    { id: 'art', label: 'ศิลปะ & หุ่นละครเล็ก' },
    { id: 'temple', label: 'วัด & โบราณสถาน' },
    { id: 'food', label: 'ร้านอาหาร & ของอร่อย' },
    { id: 'craft', label: 'เวิร์กชอป & งานฝีมือ' },
  ];

  const filteredPlaces = useMemo(() => {
    return PLACES.filter(place => {
      const matchesSearch = searchQuery === '' || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      const matchesOpen = !onlyOpenNow || place.isOpenNow;

      return matchesSearch && matchesCategory && matchesOpen;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      return 0;
    });
  }, [searchQuery, selectedCategory, onlyOpenNow, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c3e8ff] text-[#00435c] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#98471d]" />
          <span>ALL DESTINATIONS</span>
        </div>
        <h1 className="font-serif-thai text-3xl sm:text-4xl font-bold text-[#00435c] tracking-tight">
          สถานที่ท่องเที่ยวคลองบางหลวง
        </h1>
        <p className="text-sm text-[#71787e] max-w-2xl leading-relaxed">
          สำรวจบ้านโบราณริมสายน้ำ วัดวาอารามสมัยอยุธยาตอนปลาย แกลเลอรีศิลปะ ร้านอาหารสูตรดั้งเดิม และกิจกรรมเวิร์กชอปงานคราฟต์
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8e2d9] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่, กิจกรรม, หรืออาหาร..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c0c7ce] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00435c] focus:border-[#00435c] bg-[#fff8f0]/40"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  soundManager.playClick();
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Sort & View Options */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={sortBy}
              onChange={(e) => {
                soundManager.playClick();
                setSortBy(e.target.value as any);
              }}
              aria-label="จัดเรียงตาม"
              className="px-3 py-2.5 rounded-xl border border-[#c0c7ce] text-xs font-medium bg-[#fff8f0]/40 text-[#40484d] focus:outline-hidden focus:ring-2 focus:ring-[#00435c]"
            >
              <option value="rating">เรียงตาม: คะแนนรีวิวสูงสุด</option>
              <option value="reviews">เรียงตาม: จำนวนผู้รีวิว</option>
            </select>

            <button
              onClick={() => {
                soundManager.playClick();
                setOnlyOpenNow(!onlyOpenNow);
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                onlyOpenNow 
                  ? 'bg-[#00435c] text-white border-[#00435c]' 
                  : 'bg-[#fff8f0]/40 border-[#c0c7ce] text-[#40484d] hover:bg-[#f3ede4]'
              }`}
            >
              🟢 เปิดอยู่ตอนนี้
            </button>

            {/* Grid / List Toggles */}
            <div className="flex items-center border border-[#c0c7ce] rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('grid');
                }}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#00435c] text-white' : 'bg-[#fff8f0]/40 text-[#71787e] hover:bg-[#f3ede4]'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('list');
                }}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-[#00435c] text-white' : 'bg-[#fff8f0]/40 text-[#71787e] hover:bg-[#f3ede4]'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#f3ede4]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              data-cursor="open"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00435c] text-white shadow-xs'
                  : 'bg-[#f3ede4] text-[#40484d] hover:bg-[#e8e2d9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#71787e] px-1">
        <span>พบ {filteredPlaces.length} สถานที่</span>
        {selectedCategory !== 'all' && (
          <button 
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory('all');
            }} 
            className="text-[#98471d] hover:underline"
          >
            แสดงทั้งหมด
          </button>
        )}
      </div>

      {/* Places List / Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-[#e8e2d9]">
          <p className="text-lg font-bold text-[#00435c]">ไม่พบสถานที่ตามเงื่อนไขที่ค้นหา</p>
          <p className="text-sm text-[#71787e]">ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองหมวดหมู่</p>
          <button
            onClick={() => {
              soundManager.playClick();
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyOpenNow(false);
            }}
            className="px-4 py-2 bg-[#00435c] text-white text-xs font-bold rounded-lg"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            return (
              <div
                key={place.id}
                data-cursor="view"
                className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col group hover:-translate-y-1"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              >
                {/* Image */}
                <div 
                  className="relative h-52 w-full overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPlace(place);
                  }}
                >
                  <ImageWithFallback 
                    src={place.image} 
                    alt={
                      place.id === 'artist-house' || place.id === 'community-bridge' ? "บรรยากาศชุมชนคลองบางหลวง" :
                      place.id === 'wat-kamphaeng' || place.id === 'wat-kuhasawan' ? "วัดในชุมชนคลองบางหลวง" :
                      place.id === 'canal-boat' ? "ท่าเรือคลองบางหลวง" :
                      "บรรยากาศร้านริมคลองบางหลวง"
                    } 
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackText="ยังไม่มีรูปภาพ"
                  />
                  <div className="absolute top-3 left-3 bg-[#00435c]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {place.categoryLabel}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{place.rating}</span>
                    <span className="text-[10px] text-stone-500 font-normal">({place.reviewsCount})</span>
                  </div>

                  {place.tag && (
                    <div className="absolute bottom-3 left-3 bg-[#fe9666] text-[#1d1b16] text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      {place.tag}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 
                      onClick={() => {
                        soundManager.playClick();
                        onSelectPlace(place);
                      }}
                      className="font-serif-thai font-bold text-xl text-[#1d1b16] group-hover:text-[#00435c] transition-colors cursor-pointer"
                    >
                      {place.name}
                    </h3>
                    <p className="text-xs font-medium text-[#98471d]">
                      {place.nameEn}
                    </p>
                    <p className="text-xs text-[#71787e] line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>
                  </div>

                  {/* Highlights Pill Preview */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {place.highlights.slice(0, 2).map((hl, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#f3ede4] text-[#40484d]">
                        ✓ {hl}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Meta */}
                  <div className="pt-3 border-t border-[#f3ede4] flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[#1d1b16] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#98471d]" />
                        <span>{place.openingHours}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#71787e] text-[11px]">
                        <MapPin className="w-3 h-3 text-[#00435c]" />
                        <span className="truncate max-w-[130px]">{place.distanceFromMRT}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onGoToMap(place.id);
                        }}
                        className="p-2 rounded-lg bg-[#f3ede4] text-[#00435c] hover:bg-[#c3e8ff] transition-colors"
                        title="ดูบนแผนที่"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectPlace(place);
                        }}
                        className="px-3 py-2 rounded-lg bg-[#00435c] text-white font-semibold text-xs hover:bg-[#1a5b78] transition-colors"
                      >
                        รายละเอียด
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredPlaces.map((place) => {
            return (
              <div
                key={place.id}
                data-cursor="view"
                className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-xs hover:shadow-md transition-all p-4 flex flex-col sm:flex-row gap-5 items-center group"
              >
                <div 
                  className="relative h-44 w-full sm:w-56 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPlace(place);
                  }}
                >
                  <ImageWithFallback 
                    src={place.image} 
                    alt={
                      place.id === 'artist-house' || place.id === 'community-bridge' ? "บรรยากาศชุมชนคลองบางหลวง" :
                      place.id === 'wat-kamphaeng' || place.id === 'wat-kuhasawan' ? "วัดในชุมชนคลองบางหลวง" :
                      place.id === 'canal-boat' ? "ท่าเรือคลองบางหลวง" :
                      "บรรยากาศร้านริมคลองบางหลวง"
                    } 
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackText="ยังไม่มีรูปภาพ"
                  />
                  <div className="absolute top-2 left-2 bg-[#00435c]/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {place.categoryLabel}
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 
                        onClick={() => {
                          soundManager.playClick();
                          onSelectPlace(place);
                        }}
                        className="font-serif-thai font-bold text-lg text-[#1d1b16] group-hover:text-[#00435c] transition-colors cursor-pointer"
                      >
                        {place.name}
                      </h3>
                      <p className="text-xs text-[#98471d]">{place.nameEn}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-900 bg-[#f3ede4] px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{place.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#71787e] line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[#98471d] font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {place.openingHours}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onGoToMap(place.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#f3ede4] text-[#00435c] hover:bg-[#c3e8ff] transition-colors"
                      >
                        แผนที่
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectPlace(place);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00435c] text-white font-semibold hover:bg-[#1a5b78] transition-colors"
                      >
                        รายละเอียด
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
