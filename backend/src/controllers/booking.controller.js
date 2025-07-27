// const { validationResult } = require('express-validator');
const Booking = require('../models/booking.model');
const Photographer = require('../models/photographer.model');
const User = require('../models/user.model');
const { sendBookingConfirmationEmail } = require('../services/email.service');

exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      photographerId,
      date,
      startTime,
      endTime,
      duration,
      location,
      serviceType,
      description,
      totalAmount,
      specialRequirements,
      equipment,
      numberOfPeople
    } = req.body;

    // Check if photographer exists and is active
    const photographer = await Photographer.findById(photographerId);
    if (!photographer || !photographer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found or inactive'
      });
    }

    // Check if the requested time slot is available
    const existingBooking = await Booking.findOne({
      photographerId,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const booking = await Booking.create({
      clientId: req.user.id,
      photographerId,
      date: new Date(date),
      startTime,
      endTime,
      duration,
      location,
      serviceType,
      description,
      totalAmount,
      specialRequirements,
      equipment,
      numberOfPeople
    });

    // Populate photographer info for email
    await booking.populate('photographerId', 'userId');
    await booking.populate('photographerId.userId', 'name email');

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(booking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { clientId: req.user.id };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('photographerId', 'userId')
      .populate('photographerId.userId', 'name email profileImage')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

exports.getPhotographerBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Get photographer profile
    const photographer = await Photographer.findOne({ userId: req.user.id });
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer profile not found'
      });
    }

    const filter = { photographerId: photographer._id };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('clientId', 'name email profileImage')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    console.error('Get photographer bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('clientId', 'name email profileImage')
      .populate('photographerId', 'userId')
      .populate('photographerId.userId', 'name email profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    if (req.user.role !== 'admin' && 
        booking.clientId._id.toString() !== req.user.id && 
        booking.photographerId.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission to update this booking
    if (req.user.role !== 'admin' && 
        booking.clientId.toString() !== req.user.id && 
        booking.photographerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update fields
    if (status) booking.status = status;
    if (cancellationReason) booking.cancellationReason = cancellationReason;

    await booking.save();

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission to cancel this booking
    if (req.user.role !== 'admin' && 
        booking.clientId.toString() !== req.user.id && 
        booking.photographerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled (less than 24 hours before)'
      });
    }

    booking.status = 'cancelled';
    if (cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the photographer for this booking
    const photographer = await Photographer.findOne({ userId: req.user.id });
    if (!photographer || booking.photographerId.toString() !== photographer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in pending status'
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming booking'
    });
  }
};

exports.completeBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the photographer for this booking
    const photographer = await Photographer.findOne({ userId: req.user.id });
    if (!photographer || booking.photographerId.toString() !== photographer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in confirmed status'
      });
    }

    booking.status = 'completed';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking completed successfully',
      booking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing booking'
    });
  }
};

exports.getPhotographerAvailability = async (req, res) => {
  try {
    const { photographerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });

    // Get photographer's availability for this day
    const photographer = await Photographer.findById(photographerId);
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }

    const dayAvailability = photographer.availability.find(avail => avail.day === dayOfWeek);
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return res.json({
        success: true,
        available: false,
        message: 'Not available on this day'
      });
    }

    // Get existing bookings for this date
    const existingBookings = await Booking.find({
      photographerId,
      date: requestedDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    res.json({
      success: true,
      available: true,
      dayAvailability,
      existingBookings: existingBookings.map(booking => ({
        startTime: booking.startTime,
        endTime: booking.endTime
      }))
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availability'
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('clientId', 'name email')
      .populate('photographerId', 'userId')
      .populate('photographerId.userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

exports.adminUpdateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Admin update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status'
    });
  }
}; 