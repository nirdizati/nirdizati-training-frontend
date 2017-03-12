'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

app.service('LogsService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs', {});
});

app.service('WorkloadService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'encode/dailyworkload/:id', {});
});

app.service('ResourcesLoadService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'encode/dailyresources/:id', {});
});

app.service('EventExecutionService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'encode/eventexecutions/:id', {});
});