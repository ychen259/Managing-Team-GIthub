(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsListController', DucsListController);

  DucsListController.$inject = ['DucsService'];

  function DucsListController(DucsService) {
    var vm = this;

    vm.ducs = DucsService.query();
  }
}());
