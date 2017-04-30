(function(){

  angular
    .module('app')
    .controller('PredictionMethodController', [
      '$scope',
      'Upload',
      'PredictionLink',
      '$cookies',
      '$location',
      'Prediction',
      'LogsService',
      'PredictionEvaluation',
      'PredictionGeneral',
      '$mdDialog',
      '$cookieStore',
      PredictionMethodController
      
    ]);

  function PredictionMethodController($scope, Upload, PredictionLink, $cookies, $location, Prediction, LogsService, PredictionEvaluation, PredictionGeneral, $mdDialog, $cookieStore, googlechart) {


    $scope.methods = {};
    $scope.selectedPrediction = 0;

    $scope.types = {'time':'Remaining Time Predictions', 'workload':'Load Prediction', 'activity':'Next Activity Prediction', 'classification':'Classification Prediction'};
    $scope.selectedType = 0;

    var timeMethods = {'intercase':'Intercase Based Encoding', 'timeseries':'Time Series Based Prediction', 'regression':'Regression Based Prediction'};
    var workloadMethods = {'timeseries':'Time Series Based Prediction'};
    var activityMethods = {'classification':'Classification Based Prediction'};
    var classificationMethods = {'classification':'Classification Based Prediction'};

    $scope.updateMethods = function () {
      if($scope.selectedType == "time"){
        $scope.methods = timeMethods;
      }
      else if($scope.selectedType == "workload") {
        $scope.methods = workloadMethods;
      }
      else if($scope.selectedType == "activity") {
        $scope.methods = activityMethods;
      }
      else if($scope.selectedType == "classification") {
        $scope.methods = classificationMethods;
      }
    }



  	$scope.selectMethod = function() {
      //update log for cookies
      $scope.selectedLog = $scope.selectedLog;
      $cookieStore.put('selectedLog', $scope.selectedLog);

  		var linkKey = "prediction/"+$scope.selectedType+"/"+$scope.selectedPrediction;
  		$location.path( linkKey );
  		// $window.location.href = linkKey;
  	}

}})();
