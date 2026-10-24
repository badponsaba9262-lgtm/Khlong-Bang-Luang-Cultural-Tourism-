import React, { useState, useMemo } from 'react';
import { siteContent, GalleryPhoto, ArticleItem, IdentityCard } from '../data/cultureContent';
import { siteImages } from '../data/siteImages';
import { ImageWithFallback } from './ImageWithFallback';
import { soundManager } from '../utils/audio';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  Search, 
  Calendar, 
  ExternalLink, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  FileText, 
  BookmarkCheck,
  Layers,
  HeartHandshake,
  Compass,
  Maximize2
} from 'lucide-react';

interface CultureScreenProps {
  lang: 'th' | 'en';
}

export const CultureScreen: React.FC<CultureScreenProps> = ({ lang }) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('all');

  // Article Reader State
  const [selectedArticleId, setSelectedArticleId] = useState<string>(siteContent.articles[0].id);

  // Gallery Filter State
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Gallery categories list
  const galleryCategories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'canal', label: 'คลอง' },
    { id: 'houses', label: 'บ้านเรือน' },
    { id: 'community', label: 'ชุมชน' },
    { id: 'art', label: 'ศิลปะ' },
    { id: 'activity', label: 'กิจกรรม' },
    { id: 'places', label: 'สถานที่' },
    { id: 'food', label: 'อาหาร' },
    { id: 'people', label: 'ผู้คน' }
  ];

  // Filtered gallery items
  const filteredGallery = useMemo(() => {
    if (selectedGalleryCategory === 'all') return siteContent.gallery;
    return siteContent.gallery.filter(item => item.category === selectedGalleryCategory);
  }, [selectedGalleryCategory]);

  // Active article
  const activeArticle = useMemo(() => {
    return siteContent.articles.find(a => a.id === selectedArticleId) || siteContent.articles[0];
  }, [selectedArticleId]);

  // Lightbox navigation handlers
  const handleOpenLightbox = (index: number) => {
    soundManager.playClick();
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    soundManager.playClick();
    setLightboxIndex(null);
  };

  const handlePrevLightbox = () => {
    soundManager.playClick();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  const handleNextLightbox = () => {
    soundManager.playClick();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
  };

  // Search filtering logic across content
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const showSection = (sectionKey: string) => {
    if (activeSectionFilter === 'all') return true;
    return activeSectionFilter === sectionKey;
  };

  return (
    <div className="space-y-16 pb-24 text-[#1d1b16]">
      
      {/* 7. HERO SECTION (University Project & Verified Cultural Focus) */}
      <section className="relative overflow-hidden bg-[#00435c] text-white">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src={siteContent.siteInfo.heroImage} 
            alt={siteContent.siteInfo.heroTitle} 
            priority={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center filter brightness-75 contrast-105"
            fallbackText="ยังไม่มีรูปภาพ"
            overlay={
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-[#002636]/95 via-[#00435c]/85 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001d29] via-transparent to-black/30" />
              </>
            }
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c3e8ff]/20 backdrop-blur-md border border-[#c3e8ff]/30 text-[#c3e8ff] text-xs font-semibold">
            <BookmarkCheck className="w-4 h-4 text-[#fe9666]" />
            <span>{siteContent.siteInfo.projectName}</span>
          </div>

          <h1 className="font-serif-thai text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] text-white drop-shadow-md max-w-4xl">
            {siteContent.siteInfo.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-[#c3e8ff] max-w-2xl leading-relaxed font-light drop-shadow-xs">
            {siteContent.siteInfo.heroSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#c3e8ff]/80">
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/10">
              <Camera className="w-3.5 h-3.5 text-[#fe9666]" />
              {siteContent.siteInfo.heroImageCredit}
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/10">
              <FileText className="w-3.5 h-3.5 text-[#95ceef]" />
              ข้อมูลผ่านการตรวจสอบเชิงประวัติศาสตร์และภาคสนาม
            </span>
          </div>
        </div>
      </section>

      {/* 18. SEARCH & FILTER TOOLBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8e2d9] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#71787e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาข้อมูลประวัติศาสตร์, วิถีชีวิต, ศิลปะ, หุ่นละครเล็ก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c0c7ce] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00435c] bg-[#fff8f0]/40"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71787e] hover:text-[#1d1b16]"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* Quick Section Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'เนื้อหาทั้งหมด' },
                { id: 'history', label: 'ประวัติชุมชน' },
                { id: 'lifestyle', label: 'วิถีชีวิต' },
                { id: 'culture', label: 'ศิลปวัฒนธรรม' },
                { id: 'identity', label: '6 อัตลักษณ์' },
                { id: 'timeline', label: 'ไทม์ไลน์' },
                { id: 'articles', label: 'บทความ' },
                { id: 'gallery', label: 'คลังภาพถ่าย' },
                { id: 'sources', label: 'แหล่งอ้างอิง' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveSectionFilter(filter.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeSectionFilter === filter.id
                      ? 'bg-[#00435c] text-white shadow-xs'
                      : 'bg-[#f3ede4] text-[#40484d] hover:bg-[#e8e2d9]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 8. SECTION: ประวัติชุมชนคลองบางหลวง */}
      {showSection('history') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="border-l-4 border-[#00435c] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
              HISTORICAL BACKGROUND
            </span>
            <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
              {siteContent.history.title}
            </h2>
            <p className="text-sm text-[#71787e]">
              {siteContent.history.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6">
            <p className="text-sm sm:text-base leading-relaxed text-[#40484d] font-normal border-b border-[#f3ede4] pb-6">
              {siteContent.history.overview}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {siteContent.history.keyPoints
                .filter(pt => matchesSearch(pt.topic) || matchesSearch(pt.detail))
                .map((point, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-[#fff8f0] border border-[#e8e2d9] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#00435c] text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="font-serif-thai font-bold text-base text-[#00435c]">
                        {point.topic}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#40484d] leading-relaxed">
                      {point.detail}
                    </p>
                    <div className="pt-2 border-t border-[#e8e2d9] flex items-center gap-1.5 text-[11px] text-[#98471d] font-medium">
                      <FileText className="w-3.5 h-3.5" />
                      <span>ที่มา: {point.source}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. SECTION: วิถีชีวิตริมคลอง */}
      {showSection('lifestyle') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="border-l-4 border-[#98471d] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
              WATERFRONT LIFESTYLE
            </span>
            <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
              {siteContent.lifestyle.title}
            </h2>
            <p className="text-sm text-[#71787e]">
              {siteContent.lifestyle.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs">
            <div className="lg:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-[#e8e2d9] aspect-4/3 group">
                <ImageWithFallback 
                  src={siteContent.lifestyle.image} 
                  alt="บรรยากาศชุมชนคลองบางหลวง" 
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackText="ยังไม่มีรูปภาพ"
                  overlay={
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-sm pointer-events-none">
                      {siteContent.lifestyle.imageCredit}
                    </div>
                  }
                />
              </div>
              <p className="text-xs text-[#71787e] italic text-center">
                บรรยากาศระเบียงไม้และท่าน้ำ จุดเชื่อมต่อความผูกพันของชุมชนริมคลอง
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteContent.lifestyle.aspects
                .filter(a => matchesSearch(a.title) || matchesSearch(a.description))
                .map((aspect, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] space-y-2">
                    <h3 className="font-serif-thai font-bold text-sm sm:text-base text-[#1d1b16]">
                      {aspect.title}
                    </h3>
                    <p className="text-xs text-[#40484d] leading-relaxed">
                      {aspect.description}
                    </p>
                    <span className="text-[10px] text-[#98471d] font-medium block pt-1">
                      อ้างอิง: {aspect.source}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. SECTION: ศิลปะและวัฒนธรรม */}
      {showSection('culture') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="border-l-4 border-[#563800] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
              ARTS & LIVING HERITAGE
            </span>
            <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
              {siteContent.culture.title}
            </h2>
            <p className="text-sm text-[#71787e]">
              {siteContent.culture.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteContent.culture.pillars
              .filter(p => matchesSearch(p.title) || matchesSearch(p.description))
              .map((pillar, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e8e2d9] space-y-3 flex flex-col justify-between shadow-xs hover:border-[#00435c] transition-colors">
                  <div className="space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-[#c3e8ff] text-[#00435c] font-bold text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="font-serif-thai font-bold text-base text-[#00435c]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#71787e] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#f3ede4] text-[10px] text-[#98471d] font-medium">
                    แหล่งอ้างอิง: {pillar.source}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 11. SECTION: อัตลักษณ์ชุมชน (Card 6 ใบ) */}
      {showSection('identity') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
              COMMUNITY IDENTITY PILLARS
            </span>
            <h2 className="font-serif-thai text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00435c]">
              6 อัตลักษณ์สำคัญของคลองบางหลวง
            </h2>
            <p className="text-xs sm:text-sm text-[#71787e]">
              องค์ประกอบมรดกทางวัฒนธรรมที่สะท้อนผ่านสายน้ำ บ้านเรือน ศิลปะ ผู้คน วิถีชีวิต และชุมชน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteContent.identityCards
              .filter(card => matchesSearch(card.title) || matchesSearch(card.description))
              .map((card) => (
                <div 
                  key={card.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <ImageWithFallback 
                      src={card.image} 
                      alt={card.title} 
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackText="ยังไม่มีรูปภาพ"
                      overlay={
                        <>
                          <div className="absolute top-3 left-3 bg-[#00435c] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs pointer-events-none">
                            อัตลักษณ์ที่ {card.number}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-sm pointer-events-none">
                            {card.imageCredit}
                          </div>
                        </>
                      }
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif-thai font-bold text-xl text-[#00435c]">
                        {card.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#98471d]">
                        {card.subtitle}
                      </p>
                      <p className="text-xs text-[#71787e] leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#f3ede4] space-y-1.5">
                      <span className="text-[11px] font-bold text-[#40484d] block">
                        องค์ประกอบสำคัญ:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {card.keyAspects.map((aspect, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#fff8f0] text-[#00435c] border border-[#e8e2d9]">
                            • {aspect}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 12. TIMELINE: ไทม์ไลน์ประวัติศาสตร์ที่ตรวจสอบได้ */}
      {showSection('timeline') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="border-l-4 border-[#00435c] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
              VERIFIED CHRONOLOGY
            </span>
            <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
              เส้นทางเวลาประวัติศาสตร์และพัฒนาการ
            </h2>
            <p className="text-sm text-[#71787e]">
              ลำดับเหตุการณ์สำคัญที่มีหลักฐานทางประวัติศาสตร์และงานวิชาการรองรับ
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {siteContent.timeline
                .filter(t => matchesSearch(t.period) || matchesSearch(t.title) || matchesSearch(t.description))
                .map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#fff8f0] border border-[#e8e2d9] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#00435c] text-white">
                        {item.period}
                      </span>
                      <h3 className="font-serif-thai font-bold text-base text-[#1d1b16]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#71787e] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#e8e2d9] text-[11px] text-[#98471d] font-medium flex items-center gap-1">
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>{item.source}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 13. ARTICLES: บทความวิชาการเพื่อการเรียนรู้ */}
      {showSection('articles') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="border-l-4 border-[#98471d] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
              ACADEMIC READINGS
            </span>
            <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
              บทความการเรียนรู้ชุมชนคลองบางหลวง
            </h2>
            <p className="text-sm text-[#71787e]">
              ข้อค้นพบและเนื้อหาเรียบเรียงใหม่โดยผู้จัดทำโครงงาน จากการสำรวจพื้นที่และเอกสารอ้างอิง
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Article Index Buttons */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider block">
                เลือกอ่านบทความ
              </span>
              <div className="space-y-2">
                {siteContent.articles.map((article) => {
                  const isSelected = selectedArticleId === article.id;
                  return (
                    <button
                      key={article.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedArticleId(article.id);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'bg-white border-[#00435c] shadow-md ring-2 ring-[#00435c]/20' 
                          : 'bg-[#f9f3ea] border-[#e8e2d9] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#71787e] mb-1">
                        <span className="font-semibold text-[#98471d]">{article.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className={`font-serif-thai font-bold text-sm ${isSelected ? 'text-[#00435c]' : 'text-[#1d1b16]'}`}>
                        {article.title}
                      </h3>
                      <p className="text-xs text-[#71787e] line-clamp-2 mt-1">
                        {article.summary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Article Detail View */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e2d9] shadow-xs space-y-6">
              <div className="space-y-2 border-b border-[#f3ede4] pb-6">
                <div className="flex items-center gap-2 text-xs text-[#98471d] font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>หมวด: {activeArticle.category}</span>
                  <span>•</span>
                  <span>เวลาในการอ่านประมาณ {activeArticle.readTime}</span>
                </div>
                <h3 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c] leading-snug">
                  {activeArticle.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#71787e] italic">
                  {activeArticle.summary}
                </p>
              </div>

              {/* Article Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-[#40484d] leading-relaxed">
                {activeArticle.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Source Reference Tag */}
              <div className="pt-6 border-t border-[#f3ede4] flex items-center justify-between text-xs text-[#71787e] bg-[#fff8f0] p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-[#00435c]" />
                  <span className="font-medium text-[#1d1b16]">แหล่งอ้างอิง: {activeArticle.sourceReference}</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 14. PHOTO GALLERY & LIGHTBOX */}
      {showSection('gallery') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="border-l-4 border-[#00435c] pl-4 space-y-1">
              <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
                DOCUMENTARY PHOTO GALLERY
              </span>
              <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
                คลังภาพถ่ายสารคดีชุมชน
              </h2>
              <p className="text-sm text-[#71787e]">
                บันทึกภาพถ่ายจริงในพื้นที่โดยผู้จัดทำโครงงาน (คลิกเพื่อเปิดดูภาพขนาดเต็ม)
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {galleryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGalleryCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedGalleryCategory === cat.id
                      ? 'bg-[#00435c] text-white shadow-xs'
                      : 'bg-[#f3ede4] text-[#40484d] hover:bg-[#e8e2d9]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((photo, index) => (
              <div 
                key={photo.id}
                onClick={() => handleOpenLightbox(index)}
                className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col hover:-translate-y-1"
              >
                <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                  <ImageWithFallback 
                    src={photo.image} 
                    alt={photo.title} 
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackText="ยังไม่มีรูปภาพ"
                    overlay={
                      <>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="w-10 h-10 rounded-full bg-white/90 text-[#00435c] flex items-center justify-center shadow-lg">
                            <Maximize2 className="w-5 h-5" />
                          </span>
                        </div>
                        <div className="absolute top-2 left-2 bg-[#00435c]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full pointer-events-none">
                          {photo.categoryLabel}
                        </div>
                      </>
                    }
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-serif-thai font-bold text-sm text-[#1d1b16] group-hover:text-[#00435c] transition-colors line-clamp-1">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-[#71787e] line-clamp-2 mt-1">
                      {photo.caption}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#f3ede4] text-[10px] text-[#98471d] font-medium flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>{photo.credit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SECTION: แหล่งข้อมูลอ้างอิง (Bibliography) */}
      {showSection('sources') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          <div className="border-l-4 border-[#00435c] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#98471d] uppercase tracking-wider">
              REFERENCES & CITATIONS
            </span>
            <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
              แหล่งข้อมูลอ้างอิง
            </h2>
            <p className="text-sm text-[#71787e]">
              เอกสารประวัติศาสตร์ ฐานข้อมูลหน่วยงานรัฐ และการสำรวจข้อมูลภาคสนามโดยผู้จัดทำโครงงาน
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteContent.sources.map((src) => (
                <div key={src.id} className="p-4 rounded-xl bg-[#fff8f0] border border-[#e8e2d9] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif-thai font-bold text-sm text-[#00435c]">
                      {src.title}
                    </h3>
                    {src.url && (
                      <a 
                        href={src.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#98471d] hover:text-[#00435c]"
                        title="เปิดลิงก์ภายนอก"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-[#71787e]">
                    <span className="font-semibold text-[#40484d]">หน่วยงาน / ผู้เผยแพร่:</span> {src.publisher}
                  </p>
                  {src.publishedDate && (
                    <p className="text-[11px] text-[#71787e]">
                      <span className="font-semibold text-[#40484d]">ช่วงเวลา:</span> {src.publishedDate}
                    </p>
                  )}
                  {src.note && (
                    <p className="text-[11px] text-[#98471d] font-medium pt-1 border-t border-[#e8e2d9]/60">
                      {src.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#e8e2d9] text-xs text-[#71787e] leading-relaxed flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#00435c] flex-shrink-0" />
              <span>
                หมายเหตุ: หากข้อมูลในหัวข้อใดอยู่ระหว่างการสืบค้นเพิ่มเติม จะแสดงข้อความ <strong>"อยู่ระหว่างการจัดเตรียมข้อมูลอ้างอิง"</strong> เพื่อความถูกต้องตามหลักวิชาการ
              </span>
            </div>
          </div>
        </section>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={handleCloseLightbox}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-white/20 font-mono">
                {lightboxIndex + 1} / {filteredGallery.length}
              </span>
              <span className="text-white/80 hidden sm:inline">
                {filteredGallery[lightboxIndex].categoryLabel}
              </span>
            </div>

            <button
              onClick={handleCloseLightbox}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image & Controls */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-2" onClick={(e) => e.stopPropagation()}>
            {/* Prev Button */}
            <button
              onClick={handlePrevLightbox}
              className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div className="max-h-[70vh] sm:max-h-[76vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 w-full min-h-[300px]">
              <ImageWithFallback 
                src={filteredGallery[lightboxIndex].image} 
                alt={filteredGallery[lightboxIndex].title} 
                containerClassName="max-h-[70vh] sm:max-h-[76vh] w-auto max-w-full flex items-center justify-center"
                className="max-h-[70vh] sm:max-h-[76vh] w-auto max-w-full object-contain select-none"
                fallbackText="ยังไม่มีรูปภาพ"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextLightbox}
              className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption & Credit Footer */}
          <div className="max-w-4xl mx-auto w-full text-center text-white space-y-1 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 z-10" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-serif-thai font-bold text-base sm:text-lg text-[#fe9666]">
              {filteredGallery[lightboxIndex].title}
            </h4>
            <p className="text-xs sm:text-sm text-[#c3e8ff] max-w-2xl mx-auto">
              {filteredGallery[lightboxIndex].caption}
            </p>
            <div className="text-[11px] text-white/60 pt-1">
              เครดิต: {filteredGallery[lightboxIndex].credit}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
