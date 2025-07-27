import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Photographers from './pages/Photographers';
import PhotographerProfile from './pages/PhotographerProfile';
import Packages from './pages/Packages';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20"> {/* Padding to prevent overlap with fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photographers" element={<Photographers />} />
          <Route path="/photographers/:id" element={<PhotographerProfile />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
