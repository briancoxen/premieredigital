var premiereApp = angular.module('premiereApp', ['angularUtils.directives.dirPagination']);

premiereApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

premiereApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(cb, file, name, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('name', name);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
            cb(data);
        })
        .error(function(){
        });
    }

    this.getAll = function(cb){
        $http.get("http://52.25.116.171:8080/getMovieData")
        .success(function(data){
            cb(data);
        })
        .error(function(){
        });
    }
}]);

premiereApp.controller('premiereCtrl', ['$scope', 'fileUpload', function($scope, fileUpload, movies){
    $scope.xmlUploader = true;

    $scope.uploadFile = function(){
        $scope.xmlUploader = false;
        var file = $scope.file;
        var uploadUrl = "http://52.25.116.171:8080/uploadXML";

        fileUpload.uploadFileToUrl(function(cb) {
            if (cb.success === "0"){
                fileUpload.getAll(function(cb) {
                    $scope.Movies = cb;
                    $scope.allMovies = true;
                }); 
            }
        }, file, $scope.name, uploadUrl);
    };
}]);
