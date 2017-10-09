// Ducs service used to communicate Ducs REST endpoints
(function () {
  'use strict';

  angular
    .module('ducs')
    .factory('DucsService', DucsService);

  DucsService.$inject = ['$resource'];
//$http
  function DucsService($resource) {
    return $resource('/api/ducs/:ducId', {
      ducId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
