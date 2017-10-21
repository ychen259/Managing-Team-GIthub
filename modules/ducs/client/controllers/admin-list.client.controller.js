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

    $scope.formatDate = function(date) {
      var dbDate = new Date(date);
      return dbDate.toLocaleDateString();
    };

    $scope.getResult = function(distribution) {
      if(distribution > 0.84)
        return "Exceptional";
      else if(distribution >= 0.75 && distribution <= 0.84)
        return "Excellent";
      else if(distribution >= 0.70 && distribution <= 0.74)
        return "Very Good";
      else if(distribution >= 0.60 && distribution <= 0.69)
        return "Good";
      else if(distribution >= 0.5 &&  distribution <= 0.59)
        return "Fair";
      else if(distribution >= 0.4 &&  distribution <= 0.49)
        return "Poor";
      else
        return "Fail";
    };
  }
}());