export type Category = 
  | 'all' 
  | 'art' 
  | 'temple' 
  | 'food' 
  | 'craft' 
  | 'heritage';

export interface Place {
  id: string;
  name: string;
  nameEn: string;
  category: 'art' | 'temple' | 'food' | 'craft' | 'heritage';
  categoryLabel: string;
  tag: string;
  description: string;
  detailedStory: string;
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  openingHours: string;
  openDays: string;
  isOpenNow: boolean;
  distanceFromMRT: string;
  estimatedTime: string;
  fee: string;
  highlights: string[];
  coordinates: { x: number; y: number; lat: number; lng: number };
  address: string;
  recommendedTimeOfDay?: string;
  hasPuppetShow?: boolean;
  hasWorkshop?: boolean;
}

export interface RouteStop {
  stopNumber: number;
  time: string;
  placeId: string;
  title: string;
  activity: string;
  duration: string;
  tips: string;
}

export interface TourRoute {
  id: string;
  title: string;
  subtitle: string;
  distance: string;
  duration: string;
  difficulty: 'ง่าย (เหมาะกับทุกวัย)' | 'ปานกลาง' | 'เดินเยอะ';
  stopsCount: number;
  themeColor: string;
  description: string;
  recommendedStart: string;
  stops: RouteStop[];
}

export interface VideoEpisode {
  id: string;
  title: string;
  speaker: string;
  role: string;
  duration: string;
  thumbnail: string;
  summary: string;
  topics: string[];
  embedId?: string;
}

export interface CulturalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  image: string;
  content: string[];
  facts: { label: string; value: string }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  badgeUnlock?: string;
}
