(function () {

    angular
        .module('app')
        .controller('ConfigController', [
            'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
            '$state', '$mdToast', 'LogsService', '$scope','$http',
            'WorkloadService', 'LogsList', '$cookies', '$cookieStore',
            '$interval','$state',
            ConfigController
        ]);

    function ConfigController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, LogsService, $scope, $http, WorkloadService, LogsList, $cookies, $cookieStore, $interval, $window) {
        var vm = this;
        $scope.prefixLength = 0;
        LogsList.query({}, function (data) {
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
        $scope.RegressionMethods = ["xgboost", "linear", "randomforest", "lasso"]
        $scope.SelectedEncodingMethods = []
        $scope.SelectedClusteringMethods = []
        $scope.SelectedRegressionMethods = []

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
            var parameter = JSON.stringify({ log: $scope.selectedLog, prefix: $scope.prefixLength, encoding: $scope.SelectedEncodingMethods, regression: $scope.SelectedRegressionMethods, clustering: $scope.SelectedClusteringMethods });
            $http.post('http://193.40.11.46/core_services/configer', parameter).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $state.go('home.QueuesStatus')  
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

    }

})();
