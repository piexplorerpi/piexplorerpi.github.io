import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { appsCatalog, AppCategory, AppItem } from '../../data/appsCatalog';
import './AppsPage.css';

type StatusMsgType = 'success' | 'error' | 'info';
interface StatusMsg {
  type: StatusMsgType;
  text: string;
}

const allCategories: (AppCategory | 'All')[] = ['All', 'DeFi', 'NFT', 'Games', 'Tools', 'Social', 'Education'];

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

const AppsPage: React.FC = () => {
  const { t, lang } = useI18n();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(AppCategory | 'All')>('All');
  const [statusMsg, setStatusMsg] = useState<StatusMsg | null>(null);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();

    return appsCatalog.filter((app) => {
      const inCategory = category === 'All' ? true : app.category === category;
      if (!inCategory) return false;

      if (!q) return true;

      const { title, description } = pickLocalized(app, lang);
      const haystack = `${title} ${description} ${(app.tags || []).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category, lang]);

  return (
    <div className="apps-page">
      <div className="apps-container">
        <header className="apps-header">
          <h2 className="apps-title">dApps Directory</h2>
          <p className="apps-subtitle">
            Browse apps, open details, then Boost with Pi (next step).
          </p>
        </header>

        <div className="apps-controls">
          <div>
            <label className="apps-label" htmlFor="apps-search-input">
              Search
            </label>
            <input
              id="apps-search-input"
              className="apps-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tags, description..."
            />
          </div>

          <div>
            <label className="apps-label" htmlFor="apps-category-select">
              Category
            </label>
            <select
              id="apps-category-select"
              className="apps-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="apps-stats">
            <div className="apps-stat">
              <span className="apps-stat-label">Results</span>
              <strong className="apps-stat-value">{filteredApps.length}</strong>
            </div>
            <div className="apps-stat">
              <span className="apps-stat-label">Total</span>
              <strong className="apps-stat-value">{appsCatalog.length}</strong>
            </div>
          </div>
        </div>

        {statusMsg && <div className={`apps-banner ${statusMsg.type}`}>{statusMsg.text}</div>}

        {filteredApps.length === 0 ? (
          <div className="apps-empty">
            <div className="apps-empty-icon">🔎</div>
            <div>No apps found.</div>
          </div>
        ) : (
          <div className="apps-grid">
            {filteredApps.map((app) => {
              const { title, description } = pickLocalized(app, lang);

              return (
                <article key={app.id} className="app-card">
                  <div className="app-card-media">
                    <img
                      src={app.image || 'https://via.placeholder.com/1200x720'}
                      alt={title}
                      loading="lazy"
                    />
                    {app.isVerified && <span className="app-badge">Verified</span>}
                  </div>

                  <div className="app-card-body">
                    <div className="app-card-top">
                      <h3 className="app-card-title">{title}</h3>
                      <span className="app-card-category">{app.category}</span>
                    </div>

                    <p className="app-card-desc">{description}</p>

                    <div className="app-tags">
                      {(app.tags || []).slice(0, 4).map((tag) => (
                        <span key={tag} className="app-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="app-actions">
                      <Link className="app-btn primary" to={`/apps/${app.id}`}>
                        View details
                      </Link>

                      <button
                        className="app-btn ghost"
                        type="button"
                        onClick={() => {
                          const url = app.websiteUrl || app.demoUrl || app.githubUrl;
                          if (!url) {
                            setStatusMsg({ type: 'info', text: 'No external link available yet.' });
                            return;
                          }
                          window.open(url, '_blank', 'noopener,noreferrer');
                          setStatusMsg({ type: 'success', text: `Opened: ${title}` });
                        }}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="apps-hint">
          <strong>Next:</strong> In App Details page we’ll add <em>Boost with Pi</em> + optional Poll/Vote integration.
        </div>
      </div>
    </div>
  );
};

export default AppsPage;
