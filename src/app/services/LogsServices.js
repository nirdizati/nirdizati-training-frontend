'use strict'
/* global angular */

var app = angular.module('app');

app.service('LogsService', function ($resource, BackEnd) {
	var link = $resource(BackEnd.link+'/logs', {});
	alert(link);
  return link;
});
