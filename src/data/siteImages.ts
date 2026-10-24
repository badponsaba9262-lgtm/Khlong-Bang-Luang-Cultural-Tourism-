/**
 * ระบบจัดการรูปภาพกลาง (Central Image Configuration)
 * สำหรับโครงการการท่องเที่ยวเชิงวัฒนธรรมคลองบางหลวง
 * Re-export จาก src/utils/siteImages.ts
 */

export * from '../utils/siteImages';
export { siteImages as default } from '../utils/siteImages';

export interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
  sourceUrl?: string;
  license?: string;
}
