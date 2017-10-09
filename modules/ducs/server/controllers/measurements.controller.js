var mongoose = require('mongoose'),
Measurement = require('../models/measurements.server.model.js');



/* Create a measurement */
exports.create = function(req, res) {

  var measurement = new Measurement(req.body);

  /*store extral info*/
  measurement.user = req.user;

  /***uniformity distribution calculation**/
  var canArray = req.body.can_depths; // req.body.can_depths should be array of depth of cans
  
  var i;
  var j;
  var temp;

  for(i=0; i<canArray.length; i++){
  	for(j = (i+1); j<canArray.length; j++)
  		if(canArray[i] > canArray[j]){
          temp = canArray[i];
          canArray[i] = canArray[j];
          canArray[j] = temp;

        }
  }

  var sortArray = canArray;
  console.log(sortArray);
  var lowerquarter;
  if(sortArray.length/4 < 1) lowerquarter = 1;
  else
    lowerquarter = Math.floor(sortArray.length/4); // # of lowerest one forth value

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

  measurement.results.uniformity_distribution = (quarterAvg / totalAvg).toFixed(2);
  /*****Uniformity distribution calculation end here*/

  /*Irrigation calculation*/
  var canArray = req.body.can_depths;
  var time = req.body.time;
  var length = canArray.length;
  var sum = 0;
  var i = 0;
  for(; i< length; i++){
  	sum += canArray[i];
  }

  var avgDepth = sum/length;
  measurement.results.irrigation_rate = (avgDepth/time).toFixed(2);
  /*Irrigation calculation end here*/

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
      console.log("Successfully read:\n" + measurement);
      req.measurement = measurement;
      next();
    }
  });


/*********************************calculation function*****************************************************/
/*calculation the uniform destribution*/
function uniformDistribution(can_depths){
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

function mergeSort(arr, next){
   if (arr.length < 2)
        return arr;
 
    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);
 
    return merge(mergeSort(left), mergeSort(right));
    next();
};
 
function merge(left, right, next){
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
    next();
};

/*return value in mm/min*/
function avgIrrigation(req){
  var canArray = req.body.can_depths;
  var time = req.body.time;
  var length = canArray.length;
  var sum = 0;
  var i = 0;
  for(; i< length; i++){
  	sum += canArray[i];
  }

  var avgDepth = sum/length;
  return (avgDepth/time).toFixed(2);
}
/********************************* my code is here *****************************************************/

};
