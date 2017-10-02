'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Duc = mongoose.model('Duc'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Duc
 */
exports.create = function(req, res) {
  var duc = new Duc(req.body);
  duc.user = req.user;

  duc.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(duc);
    }
  });
};

/**
 * Show the current Duc
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var duc = req.duc ? req.duc.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  duc.isCurrentUserOwner = req.user && duc.user && duc.user._id.toString() === req.user._id.toString();

  res.jsonp(duc);
};

/**
 * Update a Duc
 */
exports.update = function(req, res) {
  var duc = req.duc;

  duc = _.extend(duc, req.body);

  duc.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(duc);
    }
  });
};

/**
 * Delete an Duc
 */
exports.delete = function(req, res) {
  var duc = req.duc;

  duc.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(duc);
    }
  });
};

/**
 * List of Ducs
 */
exports.list = function(req, res) {
  Duc.find().sort('-created').populate('user', 'displayName').exec(function(err, ducs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ducs);
    }
  });
};

/**
 * Duc middleware
 */
exports.ducByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Duc is invalid'
    });
  }

  Duc.findById(id).populate('user', 'displayName').exec(function (err, duc) {
    if (err) {
      return next(err);
    } else if (!duc) {
      return res.status(404).send({
        message: 'No Duc with that identifier has been found'
      });
    }
    req.duc = duc;
    next();
  });
};

/*********************************calculation function*****************************************************/
/*calculation the uniform destribution*/
function uniformDistribution(req){
  var canArray = req.body.can_depths; // req.body.can_depths should be array of depth of cans
  var sortArray = mergeSort(canArray);
  var lowerquarter = Math.floor((sortArray.length/4)); // # of lowerest one forth value
  var i;
  var sum = 0;
  for(i = 0; i < lowerquarter; i++){
    sum += sortArray[i];
  }

  var quarterAvg = sum / lowerquarter;  // average of lowerest one forth values

  sum = 0;
  for(i = 0; i < sortArray.length; i++){
    sum += sortArray[i];
  }

  var totalAvg = sum / (sortArray.length); // total average of all number

  var uniformDistribution = (quarterAvg / totalAvg).toFixed(2);

  return uniformDistribution;
};

function mergeSort(arr){
   if (arr.length < 2)
        return arr;
 
    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);
 
    return merge(mergeSort(left), mergeSort(right));
};
 
function merge(left, right){
    var result = [];
 
    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
 
    while (left.length)
        result.push(left.shift());
 
    while (right.length)
        result.push(right.shift());
 
    return result;
};

/*return value in mm*/
function avgIrrigation(req){
  var canArray = req.body.can_depths;
  var length = canArray.length;
  var sum = 0;
  var i = 0;
  for(; i< length; i++){
  	sum += canArray[i];
  }

  return (sum/length).toFixed(2);
}
/********************************* my code is here *****************************************************/