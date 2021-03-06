﻿angular.module('starter')
    .service('antibioticoServiceHTTP', function ($http, portalService) {
        var antibioticoUrl = portalService.getUrlServer() + "api/Antibiotico/GetList?idCampo=";
        this.getDatosAntibiotico = function (idCampo) {
            return $http.get(antibioticoUrl + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                return respuesta.data;
            });
        };
    })

    .service('antibioticoServiceDB', function ($q, $rootScope) {
        this.getDatosAntibiotico = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Antibiotico", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.actualizarAntibioticos = function (antibioticos) {
            var sqlStatments = [ "DELETE FROM Antibiotico" ];
            antibioticos.forEach(function (antibiotico) {
                sqlStatments.push(["INSERT OR REPLACE INTO Antibiotico(idAntibiotico, nombre) VALUES(?, ?)", [antibiotico.idAntibiotico, antibiotico.nombre]]);
            });

            return $q(function (resolve, reject) {
                $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
            });
        }

        function rows(resultado) {
            var items = [];
            for (var i = 0; i < resultado.rows.length; i++) {
                items.push(resultado.rows.item(i));
            }
            return items;
        };
    })

    .service('antibioticoService', function (antibioticoServiceHTTP, antibioticoServiceDB, conexion) {
        this.getDatosAntibiotico = function (idCampo) {
            if (conexion.online()) {
                var antibioticos;
                return antibioticoServiceHTTP.getDatosAntibiotico(idCampo)
                    .then(function (respuesta) { antibioticos = respuesta; })
                    .then(function () { antibioticoServiceDB.actualizarAntibioticos(antibioticos); })
                    .then(function () { return antibioticos; });
            } else {
                return antibioticoServiceDB.getDatosAntibiotico();
            }
        }
    });