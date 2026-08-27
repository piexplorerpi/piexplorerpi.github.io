import React from 'react';
import './Roadmap.css';
import { useI18n } from '../i18n/I18nContext';
import { roadmapTranslations } from '../i18n/translations/roadmap';

const Roadmap = () => {
  const { t, i18n } = useI18n();

  // تشخیص زبان فعلی (fa یا en) برای انتخاب آرایه صحیح از فایل ترجمه
  const currentLang = i18n.language === 'fa' ? 'fa' : 'en';
  
  // استخراج مراحل بر اساس زبان فعلی
  const steps = roadmapTranslations[currentLang].steps;

  return (
    <section id="roadmap" className="roadmap-section">
      <div className="container">
        <div className="roadmap-heading">
          <span className="roadmap-kicker">
            {/* استفاده از t برای عنوان کوتاه پروژه یا مستقیم از فایل ترجمه */}
            {roadmapTranslations[currentLang].kicker}
          </span>

          <h2 className="roadmap-title">
            {t('roadmapTitle')}
          </h2>

          <p className="roadmap-intro">
            {t('roadmapIntro')}
          </p>
        </div>

        <div className="roadmap-timeline">
          {steps.map((step, index) => (
            <div key={index} className="roadmap-card">
              <div className="roadmap-number">
                {step.number}
              </div>

              <div className="roadmap-icon">
                {step.icon}
              </div>

              <h3>
                {step.title}
              </h3>

              <p>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
