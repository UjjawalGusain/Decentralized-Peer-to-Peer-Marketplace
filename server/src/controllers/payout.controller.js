const axios = require('axios');
const  razorpay = require('./../config/razorpay')

class PayoutController {
  // Create a payout (UPI or bank) using RazorpayX API with auth header
  async createPayout(req, res) {
    try {
      const { fundAccountId, amount, currency = 'INR', mode = 'UPI', purpose = 'payout' } = req.body;

      if (!fundAccountId || !amount) {
        return res.status(400).json({ error: 'fundAccountId and amount are required' });
      }

      const data = {
        fund_account_id: fundAccountId,
        amount: amount * 100, // in paise
        currency,
        mode,
        purpose,
        queue_if_low_balance: true,
      };

      // RazorpayX base URL for payouts API
      const url = 'https://api.razorpay.com/v1/payouts';

      const response = await axios.post(url, data, { razorpay });

      res.json(response.data);
    } catch (error) {
      console.error('Error creating payout:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to create payout' });
    }
  }

  // Fetch payout details by payout ID
  async getPayoutStatus(req, res) {
    try {
      const { payoutId } = req.params;

      if (!payoutId) return res.status(400).json({ error: 'payoutId is required' });

      const url = `https://api.razorpay.com/v1/payouts/${payoutId}`;

      const auth = {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET,
      };

      const response = await axios.get(url, { auth });

      res.json(response.data);
    } catch (error) {
      console.error('Error fetching payout status:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch payout status' });
    }
  }
}

module.exports = new PayoutController();
