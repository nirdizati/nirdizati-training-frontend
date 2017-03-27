(function () {
    angular
        .module('app')
        .controller('ResourcesController', ['ResourcesLoadService', '$scope','$cookies', '$cookieStore', '$mdDialog',
            ResourcesController
        ]);

    function ResourcesController(ResourcesLoadService, $scope, googlechart, $cookies, $cookieStore, $mdDialog) {
        $scope.loading = true;
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
                $scope.loading = false;
                chart.draw(data, options);

            }, function(error) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#dashboard_div')))
                    .clickOutsideToClose(true)
                    .title('Error happened: Resources')
                    .textContent('The formatting of the log file is not compatible with this tool')
                    .ok('Ok')
                );
            });


            var options = {
              legend: 'none',
              hAxis: {
                format: 'dd-MM-yy',
                title: 'Date'
              },
              vAxis: {
                title: 'Active Resources'
              }
            };

            var chart = new google.visualization.LineChart(document.getElementById('resources_chart'));

            // chart.draw(data, options);

        }
    }
})();
