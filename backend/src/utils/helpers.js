import crypto from 'crypto';

// Generate a random string
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format error messages
export const formatError = (error) => {
  if (error.name === 'SequelizeValidationError') {
    return {
      message: 'Validation error',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message
      }))
    };
  }
  return {
    message: error.message || 'Internal server error'
  };
};

// Calculate booking price
export const calculateBookingPrice = (duration, basePrice, extras = []) => {
  let total = duration * basePrice;
  
  // Add extra services
  extras.forEach(extra => {
    total += extra.price;
  });
  
  return total;
};

// Format date for consistent usage
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

// Validate time slot availability
export const isTimeSlotAvailable = (requestedSlot, existingBookings) => {
  const requested = new Date(requestedSlot);
  
  return !existingBookings.some(booking => {
    const bookingTime = new Date(booking.date);
    const hourDiff = Math.abs(requested - bookingTime) / 36e5; // Convert to hours
    return hourDiff < 2; // Consider 2-hour buffer between bookings
  });
};

// Generate a booking reference number
export const generateBookingReference = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `BK-${timestamp}-${randomStr}`.toUpperCase();
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
