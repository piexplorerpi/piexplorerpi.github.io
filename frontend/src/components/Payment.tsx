import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../lib/axiosClient';
import { useTranslate } from '../i18n/useTranslate';
import { paymentTranslations } from '../i18n/translations/payment';
import './Payment.css';

const Payment = ({ 
  transactionId = "", 
  onReset = () => {}, 
  onPaymentSuccess = () => {}, 
  onPaymentError = () => {} 
}) => {
  const { user } = useAuth();
  const { t } = useTranslate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.Pi) {
      console.log("✅ Pi Network SDK is ready");
    } else {
      console.warn("⚠️ Pi SDK not found.");
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Pi) {
      setError(t(paymentTranslations.sdkNotAvailable));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const payment = await window.Pi.createPayment({
        amount: 1.0, 
        memo: "Purchase from PiDao",
        metadata: {
          productId: "item_123",
          userId: user?.uid || 'guest',
        },
      });

      await window.Pi.onReadyForServerApproval(async (paymentId) => {
        try {
          await axiosClient.post('/payment/approve', { paymentId });

          await window.Pi.onReadyForServerCompletion(async (paymentId, txid) => {
            try {
              await axiosClient.post('/payment/complete', {
                paymentId,
                txid,
                paymentDetails: { amount: 1.0, currency: 'PI' }
              });

              setIsProcessing(false);
              onPaymentSuccess(txid); 
            } catch (err) {
              setError(t(paymentTranslations.finalizeError));
              setIsProcessing(false);
              onPaymentError(err);
            }
          });

        } catch (err) {
          setError(t(paymentTranslations.approvalError));
          setIsProcessing(false);
          onPaymentError(err);
        }
      });

    } catch (err) {
      setError(err.message || t(paymentTranslations.startError));
      setIsProcessing(false);
      onPaymentError(err);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">{t(paymentTranslations.completePurchase)}</h2>
        
        {error && (
          <div className="payment-error-box">
            {error}
          </div>
        )}
        
        <div className="payment-details-box">
          <p>{t(paymentTranslations.amount)}: <span className="amount-highlight">1.0 PI</span></p>
          <p>{t(paymentTranslations.product)}: <span className="product-name">{t(paymentTranslations.premiumItem)}</span></p>
          {transactionId && <p className="tx-id">ID: {transactionId}</p>}
        </div>

        <button 
          className={`payment-button ${isProcessing ? 'loading' : ''}`}
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              {t(paymentTranslations.processing)}
            </>
          ) : (
            t(paymentTranslations.payWithPi)
          )}
        </button>

        <button className="payment-reset-btn" onClick={onReset}>
          {t(paymentTranslations.cancelReset)}
        </button>

        {isProcessing && (
          <p className="payment-loader-text">
            {t(paymentTranslations.doNotClose)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Payment;
