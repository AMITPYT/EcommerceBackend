const mongoose = require('mongoose');
const { Schema } = mongoose;

const DetailSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    second_number:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        required: true
    },
  });

  const Detail = mongoose.model('Detail',DetailSchema);
  module.exports = Detail