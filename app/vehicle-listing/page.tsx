'use client';

import { Metadata } from 'next';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/navigation';

interface Location {
  latitude: string;
  longitude: string;
  address: string;
  district: string;
  state: string;
  pinCode: string;
}

interface FormData {
  title: string;
  description: string;
  isOwner: boolean;
  contact: string;
  images: File[];
  location: Location;
}

interface ImagePreview {
  file: File;
  url: string;
}

// Google Maps AutoComplete types
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
    APILoader: any;
  }
}

const metadata: Metadata = {
  title: 'List Your Vehicle for Rent | Rent Vehicle Platform - Earn Money from Your Car, Truck, Tractor',
  description: 'List your vehicle for rent and start earning money. Post cars, trucks, tractors, auto rickshaw, bolero, commercial vehicles on our platform. Free registration, instant visibility to thousands of renters.',
  keywords: [
    'list vehicle for rent',
    'rent out my car',
    'earn from vehicle',
    'vehicle rental income',
    'list car for rental',
    'rent my truck',
    'vehicle sharing platform',
    'post vehicle for rent',
    'vehicle rental business',
    'lease my vehicle',
    'car rental income',
    'truck rental income',
    'tractor rental income',
    'vehicle rental marketplace',
    'rent out vehicle online',
    'vehicle rental registration',
    'vehicle listing platform',
    'earn money from car',
    'vehicle rental owner',
    'rental vehicle listing',
  ],
  openGraph: {
    title: 'List Your Vehicle for Rent | Start Earning Today',
    description: 'List your vehicle for rent and start earning money. Free registration, instant visibility to thousands of renters.',
    type: 'website',
    images: [
      {
        url: '/vehicle-listing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'List your vehicle for rent - cars, trucks, tractors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'List Your Vehicle for Rent | Start Earning Today',
    description: 'List your vehicle for rent and start earning money. Free registration with instant visibility.',
    images: ['/vehicle-listing-og.jpg'],
  },
  alternates: {
    canonical: 'https://www.rentvehical.com/vehicle-listing',
  },
};

export default function VehiclePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const pinCodeInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    isOwner: false,
    contact: '',
    images: [],
    location: {
      latitude: '',
      longitude: '',
      address: '',
      district: '',
      state: '',
      pinCode: '',
    },
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  // Load Google Maps API (Traditional approach - more reliable)
  const loadGoogleMapsAPI = useCallback(() => {
    if (window.google && window.google.maps) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.warn('Google Maps API key is not configured. Address autocomplete will not work.');
        reject(new Error('Google Maps API key is not configured'));
        return;
      }

      // Use traditional Google Maps API - more reliable
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Create a global callback function
      window.initGoogleMaps = () => {
        console.log('Google Maps API loaded successfully');
        setIsGoogleMapsLoaded(true);
        resolve();
      };

      script.onerror = (error) => {
        console.error('Failed to load Google Maps API:', error);
        reject(new Error('Failed to load Google Maps API. Please check your API key and billing settings.'));
      };

      document.head.appendChild(script);
    });
  }, []); // Initialize address autocomplete
  const initializeAddressAutocomplete = useCallback(async () => {
    if (!addressInputRef.current) return;

    try {
      await loadGoogleMapsAPI();

      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'IN' }, // Restrict to India
          fields: ['address_components', 'formatted_address', 'geometry'],
        });

        autocompleteRef.current.addListener('place_changed', handleAddressSelect);
        console.log('Address autocomplete initialized successfully');
      } else {
        throw new Error('Google Maps Places API not available');
      }
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
      // Don't show error to user, just log it - autocomplete is optional
    }
  }, [loadGoogleMapsAPI]);

  // Handle address selection from autocomplete
  const handleAddressSelect = () => {
    const place = autocompleteRef.current.getPlace();

    if (!place || !place.address_components) return;

    const addressComponents = place.address_components;
    let district = '';
    let state = '';
    let pinCode = '';

    // Extract address components
    addressComponents.forEach((component: any) => {
      const types = component.types;

      if (types.includes('administrative_area_level_3') || types.includes('locality')) {
        district = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (types.includes('postal_code')) {
        pinCode = component.long_name;
      }
    });

    // Get coordinates
    const lat = place.geometry?.location?.lat() || '';
    const lng = place.geometry?.location?.lng() || '';

    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        address: place.formatted_address || '',
        latitude: lat.toString(),
        longitude: lng.toString(),
        district,
        state,
        pinCode,
      },
    }));
  };
  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // First set the coordinates
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          },
        }));
        try {
          await loadGoogleMapsAPI();

          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            const latLng = { lat: latitude, lng: longitude };

            geocoder.geocode({ location: latLng }, (results: any[], status: string) => {
              if (status === 'OK' && results[0]) {
                const addressComponents = results[0].address_components;
                let district = '';
                let state = '';
                let pinCode = '';

                addressComponents.forEach((component: any) => {
                  const types = component.types;

                  if (types.includes('administrative_area_level_3') || types.includes('locality')) {
                    district = component.long_name;
                  }
                  if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                  }
                  if (types.includes('postal_code')) {
                    pinCode = component.long_name;
                  }
                });

                setFormData((prev) => ({
                  ...prev,
                  location: {
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    address: results[0].formatted_address,
                    district,
                    state,
                    pinCode,
                  },
                }));
              }
              setIsGettingLocation(false);
            });
          } else {
            // Fallback: just set coordinates without reverse geocoding
            console.log('Google Maps not available, setting coordinates only');
            setIsGettingLocation(false);
          }
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while getting location.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };
  const handlePinCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pinCode = e.target.value;
    if (isNaN(Number(pinCode))) {
      setError('only numbers are allowed in PIN code');
      return;
    }
    setError('');

    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, pinCode },
    }));
    if (pinCode.length === 6 && !isNaN(Number(pinCode))) {
      try {
        // Try Google Maps Extended Component Library first
        await loadGoogleMapsAPI();

        if (window.APILoader) {
          const { Geocoder } = await window.APILoader.importLibrary('geocoding');
          const geocoder = new Geocoder();

          geocoder.geocode(
            {
              address: pinCode + ', India',
            },
            (results: any[], status: string) => {
              if (status === 'OK' && results[0]) {
                const addressComponents = results[0].address_components;
                let district = '';
                let state = '';

                addressComponents.forEach((component: any) => {
                  const types = component.types;

                  if (types.includes('administrative_area_level_3') || types.includes('locality')) {
                    district = component.long_name;
                  }
                  if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                  }
                });

                if (district || state) {
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      district: district || prev.location.district,
                      state: state || prev.location.state,
                    },
                  }));
                }
              }
            }
          );
        } else {
          // Fallback: Use a public PIN code API
          try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
            const data = await response.json();

            if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
              const postOffice = data[0].PostOffice[0];
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  district: postOffice.District || prev.location.district,
                  state: postOffice.State || prev.location.state,
                },
              }));
            }

            if (data[0]?.Message == 'No records found') {
              setError('No records found');
            }
          } catch (apiError) {
            console.log('PIN code lookup failed:', apiError);
            // Silently fail, user can enter manually
          }
        }
      } catch (error) {
        console.error('Error geocoding pincode:', error);
        // Silently fail, user can enter manually
      }
    }
  };

  // Handle location input changes
  const handleLocationChange = (field: keyof Location, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  // Initialize autocomplete on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeAddressAutocomplete();
    }, 1000); // Small delay to ensure component is mounted

    return () => clearTimeout(timer);
  }, [initializeAddressAutocomplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (imagePreviews.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    const newPreviews: ImagePreview[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setError('');
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.contact.trim() || !formData.location.address.trim() || !formData.location.district.trim() || !formData.location.state.trim() || !formData.location.pinCode.trim()) {
      setError('Please fill in all required fields including contact and location information');
      return;
    }

    // Validate PIN code format (6 digits)
    if (!/^\d{6}$/.test(formData.location.pinCode)) {
      setError('Please enter a valid 6-digit PIN code');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('isOwner', formData.isOwner.toString());
      submitFormData.append('contact', formData.contact);

      // Add location data
      submitFormData.append('latitude', formData.location.latitude);
      submitFormData.append('longitude', formData.location.longitude);
      submitFormData.append('address', formData.location.address);
      submitFormData.append('district', formData.location.district);
      submitFormData.append('state', formData.location.state);
      submitFormData.append('pinCode', formData.location.pinCode);

      formData.images.forEach((image) => {
        submitFormData.append('images', image);
      });
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/create-vehicle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload vehicle');
      }

      setIsSuccess(true);

      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg className='w-8 h-8 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Vehicle Uploaded Successfully!</h2>
          <p className='text-gray-600 dark:text-gray-300 mb-6'>Your vehicle has been added to the platform. You can check it in your vehicle lists.</p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                title: '',
                description: '',
                isOwner: false,
                contact: '',
                images: [],
                location: {
                  latitude: '',
                  longitude: '',
                  address: '',
                  district: '',
                  state: '',
                  pinCode: '',
                },
              });
              setImagePreviews([]);
            }}
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200'
          >
            Add Another Vehicle
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
        {/* <button onClick={() => router.push('/')} className='flex fixed top-1 left-4 px-2 py-1 bg-slate-300 rounded-md group items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 mb-4'>
          <svg className='w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Back to Home
        </button> */}
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-6'>
              <h1 className='text-3xl font-bold text-white'>Add Your Vehicle</h1>
              <p className='text-blue-100 mt-2'>Share your vehicle with our community</p>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              {/* Title Field */}
              <div>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Vehicle Title *
                </label>
                <input type='text' id='title' name='title' value={formData.title} onChange={handleInputChange} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200' placeholder='e.g., Toyota Camry 2020' />
              </div>
              {/* Description Field */}
              <div>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Description *
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200'
                  placeholder='Describe your vehicle, its condition, features, etc.'
                />
              </div>
              {/* Contact Field */}
              <div>
                <label htmlFor='contact' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Phone Number *
                </label>
                <input type='text' id='contact' name='contact' value={formData.contact} onChange={handleInputChange} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200' placeholder='Phone number' />
              </div>{' '}
              {/* Owner Checkbox */}
              <div className='flex items-center space-x-3'>
                <input type='checkbox' id='isOwner' name='isOwner' checked={formData.isOwner} onChange={handleInputChange} className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
                <label htmlFor='isOwner' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Are you the owner of this vehicle?
                </label>
              </div>
              {/* Location Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2'>Location Information</h3>

                {/* Get Current Location Button */}
                <div className='flex items-center justify-between'>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>Use your current location or enter address manually</p>
                  <button type='button' onClick={getCurrentLocation} disabled={isGettingLocation} className='flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors duration-200 text-sm font-medium'>
                    {isGettingLocation ? (
                      <>
                        <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        {/* Getting Location... */}
                      </>
                    ) : (
                      <>
                        <div className='text-xs'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                          </svg>
                          {/* Get Current Location */}
                        </div>
                      </>
                    )}
                  </button>
                </div>
                {error == 'Location access denied. Please enable location services.' && <div className='text-xs text-red-500'>{error}</div>}

                {/* Address Field with Autocomplete */}
                <div>
                  <label htmlFor='address' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Full Address *
                  </label>
                  <input
                    ref={addressInputRef}
                    type='text'
                    id='address'
                    name='address'
                    value={formData.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200'
                    placeholder='Start typing your address...'
                  />{' '}
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Address autocomplete will help fill other fields automatically (requires Google Maps)</p>
                </div>

                {/* Location Details Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* PIN Code */}
                  <div>
                    <label htmlFor='pinCode' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      PIN Code *
                    </label>
                    <input
                      ref={pinCodeInputRef}
                      type='text'
                      id='pinCode'
                      name='pinCode'
                      value={formData.location.pinCode}
                      onChange={handlePinCodeChange}
                      className='w-full px-4 py-[9px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200'
                      placeholder='Enter 6-digit PIN code'
                      maxLength={6}
                    />
                    {error == 'No records found' && <div className='text-xs text-red-500'>{error}</div>}
                    {error == 'only numbers are allowed in PIN code' && <div className='text-xs text-red-500'>{error}</div>}
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>District and state will auto-fill for valid PIN codes</p>
                  </div>

                  {/* District */}
                  <div>
                    <label htmlFor='district' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      District *
                    </label>
                    {/* <input
                    type='text'
                    id='district'
                    name='district'
                    value={formData.location.district}
                    onChange={(e) => handleLocationChange('district', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200'
                    placeholder='District name'
                    readOnly
                  /> */}
                    <div className='text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>{formData.location.district || <span className='text-[.6rem] py-3'>District will auto-fill based on address</span>}</div>
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor='state' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      State *
                    </label>
                    {/* <input type='text' id='state' name='state' value={formData.location.state} onChange={(e) => handleLocationChange('state', e.target.value)} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200' placeholder='State name' /> */}
                    <div className='text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>{formData.location.state || <span className='text-[.6rem] py-3'>State will auto-fill based on address</span>}</div>
                  </div>

                  {/* Coordinates Display */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Coordinates</label>
                    <div className='text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
                      {formData.location.latitude && formData.location.longitude ? (
                        <>
                          <div className='flex justify-between items-center'>
                            <div>Lat: {formData.location.latitude}</div>
                            <div>Lng: {formData.location.longitude}</div>
                          </div>
                        </>
                      ) : (
                        <div className='text-[.6rem]'>Coordinates will auto-fill based on address</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Vehicle Images (Max 5)</label>

                {imagePreviews.length < 5 && (
                  <div className='mb-4'>
                    <label htmlFor='images' className='cursor-pointer'>
                      <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200'>
                        <svg className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                          <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                          <span className='font-medium text-blue-600 dark:text-blue-400'>Click to upload</span> or drag and drop
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-500'>PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                    <input type='file' id='images' multiple accept='image/*' onChange={handleImageUpload} className='hidden' />
                  </div>
                )}

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className='relative group'>
                        <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700'>
                          <Image src={preview.url} alt={`Preview ${index + 1}`} width={200} height={200} className='h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200' />
                        </div>
                        <button type='button' onClick={() => removeImage(index)} className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {error && (
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                  <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
                </div>
              )}
              {/* Submit Button */}
              <div className='pt-4'>
                <button type='submit' disabled={isSubmitting} className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center'>
                  {isSubmitting ? (
                    <>
                      <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Submit Vehicle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
