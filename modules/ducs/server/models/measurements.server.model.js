'use strict';

//Schema for measurements model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var measurementSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  //depth of cans in mm
  can_depths: {
    type: [Number],
    required: true
  },
  results: {
    uniformity: {type: Number, required: true},
    distribution: {type: Number, required: true},
  },
  zipcode: {
    type: Number,
    required: true
  },
  county: {
    type: String,
    required: true
  },
  //time is measured in minutes
  time: {
    type: Number,
    required: true
  }
});

measurementSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
});

var Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;
