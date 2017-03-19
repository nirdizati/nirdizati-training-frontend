(function () {
    angular
        .module('app')
        .controller('ResourcesController', ['ResourcesLoadService', '$scope','$cookies', '$cookieStore',
            ResourcesController
        ]);

    function ResourcesController(ResourcesLoadService, $scope, googlechart, $cookies, $cookieStore) {
        function onlyUnique(value, index, self) { 
          return self.indexOf(value) === index;
        }

        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(function (){drawResources($cookies.get('selectedLog'));});

        function drawResources(selectedLog) {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Active Resources');

            resData = [];

            var traceRes = ResourcesLoadService.get({'log': selectedLog}, function(result) {

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
