(function(){

  angular
    .module('app')
    .controller('ForecastingController', [
      'WorkloadService',
      'ForecastingArmaLoad',
      'ResourcesLoadService',
      'ForecastingArmaResources',
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
      ForecastingController
      
    ]);

  function ForecastingController(WorkloadService, ForecastingArmaLoad, ResourcesLoadService, ForecastingArmaResources, $scope, Upload, PredictionLink, $cookies, $location, Prediction, LogsService, PredictionEvaluation, PredictionGeneral, $mdDialog, $cookieStore, googlechart) {
    $scope.loading = true;
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
    var selectedLog = $cookies.get('selectedLog');
    selectedLog = selectedLog.replace(/['"]+/g, '');

    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(function (){drawTraces(selectedLog);});

    function drawTraces(selectedLog) {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'ActualActiveTraces');
        data.addColumn('number', 'PredictedActiveTraces');

        values = [];

        var traceRes = WorkloadService.get({'log': selectedLog}, function(result) {

            ForecastingArmaLoad.get({'log': selectedLog}, function(resultPredicted) {
              for (var key in result) {
                  var actual = result[key];
                  var predicted = resultPredicted[key];
                  values.push([new Date(key), Number(actual), Number(predicted)]);
              }

              data.addRows(values);
              $scope.loading = false;
              chartTrace.draw(data, options);
            });
            


        }, function(error) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#forecasting_div')))
                .clickOutsideToClose(true)
                .title('Error happened: Traces')
                .textContent('The formatting of the log file is not compatible with this tool')
                .ok('Ok')
            );
        });

        var options = {
          legend: 'none',
          hAxis: {
            format: 'dd-MM-yy',
            title: 'Date'
          },
          vAxis: {
            title: 'Active Traces',
          }
        };

        var chartTrace = new google.visualization.LineChart(document.getElementById('traces_forecasting_chart'));
    }

    google.charts.setOnLoadCallback(function (){drawResources(selectedLog);});

    function drawResources(selectedLog) {
        var dataResource = new google.visualization.DataTable();
        dataResource.addColumn('date', 'Date');
        dataResource.addColumn('number', 'ActualResources');
        dataResource.addColumn('number', 'PredictedResources');

        valuesResource = [];

        var traceRes = ResourcesLoadService.get({'log': selectedLog}, function(result) {

            ForecastingArmaResources.get({'log': selectedLog}, function(resultPredicted) {
              for (var key in result) {
                  var actual = result[key];
                  var predicted = resultPredicted[key];
                  valuesResource.push([new Date(key), Number(actual), Number(predicted)]);
              }

              dataResource.addRows(valuesResource);
              $scope.loading = false;
              chartResource.draw(dataResource, options);
            });
            


        }, function(error) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#forecasting_div')))
                .clickOutsideToClose(true)
                .title('Error happened: Resources')
                .textContent('The formatting of the log file is not compatible with this tool')
                .ok('Ok')
            );
        });

        var options = {
          legend: 'none',
          hAxis: {
            format: 'dd-MM-yy',
            title: 'Date'
          },
          vAxis: {
            title: 'Active Resources',
          }
        };

        var chartResource = new google.visualization.LineChart(document.getElementById('resources_forecasting_chart'));
    }

}})();
