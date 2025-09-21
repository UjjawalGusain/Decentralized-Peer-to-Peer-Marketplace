const express = require('express');
const router = express.Router();
const productController = require('./../controllers/product.controllers');
const upload = require('./../middlewares/upload.middleware')
const cloudinaryUploadMiddleware = require('./../middlewares/cloudinary.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'images', maxCount: 6 },
    { name: 'video', maxCount: 1 },
  ]),
  cloudinaryUploadMiddleware,
  productController.createProduct
);

router.get('/', productController.getProducts);
router.get('/top-category', productController.getCategoryProducts);
router.get('/:id', productController.getProductById)


module.exports = router;
