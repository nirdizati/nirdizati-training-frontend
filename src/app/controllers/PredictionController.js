(function(){

  angular
    .module('app')
    .controller('PredictionController', [
      '$scope',
      'Upload',
      'PredictionLink',
      '$cookies',
      'PredictionResults',
      PredictionController
      
    ]);

  function PredictionController($scope, Upload, PredictionLink, $cookies, PredictionResults, googlechart) {

	
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
	$scope.selectedTrace = 0;
	$scope.data = [];
    // $scope.predictionChartData = resultsFunction($scope, $scope.selectedTrace);

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

   //  function resultsFunction($scope, selectedValue) {

   //      var data = PredictionResults.get({}, function(result) {

   //      	var ids = Object.values(result.id);
   //      	ids = ids.filter(onlyUnique);
   //      	var trace = [];
   //      	var remainingTime = [];
   //      	var prediction = [];

   //      	$scope.traces = ids;

   //      	Object.keys(result['id']).forEach(function (key) {
			//    if(result.id[key] == selectedValue){
			//        trace.push(key);
			//        remainingTime.push(result.remaining_time[key]);
			//        prediction.push(result.LM_pred[key]);
			//    }
			// });
   //      	// var idsUnique = ids.filter(onlyUnique);
   //          console.log(result);

   //          var data = [];
   //          for (var i = 0; i < trace.length; i++) {
   //              data.push({x: i, y: result.remaining_time[trace[i]]});
   //          }
   //          $scope.data = data;

   //          $scope.predictionChartData = [ { values: $scope.data, color: 'rgb(0, 150, 136)'} ];
   //      });
   //  }

    $scope.update = function(){
		$scope.selectedTrace = $scope.selectedTrace;
		google.charts.setOnLoadCallback(drawBasic);
		// resultsFunction($scope, $scope.selectedTrace);
		// setTimeout(function(){
		// 	console.log('scope api:', $scope.api);
		// 	$scope.api.refresh();
		// });
    }

   	$scope.chartOptions = {
        chart: {
            type: 'lineChart',
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            showLabels: true,
            showLegend: true,
            title: 'Results',
            showYAxis: true,
            showXAxis: false,
            tooltip: { contentGenerator: function (d) { return '<span class="custom-tooltip">' + Math.round(d.point.y) + '</span>' } }
        }
    };


    google.charts.load('current', {packages: ['corechart', 'line']});
	google.charts.setOnLoadCallback(drawBasic);

	function drawBasic() {
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Point in Time');
		data.addColumn('number', 'Actual Remaining Time');
		data.addColumn('number', 'Predicted Remaining Time');

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
			       values.push([i++,result.remaining_time[key], result.LM_pred[key]]);
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
	}

})();
