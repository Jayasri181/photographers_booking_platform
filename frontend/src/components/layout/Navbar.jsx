import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md py-4 px-6 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <img
            src="/camera-icon.png"
            alt="Lensly Logo"
            className="w-8 h-8"
          />
          Lensly
        </Link>

        <div className="space-x-6">
          <Link
            to="/"
            className={`${
              location.pathname === "/" ? "text-blue-600" : "text-gray-700"
            } hover:text-blue-500 font-medium`}
          >
            Home
          </Link>
          <Link
            to="/photographers"
            className={`${
              location.pathname.startsWith("/photographers")
                ? "text-blue-600"
                : "text-gray-700"
            } hover:text-blue-500 font-medium`}
          >
            Photographers
          </Link>
          <Link
            to="/login"
            className={`${
              location.pathname === "/login" ? "text-blue-600" : "text-gray-700"
            } hover:text-blue-500 font-medium`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`${
              location.pathname === "/register" ? "text-blue-600" : "text-gray-700"
            } hover:text-blue-500 font-medium`}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
