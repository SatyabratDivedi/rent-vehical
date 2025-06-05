import HoverButton from './components/HoverButton';
import How_Works from './components/How_Works';
import FeaturedVehicles from './components/FeaturedVehicles';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import NavigationSection from './components/NavigationSection';

export const metadata: Metadata = {
  title: 'Rent Vehicle Online | Book Cars, Trucks, Tractors & Auto Near Me | Vehicle Rental Platform',
  description: 'Find and rent vehicles near you - cars, trucks, tractors, bolero, auto rickshaw, commercial vehicles. Instant booking, verified owners, competitive prices. No hidden fees, just convenience.',
  alternates: {
    canonical: 'https://www.rentvehical.com',
  },
};

export default function Home() {
  return (
    <>
      {/* Simple Zen Hero Section */}
      <div className='container mx-auto my-8 lg:my-20 px-6'>
        <div className='text-center space-y-8 max-w-4xl mx-auto'>
          {/* Clean Main Heading */}
          <h1 className='text-2xl lg:text-6xl font-bold text-[#428d42] dark:text-green-400 leading-tight'>Find any commercial vehicle</h1>

          {/* Simple Subtitle */}
          <p className='text-base lg:text-2xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed'>Search for pickup, autos, bolero, tractors and more, near you – No hidden fees, just convenience.</p>

          {/* Clean Tagline */}
          <p className='text-sm text-gray-500 dark:text-gray-400'>Search nearby rentals instantly - No fees, no hassle</p>

          <div className='text-center mt-16'>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href={'/vehicles'}>
                <button className='bg-[#428d42] w-full border-2 border-[#428d42] hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors'>Find a Vehicle</button>
              </Link>
              <Link href={'/vehicle-listing'}>
                <button className='border-2 w-full border-[#428d42] text-[#428d42] hover:bg-[#428d42] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all'>List Your Vehicle</button>
              </Link>
            </div>
          </div>

          {/* Simple Stats */}
          <div className='flex justify-center gap-12 mt-16 pt-8 border-t border-gray-200 dark:border-gray-700'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-[#428d42]'>100+</div>
              <div className='text-sm text-gray-500'>Vehicles</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-[#428d42]'>1</div>
              <div className='text-sm text-gray-500'>City</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-[#428d42]'>24/7</div>
              <div className='text-sm text-gray-500'>Support</div>
            </div>
          </div>
        </div>
      </div>
      <How_Works />
      {/* <FeaturedVehicles /> */}
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}
