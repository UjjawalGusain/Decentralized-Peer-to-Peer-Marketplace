const express = require('express');
const router = express.Router();
const paymentController = require('./../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', authMiddleware, paymentController.addPayment);
router.post('/verify', authMiddleware, paymentController.verifyPayment);
router.put('/update', authMiddleware, paymentController.updatePayment);
router.get('/:razorpayOrderId', authMiddleware, paymentController.getPaymentByOrderId);
// router.get('/', paymentController.listPayments);  

module.exports = router;
