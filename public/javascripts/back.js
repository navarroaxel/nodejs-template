var app = angular.module('backoffice', ['ngRoute', 'ui.tinymce']);
app.config(function ($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            controller: 'homeController',
            templateUrl: '/views/home/index.html'
        })
        .when('/layouts', {
            controller: 'layoutsController',
            templateUrl: '/views/layouts/index.html'
        })
        .when('/layouts/new', {
            controller: 'layoutEditorController',
            templateUrl: '/views/layouts/editor.html'
        })
        .when('/layouts/:id', {
            controller: 'layoutEditorController',
            templateUrl: '/views/layouts/editor.html'
        })
        .otherwise({ redirectTo: '/' });

    // Interceptors
    $httpProvider.responseInterceptors.push('httpInterceptor');
    $httpProvider.defaults.transformRequest.push(function (data, headersGetter) {
        $('#loading').show();
        return data;
    });
});