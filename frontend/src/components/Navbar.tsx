import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useTranslate } from '../i18n/useTranslate';
import { navbarTranslations } from '../i18n/translations/navbar';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const doScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
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
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="navbar-logo-link" aria-label="Pi Explorer Home">
            <img src={logo} alt="Pi Explorer Logo" className="navbar-logo-img" />
            <span className="navbar-logo-text">
              Pi<span>Explorer</span>
            </span>
          </Link>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              {t(navbarTranslations.home)}
            </Link>
          </li>

          <li className="nav-item">
            <button type="button" className="nav-link nav-button" onClick={() => scrollToSection('features')}>
              {t(navbarTranslations.features)}
            </button>
          </li>

          <li className="nav-item">
            <button type="button" className="nav-link nav-button" onClick={() => scrollToSection('roadmap')}>
              {t(navbarTranslations.navRoadmap)}
            </button>
          </li>

          <li className="nav-item">
            <button type="button" className="nav-link nav-button" onClick={() => scrollToSection('poll')}>
              {t(navbarTranslations.governance)}
            </button>
          </li>

          <li className="nav-item">
            <button type="button" className="nav-link nav-button" onClick={() => scrollToSection('about')}>
              {t(navbarTranslations.aboutUs)}
            </button>
          </li>

          <li className="nav-item">
            <Link to="/apps" className="nav-link">
              {t(navbarTranslations.shop)}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/tasks" className="nav-link">
              {t(navbarTranslations.tasks)}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
