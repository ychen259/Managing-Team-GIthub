var mongoose = require('mongoose'),
    Measurement = require('../models/measurements.server.model.js'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer');

/* Create a measurement */
exports.create = function(req, res) {

  var measurement = new Measurement(req.body);

  /*store extral info*/
  measurement.user = req.user;

  var canArray = measurement.can_depths; // req.body.can_depths should be array of depth of cans
  var time = measurement.time;

  measurement.results.uniformity_distribution =  uniformDistribution(canArray);
  measurement.results.irrigation_rate = avgIrrigation(canArray, time);

  measurement.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      console.log("Successfully created:\n" + measurement);

      res.json(measurement);
    }
  });

};

/* Delete a measurement */
exports.delete = function(req, res) {
  var measurement = req.measurement;

  measurement.remove(function(err) {
    if(err) {
      res.status(400).send(err);
    }
    else {
      console.log("Successfully deleted:\n" + measurement);
      //res.json(measurement)
      res.end();
    }
  })

};

/* view a measurement */
exports.view = function(req, res) {
  res.json(req.measurement);

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

/**
 * Show the current Duc
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var duc = req.duc ? req.duc.toJSON() : {};

  res.jsonp(duc);
}

/*Email result to user*/
exports.email = function (req, res){
  var email_address = req.user.email;
  var measurement = req.measurement;

  var smtpTransport = nodemailer.createTransport(config.mailer.options);

  var condition;
  var uniform_distribution = measurement.results.uniformity_distribution;
  var irrigation_rate = measurement.results.irrigation_rate;

  if(uniform_distribution > 0.84)
    condition = "Exceptional";
  else if(uniform_distribution >= 0.75 && uniform_distribution <= 0.84)
    condition = "Excellent";
  else if(uniform_distribution >= 0.70 && uniform_distribution <= 0.74)
     condition = "Very Good";
  else if(uniform_distribution >= 0.60 && uniform_distribution <= 0.69)
     condition = "Good";
  else if(uniform_distribution >= 0.5 && uniform_distribution <= 0.59)
     condition = "Fair";
  else if(uniform_distribution >= 0.4 && uniform_distribution <= 0.49)
     condition = "Poor";
  else
     condition = "Fail";

  var email_context = "<p> Dear " + req.user.displayName + ", </p>" + 
                      "<br />" + 
                      "<p> Your System: " + condition + "</p>" + 
                      "<br />" +
                      "<p> Your Distirbution Uniformity: " + uniform_distribution + "</p>" + 
                      "<br />" + 
                      "<p> Your irrigation rate: " + irrigation_rate + "</p>";
  var mailOptions = {
    from: config.mailer.from,
    to: email_address,
    subject: "Result From Ducs",
    html: email_context
  }

  smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          console.log("Email has been sent");
        } else {
          console.log("Failure sending email");
        }

        done(err);
  });
};

exports.measurementByID = function(req, res, next, id) {

  Measurement.findById(id).exec(function(err, measurement) {
    if(err) {
      res.status(400).send(err);
    } else {
      console.log("Successfully read:\n" + measurement);
      req.measurement = measurement;
      next();
    }
  });
};

/*********************************calculation function*****************************************************/
/*calculation the uniform destribution*/
function uniformDistribution(can_depths){
  var sortArray = mergeSort(can_depths);
  var lowerquarter;

  if(sortArray.length/4 < 1) lowerquarter = 1;
  else
    lowerquarter = Math.floor(sortArray.length/4); // # of lowerest one forth value

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

/*return value in mm/min*/
function avgIrrigation(can_depths, time){
  var length = can_depths.length;
  var sum = 0;
  var i = 0;
  for(; i< length; i++){
  	sum += can_depths[i];
  }

  var avgDepth = sum/length;
  return (avgDepth/time).toFixed(2);
}
/********************************* my code is here *****************************************************/