(function () {
    angular
        .module('app')
        .controller('TracesController', ['WorkloadService', '$scope', '$cookies', '$cookieStore', '$mdDialog',
            TracesController
        ]);

    function TracesController(WorkloadService, $scope, googlechart, $cookies, $cookieStore, $mdDialog) {
        $scope.loading = true;
        function onlyUnique(value, index, self) { 
          return self.indexOf(value) === index;
        }

        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(function (){drawTraces($cookies.get('selectedLog'));});

        function drawTraces(selectedLog) {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'ActiveTraces');

            values = [];

            var traceRes = WorkloadService.get({'log': selectedLog}, function(result) {

                console.log(result);

                var i = 0;

                for (var key in result) {
                    var val = result[key];
                    values.push([new Date(key), Number(val)]);
                }

                data.addRows(values);
                $scope.loading = false;
                chart.draw(data, options);

            }, function(error) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#dashboard_div')))
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
                title: 'Date',
                textPosition : 'in'
              },
              vAxis: {
                title: 'Active Traces',
              }
            };

            var chart = new google.visualization.LineChart(document.getElementById('traces_chart'));
        }
    }
})();
