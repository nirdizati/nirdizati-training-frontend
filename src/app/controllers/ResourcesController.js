(function () {
    angular
        .module('app')
        .controller('ResourcesController', ['ResourcesLoadService', '$scope',
            ResourcesController
        ]);

    function ResourcesController(ResourcesLoadService, $scope, googlechart) {
        function onlyUnique(value, index, self) { 
          return self.indexOf(value) === index;
        }

        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawResources);

        function drawResources() {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Active Resources');

            resData = [];

            var traceRes = ResourcesLoadService.get({}, function(result) {

                console.log(result);

                var i = 0;

                for (var key in result) {
                    var val = result[key];
                    resData.push([new Date(key), Number(val)]);
                }

                data.addRows(resData);
                // $scope.data = data;
                chart.draw(data, options);

            }); 


            var options = {
              hAxis: {
                format: 'dd-MM-yy',
                title: 'Date'
              },
              vAxis: {
                title: 'Active Resources'
              }
            };

            var chart = new google.visualization.LineChart(document.getElementById('resources_chart'));

            chart.draw(data, options);

        }
    }
})();
