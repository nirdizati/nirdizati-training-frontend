(function(){

  angular
    .module('app')
    .controller('IntercaseController', [
      '$scope',
      'Upload',
      'PredictionLink',
      '$cookies',
      'PredictionResults',
      'Prediction',
      'LogsService',
      'PredictionEvaluation',
      'PredictionGeneral',
      '$mdDialog',
      '$cookieStore',
      IntercaseController
      
    ]);

  function IntercaseController($scope, Upload, PredictionLink, $cookies, PredictionResults, Prediction, LogsService, PredictionEvaluation, PredictionGeneral, $mdDialog, $cookieStore, googlechart) {


    var selectedLog = $cookies.get('selectedLog');
    selectedLog = selectedLog.replace(/['"]+/g, '');

    $scope.isRegression = false;
    $scope.isIntercase = true;
    $scope.isTimeseries = false;
    $scope.note = '';

    $scope.selectedLog = selectedLog;

    $scope.levels = ['Level0', 'Level1', 'Level2', 'Level3'];
	if(!$cookies.get('selectedLevel')){
		$scope.selectedLevel = 'Level3';
		$cookieStore.put('selectedLevel', $scope.selectedLevel);
	}
	else{
		selectedLevel = $cookies.get('selectedLevel');
		selectedLevel = selectedLevel.replace(/['"]+/g, '');
		$scope.selectedLevel = selectedLevel;
	}

	$scope.levelChange = function() {
		$cookieStore.put('selectedLevel', $scope.selectedLevel);
		location.reload();
	}

  	$scope.train = function() {
  		console.log("train: "+ $scope.selectedLevel);
  		$mdDialog.show({
  			template:
  			'<div style="height:200px; width:500px;">'+
  			'<center>'+
  			'Currently Encoding, Training and Evaluating'+
  			'<br/><small>Page will automatically refresh once done.</small>'+
  			'<md-progress-circular md-mode="indeterminate"></md-progress-circular>'+
  			'<br/><small>Please Wait...</small>'+
  			'</center>'+
  			'</div>'}
	    )
	    $scope.loading = true;
  		LogsService.get({'log': selectedLog}, function(result) {
  			console.log("encoding the file");
  			Prediction.save({name: selectedLog, 'level': $scope.selectedLevel}, function(result){
  				console.log("training and making the prediction");
  				$scope.loading = false;
  				location.reload();
  			});
  		});
  	}

	$scope.traces = [];
	$scope.data = [];
	$scope.selectedTrace = 0;

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

    google.charts.load('current', {packages: ['corechart', 'line', 'table']});
    google.charts.setOnLoadCallback(drawTable);

	function drawTable() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Prediction Method');
		data.addColumn('number', 'RMSE');
		data.addColumn('number', 'MAE');

		table_values = [];
		var generalres = PredictionGeneral.get({file:$scope.selectedLevel+$scope.selectedLog+".csv"}, function(result) {
			table_values.push(["Lasso", result.RMSE.Lasso, result.MAE.Lasso]);
			table_values.push(["Random Forest - 50 Trees", result.RMSE.RF_50, result.MAE.RF_50]);
			table_values.push(["XGBoost - 2000 Trees", result.RMSE.XG_2000, result.MAE.XG_2000]);
			data.addRows(table_values);
			table.draw(data, {width: '100%', height: '100%'});
		});

		var table = new google.visualization.Table(document.getElementById('table_div'));

	}

	google.charts.setOnLoadCallback(drawBasic);

	function drawBasic() {
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Point in Time');
		data.addColumn('number', 'Actual');
		// data.addColumn('number', 'Predicted - Linear Regression');
		data.addColumn('number', 'XGBoost');
		data.addColumn('number', 'Random Forest');
		data.addColumn('number', 'Lasso');

		values = []

		var predictionRes = PredictionResults.get({file:$scope.selectedLevel+$scope.selectedLog+".csv"}, function(result) {
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
			       // remainingTime.push(result.remaining_time[key]);
			       // prediction.push(result.LM_pred[key]);
			       values.push([i++,result.remaining_time[key],
			        // result.LM_pred[key],
			        result.XG_2000[key],
			        result.RF_50[key],
			        result.Lasso[key]]);
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
				.textContent('Please select Level of prediction and then click on Train and Predict button')
				.ok('Got it!')
			);
		});

		var options = {
			hAxis: {
			  title: 'Point in Time'
			},
			vAxis: {
			  title: 'Remaining Time (hours)'
			}
		};

		var chart_div = new google.visualization.LineChart(document.getElementById('chart_div'));

		// chart_div.draw(data, options);
	}

	$scope.update = function(){
		$scope.selectedTrace = $scope.selectedTrace;
		google.charts.setOnLoadCallback(drawBasic);
    }


    google.charts.setOnLoadCallback(drawEval);

	function drawEval() {
		var dataRMSE = new google.visualization.DataTable();
		var dataMAE = new google.visualization.DataTable();
		dataRMSE.addColumn('string', 'Intervals');
		dataMAE.addColumn('string', 'Intervals');

		dataRMSE.addColumn('number', 'Lasso');
		dataMAE.addColumn('number', 'Lasso');

		// dataRMSE.addColumn('number', 'LM');
		// dataMAE.addColumn('number', 'LM');

		dataRMSE.addColumn('number', 'RF');
		dataMAE.addColumn('number', 'RF');

		dataRMSE.addColumn('number', 'XGBoost');
		dataMAE.addColumn('number', 'XGBoost');

		valuesMAE = []
		valuesRMSE = []

		var predictionRes = PredictionEvaluation.get({file:$scope.selectedLevel+$scope.selectedLog+".csv"}, function(result) {
			resData = result.data
			resRangeList = result.intervals

			var keys = Object.keys(resRangeList);
			for(var key in keys){
				var i = keys[key];
				valuesMAE.push([resRangeList[i],
					resData[i].MAE.Lasso,
					// resData[i].MAE.LM_pred,
					resData[i].MAE.RF_50,
					resData[i].MAE.XG_2000]);
				valuesRMSE.push([resRangeList[i],
					resData[i].RMSE.Lasso,
					// resData[i].RMSE.LM_pred,
					resData[i].RMSE.RF_50,
					resData[i].RMSE.XG_2000]);
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
