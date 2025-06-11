'use client';
import { RootState } from '@/redux/store';
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import { VehicleCardSkeleton } from '../vehicles/page';
import { div } from 'framer-motion/client';

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

const VehiclesPage = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [loading, setLoading] = useState(true);
  const userFromLocalStorage = localStorage.getItem('user');
  const userId = userFromLocalStorage ? JSON.parse(userFromLocalStorage)?.id : user?.id;

  const [vehiclesData, setVehiclesData] = React.useState<Vehicle[]>([]);
  const fetchVehicles = useCallback(async () => {
    try {
      if (!userId) {
        console.error('User ID is not available');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/user_id/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }
      setVehiclesData(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const deleteHandler =async (id:string)=>{
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete vehicle');
      }

      // Remove the deleted vehicle from the state
      setVehiclesData((prev) => prev.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.log(error)
    }
   }

  return (
    <>
      <ProtectedRoute>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6'>
          {/* Page Header */}
          <div className='mb-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className=' text-center lg:text-start mb-5 lg:mb-0'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>My Vehicles </h1>
                <p className='text-gray-600 dark:text-gray-300'>Manage your listed vehicles {vehiclesData.length}</p>
              </div>
              <button className='px-6 py-3 bg-[#428d42] text-white rounded-lg hover:bg-[#357a35] transition-colors duration-200 font-medium'>+ Add New Vehicle</button>
            </div>
          </div>{' '}
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
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img src={vehicle.images[0]} alt={vehicle.title} className='w-full h-full object-cover' />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                          </svg>
                        </div>
                      )}

                      {/* Image Count Badge */}
                      {vehicle.images && vehicle.images.length > 1 && (
                        <div className='absolute top-4 left-4'>
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-black/60 text-white'>+{vehicle.images.length - 1} more</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className='absolute top-4 right-4'>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${vehicle.isPublished ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>{vehicle.isPublished ? 'Published' : 'Draft'}</span>
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
                        <div className='flex items-center space-x-2'>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${vehicle.isOwner ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}>{vehicle.isOwner ? 'Owner' : 'Renter'}</span>
                        </div>

                        <div className='flex gap-2'>
                          <button
                            className='px-3 py-1.5 text-[#428d42] border border-[#428d42] rounded-lg hover:bg-[#428d42] hover:text-white transition-colors duration-200 text-sm font-medium'
                            onClick={() => {
                              /* Handle edit */
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className='px-3 py-1.5 bg-[#d9534f] text-white rounded-lg hover:bg-[#c9302c] transition-colors duration-200 text-sm font-medium'
                            onClick={() => deleteHandler(vehicle.id)}
                          >
                            Delete
                          </button>
                          {!vehicle.isPublished && (
                            <button
                              className='px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium'
                              onClick={() => {
                                /* Handle publish */
                              }}
                            >
                              Publish
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
              <div className='col-span-full text-center py-12'>
                <svg className='w-24 h-24 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>No vehicles listed</h3>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>Start earning by listing your first vehicle</p>
                <button className='px-6 py-3 bg-[#428d42] text-white rounded-lg hover:bg-[#357a35] transition-colors duration-200 font-medium'>List Your First Vehicle</button>
              </div>
            )}
          </div>{' '}
          {/* Empty State (if no vehicles) */}
          {vehiclesData.length === 0 && (
            <div className='text-center py-12'>
              <svg className='w-24 h-24 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
              </svg>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>No vehicles listed</h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6'>Start earning by listing your first vehicle</p>
              <button className='px-6 py-3 bg-[#428d42] text-white rounded-lg hover:bg-[#357a35] transition-colors duration-200 font-medium'>List Your First Vehicle</button>
            </div>
          )}
        </div>
      </ProtectedRoute>
    </>
  );
};

export default VehiclesPage;
