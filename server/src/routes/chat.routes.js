const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('./../controllers/chat.controller');

router.post('/create/:receiverId', authMiddleware, chatController.createChat);
router.get('/', authMiddleware, chatController.getAllChats);

module.exports = router;
