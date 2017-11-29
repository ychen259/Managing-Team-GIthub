(function () {
  'use strict';

  angular
    .module('ducs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
      $stateProvider
          .state('ducs', {
              abstract: true,
              url: '/ducs',
              template: '<ui-view/>'
          })
          .state('ducs.create', {
              url: '/create',
              templateUrl: '/modules/ducs/client/views/form-duc.client.view.html',
              controller: 'DucsController',
              controllerAs: 'vm',
              data: {
                  roles: ['user', 'admin'],
                  pageTitle: 'Ducs Create'
              }
          })

          .state('ducs.result', {
              url: '/result',
              templateUrl: '/modules/ducs/client/views/results-ducs.client.view.html',
              controller: 'DucsResultController',
              controllerAs: 'vm',
              params: {
                  object_id: null,
                  metric: null
              },
              data: {
                  roles: ['user', 'admin'],
                  pageTitle: 'Ducs Result'
              }
          })
          .state('ducs.admin-map', {
              url: '/admin/map',
              templateUrl: '/modules/ducs/client/views/admin.map.client.view.html',
              controller: 'AdminMapController',
              controllerAs: 'vm',
              data: {
                  roles: ['admin'],
                  pageTitle: 'Duc County Map'
              }
          })
          .state('ducs.admin-list', {
              url: '/admin/list',
              templateUrl: '/modules/ducs/client/views/admin.list-ducs.client.view.html',
              controller: 'DucsListController',
              controllerAs: 'vm',
              data: {
                  roles: ['admin'],
                  pageTitle: 'View all Ducs'
              }
          })
          .state('ducs.Instructions', {
              url: '/Instructions',
              templateUrl: '/modules/ducs/client/views/Instructions-duc.client.view.html',
              controller: 'InstructionsController',
              controllerAs: 'vm',
              data: {
                  //roles: '*',
                  pageTitle: 'How-to Run a DUC'
              }
          });
  }

}());
