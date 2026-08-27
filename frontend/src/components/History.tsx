import React, { useEffect, useState, useCallback } from 'react';
import { useI18n } from '../i18n/I18nContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pidao.bonto.run/api';

interface Transaction {
  id?: string;
  _id?: string;
  orderId?: string;
  piTransactionId?: string;
  txid?: string;
  paymentId?: string;
  amount?: string | number;
  currency?: string;
  status?: string;
  createdAt?: string;
  productName?: string;
  metadata?: { productName?: string };
  product?: { name?: string };
}

interface HistoryProps {
  onPaymentSuccess?: (txid: string) => void;
  onPaymentError?: (err: any) => void;
}

const History: React.FC<HistoryProps> = ({ 
  onPaymentSuccess = () => {}, 
  onPaymentError = () => {} 
}) => {
  const { t, lang } = useI18n();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const direction = lang === 'fa' ? 'rtl' : 'ltr';

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/payment/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTransactions(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.message || t('serverConnectionError'));
        onPaymentError(data);
      }
    } catch (err) {
      console.error('History fetch error:', err);
      setError(t('serverConnectionError'));
      onPaymentError(err);
    } finally {
      setLoading(false);
    }
  }, [t, onPaymentError]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getTransactionId = (tx: Transaction): string => 
    tx.piTransactionId || tx.txid || tx.paymentId || tx.orderId || (tx.id ?? 'N/A');

  const getProductName = (tx: Transaction): string => 
    tx.metadata?.productName || tx.productName || tx.product?.name || tx.orderId || 'N/A';

  const getAmount = (tx: Transaction): string => 
    `${tx.amount ?? 'N/A'} ${tx.currency || 'Pi'}`;

  const getStatusLabel = (status?: string): string => {
    const normalized = (status || '').toUpperCase();
    switch (normalized) {
      case 'COMPLETED': case 'SUCCESS': return t('successful');
      case 'APPROVED': return t('approved');
      case 'PENDING': return t('pending');
      case 'CANCELLED': return t('cancelled');
      default: return t('failed');
    }
  };

  const getStatusStyle = (status?: string): React.CSSProperties => {
    const normalized = (status || '').toUpperCase();
    switch (normalized) {
      case 'COMPLETED': case 'SUCCESS': return { backgroundColor: '#d4edda', color: '#155724' };
      case 'APPROVED': return { backgroundColor: '#d1ecf1', color: '#0c5460' };
      case 'PENDING': return { backgroundColor: '#fff3cd', color: '#856404' };
      default: return { backgroundColor: '#f8d7da', color: '#721c24' };
    }
  };

  if (loading) return <div style={styles.center}>{t('loading')}</div>;

  if (error) return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;

  return (
    <div style={{ ...styles.container, direction }}>
      <h2 style={styles.title}>{t('historyTitle')}</h2>
      {transactions.length === 0 ? (
        <p style={styles.center}>{t('noTransactions')}</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>{t('transactionId')}</th>
                <th style={styles.th}>{t('amount')}</th>
                <th style={styles.th}>{t('product')}</th>
                <th style={styles.th}>{t('status')}</th>
                <th style={styles.th}>{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => {
                const transactionId = getTransactionId(tx);
                const displayId = transactionId.length > 12 ? `${transactionId.substring(0, 12)}...` : transactionId;
                const statusStyle = getStatusStyle(tx.status);

                return (
                  <tr key={tx.id || tx._id || tx.orderId || index} style={styles.tableRow}>
                    <td style={styles.td}>{displayId}</td>
                    <td style={styles.td}>{getAmount(tx)}</td>
                    <td style={styles.td}>{getProductName(tx)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.status, ...statusStyle }}>
                        {getStatusLabel(tx.status)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {tx.createdAt 
                        ? new Date(tx.createdAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : lang === 'tr' ? 'tr-TR' : 'en-US') 
                        : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', fontFamily: 'Tahoma, sans-serif' },
  title: { textAlign: 'center', color: '#333' },
  center: { textAlign: 'center', marginTop: '50px', fontFamily: 'Tahoma, sans-serif' },
  tableWrapper: { overflowX: 'auto', marginTop: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
  tableHeader: { backgroundColor: '#4A90E2', color: '#fff' },
  th: { padding: '12px', textAlign: 'center' },
  td: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' },
  tableRow: { transition: 'background 0.3s' },
  status: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
};

export default History;
