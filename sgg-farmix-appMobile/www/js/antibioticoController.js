angular.module('starter')
    .controller('AntibioticoController', function ($ionicLoading, $scope, antibioticoService, $rootScope, registrarEventoService, $state, $localStorage) {
        showIonicLoading().then(obtenerAntibiotico).then(function (_antibioticos) {
            if ($rootScope.logueado == false) {
                $state.go('app.bienvenido');
            }
            $scope.antibioticos = _antibioticos;
            $scope.evento = {};
            $scope.txtMiligramaje = {};
            $scope.evento.antibiotico = "0";

        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.registrar = function () {
            if ($scope.txtMiligramaje.value > 0) {
                if ($scope.evento.antibiotico == "0") {
                    alert("Seleccione un antibi\u00F3tico para continuar");
                } else {
                    if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                        alert("Escanee el tag de al menos una vaca para continuar");
                    } else {
                        showIonicLoading().then(registrarEvento).then(function () {
                            alert("Antibi\u00F3tico registrado satisfactoriamente");
                            $rootScope.vacas = null;
                            $rootScope.idVacas = [];
                            $state.go('app.registrarEvento');
                        }).then($ionicLoading.hide).catch($ionicLoading.hide);
                    }
                }
            } else {
                alert("Ingrese una cantidad de miligramos v\u00E1lida.");
            }
        };

        $scope.quitar = function (caravana) {
            for (var i = 0; i < $rootScope.vacas.length; i++) {
                if ($rootScope.vacas[i].numCaravana == caravana) {
                    $rootScope.idVacas.splice(i, 1);
                    $rootScope.vacas.splice(i, 1);
                    return;
                }
            }
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarEvento() {
            var date = new Date();
            var formattedDate = moment(date).format('YYYYMMDDHHmmss');
            var evento = { idTipoEvento: 2, idAntibiotico: $scope.evento.antibiotico, cantidad: $scope.txtMiligramaje.value, fechaHora: formattedDate };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerAntibiotico() {
            return antibioticoService.getDatosAntibiotico($localStorage.campo);
        }
    });