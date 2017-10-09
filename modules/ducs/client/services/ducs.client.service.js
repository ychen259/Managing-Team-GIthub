// Ducs service used to communicate Ducs REST endpoints
(function () {
  'use strict';

  angular
    .module('ducs')
    .factory('DucsService', ['$http', function($http){
    var methods = {


      create: function(listing) {
        return $http.post('/api/measurements', listing);
      }


    };

    return methods; 
  }]);
}()

);