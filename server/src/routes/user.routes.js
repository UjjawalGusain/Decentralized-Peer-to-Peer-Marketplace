const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/auth.middleware'); // protect routes if needed

router.get('/:id', userController.getUser);
router.put('/:id', authMiddleware, userController.updateUser);

module.exports = router;
