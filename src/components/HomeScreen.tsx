import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Place } from '../types';
import { PLACES } from '../data/mockData';
import { siteImages } from '../data/siteImages';
import { ImageWithFallback } from './ImageWithFallback';
import { homeContent, HomeAttraction } from '../data/homeContent';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { soundManager } from '../utils/audio';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Play, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Glasses,
  Search,
  Camera,
  Navigation,
  Train,
  Ship,
  Footprints,
  Car,
  Heart,
  ArrowDown,
  Info
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
  onSelectPlace: (place: Place) => void;
  lang: 'th' | 'en';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectPlace,
  lang
}) => {
  // Search and Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useScrollReveal(activeCategory);

  // Parallax mouse position state (desktop only)
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (isReduced || !isDesktop) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      targetY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMouseOffset({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Track scroll position for cinematic Hero zoom & fade
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter Categories for Attractions
  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'art', label: 'ศิลปะ & หุ่นละครเล็ก' },
    { id: 'temple', label: 'วัด & โบราณสถาน' },
    { id: 'community', label: 'วิถีชีวิต & ชุมชน' },
    { id: 'boat', label: 'การสัญจรทางน้ำ' }
  ];

  // Filter Attractions based on search and category
  const filteredAttractions = useMemo(() => {
    return homeContent.attractions.filter(item => {
      const matchesSearch = 
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCategory = true;
      if (activeCategory === 'art') matchesCategory = item.id === 'artist-house';
      else if (activeCategory === 'temple') matchesCategory = item.id === 'wat-kamphaeng';
      else if (activeCategory === 'community') matchesCategory = item.id === 'community-bridge';
      else if (activeCategory === 'boat') matchesCategory = item.id === 'canal-boat';

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Handle open place modal
  const handleOpenPlaceDetail = (attraction: HomeAttraction) => {
    soundManager.playClick();
    const matchedPlace = PLACES.find(p => p.id === attraction.placeRefId) || PLACES[0];
    onSelectPlace(matchedPlace);
  };

  // Calculate Hero transformations
  const heroZoom = Math.min(1.05 + scrollY * 0.0003, 1.2);
  const heroContentTranslate = Math.max(-scrollY * 0.25, -120);
  const heroContentOpacity = Math.max(1 - scrollY / 450, 0);
  const scrollIndicatorOpacity = Math.max(1 - scrollY / 120, 0);

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 overflow-hidden">
      
      {/* 1. CINEMATIC HERO with Mouse Parallax & Scroll Zoom */}
      <section 
        ref={heroRef}
        className="relative overflow-hidden bg-[#002837] text-white min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center"
      >
        {/* Parallax Background Layer (Slow Movement + Scroll Zoom) */}
        <div 
          className="absolute inset-0 z-0 will-change-transform transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * 16}px, ${mouseOffset.y * 16}px, 0) scale(${heroZoom})`
          }}
        >
          <ImageWithFallback 
            src={siteImages.hero.home} 
            alt="ภาพหน้าปกคลองบางหลวง Khlong Bang Luang" 
            priority={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center filter brightness-95"
            fallbackText="ยังไม่มีรูปภาพ"
            overlay={
              <>
                {/* Cinematic lighting gradients with enhanced image clarity */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#001c27]/90 via-[#002837]/60 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00141c]/90 via-transparent to-black/20" />
              </>
            }
          />
        </div>

        {/* Ambient Warm Blur Accents */}
        <div 
          className="absolute top-1/4 right-1/4 w-36 h-36 rounded-full bg-[#fe9666]/15 blur-3xl pointer-events-none"
          style={{ transform: `translate3d(${mouseOffset.x * -24}px, ${mouseOffset.y * -24}px, 0)` }}
        />
        <div 
          className="absolute bottom-1/3 left-1/5 w-44 h-44 rounded-full bg-[#95ceef]/15 blur-3xl pointer-events-none"
          style={{ transform: `translate3d(${mouseOffset.x * -18}px, ${mouseOffset.y * -18}px, 0)` }}
        />

        {/* Hero Foreground Content Layer */}
        <div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 will-change-transform"
          style={{
            transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 6 + heroContentTranslate}px, 0)`,
            opacity: heroContentOpacity
          }}
        >
          <div className="max-w-3xl space-y-6">
            
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00435c]/80 backdrop-blur-md border border-[#95ceef]/30 text-[#c3e8ff] text-xs sm:text-sm font-medium shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#fe9666]" />
                <span>มรดกสายน้ำแห่งประวัติศาสตร์กรุงธนบุรี</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 text-stone-300 text-xs border border-white/10">
                <Camera className="w-3 h-3 text-[#fe9666]" />
                <span>ภาพถ่ายจริง: ผู้จัดทำ</span>
              </div>
            </div>

            {/* Main Title & Headline */}
            <h1 className="font-serif-thai text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.18] text-white drop-shadow-md">
              คลองบางหลวง <br className="hidden sm:inline" />
              <span className="text-[#fe9666]">มรดกสายน้ำและวิถีชีวิต</span> ริมคลองแห่งฝั่งธนบุรี
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#c3e8ff] leading-relaxed max-w-2xl font-light drop-shadow-xs">
              {homeContent.siteInfo.tagline} ร่วมย้อนรอยประวัติศาสตร์ ชมการแสดงหุ่นละครเล็กโบราณ สัมผัสความสงบร่มเย็น และการสัญจรทางเรือที่ยังคงมีชีวิตชีวา
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="hero-explore-btn"
                onClick={() => {
                  soundManager.playClick();
                  const target = document.getElementById('attractions-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onNavigate('places');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#fe9666] text-[#1d1b16] font-bold text-sm sm:text-base hover:bg-[#ffb596] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Compass className="w-5 h-5" />
                <span>สำรวจสถานที่ท่องเที่ยว</span>
              </button>

              <button
                id="hero-map-btn"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('map');
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#00435c] text-white border border-[#95ceef]/40 font-bold text-sm sm:text-base hover:bg-[#003448] shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-[#fe9666]" />
                <span>แผนที่และการเดินทาง</span>
              </button>

              <button
                id="hero-360-btn"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('video360');
                }}
                className="flex items-center gap-2 px-4 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all cursor-pointer backdrop-blur-xs border border-white/15"
              >
                <Glasses className="w-4 h-4 text-[#95ceef]" />
                <span>วิดีโอ 360°</span>
              </button>
            </div>

            {/* 4 Feature Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl border-t border-white/15">
              {homeContent.siteInfo.badges.map((badge, idx) => (
                <div key={idx} className="bg-black/35 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/10 text-xs text-[#c3e8ff] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9666]"></span>
                  <span className="truncate">{badge}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Hero Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-opacity duration-300"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-[11px] font-medium tracking-wider text-[#c3e8ff]/80 mb-1 font-sans">
            เลื่อนลงเพื่อสำรวจ
          </span>
          <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center animate-bounce">
            <ArrowDown className="w-3.5 h-3.5 text-[#fe9666]" />
          </div>
        </div>
      </section>

      {/* 2. SEARCH & QUICK FILTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาสถานที่ เช่น บ้านศิลปิน, วัดกำแพง, ชุมชน, เรือหางยาว..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00435c] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5 rounded bg-stone-100"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* Quick Filter Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#00435c] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE HIGHLIGHT ATTRACTIONS SECTION */}
      <section id="attractions-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 reveal-item">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#98471d] font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#fe9666]" />
              <span>CORE ATTRACTIONS</span>
            </div>
            <h2 className="font-serif-thai text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00435c]">
              สถานที่ท่องเที่ยวไฮไลต์ที่ไม่ควรพลาด
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              คัดสรร 4 แหล่งท่องเที่ยวเชิงวัฒนธรรมสำคัญริมคลองบางหลวง พร้อมข้อมูลเวลาเปิด-ปิด และจุดเด่นที่แท้จริง
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('places');
            }}
            className="text-xs sm:text-sm font-semibold text-[#00435c] hover:text-[#002f41] flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>ดูสถานที่ทั้งหมด</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Attractions Grid - Editorial Card Design */}
        {filteredAttractions.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-12 text-center space-y-3 border border-stone-200">
            <Compass className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif-thai text-lg font-bold text-stone-700">ไม่พบสถานที่ที่ตรงกับการค้นหา</h3>
            <p className="text-xs text-stone-500">ลองเปลี่ยนคำค้นหา หรือคลิกดูหมวดหมู่อื่น</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-full bg-[#00435c] text-white text-xs font-semibold"
            >
              แสดงสถานที่ทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredAttractions.map((attraction) => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container with Zoom & Real Attribution */}
                  <div 
                    className="relative h-60 sm:h-64 w-full overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => handleOpenPlaceDetail(attraction)}
                  >
                    <ImageWithFallback
                      src={attraction.image}
                      alt={
                        attraction.id === 'artist-house' ? "บรรยากาศชุมชนคลองบางหลวง" :
                        attraction.id === 'wat-kamphaeng' ? "วัดในชุมชนคลองบางหลวง" :
                        attraction.id === 'canal-boat' ? "ท่าเรือคลองบางหลวง" :
                        "บรรยากาศร้านริมคลองบางหลวง"
                      }
                      lazy={true}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      fallbackText="ยังไม่มีรูปภาพ"
                      overlay={
                        <>
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Category Tag */}
                          <div className="absolute top-3.5 left-3.5 bg-[#00435c]/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                            {attraction.categoryTag}
                          </div>

                          {/* Image Credit Badge */}
                          <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-xs text-stone-200 text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
                            <Camera className="w-3 h-3 text-[#fe9666]" />
                            <span>ภาพถ่ายจริง: ต้นฉบับ</span>
                          </div>

                          {/* Bottom Info on Image */}
                          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                            <span className="flex items-center gap-1.5 font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                              <Clock className="w-3.5 h-3.5 text-[#fe9666]" />
                              {attraction.time}
                            </span>

                            <span className="text-[11px] font-semibold text-[#c3e8ff] bg-[#00435c]/80 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                              คลิกดูข้อมูล
                            </span>
                          </div>
                        </>
                      }
                    />
                  </div>

                  {/* Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 
                            onClick={() => handleOpenPlaceDetail(attraction)}
                            className="font-serif-thai font-bold text-xl sm:text-2xl text-[#00435c] group-hover:text-[#fe9666] transition-colors cursor-pointer"
                          >
                            {attraction.name}
                          </h3>
                          <p className="text-xs text-stone-500 font-sans mt-0.5">
                            {attraction.nameEn}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                        {attraction.description}
                      </p>

                      {/* Puppet show time or special notice */}
                      {attraction.showTime && (
                        <div className="p-2.5 rounded-xl bg-[#ffdbcd]/30 border border-[#fe9666]/30 text-xs text-[#98471d] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#fe9666] shrink-0" />
                          <span className="font-semibold">{attraction.showTime}</span>
                        </div>
                      )}

                      {/* Verified Highlights */}
                      <div className="pt-2 space-y-1.5">
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                          จุดเด่นสำคัญ:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {attraction.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-stone-700">
                              <span className="text-[#00435c] font-bold">•</span>
                              <span className="leading-snug">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleOpenPlaceDetail(attraction)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-[#00435c] text-stone-800 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>อ่านข้อมูลเพิ่มเติม</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onNavigate('map');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#00435c] hover:bg-[#c3e8ff]/40 transition-all cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#98471d]" />
                        <span>ดูตำแหน่งในแผนที่</span>
                      </button>
                    </div>

                  </div>
                </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. 360° VR & MULTIMEDIA FEATURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-item">
        <div className="bg-gradient-to-br from-[#002837] via-[#003448] to-[#001c27] rounded-3xl text-white p-6 sm:p-10 border border-[#00435c] shadow-xl overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdbcd] text-[#98471d] text-xs font-bold">
                <Glasses className="w-4 h-4" />
                <span>360° VR & MULTIMEDIA EXPERIENCE</span>
              </div>
              <h2 className="font-serif-thai text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                เปิดมุมมองรอบทิศทาง 360 องศา <br />
                <span className="text-[#fe9666]">สัมผัสบรรยากาศสายน้ำคลองบางหลวง</span>
              </h2>
              <p className="text-sm sm:text-base text-[#c3e8ff] leading-relaxed max-w-xl font-light">
                ชมวิดีโอ 360° เสมือนจริงรอบทิศทาง (VR) สัมผัสสายน้ำ เรือนไม้โบราณ และวิถีชีวิตริมคลองบางหลวงอย่างใกล้ชิด
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate('video360');
                  }}
                  className="px-6 py-3 rounded-full bg-[#fe9666] text-[#1d1b16] font-bold text-sm hover:bg-[#ffb596] shadow-md transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Glasses className="w-4 h-4" />
                  <span>เข้าสู่ห้องวิดีโอ 360° VR</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div 
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('video360');
                }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-video group cursor-pointer"
              >
                <ImageWithFallback 
                  src="/images/vr/thumb-video-1.jpg" 
                  alt="วิดีโอ 360 บรรยากาศชุมชนคลองบางหลวง" 
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackText="ยังไม่มีรูปภาพ"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#fe9666] text-[#1d1b16] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs text-white flex items-center justify-between">
                  <span className="font-semibold truncate">วิดีโอและสารคดีชุมชนคลองบางหลวง</span>
                  <span className="text-[10px] text-[#fe9666] font-mono font-bold">360° VR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRAVEL GUIDE & MAP PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 reveal-item">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#98471d] font-semibold text-xs uppercase tracking-wider mb-1">
              <Navigation className="w-4 h-4 text-[#fe9666]" />
              <span>HOW TO GET THERE</span>
            </div>
            <h2 className="font-serif-thai text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00435c]">
              การเดินทางสู่คลองบางหลวง
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              เดินทางสะดวกด้วยหลากหลายรูปแบบ ทั้งรถไฟฟ้า MRT เรือหางยาว และทางเดินเท้าเลียบคลอง
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('map');
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#00435c] text-white text-xs font-semibold hover:bg-[#002f41] transition-all cursor-pointer self-start md:self-auto"
          >
            <MapPin className="w-4 h-4 text-[#fe9666]" />
            <span>เปิดแผนที่แบบโต้ตอบ (Interactive Map)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Transport Options Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeContent.travelGuide.map((item, index) => {
            const getIcon = () => {
              switch (item.iconName) {
                case 'train': return <Train className="w-6 h-6 text-[#00435c]" />;
                case 'boat': return <Ship className="w-6 h-6 text-[#00435c]" />;
                case 'car': return <Car className="w-6 h-6 text-[#00435c]" />;
                case 'foot': return <Footprints className="w-6 h-6 text-[#00435c]" />;
                default: return <MapPin className="w-6 h-6 text-[#00435c]" />;
              }
            };

            return (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="w-12 h-12 rounded-xl bg-[#c3e8ff]/50 flex items-center justify-center">
                    {getIcon()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 font-serif-thai">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#98471d] font-medium mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg">
                  💡 <strong className="text-stone-700">ข้อแนะนำ:</strong> {item.tips}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
