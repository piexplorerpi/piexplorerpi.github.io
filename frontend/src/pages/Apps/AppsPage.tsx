import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext'; // اطمینان از صحت مسیر
import { appsCatalog, AppCategory, AppItem } from '../../data/appsCatalog'; // اطمینان از صحت مسیر
import './AppsPage.css';

// تعریف انواع پیام‌های وضعیت برای نمایش به کاربر
type StatusMsgType = 'success' | 'error' | 'info';
interface StatusMsg {
  type: StatusMsgType;
  text: string;
}

// دسته‌بندی‌های موجود به همراه گزینه "همه"
const allCategories: (AppCategory | 'All')[] = ['All', 'DeFi', 'NFT', 'Games', 'Tools', 'Social', 'Education'];

/**
 * انتخاب عنوان و توضیحات محلی‌سازی شده برای یک اپلیکیشن.
 * @param app - آیتم اپلیکیشن از کاتالوگ.
 * @param lang - کد زبان فعلی (مثلا 'fa', 'en', 'tr').
 * @returns آبجکتی شامل عنوان و توضیحات محلی‌سازی شده.
 */
const pickLocalizedContent = useCallback((app: AppItem, lang: string): { title: string; description: string } => {
  // اولویت با فیلدهای محلی‌سازی شده، در غیر این صورت از فیلد پیش‌فرض انگلیسی استفاده می‌شود.
  const title =
    lang === 'fa' ? app.titleFa || app.title :
    lang === 'tr' ? app.titleTr || app.title :
    app.title;

  const description =
    lang === 'fa'
      ? app.descriptionFa || app.description
      : lang === 'tr'
        ? app.descriptionTr || app.description
        : app.description;

  return { title, description };
}, []);


