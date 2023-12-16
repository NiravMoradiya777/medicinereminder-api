const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51OFmdkFfxqAxSPLIpmYjT6SQrMSljEIfGjgXuRQ7VdWZxctDQRCYvVGxP2iYPQdaU79GIsgOlIANyOJPVNVCekqt00UVVy8yl9');

const checkoutSession = async (req, res) => {
    const { amount, currency } = req.body;

  try {
    // Create a PaymentIntent on the server
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: currency || 'usd', // Default to USD if currency is not provided
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { checkoutSession };
