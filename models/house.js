// 'use strict';
// const log = console.log;
const mongoose = require("mongoose");
// const ObjectId = mongoose.Schema.Types.ObjectId;
// const TypeId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
// const {MongoClient, ObjectID} = require('mongodb');

const HouseSchema = new Schema({
  owner:{
    type: String,
    required: true,
    default: ""
  },
  owner_name:{
    type: String,
    required: true,
    default: ""
  },
  housetype:{
    type: String,
    required: true
  },
  spacetype:{
    type: String,
    required: true
  },
  bathroom_num:{
    type: Number,
    required: true,
    default: 0
  },
  toilet_number:{
    type: Number,
    required: true,
    default: 0
  },
  kitchen_number:{
    type: Number,
    required: true,
    default: 0
  },
  bed_number:{
    type: Number,
    required: true,
    default: 0
  },
  amenities:{
    type: Array,
    required: true,
    default: []
  },
  address:{
    type: String,
    required: true
  },
  apt_number:{
    type: String,
    required: false
  },
  city:{
    type: String,
    required: true
  },
  prov:{
    type: String,
    required: true
  },
  country:{
    type: String,
    required: true
  },
  zip_code:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: false
  },
  picture_urls:{
    type: Array,
    required: true
  },
  picture_ids:{
    type: Array,
    required: true
  },
  start_date:{
    type: Array,
    required: false,
    default: []
  },
  end_date:{
    type: Array,
    required: false,
    default: []
  },
  approved:{
    type: Boolean,
    required: false,
    default: false
  },
  inprogress:{
    type: Number,
    default: 0
  },
  // Array of current user id
  current_teneant: {
    type: String,
    default: ""
  },
  past_teneant: {
    type: String,
    default: ""
  },
  reviews:{
    type: Array,
    defalut: []
  }
});

module.exports = mongoose.model("House", HouseSchema);