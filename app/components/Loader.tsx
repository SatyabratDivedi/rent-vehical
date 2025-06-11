'use client';

import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
      <div className='h-[80vh] w-screen flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50'>
        <div className='relative w-12 h-12 md:w-16 md:h-16'>
          {/* Outer spinner */}
          <div className='absolute inset-0 rounded-full border-4 border-secondary/30 border-t-secondary animate-spin'></div>
          <div className='absolute inset-2 rounded-full border-4 border-primary/30 border-b-primary animate-spin' style={{ animationDirection: 'reverse' }}></div>
        </div>

        {/* Message */}
        <p className='mt-6 text-foreground font-medium'>{message}</p>
      </div>
  );
};

export default Loader;
