// 'use strict';
// const log = console.log;
const mongoose = require("mongoose");
// const ObjectId = mongoose.Schema.Types.ObjectId;
// const TypeId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
// const {MongoClient, ObjectID} = require('mongodb');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  email:{
      type:String,
      required:true,
      unique: true,
      index: true
  },
  picture_url:{
    type: String,
    required: false,
    default: "https://res.cloudinary.com/di97vw9om/image/upload/v1575396736/Gem2-1500x1346_uw2tll.jpg"
  },
  // Array of house id
  favourite_house: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("User", UserSchema);