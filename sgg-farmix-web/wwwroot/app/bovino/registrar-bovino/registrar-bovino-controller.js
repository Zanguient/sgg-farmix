﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService'];

    function registrarBovinoController($scope, registrarBovinoService) {
        var vm = $scope;
        //funciones
        vm.registrar = registrar;
        vm.validar = validar;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        //vm.inicializar = inicializar;
        //inicializar();

        $scope.load = function () {
            registrarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
            });
            vm.bovino = new registrarBovinoService();
        };
        $scope.load();

        function registrar() {            
            vm.bovino.$save(function (data) {

            });

        }

        function validar() {

        }
    }
})();