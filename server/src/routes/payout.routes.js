const express = require('express');
const router = express.Router();
const payoutController = require('./../controllers/payout.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create', authMiddleware, payoutController.createPayout);
router.get('/:payoutId', authMiddleware, payoutController.getPayoutStatus);
router.put('/:payoutId', authMiddleware, payoutController.updatePayoutStatus);
router.get('/', authMiddleware, payoutController.getPayouts);


module.exports = router;
