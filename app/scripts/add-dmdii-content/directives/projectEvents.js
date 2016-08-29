'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectEvents', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-events.html',
            scope: {
                source : "=",
                projects: "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $window) {
                $element.addClass("tab-projectEvents");


                $scope.$watch('event', function() {
                    if ($scope.noTitle && angular.isDefined($scope.event.eventName) && $scope.event.eventName.length > 0) {
                        $scope.noTitle = false;
                    }

                    if ($scope.noDateSelected && angular.isDefined($scope.event.eventDate)) {
                        $scope.noDateSelected = false;
                    }

                    if ($scope.noDescription && angular.isDefined($scope.event.eventDescription) && $scope.event.eventDescription.length > 0) {
                        $scope.noDescription = false;
                    }
                }, true);

                var eventCallback = function(response) {
                    toastModel.showToast('success', 'Project Event Saved!');
                    $window.location.reload();
                };

                $scope.clear = function() {
                    $scope.event = {};
                };

                $scope.querySearch = function(query) {
                    var results = query ? $scope.projects.filter( createFilterFor(query) ) : $scope.projects,
                        deferred;
                    return results;
                }

                function createFilterFor(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(project) {
                        return (project.projectTitle.toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                }

                $scope.save = function() {

                    if (!$scope.event.eventName) {
                        $scope.noTitle = true;
                    }
                    if (!$scope.event.eventDate) {
                        $scope.noDateSelected = true;
                    }
                    if (!$scope.event.eventDescription) {
                        $scope.noDescription = true;
                    }

                    if ( $scope.noTitle || $scope.noDateSelected || $scope.noDescription) {
                        return;
                    }
                    // if ($scope.selectedItem) {
                    //     $scope.event.projectId = $scope.selectedItem.id;
                    // }

                    ajax.create(dataFactory.saveDMDIIProject().events, $scope.event, eventCallback);
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

            }
        };
    }]);
