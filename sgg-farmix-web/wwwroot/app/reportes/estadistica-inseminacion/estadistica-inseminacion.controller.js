﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaInseminacionController', estadisticaInseminacionController);

    estadisticaBovinoController.$inject = ['$location', '$scope', '$localStorage', 'estadisticaInseminacionService', 'toastr'];

    function estadisticaInseminacionController($location, $scope, $localStorage, estadisticaInseminacionService, toastr) {
        var vm = $scope;
        vm.title = 'estadisticaInseminacionController';
        window.scrollTo(0, 0);
        init();

        function init() {
            $scope.$parent.blockSpinner();
            estadisticaInseminacionService.inicializar({ codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta }, function (data) {
                $scope.obj = data;
                cargarGraficoXCategoriaHembrasEfectividad($scope.obj.inseminacionXCategoriaHembra);
                cargarGraficoXCategoriaMachosEfectividad($scope.obj.inseminacionXCategoriaMacho);
                cargarGraficoRazaEfectividad($scope.obj.inseminacionXRaza);
                cargarGraficoTipoEfectividad($scope.obj.inseminacionXTipo);
                //cargarGraficoTorosInseminacionesExitosas($scope.obj.inseminacionExitosaXToro);
                //cargarGraficoTorosMasHijos($scope.obj.hijosXToro);
                //cargarGraficoVacasInseminacionesFallidas($scope.obj.inseminacionFallidaXVaca);
                //cargarGraficoVacasMasHijos($scope.obj.hijosXVaca);
                //cargarGraficoAbortosXVaca($scope.obj.abortosXVaca);
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }

        function cargarGraficoXCategoriaHembrasEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoCategoriasPorHembrasEfectividad');
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Categoria', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].categoria, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad de Bovinos Hembra por Categoría',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Categorías'
                    },
                    'legend': {
                        'position': 'bottom',
                        'textStyle': { 'fontSize': 12 }
                    }
                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById('descargaGraficoCategoriasPorHembrasEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoXCategoriaMachosEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoCategoriasPorMachosEfectividad');
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Categoria', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].categoria, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad de Bovinos Machos por Categoría',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Categorías'
                    },
                    'legend': {
                        'position': 'bottom',
                        'textStyle': { 'fontSize': 12 }
                    }
                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById('descargaGraficoCategoriasPorMachosEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoRazaEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoRazaEfectividad');
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Raza', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].raza, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad de Bovinos Hembra por Raza',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Razas'
                    },
                    'legend': {
                        'position': 'bottom',
                        'textStyle': { 'fontSize': 12 }
                    }
                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById('descargaGraficoRazaEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoTipoEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoTipoEfectividad');
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Tipo', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].tipo, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad según el tipo de Inseminación',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Tipos'
                    },
                    'legend': {
                        'position': 'bottom',
                        'textStyle': { 'fontSize': 12 }
                    }
                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById('descargaGraficoTipoEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        //function cargarGraficoTorosInseminacionesExitosas(data) {
        //    var datos = data;

        //    google.charts.load('current', { 'packages': ['corechart'] });
        //    google.charts.setOnLoadCallback(drawChart);

        //    function drawChart() {
        //        var container = document.getElementById('graficoNacimientosPorMes');
        //        var chart = new google.visualization.LineChart(container);
        //        var dataTable = new google.visualization.DataTable();

        //        dataTable.addColumn({ id: 'mes', label: 'Mes', type: 'string' });
        //        dataTable.addColumn({ id: 'cantidad', label: 'Cantidad', type: 'number' });

        //        for (var i = 0; i < datos.length; i++) {
        //            dataTable.addRows([[datos[i].mes.toString(), datos[i].cantidadNacimientos]]);
        //        }

        //        var options = {
        //            'title': 'Cantidad de Nacimientos por Mes',
        //            hAxis: {
        //                title: 'Meses'
        //            },
        //            vAxis: {
        //                title: 'Cantidad de bovinos'
        //            },
        //            'legend': {
        //                'position': 'bottom',
        //                'textStyle': { 'fontSize': 12 }
        //            }
        //        };
        //        chart.draw(dataTable, options);

        //        var my_anchor = document.getElementById('descargaGraficoNacimientosPorMes');
        //        my_anchor.href = chart.getImageURI();
        //        google.visualization.events.addListener(chart, 'ready', function () {
        //            my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
        //        });
        //    }
        //}
        //function cargarGraficoTorosMasHijos(data) { }
        //function cargarGraficoVacasInseminacionesFallidas(data) { }
        //function cargarGraficoVacasMasHijos(data) { }
        //function cargarGraficoAbortosXVaca(data) { }

    }//fin controlador
})();
