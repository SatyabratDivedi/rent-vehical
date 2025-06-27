'use client';
import { setUser } from '@/redux/slice/userSlice';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user.value);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSaveChanges = async () => {

try {
      if (!name) {
      toast.error('Please fill in all fields');
      return;
    }
    if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    toast.loading('Updating profile...', {
      id: 'profile-update',
    });

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success('Profile updated successfully!', {
        id: 'profile-update',
      });
      dispatch(setUser(data.data));
      setIsEditable(false);
    } else {
      toast.error('Failed to update profile', {
        id: 'profile-update',
      });
      toast.error(data.error || 'Failed to update profile');
    }
  } catch (error) {
    toast.error('Something went wrong!', {
      id: 'profile-update',
    });
  }
  };

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6'>
      {/* Page Header */}
      <div className='mb-6 lg:mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2'>My Profile</h1>
        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300'>Manage your account information and preferences</p>
      </div>

      {/* Profile Content */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
        {/* Personal Information Card */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white'>Personal Information</h2>
            <button
              onClick={() => {
                setIsEditable(!isEditable);
                setName(user.name);
                setEmail(user.email);
              }}
              className='text-sm sm:text-base text-blue-600 hover:underline'
            >
              {isEditable ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Full Name</label>
              {isEditable ? (
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent dark:bg-gray-700 dark:text-white' placeholder='Enter your full name' />
              ) : (
                <div className='px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base'>{user.name || <Skeleton className='w-full h-4' />}</div>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Email Address</label>
              {isEditable ? (
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent dark:bg-gray-700 dark:text-white' placeholder='Enter your email address' />
              ) : (
                <div className='px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base'>{user.email || <Skeleton className='w-full h-4' />}</div>
              )}
            </div>
            <div className='hidden'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Phone Number</label>
              {isEditable ? (
                <input type='tel' className='w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent dark:bg-gray-700 dark:text-white' placeholder='Enter your phone number' />
              ) : (
                <div className='px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base'>{user.phone || <Skeleton width={200} />}</div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          {isEditable && (
            <div className='mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4'>
              <button onClick={handleSaveChanges} className='w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#428d42] text-white rounded-lg hover:bg-[#357a35] transition-colors duration-200 font-medium'>
                Save Changes
              </button>
              <button onClick={() => setIsEditable(false)} className='w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium'>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Account Statistics Card */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
          <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4'>Credits Statistics</h2>
          <div className='space-y-4'>
            <div className='flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-300'>Remaining Credits for Vehicle Listing</span>
              <span className='text-lg flex sm:text-xl font-bold text-[#428d42]'> {user.vehiclesCount || 0} /5</span>
            </div>
            <div className='flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-300'>Remaining Number Request</span>
              <span className='text-lg flex sm:text-xl font-bold text-blue-600'>{user.requestsCount || 0} /10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
