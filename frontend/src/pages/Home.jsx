'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { samplePhotographers } from '../data/sampleData';
import { Link } from 'react-router-dom';

const slideshowImages = [
  '/hero1.jpeg',
  '/hero2.jpg',
  '/hero3.jpg',
  '/hero4.jpg',
];

const cityImages = [
  { name: 'Hyderabad', img: '/city-hyderabad.jpeg' },
  { name: 'Bangalore', img: '/city-bangalore.jpeg' },
  { name: 'Mumbai', img: '/city-mumbai.jpeg' },
  { name: 'Chennai', img: '/city-chennai.jpeg' },
];

const howItWorksSteps = [
  { title: 'Search', desc: 'Find professional photographers near you.', img: '/search.png' },
  { title: 'Shoot', desc: 'Schedule your perfect shoot.', img: '/shoot.png' },
  { title: 'Book', desc: 'Book and receive confirmations.', img: '/book.png' },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-black">
      {/* Slideshow Section */}
      <div className="relative h-[90vh] overflow-hidden flex items-center justify-center">
        <motion.img
          key={slideshowImages[current]}
          src={slideshowImages[current]}
          alt="Slideshow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 flex flex-col items-center justify-center text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">Capture Your Moments with Lensly</h1>
          <p className="text-lg md:text-2xl text-white mb-8 drop-shadow">Book photographers for weddings, events, portraits, and more – anywhere in India!</p>
          <Link to="/photographers">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-full shadow-lg text-lg transition hover:bg-blue-600 hover:text-white border-2 border-blue-600"
            >
              Explore Photographers
            </motion.button>
          </Link>
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Featured Photographers */}
     {/* Popular Photographers */}
<section className="py-16 px-6 md:px-20 bg-gray-50 text-black">
  <motion.h2
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="text-4xl font-bold text-center mb-10"
  >
    Popular Photographers
  </motion.h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {samplePhotographers.slice(0, 3).map((photographer) => (
      <motion.div
        key={photographer.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
      >
        <img
          src={photographer.avatar}
          alt={photographer.name}
          className="w-full h-56 object-cover"
        />
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">{photographer.name}</h3>
            <div className="text-gray-600 text-sm mb-2">{photographer.location}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {photographer.categories.map((cat) => (
                <span
                  key={cat}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-2 text-sm">
              <span>⭐ {photographer.rating} ({photographer.reviewCount} reviews)</span>
              <span>|</span>
              <span>{photographer.experience} yrs exp</span>
            </div>
            <p className="text-gray-700 text-sm mb-4">{photographer.bio}</p>

            {/* Portfolio Images */}
            <div className="flex gap-2 overflow-x-auto">
              {photographer.portfolio?.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`portfolio-${idx}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Link
              to={`/photographers/${photographer.id}`}
              className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              View Profile
            </Link>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* Why Choose Lensly */}
      <section className="py-16 px-6 md:px-20 bg-white text-black">
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl font-bold text-center mb-10">Why Choose Lensly?</motion.h2>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <img src="/camera-icon.png" alt="Camera" className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Professional Quality</h3>
            <p>Book top-rated photographers with years of experience.</p>
          </div>
          <div>
            <img src="/camera-icon.png" alt="Trust" className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Trusted by Thousands</h3>
            <p>We’ve helped thousands find the right photographer.</p>
          </div>
          <div>
            <img src="/camera-icon.png" alt="Secure" className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Secure Booking</h3>
            <p>Our platform ensures easy and secure booking.</p>
          </div>
        </motion.div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 px-6 md:px-20 bg-white text-black">
        <h2 className="text-4xl font-bold text-center mb-10">Popular Cities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cityImages.map((city, index) => (
            <div key={index} className="rounded overflow-hidden shadow-md">
              <img src={city.img} alt={city.name} className="w-full h-40 object-cover" />
              <div className="p-2 text-center text-lg font-semibold">{city.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 md:px-20 bg-white text-black">
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl font-bold text-center mb-10">How It Works</motion.h2>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {howItWorksSteps.map((step, index) => (
            <div key={index}>
              <img src={step.img} alt={step.title} className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <img src="/camera-icon.png" alt="Lensly Logo" className="w-8 h-8" />
            Lensly
          </div>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-blue-400 transition">Instagram</a>
            <a href="#" className="hover:text-blue-400 transition">Facebook</a>
            <a href="#" className="hover:text-blue-400 transition">Twitter</a>
          </div>
          <div className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Lensly. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
