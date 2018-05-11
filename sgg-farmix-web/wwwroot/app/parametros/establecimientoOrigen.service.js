﻿(function () {
    angular.module('app')
        .factory('establecimientoOrigenService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/EstablecimientoOrigen/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();