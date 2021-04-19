// 'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReserveSchema = new Schema({
  sender_id: {
    type: String,
    required: true
  },
  receiver_id: {
    type: String,
    required: true
  },
  //Roommate request or house request 
  reserve_type: {
    type: String,
    required: true
  },
  approved: {
    type:Boolean,
    default:false
  },
  info_id: {
    type: String,
    required: true
  },
  start_date:{
      type: Date,
      required: true
  },
  end_date:{
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Reserve", ReserveSchema);