import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslate } from '../i18n/useTranslate';
import { appListTranslations } from '../i18n/translations/appList';
import './AppList.css';

interface AppItem {
  id: string;
  title: string;
  description: string;
  image: string;
  isVerified: boolean;
  websiteUrl?: string;
}

const AppList: React.FC = () => {
  const { t } = useTranslate();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // نکته: در محیط Production حتماً از import.meta.env.VITE_API_URL استفاده کنید
        const response = await axios.get('http://localhost:5000/api/apps');
        setApps(response.data);
      } catch (err) {
        console.error("Error fetching Pi Explorer apps:", err);
        // خطا را از فایل ترجمه می‌گیریم
        setError(t(appListTranslations.error));
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [t]); // اضافه کردن t به وابستگی‌ها برای اطمینان از آپدیت شدن در صورت تغییر زبان

  if (loading) return <div className="apps-loader">{t(appListTranslations.loading)}</div>;
  if (error) return <div className="apps-error">{error}</div>;

  return (
    <div className="apps-grid">
      {apps.map((app) => (
        <article key={app.id} className="app-card">
          <div className="app-card-media">
            <img 
              src={app.image || '/placeholder-app.png'} 
              alt={app.title} 
              loading="lazy" 
            />
            {app.isVerified && (
              <span className="app-badge">
                {t(appListTranslations.verifiedBadge)}
              </span>
            )}
          </div>
          
          <div className="app-card-body">
            <h3 className="app-card-title">{app.title}</h3>
            <p className="app-card-desc">{app.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default AppList;