const AppsPage: React.FC = () => {
  const { lang } = useI18n(); // دریافت زبان فعلی از Context

  // State management for search query, selected category, and status messages
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<(AppCategory | 'All')>('All');
  const [statusMsg, setStatusMsg] = useState<StatusMsg | null>(null);

  /**
   * فیلتر کردن اپلیکیشن‌ها بر اساس متن جستجو، دسته‌بندی و زبان فعلی.
   * از useMemo برای بهینه‌سازی عملکرد و جلوگیری از محاسبات تکراری استفاده شده است.
   */
  const filteredApps = useMemo(() => {
    const searchLower = query.trim().toLowerCase();

    return appsCatalog.filter((app) => {
      // 1. فیلتر بر اساس دسته‌بندی
      const matchesCategory = category === 'All' || app.category === category;
      if (!matchesCategory) return false;

      // 2. فیلتر بر اساس متن جستجو (اگر کوئری خالی است، نیازی به جستجو نیست)
      if (!searchLower) return true;

      // ترکیب عنوان، توضیحات و تگ‌ها برای جستجو
      const { title, description } = pickLocalizedContent(app, lang);
      const haystack = `${title} ${description} ${(app.tags || []).join(' ')}`.toLowerCase();
      
      return haystack.includes(searchLower);
    });
  }, [query, category, lang, pickLocalizedContent]); // وابستگی‌های useMemo

  // تابع هندلر برای نمایش پیام وضعیت و پاک کردن خودکار آن پس از چند ثانیه
  const showStatusMessage = useCallback((type: StatusMsgType, text: string) => {
    setStatusMsg({ type, text });
    const timer = setTimeout(() => setStatusMsg(null), 5000); // پاک کردن پیام پس از 5 ثانیه
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // هندلر برای باز کردن URL خارجی اپلیکیشن
  const handleOpenApp = useCallback((app: AppItem) => {
    const url = app.websiteUrl || app.demoUrl || app.githubUrl; // اولویت‌بندی URL ها
    if (!url) {
      showStatusMessage('info', 'No external link available yet for this app.');
      return;
    }
    // باز کردن URL در تب جدید با رعایت نکات امنیتی
    window.open(url, '_blank', 'noopener,noreferrer'); 
    const { title } = pickLocalizedContent(app, lang);
    showStatusMessage('success', `Opened: ${title}`);
  }, [pickLocalizedContent, lang, showStatusMessage]);

  return (
    <div className="apps-page" role="main">
      <div className="apps-container">
        
        <header className="apps-header">
          {/* عنوان اصلی صفحه با برند Pi Explorer */}
          <h2 className="apps-title">Pi Explorer · dApps Directory</h2>
          <p className="apps-subtitle">
            Browse decentralized applications, explore details, and get ready to Boost with Pi.
          </p>
        </header>

        {/* بخش کنترل‌ها: جستجو، فیلتر دسته‌بندی و آمار */}
        <div className="apps-controls">
          {/* ورودی جستجو */}
          <div className="control-group">
            <label className="apps-label" htmlFor="apps-search-input">Search Apps</label>
            <input
              id="apps-search-input"
              className="apps-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tags, description..."
              aria-label="Search dApps"
            />
          </div>

          {/* انتخابگر دسته‌بندی */}
          <div className="control-group">
            <label className="apps-label" htmlFor="apps-category-select">Category</label>
            <select
              id="apps-category-select"
              className="apps-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as AppCategory | 'All')}
              aria-label="Select dApp category"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {/* نمایش نام دسته‌بندی به زبان فعلی (در صورت نیاز به ترجمه) */}
                  {cat} 
                </option>
              ))}
            </select>
          </div>

          {/* نمایش آمار نتایج */}
          <div className="apps-stats">
            <div className="apps-stat">
              <span className="apps-stat-label">Results</span>
              <strong className="apps-stat-value">{filteredApps.length}</strong>
            </div>
            <div className="apps-stat">
              <span className="apps-stat-label">Total Apps</span>
              <strong className="apps-stat-value">{appsCatalog.length}</strong>
            </div>
          </div>
        </div>

        {/* نمایش پیام وضعیت (موفقیت، خطا، اطلاعات) */}
        {statusMsg && (
          <div className={`apps-banner ${statusMsg.type}`} role="alert" aria-live="assertive">
            {statusMsg.text}
          </div>
        )}

        {/* بخش نمایش لیست اپلیکیشن‌ها یا پیام عدم وجود نتیجه */}
        {filteredApps.length === 0 ? (
          <div className="apps-empty" role="status">
            <div className="apps-empty-icon">🔎</div>
            <div>No dApps found matching your criteria.</div>
          </div>
        ) : (
          <div className="apps-grid">
            {filteredApps.map((app) => {
              // دریافت محتوای محلی‌سازی شده برای هر اپلیکیشن
              const { title, description } = pickLocalizedContent(app, lang);

              return (
                <article key={app.id} className="app-card" aria-label={`Details for ${title}`}>
                  <div className="app-card-media">
                    {/* استفاده از placeholder در صورت عدم وجود تصویر */}
                    <img 
                      src={app.image || 'https://pi-explorer.com/assets/images/default-app-placeholder.png'} 
                      alt={`${title} screenshot`} 
                      loading="lazy" 
                    />
                    {/* نمایش نشان تایید شده */}
                    {app.isVerified && <span className="app-badge">Verified</span>}
                  </div>

                  <div className="app-card-body">
                    <div className="app-card-top">
                      <h3 className="app-card-title">{title}</h3>
                      <span className="app-card-category" aria-label={`Category: ${app.category}`}>
                        {app.category}
                      </span>
                    </div>

                    <p className="app-card-desc">{description}</p>

                    {/* نمایش تگ‌ها */}
                    <div className="app-tags">
                      {(app.tags || []).slice(0, 4).map((tag) => ( // نمایش حداکثر 4 تگ
                        <span key={tag} className="app-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* دکمه‌های اقدام */}
                    <div className="app-actions">
                      {/* لینک به صفحه جزئیات اپلیکیشن */}
                      <Link className="app-btn primary" to={`/apps/${app.id}`} aria-label={`View details for ${title}`}>
                        View details
                      </Link>

                      {/* دکمه باز کردن لینک خارجی */}
                      <button
                        className="app-btn ghost"
                        type="button"
                        onClick={() => handleOpenApp(app)}
                        aria-label={`Open ${title} website or demo`}
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

        {/* راهنمایی برای مرحله بعدی */}
        <footer className="apps-hint" aria-label="Next steps">
          <strong>Next:</strong> On the App Details page, we’ll integrate <em>Boost with Pi</em> &amp; optional Poll/Vote features.
        </footer>
      </div>
    </div>
  );
};

export default AppsPage;
