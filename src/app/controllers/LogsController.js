(function(){

  angular
    .module('app')
    .controller('LogsController', [
      '$scope',
      'LogsService',
      LogsController
    ]);

  function LogsController($scope, LogsService) {
  	LogsService.get({}, function(data) {
  		console.log(data);
  	});
  }

})();
