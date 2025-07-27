const express = require('express');
const authRoutes = require('./auth.routes');
const photographerRoutes = require('./photographer.routes');
const packageRoutes = require('./package.routes');
const reviewRoutes = require('./review.routes');
const bookingRoutes = require('./booking.routes');
const paymentRoutes = require('./payment.routes');
const uploadRoutes = require('./upload.routes');
const adminRoutes = require('./admin.routes');
const photographerSelfRoutes = require('./photographer-self.routes');

module.exports = () => {
  const router = express.Router();
  router.use('/auth', authRoutes);
  router.use('/photographers', photographerRoutes);
  router.use('/packages', packageRoutes);
  router.use('/reviews', reviewRoutes);
  router.use('/bookings', bookingRoutes);
  router.use('/payments', paymentRoutes);
  router.use('/upload', uploadRoutes);
  router.use('/admin', adminRoutes);
  router.use('/photographer-self', photographerSelfRoutes);
  return router;
}; 