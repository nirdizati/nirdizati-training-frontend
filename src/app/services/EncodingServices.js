'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

//---------------time related predictions------------------------//

//intercase

//time-series
app.service('TimeseriesEncoding', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/encode', {});
});

//index-based
app.service('IndexBasedEncoding', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'encoding/indexbased', {});
});


//---------------workload predictions------------------------//
//#
app.service('ForecastingArmaLoad', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/workload', {});
});

app.service('ForecastingArmaResources', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/resources', {});
});


//---------------acitivity predictions------------------------//

//---------------classification predictions------------------------//