const Payment = require('./../models/Payments.model');
const razorpay = require('./../config/razorpay');
const User = require('./../models/Users.models')

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
        userId: buyerId,
      });
      await payment.save();

      res.json({ order, payment });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Error creating order' });
    }
  }

  async getOrdersBySeller(req, res) {
    try {
      const sellerId = req.query.sellerId;

      console.log("SellerId: ", sellerId);
      
      const seller = await User.findById(sellerId).lean();

      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      if(!seller.roles.includes("seller")) {
        return res.status(404).json({ message: 'User not a seller' });
      }

      const orders = await Payment.find({
        sellerId,
        status: 'escrowed',
        buyerCancelRequested: false,
      }).lean();
      console.log(orders);
      
      res.json({
        orders,
      });
    } catch (error) {
      console.error('Get orders by seller error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getOrdersByBuyer(req, res) {
    try {
      const userId = req.user.userId;

      console.log("BuyerId/userid: ", userId);
      
      const buyer = await User.findById(userId).lean();

      if (!buyer) {
        return res.status(404).json({ message: 'Buyer not found' });
      }

      if(!buyer.roles.includes("buyer")) {
        return res.status(404).json({ message: 'User not a buyer' });
      }

      const orders = await Payment.find({
        userId,
        buyerCancelRequested: false,
      }).lean();
      console.log(orders);
      
      res.json({
        orders,
      });
    } catch (error) {
      console.error('Get orders by buyer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new OrderController();
