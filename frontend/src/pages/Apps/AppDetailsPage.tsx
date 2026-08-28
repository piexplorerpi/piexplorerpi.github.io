import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import './AppDetailsPage.css';

// تعریف Interface مربوط به دیتای اپلیکیشن (برای رعایت قوانین TypeScript)
export type AppCategory = 'DeFi' | 'NFT' | 'Games' | 'Tools' | 'Social' | 'Education';

export interface AppItem {
  id: string;
  title: string;
  titleFa?: string;
  titleTr?: string;
  description: string;
  descriptionFa?: string;
  descriptionTr?: string;
  category: AppCategory;
  tags?: string[];
  image?: string;
  isVerified?: boolean;
  websiteUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
}

function pickLocalized(app: AppItem, lang: string) {
  const title =
    lang === 'fa' ? app.titleFa || app.title : lang === 'tr' ? app.titleTr || app.title : app.title;

  const description =
    lang === 'fa'
      ? app.descriptionFa || app.description
      : lang === 'tr'
        ? app.descriptionTr || app.description
        : app.description;

  return { title, description };
}

const AppDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useI18n();

  const [app, setApp] = useState<AppItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // دریافت داده‌ها از بک‌اند بر اساس ID
  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        // آدرس API خود را اینجا قرار دهید
        const response = await fetch(`/api/apps/${id}`);
        if (!response.ok) throw new Error('App not found');
        const data = await response.json();
        setApp(data);
      } catch (error) {
        console.error("Error fetching app details:", error);
        setApp(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApp();
  }, [id]);

  if (loading) {
    return (
        <div className="app-details-page">
            <div className="app-details-container">Loading details...</div>
        </div>
    );
  }

  if (!app) {
    return (
      <div className="app-details-page">
        <div className="app-details-container">
          <div className="app-details-notfound">
            <h2>App not found</h2>
            <p>The requested app does not exist (yet) in Pi Explorer.</p>
            <Link className="back-link" to="/apps">
              ← Back to Apps
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { title, description } = pickLocalized(app, lang);
  const externalUrl = app.websiteUrl || app.demoUrl || app.githubUrl;

  const handleBoost = () => {
    navigate('/payment', {
      state: {
        purpose: 'BOOST_APP',
        appId: app.id,
        appTitle: title,
      },
    });
  };

  return (
    <div className="app-details-page">
      <div className="app-details-container">
        <div className="app-details-topbar">
          <Link className="back-link" to="/apps">
            ← Back to Apps
          </Link>
          {app.isVerified && <span className="verified-pill">Verified</span>}
        </div>

        <div className="app-details-hero">
          <div className="app-details-media">
            <img src={app.image || 'https://via.placeholder.com/1200x720'} alt={title} />
          </div>

          <div className="app-details-info">
            <h1 className="app-details-title">{title}</h1>

            <div className="app-details-meta">
              <span className="meta-item">{app.category}</span>
              {(app.tags || []).slice(0, 6).map((tag) => (
                <span key={tag} className="meta-tag">
                  {tag}
                </span>
              ))}
            </div>

            <p className="app-details-desc">{description}</p>

            <div className="app-details-actions">
              {externalUrl ? (
                <a className="btn primary" href={externalUrl} target="_blank" rel="noopener noreferrer">
                  Open App
                </a>
              ) : (
                <button className="btn disabled" type="button" disabled>
                  No link yet
                </button>
              )}

              <button className="btn ghost" type="button" onClick={handleBoost}>
                Boost with Pi
              </button>
            </div>

            <div className="app-details-note">
              Boost uses Pi Explorer payment flow. You will be redirected to the payment panel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsPage;
