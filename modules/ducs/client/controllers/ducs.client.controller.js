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
    $scope.continue = function (isValid){
      $scope.hide = false;
      //document.getElementById("can_depths").innerHTML = "<form name='second_form' class='form-horizontal' ng-submit='save(second_form.$valid)'>";
      var i;
      for (i=0;i < $scope.num ;i++)
      {
        document.getElementById("can_depths").innerHTML += "<label>Amount of Water</label><input name = 'depth' id = 'depth' ng-model='can_depth[i]' type='number'><br>";
      }
       /*document.getElementById("can_depths").innerHTML += "<div class='form-group'>" + 
                                                          "<button type='submit' class='btn btn-default' > submit</button>" +
                                                          "</div>";    
       document.getElementById("can_depths").innerHTML += "</form>";*/
    }

     $scope.save = function(isValid) {
console.log("here");

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      /* Create the listing object */
      var data = {
        "zipcode": 32066,
        "county": "ttttttttttttt",
        "time": 220,
        "can_depths": [5,10,15,500]
      };
console.log("here");
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

  }

}());
