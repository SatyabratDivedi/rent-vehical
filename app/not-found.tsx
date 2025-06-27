'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NotFoundPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className=' sm:px-6 lg:px-8 mt-[10%] flex items-center justify-center '>
      <div className='max-w-6xl mx-auto px-4 text-center'>
        <div className='relative mb-8'>
          <div className='text-8xl sm:text-9xl font-bold text-[#428d42] animate-bounce'>
            4<span className='inline-block animate-pulse'>0</span>
            <span className='inline-block animate-bounce delay-200'>4</span>
          </div>

          <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
            <div className='absolute top-1/4 left-1/4 w-3 h-3 bg-[#428d42] rounded-full animate-ping opacity-75'></div>
            <div className='absolute top-3/4 right-1/4 w-2 h-2 bg-[#357a35] rounded-full animate-ping delay-1000 opacity-75'></div>
            <div className='absolute top-1/2 left-1/2 w-4 h-4 bg-[#428d42] rounded-full animate-pulse delay-500 opacity-50'></div>
          </div>
        </div>

        <div className='mb-8 space-y-4'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white animate-fade-in'>Oops! Page Not Found</h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm animate-fade-in-delay-2'>Don&apos;t worry, even the best drivers sometimes take a wrong turn!</p>
        </div>

        <div className='mb-8 flex justify-center'>
          <div className='relative'>
            <svg className='w-24 h-24 text-[#428d42] animate-car-move' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-1.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z' />
            </svg>

            <div className='absolute -right-2 top-1/2 transform -translate-y-1/2'>
              <div className='w-2 h-2 bg-gray-400 rounded-full animate-smoke opacity-60'></div>
              <div className='w-1.5 h-1.5 bg-gray-300 rounded-full animate-smoke delay-300 opacity-40 ml-1 -mt-1'></div>
              <div className='w-1 h-1 bg-gray-200 rounded-full animate-smoke delay-500 opacity-20 ml-2 -mt-0.5'></div>
            </div>
          </div>
        </div>

        <div className='space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center'>
          <button onClick={() => router.back()} className='w-full sm:w-auto px-6 py-3 bg-[#428d42] text-white font-medium rounded-lg hover:bg-[#357a35] transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'>
            ← Go Back
          </button>

          <button onClick={() => router.push('/')} className='w-full sm:w-auto px-6 py-3 border-2 border-[#428d42] text-[#428d42] font-medium rounded-lg hover:bg-[#428d42] hover:text-white transition-all duration-200 transform hover:scale-105 active:scale-95 dark:border-[#428d42] dark:text-[#428d42] dark:hover:bg-[#428d42] dark:hover:text-white'>
            🏠 Go Home
          </button>
        </div>
      </div>

      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-[#428d42] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float'></div>
        <div className='absolute top-3/4 right-1/4 w-72 h-72 bg-[#357a35] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed'></div>
        <div className='absolute bottom-1/4 left-1/2 w-56 h-56 bg-[#428d42] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow'></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes car-move {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(10px) rotate(2deg);
          }
          75% {
            transform: translateX(-10px) rotate(-2deg);
          }
        }

        @keyframes smoke {
          0% {
            opacity: 0.6;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(20px) scale(1.5);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }

        .animate-car-move {
          animation: car-move 3s ease-in-out infinite;
        }

        .animate-smoke {
          animation: smoke 2s ease-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
