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

                if($scope.ducs.uniformity_distribution > 0.9)
                	$scope.result = "Excellent";
                else if($scope.ducs.uniformity_distribution >= 0.70 && $scope.ducs.uniformity_distribution <= 0.95)
                	$scope.result = "Great";
                else
                	$scope.result = "Historical";

              }, function(error) {  
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
              });
    };  
  }
}());
