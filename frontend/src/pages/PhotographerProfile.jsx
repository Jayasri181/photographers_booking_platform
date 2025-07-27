import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { samplePhotographers, sampleReviews } from '../data/sampleData';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  ClockIcon, 
  StarIcon, 
  CameraIcon,
  TrophyIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const PhotographerProfile = () => {
  const { id } = useParams();
  const photographer = samplePhotographers.find((p) => p.id === id);
  const reviews = sampleReviews.filter((r) => r.photographer === photographer?.name);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!photographer) {
    return <div className="pt-24 text-center">Photographer not found.</div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="relative">
              <img
                src={photographer.avatar}
                alt={photographer.name}
                className="w-40 h-40 rounded-2xl object-cover border-4 border-purple-200"
              />
              {photographer.featured && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Featured
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-gray-900">{photographer.name}</h1>
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-yellow-700 font-bold">{photographer.rating}</span>
                  <span className="text-yellow-600">({photographer.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-purple-600 font-semibold mb-3">
                <MapPinIcon className="h-5 w-5" />
                {photographer.location}
              </div>
              
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">{photographer.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{photographer.experience}+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{photographer.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{photographer.responseTime}</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{photographer.priceRange}</div>
                  <div className="text-sm text-gray-600">Price Range</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {photographer.categories.map((category, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>

              <Link
                to={`/booking?photographer=${photographer.id}`}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
              >
                <CameraIcon className="h-5 w-5" />
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CameraIcon className="h-8 w-8 text-purple-600" />
            Portfolio Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photographer.portfolio.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`Portfolio ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-2">
                      <CameraIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Photographer Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Equipment & Awards */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CameraIcon className="h-6 w-6 text-purple-600" />
              Equipment & Awards
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Professional Equipment</h4>
                <div className="space-y-2">
                  {photographer.equipment.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-500" />
                  Awards & Recognition
                </h4>
                <div className="space-y-2">
                  {photographer.awards.map((award, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <TrophyIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-700">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Languages & Availability */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <GlobeAltIcon className="h-6 w-6 text-purple-600" />
              Languages & Availability
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Languages Spoken</h4>
                <div className="flex flex-wrap gap-2">
                  {photographer.languages.map((language, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-purple-500" />
                  Available Dates
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {photographer.availability.map((date, idx) => (
                    <div key={idx} className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm text-center">
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <StarIcon className="h-8 w-8 text-yellow-500" />
            Client Reviews
          </h2>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this photographer!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div 
                  key={review.id} 
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 font-semibold">{review.user}</span>
                    <span className="text-gray-400 text-sm">{review.createdAt}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Portfolio"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotographerProfile; 