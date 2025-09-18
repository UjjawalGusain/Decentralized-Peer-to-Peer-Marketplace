const Product = require('./../models/Products.models');

class ProductController {
  async createProduct(req, res) {
    try {
      const sellerId = req.user.userId; // From auth middleware after JWT verification
      const { title, description, category, price, images, location } = req.body;

      if (!title || !description || !category || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const product = new Product({
        sellerId,
        title,
        description,
        category,
        price,
        images: images || [],
        location: location || {}
      });

      await product.save();

      res.status(201).json({ message: 'Product created', product });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get list of products with optional filters
  async getProducts(req, res) {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = { status: 'active' };

    if (category) query.category = category;

    if (search) {
      query.$text = { $search: search };
    }

    console.log(query);
    

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    console.log(products);
    

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }

  }

  // Optionally, implement getProductById later
}

module.exports = new ProductController();
