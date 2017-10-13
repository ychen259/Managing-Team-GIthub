(function () {
  'use strict';

  // Ducs controller
  angular
    .module('ducs')
    .controller('DucsController', DucsController);

  DucsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'DucsService'];


  function DucsController ($scope, $state, $window, Authentication, DucsService) {

    $scope.authentication = Authentication;

    $scope.can_depth = [];
    $scope.hide = true;
    $scope.unit = false; //true for metric, false for English
    $scope.continue = function (isValid){

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'first_form');
        return false;
      }

      $scope.hide = false;
      //document.getElementById("can_depths").innerHTML = "<form name='second_form' class='form-horizontal' ng-submit='save(second_form.$valid)'>";
      var i;
      for (i=0;i < $scope.num ;i++)
      {
        //document.getElementById("can_depths").innerHTML += "<div class='form-group'>";
        document.getElementById("can_depths").innerHTML += "<label class='control-label'>Amount of Water</label><br>";
        document.getElementById("can_depths").innerHTML += "<input name = 'depth' id =" + i + " type='number' class='form-control' required/><br>";
       // document.getElementById("can_depths").innerHTML += "</div>"
      }
       /*document.getElementById("can_depths").innerHTML += "<div class='form-group'>" + 
                                                          "<button type='submit' class='btn btn-default' > submit</button>" +
                                                          "</div>";    
       document.getElementById("can_depths").innerHTML += "</form>";*/

    }

     $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'second_form');
        return false;
      }

      var i;
      for (i=0;i < $scope.num ;i++){
        $scope.can_depth[i] = document.getElementById(i).value;
      }

      /*Unit Conversion*/
      /*unit == false (English -- inch);  unit == true (Metric -- mm)*/
      /*1 inch = 25.4 mm*/
      if($scope.unit == false){
       console.log("English");

       /*transfer inch to mm*/
        for (i=0;i < $scope.num ;i++){
          $scope.can_depth[i] = $scope.can_depth[i] * 25.4;
        }
       
      }
      else{ 
        /*do nothing, because she wants metric unit in database*/
        console.log("Metric");
      }

      /* Create the listing object */
      var data = {
        "zipcode": $scope.zipcode,
        "county": $scope.location,
        "time": $scope.time,
        "can_depths": $scope.can_depth
      };

      /* Save the article using the Listings factory */
      DucsService.create(data)
              .then(function(response) {
                //send the id of object to state ducs.result, so ducs.result can use to id to get result from database
                $state.go('ducs.result', {object_id: response.data._id});
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to save value!\n' + error;
              });
    };

  }

}());