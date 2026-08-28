import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';
import { useI18n } from '../i18n/I18nContext';

const Footer = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
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
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Pi<span>Explorer</span>
          </Link>

          <div className="footer-badge">{t('digFullName')}</div>

          <p className="footer-description">{t('footerDescription')}</p>
        </div>

        <ul className="footer-links">
          <li>
            <Link to="/dig" className="footer-link">
              {t('navDig')}
            </Link>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('features')} className="footer-link-button">
              {t('features')}
            </button>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('roadmap')} className="footer-link-button">
              {t('navRoadmap')}
            </button>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('poll')} className="footer-link-button">
              {t('governance')}
            </button>
          </li>

          <li>
            <button type="button" onClick={() => scrollToSection('about')} className="footer-link-button">
              {t('aboutUs')}
            </button>
          </li>

          <li>
            <Link to="/apps" className="footer-link">
              {t('shop')}
            </Link>
          </li>

          <li>
            <Link to="/tasks" className="footer-link">
              {t('tasks')}
            </Link>
          </li>
        </ul>

        <div className="footer-legal-links">
          <a href="/privacy.html" className="footer-legal-link" target="_blank" rel="noopener noreferrer">
            {t('privacyPolicy')}
          </a>

          <span className="footer-legal-separator">•</span>

          <a href="/terms.html" className="footer-legal-link" target="_blank" rel="noopener noreferrer">
            {t('termsOfService')}
          </a>

          <span className="footer-legal-separator">•</span>

          <a href="/whitepaper.html" className="footer-legal-link" target="_blank" rel="noopener noreferrer">
            {t('whitepaper')}
          </a>
        </div>

        <div className="footer-note">
          <p>{t('footerNote')}</p>
        </div>

        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Pi Explorer. {t('footerRights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
            
