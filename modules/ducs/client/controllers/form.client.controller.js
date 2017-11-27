(function () {
  'use strict';

  // Ducs controller
  angular
    .module('ducs')
    .controller('DucsController', DucsController);

  DucsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'DucsService', 'Notification'];


  function DucsController ($scope, $state, $window, Authentication, DucsService, Notification) {

    $scope.authentication = Authentication;

    $scope.can_depth = [];
    $scope.volume_array = [];
    $scope.area
    $scope.hide = true;
    $scope.unit = false; //true for metric (cm), false for imperical (inch)
    $scope.volume = false; //true for volume, false for depth
    
    //Store counties available
    $scope.counties = ["Alachua County","Baker County","Bay County","Bradford County","Brevard County","Broward County","Calhoun County","Charlotte County","Citrus County","Clay County","Collier County","Columbia County","DeSoto County","Dixie County","Duval County","Escambia County","Flagler County","Franklin County","Gadsden County","Gilchrist County","Glades County","Gulf County","Hamilton County","Hardee County","Hendry County","Hernando County","Highlands County","Hillsborough County","Holmes County","Indian River County","Jackson County","Jefferson County","Lafayette County","Lake County","Lee County","Leon County","Levy County","Liberty County","Madison County","Manatee County","Marion County","Martin County","Miami-Dade County","Monroe County","Nassau County","Okaloosa County","Okeechobee County","Orange County","Osceola County","Palm Beach County","Pasco County","Pinellas County","Polk County","Putnam County","St. Johns County","St. Lucie County","Santa Rosa County","Sarasota County","Seminole County","Sumter County","Suwannee County","Taylor County","Union County","Volusia County","Wakulla County","Walton County","Washington County"];

    $scope.idArrayForDepth = [];
    $scope.idArrayForVolume = [];
    
    $scope.validateField = function(first_form){
      
          if($scope.counties.includes($scope.selected_county) || $scope.zipcode != undefined){
            first_form.County.$setValidity('InvalidCounty', true); 
          } 
          else {
            first_form.County.$setValidity('InvalidCounty', false);
            // first_form.County.$error.validationError = true;
            
          }
    
      
      }

    
    $scope.continue = function (isValid){
    
      // if($scope.counties.includes($scope.selected_county)){
      //   $scope.first_form.county.$setValidity('InvalidCounty', true); 
      // } 
      // else {
      //   $scope.first_form.county.$setValidity('InvalidCounty', false);
      //   return false;
      // }

      
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'first_form');
        return false;
      }

      $scope.hide = false;
  
      var i;

      for (i=0;i < $scope.num ;i++)
      {
          $scope.idArrayForDepth.push({'id': i}); /*id for height array*/
          $scope.idArrayForVolume.push({'id': i+$scope.num}); /*id for volume array*/
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
        "can_depths": $scope.can_depth,
        "notes":$scope.notes,
        "county":$scope.selected_county
      };
      
      /* Save the measurement using the DucsService factory */
      DucsService.create(data)
              .then(function(response) {

                //send the id of object to state ducs.result, so ducs.result can use to id to get result from database
                //$scope.unit == false (Imperial) ; $scope.unit == true (Metric)
                $state.go('ducs.result', {object_id: response.data._id, metric: $scope.unit});
              }, function(error) {
                //otherwise display the error
                $state.go('ducs.create', {},{reload:true});
                Notification.error({ message: "Your zipcode is invalid, please provide a valid zipcode", title: '<i class="glyphicon glyphicon-remove"></i> Invalid zipcode'});
              });
    };

  }

}());