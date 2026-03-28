import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Initialize Razorpay with both Vercel and local environment Support
const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY || process.env.RAZORPAY_KEY || 'rzp_live_SWYkjf5Rst1qAT',
  key_secret: process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'VRNFwP86dO5CdVT1Z4WbDJrK',
});

// Create Order API
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ error: 'Failed to create Razorpay order' });
    }

    res.json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: error.message || 'Error generating Razorpay order' });
  }
});

// Verify Payment API
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'VRNFwP86dO5CdVT1Z4WbDJrK';

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});

// For Vercel, we export the app instead of calling app.listen()
export default app;
