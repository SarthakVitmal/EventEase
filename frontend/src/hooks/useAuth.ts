import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await api.get("/auth/getUser");
        setUser(userResponse.data.user);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          navigate('/login');
        } else {
          setError(err.message || "Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return { user, loading, error };
};