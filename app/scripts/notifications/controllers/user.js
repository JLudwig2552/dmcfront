'use strict';

angular.module('dmc.notifications')
	.controller('notificationsUserController', ['$scope', 'ajax', 'notificationsStatistic', 'notificationsModel', function ($scope, ajax, notificationsStatistic, notificationsModel) {
		$scope.user = true;
		$scope.filterFlag = false;
		$scope.typeNotifications = "Today";

		$scope.notifications = notificationsStatistic;

		$scope.notificationsData = [];
		notificationsModel.get_notifications(
			{
				"period": "today"
			},
			function(data){
				$scope.notificationsData = data;
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
			}
		)

		$scope.reset = function() {
			$scope.typeNotifications = "Today";
			$scope.filterFlag = false;
			notificationsModel.get_notifications(
				{
					"period": "today"
				},
				function(data){
					$scope.notificationsData = data;
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				}
			)
		}

		$scope.filtered = function(time, type, name){
			var period = "";
			if(time == "today"){
				period = "today";
			}else if (time == "week"){
				period = ["today","week"];
			}else{
				period = ["today","week","month"];
			}
			notificationsModel.get_notifications(
				{
					"period": period,
					"type": type
				},
				function(data){
					$scope.notificationsData = data;
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				}
			)
			$scope.typeNotifications = name
			$scope.filterFlag = true;
		}
	}]);