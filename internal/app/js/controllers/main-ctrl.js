'use strict';

angular
    .module('app.controllers')
    .controller('MainCtrl', function($scope, $location, Restangular) {
        $scope.loadingPromise = Restangular.one('users/me')
            .get()
            .then(function(data) {
                data = data.data;
                $scope.user = data;
            })
            .catch(function(res) {
                console.log('Log in');
            });
    });
