// app/components/ProtectedRoute.tsx
import { usePathname, useRouter } from 'next/navigation';
import { RootState } from '../../redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from './Loader';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userDetails = useSelector((state: RootState) => state.user.value);
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [granted, setGranted] = useState(false);

  const checkAuth = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        router.push(`/handler/sign-in?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!userDetails?.id) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/checkUser`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          router.push(`/handler/sign-in?redirect=${encodeURIComponent(pathname)}`);
          return;
        }
      }

      setGranted(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      toast.error('Authentication error. Please try again.');
      router.push(`/handler/sign-in?redirect=${encodeURIComponent(pathname)}`);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [userDetails?.id, pathname]);

  if (checking) {
    return <Loader message="Checking authentication..." />;
  }

  if (!granted) {
    return <Loader message="Redirecting to login..." />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;