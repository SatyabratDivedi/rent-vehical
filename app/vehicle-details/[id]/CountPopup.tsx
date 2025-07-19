'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { toast } from 'sonner';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  increaseCount: () => void;
  requestCount: number;
  vehicleId: string;
}

const CountPopup: React.FC<ConfirmationPopupProps> = ({ isOpen, onClose, increaseCount, requestCount, vehicleId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const requestCountLimit = 5;

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      toast.error('Failed to copy number');
    }
  };

  const requestNumberHandler = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/vehicle_contact/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('number request', data);

      if (data.success) {
        setNumber(data.vehicleData.contact);
        increaseCount();
      }else{
         toast.error(data.error);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50' onClick={onClose} />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
            className='fixed inset-0 flex items-center justify-center z-50 p-3'
          >
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto'>
              {/* Header */}
              <div className='p-6 pb-4'>
                <div className='flex items-center gap-4'>
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', damping: 15 }} className='flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center'>
                    <svg className='w-6 h-6 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                  </motion.div>

                  {/* Title */}
                  <div className='flex-1'>
                    <motion.h3 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className='text-xl font-bold text-gray-900 dark:text-white'>
                      Get Contact Number
                    </motion.h3>
                    <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      Connect with the vehicle owner
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Message & Request Counter */}
              <div className='px-6 pb-4'>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='text-sm font-semibold text-gray-900 dark:text-white'>Your Request Quota</h4>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                      <span className='text-xs font-medium text-green-600 dark:text-green-400'>Active</span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className={`text-lg font-bold ${requestCount >= requestCountLimit ?'text-red-500':'text-blue-600'}  dark:text-blue-400`}>{requestCount}</span>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>/ {requestCountLimit}</span>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>Requests remaining</p>
                      <div className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1'>
                        <div className='h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300' style={{ width: `${(requestCount / requestCountLimit) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-4'>
                  🔒 <strong>Privacy Protected:</strong> Revealing contact details will use 1 request from your account. This helps prevent spam and ensures genuine inquiries.
                </motion.p>
              </div>

              {/* Contact Number Display */}
              {number !== '' ? (
                <div className='px-6 pb-4'>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: 'spring', damping: 20 }} className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3'>
                    <div className='flex items-center gap-3'>
                      <div className='flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'>
                        <svg className='w-5 h-5 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs font-medium text-green-700 dark:text-green-300 mb-1'>Contact Number Revealed</p>
                        <div className='flex items-center gap-2'>
                          <p className='text-xl font-bold text-green-800 dark:text-green-200 font-mono tracking-wider'>{number}</p>
                          <button 
                            onClick={handleCopyNumber} 
                            disabled={isCopied}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                              isCopied 
                                ? 'text-green-700 dark:text-green-300 bg-green-200 dark:bg-green-800/50 cursor-not-allowed' 
                                : 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                            }`} 
                            title={isCopied ? 'Copied!' : 'Copy to clipboard'}
                          >
                            {isCopied ? (
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                              </svg>
                            ) : (
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className='px-6 pb-4'>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center'>
                    <div className='flex items-center justify-center gap-2 mb-2'>
                      <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                      </svg>
                      <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>Contact Hidden</span>
                    </div>
                    <p className='text-2xl font-mono text-gray-400 dark:text-gray-600 tracking-wider'>••• ••• ••••</p>
                  </motion.div>
                </div>
              )}

              {/* Actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='flex gap-3 p-6 pt-0'>
                {/* Cancel Button */}
                <button onClick={onClose} disabled={isLoading} className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                  {number !== '' ? 'Close' : 'Cancel'}
                </button>

                {/* Action Button */}
                {number === '' ? (
                  <button
                    onClick={requestNumberHandler}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                       'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        <span>Revealing...</span>
                      </>
                    ) : (
                      <>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                        </svg>
                        <span>Reveal Contact</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button onClick={() => window.open(`tel:${number}`, '_self')} className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                    <span>Call Now</span>
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CountPopup;
