import React from 'react';
import './Features.css';
import { useTranslate } from '../i18n/useTranslate';
import { featuresTranslations } from '../i18n/translations/features';

const Features: React.FC = () => {
  const { t } = useTranslate();

  // ساختار آرایه ویژگی‌ها
  const features = [
    {
      title: t(featuresTranslations.featureVotingTitle),
      description: t(featuresTranslations.featureVotingDesc),
      icon: '🗳️',
    },
    {
      title: t(featuresTranslations.featureTransparencyTitle),
      description: t(featuresTranslations.featureTransparencyDesc),
      icon: '🔍',
    },
    {
      title: t(featuresTranslations.featureIdentityTitle),
      description: t(featuresTranslations.featureIdentityDesc),
      icon: 'π',
    },
    {
      title: t(featuresTranslations.featureInfraTitle),
      description: t(featuresTranslations.featureInfraDesc),
      icon: '🌐',
    },
    {
      title: t(featuresTranslations.featureEconomyTitle),
      description: t(featuresTranslations.featureEconomyDesc),
      icon: '💠',
    },
    {
      title: t(featuresTranslations.featureConflictTitle),
      description: t(featuresTranslations.featureConflictDesc),
      icon: '🤝',
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-heading">
          <span className="features-kicker">Pi Explorer</span>
          <h2 className="section-title">{t(featuresTranslations.sectionTitle)}</h2>
          <p className="features-intro">{t(featuresTranslations.sectionIntro)}</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
