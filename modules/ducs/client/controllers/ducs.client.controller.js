(function () {
  'use strict';

  // Ducs controller
  angular
    .module('ducs')
    .controller('DucsController', DucsController);

  DucsController.$inject = ['$scope', '$state', 'Authentication', 'DucsService'];

  function DucsController ($scope, $state, Authentication, DucsService) {
    var vm = this;



 $scope.create = function(isValid) {
  console.log("hello");
      $scope.error = null;

      /* 
        Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
       */
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      /* Create the listing object */
      var data = {
        "zipcode": 32066,
        "county": "myyddd",
        "time": 220,


        "can_depths": [
            5,
            10,
            15,500
        ]
    };

      /* Save the article using the Listings factory */
      DucsService.create(data)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                //$state.go('listings.list', { successMessage: 'Listing succesfully created!' });
                console.log("You created a value");
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to save listing!\n' + error;
              });
    };

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
