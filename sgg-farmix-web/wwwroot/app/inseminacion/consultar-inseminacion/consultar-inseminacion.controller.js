﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService', 'toastr'];

    function consultarInseminacionController($scope, consultarInseminacionService, toastr) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.itemsPorPagina = 9;
        vm.mostrarTablaHembrasServicio = false;
        vm.mostrarTablaServiciosSinConfirmar = false;
        vm.mostrarTablaPreniadasPorParir = false;
        vm.mostrarTablaLactanciasActivas = false;
        //metodos
        vm.inicializar = inicializar;
        vm.hembrasParaServicio = hembrasParaServicio;
        vm.serviciosSinConfirmar = serviciosSinConfirmar;
        vm.preniadasPorParir = preniadasPorParir;
        vm.lactanciasActivas = lactanciasActivas;
        inicializar();

        function inicializar() {
            vm.showSpinner = true;
            consultarInseminacionService.inicializar().then(function success(data) {
                vm.init = data;
                vm.showSpinner = false;
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function hembrasParaServicio() {
            mostrarTablaActual('HembrasServicio');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }
        function serviciosSinConfirmar() {
            //mostrarTablaActual('ServiciosSinConfirmar');
            vm.showSpinner = true;
            consultarInseminacionService.consultarServicioSinConfirmar().then(
            function success(data) {
                var fechaHoy = new Date();
                fechaHoy = moment(convertirFecha(fechaHoy));
                vm.serviciosSinConfirm = {};
                vm.serviciosSinConfirm.menor60 = Enumerable.From(data).Where(function (x) {
                    var fechaInsem = x.fechaInseminacion.split('/');
                    fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                    return fechaHoy.diff(fechaInsem, 'days') < 60
                }).Count();
                vm.serviciosSinConfirm.entre90y60 = Enumerable.From(data).Where(function (x) {
                    var fechaInsem = x.fechaInseminacion.split('/');
                    fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                    return fechaHoy.diff(fechaInsem, 'days') >= 60 && fechaHoy.diff(fechaInsem, 'days') < 90
                }).Count();
                vm.serviciosSinConfirm.mas90 = Enumerable.From(data).Where(function (x) {
                    var fechaInsem = x.fechaInseminacion.split('/');
                    fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                    return fechaHoy.diff(fechaInsem, 'days') > 90
                }).Count();
                vm.showSpinner = false;
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }
        function preniadasPorParir() {
            mostrarTablaActual('PreniadasPorParir');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }
        function lactanciasActivas() {
            mostrarTablaActual('LactanciasActivas');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }

        //Puede ser 'HembraServicio', 'ServiciosSinConfirmar','PreniadasPorParir' o 'LactanciasActivas'
        function mostrarTablaActual(tablaActual) {
            if (mostrarServiciosYVacas === true) {
                mostrarServiciosYVacas = false;
            }
            if (tablaActual === 'HembrasServicio') {
                mostrarTablaHembrasServicio = true;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'ServiciosSinConfirmar') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = true;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'PreniadasPorParir') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = true;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'LactanciasActivas') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = true;
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
            return año + '/' + mes + '/' + dia;
        }
    }
})();
