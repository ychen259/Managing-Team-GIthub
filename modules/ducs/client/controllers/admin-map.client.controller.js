(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('AdminMapController', AdminMapController);

  AdminMapController.$inject = ['$scope', 'DucsService'];

  function AdminMapController($scope, DucsService) {
    var vm = this;

    $scope.init = function() {
        DucsService.getActiveYears()
        .then(function(response) {
          vm.years = ["All"];
          for (var i = 0; i < response.data.length; i++)
            vm.years.push(response.data[i]._id);
          vm.years.sort();

          // show all years by default
          $scope.year = 'All';
          $scope.count('All');
        }, function(error) {
          $scope.error = 'Couldn\'t load measurement year data!';
        });
    }

    $scope.count = function(year){

      if (year === "All") {
        DucsService.getCountyCounts()
        .then(function(response) {
          vm.countyCounts = response.data;

          $scope.total = 0;
          for (var key in vm.countyCounts) {
            $scope.total += vm.countyCounts[key].count;
          }
        }, function(error) {
          //otherwise display the error
          $scope.error = 'Couldn\'t load measurement data!';
        });

      } else {
        DucsService.getCountyCountsByYear(year)
        .then(function(response) {
          vm.countyCounts = response.data;

          $scope.total = 0;
          for (var key in vm.countyCounts) {
            $scope.total += vm.countyCounts[key].count;
          }
        }, function(error) {
          //otherwise display the error
          $scope.error = 'Couldn\'t load measurement data!';
        });
      }
    }
  }
}());