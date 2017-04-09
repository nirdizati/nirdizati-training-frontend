(function(){

  angular
    .module('app')
    .controller('ClassificationController', [
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
      ClassificationController
      
    ]);

  function ClassificationController($scope, Upload, PredictionLink, $cookies, $location, Prediction, LogsService, PredictionEvaluation, PredictionGeneral, $mdDialog, $cookieStore, googlechart) {

    var selectedLog = $cookies.get('selectedLog');
    selectedLog = selectedLog.replace(/['"]+/g, '');

    $scope.selectedLog = selectedLog;

    $scope.classifiers = {'rf':'Random Forest', 'dt':'Decision Trees'};
    $scope.selectedClassifier = 0;

    $scope.clusterers = {'kmeans':'K-means', 'dt':'DBScan'};
    $scope.selectedClusterer = 0;


}})();
