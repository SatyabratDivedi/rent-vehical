import React from 'react';

const features = [
	{
		id: 1,
		title: 'No Hidden Charges',
		description: 'Transparent pricing with zero booking fees or commissions',
		icon: '💰',
	},
	{
		id: 2,
		title: 'Verified Owners',
		description: 'All vehicle owners are verified for your safety and trust',
		icon: '✓',
	},
	{
		id: 3,
		title: '24/7 Support',
		description: 'Round-the-clock customer support for all your needs',
		icon: '🕒',
	},
	{
		id: 4,
		title: 'Flexible Rentals',
		description: 'Rent by hour, day, week, or month - you choose',
		icon: '📅',
	},
	{
		id: 5,
		title: 'Insurance Coverage',
		description: 'All rentals come with basic insurance coverage',
		icon: '🛡️',
	},
	{
		id: 6,
		title: 'Easy Booking',
		description: 'Simple and quick booking process in just few clicks',
		icon: '📱',
	},
];

const Features = () => {
	return (
		<div className="container mx-auto py-16 px-5">
			<h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{features.map((feature) => (
					<div
						key={feature.id}
						className="group 
						bg-white/10 backdrop-blur-lg rounded-3xl p-6 
						border border-white/20 transition-all duration-300 
						shadow-2xl"
					>
						<div className="text-4xl mb-4">{feature.icon}</div>
						<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
						<p className="text-gray-500">{feature.description}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Features; 