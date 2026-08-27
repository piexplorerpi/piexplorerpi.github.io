import React from 'react';
import './Roadmap.css';
import { useI18n } from '../i18n/I18nContext';
import { roadmapTranslations } from '../i18n/translations/roadmap';

const Roadmap = () => {
  const { i18n } = useI18n();

  // تعیین زبان فعلی بر اساس تنظیمات i18n پروژه
  const lang = i18n.language === 'fa' ? 'fa' : 
               i18n.language === 'ar' ? 'ar' : 
               i18n.language === 'tr' ? 'tr' : 
               i18n.language === 'zh' ? 'zh' : 'en';

  const { header, steps } = roadmapTranslations;

  return (
    <section id="roadmap" className="roadmap-section">
      <div className="container">
        <div className="roadmap-heading">
          <span className="roadmap-kicker">
            {header.kicker[lang]}
          </span>

          <h2 className="roadmap-title">
            {header.title[lang]}
          </h2>

          <p className="roadmap-intro">
            {header.intro[lang]}
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
                {step.content.title[lang]}
              </h3>

              <p>
                {step.content.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
