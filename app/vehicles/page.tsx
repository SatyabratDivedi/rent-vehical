'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setSingleVehicle, setVehicle } from '@/redux/slice/vehicleSlice';
import { Metadata } from 'next';
import { toast } from 'sonner';
import SearchPopup from './SearchPopup';

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
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    district?: string;
    state?: string;
    pinCode?: string;
  };
}

// Loading skeleton component
const VehicleCardSkeleton = () => (
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
const VehicleCard = ({ vehicle, userLocation }: { vehicle: Vehicle; userLocation?: { lat: number; lng: number } | null }) => {
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
    dispatch(setSingleVehicle(vehicle));
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getDistanceText = (): string | null => {
    if (!userLocation || !vehicle.location?.latitude || !vehicle.location?.longitude) {
      return null;
    }

    const distance = calculateDistance(userLocation.lat, userLocation.lng, vehicle.location.latitude, vehicle.location.longitude);

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    } else {
      return `${distance.toFixed(1)}km away`;
    }
  };

  return (
    <div onClick={handleViewDetails} className='group dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer'>
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
          {getDistanceText() && (
            <div className='flex items-center text-xs text-[#428d42] dark:text-[#428d42] font-medium'>
              <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              {getDistanceText()}
            </div>
          )}
          {/* <div className='text-gray-500 dark:text-gray-400'>{formatDate(vehicle.createdAt)}</div> */}
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
const VehicleListContent = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [forcedLoading, setForcedLoading] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [distanceFilteredVehicles, setDistanceFilteredVehicles] = useState<Vehicle[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const applyAllFilters = useCallback(() => {
    const query = searchParams.get('search') || '';

    let vehiclesToFilter = distanceFilteredVehicles.length > 0 ? distanceFilteredVehicles : vehicles;

    if (query) {
      const filtered = vehiclesToFilter.filter((vehicle) => vehicle.title.toLowerCase().includes(query.toLowerCase()) || vehicle.description.toLowerCase().includes(query.toLowerCase()) || vehicle.user.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehiclesToFilter);
    }
  }, [searchParams, distanceFilteredVehicles, vehicles]);

  useEffect(() => {
    applyAllFilters();
  }, [applyAllFilters]);

  const distanceFilter = searchParams.get('distance') || 'all';

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const filterVehiclesByDistance = useCallback((vehicleList: Vehicle[], maxDistance: number | null, userLat: number, userLng: number): Vehicle[] => {
    if (!maxDistance || !userLat || !userLng) {
      return vehicleList;
    }

    const vehiclesWithDistance = vehicleList
      .filter((vehicle) => {
        if (!vehicle.location?.latitude || !vehicle.location?.longitude) {
          return false;
        }

        const distance = calculateDistance(userLat, userLng, vehicle.location.latitude, vehicle.location.longitude);
        return distance <= maxDistance;
      })
      .map((vehicle) => ({
        ...vehicle,
        calculatedDistance: calculateDistance(userLat, userLng, vehicle.location!.latitude, vehicle.location!.longitude),
      }));

    return vehiclesWithDistance.sort((a, b) => a.calculatedDistance - b.calculatedDistance).map(({ calculatedDistance, ...vehicle }) => vehicle);
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      setIsFromCache(false);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle`);

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();

      if (data.success) {
        setVehicles(data.data);
        setFilteredVehicles(data.data);
        setCachedData(data.data); // Cache the data
        console.log('fetched vehicles:', data.data);
        dispatch(setVehicle(data.data)); // Dispatch to Redux store
      } else {
        throw new Error(data.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedVehicles = getCachedData();
      if (cachedVehicles && cachedVehicles.length > 0) {
        setVehicles(cachedVehicles);
        setFilteredVehicles(cachedVehicles);
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
  }, [fetchVehicles]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    if (vehicles.length === 0) return;

    const applyDistanceFilter = async () => {
      if (distanceFilter === 'all') {
        if (userLocation) {
          const vehiclesWithDistance = vehicles
            .filter((vehicle) => vehicle.location?.latitude && vehicle.location?.longitude)
            .map((vehicle) => ({
              ...vehicle,
              calculatedDistance: calculateDistance(userLocation.lat, userLocation.lng, vehicle.location!.latitude, vehicle.location!.longitude),
            }))
            .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
            .map(({ calculatedDistance, ...vehicle }) => vehicle);

          const vehiclesWithoutLocation = vehicles.filter((vehicle) => !vehicle.location?.latitude || !vehicle.location?.longitude);

          setDistanceFilteredVehicles([...vehiclesWithDistance, ...vehiclesWithoutLocation]);
        } else {
          setDistanceFilteredVehicles(vehicles);
        }
        return;
      }

      if (!userLocation && (distanceFilter === '10km' || distanceFilter === '50km' || distanceFilter === '100km')) {
        try {
          setLocationLoading(true);
          const location = await getCurrentLocation();
          setUserLocation(location);

          const maxDistance = distanceFilter === '10km' ? 10 : distanceFilter === '50km' ? 50 : distanceFilter === '100km' ? 100 : null;

          const filtered = filterVehiclesByDistance(vehicles, maxDistance, location.lat, location.lng);
          setDistanceFilteredVehicles(filtered);
        } catch (err) {
          setLocationError(err instanceof Error ? err.message : 'Failed to get location');
          const resetParams = new URLSearchParams(searchParams);
          resetParams.delete('distance');
          const resetUrl = resetParams.toString() ? `/vehicles?${resetParams.toString()}` : '/vehicles';
          router.push(resetUrl, { scroll: false });
          setDistanceFilteredVehicles(vehicles);
        } finally {
          setLocationLoading(false);
        }
      } else if (userLocation) {
        // Use existing location
        const maxDistance = distanceFilter === '10km' ? 10 : distanceFilter === '50km' ? 50 : distanceFilter === '100km' ? 100 : null;

        const filtered = filterVehiclesByDistance(vehicles, maxDistance, userLocation.lat, userLocation.lng);
        setDistanceFilteredVehicles(filtered);
      }
    };

    applyDistanceFilter();
  }, [vehicles, distanceFilter, searchParams, router, userLocation, filterVehiclesByDistance]);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000,
        }
      );
    });
  };

  const params = new URLSearchParams(searchParams);
  const handleDistanceFilterChange = async (selectedDistance: string) => {
    if (selectedDistance === distanceFilter) return;

    setForcedLoading(true);

    if (selectedDistance === 'all') {
      params.delete('distance');
    } else {
      params.set('distance', selectedDistance);
    }

    const newUrl = params.toString() ? `/vehicles?${params.toString()}` : '/vehicles';
    router.push(newUrl, { scroll: false });

    setLocationError(null);

    try {
      if (selectedDistance === 'all') {
        if (userLocation) {
          const vehiclesWithDistance = vehicles
            .filter((vehicle) => vehicle.location?.latitude && vehicle.location?.longitude)
            .map((vehicle) => ({
              ...vehicle,
              calculatedDistance: calculateDistance(userLocation.lat, userLocation.lng, vehicle.location!.latitude, vehicle.location!.longitude),
            }))
            .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
            .map(({ calculatedDistance, ...vehicle }) => vehicle);

          const vehiclesWithoutLocation = vehicles.filter((vehicle) => !vehicle.location?.latitude || !vehicle.location?.longitude);

          setDistanceFilteredVehicles([...vehiclesWithDistance, ...vehiclesWithoutLocation]);
        } else {
          setDistanceFilteredVehicles(vehicles);
        }
      } else {
        if (!userLocation) {
          setLocationLoading(true);
          try {
            const location = await getCurrentLocation();
            setUserLocation(location);

            const maxDistance = selectedDistance === '10km' ? 10 : selectedDistance === '50km' ? 50 : selectedDistance === '100km' ? 100 : null;

            const filtered = filterVehiclesByDistance(vehicles, maxDistance, location.lat, location.lng);
            setDistanceFilteredVehicles(filtered);
          } catch (err) {
            toast.error(locationError);
            setLocationError(err instanceof Error ? err.message : 'Failed to get location');
            const resetParams = new URLSearchParams(searchParams);
            resetParams.delete('distance');
            const resetUrl = resetParams.toString() ? `/vehicles?${resetParams.toString()}` : '/vehicles';
            router.push(resetUrl, { scroll: false });
            setDistanceFilteredVehicles(vehicles);
          } finally {
            setLocationLoading(false);
          }
        } else {
          const maxDistance = selectedDistance === '10km' ? 10 : selectedDistance === '50km' ? 50 : selectedDistance === '100km' ? 100 : null;

          const filtered = filterVehiclesByDistance(vehicles, maxDistance, userLocation.lat, userLocation.lng);
          setDistanceFilteredVehicles(filtered);
        }
      }
    } finally {
      setTimeout(() => {
        setForcedLoading(false);
      }, 100);
    }
  };

  const handleRetry = async () => {
    setForcedLoading(true);

    try {
      await fetchVehicles();
    } finally {
      setTimeout(() => {
        setForcedLoading(false);
      }, 100);
    }
  };

  const handleRefresh = async () => {
    setForcedLoading(true);

    try {
      await fetchVehicles();
    } finally {
      setTimeout(() => {
        setForcedLoading(false);
      }, 100);
    }
  };

  return (
    <div className=' dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        {/* Compact Distance Filter & Results Header */}
        <div className='mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4'>
          {/* Top Section: Title + Location Status */}
          <div className='flex items-center justify-between flex-wrap gap-3 mb-4'>
            <div className='flex items-center gap-2'>
              <div className='p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <h3 className='text-sm md:text-base font-semibold text-gray-900 dark:text-white'>Filter</h3>
              {params.get('search') && (
                <div className='flex items-center gap-2 text-xs md:text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>for:</span>
                  <span
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete('search');
                      const newUrl = params.toString() ? `/vehicles?${params.toString()}` : '/vehicles';
                      router.push(newUrl, { scroll: false });
                    }}
                    className='px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200 flex items-center gap-1'
                  >
                    {searchParams.get('search')}
                    <svg className=' h-2 w-2 md:w-3 md:h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </span>
                </div>
              )}
            </div>

            {/* Location Status - Compact */}
            <div className='  flex items-center gap-2'>
              {userLocation && (
                <div className=' relative group flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded-full'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
                  <span className='text-xs hidden md:inline font-medium text-green-700 dark:text-green-300'>Active</span>

                  {/* Tooltip */}
                  <div className='absolute bottom-full right-0 mb-2 px-2 py-1 bg-green-500  text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 invisible transform translate-y-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 pointer-events-none z-10'>
                    {`Lat:${userLocation.lat.toFixed(2)}, Long:${userLocation.lng.toFixed(2)}`}
                    <div className='absolute top-full right-3 w-0 h-0 border-l-4 border-r-2 border-t-4 border-transparent border-t-green-500 '></div>
                  </div>
                </div>
              )}
              {locationError && (
                <div className=' relative group flex items-center gap-1.5 px-2 py-1 bg-red-50 dark:bg-red-900/30 rounded-full'>
                  <svg className='w-3 h-3 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span className='text-xs font-medium text-red-700 dark:text-red-300'>Error</span>

                  {/* Tooltip */}
                  <div className='absolute bottom-full right-0 mb-2 px-2 py-1 bg-red-400 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 invisible  transform translate-y-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 pointer-events-none z-10'>
                    {locationError}
                    <div className='absolute top-full right-3 w-1 h-1 border-l-4 border-r-2 border-t-4 border-transparent border-t-red-400 dark:border-t-gray-700'></div>
                  </div>
                </div>
              )}
              <div>
                {showSearchPopup && <SearchPopup onClose={() => setShowSearchPopup(false)} />}
                <button onClick={() => setShowSearchPopup(true)} className='group flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95'>
                  <svg className=' h-3 w-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:rotate-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  <span className='hidden sm:inline'>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Buttons - Compact Design */}
          <div className='grid grid-cols-4 gap-2 mb-4'>
            <button onClick={() => handleDistanceFilterChange('all')} className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${distanceFilter === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              All
            </button>

            <button
              onClick={() => handleDistanceFilterChange('10km')}
              disabled={locationLoading}
              className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${distanceFilter === '10km' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {locationLoading && distanceFilter !== '10km' ? <div className='w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></div> : '10km'}
            </button>

            <button
              onClick={() => handleDistanceFilterChange('50km')}
              disabled={locationLoading}
              className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${distanceFilter === '50km' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              50km
            </button>

            <button
              onClick={() => handleDistanceFilterChange('100km')}
              disabled={locationLoading}
              className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${distanceFilter === '100km' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              100km
            </button>
          </div>

          {/* Results Summary + Refresh Button */}
          <div className='flex items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-700'>
            <div className='flex items-center gap-2'>
              <div className='p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg'>
                <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
              </div>
              <div>
                <p className='text-xs md:text-sm font-semibold text-gray-900 dark:text-white'>
                  {filteredVehicles.length} Vehicle{filteredVehicles.length !== 1 ? 's' : ''}
                </p>
                {distanceFilter !== 'all' && vehicles.length !== filteredVehicles.length && <p className='text-xs text-gray-500 dark:text-gray-400'>of {vehicles.length} total</p>}
              </div>
              {params.get('distance') && (
                <span className='px-2 ml-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-[.6rem] md:text-xs font-medium'>
                  within: <span className='font-semibold'>{params.get('distance')}</span>
                </span>
              )}
            </div>

            <div className='relative group'>
              <button onClick={handleRefresh} className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
                <span className='hidden sm:inline'>Refresh</span>
              </button>

              {/* Tooltip */}
              <div className='absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 invisible transform translate-y-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 pointer-events-none z-10'>
                Refresh vehicles
                <div className='absolute top-full right-3 w-0 h-0 border-l-4 border-r-2 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700'></div>
              </div>
            </div>
          </div>
        </div>
        {(loading || forcedLoading) && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, index) => (
              <VehicleCardSkeleton key={index} />
            ))}
          </div>
        )}
        {/* Error state */}
        {error && !loading && !forcedLoading && (
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
        {!loading && !forcedLoading && !error && vehicles.length === 0 && (
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
        {!loading && !forcedLoading && !error && vehicles.length > 0 && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} userLocation={userLocation} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Loading component for Suspense fallback
const VehicleListPageLoading = () => (
  <div className='dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {[...Array(8)].map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);

// Main wrapper component with Suspense
const VehicleListPage = () => {
  return (
    <Suspense fallback={<VehicleListPageLoading />}>
      <VehicleListContent />
    </Suspense>
  );
};

export default VehicleListPage;
