const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    // maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    // maxlength: 200,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Clothing",
      "Electronics",
      "Footwear",
      "Home and Furniture",
      "Beauty and Personal Care",
      "Sports and Outdoors",
      "Books and Media",
      "Toys and Games",
      "Automotive",
      "Health and Wellness",
      "Pet Supplies",
    ],
  },
  imageUrls: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
