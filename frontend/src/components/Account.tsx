import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { getAccount } from '../lib/stellar'; // فرض بر این است که متدها در lib قرار دارند

interface AccountData {
  id: string;
  sequence: string;
  balances: any[];
  signers: any[];
}

const Account: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAccount(id);
        setAccount(data);
      } catch (err) {
        setError(t('errorLoadingAccount'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  if (loading) return <div>{t('loading')}</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!account) return <div>{t('accountNotFound')}</div>;

  return (
    <div className="account-container">
      <h1>{t('accountDetails')}</h1>
      <p><strong>{t('accountId')}:</strong> {account.id}</p>
      
      <section className="balances-section">
        <h3>{t('balances')}</h3>
        {/* کامپوننت نمایش ترازها در آینده اینجا اضافه می‌شود */}
      </section>
    </div>
  );
};

export default Account;
