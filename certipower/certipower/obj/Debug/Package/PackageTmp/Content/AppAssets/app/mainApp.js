//angular.module('MyApp', ['ngRoute']) //extending from previously created angularjs module in part1
//// here ['ngRoute'] is not required, I have just added to make you understand in a single place
//.config(function ($routeProvider, $locationProvider) {
//    //here we will write code for implement routing 
//    $routeProvider
//        .when('/', {
//            // This is for reditect to another route
//            redirectTo: function () {
//                return '/home';
//            }
//        })
//        .when('/home', {
//            templateUrl: '/AppTemplates/Login.html',
//            controller: 'HomeController'
//        })
//        .when('/about', {
//            templateUrl: '/AppTemplates/ProfileDetail.html',
//            controller: 'AboutController'
//        });

//    $locationProvider.html5Mode(false).hashPrefix('!'); // This is for Hashbang Mode
//})
//.controller('HomeController', function ($scope) {
//    $scope.Message = "This is HOME page";
//})
//.controller('AboutController', function ($scope) {
//    $scope.Message = "This is ABOUT page";
//})

var app = angular.module('App', ['ngAnimate', 'chieffancypants.loadingBar'])
.controller("LoginCTRL", function ($scope, $http, MainService) {
    // =============================== Get Check Login
    $scope.checkLogin = function () {

        var urls = [{ url: baseUrl + "/api/AppApi/Login/" + $scope.Email + "/" + $scope.Password }];

        MainService.GetData(urls).then(function (data) {
            debugger;
            if (data[0].data === true) {
                window.location.href = "/App/Profile";
            }
        });
    }
    // ===============================
});