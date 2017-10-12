// Ducs service used to communicate Ducs REST endpoints
(function () {
  'use strict';

  angular
    .module('ducs')
    .factory('DucsService', ['$http', function($http){
    var methods = {

      create: function(listing) {
        return $http.post('/api/measurements', listing);
      },

      listMeasurements: function() {
        return $http.get('/api/measurements');
      },

      deleteMeasurement: function(measurement) {
        console.log('deleteMeasurement: ' + measurement);
        return $http.delete('/api/measurements/' + measurement);
      }
    };

    return methods; 
  }]);
}()

);