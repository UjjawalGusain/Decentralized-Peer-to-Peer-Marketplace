const Product = require('./../models/Products.models');

class ProductController {
  async createProduct(req, res) {
    try {
      const sellerId = req.user.userId;
      const {
        title,
        description,
        category,
        price,
        currency,
        attributes,
        images,
        videoLink,
        inventory,
        condition,
        warrantyPeriod,
        status,
        location,
        tags,
        expiryDate,
      } = req.body;

      let parsedAttributes = attributes

      // Required fields check
      if (!title || !description || !category || price === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Validate category
      const validCategories = [
        'electronics',
        'clothing',
        'books',
        'home',
        'other',
      ];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        });
      }

      if (attributes) {
        parsedAttributes = JSON.parse(attributes)
      }

      if(location && location.coordinates) {
          location.coordinates = JSON.parse(location.coordinates);
      }

      // Validate currency if provided
      const validCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'];
      if (currency && !validCurrencies.includes(currency)) {
        return res.status(400).json({
          message: `Invalid currency. Must be one of: ${validCurrencies.join(', ')}`,
        });
      }

      // Validate status if provided
      const validStatuses = ['draft', 'active', 'sold', 'pending', 'inactive'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      // Validate condition if provided
      const validConditions = ['new', 'used', 'refurbished', 'damaged'];
      if (condition && !validConditions.includes(condition)) {
        return res.status(400).json({
          message: `Invalid condition. Must be one of: ${validConditions.join(', ')}`,
        });
      }

      // Basic validation for inventory (must be >= 1 if provided)
      const validatedInventory =
        inventory !== undefined ? Number(inventory) : 1;
      if (isNaN(validatedInventory) || validatedInventory < 1) {
        return res
          .status(400)
          .json({ message: 'Inventory must be a number >= 1' });
      }

      let tagsArray = [];
      // Validate tags if provided (should be array of strings)
      if (tags) {
        if (typeof tags === 'string') {
          try {
            const parsedTags = JSON.parse(tags);
            if (!Array.isArray(parsedTags)) {
              return res
                .status(400)
                .json({ message: 'Tags must be an array of strings' });
            }
            tagsArray = parsedTags;
          } catch (err) {
            return res
              .status(400)
              .json({ message: 'Tags must be a valid JSON array' });
          }
        } else if (Array.isArray(tags)) {
          tagsArray = tags;
        } else {
          return res
            .status(400)
            .json({ message: 'Tags must be an array of strings' });
        }
      }

      // Validate expiryDate if provided (valid date)
      let validatedExpiryDate = null;
      if (expiryDate) {
        const date = new Date(expiryDate);
        if (isNaN(date.getTime())) {
          return res.status(400).json({ message: 'Invalid expiryDate' });
        }
        validatedExpiryDate = date;
      }

      // Compose product data
      const productData = {
        sellerId,
        title,
        description,
        category,
        price,
        currency: currency || 'INR',
        attributes: parsedAttributes || {},
        images: images || [],
        videoLink: videoLink || null,
        inventory: validatedInventory,
        condition: condition || 'used',
        warrantyPeriod: warrantyPeriod || 'No warranty',
        status: status || 'active',
        location: location || {},
        tags: tagsArray || [],
        expiryDate: validatedExpiryDate,
        lastUpdatedBy: sellerId, // on creation lastUpdatedBy is creator
      };

      // Create and save
      const product = new Product(productData);
      await product.save();

      res.status(201).json({ message: 'Product created', product });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      const product = await Product.findById(productId).lean();

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      console.error('Get product by ID error:', error);
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
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: 'distance',
            maxDistance: Number(maxDistance),
            spherical: true,
            query: matchStage,
          },
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
