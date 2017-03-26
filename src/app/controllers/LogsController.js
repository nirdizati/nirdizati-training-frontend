(function(){

  angular
    .module('app')
    .controller('LogsController', [
      '$scope',
      'LogsService',
      'Upload',
      'BackEnd',
      LogsController
    ]);

  function LogsController($scope, LogsService, Upload, BackEnd) {

    	$scope.submit = function() {
  	  	if ($scope.file) {
  	        $scope.upload($scope.file);
  	    }
    	}

      // upload on file select or drop
      $scope.upload = function (file) {
          Upload.upload({
              url: BackEnd.link+'logs/uploadFile',
              data: {file: file, 'name': $scope.log.name, 'description': $scope.log.description}
          }).then(function (resp) {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.querySelector('#logs_div')))
              .clickOutsideToClose(true)
              .title('Upload Successful')
              .textContent('Please go to the dashboard page and select this log.')
              .ok('Ok')
            );
              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          }, function (resp) {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.querySelector('#logs_div')))
              .clickOutsideToClose(true)
              .title('Upload Failed')
              .textContent('There might be something wrong with the file you are uploading. Please try again.')
              .ok('Ok')
            );
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
