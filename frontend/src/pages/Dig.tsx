// frontend/src/pages/Dig.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../i18n/I18nContext';
import { digTranslations } from '../i18n/translations/dig';
import './Dig.css';

const Dig: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="dig-page">
      <Navbar />

      <main className="dig-main">
        <div className="dig-language">
          <LanguageSwitcher />
        </div>

        <section className="dig-hero-section">
          <div className="dig-container">
            <div className="dig-badge">
              {t(digTranslations.digShortName)} · {t(digTranslations.digFullName)}
            </div>

            <h1 className="dig-title">
              {t(digTranslations.digPageTitle)}
            </h1>

            <p className="dig-lead">
              {t(digTranslations.digPageLead)}
            </p>

            <div className="dig-actions">
              <Link to="/" className="dig-primary-link">
                {t(digTranslations.backToHome)}
              </Link>

              <a href="#dig-roadmap" className="dig-secondary-link">
                {t(digTranslations.navRoadmap)}
              </a>
            </div>
          </div>
        </section>

        <section className="dig-content-section">
          <div className="dig-container dig-grid">
            <article className="dig-card dig-card-large">
              <span className="dig-card-icon">🌍</span>
              <h2>{t(digTranslations.digWhatTitle)}</h2>
              <p>{t(digTranslations.digWhatText)}</p>
            </article>

            <article className="dig-card">
              <span className="dig-card-icon">🗳️</span>
              <h3>{t(digTranslations.digVotingTitle)}</h3>
              <p>{t(digTranslations.digVotingText)}</p>
            </article>

            <article className="dig-card">
              <span className="dig-card-icon">🔍</span>
              <h3>{t(digTranslations.digTransparencyTitle)}</h3>
              <p>{t(digTranslations.digTransparencyText)}</p>
            </article>

            <article className="dig-card">
              <span className="dig-card-icon">π</span>
              <h3>{t(digTranslations.digPiRoleTitle)}</h3>
              <p>{t(digTranslations.digPiRoleText)}</p>
            </article>

            <article className="dig-card">
              <span className="dig-card-icon">🤝</span>
              <h3>{t(digTranslations.digConflictTitle)}</h3>
              <p>{t(digTranslations.digConflictText)}</p>
            </article>

            <article className="dig-card">
              <span className="dig-card-icon">💠</span>
              <h3>{t(digTranslations.digDibTitle)}</h3>
              <p>{t(digTranslations.digDibText)}</p>
            </article>
          </div>
        </section>

        <section id="dig-roadmap" className="dig-roadmap-section">
          <div className="dig-container">
            <div className="dig-section-heading">
              <span>{t(digTranslations.digShortName)}</span>
              <h2>{t(digTranslations.digManifestoRoadmapTitle)}</h2>
              <p>{t(digTranslations.digManifestoRoadmapIntro)}</p>
            </div>

            <div className="dig-roadmap-list">
              <div className="dig-roadmap-item">
                <strong>01</strong>
                <div>
                  <h3>{t(digTranslations.roadmapStep1Title)}</h3>
                  <p>{t(digTranslations.roadmapStep1Description)}</p>
                </div>
              </div>

              <div className="dig-roadmap-item">
                <strong>02</strong>
                <div>
                  <h3>{t(digTranslations.roadmapStep2Title)}</h3>
                  <p>{t(digTranslations.roadmapStep2Description)}</p>
                </div>
              </div>

              <div className="dig-roadmap-item">
                <strong>03</strong>
                <div>
                  <h3>{t(digTranslations.roadmapStep3Title)}</h3>
                  <p>{t(digTranslations.roadmapStep3Description)}</p>
                </div>
              </div>

              <div className="dig-roadmap-item">
                <strong>04</strong>
                <div>
                  <h3>{t(digTranslations.roadmapStep4Title)}</h3>
                  <p>{t(digTranslations.roadmapStep4Description)}</p>
                </div>
              </div>

              <div className="dig-roadmap-item">
                <strong>05</strong>
                <div>
                  <h3>{t(digTranslations.roadmapStep5Title)}</h3>
                  <p>{t(digTranslations.roadmapStep5Description)}</p>
                </div>
              </div>

              <div className="dig-roadmap-item">
                <strong>06</strong>
                <div>
                  <h3>{t(digTranslations.roadmapStep6Title)}</h3>
                  <p>{t(digTranslations.roadmapStep6Description)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dig-disclaimer-section">
          <div className="dig-container">
            <div className="dig-disclaimer">
              <h2>{t(digTranslations.digDisclaimerTitle)}</h2>
              <p>{t(digTranslations.digDisclaimerText)}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dig;
