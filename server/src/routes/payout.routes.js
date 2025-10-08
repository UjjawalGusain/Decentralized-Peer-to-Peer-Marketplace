const express = require('express');
const router = express.Router();
const payoutController = require('./../controllers/payout.controller');

router.post('/create', payoutController.createPayout);
router.get('/:payoutId', payoutController.getPayoutStatus);

module.exports = router;
