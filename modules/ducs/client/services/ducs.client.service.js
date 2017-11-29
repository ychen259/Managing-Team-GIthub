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

      list: function() {
        return $http.get('/api/measurements');
      },

      listCSV: function() {
        return $http.get('/api/measurements/export')
      },

      read: function(id) {
        return $http.get('/api/measurements/' + id);
      },

      deleteMeasurement: function(measurement) {
        return $http.delete('/api/measurements/' + measurement);
      },

      email: function(id, data) {
        return $http.post('/api/email-result/' + id, data);
      },

      getCountyCounts: function() {
        return $http.get('/api/measurements/count');
      }
    };

    return methods;
  }]);
}()

);
