const express = require('express');
const router = express.Router();
const productController = require('./../controllers/product.controllers');
const authMiddleware = require('./../middlewares/auth.middlewares');

router.post('/', authMiddleware, productController.createProduct);
router.get('/', productController.getProducts);

module.exports = router;
