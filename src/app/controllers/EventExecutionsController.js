(function () {
    angular
        .module('app')
        .controller('EventExecutionsController', ['EventExecutionService', '$scope','$cookies', '$cookieStore', '$mdDialog',
            EventExecutionsController
        ]);

    function EventExecutionsController(EventExecutionsService, $scope, googlechart, $cookies, $cookieStore,  $mdDialog) {

        $scope.loading = true;
        function onlyUnique(value, index, self) { 
          return self.indexOf(value) === index;
        }

        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(function (){drawEvents($cookies.get('selectedLog'));});

        function drawEvents(selectedLog) {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Event');
            data.addColumn('number', 'Number of Executions');

            eventRes = [];

            var traceRes = EventExecutionsService.get({'log': selectedLog}, function(result) {

                console.log(result);

                var i = 0;

                for (var key in result) {
                    if(key.startsWith("$") || key.startsWith("toJSON")) continue;
                    var val = result[key];
                    eventRes.push([key, Number(val)]);
                }

                data.addRows(eventRes);
                console.log(eventRes);
                // $scope.data = data;
                $scope.loading = false;
                chart.draw(data, options);
            }, function(error) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#dashboard_div')))
                    .clickOutsideToClose(true)
                    .title('Error happened: Event Executions')
                    .textContent('The formatting of the log file is not compatible with this tool')
                    .ok('Ok')
                );
            }); 


            var options = {
              legend: 'none',
              height: 1000,
              hAxis: {
                title: 'Number of Executions'
              },
              vAxis: {
                title: 'Events',
                textPosition : 'in',
                textStyle : {
                    fontSize: 7 // or the number you want
                }
              }
            };

            var chart = new google.visualization.BarChart(document.getElementById('events_chart'));

            // chart.draw(data, options);

        }
    }
})();
