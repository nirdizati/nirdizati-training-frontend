(function(){

  angular
    .module('app')
    .controller('TimeRegressionController', [
      '$scope',
      '$location',
      'RegressionLinear',
      'RegressionRandomForest',
      'RegressionXGBoost',
      'TimeseriesEncoding',
      'LogsService',
      'RegressionLinearTimeEvaluation',
      'RegressionRandomForestTimeEvaluation',
      'RegressionXGBoostTimeEvaluation',
      'RegressionLinearTimeGeneral',
      'RegressionRandomForestTimeGeneral',
      'RegressionXGBoostTimeGeneral',
      '$mdDialog',
      '$cookieStore',
      TimeRegressionController
      
    ]);

  function TimeRegressionController($scope, $location, RegressionLinear, RegressionRandomForest, RegressionXGBoost, TimeseriesEncoding, LogsService, RegressionLinearTimeEvaluation, RegressionRandomForestTimeEvaluation, RegressionXGBoostTimeEvaluation,RegressionLinearTimeGeneral, RegressionRandomForestTimeGeneral, RegressionXGBoostTimeGeneral,$mdDialog, $cookieStore, googlechart) {

  	var params = $location.search();
  	var selectedLog = params['log'];

    $scope.selectedLog = selectedLog;

    $scope.isRegression = true;
    $scope.isIntercase = false;
    $scope.isTimeseries = false;
    $scope.note = '';

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
	  			'<br/><small>Open new tab if you wish to work on other logs.</small>'+
	  			'<md-progress-circular md-mode="indeterminate"></md-progress-circular>'+
	  			'<br/><small>Please Wait...</small>'+
	  			'</center>'+
	  			'</div>'}
		    )
			if($scope.selectedRegressor == "Linear"){
				var predictionRes = RegressionLinear.save({log:$scope.selectedLog}, function(result) {
					reloadpage();
		        }, function(error) {
		        	displayError();
				});
			}
			else if($scope.selectedRegressor == "RandomForest"){
				var predictionRes = RegressionRandomForest.save({log:$scope.selectedLog}, function(result) {
					reloadpage();
		        }, function(error) {
		        	displayError();
				});
			}
			else if($scope.selectedRegressor == "XGBoost"){
				var predictionRes = RegressionXGBoost.save({log:$scope.selectedLog}, function(result) {
					reloadpage();
		        }, function(error) {
		        	displayError();
				});
			}
	    });
  	}

	$scope.traces = [];
	$scope.data = [];
	$scope.selectedTrace = 'Case1';
	$scope.selectedRegressor = 'Linear';
	if("regressor" in params){
		$scope.selectedRegressor = params['regressor'];
	}

	$scope.regressors = {"Linear":"Linear","RandomForest":"Random Forest","XGBoost":"XGBoost"};

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

    google.charts.load('current', {packages: ['corechart', 'line', 'table']});
    google.charts.setOnLoadCallback(drawGeneral);

	function drawGeneral() {
	}

	function displayTable(result, method) {
		var table = new google.visualization.Table(document.getElementById('table_div'));

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Prediction Method');
		data.addColumn('number', 'RMSE');
		data.addColumn('number', 'MAE');

		table_values = [];

		table_values.push([method, result.RMSE, result.MAE]);
		data.addRows(table_values);
		table.draw(data, {width: '100%', height: '100%'});
	}

	function reloadpage(){
		$scope.loading = false;
		var linkKey = "prediction/time/intracase";
		$location.path(linkKey).search({log: $scope.selectedLog, regressor: $scope.selectedRegressor});
		location.reload();
	}

	google.charts.setOnLoadCallback(drawTrace);
	$scope.updateRegressor = function(){
		updateRegressor();
	}

	function updateRegressor(){
		if($scope.selectedRegressor == "Linear"){
			var predictionRes = RegressionLinear.get({log:$scope.selectedLog}, function(result) {
				displayTrace(result);
	        }, function(error) {
	        	displayError();
			});
			var generalres = RegressionLinearTimeGeneral.get({log:$scope.selectedLog}, function(result) {
				displayTable(result, $scope.selectedRegressor);
			});
			var predictionRes = RegressionLinearTimeEvaluation.get({log:$scope.selectedLog}, function(result) {
				displayEval(result);
			});

		}
		else if($scope.selectedRegressor == "RandomForest"){
			var predictionRes = RegressionRandomForest.get({log:$scope.selectedLog}, function(result) {
				displayTrace(result);
	        }, function(error) {
	        	displayError();
			});
			var generalres = RegressionRandomForestTimeGeneral.get({log:$scope.selectedLog}, function(result) {
				displayTable(result, $scope.selectedRegressor);
			});
			var predictionRes = RegressionRandomForestTimeEvaluation.get({log:$scope.selectedLog}, function(result) {
				displayEval(result);
			});
		}
		else if($scope.selectedRegressor == "XGBoost"){
			var predictionRes = RegressionXGBoost.get({log:$scope.selectedLog}, function(result) {
				displayTrace(result);
	        }, function(error) {
	        	displayError();
			});
			var generalres = RegressionXGBoostTimeGeneral.get({log:$scope.selectedLog}, function(result) {
				displayTable(result, $scope.selectedRegressor);
			});
			var predictionRes = RegressionXGBoostTimeEvaluation.get({log:$scope.selectedLog}, function(result) {
				displayEval(result);
			});
		}
	}

	function displayError(){
		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#prediction_div')))
			.clickOutsideToClose(true)
			.title('No Results Available for this Log')
			.textContent('Please click on Train and Predict button')
			.ok('Got it!')
		);
	}

	function displayTrace(result){
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Point in Time');
		data.addColumn('number', 'Actual');
		// data.addColumn('number', 'Predicted - Linear Regression');
		data.addColumn('number', 'Predicted');

		values = []

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
	}

	function drawTrace() {
		updateRegressor();
	}

	$scope.update = function(){
		$scope.selectedTrace = $scope.selectedTrace;
		google.charts.setOnLoadCallback(drawTrace);
    }


    google.charts.setOnLoadCallback(drawEval);

	function drawEval() {

	}

	function displayEval(result) {
		var dataRMSE = new google.visualization.DataTable();
		var dataMAE = new google.visualization.DataTable();

		var eval_div_mae = new google.visualization.LineChart(document.getElementById('eval_div_mae'));

		var eval_div_rmse = new google.visualization.LineChart(document.getElementById('eval_div_rmse'));

		dataRMSE.addColumn('string', 'Intervals');
		dataMAE.addColumn('string', 'Intervals');

		dataRMSE.addColumn('number', 'Prediction');
		dataMAE.addColumn('number', 'Prediction');

		valuesMAE = []
		valuesRMSE = []

		
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

		var options = {
			hAxis: {
			  title: 'Time (hours)'
			},
			vAxis: {
			  title: 'Error (hours)'
			}
		};

	}

}})();
