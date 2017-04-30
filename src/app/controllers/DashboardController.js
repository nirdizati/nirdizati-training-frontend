(function(){

  angular
       .module('app')
       .controller('DashboardController', [
          'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
          '$state', '$mdToast', 'LogsService', '$scope',
          'WorkloadService', 'LogsList', '$cookies', '$cookieStore',
          '$interval',
          DashboardController
       ]);

  function DashboardController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, LogsService, $scope, WorkloadService, LogsList, $cookies, $cookieStore, $interval, $window) {
    var vm = this;

    LogsList.query({}, function(data) {
      $scope.logs = data;
      if(!$cookies.get('selectedLog')){
        $scope.selectedLog = data[0];
        $cookieStore.put('selectedLog', $scope.selectedLog);
      }
      else{
        selectedLog = $cookies.get('selectedLog');
        selectedLog = selectedLog.replace(/['"]+/g, '');
        $scope.selectedLog = selectedLog;
      }
    });

    $scope.update = function(){
      $scope.selectedLog = $scope.selectedLog;
      $cookieStore.put('selectedLog', $scope.selectedLog);
      location.reload(); 
    }

  }

})();
