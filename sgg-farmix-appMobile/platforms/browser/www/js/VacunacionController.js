angular.module('starter')
    .controller('VacunacionController', function ($ionicLoading, $scope, vacunaService, $rootScope, registrarEventoService, $state) {
        showIonicLoading().then(obtenerVacuna).then(function (_vacunas) {
            $scope.vacunas = _vacunas;
        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.registrar = function () {
            if ($rootScope.vacas == undefined) {
                alert("Escanee el tag de al menos una vaca para continuar");
            } else {
                showIonicLoading().then(registrarEvento).then(function () {
                    alert("Vacunacion registrada satisfactoriamente");
                    $rootScope.vacas = [];
                    $state.go('app.registrarEvento');
                }).then($ionicLoading.hide).catch($ionicLoading.hide);
            }
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarEvento() {
            var evento = { idTipoEvento: 1, idVacuna: $scope.vacunaSeleccionada, cantidad: $scope.txtMiligramaje };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerVacuna() {
            return vacunaService.getDatosVacuna();
        }
    });