const paymentService = require('../services/payment.service');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent({ amount, currency, metadata });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment intent', error: err.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Update booking payment status
    const booking = await Booking.findById(paymentIntent.metadata.bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.paymentStatus = 'paid';
    booking.paymentIntentId = paymentIntentId;
    await booking.save();

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment'
    });
  }
};

exports.processRefund = async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body;

    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission (admin or photographer)
    if (req.user.role !== 'admin' && 
        booking.photographerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'No payment to refund'
      });
    }

    // Process refund through Stripe
    const refundAmount = amount || booking.totalAmount;
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: reason || 'requested_by_customer'
    });

    // Update booking status
    booking.paymentStatus = 'refunded';
    booking.refundAmount = refundAmount;
    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund'
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    // Filter based on user role
    if (req.user.role === 'client') {
      filter.clientId = req.user.id;
    } else if (req.user.role === 'photographer') {
      const photographer = await Photographer.findOne({ userId: req.user.id });
      if (photographer) {
        filter.photographerId = photographer._id;
      }
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
      payments: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPayments: total
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await handleRefundProcessed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

const handlePaymentSucceeded = async (paymentIntent) => {
  try {
    const booking = await Booking.findById(paymentIntent.metadata.bookingId);
    if (booking) {
      booking.paymentStatus = 'paid';
      booking.paymentIntentId = paymentIntent.id;
      await booking.save();
      console.log(`Payment succeeded for booking: ${booking._id}`);
    }
  } catch (error) {
    console.error('Handle payment succeeded error:', error);
  }
};

const handlePaymentFailed = async (paymentIntent) => {
  try {
    const booking = await Booking.findById(paymentIntent.metadata.bookingId);
    if (booking) {
      booking.paymentStatus = 'pending';
      await booking.save();
      console.log(`Payment failed for booking: ${booking._id}`);
    }
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
};

const handleRefundProcessed = async (charge) => {
  try {
    const booking = await Booking.findOne({ paymentIntentId: charge.payment_intent });
    if (booking) {
      booking.paymentStatus = 'refunded';
      booking.refundAmount = charge.amount_refunded / 100;
      await booking.save();
      console.log(`Refund processed for booking: ${booking._id}`);
    }
  } catch (error) {
    console.error('Handle refund processed error:', error);
  }
}; 