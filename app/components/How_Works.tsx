import React from 'react';

const steps = [
  {
    id: 1,
    title: 'Search Vehicle',
    description: 'Select your preferred vehicle type and enter your location to find available options nearby',
  },
  {
    id: 2,
    title: 'Choose Owner',
    description: 'Browse through available options and select the vehicle that best matches your needs',
  },
  {
    id: 3,
    title: 'Connect & Rent',
    description: 'Contact the owner directly and arrange your rental - completely free of charge',
  },
];

const How_Works: React.FC = () => {
  return (
    <div>
      <div className='text-2xl pt-20 flex justify-center font-'>How it works</div>
      <div className='flex flex-col md:flex-row justify-center items-center gap-6 p-10 '>
        {steps.map((step, i) => (
          <div key={i} className='relative hover:z-50 group w-72 h-96 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col justify-between border border-white/20 transition-all '>
            <div
              key={step.id}
              className='w-full  p-6 rounded-2xl
            transition-all duration-100 ease-in-out 
            transform'
            >
              <div
                className='flex justify-center items-center w-16 h-16 bg-blue-600 
            text-white text-2xl font-bold rounded-full mx-auto mb-4 
             '
              >
                {step.id}
              </div>
              <h3
                className='text-xl font-bold text-center mb-2 
            '
              >
                {step.title}
              </h3>
              <p className='text-gray-500 text-center mt-2 '>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default How_Works;
