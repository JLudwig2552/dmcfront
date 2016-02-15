'use strict';

angular.module('dmc.widgets.services',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket'
    ]).
    directive('uiWidgetServices', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/services.html',
            scope: {
                columns: "=",
                widgetTitle: "=",
                widgetStyle: "=",
                projectId: "=",
                titleHref: "=",
                viewAllHref: "=",
                startAtOffset: "=",
                progressPosition: "=",
                limit: "=",
                sortBy: "="
            },
            link: function (scope, iElement, iAttrs) {

            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel) {
                $scope.services = [];
                $scope.total = 0;
                $scope.sort = $scope.sortBy ? $scope.sortBy : '-currentStatus.status';
                $scope.order = 'DESC';
                if(!$scope.limit) $scope.limit = 5;
                // function for get all services from DB

                var allServices = [];
                $scope.getServices = function(){
                    ajax.get(dataFactory.getServices($scope.projectId),{},
                        function(response){
                            $scope.total = response.data.length;
                            allServices = response.data;
                            getLastStatuses($.map(response.data,function(x){ return x.id; }));
                        },function(response){
                            toastModel.showToast("error", "Ajax faild: getServices");
                        }
                    );
                };

                $scope.onOrderChange = function(order) {
                    $scope.sort = order;
                };

                // get all services (first request)
                $scope.getServices();

                function getLastStatuses(ids){
                    var requestData = {
                        serviceId : ids,
                        _sort : "startDate",
                        _order : "DESC"
                    };
                    ajax.get(dataFactory.runService(),requestData,
                        function(response){
                            for(var i in allServices){
                                for(var j=0;j<response.data.length;j++){
                                    if(allServices[i].id == response.data[j].serviceId){
                                        allServices[i].currentStatus = response.data[j];
                                        allServices[i].currentStatus.date = new Date(allServices[i].currentStatus.startDate+' '+allServices[i].currentStatus.startTime);
                                        allServices[i].currentStatus.startDate = moment(allServices[i].currentStatus.startDate).format("MM/DD/YYYY");
                                        allServices[i].currentStatus.startTime = moment(new Date(allServices[i].currentStatus.startDate+' '+allServices[i].currentStatus.startTime)).format("hh:mm:ss A");
                                        break;
                                    }
                                }
                                if(!allServices[i].currentStatus) allServices[i].currentStatus = { status : -2 };
                            }
                            allServices.sort(function(a, b) { return b.currentStatus.status - a.currentStatus.status }).splice($scope.limit,allServices.length);
                            $scope.services = allServices;
                            $.each($scope.services,function(){
                                this.releaseDateFormat = this.releaseDate;
                                this.releaseDate = Date.parse(this.releaseDate);
                            });
                            apply();
                        }
                    );
                }

                // Socket listeners -------------------------------------------------

                // get updated service
                //socketFactory.on(socketFactory.updated().services, function(item){
                //    $scope.getServices();
                //});

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        };
    }])