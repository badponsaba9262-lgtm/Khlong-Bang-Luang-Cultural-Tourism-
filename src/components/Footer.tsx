import React from 'react';
import { Compass, MapPin, Camera, BookOpen, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  lang: 'th' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang }) => {
  return (
    <footer className="bg-[#002837] text-[#c3e8ff] border-t border-[#00435c]">
      {/* Top Academic Banner */}
      <div className="bg-[#001c27] py-3.5 border-b border-[#00435c]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#95ceef]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#fe9666]" />
            <span className="font-medium text-white">เว็บไซต์จัดทำเพื่อการศึกษา (Educational Project)</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">โครงงานเทคโนโลยีสารสนเทศเพื่อการท่องเที่ยวเชิงวัฒนธรรม</span>
          </div>
          <div className="flex items-center gap-2 text-[#c3e8ff]">
            <Camera className="w-3.5 h-3.5 text-[#fe9666]" />
            <span>ภาพถ่าย: ผู้จัดทำ (Original Photography)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3.5 md:pr-4">
            <div>
              <h3 className="text-white font-serif-thai text-2xl font-bold tracking-tight">คลองบางหลวง</h3>
              <p className="text-xs text-[#fe9666] font-medium tracking-wide">Khlong Bang Luang Cultural Tourism</p>
            </div>
            <p className="text-sm text-[#95ceef] leading-relaxed">
              เว็บไซต์สารสนเทศมรดกสายน้ำและวิถีชีวิตริมคลองบางหลวง ส่งเสริมการท่องเที่ยวเชิงวัฒนธรรมที่เคารพวิถีชุมชนดั้งเดิม และเผยแพร่คุณค่างานศิลปะหุ่นละครเล็กโบราณ
            </p>
            <div className="pt-1 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-[#00435c] text-[#c3e8ff] rounded-md font-medium">
                โครงงานมหาวิทยาลัย
              </span>
              <span className="px-2.5 py-1 bg-[#00435c] text-[#c3e8ff] rounded-md font-medium">
                ภาพถ่ายจริงในพื้นที่
              </span>
            </div>
          </div>

          {/* Site Navigation Menu */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#fe9666]" />
              {lang === 'th' ? 'เมนูหลัก (Navigation)' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#95ceef]">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9666]"></span>
                  หน้าแรก (Home)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('places')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9666]"></span>
                  สถานที่ท่องเที่ยว (Attractions)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('culture')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9666]"></span>
                  วัฒนธรรมและอัตลักษณ์ (Culture)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('video360')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9666]"></span>
                  วิดีโอ 360° & สื่อผสม (Video 360°)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('map')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9666]"></span>
                  แผนที่และการเดินทาง (Map & Travel)
                </button>
              </li>
            </ul>
          </div>

          {/* Travel & Accessibility Summary */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#fe9666]" />
              {lang === 'th' ? 'การเดินทางโดยสังเขป' : 'Travel Guide'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#95ceef] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[70px]">MRT รถไฟฟ้า:</span>
                <span>สถานีบางไผ่ (ทางออก 4) เดินหรือต่อวินเข้าซอยเพชรเกษม 20</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[70px]">ทางเรือ:</span>
                <span>เรือหางยาวเทียบท่าที่ท่าน้ำบ้านศิลปิน หรือท่าน้ำวัดกำแพงบางจาก</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[70px]">ที่จอดรถ:</span>
                <span>ลานจอดรถวัดกำแพงบางจาก (ซอยเพชรเกษม 20) หรือวัดคูหาสวรรค์ (ซอยจรัญฯ 3)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-[#fe9666] min-w-[70px]">หุ่นละครเล็ก:</span>
                <span>จัดแสดงทุกวันเสาร์ - อาทิตย์ เวลา 14:00 น. ณ บ้านศิลปิน (เข้าชมฟรี)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#00435c]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#95ceef]">
          <p>© {new Date().getFullYear()} คลองบางหลวง Khlong Bang Luang Cultural Tourism • เว็บไซต์จัดทำเพื่อการศึกษา</p>
          <div className="flex items-center gap-1.5 text-xs">
            <span>ภาพถ่ายและเนื้อหา: ผู้จัดทำ</span>
            <span className="text-[#fe9666]">•</span>
            <span className="flex items-center gap-1">
              ร่วมอนุรักษ์มรดกสายน้ำ <Heart className="w-3.5 h-3.5 text-[#fe9666] fill-[#fe9666]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
