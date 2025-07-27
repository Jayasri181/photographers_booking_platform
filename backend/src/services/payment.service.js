const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
  });
};
