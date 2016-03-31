'use strict';
angular.module('dmc.company-profile').
    directive('tabSkills', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-skills.html',
            scope: {
                source : "=",
                changedValue : "=",
                changes : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, companyProfileModel,fileUpload,questionToastModel) {
                $element.addClass("tab-skills");

                // get company images
                var callbackImages = function(data){
                    $scope.source.skillsImages = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
                companyProfileModel.getSkillsImages($scope.source.id, callbackImages);

                // get company skills
                var callbackSkills = function(data){
                    $scope.source.skills = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
                companyProfileModel.getSkills($scope.source.id, callbackSkills);

                // add new skill
                $scope.sendSkill = function(){
                    ajax.get(dataFactory.getLastCompanySkillId(),{
                            "_order" : "DESC",
                            "_limit" : 1,
                            "_sort" : "id"
                        },
                        function(response){
                            var data = response.data ? response.data : response;
                            var lastId = (data.length == 0 ? 1 : data[0].id+1);
                            ajax.create(dataFactory.addCompanySkill(),{
                                    id : lastId,
                                    companyId : $scope.source.id,
                                    name : $scope.newSkill
                                },
                                function(response){
                                    var data = response.data ? response.data : response;
                                    if(!$scope.source.skills) $scope.source.skills = [];
                                    $scope.source.skills.unshift(data);
                                    $scope.newSkill = null;
                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                                },function(){
                                    toastModel.showToast("error", "Error. The problem on the server (add skill).");
                                }
                            );
                        },function(){
                            toastModel.showToast("error", "Error. The problem on the server (get last skill id).");
                        }
                    );
                };

                // delete skill
                $scope.deleteSkill = function(skill,ev){
                    questionToastModel.show({
                        question : "Do you want to delete skill?",
                        buttons: {
                            ok: function(){
                                ajax.delete(dataFactory.deleteCompanySkill(skill.id),{},
                                    function(response){
                                        var data = response.data ? response.data : response;
                                        for(var index in $scope.source.skills){
                                            if($scope.source.skills[index].id == skill.id){
                                                $scope.source.skills.splice(index,1);
                                                break;
                                            }
                                        }
                                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                                    },function(){
                                        toastModel.showToast("error", "Error. The problem on the server.");
                                    }
                                );
                            },
                            cancel: function(){}
                        }
                    },ev);
                };

                // image drop box
                $scope.prevPicture = null;
                $scope.newAddedImage = null;
                $scope.pictureDragEnter = function(flow){
                    $scope.prevPicture = flow.files[0];
                    flow.files = [];
                };

                $scope.pictureDragLeave = function(flow){
                    if(flow.files.length == 0 && $scope.prevPicture != null) {
                        flow.files = [$scope.prevPicture];
                        $scope.prevPicture = null;
                    }
                };

                $scope.addedNewFile = function(file,event,flow){
                    $scope.newAddedImage = file;
                    flow.files.shift();
                };

                $scope.removePicture = function(flow){
                    flow.files = [];
                    $scope.newAddedImage = null;
                };

                $scope.addNewImage = function(){
                    $scope.isAddingImage = true;
                };

                $scope.cancelAddImage = function(){
                    $scope.isAddingImage = false;
                };

                $scope.saveImage = function(newImage){
                    if(newImage && $scope.newAddedImage){
                        fileUpload.uploadFileToUrl($scope.newAddedImage.file,{id : $scope.source.id, title : newImage.title},'company-profile-skill',callbackUploadPicture);
                        $scope.cancelAddImage();
                    }
                };

                var callbackUploadPicture = function(data){
                    if(!data.error) {
                        $scope.source.skillsImages.unshift(data.result);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        toastModel.showToast('success', 'Image successfully added');
                    }else{
                        toastModel.showToast('error', 'Unable add image');
                    }
                };

                $scope.deleteImage = function(img,ev){
                    questionToastModel.show({
                        question : "Do you want to delete image?",
                        buttons: {
                            ok: function(){
                                if(!$scope.changes.removedSkillsImages) $scope.changes.removedSkillsImages = [];
                                $scope.changes.removedSkillsImages.push(img.id);
                                img.hide = true;
                                $scope.changedValue('image');
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };
            }
        };
    }]);