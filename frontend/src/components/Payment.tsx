// frontend/src/components/Payment.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../lib/axiosClient';
import './Payment.css'; // اضافه کردن استایل برای ظاهر مدرن

/**
 * @param {{ 
 *   transactionId?: string, 
 *   onReset?: () => void, 
 *   onPaymentSuccess?: (txid: string) => void, 
 *   onPaymentError?: (err: any) => void 
 * }} props
 */
const Payment = ({ 
  transactionId = "", 
  onReset = () => {}, 
  onPaymentSuccess = () => {}, 
  onPaymentError = () => {} 
}) => {
  const { user } = useAuth();
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
      setError("Pi SDK is not available. Please open this app in the Pi Browser.");
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
              setError("Failed to finalize transaction.");
              setIsProcessing(false);
              onPaymentError(err);
            }
          });

        } catch (err) {
          setError("Server approval failed.");
          setIsProcessing(false);
          onPaymentError(err);
        }
      });

    } catch (err) {
      setError(err.message || "Payment failed to start.");
      setIsProcessing(false);
      onPaymentError(err);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Complete Purchase</h2>
        
        {error && (
          <div className="payment-error-box">
            {error}
          </div>
        )}
        
        <div className="payment-details-box">
          <p>Amount: <span className="amount-highlight">1.0 PI</span></p>
          <p>Product: <span className="product-name">PiDao Premium Item</span></p>
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
              Processing...
            </>
          ) : (
            'Pay with Pi'
          )}
        </button>

        <button className="payment-reset-btn" onClick={onReset}>
          Cancel / Reset
        </button>

        {isProcessing && (
          <p className="payment-loader-text">
            Please do not close the Pi Browser...
          </p>
        )}
      </div>
    </div>
  );
};

export default Payment;
