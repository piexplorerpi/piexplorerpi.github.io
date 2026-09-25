import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../lib/axiosClient';
import { useTranslate } from '../i18n/useTranslate';
import { paymentTranslations } from '../i18n/translations/payment';
import './Payment.css';

interface PaymentProps {
  transactionId?: string;
  onReset?: () => void;
  onPaymentSuccess?: (txid?: string) => void;
  onPaymentError?: (err?: unknown) => void;
}

const Payment: React.FC<PaymentProps> = ({
  transactionId = '',
  onReset = () => {},
  onPaymentSuccess = () => {},
  onPaymentError = () => {},
}) => {
  const { user } = useAuth();
  const { t } = useTranslate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.Pi) {
      console.log('✅ Pi Network SDK is ready');
    } else {
      console.warn('⚠️ Pi SDK not found.');
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Pi) {
      setError(t(paymentTranslations.sdkNotAvailable));
      return;
    }

    setIsProcessing(true);
    setError(null);

    const userId = user?.piUserId || user?.id || 'guest';

    try {
      // Prefer callback-style createPayment (official Pi SDK pattern)
      if (typeof window.Pi.createPayment === 'function') {
        window.Pi.createPayment(
          {
            amount: 1.0,
            memo: 'Purchase from PiDao',
            metadata: {
              productId: 'item_123',
              userId,
              transactionId,
            },
          },
          {
            onReadyForServerApproval: async (paymentId: string) => {
              try {
                await axiosClient.post('/payment/approve', { paymentId });
              } catch (err) {
                setError(t(paymentTranslations.approvalError));
                setIsProcessing(false);
                onPaymentError(err);
              }
            },
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              try {
                await axiosClient.post('/payment/complete', {
                  paymentId,
                  txid,
                  paymentDetails: { amount: 1.0, currency: 'PI' },
                });
                setIsProcessing(false);
                onPaymentSuccess(txid);
              } catch (err) {
                setError(t(paymentTranslations.finalizeError));
                setIsProcessing(false);
                onPaymentError(err);
              }
            },
            onCancel: () => {
              setIsProcessing(false);
            },
            onError: (err: unknown) => {
              setError(t(paymentTranslations.startError));
              setIsProcessing(false);
              onPaymentError(err);
            },
          }
        );
        return;
      }

      setError(t(paymentTranslations.sdkNotAvailable));
      setIsProcessing(false);
    } catch (err: any) {
      setError(err?.message || t(paymentTranslations.startError));
      setIsProcessing(false);
      onPaymentError(err);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">{t(paymentTranslations.completePurchase)}</h2>

        {error && <div className="payment-error-box">{error}</div>}

        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={isProcessing}
          type="button"
        >
          {isProcessing ? t(paymentTranslations.processing) : t(paymentTranslations.payWithPi)}
        </button>

        <button type="button" className="payment-reset" onClick={onReset}>
          {t(paymentTranslations.cancelReset)}
        </button>
      </div>
    </div>
  );
};

export default Payment;
