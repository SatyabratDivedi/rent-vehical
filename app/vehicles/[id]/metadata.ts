import { Metadata } from 'next'

interface VehiclePageProps {
  params: { id: string }
}

// This function generates dynamic metadata for individual vehicle pages
export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  // TODO: Replace with actual vehicle data fetching
  // const vehicle = await getVehicleById(params.id)
  
  // Mock vehicle data for demonstration
  const vehicle = {
    id: params.id,
    title: 'Toyota Innova',
    type: 'Car',
    location: 'Mumbai',
    price: '₹2000/day',
    description: 'Comfortable 7-seater vehicle perfect for family trips',
    image: '/vehicle-placeholder.jpg'
  }

  const title = `Rent ${vehicle.title} in ${vehicle.location} - ₹${vehicle.price} | Rent Vehicle Platform`
  const description = `Rent ${vehicle.title} ${vehicle.type.toLowerCase()} in ${vehicle.location} starting from ${vehicle.price}. ${vehicle.description}. Book now for instant confirmation.`
  
  return {
    title,
    description,
    keywords: [
      `rent ${vehicle.title.toLowerCase()}`,
      `${vehicle.title.toLowerCase()} rental`,
      `${vehicle.type.toLowerCase()} rental ${vehicle.location.toLowerCase()}`,
      `hire ${vehicle.title.toLowerCase()}`,
      `book ${vehicle.title.toLowerCase()}`,
      `${vehicle.title.toLowerCase()} on rent`,
      `vehicle rental ${vehicle.location.toLowerCase()}`,
      `${vehicle.type.toLowerCase()} rental near me`,
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: vehicle.image,
          width: 800,
          height: 600,
          alt: `${vehicle.title} for rent in ${vehicle.location}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [vehicle.image],
    },
    alternates: {
      canonical: `https://www.rentvehical.com/vehicles/${params.id}`,
    },
  }
}

// Generate static params for popular vehicles (for build time optimization)
export async function generateStaticParams() {
  // TODO: Replace with actual popular vehicle IDs from your database
  // const popularVehicles = await getPopularVehicles()
  // return popularVehicles.map(vehicle => ({ id: vehicle.id }))
  
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}
