'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');
var ResultsUrl = "http://193.40.11.46/core_services"
app.service('listAvailableResultsFiles', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/listAvailableResultsFiles', {});
});
app.service('listAvailableRules', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/listAvailableRules', {});
});
app.service('listGetConfStatus', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/getConfStatus', {});
});
app.service('listAvailableThreshold', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/listAvailableThreshold', {});
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

app.service('fileToJsonGeneralResults', function ($resource, BackEnd) {
  return $resource(ResultsUrl + '/fileToJsonGeneralResults', {});
});


