(function () {

    angular
        .module('app')
        .controller('ClassConfigController', [
            'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            '$state', '$mdToast', 'LogsService', '$scope','$http',
            'WorkloadService', 'LogsList_dev', '$cookies', '$cookieStore',
            '$interval',
            ClassConfigController
        ]);

    function ClassConfigController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, LogsService, $scope, $http, WorkloadService, LogsList_dev, $cookies, $cookieStore, $interval, $window) {
        var vm = this;
        $scope.prefixLength = 0;
        $scope.thresholdValue = {value: 0};

        LogsList_dev.query({}, function (data) {
            console.log(data)
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
        });
        console.log($scope.selectedLog)
        $scope.EncodingMethods = ["simpleIndex", "boolean", "frequency", "complexIndex", "indexLatestPayload"];
        $scope.ClusteringMethods = ['Kmeans', 'None'];
        $scope.ClassMethods = ["KNN", "RandomForest", "DecisionTree"]
        $scope.Rules = ['remainingTime', 'duration']
        $scope.SelectedEncodingMethods = []
        $scope.SelectedClusteringMethods = []
        $scope.SelectedClassMethods = []
        $scope.selectedRule = ""
        $scope.selectedThreshold = ""

        

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.update = function () {
            $scope.selectedLog = $scope.selectedLog;
            $cookieStore.put('selectedLog', $scope.selectedLog);
            location.reload();
        }

        $scope.postToConfiger = function () {
            if ($scope.selectedThreshold == 'custom') {
                $scope.selectedThreshold = $scope.thresholdValue.value 
                
            }
            var parameter = JSON.stringify({ log: $scope.selectedLog, prefix: $scope.prefixLength, encoding: $scope.SelectedEncodingMethods, classification: $scope.SelectedClassMethods, clustering: $scope.SelectedClusteringMethods, rule: $scope.selectedRule, threshold: $scope.selectedThreshold });
            $http.post('http://127.0.0.1:8000/core_services/classConfiger', parameter).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(data);
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

    }

})();
