import React, { useCallback } from 'react';
import './ProductCard.css';
import { useI18n } from '../i18n/I18nContext';

export interface Product {
  id: string;
  name: string;
  description: string;
  nameFa?: string;
  nameEn?: string;
  nameTr?: string;
  descriptionFa?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  image: string;
  priceDisplay: string;
}

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  isProcessing: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  isProcessing,
}) => {
  const { lang, t } = useI18n();

  const loading = isProcessing === product.id;

  // تابع کمکی برای انتخاب فیلد مناسب بر اساس زبان
  const getLocalizedField = useCallback((
    field: 'name' | 'description'
  ): string => {
    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1); // تبدیل 'fa' به 'Fa'
    const localizedKey = `${field}${langKey}` as keyof Product;
    
    // بازگشت مقدار بومی‌سازی شده یا مقدار پیش‌فرض
    return (product[localizedKey] as string) || product[field];
  }, [lang, product]);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={getLocalizedField('name')} className="product-image" />
        <div className="product-price-badge">{product.priceDisplay}</div>
      </div>

      <div className="product-content">
        <h3 className="product-title">{getLocalizedField('name')}</h3>
        <p className="product-description">{getLocalizedField('description')}</p>

        <button
          className={`product-button ${loading ? 'loading' : ''}`}
          onClick={() => onBuy(product)}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <span style={{ marginInlineStart: '8px' }}>{t('processing')}</span>
            </>
          ) : (
            t('buyNow')
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
