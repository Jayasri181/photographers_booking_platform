import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CameraIcon, 
  StarIcon, 
  ShieldCheckIcon,
  UserGroupIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Passionate about connecting talented photographers with clients who appreciate quality.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Technology',
      bio: 'Building innovative solutions to make photography booking seamless and enjoyable.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Operations',
      bio: 'Ensuring every booking experience is smooth and every client is satisfied.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
    }
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Passion for Quality',
      description: 'We believe every moment deserves to be captured beautifully.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Security',
      description: 'Your safety and satisfaction are our top priorities.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community First',
      description: 'Building connections between photographers and clients.'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'Continuously improving our platform to serve you better.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Photographers' },
    { number: '50,000+', label: 'Happy Clients' },
    { number: '100,000+', label: 'Sessions Booked' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Lensly
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
            Connecting talented photographers with clients who appreciate quality. 
            We're building the future of photography booking.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To democratize access to professional photography by creating a platform 
              that connects talented photographers with clients who value quality and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Empowering Photographers
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe that every photographer deserves the opportunity to showcase their talent 
                and build a successful business. Our platform provides the tools, exposure, and 
                support needed to thrive in the competitive photography industry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From emerging artists to established professionals, we're committed to helping 
                photographers reach new clients, manage their bookings efficiently, and focus on 
                what they do best - creating stunning images.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-purple-100 rounded-full mb-6">
                <CameraIcon className="h-16 w-16 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Professional Photography
              </h4>
              <p className="text-gray-600">
                Connecting you with verified, talented photographers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Lensly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lensly by the Numbers
            </h2>
            <p className="text-xl text-purple-100">
              Growing stronger every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-purple-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Lensly who are dedicated to making photography 
              booking better for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-purple-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Lensly was born from a simple observation: finding the right photographer 
                  for your special moments shouldn't be complicated. In 2023, our founder 
                  Sarah Johnson experienced firsthand the frustration of trying to book a 
                  photographer for her wedding.
                </p>
                <p>
                  After countless hours of research, phone calls, and uncertainty about 
                  availability and pricing, Sarah realized there had to be a better way. 
                  She envisioned a platform that would make the process transparent, 
                  efficient, and enjoyable for both photographers and clients.
                </p>
                <p>
                  Today, Lensly has grown into a trusted community of photographers and 
                  clients, helping thousands of people capture their precious moments 
                  with ease and confidence.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                  <StarIcon className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Trusted by Thousands
                </h3>
                <p className="text-gray-600 mb-6">
                  Join our growing community of satisfied photographers and clients.
                </p>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Join Lensly Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Whether you're a photographer looking to grow your business or a client 
            seeking the perfect photographer, Lensly is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join as Photographer
            </Link>
            <Link
              to="/photographers"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Find Photographers
            </Link>
        </div>
      </div>
      </section>
    </div>
  );
};

export default About; 