(function () {
    angular
        .module('app')
        .controller('TracesController', ['WorkloadService', '$scope', 
            TracesController
        ]);

    function TracesController(WorkloadService, $scope, googlechart) {
        function onlyUnique(value, index, self) { 
          return self.indexOf(value) === index;
        }

        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawBasic);

        function drawBasic() {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'ActiveTraces');

            values = [];

            var traceRes = WorkloadService.get({}, function(result) {

                console.log(result);

                var i = 0;

                for (var key in result) {
                    var val = result[key];
                    values.push([new Date(key), Number(val)]);
                }

                data.addRows(values);
                // $scope.data = data;
                chart.draw(data, options);

            }); 


            var options = {
              hAxis: {
                format: 'dd-MM-yy',
                title: 'Date'
              },
              vAxis: {
                title: 'Active Traces'
              }
            };

            var chart = new google.visualization.LineChart(document.getElementById('traces_chart'));

            chart.draw(data, options);

        }
    }
})();
