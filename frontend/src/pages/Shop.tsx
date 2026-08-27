// frontend/src/pages/Shop.tsx
import React, { useMemo, useState } from 'react';
import ProductCard, { Product } from '../components/ProductCard';
import { useI18n } from '../i18n/I18nContext';
import './Shop.css';

type StatusMsgType = 'success' | 'error' | 'info';

interface StatusMsg {
  type: StatusMsgType;
  text: string;
}

type AppCategory = 'All' | 'DeFi' | 'NFT' | 'Games' | 'Tools' | 'Social' | 'Education';

type AppItem = Product & {
  category: AppCategory;
  tags?: string[];
  websiteUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  isVerified?: boolean;
  // future: piAppId, chain, contract, etc.
};

const Shop: React.FC = () => {
  const { t, lang } = useI18n();

  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<StatusMsg | null>(null);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AppCategory>('All');

  // Apps Directory data (mock for now; next step can be API-driven)
  const apps: AppItem[] = useMemo(
    () => [
      {
        id: 'app_1',
        category: 'Tools',
        name: 'Pi Explorer',
        nameFa: 'پای اکسپلورر',
        nameEn: 'Pi Explorer',
        nameTr: 'Pi Explorer',
        description: 'Explore Pi apps, boost projects, and discover new dApps.',
        descriptionFa: 'اکوسیستم پای را کشف کن، پروژه‌ها را Boost کن و dAppهای جدید ببین.',
        descriptionEn: 'Explore Pi apps, boost projects, and discover new dApps.',
        descriptionTr: 'Pi uygulamalarını keşfet, projeleri Boost et ve yeni dApp’leri bul.',
        image: 'https://via.placeholder.com/600x360',
        priceDisplay: 'Boost',
        tags: ['Directory', 'Explorer', 'Boost'],
        websiteUrl: 'https://example.com',
        isVerified: true,
      },
      {
        id: 'app_2',
        category: 'DeFi',
        name: 'Pi Swap',
        nameFa: 'پای سواپ',
        nameEn: 'Pi Swap',
        nameTr: 'Pi Swap',
        description: 'Swap tokens with a simple UI (demo listing).',
        descriptionFa: 'سواپ توکن‌ها با رابط کاربری ساده (دمو).',
        descriptionEn: 'Swap tokens with a simple UI (demo listing).',
        descriptionTr: 'Basit arayüz ile token swap (demo).',
        image: 'https://via.placeholder.com/600x360',
        priceDisplay: 'Boost',
        tags: ['Swap', 'DEX'],
        demoUrl: 'https://example.com/demo',
      },
      {
        id: 'app_3',
        category: 'NFT',
        name: 'Pi Gallery',
        nameFa: 'گالری پای',
        nameEn: 'Pi Gallery',
        nameTr: 'Pi Gallery',
        description: 'NFT collections and artists (demo listing).',
        descriptionFa: 'کالکشن‌های NFT و هنرمندان (دمو).',
        descriptionEn: 'NFT collections and artists (demo listing).',
        descriptionTr: 'NFT koleksiyonları ve sanatçılar (demo).',
        image: 'https://via.placeholder.com/600x360',
        priceDisplay: 'Boost',
        tags: ['NFT', 'Marketplace'],
      },
      {
        id: 'app_4',
        category: 'Education',
        name: 'Pi Academy',
        nameFa: 'آکادمی پای',
        nameEn: 'Pi Academy',
        nameTr: 'Pi Academy',
        description: 'Learn Pi ecosystem concepts (demo listing).',
        descriptionFa: 'آموزش مفاهیم اکوسیستم پای (دمو).',
        descriptionEn: 'Learn Pi ecosystem concepts (demo listing).',
        descriptionTr: 'Pi ekosistemi kavramlarını öğren (demo).',
        image: 'https://via.placeholder.com/600x360',
        priceDisplay: 'Boost',
        tags: ['Learning', 'Guides'],
      },
    ],
    []
  );

  const categories: AppCategory[] = useMemo(
    () => ['All', 'DeFi', 'NFT', 'Games', 'Tools', 'Social', 'Education'],
    []
  );

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();

    return apps.filter((app) => {
      const inCategory = category === 'All' ? true : app.category === category;

      if (!q) return inCategory;

      const name =
        (lang === 'fa' ? app.nameFa || app.name : lang === 'tr' ? app.nameTr || app.name : app.nameEn || app.name) ||
        app.name;

      const desc =
        (lang === 'fa'
          ? app.descriptionFa || app.description
          : lang === 'tr'
            ? app.descriptionTr || app.description
            : app.descriptionEn || app.description) || app.description;

      const haystack = `${name} ${desc} ${(app.tags || []).join(' ')}`.toLowerCase();
      return inCategory && haystack.includes(q);
    });
  }, [apps, category, query, lang]);

  const handleOpenOrDetails = async (app: AppItem) => {
    // This is intentionally NOT Pi payment yet.
    // Next step: replace or add a "Boost" flow using PiPaymentPanel / Pi.createPayment.
    setIsProcessing(app.id);
    setStatusMsg(null);

    try {
      // Prefer websiteUrl > demoUrl > githubUrl
      const url = app.websiteUrl || app.demoUrl || app.githubUrl;

      if (!url) {
        setStatusMsg({
          type: 'info',
          text: 'No link available for this app yet.',
        });
        return;
      }

      // Open in a new tab (outside of Pi Browser it still works; inside Pi Browser it opens too)
      window.open(url, '_blank', 'noopener,noreferrer');

      setStatusMsg({
        type: 'success',
        text: `Opened: ${app.name}`,
      });
    } catch (error) {
      setStatusMsg({
        type: 'error',
        text: 'Failed to open the app link.',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="shop-page">
      <div className="shop-container">
        <header className="shop-header">
          <h2 className="shop-title">{t('shopTitle')}</h2>
          <p className="shop-subtitle">{t('shopSubtitle')}</p>
        </header>

        {/* Apps Directory Controls */}
        <div className="apps-controls">
          <div className="apps-search">
            <label className="apps-label" htmlFor="apps-search-input">
              Search
            </label>
            <input
              id="apps-search-input"
              className="apps-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps by name, category, tags..."
            />
          </div>

          <div className="apps-filter">
            <label className="apps-label" htmlFor="apps-category-select">
              Category
            </label>
            <select
              id="apps-category-select"
              className="apps-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as AppCategory)}
            >
              {categories.map((c) => (
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
              <strong className="apps-stat-value">{apps.length}</strong>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className={`status-banner ${statusMsg.type}`}>
            {statusMsg.text}
          </div>
        )}

        {filteredApps.length === 0 ? (
          <div className="shop-empty-state">
            <i>🔎</i>
            <div>No apps found for your search/filter.</div>
          </div>
        ) : (
          <div className="products-grid">
            {filteredApps.map((app) => (
              <ProductCard
                key={app.id}
                product={app}
                onBuy={() => handleOpenOrDetails(app)}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        )}

        <div className="apps-hint">
          <strong>Next step:</strong> We will add <em>Boost with Pi</em> here (Pi payment) while keeping login/payment APIs intact.
        </div>
      </div>
    </div>
  );
};

export default Shop;
