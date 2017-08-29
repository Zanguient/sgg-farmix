﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarEventoController', modificarEventoController);

    modificarEventoController.$inject = ['$scope', 'modificarEventoService', '$stateParams', 'tipoEventoService', 'toastr'];

    function modificarEventoController($scope, modificarEventoService, $stateParams, tipoEventoService, toastr) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.habilitar = false;
        vm.showBotones = true;
        //funciones
        vm.inicializar = inicializar();
        vm.modificar = modificar;
        vm.eliminar = eliminar;
        //variables
        vm.evento = {};
        vm.fechaDeHoy = new Date();

        function inicializar() {
            vm.showBotones = true;
            vm.showSpinner = true;
            vm.habilitar = false;
            modificarEventoService.initModificacion($stateParams.id).then(function success(data) {
                vm.vacunas = data.vacunas;
                vm.tiposEventos = data.tipoEvento;
                vm.listaBovinos = data.listaBovinos.listaBovinos;
                modificarEventoService.getEventoForModificar($stateParams.id).then(function success(data) {
                    //evento
                    vm.evento = data;
                    vm.evento.idTipoEvento = vm.evento.idTipoEvento.toString();
                    vm.evento.idVacuna = vm.evento.idVacuna.toString();
                    var fecha = vm.evento.fechaHora.substring(0, 10).split('/');
                    vm.evento.fechaHora = new Date(fecha[2], (parseInt(fecha[1]) - 1).toString(), fecha[0]);
                    //seteamos a "" las variables 0
                    angular.forEach(vm.evento, function (value, key) {
                        if (parseInt(value) === 0 && key !== 'idEvento') {
                            vm.evento[key] = '';
                        }
                    });
                    vm.showSpinner = false;
                    vm.habilitar = true;
                });
            });
        }//fin inicializar

        function modificar() {
            vm.evento.cantidad = vm.evento.cantidad.toString().replace(',', '.');
            vm.evento.fechaHora = convertirFecha(vm.evento.fechaHora);
            if (vm.evento.idVacuna === '')
                vm.evento.idVacuna = 0;
            if (vm.evento.idAntibiotico === '')
                vm.evento.idAntibiotico = 0;
            if (vm.evento.idCampoOrigen === '')
                vm.evento.idCampoOrigen = 0;
            if (vm.evento.idCampoActual === '')
                vm.evento.idCampoActual = 0;
            if (vm.evento.idAlimento === '')
                vm.evento.idAlimento = 0;
            var ids = [];
            for (var i = 0; i < vm.listaBovinos.length; i++) {
                ids.push(vm.listaBovinos[i].idBovino);
            }
            modificarEventoService.modificar(vm.evento, ids).then(function success(data) {
                vm.habilitar = false;
                vm.showBotones = false;
                toastr.success('Se modificó el evento con éxito ', 'Éxito');
            }, function error(data) {
                toastr.success('La operación no se pudo completar', 'Error');
            })
        }

        function eliminar(id) {
            for (var i = 0; i < vm.listaBovinos.length; i++) {
                if (vm.listaBovinos[i].idBovino === id)
                    vm.listaBovinos.splice(i, 1);
            }
        }

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

    }//fin archivo
})();