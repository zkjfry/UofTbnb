// 'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: false,
    default: new Date()
  },
  rating:{
      type: Number,
      required: true
  },
  comment:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Review", ReviewSchema);