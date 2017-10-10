(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsResultController', DucsResultController);

  DucsResultController.$inject = ['$scope', '$state', 'DucsService'];

  function DucsResultController($scope, $state, DucsService) {
    $scope.can_depth = $state.params.can_depth; //Can_depth array

    
  }
}());
