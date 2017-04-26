'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

app.service('Prediction', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/index', {});
});

app.service('PredictionResults', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/results', {});
});

app.service('PredictionGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/general', {});
});

app.service('PredictionEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/evaluation', {});
});

app.service('ForecastingArmaLoad', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/workload', {});
});

app.service('ForecastingArmaResources', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/resources', {});
});