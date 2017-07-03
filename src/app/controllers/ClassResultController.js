(function () {

    angular
        .module('app')
        .controller('ClassResultController', [
            'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            '$state', '$mdToast', '$scope', '$http',
            'WorkloadService',
            'listAvailableResultsFiles', 'listAvailableResultsPrefix', 'listAvailableResultsLog', 'fileToJsonResults', 'fileToJsonGeneralResults',
            '$cookies', '$cookieStore',
            '$interval',
            ClassResultsController
        ]);

    function ClassResultsController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, $scope, $http, WorkloadService,
        listAvailableResultsFiles, listAvailableResultsPrefix, listAvailableResultsLog, fileToJsonResults, fileToJsonGeneralResults,
        $cookies, $cookieStore, $interval, $window) {
        var vm = this;
        var selectedLog = "tot";

        listAvailableResultsLog.query({restype: '_class'}, function (data) {
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
                getListfiles();
            });
        }
        getListfiles = function () {
            listAvailableResultsFiles.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, restype: '_class' }, function (data) {
                //console.log(data)
                encodingMethods = []
                $scope.availableResutls = []
                data.forEach(function (element) {
                    if (element == "General.csv") {
                        fileToJsonGeneralResults.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, restype: '_class' }, function (data) {
                            $scope.ClassGenerals = data;
                        });
                    } else {
                        var encodingMethod = element.replace(".csv", "")
                        $scope.availableResutls.push(encodingMethod)
                        // $scope.content_;


                    }

                });
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
                fileToJsonResults.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, encoding: element.split("_")[1], method: element.split("_")[0], cluster: element.split("_")[2], restype: '_class' }, function (data) {
                    $scope.tabs.push({ title: element, Traces: data })
                    console.log(data[0]['Id'])

                });

            });
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };


    }

})();
