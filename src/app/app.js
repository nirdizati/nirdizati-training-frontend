(function(){
  'use strict';

  var app = angular.module('app', [ 'ngMaterial','ngResource' ]);

  app.factory('BackEnd', function() {
	  return {
	      link : 'http://localhost:8090/api/'
	  };
  });

//https://predictbackend.sloppy.zone/


})();
