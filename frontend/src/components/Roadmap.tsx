import React from 'react';
import './Roadmap.css';
import { useI18n } from '../i18n/I18nContext';
import { roadmapTranslations } from '../i18n/translations/roadmap';

const Roadmap: React.FC = () => {
  const { lang } = useI18n();
  const { header, steps } = roadmapTranslations;

  return (
    <section id="roadmap" className="roadmap-section">
      <div className="container">
        <div className="roadmap-heading">
          <span className="roadmap-kicker">{header.kicker[lang as keyof typeof header.kicker]}</span>
          <h2 className="roadmap-title">{header.title[lang as keyof typeof header.title]}</h2>
          <p className="roadmap-intro">{header.intro[lang as keyof typeof header.intro]}</p>
        </div>

        <div className="roadmap-timeline">
          {steps.map((step, index) => (
            <div key={index} className="roadmap-card">
              <div className="roadmap-number">{step.number}</div>
              <div className="roadmap-icon">{step.icon}</div>
              <h3>{step.content.title[lang as keyof typeof step.content.title]}</h3>
              <p>{step.content.description[lang as keyof typeof step.content.description]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
