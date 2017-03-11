(function(){

  angular
    .module('app')
    .controller('LogsController', [
      '$scope',
      LogsController
      
    ]);

  function LogsController($scope, LogsService) {
  	alert("here");
  	// LogsService.get(function(data) {
  	// 	alert(data);
  	// });
  }

})();
