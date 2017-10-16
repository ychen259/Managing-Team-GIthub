'use strict';

/**
 * Module dependencies
 */
var ducsPolicy = require('../policies/ducs.server.policy'),
  ducs = require('../controllers/ducs.server.controller');

module.exports = function(app) {
  // Ducs Routes
  app.route('/api/ducs').all(ducsPolicy.isAllowed)
    .get(ducs.list)
    .post(ducs.create);

  app.route('/api/ducs/:ducId').all(ducsPolicy.isAllowed)
    .get(ducs.read)
    .put(ducs.update)
    .delete(ducs.delete);

  // Finish by binding the Duc middleware
  app.param('ducId', ducs.ducByID);
};
