'use strict';

(function () {
  // Password controller Spec
  describe('Duc List Controller Test', function () {
    // Initialize global variables
    var DucsListController,
      scope,
      $httpBackend,
      $stateParams,
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

    describe('Duc List function test', function () {
      beforeEach(inject(function ($controller, $rootScope, _UsersService_, _Authentication_, _$stateParams_, _$httpBackend_, _$location_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);

        // Ignore parent template gets on state transition
        $httpBackend.whenGET('/modules/core/client/views/404.client.view.html').respond(200);
        $httpBackend.whenGET('/modules/core/client/views/404.client.view.html').respond(200);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['admin']
        };

        // Initialize the Authentication controller
        DucsListController = $controller('DucsListController as vm', {
          $scope: scope
        });

        spyOn(scope, 'rm');
      }));

      describe('List success', function () {
      	beforeEach(function () {
          data = [{
             "zipcode": 94523,
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'       
          },
          {
             "zipcode": 94523,
             "time": 1,
             "can_depths": [2,3,4,5,6],
             "notes": 'some notes'       
          }];

          $httpBackend.expectGET('/api/measurements').respond(200, data);
          scope.list();
          $httpBackend.flush();
        });

        it('measurement is defined', function () {
          expect(scope.vm.measurements).toEqual(data);
        });
      });

      describe('List error', function () {
      	beforeEach(function () {
          $httpBackend.expectGET('/api/measurements').respond(404, 'error message');
          scope.list();
          $httpBackend.flush();
        });

        it('error message', function () {
          expect(scope.error).toBe('Couldn\'t load measurement data!');
        });
      });

      describe('Delete success', function () {
      	beforeEach(function () {
          data = {
             "_id": 123456,
             "zipcode": 94523,
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'  
          }
          $httpBackend.expectDELETE('/api/measurements/' + data._id).respond(200);
          scope.remove(data._id);
          $httpBackend.flush();
        });

        it('remove function have been called', function () {
          expect(scope.rm).toHaveBeenCalled();
        });
      });

      describe('Delete error', function () {
      	beforeEach(function () {
          data = {
             "_id": 123456,
             "zipcode": 94523,
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'  
          }
          $httpBackend.expectDELETE('/api/measurements/' + data._id).respond(404, 'error message');
          scope.remove(data._id);
          $httpBackend.flush();
        });

        it('error message', function () {
          expect(scope.error).toBe('Unable to delete measurement!');
        });
      });

      describe('Export success', function () {
      	beforeEach(function () {
          data = [{
             "zipcode": 94523,
             "time": 2,
             "can_depths": [1,2,3,4,5],
             "notes": 'some notes'       
          },
          {
             "zipcode": 94523,
             "time": 1,
             "can_depths": [2,3,4,5,6],
             "notes": 'some notes'       
          }];
          $httpBackend.expectGET('/api/measurements/export').respond(200, data);
          scope.exportCSV();
          $httpBackend.flush();
        });

        it('list is defined', function () {
          expect(scope.list).toEqual(data);
        });
        it('file name is defined', function () {
          expect(scope.filename).toBe('DUC-List.csv');
        });

      });

      describe('Export error', function () {
      	beforeEach(function () {
          $httpBackend.expectGET('/api/measurements/export').respond(404, 'error message');
          scope.exportCSV();
          $httpBackend.flush();
        });

        it('error message', function () {
          expect(scope.error).toBe('Unable to export measurements!');
        });
      });

    });
  });
}());
