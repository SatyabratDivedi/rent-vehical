import Image from 'next/image';
import React from 'react';
import HoverButton from './HoverButton';

const vehicles = [
	{
		id: 1,
		name: 'Pickup Truck',
		price: '₹2000/day',
		image: '/pickup.jpg',
		category: 'Commercial',
	},
	{
		id: 2,
		name: 'Auto Rickshaw',
		price: '₹800/day',
		image: '/auto.jpg',
		category: 'Three Wheeler',
	},
	{
		id: 3,
		name: 'Tractor',
		price: '₹1500/day',
		image: '/tractor.jpg',
		category: 'Agricultural',
	},
	{
		id: 4,
		name: 'Bolero',
		price: '₹1800/day',
		image: '/bolero.jpg',
		category: 'Utility',
	},
];

const FeaturedVehicles = () => {
	return (
		<div className="container mx-auto py-16 px-5">
			<h2 className="text-3xl font-bold text-center mb-12">Featured Vehicles</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{vehicles.map((vehicle) => (
					<div
						key={vehicle.id}
						className="group relative 
						bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg 
						border border-white/20 transition-all duration-300 
						hover:shadow-2xl overflow-hidden"
					>
						<div className="aspect-square relative">
							<div className="w-full h-full bg-gray-200 animate-pulse"></div>
						</div>
						<div className="p-6 space-y-3">
							<span className="text-sm text-secondary">{vehicle.category}</span>
							<h3 className="text-xl font-bold">{vehicle.name}</h3>
							<p className="text-2xl font-semibold text-primary">{vehicle.price}</p>
							<div className="pt-4">
								<HoverButton
									radius={10}
									value="Book Now"
									px={2}
									py={0.5}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FeaturedVehicles; 