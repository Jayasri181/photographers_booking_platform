import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/camera-icon.png"
            alt="Camera Icon"
            className="h-12 w-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Welcome to Lensly
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to book your perfect photographer
        </p>

        {/* Login Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Social Auth (Google only) */}
        <div className="flex justify-center mt-6">
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            Continue with Google
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
