'use client';
import { setUser } from '@/redux/slice/userSlice';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const checkUserAuth = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        dispatch(setUser({ id: '', email: '', name: '' }));
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/checkUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.userDetails) {
          dispatch(setUser(data.userDetails));
          localStorage.setItem('user', JSON.stringify(data.userDetails));
          localStorage.setItem('token', token);
        }
      } else {
        console.error('Failed to fetch user details:', data.message);
        dispatch(setUser({ id: '', email: 'guest@gmail.com', name: 'Guest' }));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, [pathname]);

  return <>{children}</>;
};

export default AuthCheck;
