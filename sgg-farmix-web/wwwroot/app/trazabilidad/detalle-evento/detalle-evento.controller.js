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
            //vm.showSpinner = true;
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
                //vm.showSpinner = false;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }//fin inicializar


    }//fin archivo
})();