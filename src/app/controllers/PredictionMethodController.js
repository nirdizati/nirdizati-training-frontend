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


    $scope.methods = {'intercase':'Bi-directional', 'classification':'Classification', 'forecasting':'Forecasting'};
    $scope.selectedPrediction = 0;

	$scope.updateMethod = function() {
		var linkKey = "prediction/"+$scope.selectedPrediction;
		$location.path( linkKey );
		// $window.location.href = linkKey;
	}

}})();
