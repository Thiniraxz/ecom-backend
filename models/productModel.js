const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please include the product name"],
  },
  price: {
    type: Number,
    required: [true, "Please include the product price"],
  },
  image: {
    type: String,
    // required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0, // Default value for quantity
    min: [0, "Quantity cannot be negative"], // Validation to ensure quantity is not negative
  },

  description: {
    type: String,
    required: [true, "Please include the product description"],
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
