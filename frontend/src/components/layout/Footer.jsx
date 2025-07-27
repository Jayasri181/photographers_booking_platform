import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Lensly Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Lensly</h2>
          <p className="text-gray-400">
            Book the best photographers in India for your special moments. We connect you to top-rated professionals with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/photographers" className="hover:text-white">Photographers</a></li>
            <li><a href="/packages" className="hover:text-white">Packages</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p>Email: support@lensly.in</p>
          <p>Phone: +91 9876543210</p>
          <p>Address: Hyderabad, Telangana</p>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-6 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Lensly. All rights reserved.
      </div>
    </footer>
  );
}
