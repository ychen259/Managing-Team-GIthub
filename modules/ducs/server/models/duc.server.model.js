'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Duc Schema
 */
var DucSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Duc name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Duc', DucSchema);
