import React from 'react';
import './Features.css';
import { useI18n } from '../i18n/I18nContext';

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

const Features: React.FC = () => {
  const { t } = useI18n();

  const features: FeatureItem[] = [
    {
      title: t('featureGlobalVotingTitle'),
      description: t('featureGlobalVotingDescription'),
      icon: '🗳️',
    },
    {
      title: t('featureTransparentGovernanceTitle'),
      description: t('featureTransparentGovernanceDescription'),
      icon: '🔍',
    },
    {
      title: t('featurePiIdentityTitle'),
      description: t('featurePiIdentityDescription'),
      icon: 'π',
    },
    {
      title: t('featureDaoInfrastructureTitle'),
      description: t('featureDaoInfrastructureDescription'),
      icon: '🌐',
    },
    {
      title: t('featureDigitalEconomyTitle'),
      description: t('featureDigitalEconomyDescription'),
      icon: '💠',
    },
    {
      title: t('featureConflictResolutionTitle'),
      description: t('featureConflictResolutionDescription'),
      icon: '🤝',
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-heading">
          <span className="features-kicker">Pi Explorer</span>
          <h2 className="section-title">{t('digFeaturesSectionTitle')}</h2>
          <p className="features-intro">{t('digFeaturesSectionIntro')}</p>
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
