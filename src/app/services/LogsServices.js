'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

app.service('LogsService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs', {});
});

app.service('WorkloadService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs/traces', {});
});

app.service('ResourcesLoadService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs/resources', {});
});

app.service('EventExecutionService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs/events', {});
});

app.service('LogsList', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs/list', {});
});

