'use strict';

angular.module('dmc.add-project-doc')
    .controller('DMCAddProjectDocController', [
        '$stateParams',
        '$scope',
        '$q',
        '$timeout',
        'ajax',
        'dataFactory',
        '$location',
        'toastModel',
        'questionToastModel',
        'DMCUserModel',
        'fileUpload',
        '$window',
        function ($stateParams,
            $scope,
            $q,
            $timeout,
            ajax,
            dataFactory,
            $location,
            toastModel,
            questionToastModel,
            DMCUserModel,
            fileUpload,
            $window) {


            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.getProject = function() {
                ajax.get(dataFactory.getDMDIIProject($stateParams.projectId).get, {}, function(response) {
                    $scope.project = response.data;
                });
            }
            $scope.getProject();


            $scope.currentSection = {
                index : 0,
                name : 'projectUpdates'
            };

            $scope.sections = {
                projectUpdates : {
                    title : 'Project Updates'
                },
                projectDocuments : {
                    title : 'Project Documents'
                },
                projectFinancials: {
                    title : 'Project Financials'
                },
                projectSchedule: {
                    title : 'Project Schedule'
                }
            };

            var getCurrentSection = function(){
                var sectionName = $location.$$path.split('/');
                sectionName = sectionName[sectionName.length-1];

                var index = 0;
                for(var s in $scope.sections){
                    if(s == sectionName) {
                        $scope.currentSection = {
                            index : index,
                            name : sectionName
                        };
                        break;
                    }
                    index++;
                }
            };
            getCurrentSection();

            $scope.onSectionSelected = function(key){
                $location.path('/' + $scope.project.id + '/' + key);
                getCurrentSection();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }
    ]);
