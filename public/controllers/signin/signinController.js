app.controller('signinController', function ($scope, $http) {

    $scope.signin = function () {
        $scope.working = true;
        $scope.errorMessage = '';

        if (!$scope.email && !$scope.password) {
            return;
        }

        $http.post('/public-api/sign-in', { email: $scope.email, password: $scope.password })
            .success(function (data, status) {
                $scope.working = false;
                window.location = '/back';
            })
            .error(function (data, status) {
                $scope.errorMessage = data.message;
                $scope.working = false;
            });
    };

    $scope.sendReset = function () {
        $scope.resetWorking = true;
        $scope.resetErrorMessage = '';

        $http.post('/public-api/reset-password/email', $scope.reset)
            .success(function (data, status) {
                $scope.resetErrorMessage = '';
                $scope.resetWorking = false;

                $('#myModal').modal('hide');
                $("#sent").fadeIn("slow");
            })
            .error(function (data, status) {
                $scope.resetErrorMessage = data.message;
                $scope.resetWorking = false;
            });
    }
});