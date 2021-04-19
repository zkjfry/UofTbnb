// 'use strict';
// const log = console.log;
const mongoose = require("mongoose");
// const ObjectId = mongoose.Schema.Types.ObjectId;
// const TypeId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
// const {MongoClient, ObjectID} = require('mongodb');

const RoommateSchema = new Schema({
    roommate_id: {
        type: String,
        require: true
    },
    roommate_name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    pets_friendly: {
        type: Boolean,
        required: true,
    },
    smoking: {
        type: Boolean,
        required: true,
    },
    wakeup_time: {
        type: String,
        required: true,
    },
    sleep_time: {
        type: String,
        required: true,
    },
    cooking_level: {
        type: Number,
        required: true,
    },
    socialization_level: {
        type: Number,
        required: true,
    },
    friendly_level: {
        type: Number,
        required: true,
    },
    cleanliness: {
        type: Number,
        required: true,
    },
    noisy_extent: {
        type: Number,
        required: true,
    },
    start_date: {
        type: Array,
        required: true,
    },
    end_date: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }, 
    current: {
        type: String,
        default: ""
    },
    approved: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: "No description for this guy."
    },
    picture_urls: {
        type: Array,
        default: []
    },
    picture_ids: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("Roommate", RoommateSchema);