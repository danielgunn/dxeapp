angular.module('dxe', ['ionic', 'ngOpenFB', 'dxe.controllers', 'dxe.services', 'ngStorage'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, ngFB) {

        ngFB.init({appId: '630915116944951'});

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        //TODO: why this not working? not tripping on chapter-index
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbAccessToken']) {
                $state.go('app.login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('app.login');
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

