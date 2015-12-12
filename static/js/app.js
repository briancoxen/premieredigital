var premiereApp = angular.module('premiereApp', []);

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
    this.uploadFileToUrl = function(file, name, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('name', name);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
            return data;
        })
        .error(function(){
        });
    }

    this.getAll = function(){
        $http.get("http://52.25.116.171:8080/getMovieData")
        .success(function(data){
            console.log(data);
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
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "http://52.25.116.171:8080/uploadXML";
        fileUpload.uploadFileToUrl(file, $scope.name, uploadUrl);
        fileUpload.getAll(); 
    };
}]);
