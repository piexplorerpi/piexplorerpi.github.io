import React, { useCallback } from 'react';
import './ProductCard.css';
import { useTranslate } from '../i18n/useTranslate'; // تغییر به هوک جدید

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
  const { lang, t } = useTranslate(); // استفاده از هوک جدید

  const loading = isProcessing === product.id;

  // این منطق مربوط به دیتای محصول است و نباید تغییر کند
  const getLocalizedField = useCallback((
    field: 'name' | 'description'
  ): string => {
    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1); 
    const localizedKey = `${field}${langKey}` as keyof Product;
    
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
              <span style={{ marginInlineStart: '8px' }}>{t('productCard.processing')}</span>
            </>
          ) : (
            t('productCard.buyNow')
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
