import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Packages = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const packages = [
    {
      id: 1,
      name: 'Wedding Bliss',
      category: 'wedding',
      price: 1200,
      originalPrice: 1500,
      features: ['8 hours coverage', '2 photographers', 'Online gallery', '50 edited photos', 'Engagement session', 'Wedding album'],
      duration: '8 hours',
      photos: '50+ edited',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      popular: true,
      photographer: 'Alice Johnson',
      location: 'New York, NY',
      rating: 4.9,
      reviewCount: 18
    },
    {
      id: 2,
      name: 'Portrait Pro',
      category: 'portrait',
      price: 300,
      originalPrice: 400,
      features: ['2 hours session', 'Professional editing', '20 edited photos', 'Online gallery', 'Print release', 'Location scouting'],
      duration: '2 hours',
      photos: '20+ edited',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      popular: false,
      photographer: 'Michael Chen',
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviewCount: 25
    },
    {
      id: 3,
      name: 'Event Coverage',
      category: 'event',
      price: 800,
      originalPrice: 1000,
      features: ['6 hours coverage', 'Professional editing', '100 edited photos', 'Online gallery', 'Same-day preview', 'Event highlights video'],
      duration: '6 hours',
      photos: '100+ edited',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
      popular: false,
      photographer: 'Sarah Williams',
      location: 'Chicago, IL',
      rating: 4.7,
      reviewCount: 32
    },
    {
      id: 4,
      name: 'Landscape Adventure',
      category: 'landscape',
      price: 200,
      originalPrice: 250,
      features: ['4 hours session', 'Multiple locations', '15 edited photos', 'Online gallery', 'Print release', 'Location guidance'],
      duration: '4 hours',
      photos: '15+ edited',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      popular: false,
      photographer: 'David Rodriguez',
      location: 'San Francisco, CA',
      rating: 4.6,
      reviewCount: 15
    },
    {
      id: 5,
      name: 'Commercial Elite',
      category: 'commercial',
      price: 1500,
      originalPrice: 2000,
      features: ['Full day coverage', 'Professional editing', 'Unlimited photos', 'Commercial rights', 'Brand consultation', 'Marketing materials'],
      duration: 'Full day',
      photos: 'Unlimited',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      popular: true,
      photographer: 'Emily Davis',
      location: 'Miami, FL',
      rating: 4.9,
      reviewCount: 12
    },
    {
      id: 6,
      name: 'Wedding Classic',
      category: 'wedding',
      price: 900,
      originalPrice: 1100,
      features: ['6 hours coverage', '1 photographer', 'Online gallery', '30 edited photos', 'Wedding album'],
      duration: '6 hours',
      photos: '30+ edited',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      popular: false,
      photographer: 'James Wilson',
      location: 'Boston, MA',
      rating: 4.8,
      reviewCount: 22
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'event', label: 'Event' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const filteredPackages = packages.filter(pkg => 
    selectedCategory === 'all' || pkg.category === selectedCategory
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Photography Packages</h1>
          <p className="text-gray-600">Choose the perfect package for your photography needs</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-4">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-48 object-cover"
                  />
                  {pkg.popular && (
                    <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    {pkg.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-500 mb-3">by {pkg.photographer} • {pkg.location}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-700">{pkg.rating}</span>
                      <span className="ml-1 text-gray-500">({pkg.reviewCount})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">${pkg.price}</div>
                      <div className="text-sm text-gray-500 line-through">${pkg.originalPrice}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {pkg.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {pkg.photos}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/booking?package=${pkg.id}`}
                      className="flex-1 bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Book Now
                    </Link>
                    <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Need a Custom Package?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Contact us to create a personalized photography package that fits your specific needs
          </p>
          <Link
            to="/contact"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Packages; 