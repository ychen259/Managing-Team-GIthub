(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('AdminMapController', AdminMapController);

  AdminMapController.$inject = ['$scope', 'DucsService'];

  function AdminMapController($scope, DucsService) {
    var vm = this;
    DucsService.getCountyCounts()
    .then(function(response) {
        vm.countyCounts = response.data;

        $scope.total = 0;
        for (var key in vm.countyCounts) {
          $scope.total += vm.countyCounts[key].count;
        }
      }, function(error) {
        //otherwise display the error
        $scope.error = 'Couldn\'t load measurement data!\n err:' + error;
      });
  }
}());