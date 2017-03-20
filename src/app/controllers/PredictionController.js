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
      '$mdDialog',
      PredictionController
      
    ]);

  function PredictionController($scope, Upload, PredictionLink, $cookies, PredictionResults, Prediction, LogsService,$mdDialog, googlechart) {


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

    // $scope.logs = ["Production Log", "Hospital Log"];

	$scope.traces = [];
	$scope.selectedTrace = 0;
	$scope.data = [];

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

    $scope.update = function(){
		$scope.selectedTrace = $scope.selectedTrace;
		google.charts.setOnLoadCallback(drawBasic);
    }


    google.charts.load('current', {packages: ['corechart', 'line']});
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
        	// var idsUnique = ids.filter(onlyUnique);
            console.log(result);

            
            // for (var i = 0; i < trace.length; i++) {
            //     // data.push({x: i, y: result.remaining_time[trace[i]]});
            //     values.push([i,result.remaining_time[trace[i]]]);
            // }
            data.addRows(values);
            // $scope.data = data;
            chart.draw(data, options);
            // $scope.predictionChartData = [ { values: $scope.data, color: 'rgb(0, 150, 136)'} ];
        });


		var options = {
			hAxis: {
			  title: 'Point in Time'
			},
			vAxis: {
			  title: 'Remaining Time (sec)'
			}
		};

		var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

		chart.draw(data, options);
		chart.setSelection([{row: 38, column: 1}]);

		}

		google.charts.load('current', {'packages':['table']});
	    google.charts.setOnLoadCallback(drawTable);

		function drawTable() {
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Name');
			data.addColumn('number', 'Salary');
			data.addColumn('boolean', 'Full Time Employee');
			data.addRows([
			  ['Mike',  {v: 10000, f: '$10,000'}, true],
			  ['Jim',   {v:8000,   f: '$8,000'},  false],
			  ['Alice', {v: 12500, f: '$12,500'}, true],
			  ['Bob',   {v: 7000,  f: '$7,000'},  true]
			]);

			// var table = new google.visualization.Table(document.getElementById('table_div'));

			// table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
		}
	}



})();
