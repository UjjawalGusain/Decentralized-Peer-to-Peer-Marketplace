const express = require('express');
const router = express.Router();
const orderController = require('./../controllers/order.controller');
const authMiddleware = require('./../middlewares/auth.middleware')

router.post('/create', authMiddleware, orderController.createOrder);
router.get('/orders-by-seller', authMiddleware, orderController.getOrders);

module.exports = router;
