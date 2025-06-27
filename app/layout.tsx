import type { Metadata } from 'next';
import { Fira_Code, Space_Mono, Sue_Ellen_Francisco } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Providers } from './providers';
import Navbar from './components/Navbar';
import { Toaster } from 'sonner';
import { ReduxProvider } from './providers/ReduxProvider';
import AuthCheck from './components/AuthCheck';
import 'react-loading-skeleton/dist/skeleton.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import NavigationSection from './components/NavigationSection';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space',
});

const sueEllenFrancisco = Sue_Ellen_Francisco({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sue',
});

export const metadata: Metadata = {
  title: 'Rent Vehicle Online | Book Cars, Trucks, Tractors & Auto Near Me | Vehicle Rental Platform',
  description: 'Rent vehicles online - cars, trucks, tractors, bolero, auto rickshaw near you. Book vehicle rentals with instant booking, competitive prices. Find vehicle rental near me for all your transportation needs.',
  keywords: [
    'rent vehicle',
    'book vehicle',
    'vehicle near me',
    'auto near me',
    'tractor near me',
    'truck near me',
    'bolero near me',
    'car rental',
    'vehicle rental',
    'rent car online',
    'book truck',
    'hire vehicle',
    'vehicle booking',
    'auto rickshaw rental',
    'commercial vehicle rental',
    'self drive cars',
    'vehicle on rent',
    'cab booking',
    'tempo rental',
    'mini truck rental',
    'mahindra bolero rental',
    'pickup truck rental',
    'goods vehicle rental',
    'transport vehicle hire',
    'daily car rental',
    'monthly vehicle rental',
    'weekly car booking',
    'commercial vehicle booking',
    'delivery truck rental',
    'logistics vehicle rental',
    'construction vehicle hire',
    'farm tractor rental',
    'agricultural vehicle rental',
    'heavy vehicle rental',
    'light commercial vehicle',
    'passenger vehicle rental',
    'utility vehicle rental',
    'fleet vehicle rental',
    'corporate vehicle booking',
    'event vehicle rental',
    'wedding car rental',
  ],
  authors: [{ name: 'Rent Vehicle Platform' }],
  creator: 'Rent Vehicle Platform',
  publisher: 'Rent Vehicle Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.rentvehical.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rent Vehicle Online | Book Cars, Trucks, Tractors & Auto Near Me',
    description: 'Rent vehicles online - cars, trucks, tractors, bolero, auto rickshaw near you. Book vehicle rentals with instant booking and competitive prices.',
    url: 'https://www.rentvehical.com',
    siteName: 'Rent Vehicle Platform',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rent Vehicle - Book Cars, Trucks, Tractors Online',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rent Vehicle Online | Book Cars, Trucks, Tractors Near Me',
    description: 'Rent vehicles online - cars, trucks, tractors, bolero, auto rickshaw near you. Instant booking with competitive prices.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'FlZilU8Lt7Vy0V_YT3M-HgNHdRfUQH995G12lTvLe4s',
    yandex: 'd8e94aadd202e0f3',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.rentvehical.com/#localbusiness',
        name: 'Rent Vehicle Platform',
        description: 'Online vehicle rental platform for cars, trucks, tractors, auto rickshaw, bolero and commercial vehicles',
        url: 'https://www.rentvehical.com',
        logo: 'https://www.rentvehical.com/logo-min.png',
        image: 'https://www.rentvehical.com/og-image.jpg',
        telephone: '+91-XXXXXXXXXX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Your Street Address',
          addressLocality: 'Your City',
          addressRegion: 'Your State',
          postalCode: 'Your PIN',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 'Your Latitude',
          longitude: 'Your Longitude',
        },
        openingHours: 'Mo-Su 00:00-23:59',
        priceRange: '₹₹',
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 'Your Latitude',
            longitude: 'Your Longitude',
          },
          geoRadius: '50000',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Vehicle Rental Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Car Rental',
                description: 'Rent cars for personal and business use',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Truck Rental',
                description: 'Commercial truck rental for transportation',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Tractor Rental',
                description: 'Agricultural tractor rental services',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Auto Rickshaw Rental',
                description: 'Three-wheeler auto rickshaw rental',
              },
            },
          ],
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          reviewCount: '150',
        },
        sameAs: ['https://www.facebook.com/rentvehicle', 'https://www.instagram.com/rentvehicle', 'https://www.twitter.com/rentvehicle'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.rentvehical.com/#website',
        url: 'https://www.rentvehical.com',
        name: 'Rent Vehicle Platform',
        description: 'Online vehicle rental platform for cars, trucks, tractors, auto rickshaw, bolero and commercial vehicles',
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://www.rentvehical.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
        inLanguage: 'en-US',
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.rentvehical.com/#organization',
        name: 'Rent Vehicle Platform',
        url: 'https://www.rentvehical.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.rentvehical.com/logo-min.png',
          width: 512,
          height: 512,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-XXXXXXXXXX',
          contactType: 'customer service',
          availableLanguage: ['English', 'Hindi'],
        },
        sameAs: ['https://www.facebook.com/rentvehicle', 'https://www.instagram.com/rentvehicle', 'https://www.twitter.com/rentvehicle'],
      },
      {
        '@type': 'Service',
        '@id': 'https://www.rentvehical.com/#service',
        name: 'Vehicle Rental Services',
        description: 'Comprehensive vehicle rental services including cars, trucks, tractors, auto rickshaw, and commercial vehicles',
        provider: {
          '@id': 'https://www.rentvehical.com/#organization',
        },
        serviceType: 'Vehicle Rental',
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Vehicle Types',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Car Rental',
                category: 'Passenger Vehicles',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Truck Rental',
                category: 'Commercial Vehicles',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Tractor Rental',
                category: 'Agricultural Vehicles',
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <Script async src='https://www.googletagmanager.com/gtag/js?id=G-9G9YWGTTE8' />
        <Script id='google-analytics'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9G9YWGTTE8');
          `}
        </Script>

        

        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <meta name='google-site-verification' content='FlZilU8Lt7Vy0V_YT3M-HgNHdRfUQH995G12lTvLe4s' />
        <meta name='yandex-verification' content='d8e94aadd202e0f3' />
        <meta name='msvalidate.01' content='53129DA3A280B6C17378E7B8B6D2D35F' />
        <link rel='canonical' href='https://www.rentvehical.com' />

        {/* Additional SEO Meta Tags */}
        <meta name='theme-color' content='#2563eb' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Rent Vehicle' />
        <meta name='mobile-web-app-capable' content='yes' />

        {/* Preconnect to external domains for performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link rel='preconnect' href='https://maps.googleapis.com' />
        <link rel='preconnect' href='https://www.google-analytics.com' />

        {/* DNS Prefetch for better loading */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link rel='dns-prefetch' href='//fonts.gstatic.com' />
        <link rel='dns-prefetch' href='//maps.googleapis.com' />

        {/* Favicon and App Icons */}
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <meta property="og:image" content="/favicon.ico" />
        <link rel='icon' href='/icon.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />

        {/* Alternative formats */}
        <link rel='alternate' type='application/rss+xml' title='Rent Vehicle RSS Feed' href='/rss.xml' />

        {/* Geographic targeting */}
        <meta name='geo.region' content='IN' />
        <meta name='geo.country' content='India' />
        <meta name='ICBM' content='Your Latitude, Your Longitude' />

        {/* Business specific meta tags */}
        <meta name='rating' content='general' />
        <meta name='distribution' content='global' />
        <meta name='revisit-after' content='7 days' />
        <meta name='expires' content='never' />
        <meta name='language' content='English' />
        <meta name='coverage' content='Worldwide' />
        <meta name='target' content='all' />
        <meta name='HandheldFriendly' content='True' />
        <meta name='MobileOptimized' content='320' />
      </head>
      <body className={`${firaCode.variable} ${spaceMono.variable} ${sueEllenFrancisco.variable} antialiased`}>
        <ReduxProvider>
          <AuthCheck>
            <NavigationSection/>
            <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
              <Toaster richColors />
              <Providers>{children}</Providers>
            </ThemeProvider>
          </AuthCheck>
          <SpeedInsights />
        </ReduxProvider>
      </body>
    </html>
  );
}
