'use client';

import React, { useState } from 'react';

const faqs = [
	{
		id: 1,
		question: 'How do I rent a vehicle?',
		answer: 'Simply search for your desired vehicle, select the dates, and connect with the owner. Once approved, you can proceed with the booking.',
	},
	{
		id: 2,
		question: 'What documents do I need?',
		answer: 'You\'ll need a valid driving license, identity proof, and address proof. Some vehicles may require additional documentation.',
	},
	{
		id: 3,
		question: 'Is insurance included?',
		answer: 'Basic insurance is included with all rentals. Additional coverage options are available for extra protection.',
	},
	{
		id: 4,
		question: 'What if I need to cancel?',
		answer: 'Free cancellation is available up to 24 hours before your booking. Terms may vary based on the vehicle owner.',
	},
	{
		id: 5,
		question: 'How is the security deposit handled?',
		answer: 'Security deposits are handled directly between you and the vehicle owner. The amount varies by vehicle type.',
	},
];

const FAQ = () => {
	const [openId, setOpenId] = useState<number | null>(null);

	return (
		<div className="container mx-auto py-16 px-5">
			<h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
			<div className="max-w-3xl mx-auto space-y-4">
				{faqs.map((faq) => (
					<div
						key={faq.id}
						className="group 
						bg-white/10 backdrop-blur-lg rounded-3xl 
						border border-white/20 transition-all duration-300 
						hover:shadow-2xl overflow-hidden"
					>
						<button
							className="w-full p-6 text-left flex justify-between items-center"
							onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
						>
							<span className="text-lg font-semibold">{faq.question}</span>
							<span className="transform transition-transform duration-300">
								{openId === faq.id ? '−' : '+'}
							</span>
						</button>
						<div
							className={`px-6 transition-all duration-300 ease-in-out overflow-hidden
                ${openId === faq.id ? 'max-h-48 pb-6' : 'max-h-0'}`}
						>
							<p className="text-gray-500">{faq.answer}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FAQ; 