﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$timeout', 'toastr'];

    function loginController($scope, $timeout,toastr) {
        var vm = this;

        vm.inicializar = inicializar;
        vm.aceptar = aceptar;

        inicializar();

        function inicializar() {
            var obj = document.getElementById('btn_login');
            obj.click();

        }

        function aceptar() {
            if (validar === true) {
                console.log("la puta madre anduvo");
            }
        }

        function validar() {
            if (isUndefinedOrNull(vm.usuario)) {
                toastr.info("El usuario se encuentra vacio");
                return false;
            }
            if (isUndefinedOrNull(vm.contrasenia)) {
                toastr.info("El contraseña se encuentra vacia");
                return false;
            }
            return true;
        }

        function isUndefinedOrNull(val){
            return angular.isUndefined(val) || val === null 
        }
    }
})();
