const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const messageController = require('./../controllers/message.controller');

router.post('/send/:chatId', authMiddleware, messageController.sendMessageController);
router.get('/:chatId', authMiddleware, messageController.getAllMessages);

module.exports = router;
