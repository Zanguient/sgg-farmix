﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarBovinoService', modificarBovinoService);

    modificarBovinoService.$inject = ['$http', 'portalService'];

    function modificarBovinoService($http, portalService) {
        return {
            inicializar: inicializar
        };

        function inicializar(idBovino) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initModificacion',
                params: {idBovino: idBovino}
            }).then(
            function(data) {
                return data.data || [];
            });
        }

        return {
            service: modificarBovinoService
        }
    }
})();