import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import './Header.css';

interface NavItem {
  name: string;
  path: string;
}

const Header: React.FC = () => {
  const { t } = useI18n();

  const navLinks: NavItem[] = [
    { name: t('navAccounts'), path: '/accounts' },
    { name: t('navLedgers'), path: '/ledgers' },
    { name: t('navPayments'), path: '/payments' },
    { name: t('navTrades'), path: '/trades' },
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
