(function(){
  'use strict';

  var app = angular.module('app', [ 'ngMaterial' ]);

  app.factory('BackEnd', function() {
	  return {
	      // link : 'http://localhost:8080/api/'
	      link : 'https://predictbackend.sloppy.zone/'
	  };
  });

})();
