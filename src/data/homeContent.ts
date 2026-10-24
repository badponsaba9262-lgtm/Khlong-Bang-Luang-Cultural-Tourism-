import { siteImages } from './siteImages';

export interface HomeAttraction {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  categoryTag: string;
  image: string;
  description: string;
  time: string;
  showTime?: string;
  highlights: string[];
  location: string;
  placeRefId: string;
}

export interface CulturePillar {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  description: string;
  highlightNote: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  src: string;
  credit: string;
}

export interface TravelOption {
  iconName: 'train' | 'boat' | 'car' | 'foot';
  title: string;
  subtitle: string;
  detail: string;
  tips: string;
}

export const homeContent = {
  siteInfo: {
    name: "คลองบางหลวง",
    englishName: "Khlong Bang Luang",
    subtitle: "มรดกสายน้ำและวิถีชีวิตริมคลองแห่งฝั่งธนบุรี",
    tagline: "สัมผัสเสน่ห์ชุมชนเก่าแก่ ศิลปะหุ่นละครเล็ก และความสงบริมสายน้ำที่ยังมีชีวิต",
    heroImage: siteImages.hero.home,
    metaDescription: "เว็บไซต์สารสนเทศการท่องเที่ยวเชิงวัฒนธรรมชุมชนคลองบางหลวง รวบรวมข้อมูลสถานที่ วัฒนธรรม แผนที่ และวิถีชีวิตริมน้ำ",
    badges: [
      "มรดกสายน้ำประวัติศาสตร์",
      "หุ่นละครเล็กโบราณ",
      "สถาปัตยกรรมเรือนไม้",
      "วิถีชีวิตชุมชนดั้งเดิม"
    ]
  },

  attractions: [
    {
      id: "artist-house",
      name: "บ้านศิลปิน คลองบางหลวง",
      nameEn: "Baansilapin (Artist's House)",
      category: "ศิลปวัฒนธรรม",
      categoryTag: "ศิลปะ & หุ่นละครเล็ก",
      image: siteImages.places.khlongBangLuang,
      description: "เรือนไม้สักโบราณทรงตัวแอลอายุกว่า 200 ปี ศูนย์รวมการอนุรักษ์หุ่นละครเล็กโบราณ แกลเลอรีศิลปะ เวิร์กช็อปร้อยลูกปัด และมุมกาแฟริมสายน้ำ",
      time: "10:00 - 18:00 น.",
      showTime: "การแสดงหุ่นละครเล็ก: เสาร์-อาทิตย์ เวลา 14:00 น. (ชมฟรี)",
      highlights: [
        "การแสดงหุ่นละครเล็กแบบโบราณโดยศิลปินรุ่นใหม่",
        "เจดีย์เก่ายุคอยุธยาอายุกว่า 300 ปีกลางบ้าน",
        "เวิร์กช็อปร้อยลูกปัดสร้อยข้อมือริมน้ำ",
        "จิบกาแฟโบราณชมเรือหางยาวแล่นผ่าน"
      ],
      location: "ซอยเพชรเกษม 28 ริมคลองบางหลวง",
      placeRefId: "artist-house"
    },
    {
      id: "wat-kamphaeng",
      name: "วัดกำแพงบางจาก",
      nameEn: "Wat Kamphaeng Bang Chak",
      category: "ศาสนสถาน & โบราณคดี",
      categoryTag: "วัด & โบราณสถาน",
      image: siteImages.places.watCommunity,
      description: "วัดโบราณตั้งแต่สมัยอยุธยาตอนปลาย ประดิษฐานหลวงพ่อบุษราคัม พระพุทธรูปศิลาทรายแดง และจิตรกรรมฝาผนังพุทธประวัติช่างหลวงรัชกาลที่ 3 อันทรงคุณค่า",
      time: "08:00 - 17:00 น. (เปิดทุกวัน)",
      highlights: [
        "หลวงพ่อบุษราคัม พระพุทธรูปศักดิ์สิทธิ์ประจำวัด",
        "จิตรกรรมฝาผนังสีฝุ่นโบราณเล่าเรื่องพุทธประวัติ",
        "พระอุโบสถศิลปะอยุธยาตอนปลาย",
        "ใบเสมาหินทรายคู่โบราณรอบพระอุโบสถ"
      ],
      location: "ซอยเพชรเกษม 20 แขวงปากคลองภาษีเจริญ",
      placeRefId: "wat-kamphaeng"
    },
    {
      id: "community-bridge",
      name: "ชุมชนริมคลองบางหลวง & ร้านริมน้ำ",
      nameEn: "Khlong Bang Luang Waterfront & Cafes",
      category: "วิถีชีวิต & อาหาร",
      categoryTag: "ร้าน & บรรยากาศริมคลอง",
      image: siteImages.places.communityBridge,
      description: "ทางเดินไม้โบราณเลียบคลอง สะพานไม้ข้ามคลองจุดชมวิว ร้านกาแฟโบราณริมน้ำ ก๋วยเตี๋ยวเรือโบราณ และขนมไทยดั้งเดิม",
      time: "เปิดตลอดวัน (ร้านค้า 09:00 - 17:00 น.)",
      highlights: [
        "บรรยากาศร้านค้าและคาเฟ่ริมสายน้ำสุดชิลล์",
        "สะพานไม้คนเดินข้ามคลอง จุดถ่ายภาพยอดนิยม",
        "ทางเดินไม้ระเบียงริมน้ำเชื่อมถึงกันตลอดชุมชน",
        "อาหารและเครื่องดื่มสูตรดั้งเดิมของชาวบ้าน"
      ],
      location: "เชื่อมระหว่างซอยจรัญสนิทวงศ์ 3 กับซอยเพชรเกษม 20",
      placeRefId: "community-bridge"
    },
    {
      id: "canal-boat",
      name: "การสัญจรทางน้ำ & ท่าเรือคลองบางหลวง",
      nameEn: "Water Transportation & Bang Luang Pier",
      category: "สายน้ำ & การเดินทาง",
      categoryTag: "การสัญจรทางน้ำ",
      image: siteImages.places.pier,
      description: "สัมผัสความรื่นรมย์ของการนั่งเรือหางยาว ลัดเลาะลำคลองบางกอกใหญ่ สัมผัสบ้านเรือนริมน้ำดั้งเดิม และเชื่อมต่อระบบขนส่งสาธารณะสมัยใหม่",
      time: "บริการเรือ 08:30 - 17:30 น.",
      highlights: [
        "นั่งเรือหางยาวชมทัศนียภาพสองฝั่งคลองประวัติศาสตร์",
        "จุดขึ้นลงเรือท่าน้ำบ้านศิลปินและท่าน้ำวัดกำแพง",
        "เชื่อมต่อไปยังแม่น้ำเจ้าพระยา และ MRT บางไผ่",
        "ให้อาหารปลาบริเวณท่าน้ำหน้าวัด"
      ],
      location: "ท่าน้ำวัดกำแพงบางจาก และท่าน้ำบ้านศิลปิน",
      placeRefId: "canal-boat"
    }
  ] as HomeAttraction[],

  culturePillars: [
    {
      id: "puppet",
      title: "หุ่นละครเล็กโบราณ",
      titleEn: "Traditional Thai Puppet Show",
      icon: "🎭",
      description: "ศาสตร์และศิลป์การเชิดหุ่น 3 คนประสานลมหายใจเพื่อถ่ายทอดอารมณ์ตัวละครรามเกียรติ์ สืบทอดและจัดแสดงให้ชมอย่างใกล้ชิด ณ บ้านศิลปิน",
      highlightNote: "จัดแสดงทุกวันเสาร์-อาทิตย์ เวลา 14:00 น."
    },
    {
      id: "architecture",
      title: "สถาปัตยกรรมเรือนไม้ริมน้ำ",
      titleEn: "Waterfront Wooden Architecture",
      icon: "🏛️",
      description: "เรือนแถวไม้สักทองโบราณ บานเฟี้ยมเปิดรับลม และระเบียงยื่นเหนือน้ำ ภูมิปัญญาการก่อสร้างที่สอดรับกับวิถีน้ำขึ้นน้ำลงอย่างลงตัว",
      highlightNote: "มีอายุยาวนานตั้งแต่ปลายสมัยกรุงธนบุรีถึงต้นรัตนโกสินทร์"
    },
    {
      id: "cuisine",
      title: "สำรับชาวน้ำโบราณ",
      titleEn: "Authentic Canal Culinary",
      icon: "🍜",
      description: "ก๋วยเตี๋ยวเรือต้มยำสูตรดั้งเดิมคั่วพริกคั่วถั่วเอง กาแฟโบราณชงถุงผ้า ขนมไทยโบราณ และน้ำสมุนไพรพื้นบ้านที่ยังคงรสชาติต้นตำรับ",
      highlightNote: "ร้านค้าเปิดให้บริการอย่างคึกคักโดยเฉพาะช่วงวันหยุดสุดสัปดาห์"
    },
    {
      id: "lifestyle",
      title: "วิถีชีวิตริมสายน้ำ",
      titleEn: "Canal Lifestyle & Community",
      icon: "🛶",
      description: "ความผูกพันของผู้คนกับสายน้ำคลองบางกอกใหญ่ การเดินทางสัญจรด้วยเรือหางยาว และความเงียบสงบที่ยังคงหลงเหลืออยู่ใจกลางเมืองหลวง",
      highlightNote: "สัมผัสความสงบและรอยยิ้มของชุมชนที่พึ่งพาอาศัยกัน"
    }
  ] as CulturePillar[],

  gallery: [
    {
      id: "g1",
      title: "ชุมชนริมคลองบางหลวง",
      caption: "บรรยากาศชุมชนริมสายน้ำคลองบางหลวง บ้านเรือนไม้และวิถีชีวิตดั้งเดิม",
      category: "ชุมชน & วิถีชีวิต",
      src: siteImages.gallery.khlongBangLuang[0],
      credit: "ภาพถ่ายจริง: ต้นฉบับ"
    },
    {
      id: "g2",
      title: "ท่าเรือคลองบางหลวง & เรือสัญจร",
      caption: "ท่าเรือชุมชนและเรือหางยาวสัญจรริมน้ำคลองบางกอกใหญ่",
      category: "การเดินทาง & ท่าเรือ",
      src: siteImages.gallery.khlongBangLuang[1],
      credit: "ภาพถ่ายจริง: ต้นฉบับ"
    },
    {
      id: "g3",
      title: "บรรยากาศร้านริมคลอง",
      caption: "ร้านอาหารและคาเฟ่ริมน้ำ สัมผัสความร่มรื่นและของอร่อยริมคลอง",
      category: "ร้านอาหาร & คาเฟ่",
      src: siteImages.gallery.khlongBangLuang[2],
      credit: "ภาพถ่ายจริง: ต้นฉบับ"
    },
    {
      id: "g4",
      title: "วัดในชุมชนคลองบางหลวง",
      caption: "วัดและโบราณสถานศูนย์รวมจิตใจของชาวชุมชนคลองบางหลวง",
      category: "วัด & โบราณสถาน",
      src: siteImages.gallery.khlongBangLuang[3],
      credit: "ภาพถ่ายจริง: ต้นฉบับ"
    }
  ] as GalleryItem[],

  travelGuide: [
    {
      iconName: "train",
      title: "รถไฟฟ้า MRT",
      subtitle: "สถานีบางไผ่ (ทางออก 4)",
      detail: "ลง MRT บางไผ่ เดินเข้าซอยเพชรเกษม 20 ประมาณ 700 เมตร หรือนั่งวินมอเตอร์ไซค์ 15-20 บาท เข้าสู่ทางเดินริมคลองบางหลวง",
      tips: "สะดวกและรวดเร็วที่สุด หลีกเลี่ยงปัญหาการจราจร"
    },
    {
      iconName: "boat",
      title: "เรือหางยาว / สัญจรทางน้ำ",
      subtitle: "ท่าน้ำวัดกำแพงบางจาก / ท่าบ้านศิลปิน",
      detail: "สามารถเหมาเรือหางยาวนำเที่ยวจากท่าช้าง ท่าเตียน หรือท่าสาทร ล่องคลองบางกอกใหญ่มาเทียบท่าที่บ้านศิลปินได้โดยตรง",
      tips: "ได้ชมทัศนียภาพบ้านเรือนริมน้ำตลอดเส้นทาง"
    },
    {
      iconName: "car",
      title: "รถยนต์ส่วนบุคคล",
      subtitle: "จอดรถ ณ วัดกำแพงบางจาก / วัดคูหาสวรรค์",
      detail: "สามารถนำรถไปจอดได้ที่ลานจอดรถวัดกำแพงบางจาก (ซอยเพชรเกษม 20) หรือลานจอดรถวัดคูหาสวรรค์ (ซอยจรัญฯ 3) โดยมีค่าบำรุงสถานที่",
      tips: "ซอยค่อนข้างแคบ แนะนำให้เดินทางด้วย MRT หรือขนส่งสาธารณะ"
    },
    {
      iconName: "foot",
      title: "เดินเท้าเลียบคลอง",
      subtitle: "ทางเดินไม้และคอนกรีตเลียบคลอง",
      detail: "ภายในชุมชนมีทางเดินเลียบคลองที่เชื่อมระหว่างวัดกำแพงบางจาก บ้านศิลปิน สะพานไม้ และวัดคูหาสวรรค์ เป็นเส้นทางเดินเท้าเท่านั้น ไม่มีรถยนต์",
      tips: "เดินสบาย ถ่ายรูปสวย และปลอดภัยสำหรับทุกเพศทุกวัย"
    }
  ] as TravelOption[]
};
