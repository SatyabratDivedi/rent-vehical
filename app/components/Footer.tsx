import React from 'react';
import Link from 'next/link';
import { TbSmartHome } from 'react-icons/tb';
import { FiSearch } from 'react-icons/fi';
import { IoAddSharp } from 'react-icons/io5';
import { RxDashboard } from 'react-icons/rx';
import { AiOutlineUser } from 'react-icons/ai';

const Footer = () => {
  return (
    <div>
      <footer className='bg-white/5 backdrop-blur-lg border-t border-white/20'>
        <div className='container mx-auto px-5 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-center'>
            <div>
              <h3 className='text-xl font-bold mb-4'>Rent Vehicle</h3>
              <p className='text-gray-500'>Find and rent the perfect vehicle for your needs. No hidden fees, just convenience.</p>
            </div>

            <div>
              <h3 className='text-xl font-bold mb-4'>Quick Links</h3>
              <ul className='space-y-2'>
                <li>
                  <Link href='/about' className='text-gray-500 hover:text-blue-600'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href='/vehicles' className='text-gray-500 hover:text-blue-600'>
                    Browse Vehicles
                  </Link>
                </li>
                <li>
                  <Link href='/list-vehicle' className='text-gray-500 hover:text-blue-600'>
                    List Your Vehicle
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='text-gray-500 hover:text-blue-600'>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-xl font-bold mb-4'>Vehicle Types</h3>
              <ul className='space-y-2'>
                <li>
                  <Link href='/' className='text-gray-500 hover:text-blue-600'>
                    Pickup Trucks
                  </Link>
                </li>
                <li>
                  <Link href='/' className='text-gray-500 hover:text-blue-600'>
                    Auto Rickshaws
                  </Link>
                </li>
                <li>
                  <Link href='/' className='text-gray-500 hover:text-blue-600'>
                    Tractors
                  </Link>
                </li>
                <li>
                  <Link href='/' className='text-gray-500 hover:text-blue-600'>
                    Utility Vehicles
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-xl font-bold mb-4'>Contact Info</h3>
              <ul className='space-y-2 flex flex-col text-gray-500'>
                <a href='tel:+918318207464'>📞 +91 8318207464</a>
                <a href='mailto:support@rentvehical.com'>📧 contact@rentvehical.com</a>
                <li>📍 Uttar Pradesh, India</li>
              </ul>
            </div>
          </div>

          <div className='mt-12 pt-8 border-t border-white/20'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <p className='text-gray-500 text-sm'>© {new Date().getFullYear()} Rent Vehicle. All rights reserved.</p>
              <div className='flex space-x-4 mt-4 md:mt-0'>
                <Link href='/privacy' className='text-gray-500 hover:text-primary text-sm'>
                  Privacy Policy
                </Link>
                <Link href='/terms' className='text-gray-500 hover:text-primary text-sm'>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Mobile Footer Navigation */}
      <div className='hidden fixed w-full  z-50 bottom-0 bg-white'>
        <div className=' flex justify-between py-3 px-5 border-b-[2px] border-t-2 rounded-b-3xl bg-'>
          <Link href='/' className={`flex flex-col items-center text-xs font-medium`}>
            <TbSmartHome className='text-2xl' />
            Home
          </Link>
          <Link href={'/search'} className={`flex flex-col items-center text-xs font-medium `}>
            <FiSearch className='text-2xl' />
            Search
          </Link>
          <Link href={'/listing'} className='bg-blue-600 absolute -top-6 border-[2px] border-transparent left-[40%] p-2 rounded-full'>
            <IoAddSharp className=' text-3xl text-white' />
          </Link>
          <Link href='/dashboard' className={`flex flex-col items-center text-xs font-medium`}>
            <RxDashboard className='text-2xl' />
            Dashboard
          </Link>
          <Link href='/account' className={`flex flex-col items-center text-xs font-medium`}>
            <AiOutlineUser className='text-2xl' />
            Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
