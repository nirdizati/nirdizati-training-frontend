(function () {

    angular
        .module('app')
        .controller('QueuesStatusController', [
            'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            '$state', '$mdToast', 'LogsService', '$scope', '$http',
            'WorkloadService', 'listGetConfStatus', '$cookies', '$cookieStore',
            '$interval', '$state',
            QueuesStatusController
        ]);

    function QueuesStatusController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, LogsService, $scope, $http, WorkloadService, listGetConfStatus, $cookies, $cookieStore, $interval, $window) {

        function getStatus() {
            rows = []
            listGetConfStatus.query({}, function (data) {
                data.forEach(function (element) {
                    rows.push([element.Type,element.Log, element.Run, element.Prefix,element.Rule,element.Threshold, element.TimeStamp, element.Status])

                });
                console.log(rows)
                google.charts.load('current', { 'packages': ['table'] });
                google.charts.setOnLoadCallback(drawTable);

                function drawTable() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Type');
                    data.addColumn('string', 'Log');
                    data.addColumn('string', 'Run');
                    data.addColumn('string', 'Prefix');
                    data.addColumn('string', 'Rule');
                    data.addColumn('string', 'Threshold');
                    data.addColumn('string', 'TimeStamp');
                    data.addColumn('string', 'Status');                    
                    
                    data.addRows(rows)
                    var table = new google.visualization.Table(document.getElementById('QueuesStatustable_div'));

                    table.draw(data, {sortColumn:6,sortAscending:false, showRowNumber: true, width: '100%', height: '100%' });
                }

            });
        }
        var stopTime;
        stopTime = $interval(getStatus, 2000);
        $scope.fight = function() {
            stopTime = $interval(getStatus, 2000);
        };
        
        $scope.stopFight = function() {
            $interval.cancel(stopTime);
        };

    }

})();
