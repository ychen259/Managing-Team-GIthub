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
      
      read: function(id) {
        return $http.get('/api/measurements/' + id);
      },

      deleteMeasurement: function(measurement) {
        return $http.delete('/api/measurements/' + measurement);
      },

      email: function(id){
        return $http.post('/api/email-result/' + id);
      }
    };

    return methods; 
  }]);
}()

);