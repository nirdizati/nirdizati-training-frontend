'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

//---------------time related predictions------------------------//
//intercase
//--training
app.service('Prediction', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/index', {});
});
//--results
app.service('PredictionResults', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/results', {});
});
app.service('PredictionGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/general', {});
});
app.service('PredictionEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/evaluation', {});
});

//timeseries
//--training and results
app.service('ForecastingTimeGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/general', {});
});
app.service('ForecastingTimeEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/evaluation', {});
});
app.service('ForecastingTimeResults', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/forecast', {});
});




//---------------workload predictions------------------------//
//############### time series ##########################//
//encoding
app.service('ForecastingArmaLoad', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/workload', {});
});

app.service('ForecastingArmaResources', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/resources', {});
});


//---------------acitivity predictions------------------------//

//---------------classification predictions------------------------//