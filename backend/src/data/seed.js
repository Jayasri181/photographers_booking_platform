require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Photographer = require('../models/photographer.model');
const Package = require('../models/package.model');
const Review = require('../models/review.model');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Photographer.deleteMany({});
  await Package.deleteMany({});
  await Review.deleteMany({});

  // Sample users
  const user = await User.create({ name: 'Test User', email: 'user@example.com', password: 'password123', role: 'user' });
  const photographerUser = await User.create({ name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'photographer' });

  // Sample photographer
  const photographer = await Photographer.create({
    user: photographerUser._id,
    bio: 'Award-winning wedding and portrait photographer.',
    location: 'New York, NY',
    experience: 8,
    portfolio: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    ],
    priceRange: '$500 - $1500',
    availability: [new Date('2024-06-20'), new Date('2024-06-22'), new Date('2024-06-25')],
    rating: 4.8,
    reviewCount: 32,
  });

  // Sample package
  const pkg = await Package.create({
    name: 'Wedding Bliss',
    category: 'wedding',
    price: 1200,
    originalPrice: 1500,
    features: ['8 hours coverage', '2 photographers', 'Online gallery', '50 edited photos'],
    duration: '8 hours',
    photos: '50+ edited',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    ],
    popular: true,
    photographer: photographerUser.name,
    location: 'New York, NY',
    rating: 4.9,
    reviewCount: 18,
  });

  // Sample review
  await Review.create({
    user: user._id,
    photographer: photographer._id,
    rating: 5,
    comment: 'Amazing experience! Highly recommend Alice for weddings.',
    createdAt: new Date('2024-06-01'),
  });

  console.log('Sample data seeded!');
  process.exit();
};

run(); 