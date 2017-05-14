(function(){

  angular
    .module('app')
    .controller('ActivityController', [
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
      ActivityController
      
    ]);

  function ActivityController($scope, $location, ClassificationDecisionTree, ClassificationRandomForest, ClassificationKNN, TimeseriesEncoding, LogsService, EventIndex, $mdDialog, $cookieStore, googlechart) {

  	var params = $location.search();
  	var selectedLog = params['log'];

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
				var predictionRes = ClassificationDecisionTree.get({encodedFile:$scope.selectedLog, prefixLength:$scope.prefixLength}, function(result) {
					displayTable(result);
					displayStepTable(result);
		        }, function(error) {
		        	displayError();
				});
			}
			else if($scope.selectedClassifier == "RandomForest"){
				var predictionRes = ClassificationRandomForest.get({encodedFile:$scope.selectedLog, prefixLength:$scope.prefixLength}, function(result) {
					displayTable(result);
					displayStepTable(result);
		        }, function(error) {
		        	displayError();
				});
			}
			else if($scope.selectedClassifier == "KNN"){
				var predictionRes = ClassificationKNN.get({encodedFile:$scope.selectedLog, prefixLength:$scope.prefixLength}, function(result) {
					displayTable(result);
					displayStepTable(result);
		        }, function(error) {
		        	displayError();
				});
			}
	    });
  	}

 //  	function reloadpage(){
	// 	$scope.loading = false;
	// 	var linkKey = "prediction/activity/classification";
	// 	$location.path(linkKey).search({log: $scope.selectedLog, classifier: $scope.selectedClassifier, prefixLength: $scope.prefixLength});
	// 	location.reload();
	// }

	$scope.selectedClassifier = 'DecisionTree';
	if("classifier" in params){
		$scope.selectedClassifier = params['classifier'];
	}

	$scope.updateClassifier = function(){
		$scope.selectedClassifier = $scope.selectedClassifier;
	}

	$scope.classifiers = {"DecisionTree":"DecisionTree","RandomForest":"Random Forest","KNN":"K-Nearest Neighbors"};

    google.charts.load('current', {packages: ['corechart', 'line', 'table']});
    google.charts.setOnLoadCallback(drawGeneral);

	function drawGeneral() {
	}

	function displayTable(result, method) {
		var table = new google.visualization.Table(document.getElementById('table_div'));

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Prediction Method');
		data.addColumn('number', 'Accuracy');

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

		EventIndex.query({log:$scope.selectedLog}, function(events) {
			for(i = 0; i < result.results.length; i++){
				resultsLength = result.results[i].length;
				prediction = events[result.results[i][resultsLength-1]];
				actual = events[result.results[i][resultsLength-2]];
				historyActivities = "";
				for(j = 0; j < $scope.prefixLength; j++){
					historyActivities += events[result.results[i][j]]+"_";
				}
				historyActivities = historyActivities.substring(0, historyActivities.length - 1);
				step_table_values.push([historyActivities, actual, prediction]);
				// prediction = events[result.results[i][result.results[i].length-1]];
				// actual = events[result.results[i][result.results[i].length-2]];
				// historyActivities = "";
				// for(j = 0; j < $scope.prefixLength; j++){
				// 	historyActivities += events[result.results[i][j]]+"_";
				// }
				// historyActivities = historyActivities.substring(0, historyActivities.length - 1);
				// step_table_values.push([historyActivities, actual, prediction]);
			}

			step_data.addRows(step_table_values);
			step_table.draw(step_data, {width: '100%', height: '100%'});
			$scope.loading = false;
			$mdDialog.hide();
		});

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

}})();
