(function(){

  angular
    .module('app')
    .controller('TimeForecastingController', [
      '$scope',
      'Upload',
      'PredictionLink',
      '$cookies',
      'ForecastingTimeResults',
      'TimeseriesEncoding',
      'LogsService',
      'ForecastingTimeEvaluation',
      'ForecastingTimeGeneral',
      '$mdDialog',
      '$cookieStore',
      TimeForecastingController
      
    ]);

  function TimeForecastingController($scope, Upload, PredictionLink, $cookies, ForecastingTimeResults, TimeseriesEncoding, LogsService, ForecastingTimeEvaluation, ForecastingTimeGeneral, $mdDialog, $cookieStore, googlechart) {

    var selectedLog = $cookies.get('selectedLog');
    selectedLog = selectedLog.replace(/['"]+/g, '');

    $scope.selectedLog = selectedLog;

    $scope.isRegression = false;
    $scope.isIntercase = false;
    $scope.isTimeseries = true;
    $scope.note = 'Note: Predictions are provided after 5 activities are performed';
  	$scope.train = function() {
  		console.log("train: "+ $scope.selectedLog);
  		$mdDialog.show({
  			template:
  			'<div style="height:200px; width:500px;">'+
  			'<center>'+
  			'Currently Encoding'+
  			'<md-progress-circular md-mode="indeterminate"></md-progress-circular>'+
  			'<br/><small>Please Wait...</small>'+
  			'</center>'+
  			'</div>'}
	    )
	    $scope.loading = true;
	    TimeseriesEncoding.query({log: $scope.selectedLog}, function(result){
	    	$mdDialog.show({
	  			template:
	  			'<div style="height:200px; width:500px;">'+
	  			'<center>'+
	  			'Currently Training and Evaluating'+
	  			'<br/><small>Page will automatically refresh once done.</small>'+
	  			'<md-progress-circular md-mode="indeterminate"></md-progress-circular>'+
	  			'<br/><small>Please Wait...</small>'+
	  			'</center>'+
	  			'</div>'}
		    )
	    	ForecastingTimeResults.get({log: $scope.selectedLog}, function(result){
				console.log("training and making the prediction");
				$scope.loading = false;
				location.reload();
			});
	    });
  	}

	$scope.traces = [];
	$scope.data = [];
	$scope.selectedTrace = 'Case1';

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

    google.charts.load('current', {packages: ['corechart', 'line', 'table']});
    google.charts.setOnLoadCallback(drawGeneral);

	function drawGeneral() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Prediction Method');
		data.addColumn('number', 'RMSE');
		data.addColumn('number', 'MAE');

		table_values = [];
		var generalres = ForecastingTimeGeneral.get({log:$scope.selectedLog}, function(result) {
			table_values.push(["ARMA Timeseries", result.RMSE, result.MAE]);
			data.addRows(table_values);
			table.draw(data, {width: '100%', height: '100%'});
		});

		var table = new google.visualization.Table(document.getElementById('table_div'));

	}

	google.charts.setOnLoadCallback(drawTrace);

	function drawTrace() {
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Point in Time');
		data.addColumn('number', 'Actual');
		// data.addColumn('number', 'Predicted - Linear Regression');
		data.addColumn('number', 'Predicted');

		values = []

		var predictionRes = ForecastingTimeResults.get({log:$scope.selectedLog}, function(result) {
			console.log(result);
        	var ids = Object.values(result.id);
        	ids = ids.filter(onlyUnique);
        	var trace = [];
        	var remainingTime = [];
        	var prediction = [];

        	$scope.traces = ids.sort();

        	var values = [];
        	var i = 0;
        	Object.keys(result['id']).forEach(function (key) {
			   if(result.id[key] == $scope.selectedTrace){
			       trace.push(key);
			       values.push([i++,result.remainingTime[key], result.prediction[key]]);
			   }
			});
            data.addRows(values);
            chart_div.draw(data, options);
        }, function(error) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.querySelector('#prediction_div')))
				.clickOutsideToClose(true)
				.title('No Results Available for this Log')
				.textContent('Please click on Train and Predict button')
				.ok('Got it!')
			);
		});

		var options = {
			hAxis: {
			  title: 'Point in Time',
			  format: 0
			},
			vAxis: {
			  title: 'Remaining Time (hours)'
			}
		};

		var chart_div = new google.visualization.LineChart(document.getElementById('chart_div'));
	}

	$scope.update = function(){
		$scope.selectedTrace = $scope.selectedTrace;
		google.charts.setOnLoadCallback(drawTrace);
    }


    google.charts.setOnLoadCallback(drawEval);

	function drawEval() {
		var dataRMSE = new google.visualization.DataTable();
		var dataMAE = new google.visualization.DataTable();
		dataRMSE.addColumn('string', 'Intervals');
		dataMAE.addColumn('string', 'Intervals');

		dataRMSE.addColumn('number', 'Prediction');
		dataMAE.addColumn('number', 'Prediction');

		valuesMAE = []
		valuesRMSE = []

		var predictionRes = ForecastingTimeEvaluation.get({log:$scope.selectedLog}, function(result) {
			resData = result.data
			resRangeList = result.intervals

			var keys = Object.keys(resRangeList);
			for(var key in keys){
				var i = keys[key];
				valuesMAE.push([resRangeList[i],
					resData[i].MAE]);
				valuesRMSE.push([resRangeList[i],
					resData[i].RMSE]);
			}

			dataMAE.addRows(valuesMAE)
			dataRMSE.addRows(valuesRMSE)
            
            eval_div_mae.draw(dataMAE, options);
            eval_div_rmse.draw(dataRMSE, options);
        });

		var options = {
			hAxis: {
			  title: 'Time (hours)'
			},
			vAxis: {
			  title: 'Error (hours)'
			}
		};

		var eval_div_mae = new google.visualization.LineChart(document.getElementById('eval_div_mae'));

		var eval_div_rmse = new google.visualization.LineChart(document.getElementById('eval_div_rmse'));
	}

}})();
