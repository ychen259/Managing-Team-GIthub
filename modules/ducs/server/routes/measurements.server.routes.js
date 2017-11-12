'use strict';
/* Dependencies */
var measurements = require('../controllers/measurements.controller.js');
var measurementsPolicy = require('../policies/measurement.server.policy');

/*
These method calls are responsible for routing requests to the correct request handler.
Take note that it is possible for different controller functions to handle requests to the same route.
*/


module.exports = function(app) {
    // Ducs Routes
    app.route('/api/measurements').all(measurementsPolicy.isAllowed)
      .get(measurements.list)
      .post(measurements.county, measurements.city, measurements.create);

    app.route('/api/measurements/export').all(measurementsPolicy.isAllowed)
        .get(measurements.export);

    app.route('/api/measurements/count').all(measurementsPolicy.isAllowed)
      .get(measurements.getCountyCounts);


    app.route('/api/measurements/:measureId').all(measurementsPolicy.isAllowed)
      .get(measurements.read)
      .delete(measurements.delete);

    app.route('/api/email-result/:measureId').all(measurementsPolicy.isAllowed)
      .post(measurements.email);

    // Finish by binding the Duc middleware
    app.param('measureId', measurements.measurementByID);
};

/*
The 'router.param' method allows us to specify middleware we would like to use to handle
requests with a parameter.
Say we make an example request to '/listings/566372f4d11de3498e2941c9'
The request handler will first find the specific listing using this 'listingsById'
middleware function by doing a lookup to ID '566372f4d11de3498e2941c9' in the Mongo database,
and bind this listing to the request object.
It will then pass control to the routing function specified above, where it will either
get, update, or delete that specific listing (depending on the HTTP verb specified)
*/

//module.exports = router;
