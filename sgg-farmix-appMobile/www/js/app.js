angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      if (/*cordova.platformId === "ios" &&*/ window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.bienvenido', {
        url: '/bienvenido',
      views: {
        'menuContent': {
            templateUrl: 'views/bienvenido.html',
            controller: 'Controller'
        }
      }
    })
    .state('app.leer', {
        url: '/leer',
        views: {
            'menuContent': {
                templateUrl: 'views/leer.html'
            }
        }
    })
    .state('app.resultado/:id', {
        url: '/resultado/:id',
        views: {
            'menuContent': {
                templateUrl: 'views/resultado.html',
                controller: 'ResultadoController'
            }
        }
    })
    .state('app.escribir', {
        url: '/escribir',
        views: {
            'menuContent': {
                templateUrl: 'views/escribir.html',
                controller: 'EscribirController'
            }
        }
    })
     .state('app.registrarEvento', {
        url: '/registrarEvento',
        views: {
            'menuContent': {
                templateUrl: 'views/registrarEvento.html',
                controller: 'RegistrarEventoController'
            }
        }
     }).state('app.vacunacion', {
         url: '/vacunacion',
         views: {
             'menuContent': {
                 templateUrl: 'views/vacunacion.html',
                 controller: 'VacunacionController'
             }
         }
     });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/bienvenido');
});
