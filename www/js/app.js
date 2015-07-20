angular.module('dxe', ['ionic', 'dxe.controllers', 'dxe.services', 'ngStorage'])

    .run(function ($rootScope, $state, $ionicPlatform) {

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        // UI Router Authentication Check
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            if (toState.name !== "app.login" && toState.name !== "app.logout" && !Parse.User.current()) {
                // User isn’t authenticated
                $state.transitionTo("app.login");
                event.preventDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {


        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl"
            })

            .state('app.chapter-index', {
                url: "/chapters",
                views: {
                    'menuContent': {
                        templateUrl: "templates/chapter-index.html",
                        controller: "ChaptersIndexCtrl"
                    }
                }
            })

            .state('app.news', {
                url: '/news/:chapterId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/news.html',
                        controller: 'NewsCtrl'
                    }
                }
            })

            .state('app.actions', {
                url: '/actions/:chapterId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/actions.html',
                        controller: 'ActionsCtrl'
                    }
                }
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            });


        // fallback route
        //$urlRouterProvider.otherwise('/app/chapter-index');
        $urlRouterProvider.otherwise('/app/login');

    });

