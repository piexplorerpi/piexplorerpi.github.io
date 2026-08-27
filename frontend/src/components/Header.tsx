import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import './Header.css'; // فرض بر وجود استایل مناسب

const Header: React.FC = () => {
  const { t } = useI18n();

  return (
    <header className="main-header">
      <div className="header-container">
        {/* استفاده از کلید ترجمه برند Pi Explorer */}
        <div className="logo-placeholder">
          <h1>{t('brandName') || 'Pi Explorer'}</h1>
        </div>
        
        {/* در صورت نیاز به شعار پروژه یا اطلاعات اضافی */}
        <p className="header-subtitle">
            {t('headerSubtitle') || 'Decentralized Ecosystem Explorer'}
        </p>
      </div>
    </header>
  );
};

export default Header;
