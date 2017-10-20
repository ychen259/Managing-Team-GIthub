'use strict';

//Schema for measurements model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var measurementSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  //depth of cans in mm
  can_depths: {
    type: [Number],
    required: true
  },
  results: {
    uniformity_distribution: {type: Number, required: true},
    irrigation_rate: {type: Number, required: true}
  },
  zipcode: {
    type: Number,
    required: true
  },
  county: {
    type: String
  },
  //time is measured in minutes
  time: {
    type: Number,
    required: true
  },  
  created_at: Date,
  updated_at: Date

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
