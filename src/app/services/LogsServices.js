'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

app.service('LogsService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs', {});
});

app.service('WorkloadService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'encode/dailyworkload/:id', {});
});