import React from 'react';
import './About.css';
import { useTranslate } from '../i18n/useTranslate';
import { aboutTranslations } from '../i18n/translations/about';

const About = () => {
  const { t } = useTranslate();

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-wrapper">
          {/* ستون اول: معرفی Pi Explorer */}
          <div className="about-content">
            <div className="about-kicker">{t(aboutTranslations.aboutExplorerKicker)}</div>

            <h2 className="about-subtitle">{t(aboutTranslations.aboutExplorerSubtitle)}</h2>

            <h1 className="about-title">
              {t(aboutTranslations.aboutExplorerTitleBefore)}{' '}
              <span className="highlight">{t(aboutTranslations.aboutExplorerTitleHighlight)}</span>
            </h1>

            <p className="about-text">{t(aboutTranslations.aboutExplorerText)}</p>

            <p className="about-text about-text-secondary">{t(aboutTranslations.aboutExplorerTextSecondary)}</p>

            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">NET</span>
                <span className="stat-label">{t(aboutTranslations.statNetwork)}</span>
              </div>

              <div className="stat-item">
                <span className="stat-number">Pi</span>
                <span className="stat-label">{t(aboutTranslations.statIdentity)}</span>
              </div>

              <div className="stat-item">
                <span className="stat-number">dApps</span>
                <span className="stat-label">{t(aboutTranslations.statApps)}</span>
              </div>
            </div>
          </div>

          {/* ستون دوم: کارت مأموریت */}
          <div className="about-visual">
            <div className="vision-card">
              <div className="vision-icon">🌍</div>
              <div className="vision-label">{t(aboutTranslations.explorerShortName)}</div>
              <h3>{t(aboutTranslations.explorerMissionTitle)}</h3>
              <p>{t(aboutTranslations.explorerMissionText)}</p>

              <div className="vision-points">
                <div className="vision-point">
                  <span>⚡</span>
                  <p>{t(aboutTranslations.pointSpeed)}</p>
                </div>
                <div className="vision-point">
                  <span>🔍</span>
                  <p>{t(aboutTranslations.pointTransparency)}</p>
                </div>
                <div className="vision-point">
                  <span>🤝</span>
                  <p>{t(aboutTranslations.pointAccess)}</p>
                </div>
              </div>

              <div className="vision-badge">{t(aboutTranslations.badgeAction)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
