(function () {

    angular
        .module('app')
        .controller('ClassResultController', [
            'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            '$state', '$mdToast', '$scope', '$http',
            'WorkloadService',
            'listAvailableResultsFiles', 'listAvailableRules', 'listAvailableThreshold', 'listAvailableResultsPrefix', 'listAvailableResultsLog', 'fileToJsonResults', 'fileToJsonGeneralResults',
            '$cookies', '$cookieStore',
            '$interval',
            ClassResultsController
        ]);

    function ClassResultsController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, $scope, $http, WorkloadService,
        listAvailableResultsFiles, listAvailableRules, listAvailableThreshold, listAvailableResultsPrefix, listAvailableResultsLog, fileToJsonResults, fileToJsonGeneralResults,
        $cookies, $cookieStore, $interval, $window) {
        var vm = this;
        var selectedLog = "tot";
        rows = [];
        methodGeneralValues = []
        clusterGeneralValues = []
        encodingGeneralValues = []

        ids = {};
       
        listAvailableResultsLog.query({ restype: '_class' }, function (data) {
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
            listAvailableResultsPrefix.query({ log: $scope.selectedLog, restype: '_class' }, function (data) {
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
                getListRules();
            });
        }
        getListRules = function () {
            listAvailableRules.query({ log: $scope.selectedLog, restype: '_class', Prefix: $scope.selectedPrefix }, function (data) {
                $scope.rules = data;
                if (!$cookies.get('selectedRule')) {
                    $scope.selectedRule = data[0];
                    $cookieStore.put('selectedRule', $scope.selectedRule);
                }
                else {
                    selectedRule = $cookies.get('selectedRule');
                    selectedRule = selectedRule.replace(/['"]+/g, '');
                    $scope.selectedRule = selectedRule;
                }
                getListThresholds();
            });
        }

        getListThresholds = function () {
            listAvailableThreshold.query({ log: $scope.selectedLog, restype: '_class', Prefix: $scope.selectedPrefix, rule: $scope.selectedRule }, function (data) {
                $scope.thresholds = data;
                if (!$cookies.get('selectedThreshold')) {
                    $scope.selectedThreshold = data[0];
                    $cookieStore.put('selectedThreshold', $scope.selectedThreshold);
                }
                else {
                    selectedThreshold = $cookies.get('selectedThreshold');
                    selectedThreshold = selectedThreshold.replace(/['"]+/g, '');
                    $scope.selectedThreshold = selectedThreshold;
                }
                getListfiles();
            });
        }
        getListfiles = function () {
            listAvailableResultsFiles.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, restype: '_class', rule: $scope.selectedRule, threshold: $scope.selectedThreshold }, function (data) {
                $scope.availableResutls = []
                var i = 1;
                data.forEach(function (element) {
                    if (element == "General.csv") {
                        fileToJsonGeneralResults.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, restype: '_class', rule: $scope.selectedRule, threshold: $scope.selectedThreshold }, function (data) {
                            $scope.ClassGenerals = data;
                            $scope.ClassGenerals.forEach(function (element) {
                                ids[element.Run] = i;
                                i++
                                var encodingMethod = element.Run.replace(".csv", "")
                                $scope.availableResutls.push(encodingMethod + ' (' + ids[encodingMethod] + ')')
                                rows.push([element.Run, parseFloat(element.Fmeasure), parseFloat(element.AUC), parseFloat(element.ACC)])
                                methodGeneralValues.push([ids[encodingMethod].toString(),parseFloat(element.Fmeasure), parseFloat(element.AUC),encodingMethod.split("_")[0], parseFloat(element.ACC) ])
                                clusterGeneralValues.push([ids[encodingMethod].toString(),parseFloat(element.Fmeasure), parseFloat(element.AUC),encodingMethod.split("_")[2], parseFloat(element.ACC) ])
                                encodingGeneralValues.push([ids[encodingMethod].toString(),parseFloat(element.Fmeasure), parseFloat(element.AUC),encodingMethod.split("_")[1], parseFloat(element.ACC) ])

                            });
                        });

                    }

                });
            });
        }



        $scope.update = function () {
            $scope.selectedLog = $scope.selectedLog;
            $cookieStore.put('selectedLog', $scope.selectedLog);
            $cookieStore.put('selectedPrefix', $scope.selectedPrefix);
            $cookieStore.put('selectedRule', $scope.selectedRule);
            $cookieStore.put('selectedThreshold', $scope.selectedThreshold);


            location.reload();
        }
        $scope.SelectedClassAvailableResutls = []

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
            $scope.tabs = []
            $scope.SelectedClassAvailableResutls.forEach(function (element) {
                fileToJsonResults.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, encoding: element.split("_")[1], method: element.split("_")[0], cluster: element.split("_")[2], restype: '_class', rule: $scope.selectedRule, threshold: $scope.selectedThreshold }, function (data) {
                    var matches = element.match(/\((.*?)\)/).pop();

                    $scope.tabs.push({ title: 'Run: ' + matches, Traces: data })

                });

            });
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };
        google.charts.load('current', { 'packages': ['table'] });
        google.charts.setOnLoadCallback(drawTable);

        function drawTable() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Run');
            data.addColumn('number', 'Fmeasure');
            data.addColumn('number', 'AUC');
            data.addColumn('number', 'ACC');
            data.addRows(rows)
            var table = new google.visualization.Table(document.getElementById('table_div'));

            table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
        }

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawMethodGeneralValues);

        function drawMethodGeneralValues() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'ID');
            data.addColumn('number', 'Fmeasure');
            data.addColumn('number', 'AUC');
            data.addColumn('string', 'Method')
            data.addColumn('number', 'ACC');
            data.addRows(methodGeneralValues)

           
            var options = {
                hAxis: { title: 'Fmeasure' },
                vAxis: { title: 'AUC' },
                bubble: { textStyle: { fontSize: 11 } }
            };

            var chart = new google.visualization.BubbleChart(document.getElementById('methodGeneralValues'));
            chart.draw(data, options);
        }
        

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawclusterGeneralValues);

        function drawclusterGeneralValues() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'ID');
            data.addColumn('number', 'Fmeasure');
            data.addColumn('number', 'AUC');
            data.addColumn('string', 'Clustering Method')
            data.addColumn('number', 'ACC');
            data.addRows(clusterGeneralValues)

           
            var options = {
                hAxis: { title: 'Fmeasure' },
                vAxis: { title: 'AUC' },
                bubble: { textStyle: { fontSize: 11 } }
            };

            var chart = new google.visualization.BubbleChart(document.getElementById('clusterGeneralValues'));
            chart.draw(data, options);
        }

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawencodingGeneralValues);

        function drawencodingGeneralValues() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'ID');
            data.addColumn('number', 'Fmeasure');
            data.addColumn('number', 'AUC');
            data.addColumn('string', 'Encoding Method')
            data.addColumn('number', 'ACC');
            data.addRows(encodingGeneralValues)

           
            var options = {
                hAxis: { title: 'Fmeasure' },
                vAxis: { title: 'AUC' },
                bubble: { textStyle: { fontSize: 11 } }
            };

            var chart = new google.visualization.BubbleChart(document.getElementById('encodingGeneralValues'));
            chart.draw(data, options);
        }
    }

})();
