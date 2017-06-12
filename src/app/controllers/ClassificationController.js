(function(){

  angular
    .module('app')
    .controller('ClassificationController', [
      '$scope',
      '$location',
      'ClassificationDecisionTree',
      'ClassificationRandomForest',
      'ClassificationKNN',
      'TimeseriesEncoding',
      'LogsService',
      'EventIndex',
      '$mdDialog',
      '$cookieStore',
      ClassificationController
      
    ]);

  function ClassificationController($scope, $location, ClassificationDecisionTree, ClassificationRandomForest, ClassificationKNN, TimeseriesEncoding, LogsService, EventIndex, $mdDialog, $cookieStore, googlechart) {

  	// confirm("This section is disabled not enabled in live server. Setting changes is currently done by developer.");
  	var params = $location.search();
  	var selectedLog = params['log'];

  	$scope.pageLabel = "Outcome Prediction";
  	$scope.pieVisible = true;

    $scope.selectedLog = selectedLog;
    $scope.prefixLength = 0;
    if("prefixLength" in params){
		$scope.prefixLength = params['prefixLength'];
	}

  	$scope.train = function() {
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
			if($scope.selectedClassifier == "DecisionTree"){
				var predictionRes = ClassificationDecisionTree.get({encodedFile:$scope.selectedLog, prefixLength:$scope.prefixLength, encodingType:$scope.selectedLTL, activityA:$scope.selectedActivityA+1, activityB:$scope.selectedActivityB+1}, function(result) {
					displayTable(result);
					displayStepTable(result);
		        }, function(error) {
		        	displayError();
				});
			}
			else if($scope.selectedClassifier == "RandomForest"){
				var predictionRes = ClassificationRandomForest.get({encodedFile:$scope.selectedLog, prefixLength:$scope.prefixLength, encodingType:$scope.selectedLTL, activityA:$scope.selectedActivityA+1, activityB:$scope.selectedActivityB+1}, function(result) {
					displayTable(result);
					displayStepTable(result);
		        }, function(error) {
		        	displayError();
				});
			}
			else if($scope.selectedClassifier == "KNN"){
				var predictionRes = ClassificationKNN.get({encodedFile:$scope.selectedLog, prefixLength:$scope.prefixLength, encodingType:$scope.selectedLTL, activityA:$scope.selectedActivityA+1, activityB:$scope.selectedActivityB+1}, function(result) {
					displayTable(result);
					displayStepTable(result);
		        }, function(error) {
		        	displayError();
				});
			}
	    });
  	}


	$scope.selectedClassifier = 'DecisionTree';
	if("classifier" in params){
		$scope.selectedClassifier = params['classifier'];
	}

	$scope.updateClassifier = function(){
		$scope.selectedClassifier = $scope.selectedClassifier;
	}

	EventIndex.query({log:$scope.selectedLog}, function(events) {
		$scope.activities = events;
	});

	$scope.classifiers = {"DecisionTree":"DecisionTree","RandomForest":"Random Forest","KNN":"K-Nearest Neighbors"};

	$scope.selectedLTL = "fastslow";
	$scope.ltl = {"fastslow":"Fast/Slow Traces", "ltl":"LTL: A happens before B"};

	$scope.selectedActivityA = 0;
	$scope.selectedActivityB = 0;

	$scope.hideLTL = true;

    google.charts.load('current', {packages: ['corechart', 'line', 'table']});
    google.charts.setOnLoadCallback(drawGeneral);

	function drawGeneral() {
	}

	$scope.updateLTL = function(){
		if($scope.selectedLTL == "fastslow"){
			$scope.hideLTL = true;
		}
		else{
			$scope.hideLTL = false;
		}
	}

	function displayTable(result, method) {
		var table = new google.visualization.Table(document.getElementById('table_div'));

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Prediction Method');
		data.addColumn('number', 'F1Score');

		table_values = [];

		table_values.push([result['method'], result['accuracy']]);
		data.addRows(table_values);
		table.draw(data, {width: '100%', height: '100%'});
		$scope.loading = false;
		$mdDialog.hide();
	}



	function displayStepTable(result, method) {
		var step_table = new google.visualization.Table(document.getElementById('step_table_div'));

		var step_data = new google.visualization.DataTable();
		step_data.addColumn('string', 'History');
		step_data.addColumn('string', 'Actual');
		step_data.addColumn('string', 'Prediction');

		step_table_values = [];

		if($scope.selectedLTL == "fastslow"){
			EventIndex.query({log:$scope.selectedLog}, function(events) {
				var countFastActual = 0;
				var countSlowActual = 0;
				var countFastPrediction = 0;
				var countSlowPrediction = 0;
				for(i = 0; i < result.results.length; i++){
					resultsLength = result.results[i].length;
					prediction = result.results[i][resultsLength-1]?"fast":"slow";
					if(prediction == "fast") countFastPrediction++;
					else countSlowPrediction++;

					actual = result.results[i][resultsLength-2]?"fast":"slow";
					if(actual == "fast") countFastActual++;
					else countSlowActual++;

					historyActivities = "";
					for(j = 0; j < $scope.prefixLength; j++){
						console.log("results = "+result.results[i][j]);
						historyActivities += events[result.results[i][j]-1]+";";
					}
					historyActivities = historyActivities.substring(0, historyActivities.length - 1);
					step_table_values.push([historyActivities, actual.toString(), prediction.toString()]);
				}

				step_data.addRows(step_table_values);
				step_table.draw(step_data, {width: '100%', height: '100%'});

				var prediction_pie_data = google.visualization.arrayToDataTable([
		          ['Label', 'Fast/Slow Cases'],
		          ['Fast', countFastPrediction],
		          ['Slow', countSlowPrediction]
		        ]);

		        var actual_pie_data = google.visualization.arrayToDataTable([
		          ['Label', 'Fast/Slow Cases'],
		          ['Fast', countFastActual],
		          ['Slow', countSlowActual]
		        ]);

		        var optionsPrediction = {
		          title: 'Prediction for Fast/Slow Cases'
		        };

		        var piechartprediction = new google.visualization.PieChart(document.getElementById('prediction_pie_chart_div'));
		        piechartprediction.draw(prediction_pie_data, optionsPrediction);

		        var optionsActual = {
		          title: 'Actual Outcome for Fast/Slow Cases'
		        };
		        var piechartactual = new google.visualization.PieChart(document.getElementById('actual_pie_chart_div'));
		        piechartactual.draw(actual_pie_data, optionsActual);

				$mdDialog.hide();
			});
		}
		else{
			EventIndex.query({log:$scope.selectedLog}, function(events) {
				var countFastActual = 0;
				var countSlowActual = 0;
				var countFastPrediction = 0;
				var countSlowPrediction = 0;
				for(i = 0; i < result.results.length; i++){
					resultsLength = result.results[i].length;
					prediction = result.results[i][resultsLength-1]?"true":"false";
					if(prediction == "true") countFastPrediction++;
					else countSlowPrediction++;

					actual = result.results[i][resultsLength-2]?"true":"false";
					if(actual == "true") countFastActual++;
					else countSlowActual++;

					historyActivities = "";
					for(j = 0; j < $scope.prefixLength; j++){
						console.log("results = "+result.results[i][j]);
						historyActivities += events[result.results[i][j]-1]+";";
					}
					historyActivities = historyActivities.substring(0, historyActivities.length - 1);
					step_table_values.push([historyActivities, actual.toString(), prediction.toString()]);
				}

				step_data.addRows(step_table_values);
				step_table.draw(step_data, {width: '100%', height: '100%'});

				var prediction_pie_data = google.visualization.arrayToDataTable([
		          ['Label', 'True/False Cases'],
		          ['True', countFastPrediction],
		          ['False', countSlowPrediction]
		        ]);

		        var actual_pie_data = google.visualization.arrayToDataTable([
		          ['Label', 'True/False Cases'],
		          ['True', countFastActual],
		          ['False', countSlowActual]
		        ]);

		        var optionsPrediction = {
		          title: 'Prediction for True/False Cases'
		        };

		        var piechartprediction = new google.visualization.PieChart(document.getElementById('prediction_pie_chart_div'));
		        piechartprediction.draw(prediction_pie_data, optionsPrediction);

		        var optionsActual = {
		          title: 'Actual Outcome for True/False Cases'
		        };
		        var piechartactual = new google.visualization.PieChart(document.getElementById('actual_pie_chart_div'));
		        piechartactual.draw(actual_pie_data, optionsActual);

				$mdDialog.hide();
			});
		}


	}

	function displayError(){
		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#prediction_div')))
			.clickOutsideToClose(true)
			.title('No Results Available for this Log')
			.textContent('Please click on Train and Validate button')
			.ok('Got it!')
		);
	}

}})();
