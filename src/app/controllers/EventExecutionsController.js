(function () {
    angular
        .module('app')
        .controller('EventExecutionsController', ['EventExecutionService', '$scope',
            EventExecutionsController
        ]);

    function EventExecutionsController(EventExecutionsService, $scope) {
        var vm = this;
        vm.eventsChartData = [];

        EventExecutionsService.get({id: 1}, function(result) {
            console.log(result);
            var data = [];
            var count = 0;
            for (var event in result) {
                data.push({label: event, value: result[event]});
                count++;
                if(count == 20) break;
            }
            vm.eventsChartData = [ { values: data, color: 'rgb(0, 150, 136)', area: true } ];
        });

        vm.chartOptions = {
            chart: {
                height: 230,
                
                type: 'discreteBarChart',
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showLabels: false,
                showLegend: false,
                title: 'Event Executions',
                showYAxis: true,
                showXAxis: false,
                tooltip: { contentGenerator: function (d) { return '<span class="custom-tooltip">[' + d.data.label + ']-' + d.data.value + '</span>' } }
            }
        };
    }
})();
