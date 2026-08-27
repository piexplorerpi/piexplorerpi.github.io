import React from 'react';
import './Hero.css';
import { useI18n } from '../i18n/I18nContext';

const Hero: React.FC = () => {
  const { t } = useI18n();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero">
      <div className="hero-badge">Pi Explorer · Decentralized Governance</div>
      <h1>{t('digHeroTitle')}</h1>
      <p>{t('digHeroDescription')}</p>

      <div className="hero-btns">
        <button onClick={() => scrollToSection('pi-payment-panel')} className="btn-primary">
          🔐 {t('joinWithPi')}
        </button>
        <button onClick={() => scrollToSection('about')} className="btn-secondary">
          🌐 {t('exploreDig')}
        </button>
      </div>
    </section>
  );
};

export default Hero;
