export type AppCategory = 'DeFi' | 'NFT' | 'Games' | 'Tools' | 'Social' | 'Education';

export interface AppItem {
  id: string;
  category: AppCategory;

  title: string;
  titleFa?: string;
  titleTr?: string;

  description: string;
  descriptionFa?: string;
  descriptionTr?: string;

  image?: string;

  tags?: string[];

  websiteUrl?: string;
  demoUrl?: string;
  githubUrl?: string;

  isVerified?: boolean;

  // Future fields (kept for expansion)
  // boostPricePi?: number;
  // piAppId?: string;
  // ownerWallet?: string;
}

export const appsCatalog: AppItem[] = [
  {
    id: 'pi-explorer',
    category: 'Tools',
    title: 'Pi Explorer',
    titleFa: 'پای اکسپلورر',
    titleTr: 'Pi Explorer',
    description: 'Explore Pi apps, boost projects, and discover new dApps.',
    descriptionFa: 'اکوسیستم پای را کشف کن، پروژه‌ها را Boost کن و dAppهای جدید ببین.',
    descriptionTr: 'Pi uygulamalarını keşfet, projeleri Boost et ve yeni dApp’leri bul.',
    image: 'https://via.placeholder.com/1200x720',
    tags: ['Directory', 'Explorer', 'Boost'],
    websiteUrl: 'https://example.com',
    isVerified: true,
  },
  {
    id: 'pi-swap',
    category: 'DeFi',
    title: 'Pi Swap',
    titleFa: 'پای سواپ',
    titleTr: 'Pi Swap',
    description: 'Swap tokens with a simple UI (demo listing).',
    descriptionFa: 'سواپ توکن‌ها با رابط کاربری ساده (دمو).',
    descriptionTr: 'Basit arayüz ile token swap (demo).',
    image: 'https://via.placeholder.com/1200x720',
    tags: ['Swap', 'DEX'],
    demoUrl: 'https://example.com/demo',
  },
  {
    id: 'pi-gallery',
    category: 'NFT',
    title: 'Pi Gallery',
    titleFa: 'گالری پای',
    titleTr: 'Pi Gallery',
    description: 'NFT collections and artists (demo listing).',
    descriptionFa: 'کالکشن‌های NFT و هنرمندان (دمو).',
    descriptionTr: 'NFT koleksiyonları ve sanatçılar (demo).',
    image: 'https://via.placeholder.com/1200x720',
    tags: ['NFT', 'Marketplace'],
  },
  {
    id: 'pi-academy',
    category: 'Education',
    title: 'Pi Academy',
    titleFa: 'آکادمی پای',
    titleTr: 'Pi Academy',
    description: 'Learn Pi ecosystem concepts (demo listing).',
    descriptionFa: 'آموزش مفاهیم اکوسیستم پای (دمو).',
    descriptionTr: 'Pi ekosistemi kavramlarını öğren (demo).',
    image: 'https://via.placeholder.com/1200x720',
    tags: ['Learning', 'Guides'],
  },
];
