import React from 'react';
import './Hero.css';
import { useTranslate } from '../i18n/useTranslate';
import { heroTranslations } from '../i18n/translations/hero';

const Hero: React.FC = () => {
  const { t } = useTranslate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero">
      <div className="hero-badge">{t(heroTranslations.heroBadge)}</div>
      <h1>{t(heroTranslations.heroTitle)}</h1>
      <p>{t(heroTranslations.heroDescription)}</p>

      <div className="hero-btns">
        <button onClick={() => scrollToSection('pi-payment-panel')} className="btn-primary">
          🔐 {t(heroTranslations.joinWithPi)}
        </button>
        <button onClick={() => scrollToSection('about')} className="btn-secondary">
          🌐 {t(heroTranslations.exploreEcosystem)}
        </button>
      </div>
    </section>
  );
};

export default Hero;
