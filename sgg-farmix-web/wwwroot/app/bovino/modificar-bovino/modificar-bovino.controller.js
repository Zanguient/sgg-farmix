﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarBovinoController', modificarBovinoController);

    modificarBovinoController.$inject = ['$scope', 'modificarBovinoService', 'toastr', '$stateParams', '$localStorage', 'establecimientoOrigenService', 'rodeoService', 'estadoService', 'categoriaService', 'razaService', 'alimentoService', 'registrarBovinoService', '$state'];

    function modificarBovinoController($scope, modificarBovinoService, toastr, $stateParams, $localStorage, establecimientoOrigenService, rodeoService, estadoService, categoriaService, razaService, alimentoService, registrarBovinoService, $state) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        vm.cambiarSexo = cambiarSexo;
        vm.idCaravanaChange = idCaravanaChange;
        vm.getFecha = getFecha;
        vm.getPeso = getPeso;
        vm.cargarProvinciasyLocalidades = cargarProvinciasyLocalidades;
        vm.getLocalidades = getLocalidades;
        vm.agregarEstabOrigen = agregarEstabOrigen;
        vm.agregarRodeo = agregarRodeo;
        vm.agregarEstado = agregarEstado;
        vm.agregarCategoria = agregarCategoria;
        vm.agregarRaza = agregarRaza;
        vm.agregarAlimento = agregarAlimento;
        vm.changeEstados = changeEstados;
        vm.changeEstadosXEnfermo = changeEstadosXEnfermo;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        var categorias = [];
        var nroCaravanaOriginal = 0;
        var estados = [];
        //vm.habilitar = true;
        vm.inicializar = inicializar;
        vm.btnVolver = "Volver";
        vm.checkH = false;
        vm.checkM = false;
        vm.establecimiento = new establecimientoOrigenService();
        vm.rodeo = new rodeoService();
        vm.estado = new estadoService();
        vm.categoria = new categoriaService();
        vm.raza = new razaService();
        vm.alimento = new alimentoService();
        $('#datetimepicker4').datetimepicker();
        vm.maxCantidad = 0;
        var localidadesOriginales = [];
        vm.showCantAlimentoOptima = false;

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.habilitar = false;
            modificarBovinoService.inicializar($stateParams.id, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                vm.categorias = [];
                vm.habilitar = false;
                //combos
                for (var i = 0; i < data.estados.length; i++) {
                    if (data.estados[i].idEstado === 4 || data.estados[i].idEstado === 5)
                        data.estados.splice(i, 1);
                }
                vm.estados = data.estados;
                estados = angular.copy(data.estados);
                categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.alimentos = data.alimentos;
                //bovino
                vm.bovino = data.bovino;
                nroCaravanaOriginal = vm.bovino.numCaravana; vm.bovino.fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10);
                if (vm.bovino.genero === 0) {
                    vm.checkH = true;
                    vm.checkM = false;
                    for (var i = 0; i < categorias.length; i++) {
                        if (categorias[i].genero === 0)
                            vm.categorias.push(categorias[i]);
                    }
                }
                else {
                    vm.checkH = false;
                    vm.checkM = true;
                    for (var i = 0; i < categorias.length; i++) {
                        if (categorias[i].genero === 1)
                            vm.categorias.push(categorias[i]);
                    }
                }
                //seteo combos
                vm.bovino.idRaza = data.bovino.idRaza.toString();
                vm.bovino.idCategoria = data.bovino.idCategoria.toString();
                vm.bovino.idEstado = data.bovino.idEstado.toString();
                vm.bovino.idRodeo = data.bovino.idRodeo.toString();
                vm.bovino.idAlimento = data.bovino.idAlimento.toString();
                vm.maxCantidad = ((12 * vm.bovino.peso) / 100).toFixed(2);
                vm.showCantAlimentoOptima = true;
                if (data.bovino.idEstablecimientoOrigen != 0) {
                    vm.bovino.idEstablecimientoOrigen = data.bovino.idEstablecimientoOrigen.toString();
                } else {
                    vm.bovino.idEstablecimientoOrigen = "";
                }
                vm.changeEstados();
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino' && key !== 'idAlimento' && key !== 'cantAlimento' && key !== 'enfermo') {
                        vm.bovino[key] = '';
                    }
                });
                $scope.$parent.unBlockSpinner();
                vm.habilitar = true;
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function cambiarSexo() {
            vm.categorias = [];
            if (vm.checkH === true) {
                vm.checkH = false;
                vm.checkM = true;
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else {
                vm.checkH = true;
                vm.checkM = false;
                for (var j = 0; j < categorias.length; j++) {
                    if (categorias[j].genero === 0)
                        vm.categorias.push(categorias[j]);
                }
            }
        };

        function getPeso() {
            if (vm.bovino.peso) {
                vm.maxCantidad = ((12 * vm.bovino.peso) / 100).toFixed(2);
                vm.showCantAlimentoOptima = true;
            }
            else
                vm.showCantAlimentoOptima = false;            
        };

        function modificar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            //vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            if (!vm.bovino.pesoAlNacer)
                vm.bovino.pesoAlNacer = 0;
            if (!vm.bovino.idBovinoMadre)
                vm.bovino.idBovinoMadre = 0;
            if (!vm.bovino.idBovinoPadre)
                vm.bovino.idBovinoPadre = 0;
            if (!vm.bovino.idEstablecimientoOrigen)
                vm.bovino.idEstablecimientoOrigen = 0;
            if (vm.checkH === true) vm.bovino.genero = 0;
            else if (vm.checkM === true) vm.bovino.genero = 1;
            vm.bovino.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            modificarBovinoService.modificar(vm.bovino).then(function success(data) {
                if (!vm.bovino.pesoAlNacer)
                    vm.bovino.pesoAlNacer = '';
                if (!vm.bovino.idBovinoMadre)
                    vm.bovino.idBovinoMadre = '';
                if (!vm.bovino.idBovinoPadre)
                    vm.bovino.idBovinoPadre = '';
                if (!vm.bovino.idEstablecimientoOrigen)
                    vm.bovino.idEstablecimientoOrigen = '';
                //vm.habilitar = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.success('Se modificó el bovino con éxito ', 'Éxito');
            }, function error(data) {
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function idCaravanaChange() {
            if (vm.bovino.numCaravana !== nroCaravanaOriginal) {
                $scope.$parent.blockSpinner();
                vm.habilitar = false;
                modificarBovinoService.existeIdCaravana(vm.bovino.numCaravana, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                    if (data[0] === "1") {
                        vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", false);
                    }
                    else {
                        vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", true);
                    }
                    $scope.$parent.unBlockSpinner();
                    vm.habilitar = true;
                }, function (error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                })
            }
            else if (vm.bovino.numCaravana === nroCaravanaOriginal) {
                vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", true);
            }
        };

        function getFecha() {
            vm.bovino.fechaNacimiento = $('#datetimepicker4')[0].value;
            var fechaNac = new Date(vm.bovino.fechaNacimiento.substring(6, 10), parseInt(vm.bovino.fechaNacimiento.substring(3, 5)) - 1, vm.bovino.fechaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaNac > fechaHoy) {
                vm.formModificarBovino.fechaNac.$setValidity("max", false);
            }
            else {
                vm.formModificarBovino.fechaNac.$setValidity("max", true);
            }
            if (fechaNac < fechaMin)
                vm.formModificarBovino.fechaNac.$setValidity("min", false);
            else
                vm.formModificarBovino.fechaNac.$setValidity("min", true);
        };

        function cargarProvinciasyLocalidades() {
            $scope.$parent.blockSpinner();
            registrarBovinoService.cargarProvinciasyLocalidades({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function getLocalidades() {
            vm.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt(vm.establecimiento.idProvincia);
            }).ToArray();
        };

        function agregarEstabOrigen() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.establecimiento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.establecimiento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstablecimiento').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Establecimiento Origen ya existe')
                    toastr.warning('El establecimiento origen que intenta registrar, ya existe en este campo', 'Advertencia');
                else
                    $scope.$parent.errorServicio(error.statusText);
            });
        };

        function agregarRodeo() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.rodeo.idCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.rodeo.$save(function (data) {
                toastr.success('Se agrego con éxito el rodeo', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRodeo').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Rodeo ya existe')
                    toastr.warning('El rodeo que intenta registrar, ya existe', 'Advertencia');
                else
                    $scope.$parent.errorServicio(error.statusText);
            });
        };

        function agregarEstado() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.estado.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.estado.$save(function (data) {
                toastr.success('Se agrego con éxito el estado ', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstado').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Estado ya existe')
                    toastr.warning('El estado que intenta registrar, ya existe', 'Advertencia');
                else
                    $scope.$parent.errorServicio(error.statusText);
            });
        };

        function agregarCategoria() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.categoria.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.categoria.$save(function (data) {
                toastr.success('Se agrego con éxito la categoría ', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoCategoria').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Categoria ya existe')
                    toastr.warning('La categoría que intenta registrar, ya existe', 'Advertencia');
                else
                    $scope.$parent.errorServicio(error.statusText);
            });
        };

        function agregarRaza() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.raza.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.raza.$save(function (data) {
                toastr.success('Se agrego con éxito el alimento ', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRaza').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Raza ya existe')
                    toastr.warning('La raza que intenta registrar, ya existe', 'Advertencia');
                else
                    $scope.$parent.errorServicio(error.statusText);
            });
        };

        function agregarAlimento() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.alimento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.alimento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoAlimento').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Alimento ya existe')
                    toastr.warning('El alimento que intenta registrar, ya existe', 'Advertencia');
                else
                    $scope.$parent.errorServicio(error.statusText);
            });
        };

        function changeEstados() {
            if (vm.bovino.genero === '1' || vm.bovino.genero === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 1 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
            else if (vm.bovino.genero === '0' || vm.bovino.genero === 0) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 0 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
        };

        function changeEstadosXEnfermo() {
            if (vm.bovino.enfermo === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].idEstado !== 1)
                        vm.estados.push(estados[i]);
                }
                vm.bovino.idEstado = '3';
            }
            else {
                vm.estados = estados;
                if (vm.bovino.idEstado === '3')
                    vm.bovino.idEstado = '';
            }
        };
    }
})();