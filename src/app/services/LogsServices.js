'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

app.service('LogsService', function ($resource, BackEnd) {
  return $resource(BackEnd.link+'logs', {});
});

// app.service('LogsServiceGet', function ($resource, BackEnd) {
//   return $resource(BackEnd.link+'logs', {'query': {method: 'GET', isArray: true }});
// });
