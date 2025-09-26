const Payment = require('./../models/Payments.model');
const razorpay = require('./../config/razorpay');

class OrderController {
  async createOrder(req, res) {
    try {
      const {
        amount,
        currency = 'INR',
        buyerId,
        sellerId,
        productId,
      } = req.body;

      if (!amount || !buyerId || !sellerId || !productId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const options = {
        amount: amount * 100, // amount in paise
        currency,
      };
      
      // Create Razorpay order
      const order = await razorpay.orders.create(options);

      // Save one payment document for this order
      const payment = new Payment({
        razorpayOrderId: order.id,
        amount,
        currency,
        status: 'created',
        buyerId,
        sellerId,
        productId,
      });
      await payment.save();

      res.json({ order, payment });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Error creating order' });
    }
  }
}

module.exports = new OrderController();
