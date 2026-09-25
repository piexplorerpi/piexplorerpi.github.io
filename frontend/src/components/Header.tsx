import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate } from '../i18n/useTranslate';
import { headerTranslations } from '../i18n/translations/header';

const Header: React.FC = () => {
  const { t } = useTranslate();

  const navLinks = [
    { name: t(headerTranslations.title), path: '/' },
    { name: 'Apps', path: '/apps' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'History', path: '/history' },
  ];

  return (
    <header className="header" style={{ padding: '12px 16px', background: '#311b92', color: '#fff' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div className="header-brand">
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="brand-logo" style={{ fontSize: 24 }}>π</span>
            <span className="brand-text">{t(headerTranslations.title)}</span>
          </Link>
        </div>

        <nav className="header-nav" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} style={{ color: '#e0d7ff', textDecoration: 'none', fontWeight: 600 }}>
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.85 }}>{t(headerTranslations.subtitle)}</p>
    </header>
  );
};

export default Header;
