﻿angular.module('starter')
    .service('servicio', function (bovinoService, inseminacionService, nacimientoService, registrarEventoService, verificacionInseminacionService) {
        this.posts = function () {
            bovinoService.actualizarBovinosBackend();
            verificacionInseminacionService.actualizarVerificacionesBackend();
            registrarEventoService.actualizarEventosBackend();
            inseminacionService.actualizarInseminacionesBackend();
            nacimientoService.actualizarNacimientosBackend();
        }
    })

    .service('conexion', function ($rootScope, servicio, $localStorage) {
        function cambiarEstado(online) {
            $rootScope.$apply(function () {
                $rootScope.online = online;
                if (online && $localStorage.actualizar) {
                    servicio.posts();
                    $localStorage.actualizar = false;
                } else if (!online){
                    alert("Trabajando sin conexi\u00F3n")
                }
            });
        }

        //funcion que permite obtener el estado de la conexión 
        this.online = function () {
            return $rootScope.online;
        };

        $rootScope.online = navigator.onLine ? navigator.onLine : navigator.connection.type != "none";
        document.addEventListener("online", function () { cambiarEstado(true); }, false);
        document.addEventListener("offline", function () { cambiarEstado(false); }, false);
    });