var mongoose = require('mongoose'),
    Measurement = require('../models/measurements.server.model.js'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer');
    request = require('request');
    

/* Create a measurement */
exports.create = function(req, res) {

  var measurement = new Measurement(req.body);

  /*store extral info*/
  measurement.user = req.user;

  if(req.county) {
    measurement.county = req.county;
  }

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

// Get county based on the zip code that's submitted
exports.county = function(req, res,next) {
  if(req.body.zipcode) {
    var options = {
      key: config.googleMaps.key, 
      address: req.body.zipcode
    }
    request({
      url: 'https://maps.googleapis.com/maps/api/geocode/json', 
      qs: options
      }, function(error, response, body) {
        if(error) {
          res.status(400).send(err);
        } 

        var data = JSON.parse(body);
        if(data.status != "OK"){
          res.status(400).send("error");
        }
        else{
            var lengthOfComponents = data.results[0].address_components.length;
            var valid = false; /*check if zipcode is valid or not*/
            /*Using for loop to find the index of postal code*/
            /*compare the the zipcode with response.zipcode*/
            for(var i = 0; i < lengthOfComponents; i++){
              if(data.results[0].address_components[i].types[0] == "postal_code"){
                if(data.results[0].address_components[i].long_name == req.body.zipcode){
                  valid = true;
                  break;
                }
              }
            }

            if(valid == false){
              res.status(400).send("error");
            }
            else{

              /*Using for loop to find the index of county*/
              for(var i = 0; i < lengthOfComponents; i++){
                /*tyes[0] == "administrative_area_level_2" is for county*/
                if(data.results[0].address_components[i].types[0] == "administrative_area_level_2"){
                req.county = data.results[0].address_components[i].long_name;
                break;
                }
              }
      
              next();
            }
        }
    });
  } else {
      next();
  }
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
  var duc = req.measurement ? req.measurement.toJSON() : {};

  res.jsonp(req.measurement);
}

/*Email result to user*/
exports.email = function (req, res){
  var email_address = req.user.email;
  var measurement = req.measurement;
  var system_condition = req.body.condition;
  var metric = req.body.metric;
  var unit;

  var smtpTransport = nodemailer.createTransport(config.mailer.options);

  var condition;
  var uniform_distribution = measurement.results.uniformity_distribution;
  var irrigation_rate = measurement.results.irrigation_rate;

  /*persistent unit with user input*/
  /*metric = true -- metric (cm) */
  /*metric = false -- imperial (inch)*/
  if(metric == true){
    /*Do not need to convert, because unit in database is cm*/
    unit = "cm/hrs";
  }
  else{
    /*convert cm to inch*/
    irrigation_rate = (irrigation_rate/2.54).toFixed(2);
    unit = "inch/hrs";
  }


  var email_context = "<p> Dear " + req.user.displayName + ", </p>" + 
                      "<br />" + 
                      "<p> Your System: " + "<strong>" + system_condition + "</strong>" + "</p>" + 
                      "<p> Your Distirbution Uniformity: " + "<strong>" + uniform_distribution + "</strong>" + "</p>" + 
                      "<p> Your irrigation rate: " + "<strong>" + irrigation_rate + " " + unit + "</strong>" +"</p>";

  var mailOptions = {
    from: config.mailer.from,
    to: email_address,
    subject: "Result From Ducs",
    html: email_context
  }

  smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({message: 'An email has been sent to the provided email with further instructions.'});
        } else {
          res.status(400).send({ message: 'Failure sending email'});
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

  var uniformDistribution;

  if(totalAvg == 0)
    uniformDistribution = 0;
  else
    uniformDistribution = (quarterAvg / totalAvg).toFixed(2);

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

/*return value in cm/hour*/
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