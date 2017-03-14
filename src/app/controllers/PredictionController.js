(function(){

  angular
    .module('app')
    .controller('PredictionController', [
      '$scope',
      'Upload',
      'PredictionLink',
      '$cookies',
      PredictionController
      
    ]);

  function PredictionController($scope, Upload, PredictionLink, $cookies) {

    $scope.submit = function() {
		if ($scope.file) {
			$scope.upload($scope.file);
		}
    }

    $scope.upload = function (file) {
        Upload.upload({
              url: PredictionLink.link+'services/',
              data: {file: file}
          }).then(function (resp) {
              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          }, function (resp) {
              console.log('Error status: ' + resp.status);
          }, function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          }).catch(function(error) {
  			console.log('There has been a problem with your fetch operation: ' + error.message);
  			 // ADD THIS THROW error
  			  throw error;
  		});
    };

  }

})();
