'use strict';

(function () {
  // Password controller Spec
  describe('Duc result Controller Test', function () {
    // Initialize global variables
    var DucsListController,
      scope,
      $httpBackend,
      $stateParams,
      $state,
      $location,
      $window,
      Notification,
      data;

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

    describe('Duc results controller test', function () {
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
        $httpBackend.whenGET('/modules/core/client/views/400.client.view.html').respond(200);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['user']
        };

        $state.params.object_id = 123456;
        $state.params.metric = true;
        // Initialize the Authentication controller
        DucsListController = $controller('DucsResultController as vm', {
          $scope: scope,
        });
       
        spyOn($state, 'go');
        spyOn(Notification, 'error');
        spyOn(Notification, 'success');

      }));

      describe('find one function success', function () {

        beforeEach(function () {
          data = {
             "zipcode": 94523,
             "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'       
          }

          var id = 123456;

          $httpBackend.expectGET('/api/measurements/' + id).respond(200, data);
          scope.findOne();
          $httpBackend.flush();
        });

        it('expect $scope.ducs euqal to data', function () {
          expect(scope.ducs).toEqual(data);
        });
        it('check the value of $scope.result', function () {
          expect(scope.uniformity_distribution).toEqual(data.results.uniformity_distribution);
          expect(scope.irrigation_rate).toEqual(data.results.irrigation_rate);
        });
        it('expect $scope.unit to be cm/hrs', function () {
          expect(scope.unit).toEqual("cm/hrs");
        });
        it('expect $scope.results to be Fail', function () {
          expect(scope.result).toEqual("Fail");
        });
      });

      describe('find one function Fail', function () {

        beforeEach(function () {
          data = {
             "zipcode": 94523,
             "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'       
          }

          var id = 123456;

          $httpBackend.expectGET('/api/measurements/' + id).respond(404, 'error message');
          scope.findOne();
          $httpBackend.flush();
        });

        it('expect $scope.error to be defined', function () {
          expect(scope.error).toEqual("Unable to retrieve listing with id: " + 123456);
        });
      });

      describe('sendEmail function success', function () {

        beforeEach(function () {
          var ducs = {
            _id: 123456
          }

          scope.ducs = ducs;
          scope.result = 'Fail';
          scope.metric = true;

          data = {
             "condition" : 'Fail',
             "metric" : true
          }

          var id = 123456;

          $httpBackend.expectPOST('/api/email-result/' + id, data).respond(200, {message: 'success message'});
          scope.sendEmail();
          $httpBackend.flush();
        });

        it('send Notification success message', function () {
          expect(Notification.success).toHaveBeenCalledWith({message: "success message", 
                                                           title: '<i class="glyphicon glyphicon-ok"></i> Result email sent successfully!'});
        });
      });

      describe('sendEmail function Fail', function () {

        beforeEach(function () {
          var ducs = {
            _id: 123456
          }

          scope.ducs = ducs;
          scope.result = 'Fail';
          scope.metric = true;

          data = {
             "condition" : 'Fail',
             "metric" : true
          }

          var id = 123456;

          $httpBackend.expectPOST('/api/email-result/' + id, data).respond(404, {message: 'error message'});
          scope.sendEmail();
          $httpBackend.flush();
        });

        it('send Notification error message', function () {
          expect(Notification.error).toHaveBeenCalledWith({message: 'Try again later!', title: '<i class="glyphicon glyphicon-remove"></i> Failed to send result email!'});
        });
      });

    });
  });
}());
