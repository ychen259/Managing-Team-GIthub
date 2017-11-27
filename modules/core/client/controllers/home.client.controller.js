(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', 'Authentication'];
  function HomeController($scope, $state, Authentication) {
    var vm = this;

    $scope.authentication = Authentication;

    //login as guest, go to home page
    if($scope.authentication.user == null){

    }
    else{
      var length = $scope.authentication.user.roles.length;
      var roles = 'user';
      for(var i = 0; i < length; i++){
        if($scope.authentication.user.roles[i] == "admin"){
          roles = 'admin';
          break;
        }
      }

      //login in as admin, go to DUC input page
      if(roles == 'admin') $state.go('ducs.admin-list', $state.previous.params);
      //login in as user, then go to admin page
      else{
        $state.go('ducs.create', $state.previous.params);
      } 

    }
}
}());
