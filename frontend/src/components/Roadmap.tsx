import React from 'react';
import './Roadmap.css';
import { useTranslate } from '../i18n/useTranslate'; // مهاجرت به هوک جدید

// تعریف اینترفیس برای داده‌های استاتیک (نقشه راه معمولاً دیتا است، نه متن ترجمه شده)
interface RoadmapStep {
  number: string;
  icon: string;
  translationKey: string; // کلید مربوط به فایل ترجمه
}

const ROADMAP_STEPS: RoadmapStep[] = [
  { number: '01', icon: '🚀', translationKey: 'step1' },
  { number: '02', icon: '🌐', translationKey: 'step2' },
  { number: '03', icon: '🏆', translationKey: 'step3' },
];

const Roadmap: React.FC = () => {
  const { t } = useTranslate(); // استفاده از هوک جدید

  return (
    <section id="roadmap" className="roadmap-section">
      <div className="container">
        <div className="roadmap-heading">
          <span className="roadmap-kicker">{t('roadmap.kicker')}</span>
          <h2 className="roadmap-title">{t('roadmap.title')}</h2>
          <p className="roadmap-intro">{t('roadmap.intro')}</p>
        </div>

        <div className="roadmap-timeline">
          {ROADMAP_STEPS.map((step, index) => (
            <div key={index} className="roadmap-card">
              <div className="roadmap-number">{step.number}</div>
              <div className="roadmap-icon">{step.icon}</div>
              {/* استفاده از کلید داینامیک برای دسترسی به عنوان و توضیحات هر مرحله */}
              <h3 className="roadmap-step-title">
                {t(`roadmap.steps.${step.translationKey}.title`)}
              </h3>
              <p className="roadmap-step-desc">
                {t(`roadmap.steps.${step.translationKey}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
