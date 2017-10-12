(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsListController', DucsListController);

  DucsListController.$inject = ['$scope', '$state', 'DucsService'];

  function DucsListController($scope, $state, DucsService) {
    var vm = this;

    DucsService.listMeasurements()
    .then(function(response) {
        vm.measurements = response.data;
      }, function(error) {
        //otherwise display the error
        $scope.error = 'Couldn\'t load measurement data!\n err:' + error;
      });

    $scope.remove = function(measurement) {
        /*if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'articleForm');

            return false;
        }*/

        /* Delete the measurement using the DucsService */
        DucsService.deleteMeasurement(measurement)
                .then(function(response) {
                    console.log('deleted measurement');
                }, function(error) {
                    //otherwise display the error
                    $scope.error = 'Unable to delete measurement!\n' + error;
                });
    };
  }
}());