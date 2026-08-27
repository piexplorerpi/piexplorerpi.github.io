import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useI18n } from '../i18n/I18nContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
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

      setTimeout(() => {
        doScroll();
      }, 250);
    } else {
      doScroll();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="navbar-logo-link" aria-label="PiDao Home">
            <img src={logo} alt="PiDao Logo" className="navbar-logo-img" />

            <span className="navbar-logo-text">
              Pi<span>DAO</span>
            </span>
          </Link>
        </div>

        {/* Main Menu */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              {t('home')}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/dig" className="nav-link">
              {t('navDig')}
            </Link>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className="nav-link nav-button"
              onClick={() => scrollToSection('features')}
            >
              {t('features')}
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className="nav-link nav-button"
              onClick={() => scrollToSection('roadmap')}
            >
              {t('navRoadmap')}
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className="nav-link nav-button"
              onClick={() => scrollToSection('poll')}
            >
              {t('governance')}
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className="nav-link nav-button"
              onClick={() => scrollToSection('about')}
            >
              {t('aboutUs')}
            </button>
          </li>

          {/* CHANGED: /shop -> /apps */}
          <li className="nav-item">
            <Link to="/apps" className="nav-link">
              {t('shop')}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/tasks" className="nav-link">
              {t('tasks')}
            </Link>
          </li>
        </ul>

        {/* Login button removed: login is handled inside pages with Pi */}
      </div>
    </nav>
  );
};

export default Navbar;
