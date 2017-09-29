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
