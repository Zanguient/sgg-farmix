﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleEventoController', detalleEventoController);

    detalleEventoController.$inject = ['$scope', 'detalleEventoService', '$stateParams', 'toastr'];

    function detalleEventoController($scope, detalleEventoService, $stateParams, toastr) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.disabled = true;
        //funciones
        vm.inicializar = inicializar();
        //variables
        vm.evento = {};

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.disabled = true;
            vm.itemsPorPagina = 9;
            vm.idEvento = $stateParams.id;
            detalleEventoService.getEvento($stateParams.id).then(function success(data) {
                //evento
                vm.evento = data;
                vm.rowCollection = vm.evento.listaBovinos;
                vm.disabled = false;
                //seteamos a "" las variables 0
                angular.forEach(vm.evento, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idEvento') {
                        vm.evento[key] = '';
                    }
                });
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        }//fin inicializar


    }//fin archivo
})();