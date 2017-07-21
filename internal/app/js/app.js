'use strict';

angular.module('app.services', ['restangular']);
angular.module('app.controllers', ['app.services']);
angular.module('app', [
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'restangular',
    'app.services',
    'app.directives',
    'app.filters',
    'app.controllers',
    'cgBusy',
    'angular.filter',
    'angularMoment',
    'ngTagsInput',
]).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('https://dev-dot-newsai-1166.appspot.com/api');
    RestangularProvider.setDefaultHttpFields({
        withCredentials: true
    });
    RestangularProvider.setDefaultHeaders({
        'Accept': 'application/json, application/*, */*',
        'Content-Type': 'application/json'
    });
});
