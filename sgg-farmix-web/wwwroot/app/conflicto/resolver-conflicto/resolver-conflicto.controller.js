﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope', '$stateParams', 'resolverConflictoService', 'toastr', '$state', '$localStorage'];

    function resolverConflictoController($scope, $stateParams, resolverConflictoService, toastr, $state, $localStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        /////VARIABLES
        vm.inseminacionResultante = {};
        vm.tactoResultante = {};

        /////METODOS
        vm.init = init();
        vm.seleccionarInseminacion = seleccionarInseminacion;
        vm.seleccionarTacto = seleccionarTacto;
        vm.seleccionarPropiedadInseminacion = seleccionarPropiedadInseminacion;
        vm.seleccionarPropiedadTacto = seleccionarPropiedadTacto;
        vm.resolverInseminacion = resolverInseminacion;
        vm.resolverTacto = resolverTacto;
        vm.isUndefinedOrNull = isUndefinedOrNull;
        vm.seleccionarToros = seleccionarToros;

        function init() {
            $scope.$parent.blockSpinner();
            if (($stateParams.idTacto && $stateParams.idTactoConfl && $stateParams.fechaTacto && $stateParams.fechaTactoConfl) || ($stateParams.idInseminacion && $stateParams.idInseminConfl)) {
                if (!$stateParams.idTacto)
                    $stateParams.idTacto = 0;
                if (!$stateParams.idTactoConfl)
                    $stateParams.idTactoConfl = 0;
                if (!$stateParams.idInseminacion)
                    $stateParams.idInseminacion = 0;
                if (!$stateParams.idInseminConfl)
                    $stateParams.idInseminConfl = 0;
                if (!$stateParams.fechaTacto)
                    $stateParams.fechaTacto = '';
                if (!$stateParams.fechaTactoConfl)
                    $stateParams.fechaTactoConfl = '';
                resolverConflictoService.getDatos($stateParams.idTacto, $stateParams.fechaTacto, $stateParams.idTactoConfl, $stateParams.fechaTactoConfl, $stateParams.idInseminacion, $stateParams.idInseminConfl).then(function success(data) {
                    vm.tactoAnterior = data.tactoAnterior; //Es el ultimo tacto registrado en base
                    vm.tactoNuevo = data.tactoNuevo; //Es el tacto que se intento registrar en base, pero produjo un conflicto
                    vm.inseminacionAnterior = data.inseminacionAnterior; //Es la ultima inseminacion registrada en base
                    vm.inseminacionNueva = data.inseminacionNueva; //Es la inseminacion que se intento registrar pero produjo un conflicto
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
                $scope.$parent.unBlockSpinner();
            }
        }

        function seleccionarInseminacion(inseminacion) {
            vm.inseminacionResultante.fechaInseminacion = inseminacion.fechaInseminacion;
            vm.inseminacionResultante.tipoInseminacion = inseminacion.tipoInseminacion;
            vm.inseminacionResultante.idTipoInseminacion = inseminacion.idTipoInseminacion;
        }

        function seleccionarToros(toros) {
            vm.inseminacionResultante.listaBovinos = toros;
        }

        function seleccionarTacto(tacto) {
            vm.tactoResultante.fechaTacto = tacto.fechaTacto;
            vm.tactoResultante.tipoTacto = tacto.tipoTacto;
            vm.tactoResultante.idTipoTacto = tacto.idTipoTacto;
            vm.tactoResultante.exitoso = tacto.exitoso;
        }

        function seleccionarPropiedadInseminacion(inseminacion, propiedad) {
            vm.inseminacionResultante[propiedad] = inseminacion[propiedad];
            vm.inseminacionResultante.idTipoInseminacion = inseminacion.idTipoInseminacion;
        }

        function seleccionarPropiedadTacto(tacto, propiedad) {
            vm.tactoResultante[propiedad] = tacto[propiedad];
            vm.tactoResultante.idTipoTacto = tacto.idTipoTacto;
        }
        

        function resolverInseminacion() {
            $scope.$parent.blockSpinnerSave();
            var obj = { inseminacionAnterior: vm.inseminacionAnterior, inseminacionNueva: vm.inseminacionNueva, inseminacionResultante: vm.inseminacionResultante };
            resolverConflictoService.resolver(obj).then(function success(data) {
                $scope.$parent.unBlockSpinnerSave();
                $('#modalConfirmResolverInseminacionConflictiva').modal('hide');
                toastr.success('Conflicto resuelto con éxito');
                $localStorage.proviene = 'resolver';
                $state.go('home.conflictos');
            }, function error(error) {
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function resolverTacto() {
            $scope.$parent.blockSpinnerSave();
            var obj = { tactoAnterior: vm.tactoAnterior, tactoNuevo: vm.tactoNuevo, tactoResultante: vm.tactoResultante };
            resolverConflictoService.resolver(obj).then(function success(data) {
                $scope.$parent.unBlockSpinnerSave();
                $('#modalConfirmResolverTactoConflictivo').modal('hide');
                toastr.success('Conflicto resuelto con éxito');
                $localStorage.proviene = 'resolver';
                $state.go('home.conflictos');
            }, function error(error) {
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null
        }
    }
})();
