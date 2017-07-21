'use strict';

// Front-end angular routes
angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'partials/newsai.html',
                controller: 'MainCtrl'
            })
            .state('md', {
                url: '/md',
                templateUrl: 'partials/md.html',
                controller: 'MediaDatabaseCtrl'
            })
            .state('md-contact', {
                url: '/md-contact/:id',
                templateUrl: 'partials/md-contact.html',
                controller: 'MediaDatabaseContactCtrl'
            });
    });
