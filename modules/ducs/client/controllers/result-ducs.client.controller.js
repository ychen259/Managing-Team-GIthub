(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsResultController', DucsResultController);

  DucsResultController.$inject = ['$scope', '$state', 'DucsService'];

  function DucsResultController($scope, $state, DucsService) {

    /*Get the data from database*/
    $scope.findOne = function() {

      var id = $state.params.object_id;

      DucsService.read(id)
              .then(function(response) {
                $scope.ducs = response.data;

                if($scope.ducs.results.uniformity_distribution > 0.84)
                	$scope.result = "Exceptional";
                else if($scope.ducs.results.uniformity_distribution >= 0.75 && $scope.ducs.results.uniformity_distribution <= 0.84)
                	$scope.result = "Excellent";
                else if($scope.ducs.results.uniformity_distribution >= 0.70 && $scope.ducs.results.uniformity_distribution <= 0.74)
                	$scope.result = "Very Good";
                else if($scope.ducs.results.uniformity_distribution >= 0.60 && $scope.ducs.results.uniformity_distribution <= 0.69)
                	$scope.result = "Good";
                else if($scope.ducs.results.uniformity_distribution >= 0.5 && $scope.ducs.results.uniformity_distribution <= 0.59)
                	$scope.result = "Fair";
                else if($scope.ducs.results.uniformity_distribution >= 0.4 && $scope.ducs.results.uniformity_distribution <= 0.49)
                	$scope.result = "Poor";
                else
                	$scope.result = "Fail";

              }, function(error) {  
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
              });
    };  
  }
}());
