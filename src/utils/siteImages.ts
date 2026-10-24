/**
 * รวม path รูปภาพจริงต้นฉบับทั้ง 9 รูป สำหรับเว็บไซต์ Khlong Bang Luang Cultural Tourism
 * โดยอ้างอิงไฟล์จากโฟลเดอร์ public/images/
 * 
 * 1. Hero:
 *    - /images/hero/khlong-bang-luang-cover.jpg
 * 
 * 2. Places:
 *    - /images/places/khlong-bang-luang-community.jpg (ชุมชนคลองบางหลวง)
 *    - /images/places/wat-community.jpg (วัด/สถานที่ในชุมชน)
 *    - /images/places/khlong-bang-luang-pier.jpg (ท่าเรือคลองบางหลวง)
 *    - /images/places/riverside-cafe.jpg (ร้าน/บรรยากาศริมคลอง)
 * 
 * 3. Gallery:
 *    - /images/gallery/khlong-bang-luang-01.jpg
 *    - /images/gallery/khlong-bang-luang-02.jpg
 *    - /images/gallery/khlong-bang-luang-03.jpg
 *    - /images/gallery/khlong-bang-luang-04.jpg
 */

export const siteImages = {
  hero: {
    home: "/images/hero/khlong-bang-luang-cover.jpg"
  },

  places: {
    khlongBangLuang: "/images/places/khlong-bang-luang-community.jpg",
    watCommunity: "/images/places/wat-community.jpg",
    watKuhasawan: "/images/places/wat-kuhasawan.jpg",
    pier: "/images/places/khlong-bang-luang-pier.jpg",
    riversideCafe: "/images/places/krua-khun-aoy.jpg",
    kruaKhunAoy: "/images/places/krua-khun-aoy.jpg",
    communityBridge: "/images/places/community-bridge.png",
    baanPhuengSilp: "/images/places/baan-phueng-silp.jpg",
    mrtBangPhai: "/images/places/mrt-bang-phai.jpg"
  },

  gallery: {
    khlongBangLuang: [
      "/images/gallery/khlong-bang-luang-01.jpg",
      "/images/gallery/khlong-bang-luang-02.jpg",
      "/images/gallery/khlong-bang-luang-03.jpg",
      "/images/gallery/khlong-bang-luang-04.jpg"
    ]
  },

  // Aliases สำหรับเรียกใช้งานในส่วนต่างๆ ของเว็บไซต์
  identityWater: "/images/culture/identity-water.jpg",
  identityArt: "/images/culture/identity-art.jpg",
  identityPeople: "/images/culture/identity-people.jpg",
  identityLifestyle: "/images/culture/identity-lifestyle.png",
  identityCommunity: "/images/culture/identity-community.jpg",
  watKuhasawan: "/images/places/wat-kuhasawan.jpg",
  kruaKhunAoy: "/images/places/krua-khun-aoy.jpg",
  baanPhuengSilp: "/images/places/baan-phueng-silp.jpg",
  communityBridge: "/images/places/community-bridge.png",
  bridge: "/images/places/community-bridge.png",
  artistHouse: "/images/places/khlong-bang-luang-community.jpg",
  temple: "/images/places/wat-community.jpg",
  community: "/images/gallery/community-atmosphere.jpg",
  communityAtmosphere: "/images/gallery/community-atmosphere.jpg",
  canal: "/images/culture/identity-water.jpg",
  boat: "/images/places/khlong-bang-luang-pier.jpg",
  pier: "/images/places/khlong-bang-luang-pier.jpg",
  cafe: "/images/places/krua-khun-aoy.jpg",
  food: "/images/places/krua-khun-aoy.jpg",
  activity: "/images/places/baan-phueng-silp.jpg",
  communitySmile: "/images/gallery/community-smile.jpg",
  lifestyle: "/images/culture/identity-lifestyle.png"
};

export const placeImageAlts = {
  hero: "ภาพหน้าปกคลองบางหลวง Khlong Bang Luang",
  khlongBangLuang: "บรรยากาศชุมชนคลองบางหลวง",
  watCommunity: "วัดในชุมชนคลองบางหลวง",
  pier: "ท่าเรือคลองบางหลวง",
  riversideCafe: "บรรยากาศร้านริมคลองบางหลวง",
  gallery: [
    "บรรยากาศชุมชนคลองบางหลวง",
    "ท่าเรือคลองบางหลวง",
    "บรรยากาศร้านริมคลองบางหลวง",
    "วัดในชุมชนคลองบางหลวง"
  ]
};

export default siteImages;
