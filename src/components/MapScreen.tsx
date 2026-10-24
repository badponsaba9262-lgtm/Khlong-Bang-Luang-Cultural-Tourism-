// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap 
} from '@vis.gl/react-google-maps';
import { PLACES } from '../data/mockData';
import { siteImages } from '../utils/siteImages';
import { ImageWithFallback } from './ImageWithFallback';
import { 
  Compass, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Train, 
  Ship, 
  Sparkles,
  ChevronRight,
  Info,
  Navigation,
  ExternalLink,
  Footprints,
  Clock,
  Map as MapIcon,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

// Google Maps API Key loaded from environment
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCg3B5_DQQYqCM1a_xYozv6jvOiqIuLzJ4';

// Strategic center showing all 3 points: MRT Bang Phai, Khlong Bang Luang Pier, and Community Market
const MAP_OVERVIEW_CENTER = { lat: 13.7275, lng: 100.4644 };

export interface RealMapPoint {
  id: string;
  orderNumber: number;
  name: string;
  nameEn: string;
  category: 'community' | 'boat' | 'transit';
  categoryLabel: string;
  lat: number;
  lng: number;
  image: string;
  openingHours: string;
  address: string;
  description: string;
  travelTips: string;
  googleMapsUrl: string;
  pinColor: string;
  pinGlyphColor: string;
}

// Exactly 3 specified points:
// 1. ตลาดชุมชนคลองบางหลวง (จุดเด่นไฮไลท์หลัก)
// 2. ท่าเรือคลองบางหลวง
// 3. สถานีรถไฟฟ้า MRT บางไผ่ (Bang Phai)
const REAL_MAP_POINTS: RealMapPoint[] = [
  {
    id: 'community',
    orderNumber: 1,
    name: 'ตลาดชุมชนคลองบางหลวง',
    nameEn: 'Khlong Bang Luang Community Market',
    category: 'community',
    categoryLabel: 'ตลาดชุมชน & ไฮไลท์สำคัญ',
    lat: 13.7304,
    lng: 100.4641,
    image: siteImages.places.khlongBangLuang,
    openingHours: 'เปิดทุกวัน (ตลาดและร้านค้าชุมชน 10:00 - 18:00 น.)',
    address: 'ตลาดชุมชนริมคลองบางหลวง ซอยเพชรเกษม 28 / ซอยจรัญสนิทวงศ์ 3 แขวงคูหาสวรรค์ เขตภาษีเจริญ กรุงเทพฯ',
    description: 'ศูนย์กลางตลาดชุมชนริมคลองบางหลวงและแลนด์มาร์กสำคัญอันดับ 1 แหล่งรวมบ้านศิลปิน ร้านค้าชุมชน ร้านกาแฟริมน้ำ และกิจกรรมเวิร์กช็อปสร้างสรรค์ริมสายน้ำ',
    travelTips: 'เดินเท้าจาก MRT บางไผ่ 800 เมตร หรือนั่งเรือหางยาวมาเทียบที่ท่าเรือชุมชนได้โดยตรง',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=13.7304,100.4641',
    pinColor: '#ea580c',
    pinGlyphColor: '#ffffff'
  },
  {
    id: 'pier',
    orderNumber: 2,
    name: 'ท่าเรือคลองบางหลวง',
    nameEn: 'Khlong Bang Luang Pier',
    category: 'boat',
    categoryLabel: 'การสัญจรทางน้ำ & ท่าเรือ',
    lat: 13.7308,
    lng: 100.4638,
    image: siteImages.places.pier,
    openingHours: '08:30 - 17:30 น. (มีเรือให้บริการทุกวัน)',
    address: 'ท่าน้ำริมคลองบางหลวง (บริเวณหน้าวัดกำแพงบางจากและชานเรือนบ้านศิลปิน)',
    description: 'ศูนย์กลางการสัญจรทางน้ำ จุดขึ้นลงเรือหางยาวนำเที่ยว สัมผัสทัศนียภาพสองฝั่งคลองประวัติศาสตร์ เชื่อมต่อไปยังแม่น้ำเจ้าพระยา และจุดให้อาหารปลาหน้าวัด',
    travelTips: 'สามารถเช่าเหมาเรือหางยาวจากท่าเตียน ท่าช้าง หรือท่าสาทร ล่องมาเทียบท่าที่นี่ได้โดยตรง',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=13.7308,100.4638',
    pinColor: '#0284c7',
    pinGlyphColor: '#ffffff'
  },
  {
    id: 'mrt-bang-phai',
    orderNumber: 3,
    name: 'สถานีรถไฟฟ้า MRT บางไผ่',
    nameEn: 'MRT Bang Phai Station (Exit 4)',
    category: 'transit',
    categoryLabel: 'การเดินทางด้วยรถไฟฟ้า',
    lat: 13.72457,
    lng: 100.46472,
    image: siteImages.places.mrtBangPhai,
    openingHours: '06:00 - 24:00 น. (เปิดให้บริการทุกวัน)',
    address: 'สถานีรถไฟฟ้า MRT บางไผ่ (ทางออก 4 หน้า รพ.บางไผ่ และ รร.วัดนวลนรดิศ) ถนนเพชรเกษม แขวงปากคลองภาษีเจริญ เขตภาษีเจริญ กรุงเทพฯ',
    description: 'จุดเชื่อมต่อระบบขนส่งมวลชนรถไฟฟ้า MRT สายสีน้ำเงิน สถานีบางไผ่ (Bang Phai) ตั้งอยู่บนถนนเพชรเกษม ตรงข้ามโรงพยาบาลบางไผ่และโรงเรียนวัดนวลนรดิศ สามารถใช้ทางออก 4 เดินเข้าซอยเพชรเกษม 20 หรือนั่งวินมอเตอร์ไซค์รับจ้างเข้าสู่ตลาดชุมชนคลองบางหลวง',
    travelTips: 'แนะนำใช้ทางออก 4 เดินเข้าซอยเพชรเกษม 20 ประมาณ 800 เมตร หรือนั่งวินมอเตอร์ไซค์ (15 บาท) เข้าสู่ตลาดชุมชนคลองบางหลวง',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=13.72457,100.46472',
    pinColor: '#00435c',
    pinGlyphColor: '#ffffff'
  }
];

// Helper component for smooth camera movements
function MapCameraHandler({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center.lat, center.lng, zoom]);
  return null;
}

