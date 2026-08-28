import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import './AppsPage.css';

// 1. تعریف اینترفیس‌ها (به جای ایمپورت از فایل حذف شده)
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

type StatusMsgType = 'success' | 'error' | 'info';
interface StatusMsg {
  type: StatusMsgType;
  text: string;
}

const allCategories: (AppCategory | 'All')[] = ['All', 'DeFi', 'NFT', 'Games', 'Tools', 'Social', 'Education'];

// تعریف تابع خارج از کامپوننت برای تمیز ماندن کد
const pickLocalizedContent = (app: AppItem, lang: string): { title: string; description: string } => {
  const title = lang === 'fa' ? (app.titleFa || app.title) : lang === 'tr' ? (app.titleTr || app.title) : app.title;
  const description = lang === 'fa' ? (app.descriptionFa || app.description) : lang === 'tr' ? (app.descriptionTr || app.description) : app.description;
  return { title, description };
};

const AppsPage: React.FC = () => {
  const { lang } = useI18n();

  // وضعیت‌های جدید
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<(AppCategory | 'All')>('All');
  const [statusMsg, setStatusMsg] = useState<StatusMsg | null>(null);

  // 2. دریافت داده‌ها از بک‌اند
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        // مسیر API بک‌اند خود را اینجا قرار دهید
        const response = await fetch('/api/apps'); 
        if (!response.ok) throw new Error('Failed to fetch apps');
        const data = await response.json();
        setApps(data);
      } catch (error) {
        console.error("Error fetching apps:", error);
        setStatusMsg({ type: 'error', text: 'Could not load dApps. Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const filteredApps = useMemo(() => {
    const searchLower = query.trim().toLowerCase();
    return apps.filter((app) => {
      const matchesCategory = category === 'All' || app.category === category;
      if (!matchesCategory) return false;
      if (!searchLower) return true;

      const { title, description } = pickLocalizedContent(app, lang);
      const haystack = `${title} ${description} ${(app.tags || []).join(' ')}`.toLowerCase();
      return haystack.includes(searchLower);
    });
  }, [query, category, lang, apps]);

  const showStatusMessage = useCallback((type: StatusMsgType, text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 5000);
  }, []);

  const handleOpenApp = useCallback((app: AppItem) => {
    const url = app.websiteUrl || app.demoUrl || app.githubUrl;
    if (!url) {
      showStatusMessage('info', 'No external link available yet.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    const { title } = pickLocalizedContent(app, lang);
    showStatusMessage('success', `Opened: ${title}`);
  }, [lang, showStatusMessage]);

  return (
    <div className="apps-page" role="main">
      <div className="apps-container">
        <header className="apps-header">
          <h2 className="apps-title">Pi Explorer · dApps Directory</h2>
        </header>

        {loading ? (
          <div className="apps-loading">Loading apps...</div>
        ) : (
          <>
            <div className="apps-controls">
              {/* بخش جستجو و دسته‌بندی */}
              <div className="control-group">
                <label className="apps-label" htmlFor="apps-search-input">Search Apps</label>
                <input
                  id="apps-search-input"
                  className="apps-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, tags, description..."
                />
              </div>

              <div className="control-group">
                <label className="apps-label" htmlFor="apps-category-select">Category</label>
                <select
                  id="apps-category-select"
                  className="apps-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AppCategory | 'All')}
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="apps-stats">
                <div className="apps-stat">
                  <span className="apps-stat-label">Results</span>
                  <strong className="apps-stat-value">{filteredApps.length}</strong>
                </div>
                <div className="apps-stat">
                  <span className="apps-stat-label">Total Apps</span>
                  <strong className="apps-stat-value">{apps.length}</strong>
                </div>
              </div>
            </div>

            {/* بخش نمایش لیست اپلیکیشن‌ها */}
            {filteredApps.length === 0 ? (
              <div className="apps-empty">No dApps found.</div>
            ) : (
              <div className="apps-grid">
                {filteredApps.map((app) => {
                  const { title, description } = pickLocalizedContent(app, lang);
                  return (
                    <article key={app.id} className="app-card">
                      <div className="app-card-body">
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <div className="app-actions">
                          <Link className="app-btn primary" to={`/apps/${app.id}`}>View details</Link>
                          <button className="app-btn ghost" onClick={() => handleOpenApp(app)}>Open</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AppsPage;
