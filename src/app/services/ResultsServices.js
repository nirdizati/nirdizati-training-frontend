'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');
var ResultsUrl = "http://127.0.0.1:8000/core_services"
app.service('listAvailableResultsFiles', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/listAvailableResultsFiles', {});
});

app.service('listAvailableResultsPrefix', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/listAvailableResultsPrefix', {});
});

app.service('listAvailableResultsLog', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/listAvailableResultsLog', {});
});

app.service('fileToJsonResults', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/fileToJsonResults', {});
});