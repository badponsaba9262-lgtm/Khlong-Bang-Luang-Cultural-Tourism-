import React, { useState } from 'react';
import { Camera, ZoomIn, Eye, Sparkles } from 'lucide-react';
import { siteImages, placeImageAlts } from '../data/siteImages';
import { ImageWithFallback } from './ImageWithFallback';
import { GalleryLightbox } from './GalleryLightbox';
import { soundManager } from '../utils/audio';

export interface GalleryImageItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: string;
  credit: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryImageItem[] = [
  {
    id: "kb-01",
    src: siteImages.gallery.khlongBangLuang[0],
    alt: placeImageAlts.gallery[0],
    title: "ชุมชนคลองบางหลวงริมสายน้ำ",
    caption: "บ้านเรือนไม้สักโบราณและวิถีชีวิตดั้งเดิมริมคลองบางกอกใหญ่",
    category: "ชุมชน & วิถีชีวิต",
    credit: "ภาพถ่ายจริง: ต้นฉบับ"
  },
  {
    id: "kb-02",
    src: siteImages.gallery.khlongBangLuang[1],
    alt: placeImageAlts.gallery[1],
    title: "ท่าเรือคลองบางหลวง & เรือสัญจร",
    caption: "ท่าเรือชุมชนและเรือหางยาวสัญจร มรดกการเดินทางทางน้ำ",
    category: "การเดินทาง & ท่าเรือ",
    credit: "ภาพถ่ายจริง: ต้นฉบับ"
  },
  {
    id: "kb-03",
    src: siteImages.gallery.khlongBangLuang[2],
    alt: placeImageAlts.gallery[2],
    title: "บรรยากาศร้านริมคลอง",
    caption: "ร้านค้าและคาเฟ่ริมน้ำ สัมผัสความรื่นรมย์และเสน่ห์ของชุมชน",
    category: "ร้านอาหาร & คาเฟ่",
    credit: "ภาพถ่ายจริง: ต้นฉบับ"
  },
  {
    id: "kb-04",
    src: siteImages.gallery.khlongBangLuang[3],
    alt: placeImageAlts.gallery[3],
    title: "วัดและโบราณสถานในชุมชน",
    caption: "วัดเก่าแก่และโบราณสถานศูนย์รวมจิตวิญญาณของชาวคลองบางหลวง",
    category: "วัด & โบราณสถาน",
    credit: "ภาพถ่ายจริง: ต้นฉบับ"
  }
];

interface KhlongBangLuangGalleryProps {
  items?: GalleryImageItem[];
  title?: string;
  subtitle?: string;
  showHeading?: boolean;
  className?: string;
  aspectRatioClass?: string;
}

export const KhlongBangLuangGallery: React.FC<KhlongBangLuangGalleryProps> = ({
  items = DEFAULT_GALLERY_ITEMS,
  title = "ภาพถ่ายจริง คลองบางหลวง",
  subtitle = "รวมภาพถ่ายจริงต้นฉบับสะท้อนวิถีชีวิต ชุมชน ท่าเรือ และโบราณสถาน",
  showHeading = true,
  className = "",
  aspectRatioClass = "aspect-4/3"
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (idx: number) => {
    soundManager.playClick();
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className={`w-full ${className}`}>
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00435c]/10 text-[#00435c] text-xs font-bold mb-3 border border-[#00435c]/20">
              <Camera className="w-3.5 h-3.5 text-[#e06830]" />
              <span>ORIGINAL PHOTO GALLERY</span>
            </div>
            <h2 className="font-serif-thai text-2xl sm:text-3xl font-extrabold text-[#002837] tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-xl font-light">
              {subtitle}
            </p>
          </div>
          <div className="text-xs text-stone-600 flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-[#fe9666]" />
            <span>คลิกที่รูปเพื่อเปิดดูภาพขนาดใหญ่</span>
          </div>
        </div>
      )}

      {/* Responsive Gallery Grid (1 col Mobile, 2 cols Tablet, 4 cols Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => handleImageClick(idx)}
            className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Image with fallback and lazy loading */}
            <ImageWithFallback
              src={item.src}
              alt={item.alt}
              lazy={true}
              aspectRatioClass={aspectRatioClass}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              overlay={
                <>
                  {/* Gradient for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Zoom indicator on hover */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                    <ZoomIn className="w-4 h-4 text-[#fe9666]" />
                  </div>

                  {/* Attribution Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-[10px] text-stone-200 px-2.5 py-0.5 rounded-full border border-white/10">
                    {item.credit}
                  </div>

                  {/* Caption & Category */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <span className="text-[10px] font-semibold text-[#fe9666] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="font-serif-thai font-bold text-sm sm:text-base leading-tight line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-300 line-clamp-1 font-light">
                      {item.caption}
                    </p>
                  </div>
                </>
              }
            />
          </div>
        ))}
      </div>

      {/* Lightbox for Fullscreen Viewing */}
      <GalleryLightbox
        isOpen={lightboxOpen}
        currentIndex={currentIndex}
        items={items.map(i => ({
          id: i.id,
          title: i.title,
          caption: i.caption,
          category: i.category,
          src: i.src,
          credit: i.credit
        }))}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setCurrentIndex(idx)}
      />
    </div>
  );
};
