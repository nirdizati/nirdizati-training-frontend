'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

app.service('Prediction', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/index', {});
});

app.service('PredictionResults', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/results', {});
});
