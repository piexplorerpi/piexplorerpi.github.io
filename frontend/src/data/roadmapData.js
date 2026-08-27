// این فایل فقط ساختار فیزیکی نقشه راه را نگه می‌دارد.
// تمام متن‌ها باید در frontend/src/i18n/translations/roadmap.ts باشند.

export interface RoadmapStep {
  number: string;
  icon: string;
  key: string; // این کلید برای پیدا کردن متن در فایل ترجمه است
}

export const roadmapData: RoadmapStep[] = [
  { number: '01', icon: '🌱', key: 'phase1' },
 { number: '02', icon: '🗳️', key: 'phase2' },
  { number: '03', icon: 📊', key: 'phase3' },
  { number: '04', icon: '🌐', key: 'phase4' },
