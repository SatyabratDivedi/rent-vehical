'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiHeart, HiPlus, HiChartBar, HiUser, HiQuestionMarkCircle, HiShieldCheck, HiInformationCircle, HiSupport, HiLogout, HiLogin, HiUserAdd, HiChevronRight, HiHome, HiTruck } from 'react-icons/hi';
import { RootState } from '../../redux/store';
import { setUser } from '@/redux/slice/userSlice';

interface NavigationItem {
  icon: React.ComponentType<any>;
  title: string;
  link: string;
  badge?: string;
}

const NavigationSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userDetails = useSelector((store: RootState) => store.user.value);
  const dispatch = useDispatch();

  // Navigation items configuration
  const primaryNavItems: NavigationItem[] = [
    { icon: HiHome, title: 'Home', link: '/' },
    { icon: HiTruck, title: 'Vehicles', link: '/vehicles' },
    { icon: HiPlus, title: 'Add Vehicle', link: '/vehicle-listing', badge: 'Free' },
  ];

  const userNavItems: NavigationItem[] = [
    { icon: HiUser, title: 'Profile', link: '/profile' },
    { icon: HiHeart, title: 'Saved', link: '/saved-properties' },
    { icon: HiPlus, title: 'Add Vehicle', link: '/vehicle-listing', badge: 'Free' },
  ];

  const supportNavItems: NavigationItem[] = [
    { icon: HiSupport, title: 'Contact Us', link: '/contact-us' },
    { icon: HiInformationCircle, title: 'About Us', link: '/about-us' },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDesktopMenuOpen(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = useCallback(() => {
    router.push('/');
    document.cookie = 'token=; path=/; max-age=0; SameSite=Strict';
    dispatch(setUser({ id: '', email: '', name: '' }));
    setIsDesktopMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [dispatch, router]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Animation variants
  const menuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { opacity: 1, x: 0 },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  const isActivePath = (path: string) => pathname === path;

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className='sticky top-0 z-50  backdrop-blur-md border-b border-gray-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <Link href='/' className='flex items-center space-x-2 group'>
              <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                <Image src='/logo-min.png' alt='Rent Vehicle Logo' fill className='object-cover group-hover:scale-110 transition-transform duration-200' />
              </div>
              <span className='hidden sm:block text-xl font-bold text-gray-900'>
                Rent<span className='text-blue-600'>Vehicle</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center space-x-8'>
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.link);

                return (
                  <Link key={item.link} href={item.link} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
                    <Icon className='w-4 h-4' />
                    <span>{item.title}</span>
                    {item.badge && <span className='px-1.5 py-0.5 text-xs text-white bg-red-500 rounded-full'>{item.badge}</span>}
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className='flex items-center space-x-4'>
              {/* Desktop Auth Buttons */}
              {!userDetails.id ? (
                <div className='hidden lg:flex items-center space-x-3'>
                  <Link href='/handler/sign-in' className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
                    <HiLogin className='w-4 h-4 mr-2' />
                    Sign In
                  </Link>
                  <Link href='/handler/sign-up' className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors duration-200'>
                    <HiUserAdd className='w-4 h-4 mr-2' />
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className='hidden lg:flex items-center space-x-3'>
                  <span className='text-sm text-gray-700'>Welcome, {userDetails.name}</span>
                  <button onClick={handleLogout} className='inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200'>
                    <HiLogout className='w-4 h-4 mr-2' />
                    Logout
                  </button>
                </div>
              )}

              {/* Menu Button */}
              <button onClick={() => setIsDesktopMenuOpen(true)} className='p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200' aria-label='Open menu'>
                <HiMenu className='w-6 h-6' />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Slide-out Menu */}
      <AnimatePresence>
        {isDesktopMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div initial='closed' animate='open' exit='closed' variants={overlayVariants} transition={{ duration: 0.2 }} className='fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm' onClick={() => setIsDesktopMenuOpen(false)} />

            {/* Menu Panel */}
            <motion.div initial='closed' animate='open' exit='closed' variants={menuVariants} transition={{ duration: 0.3, ease: 'easeOut' }} className='fixed right-0 top-0 z-[101] h-full w-80 bg-white shadow-2xl'>
              {/* Header */}
              <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900'>Menu</h2>
                <button onClick={() => setIsDesktopMenuOpen(false)} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
                  <HiX className='w-5 h-5' />
                </button>
              </div>

              {/* Content */}
              <div className='overflow-y-auto h-full pb-20'>
                {/* User Info */}
                {userDetails.id && (
                  <motion.div variants={itemVariants} transition={{ delay: 0.1 }} className='p-6 border-b border-gray-200'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                        <HiUser className='w-6 h-6 text-blue-600' />
                      </div>
                      <div>
                        <h3 className=' text-sm lg:text-base font-medium text-gray-900'>{userDetails.name}</h3>
                        <p className=' text-xs lg:text-sm text-gray-500'>{userDetails.email}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Sections */}
                <div className='p-6 space-y-4 lg:space-y-6'>
                  {/* User Section */}
                  {userDetails.id && (
                    <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
                      <h3 className=' text-xs lg:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1 lg:mb-4'>Account</h3>
                      <div className='lg:space-y-1'>
                        {userNavItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link key={item.link} href={item.link} onClick={() => setIsDesktopMenuOpen(false)} className='flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'>
                              <div className='flex items-center space-x-3'>
                                <Icon className='w-5 h-5 text-gray-400 group-hover:text-blue-600' />
                                <span className=' text-sm lg:text-base lg:font-medium'>{item.title}</span>
                                {item.badge && <span className='px-1 py-0.5 text-[8px] lg:px-2 lg:py-1 lg:text-xs text-white bg-red-500 rounded-full'>{item.badge}</span>}
                              </div>
                              <HiChevronRight className='w-4 h-4 text-gray-400 group-hover:text-gray-600' />
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Support Section */}
                  <motion.div variants={itemVariants} transition={{ delay: 0.3 }}>
                    <h3 className='text-xs lg:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1 lg:mb-4'>Support</h3>
                    <div className='lg:space-y-1'>
                      {supportNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.link} href={item.link} onClick={() => setIsDesktopMenuOpen(false)} className='flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'>
                            <div className='flex items-center space-x-3'>
                              <Icon className='w-5 h-5 text-gray-400 group-hover:text-blue-600' />
                              <span className='text-sm lg:text-base lg:font-medium'>{item.title}</span>
                            </div>
                            <HiChevronRight className='w-4 h-4 text-gray-400 group-hover:text-gray-600' />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Auth Section */}
                  <motion.div variants={itemVariants} transition={{ delay: 0.4 }} className='pt-6 border-t border-gray-200'>
                    {userDetails.id ? (
                      <button onClick={handleLogout} className='w-full flex items-center justify-center space-x-2 p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200'>
                        <HiLogout className='w-5 h-5' />
                        <span className='font-medium'>Logout</span>
                      </button>
                    ) : (
                      <div className='space-y-3'>
                        <Link href='/handler/sign-in' onClick={() => setIsDesktopMenuOpen(false)} className='w-full flex items-center justify-center space-x-2 p-3 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200'>
                          <HiLogin className='w-5 h-5' />
                          <span className='font-medium'>Sign In</span>
                        </Link>
                        <Link href='/handler/sign-up' onClick={() => setIsDesktopMenuOpen(false)} className='w-full flex items-center justify-center space-x-2 p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200'>
                          <HiUserAdd className='w-5 h-5' />
                          <span className='font-medium'>Sign Up</span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <div className='lg:hidden'>
        {/* Mobile menu button */}
        <button onClick={() => setIsMobileMenuOpen(true)} className='fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200'>
          <HiMenu className='w-6 h-6' />
        </button>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div initial='closed' animate='open' exit='closed' variants={overlayVariants} className='fixed inset-0 z-[200] bg-black/50' onClick={() => setIsMobileMenuOpen(false)} />

              <motion.div initial='closed' animate='open' exit='closed' variants={menuVariants} className='fixed inset-x-0 bottom-0 z-[201] bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto'>
                {/* Mobile menu content */}
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-semibold'>Menu</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className='p-2 hover:bg-gray-100 rounded-lg'>
                      <HiX className='w-6 h-6' />
                    </button>
                  </div>

                  {/* Mobile menu items */}
                  <div className='space-y-4'>
                    {primaryNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.link} href={item.link} onClick={() => setIsMobileMenuOpen(false)} className='flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                          <Icon className='w-6 h-6 text-blue-600' />
                          <span className='font-medium'>{item.title}</span>
                        </Link>
                      );
                    })}

                    {!userDetails.id ? (
                      <div className='pt-4 space-y-3'>
                        <Link href='/handler/sign-in' onClick={() => setIsMobileMenuOpen(false)} className='w-full flex items-center justify-center space-x-2 p-3 border border-blue-600 text-blue-600 rounded-lg'>
                          <HiLogin className='w-5 h-5' />
                          <span>Sign In</span>
                        </Link>
                        <Link href='/handler/sign-up' onClick={() => setIsMobileMenuOpen(false)} className='w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg'>
                          <HiUserAdd className='w-5 h-5' />
                          <span>Sign Up</span>
                        </Link>
                      </div>
                    ) : (
                      <button onClick={handleLogout} className='w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg mt-4'>
                        <HiLogout className='w-5 h-5' />
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NavigationSection;
