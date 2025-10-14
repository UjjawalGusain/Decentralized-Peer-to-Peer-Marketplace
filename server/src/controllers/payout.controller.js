const axios = require('axios');

class PayoutController {
  async createPayout(req, res) {
    try {
      const { fundAccountId, amount, currency = 'INR', mode = 'UPI', purpose = 'payout' } = req.body;
      if (!fundAccountId || !amount) {
        return res.status(400).json({ error: 'fundAccountId and amount are required' });
      }

      const data = {
        fund_account_id: fundAccountId,
        amount: amount * 100, // paise
        currency,
        mode,
        purpose,
        queue_if_low_balance: true,
      };

      const url = 'https://api.razorpay.com/v1/payouts';
      const auth = {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET,
      };

      const response = await axios.post(url, data, { auth });
      res.json(response.data);
    } catch (error) {
      console.error('Error creating payout:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to create payout' });
    }
  }

  // Fetch payout status by payout ID
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
