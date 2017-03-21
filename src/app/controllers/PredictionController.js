(function(){

  angular
    .module('app')
    .controller('PredictionController', [
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
      PredictionController
      
    ]);

  function PredictionController($scope, Upload, PredictionLink, $cookies, PredictionResults, Prediction, LogsService, PredictionEvaluation, PredictionGeneral, $mdDialog, googlechart) {


    var selectedLog = $cookies.get('selectedLog');
    selectedLog = selectedLog.replace(/['"]+/g, '');

    $scope.selectedLog = selectedLog;
  	$scope.train = function() {
  		console.log("train");
  		$mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#prediction_div')))
	        .clickOutsideToClose(true)
	        .title('Encoding and Training')
	        .textContent('This is to notify you that your model is not training and evaluating the log. This page will automatically refresh when done.')
	        .ok('Got it!')
	    );
  		LogsService.get({'log': selectedLog}, function(result) {
  			console.log("encoding the file");
  			Prediction.save({name: selectedLog}, function(result){
  				consle.lg("training and making the prediction");
  				location.reload();
  			});
  		});
  	}
    $scope.submit = function() {
		if ($scope.file) {
			$scope.upload($scope.file);
		}
    }

    $scope.upload = function (file) {
        Upload.upload({
              url: PredictionLink.link+'services/',
              data: {file: file}
          }).then(function (resp) {
              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          }, function (resp) {
              console.log('Error status: ' + resp.status);
          }, function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          }).catch(function(error) {
  			console.log('There has been a problem with your fetch operation: ' + error.message);
  			 // ADD THIS THROW error
  			  throw error;
  		});
    };

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
		var generalres = PredictionGeneral.get({}, function(result) {
			table_values.push(["Lasso", result.RMSE.Lasso, result.MAE.Lasso]);
			table_values.push(["Random Forest - 50 Trees", result.RMSE.RF_50, result.MAE.RF_50]);
			table_values.push(["Linear Regression", result.RMSE.LM_pred, result.MAE.LM_pred]);
			table_values.push(["XGBoost - 2000 Trees", result.RMSE.XG_2000, result.MAE.XG_2000]);
			data.addRows(table_values);
			table.draw(data, {width: '100%', height: '100%'});
		});

		var table = new google.visualization.Table(document.getElementById('table_div'));
		table.draw(data, {width: '100%', height: '100%'});
	}

	google.charts.setOnLoadCallback(drawBasic);

	function drawBasic() {
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Point in Time');
		data.addColumn('number', 'Actual Remaining Time');
		data.addColumn('number', 'Predicted - Linear Regression');
		data.addColumn('number', 'Predicted - XGBoost');
		data.addColumn('number', 'Predicted - Random Forest');
		data.addColumn('number', 'Predicted - Lasso');

		values = []

		var predictionRes = PredictionResults.get({}, function(result) {
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
			        result.LM_pred[key],
			        result.XG_2000[key],
			        result.RF_50[key],
			        result.Lasso[key]]);
			   }
			});
            data.addRows(values);
            chart_div.draw(data, options);
        });


		var options = {
			hAxis: {
			  title: 'Point in Time'
			},
			vAxis: {
			  title: 'Remaining Time (sec)'
			}
		};

		var chart_div = new google.visualization.LineChart(document.getElementById('chart_div'));

		chart_div.draw(data, options);
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

		dataRMSE.addColumn('number', 'LM');
		dataMAE.addColumn('number', 'LM');

		dataRMSE.addColumn('number', 'RF');
		dataMAE.addColumn('number', 'RF');

		dataRMSE.addColumn('number', 'XGBoost');
		dataMAE.addColumn('number', 'XGBoost');

		valuesMAE = []
		valuesRMSE = []

		var predictionRes = PredictionEvaluation.get({}, function(result) {
			resData = result.data
			resRangeList = result.intervals

			for(var i = 0; i < Object.keys(resRangeList).length; i++){
				valuesMAE.push([resRangeList[i],
					resData[i].MAE.Lasso,
					resData[i].MAE.LM_pred,
					resData[i].MAE.RF_50,
					resData[i].MAE.XG_2000]);
				valuesRMSE.push([resRangeList[i],
					resData[i].RMSE.Lasso,
					resData[i].RMSE.LM_pred,
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
			  title: 'Time (seconds)'
			},
			vAxis: {
			  title: 'Error (seconds)'
			}
		};

		var eval_div_mae = new google.visualization.LineChart(document.getElementById('eval_div_mae'));
		eval_div_mae.draw(dataMAE, options);

		var eval_div_rmse = new google.visualization.LineChart(document.getElementById('eval_div_rmse'));
		eval_div_rmse.draw(dataRMSE, options);
	}

}})();
