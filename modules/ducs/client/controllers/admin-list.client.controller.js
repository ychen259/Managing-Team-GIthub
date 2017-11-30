(function () {
  'use strict';

  angular
    .module('ducs')
    .controller('DucsListController', DucsListController);

  DucsListController.$inject = ['$scope', '$state', 'DucsService'];

  function DucsListController($scope, $state, DucsService) {
    var vm = this;

    // the column to sort by
    $scope.sortColumn = 'created_at';
    // true if the data should be sorted in reverse order
    $scope.reverseSort = true;
    
    $scope.list = function(){
      DucsService.list()
      .then(function(response) {
        vm.measurements = response.data;

        // round catch can depths to 3 decimal places
        // might be kind of slow with large datasets
        for (var i = 0; i < vm.measurements.length; i++) {
          vm.measurements[i].can_depths = vm.measurements[i].can_depths.map(function(num) {
            return Number(num.toFixed(3));
          });
        }
      }, function(error) {
        //otherwise display the error
        $scope.error = 'Couldn\'t load measurement data!';
      });
    }

    $scope.rm = function(measurement){
      console.log("removing " + measurement);
      document.getElementById(measurement).remove();
    }

    $scope.remove = function(measurement) {
        if (!confirm("Are you sure you want to delete this measurement?"))
          return;
        /* Delete the measurement using the DucsService */
        DucsService.deleteMeasurement(measurement)
          .then(function(response) {
              // remove the deleted measurement from the list view
              $scope.rm(measurement);
          }, function(error) {
              //otherwise display the error
              $scope.error = 'Unable to delete measurements!';
          });
    };

    $scope.deleteAll = function() {
      if (confirm("Are you sure you want to delete ALL MEASUREMENTS IN THE DATABASE?")) {
        if (confirm("Are you really sure?")) {
          DucsService.deleteAllMeasurements()
          .then(function(response) {
              $state.go('ducs.admin-list', {}, {reload: true});
          }, function(error) {
              //otherwise display the error
              $scope.error = 'Unable to delete measurements!';
          });
        }
      }
    };

    $scope.formatDate = function(date) {
      var dbDate = new Date(date);
      return dbDate.toLocaleDateString();
    };

    $scope.getResult = function(distribution) {
      if(distribution > 0.84)
        return "Exceptional";
      else if(distribution >= 0.75 && distribution <= 0.84)
        return "Excellent";
      else if(distribution >= 0.70 && distribution <= 0.74)
        return "Very Good";
      else if(distribution >= 0.60 && distribution <= 0.69)
        return "Good";
      else if(distribution >= 0.5 &&  distribution <= 0.59)
        return "Fair";
      else if(distribution >= 0.4 &&  distribution <= 0.49)
        return "Poor";
      else
        return "Fail";
    };

    $scope.sortBy = function(colName) {
      // toggle sorting method if we're already using the same column, otherwise default to descending sort
      $scope.reverseSort = ($scope.sortColumn === colName) ? !$scope.reverseSort : true;
      $scope.sortColumn = colName;
    };

    $scope.exportCSV = function(){
      DucsService.listCSV()
        .then(function(response) {
            $scope.list = response.data;
            var blob = new Blob([$scope.list], {type: 'text/csv'});
            $scope.filename = "DUC-List.csv";
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, $scope.filename);
            } else{
                var e = document.createEvent('MouseEvents'),
                a = document.createElement('a');
                a.download = $scope.filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
                // window.URL.revokeObjectURL(url); // clean the url.createObjectURL resource
            }

    }, function(error) {
        $scope.error = 'Unable to export measurements!';

    });
    //var blob = new Blob([angular.toJson(myCars, true)], {type: 'text/csv'});

}
  /*  $scope.exportCSV = function() {
        DucsService.list()
          .then(function(response) {
              var list = response.data;


      }, function(error) {
          $scope.error = 'Unable to export measurements!\n' + error;

      });
      return "haha haha";
    }; */

    $scope.showDepths = function(depths) {
      //console.log("show depths");
      var modal = document.getElementById("depthsModal");
      var modalBody = document.getElementById("modalBody");
      modalBody.innerHTML = "<p>" + depths + "</p>";
      modal.style.display = "block"; //make modal visible
      //$("depthsModal").modal('show');
    }

    $scope.closeModal = function() {
      //console.log("close modal");
      var modal = document.getElementById("depthsModal");
      modal.style.display = "none";
      //$("depthsModal").modal('hide');
    }
  }
}());
