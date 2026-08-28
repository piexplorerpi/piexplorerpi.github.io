import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate } from '../../i18n/useTranslate';
import { headerTranslations } from '../../i18n/translations/header';
import './Header.css';

const Header: React.FC = () => {
  const { t } = useTranslate();

  const navLinks = [
    { name: t(headerTranslations.navAccounts), path: '/accounts' },
    { name: t(headerTranslations.navLedgers), path: '/ledgers' },
    { name: t(headerTranslations.navPayments), path: '/payments' },
    { name: t(headerTranslations.navTrades), path: '/trades' },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-brand">
          <Link to="/">
            <span className="brand-logo">π</span>
            <span className="brand-text">Pi Explorer</span>
          </Link>
        </div>
        
        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="nav-link">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
