const express = require('express');
const router = express.Router();
const paymentController = require('./../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', authMiddleware, paymentController.addPayment);
router.post('/verify', authMiddleware, paymentController.verifyPayment);
router.patch('/update-by-buyer', authMiddleware, paymentController.updatePaymentByBuyer);
router.patch('/update-by-seller', authMiddleware, paymentController.updatePaymentBySeller);
router.get('/:razorpayOrderId', authMiddleware, paymentController.getPaymentByOrderId);
// router.get('/', paymentController.listPayments);  

module.exports = router;
