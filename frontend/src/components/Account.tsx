import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslate } from '../i18n/useTranslate'; // تغییر هوک
import { accountTranslations } from '../i18n/translations/account'; // ایمپورت فایل جدید
import { getAccount } from '../lib/stellar';

interface AccountData {
  id: string;
  sequence: string;
  balances: any[];
  signers: any[];
}

const Account: React.FC = () => {
  const { t } = useTranslate(); // استفاده از تابع t جدید
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
        // استفاده از ترجمه مستقیماً به عنوان مقدار خطا
        setError(t(accountTranslations.errorLoadingAccount));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  if (loading) return <div>{t(accountTranslations.loading)}</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!account) return <div>{t(accountTranslations.accountNotFound)}</div>;

  return (
    <div className="account-container">
      <h1>{t(accountTranslations.accountDetails)}</h1>
      <p><strong>{t(accountTranslations.accountId)}:</strong> {account.id}</p>
      
      <section className="balances-section">
        <h3>{t(accountTranslations.balances)}</h3>
        {/* کامپوننت نمایش ترازها در آینده اینجا اضافه می‌شود */}
      </section>
    </div>
  );
};

export default Account;
