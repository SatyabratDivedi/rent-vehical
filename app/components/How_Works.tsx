import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    title: 'Search Vehicle',
    description: 'Select your preferred vehicle type and enter your location to find available options nearby',
    image: '/home/search-vehicle.png',
    bgColor: 'bg-green-50',
    numberBg: 'bg-green-500',
    textColor: 'text-gray-700',
  },
  {
    id: 2,
    title: 'Choose & Compare',
    description: 'Browse through available options and select the vehicle that best matches your needs and budget',
    image: '/home/selecting-vehicle.png',
    bgColor: 'bg-blue-50',
    numberBg: 'bg-blue-500',
    textColor: 'text-gray-700',
  },
  {
    id: 3,
    title: 'Connect & Rent',
    description: 'Contact the owner directly and arrange your rental - completely free of charge with instant booking',
    image: '/home/meet-image.png',
    bgColor: 'bg-yellow-400',
    numberBg: 'bg-yellow-400',
    textColor: 'text-gray-700',
  },
];

const How_Works: React.FC = () => {
  return (
    <section className='py-10 dark:bg-gray-900'>
      <div className='container mx-auto px-6'>
        {/* Simple Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
            How It Works
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Get your perfect vehicle in just three simple steps
          </p>
        </div>

        {/* Clean Steps Container */}
        <div className='grid md:grid-cols-3 gap-12 max-w-5xl mx-auto'>
          {steps.map((step, index) => (
            <div key={step.id} className='text-center space-y-6 relative'>
              
              {/* Simple Step Number */}
              <div className={`w-16 h-16 ${step.numberBg} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg`}>
                {step.id}
              </div>

              {/* Clean Image Container */}
              <div className='w-full h-48 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <Image
                  src={step.image}
                  alt={step.title}
                  width={200}
                  height={150}
                  className='w-full h-full object-contain'
                  priority={index === 0}
                />
              </div>

              {/* Simple Content */}
              <div className='space-y-3'>
                <h3 className='text-2xl font-bold text-gray-800 dark:text-white'>
                  {step.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {step.description}
                </p>
              </div>

              {/* Simple Arrow Connector */}
              {index < steps.length - 1 && (
                <div className='hidden md:block absolute top-8 -right-6 transform translate-x-full'>
                  <div className='w-12 h-0.5 bg-gray-300 dark:bg-gray-600'>
                    <div className='absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-300 dark:border-l-gray-600 border-t-2 border-b-2 border-t-transparent border-b-transparent'></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='text-center mt-16'>
          <h3 className='text-2xl font-semibold text-gray-800 dark:text-white mb-6'>
            Ready to find your perfect vehicle?
          </h3>
             <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href={'/vehicles'}>
                <button className='bg-[#428d42] w-full border-2 border-[#428d42] hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors'>Find a Vehicle</button>
              </Link>
              <Link href={'/vehicle-listing'}>
                <button className='border-2 w-full border-[#428d42] text-[#428d42] hover:bg-[#428d42] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all'>List Your Vehicle</button>
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
};

export default How_Works;
