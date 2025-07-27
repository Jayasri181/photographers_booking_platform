import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">Contact Us</h1>
        <p className="text-gray-600 mb-8 text-center">Have a question, feedback, or want to work with us? Fill out the form below and our team will get back to you soon.</p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                id="message"
                rows="4"
                required
                value={form.message}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              disabled={submitted}
            >
              {submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>

          {/* Company Info & Map */}
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Lensly HQ</h2>
              <p className="text-gray-600">123 Main Street<br />New York, NY 10001<br />United States</p>
              <p className="text-gray-600 mt-2">Email: <a href="mailto:support@lensly.com" className="text-purple-600">support@lensly.com</a></p>
              <p className="text-gray-600">Phone: <a href="tel:+1234567890" className="text-purple-600">+1 (234) 567-890</a></p>
            </div>
            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
              {/* Map Placeholder */}
              <span>Map will be here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 