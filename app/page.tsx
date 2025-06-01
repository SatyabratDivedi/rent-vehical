import HoverButton from './components/HoverButton';
import How_Works from './components/How_Works';
import FeaturedVehicles from './components/FeaturedVehicles';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='container flex flex-col items-center m-auto my-10 px-5 space-y-5'>
        <h1 className='text-2xl lg:text-5xl font-bold text-[#428d42]'>Find any commercial vehicle</h1>
        <div className='lg:text-xl font-bold'>Search for pickup, autos, boloro, tractors and etc, near you – No hidden fees, just convenience.</div>
        <h2 className='text-sm'>Search nearby rentals instantly - No fees, no hassle</h2>
        <div className='space-x-3 flex'>
          <Link href={'/vehicles'}>
            <HoverButton radius={15} value={'Find a vehicle'} px={1} py={1} />
          </Link>
          <Link href={'/vehicle-listing'}>
            <HoverButton radius={15} value={'List your vehicle'} px={1} py={1} />
          </Link>
        </div>
      </div>

      <How_Works />
      <FeaturedVehicles />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}
