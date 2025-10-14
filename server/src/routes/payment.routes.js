const express = require('express');
const router = express.Router();
const paymentController = require('./../controllers/payment.controller');

router.post('/add', paymentController.addPayment);
router.post('/verify', paymentController.verifyPayment);
router.put('/update', paymentController.updatePayment);
router.get('/:razorpayOrderId', paymentController.getPaymentByOrderId);
router.get('/', paymentController.listPayments);  

module.exports = router;
