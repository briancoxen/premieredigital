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
    $scope.AllMovies = true;
    $scope.Pagination = true;
    $scope.Movies = [];

    fileUpload.getAll(function(cb) {
        angular.forEach(cb, function(values) {
            $scope.Movies.push(values);
        });
    });

    $scope.uploadFile = function(){
        $scope.xmlUploader = false;
        $scope.xmlUploadSpinner = true;
        var file = $scope.file;
        var uploadUrl = "http://52.25.116.171:8080/uploadXML";

        fileUpload.uploadFileToUrl(function(cb) {
            $scope.xmlUploader = true;
            $scope.xmlUploadSpinner = false;
            $scope.Movies = [];
            if (cb.success === "0"){
                fileUpload.getAll(function(cb) {
                    angular.forEach(cb, function(values) {
                        $scope.Movies.push(values); 
                    });
                }); 
            }
        }, file, $scope.name, uploadUrl);
    };

    $scope.showDetails = function(id, Title, MD5, Director, ReleaseDate, Length, Type, Description) {
        $scope.AllMovies = false;
        $scope.Pagination = false;
        $scope.MovieDetails = true;

        $scope.details = {
            id : id,
            Title : Title,
            MD5 : MD5,
            Director : Director,
            ReleaseDate : ReleaseDate,
            Length : Length,
            Type : Type,
            Description : Description,
        };
    };
}]);
