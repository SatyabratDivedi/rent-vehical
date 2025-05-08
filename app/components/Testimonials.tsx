'use client';

import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    location: 'Mumbai',
    comment: 'Found a perfect pickup truck for my business move. The process was smooth and the owner was very helpful.',
    rating: 5,
    vehicle: 'Pickup Truck',
  },
  {
    id: 2,
    name: 'Priya Patel',
    location: 'Delhi',
    comment: 'Rented an auto for my small business. Great platform with transparent pricing!',
    rating: 5,
    vehicle: 'Auto Rickshaw',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    location: 'Bangalore',
    comment: 'The tractor I rented was in perfect condition. Will definitely use this service again.',
    rating: 4,
    vehicle: 'Tractor',
  },
];

const Testimonials = () => {
  return (
    <div className="container mx-auto py-16 px-5 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="group 
						bg-white/10 backdrop-blur-lg rounded-3xl p-6 
						border border-white/20 transition-all duration-300 
						hover:shadow-2xl"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {testimonial.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="font-bold">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="mb-4">
              {'★'.repeat(testimonial.rating)}
              {'☆'.repeat(5 - testimonial.rating)}
            </div>
            <p className="text-gray-500 mb-2">{testimonial.comment}</p>
            <p className="text-sm text-secondary">Vehicle: {testimonial.vehicle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials; 