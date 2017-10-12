(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsListController', DucsListController);

  DucsListController.$inject = ['DucsService'];

  function DucsListController(DucsService) {
    var vm = this;

    DucsService.list()
    .then(function(response) {
        vm.measurements = response.data;
        console.log(response.data);
      }, function(error) {
        //otherwise display the error
        $scope.error = 'Couldn\'t load measurement data!\n err:' + error;
      });
  }
}());