const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    cartid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
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

  const Cart = mongoose.model('Cart',CartSchema);
  module.exports = Cart