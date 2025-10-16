const Payout = require('./../models/Payouts.model');
const Payment = require('./../models/Payments.model')
const User = require('./../models/Users.models')

class PayoutController {
  // Simulate payout creation locally without Razorpay API call
  async createPayout(req, res) {
    try {
      const {
        fundAccountId,
        amount,
        currency = 'INR',
        mode = 'UPI',
        paymentId,
        sellerId,
        failureReason = null,
        purpose = 'payout',
      } = req.body;

      if (!fundAccountId || !amount) {
        return res
          .status(400)
          .json({ error: 'fundAccountId and amount are required' });
      }
      
      if (!paymentId) {
        return res.status(400).json({ error: 'Payment Id is required' });
      }
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      const productId = payment.productId;

      if (!sellerId) {
        return res.status(400).json({ error: 'Seller Id is required' });
      }

      const seller = await User.findById(sellerId);
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }

      

      // Simulate Razorpay payout ID as a UUID or unique string
      const razorpayPayoutId = `fake-payout-${Date.now()}`;

      // Simulate payout status immediately as 'successful'
      const payoutStatus = 'successful';

      // Create payout record in DB with simulated data
      const payout = new Payout({
        razorpayPayoutId,
        paymentId,
        sellerId,
        amount, // amount in regular currency unit
        currency,
        mode,
        status: payoutStatus,
        failureReason,
        productId
      });

      await payout.save();

      // Respond with simulated payout data
      res.json({
        id: razorpayPayoutId,
        paymentId,
        sellerId,
        productId,
        amount,
        currency,
        mode,
        status: payoutStatus,
        failureReason,
        message: 'Payout created successfully',
      });
    } catch (error) {
      console.error('Error creating payout:', error);
      res.status(500).json({ error: 'Failed to create payout' });
    }
  }

  // Get payout by razorpayPayoutId from DB
  async getPayoutStatus(req, res) {
    try {
      const { payoutId } = req.params;
      if (!payoutId) {
        return res.status(400).json({ error: 'Payout ID is required' });
      }

      const payout = await Payout.findOne({ razorpayPayoutId: payoutId });
      if (!payout) {
        return res.status(404).json({ error: 'Payout not found' });
      }

      res.json(payout);
    } catch (error) {
      console.error('Error fetching payout status:', error);
      res.status(500).json({ error: 'Failed to fetch payout status' });
    }
  }

  // Update payout status in DB (simulate webhook or manual change)
  async updatePayoutStatus(req, res) {
    try {
      const { razorpayPayoutId, status, failureReason } = req.body;
      if (!razorpayPayoutId) {
        return res.status(400).json({ error: 'Payout ID is required' });
      }

      const payout = await Payout.findOne({ razorpayPayoutId });
      if (!payout) {
        return res.status(404).json({ error: 'Payout not found' });
      }

      const validStatuses = ['created', 'processing', 'successful', 'failed'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid payout status' });
      }

      if (status) payout.status = status;
      if (failureReason) payout.failureReason = failureReason;

      await payout.save();

      res.json(payout);
    } catch (error) {
      console.error('Error updating payout status:', error);
      res.status(500).json({ error: 'Failed to update payout status' });
    }
  }

  // List payouts (filterable by sellerId and status)
  async getPayouts(req, res) {
    try {
      const filter = {};
      if (req.query.sellerId) filter.sellerId = req.query.sellerId;
      if (req.query.status) filter.status = req.query.status;

      const payouts = await Payout.find(filter).sort({ createdAt: -1 });

      res.json(payouts);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      res.status(500).json({ error: 'Failed to fetch payouts' });
    }
  }
}

module.exports = new PayoutController();
