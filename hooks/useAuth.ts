import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userFromLocalStorage = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if( userFromLocalStorage == undefined || storedToken == undefined) return
      const id = userFromLocalStorage
        ? JSON.parse(userFromLocalStorage)?.id
        : user?.id;
      setUserId(id);
      setToken(storedToken);
      setIsLoading(false);
    }
  }, [user]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUserId(null);
      setToken(null);
    }
  };

  const login = (userData: any, authToken: string) => {
    console.log('Login function called with:', userData, authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      setUserId(userData.id);
      setToken(authToken);
    }
  };

  return {
    userId,
    token,
    isLoading,
    isAuthenticated: !!userId && !!token,
    login,
    logout
  };
};
