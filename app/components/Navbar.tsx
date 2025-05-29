'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HoverButton from './HoverButton';
import ThemeToggle from '../ThemeToggle';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/slice/userSlice';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Loading...');
  const userDetails = useSelector((store: RootState) => store.user.value);
  const dispatch = useDispatch();

  const checkUserAuth = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        setUserName('Not logged in');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/checkUser`, {
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
          setUserName(data.userDetails.name || 'Logged In User');
          dispatch(setUser(data.userDetails));
        } else {
          setUserName('Invalid user data');
        }
      } else {
        setUserName('Not authenticated');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUserName('Error checking auth');
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <div className='border-b-2 border-foreground h-[13vh]'>
      <nav className='flex justify-between items-center container px-5 m-auto text-xl py-5'>
        <Link href={'/'} className=' cursor-pointer text-2xl lg:text-3xl font-semibold space-x-1 lg:space-x-2'>
          <span>R</span>
          <span className='text-secondary'>E</span>
          <span>N</span>
          <span className='text-secondary'>T</span>
        </Link>
        {/* <ul className='flex gap-4'>
          <li>
            <Link href='/' className={pathname === '/' ? 'font-bold' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href='/about' className={pathname.includes('/about') ? 'font-bold' : ''}>
              About
            </Link>
          </li>
          <li>
            <Link href='/contact' className={pathname === '/contact' ? 'font-bold' : ''}>
              Contact
            </Link>
          </li>
        </ul> */}
        <div>{userName}</div>
        <Link href='/handler/sign-up' className='space-x-2'>
          <HoverButton radius={10} value={'Login'} px={2} py={0.5} />
        </Link>
        <div className='fixed z-50 bottom-2 right-2 bg-foreground rounded-full h-7 w-7 flex items-center justify-center'>
          <ThemeToggle />
        </div>

        {/* <label className='hamburger'>
          <input type='checkbox' />
          <svg viewBox='0 0 32 32'>
            <path className='line line-top-bottom' d='M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22'></path>
            <path className='line' d='M7 16 27 16'></path>
          </svg>
        </label> */}
      </nav>
    </div>
  );
}
