'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

app.service('Prediction', function ($resource, BackEnd) {
  return $resource(PredictionLink.link+'services', {});
});
