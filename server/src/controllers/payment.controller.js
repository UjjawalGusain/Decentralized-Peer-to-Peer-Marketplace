const crypto = require('crypto');
const Payment = require('./../models/Payments.model');
const User = require('./../models/Users.models');

class PaymentController {
  async addPayment(req, res) {
    try {
      const {
        razorpayOrderId,
        amount,
        currency = 'INR',
        userId,
        productId,
        sellerId,
      } = req.body;
      if (!razorpayOrderId || !amount || !userId || !productId || !sellerId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const existing = await Payment.findOne({ razorpayOrderId });
      if (existing)
        return res.status(409).json({ error: 'Payment already exists' });

      const payment = new Payment({
        razorpayOrderId,
        amount,
        currency,
        status: 'escrowed', // Funds held in escrow
        userId,
        productId,
        sellerId,
        escrowHeldAt: new Date(),
      });

      await payment.save();
      res.status(201).json(payment);
    } catch (err) {
      console.error('Error adding payment:', err);
      res.status(500).json({ error: 'Failed to add payment' });
    }
  }

  // Verify payment signature for frontend/webhook validation
  verifyPayment(req, res) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      if (generatedSignature === razorpaySignature) {
        res.json({ success: true, message: 'Payment signature verified' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid signature' });
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      res.status(500).json({ error: 'Verification failed' });
    }
  }

  // Update payment status and fields (e.g. on payment/cancellation)
  async updatePaymentBySeller(req, res) {
    try {
      const { razorpayOrderId, status } = req.body;
      const userId = req.user.userId;

      if (!razorpayOrderId || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const seller = await User.findById(userId).lean();
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      const payment = await Payment.findOne({ razorpayOrderId });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      if (payment.sellerId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this payment' });
      }

      const validStatuses = [
        'created',
        'escrowed',
        'shipped',
        'released',
        'refunded',
        'failed',
        'cancelled',
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      payment.status = status;
      await payment.save();

      return res.json({
        message: 'Payment updated successfully by seller',
        payment,
      });
    } catch (err) {
      console.error('Error updating payment by seller:', err);
      return res.status(500).json({ error: 'Failed to update payment' });
    }
  }

  async updatePaymentByBuyer(req, res) {
    try {
      const { razorpayOrderId, status } = req.body;
      const userId = req.user.userId;

      if (!razorpayOrderId || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const buyer = await User.findById(userId).lean();
      if (!buyer) {
        return res.status(404).json({ message: 'Buyer not found' });
      }

      const payment = await Payment.findOne({ razorpayOrderId });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      } 

      console.log("Payment user id: ", payment.userId);
      console.log("user id: ", userId);
      

      if (payment.userId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this payment' });
      }

      // Limit allowed statuses for buyer update, usually only initial escrow update
      const validStatuses = ['escrowed', 'cancelled'];

      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid status value for buyer update' });
      }

      payment.status = status;
      await payment.save();

      return res.json({
        message: 'Payment updated successfully by buyer',
        payment,
      });
    } catch (err) {
      console.error('Error updating payment by buyer:', err);
      return res.status(500).json({ error: 'Failed to update payment' });
    }
  }

  // Fetch payment by razorpayOrderId
  async getPaymentByOrderId(req, res) {
    try {
      const { razorpayOrderId } = req.params;
      if (!razorpayOrderId)
        return res.status(400).json({ error: 'Order ID is required' });

      const payment = await Payment.findOne({ razorpayOrderId });
      if (!payment) return res.status(404).json({ error: 'Payment not found' });

      res.json(payment);
    } catch (err) {
      console.error('Error fetching payment:', err);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  }

  // List payments with pagination
  // async listPayments(req, res) {
  //   try {
  //     const limit = parseInt(req.query.limit) || 50;
  //     const page = parseInt(req.query.page) || 1;
  //     const skip = (page - 1) * limit;

  //     const payments = await Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  //     res.json(payments);
  //   } catch (err) {
  //     console.error('Error listing payments:', err);
  //     res.status(500).json({ error: 'Failed to list payments' });
  //   }
  // }
}

module.exports = new PaymentController();
