import Product from "../models/Product.js";

export const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    let query = {};


    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }


    if (category) {
      query.category = { $regex: category, $options: "i" };
    }


    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }


    let productsQuery = Product.find(query);


    if (sort) {
      const sortOptions = {
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
      };

      if (sortOptions[sort]) {
        productsQuery = productsQuery.sort(sortOptions[sort]);
      }
    }


    const products = await productsQuery.exec();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error performing search",
      error: error.message,
    });
  }
};

export const getProductSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({
        success: true,
        suggestions: [],
      });
    }

    const suggestions = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    })
      .select("name category")
      .limit(5);


    const formattedSuggestions = suggestions.map((item) => ({
      name: item.name,
      category: item.category,
    }));

    res.json({
      success: true,
      suggestions: formattedSuggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
      error: error.message,
    });
  }
};
