const Product = require('./../models/Products.models');

class ProductController {
  async createProduct(req, res) {
    try {
      const sellerId = req.user.userId; // From auth middleware after JWT verification
      const { title, description, category, price, images, location } =
        req.body;

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
        location: location || {},
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
    const {
      search,
      category,
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
      lat,
      lng,
      maxDistance = 5000, // 5 km default max distance
      sortBy = 'recent', // Options: 'recent', 'priceAsc', 'priceDesc'
    } = req.query;

    const usingLocationFilter = lat && lng;

    const pipeline = [];

    // Match active status and other filters first (apart from location)
    const matchStage = { status: 'active' };

    if (category) {
      const categories = category.split(',').map(c => c.trim());
      matchStage.category = { $in: categories };
    }

    if (search) {
      matchStage.title = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }

    // If location filter present, add $geoNear first stage
    if (usingLocationFilter) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "distance",
          maxDistance: Number(maxDistance),
          spherical: true,
          query: matchStage,
        }
      });
    } else {
      // No location filter, just match normally
      pipeline.push({ $match: matchStage });
    }

    // Determine sort order
    let sortStage = {};
    switch (sortBy) {
      case 'priceAsc':
        sortStage.price = 1;
        break;
      case 'priceDesc':
        sortStage.price = -1;
        break;
      case 'recent':
      default:
        sortStage.createdAt = -1;
        break;
    }

    pipeline.push({ $sort: sortStage });

    // Skip and limit for pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: Number(limit) });

    // Execute aggregation
    const products = await Product.aggregate(pipeline).exec();

    // Count total documents matching filters (without location sorting)
    const total = await Product.countDocuments(matchStage);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

  // GET /api/products/category-products
  async getCategoryProducts(req, res) {
    try {
      // Define recent period (e.g., last 1 month)
      const recentPeriodDate = new Date();
      recentPeriodDate.setMonth(recentPeriodDate.getMonth() - 1);

      // Step 1: Get top 10 categories by recent active products count
      const topCategoriesAgg = await Product.aggregate([
        { $match: { status: 'active', createdAt: { $gte: recentPeriodDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      const topCategories = topCategoriesAgg.map(c => c._id);

      // Step 2: Fetch 10 recent active products for each category in parallel
      const categoryProductsPromises = topCategories.map(cat =>
        Product.find({ status: 'active', category: cat })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
          .exec()
      );

      const productsByCategory = await Promise.all(categoryProductsPromises);

      // Prepare the response object as { category: string, products: [...] }
      const response = topCategories.map((cat, idx) => ({
        category: cat,
        products: productsByCategory[idx] || [],
      }));

      res.json({ categoryProducts: response });
    } catch (error) {
      console.error('getCategoryProducts error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}
module.exports = new ProductController();
