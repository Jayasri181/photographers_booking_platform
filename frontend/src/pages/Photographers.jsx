import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { samplePhotographers } from '../data/sampleData';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CameraIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const allCategories = Array.from(new Set(samplePhotographers.flatMap(p => p.categories)));

export default function Photographers() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  let filtered = samplePhotographers.filter(p =>
    (!selectedCategory || p.categories.includes(selectedCategory)) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || 
     p.location.toLowerCase().includes(search.toLowerCase()) ||
     p.bio.toLowerCase().includes(search.toLowerCase()))
  );

  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === 'experience') filtered = [...filtered].sort((a, b) => b.experience - a.experience);
  if (sortBy === 'price') filtered = [...filtered].sort((a, b) => {
    const getMin = s => parseInt(s.replace(/[^0-9-]/g, '').split('-')[0] || '0', 10);
    return getMin(a.priceRange) - getMin(b.priceRange);
  });
  if (sortBy === 'bookings') filtered = [...filtered].sort((a, b) => b.totalBookings - a.totalBookings);

  const clearFilters = () => {
    setSelectedCategory('');
    setSortBy('');
    setSearch('');
  };

  const toggleFavorite = (id) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Top Professional Photographers
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Book the best photographers for your special moments. Explore portfolios, read reviews, and connect with trusted professionals for every occasion.
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">{samplePhotographers.length}+</div>
            <div className="text-gray-600">Photographers</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-gray-600">Cities</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
            <div className="text-gray-600">Avg Rating</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search photographers, locations, or styles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Sort By</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="bookings">Most Booked</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={clearFilters} 
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-purple-600">{filtered.length}</span> photographers
            {selectedCategory && ` in ${selectedCategory}`}
            {search && ` matching "${search}"`}
          </p>
        </div>

        {/* Add a test button above the grid for debugging */}
        <div style={{margin:'2rem 0'}}>
          <a href="#" className="test-view-profile-btn" style={{background:'linear-gradient(to right, #a855f7, #ec4899)', color:'#fff', padding:'1rem 2rem', borderRadius:'1rem', fontWeight:'bold', display:'inline-block', pointerEvents:'auto', opacity:1, boxShadow:'0 2px 8px #0002'}}>
            TEST: View Profile
          </a>
        </div>

        {/* Photographers Grid/List */}
        {filtered.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CameraIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No photographers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filtered.map((photographer, index) => (
              <motion.div
                key={photographer.id}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden relative group hover:shadow-2xl transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : 'flex flex-col'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Favorite Button */}
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={() => toggleFavorite(photographer.id)} 
                    className="focus:outline-none"
                  >
                    {favorites.includes(photographer.id) ? (
                      <FaHeart className="text-red-500 text-2xl transition-transform duration-200 scale-110" />
                    ) : (
                      <FaRegHeart className="text-gray-400 text-2xl group-hover:text-red-400 transition-colors duration-200" />
                    )}
                  </button>
                </div>

                {/* Featured Badge */}
                {photographer.featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  </div>
                )}

                {/* Avatar */}
                <div className="relative w-full flex flex-col items-center pt-6 pb-2 bg-gradient-to-br from-purple-50 to-pink-50">
                  <img 
                    src={photographer.avatar} 
                    alt={photographer.name} 
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg mb-2" 
                  />
                  <div className="flex gap-2 mt-2">
                    {photographer.portfolio.slice(0, 2).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Portfolio preview"
                        className="h-10 w-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>

                {/* Card Content */}
                <div className={`p-6 flex-1 flex flex-col ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{photographer.name}</h3>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{photographer.rating}</span>
                        <span className="text-sm text-gray-500">({photographer.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{photographer.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {photographer.categories.map((cat) => (
                        <span key={cat} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{photographer.bio}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">{photographer.experience}+ years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CameraIcon className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">{photographer.totalBookings} bookings</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-purple-600">{photographer.priceRange}</div>
                      <div className="text-sm text-gray-500">{photographer.responseTime} response</div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2" style={{ pointerEvents: 'auto', opacity: 1 }}>
                    <a 
                      href={`/photographers/${photographer.id}`}
                      className="force-view-profile-btn"
                      style={{background:'linear-gradient(to right, #a855f7, #ec4899)', color:'#fff', padding:'0.75rem 1.5rem', borderRadius:'0.75rem', fontWeight:'bold', display:'block', textAlign:'center', pointerEvents:'auto', opacity:1, boxShadow:'0 2px 8px #0002', marginRight:'0.5rem'}}
                    >
                      View Profile
                    </a>
                    <Link 
                      to={`/booking?photographer=${photographer.id}`} 
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
                      style={{ pointerEvents: 'auto', opacity: 1 }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
