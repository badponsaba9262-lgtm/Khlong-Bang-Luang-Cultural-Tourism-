import React from 'react';
import { 
  Glasses, 
  Sparkles, 
  RotateCw, 
  ZoomIn, 
  Maximize2,
  Volume2,
  Compass,
  MapPin,
  Eye,
  Film
} from 'lucide-react';
import { Three360VideoPlayer, Video360Item } from './Three360VideoPlayer';

interface Video360ScreenProps {
  lang: 'th' | 'en';
}

export const BANG_LUANG_360_VIDEOS: Video360Item[] = [
  {
    id: 'bangluang-vr-1',
    title: 'วิดีโอ 360° สายน้ำและบ้านเรือนไม้ริมคลองบางหลวง ตอนที่ 1',
    subtitle: 'สัมผัสประสบการณ์เสมือนจริง 360 องศา โค้งน้ำประวัติศาสตร์และเรือนแถวไม้ริมน้ำ',
    videoSrc: '/videos/vr/bangluang-360-1.mp4',
    thumbnail: '/images/vr/thumb-video-1.jpg',
    durationText: '01:25',
    description: 'ชมทัศนียภาพรอบทิศทาง 360 องศา หมุนดูผืนน้ำคลองบางหลวง เรือนไม้โบราณ และวิถีชีวิตริมสายน้ำอย่างใกล้ชิด',
    location: 'โค้งน้ำคลองบางหลวง & ท่าน้ำชุมชน',
    category: 'สายน้ำ & สถาปัตยกรรม'
  },
  {
    id: 'bangluang-vr-2',
    title: 'วิดีโอ 360° ทางเดินไม้ริมคลอง & ร้านค้าชุมชน ตอนที่ 2',
    subtitle: 'มุมมองรอบทิศทาง 360 องศา ทางเดินระเบียงไม้เลียบคลองและร้านค้าชุมชน',
    videoSrc: '/videos/vr/bangluang-360-2.mp4',
    thumbnail: '/images/vr/thumb-video-2.jpg',
    durationText: '01:03',
    description: 'สำรวจบรรยากาศการเดินเล่นบนทางเดินไม้โบราณริมคลอง สัมผัสร้านค้าท้องถิ่นและลมเย็นสบายริมน้ำ',
    location: 'ทางเดินไม้เลียบคลองบางหลวง',
    category: 'วิถีชุมชน & ร้านริมน้ำ'
  },
  {
    id: 'bangluang-vr-3',
    title: 'วิดีโอ 360° ทัศนียภาพรอบทิศทางและเรือสัญจร ตอนที่ 3',
    subtitle: 'มุมมอง 360 องศา เรือหางยาวแล่นสัญจรและบ้านเรือนโบราณริมน้ำ',
    videoSrc: '/videos/vr/bangluang-360-3.mp4',
    thumbnail: '/images/vr/thumb-video-3.jpg',
    durationText: '01:36',
    description: 'ทัศนียภาพเปิดกว้าง 360 องศา เรือหางยาวและเรือนำเที่ยวแล่นผ่านผิวน้ำ สัมผัสความรื่นรมย์ของคลองบางกอกใหญ่',
    location: 'ริมคลองบางหลวง หน้าวัดกำแพง & บ้านศิลปิน',
    category: 'สายน้ำ & การสัญจรทางน้ำ'
  }
];

export const Video360Screen: React.FC<Video360ScreenProps> = ({ lang }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="border-b border-[#e8e2d9] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdbcd] text-[#98471d] text-xs font-bold mb-2">
            <Glasses className="w-4 h-4" />
            <span>360° VR SPHERICAL VIDEO EXPERIENCE</span>
          </div>
          <h1 className="font-serif-thai text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00435c]">
            วิดีโอ 360 องศา คลองบางหลวง
          </h1>
          <p className="text-xs sm:text-sm text-[#71787e] mt-1 max-w-2xl leading-relaxed">
            เปิดมุมมองรอบทิศทาง 360 องศาเสมือนจริง สัมผัสทัศนียภาพสายน้ำ โค้งน้ำประวัติศาสตร์ เรือนไม้โบราณ และวิถีชีวิตชุมชนคลองบางหลวง
          </p>
        </div>
      </div>

      {/* Main 360 WebGL Video Player Section */}
      <div className="space-y-8">
        <Three360VideoPlayer 
          videos={BANG_LUANG_360_VIDEOS}
          lang={lang}
        />

        {/* Guide Card for 360 Video Experience */}
        <div className="bg-gradient-to-br from-[#f9f3ea] to-[#f3ede4] rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-[#00435c] text-[#fe9666]">
              <Glasses className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-thai font-bold text-lg text-[#00435c]">
                วิธีรับชมวิดีโอ 360 องศาให้ได้อรรถรสสูงสุด
              </h3>
              <p className="text-xs text-[#71787e]">
                เทคโนโลยีการจำลองโลกเสมือนจริงรอบทิศทาง WebGL Spherical Video
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#40484d]">
            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] space-y-1.5">
              <span className="font-bold text-[#00435c] flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-[#fe9666]" />
                <span>1. หมุนดูรอบทิศทาง 360°</span>
              </span>
              <p className="text-stone-600 leading-relaxed">
                คลิกเมาส์ค้างแล้วลาก หรือใช้นิ้วปาดบนหน้าจอมือถือเพื่อหันมองทัศนียภาพรอบตัวได้ทุกทิศ ทั้งซ้าย ขวา ก้มมองผิวน้ำ หรือแหงนมองท้องฟ้า
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] space-y-1.5">
              <span className="font-bold text-[#00435c] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#fe9666]" />
                <span>2. ปรับเพิ่ม-ลดเสียงรอบทิศ</span>
              </span>
              <p className="text-stone-600 leading-relaxed">
                เปิดเสียงเพื่อรับฟังเสียงบรรยากาศจริง ทั้งเสียงคลื่นน้ำ เสียงเครื่องยนต์เรือหางยาว และบทสนทนาชุมชน พร้อมแถบปรับเสียง ปุ่ม +/- หรือปุ่มลูกศรขึ้น/ลง
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] space-y-1.5">
              <span className="font-bold text-[#98471d] flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-[#fe9666]" />
                <span>3. ปรับซูมเข้า-ออก (FOV)</span>
              </span>
              <p className="text-stone-600 leading-relaxed">
                กดปุ่มแว่นขยาย + / - เพื่อขยายหรือย่อมิติภาพ ให้ความรู้สึกเสมือนกำลังยืนชมบรรยากาศอยู่ริมฝั่งคลองบางหลวงจริงๆ
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] space-y-1.5">
              <span className="font-bold text-[#00435c] flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-[#fe9666]" />
                <span>4. โหมดเต็มจอและมือถือ Gyro</span>
              </span>
              <p className="text-stone-600 leading-relaxed">
                กดปุ่มขยายเต็มหน้าจอเพื่อชมทัศนียภาพเต็มตาทั้งจอ และบนโทรศัพท์มือถือสามารถกดไอคอนสมาร์ตโฟนเพื่อขยับเครื่องส่องชมได้รอบทิศ
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
