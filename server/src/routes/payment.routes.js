const express = require('express');
const router = express.Router();
const paymentController = require('./../controllers/payment.controller');

router.put('/update', paymentController.updatePayment);
router.get('/:razorpayOrderId', paymentController.getPaymentByOrderId);
router.get('/', paymentController.listPayments);

module.exports = router;
