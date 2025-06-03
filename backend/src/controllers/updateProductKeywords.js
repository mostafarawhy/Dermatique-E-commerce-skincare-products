import Product from "../models/Product.js";

export const generateKeywords = (product) => {
  const keywords = new Set();


  if (product.category === "skincare") {
    keywords.add("beauty");
    keywords.add("skin");
    keywords.add("face");
    keywords.add("facial");
    keywords.add("dermatology");
    keywords.add("cosmetics");
    keywords.add("self-care");


    if (
      product.name.toLowerCase().includes("spf") ||
      product.description.toLowerCase().includes("spf")
    ) {
      keywords.add("sun protection");
      keywords.add("sunscreen");
      keywords.add("uv protection");
      keywords.add("sun care");
    }

    if (
      product.name.toLowerCase().includes("moistur") ||
      product.description.toLowerCase().includes("moistur")
    ) {
      keywords.add("hydration");
      keywords.add("moisturizer");
      keywords.add("hydrating");
      keywords.add("dry skin");
    }

    if (
      product.name.toLowerCase().includes("serum") ||
      product.description.toLowerCase().includes("serum")
    ) {
      keywords.add("treatment");
      keywords.add("concentrated");
      keywords.add("skin care");
      keywords.add("facial serum");
    }


    const ingredients = [
      "aloe",
      "vitamin c",
      "retinol",
      "hyaluronic acid",
      "peptides",
      "collagen",
      "vitamin e",
      "tea tree",
      "charcoal",
      "clay",
      "salicylic acid",
      "glycolic acid",
      "coconut",
      "green tea",
    ];

    ingredients.forEach((ingredient) => {
      if (
        product.name.toLowerCase().includes(ingredient) ||
        product.description.toLowerCase().includes(ingredient)
      ) {
        keywords.add(ingredient);
        keywords.add("natural ingredients");
      }
    });


    const concerns = {
      acne: ["blemish", "breakout", "pimple", "acne-prone"],
      aging: ["wrinkle", "fine lines", "anti-aging", "mature skin"],
      hydrating: ["dry skin", "dehydrated", "moisture", "hydration"],
      brightening: ["dark spots", "hyperpigmentation", "dull skin", "glow"],
      sensitive: ["gentle", "soothing", "calming", "sensitive skin"],
    };

    Object.entries(concerns).forEach(([concern, related]) => {
      if (
        related.some(
          (term) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
        )
      ) {
        keywords.add(concern);
        related.forEach((term) => keywords.add(term));
      }
    });
  }

  if (product.category === "nail polish") {
    keywords.add("nails");
    keywords.add("manicure");
    keywords.add("polish");
    keywords.add("nail care");
    keywords.add("beauty");


    const colors = {
      red: ["burgundy", "crimson", "ruby", "scarlet"],
      pink: ["rose", "blush", "coral"],
      blue: ["navy", "azure", "sapphire"],
      purple: ["violet", "lavender", "plum"],
      green: ["mint", "emerald", "sage"],
      metallic: ["gold", "silver", "chrome", "metallic"],
      neutral: ["nude", "beige", "brown", "taupe"],
    };

    Object.entries(colors).forEach(([color, related]) => {
      if (
        [color, ...related].some(
          (term) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
        )
      ) {
        keywords.add(color);
        related.forEach((term) => keywords.add(term));
      }
    });


    const finishes = [
      "matte",
      "glossy",
      "shimmer",
      "glitter",
      "metallic",
      "chrome",
    ];
    finishes.forEach((finish) => {
      if (
        product.name.toLowerCase().includes(finish) ||
        product.description.toLowerCase().includes(finish)
      ) {
        keywords.add(finish);
        keywords.add(`${finish} finish`);
      }
    });
  }


  keywords.add(product.category);
  keywords.add("cosmetics");
  keywords.add("beauty products");
  keywords.add("personal care");

  return Array.from(keywords);
};

export const updateProductsWithKeywords = async () => {
  try {
    const products = await Product.find({});

    for (const product of products) {
      const keywords = generateKeywords(product);
      await Product.findByIdAndUpdate(product._id, { keywords });
    }

    console.log("Successfully updated products with keywords");
  } catch (error) {
    console.error("Error updating products with keywords:", error);
  }
};
