import React, { useState } from 'react';
import { samplePackages } from '../data/sampleData';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  CameraIcon,
  CreditCardIcon,
  CheckCircleIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const Booking = () => {
  const [form, setForm] = useState({
    package: '',
    date: '',
    time: '',
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would call backend API for booking and payment
  };

  const selectedPackage = samplePackages.find((pkg) => pkg.id === form.package);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background Image */}
      <div className="absolute left-0 top-0 w-1/3 h-1/2 opacity-20 z-0">
        <img
          src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&h=600&fit=crop"
          alt="Decorative"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl z-10 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {submitted ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-700 mb-6 text-lg">Thank you for your booking. We will contact you soon with more details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center flex items-center justify-center gap-2">
              <CameraIcon className="h-8 w-8 text-pink-500" />
              Book a Photography Session
            </h2>
            {/* Package Selection with Card Preview */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <GiftIcon className="h-5 w-5 text-purple-500" />
                Select Package
              </label>
              <div className="flex gap-4">
                <select
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                >
                  <option value="">Choose a package</option>
                  {samplePackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} (${pkg.price})
                    </option>
                  ))}
                </select>
                {selectedPackage && (
                  <div className="hidden md:block bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow p-4 w-56 flex-shrink-0">
                    <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                    <div className="font-bold text-purple-700 mb-1">{selectedPackage.name}</div>
                    <div className="text-gray-600 text-sm mb-2">{selectedPackage.duration} | {selectedPackage.photos}</div>
                    <ul className="text-xs text-gray-500 list-disc pl-4 mb-2">
                      {selectedPackage.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                    <div className="text-lg font-bold text-pink-600">${selectedPackage.price}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-purple-500" />
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <CalendarDaysIcon className="h-5 w-5 text-purple-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-purple-500" />
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <ClockIcon className="h-5 w-5 text-purple-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-500" />
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <UserIcon className="h-5 w-5 text-purple-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-purple-500" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <EnvelopeIcon className="h-5 w-5 text-purple-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Payment section would go here (Stripe integration) */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-pink-600 hover:to-purple-600 hover:scale-105 shadow-md hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2"
            >
              <CreditCardIcon className="h-6 w-6 text-white" />
              Book & Pay
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Booking; 