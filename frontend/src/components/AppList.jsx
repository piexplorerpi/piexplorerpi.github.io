import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppList = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // آدرس API خودت را جایگزین کن
        const response = await axios.get('http://localhost:5000/api/apps');
        setApps(response.data);
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) return <div>Loading awesome dApps...</div>;

  return (
    <div className="apps-grid">
      {apps.map((app) => (
        <div key={app.id} className="app-card">
          <img src={app.image} alt={app.title} />
          <h3>{app.title}</h3>
          <p>{app.description}</p>
          {app.isVerified && <span className="badge">Verified</span>}
        </div>
      ))}
    </div>
  );
};

export default AppList;
