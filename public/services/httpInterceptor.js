app.factory('httpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            $('#loading').hide();
            return response;
        }, function (response) {
            $('#loading').hide();
            if (response.status == 500) {
                var message = '<p>' + response.data.message + '</p>';
                message += '<p>Contact your system administrator and provide this traceId: ' + response.data.traceId + '</p>';

                $("#errorModal .modal-body").html(message);
                $("#errorModal").modal();
            }
            else if (response.status == 403) {
                var message = '<p>' + response.data.message + '</p>';

                $("#errorModal .modal-body").html(message);
                $("#errorModal").modal();
            }
            return $q.reject(response);
        });
    };
});