angular.module('dxe.controllers', [])

    .controller('AppCtrl', function ($scope, $state, OpenFB, $localStorage) {

        $scope.$storage = $localStorage;

        $scope.logout = function () {
            delete $localStorage.chapter;
            OpenFB.logout();
            $state.go('app.login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('app.login');
                },
                function () {
                    alert('Revoke permissions failed');
                });
        };
        

        $scope.setChapter = function(cid) {
            $localStorage.chapter = cid;
            $state.go('app.chapter-feed', {chapterId: cid});
        };

    })

    .controller('LoginCtrl', function ($scope, $location, OpenFB, $localStorage) {

        $scope.facebookLogin = function () {

            //OpenFB.login('email,read_stream,publish_actions').then(
            OpenFB.login('read_stream').then(
                function () {
                    if ($localStorage.chapter == null) {
                        $location.path('/app/chapters');
                    } else {
                        $location.path('/app/feed/' + $localStorage.chapter);
                    }
                },
                function () {
                    alert('OpenFB login failed');
                });
        };

    })

        /*
    .controller('ShareCtrl', function ($scope, OpenFB) {

        $scope.item = {};

        $scope.share = function () {
            OpenFB.post('/me/feed', $scope.item)
                .success(function () {
                    $scope.status = "This item has been shared on OpenFB";
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };

    })
    */

    .controller('ProfileCtrl', function ($scope, OpenFB) {
        OpenFB.get('/me').success(function (user) {
            $scope.user = user;
        });
    })

    .controller('PersonCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId).success(function (user) {
            $scope.user = user;
        });
    })

/*
    .controller('FriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/friends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })
    */

    .controller('ChaptersIndexCtrl', function ($scope, ChapterService) {
        $scope.chapters = ChapterService.all();
    })

    // A simple controller that shows a tapped item's data
    .controller('ChapterDetailCtrl', function($scope, $stateParams, ChapterService) {
        // "Chapters" is a service returning mock data (services.js)
        $scope.chapter = ChapterService.get($stateParams.chapterId);
    })



/*
    .controller('MutualFriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/mutualfriends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })
    */

    .controller('ChapterActionsCtrl', function ($scope, $stateParams, OpenFB, ChapterService, $ionicLoading) {

        if ($stateParams.chapterId == null) {
            console.error("chapterId is null");
        }

        $scope.chapter = ChapterService.get($stateParams.chapterId);

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading actions...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();
            var fburl = '/' + $scope.chapter.fbid + '/events';
            OpenFB.get(fburl, {limit: 30})
                .success(function (result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    console.error("fburl: " + fburl);
                    console.error(data.error.message);
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    })

    .controller('ChapterFeedCtrl', function ($scope, $stateParams, OpenFB, ChapterService, $ionicLoading) {

        if ($stateParams.chapterId == null) {
            console.error("chapterId is null");
        }

        $scope.chapter = ChapterService.get($stateParams.chapterId);

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();
            var fburl = '/' + $scope.chapter.fbid + '/feed';
            OpenFB.get(fburl, {limit: 30})
                .success(function (result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    console.error("fburl: " + fburl);
                    console.error(data.error.message);
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });

/*
    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading) {

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();
            //TODO: broke this for DXE
            //OpenFB.get('/' + $stateParams.personId + '/home', {limit: 30})
            OpenFB.get('/' + $stateParams.personId + '/home', {limit: 30})
                .success(function (result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });
    */
