﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleInseminacionService', detalleInseminacionService);

    detalleInseminacionService.$inject = ['$http', 'portalService'];

    function detalleInseminacionService($http, portalService) {
        var service = {
            getInseminacion: getInseminacion,
            getHembrasServicio: getHembrasServicio,
            getLactancias: getLactancias
        };

        function getInseminacion(fecha) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Get',
                params: { fechaInseminacion: fecha }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getHembrasServicio() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/HembrasServicio'
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getLactancias() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Lactancias'
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();