(function () {

    angular
        .module('app')
        .controller('RegResultController', [
            'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            '$state', '$mdToast', '$scope', '$http',
            'WorkloadService',
            'listAvailableResultsFiles', 'listAvailableResultsPrefix', 'listAvailableResultsLog', 'fileToJsonResults', 'fileToJsonGeneralResults',
            '$cookies', '$cookieStore',
            '$interval',
            RegResultsController
        ]);

    function RegResultsController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, $scope, $http, WorkloadService,
        listAvailableResultsFiles, listAvailableResultsPrefix, listAvailableResultsLog, fileToJsonResults, fileToJsonGeneralResults,
        $cookies, $cookieStore, $interval, $window) {
        var vm = this;
        var selectedLog = "tot";

        rows = [];
        methodGeneralValues = []
        clusterGeneralValues = []
        encodingGeneralValues = []

        ids = {};

        listAvailableResultsLog.query({ restype: '_regg' }, function (data) {
            $scope.logs = data;
            if (!$cookies.get('selectedLog')) {
                $scope.selectedLog = data[0];
                $cookieStore.put('selectedLog', $scope.selectedLog);
            }
            else {
                selectedLog = $cookies.get('selectedLog');
                selectedLog = selectedLog.replace(/['"]+/g, '');
                $scope.selectedLog = selectedLog;
            }
            getListPrefix()
        });

        getListPrefix = function () {
            listAvailableResultsPrefix.query({ log: $scope.selectedLog, restype: '_regg' }, function (data) {
                $scope.prefixs = data;
                if (!$cookies.get('selectedPrefix')) {
                    $scope.selectedPrefix = data[0];
                    $cookieStore.put('selectedPrefix', $scope.selectedPrefix);
                }
                else {
                    selectedPrefix = $cookies.get('selectedPrefix');
                    selectedPrefix = selectedPrefix.replace(/['"]+/g, '');
                    $scope.selectedPrefix = selectedPrefix;
                }
                getListfiles();
            });
        }
        getListfiles = function () {
            listAvailableResultsFiles.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, restype: '_regg' }, function (data) {
                //console.log(data)
                $scope.downloadRegUrl = "http://193.40.11.46/core_services/downloadZip?log="+ $scope.selectedLog+"&Prefix=" +$scope.selectedPrefix+"&restype=regg"

                encodingMethods = []
                $scope.regavailableResutls = []
                var i = 1;

                data.forEach(function (element) {
                    if (element == "General.csv") {
                        fileToJsonGeneralResults.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, restype: '_regg' }, function (data) {
                            $scope.Generals = data;
                            $scope.Generals.forEach(function (element) {
                                ids[element.Run] = i;
                                i++
                                var encodingMethod = element.Run.replace(".csv", "")
                                $scope.regavailableResutls.push(encodingMethod + ' (' + ids[encodingMethod] + ')')
                                rows.push([(encodingMethod + ' (' + ids[encodingMethod] + ')'), parseFloat(element.Mae), parseFloat(element.Rmse), parseFloat(element.Rscore)])
                                if (Math.abs(parseFloat(element.Rscore)) < 1) {
                                    methodGeneralValues.push([ids[encodingMethod].toString(), parseFloat(element.Mae), parseFloat(element.Rmse), encodingMethod.split("_")[0], parseFloat(element.Rscore)])
                                    clusterGeneralValues.push([ids[encodingMethod].toString(), parseFloat(element.Mae), parseFloat(element.Rmse), encodingMethod.split("_")[2], parseFloat(element.Rscore)])
                                    encodingGeneralValues.push([ids[encodingMethod].toString(), parseFloat(element.Mae), parseFloat(element.Rmse), encodingMethod.split("_")[1], parseFloat(element.Rscore)])

                                }

                            });
                        });
                    }
                });
                google.charts.load('current', { 'packages': ['table'] });
                google.charts.setOnLoadCallback(drawTable);

                function drawTable() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Run');
                    data.addColumn('number', 'Mae');
                    data.addColumn('number', 'Rmse');
                    data.addColumn('number', 'Rscore');
                    data.addRows(rows)
                    var table = new google.visualization.Table(document.getElementById('regtable_div'));

                    table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                }

                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawMethodGeneralValues);

                function drawMethodGeneralValues() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'ID');
                    data.addColumn('number', 'Mae');
                    data.addColumn('number', 'Rmse');
                    data.addColumn('string', 'Method')
                    data.addColumn('number', 'Rscore');
                    data.addRows(methodGeneralValues)


                    var options = {
                        hAxis: { title: 'Mae' },
                        vAxis: { title: 'Rmse' },
                        bubble: { textStyle: { fontSize: 11 } }
                    };

                    var chart = new google.visualization.BubbleChart(document.getElementById('regmethodGeneralValues'));
                    chart.draw(data, options);
                }


                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawclusterGeneralValues);

                function drawclusterGeneralValues() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'ID');
                    data.addColumn('number', 'Mae');
                    data.addColumn('number', 'Rmse');
                    data.addColumn('string', 'Clustering Method')
                    data.addColumn('number', 'Rscore');
                    data.addRows(clusterGeneralValues)


                    var options = {
                        hAxis: { title: 'Mae' },
                        vAxis: { title: 'Rmse' },
                        bubble: { textStyle: { fontSize: 11 } }
                    };

                    var chart = new google.visualization.BubbleChart(document.getElementById('regclusterGeneralValues'));
                    chart.draw(data, options);
                }

                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawencodingGeneralValues);

                function drawencodingGeneralValues() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'ID');
                    data.addColumn('number', 'Mae');
                    data.addColumn('number', 'Rmse');
                    data.addColumn('string', 'Endcoding Method')
                    data.addColumn('number', 'Rscore');
                    data.addRows(encodingGeneralValues)


                    var options = {
                        hAxis: { title: 'Mae' },
                        vAxis: { title: 'Rmse' },
                        bubble: { textStyle: { fontSize: 11 } }
                    };

                    var chart = new google.visualization.BubbleChart(document.getElementById('regencodingGeneralValues'));
                    chart.draw(data, options);
                }
                console.log(encodingMethods)
                console.log('----------------------------------------------------------------------')
            });
        }

        $scope.update = function () {
            $scope.selectedLog = $scope.selectedLog;
            $cookieStore.put('selectedLog', $scope.selectedLog);
            $cookieStore.put('selectedPrefix', $scope.selectedPrefix);
            location.reload();
        }
        $scope.SelectedregavailableResutls = []

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
            $scope.tabs = []
            $scope.SelectedregavailableResutls.forEach(function (element) {
                fileToJsonResults.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, encoding: element.split("_")[1], method: element.split("_")[0], cluster: element.split("_")[2], restype: '_regg' }, function (data) {
                    var matches = element.match(/\((.*?)\)/).pop();

                    $scope.tabs.push({ title: 'Run: ' + matches, Traces: data })

                });

            });
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        



    }

})();
