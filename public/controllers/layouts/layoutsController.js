app.controller('layoutsController', function ($scope, $http) {
    $http.get('/api/layouts/')
        .success(function (data, status) {
            $scope.layouts = data;
        });
});