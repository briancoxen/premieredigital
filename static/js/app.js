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

premiereApp.service('premiereService', ['$http', function ($http) {
    this.uploadXMLFile = function(cb, file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
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

    this.uploadMediaFile = function(cb, file, id, checksum, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('id', id);
        fd.append('checksum', checksum);
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

premiereApp.controller('premiereCtrl', ['$scope', 'premiereService', function($scope, premiereService, movies){
    $scope.detailsPage = false;
    $scope.xmlUploader = true;
    $scope.AllMovies = true;
    $scope.Pagination = true;
    $scope.Movies = [];

    premiereService.getAll(function(cb) {
        angular.forEach(cb, function(values) {
            $scope.Movies.push(values);
        });
    });

    $scope.getAllData = function() {
        $scope.error = false;
        $scope.MovieDetails = false;
        $scope.detailsPage = false;
        $scope.AllMovies = true;
        $scope.xmlUploader = true;
        $scope.Pagination = true;
        $scope.Movies = [];
        premiereService.getAll(function(cb) {
            angular.forEach(cb, function(values) {
                $scope.Movies.push(values);
            });
        });
    }

    $scope.uploadXMLFile = function(){
        $scope.xmlUploader = false;
        $scope.AllMovies = false;

        $scope.xmlUploadSpinner = true;

        var file = $scope.file;
        var uploadUrl = "http://52.25.116.171:8080/uploadXML";

        premiereService.uploadXMLFile(function(cb) {
            $scope.xmlUploader = true;
            $scope.xmlUploadSpinner = false;
            $scope.AllMovies = true;
            $scope.Movies = [];
            if (cb.success === "0"){
                premiereService.getAll(function(cb) {
                    angular.forEach(cb, function(values) {
                        $scope.Movies.push(values); 
                    });
                }); 
            }
        }, file, uploadUrl);
    };

    $scope.uploadMediaFile = function(id, checksum){
        $scope.mediaUploadSpinner = true;
        $scope.mediaUploadForm = false;
        var file = $scope.file;
        var uploadUrl = "http://52.25.116.171:8080/uploadMedia";

        premiereService.uploadMediaFile(function(cb) {
            $scope.mediaUploadSpinner = false;

            if (cb.status === "0"){
                $scope.error = false;
                $scope.details.File = cb.File;
            } else {
                $scope.mediaUploadForm = true;
                $scope.error = true;
                $scope.errorMsg = "The uploaded file's checksum did not match, please try again! " + cb.error;
            }
        }, file, id, checksum, uploadUrl);
    };

    $scope.showDetails = function(id, Title, MD5, Director, ReleaseDate, Length, Type, Description, File) {
        $scope.mediaUploadForm = true;
        $scope.AllMovies = false;
        $scope.Pagination = false;
        $scope.xmlUploader = false;

        $scope.MovieDetails = true;
        $scope.detailsPage = true;
  
        $scope.details = {
            id : id,
            Title : Title,
            MD5 : MD5,
            Director : Director,
            ReleaseDate : ReleaseDate,
            Length : Length,
            Type : Type,
            Description : Description,
            File : File,
        };
    };
}]);
