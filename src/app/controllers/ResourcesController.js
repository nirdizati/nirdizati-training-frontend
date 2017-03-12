(function () {
    angular
        .module('app')
        .controller('ResourcesController', ['ResourcesLoadService', '$scope',
            ResourcesController
        ]);

    function ResourcesController(ResourcesLoadService, $scope) {
        var vm = this;
        vm.resourcesChartData = resourcesFunction;

        function resourcesFunction() {

            var data = ResourcesLoadService.get({id: 1}, function(result) {
                console.log(result);
                var data = [];
                var count = 0;
                for (var date in result) {
                    data.push({x: date, y: result[date]});
                    count++;
                }
                vm.resourcesChartData = [ { values: data, color: 'rgb(0, 150, 136)', area: true } ];
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
                title: 'Resources per day',
                showYAxis: true,
                showXAxis: false,
                tooltip: { contentGenerator: function (d) { return '<span class="custom-tooltip">' + new Date(d.point.x).toLocaleDateString() +' - ' + Math.round(d.point.y) + '</span>' } }
            }
        };
    }
})();
