// app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HoverButton from './HoverButton';
import ThemeToggle from '../ThemeToggle';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/slice/userSlice';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Loading...');
  const userDetails = useSelector((store: RootState) => store.user.value);
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkUser = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        setUserName('Guest');
        return;
      }
      if (userDetails?.id) {
        setUserName(userDetails?.name);
      }else{
        setUserName('Guest');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUserName('Guest');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    checkUser();
  }, [pathname, userDetails.id]);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0; SameSite=Strict';
    dispatch(setUser({ id: '', email: '', name: '' }));
    setShowDropdown(false);
    setUserName('Guest');
    router.push('/');
  };

  if (pathname !== '/') {
    return <div></div>;
  }

  return (
    <div className='border-b-2 border-foreground h-[13vh]'>
      <nav className='flex justify-between items-center container px-5 m-auto text-xl py-5'>
        {/* Logo */}
        <Link href={'/'} className=' cursor-pointer text-2xl lg:text-3xl font-semibold space-x-1 lg:space-x-2'>
          <Image width={100} height={100} src='/logo-min.png' alt='Logo' className='h-16 w-16 rounded-full object-cover'/>
          {/* <span>R</span>
          <span className='text-secondary'>E</span>
          <span>N</span>
          <span className='text-secondary'>T</span> */}
        </Link>

        {/* Profile Icon and Dropdown */}
        <div className='relative' ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className='flex items-center space-x-2 focus:outline-none'>
            <div className='h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition-colors'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            </div>
            <span className='hidden md:inline text-sm'>{userName}</span>
          </button>

          {showDropdown && (
            <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border z-50'>
              <div className='py-1'>
                {userDetails.id ? (
                  <>
                    <div className='px-4 py-2 text-sm border-b border-border'>
                      Signed in as <span className='font-medium'>{userDetails.name}</span>
                    </div>
                    <Link href='/dashboard' className='block px-4 py-2 text-sm hover:bg-muted transition-colors' onClick={() => setShowDropdown(false)}>
                      Dashboard
                    </Link>
                    <Link href='/profile' className='block px-4 py-2 text-sm hover:bg-muted transition-colors' onClick={() => setShowDropdown(false)}>
                      Profile
                    </Link>
                    <button onClick={handleLogout} className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors'>
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href='/handler/sign-in' className='block px-4 py-2 text-sm hover:bg-muted transition-colors' onClick={() => setShowDropdown(false)}>
                      Sign in
                    </Link>
                    <Link href='/handler/sign-up' className='block px-4 py-2 text-sm hover:bg-muted transition-colors' onClick={() => setShowDropdown(false)}>
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className='fixed z-50 bottom-2 right-2 bg-foreground rounded-full h-7 w-7 flex items-center justify-center'>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
