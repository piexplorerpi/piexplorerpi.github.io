import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AppList.css'; // فرض بر این است که استایل‌های خاص این کامپوننت اینجا قرار دارد

// تعریف ساختار داده اپلیکیشن برای حفظ تایپ‌اسکریپت
interface AppItem {
  id: string;
  title: string;
  description: string;
  image: string;
  isVerified: boolean;
  websiteUrl?: string;
}

const AppList: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // تغییر به متغیر محیطی در آینده توصیه می‌شود: process.env.VITE_API_URL
        const response = await axios.get('http://localhost:5000/api/apps');
        setApps(response.data);
      } catch (err) {
        console.error("Error fetching Pi Explorer apps:", err);
        setError("Failed to load apps. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) return <div className="apps-loader">Loading Pi Explorer ecosystem...</div>;
  if (error) return <div className="apps-error">{error}</div>;

  return (
    <div className="apps-grid">
      {apps.map((app) => (
        <article key={app.id} className="app-card">
          <div className="app-card-media">
            <img src={app.image || '/placeholder-app.png'} alt={app.title} loading="lazy" />
            {app.isVerified && <span className="app-badge">Verified</span>}
          </div>
          
          <div className="app-card-body">
            <h3 className="app-card-title">{app.title}</h3>
            <p className="app-card-desc">{app.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default AppList;
