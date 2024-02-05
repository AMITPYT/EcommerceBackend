const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    productname:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    quantity:{
        type: Number,
        default: 1
    },
    price:{
        type: String,
        required: true
    },
  });

  const Product = mongoose.model('Product',ProductSchema);
  module.exports = Product