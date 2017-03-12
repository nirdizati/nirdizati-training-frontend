(function () {
    angular
        .module('app')
        .controller('TracesController', ['WorkloadService', '$scope',
            TracesController
        ]);

    function TracesController(WorkloadService, $scope) {
        var vm = this;
        vm.tracesChartData = tracesFunction;

        function tracesFunction() {

            var data = WorkloadService.get({id: 1}, function(result) {
                console.log(result);
                var data = [];
                var count = 0;
                for (var date in result) {
                    data.push({x: date, y: result[date]});
                    count++;
                }
                vm.tracesChartData = [ { values: data, color: 'rgb(0, 150, 136)', area: true } ];
            });


            return [ { values: data, color: 'rgb(0, 150, 136)', area: true } ];
        }

        vm.chartOptions = {
            chart: {
                type: 'lineChart',
                height: 230,
                margin: { top: -10, left: 20, right: 20 },
                x: function (d) {
                    //console.log(new Date(newDate).getTime());
                    // return d3.time.format('%Y-%m-%d').parse(d.x);
                    return new Date(d.x).getTime();
                },
                y: function (d) {
                    return d.y;
                },
                showLabels: true,
                showLegend: true,
                title: 'Traces per day',
                showYAxis: true,
                showXAxis: false,
                tooltip: { contentGenerator: function (d) { return '<span class="custom-tooltip">' + new Date(d.point.x).toLocaleDateString() +' - ' + Math.round(d.point.y) + '</span>' } }
            }
        };
    }
})();
