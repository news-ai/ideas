'use strict';

angular
    .module('app.controllers')
    .controller('MediaDatabaseContactCtrl', function($scope, $location, $stateParams, Restangular) {
        var email = $stateParams.id;
        $scope.loadingPromise = Restangular.one('database-contacts/' + email)
            .get()
            .then(function(data) {
                data = data.data;
                $scope.mdContact = data;
                $scope.contact = {};

                $scope.contact.fullName = data.contactInfo.fullName;
                $scope.contact.beats = data.writingInformation.beats;
                $scope.contact.occasionalBeats = data.writingInformation.occasionalBeats;
                $scope.contact.organizations = data.organizations;

                for (var i = 0; i < data.socialProfiles.length; i++) {
                    if (data.socialProfiles[i].typeId === 'twitter') {
                        $scope.contact.twitterUsername = data.socialProfiles[i].username
                    } else if (data.socialProfiles[i].typeId === 'linkedin') {
                        $scope.contact.linkedinUsername = data.socialProfiles[i].url
                    }
                }
            });
    });
