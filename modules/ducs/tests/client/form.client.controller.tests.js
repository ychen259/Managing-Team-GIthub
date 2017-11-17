'use strict';

(function () {
  // Password controller Spec
  describe('Duc form Controller Test', function () {
    // Initialize global variables
    var DucsListController,
      scope,
      $httpBackend,
      $stateParams,
      $state,
      $location,
      $window,
      Notification;

    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    describe('Duc form controller test', function () {
      beforeEach(inject(function ($controller, $rootScope, _UsersService_, _Authentication_, _$state_, _$stateParams_, _$httpBackend_, _$location_, _Notification_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $state = _$state_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);
        Notification = _Notification_;

        // Ignore parent template gets on state transition
        $httpBackend.whenGET('/modules/core/client/views/404.client.view.html').respond(200);
        $httpBackend.whenGET('/modules/core/client/views/404.client.view.html').respond(200);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['user']
        };

        // Initialize the Authentication controller
        DucsListController = $controller('DucsController as vm', {
          $scope: scope
        });
       
        spyOn($state, 'go');
        spyOn(Notification, 'error');
        spyOn(Notification, 'success');

      }));

      describe('Continue function', function () {
        it('$scope.hide should be false', function () {

          // Run controller functionality
          scope.continue(true);

          expect(scope.hide).toBe(false);
        });
      });

      describe('save success', function () {
        beforeEach(function () {
          scope.volume = false;
          scope.num =0;
          scope.unit = true;

          scope.zipcode = 94523;
          scope.time = 2;
          scope.can_depth = [1,2,3,4,5];
          scope.notes = 'some notes';

          var data = {
             "zipcode": 94523,
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'       
          }

          $httpBackend.expectPOST('/api/measurements', data).respond(200, {_id: 12345});
          scope.save();
          $httpBackend.flush();
        });

        it('expect go to result page', function () {
          expect($state.go).toHaveBeenCalledWith('ducs.result', {object_id: 12345, metric: true});
        });
      });

      describe('save error', function () {
      	beforeEach(function () {
          scope.volume = false;
          scope.num =0;
          scope.unit = true;

          scope.zipcode = 94523;
          scope.time = 2;
          scope.can_depth = [1,2,3,4,5];
          scope.notes = 'some notes';

          var data = {
             "zipcode": 94523,
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'       
          }

          $httpBackend.expectPOST('/api/measurements', data).respond(404, 'error message');
          scope.save();
          $httpBackend.flush();
        });

        it('expect to refresh the page', function () {
          expect($state.go).toHaveBeenCalledWith('ducs.create', {}, {reload:true});
        });
        it('expect to refresh the page', function () {
          expect(Notification.error).toHaveBeenCalledWith({message: "Your zipcode is invalid, please provide a valid zipcode", 
                                                           title: '<i class="glyphicon glyphicon-remove"></i> Invalid zipcode'});
        });

      });

    });
  });
}());