interface MapScreenProps {
  initialPlaceId?: string | null;
  onSelectPlace?: (place: any) => void;
  lang?: 'th' | 'en';
}

export const MapScreen: React.FC<MapScreenProps> = ({ 
  initialPlaceId, 
  onSelectPlace,
  lang = 'th' 
}) => {
  // Map Type state: roadmap | satellite | hybrid
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  
  // Camera state
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>(MAP_OVERVIEW_CENTER);
  const [cameraZoom, setCameraZoom] = useState<number>(15.5);

  // Active Selected Point (Defaults to Point 1: ชุมชนริมคลองบางหลวง)
  const [activePoint, setActivePoint] = useState<RealMapPoint>(REAL_MAP_POINTS[0]);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filtered points (always subset of the 3 points)
  const displayedPoints = useMemo(() => {
    if (selectedFilter === 'all') return REAL_MAP_POINTS;
    return REAL_MAP_POINTS.filter(p => p.id === selectedFilter);
  }, [selectedFilter]);

  // Handle focus on point
  const handleSelectPoint = useCallback((point: RealMapPoint) => {
    soundManager.playClick();
    setActivePoint(point);
    setSelectedFilter('all');
    setCameraCenter({ lat: point.lat, lng: point.lng });
    setCameraZoom(17);
  }, []);

  // Reset to overview showing all 3 points
  const handleResetOverview = useCallback(() => {
    soundManager.playClick();
    setSelectedFilter('all');
    setCameraCenter(MAP_OVERVIEW_CENTER);
    setCameraZoom(15.5);
    setActivePoint(REAL_MAP_POINTS[0]);
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    soundManager.playClick();
    setCameraZoom(prev => Math.min(prev + 1, 20));
  }, []);

  const handleZoomOut = useCallback(() => {
    soundManager.playClick();
    setCameraZoom(prev => Math.max(prev - 1, 12));
  }, []);


  // Open matched place in modal if available
  const handleOpenDetailModal = (point: RealMapPoint) => {
    if (!onSelectPlace) return;
    soundManager.playClick();
    const matchedPlace = PLACES.find(p => p.id === 'artist-house' || p.name.includes('คลองบางหลวง')) || PLACES[0];
    onSelectPlace(matchedPlace);
  };

  return (
    <div className="w-full bg-[#fcf9f5] min-h-screen text-[#1d1b16] pb-24 animate-in fade-in duration-300">
      
      {/* 1. Header & Title Section */}
      <section className="bg-gradient-to-b from-[#f3ede4] to-[#fcf9f5] pt-8 pb-6 border-b border-[#e8e2d9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#98471d] font-semibold text-xs uppercase tracking-wider mb-1.5">
                <Compass className="w-4 h-4 text-[#fe9666]" />
                <span>INTERACTIVE GOOGLE MAPS • แผนที่และเส้นทางท่องเที่ยว 3 จุดสำคัญ</span>
              </div>
              <h1 className="font-serif-thai text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00435c]">
                แผนที่และเส้นทางท่องเที่ยวคลองบางหลวง
              </h1>
              <p className="text-sm sm:text-base text-[#52443c] mt-2 max-w-3xl">
                แสดง 3 พิกัดหลักบนแผนที่จริง: 1. ตลาดชุมชนคลองบางหลวง (จุดเด่นไฮไลท์) 2. ท่าเรือคลองบางหลวง 3. สถานีรถไฟฟ้า MRT บางไผ่ (Bang Phai)
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=13.7304,100.4641"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00435c] text-white font-semibold text-xs sm:text-sm hover:bg-[#002f41] transition-all shadow-sm active:scale-95"
              >
                <Navigation className="w-4 h-4 text-[#fe9666]" />
                <span>นำทางไปตลาดชุมชนคลองบางหลวง</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Quick Select Buttons for the 3 Points */}
          <div className="flex items-center gap-2.5 overflow-x-auto py-4 scrollbar-none">
            <button
              onClick={handleResetOverview}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedFilter === 'all'
                  ? 'bg-[#00435c] text-white border-[#00435c] shadow-sm ring-2 ring-[#00435c]/20'
                  : 'bg-white text-[#52443c] border-[#e8e2d9] hover:bg-stone-50'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>ภาพรวม 3 จุดสำคัญ</span>
            </button>

            {REAL_MAP_POINTS.map(point => {
              const isSelected = activePoint.id === point.id;
              return (
                <button
                  key={point.id}
                  onClick={() => handleSelectPoint(point)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#98471d] text-white border-[#98471d] shadow-sm ring-2 ring-[#98471d]/20'
                      : 'bg-white text-[#52443c] border-[#e8e2d9] hover:bg-stone-50'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 text-current flex items-center justify-center text-[11px] font-bold">
                    {point.orderNumber}
                  </span>
                  <span>{point.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Interactive Real Google Maps Canvas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Map Viewer (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden shadow-xl border border-[#e8e2d9] bg-stone-200">
              
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={MAP_OVERVIEW_CENTER}
                  defaultZoom={15.5}
                  mapTypeId={mapTypeId}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  zoomControl={false}
                  mapTypeControl={false}
                  streetViewControl={true}
                  fullscreenControl={true}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  className="w-full h-full"
                >
                  <MapCameraHandler center={cameraCenter} zoom={cameraZoom} />

                  {/* Render Exactly 3 Real Markers */}
                  {displayedPoints.map((point) => {
                    const isSelected = activePoint.id === point.id;
                    const isPoint1 = point.orderNumber === 1 || point.id === 'community';
                    const markerZIndex = isSelected ? 120 : (isPoint1 ? 100 : 20);

                    return (
                      <AdvancedMarker
                        key={point.id}
                        position={{ lat: point.lat, lng: point.lng }}
                        onClick={() => handleSelectPoint(point)}
                        title={`${point.orderNumber}. ${point.name}`}
                        zIndex={markerZIndex}
                      >
                        <div className="relative flex flex-col items-center group cursor-pointer">
                          
                          {/* Animated Radar Glow & Ripple specifically for Point 1 to be the most prominent */}
                          {isPoint1 && (
                            <div className="absolute -bottom-1 z-0 pointer-events-none flex items-center justify-center">
                              <span className="w-14 h-14 rounded-full bg-orange-500/40 animate-ping" />
                              <span className="absolute w-10 h-10 rounded-full bg-amber-400/30 animate-pulse" />
                            </div>
                          )}

                          {/* Floating Label for Points */}
                          {isPoint1 ? (
                            <div className={`px-3 py-1 rounded-full text-xs font-black shadow-xl border-2 mb-1.5 whitespace-nowrap transition-transform duration-200 z-10 flex items-center gap-1.5 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-[#98471d] via-[#ea580c] to-[#fe9666] text-white border-amber-300 scale-125 ring-4 ring-[#fe9666]/50 shadow-2xl animate-pulse' 
                                : 'bg-gradient-to-r from-[#c2410c] to-[#ea580c] text-white border-amber-200 scale-110 shadow-lg'
                            }`}>
                              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin-slow" />
                              <span>1. {point.name}</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-300 text-stone-900 text-[9px] font-black uppercase">
                                ไฮไลท์หลัก
                              </span>
                            </div>
                          ) : (
                            <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border mb-1 whitespace-nowrap transition-transform duration-200 z-10 ${
                              isSelected 
                                ? 'bg-[#1d1b16] text-white border-white scale-110 ring-2 ring-[#fe9666]' 
                                : 'bg-white text-[#1d1b16] border-stone-200'
                            }`}>
                              {point.orderNumber}. {point.name}
                            </div>
                          )}

                          {/* Pin Icon */}
                          <div className="relative z-10 transition-transform duration-200">
                            <Pin
                              background={isPoint1 ? '#ea580c' : point.pinColor}
                              borderColor={isPoint1 ? '#fef08a' : '#ffffff'}
                              glyphColor={isPoint1 ? '#ffffff' : point.pinGlyphColor}
                              scale={isPoint1 ? (isSelected ? 1.75 : 1.5) : (isSelected ? 1.35 : 1.15)}
                            />
                          </div>
                        </div>
                      </AdvancedMarker>
                    );
                  })}
                </Map>
              </APIProvider>

              {/* Floating Top Controls: Map Type Switcher */}
              <div className="absolute top-4 left-4 z-10 flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-[#e8e2d9]/80">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMapTypeId('roadmap');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    mapTypeId === 'roadmap'
                      ? 'bg-[#00435c] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  แผนที่มาตรฐาน
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMapTypeId('satellite');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    mapTypeId === 'satellite'
                      ? 'bg-[#00435c] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  ภาพดาวเทียม
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMapTypeId('hybrid');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    mapTypeId === 'hybrid'
                      ? 'bg-[#00435c] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  ผสม (Hybrid)
                </button>
              </div>

              {/* Floating Right Controls: Zoom & Center Reset */}
              <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-[#e8e2d9] flex items-center justify-center text-stone-700 hover:bg-white hover:text-[#00435c] transition-all cursor-pointer active:scale-95"
                  title="ซูมเข้า"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-[#e8e2d9] flex items-center justify-center text-stone-700 hover:bg-white hover:text-[#00435c] transition-all cursor-pointer active:scale-95"
                  title="ซูมออก"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetOverview}
                  className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-[#e8e2d9] flex items-center justify-center text-[#98471d] hover:bg-white transition-all cursor-pointer active:scale-95"
                  title="กลับสู่มุมมองรวม 3 จุด"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Quick Badge on Map */}
              <div className="absolute bottom-4 left-4 z-10 bg-black/75 backdrop-blur-md text-white text-[11px] px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-lg pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span>แสดงพิกัดจริง 3 จุด: ชุมชนริมคลอง • ท่าเรือ • MRT บางไผ่</span>
              </div>
            </div>

            {/* Under-Map Quick Navigation Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00435c]/10 text-[#00435c] flex items-center justify-center flex-shrink-0">
                  <Footprints className="w-5 h-5 text-[#00435c]" />
                </div>
                <div>
                  <h4 className="font-serif-thai font-bold text-sm text-[#1d1b16]">
                    เส้นทางเชื่อมต่อ: MRT บางไผ่ ➔ ท่าเรือ ➔ ชุมชนริมคลองบางหลวง
                  </h4>
                  <p className="text-xs text-[#71787e]">
                    ระยะทางประมาณ 800 เมตร เดินเท้าเพียง 10 นาที หรือนั่งวินมอเตอร์ไซค์ 15 บาท
                  </p>
                </div>
              </div>

              <a
                href={activePoint.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#98471d] text-white text-xs font-semibold hover:bg-[#7e3a15] transition-all shadow-xs flex-shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>นำทางไป {activePoint.name}</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>

          </div>

          {/* Right Sidebar: Active Point Detail & 3 Points List (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Active Selected Point Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#e8e2d9] shadow-md animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-stone-100">
                <ImageWithFallback
                  src={activePoint.image}
                  alt={activePoint.name}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  fallbackText="ยังไม่มีรูปภาพ"
                  overlay={
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#fe9666] text-[#1d1b16] shadow-sm">
                          จุดที่ {activePoint.orderNumber}
                        </span>
                        <span className="text-[11px] font-medium text-white drop-shadow-sm">
                          {activePoint.categoryLabel}
                        </span>
                      </div>
                    </>
                  }
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-serif-thai text-xl font-bold text-[#00435c]">
                    {activePoint.orderNumber}. {activePoint.name}
                  </h3>
                  <p className="text-xs text-[#98471d] font-semibold mt-0.5">
                    {activePoint.nameEn}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#52443c] leading-relaxed">
                  {activePoint.description}
                </p>

                <div className="bg-[#fcf9f5] rounded-xl p-3 border border-[#e8e2d9] space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-[#98471d] mt-0.5 flex-shrink-0" />
                    <span>{activePoint.openingHours}</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-[#00435c] mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{activePoint.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#71787e]">
                    <Info className="w-3.5 h-3.5 text-stone-500 mt-0.5 flex-shrink-0" />
                    <span>{activePoint.travelTips}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={activePoint.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00435c] text-white text-xs font-semibold hover:bg-[#002f41] transition-all shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#fe9666]" />
                    <span>เปิดใน Google Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-75" />
                  </a>

                  {activePoint.id === 'community' && (
                    <button
                      onClick={() => handleOpenDetailModal(activePoint)}
                      className="px-3.5 py-2.5 rounded-xl bg-stone-100 text-[#00435c] text-xs font-semibold hover:bg-stone-200 transition-all cursor-pointer"
                    >
                      ดูข้อมูลชุมชน
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of The 3 Specified Points */}
            <div className="bg-white rounded-3xl p-5 border border-[#e8e2d9] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-thai font-bold text-sm text-[#00435c] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#98471d]" />
                  <span>3 จุดสำคัญบนแผนที่</span>
                </h4>
                <span className="text-[11px] text-[#71787e]">คลิกเพื่อเจาะจงจุด</span>
              </div>

              <div className="space-y-2.5">
                {REAL_MAP_POINTS.map((point) => {
                  const isSelected = activePoint.id === point.id;
                  const isPoint1 = point.orderNumber === 1 || point.id === 'community';
                  return (
                    <button
                      key={point.id}
                      onClick={() => handleSelectPoint(point)}
                      className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? (isPoint1 ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-400/40 shadow-sm' : 'bg-[#00435c]/5 border-[#00435c] ring-2 ring-[#00435c]/20 shadow-xs')
                          : (isPoint1 ? 'bg-amber-50/50 border-amber-300/80 hover:bg-amber-50' : 'bg-[#fcf9f5] border-[#e8e2d9] hover:bg-white hover:border-stone-300')
                      }`}
                    >
                      <div 
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs font-bold text-xs ${
                          isPoint1 ? 'bg-gradient-to-br from-amber-500 to-orange-600 ring-2 ring-amber-300' : ''
                        }`}
                        style={!isPoint1 ? { backgroundColor: point.pinColor } : undefined}
                      >
                        {isPoint1 ? '⭐ 1' : point.orderNumber}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-stone-200/80 text-stone-700">
                            {point.categoryLabel}
                          </span>
                          {isPoint1 && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                              จุดเด่นหลัก
                            </span>
                          )}
                        </div>
                        <h5 className={`font-serif-thai font-bold text-xs sm:text-sm truncate mt-0.5 ${
                          isPoint1 ? 'text-[#98471d]' : 'text-[#1d1b16]'
                        }`}>
                          {point.orderNumber}. {point.name}
                        </h5>
                        <p className="text-[11px] text-[#71787e] truncate">
                          {point.travelTips}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? (isPoint1 ? 'text-orange-600' : 'text-[#00435c]') : 'text-stone-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Recommended Walking & Transit Route connecting the 3 Points */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#98471d] font-semibold text-xs uppercase tracking-wider mb-1">
                <Footprints className="w-4 h-4 text-[#fe9666]" />
                <span>CONNECTED TRAVEL ROUTE • เส้นทางเชื่อมโยง 3 จุด</span>
              </div>
              <h2 className="font-serif-thai text-2xl sm:text-3xl font-bold text-[#00435c]">
                เส้นทางเชื่อมโยงจาก MRT บางไผ่ (Bang Phai) ➔ ท่าเรือ ➔ ตลาดชุมชนคลองบางหลวง
              </h2>
              <p className="text-xs sm:text-sm text-[#71787e] mt-1">
                รายละเอียดการเดินทางทีละขั้นตอนเชื่อมต่อทั้ง 3 จุดหลักอย่างราบรื่น
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: MRT Bang Phai */}
            <div 
              onClick={() => handleSelectPoint(REAL_MAP_POINTS[2])}
              className="bg-[#fcf9f5] rounded-2xl p-5 border border-[#e8e2d9] flex flex-col justify-between space-y-4 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#00435c] text-white text-[11px] font-bold flex items-center gap-1">
                    <Train className="w-3 h-3" />
                    <span>จุดเริ่มต้น: จุดที่ 3</span>
                  </span>
                  <span className="text-xs text-stone-500 font-medium">MRT สายสีน้ำเงิน</span>
                </div>
                <h3 className="font-serif-thai font-bold text-base text-[#1d1b16] group-hover:text-[#00435c] transition-colors">
                  สถานีรถไฟฟ้า MRT บางไผ่
                </h3>
                <p className="text-xs text-[#52443c] leading-relaxed">
                  ออกทางออก 4 เดินเข้าซอยเพชรเกษม 20 สะดวกสบาย เลี้ยวซ้ายเดินตามทางประมาณ 800 เมตร หรือนั่งวินมอเตอร์ไซค์ 15 บาท
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] text-[#71787e]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ทางออก 4 สะดวกที่สุด</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>มีวินมอเตอร์ไซค์หน้าปากซอยตลอดวัน</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-[#00435c] flex items-center gap-1">
                <span>ปักหมุดบนแผนที่</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Step 2: Khlong Bang Luang Pier */}
            <div 
              onClick={() => handleSelectPoint(REAL_MAP_POINTS[1])}
              className="bg-[#fcf9f5] rounded-2xl p-5 border border-[#e8e2d9] flex flex-col justify-between space-y-4 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#0284c7] text-white text-[11px] font-bold flex items-center gap-1">
                    <Ship className="w-3 h-3" />
                    <span>จุดเชื่อมต่อ: จุดที่ 2</span>
                  </span>
                  <span className="text-xs text-stone-500 font-medium">การสัญจรทางน้ำ</span>
                </div>
                <h3 className="font-serif-thai font-bold text-base text-[#1d1b16] group-hover:text-[#0284c7] transition-colors">
                  ท่าเรือคลองบางหลวง
                </h3>
                <p className="text-xs text-[#52443c] leading-relaxed">
                  จุดจอดเทียบเรือหางยาวนำเที่ยวริมน้ำ สัญจรทางน้ำเชื่อมกับแม่น้ำเจ้าพระยา หรือแวะให้อาหารปลาหน้าวัดกำแพงบางจาก
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] text-[#71787e]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>มีเรือหางยาวบริการนำเที่ยว</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>บันไดขึ้นลงท่าน้ำปลอดภัย</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-[#0284c7] flex items-center gap-1">
                <span>ปักหมุดบนแผนที่</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Step 3: Khlong Bang Luang Community */}
            <div 
              onClick={() => handleSelectPoint(REAL_MAP_POINTS[0])}
              className="bg-[#fcf9f5] rounded-2xl p-5 border border-[#e8e2d9] flex flex-col justify-between space-y-4 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[11px] font-black flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-yellow-200" />
                    <span>จุดหมายปลายทาง: จุดที่ 1 (เด่นที่สุด)</span>
                  </span>
                  <span className="text-xs text-orange-600 font-bold">ไฮไลท์หลัก</span>
                </div>
                <h3 className="font-serif-thai font-bold text-base text-[#1d1b16] group-hover:text-orange-600 transition-colors">
                  ตลาดชุมชนคลองบางหลวง
                </h3>
                <p className="text-xs text-[#52443c] leading-relaxed">
                  สัมผัสเสน่ห์เรือนไม้ริมน้ำ บ้านศิลปิน ชมหุ่นละครเล็ก ร้อยลูกปัด จิบกาแฟโบราณ และเดินชมระเบียงไม้ริมคลองอันงดงาม
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] text-[#71787e]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ชมการแสดงหุ่นละครเล็กฟรี</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ร้านอาหารและของกินพื้นบ้านริมน้ำ</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-[#98471d] flex items-center gap-1">
                <span>ปักหมุดบนแผนที่</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default MapScreen;
