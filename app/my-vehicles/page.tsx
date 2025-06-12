'use client';
import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import ProtectedRoute from '../components/ProtectedRoute';
import ConfirmationPopup from '../components/ConfirmationPopup';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Vehicle {
  id: string;
  title: string;
  description: string;
  images: string[];
  isPublished: boolean;
  isOwner: boolean;
  userId: string;
  locationId: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

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

const VehiclesPage = () => {
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingToggleId, setPublishingToggleId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const { token, userId } = useAuth();
  const router = useRouter();

  const [vehiclesData, setVehiclesData] = React.useState<Vehicle[]>([]);

  const fetchVehicles = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/user_id/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }
      setVehiclesData(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const deleteHandler = async (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    setDeletingId(vehicleToDelete.id);
    setShowDeleteConfirm(false);

    try {
      if (!token) {
        setDeletingId(null);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/delete-vehicle/${vehicleToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete vehicle');
      }

      if (vehicleToDelete.isPublished) {
        localStorage.removeItem('vehicles_cache');
      }

      setVehiclesData((prev) => prev.filter((vehicle) => vehicle.id !== vehicleToDelete.id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    } finally {
      setDeletingId(null);
      setVehicleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setVehicleToDelete(null);
  };

  const publishToggle = async (vehicleId: string) => {
    setPublishingToggleId(vehicleId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/toggle-publish-vehicle/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to publish vehicle');
      }

      localStorage.removeItem('vehicles_cache');

      setVehiclesData((prev) => prev.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, isPublished: !vehicle.isPublished } : vehicle)));
    } catch (error) {
      console.error('Error publishing vehicle:', error);
    } finally {
      setPublishingToggleId(null);
    }
  };

  return (
    <>
      <ProtectedRoute>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6'>
          {/* Page Header */}
          <div className='mb-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className=' text-center lg:text-start mb-5 lg:mb-0'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>My Vehicles </h1>
                <p className='text-gray-600 dark:text-gray-300'>Manage your listed vehicles</p>
              </div>
              <button onClick={() => router.push('/vehicle-listing')} className='px-6 py-3 bg-[#428d42] text-white rounded-lg hover:bg-[#357a35] transition-colors duration-200 font-medium'>
                + Add New Vehicle
              </button>
            </div>
          </div>
          {/* Statistics Cards */}
          <div className='grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-8'>
            <div className='bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 sm:p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#428d42]/10 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 lg:mr-4'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#428d42]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                  </svg>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 truncate'>Total Vehicles</p>
                  <p className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white'>{vehiclesData.length}</p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 sm:p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 lg:mr-4'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 truncate'>Published</p>
                  <p className='text-lg sm:text-xl lg:text-2xl font-bold text-green-600'>{vehiclesData.filter((v) => v.isPublished).length}</p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 sm:p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 lg:mr-4'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 truncate'>Draft</p>
                  <p className='text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600'>{vehiclesData.filter((v) => !v.isPublished).length}</p>
                </div>
              </div>
            </div>
          </div>{' '}
          {/* Vehicles Grid */}
          <div className=''>
            {loading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[...Array(4)].map((_, index) => (
                  <VehicleCardSkeleton key={index} />
                ))}
              </div>
            ) : vehiclesData.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {vehiclesData.map((vehicle) => (
                  <div key={vehicle.id} className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300'>
                    {/* Vehicle Image */}
                    <div className='h-48 bg-gray-200 dark:bg-gray-700 relative'>
                      {' '}
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <Image src={vehicle.images[0]} alt={vehicle.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                          </svg>
                        </div>
                      )}
                      {/* Image Count Badge */}
                      {vehicle.images && vehicle.images.length > 1 && (
                        <div className='absolute top-2 left-2'>
                          <span className='inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-black/70 text-white backdrop-blur-sm border border-white/20 shadow-lg'>
                            <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
                            </svg>
                            <span className='tracking-tight'>+{vehicle.images.length - 1}</span>
                          </span>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className='absolute top-2 right-2'>
                        <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-lg shadow-lg backdrop-blur-xl border transition-all duration-300 ${vehicle.isPublished ? ' text-emerald-700 border-emerald-200/50 bg-emerald-50/95' : 'text-orange-700 border-orange-200/50 bg-orange-50/95'}`}>
                          <div className={`w-2 h-2 rounded-full ${vehicle.isPublished ? 'bg-emerald-600 animate-pulse' : 'bg-orange-600'}`}></div>
                          <span className='font-semibold tracking-tight'>{vehicle.isPublished ? 'LIVE' : 'DRAFT'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className='p-6'>
                      <div className='flex justify-between items-start mb-3'>
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white line-clamp-1'>{vehicle.title}</h3>
                        <div className='flex items-center text-[#428d42]'>
                          {vehicle.isOwner && (
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                              <path
                                fillRule='evenodd'
                                d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className='space-y-2 mb-4'>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          <span className='font-medium'>Contact:</span> {vehicle.contact}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Created: {new Date(vehicle.createdAt).toLocaleDateString()}</p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}</p>
                      </div>

                      <div className='flex justify-between items-center'>
                        {/* <div className='flex items-center space-x-2'>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${vehicle.isOwner ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}>{vehicle.isOwner ? 'Owner' : 'Renter'}</span>
                        </div> */}

                        <div className='flex gap-2'>
                          <button
                            className='px-3 py-1.5 text-[#428d42] border border-[#428d42] rounded-lg hover:bg-[#428d42] hover:text-white transition-colors duration-200 text-sm font-medium'
                            onClick={() => {
                              /* Handle edit */
                            }}
                          >
                            Edit
                          </button>
                          <button className={`px-3 py-1.5 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2 ${deletingId === vehicle.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#d9534f] hover:bg-[#c9302c]'}`} onClick={() => deleteHandler(vehicle)} disabled={deletingId === vehicle.id}>
                            {deletingId === vehicle.id ? (
                              <>
                                <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                </svg>
                              </>
                            ) : (
                              'Delete'
                            )}
                          </button>
                          {publishingToggleId === vehicle.id ? (
                            <button className='px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2 cursor-not-allowed opacity-80' disabled>
                              <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                              </svg>
                            </button>
                          ) : (
                            <button
                              className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium transform hover:scale-105 ${
                                vehicle.isPublished ? 'bg-[#fef9c3] hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-500/25' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25'
                              }`}
                              onClick={() => {
                                publishToggle(vehicle.id);
                              }}
                            >
                              {vehicle.isPublished ? (
                                <span className='flex items-center gap-2'>
                                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z' clipRule='evenodd' />
                                  </svg>
                                  Unpublish
                                </span>
                              ) : (
                                <span className='flex items-center gap-2'>
                                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
                                  </svg>
                                  Publish
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state when no vehicles from API
              <div className='text-center py-12'>
                <svg className='w-24 h-24 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>No vehicles listed</h3>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>Start earning by listing your first vehicle</p>
                <button onClick={() => router.push('/vehicle-listing')} className='px-6 py-3 bg-[#428d42] text-white rounded-lg hover:bg-[#357a35] transition-colors duration-200 font-medium'>
                  List Your First Vehicle
                </button>
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>

      <ConfirmationPopup
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title='Delete Vehicle'
        message={`Are you sure you want to delete "${vehicleToDelete?.title}"? This action cannot be undone and will permanently remove the vehicle and all its associated images.`}
        confirmText='Yes, Delete'
        cancelText='Cancel'
        confirmButtonColor='bg-red-600 hover:bg-red-700'
        isLoading={deletingId !== null}
      />
    </>
  );
};

export default VehiclesPage;
