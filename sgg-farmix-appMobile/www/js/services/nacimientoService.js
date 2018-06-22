﻿angular.module('starter')
    .service('nacimientoServiceHTTP', function ($http, portalService) {
        var nacimientoUrl = portalService.getUrlServer() + "api/Bovino/registrarNacimientos";

        this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento, idToro, idCampo) {
            $http({
                method: 'POST',
                url: nacimientoUrl,
                params: { fechaNacimiento: fechaNacimiento, listaMadres: listaBovinosMadres.toString(), toro: idToro, codigoCampo: idCampo},
                headers: portalService.getHeadersServer()
            });
        }
    })

     .service('nacimientoServiceDB', function ($q, $rootScope) {
         this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento, idToro, idCampo) {
             $rootScope.db.transaction(function (tx) {
                 tx.executeSql("INSERT OR IGNORE INTO Nacimiento(fechaNacimiento) VALUES(?)", [fechaNacimiento]);
                 var idNacimiento = tx.executeSql("SELECT last_insert_rowid() FROM Nacimiento", [],
                         function (resultado) {
                             resolve(resultado.rows.item(0));
                         }, reject);
                 listaBovinosMadres.forEach(function (id) {
                     tx.executeSql("INSERT OR IGNORE INTO BovinosXNacimiento(idNacimiento, idBovino) VALUES(?, ?)", [idNacimiento, id]);
                 })
             });
         };

         this.getNacimientosParaActualizarBackend = function () {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM Nacimiento", [],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.getBovinosXNacimientoParaActualizarBackend = function (idNacimiento) {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM BovinosXNacimiento WHERE idNacimiento=?", [idNacimiento],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.limpiarNacimientos = function () {
             $rootScope.db.executeSql("DELETE FROM BovinosXNacimiento");
             $rootScope.db.executeSql("DELETE FROM Nacimiento");
         };
     })



    .service('nacimientoService', function (nacimientoServiceHTTP, nacimientoServiceDB, $rootScope, $localStorage) {
        this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento, idToro, idCampo) {
            if ($rootScope.online) {
                nacimientoServiceHTTP.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro, idCampo);
            } else {
                $localStorage.actualizar = false;
                nacimientoServiceDB.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro, idCampo);
            }
        }

        this.actualizarNacimientosBackend = function () {
            var nacimientos;
            return nacimientoServiceDB.getNacimientosParaActualizarBackend()
                .then(function (respuesta) { nacimientos = respuesta; })
                .then(function () {
                    if (nacimientos.length > 0) {
                        nacimientos.forEach(function (nacimiento) {
                            var bovinos = nacimientoServiceDB.getBovinosXNacimientoParaActualizarBackend(nacimiento.idNacimiento);
                            bovinos.forEach(function (bovino) {
                                listaBovinosMadres.push = [bovino.idBovino];
                            })
                            nacimientoServiceHTTP.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro, idCampo);
                        }).then(function () {
                            nacimientoServiceDB.limpiarNacimientos();
                        })
                    }
                });
        }
    });