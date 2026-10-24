import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Compass, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Glasses,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
  lang: 'th' | 'en';
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch,
  lang,
  onToggleLang,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
  };

  const navItems = [
    { id: 'home', labelTh: 'หน้าแรก', labelEn: 'Home', icon: Compass },
    { id: 'places', labelTh: 'สถานที่ท่องเที่ยว', labelEn: 'Places', icon: MapPin },
    { id: 'culture', labelTh: 'วัฒนธรรม & อัตลักษณ์', labelEn: 'Culture', icon: BookOpen },
    { id: 'video360', labelTh: 'วิดีโอ 360°', labelEn: '360° Video', icon: Glasses },
    { id: 'map', labelTh: 'แผนที่ & เส้นทาง', labelEn: 'Map & Routes', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fff8f0]/95 backdrop-blur-md border-b border-[#e8e2d9] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => {
              soundManager.playClick();
              onTabChange('home');
            }}
            data-cursor="open"
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-thai font-bold text-xl sm:text-2xl text-[#00435c] tracking-tight leading-tight group-hover:text-[#98471d] transition-colors">
                  คลองบางหลวง
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 bg-[#c3e8ff] text-[#00435c] rounded-full">
                  KHLONG BANG LUANG
                </span>
              </div>
              <p className="text-xs text-[#98471d] font-medium tracking-wide">
                {lang === 'th' ? 'การท่องเที่ยวเชิงวัฒนธรรมชุมชน' : 'Community Cultural Heritage Tourism'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation with Micro-Interactions */}
          <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.id);
                  }}
                  data-cursor="open"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                    isActive 
                      ? 'bg-[#00435c] text-white shadow-xs font-semibold' 
                      : 'text-[#1d1b16] hover:bg-[#f3ede4] hover:text-[#00435c]'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#71787e]'}`} />
                  <span>{lang === 'th' ? item.labelTh : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* UI Click Sound Toggle Button 🔊 / 🔇 */}
            <button
              id="sound-toggle-btn"
              onClick={handleToggleSound}
              className="p-2.5 rounded-full text-[#71787e] hover:text-[#00435c] hover:bg-[#f3ede4] transition-colors"
              title={soundEnabled ? 'เปิดเสียงเอฟเฟกต์ (กดเพื่อปิดเสียง)' : 'ปิดเสียงเอฟเฟกต์ (กดเพื่อเปิดเสียง)'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#98471d]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#71787e] opacity-60" />
              )}
            </button>

            {/* Global Search Button */}
            <button
              id="search-open-btn"
              onClick={() => {
                soundManager.playClick();
                onOpenSearch();
              }}
              data-cursor="open"
              className="p-2.5 rounded-full text-[#71787e] hover:text-[#00435c] hover:bg-[#f3ede4] transition-colors"
              title="ค้นหาสถานที่, วัฒนธรรม, กิจกรรม"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => {
                soundManager.playClick();
                onToggleLang();
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#c0c7ce] text-[#40484d] hover:bg-[#f3ede4] hover:border-[#71787e] transition-colors"
              title="สลับภาษา / Switch Language"
            >
              {lang === 'th' ? 'EN' : 'ไทย'}
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => {
                soundManager.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="xl:hidden p-2.5 rounded-xl text-[#1d1b16] hover:bg-[#f3ede4] transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-[#e8e2d9] bg-[#fff8f0] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#e8e2d9]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#00435c] text-white font-semibold shadow-xs' 
                      : 'bg-[#f9f3ea] text-[#1d1b16] hover:bg-[#eee7df]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#71787e]'}`} />
                  <span className="truncate">{lang === 'th' ? item.labelTh : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#71787e] px-1">
            <span className="flex items-center gap-1 text-[#98471d]">
              <Sparkles className="w-3.5 h-3.5" />
              คลองบางหลวง 300+ ปี มรดกกรุงธนบุรี
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
