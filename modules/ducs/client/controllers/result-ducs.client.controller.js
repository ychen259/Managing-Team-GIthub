(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsResultController', DucsResultController);

  DucsResultController.$inject = ['$scope', '$state', 'DucsService'];

  function DucsResultController($scope, $state, DucsService) {
    var id = $state.params.object_id;
    var metric = $state.params.metric; // true -- metric (cm); false -- imperial (inch)

    /*Get the data from database*/
    $scope.findOne = function() {

      DucsService.read(id)
              .then(function(response) {
                $scope.ducs = response.data;
                $scope.uniformity_distribution = $scope.ducs.results.uniformity_distribution;
                $scope.irrigation_rate = $scope.ducs.results.irrigation_rate;

                /*persistent unit with user input*/
                /*metric = true -- metric (cm) */
                /*metric = false -- imperial (inch)*/
                if(metric == true){
                  /*Do not need to convert, because unit in database is cm*/
                  $scope.unit = "cm/hrs";
                }
                else{
                  /*convert cm to inch*/
                  $scope.irrigation_rate = ($scope.irrigation_rate/2.54).toFixed(2);
                  $scope.unit = "inch/hrs";
                }

                /*Using uniformity distribution to evaluate the condition of system*/
                if($scope.uniformity_distribution > 0.84)
                	$scope.result = "Exceptional";
                else if($scope.uniformity_distribution >= 0.75 && $scope.uniformity_distribution <= 0.84)
                	$scope.result = "Excellent";
                else if($scope.uniformity_distribution >= 0.70 && $scope.uniformity_distribution <= 0.74)
                	$scope.result = "Very Good";
                else if($scope.uniformity_distribution >= 0.60 && $scope.uniformity_distribution <= 0.69)
                	$scope.result = "Good";
                else if($scope.uniformity_distribution >= 0.5 &&  $scope.uniformity_distribution <= 0.59)
                	$scope.result = "Fair";
                else if($scope.uniformity_distribution >= 0.4 &&  $scope.uniformity_distribution <= 0.49)
                	$scope.result = "Poor";
                else
                	$scope.result = "Fail";

              }, function(error) {  
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
              });
    };  

   $scope.sendEmail = function(){
     var id = $scope.ducs._id;

     var data = {
      "condition" : $scope.result,
      "metric" : metric
     }

     DucsService.email(id, data)
              .then(function(response){

     }, function(err){

     });
   }

  }
}());