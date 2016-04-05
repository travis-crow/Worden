//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('fileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
	
	
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    };
    
    $scope.startUpload = function(){
    	 if ($scope.files && $scope.files.length) {
             Upload.upload({
                 url: '/Spring4MVCAngularJSExample/StartProcess',
                 data: {
                     files: $scope.files,
                     test: $scope.testFile,
                     type: $scope.type
                 }
             }).then(function (response) {
                 $timeout(function () {
                     $scope.result = response.data;
                 });
             }, function (response) {
                 if (response.status > 0) {
                     $scope.errorMsg = response.status + ': ' + response.data;
                 }
             }, function (evt) {
                 $scope.progress = 
                     Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
             });
         }
    };
    
    
    
}]);