// frontend/src/components/Footer.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';
// اصلاح Import: استفاده از I18nContext به جای useTranslate
import { useI18n } from '../i18n/I18nContext'; 
import { footerTranslations } from '../i18n/translations/footer';

const Footer: React.FC = () => {
  // اصلاح هوک: استفاده از useI18n
  const { t } = useI18n(); 
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const doScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Section not found: #${sectionId}`);
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => doScroll(), 250);
    } else {
      doScroll();
    }
  };

  return (
    <footer className="footer">
      {/* ... بقیه محتوا دقیقاً مثل قبل باقی می‌ماند ... */}
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Pi<span>Explorer</span>
          </Link>

          <div className="footer-badge">{t(footerTranslations.fullName)}</div>

          <p className="footer-description">{t(footerTranslations.description)}</p>
        </div>

        <ul className="footer-links">
          <li>
            <Link to="/dig" className="footer-link">
              {t(footerTranslations.navDig)}
            </Link>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('features')} className="footer-link-button">
              {t(footerTranslations.features)}
            </button>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('roadmap')} className="footer-link-button">
              {t(footerTranslations.navRoadmap)}
            </button>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('poll')} className="footer-link-button">
              {t(footerTranslations.governance)}
            </button>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('about')} className="footer-link-button">
              {t(footerTranslations.aboutUs)}
            </button>
          </li>

          <li>
            <Link to="/apps" className="footer-link">
              {t(footerTranslations.shop)}
            </Link>
          </li>

          <li>
            <Link to="/tasks" className="footer-link">
              {t(footerTranslations.tasks)}
            </Link>
          </li>
        </ul>

        <div className="footer-legal-links">
          <a href="/privacy.html" className="footer-legal-link" target="_blank" rel="noopener noreferrer">
            {t(footerTranslations.privacyPolicy)}
          </a>

          <span className="footer-legal-separator">•</span>

          <a href="/terms.html" className="footer-legal-link" target="_blank" rel="noopener noreferrer">
            {t(footerTranslations.termsOfService)}
          </a>

          <span className="footer-legal-separator">•</span>

          <a href="/whitepaper.html" className="footer-legal-link" target="_blank" rel="noopener noreferrer">
            {t(footerTranslations.whitepaper)}
          </a>
        </div>

        <div className="footer-note">
          <p>{t(footerTranslations.footerNote)}</p>
        </div>

        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Pi Explorer. {t(footerTranslations.footerRights)}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
