'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter, useParams } from 'next/navigation';
import { Vehicle } from '@/app/vehicles/page';
import { toast } from 'sonner';
import CountPopup from './CountPopup';
import Link from 'next/link';

// Loading skeleton for vehicle details
const VehicleDetailsSkeleton = () => (
  <div className='animate-pulse'>
    <div className='h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6'></div>
    <div className='grid md:grid-cols-2 gap-8 mb-8'>
      <div className='h-96 bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
      <div className='space-y-4'>
        <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2'></div>
        <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-full'></div>
        <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4'></div>
        <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6'></div>
      </div>
    </div>
  </div>
);

// Image gallery component
const ImageGallery = ({ images, title }: { images: string[]; title: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className='bg-gray-200 dark:bg-gray-700 rounded-xl h-96 flex items-center justify-center'>
        <div className='text-center text-gray-500 dark:text-gray-400'>
          <svg className='w-16 h-16 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Main image */}
      <div className='relative h-96 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden group'>
        {!imageError ? (
          <Image src={images[currentImageIndex]} alt={`${title} - Image ${currentImageIndex + 1}`} fill className='object-cover' onError={() => setImageError(true)} />
        ) : (
          <div className='flex items-center justify-center h-full text-gray-500 dark:text-gray-400'>
            <svg className='w-16 h-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <button onClick={nextImage} className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6 gap-2'>
          {images.map((image, index) => (
            <button key={index} onClick={() => goToImage(index)} className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
              <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill className='object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Owner info component
const OwnerInfo = ({ user }: { user: Vehicle['user'] }) => (
  <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Vehicle Owner</h3>
    <div className='flex items-center space-x-4'>
      <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold'>{user?.name?.charAt(0).toUpperCase()}</div>
      <div className='flex-1'>
        <h4 className='font-semibold text-gray-900 dark:text-white'>{user?.name}</h4>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{user?.email}</p>
        {/* {user?.mobile && <p className='text-sm text-gray-600 dark:text-gray-400'>{user.mobile}</p>}
        <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
          {user?.vehiclesCount} vehicle{user?.vehiclesCount !== 1 ? 's' : ''} listed
        </p> */}
      </div>
    </div>
  </div>
);

// Cache utilities for vehicle details
const VEHICLE_CACHE_KEY_PREFIX = 'vehicle_details_cache_';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

const getCachedVehicle = (vehicleId: string) => {
  try {
    if (typeof window === 'undefined') return null;

    const cacheKey = `${VEHICLE_CACHE_KEY_PREFIX}${vehicleId}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading vehicle cache:', error);
    return null;
  }
};

const setCachedVehicle = (vehicleId: string, data: Vehicle) => {
  try {
    if (typeof window === 'undefined') return;

    const cacheKey = `${VEHICLE_CACHE_KEY_PREFIX}${vehicleId}`;
    const cacheObject = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
  } catch (error) {
    console.error('Error setting vehicle cache:', error);
  }
};

// Main vehicle details component
const VehicleDetailsPage = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [countRequestLoading, setCountRequestLoading] = useState(false);
  const [countPopupOpen, setCountPopupOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.id as string;
  useEffect(() => {
    if (vehicleId) {
      loadVehicleDetails();
    }
  }, [vehicleId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedVehicle = getCachedVehicle(vehicleId);
      if (cachedVehicle) {
        setVehicle(cachedVehicle);
        setIsFromCache(true);
        setLoading(false);
        return;
      }

      // Fetch from API if no cache
      await fetchVehicleDetails();
    } catch (err) {
      console.error('Error loading vehicle details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchVehicleDetails = async () => {
    try {
      setIsFromCache(false);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/vehicle_id/${vehicleId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Vehicle not found');
        }
        throw new Error('Failed to fetch vehicle details');
      }

      const data = await response.json();

      if (data.success) {
        setVehicle(data.data);
        setCachedVehicle(vehicleId, data.data); // Cache the data
      } else {
        throw new Error(data.error || 'Failed to fetch vehicle details');
      }
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBackToList = () => {
    router.back();
  };

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  const checkCount = async () => {
    try {
      setCountRequestLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/count_view`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setRequestCount(data.request_count);
        setCountPopupOpen(true);
        setCountRequestLoading(false);
      } else {
        toast.error(
          <div className='flex gap-2'>
            <span>{data.error}</span>
            <Link href='/handler/sign-in' className='text-blue-500 hover:text-blue-700 underline font-medium'>
              Login here
            </Link>
          </div>
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCountRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen  dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
        <div className='max-w-6xl mx-auto'>
          <VehicleDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center py-12'>
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto'>
              <svg className='w-16 h-16 text-red-500 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
              </svg>
              <h3 className='text-lg font-semibold text-red-800 dark:text-red-200 mb-2'>{error}</h3>
              <div className='space-y-2'>
                <button onClick={fetchVehicleDetails} className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mr-2'>
                  Try Again
                </button>
                <button onClick={handleBackToList} className='bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200'>
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className='min-h-screen  dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
      <CountPopup isOpen={countPopupOpen} onClose={() => setCountPopupOpen(false)} requestCount={requestCount} increaseCount={() => setRequestCount((prev) => prev + 1)} vehicleId={vehicleId} />

      <div className='max-w-6xl mx-auto'>
        {/* Header with back button */}
        <div className='mb-8'>
          <button onClick={handleBackToList} className='flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 mb-4'>
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            Back to Vehicle List
          </button>

          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>{vehicle.title}</h1>{' '}
              {/* <div className='flex items-center space-x-4'>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${vehicle.isPublished ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{vehicle.isPublished ? 'Published' : 'Draft'}</span>
                {vehicle.isOwner && <span className='bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium'>Owner Listed</span>}
                {isFromCache && <span className='bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium'>Cached</span>}
              </div> */}
            </div>

            <div className='text-right text-sm text-gray-600 dark:text-gray-400'>
              <p>Listed on {formatDate(vehicle.createdAt)}</p>
              {vehicle.updatedAt !== vehicle.createdAt && <p>Updated {formatDate(vehicle.updatedAt)}</p>}
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left column - Images and description */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Image gallery */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Vehicle Images</h2>
              <ImageGallery images={vehicle.images} title={vehicle.title} />
            </div>

            {/* Description */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Description</h2>
              <div className='prose prose-gray dark:prose-invert max-w-none'>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>{vehicle.description}</p>
              </div>
            </div>
          </div>

          {/* Right column - Owner info and actions */}
          <div className='space-y-6'>
            {/* Owner information */}
            <OwnerInfo user={vehicle.user} />

            {/* Contact actions */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Interested in this vehicle?</h3>
              <div className='space-y-3'>
                <button onClick={checkCount} className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md'>
                  {countRequestLoading ? (
                    <div className='flex justify-center items-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                    </div>
                  ) : (
                    'Contact Owner'
                  )}
                </button>
                <button className='w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200'>Save to Favorites</button>
                <button className='w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200'>Share Vehicle</button>
              </div>
            </div>

            {/* Vehicle statistics */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Vehicle Info</h3>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Vehicle ID:</span>
                  <span className='text-gray-900 dark:text-white font-mono text-xs'>{vehicle.id}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Images:</span>
                  <span className='text-gray-900 dark:text-white'>{vehicle.images.length}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Status:</span>
                  <span className='text-gray-900 dark:text-white'>{vehicle.isPublished ? 'Available' : 'Not Listed'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Listing Type:</span>
                  <span className='text-gray-900 dark:text-white'>{vehicle.isOwner ? 'Owner' : 'Dealer'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
