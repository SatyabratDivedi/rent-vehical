'use client';

import Link from 'next/link';
import React, { useState } from 'react';

// Contact form interface
interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

const ContactUsPage = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: 'Email Us',
      content: 'support@rentvehical.com',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
        </svg>
      ),
    },
    {
      title: 'Call Us',
      content: '+91 8318207464',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
        </svg>
      ),
    },
    {
      title: 'Visit Us',
      content: 'Gorakhpur, Uttar Pradesh, India',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      ),
    },
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'vehicle-listing', label: 'List My Vehicle' },
    { value: 'booking-support', label: 'Booking Support' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' },
  ];

  return (
    <div className=' py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header Section */}
        {/* <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-5xl font-bold text-[#428d42] dark:text-green-400 mb-4">
            Get in Touch
          </h1>          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions about our vehicle rental platform? We&apos;re here to help you find the perfect ride or list your vehicle.
          </p>
        </div> */}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16'>
          {/* Contact Information Cards */}
          <div className='lg:col-span-1 space-y-6'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Contact Information</h2>

            {contactInfo.map((info, index) => (
              <div key={index} className='group bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-[#428d42]/20 rounded-lg flex items-center justify-center text-[#428d42] dark:text-green-400'>{info.icon}</div>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{info.title}</h3>
                    <p className='text-gray-600 dark:text-gray-300'>{info.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className='bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>Quick Actions</h3>
              <div className='space-y-3'>
                <Link href='/vehicles' className='flex items-center text-[#428d42] dark:text-green-400 hover:underline'>
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  Browse Vehicles
                </Link>
                <Link href='/vehicle-listing' className='flex items-center text-[#428d42] dark:text-green-400 hover:underline'>
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                  </svg>
                  List Your Vehicle
                </Link>
                <Link href='/my-vehicles' className='flex items-center text-[#428d42] dark:text-green-400 hover:underline'>
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                  </svg>
                  My Vehicles
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Send us a Message</h2>

              {isSubmitted ? (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg className='w-8 h-8 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>Message Sent Successfully!</h3> <p className='text-gray-600 dark:text-gray-300 mb-6'>Thank you for contacting us. We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setIsSubmitted(false)} className='bg-[#428d42] hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors'>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-3'>
                  {error && (
                    <div className='p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg'>
                      <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
                    </div>
                  )}

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Full Name *</label>
                      <input type='text' name='name' value={formData.name} onChange={handleInputChange} className='w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent transition-colors' placeholder='Enter your full name' required />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Email Address *</label>
                      <input type='email' name='email' value={formData.email} onChange={handleInputChange} className='w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent transition-colors' placeholder='Enter your email address' required />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Phone Number</label>
                      <input type='tel' name='phone' value={formData.phone} onChange={handleInputChange} className='w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent transition-colors' placeholder='Enter your phone number' />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Inquiry Type</label>
                      <select name='inquiryType' value={formData.inquiryType} onChange={handleInputChange} className='w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent transition-colors'>
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Subject</label>
                    <input type='text' name='subject' value={formData.subject} onChange={handleInputChange} className='w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent transition-colors' placeholder='Enter the subject of your message' />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Message *</label>
                    <textarea name='message' value={formData.message} onChange={handleInputChange} rows={6} className='w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#428d42] focus:border-transparent transition-colors resize-none' placeholder='Enter your message here...' required />
                  </div>

                  <button type='submit' disabled={isSubmitting} className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#428d42] hover:bg-green-600 shadow-lg hover:shadow-xl'} text-white flex items-center justify-center gap-2`}>
                    {isSubmitting ? (
                      <>
                        <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default ContactUsPage;
