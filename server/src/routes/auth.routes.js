const express = require('express');
const router = express.Router();
const upload = require('./../middlewares/upload.middleware')
const cloudinaryAvatarUploadMiddleware = require('./../middlewares/cloudinary_avatar.middleware.js');
const authController = require('./../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/register',
  upload.single('avatar'),
  cloudinaryAvatarUploadMiddleware,
  authController.register
);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
