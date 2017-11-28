'use strict';

(function () {
  // Password controller Spec
  describe('Duc map Controller Test', function () {
    // Initialize global variables
    var AdminMapController,
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
          roles: ['admin']
        };

        // Initialize the Authentication controller
        AdminMapController = $controller('AdminMapController as vm', {
          $scope: scope
        });

      }));

      describe('count() success for All years', function () {
        beforeEach(function () {

          data = [{_id: 1, count: 1},{_id: 2, count: 2}];

          $httpBackend.expectGET('/api/measurements/count').respond(200, data);
          scope.count("All");
          $httpBackend.flush();
        });

        it('expect vm.countyCounts equals to data', function () {
          expect(scope.vm.countyCounts).toEqual(data);
        });
        it('expect $scope.total particular value', function () {
          expect(scope.total).toBe(3);
        });
      });

      describe('count() error for All years', function () {
        beforeEach(function () {

          $httpBackend.expectGET('/api/measurements/count').respond(404, 'error message');
          scope.count("All");
          $httpBackend.flush();
        });

        it('expect $scope.error is defined', function () {
          expect(scope.error).toEqual('Couldn\'t load measurement data!');
        });
      });     

      describe('count() success for a specfic year', function () {
        beforeEach(function () {

          data = [{_id: 1, count: 1},{_id: 2, count: 2}];

          $httpBackend.expectGET('/api/measurements/count/2007').respond(200, data);
          scope.count(2007);
          $httpBackend.flush();
        });

        it('expect vm.countyCounts equals to data', function () {
          expect(scope.vm.countyCounts).toEqual(data);
        });
        it('expect $scope.total particular value', function () {
          expect(scope.total).toBe(3);
        });
      });

      describe('count() error for a specfic year', function () {
        beforeEach(function () {

          $httpBackend.expectGET('/api/measurements/count/2007').respond(404, 'error message');
          scope.count(2007);
          $httpBackend.flush();
        });

        it('expect $scope.error is defined', function () {
          expect(scope.error).toEqual('Couldn\'t load measurement data!');
        });
      });     

      describe('init() function success', function () {
        beforeEach(function () {
          data = [{_id: 2006}, {_id: 2007}];

          spyOn(scope, 'count');
          $httpBackend.expectGET('/api/measurements/activeYears').respond(200, data);
          scope.init();
          $httpBackend.flush();
        });

        it('expect $scope.vm.years is [2006, 2007, "All"]', function () {
          expect(scope.vm.years).toEqual([2006, 2007, 'All']);
        });
        it('expect $scope.year is ALL', function () {
          expect(scope.year).toEqual('All');
        });
        it('expect $scope.count is called', function () {
          expect(scope.count).toHaveBeenCalled();
        });
      });   

      describe('init() function error', function () {
        beforeEach(function () {
          $httpBackend.expectGET('/api/measurements/activeYears').respond(404, 'error message');
          scope.init();
          $httpBackend.flush();
        });

        it('expect $scope.error is defined', function () {
          expect(scope.error).toEqual('Couldn\'t load measurement year data!');
        });
      });  

    });
  });
}());
