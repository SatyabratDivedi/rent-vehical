'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

type SearchPopupProps = {
  onClose: () => void;
};

const SearchPopup = ({ onClose }: SearchPopupProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryForSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set('search', searchQuery);
    router.push(`/vehicles?${params.toString()}`);
    onClose();
  };

  return (
    <div className='fixed inset-0 w-full h-full bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      {/* Close Button */}
      <div className='absolute top-6 right-6 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 cursor-pointer group' onClick={onClose}>
        <AiOutlineClose className='text-2xl group-hover:rotate-90 transition-transform duration-300' />
      </div>

      {/* Search Modal */}
      <div className='relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto transform transition-all duration-300 scale-100'>
        {/* Header */}
        <div className='text-center mb-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4'>
            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Search Vehicles</h2>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>Find your perfect commercial vehicle</p>
        </div>

        {/* Search Input */}
        <div className='relative mb-6'>
          <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
            <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} type='text' placeholder='Search by name, type, or location...' className='w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 text-lg' autoFocus />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button onClick={onClose} className='flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300'>
            Cancel
          </button>
          <button onClick={queryForSearch} disabled={!searchQuery.trim()} className='flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'>
            Search
          </button>
        </div>

        {/* Quick Search Suggestions */}
        <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>Quick searches:</p>
          <div className='flex flex-wrap gap-2'>
            {['Car', 'Auto', 'Truck', 'Bolero'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                }}
                className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200'
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
