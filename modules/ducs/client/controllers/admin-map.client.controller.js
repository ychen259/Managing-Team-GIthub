(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('AdminMapController', AdminMapController);

  AdminMapController.$inject = ['DucsService'];

  function AdminMapController(DucsService) {
    var vm = this;
    console.log("Map controller loaded");
  }
}());