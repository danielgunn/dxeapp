angular.module('sociogram', ['ionic', 'openfb', 'sociogram.controllers', 'sociogram.services'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

        //OpenFB.init('YOUR_FB_APP_ID');
        OpenFB.init('630915116944951');

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
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

            .state('app.chapter-detail', {
                url: '/feed/:chapterId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chapter-feed.html',
                        controller: 'ChapterFeedCtrl'
                    }
                }
            })

            /*
            .state('app.chapter-actions', {
                url: '/actions/:chapterId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chapter-actions.html',
                        controller: 'ChapterActionsCtrl'
                    }
                }
            })
            */

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
            })

            .state('app.share', {
                url: "/share",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share.html",
                        controller: "ShareCtrl"
                    }
                }
            })

            .state('app.friends', {
                url: "/person/:personId/friends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/friend-list.html",
                        controller: "FriendsCtrl"
                    }
                }
            })
            .state('app.mutualfriends', {
                url: "/person/:personId/mutualfriends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/mutual-friend-list.html",
                        controller: "MutualFriendsCtrl"
                    }
                }
            })
            .state('app.person', {
                url: "/person/:personId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/person.html",
                        controller: "PersonCtrl"
                    }
                }
            })
            .state('app.feed', {
                url: "/person/:personId/feed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/feed.html",
                        controller: "FeedCtrl"
                    }
                }
            });

        // fallback route
        $urlRouterProvider.otherwise('/app/feed/0');

    });

