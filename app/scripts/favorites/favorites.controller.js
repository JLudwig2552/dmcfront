'use strict';
angular.module('dmc.all-favorites')
    .controller('AllFavoritesCtrl', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'menuFavorite',
        'ajax',
        'dataFactory',
        'isFavorite',
        '$cookies',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    menuFavorite,
                    ajax,
                    dataFactory,
                    isFavorite,
                    $cookies) {

            $scope.treeMenuModel = menuFavorite.getMenu();
            $scope.selectedProduct = angular.isDefined($stateParams.product) ? $stateParams.product : 'services';
            $scope.selectedProductType = angular.isDefined($stateParams.type) ? $stateParams.type : null;
            if($scope.selectedProduct == 'services' && !$scope.selectedProductType){
                $scope.selectedProductType = "analytical";
            }
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.isSearch = ($location.$$path.indexOf('search') != -1 ? true : false);
            $scope.allFavorites = { arr: [], count: 0};
            $scope.currentStorefrontPage = 1;
            $scope.pageSize = 10;
            $scope.downloadData = false;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var requestData = function(){
                var types = [];
                switch($scope.selectedProduct){
                    case 'services':
                        types = ['service'];
                        break;
                    case 'components':
                        types = ['component'];
                        break;
                    default:
                        types = ["service", "component"];
                        break;
                }
                var data = {
                    _expand: types
                };
                if($scope.selectedProduct == "services" && $scope.selectedProductType) data._type = $scope.selectedProductType;
                if($scope.searchModel) data._title = $scope.searchModel;
                if(angular.isDefined($stateParams.authors)) data._authors = $stateParams.authors;
                if(angular.isDefined($stateParams.ratings)) data._ratings = $stateParams.ratings;
                if(angular.isDefined($stateParams.favorites)) data._favorites = $stateParams.favorites;
                if(angular.isDefined($stateParams.dates)) data._dates = $stateParams.dates;
                return data;
            };

            $scope.getFavorites = function(){
                ajax.get(dataFactory.getFavoriteService(1), requestData(),
                    function(response){
                        var data = [];
                        for (var i in response.data){
                            if(response.data[i].service){
                                data.push(response.data[i].service);
                            }else if(response.data[i].component){
                                data.push(response.data[i].component);
                            }
                        }
                        $scope.allFavorites = {
                            arr : data,
                            count : data.length
                        };
                        isFavorite.check($scope.allFavorites.arr);
                        apply();
                    }
                );
            };
            $scope.getFavorites();

            // get data from cookies
            var updateCompareCount = function () {
                var arr = $cookies.getObject('compareProducts');
                return arr == null ? {services: [], components: []} : arr;
            };
            $scope.compareProducts = updateCompareCount();

            // catch updated changedCompare variable form $cookies
            $scope.$watch(function () {
                return $cookies.changedCompare;
            }, function (newValue) {
                $scope.compareProducts = updateCompareCount();
                apply();
            });

            $scope.productTypes = [
                //{
                //    id: 1,
                //    name: "all",
                //    title: "All"
                //},
                {
                    id: 2,
                    name: "services",
                    title: "Services"
                }
                //, {
                //    id: 3,
                //    name: "components",
                //    title: "Components"
                //}
            ];

            // Function for product types drop down (all, services, components)
            $scope.productTypeChanged = function (product) {
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.product = product;
                $state.go('allFavoritesSearch', dataSearch, {reload: true});
            };

            $scope.submit = function(text){
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.text = text;
                $state.go('allFavoritesSearch', dataSearch, {reload: true});
            };

            $scope.updatePageSize = function (val) {
                $scope.pageSize = val;
            };
        }
    ]
)
    .service('menuFavorite', ['$location','$stateParams','$state',function ($location,$stateParams,$state) {
        this.getMenu = function(){
            var dataSearch = $.extend(true,{},$stateParams);
            var searchPage = ($location.$$path.indexOf("/home") != -1 ? "home" : "search");

            var getUrl = function(product,type){
                if(product) dataSearch.product = product;
                if(type){
                    dataSearch.type = type;
                }else{
                    delete dataSearch.type;
                }
                return 'favorites.php'+$state.href('allFavoritesSearch',dataSearch);
            };

            var isOpened = function(product,type){
                if ($stateParams.product === product) {
                    return (!type || $stateParams.type === type ? true : false);
                }else{
                    return false;
                }
            };

            return {
                title: 'BROWSE BY',
                data: [
                    //{
                    //    'id': 1,
                    //    'title': 'All',
                    //    'tag' : 'all',
                    //    'items': 45,
                    //    'opened' : isOpened('all'),
                    //    'href' : getUrl('all'),
                    //    'categories': []
                    //},
                    //{
                    //    'id': 2,
                    //    'title': 'Components',
                    //    'tag' : 'components',
                    //    'items': 13,
                    //    'opened' : isOpened('components'),
                    //    'href' : getUrl('components'),
                    //    'categories': []
                    //},
                    {
                        'id': 3,
                        'title': 'Services',
                        'tag' : 'services',
                        'items': 32,
                        'opened' : isOpened('services'),
                        'href' : getUrl('services'),
                        'categories': [
                            {
                                'id': 31,
                                'title': 'Analytical Services',
                                'tag' : 'analytical',
                                'items': 15,
                                'opened' : isOpened('services','analytical'),
                                'href' : getUrl('services','analytical'),
                                'categories': []
                            },
                            {
                                'id': 32,
                                'title': 'Solid Services',
                                'tag' : 'solid',
                                'items': 15,
                                'opened' : isOpened('services','solid'),
                                'href' : getUrl('services','solid'),
                                'categories': []
                            },
                            {
                                'id': 33,
                                'title': 'Data Services',
                                'tag' : 'data',
                                'items': 2,
                                'opened' : isOpened('services','data'),
                                'href' : getUrl('services','data'),
                                'categories': []
                            }
                        ]
                    }
                ]
            };
        };
    }]
);