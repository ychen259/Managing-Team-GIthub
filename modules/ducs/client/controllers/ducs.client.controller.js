(function () {
  'use strict';

  // Ducs controller
  angular
    .module('ducs')
    .controller('DucsController', DucsController);

  DucsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'ducResolve'];

  function DucsController ($scope, $state, $window, Authentication, duc) {
    var vm = this;

    vm.authentication = Authentication;
    vm.duc = duc;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Duc
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.duc.$remove($state.go('ducs.list'));
      }
    }

    // Save Duc
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ducForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.duc._id) {
        vm.duc.$update(successCallback, errorCallback);
      } else {
        vm.duc.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ducs.view', {
          ducId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
