(function () {
    'use strict';

    angular
        .module('ducs')
        .controller('InstructionsController', InstructionsController);

    InstructionsController.$inject = ['DucsService'];

    function InstructionsController(DucsService) {
        var vm = this;
        console.log("Instructions controller loaded");
    }
}());
