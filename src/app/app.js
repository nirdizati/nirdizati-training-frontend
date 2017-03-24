(function(){
  'use strict';

  var app = angular.module('app', [ 'ngMaterial' ]);

  app.factory('BackEnd', function() {
	  return {
	      // link : 'http://localhost:8080/api/',
	      // link : 'http://localhost:8000/',
	      link : 'http://193.40.11.46/'
	      // link : 'https://predictbackend.sloppy.zone/'
	  };
  });

  app.factory('PredictionLink', function() {
	  return {
	      // link : 'http://localhost:8000/',
	      link : 'http://193.40.11.46/'
	  };
  });


})();
