(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsListController', DucsListController);

  DucsListController.$inject = ['$scope', '$state', 'DucsService'];

  function DucsListController($scope, $state, DucsService) {
    var vm = this;

    DucsService.list()
    .then(function(response) {
        vm.measurements = response.data;
      }, function(error) {
        //otherwise display the error
        $scope.error = 'Couldn\'t load measurement data!\n err:' + error;
      });

    $scope.remove = function(measurement) {
        /* Delete the measurement using the DucsService */
        DucsService.deleteMeasurement(measurement)
                .then(function(response) {
                  // remove the deleted measurement from the list view
                  document.getElementById(measurement).remove();
                }, function(error) {
                    //otherwise display the error
                    $scope.error = 'Unable to delete measurement!\n' + error;
                });
                
    };
  }
}());