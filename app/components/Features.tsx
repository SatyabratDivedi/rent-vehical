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
		title: 'Easy Booking',
		description: 'Simple and quick booking process in just few clicks',
		icon: '📱',
	},
];

const Features = () => {
	return (
		<section className="py-12 sm:py-16 lg:py-20 dark:bg-gray-900">
			<div className="container mx-auto px-4 sm:px-6">
				{/* Mobile-Optimized Header */}
				<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
						Why Choose Us
					</h2>
					<p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
						Experience the difference with our premium vehicle rental service
					</p>
				</div>

				{/* Mobile-Optimized Features Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
					{features.map((feature) => (
						<div
							key={feature.id}
							className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
						>
							{/* Mobile-Optimized Icon */}
							<div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#428d42]/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 hover:bg-[#428d42]/20 transition-colors duration-300">
								<span className="text-xl sm:text-2xl">
									{feature.icon}
								</span>
							</div>
							
							{/* Mobile-Optimized Content */}
							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
								{feature.title}
							</h3>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>

				{/* Mobile-Optimized Bottom Text */}
				<div className="text-center mt-12 sm:mt-16">
					<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
						Trusted by thousands of customers across India
					</p>
				</div>
			</div>
		</section>
	);
};

export default Features; 