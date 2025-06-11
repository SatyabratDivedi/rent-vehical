'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setSingleVehicle, setVehicle } from '@/redux/slice/vehicleSlice';
import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Browse Available Vehicles for Rent | Cars, Trucks, Tractors, Auto Rickshaw Near You',
  description: 'Browse and book from thousands of vehicles available for rent. Find cars, trucks, tractors, auto rickshaw, bolero, commercial vehicles near you. Instant booking with verified owners.',
  keywords: [
    'browse vehicles for rent',
    'available vehicles near me',
    'rent vehicles online',
    'book vehicles instantly',
    'vehicles for hire',
    'rental vehicles marketplace',
    'find rental cars',
    'truck rentals available',
    'tractor rentals near me',
    'auto rickshaw booking',
    'commercial vehicles for rent',
    'verified vehicle owners',
    'instant vehicle booking',
    'vehicle rental catalog',
    'rent vehicle near me',
    'vehicle rental search',
    'book car online',
    'hire vehicle instantly',
    'vehicle rental directory',
    'rental vehicle listings',
  ],
  openGraph: {
    title: 'Browse Available Vehicles for Rent | Find Cars, Trucks, Tractors Near You',
    description: 'Browse thousands of vehicles available for rent. Find and book cars, trucks, tractors, auto rickshaw near you with instant confirmation.',
    type: 'website',
    images: [
      {
        url: '/vehicles-browse-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Browse vehicles for rent - cars, trucks, tractors available',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Available Vehicles for Rent | Cars, Trucks, Tractors',
    description: 'Find and book from thousands of vehicles available for rent near you. Instant booking with verified owners.',
    images: ['/vehicles-browse-og.jpg'],
  },
  alternates: {
    canonical: 'https://www.rentvehical.com/vehicles',
  },
};

export interface Vehicle {
  id: string;
  title: string;
  description: string;
  images: string[];
  isPublished: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Loading skeleton component
export const VehicleCardSkeleton = () => (
  <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse'>
    <div className='h-48 bg-gray-300 dark:bg-gray-700'></div>
    <div className='p-6 space-y-4'>
      <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4'></div>
      <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-full'></div>
      <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3'></div>
      <div className='flex justify-between items-center'>
        <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4'></div>
        <div className='h-8 bg-gray-300 dark:bg-gray-700 rounded w-20'></div>
      </div>
    </div>
  </div>
);

// Vehicle card component
const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleImageError = () => {
    setImageError(true);
  };

  const nextImage = () => {
    if (vehicle.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetails = () => {
    router.push(`/vehicle-details/${vehicle.id}`);
    dispatch(setSingleVehicle(vehicle)); // Dispatch the selected vehicle to Redux store
  };

  return (
    <div className='group dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700'>
      {/* Image section with navigation */}
      <div className='relative h-48 dark:bg-gray-700 overflow-hidden'>
        {vehicle.images.length > 0 && !imageError ? (
          <>
            <Image src={vehicle.images[currentImageIndex]} alt={vehicle.title} fill className='object-cover transition-transform duration-300 group-hover:scale-105' onError={handleImageError} />

            {/* Image navigation */}
            {vehicle.images.length > 1 && (
              <>
                <button onClick={prevImage} className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                  </svg>
                </button>
                <button onClick={nextImage} className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </button>

                {/* Image indicators */}
                <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1'>
                  {vehicle.images.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className='flex items-center justify-center h-full text-gray-400 dark:text-gray-500'>
            <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
        )}

        {/* Owner badge */}
        {vehicle.isOwner && (
          <div className='absolute top-3 right-3'>
            <span className='bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium'>Owner</span>
          </div>
        )}

        {/* Published status */}
        <div className='absolute top-3 left-3'>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${vehicle.isPublished ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-black'}`}>{vehicle.isPublished ? 'Published' : 'Draft'}</span>
        </div>
      </div>

      {/* Content section */}
      <div className='p-6 space-y-4'>
        <div>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1'>{vehicle.title}</h3>
          {/* <p className='text-gray-600 dark:text-gray-300 text-sm line-clamp-3'>{vehicle.description}</p> */}
        </div>
        {/* Vehicle info */}
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center text-gray-500 dark:text-gray-400'>
            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
            {vehicle.user.name}
          </div>
          <div className='text-gray-500 dark:text-gray-400'>{formatDate(vehicle.createdAt)}</div>
        </div>
        {/* Images count */}
        {vehicle.images.length > 0 && (
          <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
            {vehicle.images.length} image{vehicle.images.length !== 1 ? 's' : ''}
          </div>
        )}{' '}
        {/* Action button */}
        <div className='pt-2'>
          <button onClick={handleViewDetails} className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md'>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Cache utilities
const CACHE_KEY = 'vehicles_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

const getCachedData = () => {
  try {
    if (typeof window === 'undefined') return null;

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    console.log('cached vehicles:', data);

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  }
};

const setCachedData = (data: Vehicle[]) => {
  try {
    if (typeof window === 'undefined') return;

    const cacheObject = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

// Main vehicle list component
const VehicleListPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  useEffect(() => {
    loadVehicles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedVehicles = getCachedData();
      if (cachedVehicles && cachedVehicles.length > 0) {
        setVehicles(cachedVehicles);
        setIsFromCache(true);
        setLoading(false);
        return;
      }

      // Fetch from API if no cache
      await fetchVehicles();
    } catch (err) {
      console.error('Error loading vehicles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      setIsFromCache(false);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/`);

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();

      if (data.success) {
        setVehicles(data.data);
        setCachedData(data.data); // Cache the data
        console.log('fetched vehicles:', data.data);
        dispatch(setVehicle(data.data)); // Dispatch to Redux store
        setVehicles(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = () => {
    fetchVehicles(); // Force fresh fetch from API
  };

  const handleRefresh = () => {
    fetchVehicles(); // Force fresh fetch from API
  };

  return (
    <div className=' dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
      {/* <button onClick={() => router.push('/')} className='flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 mb-4'>
        <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
        Back to Home
      </button> */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        {/* <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>Vehicle Collection</h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>Explore our diverse collection of vehicles available for rent. Find the perfect ride for your next adventure.</p>
        </div> */}
        {/* Loading state */}
        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, index) => (
              <VehicleCardSkeleton key={index} />
            ))}
          </div>
        )}
        {/* Error state */}
        {error && !loading && (
          <div className='text-center py-12'>
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto'>
              <svg className='w-16 h-16 text-red-500 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
              </svg>
              <h3 className='text-lg font-semibold text-red-800 dark:text-red-200 mb-2'>Oops! Something went wrong</h3>
              <p className='text-red-600 dark:text-red-300 mb-4'>{error}</p>
              <button onClick={handleRetry} className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200'>
                Try Again
              </button>
            </div>
          </div>
        )}
        {/* Empty state */}
        {!loading && !error && vehicles.length === 0 && (
          <div className='text-center py-12'>
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto'>
              <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
              </svg>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>No vehicles found</h3>
              <p className='text-gray-600 dark:text-gray-300'>Be the first to add a vehicle to our collection!</p>
            </div>
          </div>
        )}{' '}
        {/* Vehicle grid */}
        {!loading && !error && vehicles.length > 0 && (
          <>
            <div className='mb-6 flex justify-between items-center'>
              <div className='flex items-center space-x-4'>
                <p className='text-gray-600 dark:text-gray-300'>
                  Showing {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                </p>
                {isFromCache && <span className='text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full'>Cached (10 min)</span>}
              </div>
              <button onClick={handleRefresh} className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 flex items-center space-x-1'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
                <span>Refresh</span>
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleListPage;
