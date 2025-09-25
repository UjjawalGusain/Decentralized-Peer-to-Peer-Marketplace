const Payment = require('./../models/Payments.model');

class PaymentController {

  async createPayment(req, res) {
    try {
      const { razorpayOrderId, amount, currency, userId, productId } = req.body;

      if (!razorpayOrderId || !amount) {
        return res.status(400).json({ error: 'Order ID and amount are required' });
      }

      const payment = new Payment({
        razorpayOrderId,
        amount,
        currency: currency || 'INR',
        userId,
        productId,
        status: 'created',
      });

      await payment.save();

      res.status(201).json(payment);
    } catch (err) {
      console.error('Error creating payment:', err);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }


  // Update payment after capture or payment id received
  async updatePayment(req, res) {
    try {
      const { razorpayOrderId, razorpayPaymentId, status } = req.body;

      if (!razorpayOrderId) {
        return res.status(400).json({ error: 'Order ID is required' });
      }

      const payment = await Payment.findOne({ razorpayOrderId });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (razorpayPaymentId) payment.razorpayPaymentId = razorpayPaymentId;
      if (status) payment.status = status;

      await payment.save();

      res.json(payment);
    } catch (err) {
      console.error('Error updating payment:', err);
      res.status(500).json({ error: 'Failed to update payment' });
    }
  }


  // Get payment by Order ID
  async getPaymentByOrderId(req, res) {
    try {
      const { razorpayOrderId } = req.params;

      const payment = await Payment.findOne({ razorpayOrderId });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment);
    } catch (err) {
      console.error('Error fetching payment:', err);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  }


  // List payments (optional pagination)
  async listPayments(req, res) {
    try {
      const payments = await Payment.find()
        .sort({ createdAt: -1 })
        .limit(50); // limit to recent 50 payments

      res.json(payments);
    } catch (err) {
      console.error('Error listing payments:', err);
      res.status(500).json({ error: 'Failed to list payments' });
    }
  }

}

module.exports = new PaymentController();
