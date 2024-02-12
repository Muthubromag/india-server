const mongoose = require("mongoose");

const productTypeSchema = mongoose.Schema({
  type: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  offer: {
    type: String,
    required: true,
  },
  types: [productTypeSchema],
  discountPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  subCategoryId: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  subCategoryName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
