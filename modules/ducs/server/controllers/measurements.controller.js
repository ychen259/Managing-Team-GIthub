var mongoose = require('mongoose'),
Measurement = require('../models/measurements.server.model.js');



/* Create a measurement */
exports.create = function(req, res) {

    var measurement = new Measurement(req.body);

    /* save the coordinates (located in req.results if there is an address property) */


    /* Then save the listing */
    measurement.save(function(err) {
      if(err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        console.log("CREATED MEASUREMENT");

        res.json(measurement);
      }
    });
  };

  /* Delete a measurement */
exports.delete = function(req, res) {
    var measurement = req.measurement;

    /* Remove the article */
    measurement.remove(function(err) {
      if(err) {
        res.status(400).send(err);
      }
      else {
        res.end();
      }
    })
  };

  /* Retreive all the directory measurements, sorted alphabetically by listing code */
exports.list = function(req, res) {
    Measurement.find().sort('zipcode').exec(function(err, measurements) {
      if(err) {
        res.status(400).send(err);
      } else {
        res.json(measurements);
      }
    });
  };

  exports.measurementByID = function(req, res, next, id) {
    Measurement.findById(id).exec(function(err, measurement) {
      if(err) {
        res.status(400).send(err);
      } else {
        req.measurement = measurement;
        next();
      }
    });
  };
