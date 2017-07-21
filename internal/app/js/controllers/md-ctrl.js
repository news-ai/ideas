'use strict';

angular
    .module('app.controllers')
    .controller('MediaDatabaseCtrl', function($scope, $location, Restangular) {
        var baseDatabaseContacts = Restangular.all('database-contacts');
        $scope.totalItems = 1;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 30;
        $scope.mdContacts = [];
        $scope.contact = {
            'email': '',
            'beats': [],
            'occasionalBeats': [],
            'isFreelancer': false
        };

        $scope.pageChanged = function() {
            var currentPageIndex = $scope.currentPage - 1;
            var offset = 30 * currentPageIndex;
            $scope.loadingPromise = Restangular.one('database-contacts?limit=' + $scope.itemsPerPage + '&offset=' + offset)
                .get()
                .then(function(data) {
                    $scope.totalItems = data.summary.total;
                    data = data.data;
                    for (var i = 0; i < data.length; i++) {
                        $scope.mdContacts[offset + i] = data[i];
                    }
                });
        };

        $scope.submit = function() {
            if ($scope.contact.email !== '') {
                $scope.contact.email = $scope.contact.email.toLowerCase();
                var beats = [];
                var occasionalBeats = []
                for (var i = 0; i < $scope.contact.beats.length; i++) {
                    beats.push($scope.contact.beats[i].text);
                }
                for (var i = 0; i < $scope.contact.occasionalBeats.length; i++) {
                    occasionalBeats.push($scope.contact.occasionalBeats[i].text);
                }

                if (beats.length === 0) {
                    beats.push('Tech');
                }

                var outline = {
                    'email': $scope.contact.email,
                    'writingInformation': {
                        "beats": beats,
                        "occasionalBeats": occasionalBeats,
                        "isFreelancer": $scope.contact.isFreelancer
                    }
                };
                baseDatabaseContacts.post(outline);
            }
        };

        $scope.pageChanged();
    });