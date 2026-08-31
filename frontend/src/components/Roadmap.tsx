// src/components/Roadmap.tsx
import React from 'react';
import './Roadmap.css';
import { useTranslate } from '../i18n/useTranslate';
// ایمپورت کردن شیء نقشه راه که در مرحله قبل ساختیم
import { roadmapTranslations } from '../i18n/translations/roadmap'; 

const Roadmap: React.FC = () => {
  const { t } = useTranslate(); 

  // استفاده مستقیم از داده‌های ساختاریافته در فایل TS
  const { header, steps } = roadmapTranslations;

  return (
    <section id="roadmap" className="roadmap-section">
      <div className="container">
        <div className="roadmap-heading">
          {/* پاس دادن مستقیم شیء ترجمه به هوک t */}
          <span className="roadmap-kicker">{t(header.kicker)}</span>
          <h2 className="roadmap-title">{t(header.title)}</h2>
          <p className="roadmap-intro">{t(header.intro)}</p>
        </div>

        <div className="roadmap-timeline">
          {steps.map((step, index) => (
            <div key={index} className="roadmap-card">
              <div className="roadmap-number">{step.number}</div>
              <div className="roadmap-icon">{step.icon}</div>
              
              {/* پاس دادن شیء ترجمه عنوان و توضیحات به هوک t */}
              <h3 className="roadmap-step-title">
                {t(step.title)}
              </h3>
              <p className="roadmap-step-desc">
                {t(step.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
