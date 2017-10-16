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
      
      read: function(id) {
        return $http.get('/api/measurements/' + id);
      },

      email: function(id){
        return $http.post('/api/email-result/' + id);
      }


    };

    return methods; 
  }]);
}()

);