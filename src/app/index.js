'use strict';

angular.module('angularMaterialAdmin', ['ngAnimate', 'ngCookies',
  'ngSanitize', 'ui.router', 'ngMaterial', 'nvd3', 'app' , 'md.data.table', 'ngResource', 'ngFileUpload', 'googlechart'])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                    $mdIconProvider, $locationProvider, $httpProvider) {
    $stateProvider
      .state('home', {
        url: '',
        templateUrl: 'app/views/main.html',
        controller: 'MainController',
        controllerAs: 'vm',
        abstract: true
      })
      .state('home.dashboard', {
        url: '/dashboard',
        controller: 'DashboardController',
        controllerAs: 'vm',
        templateUrl: 'app/views/dashboard.html',
        data: {
          title: 'Dashboard'
        }
      })
      .state('home.prediction', {
        url: '/prediction',
        controller: 'PredictionMethodController',
        controllerAs: 'vm',
        templateUrl: 'app/views/prediction.html',
        data: {
          title: 'Prediction Method'
        }
      })
      //time based predictions
      .state('home.prediction-intercase', {
        url: '/prediction/time/intercase',
        controller: 'IntercaseController',
        controllerAs: 'vm',
        templateUrl: 'app/views/time/intercase.html',
        data: {
          title: 'Time Prediction'
        }
      })
      .state('home.prediction-timeseries', {
        url: '/prediction/time/timeseries',
        controller: 'TimeForecastingController',
        controllerAs: 'vm',
        templateUrl: 'app/views/time/timeseries.html',
        data: {
          title: 'Time Prediction'
        }
      })
      .state('home.prediction-regression', {
        url: '/prediction/time/regression',
        controller: 'TimeRegressionController',
        controllerAs: 'vm',
        templateUrl: 'app/views/time/regression.html',
        data: {
          title: 'Time Prediction'
        }
      })
      //workload predictions
      .state('home.prediction-forecasting', {
        url: '/prediction/workload/timeseries',
        controller: 'ForecastingController',
        controllerAs: 'vm',
        templateUrl: 'app/views/workload/forecasting.html',
        data: {
          title: 'Forecasting'
        }
      })
      //activity predictions
      //classification predictions
      .state('home.prediction-classification', {
        url: '/prediction/classification',
        controller: 'ClassificationController',
        controllerAs: 'vm',
        templateUrl: 'app/views/classification/classification.html',
        data: {
          title: 'Classification'
        }
      })
      .state('home.logs', {
        url: '/logs',
        controller: 'LogsController',
        controllerAs: 'vm',
        templateUrl: 'app/views/logs.html',
        data: {
          title: 'Logs'
        }
      });

    // $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/dashboard');

    $mdThemingProvider
      .theme('default')
        .primaryPalette('grey', {
          'default': '600'
        })
        .accentPalette('teal', {
          'default': '500'
        })
        .warnPalette('defaultPrimary');

    $mdThemingProvider.theme('dark', 'default')
      .primaryPalette('defaultPrimary')
      .dark();

    $mdThemingProvider.theme('grey', 'default')
      .primaryPalette('grey');

    $mdThemingProvider.theme('custom', 'default')
      .primaryPalette('defaultPrimary', {
        'hue-1': '50'
    });

    $mdThemingProvider.definePalette('defaultPrimary', {
      '50':  '#E8EAF6',
      '100': '#C5CAE9',
      '200': '#9FA8DA',
      '300': '#7986CB',
      '400': '#5C6BC0',
      '500': '#3F51B5',
      '600': '#3949AB',
      '700': '#303F9F',
      '800': '#283593',
      '900': '#1A237E',
      'A100': '#8C9EFF',
      'A200': '#536DFE',
      'A400': '#3D5AFE',
      'A700': '#304FFE'
    });

    $mdIconProvider.icon('user', 'assets/images/user.svg', 64);

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });

