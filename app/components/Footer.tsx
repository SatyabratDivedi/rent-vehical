import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-lg border-t border-white/20">
      <div className="container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Rent Vehicle</h3>
            <p className="text-gray-500">
              Find and rent the perfect vehicle for your needs. No hidden fees, just convenience.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-500 hover:text-primary">About Us</Link></li>
              <li><Link href="/vehicles" className="text-gray-500 hover:text-primary">Browse Vehicles</Link></li>
              <li><Link href="/list-vehicle" className="text-gray-500 hover:text-primary">List Your Vehicle</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Vehicle Types</h3>
            <ul className="space-y-2">
              <li><Link href="/vehicles/pickup" className="text-gray-500 hover:text-primary">Pickup Trucks</Link></li>
              <li><Link href="/vehicles/auto" className="text-gray-500 hover:text-primary">Auto Rickshaws</Link></li>
              <li><Link href="/vehicles/tractor" className="text-gray-500 hover:text-primary">Tractors</Link></li>
              <li><Link href="/vehicles/utility" className="text-gray-500 hover:text-primary">Utility Vehicles</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-500">
              <li>📞 +91 1234567890</li>
              <li>📧 support@rentvehicle.com</li>
              <li>📍 123 Main Street, Mumbai</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Rent Vehicle. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-primary text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-primary text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 