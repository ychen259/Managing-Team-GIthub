(function () {
  'use strict';

  // Ducs controller
  angular
    .module('ducs')
    .controller('DucsController', DucsController);

  DucsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'DucsService', 'Notification'];


  function DucsController ($scope, $state, $window, Authentication, DucsService, Notification) {
//$ip_address = $_SERVER["REMOTE_ADDR"]；
//console.log("IP :" + $ip_address );
    $scope.authentication = Authentication;

    $scope.can_depth = [];
    $scope.volume_array = [];
    $scope.area
    $scope.hide = true;
    $scope.unit = false; //true for metric (cm), false for imperical (inch)
    $scope.volume = false; //true for volume, false for depth

    $scope.continue = function (isValid){

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'first_form');
        return false;
      }

      $scope.hide = false;
  
      var i;

      for (i=0;i < $scope.num ;i++)
      {
        /*volume == false ==> Ask user to input depth*/
        
          document.getElementById("can_depths").innerHTML += "<label class='control-label'>Amount of Water</label><br>";
          document.getElementById("can_depths").innerHTML += "<input name = 'depth' id =" + i + " type='number' class='form-control' min='0' required/><br>";
        
        /*volume == true ==> Ask user to input surface area (cm^2) and volume*/   
       
          document.getElementById("Volume").innerHTML += "<label class='control-label'>Volume of water</label><br>";
          document.getElementById("Volume").innerHTML += "<input name = 'volume' id =" + ($scope.num + i) + " type='number' class='form-control' placeholder='Volume in ml' min='0' required/><br>";
        
      }
    }

     $scope.save = function() {

      var i;
      /*$scope.volume == store the value of volume into array*/
      if($scope.volume){
        /*volume(ml = cm^3), area (cm^2) ==> convert it to depth (cm)*/
        for (i=0;i < $scope.num ;i++){
           $scope.volume_array[i] = document.getElementById($scope.num + i).value;
           $scope.can_depth[i] =  $scope.volume_array[i] / $scope.area;
        }

        $scope.unit = true; /*true for metric, because I want metric output*/
      }
      /*else == store the value of depth into array*/
      else{
        for (i=0;i < $scope.num ;i++){
          $scope.can_depth[i] = document.getElementById(i).value;
        }
      } 

      /*Unit Conversion*/
      /*unit == false (Imperial -- inch);  unit == true (Metric -- cm)*/
      /*1 inch = 2.54 cm*/
      if($scope.unit == false){
       //console.log("Imperial");

       /*transfer inch to mm*/
        for (i=0;i < $scope.num ;i++){
          $scope.can_depth[i] = $scope.can_depth[i] * 2.54;
        }
       
      }
      else{ 
        /*do nothing, because she wants metric unit in database*/
        //console.log("Metric");
      }

      /* Create the listing object */
      var data = {
        "zipcode": $scope.zipcode,
        "time": $scope.time,
        "can_depths": $scope.can_depth
      };
      
      /* Save the measurement using the DucsService factory */
      DucsService.create(data)
              .then(function(response) {

                //send the id of object to state ducs.result, so ducs.result can use to id to get result from database
                //$scope.unit == false (Imperial) ; $scope.unit == true (Metric)
                $state.go('ducs.result', {object_id: response.data._id, metric: $scope.unit});
              }, function(error) {
                //otherwise display the error
                $state.go($state.current, {},{reload:true});
                Notification.error({ message: "Zip code is invalid, Please input correct zip code", title: '<i class="glyphicon glyphicon-remove"></i> Invalid zipcode'});
              });
    };

  }

}());