'use strict';

angular.module('dmc.model.project', ['dmc.data'])
 .service('DMCProjectModel', ['$http', 'dataFactory', function($http, dataFactory) {

    this.getModel = function(id) {
        return $http.get(dataFactory.getUrlAllProjects()).then(
            function(response){
              var arr = response.data.result;
              for (var i = 0, len = arr.length; i < len; i++) {
                  if (arr[i].id == id)
                      return arr[i]; // Return as soon as the object is found
              }
            },
            function(response){
              return response;
            }
          );
    };
}]);