(function () {

    angular
        .module('app')
        .controller('RegResultController', [
            'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            '$state', '$mdToast', '$scope', '$http',
            'WorkloadService',
            'listAvailableResultsFiles', 'listAvailableResultsPrefix', 'listAvailableResultsLog', 'fileToJsonResults',
            '$cookies', '$cookieStore',
            '$interval',
            RegResultsController
        ]);

    function RegResultsController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, $scope, $http, WorkloadService,
        listAvailableResultsFiles, listAvailableResultsPrefix, listAvailableResultsLog, fileToJsonResults,
        $cookies, $cookieStore, $interval, $window) {
        var vm = this;
        var selectedLog = "tot";

        listAvailableResultsLog.query({}, function (data) {
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
        console.log('----------------------------------------------------------------------')
        console.log('fu')
        console.log(selectedLog)

        getListPrefix = function () {
            listAvailableResultsPrefix.query({ log: $scope.selectedLog }, function (data) {
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
            listAvailableResultsFiles.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix }, function (data) {
                console.log(data)
                $scope.tabs = []
                encodingMethods = []
                data.forEach(function (element) {
                    var encodingMethod = element.replace(".csv", "")
                    $scope.content_;
                    fileToJsonResults.query({ log: $scope.selectedLog, Prefix: $scope.selectedPrefix, encoding: encodingMethod.split("_")[1], method: encodingMethod.split("_")[0], cluster:encodingMethod.split("_")[2]  }, function (data) {
                        $scope.content_ = JSON.stringify(data)
                        encodingMethods.push(encodingMethod)
                        $scope.tabs.push({ title: encodingMethod, Traces: data })

                    });

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

        
    }

})();
