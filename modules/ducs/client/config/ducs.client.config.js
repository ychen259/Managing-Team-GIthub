(function () {
  'use strict';

  angular
    .module('ducs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Ducs',
      state: 'ducs.create',
      //type: 'dropdown',

      roles: ['user', 'admin']
    });

    // Add DUC Admin entries to the existing Admin dropbown
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'View all Ducs',
      state: 'ducs.admin-list',
      roles: ['user', 'admin']
    });
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'County Map',
      state: 'ducs.admin-map',
      roles: ['user', 'admin']
    });
  }
}());
